// 앱 진입점 — React 18 createRoot.
// StrictMode 는 개발 중 잠재 버그 노출용. 프로덕션 동작에 영향 없음.

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// ─── Service Worker 등록 (PWA 오프라인 지원) ─────────────────
// 프로덕션 빌드에서만 등록한다 — 개발 중에 켜두면 캐시 때문에
// 코드를 고쳐도 옛 화면이 보이는 "유령 버그"에 시달리게 된다.
if (import.meta.env.PROD && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    // BASE_URL: 로컬은 "/", GitHub Pages 는 "/csstudy/" — 어디 배포돼도 경로가 맞게.
    navigator.serviceWorker.register(import.meta.env.BASE_URL + "sw.js").catch(() => {
      // 등록 실패해도 앱은 정상 동작 (오프라인만 안 될 뿐)
    });
  });
}
