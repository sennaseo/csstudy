// =============================================================
// NoteBoard — 공부노트 상세를 "카드뉴스" 로 그린다 (옆으로 넘겨 보는 카드 묶음).
// - 표지 → 핵심 한 장 → 소제목마다 한 장(길면 여러 장으로 나눔) → "이것만 기억" 마무리.
// - 파스텔 라벤더 톤: 제목 알약, 파스텔 상자, 체크박스 목록, 마스코트 말풍선.
// - 강의실 화이트보드에 마커로 정리한 판서 느낌: 손글씨(Gaegu), 빨강·파랑·초록 마커,
//   손으로 그린 듯 삐뚤한 상자(.sketch), 동그라미 번호 ①②③.
// - 단계(flow)는 2열 지그재그(1→2, 4←3, 5→6 …)로 판서처럼 배치한다.
// - Gaegu 는 기본 자간이 넓어 띄엄띄엄 보여서 보드 전체 자간을 좁힌다 (코드는 원래 자간).
// - 코드만은 고정폭 글꼴 그대로 — 손글씨 코드는 읽기도 베끼기도 어렵다.
// =============================================================

import { createContext, useContext, useRef, useState } from "react";

import { aliasesOfNote, conceptOf, isConceptName, splitConcepts, type Concept } from "../data/notes/concepts";
import type { Note, NoteBlock } from "../data/notes/types";
import { ConceptSheet } from "./ConceptSheet";
import { NoteFigure } from "./NoteFigure";

/**
 * 본문 낱말 → 개념 링크에 필요한 것들. NoteBoard 가 노트 한 장마다 새로 만든다.
 * first: 한 노트 안에서 같은 개념은 처음 나온 문장에만 밑줄 — 매번 그으면 보드가 밑줄투성이가 된다.
 *        "개념 → 처음 나오는 문장"을 그리기 전에 미리 계산해 둔다(firstSentences).
 *        그리는 도중에 "그었음"을 기록하면 개발 모드의 이중 렌더에서 밑줄이 전부 사라진다 — 실제로 그랬다.
 */
type Linker = { skip: Set<string>; first: Map<string, string>; pick: (name: string) => void };

/** 이 블록에서 밑줄 대상이 되는 문장들 — 아래 BoardBlock 에서 `link` 를 켠 곳과 같아야 한다. */
function linkableTexts(b: NoteBlock): string[] {
  switch (b.type) {
    case "p":
    case "tip":
      return [b.text];
    case "list":
      return b.items;
    case "compare":
      return b.cols.flatMap((c) => c.items);
    case "table":
      return b.rows.flat();
    default:
      return [];
  }
}

/** 문장 하나에서 찾은 개념 이름들 (나온 순서대로). Inline 과 같은 규칙으로 자른다. */
function conceptsIn(text: string, skip: Set<string>): string[] {
  const out: string[] = [];
  text.split("`").forEach((part, i) => {
    if (i % 2 === 1) {
      if (isConceptName(part) && !skip.has(part)) out.push(part);
    } else for (const seg of splitConcepts(part, skip)) if (seg.concept) out.push(seg.concept);
  });
  return out;
}

/** 개념 → 그 개념이 처음 나오는 문장. 보드에 그려지는 순서(blocks 순서)대로 훑는다. */
function firstSentences(blocks: NoteBlock[], skip: Set<string>): Map<string, string> {
  const first = new Map<string, string>();
  for (const b of blocks) for (const t of linkableTexts(b)) for (const c of conceptsIn(t, skip)) if (!first.has(c)) first.set(c, t);
  return first;
}
const LinkCtx = createContext<Linker | null>(null);

/** 눌러서 개념을 다시 보는 낱말 — 파란 점선 밑줄. */
function ConceptWord({ name, children }: { name: string; children: React.ReactNode }) {
  const ctx = useContext(LinkCtx)!;
  return (
    <button
      type="button"
      onClick={() => ctx.pick(name)}
      className="inline cursor-pointer rounded-sm text-inherit underline decoration-marker-blue decoration-dotted decoration-2 underline-offset-[5px] hover:bg-marker-blue/10 active:bg-marker-blue/20"
    >
      {children}
    </button>
  );
}

/**
 * 인라인 `코드` — 백틱으로 쪼개면 홀수 번째 조각이 코드 부분이다.
 * link 를 켜면 개념 사전에 있는 낱말(처음 나온 곳)을 눌러 볼 수 있게 만든다.
 * 제목·핵심 한 줄·요약처럼 큰 글자에는 켜지 않는다 — 거긴 읽는 곳이지 누르는 곳이 아니다.
 */
export function Inline({ text, link = false }: { text: string; link?: boolean }) {
  const ctx = useContext(LinkCtx);
  const linking = link && ctx;
  const mine = new Set<string>(); // 이 문장 안에서도 처음 한 번만
  // 순수 계산: "이 개념이 처음 나오는 문장이 바로 나인가" — 몇 번을 그려도 답이 같다.
  const claim = (name: string) => {
    if (!ctx || mine.has(name) || ctx.first.get(name) !== text) return false;
    mine.add(name);
    return true;
  };
  return (
    <>
      {text.split("`").map((part, i) => {
        if (i % 2 === 1) {
          const code = (
            <code className="rounded-md bg-cute-lav-soft px-1 font-mono text-[0.88em] font-semibold text-cute-blue-ink">{part}</code>
          );
          // `HashMap` 처럼 코드 조각 하나가 통째로 개념 이름이면 그 조각을 누르게
          return linking && isConceptName(part) && !ctx.skip.has(part) && claim(part) ? (
            <ConceptWord key={i} name={part}>
              {code}
            </ConceptWord>
          ) : (
            <span key={i}>{code}</span>
          );
        }
        if (!linking) return <span key={i}>{part}</span>;
        return (
          <span key={i}>
            {splitConcepts(part, ctx.skip).map((seg, j) =>
              seg.concept && claim(seg.concept) ? (
                <ConceptWord key={j} name={seg.concept}>
                  {seg.text}
                </ConceptWord>
              ) : (
                seg.text
              ),
            )}
          </span>
        );
      })}
    </>
  );
}

// ─── 카드 안 블록 — 파스텔 카드뉴스 톤 ───
// 둥근 상자, 파스텔 머리띠, 체크박스 목록, 마스코트 말풍선. 색은 tailwind 의 cute.* 토큰.

const MASCOT = (name: string) => `${import.meta.env.BASE_URL}mascot/${name}.png`;

/** 파스텔 4색 돌려 쓰기 — 상자 머리띠·단계 번호. */
const PASTEL = [
  { bg: "bg-cute-pink", ink: "text-cute-pink-ink", border: "border-cute-pink" },
  { bg: "bg-cute-blue", ink: "text-cute-blue-ink", border: "border-cute-blue" },
  { bg: "bg-cute-yellow", ink: "text-cute-yellow-ink", border: "border-cute-yellow" },
  { bg: "bg-cute-lav-soft", ink: "text-cute-navy", border: "border-cute-lav-soft" },
] as const;
const TONE_BOX = {
  good: { bg: "bg-cute-mint", ink: "text-cute-mint-ink", border: "border-cute-mint", mark: "✓ " },
  bad: { bg: "bg-cute-pink", ink: "text-cute-pink-ink", border: "border-cute-pink", mark: "✕ " },
} as const;

// 팁 = 마스코트가 말풍선으로 알려 준다.
const BUBBLE = {
  analogy: { label: "비유하자면", face: "face-wink", ink: "text-cute-blue-ink" },
  warn: { label: "자주 하는 실수!", face: "face-sad", ink: "text-cute-pink-ink" },
  memo: { label: "메모", face: "face-happy", ink: "text-cute-mint-ink" },
} as const;

function BoardBlock({ block }: { block: NoteBlock }) {
  switch (block.type) {
    case "key":
      // 핵심 한 줄 — 라벤더 띠
      return (
        <div className="rounded-2xl bg-cute-lav-soft px-4 py-3 text-center text-[16px] font-extrabold leading-snug text-cute-navy">
          <Inline text={block.text} />
        </div>
      );
    case "figure":
      return <NoteFigure block={block} />;
    case "h2":
      return null; // 섹션 제목은 NoteBoard 가 알약으로 직접 그린다
    case "p":
      return (
        <p className="text-[15px] font-semibold leading-relaxed">
          <Inline text={block.text} link />
        </p>
      );
    case "code":
      return (
        <div className="overflow-hidden rounded-2xl border-2 border-cute-lav bg-[#FAF8FF]">
          <pre className="overflow-x-auto whitespace-pre p-3 font-mono text-[11.5px] font-medium leading-relaxed text-cute-navy">{block.code}</pre>
          {block.out !== undefined && (
            <div className="bg-cute-mint px-3 py-2">
              <span className="text-[12px] font-extrabold text-cute-mint-ink">▶ 결과</span>
              <pre className="whitespace-pre-wrap font-mono text-[11.5px] font-semibold leading-relaxed text-cute-mint-ink">{block.out}</pre>
            </div>
          )}
        </div>
      );
    case "list": {
      if (block.style === "flow")
        // 단계: 파스텔 번호 상자를 ↓ 로 잇는다
        return (
          <ol className="flex flex-col items-stretch">
            {block.items.map((it, i) => {
              const c = PASTEL[i % PASTEL.length];
              return (
                <li key={i} className="flex flex-col items-center">
                  {i > 0 && <span className="text-[15px] font-black leading-5 text-cute-lav">↓</span>}
                  <div className={"flex w-full items-center gap-2.5 rounded-2xl px-3 py-2 " + c.bg}>
                    <span className={"flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-[13px] font-black " + c.ink}>{i + 1}</span>
                    <span className="min-w-0 break-words text-[14px] font-bold leading-snug">
                      <Inline text={it} link />
                    </span>
                  </div>
                </li>
              );
            })}
          </ol>
        );
      if (block.style === "check")
        return (
          <ul className="flex flex-col gap-2.5">
            {block.items.map((it, i) => (
              <li key={i} className="flex items-start gap-2.5 text-[15px] font-bold leading-snug">
                <span className="mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-cute-lav text-[12px] font-black text-white">✓</span>
                <span>
                  <Inline text={it} link />
                </span>
              </li>
            ))}
          </ul>
        );
      return (
        <ul className="flex flex-col gap-1.5 text-[14.5px] font-semibold leading-snug">
          {block.items.map((it, i) => (
            <li key={i} className="flex gap-2">
              <span className="shrink-0 font-black text-cute-lav">{block.ordered ? `${i + 1}.` : "•"}</span>
              <span>
                <Inline text={it} link />
              </span>
            </li>
          ))}
        </ul>
      );
    }
    case "compare":
      // 나란히 상자 — 파스텔 머리띠 + 흰 몸통
      return (
        <div className={"grid gap-2.5 " + (block.cols.length > 1 ? "grid-cols-2" : "grid-cols-1")}>
          {block.cols.map((c, i) => {
            const t = c.tone ? TONE_BOX[c.tone] : { ...PASTEL[i % PASTEL.length], mark: "" };
            return (
              <div key={i} className={"min-w-0 overflow-hidden rounded-2xl border-2 bg-white " + t.border}>
                <div className={"px-2 py-1.5 text-center text-[14.5px] font-black leading-tight " + t.bg + " " + t.ink}>
                  {t.mark}
                  <Inline text={c.title} />
                </div>
                <ul className="flex flex-col gap-1 px-2.5 py-2 text-[13px] font-semibold leading-snug">
                  {c.items.map((it, j) => (
                    <li key={j} className="break-words">
                      <Inline text={it} link />
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      );
    case "tip": {
      const t = BUBBLE[block.kind];
      return (
        <div className="flex items-end gap-1.5">
          <img src={MASCOT(t.face)} alt="" className="h-14 w-14 shrink-0 object-contain" />
          <div className="relative min-w-0 flex-1 rounded-2xl rounded-bl-sm border-2 border-cute-lav bg-white px-3 py-2 text-[13.5px] font-semibold leading-snug">
            <span className={"block text-[12px] font-black " + t.ink}>{t.label}</span>
            <Inline text={block.text} link />
          </div>
        </div>
      );
    }
    case "table":
      return (
        <div className="overflow-x-auto rounded-2xl border-2 border-cute-blue">
          <table className="w-full border-collapse text-left text-[13px] font-semibold leading-snug">
            <thead>
              <tr>
                {block.head.map((h, i) => (
                  <th key={i} className="bg-cute-blue px-2 py-1.5 text-center text-[13.5px] font-black text-cute-blue-ink">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, r) => (
                <tr key={r}>
                  {row.map((c, i) => (
                    <td key={i} className={"border-t-2 border-cute-blue/60 px-2 py-1.5 align-top " + (i > 0 ? "border-l-2" : "")}>
                      <Inline text={c} link />
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

// ─── 카드뉴스 쪽 나누기 ───
// 카드 한 장에 들어갈 분량을 "줄 수" 어림값으로 센다. 넘치면 다음 카드로 넘긴다.
// 어림이라 조금 넘칠 수 있어서, 카드 안은 세로 스크롤도 된다(안전망).

/** 표 한 줄의 높이 어림 — 칸 너비는 글 길이에 따라 나뉘므로, 줄 전체 글자 수로 접히는 줄 수를 어림한다. */
function tableRowWeight(row: string[]): number {
  const chars = row.reduce((n, c) => n + c.split("`").join("").length, 0);
  return 0.6 + Math.ceil(chars / 17) * 0.85;
}

/** 블록 하나가 차지하는 높이 어림 (본문 한 줄 ≈ 1). */
function weightOf(b: NoteBlock): number {
  const len = (t: string, per: number) => Math.ceil(t.split("`").join("").length / per);
  switch (b.type) {
    case "key":
      return 2 + len(b.text, 20);
    case "p":
      return 0.5 + len(b.text, 21) * 1.1;
    case "code":
      return 1.5 + b.code.split("\n").length * 0.8 + (b.out !== undefined ? 1.8 + b.out.split("\n").length * 0.8 : 0);
    case "list":
      if (b.style === "flow") return b.items.reduce((n, it) => n + 1.6 + len(it, 19) * 0.9, 0);
      return 0.5 + b.items.reduce((n, it) => n + len(it, 20) + 0.4, 0);
    case "compare":
      return 2.6 + Math.max(...b.cols.map((c) => c.items.reduce((n, it) => n + len(it, b.cols.length > 1 ? 10 : 22) * 0.85 + 0.2, 0)));
    case "tip":
      return 2.2 + len(b.text, 17) * 0.85;
    case "table":
      return 1.8 + b.rows.reduce((n, r) => n + tableRowWeight(r), 0);
    case "figure":
      if (b.kind === "flow") return b.nodes.length <= 3 ? 5 : b.nodes.length * 3.3;
      if (b.kind === "cycle") return 12;
      if (b.kind === "tree") return 8 + Math.max(0, ...b.children.map((c) => c.leaves?.length ?? 0)) * 1.2;
      if (b.kind === "stack") return b.layers.length * (b.nested ? 2.6 : 2);
      return Math.max(b.vars.length, b.objs.length) * 2.6 + 1;
    default:
      return 0;
  }
}

/** 카드 한 장 분량 (줄 수 어림). 실제로 재 보면 카드 몸통이 22줄쯤 — 어림 오차만큼 여유를 둔다. */
const PAGE_BUDGET = 20;

/** 블록들을 카드 분량으로 끊는다. 혼자서 넘치는 블록은 혼자 한 장을 쓴다. */
function paginate(input: NoteBlock[], budget = PAGE_BUDGET): NoteBlock[][] {
  // 한 장에 안 들어가는 긴 표는 줄 단위로 끊어 여러 표로 만든다 (머리줄은 장마다 다시 붙는다)
  const blocks = input.flatMap((b): NoteBlock[] => {
    if (b.type !== "table" || weightOf(b) <= budget) return [b];
    const parts: NoteBlock[] = [];
    let rows: string[][] = [];
    let used = 2;
    for (const r of b.rows) {
      const w = tableRowWeight(r);
      if (rows.length && used + w > budget) {
        parts.push({ ...b, rows });
        rows = [];
        used = 2;
      }
      rows.push(r);
      used += w;
    }
    if (rows.length) parts.push({ ...b, rows });
    return parts;
  });
  const pages: NoteBlock[][] = [];
  let cur: NoteBlock[] = [];
  let used = 0;
  for (const b of blocks) {
    const w = weightOf(b);
    if (cur.length && used + w > budget) {
      pages.push(cur);
      cur = [];
      used = 0;
    }
    cur.push(b);
    used += w;
  }
  if (cur.length) pages.push(cur);
  return pages;
}

type Slide =
  | { kind: "cover" }
  | { kind: "body"; title: string | null; no: number; cont: boolean; blocks: NoteBlock[] }
  | { kind: "end"; blocks: NoteBlock[] };

/** 노트 한 장 = 카드뉴스 한 묶음. */
export function NoteBoard({
  note,
  kicker,
  onOpenNote,
}: {
  note: Note;
  kicker: string;
  /** 개념 시트의 "노트에서 자세히 보기" — 다른 노트로 이동 */
  onOpenNote?: (id: string) => void;
}) {
  const [picked, setPicked] = useState<Concept | null>(null);
  // h2 기준으로 묶는다. key 는 제목 바로 아래, 끝의 check 는 맨 밑 마무리.
  const head: NoteBlock[] = [];
  const sections: { title: string; blocks: NoteBlock[] }[] = [];
  const tail: NoteBlock[] = [];
  for (const b of note.blocks) {
    if (b.type === "h2") sections.push({ title: b.text, blocks: [] });
    else if (b.type === "list" && b.style === "check") tail.push(b);
    else if (sections.length === 0) head.push(b);
    else sections[sections.length - 1].blocks.push(b);
  }
  // 지금 노트가 설명하는 개념은 링크하지 않는다 (자기 자신으로 가는 링크는 쓸모가 없다)
  const skip = aliasesOfNote(note.id);
  // 그려지는 순서 = head → 섹션들 → tail (위에서 묶은 순서와 같다)
  const ordered = [...head, ...sections.flatMap((x) => x.blocks), ...tail];
  const linker: Linker = {
    skip,
    first: firstSentences(ordered, skip),
    pick: (name) => setPicked(conceptOf(name, note.id)),
  };

  // 카드 묶음: 표지 → 머리(핵심·그림) → 소제목별 → 마무리
  const slides: Slide[] = [{ kind: "cover" }];
  for (const pg of paginate(head)) slides.push({ kind: "body", title: null, no: 0, cont: false, blocks: pg });
  sections.forEach((sec, i) => {
    // 소제목 한 줄만큼 분량을 덜 준다
    const pages = paginate(sec.blocks, PAGE_BUDGET - 1.5);
    (pages.length ? pages : [[]]).forEach((pg, k) => slides.push({ kind: "body", title: sec.title, no: i + 1, cont: k > 0, blocks: pg }));
  });
  slides.push({ kind: "end", blocks: tail });

  const scroller = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const go = (i: number) => {
    const el = scroller.current;
    if (!el) return;
    const next = Math.max(0, Math.min(slides.length - 1, i));
    el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
  };
  const CARD =
    "relative flex h-[62dvh] min-h-[440px] w-full shrink-0 snap-center snap-always flex-col overflow-hidden rounded-[28px] border-2 border-cute-lav";
  // 카드 귀퉁이 반짝이 — 장식이라 누르기·읽기에서 빠진다
  const sparkles = (
    <span aria-hidden className="pointer-events-none absolute inset-0 select-none">
      <span className="absolute right-4 top-12 text-[13px] text-[#F7C948]">✦</span>
      <span className="absolute bottom-5 left-4 text-[11px] text-cute-lav">✦</span>
      <span className="absolute bottom-16 right-5 text-[10px] text-[#F9A8C9]">✦</span>
    </span>
  );

  return (
    <LinkCtx.Provider value={linker}>
      <div className="flex flex-col gap-3">
        {/* 카드 줄 — 옆으로 밀면 한 장씩 딱딱 멈춘다(scroll-snap). */}
        <div
          ref={scroller}
          onScroll={(e) => {
            const el = e.currentTarget;
            setPage(Math.round(el.scrollLeft / el.clientWidth));
          }}
          className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto"
          aria-roledescription="카드뉴스"
        >
          {slides.map((sl, i) => {
            const count = (
              <span className="shrink-0 rounded-full bg-white/70 px-2 py-0.5 text-[11px] font-extrabold text-cute-navy/60">
                {i + 1} / {slides.length}
              </span>
            );
            if (sl.kind === "cover")
              return (
                <section key={i} className={CARD + " bg-gradient-to-b from-[#E6DDFF] to-[#D3C6FA] px-5 pt-5 text-cute-navy"}>
                  <span aria-hidden className="pointer-events-none absolute inset-0 select-none">
                    <span className="absolute left-5 top-16 text-lg text-white">✦</span>
                    <span className="absolute right-6 top-24 text-2xl text-[#F7C948]">✦</span>
                    <span className="absolute right-10 top-1/2 text-base text-white">✦</span>
                    <span className="absolute bottom-40 left-8 text-sm text-[#F9A8C9]">✦</span>
                  </span>
                  <div className="relative flex items-center justify-between">
                    <span className="rounded-full border-2 border-cute-lav bg-white px-3.5 py-1 text-[13px] font-black">{kicker}</span>
                    {count}
                  </div>
                  <div className="relative mt-5 flex flex-col items-center gap-3 text-center">
                    {/* 흰 글자 + 남색 테두리 — 표지 제목의 스티커 글씨 느낌 */}
                    <h1
                      className="break-keep text-[36px] font-black leading-[1.2] text-white"
                      style={{ WebkitTextStroke: "7px #2D2A55", paintOrder: "stroke fill" }}
                    >
                      {note.title}
                    </h1>
                    <p className="break-keep rounded-2xl border-2 border-cute-lav bg-white px-4 py-2 text-[14px] font-extrabold leading-snug">
                      {note.summary.split("`").join("")}
                    </p>
                  </div>
                  <div className="relative mt-auto flex items-end justify-between">
                    <img src={MASCOT("pose-laptop")} alt="" className="-mb-3 h-40 w-40 object-contain drop-shadow-md" />
                    <div className="flex flex-col items-end gap-2 pb-5">
                      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#A792F2] text-3xl shadow-sm">{note.emoji}</span>
                      <span className="rounded-full bg-white/80 px-3 py-1 text-[13px] font-black">옆으로 넘겨요 →</span>
                    </div>
                  </div>
                </section>
              );
            const isEnd = sl.kind === "end";
            const title = isEnd ? "이것만 기억!" : sl.title ? sl.title : "핵심 한눈에";
            return (
              <section key={i} className={CARD + " bg-white font-sans text-cute-navy"}>
                {sparkles}
                <header className="relative flex shrink-0 items-start justify-between gap-2 px-4 pb-2 pt-4">
                  {/* 제목 알약 — "1. 개발이란?" */}
                  <h2 className="min-w-0 rounded-3xl border-2 border-cute-lav bg-cute-lav-soft px-4 py-1.5 text-[18px] font-black leading-snug">
                    {!isEnd && sl.title && <span>{sl.no}. </span>}
                    <Inline text={title} />
                    {!isEnd && sl.cont && <span className="ml-1 text-[12px] text-cute-blue-ink">이어서</span>}
                  </h2>
                  <span className="mt-1.5 rounded-full bg-cute-lav-soft">{count}</span>
                </header>
                {/* 분량 어림이 빗나가 넘치면 카드 안에서 세로로 민다 */}
                <div className="relative flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4 pb-4">
                  <div className="my-auto flex flex-col gap-3">
                    {sl.blocks.map((b, j) => (
                      <BoardBlock key={j} block={b} />
                    ))}
                    {isEnd && (
                      <div className="mt-2 flex items-end gap-1.5">
                        <div className="min-w-0 flex-1 rounded-2xl rounded-br-sm border-2 border-cute-lav bg-white px-3 py-2 text-center text-[14px] font-extrabold leading-snug">
                          천천히, 꾸준히!
                          <br />
                          오늘도 한 장 끝 💜
                        </div>
                        <img src={MASCOT("face-excited")} alt="" className="h-20 w-20 shrink-0 object-contain" />
                      </div>
                    )}
                  </div>
                  {isEnd && (
                    <p className="rounded-2xl bg-cute-lav-soft px-3 py-2 text-center text-[12px] font-bold text-cute-navy/80">
                      <span className="underline decoration-marker-blue decoration-dotted decoration-2 underline-offset-4">점선 밑줄</span> 낱말을 누르면 그 개념을 다시 볼 수 있어요
                    </p>
                  )}
                </div>
              </section>
            );
          })}
        </div>

        {/* 쪽 표시 + 앞뒤 버튼 */}
        <div className="flex items-center justify-between gap-3">
          <button type="button" onClick={() => go(page - 1)} disabled={page === 0} aria-label="이전 카드" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-xl font-black text-ink-700 shadow-chip disabled:text-ink-300">
            ‹
          </button>
          <div className="flex min-w-0 flex-wrap items-center justify-center gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => go(i)}
                aria-label={`${i + 1}번 카드`}
                className={"h-2 rounded-full transition-all " + (i === page ? "w-5 bg-[#A792F2]" : "w-2 bg-cute-lav/50")}
              />
            ))}
          </div>
          <button type="button" onClick={() => go(page + 1)} disabled={page === slides.length - 1} aria-label="다음 카드" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-xl font-black text-ink-700 shadow-chip disabled:text-ink-300">
            ›
          </button>
        </div>
      </div>
    {picked && (
      <ConceptSheet
        concept={picked}
        onClose={() => setPicked(null)}
        onOpenNote={
          onOpenNote
            ? (id) => {
                setPicked(null);
                onOpenNote(id);
              }
            : undefined
        }
      />
    )}
    </LinkCtx.Provider>
  );
}
