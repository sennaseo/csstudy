// =============================================================
// 안드로이드 뒤로가기(= 브라우저 history.back)를 앱 안에서 처리하는 훅.
//
// 배경: 앱은 화면 전환을 URL 없이 상태로만 하기 때문에 웹뷰 입장에선
// 히스토리가 항상 1장이다 → 뒤로가기 = "더 갈 곳 없음" = 앱 종료.
// 그래서 화면/모달이 열릴 때 히스토리에 빈 항목을 한 장씩 쌓아 두고,
// 뒤로가기로 그 항목이 빠질 때(popstate) 해당 화면/모달의 닫기 콜백을 부른다.
//
// 쓰는 법: 열려 있는 동안 마운트되는 컴포넌트(모달)에서 useBack(onClose).
//          화면처럼 늘 마운트된 곳에선 useBack(goHome, view !== "path").
// =============================================================
import { useEffect, useRef } from "react";

// 열린 순서대로 쌓인 닫기 콜백. 뒤로가기는 항상 맨 위(가장 최근에 연 것)를 닫는다.
const stack: Array<() => void> = [];
// UI 버튼으로 닫아서 우리가 직접 history.back() 을 부른 경우 — 그 popstate 는 무시한다.
let ignoreNextPop = false;

window.addEventListener("popstate", () => {
  if (ignoreNextPop) {
    ignoreNextPop = false;
    return;
  }
  stack.pop()?.();
});

export function useBack(onBack: () => void, active = true) {
  const cb = useRef(onBack);
  cb.current = onBack;

  useEffect(() => {
    if (!active) return;
    const entry = () => cb.current();
    stack.push(entry);
    window.history.pushState({ back: stack.length }, "");
    return () => {
      const i = stack.indexOf(entry);
      if (i < 0) return; // 뒤로가기로 이미 빠져나간 경우 — 히스토리도 이미 정리됨
      // UI(✕ 버튼 등)로 닫힌 경우 — 남은 히스토리 항목을 치워 다음 뒤로가기가 두 번 필요하지 않게.
      stack.splice(i, 1);
      ignoreNextPop = true;
      window.history.back();
    };
  }, [active]);
}
