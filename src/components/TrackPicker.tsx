// =============================================================
// TrackPicker — 역할별 로드맵(트랙) 선택
//
// 설계 메모 (초보자용):
// - roadmap.sh 처럼 "프론트엔드 개발자 / 백엔드 개발자" 중 하나를 고르면
//   그 역할에 필요한 유닛만, 기초 → 심화 순서로 길이 다시 깔린다.
// - 고르지 않으면 예전처럼 전체 카테고리가 다 나온다 ("전체").
// - 트랙을 바꿔도 이미 푼 레슨은 완료로 남는다 (진행도 키가 그대로라서).
//   그래서 "잘못 고르면 어쩌지" 걱정 없이 왔다 갔다 해도 된다.
//
// 완주 게이지는 여기 없다 — 퀴즈 탭(감긴 길 위)에 있는 TrackProgress 로 옮겼다.
// 완주율은 "이 길을 얼마나 걸었나"를 말하는 숫자라 길 옆이 제자리이고,
// 홈은 "오늘 뭐 할까"만 가볍게 보여주는 화면으로 남겨두는 게 낫기 때문.
// =============================================================

import { useStudyStore } from "../store/useStudyStore";
import { unitsFor } from "../data/lessonPath";
import { TRACKS } from "../data/tracks";
import type { TrackId } from "../data/tracks";

/** 칩 하나 — 트랙 또는 "전체". */
function TrackChip({
  active,
  emoji,
  label,
  onClick,
}: {
  active: boolean;
  emoji: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={
        // "프론트엔드"(5글자)가 87px 칩에서 "프론트엔 / 드"로 쪼개져 마지막 한 글자가
        // 홀로 떨어지고, 그 칩만 2줄이라 세로 정렬도 어긋났다.
        // → 가로 padding 을 줄이고 줄바꿈을 막아 한 줄에 앉힌다.
        //   items-center + 같은 높이(h-full)로 세 칩의 세로 정렬을 맞춘다.
        "flex h-full min-w-0 flex-1 items-center justify-center gap-1 whitespace-nowrap " +
        "rounded-xl border-b-4 px-1.5 py-2.5 text-xs font-extrabold transition-colors " +
        (active
          ? "border-duo-green-dim bg-duo-green text-white"
          : "border-ink-200 bg-white text-ink-500 hover:bg-ink-100")
      }
    >
      <span>{emoji}</span>
      {label}
    </button>
  );
}

export function TrackPicker() {
  const activeTrack = useStudyStore((s) => s.activeTrack);
  const setTrack = useStudyStore((s) => s.setTrack);

  return (
    <div className="rounded-2xl border-2 border-b-4 border-ink-200 bg-white px-4 py-3.5">
      <p className="mb-2 text-xs font-extrabold uppercase tracking-widest text-ink-400">
        학습 트랙
      </p>

      {/* items-stretch: 칩 높이를 서로 맞춰 세로 정렬이 어긋나지 않게 */}
      {/* 순서: 전체 → 프론트엔드 → 백엔드 (TRACKS 배열 순서를 그대로 따른다) */}
      <div className="flex items-stretch gap-2">
        <TrackChip
          active={activeTrack === null}
          emoji="📚"
          label="전체"
          onClick={() => setTrack(null)}
        />
        {TRACKS.map((t) => (
          <TrackChip
            key={t.id}
            active={activeTrack === t.id}
            emoji={t.emoji}
            label={t.name}
            onClick={() => setTrack(t.id as TrackId)}
          />
        ))}
      </div>
    </div>
  );
}

/** 완주 게이지 — 트랙을 얼마나 걸었는지 보여주는 "장기" 목표 (퀴즈 탭용). */
export function TrackProgress() {
  const activeTrack = useStudyStore((s) => s.activeTrack);
  const lessonProgress = useStudyStore((s) => s.lessonProgress);

  // 완주율 — 지금 보고 있는 길의 전체 노드 대비 완료 노드.
  const nodes = unitsFor(activeTrack).flatMap((u) => u.nodes);
  const done = nodes.filter((n) => lessonProgress[n.id]).length;
  const pct = nodes.length ? Math.round((done / nodes.length) * 100) : 0;

  const current = TRACKS.find((t) => t.id === activeTrack);

  return (
    <div className="rounded-2xl border-2 border-ink-200 bg-white p-4">
      <div className="mb-1 flex items-baseline justify-between">
        <span className="text-xs font-extrabold text-ink-500">
          {current ? `${current.name} 완주` : "전체 진도"}
        </span>
        <span className="font-round text-xs font-extrabold tabular-nums text-duo-green">
          {done}/{nodes.length} · {pct}%
        </span>
      </div>
      <div
        className="progress-track"
        role="progressbar"
        aria-label={`${current ? current.name + " 완주" : "전체"} 진도 ${done}/${nodes.length}`}
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
