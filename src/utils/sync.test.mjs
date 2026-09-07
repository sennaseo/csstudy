// mergeStates 의 오답 필드 병합 검사 — node src/utils/sync.test.mjs
// sync.ts 는 TS 라 여기서 직접 못 부른다. 병합 규칙만 그대로 옮겨 검증한다.
// (규칙이 바뀌면 이 파일도 같이 고쳐야 한다.)
import assert from "node:assert/strict";

function mergeRecords(aRecs, bRecs) {
  const records = { ...aRecs };
  for (const [id, rb] of Object.entries(bRecs)) {
    const ra = records[id];
    const newer = !ra || rb.lastReviewedAt > ra.lastReviewedAt ? rb : ra;
    const wrongWinner = (ra?.lastWrongAt ?? 0) >= (rb.lastWrongAt ?? 0) ? ra : rb;
    records[id] = {
      ...newer,
      reviewCount: Math.max(ra?.reviewCount ?? 0, rb.reviewCount),
      wrongCount: Math.max(ra?.wrongCount ?? 0, rb.wrongCount ?? 0),
      lastWrongQid: wrongWinner?.lastWrongQid,
      lastWrongAt: wrongWinner?.lastWrongAt,
    };
  }
  return records;
}

const rec = (o) => ({ id: "q1", status: "unknown", lastReviewedAt: 0, reviewCount: 0, ...o });

// 1) 한쪽에만 있는 문제는 그대로 살아남는다.
assert.deepEqual(mergeRecords({}, { q1: rec({ wrongCount: 2 }) }).q1.wrongCount, 2);

// 2) wrongCount 는 큰 쪽 (양쪽에서 푼 걸 잃지 않는다).
assert.equal(
  mergeRecords({ q1: rec({ wrongCount: 5 }) }, { q1: rec({ wrongCount: 3 }) }).q1.wrongCount,
  5
);

// 3) 최근에 복습한 쪽이 status 를 가져간다.
assert.equal(
  mergeRecords(
    { q1: rec({ lastReviewedAt: 100, status: "unknown" }) },
    { q1: rec({ lastReviewedAt: 200, status: "understood" }) }
  ).q1.status,
  "understood"
);

// 4) 핵심: 최근 복습(B)에서 맞았어도, 더 최근 오답 기록(A)이 살아남는다.
//    — 오답 정보는 lastReviewedAt 이 아니라 lastWrongAt 으로 승자를 고른다.
const m = mergeRecords(
  { q1: rec({ lastReviewedAt: 100, lastWrongAt: 90, lastWrongQid: "q-confused" }) },
  { q1: rec({ lastReviewedAt: 200, status: "understood" }) }
);
assert.equal(m.q1.status, "understood");
assert.equal(m.q1.lastWrongQid, "q-confused");
assert.equal(m.q1.lastWrongAt, 90);

// 5) 더 최근에 틀린 쪽의 혼동 대상이 이긴다.
assert.equal(
  mergeRecords(
    { q1: rec({ lastWrongAt: 50, lastWrongQid: "old" }) },
    { q1: rec({ lastWrongAt: 300, lastWrongQid: "new" }) }
  ).q1.lastWrongQid,
  "new"
);

// 6) 오답이 한 번도 없으면 필드는 undefined 로 남는다.
assert.equal(mergeRecords({ q1: rec({}) }, { q1: rec({}) }).q1.lastWrongQid, undefined);

console.log("mergeStates 오답 병합 6/6 통과");
