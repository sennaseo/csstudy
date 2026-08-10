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
        // font-round — 숫자/영문 라벨용 둥근 폰트(Baloo 2).
        // "XP 120", "LV 3" 같은 짧은 라틴/숫자에 쓰면 듀오링고 느낌이 확 산다.
        // 한글은 Baloo 2 에 글리프가 없어서 자동으로 뒤의 Pretendard 로 넘어간다(폰트 fallback).
        round: [
          "Baloo 2",
          "Pretendard Variable",
          "Pretendard",
          "system-ui",
          "sans-serif",
        ],
        // font-display — 완료 화면의 큰 타이틀 같은 "한 방" 자리용 한글 라운드 폰트(Jua).
        display: [
          "Jua",
          "Pretendard Variable",
          "Pretendard",
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
        // 듀오링고 공식 팔레트로 값만 교체했다.
        // 토큰 "이름"(ink-900, accent, duo-green ...)은 그대로라서
        // 컴포넌트 코드는 한 글자도 안 고치고 앱 전체가 새 색으로 갈아입는다.
        //
        // ink = 글자/선 용도의 뉴트럴 그레이 (숫자가 클수록 진함).
        // 듀오링고는 이 그레이들에 동물 이름을 붙여 부른다 — 아래 주석의 별명이 그것.
        ink: {
          900: "#4B4B4B", // Eel — 제목
          700: "#4B4B4B", // Eel — 본문 (듀오링고는 제목/본문을 같은 진한 회색으로 쓴다)
          500: "#777777", // Wolf — 보조 텍스트
          300: "#AFAFAF", // Hare — 비활성 글자/잠긴 노드
          200: "#E5E5E5", // Swan — 테두리/구분선
          100: "#F7F7F7", // Polar — 칩/섹션 배경
        },
        accent: {
          // 메인 포인트 컬러 — Macaw Blue (선택된 답안, 링크, 보조 액션)
          DEFAULT: "#1CB0F6",
          dim: "#1899D6", // 파랑 버튼 바닥(3D 두께)
          soft: "#DDF4FF", // 선택 틴트 배경
        },
        // 듀오링고식 상태/브랜드 팔레트.
        // dim 은 버튼 아래쪽 3D 테두리(=바닥 두께)용 진한 톤이다.
        duo: {
          green: "#58CC02", // Feather Green — 메인 CTA, 정답, 진행바
          "green-dim": "#46A302", // 초록 버튼 밑단 테두리
          "green-soft": "#D7FFB8", // 정답 피드백 배경
          "green-ink": "#3A7A00", // 정답 피드백 글자
          red: "#FF4B4B", // Cardinal — 오답, 하트
          "red-dim": "#EA2B2B", // 빨강 버튼 밑단 테두리
          "red-soft": "#FFDFE0", // 오답 피드백 배경
          "red-ink": "#C81E2B", // 오답 피드백 글자
          bee: "#FFC800", // Bee — XP, 별, 트로피, 완료 노드(골드)
          "bee-dim": "#E5A100", // 골드 노드/버튼 바닥
          fox: "#FF9600", // Fox — 스트릭 불꽃, 콤보
          beetle: "#CE82FF", // Beetle — 젬/프리미엄/레어
        },
      },
      boxShadow: {
        // 흰 배경 위에서 카드가 살짝 떠 보이게 하는 중성 그림자 2종.
        // (예전 보랏빛 그림자 → 색기 없는 회색으로 바꿔 듀오링고의 깔끔한 느낌에 맞췄다.)
        card: "0 2px 8px rgba(0, 0, 0, 0.06), 0 8px 24px rgba(0, 0, 0, 0.06)",
        chip: "0 1px 3px rgba(0, 0, 0, 0.10)",
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
        // 작게 시작 → 목표보다 살짝 크게(1.1) 갔다가 → 제자리(1)로 돌아온다.
        // 이렇게 한 번 지나쳤다 오는 걸 오버슈트(overshoot)라 부르고, 살아있는 느낌을 준다.
        "bounce-in": {
          "0%": { opacity: "0", transform: "scale(0.5)" },
          "60%": { opacity: "1", transform: "scale(1.1)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        // "+10 XP" 같은 숫자가 위로 떠오르며 사라지는 효과 (게임에서 데미지 숫자 뜨는 그것)
        "float-up": {
          "0%": { opacity: "1", transform: "translateY(0)" },
          "100%": { opacity: "0", transform: "translateY(-20px)" },
        },
        // 완료 화면 스탯 카드들이 아래에서 하나씩 올라오는 효과.
        // 카드마다 animation-delay 를 100ms 씩 다르게 주면 순차 등장(stagger)이 된다.
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        pop: "pop 0.35s ease-out",
        beat: "beat 0.8s ease-in-out 2",
        bob: "bob 1.4s ease-in-out infinite",
        // cubic-bezier(0.34, 1.56, 0.64, 1) = "back-out" — 1을 넘겼다 돌아오는 탄력 곡선
        "bounce-in": "bounce-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
        // forwards = 애니메이션이 끝난 상태(투명)를 그대로 유지 → 도로 나타나지 않는다
        "float-up": "float-up 1.1s ease-out forwards",
        "slide-up": "slide-up 0.35s ease-out both",
      },
    },
  },
  plugins: [],
};
