// =============================================================
// 공부노트 데이터 모양
// - 노트 본문을 마크다운 문자열이 아니라 "블록 배열"로 적는다.
//   레고 블록처럼 제목·문단·코드·표를 한 칸씩 쌓는 방식이라,
//   마크다운 파서(새 의존성) 없이 switch 하나로 그릴 수 있다.
// - 묶음 구조: 과목(NoteSubject) > 단원(NoteUnit) > 노트(Note) > 블록(NoteBlock).
// =============================================================

export type NoteBlock =
  | { type: "h2"; text: string }
  // 인라인 `코드`만 지원 — 렌더러가 text.split("`") 로 쪼개 홀수 조각을 <code> 로 그린다.
  | { type: "p"; text: string }
  | { type: "code"; code: string }
  // items 에도 인라인 `코드` 지원
  | { type: "list"; items: string[]; ordered?: boolean }
  // 🎈비유 / ⚠️실수 / 📝내 메모
  | { type: "tip"; kind: "analogy" | "warn" | "memo"; text: string }
  | { type: "table"; head: string[]; rows: string[][] };

export interface Note {
  /** "n-py-<unit번호>-<번호>" 예: n-py-2-1 */
  id: string;
  emoji: string;
  title: string;
  /** 한 줄, 60자 이내 — 목록 행에 그대로 보인다 */
  summary: string;
  blocks: NoteBlock[];
}

export interface NoteUnit {
  id: string;
  title: string;
  notes: Note[];
}

export interface NoteSubject {
  id: string;
  emoji: string;
  title: string;
  units: NoteUnit[];
}
