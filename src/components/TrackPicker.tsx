// =============================================================
// TrackPicker — 역할별 로드맵(트랙) 선택 + 완주 목표
//
// 설계 메모 (초보자용):
// - roadmap.sh 처럼 "프론트엔드 개발자 / 백엔드 개발자" 중 하나를 고르면
//   그 역할에 필요한 유닛만, 기초 → 심화 순서로 길이 다시 깔린다.
// - 고르지 않으면 예전처럼 전체 카테고리가 다 나온다 ("전부").
// - 트랙을 바꿔도 이미 푼 레슨은 완료로 남는다 (진행도 키가 그대로라서).
//   그래서 "잘못 고르면 어쩌지" 걱정 없이 왔다 갔다 해도 된다.
//
// 완주 목표(GoalGauge 가 '오늘' 목표라면, 이건 '장기' 목표):
//   현재 트랙의 노드 중 몇 개를 끝냈는지 = 트랙 완주율.
// =============================================================

import { useStudyStore } from "../store/useStudyStore";
import { unitsFor } from "../data/lessonPath";
import { TRACKS } from "../data/tracks";
import type { TrackId } from "../data/tracks";

/** 칩 하나 — 트랙 또는 "전부". */
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
        "flex-1 rounded-xl border-b-4 px-3 py-2.5 text-xs font-extrabold transition-colors " +
        (active
          ? "border-duo-green-dim bg-duo-green text-white"
          : "border-ink-200 bg-white text-ink-500 hover:bg-ink-50")
      }
    >
      <span className="mr-1">{emoji}</span>
      {label}
    </button>
  );
}

export function TrackPicker() {
  const activeTrack = useStudyStore((s) => s.activeTrack);
  const setTrack = useStudyStore((s) => s.setTrack);
  const lessonProgress = useStudyStore((s) => s.lessonProgress);

  // 완주율 — 지금 보고 있는 길의 전체 노드 대비 완료 노드.
  const nodes = unitsFor(activeTrack).flatMap((u) => u.nodes);
  const done = nodes.filter((n) => lessonProgress[n.id]).length;
  const pct = nodes.length ? Math.round((done / nodes.length) * 100) : 0;

  const current = TRACKS.find((t) => t.id === activeTrack);

  return (
    <div className="rounded-2xl border-2 border-b-4 border-ink-200 bg-white px-4 py-3.5">
      <p className="mb-2 text-[11px] font-extrabold uppercase tracking-widest text-ink-300">
        학습 트랙
      </p>

      <div className="flex gap-2">
        {TRACKS.map((t) => (
          <TrackChip
            key={t.id}
            active={activeTrack === t.id}
            emoji={t.emoji}
            label={t.name}
            onClick={() => setTrack(t.id as TrackId)}
          />
        ))}
        <TrackChip
          active={activeTrack === null}
          emoji="📚"
          label="전부"
          onClick={() => setTrack(null)}
        />
      </div>

      {/* 고른 트랙 소개 — 전체 보기일 땐 안내 문구 */}
      <p className="mt-2.5 text-[11px] font-semibold leading-snug text-ink-500">
        {current ? current.description : "모든 카테고리를 순서대로 — 트랙을 고르면 목표에 맞게 정렬돼요."}
      </p>

      {/* 완주 게이지 — 장기 목표 */}
      <div className="mt-3">
        <div className="mb-1 flex items-baseline justify-between">
          <span className="text-[11px] font-extrabold text-ink-500">
            {current ? `${current.name} 완주` : "전체 진도"}
          </span>
          <span className="font-round text-xs font-extrabold tabular-nums text-duo-green">
            {done}/{nodes.length} · {pct}%
          </span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  );
}
