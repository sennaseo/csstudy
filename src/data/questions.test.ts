// =============================================================
// 문제 데이터 자체 점검 (assert 만 쓰는 최소 테스트)
//
// 실행: npx tsx src/data/questions.test.ts
//
// 지키려는 약속:
//   1) 모든 문제에 SUMMARIES 한 줄 요약이 있다 (객관식 보기로 쓰이므로 필수).
//   2) 문제 id 가 중복되지 않는다 (localStorage 키라서 겹치면 진행도가 섞인다).
//   3) 요약이 서로 겹치지 않는다 (정답과 오답 보기가 같으면 문제가 성립 안 함).
//   4) 카테고리가 CATEGORY_GROUPS 에 빠짐없이 배치돼 있다 (안 그러면 길에서 사라짐).
//   6) 모든 문제에 난이도(LEVEL_OF)가 있고, 비율·카테고리 분포가 쓸 만하다.
// =============================================================

import assert from "node:assert/strict";
import { QUESTIONS, SUMMARIES, CATEGORY_GROUPS, CATEGORY_EMOJI } from "./questions";
import { LEVEL_OF } from "./levels";
import type { Category, Level } from "../types";

// 1) 모든 문제에 요약이 있는가
{
  const missing = QUESTIONS.filter((q) => !SUMMARIES[q.id]).map((q) => q.id);
  assert.deepEqual(missing, [], `SUMMARIES 누락: ${missing.join(", ")}`);
}

// 2) id 중복 없음
{
  const ids = QUESTIONS.map((q) => q.id);
  const dup = ids.filter((id, i) => ids.indexOf(id) !== i);
  assert.deepEqual(dup, [], `중복된 문제 id: ${dup.join(", ")}`);
}

// 3) 요약 텍스트 중복 없음 (같으면 보기에서 정답이 두 개가 된다)
{
  const used = QUESTIONS.map((q) => SUMMARIES[q.id]);
  const dup = used.filter((t, i) => used.indexOf(t) !== i);
  assert.deepEqual([...new Set(dup)], [], `중복된 요약: ${dup.join(" / ")}`);
}

// 4) 모든 카테고리가 그룹에 배치되고 이모지가 있는가
{
  const placed = new Set(Object.values(CATEGORY_GROUPS).flat());
  const used = new Set(QUESTIONS.map((q) => q.category));
  for (const c of used) {
    assert.ok(placed.has(c), `CATEGORY_GROUPS 에 없는 카테고리: ${c} (길에서 사라진다)`);
    assert.ok(CATEGORY_EMOJI[c as Category], `이모지 없는 카테고리: ${c}`);
  }
}

// 5) 빈 문제/정답이 없는가
for (const q of QUESTIONS) {
  assert.ok(q.question.trim().length > 0, `빈 question: ${q.id}`);
  assert.ok(q.answer.trim().length > 10, `너무 짧은 answer: ${q.id}`);
}

// 6) 난이도 표(LEVEL_OF) 점검
const LEVELS: Level[] = ["easy", "normal", "hard"];
const byLevel = LEVELS.map((lv) => [lv, QUESTIONS.filter((q) => LEVEL_OF[q.id] === lv)] as const);
{
  // 6-a) 키가 문제와 정확히 일대일인가
  const ids = new Set(QUESTIONS.map((q) => q.id));
  const missing = QUESTIONS.filter((q) => !LEVEL_OF[q.id]).map((q) => q.id);
  assert.deepEqual(missing, [], `LEVEL_OF 누락: ${missing.join(", ")}`);
  const orphan = Object.keys(LEVEL_OF).filter((id) => !ids.has(id));
  assert.deepEqual(orphan, [], `QUESTIONS 에 없는 id 가 LEVEL_OF 에 있음: ${orphan.join(", ")}`);
  assert.equal(Object.keys(LEVEL_OF).length, QUESTIONS.length, "LEVEL_OF 개수 ≠ 문제 수");

  // 6-b) 비율이 허용 범위 안인가 (목표 4:4:2)
  const range: Record<Level, [number, number]> = {
    easy: [40, 70],
    normal: [45, 75],
    hard: [15, 40],
  };
  for (const [lv, qs] of byLevel) {
    const [lo, hi] = range[lv];
    assert.ok(qs.length >= lo && qs.length <= hi, `${lv} 개수 ${qs.length} 가 ${lo}~${hi} 범위 밖`);
  }
}

console.log(`✅ 문제 데이터 점검 통과 — 총 ${QUESTIONS.length}문제`);
const counts = QUESTIONS.reduce<Record<string, number>>((acc, q) => {
  acc[q.category] = (acc[q.category] ?? 0) + 1;
  return acc;
}, {});
console.log(
  Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([c, n]) => `   ${CATEGORY_EMOJI[c as Category]} ${c}: ${n}`)
    .join("\n")
);

// 난이도 표 (검토용)
console.log(
  `\n📊 난이도 분포 — ${byLevel.map(([lv, qs]) => `${lv} ${qs.length}`).join(" / ")}`
);
console.log("   카테고리          easy  normal  hard");
for (const [c] of Object.entries(counts).sort((a, b) => b[1] - a[1])) {
  const n = (lv: Level) =>
    String(QUESTIONS.filter((q) => q.category === c && LEVEL_OF[q.id] === lv).length).padStart(4);
  console.log(`   ${c.padEnd(16)}${n("easy")}${n("normal").padStart(8)}${n("hard").padStart(6)}`);
}
