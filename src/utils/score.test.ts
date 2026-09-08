// =============================================================
// score 자체 점검 (assert 만 쓰는 최소 테스트 — 프레임워크 없음)
//
// 실행: npx tsx src/utils/score.test.ts
// =============================================================

import assert from "node:assert/strict";
import { scoreOf, tierOf, byCategory } from "./score";

// 1) scoreOf — 0 나누기 방지 + 반올림
assert.equal(scoreOf(0, 0), 0);
assert.equal(scoreOf(2, 3), 67);
assert.equal(scoreOf(5, 5), 100);

// 2) tierOf — 경계값 (이상 기준)
assert.equal(tierOf(100).label, "최고예요!");
assert.equal(tierOf(90).label, "최고예요!");
assert.equal(tierOf(89).label, "좋아요");
assert.equal(tierOf(70).label, "좋아요");
assert.equal(tierOf(69).label, "조금만 더");
assert.equal(tierOf(50).label, "조금만 더");
assert.equal(tierOf(49).label, "다시 볼까요?");
assert.equal(tierOf(0).label, "다시 볼까요?");

// 3) byCategory — q-cs-1, q-cs-2 는 둘 다 CS, q-react-1 은 React (questions.ts 에서 직접 확인함).
//    존재하지 않는 qid("q-없는문제-999")는 조용히 무시되어야 한다.
{
  const result = byCategory([
    { qid: "q-cs-1", correct: true },
    { qid: "q-react-1", correct: false },
    { qid: "q-cs-2", correct: false },
    { qid: "q-없는문제-999", correct: true },
  ]);

  // 같은 카테고리끼리 합산
  const cs = result.find((r) => r.category === "CS");
  assert.ok(cs, "CS 카테고리가 결과에 있어야 한다");
  assert.equal(cs!.correct, 1);
  assert.equal(cs!.total, 2);

  const react = result.find((r) => r.category === "React");
  assert.ok(react, "React 카테고리가 결과에 있어야 한다");
  assert.equal(react!.correct, 0);
  assert.equal(react!.total, 1);

  // 존재하지 않는 qid 는 무시되어 카테고리가 2개만 있어야 한다
  assert.equal(result.length, 2);

  // 첫 등장 순서 유지: CS(q-cs-1) 가 React(q-react-1) 보다 먼저 나왔으므로 CS 가 먼저
  assert.equal(result[0].category, "CS");
  assert.equal(result[1].category, "React");
}

console.log("✅ score 자체 점검 통과");
