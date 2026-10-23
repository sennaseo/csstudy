// =============================================================
// 공부노트 — 자바
//
// 작성 규칙은 python.ts 상단 주석과 같다 (기준 샘플 python/py-2.ts 의 n-py-2-1).
// id  : "n-jv-<unit번호>-<번호>" — unit jv-1 의 첫 노트면 n-jv-1-1.
// 단원 구성은 시중 자바 입문서(이것이 자바다·자바의 정석) 목차 흐름을 따른다.
// 예제 코드의 out 은 JDK 21 로 실제 실행한 결과다.
// =============================================================

import type { NoteSubject } from "./types";
import { JV1 } from "./java/jv-1";
import { JV2 } from "./java/jv-2";
import { JV3 } from "./java/jv-3";
import { JV4 } from "./java/jv-4";
import { JV5 } from "./java/jv-5";
import { JV6 } from "./java/jv-6";
import { JV7 } from "./java/jv-7";
import { JV8 } from "./java/jv-8";

export const JAVA: NoteSubject = {
  id: "java",
  emoji: "☕",
  title: "자바",
  units: [JV1, JV2, JV3, JV4, JV5, JV6, JV7, JV8],
};
