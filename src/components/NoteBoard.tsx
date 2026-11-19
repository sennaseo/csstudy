// =============================================================
// NoteBoard — 공부노트 상세를 "카드뉴스" 로 그린다 (옆으로 넘겨 보는 카드 묶음).
// - 표지 → 핵심 한 장 → 소제목마다 한 장(길면 여러 장으로 나눔) → "이것만 기억" 마무리.
// - 카드 안 내용은 화이트보드 손그림 블록 그대로:
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
            <code className="rounded bg-ink-100 px-1 font-mono text-[0.78em] tracking-normal text-marker-blue">{part}</code>
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

/** 마커로 그린 동그라미 번호. */
function Circled({ n, color = "red" }: { n: number; color?: "red" | "blue" }) {
  const c = color === "red" ? "border-marker-red text-marker-red" : "border-marker-blue text-marker-blue";
  return (
    <span className={"flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-lg leading-none " + c}>
      {n}
    </span>
  );
}

// compare 상자 마커색 — 틀림=빨강, 맞음=초록, 그냥 나열=파랑.
const BOX = {
  bad: { mark: "✗ ", cls: "border-marker-red", title: "text-marker-red" },
  good: { mark: "✓ ", cls: "border-marker-green", title: "text-marker-green" },
  none: { mark: "", cls: "border-marker-blue", title: "text-marker-blue" },
} as const;

// 팁은 보드 귀퉁이에 붙인 포스트잇.
const STICKY = {
  analogy: { label: "🎈 비유", cls: "bg-[#FFF4B8] -rotate-1", title: "text-marker-blue" },
  warn: { label: "⚠️ 자주 하는 실수", cls: "bg-[#FFD9D6] rotate-1", title: "text-marker-red" },
  memo: { label: "📝 메모", cls: "bg-[#DDF3E4] -rotate-1", title: "text-marker-green" },
} as const;

function BoardBlock({ block }: { block: NoteBlock }) {
  switch (block.type) {
    case "key":
      // 보드 한가운데 빨간 마커로 동그랗게 두른 한 줄 ("FROM COMMIT TO PRODUCTION" 자리)
      return (
        <div className="sketch mx-auto my-1 max-w-full border-[2.5px] border-marker-red px-5 py-2 text-center text-[21px] leading-snug text-marker-red">
          <Inline text={block.text} />
        </div>
      );
    case "figure":
      return <NoteFigure block={block} />;
    case "h2":
      return null; // 섹션 제목은 NoteBoard 가 번호와 함께 직접 그린다
    case "p":
      return (
        <p className="text-[18px] leading-relaxed">
          <Inline text={block.text} link />
        </p>
      );
    case "code":
      return (
        <div className="sketch-sm border-[2.5px] border-marker-ink bg-[#FAFAF7] px-3 py-3">
          <pre className="overflow-x-auto whitespace-pre font-mono tracking-normal text-xs leading-relaxed text-marker-ink">{block.code}</pre>
          {block.out !== undefined && (
            <div className="mt-2 border-t-2 border-dashed border-marker-green pt-1.5">
              <span className="text-base text-marker-green">▶ 결과</span>
              <pre className="whitespace-pre-wrap font-mono tracking-normal text-xs leading-relaxed text-marker-green">{block.out}</pre>
            </div>
          )}
        </div>
      );
    case "list": {
      if (block.style === "flow") {
        // 2열 지그재그: 짝수 줄은 왼→오, 홀수 줄은 오→왼. 동그라미 번호가 순서를 알려 준다.
        const COLS = 2;
        return (
          <div className="grid grid-cols-2 gap-x-3 gap-y-4 py-1">
            {block.items.map((it, i) => {
              const row = Math.floor(i / COLS);
              const col = row % 2 === 0 ? i % COLS : COLS - 1 - (i % COLS);
              return (
                <div key={i} className="flex min-w-0 items-start gap-1.5" style={{ gridRow: row + 1, gridColumn: col + 1 }}>
                  <Circled n={i + 1} />
                  <span className="sketch min-w-0 break-words border-2 border-marker-ink px-2 py-1 text-[16px] leading-snug">
                    <Inline text={it} link />
                  </span>
                </div>
              );
            })}
          </div>
        );
      }
      if (block.style === "check")
        return (
          <div className="sketch mt-2 border-[2.5px] border-marker-green px-4 py-3">
            <span className="block text-[20px] text-marker-green">✓ 이것만 기억</span>
            <ul className="mt-1 flex flex-col gap-1 text-[17px] leading-snug">
              {block.items.map((it, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-marker-green">✓</span>
                  <span>
                    <Inline text={it} link />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        );
      return (
        <ul className="flex flex-col gap-1 text-[17px] leading-snug">
          {block.items.map((it, i) => (
            <li key={i} className="flex gap-2">
              <span className="shrink-0 text-marker-blue">{block.ordered ? `${i + 1}.` : "→"}</span>
              <span>
                <Inline text={it} link />
              </span>
            </li>
          ))}
        </ul>
      );
    }
    case "compare":
      return (
        <div className={"grid gap-3 " + (block.cols.length > 1 ? "grid-cols-2" : "grid-cols-1")}>
          {block.cols.map((c, i) => {
            const t = BOX[c.tone ?? "none"];
            return (
              <div key={i} className={"min-w-0 border-[2.5px] px-3 py-2.5 " + t.cls + (i % 2 ? " sketch-alt" : " sketch")}>
                <div className={"text-[19px] leading-tight " + t.title}>
                  {t.mark}
                  <Inline text={c.title} />
                </div>
                <ul className="mt-1 flex flex-col gap-0.5 text-[15px] leading-snug">
                  {c.items.map((it, j) => (
                    <li key={j} className="break-words">
                      → <Inline text={it} link />
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      );
    case "tip": {
      const t = STICKY[block.kind];
      return (
        <div className={"mx-1 rounded-sm px-4 py-3 text-[16px] leading-snug shadow-[2px_3px_0_rgba(0,0,0,0.08)] " + t.cls}>
          <span className={"block text-[18px] " + t.title}>{t.label}</span>
          <Inline text={block.text} link />
        </div>
      );
    }
    case "table":
      return (
        <div className="sketch-sm overflow-x-auto border-[2.5px] border-marker-ink px-2 py-1">
          <table className="w-full border-collapse text-left text-[15px] leading-snug">
            <thead>
              <tr>
                {block.head.map((h, i) => (
                  <th key={i} className="border-b-2 border-marker-ink px-2 py-1.5 text-[18px] font-normal text-marker-blue">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, r) => (
                <tr key={r}>
                  {row.map((c, i) => (
                    <td key={i} className="border-b border-dashed border-ink-300 px-2 py-1.5 align-top">
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

/** 표 한 줄의 높이 어림 — 칸이 좁아(3열이면 한 줄에 6자쯤) 글이 여러 줄로 접힌다. */
function tableRowWeight(row: string[]): number {
  const per = Math.max(4, Math.floor(20 / row.length));
  return 0.5 + Math.max(...row.map((c) => Math.ceil(c.split("`").join("").length / per))) * 0.85;
}

/** 블록 하나가 차지하는 높이 어림 (본문 줄 수 단위). */
function weightOf(b: NoteBlock): number {
  const len = (t: string, per: number) => Math.ceil(t.length / per);
  switch (b.type) {
    case "key":
      return 3;
    case "p":
      return 1 + len(b.text, 24);
    case "code":
      return 2 + b.code.split("\n").length * 0.8 + (b.out !== undefined ? 1.5 + b.out.split("\n").length * 0.8 : 0);
    case "list":
      if (b.style === "flow") return Math.ceil(b.items.length / 2) * 4;
      return 1 + b.items.reduce((n, it) => n + len(it, 26), 0);
    case "compare":
      return 2 + Math.max(...b.cols.map((c) => c.items.reduce((n, it) => n + len(it, 12), 0)));
    case "tip":
      return 2.5 + len(b.text, 26);
    case "table":
      return 2 + b.rows.reduce((n, r) => n + tableRowWeight(r), 0);
    case "figure":
      if (b.kind === "flow") return b.nodes.length <= 3 ? 5 : b.nodes.length * 3.4;
      if (b.kind === "cycle") return 11;
      if (b.kind === "tree") return 8 + Math.max(0, ...b.children.map((c) => c.leaves?.length ?? 0)) * 1.2;
      if (b.kind === "stack") return b.layers.length * (b.nested ? 2.6 : 2);
      return Math.max(b.vars.length, b.objs.length) * 2.6 + 1;
    default:
      return 0;
  }
}

/** 카드 한 장 분량 (줄 수 어림). 화면 높이의 62% 카드에 맞춘 값. */
const PAGE_BUDGET = 17;

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
  const CARD = "flex h-[62dvh] min-h-[440px] w-full shrink-0 snap-center snap-always flex-col overflow-hidden rounded-[28px]";

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
              <span className="shrink-0 rounded-full bg-black/10 px-2.5 py-0.5 font-sans text-[11px] font-extrabold tracking-normal">
                {i + 1} / {slides.length}
              </span>
            );
            if (sl.kind === "cover")
              return (
                <section key={i} className={CARD + " relative justify-between bg-gradient-to-br from-accent to-[#C99BF2] p-6 text-white"}>
                  <div className="flex items-center justify-between font-sans text-xs font-extrabold">
                    <span className="rounded-full bg-white/20 px-3 py-1">{kicker}</span>
                    {count}
                  </div>
                  <div className="flex flex-col gap-4">
                    <span className="text-6xl">{note.emoji}</span>
                    <h1 className="break-keep font-sans text-[34px] font-black leading-[1.15] tracking-tight">{note.title}</h1>
                    <p className="break-keep font-sans text-base font-semibold leading-snug text-white/90">{note.summary.split("`").join("")}</p>
                  </div>
                  <div className="flex items-end justify-between">
                    <span className="font-sans text-sm font-extrabold text-white/90">옆으로 넘겨 보세요 →</span>
                    <img src={`${import.meta.env.BASE_URL}mascot/face-happy.png`} alt="" className="h-20 w-20 object-contain drop-shadow-md" />
                  </div>
                </section>
              );
            const isEnd = sl.kind === "end";
            return (
              <section
                key={i}
                className={CARD + " font-display tracking-[-0.06em] text-marker-ink shadow-card " + (isEnd ? "bg-accent-soft" : "bg-white")}
              >
                <header className="flex shrink-0 items-start justify-between gap-2 px-5 pb-2 pt-4">
                  {isEnd ? (
                    <h2 className="text-[24px] leading-tight text-accent-dim">마무리</h2>
                  ) : sl.title ? (
                    <h2 className="flex min-w-0 items-center gap-2 text-[23px] leading-tight text-marker-red">
                      <Circled n={sl.no} />
                      <span className="min-w-0">
                        <Inline text={sl.title} />
                        {sl.cont && <span className="ml-1 text-[15px] text-marker-blue">(이어서)</span>}
                      </span>
                    </h2>
                  ) : (
                    <h2 className="text-[23px] leading-tight text-marker-red">한눈에 보기</h2>
                  )}
                  <span className="text-ink-500">{count}</span>
                </header>
                {/* 분량 어림이 빗나가 넘치면 카드 안에서 세로로 민다 */}
                <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-5 pb-5">
                  <div className="my-auto flex flex-col gap-3">
                    {sl.blocks.map((b, j) => (
                      <BoardBlock key={j} block={b} />
                    ))}
                  </div>
                  {isEnd && (
                    <p className="pt-2 text-center text-[14px] text-marker-blue">
                      <span className="underline decoration-dotted decoration-2 underline-offset-4">점선 밑줄</span> 낱말을 누르면 그 개념을 다시 볼 수 있어요
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
                className={"h-2 rounded-full transition-all " + (i === page ? "w-5 bg-accent" : "w-2 bg-ink-300")}
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
