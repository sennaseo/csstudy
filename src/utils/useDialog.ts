// =============================================================
// useDialog — 모달(대화상자) 하나에 필요한 키보드/포커스 예절을 한 곳에 모은 훅.
//
// 모달은 "종이 위에 다른 종이를 한 장 덮은 것"이다. 덮은 동안은 아래 종이를
// 못 만져야 하는데, 화면상으론 가려져도 키보드(Tab)는 그냥 통과해버린다.
// 그래서 세 가지를 직접 챙긴다:
//   1) Escape 로 닫기 (마우스 없이도 나갈 수 있게)
//   2) 열릴 때 모달 안으로 포커스를 데려오고, 닫힐 때 원래 있던 곳으로 돌려주기
//   3) Tab / Shift+Tab 이 모달 안에서만 뱅뱅 돌게 (= focus trap)
//
// 안드로이드 뒤로가기는 useBack 이 따로 담당한다 — 역할이 겹치지 않는다.
//
// 쓰는 법:
//   const ref = useDialog(onClose);
//   <div ref={ref} role="dialog" aria-modal="true" aria-labelledby="...">
//
// active: 컴포넌트가 항상 마운트된 채 "열림 상태"만 토글되는 경우(RewardOverlay,
//         SyncSettings)를 위한 스위치. 닫혀 있을 땐 아무것도 하지 않는다.
// =============================================================
import { useEffect, useRef } from "react";

/** 키보드로 갈 수 있는 요소들. disabled 와 tabindex="-1" 은 제외. */
const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),details>summary,[tabindex]:not([tabindex="-1"])';

export function useDialog<T extends HTMLElement = HTMLDivElement>(
  onClose: () => void,
  active = true,
) {
  const ref = useRef<T>(null);
  // onClose 는 렌더마다 새 함수일 수 있다 → ref 로 최신값만 들고 effect 는 1회만 돌린다.
  const close = useRef(onClose);
  close.current = onClose;

  useEffect(() => {
    if (!active) return;
    const opener = document.activeElement as HTMLElement | null;
    const items = () =>
      Array.from(ref.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []);

    // 열자마자 첫 요소로 — 없으면 모달 자체(tabIndex -1)로 포커스를 준다.
    (items()[0] ?? ref.current)?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return close.current();
      if (e.key !== "Tab") return;
      const list = items();
      if (!list.length) return e.preventDefault();
      const first = list[0];
      const last = list[list.length - 1];
      // 끝에서 Tab → 처음으로, 처음에서 Shift+Tab → 끝으로 (밖으로 못 나가게)
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      opener?.focus?.(); // 닫으면 열었던 버튼으로 되돌려준다
    };
  }, [active]);

  return ref;
}
