// =============================================================
// 전역 타입 정의
// - 단 한 곳에서만 도메인 타입을 정의해서 컴포넌트/스토어가 같은 언어를 쓰게 한다.
// - 추후 spaced repetition / AI 면접관 / 빈칸 모드 등 확장될 때
//   "기존 타입은 그대로 두고 옵셔널 필드만 추가" 하는 식으로 진화시키면 호환성이 깨지지 않는다.
// =============================================================

/** 문제 카테고리 — 추가하려면 이 union 에 값 추가 + questions.ts 의 CATEGORY_GROUPS 에 배치. */
export type Category =
  | "CS"
  | "React"
  | "TypeScript"
  | "구조설계"
  | "Java"
  | "SpringBoot";

/** 큰 분류 — 카테고리들을 묶는 상위 그룹. */
export type CategoryGroup = "프론트엔드" | "백엔드&프로그래밍";

/** 사용자가 문제 풀이 후 남기는 자기평가 상태. */
export type ReviewStatus = "understood" | "fuzzy" | "unknown";

/** 캐릭터 희귀도. */
export type Rarity = "common" | "rare" | "legendary";

/** 보유 캐릭터 한 마리의 기록. 단계(stage)는 xp 에서 계산하므로 저장하지 않는다. */
export interface BuddyRecord {
  /** 누적 경험치 — 문제를 풀 때마다 쌓인다. */
  xp: number;
  /** 획득 시각 (epoch ms) — 도감 정렬용. */
  obtainedAt: number;
}

/**
 * 문제 한 개의 형태.
 * - id 는 데이터 파일에서 생성 (q-카테고리-숫자) → 안정적이라 localStorage 키로 쓰기 좋다.
 * - 확장 시: 코드 빈칸 문제는 `cloze?: string[]`, AI 면접용은 `followups?: string[]` 식으로 옵셔널 추가.
 */
export interface Question {
  id: string;
  category: Category;
  question: string;
  answer: string;
  /** (확장 예약) 보조 설명 — 지금은 비워둔다. */
  hint?: string;
  /** 정답을 코드로 보여주는 예시. 카드 뒷면 정답 아래에 코드 블록으로 렌더링된다. */
  code?: string;
}

/**
 * 한 문제에 대한 사용자 기록.
 * - lastReviewedAt 은 epoch ms — 추후 망각곡선 알고리즘에 그대로 사용 가능.
 * - reviewCount 는 SRS interval 계산용으로 미리 잡아둔다.
 */
export interface QuestionRecord {
  id: string;
  status: ReviewStatus;
  lastReviewedAt: number;
  reviewCount: number;
}

/**
 * 듀오링고식 객관식 보기 한 칸.
 * - qid: 이 보기 텍스트의 출처 문제 id (정답이면 현재 문제 id).
 * - text: 화면에 보이는 한 줄 요약 (SUMMARIES 에서 옴).
 * - correct: 현재 문제의 정답 보기인지 여부.
 */
export interface QuizChoice {
  qid: string;
  text: string;
  correct: boolean;
}

/**
 * 레슨(스킬 트리 노드) 한 개의 완료 기록.
 * - 이 맵에 노드 id 가 있으면 = "완료됨"(다음 노드 언락 조건).
 * - correct 는 최고 기록을 보관 (다시 풀어서 더 잘하면 갱신).
 */
export interface LessonProgress {
  /** 맞힌 개수(최고 기록). */
  correct: number;
  /** 노드의 총 문제 수. */
  total: number;
  /** 최초 완료 시각 (epoch ms). */
  completedAt: number;
}

/** localStorage 에 영속되는 전체 상태 모양 (Zustand persist 기준). */
export interface PersistedState {
  records: Record<string, QuestionRecord>;
  /** 'YYYY-MM-DD' → 그 날 푼 문제 수. 자정 넘기면 자동으로 키가 바뀐다. */
  dailyCounts: Record<string, number>;
  /** 레슨 노드 id → 완료 기록. 순차 언락의 기준. */
  lessonProgress: Record<string, LessonProgress>;
  /** 선택된 카테고리 — null 이면 전체 보기. */
  activeCategory: Category | null;
  /** 선택된 그룹 — null 이면 전체. 그룹을 고르면 그 안의 카테고리만 노출/출제. */
  activeGroup: CategoryGroup | null;
  /** 보유 캐릭터들 — key 는 캐릭터 id. */
  buddies: Record<string, BuddyRecord>;
  /** 화면에 데리고 다니는 대표 캐릭터 id. */
  activeBuddyId: string | null;
  /** 일일 목표 보상을 받은 날 ('YYYY-MM-DD') — 하루 1회 제한용. */
  lastGoalRewardDay: string | null;
  /** 역대 최고 연속 정답(콤보) 기록. */
  bestCombo: number;
  /** 남은 하트(목숨). 레슨에서 틀리면 1개 소모, 시간이 지나면 회복된다. */
  hearts: number;
  /** 하트 회복 계산의 기준 시각 (epoch ms). 하트가 가득이면 항상 현재로 당겨진다. */
  heartsUpdatedAt: number;
}
