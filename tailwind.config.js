/** @type {import('tailwindcss').Config} */

// 본문·보기·버튼·숫자에 쓰는 시스템 산세리프 스택.
// 새 웹폰트를 받지 않으니 용량 0, 오프라인에서도 항상 같다.
const SYSTEM_SANS = [
  "system-ui",
  "-apple-system",
  "Segoe UI",
  "Roboto",
  "Noto Sans KR",
  "Apple SD Gothic Neo",
  "Malgun Gothic",
  "Helvetica Neue",
  "Arial",
  "sans-serif",
];

export default {
  // 다크모드는 아직 없다 — 설정만 남겨둔다 (나중에 복귀 대비).
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        // ─── 개발자용 학습 앱: 시스템 폰트·흰 카드·한 가지 파랑 ───
        // 읽는 글자(본문·보기·해설)는 전부 시스템 산세리프.
        // 손글씨(Gaegu Bold 1종)는 브랜드 로고와 보상 순간 제목에만 쓴다.
        sans: SYSTEM_SANS,
        // font-round — 숫자용. 컴포넌트에 남은 font-round 를 안 지워도 되게 이름만 남겼다.
        round: SYSTEM_SANS,
        // font-display — 브랜드·보상 제목 전용.
        display: ["Gaegu", "system-ui", "sans-serif"],
        // font-hand — 하위호환용 (지금은 쓰는 곳 없음).
        hand: ["Gaegu", "system-ui", "sans-serif"],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Consolas",
          "monospace",
        ],
      },
      colors: {
        // 토큰 "이름"(ink-900, accent, duo-green ...)은 그대로라서
        // 컴포넌트는 안 고쳐도 앱 전체가 새 색으로 갈아입는다.
        // 규칙: 글자색은 ink-900/700/500/400, accent/accent-dim, *-ink 만.
        //       bee, fox, ink-300 은 글자 금지. 흰 글자는 bg-duo-green / bg-accent /
        //       bg-accent-dim / bg-ink-900 위에서만.
        ink: {
          900: "#111827", // 제목
          700: "#1F2937", // 본문
          500: "#4B5563", // 보조 텍스트
          400: "#6B7280", // 캡션 (12px 캡션의 대비 하한)
          300: "#D1D5DB", // 비활성 테두리/아이콘 (장식 전용)
          200: "#E5E7EB", // 구분선·카드 테두리
          100: "#F3F4F6", // 칩/섹션 배경
        },
        paper: {
          DEFAULT: "#F7F8FA", // body 배경
          card: "#FFFFFF", // 카드
        },
        accent: {
          DEFAULT: "#2563EB", // 선택·링크·보조 CTA
          dim: "#1D4ED8",
          soft: "#EFF4FF",
        },
        duo: {
          green: "#15803D", // 정답·Primary CTA
          "green-dim": "#166534",
          "green-soft": "#DCFCE7",
          "green-tint": "#F0FAF3", // 퀘스트 카드 배경 — 연두 아주 옅게 (green-soft 는 정답 보기용이라 큰 면엔 과함)
          "green-ink": "#166534",
          red: "#DC2626", // 오답 표면(배경·테두리·✕). CTA 배경으로는 쓰지 않는다
          "red-dim": "#B91C1C",
          "red-soft": "#FEE2E2",
          "red-ink": "#991B1B",
          bee: "#F59E0B", // XP·완료 노드 (글자는 bee-ink 만)
          "bee-dim": "#D97706",
          "bee-ink": "#92400E",
          fox: "#F97316", // 스트릭 (글자는 fox-ink 만)
          "fox-ink": "#C2410C",
          beetle: "#7C3AED", // 레어
        },
      },
      boxShadow: {
        card: "0 0 0 1px rgba(17,24,39,0.06), 0 1px 2px rgba(17,24,39,0.06)", // 카드
        chip: "0 1px 2px rgba(17,24,39,0.06)",
        sheet: "0 -8px 24px rgba(17,24,39,0.10)", // 하단 피드백 시트
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
          "50%": { transform: "translateY(-4px)" },
        },
        // 완료 화면 트로피가 "통!" 하고 튀어나오는 효과.
        "bounce-in": {
          "0%": { opacity: "0", transform: "scale(0.5)" },
          "60%": { opacity: "1", transform: "scale(1.1)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        // 완료 화면 스탯 카드들이 아래에서 하나씩 올라오는 효과
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        // 정답 보기가 살짝 커졌다 돌아오는 효과
        check: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.06)" },
        },
      },
      animation: {
        pop: "pop 0.25s ease-out",
        beat: "beat 0.8s ease-in-out 2",
        bob: "bob 1.4s ease-in-out infinite",
        "bounce-in": "bounce-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "slide-up": "slide-up 0.35s ease-out both",
        check: "check 0.3s ease-out",
      },
    },
  },
  plugins: [],
};
