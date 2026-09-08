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
//
// 히스토리를 언제 쌓고 언제 되감는지(장부 규칙)는 backStack.ts 참고.
// =============================================================
import { useEffect, useRef } from "react";
import { App as CapApp } from "@capacitor/app";
import { createBackStack } from "./backStack";

const back = createBackStack(window.history);
window.addEventListener("popstate", (e) => back.onPop(e.state));

// ─── 안드로이드 제스처 뒤로가기 ────────────────────────────
// targetSdk 36(안드로이드 16)부터 "예측형 뒤로가기"가 기본으로 켜진다.
// 그러면 OS 가 onBackPressed 를 아예 안 부르고 곧장 시스템 기본 동작
// (= 런처로 나가기)을 실행한다 → 화면이 열려 있어도 앱이 그냥 꺼진다.
//
// @capacitor/app 플러그인이 AndroidX OnBackPressedCallback 을 등록해주는데,
// 이건 예측형 뒤로가기에서도 호출이 보장된다. 다만 리스너를 안 달면
// 플러그인 기본 동작이 "canGoBack 이면 goBack, 아니면 아무것도 안 함"이라
// 홈 화면에서 앱이 안 꺼지고 먹통이 된다. 그래서 직접 처리한다.
//
// 웹(브라우저/PWA)에서는 이 플러그인 이벤트가 안 오고, 브라우저가 알아서
// 뒤로가기를 처리하므로 아래 코드는 앱에서만 동작한다.
void CapApp.addListener("backButton", ({ canGoBack }) => {
  if (canGoBack) {
    // 히스토리가 남아 있다 = 우리가 쌓아둔 화면/모달이 있다 → popstate 로 이어진다.
    window.history.back();
  } else {
    // 홈 화면 — 더 갈 곳이 없으면 안드로이드 기본대로 앱을 종료한다.
    void CapApp.exitApp();
  }
});

export function useBack(onBack: () => void, active = true) {
  const cb = useRef(onBack);
  cb.current = onBack;

  useEffect(() => {
    if (!active) return;
    const entry = () => cb.current();
    back.push(entry);
    return () => back.remove(entry);
  }, [active]);
}
