// 공부노트 과목 목록 — 과목이 늘면 여기에 한 줄씩 추가한다(책장에 책 꽂기).
import { FRONTEND } from "./frontend";
import { JAVA } from "./java";
import { PYTHON } from "./python";
import type { NoteSubject } from "./types";

export const NOTE_SUBJECTS: NoteSubject[] = [PYTHON, JAVA, FRONTEND];
