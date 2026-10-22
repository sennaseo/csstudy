// =============================================================
// 공부노트 — 파이썬
//
// 노트 작성 규칙 — 글 벽 대신 인포그래픽. 기준 샘플은 python/py-2.ts 의 n-py-2-1.
//   ① summary : 한 줄 요약, 60자 이내 (목록 행에 그대로 보인다)
//   ② key     : 맨 위 핵심 한 줄
//   ③ h2 ≤ 5개 : 순서는 list style "flow", 대조·종류는 compare, 속성 비교는 table,
//                실행 결과는 code.out. 문단(p)은 2문장 이하, 최후의 수단.
//   ④ 끝은 list style "check" 2~3개 ("이것만 기억")
//   비유·⚠️실수 tip 은 도움될 때만 — 모든 노트를 같은 틀로 찍지 않는다.
//
// 문체: 짧게, 한 문장 한 정보. "~것이다", "즉,", 장식 대시 같은 AI 말투 금지.
// id  : "n-py-<unit번호>-<번호>" — unit py-2 의 첫 노트면 n-py-2-1.
//       notes.test.ts 가 형식·유일성·소속 unit 번호를 검사한다.
//
// 단원(노션 페이지 1개)마다 python/py-N.ts 파일 하나 — 여러 사람이 동시에 써도 안 부딪히게 나눴다.
// OT(py-1)는 일과 시간표 슬라이드 1장뿐이라 노트로 만들지 않았다 — 그래서 단원 번호가 py-2 부터 시작한다(노션 페이지 순번 유지).
// =============================================================

import type { NoteSubject } from "./types";
import { PY2 } from "./python/py-2";
import { PY3 } from "./python/py-3";
import { PY4 } from "./python/py-4";
import { PY5 } from "./python/py-5";
import { PY6 } from "./python/py-6";
import { PY7 } from "./python/py-7";
import { PY8 } from "./python/py-8";
import { PY9 } from "./python/py-9";

export const PYTHON: NoteSubject = {
  id: "python",
  emoji: "🐍",
  title: "파이썬",
  units: [PY2, PY3, PY4, PY5, PY6, PY7, PY8, PY9],
};
