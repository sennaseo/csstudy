/** @type {import('tailwindcss').Config} */
export default {
  // 라이트 테마로 전환 — dark 클래스는 더 이상 쓰지 않지만 설정은 남겨둔다 (나중에 다크모드 복귀 대비).
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Pretendard Variable",
          "Pretendard",
          "-apple-system",
          "BlinkMacSystemFont",
          "system-ui",
          "Segoe UI",
          "sans-serif",
        ],
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
        // 밝고 부드러운 파스텔 팔레트.
        // ink = 글자/선 용도의 보랏빛 그레이 (숫자가 클수록 진함 — 라이트 테마라 기존과 반대 방향).
        ink: {
          900: "#3f3d56", // 제목
          700: "#5a5772", // 본문
          500: "#8b88a3", // 보조 텍스트
          300: "#c9c6db", // 비활성/테두리
          200: "#e6e4f2", // 옅은 테두리
          100: "#f3f1fb", // 칩/버튼 배경
        },
        accent: {
          // 메인 포인트 컬러 — 부드러운 바이올렛
          DEFAULT: "#7c6ff0",
          dim: "#6457e8",
          soft: "#edeafd", // 아주 옅은 배경용
        },
        // 듀오링고식 정답/오답 팔레트.
        // green = 정답, red = 오답. dim 은 버튼 아래쪽 3D 테두리(그림자)용 진한 톤.
        duo: {
          green: "#58cc02",
          "green-dim": "#46a302", // 정답 버튼 밑단 테두리
          "green-soft": "#d7ffb8", // 정답 피드백 배경
          "green-ink": "#3a7a00", // 정답 피드백 글자
          red: "#ff4b4b",
          "red-dim": "#e63946",
          "red-soft": "#ffe0e0", // 오답 피드백 배경
          "red-ink": "#c81e2b", // 오답 피드백 글자
        },
      },
      boxShadow: {
        // 파스텔 톤에 어울리는 은은한 그림자 2종
        card: "0 2px 8px rgba(124, 111, 240, 0.08), 0 8px 24px rgba(63, 61, 86, 0.08)",
        chip: "0 1px 3px rgba(63, 61, 86, 0.10)",
      },
      keyframes: {
        // 새 문제 카드가 등장할 때 살짝 튀어오르는 효과
        pop: {
          "0%": { opacity: "0", transform: "translateY(10px) scale(0.98)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        // 스트릭 🔥 이 두근거리는 효과
        beat: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.25)" },
        },
        // 스킬 패스의 "지금 풀 차례" 노드/말풍선이 둥실둥실 뜨는 효과
        bob: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      animation: {
        pop: "pop 0.35s ease-out",
        beat: "beat 0.8s ease-in-out 2",
        bob: "bob 1.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
