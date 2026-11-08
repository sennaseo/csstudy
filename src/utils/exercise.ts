// =============================================================
// exercise.ts — "문제 하나 → 다양한 출제 형태" 변환기
//
// 설계 메모 (초보자용):
// - Question(원재료)은 그대로 두고, 화면에 낼 때마다 Exercise(요리)로 바꾼다.
//   같은 문제도 어떤 날은 객관식, 어떤 날은 빈칸으로 나온다 → 지루함 방지 + 기억 강화.
// - 여기 함수들은 전부 "순수 함수" (입력 → 출력, 부수효과 없음).
//   그래서 스토어/컴포넌트 어디서든 안심하고 부를 수 있고 테스트도 쉽다.
// - 레벨 = 출제 형태의 어려움(재인 → 단서회상 → 자유회상).
//   실무(BackendQuest)의 L1→L3→L4와 같은 사다리.
// =============================================================

import type {
  BlankExercise,
  ChoiceExercise,
  CodeExercise,
  Exercise,
  ExerciseType,
  Level,
  MatchExercise,
  OxExercise,
  Question,
  QuizChoice,
  TypingExercise,
} from "../types";
import { QUESTIONS, SUMMARIES } from "../data/questions";
import { OX_FALSE } from "../data/oxFalse";
import { CHOICE_TEXTS } from "../data/choiceTexts";

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

/**
 * "같은 카테고리 우선"으로 오답 후보 문제들을 뽑는다.
 * quizCode 문제는 빼둔다 — 코드 없이 질문 글만 보이면 매칭/보기로서 의미가 없다.
 */
function distractorsOf(q: Question, count: number): Question[] {
  const pool = QUESTIONS.filter((x) => x.id !== q.id && !x.quizCode);
  const sameCat = pool.filter((x) => x.category === q.category);
  const otherCat = pool.filter((x) => x.category !== q.category);
  return [...shuffle(sameCat), ...shuffle(otherCat)].slice(0, count);
}

// ─── 키워드 추출 (빈칸/타이핑용) ──────────────────────────
// 요약 문장에서 "뚫어도 문제가 성립하는 단어"를 고른다.
// 전략: ① 영문 기술 용어(TLS, POST 같은 것) 최우선
//        ② 없으면 한글 명사 (조사를 떼고, 용언 활용형은 거른다)
//
// 왜 이렇게까지 하나: 예전엔 "가장 긴 한글 토큰"을 그냥 뚫었더니 정답이
// "주방을", "씨름하며", "바뀔" 같은 게 나왔다. 빈칸의 정답은 사전에 실릴
// 법한 '단어'여야지, 조사·어미가 붙은 말토막이면 학습이 안 된다.

/**
 * 토큰 앞뒤의 따옴표/문장부호를 벗긴다.
 * 괄호·등호·슬래시는 '경계'라서 splitToTokens 가 미리 잘라주지만,
 * 혹시 남아 있어도 여기서 한 번 더 털어낸다.
 */
function stripPunct(token: string): string {
  return token
    .replace(/^["'“”‘’(\[{<]+/, "")
    .replace(/["'“”‘’)\]}>.,!?…:;—·]+$/, "");
}

/**
 * 요약을 토큰으로 쪼갠다.
 * 공백뿐 아니라 괄호·등호·슬래시·화살표 같은 것도 경계로 본다 —
 * 안 그러면 "잡일(AOP", "쌓기(LIFO", "exec=통째로" 같은 반쪽짜리가 정답이 된다.
 */
function splitToTokens(summary: string): string[] {
  return summary
    .split(/[\s()\[\]{}<>=/\\|,·—→↔~"'“”‘’!?…:;]+/)
    .map(stripPunct)
    .filter((t) => t.length > 0);
}

/** 뚫어봤자 의미 없는 영문 토큰들 (접속사·기호 수준). */
const LATIN_STOPWORDS = new Set(["vs", "or", "and", "the", "not", "no", "of", "to", "in"]);

/**
 * 한국어 조사 — 명사 뒤에 붙어 다니는 꼬리표.
 * 긴 것부터 검사해야 "으로"를 "로"보다 먼저 떼어낸다 (안 그러면 "으"가 남는다).
 */
const PARTICLES = [
  "에서는", "만큼만", "에서", "으로", "까지", "부터", "보다", "에게", "한테",
  "이라", "라는", "이나", "조차", "마저", "처럼", "만큼", "라도", "끼리",
  "을", "를", "이", "가", "은", "는", "의", "에", "로", "도", "만", "과", "와",
];

/**
 * 용언 활용형(동사·형용사가 굴절한 꼴)의 흔한 끝음절. 이런 건 빈칸 정답으로 부적합.
 * "씨름하며", "확인하면", "매달거나" 처럼 문장 중간에서 이어주는 말들이 여기 걸린다.
 */
const VERB_ENDINGS = [
  "다", "면", "서", "며", "고", "자", "야", "지", "네", "죠", "요", "까", "라", "니",
  "해", "돼", "나", "게", "던", "든", "듯", "봐", "줘", "쳐", "겨", "여", "러", "려",
  "어", "아", "주", "두", "대", "수", "록", "되", "하",
];

/**
 * 한글 토큰에서 조사를 떼어낸다. 뗄 게 없으면 원본 그대로.
 * "주방을" → "주방", "메모리로" → "메모리", "키가" → "키".
 * 떼고 나서 1글자만 남는 건 여기서 막지 않는다 — 뒤이어 길이 검사(2자 이상)가
 * 걸러주기 때문이다. 그래서 "키가" 같은 건 아예 후보에서 빠진다.
 */
function stripParticle(token: string): string {
  for (const p of PARTICLES) {
    if (token.length > p.length && token.endsWith(p)) {
      return token.slice(0, -p.length);
    }
  }
  return token;
}

/** 순수 한글 단어인가 (숫자·기호가 섞이면 빈칸 정답으로 부적합). */
function isPureKorean(token: string): boolean {
  return /^[가-힣]+$/.test(token);
}

/** 용언 활용형처럼 보이는가 — "씨름하며", "바뀔", "확인하면" 같은 것들. */
function looksLikeVerbForm(token: string): boolean {
  const last = token.slice(-1);
  if (VERB_ENDINGS.includes(last)) return true;
  const code = token.charCodeAt(token.length - 1) - 0xac00;
  if (code < 0 || code >= 11172) return false;
  const jong = code % 28; // 종성(받침) 번호
  // "바뀔"(ㄹ), "정렬된"(ㄴ), "가져옴"(ㅁ) — 관형형·명사형 어미 받침으로 끝나면 활용형이다.
  if (jong === 8 || jong === 4 || jong === 16) return true;
  return false;
}

/** 빈칸 정답으로 쓸 만한 길이인가 (2~10자). */
function isGoodLength(token: string): boolean {
  return token.length >= 2 && token.length <= 10;
}

/**
 * 요약에서 빈칸으로 뚫을 키워드 하나를 고른다. 못 찾으면 null.
 * latinOnly=true 면 영문 용어가 있을 때만 반환 (타이핑 문제용).
 *
 * null 을 돌려주는 게 실패가 아니다 — 호출부(buildBlankExercise 등)가
 * 그걸 신호로 받아 객관식으로 폴백한다. 억지로 이상한 단어를 뚫느니 그게 낫다.
 */
export function keywordOf(summary: string, latinOnly = false): string | null {
  const tokens = splitToTokens(summary);
  // 영문 3글자 이상 + 불용어 아님 = 기술 용어일 확률이 높다 (TLS, POST, handshake…).
  const latin = tokens.filter(
    (t) =>
      /^[A-Za-z][A-Za-z0-9.+-]*$/.test(t) &&
      /[A-Za-z]{3,}/.test(t) &&
      t.length <= 20 &&
      !LATIN_STOPWORDS.has(t.toLowerCase())
  );
  if (latin.length > 0) {
    // 그 중에서도 긴 것 (예: "3-way" 보다 "handshake")
    return latin.sort((a, b) => b.length - a.length)[0];
  }
  if (latinOnly) return null;

  // 한글: 조사를 떼고 → 활용형을 걸러내고 → 남은 것 중 가장 긴 명사.
  const korean = tokens
    .filter(isPureKorean)
    .map(stripParticle)
    .filter((t) => isGoodLength(t) && !looksLikeVerbForm(t));
  return korean.sort((a, b) => b.length - a.length)[0] ?? null;
}

/**
 * "직접 써서 설명하기"에서 보여줄 핵심 단어 (최대 4개, 요약에 나온 순서대로).
 * 채점용이 아니라 힌트다 — 내가 쓴 답에 이 단어들이 들어갔는지 칩으로 보여준다.
 */
/** 핵심 단어로 보여주면 어색한 부사·대명사류. */
const TERM_STOP = new Set(["아무", "결국", "직접", "전부", "그대로", "다시", "바로", "먼저", "따로", "각자", "만들기", "자체", "모두", "그것", "그걸"]);
/** 동사 줄기 끝 글자 — "판단하(는)", "놔주(는)", "만드(는)", "나눠", "가져" 같은 조각을 거른다. */
const STEM_END = new Set(["하", "해", "주", "줘", "드", "눠", "워", "져", "쳐", "되", "돼", "두", "내", "써", "봐"]);

export function keyTermsOf(summary: string): string[] {
  const out: string[] = [];
  for (const t of splitToTokens(summary)) {
    let term: string | null = null;
    if (/^[A-Za-z][A-Za-z0-9.+-]*$/.test(t) && /[A-Za-z]{2,}/.test(t) && !LATIN_STOPWORDS.has(t.toLowerCase())) term = t;
    else if (isPureKorean(t)) {
      const k = stripParticle(t);
      if (k !== t) {
        // 조사가 붙어 있었으면 명사다 ("목록에서" → 목록). "록"처럼 어미와 겹치는 글자도 살린다.
        if (isGoodLength(k)) term = k;
      } else if (t.endsWith("다") && t.length >= 3 && !looksLikeVerbForm(t.slice(0, -1))) {
        term = t.slice(0, -1); // "이름표다" → 이름표 ("실행된다"는 "실행된" 이라 걸러진다)
      } else if (isGoodLength(k) && !looksLikeVerbForm(k)) term = k;
    }
    // 동사 조각은 "판단하는", "처리해도"처럼 뒤에 ~는/~도가 붙어 있거나 "나눠"처럼 짧다. "메서드"는 살린다.
    if (term && /[가-힣]$/.test(term) && STEM_END.has(term.slice(-1)) && (/[는은도서]$/.test(t) || term.length <= 2)) term = null;
    if (term && TERM_STOP.has(term)) term = null;
    if (term && !out.includes(term)) out.push(term);
  }
  return out.slice(0, 4);
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

// ─── 보기에서 주제어 가리기 ───────────────────────────────
// 요약은 대부분 "셀렉트는 캐시 원본은 두고…"처럼 그 문제의 주제어로 시작한다.
// 그대로 객관식 보기·짝 맞추기 설명에 쓰면 질문의 "select"와 보기의 "셀렉트는"만
// 이어 붙여도 정답이 보인다 (내용을 몰라도 맞힘). 그래서 보기로 쓸 때만 주제어를 ○○ 로 가린다.
// OX·빈칸·타이핑은 문장 자체를 판단하는 문제라 그대로 둔다.

/** 관형형 어미("남겨두는", "하는", "있는")처럼 보이는 줄기 — 주제어가 아니니 가리면 안 된다. */
const ADNOMINAL_STEM_END = ["하", "되", "히", "두", "주", "있", "없", "쓰", "보", "지", "이", "받", "나", "오", "가", "내", "리"];
/** 앞 토큰이 이걸로 끝나면 절이 끝난 것 → 바로 뒤 "X는" 은 두 번째 주제어 ("면제하고 언노운은"). */
const CLAUSE_END = /(고|며|지만|이고|이며)$/;
/** 목적어 뒤 "결과를 유즈콜백은" — 세 글자 이상 줄기일 때만 (짧으면 동사형일 확률이 높다). */
const OBJECT_END = /[을를]$/;
/** 한 글자 줄기는 대부분 "같은", "작은", "넣은" 같은 형용사·동사형. 진짜 한 글자 용어만 예외. */
const SINGLE_NOUNS = new Set(["키", "빈", "힙", "큐", "락", "탭", "룰", "뷰", "훅", "틱"]);
const HIDE = "○○";

/** 모든 요약의 맨 앞 주제어 줄기 모음 — "유즈콜백은"처럼 문장 중간에 나와도 용어로 알아본다. */
let termStems: Set<string> | null = null;
function knownTermStems(): Set<string> {
  if (termStems) return termStems;
  termStems = new Set();
  for (const q of QUESTIONS) {
    const t = topicOf(summaryOf(q).split(" "));
    if (t) termStems.add(t.stem);
  }
  return termStems;
}

/** "X는"/"X 는" 을 줄기·조사로 나눈다. 아니면 null. */
function topicParts(toks: string[], i: number): { stem: string; from: number } | null {
  const t = toks[i];
  if ((t === "은" || t === "는") && i > 0) return { stem: toks[i - 1], from: i - 1 };
  if (t.length >= 2 && /[은는]$/.test(t)) {
    const stem = t.slice(0, -1);
    if (ADNOMINAL_STEM_END.includes(stem.slice(-1)) && /[가-힣]$/.test(stem)) return null;
    if (/^[가-힣]$/.test(stem) && !SINGLE_NOUNS.has(stem)) return null;
    return { stem, from: i };
  }
  return null;
}

/** 문장 맨 앞 주제어 (앞 세 토큰 안의 첫 "X는"). "서버 상태는" 처럼 두 토큰이면 둘 다. */
function topicOf(toks: string[]): { stem: string; start: number; end: number } | null {
  for (let i = 0; i < Math.min(3, toks.length); i++) {
    const p = topicParts(toks, i);
    if (p) return { stem: p.stem, start: 0, end: i };
  }
  return null;
}

/** 객관식 보기·짝 맞추기용: 주제어를 ○○ 로 가린 요약. */
export function hideTerms(summary: string): string {
  const toks = summary.split(" ");
  const top = topicOf(toks);
  if (!top) return summary;
  const known = knownTermStems();
  const out = [...toks];
  const hide = (i: number) => {
    const t = toks[i];
    out[i] = t === "은" || t === "는" ? t : /[은는]$/.test(t) && t.length >= 2 ? HIDE + t.slice(-1) : HIDE;
  };
  // ① 맨 앞 주제어 (여러 토큰이면 하나로 합친다)
  for (let k = top.start; k <= top.end; k++) out[k] = "";
  const head = toks[top.end];
  out[top.end] = head === "은" || head === "는" ? HIDE + " " + head : HIDE + head.slice(-1);
  // ② 뒤쪽의 두 번째 주제어
  for (let i = top.end + 1; i < toks.length; i++) {
    const p = topicParts(toks, i);
    if (!p) continue;
    const latin = /[A-Za-z=<>!]/.test(p.stem);
    const prev = toks[p.from - 1] ?? "";
    const afterClause = CLAUSE_END.test(prev) && p.stem.length >= 2;
    const afterObject = OBJECT_END.test(prev) && p.stem.length >= 3;
    // 세 글자 이상 줄기("지씨타임", "셋쿼리데이터")는 동사형만 아니면 거의 다 용어다. "원본은" 같은 두 글자 명사는 남긴다.
    const longTerm = p.stem.length >= 3;
    if (latin || known.has(p.stem) || SINGLE_NOUNS.has(p.stem) || p.stem === top.stem || afterClause || afterObject || longTerm) {
      if (p.from !== i) out[p.from] = HIDE;
      hide(i);
    }
  }
  return out.filter((t) => t !== "").join(" ");
}

/**
 * 객관식 보기·짝 맞추기 설명에 쓸 문장.
 * 손으로 쓴 보기 전용 문장(choiceTexts.ts)이 우선, 없으면 요약에서 주제어만 가린다(새 문제 대비 안전망).
 */
export function choiceTextOf(q: Question): string {
  return CHOICE_TEXTS[q.id] ?? hideTerms(summaryOf(q));
}

// ─── 유형별 생성기 ────────────────────────────────────────

/** 객관식: 정답 1 + 오답 3 (기존 buildChoices 로직 그대로). */
export function buildChoiceExercise(q: Question): ChoiceExercise {
  const choices: QuizChoice[] = [
    { qid: q.id, text: choiceTextOf(q), correct: true },
    ...distractorsOf(q, 3).map((x) => ({
      qid: x.id,
      text: choiceTextOf(x),
      correct: false,
    })),
  ];
  return { type: "choice", choices: shuffle(choices) };
}

/**
 * 작성자가 직접 쓴 보기(q.options)로 객관식을 만든다. [0] 이 정답.
 * 오답 qid 는 `${id}#1`… 처럼 서로 다르게 — QuestionCard 의 채점·하이라이트·
 * React key·숫자 단축키가 전부 qid 기준이라 겹치면 안 된다.
 */
function buildOptionsExercise(q: Question, options: string[]): ChoiceExercise {
  const choices = options.map((text, i) => ({
    qid: i === 0 ? q.id : `${q.id}#${i}`,
    text,
    correct: i === 0,
  }));
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

/**
 * OX 퀴즈: 50% 확률로 진짜 요약(O) 또는 거짓 문장(X).
 *
 * 거짓 문장 우선순위 = ① 이 문제 요약을 비튼 OX_FALSE ② 없으면 같은 카테고리 다른 요약(폴백).
 * 화면이 질문 제목을 띄우므로 ②도 "위 질문의 답인가"로 성립한다.
 *
 * ①을 먼저 두는 이유: 카테고리가 넓어서(CS 안에 프로세스·TLS·암호화가 다 있다)
 * ②만 쓰면 "스레드 안전"을 묻는데 "IPC 는…" 같은 완전히 다른 주제가 떠서
 * 학습자가 '이게 이 문제랑 무슨 상관이지?'가 된다. 같은 문장을 한 곳만 비틀면
 * 그 문제의 해설이 곧바로 왜 틀렸는지 알려준다.
 * 폴백할 짝조차 없으면 null → 다른 유형으로 폴백.
 */
export function buildOxExercise(q: Question): OxExercise | null {
  if (Math.random() < 0.5) return { type: "ox", statement: summaryOf(q), isTrue: true };
  const twisted = OX_FALSE[q.id];
  if (twisted) return { type: "ox", statement: twisted, isTrue: false };
  const sameCat = QUESTIONS.filter((x) => x.id !== q.id && x.category === q.category && !x.quizCode);
  const [other] = shuffle(sameCat);
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
    pairs: pool.map((x) => ({ qid: x.id, term: x.question, def: choiceTextOf(x) })),
  };
}

// ─── 코드 고르기 ──────────────────────────────────────────

/**
 * 코드에서 주석을 걷어낸다 — 예시 코드 주석에 "// Controller = 홀: HTTP 만 안다" 처럼
 * 답이 그대로 적혀 있어서, 그대로 보여주면 코드를 안 읽고 주석만 보고 고른다.
 * 지우는 것: // 줄 주석 (단 "http://" 같은 : 바로 뒤는 제외), /* 블록 *\/, "# " 파이썬 주석, "-- " SQL 주석.
 * 문자열('…', "…", `…`) 안은 건드리지 않는다. 주석만 있던 줄은 줄째로 빠진다.
 */
export function stripComments(code: string): string {
  const out: string[] = [];
  let inBlock = false;
  for (const line of code.split("\n")) {
    let res = "";
    let quote: string | null = null;
    let i = 0;
    let hadComment = false;
    while (i < line.length) {
      const ch = line[i];
      const two = line.slice(i, i + 2);
      if (inBlock) {
        if (two === "*/") {
          inBlock = false;
          i += 2;
          // 줄 맨 앞의 블록 주석이었다면 뒤따르는 공백도 같이 지운다 ("/* … */ SELECT" → "SELECT")
          if (res.trim() === "") while (line[i] === " ") i++;
        } else i++;
        hadComment = true;
        continue;
      }
      if (quote) {
        res += ch;
        if (ch === "\\") {
          res += line[i + 1] ?? "";
          i += 2;
          continue;
        }
        if (ch === quote) quote = null;
        i++;
        continue;
      }
      if (ch === '"' || ch === "'" || ch === "`") {
        quote = ch;
        res += ch;
        i++;
        continue;
      }
      if (two === "/*") {
        inBlock = true;
        hadComment = true;
        i += 2;
        continue;
      }
      const prev = line[i - 1] ?? " ";
      if ((two === "//" && prev !== ":") || (two === "# " && /\s/.test(prev)) || (two === "--" && line[i + 2] === " " && /\s/.test(prev))) {
        hadComment = true;
        break;
      }
      res += ch;
      i++;
    }
    const trimmed = res.replace(/\s+$/, "");
    if (hadComment && trimmed.trim() === "") continue; // 주석만 있던 줄
    out.push(trimmed);
  }
  // 빈 줄이 겹치면 하나로, 앞뒤 빈 줄은 없앤다
  return out
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** 코드 고르기 재료가 되는 문제인가 — 기술면접 예시는 코드가 아니라 말하기 대본이라 뺀다. */
function hasPickableCode(q: Question): boolean {
  if (!q.code || q.quizCode || q.options || q.category === "기술면접") return false;
  return stripComments(q.code).split("\n").length >= 2;
}

/** 코드 고르기: 이 문제의 예시 코드 1 + 같은 분야 다른 문제의 코드 3. 재료가 모자라면 null. */
export function buildCodeExercise(q: Question): CodeExercise | null {
  if (!hasPickableCode(q)) return null;
  const mine = stripComments(q.code!);
  const pool = QUESTIONS.filter((x) => x.id !== q.id && hasPickableCode(x));
  const ordered = [...shuffle(pool.filter((x) => x.category === q.category)), ...shuffle(pool.filter((x) => x.category !== q.category))];
  const picked: Question[] = [];
  const seenCode = new Set([mine]);
  for (const x of ordered) {
    const c = stripComments(x.code!);
    if (seenCode.has(c)) continue;
    seenCode.add(c);
    picked.push(x);
    if (picked.length === 3) break;
  }
  if (picked.length < 3) return null;
  return {
    type: "code",
    options: shuffle([
      { qid: q.id, code: mine, full: q.code!, correct: true },
      ...picked.map((x) => ({ qid: x.id, code: stripComments(x.code!), full: x.code!, correct: false })),
    ]),
  };
}

// ─── 랜덤 믹스 진입점 ─────────────────────────────────────

/**
 * 레벨별 출제 비중 (가중치 룰렛).
 * - mix: 기존 표 그대로 (객관식을 제일 자주, 매칭/말하기는 가끔 — 매칭은
 *   한 번에 4문제 분량이라 너무 자주 나오면 페이스가 무거워진다).
 * - easy: 고르기(재인) 위주. normal: 빈칸(단서회상). hard: 직접 쓰기/말하기(자유회상).
 */
const WEIGHTS_BY_LEVEL: Record<Level | "mix", Array<{ type: ExerciseType; weight: number }>> = {
  mix: [
    { type: "choice", weight: 30 },
    { type: "blank", weight: 22 },
    { type: "ox", weight: 18 },
    { type: "typing", weight: 12 },
    { type: "speak", weight: 10 },
    { type: "match", weight: 8 },
    { type: "code", weight: 10 },
  ],
  easy: [
    { type: "choice", weight: 60 },
    { type: "ox", weight: 40 },
  ],
  normal: [
    { type: "blank", weight: 50 },
    { type: "code", weight: 20 },
    { type: "match", weight: 15 },
    { type: "choice", weight: 15 },
  ],
  hard: [
    { type: "typing", weight: 40 },
    { type: "blank", weight: 30 },
    { type: "speak", weight: 30 },
  ],
};

/**
 * 문제 하나를 "랜덤 유형"으로 포장한다.
 * - level 표에서 가중치 룰렛으로 유형을 뽑는다 (null/미지정 = mix).
 * - 뽑힌 유형이 이 문제에서 성립 안 하면(키워드 없음 등) 그 레벨 표를 앞에서부터
 *   순서대로 시도하고, 전부 실패하면 객관식으로 폴백한다.
 * - forceType 을 주면 그 유형을 우선 시도 (디버깅/특정 모드용).
 */
export function buildExercise(q: Question, level: Level | null = null, forceType?: ExerciseType): Exercise {
  // 직접 쓴 보기가 있으면 레벨·forceType 무관하게 항상 객관식.
  if (q.options) return buildOptionsExercise(q, q.options);

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
      case "code":
        return buildCodeExercise(q);
    }
  };

  if (forceType) {
    const forced = tryBuild(forceType);
    if (forced) return forced;
  }

  const weights = WEIGHTS_BY_LEVEL[level ?? "mix"];

  // 가중치 룰렛으로 유형 하나 뽑기
  const total = weights.reduce((s, w) => s + w.weight, 0);
  let roll = Math.random() * total;
  let picked: ExerciseType = weights[0].type;
  for (const w of weights) {
    roll -= w.weight;
    if (roll <= 0) {
      picked = w.type;
      break;
    }
  }

  const rolled = tryBuild(picked);
  if (rolled) return rolled;

  // 뽑힌 유형이 성립 안 하면 그 레벨 표를 앞에서부터 순서대로 시도.
  for (const w of weights) {
    const built = tryBuild(w.type);
    if (built) return built;
  }

  return buildChoiceExercise(q); // 최종 폴백은 언제나 객관식
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
