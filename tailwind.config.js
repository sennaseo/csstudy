/** @type {import('tailwindcss').Config} */
export default {
  // Tailwind v3 — class 기반 다크모드. 우리는 항상 dark 클래스를 html 에 붙여 다크 기본 UI 로 운영한다.
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        // 개발자 메모 툴 느낌 — 모노/시스템 폰트 우선
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
      colors: {
        // 단일 톤의 어두운 팔레트 — 자극 최소화
        ink: {
          950: "#0a0a0b",
          900: "#101113",
          800: "#17181b",
          700: "#1f2126",
          600: "#2a2d34",
          500: "#3a3e47",
          400: "#6b6f78",
          300: "#a0a4ad",
          200: "#d4d6db",
          100: "#eceef2",
        },
        accent: {
          // 강조용 — 너무 튀지 않는 청록
          DEFAULT: "#5eead4",
          dim: "#2dd4bf",
        },
      },
    },
  },
  plugins: [],
};
