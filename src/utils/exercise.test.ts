// =============================================================
// exercise 자체 점검 (assert 만 쓰는 최소 테스트 — 프레임워크 없음)
//
// 실행: npx tsx src/utils/exercise.test.ts
//
// 여기서 지키려는 약속:
//   1) 빈칸/타이핑 정답이 '사전에 실릴 법한 단어'다 — 조사·어미·괄호·등호가 붙어 있지 않다.
//   2) 요약(SUMMARIES)이 읽어서 개념이 파악되는 문장이다 — 길이 범위 안, 중복 없음.
//   3) 적당한 키워드가 없으면 억지로 뚫지 않고 null 을 돌려준다 (호출부가 객관식으로 폴백).
//   4) OX 의 거짓 문장은 같은 카테고리에서만 온다 (엉뚱한 과목이 뜨면 문제가 성립 안 함).
// =============================================================

import assert from "node:assert/strict";
import { QUESTIONS, SUMMARIES } from "../data/questions";
import {
  keywordOf,
  summaryOf,
  buildBlankExercise,
  buildTypingExercise,
  buildOxExercise,
} from "./exercise";

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

// 4) OX 의 거짓 문장은 같은 카테고리에서만 온다.
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
      const cats = CATEGORIES_BY_SUMMARY.get(ox.statement);
      assert.ok(
        cats?.has(CATEGORY_OF.get(q.id)!),
        `OX 거짓 문장이 다른 카테고리에서 왔다: ${q.id}(${q.category}) → "${ox.statement}"`
      );
    }
  }
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
}
