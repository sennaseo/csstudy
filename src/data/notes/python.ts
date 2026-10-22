// =============================================================
// 공부노트 — 파이썬
//
// 노트 작성 규칙 (새 노트를 채울 때 이 순서를 지킨다)
//   ① summary   : 한 줄 요약, 60자 이내 (목록 행에 그대로 보인다)
//   ② tip/analogy : 비유를 먼저 — "이게 뭐랑 닮았나"로 문을 연다
//   ③ h2 핵심 개념 1~3개 : 각 h2 아래 p · list · code 로 설명
//   ④ tip/warn  : 자주 하는 실수
//   ⑤ h2 "3줄 정리" + list 3개
//
// 분량: 노트 1장 = 폰에서 5분. 블록 10~15개, 코드 블록은 3개 이하.
// 문체: 비유 → 쉬운 말 → 전문용어(괄호) 순서. 예) "이름표를 붙인다(할당)".
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
