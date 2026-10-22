// =============================================================
// NotesScreen (공부노트 탭)
// - 목록 뷰: 과목 → 단원 → 노트 행. 행을 누르면 상세 뷰.
// - 상세 뷰: 노트 블록(제목·문단·코드·팁·표)을 위에서부터 차례로 그린다.
//
// 왜 열린 노트를 스토어가 아닌 로컬 useState 로 두나
//   "지금 몇 번 노트를 보고 있나"는 앱을 껐다 켜면 잊어도 되는 정보다.
//   스토어에 넣으면 저장·동기화 대상인지 매번 따져야 해서, 화면 안에 가둬 둔다.
//
// 뒤로가기
//   이 화면은 노트 탭에 있는 동안 늘 마운트돼 있다 → useBack 의
//   "늘 마운트된 화면" 패턴(active 플래그)을 쓴다. 노트가 열려 있을 때만
//   히스토리를 한 장 쌓고, 뒤로가기를 누르면 목록으로 돌아온다.
// =============================================================

import { useState } from "react";

import { NOTE_SUBJECTS } from "../data/notes";
import type { NoteBlock } from "../data/notes/types";
import { useBack } from "../utils/useBack";

// 노트 id → { 노트, 같은 단원의 노트 목록 } 을 찾는다. 노트 수가 적어서 매번 훑어도 충분하다.
function findNote(id: string) {
  for (const s of NOTE_SUBJECTS)
    for (const u of s.units) {
      const i = u.notes.findIndex((n) => n.id === id);
      if (i >= 0) return { note: u.notes[i], siblings: u.notes, index: i };
    }
  return null;
}

// 화면은 #root 가 스크롤 상자다(TabBar 주석 참고). 화면이 바뀌면 맨 위로 되돌린다.
const scrollTop = () => document.getElementById("root")?.scrollTo(0, 0);

/** 인라인 `코드` — 백틱으로 쪼개면 홀수 번째 조각이 코드 부분이다.
 *  예) "a `x` b".split("`") → ["a ", "x", " b"] → 1번 조각이 코드 */
function Inline({ text }: { text: string }) {
  return (
    <>
      {text.split("`").map((part, i) =>
        i % 2 === 1 ? (
          <code key={i} className="rounded bg-ink-100 px-1 font-mono text-[0.9em] text-ink-900">
            {part}
          </code>
        ) : (
          part
        ),
      )}
    </>
  );
}

// 팁 카드 종류별 색 — 모양은 같고 색만 다르다(HeartWarning 카드 톤).
const TIP_STYLE = {
  analogy: { label: "🎈 비유", cls: "border-accent bg-accent-soft text-accent-dim" },
  warn: { label: "⚠️ 자주 하는 실수", cls: "border-duo-red-dim bg-duo-red-soft text-duo-red-ink" },
  memo: { label: "📝 내 메모", cls: "border-duo-green-dim bg-duo-green-tint text-duo-green-ink" },
} as const;

/** 블록 하나 그리기 — 블록 종류(type)마다 모양만 다르다. */
function NoteBlockView({ block }: { block: NoteBlock }) {
  switch (block.type) {
    case "h2":
      return <h2 className="mt-2 text-base font-extrabold text-ink-900">{block.text}</h2>;
    case "p":
      return (
        <p className="text-sm leading-relaxed text-ink-700">
          <Inline text={block.text} />
        </p>
      );
    case "code":
      return (
        <pre className="overflow-x-auto whitespace-pre rounded-xl bg-ink-100 p-3 font-mono text-xs leading-relaxed text-ink-900">
          {block.code}
        </pre>
      );
    case "list": {
      const items = block.items.map((it, i) => (
        <li key={i}>
          <Inline text={it} />
        </li>
      ));
      const cls = "flex flex-col gap-1 pl-5 text-sm leading-relaxed text-ink-700";
      return block.ordered ? (
        <ol className={cls + " list-decimal"}>{items}</ol>
      ) : (
        <ul className={cls + " list-disc"}>{items}</ul>
      );
    }
    case "tip": {
      const t = TIP_STYLE[block.kind];
      return (
        <div className={"rounded-2xl border-2 border-b-4 px-4 py-3 text-sm leading-relaxed " + t.cls}>
          <span className="mb-1 block text-xs font-extrabold">{t.label}</span>
          <Inline text={block.text} />
        </div>
      );
    }
    case "table":
      return (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm text-ink-700">
            <thead>
              <tr>
                {block.head.map((h, i) => (
                  <th key={i} className="border-b-2 border-ink-200 px-2 py-1.5 font-extrabold text-ink-900">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, r) => (
                <tr key={r}>
                  {row.map((c, i) => (
                    <td key={i} className="border-b border-ink-200 px-2 py-1.5">
                      <Inline text={c} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
}

export function NotesScreen() {
  const [openNoteId, setOpenNoteId] = useState<string | null>(null);

  const open = (id: string | null) => {
    setOpenNoteId(id);
    scrollTop();
  };

  // 노트가 열려 있을 때만 뒤로가기 = 목록으로.
  useBack(() => open(null), openNoteId !== null);

  const found = openNoteId ? findNote(openNoteId) : null;

  // ─── 상세 뷰 ───────────────────────────────
  if (found) {
    const { note, siblings, index } = found;
    const prev = siblings[index - 1];
    const next = siblings[index + 1];
    // 이전/다음은 "목록 → 다른 노트"가 아니라 같은 자리에서 내용만 바꾸는 것이라
    // openNoteId 만 갈아끼운다(히스토리는 한 장 그대로 — 뒤로가기는 목록으로 간다).
    const navBtn =
      "min-h-11 flex-1 rounded-xl border-2 border-b-4 border-ink-200 bg-white px-3 text-sm font-bold text-ink-700 active:bg-ink-100";
    return (
      <>
        <button
          type="button"
          onClick={() => open(null)}
          className="min-h-11 self-start px-1 text-sm font-bold text-ink-500 hover:text-ink-700"
        >
          ← 목록
        </button>
        <article className="flex flex-col gap-3 rounded-2xl border border-ink-200 bg-white p-5">
          <h1 className="text-xl font-extrabold text-ink-900">
            {note.emoji} {note.title}
          </h1>
          <p className="text-sm text-ink-500">
            <Inline text={note.summary} />
          </p>
          {note.blocks.map((b, i) => (
            <NoteBlockView key={i} block={b} />
          ))}
        </article>
        {(prev || next) && (
          <div className="flex gap-2">
            {prev ? (
              <button type="button" onClick={() => open(prev.id)} className={navBtn}>
                ‹ 이전
              </button>
            ) : (
              <span className="flex-1" />
            )}
            {next ? (
              <button type="button" onClick={() => open(next.id)} className={navBtn}>
                다음 ›
              </button>
            ) : (
              <span className="flex-1" />
            )}
          </div>
        )}
      </>
    );
  }

  // ─── 목록 뷰 ───────────────────────────────
  return (
    <>
      <h2 className="text-xl font-extrabold text-ink-900">📒 공부노트</h2>
      {NOTE_SUBJECTS.map((s) => {
        const total = s.units.reduce((n, u) => n + u.notes.length, 0);
        return (
          <section key={s.id} className="flex flex-col gap-3">
            <div className="flex items-baseline justify-between">
              <h3 className="text-base font-extrabold text-ink-900">
                {s.emoji} {s.title}
              </h3>
              <span className="text-xs font-bold text-ink-400">총 {total}장</span>
            </div>
            {s.units.map((u) => (
              <div key={u.id} className="flex flex-col gap-1.5">
                <h4 className="px-1 text-xs font-extrabold text-ink-500">{u.title}</h4>
                {u.notes.length === 0 ? (
                  // 빈 단원도 보여준다 — 커리큘럼 전체 지도가 보여야 "어디까지 왔나"가 읽힌다.
                  <p className="rounded-2xl border border-dashed border-ink-200 px-4 py-3 text-xs text-ink-400">
                    준비 중
                  </p>
                ) : (
                  // 행 스타일은 마이 탭(MyScreen) 행과 같다 — 행 전체가 버튼.
                  <div className="divide-y divide-ink-200 rounded-2xl border border-ink-200 bg-white">
                    {u.notes.map((n) => (
                      <button
                        key={n.id}
                        type="button"
                        onClick={() => open(n.id)}
                        className="flex min-h-14 w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors active:bg-ink-100"
                      >
                        <span className="min-w-0">
                          <span className="block text-sm font-extrabold text-ink-900">
                            {n.emoji} {n.title}
                          </span>
                          <span className="block text-xs text-ink-500">
                            <Inline text={n.summary} />
                          </span>
                        </span>
                        <span className="shrink-0 text-lg font-extrabold text-ink-400">›</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </section>
        );
      })}
    </>
  );
}
