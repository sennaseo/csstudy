// =============================================================
// NotesScreen (공부노트 탭)
// - 책장 뷰: 과목마다 공책 표지 한 권. 표지를 누르면 그 과목의 목록 뷰.
// - 목록 뷰: 단원마다 "꼭 볼 N가지" 포스터 한 장 (인스타 인포그래픽 형식).
//   3열 타일 = 노트 1장. 타일 그림은 노트 본문의 첫 그림거리(비교·코드·단계·표)를 축소해 자동으로 그린다.
//   그래서 노트를 새로 써도 그림을 따로 그릴 필요가 없다. 타일 이름표는 labels.ts.
// - 상세 뷰: 같은 포스터 톤. h2 마다 "01 제목" 번호 카드로 묶어 위에서부터 그린다.
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
import { NOTE_LABELS } from "../data/notes/labels";
import type { Note, NoteBlock, NoteSubject, NoteUnit } from "../data/notes/types";
import { useBack } from "../utils/useBack";

// 노트 id → { 노트, 같은 단원의 노트 목록 } 을 찾는다. 노트 수가 적어서 매번 훑어도 충분하다.
function findNote(id: string) {
  for (const s of NOTE_SUBJECTS)
    for (const u of s.units) {
      const i = u.notes.findIndex((n) => n.id === id);
      if (i >= 0) return { note: u.notes[i], unit: u, siblings: u.notes, index: i };
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
  analogy: { label: "🎈 비유", cls: "border-reel bg-reel-soft text-reel-dim" },
  warn: { label: "⚠️ 자주 하는 실수", cls: "border-duo-red-dim bg-duo-red-soft text-duo-red-ink" },
  memo: { label: "📝 내 메모", cls: "border-duo-green-dim bg-duo-green-tint text-duo-green-ink" },
} as const;

// compare 열 색 — good=O(초록), bad=X(빨강), 없으면 회색.
const TONE = {
  good: { head: "✅ ", cls: "border-duo-green-dim bg-duo-green-tint", title: "text-duo-green-ink" },
  bad: { head: "❌ ", cls: "border-duo-red-dim bg-duo-red-soft", title: "text-duo-red-ink" },
  none: { head: "", cls: "border-ink-200 bg-ink-100", title: "text-ink-900" },
} as const;

/** 블록 하나 그리기 — 블록 종류(type)마다 모양만 다르다. no 는 h2 번호 배지용. */
function NoteBlockView({ block, no }: { block: NoteBlock; no: number }) {
  switch (block.type) {
    case "h2":
      return (
        <h2 className="mt-3 flex items-center gap-2 border-b-2 border-ink-200 pb-1.5 text-base font-extrabold text-ink-900">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-reel text-xs font-extrabold text-white">
            {no}
          </span>
          <Inline text={block.text} />
        </h2>
      );
    case "key":
      return (
        <div className="rounded-2xl bg-reel px-4 py-5 text-center text-base font-extrabold leading-snug text-white [&_code]:bg-white/20 [&_code]:text-white">
          <Inline text={block.text} />
        </div>
      );
    case "p":
      return (
        <p className="text-sm leading-relaxed text-ink-700">
          <Inline text={block.text} />
        </p>
      );
    case "code":
      return (
        <div className="overflow-hidden rounded-xl border border-ink-200">
          <pre className="overflow-x-auto whitespace-pre bg-ink-100 p-3 font-mono text-xs leading-relaxed text-ink-900">
            {block.code}
          </pre>
          {block.out !== undefined && (
            <div className="border-t border-ink-200 bg-ink-900 px-3 py-2 font-mono text-xs leading-relaxed text-white">
              <span className="mb-0.5 block font-sans text-[11px] font-extrabold text-ink-300">▶ 결과</span>
              <span className="block whitespace-pre-wrap">{block.out}</span>
            </div>
          )}
        </div>
      );
    case "list": {
      if (block.style === "flow")
        return (
          <ol className="flex flex-col">
            {block.items.map((s, i) => (
              <li key={i} className="flex flex-col items-center">
                {i > 0 && <span className="text-lg leading-6 text-reel">↓</span>}
                <div className="flex w-full items-center gap-3 rounded-xl border-2 border-reel bg-reel-soft px-3 py-2.5 text-sm font-bold text-ink-900">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-reel text-xs text-white">
                    {i + 1}
                  </span>
                  <span>
                    <Inline text={s} />
                  </span>
                </div>
              </li>
            ))}
          </ol>
        );
      if (block.style === "check")
        return (
          <div className="mt-3 rounded-2xl border-2 border-b-4 border-duo-green-dim bg-duo-green-tint px-4 py-3">
            <span className="mb-1.5 block text-xs font-extrabold text-duo-green-ink">✅ 이것만 기억</span>
            <ul className="flex flex-col gap-1.5 text-sm leading-relaxed text-ink-700">
              {block.items.map((it, i) => (
                <li key={i} className="flex gap-2">
                  <span className="font-extrabold text-duo-green-ink">✓</span>
                  <span>
                    <Inline text={it} />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        );
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
    case "compare":
      return (
        <div className={"grid gap-2 " + (block.cols.length > 1 ? "grid-cols-2" : "grid-cols-1")}>
          {block.cols.map((c, i) => {
            const t = TONE[c.tone ?? "none"];
            return (
              <div key={i} className={"min-w-0 rounded-xl border-2 p-3 " + t.cls}>
                <div className={"mb-1.5 text-sm font-extrabold " + t.title}>
                  {t.head}
                  <Inline text={c.title} />
                </div>
                <ul className="flex flex-col gap-1 text-xs leading-relaxed text-ink-700">
                  {c.items.map((it, j) => (
                    <li key={j} className="break-words">
                      <Inline text={it} />
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      );
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

// ─── "꼭 볼 N가지" 포스터 ───────────────────────────────

const pad2 = (n: number) => String(n).padStart(2, "0");
// 미니 그림 안에선 인라인 코드 표시(백틱)를 지우고 글자만 쓴다.
const plain = (t: string) => t.split("`").join("");

/** 타일 그림거리 고르기 — 노트 본문에서 처음 나오는 "그림이 되는 블록". 없으면 이모지. */
function pickArt(note: Note): NoteBlock | null {
  for (const b of note.blocks) {
    if (b.type === "compare" && b.cols.length >= 2) return b;
    if (b.type === "code") return b;
    if (b.type === "list" && b.style === "flow") return b;
    if (b.type === "table") return b;
  }
  return null;
}

// 미니 그림 속 회색 줄 — 글자 대신 "내용이 있다"는 느낌만 주는 스켈레톤.
const Skel = ({ w }: { w: string }) => <span className={"block h-1.5 rounded-full bg-ink-200 " + w} />;

const ART_TONE = {
  good: "border-duo-green text-duo-green-ink",
  bad: "border-duo-red text-duo-red-ink",
  none: "border-reel/40 text-reel-ink",
} as const;

/** 타일 안 미니 그림. 실제 노트 내용을 손바닥 크기로 줄여 그린다. */
function NoteArt({ note }: { note: Note }) {
  const b = pickArt(note);
  if (!b) return <span className="self-center text-4xl">{note.emoji}</span>;
  switch (b.type) {
    case "compare":
      return (
        // 위아래로 쌓는다 — 3열 타일에서 좌우로 나누면 칸이 좁아 제목이 "정하…"로 잘린다.
        <div className="flex flex-col gap-1.5">
          {b.cols.slice(0, 2).map((c, i) => (
            <div key={i} className={"min-w-0 rounded-md border-2 bg-white px-1.5 py-1 " + ART_TONE[c.tone ?? "none"]}>
              <span className="block truncate text-[9px] font-black leading-tight">
                {c.tone === "good" ? "✓ " : c.tone === "bad" ? "✕ " : ""}
                {plain(c.title)}
              </span>
              <span className="mt-1 block">
                <Skel w="w-3/4" />
              </span>
            </div>
          ))}
        </div>
      );
    case "code": {
      const lines = b.code.split("\n").filter((l) => l.trim()).slice(0, b.out ? 2 : 3);
      const out = b.out?.split("\n")[0];
      return (
        <div className="overflow-hidden rounded-lg bg-reel-ink px-1.5 py-1.5 font-mono text-[8px] leading-[1.45] text-[#C9C9FF]">
          {lines.map((l, i) => (
            <span key={i} className="block truncate whitespace-pre">
              {l}
            </span>
          ))}
          {out !== undefined && <span className="block truncate text-[#7FE3A0]">▶ {out}</span>}
        </div>
      );
    }
    case "list":
      return (
        <div className="flex flex-col gap-1">
          {b.items.slice(0, 3).map((it, i) => (
            <span key={i} className="flex min-w-0 items-center gap-1 rounded-md border border-reel/40 bg-white px-1 py-0.5">
              <span className="flex h-3 w-3 shrink-0 items-center justify-center rounded-full bg-reel text-[7px] font-black text-white">
                {i + 1}
              </span>
              <span className="truncate text-[8px] font-bold text-reel-ink">{plain(it)}</span>
            </span>
          ))}
        </div>
      );
    case "table":
      return (
        <div className="overflow-hidden rounded-md border border-ink-200 bg-white text-[8px] leading-tight">
          {[b.head, ...b.rows.slice(0, 2)].map((row, r) => (
            <div key={r} className={"grid grid-cols-2 " + (r === 0 ? "bg-reel font-black text-white" : "border-t border-ink-200 text-ink-700")}>
              {row.slice(0, 2).map((c, i) => (
                <span key={i} className="truncate px-1 py-0.5">
                  {plain(c)}
                </span>
              ))}
            </div>
          ))}
        </div>
      );
    default:
      return <span className="self-center text-4xl">{note.emoji}</span>;
  }
}

/** 단원 하나 = 포스터 한 장. 키커(단원명) + 큰 제목(꼭 볼 N가지) + 3열 타일. */
function UnitPoster({ subject, unit, onOpen }: { subject: NoteSubject; unit: NoteUnit; onOpen: (id: string) => void }) {
  return (
    <section className="rounded-[28px] bg-gradient-to-b from-[#F6F6FC] to-reel-bg px-2.5 pb-3 pt-5">
      <p className="px-1.5 text-sm font-black tracking-tight text-reel">
        {subject.emoji} {unit.title}
      </p>
      <h3 className="px-1.5 text-[34px] font-black leading-[1.15] tracking-tighter text-reel-ink">
        {unit.notes.length === 0 ? "준비 중" : `꼭 볼 ${unit.notes.length}가지`}
      </h3>
      {unit.notes.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-2">
          {unit.notes.map((n, i) => {
            const label = NOTE_LABELS[n.id] ?? { short: n.title, en: "" };
            return (
              <button
                key={n.id}
                type="button"
                onClick={() => onOpen(n.id)}
                aria-label={n.title}
                className="flex min-w-0 flex-col rounded-[20px] bg-white p-1.5 pb-2.5 text-left shadow-chip transition-transform active:scale-[0.97]"
              >
                <span className="flex h-[84px] flex-col justify-center overflow-hidden rounded-[14px] bg-reel-tile p-2">
                  <NoteArt note={n} />
                </span>
                {/* 번호와 제목을 한 줄 글로 이어 쓴다 — 줄이 넘치면 둘째 줄이 왼쪽 끝에서 시작한다. */}
                <span className="mt-2 break-keep px-1 text-[14px] font-black leading-tight tracking-tight text-reel-ink [overflow-wrap:anywhere]">
                  <span className="text-[13px] text-reel">{pad2(i + 1)}</span> {label.short}
                </span>
                <span className="mt-0.5 truncate px-1 text-[11px] font-bold text-reel-sub">{label.en}</span>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}

/** 상세 뷰 본문 — 블록을 h2 기준으로 묶어 "01 제목" 번호 카드로 그린다.
 *  key 는 맨 위 큰 카드, 끝의 check("이것만 기억")는 카드 밖 마무리로 둔다. */
function NoteBody({ note }: { note: Note }) {
  const head: NoteBlock[] = [];
  const sections: { title: string; blocks: NoteBlock[] }[] = [];
  const tail: NoteBlock[] = [];
  for (const b of note.blocks) {
    if (b.type === "h2") sections.push({ title: b.text, blocks: [] });
    else if (b.type === "list" && b.style === "check") tail.push(b);
    else if (sections.length === 0) head.push(b);
    else sections[sections.length - 1].blocks.push(b);
  }
  return (
    <>
      {head.map((b, i) => (
        <NoteBlockView key={"h" + i} block={b} no={0} />
      ))}
      {sections.map((sec, i) => (
        <div key={i} className="flex flex-col gap-3 rounded-[22px] bg-white p-4 shadow-chip">
          <h2 className="flex items-baseline gap-2 text-lg font-black leading-snug tracking-tight text-reel-ink">
            <span className="shrink-0 text-reel">{pad2(i + 1)}</span>
            <span>
              <Inline text={sec.title} />
            </span>
          </h2>
          {sec.blocks.map((b, j) => (
            <NoteBlockView key={j} block={b} no={0} />
          ))}
        </div>
      ))}
      {tail.map((b, i) => (
        <NoteBlockView key={"t" + i} block={b} no={0} />
      ))}
    </>
  );
}

// 공책 표지 색 — 과목 순서대로 돌려 쓴다. 흰 글자 규칙 때문에 accent / duo-green 위에만.
const COVERS = [
  { cover: "bg-accent", spine: "bg-accent-dim" },
  { cover: "bg-duo-green", spine: "bg-duo-green-dim" },
] as const;

export function NotesScreen() {
  const [openSubjectId, setOpenSubjectId] = useState<string | null>(null);
  const [openNoteId, setOpenNoteId] = useState<string | null>(null);

  const open = (id: string | null) => {
    setOpenNoteId(id);
    scrollTop();
  };

  const openSubject = (id: string | null) => {
    setOpenSubjectId(id);
    scrollTop();
  };

  // 뒤로가기: 노트 → 목록 → 책장 순으로 한 칸씩. 과목이 먼저 열리니 장부에도 먼저 쌓인다.
  useBack(() => openSubject(null), openSubjectId !== null);
  useBack(() => open(null), openNoteId !== null);

  const found = openNoteId ? findNote(openNoteId) : null;

  // ─── 상세 뷰 ───────────────────────────────
  if (found) {
    const { note, unit, siblings, index } = found;
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
        <article className="flex flex-col gap-3 rounded-[28px] bg-gradient-to-b from-[#F6F6FC] to-reel-bg px-3 pb-4 pt-6">
          <header className="flex flex-col gap-1 px-1.5 pb-1">
            <p className="text-sm font-black tracking-tight text-reel">
              {unit.title} · {pad2(index + 1)}
            </p>
            <h1 className="break-keep text-[28px] font-black leading-[1.2] tracking-tighter text-reel-ink">
              {note.title}
            </h1>
            <p className="text-sm font-bold text-reel-sub">
              <Inline text={note.summary} />
            </p>
          </header>
          <NoteBody note={note} />
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

  // ─── 책장 뷰 ───────────────────────────────
  const subject = NOTE_SUBJECTS.find((s) => s.id === openSubjectId);
  if (!subject)
    return (
      <>
        <h2 className="text-xl font-extrabold text-ink-900">📒 공부노트</h2>
        <div className="grid grid-cols-2 gap-3">
          {NOTE_SUBJECTS.map((s, i) => {
            const c = COVERS[i % COVERS.length];
            const total = s.units.reduce((n, u) => n + u.notes.length, 0);
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => openSubject(s.id)}
                className={
                  "relative flex aspect-[3/4] overflow-hidden rounded-r-2xl rounded-l-md border-b-4 border-black/20 text-left shadow-md transition-transform active:translate-y-0.5 " +
                  c.cover
                }
              >
                {/* 책등 + 스프링 고리 */}
                <span className={"flex w-5 shrink-0 flex-col items-center justify-evenly " + c.spine}>
                  {[0, 1, 2, 3, 4].map((k) => (
                    <span key={k} className="h-1.5 w-1.5 rounded-full bg-white/70" />
                  ))}
                </span>
                <span className="flex min-w-0 flex-1 flex-col items-center justify-center gap-3 p-3">
                  <span className="text-4xl">{s.emoji}</span>
                  {/* 표지 이름표 — 줄 쳐진 흰 스티커 */}
                  <span className="w-full rounded-lg bg-white px-2 py-2 text-center shadow-sm [background-image:repeating-linear-gradient(transparent_0_15px,rgb(0_0_0/0.06)_15px_16px)]">
                    <span className="block truncate text-base font-extrabold text-ink-900">{s.title}</span>
                    <span className="block text-[11px] font-bold text-ink-500">
                      {s.units.length}단원 · {total}장
                    </span>
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </>
    );

  // ─── 목록 뷰 ───────────────────────────────
  const s = subject;
  const total = s.units.reduce((n, u) => n + u.notes.length, 0);
  return (
    <>
      <button
        type="button"
        onClick={() => openSubject(null)}
        className="min-h-11 self-start px-1 text-sm font-bold text-ink-500 hover:text-ink-700"
      >
        ← 책장
      </button>
      <section className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between">
          <h2 className="text-xl font-extrabold text-ink-900">
            {s.emoji} {s.title}
          </h2>
          <span className="text-xs font-bold text-ink-400">총 {total}장</span>
        </div>
        {s.units.map((u) => (
          <UnitPoster key={u.id} subject={s} unit={u} onOpen={open} />
        ))}
      </section>
    </>
  );
}
