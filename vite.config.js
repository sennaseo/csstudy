import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// Vite 설정 — 로컬 개발 + 빠른 HMR 만 필요하므로 최소 설정.
export default defineConfig({
    // GitHub Pages 가 https://sennaseo.github.io/csstudy/ 하위 경로로 서빙하므로
    // 빌드 결과물의 모든 링크 앞에 이 base 를 붙인다. (개발 서버는 영향 없음 — vite 가 알아서 / 로)
    base: "/csstudy/",
    plugins: [react()],
    server: {
        port: 5173,
        open: true,
    },
});
