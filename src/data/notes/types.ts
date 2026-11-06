// =============================================================
// 공부노트 데이터 모양
// - 노트 본문을 마크다운 문자열이 아니라 "블록 배열"로 적는다.
//   레고 블록처럼 제목·문단·코드·표를 한 칸씩 쌓는 방식이라,
//   마크다운 파서(새 의존성) 없이 switch 하나로 그릴 수 있다.
// - 묶음 구조: 과목(NoteSubject) > 단원(NoteUnit) > 노트(Note) > 블록(NoteBlock).
// =============================================================

// 인포그래픽용: key(핵심 한 줄)·compare(나란히 카드)·list style(flow 단계도 / check 요약)·code.out·figure(그림).
// 순서는 flow, 대조·종류 나열은 compare, 속성 비교는 table — 문단(p)은 최후의 수단.
// 모든 문자열 필드에서 인라인 `코드` 지원.
export type NoteBlock =
  // 렌더러가 노트 안 h2 순서대로 1·2·3 번호 배지를 붙인다.
  | { type: "h2"; text: string }
  // 인라인 `코드`만 지원 — 렌더러가 text.split("`") 로 쪼개 홀수 조각을 <code> 로 그린다.
  | { type: "p"; text: string }
  // out: 실행 결과 — 코드 아래 "결과" 패널로 따로 그린다.
  | { type: "code"; code: string; out?: string }
  // style: flow = 번호 박스를 ↓ 로 잇는 단계도, check = 맨 끝 "이것만 기억" 체크리스트
  | { type: "list"; items: string[]; ordered?: boolean; style?: "flow" | "check" }
  // 🎈비유 / ⚠️실수 / 📝내 메모
  | { type: "tip"; kind: "analogy" | "warn" | "memo"; text: string }
  | { type: "table"; head: string[]; rows: string[][] }
  // 핵심 한 줄 — 노트 맨 위 큰 카드
  | { type: "key"; text: string }
  // 나란히 카드 — 2개 이상이면 2열. good=초록(O), bad=빨강(X), 없으면 회색(종류 나열용)
  | { type: "compare"; cols: { title: string; tone?: "good" | "bad"; items: string[] }[] }
  // 그림 — 화이트보드 손그림 도식 (NoteFigure.tsx). 글로 설명하던 구조를 그림 한 장으로.
  | FigureBlock;

/** 마커 색 — 검정(기본)·빨강(강조·틀림)·파랑(보조)·초록(정답·결과) */
export type Ink = "ink" | "red" | "blue" | "green";

/** 그림 속 상자 하나: 이모지 아이콘 + 이름 + (작은 설명) */
export interface FigNode {
  icon: string;
  label: string;
  sub?: string;
  ink?: Ink;
}

export type Figure =
  // 흐름도: 상자를 화살표로 잇는다. 3개 이하면 가로, 넘으면 세로. edges[i] 는 i→i+1 화살표 위 글자.
  | { kind: "flow"; nodes: FigNode[]; edges?: string[] }
  // 순환도: 3~5개 상자가 원을 따라 시계방향으로 돈다 (마지막 → 처음으로 되돌아옴).
  | { kind: "cycle"; nodes: FigNode[] }
  // 갈래도: 위 하나에서 아래 2~4갈래로. leaves 는 갈래 밑에 달리는 작은 항목.
  | { kind: "tree"; root: FigNode; children: (FigNode & { leaves?: string[] })[] }
  // 층 쌓기: 위→아래 층. nested 면 상자 안 상자(첫 번째가 가장 바깥).
  | { kind: "stack"; layers: FigNode[]; nested?: boolean }
  // 가리키기: 왼쪽 이름표(변수)가 오른쪽 상자(객체)를 화살표로 가리킨다. to = objs 의 번호(0부터).
  | { kind: "refs"; vars: { name: string; to: number }[]; objs: FigNode[] };

export type FigureBlock = { type: "figure"; caption?: string } & Figure;

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
