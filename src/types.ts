// =============================================================
// 전역 타입 정의
// - 단 한 곳에서만 도메인 타입을 정의해서 컴포넌트/스토어가 같은 언어를 쓰게 한다.
// - 추후 spaced repetition / AI 면접관 / 빈칸 모드 등 확장될 때
//   "기존 타입은 그대로 두고 옵셔널 필드만 추가" 하는 식으로 진화시키면 호환성이 깨지지 않는다.
// =============================================================

/** 문제 카테고리 — 추가하려면 이 union 에 값만 추가하면 카테고리 필터에도 자동 반영된다. */
export type Category = "CS" | "React" | "TypeScript" | "구조설계";

/** 사용자가 문제 풀이 후 남기는 자기평가 상태. */
export type ReviewStatus = "understood" | "fuzzy" | "unknown";

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
  /** (확장 예약) 보조 설명/예시 코드 — 지금은 비워둔다. */
  hint?: string;
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

/** localStorage 에 영속되는 전체 상태 모양 (Zustand persist 기준). */
export interface PersistedState {
  records: Record<string, QuestionRecord>;
  /** 'YYYY-MM-DD' → 그 날 푼 문제 수. 자정 넘기면 자동으로 키가 바뀐다. */
  dailyCounts: Record<string, number>;
  /** 선택된 카테고리 — null 이면 전체. */
  activeCategory: Category | null;
}
