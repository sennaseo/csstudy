// =============================================================
// DailyStats
// - 헤더 우측의 스트릭(연속 학습일) 배지.
// - 클릭하면 잔디 달력(StudyCalendar) 모달이 열린다.
// - 오늘 1문제라도 풀었으면 불꽃이 컬러, 아직이면 흑백.
// =============================================================

import { useState } from "react";
import { useStudyStore } from "../store/useStudyStore";
import { StudyCalendar } from "./StudyCalendar";

export function DailyStats() {
  const streak = useStudyStore((s) => s.getStreak());
  const todayCount = useStudyStore((s) => s.getTodayCount());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // 오늘 아직 안 풀었으면 불꽃을 회색 처리 → "오늘 풀면 불 붙는다"는 동기부여.
  const isLitToday = todayCount > 0;

  return (
    <>
      <button
        onClick={() => setIsCalendarOpen(true)}
        className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 shadow-chip transition-all hover:shadow-card active:scale-95"
        title="달력에서 학습 기록 보기"
      >
        <span
          className={
            "text-base leading-none " +
            (isLitToday ? "animate-beat" : "grayscale opacity-50")
          }
        >
          🔥
        </span>
        <span className="text-sm font-bold tabular-nums text-ink-900">
          {streak}
        </span>
        <span className="text-xs text-ink-500">일</span>
      </button>

      {isCalendarOpen && (
        <StudyCalendar onClose={() => setIsCalendarOpen(false)} />
      )}
    </>
  );
}
