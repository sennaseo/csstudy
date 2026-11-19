// =============================================================
// NotesScreen (공부노트 탭) — 인스타그램 피드처럼
// - 맨 위 스토리 줄: 전체 · 과목들 · 저장됨. 동그라미를 누르면 그 과목 노트만 보인다.
// - 피드 보기: 노트 한 장 = 게시물 하나.
//     머리(과목 동그라미 · 단원) → 카드뉴스(옆으로 넘김, NoteBoard) → ♥ · 저장 → 제목·요약 글.
//   게시물은 5개씩 더 불러오고(아래로 내리면 자동), 화면 근처에 온 게시물만 카드를 그린다
//   — 111장을 한꺼번에 그리면 카드가 900장이 넘어 느려진다.
// - 그리드 보기: 단원마다 "꼭 볼 N가지" 3열 타일. 타일을 누르면 피드에서 그 게시물이 맨 위로 온다.
// - ♥(다 봤어요) · 저장은 이 기기 localStorage 에만 둔다.
// =============================================================

import { useEffect, useRef, useState } from "react";

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
    <section className="rounded-[28px] bg-gradient-to-b from-[#FDF6F9] to-reel-bg px-2.5 pb-3 pt-5">
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

// ─── ♥ · 저장 기록 ───
type Marks = { liked: string[]; saved: string[] };
const MARKS_KEY = "csstudy-note-marks";
function loadMarks(): Marks {
  try {
    const m = JSON.parse(window.localStorage.getItem(MARKS_KEY) ?? "{}") as Partial<Marks>;
    return { liked: m.liked ?? [], saved: m.saved ?? [] };
  } catch {
    return { liked: [], saved: [] };
  }
}

/** 과목 순서 그대로 펼친 전체 게시물 목록. */
const ALL_POSTS = NOTE_SUBJECTS.flatMap((subject) =>
  subject.units.flatMap((unit) => unit.notes.map((note, index) => ({ note, unit, subject, index }))),
);
type Post = (typeof ALL_POSTS)[number];

const PAGE = 5; // 한 번에 불러오는 게시물 수

/** 화면(#root 스크롤 상자) 근처에 오면 true — 한 번 보이면 계속 true. */
function useNear<T extends HTMLElement>(margin = "700px") {
  const ref = useRef<T>(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || near) return;
    if (typeof IntersectionObserver === "undefined") return setNear(true);
    const io = new IntersectionObserver((es) => es.some((e) => e.isIntersecting) && setNear(true), {
      root: document.getElementById("root"),
      rootMargin: margin,
    });
    io.observe(el);
    return () => io.disconnect();
  }, [near, margin]);
  return [ref, near] as const;
}

const HeartIcon = ({ on }: { on: boolean }) => (
  <svg viewBox="0 0 24 24" className="h-7 w-7" fill={on ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden>
    <path d="M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0112 7.6a4.3 4.3 0 017.5 2.7c0 5.6-7.5 10.2-7.5 10.2z" />
  </svg>
);
const SaveIcon = ({ on }: { on: boolean }) => (
  <svg viewBox="0 0 24 24" className="h-7 w-7" fill={on ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden>
    <path d="M6 4h12v16.5l-6-4.5-6 4.5z" />
  </svg>
);

/** 스토리 동그라미 — 고른 것은 분홍→보라 고리. */
function Story({ label, active, onClick, children }: { label: string; active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={active} className="flex w-[68px] shrink-0 flex-col items-center gap-1">
      <span className={"rounded-full p-[3px] " + (active ? "bg-gradient-to-tr from-[#F7B84B] via-accent to-[#A792F2]" : "bg-ink-200")}>
        <span className="flex h-[58px] w-[58px] items-center justify-center overflow-hidden rounded-full border-[3px] border-paper bg-white text-3xl">
          {children}
        </span>
      </span>
      <span className={"w-full truncate text-center text-[11px] " + (active ? "font-extrabold text-ink-900" : "font-semibold text-ink-500")}>{label}</span>
    </button>
  );
}

/** 피드 맨 아래 감시자 — 화면 근처에 오면 한 번 onMore 를 부른다. */
function LoadMore({ onMore }: { onMore: () => void }) {
  const [ref, near] = useNear<HTMLDivElement>("300px");
  const cb = useRef(onMore);
  cb.current = onMore;
  useEffect(() => {
    if (near) cb.current();
  }, [near]);
  return (
    <div ref={ref} className="py-6 text-center text-xs font-bold text-ink-400">
      불러오는 중…
    </div>
  );
}

/** 게시물 하나 = 노트 한 장. */
function FeedPost({
  post,
  liked,
  saved,
  onLike,
  onSave,
  onOpenNote,
}: {
  post: Post;
  liked: boolean;
  saved: boolean;
  onLike: () => void;
  onSave: () => void;
  onOpenNote: (id: string) => void;
}) {
  const { note, unit, subject, index } = post;
  const [ref, near] = useNear<HTMLElement>();
  const [more, setMore] = useState(false);
  return (
    <article ref={ref} id={"post-" + note.id} className="flex flex-col gap-2.5">
      {/* 머리 — 과목 동그라미 · 과목 이름 · 단원 */}
      <header className="flex items-center gap-2.5 px-1">
        <span className="rounded-full bg-gradient-to-tr from-[#F7B84B] via-accent to-[#A792F2] p-[2px]">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-paper bg-white text-lg">{subject.emoji}</span>
        </span>
        <span className="min-w-0 flex-1 leading-tight">
          <span className="block text-sm font-extrabold text-ink-900">{subject.title}</span>
          <span className="block truncate text-xs text-ink-500">
            {unit.title} · {pad2(index + 1)}
          </span>
        </span>
      </header>

      {/* 카드뉴스 — 화면 근처에 왔을 때만 그린다. 그 전엔 같은 높이의 빈 자리. */}
      {near ? (
        <NoteBoard note={note} kicker={`${unit.title} · ${pad2(index + 1)}`} onOpenNote={onOpenNote} />
      ) : (
        <div className="flex h-[calc(62dvh+56px)] min-h-[496px] items-center justify-center rounded-[28px] bg-cute-lav-bg text-4xl" aria-hidden>
          {note.emoji}
        </div>
      )}

      {/* ♥ · 저장 */}
      <div className="flex items-center justify-between px-1">
        <button type="button" onClick={onLike} aria-pressed={liked} aria-label="다 봤어요" className={"flex items-center gap-1.5 active:scale-90 " + (liked ? "text-accent" : "text-ink-700")}>
          <HeartIcon on={liked} />
          <span className="text-xs font-extrabold">{liked ? "다 봤어요" : "다 보면 눌러요"}</span>
        </button>
        <button type="button" onClick={onSave} aria-pressed={saved} aria-label="저장" className={"active:scale-90 " + (saved ? "text-ink-900" : "text-ink-700")}>
          <SaveIcon on={saved} />
        </button>
      </div>

      {/* 글 — 과목 이름(굵게) + 제목, 요약은 '더 보기' */}
      <p className="px-1 text-sm leading-snug text-ink-700">
        <span className="font-extrabold text-ink-900">{subject.title}</span> {note.emoji} {note.title}
        {more ? (
          <span className="mt-0.5 block text-ink-500">{note.summary.split("`").join("")}</span>
        ) : (
          <button type="button" onClick={() => setMore(true)} className="ml-1 text-ink-400">
            ... 더 보기
          </button>
        )}
      </p>
    </article>
  );
}

export function NotesScreen() {
  const [marks, setMarks] = useState<Marks>(loadMarks);
  // 스토리 필터: null = 전체, "saved" = 저장됨, 그 밖 = 과목 id
  const [filter, setFilter] = useState<string | null>(null);
  const [view, setView] = useState<"feed" | "grid">("feed");
  const [pinned, setPinned] = useState<string | null>(null); // 맨 위로 끌어올린 게시물
  const [limit, setLimit] = useState(PAGE);

  const toggle = (kind: keyof Marks, id: string) =>
    setMarks((m) => {
      const next = { ...m, [kind]: m[kind].includes(id) ? m[kind].filter((x) => x !== id) : [...m[kind], id] };
      try {
        window.localStorage.setItem(MARKS_KEY, JSON.stringify(next));
      } catch {
        /* 저장이 막혀도 화면은 계속 */
      }
      return next;
    });

  const pick = (f: string | null) => {
    setFilter(f);
    setPinned(null);
    setLimit(PAGE);
    scrollTop();
  };
  /** 타일·개념 카드에서 노트 열기 — 피드로 가서 그 게시물을 맨 위에 둔다. */
  const openNote = (id: string) => {
    const found = findNote(id);
    if (!found) return;
    setView("feed");
    setFilter(null);
    setPinned(id);
    setLimit(PAGE);
    scrollTop();
  };

  // 뒤로가기: 끌어올린 게시물·필터·그리드를 한 번에 풀고 기본 피드로
  const dirty = filter !== null || pinned !== null || view !== "feed";
  useBack(() => {
    setView("feed");
    pick(null);
  }, dirty);

  const base =
    filter === null ? ALL_POSTS : filter === "saved" ? ALL_POSTS.filter((p) => marks.saved.includes(p.note.id)) : ALL_POSTS.filter((p) => p.subject.id === filter);
  // 끌어올린 게시물이 있으면: 그 게시물부터 시작해 같은 과목 순서대로 이어 본다
  const posts = (() => {
    if (!pinned) return base;
    const i = ALL_POSTS.findIndex((p) => p.note.id === pinned);
    return i < 0 ? base : [...ALL_POSTS.slice(i), ...ALL_POSTS.slice(0, i)];
  })();

  const subjects = filter && filter !== "saved" ? NOTE_SUBJECTS.filter((s) => s.id === filter) : NOTE_SUBJECTS;

  return (
    <>
      {/* 윗줄 — 제목 + 피드/그리드 바꾸기 */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold text-ink-900">📒 공부노트</h2>
        <div className="flex rounded-full bg-ink-100 p-1" role="group" aria-label="보기 방식">
          {(["feed", "grid"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => {
                setView(v);
                setPinned(null);
                scrollTop();
              }}
              aria-pressed={view === v}
              className={"min-h-9 rounded-full px-3.5 text-xs font-extrabold " + (view === v ? "bg-white text-ink-900 shadow-chip" : "text-ink-500")}
            >
              {v === "feed" ? "피드" : "그리드"}
            </button>
          ))}
        </div>
      </div>

      {/* 스토리 줄 */}
      <div className="no-scrollbar -mx-4 flex gap-1.5 overflow-x-auto border-b border-ink-200 px-4 pb-3">
        <Story label="전체" active={filter === null} onClick={() => pick(null)}>
          <img src={`${import.meta.env.BASE_URL}mascot/face-happy.png`} alt="" className="h-11 w-11 object-contain" />
        </Story>
        {NOTE_SUBJECTS.map((s) => (
          <Story key={s.id} label={s.title} active={filter === s.id} onClick={() => pick(s.id)}>
            {s.emoji}
          </Story>
        ))}
        <Story label={`저장됨 ${marks.saved.length}`} active={filter === "saved"} onClick={() => pick("saved")}>
          🔖
        </Story>
      </div>

      {view === "grid" ? (
        // ─── 그리드 보기: 단원별 "꼭 볼 N가지" 타일 ───
        <section className="flex flex-col gap-3">
          {subjects.map((s) => s.units.map((u) => <UnitPoster key={u.id} subject={s} unit={u} onOpen={openNote} />))}
        </section>
      ) : posts.length === 0 ? (
        <p className="py-16 text-center text-sm text-ink-500">
          저장한 노트가 아직 없어요.
          <br />
          게시물 오른쪽 아래 🔖 를 눌러 모아 보세요.
        </p>
      ) : (
        // ─── 피드 보기 ───
        <section className="flex flex-col gap-8">
          {posts.slice(0, limit).map((p) => (
            <FeedPost
              key={p.note.id}
              post={p}
              liked={marks.liked.includes(p.note.id)}
              saved={marks.saved.includes(p.note.id)}
              onLike={() => toggle("liked", p.note.id)}
              onSave={() => toggle("saved", p.note.id)}
              onOpenNote={openNote}
            />
          ))}
          {limit < posts.length ? (
            // key 가 바뀌면 새로 만들어져서, 다음 5개도 끝에 닿을 때마다 이어서 불러온다
            <LoadMore key={limit} onMore={() => setLimit((n) => n + PAGE)} />
          ) : (
            <p className="py-6 text-center text-xs font-bold text-ink-400">✓ 모두 봤어요</p>
          )}
        </section>
      )}
    </>
  );
}
