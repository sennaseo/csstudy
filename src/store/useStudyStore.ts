// =============================================================
// Zustand Store — 앱 전체의 단일 상태 소스
//
// 설계 메모 (초보자용):
// ─────────────────────────────────────────────────────────────
// 1) Zustand 는 "createStore 하나 = 전역 훅 하나" 가 끝.
//    컴포넌트에서는 useStudyStore(s => s.X) 처럼 셀렉터로 필요한 조각만 구독한다.
//    → 셀렉터를 좁히면 불필요한 리렌더가 줄어든다.
//
// 2) localStorage 영속화는 직접 구현했다 (zustand/middleware/persist 를 안 쓴 이유:
//    의존성 최소화 + 학습용으로 흐름이 보이게 하려고).
//    저장 대상은 PersistedState 만 — actions 는 매번 재생성되니까 저장하지 않는다.
//
// 3) 확장 포인트:
//    - SRS: records[id].lastReviewedAt + reviewCount 로 다음 노출 시점을 계산하는 selector 추가.
//    - AI 면접관: pickRandom 자리에 LLM 응답을 기다리는 async action 으로 교체.
//    - 빈칸 모드: Question 에 cloze 필드 추가 후 컴포넌트에서 분기.
// =============================================================

import { create } from "zustand";
import type {
  Category,
  PersistedState,
  Question,
  QuestionRecord,
  ReviewStatus,
} from "../types";
import { QUESTIONS } from "../data/questions";

// ─── localStorage 헬퍼 ────────────────────────────────────
const STORAGE_KEY = "csStudy:v1";

/** 오늘 날짜를 'YYYY-MM-DD' (로컬 타임존) 으로 — dailyCounts 의 키. */
function todayKey(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const initialPersisted: PersistedState = {
  records: {},
  dailyCounts: {},
  activeCategory: null,
};

function loadPersisted(): PersistedState {
  if (typeof window === "undefined") return initialPersisted;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialPersisted;
    const parsed = JSON.parse(raw) as Partial<PersistedState>;
    // 깨진 저장값에 대비해 필드별 기본값 fallback.
    return {
      records: parsed.records ?? {},
      dailyCounts: parsed.dailyCounts ?? {},
      activeCategory: parsed.activeCategory ?? null,
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

// ─── Store 본체 ───────────────────────────────────────────
interface StudyState extends PersistedState {
  /** 현재 화면에 보여줄 문제. null = 아직 뽑은 게 없음. */
  currentQuestion: Question | null;
  /** 정답 토글 상태. 문제가 바뀌면 자동 false. */
  isAnswerVisible: boolean;

  // ─── actions ───
  /** 카테고리 필터 변경. null 이면 전체. */
  setCategory: (c: Category | null) => void;
  /** 현재 필터에 맞춰 랜덤 문제 1개를 뽑는다. */
  pickRandom: () => void;
  /** 정답 보기 토글. */
  toggleAnswer: () => void;
  /** 자기평가 저장 + 오늘 카운트 +1 + 다음 문제로 이동. */
  recordStatus: (status: ReviewStatus) => void;
  /** 오늘 푼 문제 수 (selector 헬퍼). */
  getTodayCount: () => number;
}

// 풀(pool)에서 직전 문제와 같지 않은 항목을 뽑는다 — 연속 동일 문제 방지.
function pickFromPool(pool: Question[], prevId: string | null): Question | null {
  if (pool.length === 0) return null;
  if (pool.length === 1) return pool[0];
  let next = pool[Math.floor(Math.random() * pool.length)];
  // 최대 5회 재시도. 5회 안에 다른 게 안 나오면 그대로 사용.
  for (let i = 0; i < 5 && next.id === prevId; i++) {
    next = pool[Math.floor(Math.random() * pool.length)];
  }
  return next;
}

export const useStudyStore = create<StudyState>((set, get) => {
  const persisted = loadPersisted();

  // 영속화 헬퍼 — actions 안에서 set 후 호출.
  const persist = () => {
    const { records, dailyCounts, activeCategory } = get();
    savePersisted({ records, dailyCounts, activeCategory });
  };

  return {
    // ─── 초기값 ───
    ...persisted,
    currentQuestion: null,
    isAnswerVisible: false,

    // ─── actions ───
    setCategory: (c) => {
      set({ activeCategory: c });
      // 필터 바꾸면 자연스럽게 새 문제로 — 사용자가 한 번 더 클릭 안 해도 되게.
      get().pickRandom();
      persist();
    },

    pickRandom: () => {
      const { activeCategory, currentQuestion } = get();
      const pool = activeCategory
        ? QUESTIONS.filter((q) => q.category === activeCategory)
        : QUESTIONS;
      const next = pickFromPool(pool, currentQuestion?.id ?? null);
      set({ currentQuestion: next, isAnswerVisible: false });
    },

    toggleAnswer: () =>
      set((s) => ({ isAnswerVisible: !s.isAnswerVisible })),

    recordStatus: (status) => {
      const { currentQuestion, records, dailyCounts } = get();
      if (!currentQuestion) return;

      const prev: QuestionRecord | undefined = records[currentQuestion.id];
      const nextRecord: QuestionRecord = {
        id: currentQuestion.id,
        status,
        lastReviewedAt: Date.now(),
        reviewCount: (prev?.reviewCount ?? 0) + 1,
      };

      const key = todayKey();
      const nextDaily = {
        ...dailyCounts,
        [key]: (dailyCounts[key] ?? 0) + 1,
      };

      set({
        records: { ...records, [currentQuestion.id]: nextRecord },
        dailyCounts: nextDaily,
      });
      persist();

      // 평가 저장 후 자동으로 다음 문제로 — '한 손 학습' 흐름.
      get().pickRandom();
    },

    getTodayCount: () => {
      const { dailyCounts } = get();
      return dailyCounts[todayKey()] ?? 0;
    },
  };
});
