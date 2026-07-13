// =============================================================
// LessonPath — 듀오링고식 "감긴 길" 스킬 패스
//
// 예전에는 [스테이지 목록 → 상세] 2단 구조였지만, 듀오링고처럼
// 홈 화면 하나에 모든 레슨이 위→아래로 이어진 "길"로 바꿨다.
//
// 구조:
//   그룹 구분선 (프론트엔드 / 백엔드&프로그래밍)
//   └ 유닛 배너 (카테고리별 색깔 카드 — "유닛 N · React")
//     └ 노드들 (동그란 3D 버튼이 좌우로 지그재그하며 내려감)
//
// 노드 상태:
//   완료   = 유닛 색 + ✓ (복습 노드는 👑)
//   현재   = 유닛 색 + ★ + 둥실둥실(bob) + "시작" 말풍선
//   잠금   = 회색 + 🔒
//
// 지그재그: 노드 순서 i 에 sin 곡선을 태워 translateX 로 좌우 오프셋.
// 유닛이 바뀔 때마다 곡선 방향을 뒤집어 길이 S자로 흐르게 한다.
// =============================================================

import { useStudyStore, MAX_HEARTS } from "../store/useStudyStore";
import { PATH_UNITS } from "../data/lessonPath";
import type { LessonNode } from "../data/lessonPath";
import type { CategoryGroup } from "../types";

/** 유닛(카테고리)별 색상 — Tailwind 는 클래스 문자열을 정적으로 찾으므로 리터럴로 나열한다. */
const UNIT_COLORS = [
  { bg: "bg-duo-green", dim: "border-duo-green-dim", ring: "ring-duo-green/25", text: "text-duo-green" },
  { bg: "bg-accent", dim: "border-accent-dim", ring: "ring-accent/25", text: "text-accent" },
  { bg: "bg-sky-500", dim: "border-sky-600", ring: "ring-sky-500/25", text: "text-sky-500" },
  { bg: "bg-amber-400", dim: "border-amber-500", ring: "ring-amber-400/30", text: "text-amber-500" },
  { bg: "bg-rose-400", dim: "border-rose-500", ring: "ring-rose-400/25", text: "text-rose-400" },
  { bg: "bg-teal-500", dim: "border-teal-600", ring: "ring-teal-500/25", text: "text-teal-500" },
] as const;

/** 노드 하나 — 동그란 3D 버튼 + (현재 노드면) 시작 말풍선. */
function PathNode({
  node,
  color,
  offsetX,
}: {
  node: LessonNode;
  color: (typeof UNIT_COLORS)[number];
  offsetX: number;
}) {
  const lessonProgress = useStudyStore((s) => s.lessonProgress);
  const isNodeUnlocked = useStudyStore((s) => s.isNodeUnlocked);
  const startLesson = useStudyStore((s) => s.startLesson);
  const hearts = useStudyStore((s) => s.hearts);

  const completed = !!lessonProgress[node.id];
  const unlocked = isNodeUnlocked(node.id);
  const current = unlocked && !completed;
  const locked = !unlocked;

  const icon = completed
    ? node.kind === "review"
      ? "👑"
      : "✓"
    : locked
    ? "🔒"
    : node.kind === "review"
    ? "⭐"
    : "★";

  const circle = locked
    ? "border-ink-300 bg-ink-200 text-ink-300"
    : `${color.dim} ${color.bg} text-white`;

  return (
    <div
      className="relative flex justify-center"
      style={{ transform: `translateX(${offsetX}px)` }}
    >
      {/* 현재 노드 위 말풍선 — 하트가 없으면 회복 안내로 바뀐다 */}
      {current && (
        <div
          className={
            "start-bubble animate-bob rounded-xl border-2 border-ink-200 bg-white px-3 py-1 text-xs font-extrabold uppercase tracking-wide " +
            (hearts > 0 ? color.text : "text-duo-red")
          }
        >
          {hearts > 0 ? "시작" : "하트 없음 💔"}
        </div>
      )}

      <button
        onClick={() => startLesson(node.id)}
        disabled={locked}
        aria-label={`${node.category} ${node.label}${
          completed ? " (완료)" : locked ? " (잠김)" : " (지금 풀 차례)"
        }`}
        className={
          "btn-3d flex h-16 w-16 items-center justify-center rounded-full border-2 text-2xl font-extrabold " +
          circle +
          (current ? ` ring-8 ${color.ring}` : "") +
          (locked ? " cursor-not-allowed" : " hover:brightness-105")
        }
      >
        {icon}
      </button>
    </div>
  );
}

/** 그룹 구분선 — 가는 선 사이에 그룹 이름. */
function GroupDivider({ group }: { group: CategoryGroup }) {
  return (
    <div className="my-4 flex items-center gap-3">
      <div className="h-0.5 flex-1 rounded bg-ink-200" />
      <span className="text-xs font-extrabold uppercase tracking-wider text-ink-300">
        {group}
      </span>
      <div className="h-0.5 flex-1 rounded bg-ink-200" />
    </div>
  );
}

export function LessonPath() {
  const lessonProgress = useStudyStore((s) => s.lessonProgress);
  const startRandom = useStudyStore((s) => s.startRandom);
  const hearts = useStudyStore((s) => s.hearts);

  let lastGroup: CategoryGroup | null = null;

  return (
    <div className="flex flex-col">
      {/* 하트가 바닥났을 때만 뜨는 안내 배너 */}
      {hearts === 0 && (
        <div className="mb-3 rounded-2xl border-2 border-duo-red-dim bg-duo-red-soft px-4 py-3 text-center text-xs font-bold text-duo-red-ink">
          💔 하트를 다 썼어요 — 🔁 복습을 끝내면 1개 회복! (30분마다 자동 회복)
        </div>
      )}

      {PATH_UNITS.map((unit, unitIndex) => {
        const color = UNIT_COLORS[unitIndex % UNIT_COLORS.length];
        const total = unit.nodes.length;
        const done = unit.nodes.filter((n) => lessonProgress[n.id]).length;
        // 유닛마다 지그재그 방향을 뒤집어 길이 S자로 흐르게.
        const dir = unitIndex % 2 === 0 ? 1 : -1;

        const showDivider = unit.group !== lastGroup;
        lastGroup = unit.group;

        return (
          <div key={unit.category}>
            {showDivider && <GroupDivider group={unit.group} />}

            {/* 유닛 배너 */}
            <div
              className={
                "mb-6 mt-2 flex items-center justify-between rounded-2xl border-b-4 px-5 py-4 text-white " +
                `${color.bg} ${color.dim}`
              }
            >
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider opacity-80">
                  유닛 {unitIndex + 1} · {done}/{total} 완료
                </p>
                <p className="text-lg font-extrabold">{unit.category}</p>
              </div>
              <span className="text-3xl drop-shadow">{unit.emoji}</span>
            </div>

            {/* 지그재그 노드 길 */}
            <div className="mb-8 flex flex-col gap-7">
              {unit.nodes.map((node, i) => (
                <PathNode
                  key={node.id}
                  node={node}
                  color={color}
                  // sin 곡선으로 좌우 왕복 (최대 ±48px)
                  offsetX={Math.round(Math.sin(((i + 1) * Math.PI) / 3) * 48) * dir}
                />
              ))}
            </div>
          </div>
        );
      })}

      {/* 랜덤 연습 — 길의 끝에서 무한 연습 (하트 소모 없음) */}
      <button
        onClick={startRandom}
        className="btn-3d w-full rounded-2xl border-accent-dim bg-accent px-4 py-3 text-sm font-bold text-white hover:brightness-105"
      >
        🎲 랜덤 연습 <span className="opacity-70">— 하트 걱정 없이</span>
      </button>

      <p className="mt-3 text-center text-[11px] leading-relaxed text-ink-300">
        길을 따라 한 칸씩. 천천히, 꾸준히 🐢 (❤️ 최대 {MAX_HEARTS}개)
      </p>
    </div>
  );
}
