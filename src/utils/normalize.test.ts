// =============================================================
// 정규화 채점기 자체 점검 (assert 만 쓰는 최소 테스트)
//
// 실행: npx tsx src/utils/normalize.test.ts
//
// 지키려는 약속:
//   1) 스테이지마다 정답 박스는 클리어 판정(칼럼 전부·무손실·목표 정규형)을 받는다.
//   2) 원본 테이블을 통째로 두면 정해진 등급(2NF 스테이지→1NF, 3NF→2NF, BCNF→3NF)이 나온다.
//   3) 흔한 오답은 이론(chase)으로도 손실이고, 실제 데이터 조인에서도 가짜 행이 생긴다.
//      → 데이터를 바꾸다 이 교육 효과가 사라지면 여기서 걸린다.
// =============================================================

import assert from "node:assert/strict";
import { NORMALIZATION_LESSONS, type DecomposeLesson } from "../data/normalizationLessons";
import {
  candidateKeys,
  closure,
  compareWithOriginal,
  isLossless,
  joinAll,
  nfAtLeast,
  normalForm,
  preservedFds,
  project,
  redundantCells,
} from "./normalize";

const stage = (id: string) =>
  NORMALIZATION_LESSONS.find((l) => l.id === id) as DecomposeLesson;

/** 박스대로 쪼갠 뒤 다시 붙였을 때 가짜 행 수 */
const spuriousCount = (l: DecomposeLesson, boxes: string[][]) => {
  const { table } = joinAll(boxes.map((cols) => ({ cols, rows: project(l.rows, cols) })));
  return compareWithOriginal(l.rows, table).spurious.filter(Boolean).length;
};

// 기초 함수
{
  const fds = [
    { lhs: ["A"], rhs: ["B"] },
    { lhs: ["B"], rhs: ["C"] },
  ];
  assert.deepEqual([...closure(["A"], fds)].sort(), ["A", "B", "C"]);
  assert.deepEqual(candidateKeys(["A", "B", "C"], fds), [["A"]]);
  assert.equal(project([{ A: "1", B: "x" }, { A: "1", B: "x" }], ["A"]).length, 1);
}

// 1) 정답은 클리어 / 2) 원본 하나는 정해진 등급
const ORIGINAL_NF = { "2nf": "1NF", "3nf": "2NF", bcnf: "3NF" } as const;
for (const id of ["2nf", "3nf", "bcnf"] as const) {
  const l = stage(id);
  const covered = new Set(l.answer.flat());
  assert.ok(l.cols.every((c) => covered.has(c)), `${id}: 정답이 칼럼을 빠뜨림`);
  assert.ok(isLossless(l.answer, l.cols, l.fds), `${id}: 정답이 손실 분해로 판정됨`);
  for (const b of l.answer) assert.ok(nfAtLeast(normalForm(b, l.fds), l.target), `${id}: 정답 박스 ${b} 가 ${l.target} 미만`);
  assert.equal(spuriousCount(l, l.answer), 0, `${id}: 정답 조인에 가짜 행`);
  if (l.requirePreserve) assert.ok(preservedFds(l.answer, l.fds).every(Boolean), `${id}: 정답이 FD 를 잃음`);
  assert.equal(normalForm(l.cols, l.fds), ORIGINAL_NF[id], `${id}: 원본 등급`);
  // 원본엔 노란 하이라이트(중복)가 있어야 보여줄 게 있다
  assert.ok(redundantCells(l.rows, l.cols, l.fds).size > 0, `${id}: 원본에 중복 칸이 없음`);
}

// BCNF: 정답은 {학생번호, 특강이름} → 교수 를 잃는다 (BCNF 의 대가)
{
  const l = stage("bcnf");
  assert.deepEqual(preservedFds(l.answer, l.fds), [false, true]);
  assert.deepEqual(candidateKeys(l.cols, l.fds), [["학생번호", "특강이름"], ["학생번호", "교수"]]);
}

// 3) 흔한 오답 → 이론상 손실 + 데이터에 가짜 행
const WRONG: [string, string[][]][] = [
  ["bcnf", [["학생번호", "특강이름"], ["특강이름", "교수"]]],
  ["2nf", [["학번", "이름", "과목코드"], ["과목코드", "과목명", "성적"]]],
  ["3nf", [["학번", "이름", "학과사무실"], ["학과", "학과사무실"]]],
];
for (const [id, boxes] of WRONG) {
  const l = stage(id);
  assert.equal(isLossless(boxes, l.cols, l.fds), false, `${id}: 오답이 무손실로 판정됨`);
  assert.ok(spuriousCount(l, boxes) > 0, `${id}: 오답인데 데이터 조인에 가짜 행이 안 생김`);
}

// 공통 칼럼 없는 박스는 카티션 곱 (on 이 비어 있음)
{
  const l = stage("3nf");
  const { steps, table } = joinAll(
    [["학번", "이름"], ["학과", "학과사무실"]].map((cols) => ({ cols, rows: project(l.rows, cols) }))
  );
  assert.deepEqual(steps[0].on, []);
  assert.equal(table.rows.length, 5 * 4);
}

console.log("✅ normalize: 모든 스테이지 정답/오답 판정 통과");
