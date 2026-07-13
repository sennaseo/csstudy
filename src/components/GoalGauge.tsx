// =============================================================
// GoalGauge
// - 오늘의 목표(5문제) 진행 게이지.
// - 게임의 "경험치 바" 같은 역할 — 채워지는 게 보이면 한 문제 더 풀고 싶어진다.
// - 목표 달성 후에도 카운트는 계속 올라가지만 바는 100%에서 멈춘다.
// =============================================================

import { DAILY_GOAL, useStudyStore } from "../store/useStudyStore";

/** 진행도에 따라 응원 문구를 바꿔준다 — 단계별 피드백. */
function messageFor(count: number): string {
  if (count === 0) return "오늘의 첫 문제를 풀어볼까요?";
  if (count < DAILY_GOAL) return `좋아요, ${DAILY_GOAL - count}문제만 더!`;
  if (count === DAILY_GOAL) return "🎉 오늘 목표 달성! 여기서 멈춰도 충분해요.";
  return `목표 초과 달성! 무리는 금물 🙂`;
}

export function GoalGauge() {
  const count = useStudyStore((s) => s.getTodayCount());

  // 0~100 사이로 자르기. Math.min 으로 100% 초과 방지.
  const percent = Math.min((count / DAILY_GOAL) * 100, 100);
  const isDone = count >= DAILY_GOAL;

  return (
    <div className="rounded-2xl bg-white p-4 shadow-card">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-semibold text-ink-900">오늘의 목표</span>
        <span className="text-sm tabular-nums text-ink-500">
          <span className={isDone ? "font-bold text-emerald-500" : "font-bold text-accent"}>
            {count}
          </span>
          {" / "}
          {DAILY_GOAL}
        </span>
      </div>

      {/* 게이지 바 — width 를 % 로 주고 transition 으로 부드럽게 채운다 */}
      <div className="h-3 overflow-hidden rounded-full bg-ink-100">
        <div
          className={
            "h-full rounded-full transition-all duration-700 ease-out " +
            (isDone
              ? "bg-gradient-to-r from-emerald-400 to-teal-400"
              : "bg-gradient-to-r from-accent to-sky-400")
          }
          style={{ width: `${percent}%` }}
        />
      </div>

      <p className="mt-2 text-xs text-ink-500">{messageFor(count)}</p>
    </div>
  );
}
