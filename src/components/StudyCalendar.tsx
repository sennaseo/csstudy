// =============================================================
// StudyCalendar (잔디 달력)
// - 스트릭 배지를 누르면 뜨는 월 달력 모달.
// - 깃허브 잔디처럼, 그 날 푼 문제 수에 따라 색 농도가 진해진다.
//   0개 = 회색 / 1~2개 = 연보라 / 3~4개 = 중간 / 5개(목표)+ = 진한 보라
// - ◀ ▶ 로 이전/다음 달 이동 (미래 달로는 못 감).
// =============================================================

import { useState } from "react";
import { DAILY_GOAL, useStudyStore } from "../store/useStudyStore";
import { useBack } from "../utils/useBack";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

/** (y, m(0-based), d) → 'YYYY-MM-DD' — store 의 dailyCounts 키와 같은 형식 */
function keyOf(y: number, m: number, d: number): string {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

/** 푼 문제 수 → 잔디 농도 클래스 */
function intensityClass(count: number): string {
  if (count === 0) return "bg-ink-100 text-ink-300";
  if (count < 3) return "bg-accent-soft text-accent-dim"; // 1~2: 연하게
  if (count < DAILY_GOAL) return "bg-accent/50 text-white"; // 3~4: 중간
  return "bg-accent text-white font-bold"; // 5+: 목표 달성 — 찐하게!
}

export function StudyCalendar({ onClose }: { onClose: () => void }) {
  useBack(onClose); // 안드로이드 뒤로가기 = 닫기
  const dailyCounts = useStudyStore((s) => s.dailyCounts);
  const streak = useStudyStore((s) => s.getStreak());

  const now = new Date();
  // 보고 있는 달 — m 은 0-based (Date 와 동일하게 맞춰 헷갈림 방지)
  const [view, setView] = useState({ y: now.getFullYear(), m: now.getMonth() });

  const isCurrentMonth =
    view.y === now.getFullYear() && view.m === now.getMonth();

  // 달력 셀 만들기: 1일의 요일만큼 빈 칸(null) 깔고 → 날짜 채우기
  const startOffset = new Date(view.y, view.m, 1).getDay();
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate(); // 다음 달 0일 = 이번 달 말일
  const cells: Array<number | null> = [
    ...Array<null>(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  // 이번 달 합계 — 헤더에 살짝 보여주면 뿌듯함이 +1 된다
  const monthTotal = Array.from({ length: daysInMonth }, (_, i) =>
    dailyCounts[keyOf(view.y, view.m, i + 1)] ?? 0
  ).reduce((a, b) => a + b, 0);

  const goPrev = () =>
    setView(({ y, m }) => (m === 0 ? { y: y - 1, m: 11 } : { y, m: m - 1 }));
  const goNext = () => {
    if (isCurrentMonth) return; // 미래는 아직 풀지 않았으니까
    setView(({ y, m }) => (m === 11 ? { y: y + 1, m: 0 } : { y, m: m + 1 }));
  };

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-ink-900/40 p-6 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-label="학습 달력"
    >
      <div
        className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-card animate-pop"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ─── 헤더: 스트릭 + 닫기 ─── */}
        <div className="mb-1 flex items-center justify-between">
          <h2 className="text-base font-extrabold text-ink-900">
            🔥 {streak}일 연속 학습 중
          </h2>
          <button
            onClick={onClose}
            className="rounded-full bg-ink-100 px-3 py-1 text-xs font-semibold text-ink-500 hover:bg-ink-200"
          >
            닫기 ✕
          </button>
        </div>
        <p className="mb-4 text-xs text-ink-500">
          많이 푼 날일수록 색이 진해져요 🌱
        </p>

        {/* ─── 월 이동 ─── */}
        <div className="mb-3 flex items-center justify-between">
          <button
            onClick={goPrev}
            className="rounded-full px-2.5 py-1 text-sm text-ink-500 hover:bg-ink-100"
            aria-label="이전 달"
          >
            ◀
          </button>
          <div className="text-center">
            <span className="text-sm font-bold text-ink-900">
              {view.y}년 {view.m + 1}월
            </span>
            <span className="ml-1.5 text-xs tabular-nums text-ink-500">
              · {monthTotal}문제
            </span>
          </div>
          <button
            onClick={goNext}
            disabled={isCurrentMonth}
            className="rounded-full px-2.5 py-1 text-sm text-ink-500 hover:bg-ink-100 disabled:opacity-30 disabled:hover:bg-transparent"
            aria-label="다음 달"
          >
            ▶
          </button>
        </div>

        {/* ─── 요일 헤더 ─── */}
        <div className="grid grid-cols-7 gap-1.5">
          {WEEKDAYS.map((w, i) => (
            <div
              key={w}
              className={
                "pb-1 text-center text-[10px] font-semibold " +
                (i === 0 ? "text-rose-400" : "text-ink-400")
              }
            >
              {w}
            </div>
          ))}

          {/* ─── 날짜 셀 (잔디) ─── */}
          {cells.map((d, i) => {
            if (d === null) return <div key={`empty-${i}`} />;
            const count = dailyCounts[keyOf(view.y, view.m, d)] ?? 0;
            const isToday =
              isCurrentMonth && d === now.getDate();
            return (
              <div
                key={d}
                title={count > 0 ? `${d}일 — ${count}문제` : `${d}일`}
                className={
                  "flex aspect-square items-center justify-center rounded-lg text-[11px] tabular-nums transition-colors " +
                  intensityClass(count) +
                  (isToday ? " ring-2 ring-accent ring-offset-1" : "")
                }
              >
                {d}
              </div>
            );
          })}
        </div>

        {/* ─── 범례 — 깃허브 잔디처럼 ─── */}
        <div className="mt-4 flex items-center justify-end gap-1 text-[10px] text-ink-400">
          적게
          <span className="h-3 w-3 rounded bg-ink-100" />
          <span className="h-3 w-3 rounded bg-accent-soft" />
          <span className="h-3 w-3 rounded bg-accent/50" />
          <span className="h-3 w-3 rounded bg-accent" />
          많이
        </div>
      </div>
    </div>
  );
}
