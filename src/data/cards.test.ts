// =============================================================
// 단어장 카드 자체 점검 (assert 만 쓰는 최소 테스트 — 프레임워크 없음)
//
// 실행: npx tsx src/data/cards.test.ts
//
// 카드는 순수 상수 배열이라 tsc 가 모양은 잡아준다.
// 여기서 잡는 건 tsc 가 못 보는 "사람이 지켜야 하는 약속" 4가지:
//   1) id 가 유일하다 (React key + 나중에 진행도 키로 쓸 것).
//   2) term 이 유일하다 (같은 개념을 도메인만 바꿔 중복 등록하는 사고 방지).
//   3) oneLiner 는 "~다."로 끝나는 한 문장이다 (단어장 톤이 무너지면 문제집이 된다).
//   4) domain 값이 CARD_DOMAINS 안에 있다 (필터 칩에서 사라지는 유령 카드 방지).
// =============================================================

import assert from "node:assert/strict";
import { CARDS, CARD_DOMAINS, CARD_DOMAIN_EMOJI } from "./cards";

// 1) id 유일
{
  const seen = new Set<string>();
  for (const c of CARDS) {
    assert.ok(!seen.has(c.id), `id 가 중복이다: ${c.id}`);
    seen.add(c.id);
  }
}

// 2) term 유일
{
  const seen = new Map<string, string>();
  for (const c of CARDS) {
    const prev = seen.get(c.term);
    assert.ok(prev === undefined, `term 이 중복이다: "${c.term}" (${prev} ↔ ${c.id})`);
    seen.set(c.term, c.id);
  }
}

// 3) oneLiner 는 '~다.' 로 끝나는 한 문장 + 너무 길지 않게
for (const c of CARDS) {
  assert.ok(
    c.oneLiner.endsWith("다."),
    `oneLiner 는 '~다.' 로 끝나야 한다: ${c.id} → "${c.oneLiner}"`
  );
  assert.ok(
    c.oneLiner.length <= 45,
    `oneLiner 가 너무 길다(45자 초과): ${c.id} → ${c.oneLiner.length}자`
  );
  assert.ok(c.example.trim().length > 0, `example 이 비었다: ${c.id}`);
}

// 4) domain 은 필터 목록 안에 있어야 하고, 이모지가 정의돼 있어야 한다
{
  const known = new Set<string>(CARD_DOMAINS);
  for (const c of CARDS) {
    assert.ok(known.has(c.domain), `CARD_DOMAINS 에 없는 도메인이다: ${c.id} → ${c.domain}`);
    assert.ok(CARD_DOMAIN_EMOJI[c.domain], `이모지가 없는 도메인이다: ${c.domain}`);
  }
}

const byDomain = CARD_DOMAINS.map(
  (d) => `${d} ${CARDS.filter((c) => c.domain === d).length}`
).join(" · ");
console.log(`✅ 단어장 카드 ${CARDS.length}장 통과 — ${byDomain}`);
