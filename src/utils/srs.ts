// =============================================================
// srs.ts — 망각곡선 기반 간격 반복 (Spaced Repetition, 라이트판)
//
// 큰 그림 (초보자용):
// - 사람은 외운 걸 시간이 지나면 잊는다 (망각곡선). 잊기 "직전"에
//   다시 보면 기억이 오래간다 — 그래서 복습 간격을 점점 늘린다.
// - 규칙:
//     · 모름/헷갈림(unknown/fuzzy) → 언제나 복습 대상 (아직 못 외운 것).
//     · 이해함(understood)         → reviewCount 에 따라 1→3→7→14→30일
//       뒤에 "만기(due)"가 되어 다시 복습 대상으로 돌아온다.
// - QuestionRecord 의 lastReviewedAt + reviewCount 는 처음부터
//   이 용도로 예약해둔 필드다 (types.ts 참고).
// =============================================================

import type { QuestionRecord } from "../types";

/** 복습 간격(일) — reviewCount 가 늘수록 다음 복습이 멀어진다. */
export const SRS_INTERVALS_DAYS = [1, 3, 7, 14, 30] as const;

const DAY_MS = 24 * 60 * 60 * 1000;

/** reviewCount → 다음 복습까지 간격(ms). 표를 넘어가면 마지막(30일) 고정. */
export function intervalOf(reviewCount: number): number {
  const idx = Math.min(
    Math.max(reviewCount - 1, 0),
    SRS_INTERVALS_DAYS.length - 1
  );
  return SRS_INTERVALS_DAYS[idx] * DAY_MS;
}

/** 이 기록이 다시 복습 대상이 되는 시각 (epoch ms). */
export function dueAt(record: QuestionRecord): number {
  return record.lastReviewedAt + intervalOf(record.reviewCount);
}

/**
 * 지금 복습해야 하는 문제인가?
 * - 모름/헷갈림: 항상 true (아직 못 외운 것).
 * - 이해함: 간격이 지나 "만기"가 됐을 때만 true.
 */
export function isDue(record: QuestionRecord, now: number = Date.now()): boolean {
  if (record.status !== "understood") return true;
  return now >= dueAt(record);
}
