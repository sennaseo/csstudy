// =============================================================
// ConceptSheet — 노트 본문의 점선 밑줄 낱말을 누르면 아래에서 올라오는 개념 카드
// - 단어장 카드가 있으면: 한 줄 정의 + 일상 비유
// - 그 개념을 설명하는 노트가 있으면: "노트에서 자세히 보기" (지금 과목 쪽이 먼저)
// - 둘 다 보여줄 수 있으면 둘 다. 안드로이드 뒤로가기 = 시트 닫기.
// =============================================================

import { useBack } from "../utils/useBack";
import type { Concept } from "../data/notes/concepts";

export function ConceptSheet({
  concept,
  onClose,
  onOpenNote,
}: {
  concept: Concept;
  onClose: () => void;
  onOpenNote?: (id: string) => void;
}) {
  useBack(onClose, true);
  const { card, notes } = concept;
  const first = notes[0];

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end" role="dialog" aria-modal="true" aria-label={`${concept.name} 개념 다시 보기`}>
      {/* 바깥을 누르면 닫힌다 */}
      <button type="button" aria-label="닫기" onClick={onClose} className="absolute inset-0 bg-ink-900/40" />
      <div className="relative mx-auto flex max-h-[78dvh] w-full max-w-xl animate-slide-up flex-col gap-3 overflow-y-auto rounded-t-3xl bg-white px-5 pb-6 pt-3 shadow-sheet">
        <span className="mx-auto mb-1 h-1.5 w-10 rounded-full bg-ink-200" />

        <div className="flex items-center gap-2 text-xs font-bold text-ink-500">
          {card ? (
            <span className="rounded-full bg-ink-100 px-2.5 py-0.5">
              {card.emoji} {card.domain} 단어장
            </span>
          ) : (
            first && (
              <span className="rounded-full bg-ink-100 px-2.5 py-0.5">
                📒 {first.subjectTitle} · {first.unitTitle}
              </span>
            )
          )}
          <span>개념 다시 보기</span>
        </div>

        <h3 className="break-keep font-display text-[30px] leading-tight text-marker-ink">{card ? card.term : concept.name}</h3>

        {card ? (
          <>
            <p className="sketch border-[2.5px] border-marker-red px-4 py-3 font-display text-[20px] leading-snug text-marker-red">
              {card.oneLiner}
            </p>
            <div className="-rotate-1 rounded-sm bg-[#FFF4B8] px-4 py-3 font-display text-[17px] leading-snug text-marker-ink shadow-[2px_3px_0_rgba(0,0,0,0.08)]">
              <span className="block text-[16px] text-marker-blue">💡 비유</span>
              {card.example}
            </div>
          </>
        ) : (
          first && (
            <p className="sketch border-[2.5px] border-marker-red px-4 py-3 font-display text-[20px] leading-snug text-marker-red">
              {first.note.summary.split("`").join("")}
            </p>
          )
        )}

        {onOpenNote &&
          notes.slice(0, 2).map((n) => (
            <button
              key={n.note.id}
              type="button"
              onClick={() => onOpenNote(n.note.id)}
              className="btn-3d flex min-h-14 w-full items-center gap-3 rounded-2xl border-2 border-b-4 border-reel/40 bg-reel-soft px-4 py-2.5 text-left active:translate-y-0.5"
            >
              <span className="text-2xl">{n.note.emoji}</span>
              <span className="min-w-0 flex-1">
                <span className="block text-[11px] font-bold text-reel">
                  📒 {n.subjectTitle} · {n.unitTitle}
                </span>
                <span className="block truncate text-sm font-extrabold text-reel-ink">{n.note.title}</span>
              </span>
              <span className="shrink-0 text-sm font-extrabold text-reel">노트에서 자세히 ›</span>
            </button>
          ))}

        <button
          type="button"
          onClick={onClose}
          className="min-h-12 w-full rounded-xl border-2 border-b-4 border-ink-200 bg-white text-sm font-extrabold text-ink-700 active:bg-ink-100"
        >
          닫기
        </button>
      </div>
    </div>
  );
}
