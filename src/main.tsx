// 앱 진입점 — React 18 createRoot.
// StrictMode 는 개발 중 잠재 버그 노출용. 프로덕션 동작에 영향 없음.

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// ─── 에러 경계 ────────────────────────────────────────────────
// 렌더 도중 예외가 나면 React 는 화면 전체를 통째로 지운다 — 사용자에겐 흰 화면.
// 여기서 받아내고 "다시 시작" 안내를 대신 보여준다. 학습 기록은 localStorage 에
// 있으므로 새로고침해도 안 날아간다.
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="flex min-h-full flex-col items-center justify-center gap-4 p-8 text-center">
        <p className="font-display text-2xl text-ink-900">앗, 화면이 꼬였어요</p>
        <p className="text-ink-500">학습 기록은 그대로 남아 있어요. 다시 시작해 볼까요?</p>
        <button
          type="button"
          onClick={() => location.reload()}
          className="btn-3d rounded-xl bg-duo-green px-6 py-3 font-display text-lg text-white"
        >
          홈으로 돌아가기
        </button>
      </div>
    );
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);

// ─── Service Worker 등록 (PWA 오프라인 지원) ─────────────────
// 프로덕션 빌드에서만 등록한다 — 개발 중에 켜두면 캐시 때문에
// 코드를 고쳐도 옛 화면이 보이는 "유령 버그"에 시달리게 된다.
// 안드로이드 앱(Capacitor)에서는 등록하지 않는다 — 자산이 이미 폰 안에 통째로
// 들어있어 오프라인 캐시가 무의미하고, SW 캐시가 남으면 앱을 업데이트해도 옛 화면이
// 나오는 사고가 난다. VITE_NATIVE 는 npm run build:native 가 켜준다.
if (import.meta.env.PROD && !import.meta.env.VITE_NATIVE && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    // BASE_URL: 로컬은 "/", GitHub Pages 는 "/csstudy/" — 어디 배포돼도 경로가 맞게.
    navigator.serviceWorker.register(import.meta.env.BASE_URL + "sw.js").catch(() => {
      // 등록 실패해도 앱은 정상 동작 (오프라인만 안 될 뿐)
    });
  });
}

// ─── 개발용 디버그 훅 ─────────────────────────────────────────
// 콘솔에서 __cs.store.getState()... 로 앱을 원하는 상태로 밀어넣어
// 화면을 확인할 때 쓴다. import.meta.env.DEV 는 프로덕션 빌드에서 false 상수로
// 치환되므로 이 블록(과 위 import 들)은 번들에서 통째로 사라진다.
if (import.meta.env.DEV) {
  void (async () => {
    const [{ useStudyStore }, { buildExercise }, { QUESTIONS }] = await Promise.all([
      import("./store/useStudyStore"),
      import("./utils/exercise"),
      import("./data/questions"),
    ]);
    (window as any).__cs = { store: useStudyStore, buildExercise, QUESTIONS };
  })();
}
