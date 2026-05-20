// =============================================================
// 문제 데이터 (하드코딩)
// - MVP 단계라 JSON 대신 .ts 로 둬서 타입 체크가 바로 걸리게 한다.
// - 추후 JSON / API / 마크다운 파싱으로 바꿔도 import 시그니처만 유지하면 된다.
// - id 는 "q-카테고리-순번" 으로 부여 → localStorage 키 충돌 방지.
// =============================================================

import type { Question } from "../types";

export const QUESTIONS: Question[] = [
  // ─── CS ────────────────────────────────────────────────
  {
    id: "q-cs-1",
    category: "CS",
    question: "프로세스와 스레드의 핵심 차이는?",
    answer:
      "프로세스는 독립된 메모리 공간을 가지고, 스레드는 같은 프로세스 내 메모리(힙)를 공유한다. 컨텍스트 스위칭 비용은 스레드가 더 싸다.",
  },
  {
    id: "q-cs-2",
    category: "CS",
    question: "HTTP 와 HTTPS 의 차이는?",
    answer:
      "HTTPS 는 TLS 위에서 동작하는 HTTP 다. 대칭/비대칭 키를 함께 써서 기밀성·무결성·서버 신원 검증을 보장한다.",
  },
  {
    id: "q-cs-3",
    category: "CS",
    question: "RESTful API 에서 멱등성(idempotency)이란?",
    answer:
      "같은 요청을 여러 번 보내도 결과 상태가 동일해야 한다는 성질. GET/PUT/DELETE 는 멱등, POST 는 일반적으로 비멱등.",
  },
  {
    id: "q-cs-4",
    category: "CS",
    question: "TCP 3-way handshake 의 SYN, SYN-ACK, ACK 의미는?",
    answer:
      "SYN: 연결 요청, SYN-ACK: 요청 수락 + 자기 쪽 연결 요청, ACK: 최종 확인. 양쪽 모두 시퀀스 번호를 교환해 신뢰성 있는 연결을 만든다.",
  },

  // ─── React ─────────────────────────────────────────────
  {
    id: "q-react-1",
    category: "React",
    question: "useEffect dependency array 역할은?",
    answer:
      "의존성 값 변경 시 effect 실행 여부를 제어한다. 빈 배열은 마운트 시 1회, 생략하면 매 렌더마다 실행된다.",
  },
  {
    id: "q-react-2",
    category: "React",
    question: "key prop 은 왜 필요한가?",
    answer:
      "React 가 리스트의 항목을 reconcile 할 때 동일성/변경을 식별하기 위한 단서. index 를 key 로 쓰면 정렬·삽입 시 상태가 어긋날 수 있다.",
  },
  {
    id: "q-react-3",
    category: "React",
    question: "useMemo 와 useCallback 의 차이는?",
    answer:
      "useMemo 는 '계산된 값' 을 메모이즈, useCallback 은 '함수 참조' 를 메모이즈. useCallback(fn, deps) === useMemo(() => fn, deps).",
  },
  {
    id: "q-react-4",
    category: "React",
    question: "Controlled vs Uncontrolled 컴포넌트?",
    answer:
      "Controlled 는 React state 가 값의 단일 출처(SSOT). Uncontrolled 는 DOM 이 출처이고 ref 로 접근한다. 폼은 보통 controlled 가 안전.",
  },

  // ─── TypeScript ────────────────────────────────────────
  {
    id: "q-ts-1",
    category: "TypeScript",
    question: "interface 와 type 의 실용적 차이는?",
    answer:
      "interface 는 선언 병합(declaration merging)과 extends 친화, type 은 유니온/인터섹션/매핑 등 표현력이 넓다. 라이브러리 공개 API 는 interface 가 무난.",
  },
  {
    id: "q-ts-2",
    category: "TypeScript",
    question: "unknown 과 any 의 차이는?",
    answer:
      "any 는 타입 검사를 사실상 끈다. unknown 은 '아직 모름' 이며 사용 전 narrowing(typeof, instanceof 등)이 강제된다 — 더 안전하다.",
  },
  {
    id: "q-ts-3",
    category: "TypeScript",
    question: "as const 의 효과는?",
    answer:
      "리터럴 타입으로 좁혀주고 객체/배열을 readonly 로 만든다. 상수 매핑, 유니온 추출(typeof obj[keyof typeof obj])에 자주 쓴다.",
  },
  {
    id: "q-ts-4",
    category: "TypeScript",
    question: "제네릭 제약(extends)을 쓰는 이유는?",
    answer:
      "제네릭 매개변수의 형태를 보장해 함수 내부에서 안전하게 프로퍼티에 접근하기 위해. 예: <T extends { id: string }>.",
  },

  // ─── 구조설계 ─────────────────────────────────────────
  {
    id: "q-arch-1",
    category: "구조설계",
    question: "관심사 분리(Separation of Concerns)란?",
    answer:
      "각 모듈이 하나의 책임/관심사만 갖도록 코드를 나누는 원칙. 변경 파급을 줄이고 테스트·재사용을 쉽게 만든다.",
  },
  {
    id: "q-arch-2",
    category: "구조설계",
    question: "프론트엔드에서 '상태' 를 어디에 둘지 판단 기준은?",
    answer:
      "범위(누가 쓰나) × 수명(언제까지 필요한가) × 출처(서버/URL/로컬). 컴포넌트 로컬 → 부모 lift → 컨텍스트/스토어 → 서버 캐시 순으로 올린다.",
  },
  {
    id: "q-arch-3",
    category: "구조설계",
    question: "비즈니스 로직을 컴포넌트 안에 넣지 말라는 이유는?",
    answer:
      "UI 와 결합되면 테스트가 어렵고 다른 화면에서 재사용이 안 된다. 훅/서비스 계층으로 빼면 UI 는 표현만 담당한다.",
  },
  {
    id: "q-arch-4",
    category: "구조설계",
    question: "확장성을 고려한 모듈 설계의 첫 단추는?",
    answer:
      "경계(인터페이스)를 먼저 정의하는 것. 내부 구현보다 '입출력 계약' 을 안정시키면 내부 교체가 자유로워진다.",
  },
];

/** 카테고리 목록 — UI 필터에서 사용. Category union 과 동기화 유지. */
export const CATEGORIES: Question["category"][] = [
  "CS",
  "React",
  "TypeScript",
  "구조설계",
];
