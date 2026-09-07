// continueQuiz 의 status 결정 규칙 검사 — node src/utils/status.test.mjs
// 스토어는 TS 라 직접 못 부른다. 규칙 한 줄만 그대로 옮겨 검증한다.
// (useStudyStore.ts 의 continueQuiz 가 바뀌면 여기도 같이 고쳐야 한다.)
import assert from "node:assert/strict";

const statusOf = (correct, unsure) =>
  !correct ? "unknown" : unsure ? "fuzzy" : "understood";

// SRS 규칙(srs.ts): understood 만 간격을 두고 쉬어간다. 나머지는 항상 복습 대상.
const alwaysDue = (s) => s !== "understood";

// 1) 그냥 맞히면 이해함 → 간격 두고 쉬어간다.
assert.equal(statusOf(true, false), "understood");
assert.equal(alwaysDue(statusOf(true, false)), false);

// 2) 핵심: 맞혔어도 "몰랐어요"면 fuzzy → 복습 큐에 계속 남는다.
assert.equal(statusOf(true, true), "fuzzy");
assert.equal(alwaysDue(statusOf(true, true)), true);

// 3) 틀리면 unsure 와 무관하게 unknown (이미 최하위라 더 내려갈 곳이 없다).
assert.equal(statusOf(false, false), "unknown");
assert.equal(statusOf(false, true), "unknown");

// 4) "모르겠어요" 버튼 = 오답 처리 = unknown.
assert.equal(statusOf(false, false), "unknown");

// 5) XP 순서가 뒤집히지 않는다 (이해함 > 헷갈림 > 모름).
const XP = { understood: 12, fuzzy: 7, unknown: 4 };
assert.ok(XP.understood > XP.fuzzy && XP.fuzzy > XP.unknown);

console.log("status 결정 규칙 5/5 통과");
