// 미션 데이터 자체 점검 — npx tsx src/data/missions.test.ts
import assert from "node:assert/strict";
import { QUESTIONS } from "./questions";
import { dateKeyOf, missionFor, missionPool, missionProgress } from "./missions";

// ① 같은 날·같은 트랙이면 같은 미션
assert.deepEqual(missionFor("2026-10-06", "frontend"), missionFor("2026-10-06", "frontend"));

// ② 풀 밖 카테고리를 안 고른다 (backend 트랙에 React 없음)
assert.ok(!missionPool("backend").includes("React"));
for (let d = 1; d <= 31; d++) {
  const key = `2026-10-${String(d).padStart(2, "0")}`;
  assert.ok(missionPool("backend").includes(missionFor(key, "backend").category));
}

// ③ 진행도: 오늘 understood 2 + 어제 understood 1 + 오늘 unknown 1 → 2
const today = new Date(2026, 9, 6, 12);
const yesterday = new Date(2026, 9, 5, 12);
const m = missionFor("2026-10-06", null);
const ids = QUESTIONS.filter((q) => q.category === m.category).map((q) => q.id);
assert.ok(ids.length >= 4);
const rec = (status: "understood" | "unknown", d: Date) => ({ status, lastReviewedAt: d.getTime() }) as never;
const records = {
  [ids[0]]: rec("understood", today),
  [ids[1]]: rec("understood", today),
  [ids[2]]: rec("understood", yesterday),
  [ids[3]]: rec("unknown", today),
};
assert.equal(missionProgress(m, records, "2026-10-06"), 2);

// ④ 날짜 키 형식
assert.equal(dateKeyOf(new Date(2026, 9, 6)), "2026-10-06");

console.log("missions 4/4 통과");
