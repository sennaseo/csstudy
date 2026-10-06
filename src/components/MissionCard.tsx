// =============================================================
// MissionCard — 홈 2열 왼쪽 "🎯 오늘의 미션"
//
// - 미션 내용은 src/data/missions.ts 가 날짜로 정한다(같은 날·같은 트랙이면 같은 미션).
// - 진행도는 따로 저장하지 않는다 — records 에서 "오늘 이해함으로 기록된 그 카테고리
//   문제 수"를 센다. 보상(버디 XP +30)은 스토어 recordStatus 가 실제로 준다.
// - 상태 4가지:
//     ① 0/2 · 미지급  → NEW 코너 스티커 + "버디 XP +30" + "도전 →"   (버튼)
//     ② 1/2           → "버디 XP +30" + "도전 →"               (버튼)
//     ③ 2/2 · 미지급  → "✓ 달성 · 다음 문제를 풀면 XP 지급"         (div)
//        (대표 버디가 아직 없던 순간에 달성하면, 다음 문제를 풀 때 지급된다)
//     ④ 지급됨         → "✓ 완료 · XP 받음"                      (div)
// - 다 끝나면 버튼이 아니라 그냥 div — 눌러도 갈 곳이 없는데 눌리는 척하면 안 된다.
// - 색만으로 완료를 알리지 않는다: ✓ + 글자 + 숫자 n/2 를 같이 보여준다.
// =============================================================

import { CATEGORY_EMOJI, CATEGORY_GROUPS } from "../data/questions";
import type { CategoryGroup } from "../types";
import {
  dateKeyOf,
  MISSION_XP,
  missionFor,
  missionProgress,
} from "../data/missions";
import { useStudyStore } from "../store/useStudyStore";

export function MissionCard() {
  const records = useStudyStore((s) => s.records);
  const activeTrack = useStudyStore((s) => s.activeTrack);
  const lastMissionRewardDay = useStudyStore((s) => s.lastMissionRewardDay);
  const setGroup = useStudyStore((s) => s.setGroup);
  const setCategory = useStudyStore((s) => s.setCategory);
  const startRandom = useStudyStore((s) => s.startRandom);

  const todayKey = dateKeyOf(new Date());
  const m = missionFor(todayKey, activeTrack);
  const progress = missionProgress(m, records, todayKey);
  const paid = lastMissionRewardDay === todayKey;
  // 지급된 뒤엔 진행도가 내려가도(기록 수정 등) 2/2 로 고정해서 보여준다.
  const shown = paid ? m.target : Math.min(progress, m.target);
  const done = paid || progress >= m.target;
  const isNew = progress === 0 && !paid;

  const title = `${CATEGORY_EMOJI[m.category]} ${m.category} ${m.target}개 맞히기`;

  const body = (
    <>
      {/* NEW 는 흐름에서 빼서 카드 오른쪽 위 코너 스티커로 — 라벨이 두 줄로 꺾이지 않게 */}
      {isNew && (
        <span className="absolute -top-2 right-3 -rotate-6 rounded-full border border-duo-red/30 bg-duo-red-soft px-1.5 text-xs font-extrabold text-duo-red-ink">
          NEW
        </span>
      )}
      <span className="whitespace-nowrap text-xs font-bold text-ink-500">🎯 오늘의 미션</span>
      <span className="mt-1 block break-keep text-sm font-bold text-ink-900">{title}</span>
      <span className="mt-2 flex items-center gap-2">
        <span className="shrink-0 font-round text-xs font-bold tabular-nums text-ink-700">
          {shown}/{m.target}
        </span>
        <span
          className="progress-track !h-2 flex-1"
          role="progressbar"
          aria-label={`미션 진행 ${shown}/${m.target}`}
          aria-valuenow={Math.round((shown / m.target) * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <span
            className="progress-fill block"
            style={{ width: `${(shown / m.target) * 100}%` }}
          />
        </span>
      </span>
      {/* 하단 행 — mt-auto 로 카드 바닥에 붙인다(옆 실무 카드와 줄 맞춤) */}
      <span className="mt-auto flex items-end justify-between gap-1 pt-1.5">
        {done ? (
          <span className="break-keep text-xs font-bold text-duo-green-ink">
            {paid ? "✓ 완료 · XP 받음" : "✓ 달성 · 다음 문제를 풀면 XP 지급"}
          </span>
        ) : (
          <>
            <span className="text-xs font-bold text-duo-bee-ink">버디 XP +{MISSION_XP}</span>
            {/* "도전 →" 은 글자일 뿐 — 진짜 버튼은 카드 전체 하나(버튼 안 버튼 금지) */}
            <span className="shrink-0 text-sm font-bold text-duo-green-ink">도전 →</span>
          </>
        )}
      </span>
    </>
  );

  const cardClass =
    "relative flex min-h-[7rem] w-full flex-col rounded-2xl border border-ink-200 bg-white p-3 text-left";

  if (done) return <div className={cardClass}>{body}</div>;

  return (
    <button
      type="button"
      // 랜덤 연습을 미션 카테고리로 연다. 그 카테고리가 속한 그룹도 같이 골라서
      // 칩 줄이 짧아지고 선택된 칩이 화면 안에 보이게 한다(전체 그룹이면 칩 13개라 화면 밖으로 나간다).
      // (setCategory 가 랜덤 연습 필터를 그 카테고리로 남겨두는 건 허용 — 상단 칩에서 바로 바꿀 수 있다)
      onClick={() => {
        const group =
          (Object.keys(CATEGORY_GROUPS) as CategoryGroup[]).find((g) =>
            CATEGORY_GROUPS[g].includes(m.category),
          ) ?? null;
        setGroup(group);
        setCategory(m.category);
        startRandom();
      }}
      aria-label={`${title} · 진행 ${shown}/${m.target} · 보상 버디 XP ${MISSION_XP}`}
      className={cardClass + " transition-colors active:bg-ink-100"}
    >
      {body}
    </button>
  );
}
