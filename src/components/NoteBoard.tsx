// =============================================================
// NoteBoard — 공부노트 상세를 "화이트보드 손그림" 으로 그린다.
// - 강의실 화이트보드에 마커로 정리한 판서 느낌: 손글씨(Gaegu), 빨강·파랑·초록 마커,
//   손으로 그린 듯 삐뚤한 상자(.sketch), 동그라미 번호 ①②③.
// - 단계(flow)는 2열 지그재그(1→2, 4←3, 5→6 …)로 판서처럼 배치한다.
// - Gaegu 는 기본 자간이 넓어 띄엄띄엄 보여서 보드 전체 자간을 좁힌다 (코드는 원래 자간).
// - 코드만은 고정폭 글꼴 그대로 — 손글씨 코드는 읽기도 베끼기도 어렵다.
// =============================================================

import type { Note, NoteBlock } from "../data/notes/types";
import { NoteFigure } from "./NoteFigure";

/** 인라인 `코드` — 백틱으로 쪼개면 홀수 번째 조각이 코드 부분이다. */
export function Inline({ text }: { text: string }) {
  return (
    <>
      {text.split("`").map((part, i) =>
        i % 2 === 1 ? (
          <code key={i} className="rounded bg-ink-100 px-1 font-mono text-[0.78em] tracking-normal text-marker-blue">
            {part}
          </code>
        ) : (
          part
        ),
      )}
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
          <Inline text={block.text} />
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
                    <Inline text={it} />
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
                    <Inline text={it} />
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
                <Inline text={it} />
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
                      → <Inline text={it} />
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
          <Inline text={block.text} />
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

/** 노트 한 장 = 화이트보드 한 판. */
export function NoteBoard({ note, kicker }: { note: Note; kicker: string }) {
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

  return (
    // 보드: 흰 판 + 알루미늄 테두리 + 아래 받침대 그림자
    <article className="flex flex-col gap-4 rounded-[14px] border-[6px] border-[#D3D7DE] bg-white px-4 pb-6 pt-5 font-display tracking-[-0.06em] text-marker-ink shadow-[0_6px_0_#B4B9C2]">
      <header className="flex flex-col items-center gap-1 text-center">
        <span className="self-start text-[15px] text-marker-blue">{kicker}</span>
        <h1 className="break-keep text-[34px] leading-tight">{note.title}</h1>
        {/* 손으로 그은 밑줄 두 줄 */}
        <span className="sketch block h-[3px] w-4/5 bg-marker-ink" />
        <span className="sketch-alt -mt-0.5 block h-[2px] w-3/5 bg-marker-ink opacity-70" />
        <p className="mt-2 self-start text-left text-[18px] leading-snug">
          <span className="text-marker-blue">→ </span>
          <Inline text={note.summary} />
        </p>
      </header>

      {head.map((b, i) => (
        <BoardBlock key={"h" + i} block={b} />
      ))}

      {sections.map((sec, i) => (
        <section key={i} className="flex flex-col gap-3">
          <h2 className="mt-2 flex items-center gap-2 text-[23px] leading-tight text-marker-red">
            <Circled n={i + 1} />
            <span>
              <Inline text={sec.title} />
            </span>
          </h2>
          {sec.blocks.map((b, j) => (
            <BoardBlock key={j} block={b} />
          ))}
        </section>
      ))}

      {tail.map((b, i) => (
        <BoardBlock key={"t" + i} block={b} />
      ))}
    </article>
  );
}
