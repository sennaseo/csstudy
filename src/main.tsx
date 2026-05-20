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
