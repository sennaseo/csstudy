import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite 설정 — 로컬 개발 + 빠른 HMR 만 필요하므로 최소 설정.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
});
