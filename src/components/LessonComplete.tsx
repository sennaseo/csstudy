// =============================================================
// LessonComplete — 레슨을 끝냈을 때 뜨는 축하 화면
// - 듀오링고의 "레슨 완료!" 화면처럼 큰 메시지 + 결과(정답수/획득 XP).
// - 마운트되자마자 컨페티 한 번. "계속" 누르면 홈(스킬트리)으로.
// =============================================================

import { useEffect, useState } from "react";
import { useStudyStore } from "../store/useStudyStore";
import { Confetti } from "./Confetti";

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
          className="btn-3d rounded-2xl border-duo-green-dim bg-duo-green px-6 py-3 text-sm font-extrabold uppercase text-white"
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

  return (
    <div className="relative flex flex-col items-center gap-6 py-12 text-center">
      {/* 실패했을 땐 컨페티 없음 */}
      {!failed && <Confetti burstId={burstId} />}

      <div className="text-6xl">{failed ? "💔" : allCorrect ? "🏆" : "🎉"}</div>
      <h2 className="text-2xl font-extrabold text-ink-900">{title}</h2>
      <p className="text-sm text-ink-500">{subtitle}</p>

      {/* 결과 카드 2개: 정답수 / 획득 XP */}
      <div className="flex w-full max-w-xs gap-3">
        <div className="flex-1 rounded-2xl border-2 border-duo-green-dim bg-duo-green-soft p-4">
          <p className="text-[11px] font-bold uppercase tracking-wide text-duo-green-ink">
            정답
          </p>
          <p className="mt-1 text-2xl font-extrabold text-duo-green-ink">
            {result.correct}
            <span className="text-base text-ink-500"> / {result.total}</span>
          </p>
        </div>
        <div className="flex-1 rounded-2xl border-2 border-accent-dim bg-accent-soft p-4">
          <p className="text-[11px] font-bold uppercase tracking-wide text-accent-dim">
            획득 XP
          </p>
          <p className="mt-1 text-2xl font-extrabold text-accent-dim">
            +{result.xpGained}
          </p>
        </div>
      </div>

      {/* 콤보 배지 — 이번 세션 콤보가 살아있거나 신기록을 세웠을 때만 */}
      {!failed && combo >= 2 && (
        <p className="text-xs font-bold text-amber-500">
          🔥 콤보 {combo}연속
          {combo === bestCombo && bestCombo >= 3 && " · 최고 기록!"}
        </p>
      )}

      {/* 복습 보상으로 하트를 회복했을 때 */}
      {result.heartsRecovered && (
        <p className="text-xs font-bold text-duo-red">❤️ 하트 1개 회복!</p>
      )}

      <button
        onClick={goHome}
        className="btn-3d mt-2 w-full max-w-xs rounded-2xl border-duo-green-dim bg-duo-green px-6 py-3.5 text-sm font-extrabold uppercase tracking-wide text-white hover:brightness-105"
      >
        계속
      </button>
    </div>
  );
}
