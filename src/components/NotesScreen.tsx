// =============================================================
// NotesScreen (공부노트 탭)
// - 책장 뷰: 과목마다 공책 표지 한 권. 표지를 누르면 그 과목의 목록 뷰.
// - 목록 뷰: 단원마다 "꼭 볼 N가지" 포스터 한 장 (인스타 인포그래픽 형식).
//   3열 타일 = 노트 1장 (그림 + 번호·짧은 제목). 타일 그림은 노트 본문의 첫 그림거리(비교·코드·단계·표)를 축소해 자동으로 그린다.
//   그래서 노트를 새로 써도 그림을 따로 그릴 필요가 없다. 타일 제목은 labels.ts.
// - 상세 뷰: 화이트보드 판서 스타일 (NoteBoard.tsx).
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
import { NoteBoard } from "./NoteBoard";
import { figureIcons } from "./NoteFigure";
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

// ─── "꼭 볼 N가지" 포스터 ───────────────────────────────

const pad2 = (n: number) => String(n).padStart(2, "0");
// 미니 그림 안에선 인라인 코드 표시(백틱)를 지우고 글자만 쓴다.
const plain = (t: string) => t.split("`").join("");

/** 타일 그림거리 고르기 — 노트 본문에서 처음 나오는 "그림이 되는 블록". 없으면 이모지. */
function pickArt(note: Note): NoteBlock | null {
  // 그림(figure)이 있으면 무조건 그게 대표 그림
  const fig = note.blocks.find((b) => b.type === "figure");
  if (fig) return fig;
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
    case "figure": {
      // 그림 속 아이콘 최대 3개. 흐름·순환이면 사이에 화살표.
      // 아이콘은 고정 크기가 아니라 타일 칸 폭에 따라 줄어든다 — 폰이 좁아도 칸 밖으로 안 나간다.
      const icons = figureIcons(b).slice(0, 3);
      const arrow = b.kind === "flow" || b.kind === "cycle";
      return (
        <div className="flex w-full min-w-0 items-center justify-center gap-[1cqw]">
          {icons.map((ic, i) => (
            <span key={i} className="contents">
              {i > 0 && (
                <span className="shrink-0 font-black leading-none text-reel" style={{ fontSize: "min(8cqw, 11px)" }}>
                  {arrow ? "→" : "·"}
                </span>
              )}
              {/* 크기를 타일 그림 칸 폭(cqw)에 묶는다 — 아이콘 3개 + 화살표 2개가 칸의 약 90%.
                  cqw 를 모르는 옛 WebView 는 style 을 무시하고 text-lg(18px)로 떨어진다. */}
              <span className="shrink-0 text-lg leading-none" style={{ fontSize: "min(24cqw, 30px)" }}>
                {ic}
              </span>
            </span>
          ))}
        </div>
      );
    }
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
            const label = NOTE_LABELS[n.id] ?? n.title;
            return (
              <button
                key={n.id}
                type="button"
                onClick={() => onOpen(n.id)}
                aria-label={n.title}
                className="flex min-w-0 flex-col rounded-[20px] bg-white p-1.5 pb-2.5 text-left shadow-chip transition-transform active:scale-[0.97]"
              >
                <span className="flex h-[84px] flex-col justify-center overflow-hidden rounded-[14px] bg-reel-tile p-1.5 [container-type:inline-size]">
                  <NoteArt note={n} />
                </span>
                {/* 번호와 제목을 한 줄 글로 이어 쓴다 — 줄이 넘치면 둘째 줄이 왼쪽 끝에서 시작한다. */}
                <span className="mt-2 break-keep px-1 text-[14px] font-black leading-tight tracking-tight text-reel-ink [overflow-wrap:anywhere]">
                  <span className="text-[13px] text-reel">{pad2(i + 1)}</span> {label}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}

// 공책 표지 색 — 과목 순서대로 돌려 쓴다. 흰 글자 규칙 때문에 accent / duo-green / ink-900 위에만.
const COVERS = [
  { cover: "bg-accent", spine: "bg-accent-dim" },
  { cover: "bg-duo-green", spine: "bg-duo-green-dim" },
  { cover: "bg-ink-900", spine: "bg-ink-700" },
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
        <NoteBoard note={note} kicker={`${unit.title} · ${pad2(index + 1)}`} />
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
