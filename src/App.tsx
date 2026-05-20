// =============================================================
// App
// - 전체 레이아웃 + 최초 진입 시 문제 1개 자동 픽.
// - 좁은 한 컬럼 — 모바일/데스크탑 동일 레이아웃이지만 가독성을 위해 max-w 제한.
// =============================================================

import { useEffect } from "react";
import { CategoryFilter } from "./components/CategoryFilter";
import { DailyStats } from "./components/DailyStats";
import { QuestionCard } from "./components/QuestionCard";
import { useStudyStore } from "./store/useStudyStore";

export default function App() {
  const currentQuestion = useStudyStore((s) => s.currentQuestion);
  const pickRandom = useStudyStore((s) => s.pickRandom);

  // 마운트 시 현재 문제가 없으면 하나 뽑는다.
  useEffect(() => {
    if (!currentQuestion) pickRandom();
    // 의존성을 [] 로 두지 않는 이유: store 함수 참조는 안정적이고,
    // currentQuestion 변화 감지 없이 한 번만 필요한 동작이라 그대로 둬도 안전.
  }, [currentQuestion, pickRandom]);

  return (
    <div className="min-h-full">
      <main className="mx-auto flex w-full max-w-xl flex-col gap-5 px-4 py-6 sm:py-10">
        {/* ─── Header ─── */}
        <header className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <h1 className="text-base font-semibold tracking-tight text-ink-100">
              csStudy
            </h1>
            <span className="text-xs text-ink-400">// 개발 사고 회복</span>
          </div>
          <DailyStats />
        </header>

        {/* ─── Filter ─── */}
        <CategoryFilter />

        {/* ─── Card ─── */}
        <QuestionCard />

        {/* ─── Footer hint ─── */}
        <p className="text-center text-[11px] leading-relaxed text-ink-500">
          1~5문제만 풀고 끄세요. 완벽보다 반복.
        </p>
      </main>
    </div>
  );
}
