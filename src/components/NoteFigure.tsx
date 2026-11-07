// =============================================================
// NoteFigure — 공부노트 "그림" 블록을 화이트보드 손그림 도식으로 그린다.
// - 흐름도(flow) · 순환도(cycle) · 갈래도(tree) · 층 쌓기(stack) · 가리키기(refs)
// - 그림 재료는 이모지 아이콘 + 삐뚤한 상자(.sketch) + 손으로 그은 SVG 화살표뿐.
//   이미지 파일이 하나도 없어서 용량 0, 오프라인에서도 그대로 보인다.
// =============================================================

import { useId } from "react";

import type { FigNode, FigureBlock, Ink } from "../data/notes/types";
import { Inline } from "./NoteBoard";

const BORDER: Record<Ink, string> = {
  ink: "border-marker-ink",
  red: "border-marker-red",
  blue: "border-marker-blue",
  green: "border-marker-green",
};
const TEXT: Record<Ink, string> = {
  ink: "text-marker-ink",
  red: "text-marker-red",
  blue: "text-marker-blue",
  green: "text-marker-green",
};

/** 상자 하나. row = 아이콘 왼쪽·글자 오른쪽(세로 흐름도용), 아니면 아이콘 위·글자 아래. */
// tiny = 4갈래 트리처럼 칸이 아주 좁을 때 (긴 영어 이름이 중간에서 안 끊기게)
function Box({ n, row = false, small = false, tiny = false, alt = false }: { n: FigNode; row?: boolean; small?: boolean; tiny?: boolean; alt?: boolean }) {
  const ink = n.ink ?? "ink";
  return (
    <div
      className={
        "flex min-w-0 border-[2.5px] bg-white " +
        BORDER[ink] +
        (alt ? " sketch-alt" : " sketch") +
        (row ? " items-center gap-3 px-3 py-2 text-left" : " flex-col items-center px-1.5 py-2 text-center")
      }
    >
      <span className={(tiny ? "text-xl" : small ? "text-2xl" : "text-[32px]") + " leading-none"}>{n.icon}</span>
      <span className="min-w-0">
        <span className={"block break-keep leading-tight [overflow-wrap:anywhere] " + (tiny ? "text-[12px] " : small ? "text-[14px] " : "text-[16px] ") + TEXT[ink]}>
          <Inline text={n.label} />
        </span>
        {n.sub && (
          <span className={"mt-0.5 block break-keep leading-tight " + (tiny ? "text-[11px]" : "text-[13px]") + " text-marker-blue [overflow-wrap:anywhere]"}>
            <Inline text={n.sub} />
          </span>
        )}
      </span>
    </div>
  );
}

/** 손으로 그은 화살표 — 살짝 휜 줄 + 꺾쇠 머리. */
function Arrow({ dir, label }: { dir: "right" | "down"; label?: string }) {
  const svg =
    dir === "right" ? (
      <svg viewBox="0 0 40 20" className="h-5 w-9 shrink-0 text-marker-blue" aria-hidden>
        <path d="M3 11 C 13 7, 24 14, 35 10" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
        <path d="M28 4 L36 10 L28 16" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ) : (
      <svg viewBox="0 0 20 36" className="h-9 w-5 shrink-0 text-marker-blue" aria-hidden>
        <path d="M11 3 C 7 12, 14 22, 10 32" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
        <path d="M4 25 L10 33 L16 25" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  if (dir === "right")
    return (
      <div className="flex shrink-0 flex-col items-center">
        {label && <span className="max-w-[56px] text-center text-[12px] leading-tight text-marker-blue">{label}</span>}
        {svg}
      </div>
    );
  return (
    <div className="flex items-center justify-center gap-1">
      {svg}
      {label && <span className="text-[14px] leading-tight text-marker-blue">{label}</span>}
    </div>
  );
}

function Flow({ nodes, edges }: { nodes: FigNode[]; edges?: string[] }) {
  if (nodes.length <= 3)
    return (
      <div className="flex items-center gap-1">
        {nodes.map((n, i) => (
          <div key={i} className="contents">
            {i > 0 && <Arrow dir="right" label={edges?.[i - 1]} />}
            <div className="min-w-0 flex-1">
              <Box n={n} alt={i % 2 === 1} />
            </div>
          </div>
        ))}
      </div>
    );
  return (
    <div className="flex flex-col">
      {nodes.map((n, i) => (
        <div key={i} className="flex flex-col">
          {i > 0 && <Arrow dir="down" label={edges?.[i - 1]} />}
          <Box n={n} row alt={i % 2 === 1} />
        </div>
      ))}
    </div>
  );
}

function Cycle({ nodes }: { nodes: FigNode[] }) {
  const n = nodes.length;
  // 원 반지름 (viewBox 100 기준 %). 상자 폭(34%)의 절반 + 여유를 빼야 상자가 판 밖으로 안 나간다.
  const R = 31;
  const deg = (i: number) => -90 + (360 * i) / n;
  const rad = (d: number) => (d * Math.PI) / 180;
  return (
    <div className="relative mx-auto my-2 aspect-square w-full max-w-[320px]">
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full text-marker-blue" aria-hidden>
        <circle cx="50" cy="50" r={R} fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 2.2" />
        {/* 상자 사이마다 시계방향 화살촉 */}
        {nodes.map((_, i) => {
          const d = deg(i) + 180 / n;
          const x = 50 + R * Math.cos(rad(d));
          const y = 50 + R * Math.sin(rad(d));
          return (
            <path
              key={i}
              d="M-3.2,-3 L1.2,0 L-3.2,3"
              transform={`translate(${x} ${y}) rotate(${d + 90})`}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          );
        })}
      </svg>
      {nodes.map((node, i) => {
        const d = deg(i);
        return (
          <div
            key={i}
            className="absolute w-[34%] -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${50 + R * Math.cos(rad(d))}%`, top: `${50 + R * Math.sin(rad(d))}%` }}
          >
            <div className="relative">
              <span className="absolute -left-1.5 -top-2 z-10 flex h-5 w-5 items-center justify-center rounded-full border-2 border-marker-red bg-white text-[12px] leading-none text-marker-red">
                {i + 1}
              </span>
              <Box n={node} small alt={i % 2 === 1} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Tree({ root, children }: { root: FigNode; children: (FigNode & { leaves?: string[] })[] }) {
  const n = children.length;
  const line = "border-marker-ink";
  return (
    <div className="flex flex-col items-center">
      <div className="w-1/2 min-w-[140px]">
        <Box n={root} small />
      </div>
      <span className={"h-4 border-l-[2.5px] " + line} />
      <div className="grid w-full" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
        {children.map((c, i) => (
          <div key={i} className="flex min-w-0 flex-col">
            {/* 가로 가지 + 세로 꼭지 — 첫째는 오른쪽 반만, 막내는 왼쪽 반만 긋는다 */}
            <div className="relative h-4">
              {i > 0 && <span className={"absolute left-0 right-1/2 top-0 border-t-[2.5px] " + line} />}
              {i < n - 1 && <span className={"absolute left-1/2 right-0 top-0 border-t-[2.5px] " + line} />}
              <span className={"absolute left-1/2 top-0 h-full border-l-[2.5px] " + line} />
            </div>
            <div className="px-1">
              <Box n={c} small tiny={n >= 4} alt={i % 2 === 1} />
              {c.leaves && (
                <ul className="mt-1.5 flex flex-col gap-0.5 px-0.5 text-[13px] leading-tight">
                  {c.leaves.map((l, j) => (
                    <li key={j} className="break-keep [overflow-wrap:anywhere]">
                      <span className="text-marker-blue">· </span>
                      <Inline text={l} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Stack({ layers, nested }: { layers: FigNode[]; nested?: boolean }) {
  if (nested) {
    // 상자 안 상자: 안쪽부터 바깥으로 감싼다.
    const INKS: Ink[] = ["red", "blue", "green", "ink"];
    let inner: JSX.Element | null = null;
    for (let i = layers.length - 1; i >= 0; i--) {
      const L = layers[i];
      const ink = L.ink ?? INKS[i % INKS.length];
      inner = (
        <div className={"border-[2.5px] bg-white/60 px-2.5 pb-2.5 pt-1.5 " + BORDER[ink] + (i % 2 ? " sketch-alt" : " sketch-sm")}>
          <div className={"flex items-baseline gap-1.5 text-[17px] leading-tight " + TEXT[ink]}>
            <span>{L.icon}</span>
            <Inline text={L.label} />
          </div>
          {L.sub && (
            <div className="text-[13px] leading-tight text-marker-ink">
              <Inline text={L.sub} />
            </div>
          )}
          {inner && <div className="mt-2">{inner}</div>}
        </div>
      );
    }
    return inner;
  }
  return (
    <div className="flex flex-col gap-1.5">
      {layers.map((L, i) => {
        const ink = L.ink ?? "ink";
        return (
          <div
            key={i}
            className={"flex items-center gap-3 border-[2.5px] bg-white px-3 py-1.5 " + BORDER[ink] + (i % 2 ? " sketch-alt" : " sketch")}
          >
            <span className="text-2xl leading-none">{L.icon}</span>
            <span className={"shrink-0 text-[17px] leading-tight " + TEXT[ink]}>
              <Inline text={L.label} />
            </span>
            {L.sub && (
              <span className="ml-auto min-w-0 break-keep text-right text-[13px] leading-tight text-marker-blue">
                <Inline text={L.sub} />
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

function Refs({ vars, objs }: { vars: { name: string; to: number }[]; objs: FigNode[] }) {
  const id = useId().replace(/:/g, "");
  const ROW = 64; // 한 줄 높이(px) — 상자 높이 + 간격
  const H = Math.max(vars.length, objs.length) * ROW - 8;
  const mid = (i: number) => i * ROW + (ROW - 8) / 2;
  return (
    <div className="relative" style={{ height: H }}>
      <svg className="absolute inset-0 h-full w-full overflow-visible text-marker-blue" aria-hidden>
        <defs>
          <marker id={"h" + id} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M1 1 L9 5 L1 9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </marker>
        </defs>
        {vars.map((v, i) => (
          <line
            key={i}
            x1="33%"
            y1={mid(i)}
            x2="55%"
            y2={mid(v.to)}
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            markerEnd={`url(#h${id})`}
          />
        ))}
      </svg>
      {vars.map((v, i) => (
        <div
          key={i}
          className="sketch absolute left-0 flex w-[32%] items-center justify-center border-[2.5px] border-marker-ink bg-[#FAFAF7] px-1 font-mono text-[13px] tracking-normal"
          style={{ top: i * ROW, height: ROW - 8 }}
        >
          <span className="truncate">{v.name}</span>
        </div>
      ))}
      {objs.map((o, j) => (
        <div key={j} className="absolute right-0 w-[44%]" style={{ top: j * ROW, height: ROW - 8 }}>
          <div
            className={
              "flex h-full items-center gap-2 border-[2.5px] bg-white px-2 " + BORDER[o.ink ?? "green"] + (j % 2 ? " sketch-alt" : " sketch")
            }
          >
            <span className="text-xl leading-none">{o.icon}</span>
            <span className="min-w-0 leading-tight">
              <span className={"block truncate text-[15px] " + TEXT[o.ink ?? "green"]}>
                <Inline text={o.label} />
              </span>
              {o.sub && (
                <span className="block truncate text-[12px] text-marker-blue">
                  <Inline text={o.sub} />
                </span>
              )}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export function NoteFigure({ block }: { block: FigureBlock }) {
  let body: JSX.Element | null;
  switch (block.kind) {
    case "flow":
      body = <Flow nodes={block.nodes} edges={block.edges} />;
      break;
    case "cycle":
      body = <Cycle nodes={block.nodes} />;
      break;
    case "tree":
      body = <Tree root={block.root} children={block.children} />;
      break;
    case "stack":
      body = <Stack layers={block.layers} nested={block.nested} />;
      break;
    case "refs":
      body = <Refs vars={block.vars} objs={block.objs} />;
      break;
  }
  return (
    <figure className="my-1 flex flex-col gap-2">
      {body}
      {block.caption && (
        <figcaption className="text-center text-[15px] leading-snug text-marker-blue">
          ↑ <Inline text={block.caption} />
        </figcaption>
      )}
    </figure>
  );
}

/** 포스터 타일용: 그림 속 아이콘 몇 개 (없으면 빈 배열). */
export function figureIcons(block: FigureBlock): string[] {
  switch (block.kind) {
    case "flow":
    case "cycle":
      return block.nodes.map((n) => n.icon);
    case "tree":
      return [block.root.icon, ...block.children.map((c) => c.icon)];
    case "stack":
      return block.layers.map((l) => l.icon);
    case "refs":
      return block.objs.map((o) => o.icon);
  }
}
