// =============================================================
// exercise.ts — "문제 하나 → 다양한 출제 형태" 변환기
//
// 설계 메모 (초보자용):
// - Question(원재료)은 그대로 두고, 화면에 낼 때마다 Exercise(요리)로 바꾼다.
//   같은 문제도 어떤 날은 객관식, 어떤 날은 빈칸으로 나온다 → 지루함 방지 + 기억 강화.
// - 여기 함수들은 전부 "순수 함수" (입력 → 출력, 부수효과 없음).
//   그래서 스토어/컴포넌트 어디서든 안심하고 부를 수 있고 테스트도 쉽다.
// =============================================================

import type {
  BlankExercise,
  ChoiceExercise,
  Exercise,
  ExerciseType,
  MatchExercise,
  OxExercise,
  Question,
  QuizChoice,
  TypingExercise,
} from "../types";
import { QUESTIONS, SUMMARIES } from "../data/questions";

// ─── 공용 헬퍼 ────────────────────────────────────────────

/** 배열을 복사해 섞는다 (Fisher–Yates). 원본은 안 건드린다. */
export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** 문제의 한 줄 요약 — SUMMARIES 에 없으면 answer 의 첫 문장으로 폴백. */
export function summaryOf(q: Question): string {
  const s = SUMMARIES[q.id];
  if (s) return s;
  const first = q.answer.split(/(?<=[.?!])\s/)[0];
  return first.length > 80 ? first.slice(0, 78) + "…" : first;
}

/** "같은 카테고리 우선"으로 오답 후보 문제들을 뽑는다. */
function distractorsOf(q: Question, count: number): Question[] {
  const sameCat = QUESTIONS.filter((x) => x.id !== q.id && x.category === q.category);
  const otherCat = QUESTIONS.filter((x) => x.id !== q.id && x.category !== q.category);
  return [...shuffle(sameCat), ...shuffle(otherCat)].slice(0, count);
}

// ─── 키워드 추출 (빈칸/타이핑용) ──────────────────────────
// 요약 문장에서 "뚫어도 문제가 성립하는 단어"를 고른다.
// 전략: ① 영문 기술 용어(TLS, POST 같은 것) 최우선
//        ② 없으면 가장 긴 한글 단어 (길수록 핵심 명사일 확률↑)

/** 토큰 앞뒤의 따옴표/문장부호를 벗긴다. */
function stripPunct(token: string): string {
  return token.replace(/^["'“”‘’(\[]+/, "").replace(/["'“”‘’)\].,!?…:;—]+$/, "");
}

/** 뚫어봤자 의미 없는 영문 토큰들 (접속사·기호 수준). */
const LATIN_STOPWORDS = new Set(["vs", "or", "and", "the", "not", "no", "of", "to", "in"]);

/**
 * 요약에서 빈칸으로 뚫을 키워드 하나를 고른다. 못 찾으면 null.
 * latinOnly=true 면 영문 용어가 있을 때만 반환 (타이핑 문제용 —
 * 한글 단어는 조사가 붙어 있어서 "직접 입력"시키기 애매하기 때문).
 */
export function keywordOf(summary: string, latinOnly = false): string | null {
  const tokens = summary.split(/\s+/).map(stripPunct).filter((t) => t.length >= 2);
  // 영문 3글자 이상 + 불용어 아님 = 기술 용어일 확률이 높다 (TLS, POST, handshake…).
  const latin = tokens.filter(
    (t) =>
      /[A-Za-z]{3,}/.test(t) && t.length <= 20 && !LATIN_STOPWORDS.has(t.toLowerCase())
  );
  if (latin.length > 0) {
    // 그 중에서도 긴 것 (예: "3-way" 보다 "handshake")
    return latin.sort((a, b) => b.length - a.length)[0];
  }
  if (latinOnly) return null;
  // 한글: 가장 긴 토큰 (조사 포함이지만 단어 은행에서 고르는 방식이라 OK)
  const korean = tokens.filter((t) => /[가-힣]{2,}/.test(t) && t.length <= 12);
  return korean.sort((a, b) => b.length - a.length)[0] ?? null;
}

/** 요약을 "빈칸 앞 / 정답 / 빈칸 뒤"로 자른다. 키워드가 없으면 null. */
function splitAtKeyword(
  summary: string,
  keyword: string
): { before: string; after: string } | null {
  const idx = summary.indexOf(keyword);
  if (idx < 0) return null;
  return {
    before: summary.slice(0, idx),
    after: summary.slice(idx + keyword.length),
  };
}

// ─── 유형별 생성기 ────────────────────────────────────────

/** 객관식: 정답 1 + 오답 3 (기존 buildChoices 로직 그대로). */
export function buildChoiceExercise(q: Question): ChoiceExercise {
  const choices: QuizChoice[] = [
    { qid: q.id, text: summaryOf(q), correct: true },
    ...distractorsOf(q, 3).map((x) => ({
      qid: x.id,
      text: summaryOf(x),
      correct: false,
    })),
  ];
  return { type: "choice", choices: shuffle(choices) };
}

/** 빈칸 채우기. 키워드/오답 단어가 부족하면 null (→ 다른 유형으로 폴백). */
export function buildBlankExercise(q: Question): BlankExercise | null {
  const summary = summaryOf(q);
  const answer = keywordOf(summary);
  if (!answer) return null;
  const parts = splitAtKeyword(summary, answer);
  if (!parts) return null;

  // 오답 단어: 다른 문제 요약들의 키워드 (중복/정답과 같은 것 제외)
  const wrongWords: string[] = [];
  for (const other of distractorsOf(q, 10)) {
    const w = keywordOf(summaryOf(other));
    if (w && w !== answer && !wrongWords.includes(w)) wrongWords.push(w);
    if (wrongWords.length >= 3) break;
  }
  if (wrongWords.length < 2) return null; // 은행이 너무 빈약하면 포기

  return {
    type: "blank",
    before: parts.before,
    after: parts.after,
    answer,
    bank: shuffle([answer, ...wrongWords]),
  };
}

/** OX 퀴즈: 50% 확률로 진짜 요약(O) 또는 다른 문제의 요약(X)을 보여준다. */
export function buildOxExercise(q: Question): OxExercise | null {
  const isTrue = Math.random() < 0.5;
  if (isTrue) return { type: "ox", statement: summaryOf(q), isTrue: true };
  const [other] = distractorsOf(q, 1);
  if (!other) return null;
  return { type: "ox", statement: summaryOf(other), isTrue: false };
}

/** 직접 타이핑: 영문 기술 용어가 있을 때만 출제. */
export function buildTypingExercise(q: Question): TypingExercise | null {
  const summary = summaryOf(q);
  const answer = keywordOf(summary, true); // 영문 용어만
  if (!answer) return null;
  const parts = splitAtKeyword(summary, answer);
  if (!parts) return null;
  return { type: "typing", before: parts.before, after: parts.after, answer };
}

/** 선 연결하기: 현재 문제 + 3문제의 (질문 ↔ 요약) 짝. 4쌍이 안 되면 null. */
export function buildMatchExercise(q: Question): MatchExercise | null {
  const others = distractorsOf(q, 3);
  if (others.length < 3) return null;
  const pool = [q, ...others];
  return {
    type: "match",
    pairs: pool.map((x) => ({ qid: x.id, term: x.question, def: summaryOf(x) })),
  };
}

// ─── 랜덤 믹스 진입점 ─────────────────────────────────────

/**
 * 유형별 출제 비중 (가중치 룰렛).
 * 객관식을 제일 자주, 매칭/말하기는 가끔 — 매칭은 한 번에 4문제 분량이라
 * 너무 자주 나오면 페이스가 무거워진다.
 */
const TYPE_WEIGHTS: Array<{ type: ExerciseType; weight: number }> = [
  { type: "choice", weight: 30 },
  { type: "blank", weight: 22 },
  { type: "ox", weight: 18 },
  { type: "typing", weight: 12 },
  { type: "speak", weight: 10 },
  { type: "match", weight: 8 },
];

/**
 * 문제 하나를 "랜덤 유형"으로 포장한다.
 * - 뽑힌 유형이 이 문제에서 성립 안 하면(키워드 없음 등) 객관식으로 폴백.
 * - forceType 을 주면 그 유형을 우선 시도 (디버깅/특정 모드용).
 */
export function buildExercise(q: Question, forceType?: ExerciseType): Exercise {
  const tryBuild = (t: ExerciseType): Exercise | null => {
    switch (t) {
      case "choice":
        return buildChoiceExercise(q);
      case "blank":
        return buildBlankExercise(q);
      case "ox":
        return buildOxExercise(q);
      case "typing":
        return buildTypingExercise(q);
      case "speak":
        return { type: "speak" };
      case "match":
        return buildMatchExercise(q);
    }
  };

  if (forceType) {
    const forced = tryBuild(forceType);
    if (forced) return forced;
  }

  // 가중치 룰렛으로 유형 하나 뽑기
  const total = TYPE_WEIGHTS.reduce((s, w) => s + w.weight, 0);
  let roll = Math.random() * total;
  let picked: ExerciseType = "choice";
  for (const w of TYPE_WEIGHTS) {
    roll -= w.weight;
    if (roll <= 0) {
      picked = w.type;
      break;
    }
  }

  return tryBuild(picked) ?? buildChoiceExercise(q); // 폴백은 언제나 객관식
}

// ─── 타이핑 채점 ──────────────────────────────────────────

/** 비교용 정규화: 소문자 + 공백/문장부호 제거. "Web Worker" ≈ "webworker" */
function normalize(s: string): string {
  return s.toLowerCase().replace(/[\s\-_.,'"“”‘’!?]/g, "");
}

/** 편집 거리 (Levenshtein) — "몇 글자 고치면 같아지나". 오타 허용에 쓴다. */
function editDistance(a: string, b: string): number {
  const dp = Array.from({ length: a.length + 1 }, (_, i) =>
    Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[a.length][b.length];
}

/**
 * 타이핑 답 채점: 정규화 후 비교, 5글자 이상이면 오타 1글자까지 봐준다.
 * (예: "handshake" 를 "handshak" 로 쳐도 정답 처리)
 */
export function gradeTyping(input: string, answer: string): boolean {
  const a = normalize(input);
  const b = normalize(answer);
  if (a.length === 0) return false;
  if (a === b) return true;
  return b.length >= 5 && editDistance(a, b) <= 1;
}
