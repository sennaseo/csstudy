// =============================================================
// csStudy 동기화 백엔드 — AWS Lambda 함수 (전체 코드)
//
// 하는 일 (딱 2가지):
//   GET  /  → DynamoDB 에 저장된 진행상황 JSON 을 내려준다
//   PUT  /  → 요청 body 의 JSON 을 DynamoDB 에 저장한다
//
// 보안: Authorization 헤더의 토큰이 환경변수 SYNC_TOKEN 과 같아야만 동작.
// (개인용 앱이라 로그인 시스템 대신 "비밀번호 하나"로 지키는 방식)
//
// 필요한 환경변수:
//   TABLE_NAME  = DynamoDB 테이블 이름 (예: csstudy)
//   SYNC_TOKEN  = 내가 정한 비밀 토큰 (예: 아무 긴 랜덤 문자열)
//   ALLOWED_ORIGINS = (선택) 허용할 사이트 주소 목록, 쉼표로 구분.
//                     안 넣으면 아래 DEFAULT_ORIGINS 를 쓴다.
//
// 이 코드는 Lambda 콘솔에 그대로 붙여넣으면 된다.
// AWS SDK v3 는 Lambda Node.js 런타임에 기본 포함이라 npm install 불필요.
// =============================================================

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";

const client = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const TABLE = process.env.TABLE_NAME;
const TOKEN = process.env.SYNC_TOKEN;

// ─── CORS: 어느 사이트가 이 API 를 부를 수 있나 ────────────────
//
// 예전엔 "*" — 즉 세상 모든 사이트에 허용이었다.
// 토큰이 있어서 데이터가 새진 않지만, 아무 웹페이지나 이 API 를 두드려볼 수 있는 건
// 굳이 열어둘 이유가 없는 문이다. 그래서 내 앱 주소로만 좁힌다.
//
// 왜 목록(배열)인가? 실제로 앱이 뜨는 주소가 두 종류라서 —
//   1) 배포된 진짜 앱 (GitHub Pages)
//   2) 내 컴퓨터에서 개발 중일 때 (vite dev/preview 서버)
// 하나만 허용하면 개발할 때 동기화가 안 돼서 불편해진다.
//
// ⚠️ Origin 은 "주소의 앞부분"만이다 — 프로토콜+도메인+포트까지.
//    경로(/csstudy/)는 Origin 에 안 들어가므로 여기 적으면 안 된다.
//    끝에 슬래시(/)도 붙이면 안 된다.
const DEFAULT_ORIGINS = [
  "https://sennaseo.github.io", // 배포된 앱 (GitHub Pages)
  "http://localhost:5173", // vite dev
  "http://localhost:4173", // vite preview
];

// 환경변수로 덮어쓸 수 있게 해둔다 (커스텀 도메인을 붙이거나 할 때 코드 수정 없이).
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS ?? "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const ORIGINS = ALLOWED_ORIGINS.length ? ALLOWED_ORIGINS : DEFAULT_ORIGINS;

// 요청을 보낸 사이트가 목록에 있으면 "너는 허락됨"이라고 그 주소를 그대로 돌려준다.
// 목록에 없으면 Allow-Origin 헤더를 아예 안 보낸다 → 브라우저가 응답을 막는다.
//
// Vary: Origin 이 왜 필요한가:
// 같은 URL 인데 요청자에 따라 응답 헤더가 달라지므로, 중간 캐시가
// "A사이트용 응답"을 B사이트에게 재사용하면 안 된다고 알려주는 표시다.
const corsHeaders = (origin) => {
  const headers = {
    Vary: "Origin",
    "Access-Control-Allow-Methods": "GET,PUT,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
  };
  if (origin && ORIGINS.includes(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }
  return headers;
};

const json = (statusCode, body, origin) => ({
  statusCode,
  headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
  body: JSON.stringify(body),
});

export const handler = async (event) => {
  const method = event.requestContext?.http?.method ?? "GET";
  // 브라우저는 요청을 보낼 때 "나 이 사이트에서 왔어"를 Origin 헤더에 담아 보낸다.
  // 헤더 이름의 대소문자는 보장되지 않으므로 둘 다 확인한다.
  const origin = event.headers?.origin ?? event.headers?.Origin ?? "";

  // 브라우저가 본 요청 전에 보내는 "사전 확인(preflight)".
  // 허용 목록에 없는 사이트면 Allow-Origin 헤더가 안 나가고, 브라우저가 여기서 차단한다.
  if (method === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders(origin) };
  }

  // ── 토큰 검사 ──
  const auth = event.headers?.authorization ?? event.headers?.Authorization ?? "";
  if (!TOKEN || auth !== `Bearer ${TOKEN}`) {
    return json(401, { error: "unauthorized" }, origin);
  }

  try {
    if (method === "GET") {
      const res = await client.send(
        new GetCommand({ TableName: TABLE, Key: { pk: "state" } })
      );
      return json(
        200,
        {
          data: res.Item?.data ?? null,
          updatedAt: res.Item?.updatedAt ?? null,
        },
        origin
      );
    }

    if (method === "PUT") {
      const data = JSON.parse(event.body ?? "{}");
      await client.send(
        new PutCommand({
          TableName: TABLE,
          Item: { pk: "state", data, updatedAt: Date.now() },
        })
      );
      return json(200, { ok: true }, origin);
    }

    return json(405, { error: "method not allowed" }, origin);
  } catch (err) {
    console.error(err);
    return json(500, { error: "server error" }, origin);
  }
};
