// =============================================================
// cards.ts → public/cards.json 내보내기 스크립트
//
// 실행: npm run export:cards  (내부적으로 npx tsx scripts/export-cards.mjs)
//
// 왜 정규식으로 안 긁고 이렇게 하나:
//   cards.ts 는 TS 소스라 정규식으로 파싱하면 문자열 안의 콤마·줄바꿈·따옴표
//   escape 하나만 어긋나도 조용히 카드가 깨진다. 그래서 "파싱"하지 않고
//   진짜로 모듈을 실행해서 CARDS 배열 값 자체를 받는다 — 안드로이드 위젯이
//   보는 JSON은 cards.ts 가 100% 그대로 진실이어야 하기 때문.
//   실행기는 tsx 를 쓴다. 새로 설치한 게 아니라 vite 가 이미 devDependency로
//   끌어온 걸 npx 로 재사용하는 것뿐이다 (package-lock.json 에 이미 있음,
//   src/data/cards.test.ts 도 같은 방식으로 CARDS 를 import 해서 돈다).
// =============================================================

import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { CARDS } from "../src/data/cards.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = join(__dirname, "..", "public", "cards.json");

// 자체 점검 — cards.test.ts 가 이미 id/term 중복, oneLiner 톤은 잡아주므로
// 여기선 "JSON으로 나가도 안전한가"만 최소로 다시 본다 (출력 직전 마지막 방어선).
assert.ok(CARDS.length > 0, "CARDS 가 비어있다 — cards.ts 를 확인해라");

const seenIds = new Set();
for (const c of CARDS) {
  assert.ok(!seenIds.has(c.id), `id 가 중복이다: ${c.id}`);
  seenIds.add(c.id);

  for (const field of ["id", "domain", "term", "oneLiner", "example"]) {
    assert.ok(
      typeof c[field] === "string" && c[field].trim().length > 0,
      `${field} 가 비어있다: ${c.id ?? "(id 없음)"}`
    );
  }
}

const payload = {
  version: 1,
  count: CARDS.length,
  cards: CARDS,
};

mkdirSync(dirname(outPath), { recursive: true });
// JSON.stringify 는 기본적으로 한글을 이스케이프하지 않는다(\uXXXX 로 깨지는 건
// JSON.stringify 가 아니라 대개 파일을 ASCII 로 잘못 쓸 때 생긴다) — 그래서
// 인코딩만 "utf8"로 명시해주면 충분하다.
writeFileSync(outPath, JSON.stringify(payload, null, 2) + "\n", "utf8");

console.log(`✅ ${outPath} 에 카드 ${CARDS.length}장 내보냄`);
