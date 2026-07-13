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

// 브라우저가 다른 도메인(내 앱)에서 이 API 를 부를 수 있게 허용하는 헤더 (CORS)
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,PUT,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
};

const json = (statusCode, body) => ({
  statusCode,
  headers: { "Content-Type": "application/json", ...CORS },
  body: JSON.stringify(body),
});

export const handler = async (event) => {
  const method = event.requestContext?.http?.method ?? "GET";

  // 브라우저가 본 요청 전에 보내는 "사전 확인(preflight)" — 무조건 OK.
  if (method === "OPTIONS") {
    return { statusCode: 204, headers: CORS };
  }

  // ── 토큰 검사 ──
  const auth = event.headers?.authorization ?? event.headers?.Authorization ?? "";
  if (!TOKEN || auth !== `Bearer ${TOKEN}`) {
    return json(401, { error: "unauthorized" });
  }

  try {
    if (method === "GET") {
      const res = await client.send(
        new GetCommand({ TableName: TABLE, Key: { pk: "state" } })
      );
      return json(200, {
        data: res.Item?.data ?? null,
        updatedAt: res.Item?.updatedAt ?? null,
      });
    }

    if (method === "PUT") {
      const data = JSON.parse(event.body ?? "{}");
      await client.send(
        new PutCommand({
          TableName: TABLE,
          Item: { pk: "state", data, updatedAt: Date.now() },
        })
      );
      return json(200, { ok: true });
    }

    return json(405, { error: "method not allowed" });
  } catch (err) {
    console.error(err);
    return json(500, { error: "server error" });
  }
};
