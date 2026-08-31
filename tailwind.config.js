/** @type {import('tailwindcss').Config} */
export default {
  // 라이트 테마로 전환 — dark 클래스는 더 이상 쓰지 않지만 설정은 남겨둔다 (나중에 다크모드 복귀 대비).
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        // ─── 손그림 테마: 모든 글자가 손글씨다 ───────────────────
        // 기본 본문(font-sans)까지 손글씨로 바꾼다. 스케치 UI 는
        // "종이에 사람이 직접 그린 화면"이 컨셉이라, 글자만 반듯한 산세리프면
        // 그림과 글씨가 따로 논다. Pretendard 는 손글씨 폰트에 없는 글자를
        // 받아주는 안전망(fallback)으로 뒤에만 남긴다.
        sans: [
          "Gamja Flower",
          "Gaegu",
          "Patrick Hand",
          "Pretendard Variable",
          "Pretendard",
          "system-ui",
          "sans-serif",
        ],
        // font-round — 숫자/영문 라벨용. Patrick Hand(라틴 손글씨)를 앞세우고
        // 한글은 뒤의 Gaegu 로 자동으로 넘어간다.
        round: [
          "Patrick Hand",
          "Gaegu",
          "Pretendard Variable",
          "system-ui",
          "sans-serif",
        ],
        // font-display — 큰 타이틀 "한 방" 자리. 굵게 쓸 수 있는 Gaegu.
        display: [
          "Gaegu",
          "Patrick Hand",
          "Pretendard Variable",
          "system-ui",
          "sans-serif",
        ],
        // font-hand — 말풍선·낙서 캡션처럼 더 흘려쓴 느낌이 필요한 자리.
        hand: [
          "Nanum Pen Script",
          "Gaegu",
          "Patrick Hand",
          "Pretendard Variable",
          "system-ui",
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
        // ─── 손그림(스케치) 팔레트 ──────────────────────────────
        // 토큰 "이름"(ink-900, accent, duo-green ...)은 그대로라서
        // 컴포넌트 코드는 한 글자도 안 고치고 앱 전체가 새 색으로 갈아입는다.
        //
        // 컨셉: 크림색 종이 + 연필/펜으로 그린 검은 선.
        // 색은 "칠한 것"이 아니라 "형광펜으로 슥 그은 것"처럼 흐리게 쓴다.
        // 그래서 채도 높은 원색 대신, 종이 위에 스며든 듯한 톤을 골랐다.
        ink: {
          900: "#1B1A17", // 펜으로 꾹 눌러 쓴 제목
          700: "#2E2B26", // 본문
          500: "#6B655C", // 연필 보조 텍스트
          300: "#A9A296", // 흐린 연필선 / 잠긴 것
          200: "#DED8CC", // 종이 위 옅은 선 — 테두리/구분선
          100: "#F2EDE3", // 살짝 눌러 칠한 배경 (칩/섹션)
        },
        // 종이 자체의 색. bg-paper 로 쓸 수 있게 별도 토큰으로 뺐다.
        paper: {
          DEFAULT: "#FBFAF7", // 크림 화이트 — body 배경
          card: "#FFFDF8", // 카드는 종이보다 한 톤 밝게 (겹쳐 놓은 메모지 느낌)
        },
        accent: {
          // 메인 포인트 컬러 — 잉크 블루(볼펜으로 그은 파란 밑줄)
          DEFAULT: "#3B5BDB",
          dim: "#2F49AE",
          soft: "#E4E9FB", // 형광펜으로 슥 칠한 파란 틴트
        },
        duo: {
          green: "#4C9A2A", // 색연필 초록 — 정답/CTA
          "green-dim": "#3A7620",
          "green-soft": "#E8F3DE", // 형광펜 초록
          "green-ink": "#2F5F18",
          red: "#D6453C", // 빨간 펜 첨삭 — 오답
          "red-dim": "#AE332C",
          "red-soft": "#FBE5E3",
          "red-ink": "#98241E",
          bee: "#E8A33D", // 노란 형광펜 — XP/별/트로피
          "bee-dim": "#C4831F",
          fox: "#D97C29", // 주황 색연필 — 스트릭 불꽃
          beetle: "#8B6BC7", // 보라 색연필 — 젬/레어
        },
      },
      borderRadius: {
        // ─── 손으로 그린 둥근 모서리 ────────────────────────────
        // 사람이 사각형을 그리면 네 모서리 곡률이 절대 같지 않다.
        // border-radius 에 값 4개를 서로 다르게 주면 그 "삐뚤함"이 흉내진다.
        // (rounded-2xl 같은 기존 클래스 이름을 그대로 덮어쓰므로
        //  컴포넌트는 안 고쳐도 전부 손그림 모서리가 된다.)
        lg: "14px 10px 12px 9px",
        xl: "18px 12px 16px 11px",
        "2xl": "22px 16px 20px 14px",
        "3xl": "30px 22px 26px 20px",
      },
      boxShadow: {
        // 종이에 그린 그림은 은은한 그림자가 아니라 "펜으로 덧그은 선"이 그림자다.
        // 그래서 blur 없는 단단한 오프셋 그림자로 바꿨다 — 스케치 특유의 이중선 느낌.
        card: "3px 3px 0 rgba(27, 26, 23, 0.14)",
        chip: "2px 2px 0 rgba(27, 26, 23, 0.12)",
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
        // 완료 화면 트로피가 "통!" 하고 튀어나오는 효과.
        "bounce-in": {
          "0%": { opacity: "0", transform: "scale(0.5)" },
          "60%": { opacity: "1", transform: "scale(1.1)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        // "+10 XP" 같은 숫자가 위로 떠오르며 사라지는 효과
        "float-up": {
          "0%": { opacity: "1", transform: "translateY(0)" },
          "100%": { opacity: "0", transform: "translateY(-20px)" },
        },
        // 완료 화면 스탯 카드들이 아래에서 하나씩 올라오는 효과
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        pop: "pop 0.35s ease-out",
        beat: "beat 0.8s ease-in-out 2",
        bob: "bob 1.4s ease-in-out infinite",
        "bounce-in": "bounce-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "float-up": "float-up 1.1s ease-out forwards",
        "slide-up": "slide-up 0.35s ease-out both",
      },
    },
  },
  plugins: [],
};
