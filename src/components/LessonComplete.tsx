// =============================================================
// LessonComplete — 레슨을 끝냈을 때 뜨는 축하 화면
// - 듀오링고의 "레슨 완료!" 화면처럼 큰 메시지 + 결과(정답수/획득 XP).
// - 마운트되자마자 컨페티 한 번. "계속" 누르면 홈(스킬트리)으로.
//
// 듀오링고식 스탯 카드가 이 화면의 핵심 볼거리다. 생김새는 3층 샌드위치:
//   ┌ 색 테두리(bg-색) ─────────┐   ← 바깥 상자 전체가 그 색
//   │  라벨 띠 ("획득 XP")      │   ← 색 위에 흰 글씨
//   │ ┌ 흰 내용부 ───────────┐ │
//   │ │      +48             │ │   ← 큰 숫자 (font-round)
//   │ └──────────────────────┘ │
//   └──────────────────────────┘
// 구현 요령: 바깥 div 에 색 배경 + p-1(얇은 테두리 두께), 안쪽 div 는 흰 배경.
// "테두리"를 border 로 그리는 대신 padding 으로 만드는 게 훨씬 간단하다.
// =============================================================

import { useEffect, useState } from "react";
import { useStudyStore } from "../store/useStudyStore";
import { Confetti } from "./Confetti";

/** 듀오링고식 스탯 카드 한 장.
 *  @param tone   바깥 상자/라벨 띠의 배경색 클래스 (예: "bg-duo-bee")
 *  @param ink    큰 숫자에 쓸 글자색 클래스
 *  @param delay  등장 지연(ms) — 카드마다 다르게 주면 순차 등장(stagger)이 된다 */
function StatCard({
  label,
  tone,
  ink,
  delay,
  children,
}: {
  label: string;
  tone: string;
  ink: string;
  delay: number;
  children: React.ReactNode;
}) {
  return (
    <div
      className={"animate-slide-up flex-1 rounded-2xl p-1 " + tone}
      // Tailwind 에 없는 값은 style 로 직접 — 카드마다 다른 지연이라 클래스로 못 만든다.
      style={{ animationDelay: `${delay}ms` }}
    >
      <p className="py-1 text-center text-[10px] font-extrabold uppercase tracking-wider text-white">
        {label}
      </p>
      <div className="rounded-xl bg-white px-2 py-3">
        <p className={"text-center font-round text-2xl font-extrabold leading-none " + ink}>
          {children}
        </p>
      </div>
    </div>
  );
}

export function LessonComplete() {
  const result = useStudyStore((s) => s.lessonResult);
  const goHome = useStudyStore((s) => s.goHome);
  const combo = useStudyStore((s) => s.combo);
  const bestCombo = useStudyStore((s) => s.bestCombo);

  // 마운트 시 컨페티 한 번 터뜨린다.
  const [burstId, setBurstId] = useState(0);
  useEffect(() => setBurstId(1), []);

  if (!result) {
    // 안전망 — 결과가 없으면 그냥 홈으로 갈 수 있게.
    return (
      <div className="flex flex-col items-center gap-4 py-16">
        <button
          onClick={goHome}
          className="btn-3d rounded-2xl border-2 border-b-4 border-duo-green-dim bg-duo-green px-6 py-3 text-sm font-extrabold text-white"
        >
          돌아가기
        </button>
      </div>
    );
  }

  const allCorrect = result.correct === result.total;
  // 세션 종류에 따라 문구를 바꾼다 (__review/__today 는 스킬트리 레슨이 아님).
  const isReview = result.lessonId === "__review";
  const isToday = result.lessonId === "__today";
  const failed = !!result.failed;
  const title = failed
    ? "하트가 다 떨어졌어요"
    : allCorrect
    ? "완벽해요!"
    : isReview
    ? "복습 완료!"
    : isToday
    ? "오늘의 5문제 완료!"
    : "레슨 완료!";
  const subtitle = failed
    ? "🔁 복습을 끝내면 하트 1개 회복! (30분마다 자동 회복돼요)"
    : allCorrect
    ? isReview
      ? "헷갈리던 문제를 전부 맞혔어요. 머리에 붙었네요!"
      : isToday
      ? "전부 정답! 오늘 몫은 충분히 했어요."
      : "전부 맞혔어요. 다음 레슨이 열렸어요."
    : isReview || isToday
    ? "수고했어요. 틀린 건 다음 복습에서 또 만나요."
    : "수고했어요. 틀린 건 복습 노드에서 다시 만나요.";

  // 이번 세션 최고 콤보 — 콤보가 살아있으면 그 값, 끊겼으면 안 보여준다.
  const showCombo = !failed && combo >= 2;

  return (
    <div className="relative flex flex-col items-center gap-6 py-12 text-center">
      {/* 실패했을 땐 컨페티 없음 — 차분하게 위로하는 화면이라 축포는 안 어울린다 */}
      {!failed && <Confetti burstId={burstId} />}

      {/* 트로피가 "통!" 하고 튀어나온다 (실패 화면은 조용히 그냥 표시) */}
      <div className={"text-7xl " + (failed ? "" : "animate-bounce-in")}>
        {failed ? "💔" : allCorrect ? "🏆" : "🎉"}
      </div>

      {/* 큰 타이틀만 font-display(Jua) — 한글이 둥글둥글해지며 축하 분위기가 산다 */}
      <div className="flex flex-col gap-2">
        <h2 className="font-display text-3xl leading-tight text-ink-900">{title}</h2>
        <p className="text-sm font-semibold text-ink-500">{subtitle}</p>
      </div>

      {/* 스탯 카드 — 100ms 씩 늦게 등장시켜 하나씩 착착 올라오게 한다 */}
      <div className="flex w-full max-w-sm gap-3">
        <StatCard label="획득 XP" tone="bg-duo-bee" ink="text-duo-bee-dim" delay={100}>
          +{result.xpGained}
        </StatCard>
        <StatCard label="정답" tone="bg-accent" ink="text-accent-dim" delay={200}>
          {result.correct}
          <span className="text-base text-ink-300"> / {result.total}</span>
        </StatCard>
        {showCombo && (
          <StatCard label="콤보" tone="bg-duo-fox" ink="text-duo-fox" delay={300}>
            🔥{combo}
          </StatCard>
        )}
      </div>

      {/* 콤보 신기록은 카드 아래에 한 줄로 덧붙인다 */}
      {showCombo && combo === bestCombo && bestCombo >= 3 && (
        <p className="text-xs font-extrabold text-duo-fox">🏅 콤보 신기록!</p>
      )}

      {/* 복습 보상으로 하트를 회복했을 때 */}
      {result.heartsRecovered && (
        <p className="text-xs font-extrabold text-duo-red">❤️ 하트 1개 회복!</p>
      )}

      <button
        onClick={goHome}
        className="btn-3d mt-2 w-full max-w-sm rounded-2xl border-2 border-b-4 border-duo-green-dim bg-duo-green px-6 py-4 text-base font-extrabold tracking-wide text-white hover:brightness-105"
      >
        계속
      </button>
    </div>
  );
}
