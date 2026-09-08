// =============================================================
// backStack 자체 점검 (assert 만 쓰는 최소 테스트 — 프레임워크 없음)
//
// 실행: npx tsx src/utils/backStack.test.ts
//
// 핵심 검출기: 가짜 히스토리의 인덱스가 0 미만으로 가면 = 앱 밖으로 튕긴 것 → 즉시 fail.
// =============================================================

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createBackStack, depthOf, type HistoryLike } from "./backStack";

/** 브라우저 히스토리 흉내. pushState 는 즉시, go 는 delta 만 모았다가 flush 에서 이동+popstate. */
function setup() {
  const entries: unknown[] = [null]; // 앱 첫 항목 — 뒤에 페이지가 없는 새 탭 상황
  let index = 0;
  let pending = 0;
  let pushes = 0;
  let gos = 0;
  const micro: Array<() => void> = [];

  const history: HistoryLike = {
    get state() {
      return entries[index];
    },
    pushState(state) {
      pushes++;
      entries.length = index + 1;
      entries.push(state);
      index++;
    },
    go(delta) {
      gos++;
      pending += delta;
    },
  };

  const back = createBackStack(history, (fn) => micro.push(fn));

  return {
    back,
    history,
    get index() {
      return index;
    },
    get state() {
      return entries[index];
    },
    get pushes() {
      return pushes;
    },
    get gos() {
      return gos;
    },
    get pendingGo() {
      return pending;
    },
    /** 예약된 마이크로태스크를 전부 실행한다. */
    runMicro() {
      while (micro.length) micro.shift()!();
    },
    /** 브라우저가 실제로 이동하고 popstate 를 쏘는 시점. */
    flush() {
      if (!pending) return;
      const target = index + pending;
      pending = 0;
      if (target < 0) assert.fail("앱 밖으로 나감");
      index = target;
      back.onPop(entries[index]);
    },
    /** 사용자가 브라우저 뒤로가기를 누른 경우. */
    pressBack() {
      const target = index - 1;
      if (target < 0) assert.fail("앱 밖으로 나감");
      index = target;
      back.onPop(entries[index]);
    },
  };
}

// 1) 열고 뒤로가기 → 콜백 1회, 스택 비고, 첫 항목으로 복귀
{
  const t = setup();
  let calls = 0;
  t.back.push(() => calls++);
  t.pressBack();
  assert.equal(calls, 1);
  assert.equal(t.back.size, 0);
  assert.equal(t.index, 0);
}

// 2) 열고 UI(✕)로 닫기 → 닫기 콜백은 안 불리고(이미 UI 가 닫음) 히스토리만 정리
{
  const t = setup();
  let calls = 0;
  const entry = () => calls++;
  t.back.push(entry);
  t.back.remove(entry);
  t.runMicro();
  t.flush();
  assert.equal(calls, 0);
  assert.equal(t.index, 0);
  assert.equal(t.state, null);
}

// 3) StrictMode 재현 (핵심): mount → cleanup → mount 가 한 턴에 일어난다.
{
  const t = setup();
  const a = () => {};
  t.back.push(a);
  t.back.remove(a);
  t.back.push(a);
  t.runMicro();
  t.flush();
  assert.equal(t.pushes, 1, "StrictMode 왕복은 pushState 1회여야 한다");
  assert.equal(t.gos, 0, "StrictMode 왕복은 go 를 부르면 안 된다");
  assert.equal(depthOf(t.state), 1);
  assert.equal(t.back.size, 1);

  // 이어서 진짜로 닫아도 앱 밖으로 나가지 않는다
  t.back.remove(a);
  t.runMicro();
  t.flush();
  assert.equal(t.index, 0);
}

// 4) 두 개 열고 뒤로가기 두 번 → 나중에 연 것부터 닫힌다
{
  const t = setup();
  const order: string[] = [];
  t.back.push(() => order.push("a"));
  t.back.push(() => order.push("b"));
  t.pressBack();
  t.pressBack();
  assert.deepEqual(order, ["b", "a"]);
  assert.equal(t.index, 0);
}

// 5) 두 개를 같은 턴에 UI 로 닫기 → go(-2) 한 번, 콜백 0회
{
  const t = setup();
  let calls = 0;
  const a = () => calls++;
  const b = () => calls++;
  t.back.push(a);
  t.back.push(b);
  t.back.remove(b);
  t.back.remove(a);
  t.runMicro();
  assert.equal(t.pendingGo, -2);
  t.flush();
  assert.equal(calls, 0);
  assert.equal(t.index, 0);
}

// 6) 뒤로가기로 이미 닫힌 뒤 React cleanup 이 remove 를 부름 → go 를 부르면 안 된다
{
  const t = setup();
  const a = () => {};
  t.back.push(a);
  t.pressBack();
  const before = t.gos;
  t.back.remove(a);
  t.runMicro();
  assert.equal(t.gos, before, "이미 빠져나간 항목은 되감지 않는다");
  assert.equal(t.index, 0);
}

// 7) 방어선: 히스토리 state 가 외부에서 오염돼 우리 항목이 아니게 됨 → go 금지
{
  const t = setup();
  const a = () => {};
  t.back.push(a);
  // App.tsx 가 replaceState(null) 하던 옛날 동작 흉내
  Object.defineProperty(t.history, "state", { get: () => null, configurable: true });
  t.back.remove(a);
  t.runMicro();
  assert.equal(t.gos, 0, "우리 항목이 아니면 절대 go 하지 않는다");
}

// 8) 깊이 점프: 뒤로가기 한 번에 두 칸 (go(-2)) → 위에서부터 순서대로 닫힌다
{
  const t = setup();
  const order: string[] = [];
  t.back.push(() => order.push("a"));
  t.back.push(() => order.push("b"));
  t.history.go(-2);
  t.flush();
  assert.deepEqual(order, ["b", "a"]);
  assert.equal(t.back.size, 0);
}

// 9) depthOf — 우리 항목이 아니면 0
assert.equal(depthOf(null), 0);
assert.equal(depthOf(undefined), 0);
assert.equal(depthOf({}), 0);
assert.equal(depthOf({ back: "x" }), 0);
assert.equal(depthOf({ back: 2 }), 2);

// 10) 안드로이드 가드 — 예측형 뒤로가기 대응 코드가 실수로 지워지는 걸 막는다.
{
  const src = readFileSync(new URL("./useBack.ts", import.meta.url), "utf-8");
  for (const needle of [
    'CapApp.addListener("backButton"',
    "canGoBack",
    "CapApp.exitApp()",
    "window.history.back()",
  ]) {
    assert.ok(src.includes(needle), `useBack.ts 에서 안드로이드 뒤로가기 코드가 사라졌다: ${needle}`);
  }
}

console.log("✅ backStack 자체 점검 통과");
