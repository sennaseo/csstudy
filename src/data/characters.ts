// =============================================================
// 캐릭터(버디) 데이터 — 12종 동물, 3단계 진화
// - 희귀도: common 4 / rare 4 / legendary 4
// - art 는 줄(line) 배열 — 백슬래시 이스케이프 사고를 피하려고
//   템플릿 리터럴 대신 배열을 쓰고, 컴포넌트에서 join("\n") 한다.
// - XP 는 문제를 풀 때마다 쌓이고, 일정량을 넘으면 진화한다.
// =============================================================

import type { Rarity } from "../types";

export interface BuddyStage {
  /** 단계 이름 — 진화할수록 멋있어진다 */
  title: string;
  /** 아스키/카오모지 아트 (줄 배열) */
  art: string[];
}

export interface BuddyCharacter {
  id: string;
  /** 종족 이름 */
  name: string;
  rarity: Rarity;
  /** 한 줄 소개 — 도감에 노출 */
  desc: string;
  /** 진화 3단계 (index 0 = 1단계) */
  stages: [BuddyStage, BuddyStage, BuddyStage];
}

/** 단계별 필요 XP — stage2 는 50, stage3 는 150 부터. */
export const STAGE_XP = [0, 50, 150] as const;

/** xp → 현재 단계 (1~3) */
export function stageOf(xp: number): 1 | 2 | 3 {
  if (xp >= STAGE_XP[2]) return 3;
  if (xp >= STAGE_XP[1]) return 2;
  return 1;
}

/** 다음 단계까지 진행률 0~100. 최종 단계면 100. */
export function stageProgress(xp: number): number {
  const stage = stageOf(xp);
  if (stage === 3) return 100;
  const from = STAGE_XP[stage - 1];
  const to = STAGE_XP[stage];
  return Math.min(Math.round(((xp - from) / (to - from)) * 100), 100);
}

/** 희귀도 메타 — 뽑기 가중치와 표시 스타일 */
export const RARITY_INFO: Record<
  Rarity,
  { label: string; weight: number; badge: string; glow: string }
> = {
  common: {
    label: "커먼",
    weight: 70,
    badge: "bg-ink-100 text-ink-500",
    glow: "",
  },
  rare: {
    label: "레어",
    weight: 25,
    badge: "bg-accent-soft text-accent-dim",
    // 스케치 컨셉엔 "빛나는 후광"이 없다 — 종이 위에선 펜으로 한 번 더 덧그은
    // 이중선이 곧 강조다. 그래서 blur 0 오프셋 그림자 + 같은 색 테두리로 바꿨다.
    glow: "border-2 border-accent shadow-[3px_3px_0_theme(colors.accent.DEFAULT)]",
  },
  legendary: {
    label: "레전드",
    weight: 5,
    badge: "bg-duo-bee/20 text-duo-bee-ink",
    // 레전드는 덧그은 선을 한 겹 더 두껍게 (4px) — 멀리서도 "얘가 제일 세다"가 읽힌다.
    glow: "border-2 border-duo-bee shadow-[4px_4px_0_theme(colors.duo.bee)]",
  },
};

export const CHARACTERS: BuddyCharacter[] = [
  // ─── 커먼 (4) ─────────────────────────────────────────
  {
    id: "chick",
    name: "병아리",
    rarity: "common",
    desc: "갓 부화한 공부 친구. 삐약삐약 응원해준다.",
    stages: [
      { title: "삐약이", art: ["(･ө･)"] },
      { title: "병아리", art: ["ヽ(･ө･)ノ", "  삐약!"] },
      { title: "꼬꼬대장", art: [" ♔", "ヽ(｀ө´)ノ", " 꼬끼오!"] },
    ],
  },
  {
    id: "cat",
    name: "고양이",
    rarity: "common",
    desc: "정답을 맞히면 골골송을 불러준다.",
    stages: [
      { title: "아기냥", art: ["(=･ω･=)"] },
      { title: "냥이", art: ["(=^･ω･^=)", "   냐옹~"] },
      { title: "대장냥", art: ["☆(=^･ω･^=)☆", "  완벽하다냥!"] },
    ],
  },
  {
    id: "dog",
    name: "강아지",
    rarity: "common",
    desc: "꾸준함의 상징. 매일 와도 매일 반겨준다.",
    stages: [
      { title: "댕댕이", art: ["U･ᴥ･U"] },
      { title: "멍이", art: ["U^ᴥ^U", " 멍멍!"] },
      { title: "충견대장", art: ["★U^ᴥ^U★", " 최고다멍!"] },
    ],
  },
  {
    id: "rabbit",
    name: "토끼",
    rarity: "common",
    desc: "문제를 풀 때마다 깡총 뛰며 좋아한다.",
    stages: [
      { title: "아기토끼", art: ["(•ㅅ•)"] },
      { title: "토토", art: ["／(•ㅅ•)＼", "  깡총!"] },
      { title: "달토끼", art: ["／(★ㅅ★)＼", " 달까지 깡총!"] },
    ],
  },

  // ─── 레어 (4) ─────────────────────────────────────────
  {
    id: "penguin",
    name: "펭귄",
    rarity: "rare",
    desc: "차가운 머리, 뜨거운 학구열.",
    stages: [
      { title: "아기펭", art: ["(•⊝•)"] },
      { title: "펭펭", art: ["<(•⊝•)>", "  뒤뚱뒤뚱"] },
      { title: "황제펭귄", art: [" ♚", "<(•⊝•)>", " 남극의 제왕"] },
    ],
  },
  {
    id: "fox",
    name: "여우",
    rarity: "rare",
    desc: "어려운 문제일수록 눈이 반짝인다.",
    stages: [
      { title: "아기여우", art: ["(•ㅊ•)"] },
      { title: "여우비", art: ["ᘛ•ㅊ•ᘚ", " 영리하지?"] },
      { title: "구미호", art: ["✦ᘛ•ㅊ•ᘚ✦", " 꼬리가 아홉!"] },
    ],
  },
  {
    id: "owl",
    name: "부엉이",
    rarity: "rare",
    desc: "지혜의 새. 밤 공부의 수호자.",
    stages: [
      { title: "아기부엉", art: ["(◉Θ◉)"] },
      { title: "부엉", art: ["{◉Θ◉}", " 부엉부엉"] },
      { title: "현자부엉", art: ["✧{◉Θ◉}✧", " 다 알고 있다"] },
    ],
  },
  {
    id: "turtle",
    name: "거북이",
    rarity: "rare",
    desc: "느려도 멈추지 않는다. 완벽보다 반복.",
    stages: [
      { title: "아기북", art: ["(°ｪ°)"] },
      { title: "거부기", art: ["⊂(°ｪ°)⊃", " 느긋느긋"] },
      { title: "현무", art: ["✦⊂(°ｪ°)⊃✦", " 천년의 지혜"] },
    ],
  },

  // ─── 레전드 (4) ──────────────────────────────────────
  {
    id: "dragon",
    name: "드래곤",
    rarity: "legendary",
    desc: "전설의 존재. 만나는 것만으로 행운.",
    stages: [
      { title: "아기용", art: ["(°△°)~"] },
      { title: "용", art: ["~(°△°)~", "  크앙!"] },
      { title: "전설의 용", art: ["≋≋(｀▽´)≋≋", " 하늘을 가른다"] },
    ],
  },
  {
    id: "unicorn",
    name: "유니콘",
    rarity: "legendary",
    desc: "노력하는 사람 앞에만 나타난다는 전설.",
    stages: [
      { title: "망아지", art: ["(´•ω•`)"] },
      { title: "유니", art: ["☆(´•ω•`)", "  반짝반짝"] },
      { title: "별의 유니콘", art: ["✧☆(´•ω•`)☆✧", " 별빛을 달린다"] },
    ],
  },
  {
    id: "phoenix",
    name: "불사조",
    rarity: "legendary",
    desc: "포기를 모르는 불꽃. 스트릭의 화신.",
    stages: [
      { title: "불씨", art: ["(･ө･)°"] },
      { title: "불새", art: ["♨(･ө･)♨", "  활활!"] },
      { title: "불사조", art: ["🔥ヽ(･ө･)ノ🔥", " 다시 타오른다"] },
    ],
  },
  {
    id: "whale",
    name: "고래",
    rarity: "legendary",
    desc: "지식의 바다를 헤엄치는 거대한 친구.",
    stages: [
      { title: "아기고래", art: ["(°‿°)〜"] },
      { title: "고래", art: ["ˁ˚ᴥ˚ˀ〜", "  뿌우~"] },
      { title: "대왕고래", art: ["✧ˁ˚ᴥ˚ˀ✧〜〜", " 바다를 품는다"] },
    ],
  },
];

/** id 로 캐릭터 찾기 — 없는 id 면 undefined. */
export function findCharacter(id: string): BuddyCharacter | undefined {
  return CHARACTERS.find((c) => c.id === id);
}
