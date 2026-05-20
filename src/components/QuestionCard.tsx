// =============================================================
// QuestionCard
// - 하나의 문제를 보여주고, 정답 토글 + 자기평가 3버튼을 제공한다.
// - 이 컴포넌트는 "표현" 만 담당하고, 데이터/로직은 모두 store 에서 가져온다.
//   → 추후 AI 면접관 모드 추가 시, 이 컴포넌트는 거의 그대로 두고
//     store action 만 교체하면 된다.
// =============================================================

import { useStudyStore } from "../store/useStudyStore";
import type { ReviewStatus } from "../types";

const STATUS_BUTTONS: Array<{
  label: string;
  value: ReviewStatus;
  hint: string;
}> = [
  { label: "이해함", value: "understood", hint: "U" },
  { label: "애매함", value: "fuzzy", hint: "F" },
  { label: "모름", value: "unknown", hint: "K" },
];

export function QuestionCard() {
  const q = useStudyStore((s) => s.currentQuestion);
  const isAnswerVisible = useStudyStore((s) => s.isAnswerVisible);
  const toggleAnswer = useStudyStore((s) => s.toggleAnswer);
  const recordStatus = useStudyStore((s) => s.recordStatus);
  const pickRandom = useStudyStore((s) => s.pickRandom);

  // 풀에 문제가 없을 때 — 카테고리에 데이터가 0 개인 케이스.
  if (!q) {
    return (
      <div className="rounded-lg border border-ink-700 bg-ink-900 p-6 text-ink-400">
        선택된 카테고리에 문제가 없습니다.
        <button
          onClick={pickRandom}
          className="ml-2 text-accent underline-offset-2 hover:underline"
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <article className="rounded-lg border border-ink-700 bg-ink-900">
      {/* 헤더 — 카테고리 라벨 + 새 문제 버튼 */}
      <header className="flex items-center justify-between border-b border-ink-800 px-5 py-3">
        <span className="text-xs uppercase tracking-wider text-ink-400">
          {q.category}
        </span>
        <button
          onClick={pickRandom}
          className="text-xs text-ink-300 hover:text-accent"
          title="다음 문제"
        >
          다음 →
        </button>
      </header>

      {/* 문제 본문 */}
      <div className="px-5 py-6">
        <h2 className="text-lg leading-relaxed text-ink-100">{q.question}</h2>

        {/* 정답 영역 — 토글 */}
        <div className="mt-5">
          {isAnswerVisible ? (
            <div className="rounded-md border border-ink-700 bg-ink-800 p-4 text-sm leading-relaxed text-ink-200">
              {q.answer}
            </div>
          ) : (
            <button
              onClick={toggleAnswer}
              className="rounded-md border border-dashed border-ink-600 px-3 py-2 text-sm text-ink-300 hover:border-accent hover:text-accent"
            >
              정답 보기
            </button>
          )}
        </div>
      </div>

      {/* 자기평가 — 3버튼. 누르면 기록 저장 + 자동 다음 문제. */}
      <footer className="grid grid-cols-3 gap-px border-t border-ink-800 bg-ink-800">
        {STATUS_BUTTONS.map((b) => (
          <button
            key={b.value}
            onClick={() => recordStatus(b.value)}
            className="bg-ink-900 px-3 py-3 text-sm text-ink-200 transition-colors hover:bg-ink-700 hover:text-accent"
          >
            {b.label}
          </button>
        ))}
      </footer>
    </article>
  );
}
