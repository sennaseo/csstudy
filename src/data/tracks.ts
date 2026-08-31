// =============================================================
// 트랙 (roadmap.sh 식 "역할별 로드맵")
//
// 설계 메모 (초보자용):
// - 지금까지 길(path)은 "카테고리 순서"대로 흘렀다. React → TS → 상태관리 → CS → ...
//   그런데 이건 목표가 없는 순서다. 신입 프론트엔드 개발자가 되고 싶은 사람에게
//   Java·SpringBoot 유닛이 길 한복판에 끼어 있으면 김이 샌다.
// - roadmap.sh 는 "프론트엔드 개발자", "백엔드 개발자" 처럼 **역할(role)** 로 길을 나눈다.
//   그 역할에 필요한 주제만, 기초 → 심화 순서로 늘어놓는다. 그걸 그대로 가져온 게 트랙이다.
//
// 트랙 = "이 순서로 이 유닛들만 푸세요" 라는 대본 한 장.
//   · 새 문제도, 새 언락 시스템도 만들지 않는다.
//   · 기존 lessonPath 의 노드를 **다른 순서로 다시 늘어놓기만** 한다.
//     (언락 로직이 '평평한 노드 배열에서 직전 노드를 봤는지'만 보기 때문에,
//      배열 순서를 트랙별로 바꿔주면 언락도 저절로 트랙을 따라간다.)
//   · 그래서 진행도 키(lesson-<카테고리>-<n>)는 그대로다 → 기존 학습 기록이 안 날아간다.
//     트랙을 바꿔도 이미 푼 레슨은 계속 완료 상태로 남는다.
//
// CS 를 쪼갠 이유:
//   CS 는 두 트랙 모두에게 필요하지만 양이 다르다. 프론트엔드는 네트워크/브라우저 쪽
//   기초(HTTPS·캐시·세션·DNS)면 충분하고, 백엔드는 프로세스·동시성·암호까지 다 필요하다.
//   그래서 카테고리를 새로 만들지 않고 "문제 id 를 골라 담는" 방식으로 나눈다.
// =============================================================

import type { Category } from "../types";

/** 트랙 id — 진행 상태 저장용 키라서 문자열을 함부로 바꾸지 말 것. */
export type TrackId = "frontend" | "backend";

/** 트랙 한 개를 이루는 한 칸(스텝) = 유닛 하나. */
export interface TrackStep {
  /** 어느 카테고리에서 문제를 가져오는지. */
  category: Category;
  /** 화면에 보일 유닛 이름 (카테고리 이름과 달라도 된다 — 예: "CS 기초"). */
  label: string;
  /**
   * 이 스텝에 쓸 문제 id 들. 생략하면 그 카테고리 전체를 쓴다.
   * → CS 처럼 한 카테고리를 두 스텝으로 쪼갤 때만 적어준다.
   */
  questionIds?: string[];
  /** 한 줄 설명 — 유닛 배너 밑에 뜬다. "왜 이걸 배우나"를 알려주는 칸. */
  blurb: string;
}

/** 트랙 = 역할 하나의 전체 로드맵. */
export interface Track {
  id: TrackId;
  /** 화면에 보일 이름. */
  name: string;
  emoji: string;
  /** 트랙 선택 화면에 뜨는 소개 문장. */
  description: string;
  steps: TrackStep[];
}

// CS 문제를 두 덩이로 나눈다 (id 를 직접 나열 — 문제를 추가하면 여기도 손봐야 한다).
//   기초: 웹 개발자면 직군 상관없이 아는 게 이득인 것 (HTTPS, 멱등성, TCP, 캐시, 세션, DNS)
//   심화: 서버를 직접 굴릴 때 필요한 것 (프로세스/스레드, 동기·비동기, 암호 알고리즘)
const CS_BASIC = ["q-cs-2", "q-cs-3", "q-cs-4", "q-cs-5", "q-cs-6", "q-cs-9", "q-cs-10"];
const CS_DEEP = [
  "q-cs-1",
  "q-cs-7",
  "q-cs-8",
  "q-cs-11",
  "q-cs-12",
  "q-cs-13",
  "q-cs-14",
  "q-cs-15",
  "q-cs-16",
];

/**
 * 트랙 정의.
 *
 * 순서 원칙 (roadmap.sh 를 따름):
 *   1) 공통 기초(웹이 어떻게 도는지)  →  2) 언어  →  3) 프레임워크  →  4) 심화/설계
 * 즉 "도구를 배우기 전에 도구가 놓인 바닥을 먼저 본다".
 */
export const TRACKS: Track[] = [
  {
    id: "frontend",
    name: "프론트엔드",
    emoji: "🎨",
    description: "웹 기초 → 타입스크립트 → React → 상태관리 → 기술면접. 화면을 만드는 사람의 길.",
    steps: [
      {
        category: "CS",
        label: "웹 기초",
        questionIds: CS_BASIC,
        blurb: "브라우저와 서버가 주고받는 법 — 모든 프론트엔드의 바닥",
      },
      {
        category: "TypeScript",
        label: "TypeScript",
        blurb: "React 를 쓰기 전에 언어부터 — 타입이 잡아주는 실수들",
      },
      {
        category: "React",
        label: "React",
        blurb: "화면을 조각(컴포넌트)으로 나눠 만드는 법",
      },
      {
        category: "상태관리",
        label: "상태관리",
        blurb: "화면이 커지면 진짜 어려워지는 것 — 데이터를 어디에 둘까",
      },
      {
        category: "기술면접",
        label: "기술면접",
        blurb: "내가 쓴 기술을 내 말로 설명하기 — 면접장에 들어가는 건 프로젝트가 아니라 나다",
      },
    ],
  },
  {
    id: "backend",
    name: "백엔드",
    emoji: "⚙️",
    description:
      "웹 기초 → CS 심화 → 운영체제·네트워크·DB·자료구조 → Java → SpringBoot → 구조설계 → 기술면접. 서버를 만드는 사람의 길.",
    steps: [
      {
        category: "CS",
        label: "웹 기초",
        questionIds: CS_BASIC,
        blurb: "요청이 서버까지 오는 길 — 여기서부터 시작",
      },
      {
        category: "CS",
        label: "CS 심화",
        questionIds: CS_DEEP,
        blurb: "프로세스·동시성·암호 — 서버를 직접 굴리면 반드시 만난다",
      },
      {
        category: "운영체제",
        label: "운영체제",
        blurb: "프로세스·스레드·메모리 — 면접 단골 1순위",
      },
      {
        category: "네트워크",
        label: "네트워크",
        blurb: "OSI 7계층부터 TCP·HTTP 까지, 요청이 흐르는 전 구간",
      },
      {
        category: "데이터베이스",
        label: "데이터베이스",
        blurb: "정규화·인덱스·트랜잭션 — 서버 개발자의 본진",
      },
      {
        category: "자료구조",
        label: "자료구조",
        blurb: "배열부터 B-Tree 까지, 코딩테스트와 면접의 공통 바닥",
      },
      {
        category: "Java",
        label: "Java",
        blurb: "스프링을 쓰기 전에 언어부터",
      },
      {
        category: "SpringBoot",
        label: "SpringBoot",
        blurb: "자바로 서버를 짓는 가장 흔한 방법",
      },
      {
        category: "구조설계",
        label: "구조설계",
        blurb: "돌아가는 코드에서 오래 가는 코드로",
      },
      {
        category: "기술면접",
        label: "기술면접",
        blurb: "내가 쓴 기술을 내 말로 설명하기 — 면접장에 들어가는 건 프로젝트가 아니라 나다",
      },
    ],
  },
];

/** id → 트랙 빠른 조회. */
export const TRACK_BY_ID: Record<TrackId, Track> = Object.fromEntries(
  TRACKS.map((t) => [t.id, t])
) as Record<TrackId, Track>;
