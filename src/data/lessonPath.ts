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
// - nodesFor(트랙) = 그 트랙의 노드를 "푸는 순서대로" 한 줄로 편 배열 → 순차 언락 계산에 쓴다.
// - 트랙(roadmap.sh 식 역할별 로드맵)을 고르면 유닛 순서와 구성이 트랙 대본을 따른다.
//   트랙을 안 고르면 예전처럼 카테고리 전체가 순서대로 나온다 (ALL_UNITS).
// =============================================================

import type { Category, CategoryGroup } from "../types";
import { CATEGORY_GROUPS, CATEGORY_EMOJI, QUESTIONS } from "./questions";
import { TRACK_BY_ID } from "./tracks";
import type { TrackId, TrackStep } from "./tracks";

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

/** 유닛 = 카테고리 하나(트랙 모드에선 스텝 하나). 노드 묶음 + 표시용 메타. */
export interface PathUnit {
  category: Category;
  group: CategoryGroup;
  emoji: string;
  nodes: LessonNode[];
  /** 화면에 보일 이름 — 트랙에서는 스텝 label("웹 기초"), 전체 보기에서는 카테고리 이름. */
  label: string;
  /** 유닛 배너 밑 한 줄 설명 — 트랙 모드에만 있다. */
  blurb?: string;
}

/** 배열을 size 개씩 잘라 2차원 배열로. (4문제 → [[a,b],[c,d]]) */
function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

/**
 * 한 덩이(카테고리 또는 트랙 스텝)의 노드들을 만든다: 2문제씩 레슨 + 전체 복습 1개.
 *
 * - pickIds: 이 덩이에 쓸 문제 id 들. 안 주면 그 카테고리 전체.
 * - keySuffix: 노드 id 뒤에 붙일 꼬리표. 한 카테고리를 두 덩이로 쪼갤 때
 *   (CS → 웹 기초 / CS 심화) 노드 id 가 겹치지 않게 하려고 쓴다.
 *   꼬리표가 없으면 예전 id 그대로라서 **기존 진행도가 그대로 살아난다**.
 */
function buildNodes(
  category: Category,
  pickIds?: string[],
  keySuffix = ""
): LessonNode[] {
  const all = QUESTIONS.filter((q) => q.category === category).map((q) => q.id);
  // pickIds 가 있으면 그 순서가 아니라 '원래 문제 순서'를 지킨다 (난이도 순서 보존).
  const ids = pickIds ? all.filter((id) => pickIds.includes(id)) : all;
  const key = `${category}${keySuffix}`;
  const lessons: LessonNode[] = chunk(ids, 2).map((group, i) => ({
    id: `lesson-${key}-${i + 1}`,
    category,
    kind: "lesson" as const,
    questionIds: group,
    label: `레슨 ${i + 1}`,
  }));
  // 문제가 2개 미만이면 복습 노드는 군더더기라 생략.
  if (ids.length >= 2) {
    lessons.push({
      id: `review-${key}`,
      category,
      kind: "review",
      questionIds: ids,
      label: "복습",
    });
  }
  return lessons;
}

/** 카테고리 → 그 카테고리가 속한 그룹 (배너 구분선용 역방향 조회). */
const GROUP_OF: Record<string, CategoryGroup> = Object.fromEntries(
  (Object.entries(CATEGORY_GROUPS) as [CategoryGroup, Category[]][]).flatMap(
    ([group, cats]) => cats.map((c) => [c, group])
  )
);

/**
 * 전체 경로 (트랙을 안 고른 "전부 보기" 모드).
 * 그룹 → 그 안의 카테고리 순서대로. 순서는 CATEGORY_GROUPS 정의를 그대로 따른다.
 */
export const ALL_UNITS: PathUnit[] = (
  Object.entries(CATEGORY_GROUPS) as [CategoryGroup, Category[]][]
).flatMap(([group, cats]) =>
  cats
    .map((category) => ({
      category,
      group,
      emoji: CATEGORY_EMOJI[category],
      nodes: buildNodes(category),
      label: category,
    }))
    .filter((u) => u.nodes.length > 0)
);

/**
 * 한 트랙의 유닛들을 만든다 — 트랙 대본(steps) 순서 그대로.
 * 같은 카테고리가 두 번 나오면(CS → 웹 기초 / CS 심화) 두 번째부터 꼬리표를 붙여
 * 노드 id 충돌을 막는다. 첫 등장은 꼬리표가 없어서 예전 진행도와 그대로 이어진다.
 */
function buildTrackUnits(steps: TrackStep[]): PathUnit[] {
  const seen: Record<string, number> = {};
  return steps
    .map((step) => {
      const n = (seen[step.category] = (seen[step.category] ?? 0) + 1);
      return {
        category: step.category,
        group: GROUP_OF[step.category],
        emoji: CATEGORY_EMOJI[step.category],
        nodes: buildNodes(step.category, step.questionIds, n > 1 ? `-${n}` : ""),
        label: step.label,
        blurb: step.blurb,
      };
    })
    .filter((u) => u.nodes.length > 0);
}

/** 트랙 id → 그 트랙의 유닛들. 미리 다 만들어 둔다 (문제 데이터는 고정이라 안전). */
export const TRACK_UNITS: Record<TrackId, PathUnit[]> = {
  frontend: buildTrackUnits(TRACK_BY_ID.frontend.steps),
  backend: buildTrackUnits(TRACK_BY_ID.backend.steps),
};

/** 지금 볼 유닛 목록 — 트랙을 골랐으면 그 트랙, 아니면 전체. */
export function unitsFor(trackId: TrackId | null): PathUnit[] {
  return trackId ? TRACK_UNITS[trackId] : ALL_UNITS;
}

/**
 * 노드 조회표 — 모든 모드(전체 + 모든 트랙)의 노드를 다 담는다.
 * 트랙을 바꿔도 startLesson 이 노드를 못 찾는 일이 없게 하려고 합쳐 둔다.
 */
export const NODE_BY_ID: Record<string, LessonNode> = Object.fromEntries(
  [...ALL_UNITS, ...Object.values(TRACK_UNITS).flat()]
    .flatMap((u) => u.nodes)
    .map((n) => [n.id, n])
);

/**
 * "푸는 순서대로" 편 노드 배열 — 순차 언락 계산용.
 * 트랙마다 순서가 다르므로 트랙별로 따로 만든다. 언락은 이 배열의 '직전 칸'만 보므로,
 * 배열만 갈아끼우면 언락 규칙 코드를 손대지 않고도 트랙 순서를 따라간다.
 */
export function nodesFor(trackId: TrackId | null): LessonNode[] {
  return unitsFor(trackId).flatMap((u) => u.nodes);
}
