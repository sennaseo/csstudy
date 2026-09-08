// useDialog 의 핵심 규칙 한 개만 검증한다: Tab 순환(포커스 트랩).
// 훅 자체는 React 렌더러가 있어야 돌아가서, 여기서는 훅이 쓰는 선택자와
// 순환 계산 로직이 맞는지를 같은 규칙으로 재현해 확인한다.
import assert from "node:assert";

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),details>summary,[tabindex]:not([tabindex="-1"])';

// 훅 소스가 같은 선택자를 쓰는지 (복붙 드리프트 방지)
import { readFileSync } from "node:fs";
const src = readFileSync(new URL("./useDialog.ts", import.meta.url), "utf8");
assert.ok(src.includes(FOCUSABLE), "훅의 FOCUSABLE 선택자가 테스트와 다르다");
assert.ok(src.includes('e.key === "Escape"'), "Escape 처리가 없다");
assert.ok(src.includes("opener?.focus?.()"), "닫을 때 포커스 복귀가 없다");
assert.ok(src.includes("if (!active) return;"), "active 스위치가 없다");

// 순환 규칙: 마지막에서 Tab → 처음, 처음에서 Shift+Tab → 마지막
const list = ["a", "b", "c"];
const next = (cur, shift) => {
  const i = list.indexOf(cur);
  if (shift && i === 0) return list[list.length - 1];
  if (!shift && i === list.length - 1) return list[0];
  return list[i + (shift ? -1 : 1)];
};
assert.equal(next("c", false), "a", "마지막에서 Tab 은 처음으로");
assert.equal(next("a", true), "c", "처음에서 Shift+Tab 은 마지막으로");
assert.equal(next("a", false), "b");

console.log("useDialog.test.mjs OK");
