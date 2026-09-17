// =============================================================
// 트랙 자체 점검 (assert 만 쓰는 최소 테스트 — 프레임워크 없음)
//
// 실행: npx tsx src/data/tracks.test.ts
//
// 여기서 지키려는 약속 3가지:
//   1) 트랙을 도입해도 **기존 진행도가 안 날아간다** (노드 id 가 그대로).
//   2) 트랙 안에서 같은 문제가 두 번 나오지 않는다 (CS 를 쪼갠 게 겹치면 안 됨).
//   3) 어떤 문제도 길에서 사라지지 않는다 (전체 보기 기준).
// =============================================================

import assert from "node:assert/strict";
import { QUESTIONS } from "./questions";
import { ALL_UNITS, TRACK_UNITS, unitsFor, nodesFor, NODE_BY_ID } from "./lessonPath";
import { TRACKS } from "./tracks";
import type { TrackId } from "./tracks";
import type { Level } from "../types";

// 1) 진행도 보존 — 트랙의 첫 등장 카테고리는 예전 노드 id 를 그대로 써야 한다.
//    (예전 id 형식: lesson-<카테고리>-<n> / review-<카테고리>)
{
  const legacyIds = new Set(ALL_UNITS.flatMap((u) => u.nodes.map((n) => n.id)));
  // 프론트엔드 트랙은 카테고리가 안 겹치므로 노드 id 가 전부 예전 것과 같아야 한다.
  for (const node of TRACK_UNITS.frontend.flatMap((u) => u.nodes)) {
    assert.ok(
      legacyIds.has(node.id),
      `프론트엔드 트랙 노드 id 가 예전과 달라 진행도가 날아간다: ${node.id}`
    );
  }
  // 백엔드는 CS 를 두 번 쓰므로 두 번째(CS 심화)만 꼬리표가 붙는다.
  const backendIds = TRACK_UNITS.backend.flatMap((u) => u.nodes.map((n) => n.id));
  const suffixed = backendIds.filter((id) => !legacyIds.has(id));
  assert.ok(
    suffixed.every((id) => id.includes("CS-2")),
    `꼬리표는 CS 두 번째 등장에만 붙어야 한다: ${suffixed.join(", ")}`
  );
}

// 2) 트랙 안에서 문제 중복 없음 (레슨 노드끼리 — 복습 노드는 원래 다시 푸는 거라 제외).
for (const track of TRACKS) {
  const ids = nodesFor(track.id)
    .filter((n) => n.kind === "lesson")
    .flatMap((n) => n.questionIds);
  assert.equal(
    new Set(ids).size,
    ids.length,
    `${track.name} 트랙에 같은 문제가 두 번 나온다`
  );
}

// 3) 전체 보기에는 모든 문제가 들어 있어야 한다 (문제가 길에서 실종되면 안 됨).
{
  const inPath = new Set(
    ALL_UNITS.flatMap((u) => u.nodes)
      .filter((n) => n.kind === "lesson")
      .flatMap((n) => n.questionIds)
  );
  for (const q of QUESTIONS) {
    assert.ok(inPath.has(q.id), `길에서 빠진 문제: ${q.id}`);
  }
}

// 4) CS 를 쪼갠 두 스텝이 CS 문제 전체를 덮는지 (백엔드 트랙 기준).
{
  const csAll = QUESTIONS.filter((q) => q.category === "CS").map((q) => q.id);
  const csInBackend = new Set(
    TRACK_UNITS.backend
      .filter((u) => u.category === "CS")
      .flatMap((u) => u.nodes)
      .filter((n) => n.kind === "lesson")
      .flatMap((n) => n.questionIds)
  );
  for (const id of csAll) {
    assert.ok(csInBackend.has(id), `백엔드 트랙에서 빠진 CS 문제: ${id}`);
  }
}

// 5) 모든 트랙 노드가 NODE_BY_ID 로 조회 가능해야 한다 (startLesson 이 못 찾으면 먹통).
for (const track of [...TRACKS.map((t) => t.id), null] as const) {
  for (const node of nodesFor(track)) {
    assert.ok(NODE_BY_ID[node.id], `조회표에 없는 노드: ${node.id}`);
  }
}

// 6) unitsFor(null) 은 전체 보기와 같아야 한다.
assert.equal(unitsFor(null).length, ALL_UNITS.length);

// 7) 레벨 뷰 = 노드 부분집합(진행도 보존) + 레슨 ≥3 + 복습 0개 + 유닛 개수 불변.
//    (9개 뷰: 트랙 3 × 레벨 3)
{
  const tracksToCheck: (TrackId | null)[] = ["frontend", "backend", null];
  const levelsToCheck: Level[] = ["easy", "normal", "hard"];
  const rows: string[] = [];

  for (const t of tracksToCheck) {
    const mixIds = new Set(nodesFor(t, null).map((n) => n.id));
    for (const l of levelsToCheck) {
      const levelNodes = nodesFor(t, l);
      const levelIds = levelNodes.map((n) => n.id);

      // (a) 부분집합 = 진행도 보존의 물증.
      for (const id of levelIds) {
        assert.ok(
          mixIds.has(id),
          `${t ?? "전체"}/${l} 뷰의 노드 id 가 믹스 뷰에 없다 (진행도 소실 위험): ${id}`
        );
      }

      // (b) 레슨 노드 최소 개수.
      assert.ok(
        levelNodes.length >= 3,
        `${t ?? "전체"}/${l} 뷰의 레슨 노드가 3개 미만이다: ${levelNodes.length}개`
      );

      // (c) 복습 노드 0개.
      assert.equal(
        levelNodes.filter((n) => n.kind === "review").length,
        0,
        `${t ?? "전체"}/${l} 뷰에 복습 노드가 섞여 있다`
      );

      rows.push(`   ${(t ?? "전체").padEnd(8)} × ${l.padEnd(6)} : 노드 ${levelNodes.length}개`);
    }

    // (d) unitsFor(t) 와 unitsFor(t, null) 길이 동일 — level 기본값(null)이 예전 시그니처와 동치임을 확인.
    assert.equal(
      unitsFor(t).length,
      unitsFor(t, null).length,
      `${t ?? "전체"}: unitsFor(t) 와 unitsFor(t, null) 길이가 다르다`
    );
  }

  console.log("✅ 레벨 뷰 점검 통과 (9개 뷰)");
  console.log(rows.join("\n"));
}

console.log("✅ tracks 자체 점검 통과");
console.log(
  TRACKS.map(
    (t) => `   ${t.emoji} ${t.name}: 유닛 ${TRACK_UNITS[t.id].length}개 · 노드 ${nodesFor(t.id).length}개`
  ).join("\n")
);
