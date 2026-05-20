// =============================================================
// DailyStats
// - 헤더 우측에 노출되는 작은 카운터.
// - 일부러 작게 만든다: "성과 압박" 보다 "오늘 한 번이라도 켰다" 라는 신호용.
// =============================================================

import { useStudyStore } from "../store/useStudyStore";

export function DailyStats() {
  // selector 함수 안에서 호출 — 셀렉터로 좁히면 다른 상태 변경에 리렌더 안 한다.
  const count = useStudyStore((s) => s.getTodayCount());

  return (
    <div className="text-xs text-ink-400">
      today{" "}
      <span className="font-semibold text-ink-100 tabular-nums">{count}</span>
    </div>
  );
}
