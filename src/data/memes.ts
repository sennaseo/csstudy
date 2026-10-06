/**
 * 홈 화면 밈 문구·이미지 슬롯 데이터.
 *
 * 왜 컴포넌트가 아니라 데이터 파일인가?
 * - 대사를 바꾸거나 밈 이미지를 교체할 때 컴포넌트 코드를 건드리지 않게 하려고.
 *   (문구는 이 파일, 이미지는 MEME_IMAGES 한 곳만 고치면 된다)
 *
 * 왜 "날짜 시드 결정적 랜덤"인가?
 * - 새로고침할 때마다 문구가 바뀌면 "오늘의 ~" 가 아니다. 같은 날·같은 상태면 문구가 고정되고,
 *   날짜나 상태(mood)가 바뀔 때만 바뀐다. (seedOf 가 날짜 문자열을 숫자로 바꿔준다)
 *
 * 문구 규칙: 죄책감을 주는 말(연속 기록이 중단됐다, 며칠 안 왔다 등)은 절대 쓰지 않는다.
 * 이 파일은 store 를 import 하지 않는다 (순환 import 방지) — 목표 개수도 인자로 받는다.
 */

export type QuestMood = "idle" | "progress" | "done" | "night";

/** 문자열 → 숫자 해시. QuestionCard.pickLine 과 같은 방식 (같은 입력이면 항상 같은 값). */
export function seedOf(s: string): number {
  let h = 0;
  for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) % 9973;
  return h;
}

/** 시드 문자열로 배열에서 하나를 고른다 (결정적). */
export function pickBySeed<T>(arr: readonly T[], seed: string): T {
  return arr[seedOf(seed) % arr.length];
}

/** 퀘스트 카드 말풍선 상태. night(23~04시, 미완료) > done > progress > idle. */
export function questMood(count: number, now: Date, goal = 5): QuestMood {
  const h = now.getHours();
  if ((h >= 23 || h < 5) && count < goal) return "night";
  if (count >= goal) return "done";
  if (count > 0) return "progress";
  return "idle";
}

const QUEST_LINES: Record<QuestMood, readonly string[]> = {
  idle: [
    "오늘도 공부 안 하려고?",
    "오셨습니까.",
    "공부하기 싫죠? 저도 싫어요.",
    "5개가 뭐 어렵다고.",
    "이것만 하고 유튜브 가자.",
    "한 문제만 합시다. 진짜로.",
    "5개만 한다며.",
    "이거 하고 놀러 가세요.",
    "PR 리뷰 기다리는 동안 딱 5개.",
    "빌드 돌아가는 동안 5개 각이다.",
    "오늘의 5문제는 세미콜론만큼 작아요.",
    "스크롤 내리기 전에 여기 먼저.",
  ],
  progress: [
    "{left}개 남았다. 여기서 멈추면 아깝지.",
    "한 문제만 더. 진짜 한 문제만.",
    "{left}개면 커피 식기 전에 끝남.",
    "지금이야. 흐름 끊기지 마.",
    "여기까지 왔으면 끝까지 가야지.",
    "{left}개 남음. 버디가 보고 있다.",
    "거의 다 왔다. 로딩 99%.",
    "어 벌써 {done}개? 생각보다 잘하네.",
    "{left}개만 더 하면 오늘 치 끝.",
    "커밋 전에 테스트 돌리듯, 이것도 끝까지.",
  ],
  done: [
    "오늘도 살아남으셨군요.",
    "이제 진짜 놀러 가세요.",
    "한 판 더? 말리진 않을게요.",
    "오늘 치 머지 완료. 수고.",
    "버디가 조금 자랐어요. 느껴지죠?",
    "내일도 5개. 약속은 아니고 제안.",
    "쉬어도 됩니다. 빌드 성공.",
    "오늘 할 만큼 했어요. 유튜브 가세요.",
    "5개 완료. 자존감 +1.",
    "더 풀면 XP는 계속 들어와요. 참고만.",
  ],
  night: [
    "내일의 나한테 넘기지 말자.",
    "자기 전 5개는 꿈에 안 나옵니다.",
    "이 시간에 켠 거면 진심이네.",
    "새벽 코딩보다 5문제가 건강해요.",
    "5개 풀고 알람 맞추고 자자.",
    "야식 대신 문제 5개 어때요.",
    "오늘은 아직 안 끝났다. 자정 전까진.",
    "눈 감기 전에 한 세트.",
  ],
};

/** 퀘스트 말풍선 한 문장. {left}=남은 수, {done}=푼 수 치환. */
export function questLine(
  mood: QuestMood,
  vars: { left: number; done: number },
  dateKey: string,
): string {
  return pickBySeed(QUEST_LINES[mood], dateKey + mood)
    .replace(/\{left\}/g, String(vars.left))
    .replace(/\{done\}/g, String(vars.done));
}

/** 퀘스트 카드 우상단 효과선 글자 (한 단어). */
export function questBurst(mood: QuestMood): string {
  return { idle: "오늘도?", progress: "지금이야!", done: "오 끝!", night: "졸려?" }[mood];
}

const BUDDY_LINES: readonly string[] = [
  "조금만 더 키워줘.",
  "XP 주세요. 배고파요.",
  "진화까지 {xp}밖에 안 남았대.",
  "오늘도 같이 가자.",
  "나 요즘 좀 큰 듯?",
  "다음 모습 궁금하지?",
  "문제 풀면 내가 커져요.",
  "도감에 아직 빈 칸 있던데.",
];

const BUDDY_LINES_MAX: readonly string[] = [
  "다 컸어요. 이제 자랑하고 다니세요.",
  "도감에 다른 친구도 있던데.",
  "최종 진화. 더는 안 커요. 마음만 커요.",
  "이제 내가 널 키울 차례.",
];

/** 버디 카드 손글씨 한마디. xpLeft = 다음 진화까지 XP (0 이하면 최종 진화). */
export function buddyLine(dateKey: string, xpLeft: number): string {
  if (xpLeft <= 0) return pickBySeed(BUDDY_LINES_MAX, dateKey + "bmax");
  return pickBySeed(BUDDY_LINES, dateKey + "b").replace(/\{xp\}/g, String(xpLeft));
}

const FORTUNES: readonly { text: string; concept: string }[] = [
  { text: "오늘은 코드가 한 번에 돌아갈 수도 있습니다.", concept: "useEffect" },
  { text: "오늘 쓴 console.log는 배포 전에 지워질 운명.", concept: "클로저" },
  { text: "머지 컨플릭트가 없는 하루가 될지도.", concept: "git rebase" },
  { text: "오늘은 캐시가 당신 편입니다.", concept: "HTTP 캐시" },
  { text: "null 체크 하나가 오늘을 구합니다.", concept: "옵셔널 체이닝" },
  { text: "리팩터링하고 싶은 충동이 옵니다. 참으세요.", concept: "단일 책임 원칙" },
  { text: "오늘의 버그는 어제의 내가 만들었습니다.", concept: "불변성" },
  { text: "테스트가 초록으로 끝나는 날.", concept: "멱등성" },
  { text: "오늘은 setTimeout 0의 날. 조금 미뤄도 괜찮아요.", concept: "이벤트 루프" },
  { text: "인덱스를 타는 쿼리처럼 빠른 하루.", concept: "B-Tree 인덱스" },
  { text: "스택이 넘치지 않는 하루.", concept: "재귀" },
  { text: "오늘은 DNS가 한 번에 잡힙니다.", concept: "DNS" },
];

const BUGS: readonly string[] = [
  "분명 세미콜론 하나였는데...",
  "내 컴퓨터에서는 됐는데요.",
  "로그 찍으니까 안 나는 버그.",
  "== 쓴 게 문제였다. 또.",
  "캐시 지웠더니 됐어요. 왜인지는 몰라요.",
  "타임존. 범인은 늘 타임존.",
  "undefined is not a function. 뭐가?",
  "주석 처리했더니 돌아감. 그 주석이 뭐였더라.",
  "무한 루프인 줄 알았는데 그냥 느린 거였다.",
  "off-by-one. 0부터 셌어야지.",
];

const QUOTES: readonly string[] = [
  "이 코드는 왜 되는지 설명할 수 있어야 합니다.",
  "동작하는 코드와 이해한 코드는 다릅니다.",
  "복붙한 코드도 내 코드입니다. 책임도.",
  "주석은 '왜'를 적는 곳. '뭘'은 코드가 말해요.",
  "안 읽는 문서는 없는 문서입니다.",
  "테스트 없는 리팩터링은 모험입니다.",
  "오늘 외운 건 내일 잊고, 내일 다시 보면 남아요.",
  "면접관도 모르는 걸 물어보진 않아요. 보통은.",
  "지금 모르는 건 괜찮아요. 모른다는 걸 아는 게 시작.",
  "git blame 을 열었는데 내 이름이 나오는 날이 있습니다.",
];

export type DailyMeme =
  | { kind: "fortune"; text: string; concept: string }
  | { kind: "bug" | "quote"; text: string };

/** 오늘의 운세/버그/한마디. 5일 중 하루는 null (카드 자체가 안 뜬다 — 희소성). */
export function dailyMeme(dateKey: string): DailyMeme | null {
  if (seedOf(dateKey) % 5 === 0) return null;
  const kind = (["fortune", "fortune", "bug", "quote"] as const)[seedOf(dateKey + "k") % 4];
  if (kind === "fortune") return { kind, ...pickBySeed(FORTUNES, dateKey + "f") };
  if (kind === "bug") return { kind, text: pickBySeed(BUGS, dateKey + "g") };
  return { kind, text: pickBySeed(QUOTES, dateKey + "q") };
}

/**
 * 밈 이미지 슬롯. 문자열이면 <img>, null 이면 컴포넌트 폴백(로고 고양이).
 * 실제 밈 이미지로 바꾸려면 public/memes/ 에 넣고 경로만 적는다.
 * 웹 오프라인용 public/sw.js SHELL 에도 추가해야 한다.
 */
export const MEME_IMAGES: { quest: string | null; daily: string | null } = {
  quest: "logo-cat.png",
  daily: "logo-cat.png",
};

/** 홈 실무 카드의 작은 손글씨 양념. */
export const PRACTICE_LINE = "실전이지!";
