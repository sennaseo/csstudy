/**
 * 오늘의 미션 데이터 — "{카테고리} 문제 2개 맞히기" 한 종류.
 *
 * 왜 진행도를 저장하지 않고 records 에서 파생하나?
 *  - 이미 records 에 "문제별 상태 + 마지막 풀이 시각"이 있다. 거기서 "오늘 이해함으로 기록된
 *    그 카테고리 문제 수"를 세면 되므로, 영속 필드·동기화 병합이 늘지 않는다.
 *    (저장하는 건 "보상을 받은 날" 하나뿐 — lastMissionRewardDay)
 *
 * 왜 "연속 정답"·"실무 1개 해결"은 미션이 될 수 없나?
 *  - 콤보는 저장되지 않는 일시 상태고, 실무는 iframe 프로토타입이라 스토어에 풀이 기록이 없다.
 *    records 로 셀 수 없는 건 미션으로 만들 수 없다.
 *
 * 이 파일은 스토어를 import 하지 않는다 (스토어가 이 파일을 쓰므로 순환 방지).
 */
import type { Category, QuestionRecord } from "../types";
import { CATEGORIES, QUESTIONS } from "./questions";
import { TRACK_BY_ID, type TrackId } from "./tracks";
import { seedOf } from "./memes";

export interface Mission {
  category: Category;
  target: number;
}

/** 미션 목표 문제 수 */
export const MISSION_TARGET = 2;
/** 미션 완료 보상 — 대표 버디 XP */
export const MISSION_XP = 30;

/**
 * Date → 'YYYY-MM-DD' (로컬 타임존).
 * 스토어(useStudyStore.ts)도 이 함수를 쓴다(한 곳에서만 정의).
 */
export function dateKeyOf(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** 미션 후보 카테고리 — 트랙이 있으면 그 트랙의 카테고리만, 없으면 전체. */
export function missionPool(activeTrack: TrackId | null): Category[] {
  // 저장돼 있던 옛 트랙 id 가 지금 없을 수도 있다 → 그땐 전체 풀을 쓴다
  const track = activeTrack ? TRACK_BY_ID[activeTrack] : undefined;
  if (!track) return CATEGORIES;
  return [...new Set(track.steps.map((s) => s.category))];
}

/** 날짜 시드로 정한 오늘의 미션 — 같은 날·같은 트랙이면 항상 같다. */
export function missionFor(dateKey: string, activeTrack: TrackId | null): Mission {
  const pool = missionPool(activeTrack);
  return { category: pool[seedOf(dateKey + "mission") % pool.length], target: MISSION_TARGET };
}

/** 오늘 "이해함"으로 기록된 그 카테고리 문제 수. */
export function missionProgress(
  m: Mission,
  records: Record<string, QuestionRecord>,
  dateKey: string,
): number {
  return QUESTIONS.filter((q) => {
    const r = records[q.id];
    return (
      q.category === m.category &&
      r?.status === "understood" &&
      dateKeyOf(new Date(r.lastReviewedAt)) === dateKey
    );
  }).length;
}
