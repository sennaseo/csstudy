// =============================================================
// exercise 자체 점검 (assert 만 쓰는 최소 테스트 — 프레임워크 없음)
//
// 실행: npx tsx src/utils/exercise.test.ts
//
// 여기서 지키려는 약속:
//   1) 빈칸/타이핑 정답이 '사전에 실릴 법한 단어'다 — 조사·어미·괄호·등호가 붙어 있지 않다.
//   2) 요약(SUMMARIES)이 읽어서 개념이 파악되는 문장이다 — 길이 범위 안, 중복 없음.
//   3) 적당한 키워드가 없으면 억지로 뚫지 않고 null 을 돌려준다 (호출부가 객관식으로 폴백).
//   4) OX 의 거짓 문장은 OX_FALSE(이 문제를 비튼 것) 아니면 같은 카테고리 요약이다.
//   5) OX_FALSE 자체가 성립한다 — 존재하는 id, 원문과 다른 문장, 비슷한 길이.
// =============================================================

import assert from "node:assert/strict";
import type { ExerciseType, Level } from "../types";
import { QUESTIONS, SUMMARIES } from "../data/questions";
import { OX_FALSE } from "../data/oxFalse";
import {
  keywordOf,
  summaryOf,
  buildBlankExercise,
  buildTypingExercise,
  buildOxExercise,
  buildExercise,
  buildChoiceExercise,
  buildMatchExercise,
  hideTerms,
  choiceTextOf,
} from "./exercise";
import { CHOICE_TEXTS } from "../data/choiceTexts";

const CATEGORY_OF = new Map(QUESTIONS.map((q) => [q.id, q.category]));
/** 요약 → 그 요약을 쓰는 문제의 카테고리들 (같은 문장을 여러 문제가 쓸 수도 있으니 집합) */
const CATEGORIES_BY_SUMMARY = new Map<string, Set<string>>();
for (const q of QUESTIONS) {
  const s = summaryOf(q);
  if (!CATEGORIES_BY_SUMMARY.has(s)) CATEGORIES_BY_SUMMARY.set(s, new Set());
  CATEGORIES_BY_SUMMARY.get(s)!.add(q.category);
}

// 1) 빈칸/타이핑 정답 위생 검사 — 전 문제에 대해.
//    "주방을", "씨름하며", "잡일(AOP", "exec=통째로" 같은 게 다시 새어 들어오면 여기서 잡힌다.
{
  // 조사·어미 검사는 "끝 글자만" 보면 안 된다 — "트라이"의 '이', "가로"의 '로'처럼
  // 멀쩡한 단어의 마지막 음절이 조사와 같은 글자일 수 있기 때문이다.
  // 그래서 실제로 망가졌던 사례들을 블랙리스트로 두고, 그 꼴이 다시 나오는지만 본다.
  const 불량정답 = new Set([
    "주방을", "아니면", "써도", "없으면", "씨름하며", "바뀔", "확인하면",
    "홀과", "검증했는", "판단하", "업데이트시", "포기한", "예고된", "것끼리",
    "코드끼리", "정렬된", "연결된", "알려주", "써줄수록", "시작해", "판단해",
    "만들어", "남겨두", "순서대", "올릴수록", "키가", "퀵은", "가져온",
    "매달거나", "갈아끼우게", "길이만큼만", "늘어나",
  ]);
  // 관형형·명사형 어미 받침(ㄹ·ㄴ·ㅁ)으로 끝나는 활용형 — "바뀔", "정렬된", "가져옴".
  const 활용형받침 = (w: string) => {
    const code = w.charCodeAt(w.length - 1) - 0xac00;
    if (code < 0 || code >= 11172) return false;
    const jong = code % 28;
    return jong === 8 || jong === 4 || jong === 16;
  };
  const 기호 = /[()\[\]{}<>=/\\|"'“”‘’,·—→↔]/;

  for (const q of QUESTIONS) {
    const blank = buildBlankExercise(q);
    if (blank) {
      const a = blank.answer;
      assert.ok(!기호.test(a), `빈칸 정답에 괄호·등호 같은 기호가 섞였다: ${q.id} → "${a}"`);
      assert.ok(
        a.length >= 2 && a.length <= 10,
        `빈칸 정답 길이는 2~10자여야 한다: ${q.id} → "${a}" (${a.length}자)`
      );
      // 한글 정답만 조사·어미를 따진다 (영문 용어는 해당 없음)
      if (/^[가-힣]+$/.test(a)) {
        assert.ok(
          !불량정답.has(a),
          `예전에 망가졌던 꼴(조사·어미 붙은 말토막)이 다시 나왔다: ${q.id} → "${a}"`
        );
        assert.ok(
          !활용형받침(a),
          `빈칸 정답이 용언 활용형이다(ㄹ·ㄴ·ㅁ 어미): ${q.id} → "${a}"`
        );
      }
      // 정답이 요약 안에 실제로 들어 있어야 before/answer/after 를 이어붙였을 때 원문이 된다
      assert.equal(
        blank.before + a + blank.after,
        summaryOf(q),
        `빈칸 조각을 이어붙이면 원래 요약이 되어야 한다: ${q.id}`
      );
      assert.ok(blank.bank.includes(a), `단어 은행에 정답이 없다: ${q.id}`);
    }

    const typing = buildTypingExercise(q);
    if (typing) {
      assert.ok(
        !기호.test(typing.answer),
        `타이핑 정답에 기호가 섞였다: ${q.id} → "${typing.answer}"`
      );
      assert.ok(
        /^[A-Za-z][A-Za-z0-9.+-]*$/.test(typing.answer),
        `타이핑 정답은 영문 기술 용어여야 한다: ${q.id} → "${typing.answer}"`
      );
    }
  }
}

// 2) SUMMARIES 품질 — 길이 범위와 중복.
//    너무 짧으면 암호가 되고(객관식 보기로 못 알아봄), 너무 길면 칩이 넘친다.
{
  const ids = Object.keys(SUMMARIES);
  assert.equal(ids.length, QUESTIONS.length, "SUMMARIES 와 QUESTIONS 개수가 다르다");
  for (const q of QUESTIONS) {
    assert.ok(SUMMARIES[q.id], `요약이 빠진 문제: ${q.id}`);
  }

  const seen = new Map<string, string>();
  for (const [id, s] of Object.entries(SUMMARIES)) {
    assert.ok(
      s.length >= 20 && s.length <= 50,
      `요약은 20~50자여야 한다: ${id} → "${s}" (${s.length}자)`
    );
    const prev = seen.get(s);
    assert.equal(prev, undefined, `요약이 중복된다: ${id} 와 ${prev} → "${s}"`);
    seen.set(s, id);
  }
}

// 3) 키워드를 못 찾으면 null — 억지로 뚫지 않는다는 약속.
{
  assert.equal(keywordOf("아 이 그"), null, "1글자 토막뿐이면 null 이어야 한다");
  assert.equal(keywordOf("가다 보면 바뀔"), null, "활용형만 있으면 null 이어야 한다");
  assert.equal(keywordOf("의 를 은 는"), null, "조사만 있으면 null 이어야 한다");
  assert.equal(keywordOf("메모리 독립", true), null, "latinOnly 인데 영문이 없으면 null");

  // 반대로, 멀쩡한 명사가 있으면 조사를 뗀 형태로 돌려준다.
  assert.equal(keywordOf("홀과 주방을 나눈다"), "주방", "조사 '을' 이 떨어져야 한다");
  assert.equal(keywordOf("잡일(AOP)로 공통 처리"), "AOP", "괄호가 토큰 경계여야 한다");
  assert.equal(keywordOf("exec=통째로 교체"), "exec", "등호가 토큰 경계여야 한다");
}

// 4) OX 의 거짓 문장 출처 검사.
//    OX_FALSE 에 있으면 그 문장이 그대로 나와야 하고, 없으면 같은 카테고리 요약이어야 한다.
//    (무작위라 문제마다 여러 번 굴려서 확인)
{
  for (const q of QUESTIONS) {
    for (let i = 0; i < 30; i++) {
      const ox = buildOxExercise(q);
      assert.ok(ox, `OX 를 못 만든 문제: ${q.id}`);
      if (ox.isTrue) {
        assert.equal(ox.statement, summaryOf(q), `참 문장은 자기 요약이어야 한다: ${q.id}`);
        continue;
      }
      assert.notEqual(ox.statement, summaryOf(q), `거짓 문장이 자기 요약이면 안 된다: ${q.id}`);
      const twisted = OX_FALSE[q.id];
      if (twisted) {
        assert.equal(
          ox.statement,
          twisted,
          `OX_FALSE 가 있으면 그 문장을 써야 한다: ${q.id} → "${ox.statement}"`
        );
        continue;
      }
      const cats = CATEGORIES_BY_SUMMARY.get(ox.statement);
      assert.ok(
        cats?.has(CATEGORY_OF.get(q.id)!),
        `OX 거짓 문장이 다른 카테고리에서 왔다: ${q.id}(${q.category}) → "${ox.statement}"`
      );
    }
  }
}

// 5) OX_FALSE 위생 검사 — 없는 id, 원문 그대로 복붙, 길이 급변을 잡는다.
{
  for (const [id, s] of Object.entries(OX_FALSE)) {
    const orig = SUMMARIES[id];
    assert.ok(orig, `OX_FALSE 에 SUMMARIES 없는 id 가 있다: ${id}`);
    assert.notEqual(s, orig, `거짓 문장이 원문과 똑같다: ${id}`);
    assert.ok(
      Math.abs(s.length - orig.length) <= 6,
      `거짓 문장 길이가 원문과 ±6자를 넘게 다르다: ${id} → ${orig.length}자 vs ${s.length}자`
    );
  }
}

// 6) 레벨별 출제 형태 검사 — 각 레벨의 룰렛이 허용된 유형만 뽑는지.
//    (무작위라 문제마다 여러 번 굴려서 확인. hard 는 폴백이 choice 까지 새지 않아야 한다 —
//    빈칸이 139개 전부 성립하므로 typing/blank/speak 안에서 항상 해결돼야 한다.)
{
  const ALLOWED: Record<Level | "mix", Set<ExerciseType>> = {
    easy: new Set(["choice", "ox"]),
    normal: new Set(["blank", "match", "choice"]),
    hard: new Set(["typing", "blank", "speak"]),
    mix: new Set(["choice", "blank", "ox", "typing", "speak", "match"]),
  };

  let hardSawChoice = false;
  for (const q of QUESTIONS) {
    if (q.options) continue; // 직접 쓴 보기 문제는 설계상 항상 choice (아래 7번에서 따로 검사)
    for (const level of ["easy", "normal", "hard", null] as const) {
      const key = level ?? "mix";
      for (let i = 0; i < 20; i++) {
        const ex = buildExercise(q, level);
        assert.ok(
          ALLOWED[key].has(ex.type),
          `${key} 레벨에서 허용 안 된 유형이 나왔다: ${q.id} → "${ex.type}"`
        );
        if (level === "hard" && ex.type === "choice") hardSawChoice = true;
      }
    }
  }
  assert.ok(!hardSawChoice, "hard 레벨에서 choice 가 나오면 안 된다 (빈칸이 항상 성립해야 함)");
}

// 7) 직접 쓴 보기(options) 문제 — 레벨·forceType 무관하게 항상 choice,
//    보기 수 = options 수, 정답 1개(= options[0]), qid 는 전부 달라야 한다.
{
  const q = {
    id: "test-options",
    category: QUESTIONS[0].category,
    question: "출력은?",
    answer: "3",
    quizCode: "console.log(1 + 2)",
    options: ["3", "12", "undefined", "NaN"],
  };
  for (const level of ["easy", "normal", "hard", null] as const) {
    for (const force of [undefined, "blank", "match"] as const) {
      const ex = buildExercise(q, level, force);
      assert.equal(ex.type, "choice");
      if (ex.type !== "choice") continue;
      assert.equal(ex.choices.length, q.options.length);
      const correct = ex.choices.filter((c) => c.correct);
      assert.equal(correct.length, 1);
      assert.equal(correct[0].text, "3");
      assert.equal(correct[0].qid, q.id);
      assert.equal(new Set(ex.choices.map((c) => c.qid)).size, ex.choices.length, "qid 중복");
    }
  }
}

// ─── 보기에서 주제어 가리기 ───────────────────────────────
// 사용자 제보: "select 옵션은?" 문제의 보기가 "셀렉트는 …"으로 시작해 내용을 몰라도 맞혔다.
{
  const cases: Array<[string, string]> = [
    ["셀렉트는 캐시 원본은 두고 필요한 부분만 잘라서 준다", "○○는 캐시 원본은 두고 필요한 부분만 잘라서 준다"],
    ["프로세스는 메모리를 따로 쓰고 스레드는 같이 쓴다", "○○는 메모리를 따로 쓰고 ○○는 같이 쓴다"],
    ["HTTPS 는 TLS 봉투로 내용을 암호화한 HTTP 다", "○○ 는 TLS 봉투로 내용을 암호화한 HTTP 다"],
    ["서버 상태는 남의 창고에서 가져온 복사본이라 갱신이 관건", "○○는 남의 창고에서 가져온 복사본이라 갱신이 관건"],
    // 주제어가 아닌 "~은/는" (형용사·동사형, 그냥 대조 명사)은 건드리면 안 된다
    ["멱등성은 같은 요청을 여러 번 보내도 결과가 같은 성질", "○○은 같은 요청을 여러 번 보내도 결과가 같은 성질"],
    ["비트는 가장 작은 정보 단위고 바이트는 비트 여덟 개", "○○는 가장 작은 정보 단위고 ○○는 비트 여덟 개"],
    ["좋은 이름 짓기가 가장 싸고 빠른 유지보수 수단이다", "좋은 이름 짓기가 가장 싸고 빠른 유지보수 수단이다"],
  ];
  for (const [src, want] of cases) assert.equal(hideTerms(src), want, `주제어 가리기: ${src}`);

  for (const q of QUESTIONS) {
    if (q.options || q.quizCode) continue;
    const s = summaryOf(q);
    const masked = hideTerms(s);
    // 가린 뒤에도 문장이 남아 있어야 한다 (○○ 만 덩그러니 남으면 보기로 못 쓴다)
    assert.ok(masked.replace(/○○|[은는]/g, "").trim().length >= 6, `가리고 나니 남는 게 없다: ${q.id} → ${masked}`);
    // 객관식 보기·짝 맞추기 설명은 보기 전용 문장(없으면 가린 요약)을 써야 한다
    const want = choiceTextOf(q);
    const choice = buildChoiceExercise(q);
    const mine = choice.choices.find((c) => c.correct)!;
    assert.equal(mine.text, want, `객관식 정답 보기는 보기 전용 문장이어야 한다: ${q.id}`);
    const match = buildMatchExercise(q);
    if (match) {
      const pair = match.pairs.find((p) => p.qid === q.id)!;
      assert.equal(pair.def, want, `짝 맞추기 설명은 보기 전용 문장이어야 한다: ${q.id}`);
    }
  }
  // 바로 그 문제: 정답 보기가 "셀렉트"를 그대로 드러내면 안 된다
  const sel = QUESTIONS.find((q) => q.id === "q-state-12")!;
  assert.ok(!hideTerms(summaryOf(sel)).includes("셀렉트"), "q-state-12 보기에 셀렉트가 남았다");
}

// ─── 보기 전용 문장 검수 ──────────────────────────────────
// 모든 문제에 보기 전용 문장이 있고, 그 문장에 질문 단어가 섞이지 않았는지.
// (사용자 제보: "왜 오버헤드인가?" → 보기 "…순수 오버헤드다" 처럼 어미만 달라도 답이 보였다)
{
  const PARTICLES = ["으로", "에서", "에게", "까지", "부터", "이란", "인가", "인지", "이고", "라고", "란", "와", "과", "은", "는", "이", "가", "을", "를", "의", "에", "로", "도", "만"];
  // 질문에 흔히 들어가는 '묻는 말' — 이게 보기에 있어도 정답이 새지는 않는다
  const STOP = new Set(["무엇", "무슨", "어떤", "어떻게", "언제", "각각", "차이", "이유", "관계", "핵심", "실용적", "다른", "같은", "하나", "가장", "정확히", "대충", "요즘", "아직", "많이", "필요", "방법", "기준", "종류", "역할", "의미", "효과", "의도", "문제", "사용", "만드", "되나", "하나요", "쓰나", "나요", "있나", "그리고", "실제로", "일반", "기본", "다음", "코드"]);
  const stripP = (w: string) => {
    for (const p of PARTICLES) if (w.length > p.length + 1 && w.endsWith(p)) return w.slice(0, -p.length);
    return w;
  };
  const leaksOf = (question: string, text: string): string[] => {
    const hit = new Set<string>();
    const low = text.toLowerCase();
    for (const w of question.match(/[A-Za-z][A-Za-z0-9+#-]*/g) ?? [])
      if (w.length >= 2 && !["vs", "or", "of"].includes(w.toLowerCase()) && low.includes(w.toLowerCase())) hit.add(w);
    for (const run of question.match(/[가-힣]{2,}/g) ?? []) {
      const stem = stripP(run);
      if (stem.length >= 2 && !STOP.has(stem) && text.includes(stem)) hit.add(stem);
      // 어미만 다른 경우("오버헤드인가" ↔ "오버헤드다")를 잡으려고 세 글자 조각도 본다
      for (let i = 0; i + 3 <= run.length; i++) {
        const g = run.slice(i, i + 3);
        if (!STOP.has(g) && text.includes(g)) hit.add(g);
      }
    }
    return [...hit];
  };
  const bad: string[] = [];
  for (const q of QUESTIONS) {
    if (q.options || q.quizCode) continue;
    assert.ok(CHOICE_TEXTS[q.id], `보기 전용 문장(choiceTexts.ts)이 없다: ${q.id}`);
    const l = leaksOf(q.question, CHOICE_TEXTS[q.id]);
    if (l.length) bad.push(`${q.id} [${l.join(",")}] ${CHOICE_TEXTS[q.id]}`);
  }
  assert.equal(bad.length, 0, `보기 문장에 질문 단어가 섞였다:\n${bad.join("\n")}`);
  for (const id of Object.keys(CHOICE_TEXTS))
    assert.ok(QUESTIONS.some((q) => q.id === id), `choiceTexts.ts 에 없는 문제 id: ${id}`);
}

console.log("✅ exercise 자체 점검 통과");
{
  const lens = Object.values(SUMMARIES).map((s) => s.length).sort((a, b) => a - b);
  const blanks = QUESTIONS.filter((q) => buildBlankExercise(q)).length;
  const typings = QUESTIONS.filter((q) => buildTypingExercise(q)).length;
  console.log(
    `   요약 ${lens.length}개 · 길이 ${lens[0]}~${lens[lens.length - 1]}자` +
      ` · 빈칸 출제 가능 ${blanks}개 · 타이핑 출제 가능 ${typings}개`
  );
  const covered = QUESTIONS.filter((q) => OX_FALSE[q.id]).length;
  console.log(
    `   OX 거짓 문장 직접 작성 ${covered}/${QUESTIONS.length}개` +
      ` (나머지 ${QUESTIONS.length - covered}개는 같은 카테고리 요약으로 폴백)`
  );
}
