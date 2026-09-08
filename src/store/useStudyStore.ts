// =============================================================
// Zustand Store — 앱 전체의 단일 상태 소스
//
// 설계 메모 (초보자용):
// 1) Zustand 는 "create 하나 = 전역 훅 하나". 컴포넌트에서는
//    useStudyStore(s => s.X) 셀렉터로 필요한 조각만 구독 → 리렌더 최소화.
// 2) localStorage 영속화는 직접 구현 (학습용으로 흐름이 보이게).
//    저장 대상은 PersistedState 만 — actions 는 저장하지 않는다.
// 3) 캐릭터(버디) 시스템:
//    - 획득 경로 3가지: ① 첫 문제 풀면 무조건 1마리 (스타터)
//                       ② 하루 목표(5문제) 달성 시 확정 뽑기 (하루 1회)
//                       ③ '이해함' 평가 시 20% 확률 드롭
//    - 뽑기는 "미보유 캐릭터 중에서" 희귀도 가중치로 (커먼70/레어25/레전드5)
//    - XP: 평가할 때마다 대표 캐릭터가 경험치를 얻고 단계가 오른다 (진화)
//    - 모든 캐릭터 보유 시 뽑기는 대표 캐릭터 보너스 XP 로 전환
// =============================================================

import { create } from "zustand";
import type {
  BuddyRecord,
  Category,
  CategoryGroup,
  Exercise,
  PersistedState,
  Question,
  QuestionRecord,
  ReviewStatus,
} from "../types";
import { CATEGORY_GROUPS, QUESTIONS } from "../data/questions";
import { buildExercise, shuffle } from "../utils/exercise";
import { nodesFor, NODE_BY_ID } from "../data/lessonPath";
import type { TrackId } from "../data/tracks";
import { CHARACTERS, RARITY_INFO, stageOf } from "../data/characters";
import type { BuddyCharacter } from "../data/characters";
import {
  getSyncConfig,
  saveSyncConfig,
  pullRemote,
  pushRemote,
  mergeStates,
  schedulePush,
} from "../utils/sync";
import { isDue } from "../utils/srs";
import type { SyncConfig } from "../utils/sync";

// ─── localStorage 헬퍼 ────────────────────────────────────
const STORAGE_KEY = "csStudy:v1";

/** Date → 'YYYY-MM-DD' (로컬 타임존). dailyCounts 의 키. */
function dateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function todayKey(): string {
  return dateKey(new Date());
}

// ─── 하트(목숨) 시스템 ─────────────────────────────────────
// 듀오링고식: 레슨에서 틀리면 하트 1개 소모, 0개면 레슨 실패.
// 30분에 1개씩 자동 회복 + 복습을 끝내면 1개 즉시 회복.

export const MAX_HEARTS = 5;
const HEART_REGEN_MS = 30 * 60 * 1000; // 30분당 1개

/**
 * 경과 시간만큼 하트를 회복시킨 결과를 계산한다 (순수 함수).
 * - heartsUpdatedAt 은 "다음 회복 카운트다운의 시작점".
 *   가득 찼으면 지금으로 당겨서 (다음에 잃었을 때부터 30분을 세게) 한다.
 */
function applyHeartRegen(
  hearts: number,
  updatedAt: number,
  now: number = Date.now()
): { hearts: number; heartsUpdatedAt: number } {
  if (hearts >= MAX_HEARTS) return { hearts: MAX_HEARTS, heartsUpdatedAt: now };
  const gained = Math.floor((now - updatedAt) / HEART_REGEN_MS);
  if (gained <= 0) return { hearts, heartsUpdatedAt: updatedAt };
  const next = Math.min(MAX_HEARTS, hearts + gained);
  return {
    hearts: next,
    heartsUpdatedAt: next >= MAX_HEARTS ? now : updatedAt + gained * HEART_REGEN_MS,
  };
}

const initialPersisted: PersistedState = {
  records: {},
  dailyCounts: {},
  lessonProgress: {},
  activeCategory: null,
  activeGroup: null,
  activeTrack: null,
  buddies: {},
  activeBuddyId: null,
  lastGoalRewardDay: null,
  bestCombo: 0,
  hearts: MAX_HEARTS,
  heartsUpdatedAt: Date.now(),
};

function loadPersisted(): PersistedState {
  if (typeof window === "undefined") return initialPersisted;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialPersisted;
    const parsed = JSON.parse(raw) as Partial<PersistedState>;
    // 예전 저장값에 없는 필드는 기본값으로 — 하위 호환.
    return {
      records: parsed.records ?? {},
      dailyCounts: parsed.dailyCounts ?? {},
      lessonProgress: parsed.lessonProgress ?? {},
      activeCategory: parsed.activeCategory ?? null,
      activeGroup: parsed.activeGroup ?? null,
      activeTrack: parsed.activeTrack ?? null,
      buddies: parsed.buddies ?? {},
      activeBuddyId: parsed.activeBuddyId ?? null,
      lastGoalRewardDay: parsed.lastGoalRewardDay ?? null,
      bestCombo: parsed.bestCombo ?? 0,
      hearts: parsed.hearts ?? MAX_HEARTS,
      heartsUpdatedAt: parsed.heartsUpdatedAt ?? Date.now(),
    };
  } catch {
    return initialPersisted;
  }
}

function savePersisted(state: PersistedState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // 용량 초과 등은 무시 — MVP 범위 밖.
  }
}

// ─── 뽑기/XP 헬퍼 ─────────────────────────────────────────

/** 자기평가별 XP — "모름"도 도전했으니 조금은 준다. */
const XP_BY_STATUS: Record<ReviewStatus, number> = {
  understood: 12,
  fuzzy: 7,
  unknown: 4,
};

/** 일일 목표 문제 수 — GoalGauge 와 동일해야 한다. */
export const DAILY_GOAL = 5;

/** '이해함' 드롭 확률 (0~1) */
const DROP_RATE = 0.2;

/** 미보유 캐릭터 중 희귀도 가중치로 1마리 뽑기. 전부 보유 시 null. */
function drawNewBuddy(owned: Record<string, BuddyRecord>): BuddyCharacter | null {
  const pool = CHARACTERS.filter((c) => !owned[c.id]);
  if (pool.length === 0) return null;
  // 가중치 뽑기: 각 캐릭터의 희귀도 weight 를 줄 세워놓고 룰렛 돌리기.
  const total = pool.reduce((sum, c) => sum + RARITY_INFO[c.rarity].weight, 0);
  let roll = Math.random() * total;
  for (const c of pool) {
    roll -= RARITY_INFO[c.rarity].weight;
    if (roll <= 0) return c;
  }
  return pool[pool.length - 1]; // 부동소수점 안전망
}

// ─── Store 본체 ───────────────────────────────────────────
// 문제 → 출제 형태(객관식/빈칸/OX/타이핑/말하기/매칭) 변환은
// utils/exercise.ts 의 buildExercise 가 담당한다 (랜덤 믹스).

/** 획득/진화 알림 — UI 가 모달로 보여주고 clearReward 로 닫는다. */
export interface PendingReward {
  type: "new" | "evolve";
  buddyId: string;
  /** evolve 일 때 도달한 단계 */
  stage?: 2 | 3;
}

/** 지금 보여줄 화면. path=스킬트리(홈), quiz=문제풀이, lessonComplete=레슨 완료 축하. */
export type AppView = "path" | "quiz" | "lessonComplete";

/**
 * 퀴즈 동작 방식.
 * - random: 무한 랜덤
 * - lesson: 스킬트리 노드 문제를 순서대로 (전부 맞아야 완료)
 * - review: 틀렸거나 헷갈렸던 문제만 모아 풀기 (한 바퀴 돌면 끝)
 * - today : "오늘의 5문제" — 복습 우선 + 새 문제로 자동 구성 (한 바퀴 돌면 끝)
 */
export type QuizMode = "random" | "lesson" | "review" | "today";

/** 동기화 상태 — UI 표시용. off=미설정. */
export type SyncStatus = "off" | "syncing" | "ok" | "error";

/** 레슨을 끝냈을 때 완료 화면에 보여줄 결과. */
export interface LessonResult {
  lessonId: string;
  correct: number;
  total: number;
  /** 이번 레슨에서 얻은 XP 합. */
  xpGained: number;
  /** 하트를 다 잃어 레슨이 실패로 끝났는지. */
  failed?: boolean;
  /** 복습 보상으로 하트를 실제로 1개 회복했는지 (가득이면 false). */
  heartsRecovered?: boolean;
  /** 이번 세션에서 푼 문제와 정오 (큐 순서). 완료 화면의 카테고리별 분석용. */
  answers: { qid: string; correct: boolean }[];
}

interface StudyState extends PersistedState {
  currentQuestion: Question | null;
  isAnswerVisible: boolean;
  /** 현재 문제의 출제 형태 (객관식/빈칸/OX/타이핑/말하기/매칭 중 랜덤). */
  exercise: Exercise | null;
  /** (객관식 전용) 사용자가 고른 보기의 출처 qid. 아직 안 골랐으면 null. */
  selectedQid: string | null;
  /** 채점 완료 여부 — true 면 입력이 잠기고 피드백 시트가 뜬다. */
  graded: boolean;
  /** 방금 채점 결과 (모든 유형 공통). graded 전에는 null. */
  lastCorrect: boolean | null;
  /** 새 캐릭터 획득/진화 알림 (transient — 저장 안 함). */
  pendingReward: PendingReward | null;

  // ── 화면/모드 (transient) ──
  view: AppView;
  mode: QuizMode;
  /** 진행 중인 레슨 노드 id (lesson 모드일 때). */
  activeLessonId: string | null;
  /** 이번 레슨에서 풀 문제 id 큐 (순서대로). */
  lessonQueue: string[];
  /** 큐에서 지금 몇 번째 문제인지 (0-based). */
  lessonIndex: number;
  /** 이번 레슨에서 맞힌 개수. */
  lessonCorrect: number;
  /** 이번 레슨에서 쌓은 XP 합 (완료 화면 표시용). */
  lessonXp: number;
  /** 마지막으로 끝낸 레슨 결과 (완료 화면용). */
  lessonResult: LessonResult | null;
  /** 이번 세션의 문제별 정오 (transient). 큐를 새로 시작하면 비운다. */
  lessonAnswers: { qid: string; correct: boolean }[];

  /** 지금 세션의 연속 정답 수 (transient). 최고 기록(bestCombo)은 PersistedState 에 있다. */
  combo: number;
  /**
   * 이번 문제를 "사실 몰랐다"고 스스로 표시했는지 (transient).
   * 맞혔어도 찍은 거면 understood 로 기록하지 않으려고 둔다 —
   * 안 그러면 복습 큐에서 빠져서 영영 안 나온다.
   */
  unsure: boolean;

  setGroup: (g: CategoryGroup | null) => void;
  setCategory: (c: Category | null) => void;
  pickRandom: () => void;
  toggleAnswer: () => void;
  /** (객관식) 보기 하나를 골라 즉시 채점한다. 다음 문제로는 넘어가지 않음. */
  answerQuiz: (qid: string) => void;
  /**
   * (전 유형 공통) 채점 확정 — 콤보/하트/최고기록 갱신까지 한 번에.
   * 빈칸·OX·타이핑·말하기·매칭 UI 가 "맞았는지" 판단해서 이걸 부른다.
   */
  gradeExercise: (correct: boolean, selectedQid?: string | null) => void;
  /** 결과만 기록한다(XP·캐릭터·일일카운트). 다음 문제로 넘기지 않는다. */
  recordStatus: (status: ReviewStatus) => void;
  /** "몰랐어요" 토글 — 채점 후 피드백 시트에서 누른다. 다시 누르면 해제. */
  toggleUnsure: () => void;
  /** "계속" 버튼: 결과 기록 후 모드에 맞게 진행(랜덤=다음 랜덤, 레슨=다음 or 완료). */
  continueQuiz: () => void;
  /** 스킬트리 노드를 눌러 레슨 시작. 잠긴 노드면 무시. */
  startLesson: (lessonId: string) => void;
  /** 랜덤 연습 모드 시작. */
  startRandom: () => void;
  /** 틀렸거나 헷갈렸던 문제만 모아 복습 시작 (최대 5문제). */
  startReview: () => void;
  /** 원탭 "오늘의 5문제" 시작 — 복습할 문제 우선, 나머지는 새 문제. */
  startToday: () => void;
  /** 복습이 필요한 문제 수 (unknown/fuzzy). 홈 뱃지용. */
  getReviewCount: () => number;

  // ── 동기화 ──
  syncStatus: SyncStatus;
  lastSyncAt: number | null;
  /** 서버에서 내려받아 병합 후 다시 올린다 (앱 시작/포커스 시). */
  syncNow: () => Promise<void>;
  /** 서버 주소+토큰 저장 후 즉시 1회 동기화. */
  configureSync: (cfg: SyncConfig) => void;
  /** 동기화 끄기 (로컬 저장만 유지). */
  disableSync: () => void;
  /** 홈(스킬 패스)으로 돌아간다. */
  goHome: () => void;
  /** 경과 시간만큼 하트를 회복시킨다 (앱 시작/포커스/레슨 시작 시 호출). */
  regenHearts: () => void;
  /** 노드 잠금 여부 — 첫 노드이거나 (지금 트랙 순서상) 직전 노드를 완료했으면 열림. */
  isNodeUnlocked: (lessonId: string) => boolean;
  /** 트랙(역할별 로드맵) 선택. null 이면 전체 보기. */
  setTrack: (t: TrackId | null) => void;
  setActiveBuddy: (id: string) => void;
  clearReward: () => void;
  getTodayCount: () => number;
  getStreak: () => number;
}

// ─── 복습/오늘의 5문제 큐 만들기 ──────────────────────────

/** 복습 우선순위: 모름(0) → 헷갈림(1). 같은 상태면 오래 안 본 순. */
const STATUS_PRIORITY: Record<ReviewStatus, number> = {
  unknown: 0,
  fuzzy: 1,
  understood: 2,
};

/**
 * 복습이 필요한 문제들 — 급한 순으로 정렬.
 * - 모름/헷갈림은 항상 포함.
 * - '이해함'도 망각곡선 간격(1→3→7→14→30일)이 지나 만기(due)면 포함.
 */
function reviewPoolOf(records: Record<string, QuestionRecord>): Question[] {
  const now = Date.now();
  return QUESTIONS.filter((q) => {
    const r = records[q.id];
    return r && isDue(r, now);
  }).sort((a, b) => {
    const ra = records[a.id];
    const rb = records[b.id];
    return (
      STATUS_PRIORITY[ra.status] - STATUS_PRIORITY[rb.status] ||
      ra.lastReviewedAt - rb.lastReviewedAt
    );
  });
}

function pickFromPool(pool: Question[], prevId: string | null): Question | null {
  if (pool.length === 0) return null;
  if (pool.length === 1) return pool[0];
  let next = pool[Math.floor(Math.random() * pool.length)];
  for (let i = 0; i < 5 && next.id === prevId; i++) {
    next = pool[Math.floor(Math.random() * pool.length)];
  }
  return next;
}

export const useStudyStore = create<StudyState>((set, get) => {
  const persisted = loadPersisted();

  /** 현재 상태에서 "저장할 부분"만 뽑는다. */
  const pickPersisted = (): PersistedState => {
    const {
      records,
      dailyCounts,
      lessonProgress,
      activeCategory,
      activeGroup,
      activeTrack,
      buddies,
      activeBuddyId,
      lastGoalRewardDay,
      bestCombo,
      hearts,
      heartsUpdatedAt,
    } = get();
    return {
      records,
      dailyCounts,
      lessonProgress,
      activeCategory,
      activeGroup,
      activeTrack,
      buddies,
      activeBuddyId,
      lastGoalRewardDay,
      bestCombo,
      hearts,
      heartsUpdatedAt,
    };
  };

  const persist = () => {
    savePersisted(pickPersisted());
    // 동기화가 설정돼 있으면 2초 뒤 서버에도 올린다 (미설정이면 no-op).
    schedulePush(pickPersisted, (ok) =>
      set({ syncStatus: ok ? "ok" : "error", ...(ok ? { lastSyncAt: Date.now() } : {}) })
    );
  };

  return {
    ...persisted,
    currentQuestion: null,
    isAnswerVisible: false,
    exercise: null,
    selectedQid: null,
    graded: false,
    lastCorrect: null,
    pendingReward: null,
    view: "path",
    mode: "lesson",
    activeLessonId: null,
    lessonQueue: [],
    lessonIndex: 0,
    lessonCorrect: 0,
    lessonXp: 0,
    lessonResult: null,
    lessonAnswers: [],
    combo: 0, // 세션 한정 — bestCombo 는 persisted 에서 복원된다.
    unsure: false,
    syncStatus: getSyncConfig() ? "syncing" : "off",
    lastSyncAt: null,

    setTrack: (t) => {
      // 트랙만 바꾼다 — 진행도(lessonProgress)는 건드리지 않는다.
      // 이미 푼 레슨은 어느 트랙에서 보든 완료 상태로 남는다.
      set({ activeTrack: t });
      persist();
    },

    setGroup: (g) => {
      set({ activeGroup: g, activeCategory: null });
      get().pickRandom();
      persist();
    },

    setCategory: (c) => {
      set({ activeCategory: c });
      get().pickRandom();
      persist();
    },

    pickRandom: () => {
      const { activeCategory, activeGroup, currentQuestion } = get();
      let pool = QUESTIONS;
      if (activeCategory) {
        pool = QUESTIONS.filter((q) => q.category === activeCategory);
      } else if (activeGroup) {
        const cats = CATEGORY_GROUPS[activeGroup];
        pool = QUESTIONS.filter((q) => cats.includes(q.category));
      }
      const next = pickFromPool(pool, currentQuestion?.id ?? null);
      // 새 문제 → 새 출제 형태 + 채점 상태 초기화.
      set({
        currentQuestion: next,
        isAnswerVisible: false,
        exercise: next ? buildExercise(next) : null,
        selectedQid: null,
        graded: false,
        lastCorrect: null,
        unsure: false,
      });
    },

    toggleAnswer: () =>
      set((s) => ({ isAnswerVisible: !s.isAnswerVisible })),

    gradeExercise: (correct, selectedQid = null) => {
      // 이미 채점됐으면 무시 (입력 잠금).
      const { graded, currentQuestion, combo, bestCombo, mode, hearts, heartsUpdatedAt } =
        get();
      if (graded || !currentQuestion) return;
      // 콤보: 정답이면 +1, 오답이면 0으로 리셋. 최고 기록은 영속 저장.
      const nextCombo = correct ? combo + 1 : 0;
      const nextBest = Math.max(bestCombo, nextCombo);

      // 하트: 레슨에서 틀리면 1개 소모 (랜덤/복습/오늘의 5문제는 연습이라 무료).
      let heartPatch = {};
      if (mode === "lesson" && !correct && hearts > 0) {
        heartPatch = {
          hearts: hearts - 1,
          // 가득 찬 상태에서 처음 잃는 순간부터 회복 30분을 세기 시작한다.
          heartsUpdatedAt: hearts >= MAX_HEARTS ? Date.now() : heartsUpdatedAt,
        };
      }

      set({
        selectedQid,
        graded: true,
        lastCorrect: correct,
        combo: nextCombo,
        bestCombo: nextBest,
        ...heartPatch,
      });
      if (nextBest > bestCombo || "hearts" in heartPatch) persist();
    },

    // 객관식은 "고른 보기 qid == 문제 id" 가 곧 정답 판정.
    answerQuiz: (qid) => {
      const q = get().currentQuestion;
      if (!q) return;
      get().gradeExercise(qid === q.id, qid);
    },

    // 채점 후에만 의미가 있다 (찍어서 맞춘 걸 되돌아보는 버튼이라).
    toggleUnsure: () => {
      if (!get().graded) return;
      set((s) => ({ unsure: !s.unsure }));
    },

    recordStatus: (status) => {
      const {
        currentQuestion,
        records,
        dailyCounts,
        buddies,
        activeBuddyId,
        lastGoalRewardDay,
        selectedQid,
      } = get();
      if (!currentQuestion) return;

      // ── 1) 문제 기록 ──
      // 오답이면 "어떻게 틀렸나"를 같이 남긴다 — 맞았으면 예전 오답 기록을 그대로 보존.
      // (지웠다간 "예전에 뭘로 헷갈렸는지"가 사라져서 약점 분석이 안 된다.)
      const prev: QuestionRecord | undefined = records[currentQuestion.id];
      const wrong = status !== "understood";
      const nextRecord: QuestionRecord = {
        id: currentQuestion.id,
        status,
        lastReviewedAt: Date.now(),
        reviewCount: (prev?.reviewCount ?? 0) + 1,
        wrongCount: (prev?.wrongCount ?? 0) + (wrong ? 1 : 0),
        // 객관식만 고른 보기가 있다 — 다른 유형은 undefined 로 남는다.
        lastWrongQid: wrong ? selectedQid ?? undefined : prev?.lastWrongQid,
        lastWrongAt: wrong ? Date.now() : prev?.lastWrongAt,
      };

      const key = todayKey();
      const newDailyCount = (dailyCounts[key] ?? 0) + 1;
      const nextDaily = { ...dailyCounts, [key]: newDailyCount };

      // ── 2) 캐릭터 XP & 진화 체크 ──
      const nextBuddies: Record<string, BuddyRecord> = { ...buddies };
      let reward: PendingReward | null = null;

      if (activeBuddyId && nextBuddies[activeBuddyId]) {
        const before = nextBuddies[activeBuddyId];
        const beforeStage = stageOf(before.xp);
        const afterXp = before.xp + XP_BY_STATUS[status];
        nextBuddies[activeBuddyId] = { ...before, xp: afterXp };
        const afterStage = stageOf(afterXp);
        if (afterStage > beforeStage) {
          // 진화! (획득 알림보다 우선순위 낮음 — 아래에서 덮일 수 있음)
          reward = { type: "evolve", buddyId: activeBuddyId, stage: afterStage as 2 | 3 };
        }
      }

      // ── 3) 새 캐릭터 획득 체크 ──
      const ownedCount = Object.keys(nextBuddies).length;
      let nextGoalRewardDay = lastGoalRewardDay;

      const isFirstEver = ownedCount === 0; // ① 스타터
      const hitDailyGoal =
        newDailyCount === DAILY_GOAL && lastGoalRewardDay !== key; // ② 목표 달성
      const luckyDrop =
        status === "understood" && Math.random() < DROP_RATE; // ③ 행운 드롭

      if (isFirstEver || hitDailyGoal || luckyDrop) {
        const drawn = drawNewBuddy(nextBuddies);
        if (drawn) {
          nextBuddies[drawn.id] = { xp: 0, obtainedAt: Date.now() };
          reward = { type: "new", buddyId: drawn.id };
        } else if (activeBuddyId && nextBuddies[activeBuddyId]) {
          // 전부 보유 중 → 보너스 XP 로 전환
          const b = nextBuddies[activeBuddyId];
          nextBuddies[activeBuddyId] = { ...b, xp: b.xp + 20 };
        }
        if (hitDailyGoal) nextGoalRewardDay = key;
      }

      set((s) => ({
        records: { ...records, [currentQuestion.id]: nextRecord },
        dailyCounts: nextDaily,
        buddies: nextBuddies,
        // 첫 획득이면 자동으로 대표 지정
        activeBuddyId:
          s.activeBuddyId ??
          (reward?.type === "new" ? reward.buddyId : null),
        lastGoalRewardDay: nextGoalRewardDay,
        pendingReward: reward ?? s.pendingReward,
      }));
      persist();
      // 주의: 여기서 다음 문제로 넘기지 않는다. 진행은 continueQuiz 가 모드별로 담당.
    },

    continueQuiz: () => {
      const { currentQuestion, graded, lastCorrect, mode, unsure } = get();
      if (!currentQuestion || !graded) return;
      const correct = lastCorrect === true;
      // "몰랐어요"를 눌렀으면 맞혔어도 understood 가 아니다 —
      // fuzzy 는 SRS 에서 항상 복습 대상이라, 찍어서 맞춘 문제가 다시 돌아온다.
      const status: ReviewStatus = !correct ? "unknown" : unsure ? "fuzzy" : "understood";

      // 1) 결과 기록 (XP·캐릭터·일일카운트). 다음 문제로는 안 넘김.
      get().recordStatus(status);
      // 이번 레슨 XP 합 누적 (완료 화면 표시용).
      set((s) => ({ lessonXp: s.lessonXp + XP_BY_STATUS[status] }));

      if (mode === "random") {
        // 랜덤: 바로 다음 랜덤 문제.
        get().pickRandom();
        return;
      }

      set((s) => ({
        lessonAnswers: [...s.lessonAnswers, { qid: currentQuestion.id, correct }],
      }));

      // ── 하트를 다 잃으면 레슨 실패 (듀오링고식) ──
      if (mode === "lesson" && !correct && get().hearts <= 0) {
        const s = get();
        set({
          lessonResult: {
            lessonId: s.activeLessonId ?? "",
            correct: s.lessonCorrect,
            total: s.lessonQueue.length,
            xpGained: s.lessonXp,
            failed: true,
            answers: s.lessonAnswers,
          },
          view: "lessonComplete",
        });
        return;
      }

      // 레슨: 큐의 다음 문제 or 완료.
      const { lessonQueue, lessonIndex, lessonCorrect, activeLessonId } = get();
      const newCorrect = lessonCorrect + (correct ? 1 : 0);
      const nextIndex = lessonIndex + 1;
      const total = lessonQueue.length;
      const firstQ = QUESTIONS.find((q) => q.id === lessonQueue[0]) ?? null;

      if (nextIndex < total) {
        const nextQ = QUESTIONS.find((q) => q.id === lessonQueue[nextIndex]);
        set({
          lessonIndex: nextIndex,
          lessonCorrect: newCorrect,
          currentQuestion: nextQ ?? null,
          exercise: nextQ ? buildExercise(nextQ) : null,
          selectedQid: null,
          graded: false,
          lastCorrect: null,
          unsure: false,
        });
        return;
      }

      // ── 복습/오늘의 5문제: 한 바퀴 돌면 바로 완료 (리트라이 없음) ──
      if (mode === "review" || mode === "today") {
        // 복습을 끝내면 하트 1개 회복 — "연습으로 회복" (듀오링고식).
        let heartsRecovered = false;
        if (mode === "review") {
          const { hearts, heartsUpdatedAt } = get();
          if (hearts < MAX_HEARTS) {
            heartsRecovered = true;
            const next = hearts + 1;
            set({
              hearts: next,
              heartsUpdatedAt: next >= MAX_HEARTS ? Date.now() : heartsUpdatedAt,
            });
            persist();
          }
        }
        set({
          lessonCorrect: newCorrect,
          lessonResult: {
            lessonId: mode === "review" ? "__review" : "__today",
            correct: newCorrect,
            total,
            xpGained: get().lessonXp,
            heartsRecovered,
            answers: get().lessonAnswers,
          },
          view: "lessonComplete",
        });
        return;
      }

      // 레슨: 한 문제라도 틀리면 리트라이, 전부 맞아야 완료
      if (newCorrect < total) {
        set({
          lessonIndex: 0,
          lessonCorrect: 0,
          lessonXp: 0,
          lessonAnswers: [],
          currentQuestion: firstQ,
          exercise: firstQ ? buildExercise(firstQ) : null,
          selectedQid: null,
          graded: false,
          lastCorrect: null,
          unsure: false,
        });
        return;
      }

      // ── 레슨 끝 → 완료 처리 ──
      const xpGained = get().lessonXp;
      if (activeLessonId) {
        const prev = get().lessonProgress[activeLessonId];
        const merged = {
          // 최고 기록 보관 (다시 풀어서 더 맞히면 갱신).
          correct: Math.max(prev?.correct ?? 0, newCorrect),
          total,
          completedAt: prev?.completedAt ?? Date.now(),
        };
        set((s) => ({
          lessonProgress: { ...s.lessonProgress, [activeLessonId]: merged },
        }));
        persist();
      }
      set({
        lessonCorrect: newCorrect,
        lessonResult: activeLessonId
          ? { lessonId: activeLessonId, correct: newCorrect, total, xpGained, answers: get().lessonAnswers }
          : null,
        view: "lessonComplete",
      });
    },

    isNodeUnlocked: (lessonId) => {
      // 언락 기준은 "지금 고른 트랙의 순서". 트랙을 바꾸면 순서도 같이 바뀐다.
      const nodes = nodesFor(get().activeTrack);
      const idx = nodes.findIndex((n) => n.id === lessonId);
      if (idx <= 0) return true; // 첫 노드(또는 이 트랙에 없는 id)는 열림
      const prevId = nodes[idx - 1].id;
      return !!get().lessonProgress[prevId]; // 직전 노드 완료해야 열림
    },

    startLesson: (lessonId) => {
      const node = NODE_BY_ID[lessonId];
      if (!node || !get().isNodeUnlocked(lessonId)) return; // 잠긴 노드 차단
      get().regenHearts(); // 시간 경과분 먼저 회복
      if (get().hearts <= 0) return; // 하트 없으면 시작 불가 (복습으로 회복 유도)
      const queue = node.questionIds;
      const first = QUESTIONS.find((q) => q.id === queue[0]) ?? null;
      set({
        mode: "lesson",
        view: "quiz",
        activeLessonId: lessonId,
        lessonQueue: queue,
        lessonIndex: 0,
        lessonCorrect: 0,
        lessonXp: 0,
        lessonAnswers: [],
        lessonResult: null,
        currentQuestion: first,
        exercise: first ? buildExercise(first) : null,
        selectedQid: null,
        graded: false,
        lastCorrect: null,
        unsure: false,
      });
    },

    startRandom: () => {
      set({
        mode: "random",
        view: "quiz",
        activeLessonId: null,
        lessonResult: null,
      });
      get().pickRandom();
    },

    startReview: () => {
      // 복습 대상 중 급한 것부터 최대 5문제.
      const pool = reviewPoolOf(get().records).slice(0, DAILY_GOAL);
      if (pool.length === 0) return;
      const first = pool[0];
      set({
        mode: "review",
        view: "quiz",
        activeLessonId: null,
        lessonQueue: pool.map((q) => q.id),
        lessonIndex: 0,
        lessonCorrect: 0,
        lessonXp: 0,
        lessonAnswers: [],
        lessonResult: null,
        currentQuestion: first,
        exercise: buildExercise(first),
        selectedQid: null,
        graded: false,
        lastCorrect: null,
        unsure: false,
      });
    },

    startToday: () => {
      // 오늘의 5문제 = ① 복습 급한 순 → ② 아직 안 푼 새 문제 → ③ 오래된 아는 문제.
      const { records } = get();
      const review = reviewPoolOf(records);
      const unseen = shuffle(QUESTIONS.filter((q) => !records[q.id]));
      const known = QUESTIONS.filter(
        (q) => records[q.id]?.status === "understood"
      ).sort((a, b) => records[a.id].lastReviewedAt - records[b.id].lastReviewedAt);

      const queue = [...review, ...unseen, ...known].slice(0, DAILY_GOAL);
      if (queue.length === 0) return;
      const first = queue[0];
      set({
        mode: "today",
        view: "quiz",
        activeLessonId: null,
        lessonQueue: queue.map((q) => q.id),
        lessonIndex: 0,
        lessonCorrect: 0,
        lessonXp: 0,
        lessonAnswers: [],
        lessonResult: null,
        currentQuestion: first,
        exercise: buildExercise(first),
        selectedQid: null,
        graded: false,
        lastCorrect: null,
        unsure: false,
      });
    },

    getReviewCount: () => {
      // 모름/헷갈림 + 망각곡선 만기(due)가 된 '이해함' 문제 수.
      const now = Date.now();
      return Object.values(get().records).filter((r) => isDue(r, now)).length;
    },

    // ── 동기화 액션 ──

    syncNow: async () => {
      const cfg = getSyncConfig();
      if (!cfg) return;
      set({ syncStatus: "syncing" });
      try {
        // 1) 서버 것 내려받기 → 2) 내 것과 병합 → 3) 화면/로컬 반영 → 4) 서버에 올리기
        const remote = await pullRemote(cfg);
        const merged = remote.data
          ? mergeStates(pickPersisted(), remote.data)
          : pickPersisted();
        set({ ...merged, syncStatus: "ok", lastSyncAt: Date.now() });
        savePersisted(merged);
        await pushRemote(cfg, merged);
      } catch {
        set({ syncStatus: "error" });
      }
    },

    configureSync: (cfg) => {
      saveSyncConfig(cfg);
      void get().syncNow();
    },

    disableSync: () => {
      saveSyncConfig(null);
      set({ syncStatus: "off" });
    },

    goHome: () => set({ view: "path" }),

    regenHearts: () => {
      const { hearts, heartsUpdatedAt } = get();
      const next = applyHeartRegen(hearts, heartsUpdatedAt);
      if (next.hearts !== hearts || next.heartsUpdatedAt !== heartsUpdatedAt) {
        set(next);
        if (next.hearts !== hearts) persist();
      }
    },

    setActiveBuddy: (id) => {
      if (!get().buddies[id]) return; // 미보유 캐릭터는 대표 불가
      set({ activeBuddyId: id });
      persist();
    },

    clearReward: () => set({ pendingReward: null }),

    getTodayCount: () => {
      const { dailyCounts } = get();
      return dailyCounts[todayKey()] ?? 0;
    },

    getStreak: () => {
      // 오늘부터 거꾸로 도장(푼 기록)이 찍힌 날을 센다.
      // 오늘 아직 안 풀었어도 끊긴 건 아니므로 어제부터 센다.
      const { dailyCounts } = get();
      const cursor = new Date();
      if (!dailyCounts[dateKey(cursor)]) {
        cursor.setDate(cursor.getDate() - 1);
      }
      let streak = 0;
      while (dailyCounts[dateKey(cursor)]) {
        streak++;
        cursor.setDate(cursor.getDate() - 1);
      }
      return streak;
    },
  };
});

// ─── 하트 자동 회복 트리거 ─────────────────────────────────
// 앱을 켰을 때 + 화면에 돌아왔을 때 경과 시간만큼 회복시킨다.
if (typeof window !== "undefined") {
  queueMicrotask(() => useStudyStore.getState().regenHearts());
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      useStudyStore.getState().regenHearts();
    }
  });
}

// ─── 자동 동기화 트리거 ────────────────────────────────────
// 1) 앱을 켰을 때 1회
// 2) 다른 앱 갔다가 돌아왔을 때 (폰에서 특히 중요) — 30초에 1번만
if (typeof window !== "undefined" && getSyncConfig()) {
  queueMicrotask(() => void useStudyStore.getState().syncNow());

  let lastFocusSync = 0;
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState !== "visible") return;
    const now = Date.now();
    if (now - lastFocusSync < 30_000) return;
    lastFocusSync = now;
    void useStudyStore.getState().syncNow();
  });
}
