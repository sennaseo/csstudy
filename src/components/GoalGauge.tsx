// =============================================================
// GoalGauge
// - 오늘의 목표(5문제) 진행 게이지.
// - 게임의 "경험치 바" 같은 역할 — 채워지는 게 보이면 한 문제 더 풀고 싶어진다.
// - 목표 달성 후에도 카운트는 계속 올라가지만 바는 100%에서 멈춘다.
// - 바 아래 응원 문구는 없앴다: 숫자(3/5)가 이미 "몇 개 더"를 말해주고,
//   목표 달성 시 숫자가 초록으로 바뀌는 피드백도 이미 있다 — 글 한 줄 더 얹으면
//   "홈을 가볍게"라는 목적에 역행한다.
// =============================================================

import { DAILY_GOAL, useStudyStore } from "../store/useStudyStore";

export function GoalGauge() {
  const count = useStudyStore((s) => s.getTodayCount());

  // 0~100 사이로 자르기. Math.min 으로 100% 초과 방지.
  const percent = Math.min((count / DAILY_GOAL) * 100, 100);
  const isDone = count >= DAILY_GOAL;

  return (
    // 듀오링고는 그림자보다 테두리 위주 — 흰 배경 + Swan(ink-200) 테두리 카드.
    <div className="rounded-2xl border-2 border-ink-200 bg-white p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-semibold text-ink-900">오늘의 목표</span>
        <span className="text-sm font-round tabular-nums text-ink-500">
          <span className={isDone ? "font-extrabold text-duo-green-ink" : "font-extrabold text-accent"}>
            {count}
          </span>
          {" / "}
          {DAILY_GOAL}
        </span>
      </div>

      {/* 게이지 바 — .progress-track/.progress-fill 이 채움 색(초록 그라디언트)과
          하이라이트 줄까지 알아서 그려준다. width 만 % 로 넘기면 된다. */}
      <div
        className="progress-track"
        role="progressbar"
        aria-label={`오늘의 목표 ${count}/${DAILY_GOAL}문제`}
        aria-valuenow={Math.round(percent)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="progress-fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
