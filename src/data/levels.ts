// 설계 메모: 레벨 = 답이 요구하는 깊이. 문제 순서·카테고리·노드 id 와 무관한 별도 표.
//   초급 easy   : 정의·차이를 한두 문장으로 답하면 끝 (재인)
//   중급 normal : 동작 원리·순서·조건을 나열해야 답이 됨
//   고급 hard   : 트레이드오프·설계 판단·내부 구현 세부까지 말해야 답이 됨
//   종류별 한 줄 정의 나열은 easy (JOIN 종류·키 종류)
// 새 문제를 추가하면 여기도 한 줄 추가 — questions.test.ts 가 누락을 잡는다.
import type { Level } from "../types";

export const LEVEL_RANK: Record<Level, number> = { easy: 0, normal: 1, hard: 2 };

export const LEVEL_OF: Record<string, Level> = {
  // ─── 기술면접 ───
  "q-interview-1": "easy", // 답변 3층 구조(정의·특징·경험) 틀 하나 외우면 끝
  "q-interview-2": "easy", // 스프링 = 뼈대 + DI/AOP, 한 줄 정의로 답이 됨
  "q-interview-3": "normal", // 나눈 이유 3가지(테스트·재사용·변경 이유)를 나열해야 답
  "q-interview-4": "normal", // 롤백 규칙 + 프록시 self-invocation 조건까지 나열
  "q-interview-5": "hard", // 문제→후보→기준→포기(트레이드오프) 4단계 판단 과정
  "q-interview-6": "normal", // AI 코드를 내 것으로 만드는 검증 절차 나열
  "q-interview-7": "easy", // 준비할 4가지 항목을 꼽으면 끝
  "q-interview-8": "normal", // "요구 먼저 → 비춰 고르기" 2단계 절차 틀
  "q-interview-9": "normal", // 직접 부딪히며 배우는 4가지 + 디버깅 순서
  "q-interview-10": "normal", // 이유 나열형, 설계 판단 없음

  // ─── CS ───
  "q-cs-1": "easy", // 프로세스/스레드: 메모리 독립 vs 공유 한 줄 대비 (앵커급)
  "q-cs-2": "easy", // HTTP vs HTTPS: 암호화 여부 한 줄 ★앵커
  "q-cs-3": "easy", // 멱등성: "여러 번 보내도 결과 같다" 정의 하나
  "q-cs-4": "easy", // 3-way handshake 3단계 인사 비유, q-net-4 보다 덜 자세함 (규칙3)
  "q-cs-5": "easy", // GET vs POST: 쿼리스트링 vs 본문 한 줄 대비
  "q-cs-6": "easy", // 캐시: "자주 쓰는 걸 빠른 곳에" 정의 하나
  "q-cs-7": "easy", // 비트/바이트: 8배 관계 한 줄
  "q-cs-8": "easy", // 동기/비동기: 기다리냐 아니냐 한 줄 대비
  "q-cs-9": "easy", // 세션/쿠키: 열쇠와 지갑 관계 한 줄
  "q-cs-10": "easy", // DNS: 전화번호부 정의 하나 (q-net-9 가 더 자세함 → 규칙3)
  "q-cs-11": "normal", // 공개키/개인키: 암호화·서명 두 방향 쓰임을 갈라 설명해야 함
  "q-cs-12": "hard", // RSA: 소인수분해 원리 + 장단점 + 양자 취약성 판단
  "q-cs-13": "hard", // DSA: 난수 k 재사용이 왜 개인키를 노출하는지 + 퇴역 판단
  "q-cs-14": "hard", // ECDSA 안전성: 키 길이 대비 안전도 트레이드오프 ★앵커
  "q-cs-15": "hard", // EdDSA vs ECDSA: 결정적 k·부채널 등 설계 차이 비교
  "q-cs-16": "hard", // Ed25519 선택 가이드: 용도별 트레이드오프 판단

  // ─── React ───
  "q-react-1": "easy", // 의존성 배열: "넣은 값 바뀔 때 실행" 한 줄
  "q-react-2": "easy", // key 필요성: 출석번호 비유 한 줄 ★앵커
  "q-react-3": "easy", // useMemo/useCallback: 값 vs 함수 한 줄 대비
  "q-react-4": "easy", // controlled/uncontrolled: 누가 값을 쥐냐 한 줄 대비
  "q-react-5": "normal", // "화면 = 상태의 함수" → 리렌더 발생 원리 설명
  "q-react-6": "normal", // key 없을 때 index 판단이 왜 상태를 꼬는지 동작 설명
  "q-react-7": "normal", // RSC: 서버 실행·번들 제외·클라 경계 조건 나열
  "q-react-8": "normal", // 재조합: 두 트리 비교 후 최소 변경 적용 과정 ★앵커
  "q-react-9": "easy", // props drilling: 중간이 전달만 한다는 현상 정의 하나
  "q-react-10": "easy", // controlled 이유: 단일 진실의 원천 한 줄

  // ─── TypeScript ───
  "q-ts-1": "easy", // interface vs type: 선언 병합 vs 표현 자유 한 줄 대비
  "q-ts-2": "easy", // unknown vs any: 검사 강제 여부 한 줄 ★앵커
  "q-ts-3": "easy", // as const: 리터럴로 얼린다 한 줄
  "q-ts-4": "easy", // 제네릭 제약: "최소 조건" 비유 한 줄
  "q-ts-5": "normal", // 유니온 내로잉: typeof/in/switch 로 좁히는 절차 설명
  "q-ts-6": "easy", // Partial/Pick/Omit: 각각 용도 한 줄씩
  "q-ts-7": "normal", // as 위험성: 검사를 끄는 것일 뿐 → 내로잉 대체 판단
  "q-ts-8": "normal", // ?. / ?? 동작 + || 와의 falsy 차이 조건까지

  // ─── 구조설계 (5~10) ───
  "q-arch-5": "normal", // 계층 기준: 변경 이유로 묶는 원리 + 형식별 분류와 비교
  "q-arch-6": "easy", // 일관된 응답 봉투: 계약을 통일한다 한 줄
  "q-arch-7": "normal", // 리프트업→Context→스토어 권장 순서 나열
  "q-arch-8": "hard", // DDD: 도메인 중심 설계 의도·기술 교체 대응 판단 ★앵커
  "q-arch-9": "normal", // 무상태: 스케일아웃이 되는 이유 + 스테이트풀 대비
  "q-arch-10": "easy", // 좋은 이름 짓기가 최고의 유지보수 — 한 줄

  // ─── Java ───
  "q-java-1": "easy", // JVM: 바이트코드 + 통역사 비유 한 줄
  "q-java-2": "easy", // 클래스/객체: 붕어빵 틀과 붕어빵 ★앵커
  "q-java-3": "easy", // 상속 vs 인터페이스: 물려받기 vs 자격증 한 줄 대비
  "q-java-4": "easy", // == vs equals: 주소 vs 내용 한 줄
  "q-java-5": "easy", // 오버로딩/오버라이딩: 가로 vs 세로 한 줄 대비
  "q-java-6": "easy", // static: "인스턴스마다가 아니라 클래스에 하나" 한 줄이면 답
  "q-java-7": "normal", // Checked/Unchecked: 컴파일러 강제 조건과 대응 방식
  "q-java-8": "easy", // ArrayList vs HashMap: 순서 vs 이름표 용도 대비 (규칙2 단순 용도)

  // ─── 운영체제 ───
  "q-os-1": "normal", // 주소 공간 4영역 + 공유로 메모리 아끼는 이유 나열
  "q-os-2": "normal", // 인터럽트 vs 폴링 + 인터럽트 3종류·처리 순서
  "q-os-3": "normal", // fork/exec 동작 + 반환값으로 부모/자식 구분하는 조건
  "q-os-4": "easy", // PCB: "프로세스 신상명세서" + 담기는 항목 나열
  "q-os-5": "normal", // 컨텍스트 스위칭이 오버헤드인 이유 + 프로세스/스레드 비용 차
  "q-os-6": "normal", // IPC 기법들을 열거하고 공유메모리가 빠른 이유까지
  "q-os-7": "normal", // 선점/비선점 + 알고리즘별 특성·기아·convoy 나열
  "q-os-8": "normal", // 데드락 4조건 나열 ★앵커
  "q-os-9": "normal", // 레이스 컨디션 발생 순서 + 해결 3요건
  "q-os-10": "easy", // 뮤텍스 vs 세마포어: 열쇠 1개 vs 자리 N개 한 줄 대비
  "q-os-11": "normal", // thread-safe 정의 + reentrant 와의 포함 관계 조건
  "q-os-12": "hard", // 페이징/세그멘테이션 + 내부·외부 단편화 비교 ★앵커
  "q-os-13": "normal", // 가상 메모리·MMU 번역 과정 + 보호 레지스터 동작
  "q-os-14": "hard", // FIFO·LRU·OPT 알고리즘 비교 + dirty bit 로 victim 고르는 판단

  // ─── 네트워크 ───
  "q-net-1": "normal", // OSI 7계층 각 층 역할·PDU 나열
  "q-net-2": "normal", // 흐름제어: 윈도우로 수신 버퍼 맞추는 동작 원리
  "q-net-3": "hard", // AIMD·Slow Start·Fast Recovery 알고리즘 내부 비교
  "q-net-4": "normal", // 3-way/4-way: 종료가 4번인 조건·TIME_WAIT 이유 ★규칙3(cs-4 ≤ 여기)
  "q-net-5": "easy", // TCP vs UDP: 등기우편 vs 전단지 한 줄 대비 (헤더·체크섬은 곁가지)
  "q-net-6": "normal", // 로드밸런싱 필요성 + 분배 방식 3종 나열
  "q-net-7": "normal", // 하이브리드: 공개키로 대칭키 전달하는 순서 원리
  "q-net-8": "normal", // TLS 핸드셰이크 6단계 순서 ★앵커
  "q-net-9": "normal", // DNS 조회 순서(hosts→캐시→Root→TLD→Authoritative) ★규칙3
  "q-net-10": "normal", // Blocking/Non-blocking 동작 + 스레드 폭증 문제
  "q-net-11": "normal", // 두 축 개념 구분 + 4조합 나열, 트레이드오프 없음 (q-net-10 과 같은 층)
  "q-net-12": "normal", // 웹소켓 핸드셰이크·양방향 유지 + 폴링 대비 원리

  // ─── 데이터베이스 ───
  "q-db-1": "easy", // 키 5종 종류별 정의 나열 (q-db-8 과 같은 규칙)
  "q-db-2": "normal", // 이상현상 3종이 각각 왜 생기는지 조건 나열
  "q-db-3": "normal", // 정규화 1~3NF 조건 나열 ★앵커
  "q-db-4": "normal", // 색인 원리 + 대가 2개가 본문, 컬럼 선택 기준은 꼬리
  "q-db-5": "hard", // 해시 vs B+Tree 내부 구조 비교·선택 근거 (규칙2)
  "q-db-6": "normal", // 트랜잭션 ACID 4가지 + UNDO/REDO 로 보장되는 구조
  "q-db-7": "hard", // 격리수준 4단계 × 이상현상 트레이드오프 ★앵커
  "q-db-8": "easy", // JOIN: 교집합이냐 한쪽을 다 살리냐 — 종류별 한 줄 정의
  "q-db-9": "normal", // SQL 인젝션 발생 원리 + PreparedStatement 방어 절차
  "q-db-10": "hard", // SQL vs NoSQL: 중복·확장 트레이드오프로 고르는 판단 (규칙2)
  "q-db-11": "normal", // 커넥션 풀 동작 3단계 + 풀 크기 감각
  "q-db-12": "normal", // 파티셔닝/샤딩 관계 + 분할 기준 4가지 나열
  "q-db-13": "normal", // Redis 용도 + 영속성(RDB/AOF) 동작 나열

  // ─── 자료구조 ───
  "q-ds-1": "normal", // 배열/연결리스트 복잡도 + "위치를 알 때만 O(1)" 조건
  "q-ds-2": "easy", // 스택/큐: LIFO vs FIFO 한 줄 대비 ★앵커
  "q-ds-3": "normal", // 힙: 반정렬 성질 + up/down-heap 동작·인덱스 규칙
  "q-ds-4": "normal", // 트리 조건 2개 + 순회 4가지 나열
  "q-ds-5": "normal", // BST 가 O(N) 되는 편향 조건과 균형 트리로 푸는 이유
  "q-ds-6": "normal", // 충돌 해결 2계열 + 조사 방식·적재율 나열
  "q-ds-7": "hard", // 트라이: O(M) vs BST O(M·logN) 비교 + 메모리 대가 판단
  "q-ds-8": "hard", // B-Tree: 디스크 접근 횟수 관점의 설계 판단 + B+Tree 비교
  "q-ds-9": "normal", // DFS/BFS 동작과 목적별 선택 기준
  "q-ds-10": "hard", // 퀵·병합·힙 3종 비교 (안정성·메모리·최악) ★앵커
  "q-ds-11": "easy", // Big-O: 증가 추세를 잰다 + 등급 순서 나열
  "q-ds-12": "normal", // HashMap/TreeMap 동작 차이 + 최악 복잡도 조건

  // ─── SpringBoot ───
  "q-spring-1": "easy", // 스프링부트 = 밀키트, 정의 한 줄
  "q-spring-2": "easy", // @RestController + @GetMapping 붙이면 끝, 사용법 한 줄
  "q-spring-3": "easy", // DI: 내가 new 안 하고 꽂아준다 한 줄
  "q-spring-4": "easy", // JPA/@Entity: 객체↔테이블 통역사 한 줄
  "q-spring-5": "normal", // 빈·IoC 컨테이너 등록→주입 흐름 + 싱글턴 조건
  "q-spring-6": "normal", // 3계층 분업 + 나누면 생기는 이점 3가지 나열
  "q-spring-7": "normal", // @Transactional 이 보장하는 것(All or Nothing·롤백) ★앵커
  "q-spring-8": "easy", // 프로파일: 환경별 설정 갈아끼우기 한 줄

  // ─── 구조설계 (1~4) ───
  "q-arch-1": "easy", // 관심사 분리: 역할별로 나눈다 한 줄 ★앵커
  "q-arch-2": "normal", // 상태 배치 판단 기준 4단계(로컬→부모→전역→서버) 나열
  "q-arch-3": "easy", // 로직을 순수 함수로 빼면 테스트된다 한 줄
  "q-arch-4": "normal", // 인터페이스 계약을 먼저 정하는 설계 순서 설명

  // ─── 상태관리 ───
  "q-state-1": "easy", // 서버 상태 vs 클라이언트 상태 한 줄 대비
  "q-state-2": "normal", // queryKey 가 캐시를 가르는 동작 + 변수 누락 시 사고
  "q-state-3": "normal", // staleTime/gcTime 각 타이머가 언제 작동하는지 조건
  "q-state-4": "normal", // 캐시 생명주기 5단계 순서 나열
  "q-state-5": "normal", // isPending/isFetching 이 갈리는 조건과 v5 관계식
  "q-state-6": "normal", // enabled: 종속 쿼리를 잠그는 조건 + 수동 refetch 용법
  "q-state-7": "normal", // useMutation 동작 + onSuccess 무효화로 갱신하는 절차 ★앵커
  "q-state-8": "normal", // invalidate vs setQueryData 동작 차이와 선택 조건
  "q-state-9": "hard", // 낙관적 업데이트 3박자 롤백 설계 ★앵커
  "q-state-10": "normal", // placeholderData 로 깜빡임 없애는 동작 + prefetch
  "q-state-11": "normal", // useInfiniteQuery pages/getNextPageParam 동작 나열
  "q-state-12": "normal", // select 가 캐시는 두고 반환만 변환하는 동작
  "q-state-13": "normal", // 포커스 재요청·폴링이 각각 언제 작동하는지 조건
  "q-state-14": "hard", // Suspense/ErrorBoundary 로 선언적 UI 를 만드는 구조 설계
  "q-state-15": "normal", // 원리 하나(방송→전체 리렌더) + 권장 대안, 비교·배치 판단이 본문 아님
  "q-state-16": "hard", // Zustand vs Redux 비교 + selector 구독 설계 판단
  "q-state-17": "normal", // Flux 단방향 흐름의 순서와 그 이점 설명
  "q-state-18": "hard", // 4종 상태를 어디에 둘지 배치 판단 + 이중 진실 함정
};

/** 레벨로 거른다. 거른 결과가 비면 원본을 돌려준다 (카테고리×레벨 공백 폴백). null 이면 그대로. */
export function filterByLevel<T extends { id: string }>(pool: T[], level: Level | null): T[] {
  if (!level) return pool;
  const f = pool.filter((q) => LEVEL_OF[q.id] === level);
  return f.length ? f : pool;
}
