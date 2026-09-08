// =============================================================
// 뒤로가기 히스토리 "장부" — 순수 로직 (window·React 를 모른다 → 테스트 가능).
//
// 규칙 3가지:
//
// 1) 같은 턴에 go() 와 pushState() 를 절대 같이 부르지 않는다.
//    pushState 는 동기, go 는 비동기라 한 턴에 섞이면 브라우저가 순서를 보장하지 않는다.
//    그래서 UI 로 닫을 땐 빚(debt)만 늘려 두고, 마이크로태스크 하나에서 몰아서 go(-debt).
//    그 사이에 새로 열리면 빚을 갚고(debt--) 방금 닫힌 항목의 히스토리를 물려받는다(pushState 안 함).
//    → StrictMode 의 mount→unmount→mount 는 히스토리 변화가 0이 된다.
//
// 2) popstate 는 state.back(깊이) 과 stack.length 를 비교해서 닫는다.
//    우리가 go() 해서 도착한 항목은 깊이 == stack.length 라 아무것도 안 닫힌다.
//    → "다음 popstate 를 무시" 하는 전역 플래그가 필요 없다(카운터·고착 문제도 같이 사라짐).
//
// 3) 방어선: settle 시점에 현재 항목 깊이가 0(= 우리가 넣은 항목이 아님)이면 절대 go() 하지 않는다.
//    장부가 어긋나도 "앱 밖으로 튕김"만은 불가능하게 한다.
//
// setTimeout 이 아니라 queueMicrotask 를 쓰는 이유:
// setTimeout 은 사이에 사용자 입력 태스크가 끼어들 수 있다
// (✕ 를 누른 직후 안드로이드 뒤로가기 → back 이 2번 → 앱 종료).
// 마이크로태스크는 현재 태스크가 끝나기 전에 실행되므로 그 틈이 원천적으로 없다.
// =============================================================

export type HistoryLike = {
  readonly state: unknown;
  pushState(state: unknown, unused: string): void;
  go(delta: number): void;
};

/** 히스토리 항목의 깊이. 우리가 넣은 항목이 아니면(앱 첫 화면 등) 0. */
export function depthOf(state: unknown): number {
  const back = (state as { back?: unknown } | null)?.back;
  return typeof back === "number" ? back : 0;
}

export function createBackStack(
  history: HistoryLike,
  defer: (fn: () => void) => void = queueMicrotask,
) {
  // 열린 순서대로 쌓인 닫기 콜백.
  const stack: Array<() => void> = [];
  // UI 로 닫혔지만 아직 히스토리를 되감지 않은 항목 수.
  let debt = 0;
  // settle 이 이미 예약돼 있는지 — 한 턴에 한 번만 예약한다.
  let settling = false;

  function settle() {
    settling = false;
    // 방어선: 현재 항목이 우리 것이 아니면(깊이 0) 되감을 게 없다.
    const n = Math.min(debt, depthOf(history.state));
    debt = 0;
    if (n > 0) history.go(-n);
  }

  return {
    /** 화면/모달이 열렸다 — 히스토리 한 장을 쌓는다(빚이 있으면 그걸 물려받는다). */
    push(onBack: () => void) {
      stack.push(onBack);
      if (debt > 0) debt--;
      else history.pushState({ back: stack.length }, "");
    },
    /** UI(✕·백드롭·Escape)로 닫혔다 — 되감기는 마이크로태스크로 미룬다. */
    remove(onBack: () => void) {
      const i = stack.indexOf(onBack);
      if (i < 0) return; // 뒤로가기로 이미 빠져나간 경우 — 히스토리도 이미 정리됨
      stack.splice(i, 1);
      debt++;
      if (!settling) {
        settling = true;
        defer(settle);
      }
    },
    /** 브라우저/안드로이드 뒤로가기 — 도착한 항목의 깊이까지 위에서부터 닫는다. */
    onPop(state: unknown) {
      const depth = depthOf(state);
      while (stack.length > depth) stack.pop()!();
    },
    get size() {
      return stack.length;
    },
  };
}
