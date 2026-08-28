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
// 노드 상태 (듀오링고 표준 — 유닛 색이 아니라 상태 색으로 통일):
//   완료   = 골드(.path-node-done) + ✓ (복습 노드는 👑)
//   현재   = 초록(.path-node-current) + ★ + 둥실둥실(bob) + "시작" 말풍선
//   잠금   = 회색(.path-node-locked) + 🔒
//
// 지그재그: 노드 순서 i 에 sin 곡선을 태워 translateX 로 좌우 오프셋.
// 유닛이 바뀔 때마다 곡선 방향을 뒤집어 길이 S자로 흐르게 한다.
// =============================================================

import { useStudyStore, MAX_HEARTS } from "../store/useStudyStore";
import { unitsFor } from "../data/lessonPath";
import type { LessonNode } from "../data/lessonPath";
import type { CategoryGroup } from "../types";

/** 유닛(카테고리)별 색상 — 이제 노드 색은 상태(완료/현재/잠금) 기반 .path-node-* 로 통일됐으므로
 *  이 팔레트는 유닛 배너(bg+dim)에만 쓴다. 노드/말풍선은 상태색(초록·골드·회색)을 직접 쓴다.
 *  Tailwind 는 클래스 문자열을 정적으로 찾으므로 리터럴로 나열한다. */
const UNIT_COLORS = [
  { bg: "bg-duo-green", dim: "border-duo-green-dim" },
  { bg: "bg-accent", dim: "border-accent-dim" },
  { bg: "bg-sky-500", dim: "border-sky-600" },
  { bg: "bg-amber-400", dim: "border-amber-500" },
  { bg: "bg-rose-400", dim: "border-rose-500" },
  { bg: "bg-teal-500", dim: "border-teal-600" },
] as const;

/** 노드 하나 — 동그란 3D 버튼 + (현재 노드면) 시작 말풍선.
 *  노드 색은 이제 유닛 색이 아니라 상태(완료/현재/잠금) 기반이라 유닛 color 는 안 받는다. */
function PathNode({
  node,
  offsetX,
}: {
  node: LessonNode;
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

  // 상태별 노드 클래스 — 완료=골드, 현재=초록, 잠금=회색 (듀오링고 표준, 유닛 색과 무관).
  const stateClass = completed
    ? "path-node-done"
    : current
    ? "path-node-current"
    : "path-node-locked";

  return (
    <div
      className="relative flex justify-center"
      style={{ transform: `translateX(${offsetX}px)` }}
    >
      {/* 현재 노드 위 말풍선 — 하트가 없으면 회복 안내로 바뀐다.
          노드가 이미 scale(1.08) + 그림자로 충분히 도드라지므로 ring 은 빼고 굵기로 강조한다. */}
      {current && (
        <div
          className={
            "start-bubble animate-bob rounded-xl border-2 border-b-4 border-ink-200 bg-white px-3 py-1.5 text-xs font-extrabold uppercase tracking-wide " +
            (hearts > 0 ? "text-duo-green" : "text-duo-red")
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
          "path-node text-3xl " +
          stateClass +
          (locked ? "" : " hover:brightness-105")
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
  const activeTrack = useStudyStore((s) => s.activeTrack);

  // 트랙을 골랐으면 그 트랙의 유닛만, 아니면 전체 카테고리.
  const units = unitsFor(activeTrack);

  // 트랙 모드에서는 그룹 구분선을 안 쓴다 (트랙 자체가 이미 하나의 흐름이라
  // "프론트엔드 / 백엔드" 구분선이 오히려 길을 끊어 보이게 한다).
  let lastGroup: CategoryGroup | null = null;

  return (
    <div className="flex flex-col">
      {/* 하트가 바닥났을 때만 뜨는 안내 배너 */}
      {hearts === 0 && (
        <div className="mb-3 rounded-2xl border-2 border-b-4 border-duo-red-dim bg-duo-red-soft px-4 py-3 text-center text-xs font-extrabold text-duo-red-ink">
          💔 하트를 다 썼어요 — 🔁 복습을 끝내면 1개 회복! (30분마다 자동 회복)
        </div>
      )}

      {units.map((unit, unitIndex) => {
        const color = UNIT_COLORS[unitIndex % UNIT_COLORS.length];
        const total = unit.nodes.length;
        const done = unit.nodes.filter((n) => lessonProgress[n.id]).length;
        // 유닛마다 지그재그 방향을 뒤집어 길이 S자로 흐르게.
        const dir = unitIndex % 2 === 0 ? 1 : -1;

        const showDivider = !activeTrack && unit.group !== lastGroup;
        lastGroup = unit.group;

        return (
          <div key={`${unit.category}-${unitIndex}`}>
            {showDivider && <GroupDivider group={unit.group} />}

            {/* 유닛 배너 — 굵고 두툼하게(바닥 두께 border-b-4, 큰 라운드) */}
            <div
              className={
                "mb-6 mt-2 flex items-center justify-between rounded-2xl border-b-4 px-5 py-4 text-white " +
                `${color.bg} ${color.dim}`
              }
            >
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-widest opacity-90">
                  유닛 {unitIndex + 1} · {done}/{total} 완료
                </p>
                <p className="text-lg font-extrabold">{unit.label}</p>
                {unit.blurb && (
                  <p className="mt-0.5 max-w-[15rem] text-[11px] font-semibold leading-snug opacity-90">
                    {unit.blurb}
                  </p>
                )}
              </div>
              <span className="text-3xl drop-shadow">{unit.emoji}</span>
            </div>

            {/* 지그재그 노드 길 */}
            <div className="mb-8 flex flex-col gap-7">
              {unit.nodes.map((node, i) => (
                <PathNode
                  key={node.id}
                  node={node}
                  // sin 곡선으로 좌우 왕복 (최대 ±48px)
                  offsetX={Math.round(Math.sin(((i + 1) * Math.PI) / 3) * 48) * dir}
                />
              ))}
            </div>
          </div>
        );
      })}

      {/* 랜덤 연습 — 길의 끝에서 무한 연습 (하트 소모 없음). accent 3D 버튼 = 이제 Macaw 파랑. */}
      <button
        onClick={startRandom}
        className="btn-3d w-full rounded-2xl border-b-4 border-accent-dim bg-accent px-4 py-3 text-sm font-extrabold uppercase tracking-wide text-white hover:brightness-105"
      >
        🎲 랜덤 연습 <span className="opacity-80 normal-case tracking-normal">— 하트 걱정 없이</span>
      </button>

      <p className="mt-3 text-center text-[11px] font-semibold leading-relaxed text-ink-300">
        길을 따라 한 칸씩. 천천히, 꾸준히 🐢 (❤️ 최대 {MAX_HEARTS}개)
      </p>
    </div>
  );
}
