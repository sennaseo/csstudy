// =============================================================
// 공부노트 — 프론트엔드 디자인 패턴
//
// 작성 규칙은 python.ts 상단 주석과 같다 (기준 샘플 python/py-2.ts 의 n-py-2-1).
// id  : "n-fe-<unit번호>-<번호>" — unit fe-1 의 첫 노트면 n-fe-1-1.
// 예제는 React + TypeScript 기준. out 이 있는 예제는 Node 로 실행한 결과다.
// =============================================================

import type { NoteSubject } from "./types";
import { FE1 } from "./frontend/fe-1";
import { FE2 } from "./frontend/fe-2";

export const FRONTEND: NoteSubject = {
  id: "frontend",
  emoji: "🎨",
  title: "프론트 패턴",
  units: [FE1, FE2],
};
