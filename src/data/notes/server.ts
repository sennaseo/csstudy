// =============================================================
// 공부노트 — WAS·DB
//
// 작성 규칙은 python.ts 상단 주석과 같다 (기준 샘플 python/py-2.ts 의 n-py-2-1).
// id  : "n-sv-<unit번호>-<번호>" — unit sv-1 의 첫 노트면 n-sv-1-1.
// 웹 서버·WAS·DB 가 어떻게 이어지는지, 입문자가 처음 막히는 순서대로 적었다.
// 같은 내용의 초급 문제는 questions.ts 의 q-cs-21 ~ q-cs-30.
// =============================================================

import type { NoteSubject } from "./types";
import { SV1 } from "./server/sv-1";
import { SV2 } from "./server/sv-2";

export const SERVER: NoteSubject = {
  id: "server",
  emoji: "🗄️",
  title: "WAS·DB",
  units: [SV1, SV2],
};
