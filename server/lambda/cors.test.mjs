// CORS 허용 목록이 제대로 막고 제대로 여는지 확인하는 자체 점검.
// 실행: node server/lambda/cors.test.mjs   (통과하면 아무 말 없이 끝, 실패하면 터진다)
//
// AWS 없이 돌려야 하므로 DynamoDB 를 건드리지 않는 경로만 테스트한다:
//   - OPTIONS (preflight) → DB 접근 전에 응답
//   - 토큰 틀림 401       → DB 접근 전에 응답
// 이 둘만으로 "누가 통과하고 누가 막히는가"는 전부 검증된다.

import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

process.env.SYNC_TOKEN = "test-token";
process.env.TABLE_NAME = "test-table";

// index.mjs 는 AWS SDK 를 import 하는데, 그건 Lambda 런타임에만 있고 여기엔 없다.
// 테스트하려고 무거운 SDK 를 devDependency 로 설치하는 건 배보다 배꼽이 크다.
//
// 대신 소스를 텍스트로 읽어서 import 줄만 지우고, 가짜 DynamoDB 를 앞에 붙여
// data: URL 모듈로 불러온다. 우리가 검사할 CORS 로직은 SDK 를 안 쓰므로
// 이걸로 충분하다.
// ponytail: SDK 를 실제로 부르는 경로(GET/PUT 성공)는 이 방식으로 테스트 못 한다.
//           그 경로가 복잡해지면 그때 aws-sdk-client-mock 을 붙일 것.
const src = await readFile(new URL("./index.mjs", import.meta.url), "utf8");
const stubbed =
  `const DynamoDBClient = class {};
   const DynamoDBDocumentClient = { from: () => ({ send: async () => ({}) }) };
   const GetCommand = class {};
   const PutCommand = class {};\n` +
  src.replace(/^import[\s\S]*?from\s+"@aws-sdk\/[^"]+";\s*$/gm, "");

const { handler } = await import(
  "data:text/javascript;base64," + Buffer.from(stubbed).toString("base64")
);

const call = (origin, { method = "OPTIONS", token } = {}) =>
  handler({
    requestContext: { http: { method } },
    headers: {
      ...(origin ? { origin } : {}),
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
  });

const allowOf = (res) => res.headers["Access-Control-Allow-Origin"];

// ── 허용돼야 하는 주소 ──
for (const origin of [
  "https://sennaseo.github.io",
  "http://localhost:5173",
  "http://localhost:4173",
]) {
  const res = await call(origin);
  assert.equal(allowOf(res), origin, `허용 목록에 있는데 막힘: ${origin}`);
}

// ── 막혀야 하는 주소 ──
for (const origin of [
  "https://evil.example.com",
  "http://sennaseo.github.io", // http — 프로토콜이 다르면 다른 Origin 이다
  "https://sennaseo.github.io.evil.com", // 접두사만 같은 사칭 도메인
  "https://sennaseo.github.io/", // 끝 슬래시 — 브라우저는 이렇게 안 보낸다
]) {
  const res = await call(origin);
  assert.equal(allowOf(res), undefined, `막혀야 하는데 허용됨: ${origin}`);
}

// Origin 헤더가 아예 없는 요청(curl 등)도 허용 헤더가 나가면 안 된다.
assert.equal(allowOf(await call(undefined)), undefined, "Origin 없는 요청이 허용됨");

// 401 응답에도 CORS 헤더가 붙어야 한다.
// 안 붙으면 브라우저가 응답을 가려버려서, 앱이 "토큰 틀림"을 못 읽고
// 정체불명의 네트워크 오류로만 보이게 된다.
const unauth = await call("https://sennaseo.github.io", {
  method: "GET",
  token: "wrong-token",
});
assert.equal(unauth.statusCode, 401);
assert.equal(allowOf(unauth), "https://sennaseo.github.io", "401 에 CORS 헤더 없음");

// 캐시가 A사이트 응답을 B사이트에 재사용하지 않도록 Vary 가 항상 붙어야 한다.
assert.equal((await call("https://evil.example.com")).headers.Vary, "Origin");

console.log("✅ CORS 점검 통과 — 허용 3곳, 차단 5가지 경우");
