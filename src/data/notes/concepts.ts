// =============================================================
// 공부노트 개념 사전 — 노트 본문의 낱말을 눌러 "그 개념 다시 보기"
//
// 재료는 두 가지다.
//   ① 단어장 카드(cards.ts) 120장 — 한 줄 정의 + 일상 비유가 이미 있다.
//      카드 이름 "멱등성(Idempotency)" 에서 '멱등성', 'Idempotency' 를 둘 다 뽑는다.
//   ② 공부노트 — 아래 NOTE_ALIASES 에 노트마다 "이 노트가 설명하는 개념 이름"을 손으로 적는다.
//      노트 제목을 기계로 자르면 "as", "get", "for" 같은 잡음이 너무 많아서 손으로 고른다.
//
// 같은 이름이 여러 노트에 있으면(클래스: 파이썬·자바) 지금 읽는 과목 쪽을 먼저 연다.
// 노트를 새로 쓰면 여기에도 한 줄 — notes.test.ts 가 없는 id 를 잡아낸다.
// =============================================================

import { CARDS, CARD_DOMAIN_EMOJI, type CsCard } from "../cards";
import { NOTE_SUBJECTS } from "./index";
import type { Note } from "./types";

/** 노트 id → 그 노트로 가는 개념 이름들. 영어는 대소문자를 구분한다(파이썬 list ≠ 자바 List). */
export const NOTE_ALIASES: Record<string, string[]> = {
  // ── 파이썬
  "n-py-2-1": ["변수", "할당", "표현식"],
  "n-py-2-2": ["자료형", "산술 연산자"],
  "n-py-2-3": ["부동소수점", "float"],
  "n-py-2-4": ["시퀀스", "문자열", "f-string", "이스케이프"],
  "n-py-2-5": ["인덱싱", "슬라이싱", "인덱스"],
  "n-py-2-6": ["PEP 8", "주석"],
  "n-py-3-1": ["list", "tuple", "range", "리스트", "튜플"],
  "n-py-3-2": ["dict", "set", "딕셔너리", "세트", "None"],
  "n-py-3-3": ["형변환"],
  "n-py-3-4": ["비교 연산자", "논리 연산자", "복합 연산자"],
  "n-py-3-5": ["단축평가", "멤버십 연산자"],
  "n-py-4-1": ["함수"],
  "n-py-4-2": ["매개변수", "인자", "가변 인자", "키워드 인자"],
  "n-py-4-3": ["재귀 함수", "재귀"],
  "n-py-4-4": ["내장 함수", "map", "zip"],
  "n-py-4-5": ["스코프", "Scope", "LEGB", "global"],
  "n-py-4-6": ["패킹", "언패킹"],
  "n-py-4-7": ["lambda", "람다"],
  "n-py-5-1": ["모듈", "import"],
  "n-py-5-2": ["패키지", "pip", "표준 라이브러리"],
  "n-py-5-3": ["조건문"],
  "n-py-5-4": ["반복문", "순회"],
  "n-py-5-5": ["while"],
  "n-py-5-6": ["break", "continue", "pass"],
  "n-py-5-7": ["컴프리헨션", "List Comprehension"],
  "n-py-6-1": ["자료구조", "메서드"],
  "n-py-6-6": ["가변", "불변", "얕은 복사", "깊은 복사"],
  "n-py-7-4": ["차집합", "교집합", "합집합"],
  "n-py-7-5": ["해시 테이블", "hashable"],
  "n-py-7-6": ["BNF", "EBNF"],
  "n-py-8-1": ["절차 지향", "객체 지향"],
  "n-py-8-2": ["클래스", "객체", "인스턴스"],
  "n-py-8-3": ["클래스 변수", "인스턴스 변수"],
  "n-py-8-4": ["인스턴스 메서드", "클래스 메서드", "스태틱 메서드", "self", "cls"],
  "n-py-8-5": ["매직 메서드", "데코레이터", "이름 공간"],
  "n-py-9-1": ["상속"],
  "n-py-9-2": ["다중 상속", "MRO", "super()"],
  "n-py-9-3": ["디버깅", "문법 에러", "예외"],
  "n-py-9-4": ["예외 처리", "try", "except", "finally"],
  "n-py-9-5": ["EAFP", "LBYL"],
  // ── 자바
  "n-jv-1-1": ["JDK", "JRE", "JVM", "바이트코드"],
  "n-jv-1-2": ["main 메서드", "println", "printf"],
  "n-jv-1-3": ["명명 규칙", "카멜 케이스"],
  "n-jv-1-4": ["기본형", "참조형"],
  "n-jv-1-5": ["형변환", "오버플로", "캐스팅"],
  "n-jv-1-6": ["final", "상수", "리터럴", "var"],
  "n-jv-2-1": ["증감 연산자"],
  "n-jv-2-2": ["삼항 연산자", "단락 평가"],
  "n-jv-2-4": ["switch"],
  "n-jv-2-5": ["do-while", "반복문"],
  "n-jv-2-6": ["라벨", "중첩 반복"],
  "n-jv-3-1": ["배열"],
  "n-jv-3-2": ["인덱스"],
  "n-jv-3-3": ["다차원 배열", "2차원 배열"],
  "n-jv-3-4": ["Arrays"],
  "n-jv-3-5": ["String", "equals", "리터럴 풀"],
  "n-jv-3-6": ["StringBuilder"],
  "n-jv-4-1": ["클래스", "객체", "인스턴스", "new"],
  "n-jv-4-2": ["필드", "메서드"],
  "n-jv-4-3": ["생성자", "this"],
  "n-jv-4-4": ["오버로딩"],
  "n-jv-4-5": ["static"],
  "n-jv-4-6": ["캡슐화", "접근 제어자", "private", "getter", "setter"],
  "n-jv-5-1": ["상속", "extends", "super"],
  "n-jv-5-2": ["오버라이딩", "@Override"],
  "n-jv-5-3": ["다형성", "업캐스팅", "다운캐스팅", "instanceof"],
  "n-jv-5-4": ["Object 클래스"],
  "n-jv-5-5": ["추상 클래스", "abstract"],
  "n-jv-5-6": ["인터페이스", "implements"],
  "n-jv-6-1": ["예외", "Exception"],
  "n-jv-6-2": ["try-catch", "catch", "finally"],
  "n-jv-6-3": ["checked", "unchecked", "throws", "throw"],
  "n-jv-6-4": ["try-with-resources"],
  "n-jv-6-5": ["래퍼 클래스", "오토박싱", "언박싱", "Integer"],
  "n-jv-6-6": ["LocalDate", "Math", "Random"],
  "n-jv-7-1": ["제네릭", "타입 파라미터", "다이아몬드"],
  "n-jv-7-2": ["컬렉션", "List", "Set", "Map"],
  "n-jv-7-3": ["ArrayList", "LinkedList", "리스트"],
  "n-jv-7-4": ["HashSet", "TreeSet", "hashCode"],
  "n-jv-7-5": ["HashMap"],
  "n-jv-7-6": ["Iterator", "Comparable", "Comparator"],
  "n-jv-8-1": ["람다", "함수형 인터페이스"],
  "n-jv-8-2": ["메서드 참조", "Supplier", "Consumer", "Predicate"],
  "n-jv-8-3": ["스트림", "지연 평가"],
  "n-jv-8-4": ["중간 연산"],
  "n-jv-8-5": ["최종 연산", "collect", "reduce"],
  "n-jv-8-6": ["Optional"],
  // ── 프론트 패턴
  "n-fe-1-1": ["관심사 분리", "Presentational"],
  "n-fe-1-2": ["커스텀 훅"],
  "n-fe-1-3": ["합성 컴포넌트"],
  "n-fe-1-4": ["Render Props"],
  "n-fe-1-5": ["고차 컴포넌트", "HOC"],
  "n-fe-1-6": ["제어 컴포넌트", "비제어 컴포넌트"],
  "n-fe-1-7": ["Provider", "Context", "prop drilling", "Prop drilling"],
  "n-fe-1-8": ["헤드리스"],
  "n-fe-1-9": ["아토믹 디자인"],
  "n-fe-2-1": ["Flux", "단방향 데이터 흐름", "Reducer", "reducer"],
  "n-fe-2-2": ["옵저버 패턴", "구독"],
  "n-fe-2-3": ["싱글턴"],
  "n-fe-2-4": ["서버 상태", "클라이언트 상태", "React Query"],
  "n-fe-2-5": ["낙관적 업데이트"],
  "n-fe-2-6": ["FSD", "Feature-Sliced Design"],
};

/** 시트에 보여줄 개념 하나. 카드와 노트 중 있는 것만 채워진다. */
export interface Concept {
  /** 본문에서 눌린 낱말 그대로 */
  name: string;
  card?: CsCard & { emoji: string };
  /** 같은 이름의 노트들 (과목이 다르면 여럿) */
  notes: { note: Note; subjectId: string; subjectTitle: string; unitTitle: string }[];
}

/**
 * 카드에서 뽑았지만 노트 본문에선 다른 뜻으로 더 자주 쓰여 엉뚱한 카드를 여는 이름.
 * - 아웃: "스케일 업 / 아웃" 에서 잘려 나온 조각
 * - 인가: "~인가?" 같은 말끝과 헷갈린다 ("인증 vs 인가" 카드는 '인증' 으로 열린다)
 * - 인덱스: 파이썬·자바 노트에선 리스트 번호 — DB 인덱스 카드는 'Index' 로만 연다
 * - 복제: 파이썬 노트에선 복사 — DB 복제(Replication) 카드는 'Replication' 으로만 연다
 */
const CARD_ALIAS_BLOCK = new Set(["아웃", "인가", "인덱스", "복제"]);

// ─── 카드 이름 → 별칭 ───
// "멱등성(Idempotency)" → 멱등성, Idempotency / "스택 / 큐" → 스택, 큐 / "인증 vs 인가" → 인증, 인가
function cardAliases(term: string): string[] {
  const out: string[] = [];
  const inner = term.match(/\(([^)]*)\)/)?.[1];
  const outer = term.replace(/\([^)]*\)/g, " ");
  for (const part of [...outer.split(/\s\/\s|\svs\s/), ...(inner ? inner.split(/,|\s\/\s/) : [])]) {
    const p = part.trim();
    if (!p || /xx/.test(p)) continue;
    // 한글은 두 글자 이상, 영문은 두 글자 이상 (힙·큐 같은 한 글자는 다른 말 속에 너무 자주 섞인다)
    if (p.length < 2 || CARD_ALIAS_BLOCK.has(p)) continue;
    out.push(p);
  }
  return out;
}

// ─── 사전 만들기 (처음 한 번) ───
type Target = { kind: "card"; card: CsCard } | { kind: "note"; noteId: string };
let dict: Map<string, Target[]> | null = null;
let byFirstChar: Map<string, string[]> | null = null;
let noteInfo: Map<string, Concept["notes"][number]> | null = null;

function build() {
  if (dict) return;
  dict = new Map();
  noteInfo = new Map();
  const add = (alias: string, t: Target) => {
    const list = dict!.get(alias) ?? [];
    list.push(t);
    dict!.set(alias, list);
  };
  for (const c of CARDS) for (const a of cardAliases(c.term)) add(a, { kind: "card", card: c });
  for (const s of NOTE_SUBJECTS)
    for (const u of s.units)
      for (const n of u.notes) noteInfo.set(n.id, { note: n, subjectId: s.id, subjectTitle: s.title, unitTitle: u.title });
  for (const [id, aliases] of Object.entries(NOTE_ALIASES)) for (const a of aliases) add(a, { kind: "note", noteId: id });
  // 첫 글자 → 별칭들(긴 것부터). 본문을 한 글자씩 훑을 때 그 자리에서 시작하는 개념만 맞춰 본다.
  byFirstChar = new Map();
  for (const a of [...dict.keys()].sort((x, y) => y.length - x.length)) {
    const k = a[0];
    byFirstChar.set(k, [...(byFirstChar.get(k) ?? []), a]);
  }
}

/** 노트가 사전에 등록한 별칭 (그 노트 안에서는 자기 자신을 링크로 걸지 않으려고). */
export function aliasesOfNote(noteId: string): Set<string> {
  return new Set(NOTE_ALIASES[noteId] ?? []);
}

export function conceptOf(name: string, currentNoteId?: string): Concept | null {
  build();
  const targets = dict!.get(name);
  if (!targets) return null;
  const cardT = targets.find((t) => t.kind === "card");
  const card = cardT && cardT.kind === "card" ? { ...cardT.card, emoji: CARD_DOMAIN_EMOJI[cardT.card.domain] } : undefined;
  const cur = currentNoteId ? noteInfo!.get(currentNoteId) : undefined;
  const notes = targets
    .flatMap((t) => (t.kind === "note" && t.noteId !== currentNoteId ? [noteInfo!.get(t.noteId)!] : []))
    .filter(Boolean)
    // 지금 읽는 과목의 노트를 먼저
    .sort((a, b) => Number(b.subjectId === cur?.subjectId) - Number(a.subjectId === cur?.subjectId));
  if (!card && notes.length === 0) return null;
  return { name, card, notes };
}

const isLatin = (c: string) => /[A-Za-z0-9_@]/.test(c);
const isHangul = (c: string) => /[가-힣]/.test(c);

/**
 * 글을 [평문, 개념, 평문, …] 조각으로 나눈다.
 * - 영문 개념은 앞뒤가 영문·숫자가 아닐 때만 (Map 이 HashMap 속에서 걸리지 않게).
 * - 한글 개념은 앞이 한글이 아닐 때만 (뒤에는 조사가 붙으니 허용).
 * - skip 에 든 이름(지금 노트 자신의 개념)은 링크하지 않는다.
 */
export function splitConcepts(text: string, skip: Set<string>): Array<{ text: string; concept?: string }> {
  build();
  const out: Array<{ text: string; concept?: string }> = [];
  let buf = "";
  let i = 0;
  while (i < text.length) {
    const cands = byFirstChar!.get(text[i]);
    let hit: string | null = null;
    if (cands) {
      const prev = text[i - 1] ?? " ";
      for (const a of cands) {
        if (!text.startsWith(a, i) || skip.has(a)) continue;
        const next = text[i + a.length] ?? " ";
        if (isLatin(a[0]) ? isLatin(prev) : isHangul(a[0]) && isHangul(prev)) continue;
        if (isLatin(a[a.length - 1]) && isLatin(next)) continue;
        hit = a;
        break;
      }
    }
    if (hit) {
      if (buf) out.push({ text: buf });
      out.push({ text: hit, concept: hit });
      buf = "";
      i += hit.length;
    } else {
      buf += text[i];
      i++;
    }
  }
  if (buf) out.push({ text: buf });
  return out;
}

/** 인라인 `코드` 한 조각이 통째로 개념 이름인가 (예: `HashMap`). */
export function isConceptName(name: string): boolean {
  build();
  return dict!.has(name);
}
