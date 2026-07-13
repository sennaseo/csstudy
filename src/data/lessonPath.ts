// =============================================================
// 레슨 경로 (듀오링고식 스킬 트리)
//
// 설계 메모 (초보자용):
// - "길(path)" 은 노드(동그란 레슨 버튼)들이 위→아래로 이어진 것.
// - 구조: 그룹(섹션) ▸ 유닛(카테고리) ▸ 노드(레슨/복습).
//     · 카테고리 4문제 → 2문제씩 레슨 2개 + 그 카테고리 전체를 다시 푸는 '복습' 1개.
//     · 즉, 유닛 하나 = 노드 3개.
// - 이 파일은 QUESTIONS 에서 "자동으로" 경로를 만든다.
//   → 문제를 추가/삭제하면 경로도 알아서 따라온다 (수동 동기화 불필요).
// - 노드 id 는 안정적이어야 한다(진행도 저장 키라서): `lesson-<카테고리>-<n>`, `review-<카테고리>`.
//   카테고리 이름이 한글이면 키에 한글이 들어가지만 localStorage 키로 문제없다.
// - ALL_NODES = 모든 노드를 "푸는 순서대로" 한 줄로 편 배열 → 순차 언락 계산에 쓴다.
// =============================================================

import type { Category, CategoryGroup } from "../types";
import { CATEGORY_GROUPS, CATEGORY_EMOJI, QUESTIONS } from "./questions";

/** 노드 한 개 = 레슨 또는 복습. */
export interface LessonNode {
  id: string;
  category: Category;
  kind: "lesson" | "review";
  /** 노드 안에서 풀 문제 id 들 (푸는 순서대로). */
  questionIds: string[];
  /** 노드 라벨 (예: "레슨 1", "복습"). */
  label: string;
}

/** 유닛 = 카테고리 하나. 노드 묶음 + 표시용 메타. */
export interface PathUnit {
  category: Category;
  group: CategoryGroup;
  emoji: string;
  nodes: LessonNode[];
}

/** 배열을 size 개씩 잘라 2차원 배열로. (4문제 → [[a,b],[c,d]]) */
function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

/** 한 카테고리의 노드들을 만든다: 2문제씩 레슨 + 전체 복습 1개. */
function buildNodes(category: Category): LessonNode[] {
  const ids = QUESTIONS.filter((q) => q.category === category).map((q) => q.id);
  const lessons: LessonNode[] = chunk(ids, 2).map((group, i) => ({
    id: `lesson-${category}-${i + 1}`,
    category,
    kind: "lesson" as const,
    questionIds: group,
    label: `레슨 ${i + 1}`,
  }));
  // 문제가 2개 미만이면 복습 노드는 군더더기라 생략.
  if (ids.length >= 2) {
    lessons.push({
      id: `review-${category}`,
      category,
      kind: "review",
      questionIds: ids,
      label: "복습",
    });
  }
  return lessons;
}

/**
 * 전체 경로. 그룹 → 그 안의 카테고리 순서대로 유닛을 만든다.
 * 그룹/카테고리 순서는 CATEGORY_GROUPS 정의 순서를 그대로 따른다.
 */
export const PATH_UNITS: PathUnit[] = (
  Object.entries(CATEGORY_GROUPS) as [CategoryGroup, Category[]][]
).flatMap(([group, cats]) =>
  cats
    .map((category) => ({
      category,
      group,
      emoji: CATEGORY_EMOJI[category],
      nodes: buildNodes(category),
    }))
    .filter((u) => u.nodes.length > 0)
);

/** 모든 노드를 "푸는 순서대로" 편 배열 — 순차 언락 계산용. */
export const ALL_NODES: LessonNode[] = PATH_UNITS.flatMap((u) => u.nodes);

/** id → 노드 빠른 조회. */
export const NODE_BY_ID: Record<string, LessonNode> = Object.fromEntries(
  ALL_NODES.map((n) => [n.id, n])
);
