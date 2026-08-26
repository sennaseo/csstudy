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
  | "상태관리"
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

// ─── 문제 유형(Exercise) ─────────────────────────────────────
// "같은 문제(Question) 하나"를 여러 방식으로 출제하기 위한 포장지.
// 비유: 같은 고기(지식)라도 굽거나(객관식) 볶거나(빈칸) 튀길(말하기) 수 있다.
// 유형마다 필요한 데이터가 달라서 discriminated union 으로 정의한다.
// → switch(ex.type) 하면 TS 가 각 분기에서 필요한 필드를 자동으로 좁혀준다.

/** 출제 가능한 유형들. */
export type ExerciseType = "choice" | "blank" | "ox" | "typing" | "speak" | "match";

/** 객관식: 보기 4개 중 맞는 설명 고르기 (기존 방식). */
export interface ChoiceExercise {
  type: "choice";
  choices: QuizChoice[];
}

/** 빈칸 채우기: 요약 문장의 핵심 단어가 뚫려 있고, 단어 은행에서 골라 채운다. */
export interface BlankExercise {
  type: "blank";
  /** 빈칸 앞부분 텍스트. */
  before: string;
  /** 빈칸 뒷부분 텍스트. */
  after: string;
  /** 정답 단어. */
  answer: string;
  /** 단어 은행 (정답 1 + 오답들, 이미 섞여 있음). */
  bank: string[];
}

/** OX 퀴즈: 제시된 설명이 이 질문에 대한 맞는 설명인지 판단. */
export interface OxExercise {
  type: "ox";
  /** 판단할 설명 문장. */
  statement: string;
  /** 이 설명이 실제로 맞는지 (O가 정답인지). */
  isTrue: boolean;
}

/** 직접 타이핑: 핵심 키워드를 입력하면 채점 (오타 1글자 허용). */
export interface TypingExercise {
  type: "typing";
  /** 빈칸 앞부분 텍스트. */
  before: string;
  /** 빈칸 뒷부분 텍스트. */
  after: string;
  /** 정답 키워드. */
  answer: string;
}

/** 말하기(셀프 설명): 소리내어 설명한 뒤 정답을 보고 스스로 평가. */
export interface SpeakExercise {
  type: "speak";
}

/** 매칭 한 쌍: 질문(term) ↔ 한 줄 정답(def). */
export interface MatchPair {
  qid: string;
  term: string;
  def: string;
}

/** 선 연결하기: 질문 4개와 설명 4개를 짝지어 연결. */
export interface MatchExercise {
  type: "match";
  pairs: MatchPair[];
}

/** 모든 유형의 합집합 — 스토어가 들고 있는 "현재 출제 형태". */
export type Exercise =
  | ChoiceExercise
  | BlankExercise
  | OxExercise
  | TypingExercise
  | SpeakExercise
  | MatchExercise;

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
