// =============================================================
// ReviewZone — 복습할 문제 목록 ("내가 뭘 틀렸더라?"를 먼저 보고 시작)
// - 홈의 "📚 복습할 문제 N개" 를 누르면 바로 풀기 대신 이 목록이 뜬다.
// - 문제마다 질문 + 한 줄 정답 + 상태(모름 / 헷갈림 / 잊을 때 됨), 급한 순서.
// - 아래 "복습 시작" = 기존 복습(급한 것부터 5문제). 목록은 읽기만 해도 복습이 된다.
// =============================================================

import { useStudyStore, reviewPoolOf } from "../store/useStudyStore";
import { choiceTextOf } from "../utils/exercise";
import { useBack } from "../utils/useBack";
import { CATEGORY_EMOJI } from "../data/questions";

const TAG = {
  unknown: { label: "모름", cls: "bg-duo-red-soft text-duo-red-ink" },
  fuzzy: { label: "헷갈림", cls: "bg-duo-bee/15 text-duo-bee-ink" },
  understood: { label: "잊을 때 됨", cls: "bg-accent-soft text-accent-dim" },
} as const;

export function ReviewZone({ onClose }: { onClose: () => void }) {
  useBack(onClose, true);
  const records = useStudyStore((s) => s.records);
  const startReview = useStudyStore((s) => s.startReview);
  const pool = reviewPoolOf(records);

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-paper" role="dialog" aria-modal="true" aria-labelledby="review-zone-title">
      <div className="mx-auto flex h-full w-full max-w-xl flex-col">
        <header className="relative flex shrink-0 flex-col items-center border-b border-ink-200 bg-white px-12 py-3 text-center">
          <button onClick={onClose} aria-label="닫기" className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-xl text-2xl text-ink-700 active:bg-ink-100">
            ✕
          </button>
          <h2 id="review-zone-title" className="font-mono text-lg font-extrabold tracking-tight text-ink-900">
            복습 존
          </h2>
          <p className="text-xs font-bold text-accent">전에 틀렸거나 잊을 때가 된 문제예요</p>
        </header>

        <ol className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto px-4 py-4">
          {pool.length === 0 && <li className="py-16 text-center text-sm text-ink-500">복습할 문제가 없어요 🎉</li>}
          {pool.map((q, i) => {
            const st = records[q.id]?.status ?? "unknown";
            const tag = TAG[st];
            return (
              <li key={q.id} className="flex gap-3 rounded-2xl border border-ink-200 bg-white p-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-soft font-round text-base font-extrabold text-accent">
                  {i + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="mb-0.5 flex items-center gap-1.5 text-[11px] font-bold text-ink-400">
                    {CATEGORY_EMOJI[q.category] ?? "📘"} {q.category}
                    <span className={"rounded-full px-1.5 py-px " + tag.cls}>{tag.label}</span>
                  </span>
                  <span className="line-clamp-2 block text-[15px] font-bold leading-snug text-ink-900">{q.question}</span>
                  <span className="mt-0.5 line-clamp-2 block text-sm leading-snug text-ink-500">{choiceTextOf(q)}</span>
                </span>
              </li>
            );
          })}
        </ol>

        {pool.length > 0 && (
          <footer className="shrink-0 border-t border-ink-200 bg-white px-4 pb-5 pt-3">
            <button
              onClick={() => {
                onClose();
                startReview();
              }}
              className="btn-3d min-h-14 w-full rounded-2xl border-b-4 border-accent-dim bg-accent text-base font-extrabold text-white"
            >
              복습 시작 — 급한 것부터 {Math.min(pool.length, 5)}문제
            </button>
          </footer>
        )}
      </div>
    </div>
  );
}
