// =============================================================
// 문제 데이터 (하드코딩)
// - answer 작성 원칙: ① 비유 먼저 ② 쉬운 말로 풀기 ③ 전문 용어는 괄호 안에.
// - code 는 템플릿 리터럴(백틱) — 줄바꿈이 그대로 살아서 <pre> 에 바로 들어간다.
//   주의: 코드 안에 백틱(`)이나 ${ 가 들어가면 이스케이프 필요!
// - id 는 "q-카테고리-순번" 으로 부여 → localStorage 키 충돌 방지.
// =============================================================

import type { Category, CategoryGroup, Question } from "../types";

/** 그룹 → 카테고리 매핑. 새 카테고리는 여기 + types.ts 의 Category union 에 추가. */
export const CATEGORY_GROUPS: Record<CategoryGroup, Category[]> = {
  프론트엔드: ["React", "TypeScript", "상태관리"],
  "백엔드&프로그래밍": [
    "CS",
    "운영체제",
    "네트워크",
    "데이터베이스",
    "자료구조",
    "Java",
    "SpringBoot",
    "구조설계",
    "기술면접",
  ],
};

export const QUESTIONS: Question[] = [
  // ─── 기술면접 (내 프로젝트를 내 말로 설명하기) ─────────
  // 설계 메모: 이 카테고리는 "지식 암기"가 아니라 **설명 능력**을 훈련한다.
  // 모의면접에서 실제로 무너지는 지점 — 프로젝트는 잘 돌아가는데
  // "Java가 뭔가요?" "Spring이 뭔가요?" 에 답을 못하는 상황 — 을 그대로 문제로 만들었다.
  {
    id: "q-interview-1",
    category: "기술면접",
    question: '면접에서 "Java가 무엇인가요?" 라고 물으면 어떻게 답해야 하나?',
    answer:
      "\"객체지향 언어입니다\" 한 줄로 끝내면 외운 티가 난다. 좋은 답은 3층으로 쌓는다: ① 한 줄 정의 — 한 번 짜면 어느 컴퓨터에서든 도는 언어(JVM 위에서 실행되는 객체지향 언어). ② 특징 하나 — 메모리 청소를 내가 안 하고 정비공(GC, 가비지 컬렉터)이 대신 해준다. ③ 내 프로젝트 연결 — \"스프링 생태계를 쓰려고 자바를 골랐고, 회원 API를 자바로 짰습니다.\" 정의 → 특징 → 내 경험, 이 순서면 어떤 기술 질문에도 통한다.",
    code: `// 답변 3층 구조 (어떤 기술이든 똑같이 적용된다)
// 1) 한 줄 정의  : "JVM 위에서 도는 객체지향 언어입니다."
// 2) 특징 1개    : "GC가 메모리를 대신 정리해줘서 메모리 누수 걱정이 줄었습니다."
// 3) 내 경험     : "스프링 생태계를 쓰려고 골랐고, 회원 API를 자바로 짰습니다."

// ❌ 나쁜 답: "음... 객체지향... 이고... 많이 쓰는 언어입니다"
// ✅ 좋은 답: 정의 → 특징 → 내 프로젝트 (10~20초)`,
  },
  {
    id: "q-interview-2",
    category: "기술면접",
    question: '"Spring이 정확히 어떤 역할을 하나요?" 에 답하려면?',
    answer:
      "스프링 = 웹 서버를 짓는 '뼈대 + 자동화 도구 세트'다. 비유하면 집을 지을 때 기둥·배관·전기를 미리 깔아둔 골조 — 개발자는 방 배치(비즈니스 로직)만 하면 된다. 핵심 역할 두 개만 말해도 충분하다: ① 객체를 대신 만들어 필요한 곳에 꽂아준다(DI/IoC, 제어의 역전). ② 트랜잭션·보안·로깅처럼 모든 기능에 공통으로 필요한 잡일을 어노테이션 한 줄로 붙여준다(AOP). 꼬리 질문 \"스프링이 없으면?\"에는 \"객체를 전부 직접 new 로 조립하고 커밋/롤백도 손으로 해야 합니다\"라고 답한다.",
    code: `// 스프링이 없을 때 — 내가 다 만들고 다 연결한다
UserRepository repo = new UserRepository(new DataSource(...));
UserService service = new UserService(repo);   // 손으로 조립
conn.setAutoCommit(false);                     // 트랜잭션도 손으로
try { ...; conn.commit(); } catch (e) { conn.rollback(); }

// 스프링이 있을 때 — 조립과 잡일을 스프링이 한다
@Service
class UserService {
  private final UserRepository repo;           // 생성자로 꽂아줌 (DI)
  UserService(UserRepository repo) { this.repo = repo; }

  @Transactional                               // 커밋/롤백 자동 (AOP)
  void join(User u) { repo.save(u); }
}`,
  },
  {
    id: "q-interview-3",
    category: "기술면접",
    question: '"왜 Controller와 Service를 나눴나요?" — 어떻게 답할까?',
    answer:
      "식당으로 비유하면 홀 직원(Controller)과 주방(Service)이다. 홀은 주문을 받고(HTTP 요청 파싱·검증) 접시를 내가고(응답 변환), 주방은 요리(비즈니스 로직)만 한다. 나누면 좋은 점 셋: ① 주방 로직을 테스트할 때 HTTP 서버를 띄울 필요가 없다. ② 나중에 앱·배치·다른 API 가 생겨도 같은 주방을 재사용한다. ③ 바뀌는 이유가 다르다 — URL 이 바뀌면 홀만, 정책이 바뀌면 주방만 고친다(단일 책임). \"관례라서요\"는 최악의 답이고, 이 셋 중 하나만 말해도 답이 된다.",
    code: `// Controller = 홀: HTTP 만 안다 (로직 금지)
@RestController
class UserController {
  private final UserService service;
  @PostMapping("/users")
  ResponseEntity<UserResponse> join(@RequestBody @Valid JoinRequest req) {
    User user = service.join(req.toCommand());  // 주방에 주문 전달
    return ResponseEntity.ok(UserResponse.from(user));
  }
}

// Service = 주방: HTTP 를 전혀 모른다 → 테스트가 쉽다
@Service
class UserService {
  @Transactional
  User join(JoinCommand cmd) { /* 중복 검사, 저장 */ }
}`,
  },
  {
    id: "q-interview-4",
    category: "기술면접",
    question: '"@Transactional은 왜 붙였나요?" 에 대한 좋은 답은?',
    answer:
      "계좌 이체를 떠올리면 된다. A 에서 5만원을 빼고 B 에 넣는 두 작업 사이에 서버가 죽으면 돈이 증발한다. @Transactional = \"이 메서드 안의 DB 작업은 전부 성공하거나 전부 취소(롤백)한다\"는 선언. 붙였다면 이 두 개는 반드시 알고 있어야 한다: ① 롤백은 기본적으로 RuntimeException(언체크 예외)에만 걸리고, 체크 예외는 롤백되지 않는다. ② 프록시로 동작해서 같은 클래스 안에서 자기 메서드를 그냥 호출하면 트랜잭션이 안 걸린다(self-invocation). \"AI가 붙여줘서요\"가 아니라 \"두 테이블을 함께 바꾸는 메서드라 중간 실패 시 롤백이 필요했습니다\"라고 말하자.",
    code: `@Service
class OrderService {
  @Transactional            // 재고 차감 + 주문 저장 = 한 덩어리
  void order(Long itemId, int qty) {
    stockRepo.decrease(itemId, qty);   // 여기까지 성공해도
    orderRepo.save(new Order(itemId)); // 여기서 터지면 위도 롤백
  }

  // ⚠️ 함정: 같은 클래스 안에서 호출하면 프록시를 안 거쳐 트랜잭션 무효
  void outer() { this.order(1L, 2); }  // @Transactional 안 먹음
}`,
  },
  {
    id: "q-interview-5",
    category: "기술면접",
    question: '"왜 이 기술을 선택했나요?" 라는 질문의 진짜 의도는?',
    answer:
      "면접관은 기술 지식이 아니라 판단 과정을 본다. \"요즘 많이 쓰니까\", \"강의에서 써서\"는 판단이 없었다는 뜻이다. 좋은 답은 4단계: ① 어떤 문제가 있었는지 → ② 후보를 무엇무엇 놓고 비교했는지 → ③ 무엇을 기준으로 골랐는지 → ④ 대신 무엇을 포기했는지(트레이드오프). 4번을 말하는 순간 신뢰도가 확 오른다. 단점 없는 기술은 없는데, 단점을 말할 수 있다는 건 실제로 써봤다는 증거이기 때문이다.",
    code: `// ❌ "요즘 Redis를 많이 써서 넣었습니다."

// ✅ 4단계로 말하기
// ① 문제 : 인기 상품 조회가 초당 수백 건인데 DB CPU 가 80% 까지 올랐다
// ② 후보 : 애플리케이션 로컬 캐시 vs Redis
// ③ 기준 : 서버를 2대로 늘릴 예정이라 캐시가 서버마다 따로 놀면 안 됐다 → 공용 캐시
// ④ 포기 : 네트워크 왕복이 생기고 Redis 서버를 하나 더 관리해야 한다
//          (조회 많고 변경 적은 데이터라 TTL 5분으로 정합성 손해를 감수)`,
  },
  {
    id: "q-interview-6",
    category: "기술면접",
    question: "AI로 만든 코드(바이브 코딩)를 면접에서 어떻게 다뤄야 하나?",
    answer:
      "AI 사용은 숨길 것도 부끄러워할 것도 아니다. 면접관이 보는 건 \"그 코드가 네 것이 되었는가\"다. AI 가 작성한 코드도 결국 내 코드고 책임도 내가 진다. 그래서 셋을 준비한다: ① 생성된 코드를 한 줄씩 읽고 모르는 어노테이션·API 는 공식 문서로 확인했는가. ② 왜 그렇게 짰는지 다른 방법과 비교해 내 말로 설명할 수 있는가. ③ 검증했는가 — 테스트를 돌리고 성능·보안 문제를 직접 확인했는가. \"AI 에게 요구사항을 이렇게 쪼개 던졌고, 나온 코드는 이 기준으로 검증했습니다\"까지 말하면 AI 활용 능력이 오히려 강점이 된다.",
    code: `// AI가 준 코드를 '내 것'으로 만드는 체크리스트
// [ ] 모르는 어노테이션/함수가 한 개도 없는가? (있으면 공식 문서 확인)
// [ ] 이 구조 말고 다른 방법은 뭐가 있었고, 왜 이걸 택했는가?
// [ ] 실패 케이스는? (null, 동시 요청, 예외 시 롤백)
// [ ] 테스트를 직접 돌려봤는가? 로그/디버거로 흐름을 따라가 봤는가?
// [ ] 보안·성능 문제는 없는가? (N+1 쿼리, 평문 비밀번호, 권한 체크)

// 위 5개에 답할 수 있으면 → 면접에서 "제가 만든 코드"라고 말해도 된다.`,
  },
  {
    id: "q-interview-7",
    category: "기술면접",
    question: "이력서에 적은 기술마다 최소한 준비해야 하는 4가지는?",
    answer:
      "모든 CS 를 완벽히 알 필요는 없다. 다만 내 이력서에 적은 기술만큼은 넷을 내 말로 설명할 수 있어야 한다: ① 이게 무엇인가(한 줄 정의) ② 왜 선택했나(대안 대비 이유) ③ 장단점은 무엇인가 ④ 내 프로젝트에서 어떻게 썼나(구체적 상황·코드). 이력서는 \"이 항목에 대해 질문해도 좋습니다\"라는 초대장이다. 답 못 할 기술은 아예 적지 않는 게 낫다. 적힌 기술 수가 아니라 설명 가능한 기술 수가 실력이다.",
    code: `// 이력서 한 줄마다 이 표를 채워보기 (못 채우면 그 줄을 지운다)
// 기술   | ① 정의             | ② 선택 이유      | ③ 단점         | ④ 내 사용처
// ------|-------------------|----------------|---------------|------------------
// Redis | 인메모리 키-값 저장소 | 서버 2대 공용 캐시 | 휘발·운영 부담    | 인기상품 5분 캐싱
// JPA   | 객체↔테이블 매핑    | SQL 반복 제거    | N+1·튜닝 어려움  | 회원/주문 CRUD
// Kafka | ???               | ???            | ???           | ???  ← 지운다`,
  },
  {
    id: "q-interview-8",
    category: "기술면접",
    question: '"MySQL을 왜 썼나요? PostgreSQL은 왜 아닌가요?" 같은 비교 질문 대처법은?',
    answer:
      "비교 질문은 정답을 맞히라는 게 아니라 \"차이를 알고 골랐냐\"를 묻는 것이다. 그래서 축 하나만 잡아 말하면 된다. 순서는 ① 내 프로젝트의 요구를 먼저 말하고 ② 그 요구에 비춰 골랐다고 말하기. 예: \"조회 위주에 스키마가 거의 안 바뀌어서 자료가 많은 MySQL 을 택했습니다. PostgreSQL 의 JSONB·복잡한 쿼리 최적화는 이 프로젝트에서 쓸 일이 없어 이점이 없었습니다.\" \"둘 다 비슷해서 아무거나\"는 요구사항을 안 봤다는 뜻이 된다. 모르면 \"그 부분은 깊게 비교하지 못했고 팀 경험을 기준으로 골랐습니다\"가 지어내는 것보다 낫다.",
    code: `// 비교 질문 답변 틀
// "제 프로젝트는 [요구사항] 이 중요했습니다.
//  A는 [강점] 이 있고 B는 [강점] 이 있는데,
//  제 요구사항엔 A의 강점이 맞아서 A를 골랐습니다."

// 예시
// "조회가 대부분이고 스키마가 거의 안 바뀌는 서비스라
//  자료·레퍼런스가 많은 MySQL 을 골랐습니다.
//  PostgreSQL 의 JSONB·윈도우 함수는 쓸 일이 없어 이점이 없었습니다."`,
  },
  {
    id: "q-interview-9",
    category: "기술면접",
    question: "AI 없이 직접 코딩하는 프로젝트를 따로 해봐야 하는 이유는?",
    answer:
      "직접 부딪히면 코딩만 배우는 게 아니다. 라이브러리 버전 충돌, DB 연결 오류, 예상 못 한 예외를 만나면서 ① 에러 메시지로 검색하는 법 ② 원인을 추론하는 법 ③ 남의 해결책을 비교하는 법 ④ 로그를 찍고 브레이크포인트를 걸어 디버깅하는 법을 배운다. 몇 시간 붙잡는 게 당장은 비효율로 느껴지지만, \"장애가 났을 때 원인을 어떻게 찾나요?\"에 대한 답은 이 경험에서만 나온다. 그래서 이상적인 조합은 두 개 — AI 없이 만든 프로젝트 하나(기본기), AI 를 최대한 활용한 프로젝트 하나(생산성).",
    code: `// 에러를 만났을 때의 순서 (이 습관 자체가 면접 답변이 된다)
// 1. 에러 메시지를 끝까지 읽는다 (맨 아래 Caused by 가 진짜 원인)
// 2. 메시지에서 고유한 부분만 골라 검색 (내 파일명·변수명은 빼고)
// 3. 공식 문서 → 이슈 트래커 → 블로그 순으로 신뢰
// 4. 로그를 찍어 '어디까지 정상인지' 이분 탐색으로 좁힌다
// 5. 브레이크포인트로 그 지점의 실제 값을 확인한다
// 6. 고친 뒤 "왜 그랬는지" 한 줄로 적어둔다 ← 면접에서 그대로 쓰인다`,
  },
  {
    id: "q-interview-10",
    category: "기술면접",
    question: "AI 시대에 오히려 기본기(CS)가 더 중요해지는 이유는?",
    answer:
      "AI 가 코드를 많이 쓸수록, 그 코드가 맞는지 판단하는 사람의 가치가 올라간다. AI 는 그럴듯하지만 틀린 코드를 낼 수 있고(N+1 쿼리, 인덱스 못 타는 쿼리, 평문 비밀번호 저장, 권한 검사 누락), 장애가 나면 원인을 찾는 건 결국 사람이다. AI 가 코드를 대신 써줘도 그 코드에 대한 책임까지 가져가지는 않는다. 그래서 앞으로 개발자는 '코드를 많이 쓰는 사람'이 아니라 '코드를 이해하고 판단하는 사람'이어야 한다. 면접장에 들어가는 건 AI 가 만든 프로젝트가 아니라, 그 프로젝트를 이해한 나 자신이다.",
    code: `// AI가 준 이 코드, 어디가 문제일까? (판단력 = 기본기)
@GetMapping("/orders")
List<OrderResponse> list() {
  return orderRepo.findAll().stream()         // ① 전체 조회 — 페이징 없음
      .map(o -> new OrderResponse(
          o.getId(), o.getUser().getName()))   // ② N+1 쿼리 (주문 100개 → 쿼리 101번)
      .toList();                               // ③ 권한 검사 없음 (남의 주문도 보임)
}

// 이 셋이 눈에 보이면 AI를 써도 안전하다.
// 안 보이면, AI가 빠르게 만들어준 만큼 빠르게 사고가 난다.`,
  },
  // ─── CS ────────────────────────────────────────────────
  {
    id: "q-cs-1",
    category: "CS",
    question: "프로세스와 스레드의 핵심 차이는?",
    answer:
      "아파트로 비유하면: 프로세스 = 한 집 (집마다 부엌·화장실이 따로 = 메모리 독립), 스레드 = 그 집에 사는 가족들 (부엌을 같이 씀 = 메모리 공유). 그래서 한 집(프로세스)이 무너져도 옆집은 멀쩡하고, 가족(스레드)끼리 교대하는 건 이사보다 훨씬 빠르다 (컨텍스트 스위칭 비용↓).",
    code: `// 크롬의 탭 하나하나 = 프로세스 (메모리 분리)
// → 한 탭이 죽어도 다른 탭은 멀쩡한 이유!

// 브라우저 JS에서 "스레드 비슷한 것" = Web Worker
const worker = new Worker("heavy.js"); // 무거운 계산을 딴 일꾼에게
worker.postMessage(bigData);           // 메시지로 일 시키고
worker.onmessage = (e) => {
  console.log("계산 끝!", e.data);     // 그동안 화면(UI)은 안 멈췄다
};`,
  },
  {
    id: "q-cs-2",
    category: "CS",
    question: "HTTP 와 HTTPS 의 차이는?",
    answer:
      "HTTP = 엽서. 배달 중간에 누구나 내용을 훔쳐볼 수 있다. HTTPS = 잠긴 봉투 (TLS 암호화). 봉투 덕분에 ① 남이 못 읽고 (기밀성) ② 중간에 내용을 못 바꾸고 (무결성) ③ 받는 사람이 진짜 그 사이트인지 확인된다 (신원 검증). 비밀번호·카드번호가 오가는 곳은 무조건 HTTPS.",
    code: `// http = 엽서: 중간에서 누구나 읽을 수 있다
fetch("http://bank.com/login", {
  body: JSON.stringify({ pw: "1234" }), // ❌ 비밀번호 그대로 노출
});

// https = 잠긴 봉투(TLS): 읽기도, 위조도 불가
fetch("https://bank.com/login", {
  body: JSON.stringify({ pw: "1234" }), // ✅ 암호화되어 전송
});`,
  },
  {
    id: "q-cs-3",
    category: "CS",
    question: "RESTful API 에서 멱등성(idempotency)이란?",
    answer:
      "\"같은 요청을 100번 보내도 결과가 한 번 보낸 것과 같다\"는 성질. 엘리베이터 버튼은 10번 눌러도 한 대만 온다 (멱등 ✅). 자판기 버튼은 누를 때마다 음료가 나온다 (비멱등 ❌). GET/PUT/DELETE 는 엘리베이터, POST 는 자판기 — 그래서 결제 버튼은 연타 방지가 필요하다.",
    code: `// PUT = "내 닉네임을 yumin으로 바꿔줘"
// → 100번 보내도 결과는 똑같이 'yumin' (엘리베이터 버튼 ✅)
await fetch("/api/me", {
  method: "PUT",
  body: JSON.stringify({ nickname: "yumin" }),
});

// POST = "주문 하나 추가해줘"
// → 3번 보내면 주문이 3개! (자판기 버튼 ❌)
await fetch("/api/orders", { method: "POST", body: order });`,
  },
  {
    id: "q-cs-4",
    category: "CS",
    question: "TCP 3-way handshake 의 SYN, SYN-ACK, ACK 의미는?",
    answer:
      "전화 걸 때 하는 \"여보세요?\" 과정이다. ① SYN: \"여보세요, 들리세요?\" ② SYN-ACK: \"네 들려요! 제 목소리도 들리세요?\" ③ ACK: \"네 잘 들려요!\" — 이렇게 서로 잘 들리는 걸 확인한 다음에야 본격적으로 대화(데이터 전송)를 시작한다. 이게 TCP가 '신뢰성 있다'고 불리는 이유.",
    code: `// 전화 거는 것과 똑같다:
//
// 클라이언트                         서버
//    │── SYN ─────────────────────▶│  "여보세요, 연결할까요? (내 번호: 100)"
//    │◀──────────────── SYN-ACK ──│  "좋아요(101 확인), 저도요 (내 번호: 300)"
//    │── ACK ─────────────────────▶│  "확인!(301)" → 연결 성립
//
// 번호(시퀀스)를 주고받았으니 이후 데이터가
// 빠지거나 순서가 바뀌어도 바로 알아챈다 = "신뢰성"`,
  },

  // ─── React ─────────────────────────────────────────────
  {
    id: "q-react-1",
    category: "React",
    question: "useEffect dependency array 역할은?",
    answer:
      "effect 의 '알람 조건'이다. 배열 안에 넣은 값이 바뀔 때만 알람이 울린다 (= effect 실행). 빈 배열 [] 은 \"처음 화면에 나타날 때 딱 한 번만 울려줘\", 배열을 아예 안 쓰면 \"렌더링될 때마다 매번 울려줘\"가 된다.",
    code: `useEffect(() => {
  console.log("배열 없음 → 매 렌더마다 실행 (알람 항상 ON)");
});

useEffect(() => {
  console.log("빈 배열 → 처음 등장할 때 딱 1번");
}, []);

useEffect(() => {
  console.log("count가 바뀔 때만 울리는 알람");
}, [count]);`,
  },
  {
    id: "q-react-2",
    category: "React",
    question: "key prop 은 왜 필요한가?",
    answer:
      "key = 학생들의 출석번호. 번호가 있어야 선생님(React)이 \"누가 전학 가고 누가 새로 왔는지\" 정확히 안다. 자리 순서(index)를 번호로 쓰면? 맨 앞에 새 학생이 오는 순간 모두의 번호가 밀려서, 엉뚱한 학생이 다른 애 책상(상태)을 쓰게 된다.",
    code: `// ❌ index를 key로 — 맨 앞에 항목 추가하면
//    모든 번호가 밀려서 입력값 같은 상태가 꼬인다
{todos.map((todo, i) => (
  <TodoItem key={i} todo={todo} />
))}

// ✅ 바뀌지 않는 고유 id를 key로
{todos.map((todo) => (
  <TodoItem key={todo.id} todo={todo} />
))}`,
  },
  {
    id: "q-react-3",
    category: "React",
    question: "useMemo 와 useCallback 의 차이는?",
    answer:
      "둘 다 \"다시 만들지 말고 기억해뒀다 재사용해\"인데, 기억하는 대상이 다르다. useMemo = 계산 결과(값)를 기억 — \"이 수학 문제 답 아까 풀었잖아, 또 풀지 마\". useCallback = 함수 자체를 기억 — \"같은 함수를 매번 새로 만들지 마\". 자식 컴포넌트에 함수를 넘길 때 불필요한 리렌더를 막아준다.",
    code: `// useMemo: 비싼 "계산 결과(값)"를 기억
const total = useMemo(
  () => items.reduce((sum, it) => sum + it.price, 0),
  [items] // items가 그대로면 다시 계산 안 함
);

// useCallback: "함수 자체"를 기억
// → 자식에게 props로 넘길 때 새 함수 취급 안 받게
const onAdd = useCallback(() => setCount((c) => c + 1), []);

// 사실 둘은 같은 것:
// useCallback(fn, deps) === useMemo(() => fn, deps)`,
  },
  {
    id: "q-react-4",
    category: "React",
    question: "Controlled vs Uncontrolled 컴포넌트?",
    answer:
      "input 값을 누가 관리하느냐의 차이. Controlled = React state 가 리모컨으로 조종 (입력할 때마다 state 갱신 → state 가 화면을 결정). Uncontrolled = input 이 알아서 값을 들고 있고, 필요할 때만 ref 로 \"지금 뭐라고 적혀있어?\" 하고 물어본다. 실시간 검증이 필요한 폼은 controlled 가 편하다.",
    code: `// Controlled — React state가 리모컨
const [name, setName] = useState("");
<input
  value={name}                              // state가 화면을 결정
  onChange={(e) => setName(e.target.value)} // 입력 → state 갱신
/>

// Uncontrolled — input이 알아서 들고 있음
const inputRef = useRef<HTMLInputElement>(null);
<input ref={inputRef} defaultValue="기본값" />
// 필요할 때만 물어본다: inputRef.current?.value`,
  },

  {
    id: "q-react-5",
    category: "React",
    question: "상태(State)가 바뀌면 리렌더링이 일어나는 이유는?",
    answer:
      "React 는 '화면 = 상태의 함수' 라고 보기 때문에, 상태가 바뀌면 그에 맞춰 화면을 다시 그린다. 이게 리렌더링이다. 비용이 비싼 연산을 매번 하면 느려지니까 useMemo/useCallback 으로 '재계산 멈춤' 장치를 단다.",
    code: `// 상태가 바뀌면 → 컴포넌트 함수가 다시 실행 → 화면 재생성
const [count, setCount] = useState(0);

// ❌ 매 렌더마다 items.reduce() 다시 계산
const total = items.reduce((sum, it) => sum + it.price, 0);

// ✅ items 가 그대로면 이전 계산 결과 재사용
const total = useMemo(
  () => items.reduce((sum, it) => sum + it.price, 0),
  [items]
);`,
  },
  {
    id: "q-react-6",
    category: "React",
    question: "React 에서 Key 를 쓰지 않으면 왜 문제가 생기나?",
    answer:
      "React 가 리스트를 업데이트할 때, '누가 바뀌고 누가 새로 온 것인지' 구분해야 불필요한 리렌더/상태 꼬임을 막을 수 있다. Key 가 없으면 그냥 순서(index)로 판단해서, 항목이 중간에 추가되거나 지워질 때 상태가 엉뚱한 항목에게 날아가는 버그가 생긴다.",
    code: `// ❌ key 를 안 쓰거나 index 를 쓰면 — 순서가 바뀔 때 상태 꼬임
{todos.map((todo, i) => (
  <TodoItem key={i} todo={todo} />
))}

// ✅ 고유 id 를 key 로 쓰면 안전
{todos.map((todo) => (
  <TodoItem key={todo.id} todo={todo} />
))}`,
  },
  {
    id: "q-react-7",
    category: "React",
    question: "React Server Component 는 뭐가 다른가?",
    answer:
      "서버 컴포넌트는 서버에서만 실행되고, JS 번들에 포함되지 않는다. 그래서 큰 라이브러리(BigInt, fs 등)를 마음껏 쓸 수 있고, 번들 사이즈도 줄고 보안에도 유리하다. 다만 이벤트 핸들러(onClick) 같은 '인터랙션'은 클라이언트 컴포넌트로 넘겨야 한다.",
    code: `// Server Component (기본) — 서버에서만 실행
async function Page() {
  const data = await db.query("SELECT * FROM posts"); // DB 직접 접근 가능
  return <PostList posts={data} />;
}

// 'use client' → Client Component 전환
//  useState, onClick 등 클라이언트 기능 사용 가능
'use client';
function Counter() {
  const [count, setCount] = useState(0); // ✅ 가능
  return <button onClick={() => setCount((c) => c + 1)}>{count}</button>;
}`,
  },
  {
    id: "q-react-8",
    category: "React",
    question: "재조합(Reconciliation) 은 대충 뭔가?",
    answer:
      "상태가 바뀌어서 리렌더링이 일어났을 때, '이전 UI 트리'와 '새 UI 트리'를 비교해서 최소한의 변경만 DOM 에 적용하는 과정. 비유하면 수리공이 '고칠 부분만 골라서' 교체하는 것. 그래서 전체 페이지를 다시 그리는 게 아니라 필요한 부분만 부드럽게 바뀐다.",
    code: `// 재조합 원리 (간단 비유)

// 이전:  <ul><li>🍎</li><li>🍌</li></ul>
// 새   :  <ul><li>🍎</li><li>🍋</li><li>🍌</li></ul>

// React 는 비교해서:
// 1) '🍌' 는 자리만 바뀜 → move
// 2) '🍋' 는 새 항목 → insert
// 3) 전체를 다시 만들진 않음 → 효율!

// 그래서 key 가 중요: key 로 누가 누군지 정확히 식별`,
  },
  {
    id: "q-react-9",
    category: "React",
    question: "Props Drilling 이 뭔가?",
    answer:
      "부모 → 손자 → 증손자 로 데이터를 전달할 때, 중간 노드들은 그 데이터를 쓰지도 않으면서 prop 만 전달만 하는 현상. 층이 깊어지면 유지보수가 고통스럽다. 해결: Context API, Zustand 등 전역 스토어를 써서 '바로 꺼내 쓰는' 구조로 바꾼다.",
    code: `// ❌ props drilling: 중간 컴포넌트들은 username 을 안 쓴다
<App user={user}>
  <Layout user={user}>           {/* ← 전달만 할 뿐 */ }
    <Sidebar user={user}>        {/* ← 전달만 할 뿐 */ }
      <Profile user={user} />    {/* ← 실제 사용 */ }
    </Sidebar>
  </Layout>
</App>

// ✅ Zustand 로 전역에 넣고 필요한 데서 직접 꺼내 쓰기
const useStore = create((s) => ({ user: s.user }));
// <Profile /> 안에서
const user = useStore((s) => s.user); // 중간 전달 필요 없음`,
  },
  {
    id: "q-react-10",
    category: "React",
    question: "React 에서 'controlled 컴포넌트'를 쓰는 이유는?",
    answer:
      "'한 진실의 원천(SSOT)'을 만들기 위해서. input 값이 state 에 저장되면, 화면에 보이는 값·유효성 검증·다른 컴포넌트에 전달까지 전부 이 state 하나만 보면 된다. 그렇지 않으면 DOM 과 JS 상태가 서로 어디가 최신인지 몰라서 버그가 생긴다.",
    code: `// 제어되지 않는 input — DOM 이 값을 따로 기억 (두 개의 진실)
<input id="name" />
const name = document.getElementById("name").value; // 수동으로 꺼내야 함

// 제어되는 input — state 가 유일한 진실
const [name, setName] = useState("");
<input value={name} onChange={(e) => setName(e.target.value)} />`,
  },
  // 설계 메모: q-react-11~19 는 요즘IT "2025년 리액트 기술 스택 가이드"(Robin Wieruch)를
  // 바탕으로 만든 '최신 스택' 문제다. 라이브러리 이름 암기가 아니라 "왜 그걸 고르나"를 묻는다.
  {
    id: "q-react-11",
    category: "React",
    question: "서버 함수(Server Function)와 서버 액션(Server Action)은 어떤 관계인가?",
    answer:
      "서버 함수는 '버튼만 누르면 주방에 주문이 들어가는 키오스크'다. 컴포넌트 안에서 평범한 함수 부르듯 호출하지만 실제 코드는 서버에서 돈다 — 타입까지 맞춰진 원격 호출(RPC, Remote Procedure Call)인 셈. 파일이나 함수 맨 위에 'use server' 를 붙여 만든다. 서버 액션은 그중 폼 제출·데이터 변경처럼 '행동'에 쓰이는 서버 함수를 부르는 이름이다(서버 함수의 부분집합). form 의 action 에 바로 꽂을 수 있어서 API 라우트·fetch 코드 없이 폼을 처리할 수 있다.",
    code: `// actions.ts — 'use server' 가 붙은 함수는 서버에서만 실행된다
'use server';
export async function addTodo(formData: FormData) {
  const title = formData.get("title");
  await db.todo.create({ data: { title } }); // DB 직접 접근 OK
}

// TodoForm.tsx — API 라우트도 fetch 도 없이 바로 연결 (서버 액션)
import { addTodo } from "./actions";
export function TodoForm() {
  return (
    <form action={addTodo}>
      <input name="title" />
      <button>추가</button>
    </form>
  );
}`,
  },
  {
    id: "q-react-12",
    category: "React",
    question: "React 만 쓰지 않고 Next.js 같은 '프레임워크' 위에서 만드는 이유는?",
    answer:
      "React 는 '엔진'이고 Next.js 는 엔진을 얹은 '완성차'다. React 혼자서는 화면 조각(컴포넌트)만 만들 줄 알아서, 주소별 페이지 나누기(라우팅)·서버에서 미리 그려 보내기(SSR)·캐싱·서버 컴포넌트 실행 환경을 직접 조립해야 한다. 프레임워크는 이걸 기본으로 깔아준다. 그래서 React 공식 문서도 새 앱은 프레임워크로 시작하라고 권한다. 반대로 마케팅용 랜딩 페이지처럼 거의 정적인 사이트라면 Astro 같은 가벼운 도구가 더 어울린다.",
    code: `// Next.js App Router — 폴더 구조가 곧 주소(라우팅)다
app/
  page.tsx             →  /
  posts/
    page.tsx           →  /posts
    [id]/page.tsx      →  /posts/123   (동적 주소)

// React 만 쓴다면? → react-router 설치, SSR 서버 구성,
//   서버 컴포넌트 번들러 설정... 전부 직접 조립해야 한다`,
  },
  {
    id: "q-react-13",
    category: "React",
    question: "Tailwind CSS 같은 '유틸리티 우선' CSS 는 기존 CSS 와 뭐가 다른가?",
    answer:
      "기존 CSS 는 '맞춤 정장' — .card 같은 클래스 이름을 지어서 별도 파일에 스타일을 적는다. Tailwind 는 '레고 블록' — p-4(여백), bg-white(배경), rounded-lg(둥근 모서리) 같은 작은 기능 클래스를 HTML 에 바로 조립한다. 장점: 이름 짓기 고민이 없고, 파일을 왔다 갔다 안 해도 되고, 컴포넌트를 지우면 스타일도 같이 사라져서 '안 쓰는 CSS' 가 쌓이지 않는다. 단점: 클래스가 길어져 처음엔 지저분해 보인다. (이 앱 csStudy 도 Tailwind 로 만들어졌다.)",
    code: `/* 기존 CSS — 이름을 짓고, 파일을 오가야 한다 */
.card { padding: 16px; background: white; border-radius: 8px; }
<div className="card">...</div>

/* Tailwind — 블록을 그 자리에서 조립 */
<div className="p-4 bg-white rounded-lg">...</div>`,
  },
  {
    id: "q-react-14",
    category: "React",
    question: "shadcn/ui 가 '버전 없는 UI 라이브러리'라고 불리는 이유는?",
    answer:
      "보통 UI 라이브러리(MUI 등)는 '가구 렌탈'이다 — npm 으로 설치해서 빌려 쓰니까 모양을 바꾸기 어렵고, 업데이트(버전업) 때 깨질 수 있다. shadcn/ui 는 '가구 설계도 복사'다 — 명령어 한 줄이면 버튼·다이얼로그 같은 컴포넌트 소스 코드가 내 프로젝트 폴더에 그대로 복사된다. 이제 그 코드는 내 것이라 마음대로 고칠 수 있고, 따라갈 '라이브러리 버전'이 없다. 대신 원본이 개선돼도 자동으로 받지 못하니 필요하면 직접 다시 가져와야 한다. Tailwind 로 스타일링되고 아이콘은 Lucide 를 쓴다.",
    code: `# 설치가 아니라 '복사' — 소스가 내 폴더에 생긴다
npx shadcn@latest add button

# 결과
components/ui/button.tsx   ← 내 코드! 직접 수정 가능

// 사용
import { Button } from "@/components/ui/button";
<Button variant="outline">저장</Button>`,
  },
  {
    id: "q-react-15",
    category: "React",
    question: "TypeScript 를 쓰는데도 Zod 같은 검증 라이브러리가 필요한 이유는?",
    answer:
      "TypeScript 타입은 '설계도 검사'라서 빌드할 때만 존재하고, 실행되는 JS 에서는 싹 지워진다. 그런데 폼 입력·API 응답·URL 값은 실행 중에 바깥에서 들어오는 '택배'다 — 설계도가 아무리 완벽해도 택배 안에 뭐가 들었는지는 열어봐야 안다. Zod 는 실행 시점(런타임)에 택배를 열어 검사하는 검수원이다. 게다가 스키마 하나에서 타입을 뽑아낼 수 있어(z.infer) '검사 규칙'과 '타입'이 따로 놀지 않는다. 브라우저 쪽 검사는 사용자가 우회할 수 있으므로, 진짜 방어선은 서버(서버 액션 등)에서 Zod 로 검증하는 것이다.",
    code: `import { z } from "zod";

// 스키마 하나 = 런타임 검사 규칙 + 타입
const SignUp = z.object({
  email: z.string().email(),
  age: z.number().int().min(14),
});
type SignUp = z.infer<typeof SignUp>; // 타입은 자동으로 따라온다

// 서버 액션에서 검증 — 브라우저 검사는 우회 가능하니까 여기가 최종 방어선
const result = SignUp.safeParse(input);
if (!result.success) return { error: result.error.flatten() };`,
  },
  {
    id: "q-react-16",
    category: "React",
    question: "검색어·정렬·페이지 번호를 useState 대신 URL 에 두는 이유는?",
    answer:
      "useState 는 '머릿속 메모'라 새로고침하면 날아가고 남에게 줄 수도 없다. URL 은 '책갈피'다 — ?q=react&sort=new&page=2 처럼 주소에 적어두면 새로고침해도 그대로고, 링크를 복사해 보내면 상대도 똑같은 화면을 보며, 뒤로가기도 자연스럽게 동작한다. 게다가 서버 컴포넌트가 URL 을 읽어 처음부터 그 상태로 그려줄 수 있다. 다만 URL 값은 전부 문자열이라 숫자 변환·기본값 처리가 귀찮은데, nuqs 같은 라이브러리가 이를 타입 있는 useState 처럼 쓰게 해준다.",
    code: `// ❌ 새로고침·공유 시 사라짐
const [page, setPage] = useState(1);

// ✅ nuqs — useState 처럼 쓰지만 값은 URL(?page=2)에 산다
import { useQueryState, parseAsInteger } from "nuqs";
const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
// setPage(2) → 주소가 /posts?page=2 로 바뀐다`,
  },
  {
    id: "q-react-17",
    category: "React",
    question: "서버 컴포넌트·URL 상태·React Query 가 자리 잡으면서 전역 상태 라이브러리(Zustand 등)의 비중이 줄어든 이유는?",
    answer:
      "예전엔 '집 안의 모든 물건을 창고 하나(전역 스토어)'에 넣었다. 그런데 물건을 종류별로 나눠보니 각자 더 잘 맞는 자리가 생겼다. ① 서버 데이터(게시글 목록 등) → 서버 컴포넌트가 바로 가져오거나, 클라이언트에선 React Query 가 캐시로 관리. ② 검색·필터·페이지 → URL. ③ 폼 입력 → 폼 자신(서버 액션). 이렇게 빼고 나면 진짜 '클라이언트 전용 전역 상태'(테마, 열린 사이드바 등)는 얼마 안 남는다. 그래서 Zustand 는 '필수'에서 '남은 것만 담는 선택'이 됐다. 판단 기준: 이 값의 진짜 주인이 누구인가(서버? URL? 이 화면?)를 먼저 묻고, 주인이 브라우저 전역일 때만 스토어에 넣는다.",
    code: `// 상태의 '주인'별로 자리 배정
// 서버 데이터      → 서버 컴포넌트 / React Query
const posts = await db.post.findMany();             // RSC
const { data } = useQuery({ queryKey: ["posts"], queryFn: fetchPosts });

// 공유되는 화면 조건 → URL
const [q, setQ] = useQueryState("q");

// 화면 하나만 쓰는 값 → useState
const [open, setOpen] = useState(false);

// 진짜 클라이언트 전역 → 그때만 Zustand
const theme = useAppStore((s) => s.theme);`,
  },
  {
    id: "q-react-18",
    category: "React",
    question: "React Testing Library 와 Playwright(또는 Cypress)는 무엇을 테스트하나?",
    answer:
      "React Testing Library 는 '부품 검사' — 컴포넌트 하나를 가짜 브라우저(jsdom)에 띄워, 사용자처럼 버튼을 찾고 눌러서 결과를 확인한다(통합·단위 테스트). Playwright·Cypress 는 '완성차 시승' — 진짜 브라우저로 실제 앱을 열어 로그인부터 결제까지 처음부터 끝까지 돌려본다(E2E 테스트). 부품 검사는 빠르고 많이, 시승은 느리지만 핵심 흐름 위주로 — 둘을 섞어 쓰는 게 일반적이다.",
    code: `// React Testing Library — 컴포넌트 단위 (빠름)
render(<Counter />);
await userEvent.click(screen.getByRole("button", { name: "+" }));
expect(screen.getByText("1")).toBeInTheDocument();

// Playwright — 실제 브라우저로 전체 흐름 (느리지만 현실적)
await page.goto("/login");
await page.fill("#email", "me@test.com");
await page.click("text=로그인");
await expect(page).toHaveURL("/dashboard");`,
  },
  {
    id: "q-react-19",
    category: "React",
    question: "Supabase 같은 올인원 서비스를 쓰면서도 'DB 기능만' 쓰고 ORM(Prisma)으로 접근하는 전략의 이유는?",
    answer:
      "올인원 서비스는 '풀옵션 원룸'이다 — DB·인증·파일 저장·실시간 기능이 다 붙어 있어 편하지만, 전부 쓰기 시작하면 이사(다른 서비스로 교체)가 거의 불가능해진다(벤더 종속, vendor lock-in). 그래서 Supabase 는 그냥 'PostgreSQL 을 빌려주는 곳'으로만 쓰고, 코드는 Prisma 같은 ORM 을 통해 표준 SQL DB 에 말하게 한다. 그러면 나중에 Neon·RDS 등 다른 Postgres 로 옮겨도 연결 주소만 바꾸면 된다. 인증도 같은 이유로 외부 서비스 대신 Lucia 의 안내를 따라 직접 구현하기도 한다. 트레이드오프: 편의 기능을 포기하고 직접 짜는 비용을 내는 대신, 교체 가능성(유연성)을 산다.",
    code: `// schema.prisma — 코드는 'Postgres' 하고만 대화한다
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL") // ← Supabase 든 RDS 든 이 주소만 바꾸면 끝
}

// 앱 코드는 어떤 호스팅인지 모른다
const user = await prisma.user.findUnique({ where: { email } });`,
  },
  {
    id: "q-ts-1",
    category: "TypeScript",
    question: "interface 와 type 의 실용적 차이는?",
    answer:
      "interface = 조립 블록. 같은 이름으로 또 선언하면 자동으로 합쳐지고 (선언 병합), extends 로 확장하기 좋다. type = 만능 별명 짓기. 유니온(A | B), 인터섹션(A & B) 등 표현이 자유롭다. 외부에 공개하는 API 모양은 interface, 복잡한 타입 조합은 type — 이 정도로 기억하면 된다.",
    code: `// interface: 같은 이름이면 자동으로 "합체"된다
interface User { name: string }
interface User { age: number }
// → User는 { name: string; age: number } ✅

// type: 합체는 안 되지만 표현이 자유롭다
type Id = string | number;          // 유니온 ✅
type ReadonlyUser = Readonly<User>; // 변형 ✅`,
  },
  {
    id: "q-ts-2",
    category: "TypeScript",
    question: "unknown 과 any 의 차이는?",
    answer:
      "any = 검사 면제권. 뭘 해도 컴파일러가 안 막는다 → 런타임에서 터진다. unknown = 정체불명 택배. \"안에 뭐가 들었는지 확인(typeof 등)하기 전엔 못 써\"라고 컴파일러가 강제한다. 같은 '모르는 값'이어도 unknown 이 훨씬 안전한 이유.",
    code: `const a: any = "hello";
a.foo.bar(); // 컴파일 통과 😱 → 실행하면 터진다

const u: unknown = "hello";
u.toUpperCase(); // ❌ 에러 — "먼저 열어서 확인해!"

if (typeof u === "string") {
  u.toUpperCase(); // ✅ 확인(narrowing) 후엔 OK
}`,
  },
  {
    id: "q-ts-3",
    category: "TypeScript",
    question: "as const 의 효과는?",
    answer:
      "\"이 값을 지금 모습 그대로 얼려줘\"라는 뜻. ① 타입이 string 처럼 넓어지지 않고 \"red\" 라는 정확한 글자(리터럴)로 고정되고 ② readonly 가 붙어 수정도 막힌다. 상수 목록에서 유니온 타입을 뽑아낼 때 단골로 쓴다.",
    code: `const COLORS = ["red", "blue"];
// 타입: string[] — 너무 넓다

const COLORS2 = ["red", "blue"] as const;
// 타입: readonly ["red", "blue"] — 그대로 얼림 🧊

// 얼려둔 배열에서 유니온 타입 뽑기 (단골 패턴)
type Color = (typeof COLORS2)[number]; // "red" | "blue"`,
  },
  {
    id: "q-ts-4",
    category: "TypeScript",
    question: "제네릭 제약(extends)을 쓰는 이유는?",
    answer:
      "클럽 입장 조건 같은 것. <T extends { id: string }> = \"어떤 타입이든 환영하지만, 최소한 id 는 갖고 와야 입장 가능\". 이 조건 덕분에 함수 안에서 안심하고 item.id 를 쓸 수 있고, 동시에 들어온 타입의 나머지 정보(name 등)도 잃지 않는다.",
    code: `// "최소한 id: string은 있어야 입장 가능" 이라는 조건
function logId<T extends { id: string }>(item: T): T {
  console.log(item.id); // ✅ id가 있다고 보장됨
  return item;          // 들어온 타입 T 그대로 반환
}

const r = logId({ id: "a", name: "yumin" });
r.name; // ✅ name 정보도 안 잃었다 (any였으면 잃음)`,
  },
  {
    id: "q-ts-5",
    category: "TypeScript",
    question: "유니온 타입(A | B)은 어떻게 안전하게 다루나?",
    answer:
      "공항 입국심사와 같다. 여권을 확인하기 전엔 어느 나라 사람인지 모르니 함부로 대할 수 없다. typeof / in / switch 로 '확인'을 하고 나면, 그 분기 안에서는 컴파일러가 타입을 확정해준다 — 이걸 내로잉(narrowing, 타입 좁히기)이라고 한다. 확인 없이 쓰려고 하면 컴파일러가 막아준다.",
    code: `function format(v: string | number) {
  // 여기서 v 는 아직 "누군지 모르는 사람"
  // v.toUpperCase(); // ❌ number 일 수도 있어서 에러

  if (typeof v === "string") {
    return v.toUpperCase(); // ✅ 이 분기 안에선 string 확정
  }
  return v.toFixed(2);      // ✅ 남은 건 number 뿐 — 자동 확정
}

// 객체 유니온은 in 으로 확인
type Cat = { meow: () => void };
type Dog = { bark: () => void };
function play(pet: Cat | Dog) {
  if ("meow" in pet) pet.meow(); // ✅ Cat 확정
  else pet.bark();               // ✅ Dog 확정
}`,
  },
  {
    id: "q-ts-6",
    category: "TypeScript",
    question: "Partial / Pick / Omit 같은 유틸리티 타입은 언제 쓰나?",
    answer:
      "원본 설계도를 복사해서 필요한 부분만 오려 쓰는 도구다. Partial<T> = 모든 칸을 '선택 사항'으로 (수정 폼처럼 일부만 채울 때), Pick<T, K> = 필요한 칸만 오려내기, Omit<T, K> = 특정 칸만 빼고 나머지 전부. 원본 타입 하나만 고치면 파생 타입들이 자동으로 따라오니, 같은 모양을 여러 번 손으로 베끼지 않아도 된다.",
    code: `interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

// Partial: 전부 선택 사항 — "바꿀 것만 보내" (수정 API)
function updateUser(id: string, patch: Partial<User>) { /* ... */ }
updateUser("u1", { name: "yumin" }); // ✅ name 만 보내도 OK

// Pick: 필요한 칸만 오려내기
type LoginForm = Pick<User, "email" | "password">;

// Omit: 위험한 칸만 빼고 전부
type PublicUser = Omit<User, "password">; // 화면에 내보낼 안전한 모양`,
  },
  {
    id: "q-ts-7",
    category: "TypeScript",
    question: "타입 단언(as)은 왜 조심해서 써야 하나?",
    answer:
      "검표원에게 \"나 VIP 맞아요\"라고 우기고 통과하는 것과 같다. as 는 컴파일러의 검사를 '끄는' 것이지, 값을 실제로 바꾸거나 확인해주는 게 아니다. 우긴 내용이 틀리면 컴파일은 통과하고 런타임에서 터진다. DOM 요소 가져오기처럼 '내가 컴파일러보다 확실히 더 아는' 상황에서만 최소한으로 쓰고, 가능하면 typeof 같은 진짜 확인(내로잉)으로 대체한다.",
    code: `// ❌ 위험: 우기기만 하고 확인은 안 했다
const data = JSON.parse(raw) as { name: string };
data.name.toUpperCase(); // raw 가 다른 모양이면 런타임에서 폭발 💥

// ✅ 진짜 확인(내로잉)이 우선
const parsed: unknown = JSON.parse(raw);
if (
  typeof parsed === "object" && parsed !== null && "name" in parsed
) {
  // 확인했으니 안전하게 사용
}

// 그나마 정당한 as — 컴파일러가 알 수 없는 DOM 구체 타입
const input = document.querySelector("#name") as HTMLInputElement;`,
  },
  {
    id: "q-ts-8",
    category: "TypeScript",
    question: "?.(옵셔널 체이닝)과 ??(널 병합)은 각각 뭘 해결하나?",
    answer:
      "둘 다 '값이 없을 수도 있다(undefined/null)'를 우아하게 다루는 문법. ?. = 택배 보관함 열어보기 — 칸이 비어있으면 거기서 멈추고 undefined 를 돌려준다 (에러 없이). ?? = 비어있으면 기본값으로 대체 — \"없으면 이걸로 해줘\". 주의: || 는 0 이나 빈 문자열도 '없음' 취급하지만, ?? 는 오직 null/undefined 만 걸러낸다.",
    code: `const user = { profile: undefined as { nickname?: string } | undefined };

// ❌ 옛날 방식 — 중간이 비면 TypeError
// const nick = user.profile.nickname;

// ✅ ?. — 중간이 비면 멈추고 undefined (에러 없음)
const nick = user.profile?.nickname;

// ✅ ?? — 없으면 기본값
const label = nick ?? "이름 없음";

// || 와의 차이 (면접 단골!)
const count = 0;
count || 10; // 10 — 0을 "없음" 취급 😱
count ?? 10; // 0  — null/undefined 만 거른다 ✅`,
  },

  {
    id: "q-arch-5",
    category: "구조설계",
    question: "패키지/폴더 구조에서 '계층'을 나누는 기준은?",
    answer:
      "변하는 이유가 같은 것끼리 묶는다. 프레젠테이션(화면)·도메인(규칙)·인프라(DB/외부 API) 로 나누면, 화면을 React로 바꿔도 규칙 코드는 그대로고, DB를 MySQL에서 Postgres로 바꿔도 영향 범위가 인프라 폴더 안에만 갇힌다. 반대로 MVC 처럼 파일 형식별로(folder: components, pages) 묶으면 한 기능을 바꿀 때 여러 폴더를 왔다갔다 해야 한다.",
    code: `// ❌ 기능 바꿀 때 여러 폴더를 왔다갔다 해야 함
/pages/Home.tsx
/components/HomeHeader.tsx
/components/HomeList.tsx
/api/home.ts

// ✅ 변경 이유(책임)별로 묶으면 한 폴더만 열어 끝남
/home/
  Home.tsx
  HomeHeader.tsx
  HomeList.tsx`,
  },
  {
    id: "q-arch-6",
    category: "구조설계",
    question: "API 응답을 일관된 형태로 만드는 이유는?",
    answer:
      "클라이언트가 '여기서부턴 성공·실패 데이터가 이렇게 온다'는 계약을 알고 있으면, 매번 케이스를 나눠서 처리하는 코드가 줄어든다. 그래서 보통 { ok, data?, error? } 같은 균일한 봉투로 감싸서 보낸다. 이건 문서이자, 실패 처리 규칙이기도 하다.",
    code: `// 일관된 응답 봉투
// 성공
{ ok: true, data: { id: 1, name: "yumin" } }

// 실패
{ ok: false, error: { code: "VALIDATION", message: "이름을 입력하세요" } }

// 클라이언트 처리도 단순화됨
if (res.ok) setUser(res.data);
else showToast(res.error.message);`,
  },
  {
    id: "q-arch-7",
    category: "구조설계",
    question: "상태관리 라이브러리를 꼭 써야 하나?",
    answer:
      "꼭 필요한 건 아니다. 먼저 컴포넌트 구조만으로 상태가 자연스럽게 흐르게 만들 수 있는지가 먼저다. 서로 먼 컴포넌트까지 일일이 전달하는 거만 피하면 그 자체로 복잡도가 많이 낮아진다. 그래서 1) 리프트업, 2) Context, 3) 전역 스토어 순으로 해결하는 게 권장 순서다.",
    code: `// 1) 리프트업이면 해결 — 그냥 부모로 옮기기
function Parent() {
  const [theme, setTheme] = useState("light");
  return <div><Header theme={theme} /><Main theme={theme} /></div>;
}

// 2) 자주 쓰는 값만 Context 로 꺼내 쓰기
const ThemeCtx = createContext(null);
function Parent() { return <ThemeCtx.Provider value={theme}>...</ThemeCtx.Provider>; }`,
  },
  {
    id: "q-arch-8",
    category: "구조설계",
    question: "도메인 주도 설계(DDD)의 핵심 의도는?",
    answer:
      "'기술이 아니라 문제 영역 자체'를 중심으로 설계하려는 시도다. 주문, 결제, 사용자 같은 핵심 개념을 엔티티·값 객체·서비스로 나눠서 코드에 녹이면, '뭘 만들고 있는지'가 코드만 봐도 드러난다. 기술 결정(DB, 프레임워크)이 나중에 바뀌어도 도메인 모델은 유지되는 게 장점이다.",
    code: `// 도메인 개념이 코드에 드러나는 예
class Order {
  addItem(item: Item, quantity: number) {
    // "수량은 0보다 커야 한다" 같은 규칙도 여기
    if (quantity <= 0) throw new Error("수량이 이상해요");
    this.items.push({ item, quantity });
  }
}`,
  },
  {
    id: "q-arch-9",
    category: "구조설계",
    question: "무상태(Stateless) 설계를 지키면 뭐가 좋나?",
    answer:
      "서버에 '사용자별 타이머·히스토리' 같은 메모리가 없으면, 노드(서버)를 아무거나 골라서 처리해도 된다. 그래서 트래픽이 몰릴 때 서버만 추가하면(스케일아웃) 처리 능력이 는다. 별도의 '이 사용자 전용 인스턴스'에 묶이는 상태풀(Stateful)과 대비되는 개념이다.",
    code: `// Stateful (나쁜 예): 서버 메모리에 세션 상태 저장
// → 같은 사용자는 무조건 같은 서버로 라우팅해야 함

// Stateless (좋은 예): JWT 를 요청마다 함께 보냄
Authorization: Bearer <token>
// → 어떤 서버가 처리해도 토큰만 검증하면 됨`,
  },
  {
    id: "q-arch-10",
    category: "구조설계",
    question: "유지보수성(Maintainability)을 높이는 가장 싸고 빠른 방법은?",
    answer:
      "의미 있는 이름 짓기다. 변수·함수·폴더 이름이 '지금 뭐하는지'를 드러내면, 다른 사람(또는 미래의 나)이 읽을 때 추측 비용이 사라진다. 나중에 리팩토링할 때도 이름만 잘 돼 있으면 구조 변경 범위를 빠르게 파악할 수 있다. 이건 언어나 기술에 상관없이 가장 기본이 되는 설계 습관이다.",
    code: `// ❌ 의도가 숨겨진 이름
const d = 3;
function f(x) { return x * d; }

// ✅ 의도가 드러나는 이름
const DAYS_IN_WEEK = 3;
function addDays(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}`,
  },
  // ─── 구조설계: 결합도·응집도 (정보처리기사 실기식) ───
  // 결합도(낮을수록 좋음): 자료 < 스탬프 < 제어 < 외부 < 공통 < 내용  (자스제외공내)
  // 응집도(높을수록 좋음): 우연 < 논리 < 시간 < 절차 < 교환 < 순차 < 기능  (우논시절교순기)
  {
    id: "q-arch-11",
    category: "구조설계",
    question: "결합도를 약한(좋은) 것부터 강한(나쁜) 것 순서로 바르게 나열한 것은?",
    options: [
      "자료 < 스탬프 < 제어 < 외부 < 공통 < 내용",
      "스탬프 < 자료 < 제어 < 공통 < 외부 < 내용",
      "자료 < 스탬프 < 외부 < 제어 < 공통 < 내용",
      "자료 < 제어 < 스탬프 < 외부 < 내용 < 공통",
    ],
    answer:
      "결합도는 두 모듈이 얼마나 단단히 엮였는지다. 이웃끼리 쪽지만 주고받으면 약하고, 남의 집 열쇠를 갖고 드나들면 강하다. 약할수록 좋다. 암기는 '자스제외공내'. ① 자료: 필요한 값 하나씩만 넘긴다. ② 스탬프: 배열이나 객체(자료 구조)를 통째로 넘긴다. ③ 제어: 플래그 같은 제어 신호를 넘겨 상대의 처리 흐름을 정한다. ④ 외부: 바깥의 같은 데이터 형식·프로토콜·장치를 함께 쓴다. ⑤ 공통: 전역 변수를 함께 쓴다. ⑥ 내용: 남의 모듈 내부를 직접 들여다보고 고친다. 뒤로 갈수록 한쪽을 고치면 다른 쪽이 깨질 범위가 넓어진다.",
  },
  {
    id: "q-arch-12",
    category: "구조설계",
    question: "ReportPrinter 와 GradeService 사이의 결합도는?",
    quizCode: `class Student { String name; int kor, eng, math; }

class GradeService {
    double average(Student s) {
        return (s.kor + s.eng + s.math) / 3.0;
    }
}
class ReportPrinter {
    void print(Student s) {
        double avg = new GradeService().average(s);
        System.out.println(s.name + " " + avg);
    }
}`,
    options: ["스탬프 결합도", "자료 결합도", "제어 결합도", "공통 결합도"],
    answer:
      "점수 세 개만 필요한데 학생 서류철을 통째로 건넨 상황이다. 이렇게 객체·배열·레코드 같은 자료 구조를 통째로 넘기면 스탬프 결합도다. 판별 단서는 넘기는 값의 모양이다. average 는 kor, eng, math 만 쓰는데 Student 객체 전체를 받는다. 그래서 Student 에 필드가 바뀌면 average 와 상관없는 변경에도 영향을 받을 수 있다. average(int kor, int eng, int math) 처럼 필요한 값만 넘기면 한 단계 약한 자료 결합도가 된다. 단순한 값 하나가 아니라서 자료 결합도가 아니고, 흐름을 바꾸는 플래그가 아니라서 제어 결합도도 아니다. 순서 암기: 자스제외공내(자료 < 스탬프 < 제어 < 외부 < 공통 < 내용).",
  },
  {
    id: "q-arch-13",
    category: "구조설계",
    question: "Main 과 Printer 사이의 결합도는?",
    quizCode: `class Printer {
    void print(String text, boolean upper) {
        if (upper) System.out.println(text.toUpperCase());
        else System.out.println(text.toLowerCase());
    }
}
class Main {
    void run() {
        new Printer().print("Hello", true);
    }
}`,
    options: ["제어 결합도", "자료 결합도", "스탬프 결합도", "내용 결합도"],
    answer:
      "식당 손님이 요리사에게 '불 세게, 소금 먼저' 하고 조리 순서까지 지시하는 상황이다. 넘기는 값이 결과를 만드는 재료가 아니라 상대의 처리 방법을 고르는 스위치면 제어 결합도다. 판별 단서는 받는 쪽 코드에 그 값으로 if 분기하는 부분이 있느냐다. upper 는 boolean 하나라 겉보기엔 자료 결합도 같지만, Printer 안에서 대문자로 찍을지 소문자로 찍을지를 이 플래그가 정한다(제어 플래그). 그러면 호출하는 쪽이 Printer 내부 동작 방식을 알아야 한다. printUpper(), printLower() 처럼 메서드를 나누면 플래그가 사라진다. 순서 암기: 자스제외공내.",
  },
  {
    id: "q-arch-14",
    category: "구조설계",
    question: "Admin 과 Menu 사이의 결합도는?",
    quizCode: `class Config {
    static int mode = 0;
}
class Admin {
    void login() { Config.mode = 1; }
}
class Menu {
    void show() {
        if (Config.mode == 1) System.out.println("관리자 메뉴");
        else System.out.println("일반 메뉴");
    }
}`,
    options: ["공통 결합도", "외부 결합도", "제어 결합도", "내용 결합도"],
    answer:
      "사무실 공용 화이트보드에 누구나 적고 지우는 상황이다. Admin 과 Menu 는 서로를 부르지도 않는데, 둘 다 Config.mode 라는 전역 변수(static 필드)를 같이 쓴다. 이렇게 전역 데이터를 공유하면 공통 결합도다. 판별 단서는 값을 매개변수로 주고받지 않고 모두가 보는 한 곳을 통해 엮였다는 점이다. 누가 언제 mode 를 바꿨는지 추적하기 어렵고, mode 를 고치면 그걸 쓰는 모든 클래스를 뒤져야 한다. 내용 결합도와 헷갈리기 쉬운데, 내용 결합도는 한 모듈이 다른 모듈의 내부 값이나 코드를 직접 건드리는 경우다(예: 다른 클래스의 private 해야 할 필드를 메서드를 거치지 않고 바로 고침). 여기선 공용 칸을 같이 쓸 뿐이라 공통이다. 순서 암기: 자스제외공내.",
  },
  {
    id: "q-arch-15",
    category: "구조설계",
    question: "run() 메서드의 응집도는?",
    quizCode: `class OrderJob {
    String read()       { return "3"; }
    int parse(String s) { return Integer.parseInt(s); }
    int price(int qty)  { return qty * 1000; }

    void run() {
        String raw = read();
        int qty = parse(raw);
        int total = price(qty);
        System.out.println(total);
    }
}`,
    options: ["순차적 응집도", "교환적 응집도", "절차적 응집도", "기능적 응집도"],
    answer:
      "공장 컨베이어 벨트처럼 앞 공정에서 나온 물건이 그대로 다음 공정으로 들어간다. read 의 출력 raw 가 parse 의 입력이 되고, parse 의 출력 qty 가 price 의 입력이 된다. 이렇게 앞 단계의 출력이 다음 단계의 입력이면 순차적 응집도다. 판별 단서는 변수 하나가 바로 다음 줄의 인자로 넘어가는 사슬이다. 절차적 응집도는 순서대로 실행만 할 뿐 데이터가 이어지지 않을 때고, 교환적 응집도는 여러 작업이 같은 입력을 나눠 쓸 때다. 응집도는 높을수록 좋고 순서 암기는 '우논시절교순기'(우연 < 논리 < 시간 < 절차 < 교환 < 순차 < 기능). 순차는 기능 바로 아래, 두 번째로 좋은 단계다.",
  },
  {
    id: "q-arch-16",
    category: "구조설계",
    question: "run() 메서드의 응집도는?",
    quizCode: `class ScoreReport {
    void run(int[] scores) {
        int sum = 0;
        for (int s : scores) sum += s;

        int max = 0;
        for (int s : scores) max = Math.max(max, s);

        System.out.println(sum + " " + max);
    }
}`,
    options: ["교환적 응집도", "순차적 응집도", "절차적 응집도", "시간적 응집도"],
    answer:
      "같은 재료(scores)를 두 요리사가 나눠 받아 하나는 합계를, 하나는 최댓값을 만든다. 서로의 결과를 기다리지 않고 같은 입력만 같이 쓴다. 이렇게 동일한 입력(또는 출력)을 쓰는 작업끼리 모여 있으면 교환적 응집도다. 판별 단서는 합계를 구하는 반복문과 최댓값을 구하는 반복문이 둘 다 scores 를 읽지만, sum 이 max 계산에 쓰이지 않는다는 점이다. sum 이 다음 계산의 입력으로 들어갔다면 순차적 응집도였다. 아무 데이터 연관 없이 순서대로 실행만 하면 절차적, 같은 시점(예: 프로그램 시작 시 초기화)에 한다는 이유만으로 묶으면 시간적이다. 응집도 순서 암기는 '우논시절교순기', 교환은 순차 바로 아래다.",
  },
  {
    id: "q-java-1",
    category: "Java",
    question: "JVM 이 뭐길래 자바는 \"한 번 작성하면 어디서든 실행\"이 되나?",
    answer:
      "자바 코드는 먼저 '바이트코드'라는 중간 언어로 번역되고, 각 컴퓨터에 설치된 JVM(자바 가상 머신)이 그걸 읽어서 실행한다. JVM = 나라마다 있는 통역사. 통역사만 있으면 같은 책(바이트코드)을 어느 나라(윈도우/맥/리눅스)에서든 읽어줄 수 있는 것.",
    code: `// Hello.java (사람이 쓴 코드)
//   ↓ 컴파일 (javac)
// Hello.class (바이트코드 = 만국 공용 중간 언어)
//   ↓ 실행
// 윈도우 JVM / 맥 JVM / 리눅스 JVM ← 통역사가 각자 실행!

public class Hello {
    public static void main(String[] args) {
        System.out.println("어느 OS에서든 안녕!");
    }
}`,
  },
  {
    id: "q-java-2",
    category: "Java",
    question: "클래스와 객체(인스턴스)의 차이는?",
    answer:
      "클래스 = 붕어빵 틀 (설계도), 객체 = 틀로 찍어낸 붕어빵 (실체). 틀은 하나지만 new 를 할 때마다 새 붕어빵이 만들어지고, 각자 팥/슈크림처럼 다른 속(필드 값)을 가질 수 있다. 서로 완전히 독립된 존재다.",
    code: `// 클래스 = 붕어빵 틀 (설계도)
public class Car {
    String color;
    void drive() {
        System.out.println(color + " 차가 달린다");
    }
}

// 객체 = 틀에서 찍어낸 붕어빵 (실체)
Car redCar = new Car();   // 1호 붕어빵
redCar.color = "빨강";
Car blueCar = new Car();  // 2호 — 서로 완전 별개!
blueCar.color = "파랑";

redCar.drive();  // "빨강 차가 달린다"
blueCar.drive(); // "파랑 차가 달린다"`,
  },
  {
    id: "q-java-3",
    category: "Java",
    question: "상속(extends)과 인터페이스(implements)의 차이는?",
    answer:
      "상속 = 부모의 능력을 통째로 물려받는 것. 부모는 딱 한 명만 가능하고, 물려받은 기능은 그냥 쓰면 된다. 인터페이스 = \"이건 할 줄 알아야 함\"이라는 자격증 목록. 여러 개를 동시에 딸 수 있지만, 각 기능은 직접 구현해야 한다.",
    code: `// 상속 = 부모 능력 물려받기 (부모는 1명만)
class Animal {
    void breathe() { System.out.println("숨쉬기"); }
}
class Dog extends Animal { }
// Dog는 breathe()를 거저 얻었다 ✅

// 인터페이스 = 자격증 (여러 개 OK, 구현은 직접)
interface Swimmable { void swim(); }
interface Barkable { void bark(); }

class SuperDog extends Animal implements Swimmable, Barkable {
    public void swim() { System.out.println("수영!"); } // 직접 구현
    public void bark() { System.out.println("멍멍!"); } // 직접 구현
}`,
  },
  {
    id: "q-java-4",
    category: "Java",
    question: "== 와 equals() 의 차이는?",
    answer:
      "== 는 \"같은 집(메모리 주소)에 사니?\", equals() 는 \"내용물이 같니?\"를 묻는다. 내용이 똑같은 문자열도 서로 다른 집에 살 수 있어서, == 로 비교하면 false 가 나올 수 있다. 그래서 문자열 비교는 무조건 equals().",
    code: `String a = new String("hello"); // 1번 집에 사는 "hello"
String b = new String("hello"); // 2번 집에 사는 "hello"

a == b;        // false! — "같은 집에 사니?" → 아니요
a.equals(b);   // true  — "내용이 같니?" → 네!

// 자바 면접 단골 + 실수 1순위:
// 문자열 비교는 항상 equals()`,
  },
  {
    id: "q-java-5",
    category: "Java",
    question: "오버로딩(Overloading)과 오버라이딩(Overriding)의 차이는?",
    answer:
      "오버로딩 = 같은 이름 메뉴에 옵션 추가. 한 클래스 안에서 이름은 같지만 매개변수가 다른 메서드를 여러 개 두는 것 (아메리카노 톨/그란데). 오버라이딩 = 프랜차이즈 지점이 본사 레시피를 자기 식으로 다시 만들기. 상속받은 부모의 메서드를 자식이 같은 시그니처로 재정의하는 것. 로딩은 '가로로' 늘리고, 라이딩은 '세로로' 덮어쓴다고 기억하면 된다.",
    code: `// 오버로딩 — 같은 이름, 다른 매개변수 (한 클래스 안)
class Cafe {
    Coffee order(String menu) { /* 기본 사이즈 */ }
    Coffee order(String menu, String size) { /* 사이즈 지정 */ }
}

// 오버라이딩 — 부모 레시피를 자식이 재정의 (상속 관계)
class Animal {
    void sound() { System.out.println("..."); }
}
class Dog extends Animal {
    @Override                     // "본사 레시피 덮어씀" 표시
    void sound() { System.out.println("멍멍!"); }
}`,
  },
  {
    id: "q-java-6",
    category: "Java",
    question: "static 키워드가 붙으면 뭐가 달라지나?",
    answer:
      "교실의 칠판 같은 것. 학생(인스턴스)마다 하나씩 있는 게 아니라, 교실(클래스)에 딱 하나 있어서 모두가 공유한다. 그래서 new 없이 클래스 이름으로 바로 접근하고, 객체를 아무리 많이 만들어도 static 필드는 하나뿐이다. '개별 물건'이 아니라 '공용 물건'에만 붙여야 한다 — 남용하면 전역 변수처럼 어디서 바뀌었는지 추적이 힘들어진다.",
    code: `class Student {
    String name;                  // 학생마다 하나 (인스턴스 소유)
    static String classroom = "3반"; // 교실에 하나 (클래스 소유)

    static int count = 0;         // 전체 학생 수 세기에 딱
    Student(String name) {
        this.name = name;
        count++;                  // 모두가 같은 count 를 공유
    }
}

new Student("철수");
new Student("영희");
Student.count;      // 2 — new 없이 클래스 이름으로 접근
Student.classroom;  // "3반"`,
  },
  {
    id: "q-java-7",
    category: "Java",
    question: "Checked 예외와 Unchecked 예외의 차이는?",
    answer:
      "Checked = 일기예보에 나온 비. 미리 알 수 있는 사고(파일 없음, 네트워크 끊김)라서, 컴파일러가 \"우산(try-catch 또는 throws) 챙겼어?\"를 검사하고 안 챙기면 컴파일을 막는다. Unchecked = 갑작스런 소나기 (RuntimeException — NullPointerException 등). 대부분 코드 버그라서 잡기보다는 원인을 고치는 게 맞고, 컴파일러도 강제하지 않는다.",
    code: `// Checked — 컴파일러가 "우산 챙겨!" 강제
try {
    Files.readString(Path.of("data.txt")); // 파일이 없을 수 있음
} catch (IOException e) {                  // 안 잡으면 컴파일 에러!
    System.out.println("파일이 없네요");
} finally {
    System.out.println("성공하든 실패하든 항상 실행"); // 자원 정리용
}

// Unchecked — 컴파일러는 침묵, 런타임에 터짐
String s = null;
s.length(); // NullPointerException 💥
// → try-catch 보다 "null 이 안 들어오게" 코드를 고치는 게 정답`,
  },
  {
    id: "q-java-8",
    category: "Java",
    question: "ArrayList 와 HashMap 은 언제 각각 쓰나?",
    answer:
      "ArrayList = 번호표 순서대로 줄 세운 목록. 순서가 있고, n번째를 바로 꺼낼 수 있다 (인덱스 접근). '순서대로 쌓이는 것들'(주문 내역, 게시글 목록)에 쓴다. HashMap = 이름표 붙은 사물함. 순서는 없지만 이름표(key)만 알면 뒤지지 않고 즉시 꺼낸다. 'X로 Y를 찾는' 관계(학번→학생, id→유저)에 쓴다.",
    code: `// ArrayList — 순서 있는 목록 (번호표)
List<String> orders = new ArrayList<>();
orders.add("아메리카노");   // 0번
orders.add("라떼");         // 1번
orders.get(0);              // "아메리카노" — n번째 바로 접근

// HashMap — 이름표로 바로 찾기 (사물함)
Map<String, Integer> stock = new HashMap<>();
stock.put("아메리카노", 10);
stock.put("라떼", 5);
stock.get("라떼");          // 5 — 목록을 안 뒤지고 즉시!

// 목록에서 찾으면 처음부터 훑어야 함 (느림) ← 이 차이가 핵심`,
  },
  {
    id: "q-java-9",
    category: "Java",
    question: "int 와 Integer 는 뭐가 다른가? (기본형 vs 참조형)",
    answer:
      "int = 숫자를 직접 담은 맨손. 값 자체라 비어 있을 수 없고, 아무것도 안 넣으면 0 이다 (기본형, primitive). Integer = 숫자를 담은 상자. 상자라서 '아직 아무것도 없음'(null)을 표현할 수 있다 (참조형, wrapper 클래스). JS 에선 number 하나로 끝나지만, 자바는 TS 의 number 와 number | null 을 타입 이름으로 구분하는 셈. 그래서 DB 에서 비어 있을 수 있는 값이나 List<Integer> 같은 컬렉션에는 Integer 를 쓴다. 주의: null 인 Integer 를 int 에 넣는 순간(언박싱) NullPointerException 이 터지고, Integer 끼리는 == 대신 equals() 로 비교해야 한다.",
    code: `int count = 0;          // 맨손: null 불가, 기본값 0
Integer age = null;     // 상자: "아직 모름" 표현 가능 ✅
// int bad = null;      // ❌ 컴파일 에러

// 회사 코드에서 자주 보는 모양
class UserForm {
    Integer age;        // 폼에서 안 채우면 null → "미입력" 구분 가능
}

List<Integer> nums = new ArrayList<>(); // 컬렉션엔 상자만 들어감
// List<int> nums;      // ❌ 기본형은 못 넣음

int n = age;            // 💥 age 가 null 이면 NullPointerException (언박싱)

// TS 로 치면
// let count: number = 0;
// let age: number | null = null;`,
  },
  {
    id: "q-java-10",
    category: "Java",
    question: "배열(int[])과 ArrayList 는 언제 각각 쓰나? JS 배열과 비교하면?",
    answer:
      "배열 = 칸 수가 정해진 계란판. 만들 때 크기를 정하면 끝까지 그대로라, 칸을 늘리려면 새 판을 사야 한다 (고정 길이, .length). ArrayList = 늘어나는 고무줄 가방. add 할 때마다 알아서 커진다 (가변 길이, .size()). JS 배열은 push 로 마음대로 늘어나니까 자바로 치면 배열이 아니라 ArrayList 쪽에 가깝다. 실무(스프링) 코드는 대부분 List<T> + ArrayList 를 쓰고, 배열은 main(String[] args) 나 크기가 정해진 경우 정도에만 보인다.",
    code: `// 배열 — 계란판 (크기 고정)
int[] scores = new int[3];   // 칸 3개, 기본값 0
scores[0] = 90;
scores.length;               // 3 (괄호 없음!)
// scores[3] = 70;           // 💥 ArrayIndexOutOfBoundsException

// ArrayList — 고무줄 가방 (크기 가변)
List<Integer> list = new ArrayList<>();
list.add(90);
list.add(80);                // 알아서 늘어남
list.size();                 // 2 (메서드라 괄호 있음)
list.get(0);                 // 90 — arr[0] 대신 get(0)

// JS 배열 = ArrayList 에 가까움
// const arr = []; arr.push(90); arr.length;`,
  },
  {
    id: "q-java-11",
    category: "Java",
    question: "생성자(constructor)와 this 는 뭔가?",
    answer:
      "생성자 = 붕어빵이 틀에서 나오는 순간 속을 채워 넣는 작업. new 할 때 딱 한 번 자동으로 불리고, 클래스와 이름이 같으며 반환 타입이 없다. this = '지금 만들어지고 있는 나 자신'. 매개변수 name 과 필드 name 이 이름이 같을 때 this.name 이 '내 필드'를 가리켜 둘을 구분해준다 (부모를 가리키는 건 super). JS 의 class constructor(name) { this.name = name } 과 거의 같은 모양이다. 생성자를 하나도 안 쓰면 자바가 빈 기본 생성자를 만들어주지만, 하나라도 직접 쓰면 기본 생성자는 사라진다. 스프링 코드에서는 서비스가 필요한 부품(Repository 등)을 생성자로 받는 모양(생성자 주입)을 아주 자주 본다.",
    code: `public class User {
    private String name;
    private int age;

    // 생성자: 클래스 이름과 같고, 반환 타입 없음
    public User(String name, int age) {
        this.name = name;   // this.name = 내 필드, name = 매개변수
        this.age = age;
    }
}

User u = new User("철수", 20); // new 할 때 생성자 호출

// JS 로 치면 거의 똑같다
// class User {
//   constructor(name, age) { this.name = name; this.age = age; }
// }

// 스프링에서 자주 보는 생성자 주입
@Service
public class UserService {
    private final UserRepository repo;
    public UserService(UserRepository repo) { this.repo = repo; }
}`,
  },
  {
    id: "q-java-12",
    category: "Java",
    question: "for / for-each / while 은 언제 각각 쓰나? (JS for...of 와 비교)",
    answer:
      "for = 번호표를 직접 세면서 도는 반복. 몇 번째인지(i)가 필요할 때 쓴다 (JS 의 for (let i = 0; ...) 와 똑같다). for-each = 줄 선 사람을 앞에서부터 하나씩 데려오기. 번호 없이 요소만 차례로 꺼내고, JS 의 for...of 와 같다 (키를 꺼내는 for...in 과 헷갈리지 말 것). while = '조건이 참인 동안 계속'. 몇 번 돌지 미리 모를 때 쓴다. 회사 Thymeleaf 의 th:each 도 결국 for-each 와 같은 생각이다. 주의: for-each 로 도는 도중에 그 리스트에서 remove 하면 ConcurrentModificationException 이 난다.",
    code: `List<String> names = List.of("철수", "영희", "민수");

// for — 번호(i)가 필요할 때
for (int i = 0; i < names.size(); i++) {
    System.out.println(i + "번: " + names.get(i));
}

// for-each — 요소만 차례로 (JS for...of 와 같음)
for (String name : names) {
    System.out.println(name);
}
// JS: for (const name of names) { console.log(name); }

// while — 몇 번 돌지 모를 때
int n = 100;
while (n > 1) {
    n = n / 2;
}

// Thymeleaf 도 같은 생각
// <li th:each="name : \${names}" th:text="\${name}"></li>`,
  },
  {
    id: "q-java-13",
    category: "Java",
    question: "캡슐화란? private 과 getter/setter 는 왜 쓰나?",
    answer:
      "캡슐화 = 은행 금고와 창구. 돈(필드)은 금고 안에 잠가두고(private), 손님은 창구(public getter/setter 메서드)를 통해서만 넣고 뺀다. 창구에서 '음수 입금은 안 돼요' 같은 규칙을 검사할 수 있어서, 아무 데서나 값이 망가지는 걸 막는다. React 로 치면 state 를 직접 바꾸지 않고 setState 로만 바꾸는 것과 같은 정신. 접근제어자는 네 단계: public(어디서나) > protected(같은 패키지 + 자식) > (아무것도 안 씀 = default, 같은 패키지만) > private(그 클래스 안에서만). 회사 코드에서 @Getter/@Setter 는 Lombok 이 getter/setter 를 자동으로 만들어주는 것이고, Thymeleaf 의 ${user.name} 도 실은 getName() 을 부른다.",
    code: `public class Account {
    private int balance;           // 금고: 밖에서 직접 못 만짐

    public int getBalance() {      // 창구: 조회
        return balance;
    }

    public void deposit(int amount) { // 창구: 규칙 검사 후 변경
        if (amount <= 0) throw new IllegalArgumentException("음수 입금 불가");
        balance += amount;
    }
}

Account acc = new Account();
// acc.balance = -999;   // ❌ 컴파일 에러 (private)
acc.deposit(1000);       // ✅ 창구를 통해서만

// React 로 치면: state 직접 수정 ❌, setState 로만 ✅
// Lombok: @Getter @Setter 를 붙이면 위 메서드들을 자동 생성`,
  },
  {
    id: "q-java-14",
    category: "Java",
    question: "다형성이란? 부모 타입 변수에 자식 객체를 담으면 어떻게 되나?",
    answer:
      "다형성 = '동물' 이라고 적힌 목줄. 목줄(변수 타입)에는 동물이라고 써 있지만, 실제로 묶인 건 개일 수도 고양이일 수도 있다. 소리 내라(sound())고 하면 목줄 글씨가 아니라 실제 묶인 녀석이 짖거나 운다. 규칙은 두 개: ① 부를 수 있는 메서드는 변수 타입(Animal)이 정한다 — Animal 에 없는 메서드는 컴파일 에러. ② 실제로 실행되는 내용은 담긴 객체(Dog)가 정한다 — 오버라이딩한 자식 버전이 돈다. 덕분에 호출하는 쪽은 상대가 누군지 몰라도 된다. React 에서 같은 props 모양만 맞추면 어떤 컴포넌트든 끼울 수 있는 것과 비슷하다. 스프링의 List<String> list = new ArrayList<>() 나 UserService 인터페이스에 구현체를 끼우는 모양이 전부 이것.",
    code: `class Animal {
    void sound() { System.out.println("..."); }
}
class Dog extends Animal {
    @Override void sound() { System.out.println("멍멍"); }
    void fetch() { System.out.println("공 가져옴"); }
}
class Cat extends Animal {
    @Override void sound() { System.out.println("야옹"); }
}

Animal a = new Dog();   // 목줄엔 '동물', 실제론 개
a.sound();              // "멍멍" ← ② 실행은 실제 객체 기준
// a.fetch();           // ❌ ① Animal 목줄엔 fetch 가 없음

List<Animal> pets = List.of(new Dog(), new Cat());
for (Animal p : pets) p.sound(); // 멍멍, 야옹 — 부르는 쪽은 몰라도 됨

// 실무에서 매일 보는 다형성
List<String> list = new ArrayList<>();`,
  },
  {
    id: "q-java-15",
    category: "Java",
    question: "제네릭 <T> 는 뭔가? TS 제네릭과 같은가?",
    answer:
      "제네릭 = 라벨 칸이 비어 있는 보관함. 만드는 쪽은 '여기 뭐가 들어갈지는 몰라'라며 T 로 비워두고, 쓰는 쪽이 <String> 처럼 채워 넣는다. 한 번 채우면 그 타입만 들어가서, 꺼낼 때 형변환 없이 안전하다 (컴파일 타임 타입 검사). TS 의 Array<string>, useState<number>() 와 생각이 똑같다. 차이 하나: 자바 제네릭에는 int 같은 기본형을 못 넣어서 List<Integer> 처럼 참조형을 써야 한다. 회사 코드에서 ResponseEntity<User>, Optional<User>, JpaRepository<User, Long> 처럼 꺾쇠가 보이면 '빈칸에 이 타입을 채웠구나' 로 읽으면 된다.",
    code: `// 만드는 쪽: T 로 비워둔다
class Box<T> {
    private T item;
    void put(T item) { this.item = item; }
    T get() { return item; }
}

// 쓰는 쪽: 빈칸을 채운다
Box<String> box = new Box<>();   // <> 는 왼쪽 보고 추론 (다이아몬드)
box.put("사과");
String s = box.get();            // 형변환 필요 없음
// box.put(123);                 // ❌ 컴파일 에러

// List<int> nums;               // ❌ 기본형 불가
List<Integer> nums = new ArrayList<>(); // ✅

// TS 와 똑같은 생각
// class Box<T> { item!: T }
// const [n, setN] = useState<number>(0);`,
  },
  // ─── Java 출력 추적 (정보처리기사 실기식: 코드 보고 출력 고르기) ───
  // quizCode = 앞면 코드, options[0] = 정답. 모든 출력은 JDK 21 로 실제 실행해 확인했다.
  {
    id: "q-java-16",
    category: "Java",
    question: "다음 코드의 출력 결과는?",
    quizCode: `class Parent {
    int x = 10;
    Parent() {
        System.out.print("P");
        show();
    }
    void show() { System.out.print("p" + x); }
}
class Child extends Parent {
    int x = 20;
    Child() {
        System.out.print("C");
    }
    void show() { System.out.print("c" + x); }
}
public class Test {
    public static void main(String[] args) {
        Parent a = new Child();
        System.out.print(a.x);
    }
}`,
    options: ["Pc0C10", "Pc20C10", "Pp10C10", "Pc0C20"],
    answer:
      "집을 지을 때 1층(부모)을 먼저 올리고 2층(자식)을 올린다. 그런데 1층 공사 중에 2층 방 불을 켜 보면 아직 아무것도 없다. 실행 순서대로 따라가 보자. ① new Child() 를 하면 Child 생성자 첫 줄에 숨어 있는 super() 가 먼저 돈다. ② Parent 쪽 필드 x 에 10 이 들어가고 P 를 찍는다. ③ show() 를 부르는데, 실제 객체가 Child 라서 Child 의 show 가 불린다(동적 바인딩). ④ 이때 Child 의 x 는 아직 20 이 들어가기 전이라 기본값 0 이다. 그래서 c0 이 찍힌다. ⑤ 부모 생성자가 끝나면 그제야 Child 의 x 에 20 이 들어가고 C 를 찍는다. ⑥ a.x 는 메서드가 아니라 필드다. 필드는 덮어쓰기가 안 되고 변수 타입(Parent)의 x 를 본다(필드 숨김). 그래서 10. 합치면 Pc0C10. 메서드는 실제 객체를 따라가고, 필드는 변수 타입을 따라간다.",
  },
  {
    id: "q-java-17",
    category: "Java",
    question: "다음 코드의 출력 결과는?",
    quizCode: `class A {
    static { System.out.print("1"); }
    { System.out.print("2"); }
    A() { System.out.print("3"); }
}
class B extends A {
    static { System.out.print("4"); }
    { System.out.print("5"); }
    B() { System.out.print("6"); }
}
public class Test {
    public static void main(String[] args) {
        new B();
        new B();
    }
}`,
    options: ["1423562356", "142356142356", "1234562356", "123456123456"],
    answer:
      "가게 개업식은 한 번만 하고, 손님은 올 때마다 맞는다. static 블록이 개업식이고 인스턴스 블록과 생성자가 손님맞이다. ① 처음 B 를 쓰려면 클래스를 메모리에 올려야 한다(클래스 로딩). 부모 A 가 먼저 올라가서 1, 그다음 B 가 올라가서 4. ② 객체를 만들 때는 부모 몫부터 끝낸다. A 의 인스턴스 블록 2, A 생성자 3. ③ 그다음 B 의 인스턴스 블록 5, B 생성자 6. 여기까지 142356. ④ 두 번째 new B() 에서는 클래스가 이미 올라가 있어서 static 블록(1, 4)은 다시 안 돈다. 2356 만 찍힌다. 합치면 1423562356. 순서 공식: 부모 static, 자식 static, 그다음 객체마다 부모(블록, 생성자), 자식(블록, 생성자).",
  },
  {
    id: "q-java-18",
    category: "Java",
    question: "다음 코드의 출력 결과는?",
    quizCode: `class A {
    static String s() { return "A"; }
    String i() { return "a"; }
}
class B extends A {
    static String s() { return "B"; }
    String i() { return "b"; }
}
public class Test {
    public static void main(String[] args) {
        A obj = new B();
        System.out.print(obj.s() + obj.i());
    }
}`,
    options: ["Ab", "Bb", "Aa", "Ba"],
    answer:
      "static 메서드는 반 공용 칠판이고, 일반 메서드는 학생 각자의 공책이다. 칠판은 반 이름표(변수 타입)를 보고 찾아가고, 공책은 실제 학생(객체)을 보고 찾아간다. ① obj.s() 는 static 이라 객체를 안 본다. 변수 타입이 A 라서 A 의 s() 가 불려 A 가 나온다. 자식이 같은 이름을 만들어도 덮어쓰기가 아니라 가리기일 뿐이다(메서드 숨김, hiding). ② obj.i() 는 일반 메서드라 실제 객체 B 의 i() 가 불린다(오버라이딩, 동적 바인딩). b 가 나온다. 합치면 Ab. static 메서드는 원래 obj.s() 가 아니라 A.s() 처럼 클래스 이름으로 부르는 게 맞고, 그렇게 쓰면 헷갈릴 일이 없다.",
  },
  {
    id: "q-java-19",
    category: "Java",
    question: "다음 코드의 출력 결과는?",
    quizCode: `public class Test {
    static void p(Object o) { System.out.print("O"); }
    static void p(String s) { System.out.print("S"); }

    public static void main(String[] args) {
        Object x = "hi";
        p(x);
        p("hi");
        p(null);
    }
}`,
    options: ["OSS", "SSS", "OSO", "SSO"],
    answer:
      "택배 기사가 상자 겉면 라벨만 보고 창고를 고른다고 생각하면 된다. 상자 안에 뭐가 들었는지는 안 열어 본다. 오버로딩은 컴파일할 때 변수의 선언 타입(라벨)만 보고 어느 메서드를 부를지 정한다(정적 바인딩). ① p(x): 안에는 문자열이 들어 있지만 라벨이 Object 라서 p(Object) 가 골라진다. O. ② p(\"hi\"): 라벨부터 String 이라 p(String). S. ③ p(null): null 은 Object 에도 String 에도 들어갈 수 있다. 이럴 때 자바는 더 구체적인 쪽(String 이 Object 의 자식)을 고른다. S. 합치면 OSS. 실제 객체를 보고 고르는 건 오버라이딩이고, 오버로딩은 라벨만 본다는 게 핵심이다.",
  },
  {
    id: "q-java-20",
    category: "Java",
    question: "다음 코드의 출력 결과는?",
    quizCode: `class A {
    int v = 1;
    int get() { return v; }
}
class B extends A {
    int v = 2;
    int get() { return v + super.get() * 10; }
}
class C extends B {
    int v = 3;
    int get() { return v + super.get() * 10; }
}
public class Test {
    public static void main(String[] args) {
        A a = new C();
        System.out.print(a.get() + " " + a.v);
    }
}`,
    options: ["123 1", "321 1", "123 3", "333 1"],
    answer:
      "3층 건물에서 3층이 2층에, 2층이 1층에 계산을 부탁하는 모양이다. ① a.get() 은 실제 객체 C 의 get() 이 불린다(동적 바인딩). ② C 의 get 안에서 v 는 C 자기 필드라 3, super.get() 은 바로 위 B 의 get() 을 부른다. ③ B 의 get 안에서 v 는 B 의 필드라 2, super.get() 은 A 의 get() 을 부른다. ④ A 의 get 은 A 의 v 인 1 을 돌려준다. ⑤ 이제 거꾸로 올라온다. B 는 2 + 1 × 10 = 12, C 는 3 + 12 × 10 = 123. ⑥ a.v 는 필드라서 변수 타입 A 의 v 를 본다(필드 숨김). 1. 합치면 123 1. 메서드 안에서 쓰는 필드는 그 메서드가 적힌 클래스의 필드라는 점도 같이 기억해 두자.",
  },
  {
    id: "q-java-21",
    category: "Java",
    question: "다음 코드의 출력 결과는?",
    quizCode: `public class Test {
    static int f() {
        int x = 1;
        try {
            x = 2;
            return x;
        } finally {
            x = 3;
            System.out.print("F");
        }
    }
    static int g() {
        try { throw new RuntimeException(); }
        catch (Exception e) { return 1; }
        finally { return 2; }
    }
    public static void main(String[] args) {
        System.out.print(f());
        System.out.print(g());
    }
}`,
    options: ["F22", "F32", "2F2", "F21"],
    answer:
      "finally 는 퇴근 전 마지막 문단속이다. return 으로 나가려 해도 문단속은 꼭 하고 나간다. ① f() 에서 x 가 2 가 되고 return x 를 만난다. 이 순간 돌려줄 값 2 를 미리 봉투에 담아 둔다. ② 나가기 전에 finally 가 돈다. x 를 3 으로 바꾸고 F 를 찍지만, 봉투 속 2 는 이미 담긴 값이라 안 바뀐다. ③ f() 가 끝나서 main 이 2 를 찍는다. 여기까지 F2. ④ g() 에서 예외가 터져 catch 로 가고 return 1 을 봉투에 담는다. ⑤ 그런데 finally 안에도 return 2 가 있다. finally 의 return 이 봉투를 통째로 바꿔치기한다. 그래서 2. 합치면 F22. finally 에 return 을 쓰면 원래 결과와 예외까지 덮어 버려서 실무에선 쓰지 않는다.",
  },
  {
    id: "q-java-22",
    category: "Java",
    question: "다음 코드의 출력 결과는?",
    quizCode: `public class Test {
    public static void main(String[] args) {
        String a = "java";
        String b = "ja" + "va";
        String c = "ja";
        String d = c + "va";
        final String e = "ja";
        String f = e + "va";
        System.out.print((a == b) + " ");
        System.out.print((a == d) + " ");
        System.out.print((a == f) + " ");
        System.out.print(a.equals(d));
    }
}`,
    options: ["true false true true", "true true true true", "false false false true", "true false false true"],
    answer:
      "문자열 리터럴은 공용 도서관(문자열 상수 풀)에 한 권만 꽂아 두고 다 같이 빌려 본다. == 는 같은 책(같은 주소)인지 묻고, equals 는 내용이 같은지 묻는다. ① b = \"ja\" + \"va\" 는 둘 다 리터럴이라 컴파일러가 미리 \"java\" 로 합쳐 버린다(컴파일 타임 상수 접기). 도서관의 같은 책이라 a == b 는 true. ② d = c + \"va\" 에서 c 는 그냥 변수라 실행 중에 새 문자열을 만든다. 내용은 같아도 새로 찍은 책이라 a == d 는 false. ③ e 는 final 에 리터럴을 넣어서 컴파일러가 상수로 본다. 그래서 e + \"va\" 도 미리 합쳐져 a == f 는 true. ④ equals 는 내용만 보니 true. 함정은 ③이다. final 이 붙으면 변수끼리 더해도 상수 접기가 된다. 실무에서 문자열 비교는 항상 equals 를 쓴다.",
  },
  {
    id: "q-java-23",
    category: "Java",
    question: "다음 코드의 출력 결과는?",
    quizCode: `public class Test {
    public static void main(String[] args) {
        int a = 7, b = 2;
        int c = a++ / b;
        int d = --a % b + c;
        double e = a / b;
        System.out.print(c + " " + d + " " + e);
    }
}`,
    options: ["3 4 3.0", "3 4 3.5", "4 5 3.0", "4 5 3.5"],
    answer:
      "a++ 는 '쓰고 나서 올리기', --a 는 '내리고 나서 쓰기'다. ① c = a++ / b: 지금 값 7 을 먼저 쓰고 a 는 8 이 된다(후위 증가). 7 / 2 는 정수끼리 나눗셈이라 소수점을 버리고 3. ② d = --a % b + c: a 를 먼저 7 로 내리고 쓴다(전위 감소). 7 % 2 는 1, 여기에 c 3 을 더해 4. ③ e = a / b: 7 / 2 를 정수끼리 먼저 계산해서 3 이 나오고, 그 3 을 double 칸에 담으면서 3.0 이 된다. 담는 칸이 double 이어도 계산은 이미 정수로 끝난 뒤다. 3.5 를 원하면 a / 2.0 이나 (double) a / b 처럼 한쪽을 실수로 만들어야 한다. 파이썬의 7 / 2 = 3.5 와 다르고, 파이썬 7 // 2 와 같다고 보면 된다.",
  },
  {
    id: "q-java-24",
    category: "Java",
    question: "다음 코드의 출력 결과는?",
    quizCode: `public class Test {
    static void change(int[] arr, int n) {
        arr[0] = 100;
        n = 100;
        arr = new int[]{9, 9};
        arr[1] = 50;
    }
    public static void main(String[] args) {
        int[] a = {1, 2};
        int[] b = a;
        int n = 1;
        b[1] = 20;
        change(a, n);
        System.out.print(a[0] + " " + a[1] + " " + n);
    }
}`,
    options: ["100 20 1", "100 50 100", "1 2 1", "100 50 1"],
    answer:
      "배열 변수는 사물함 자체가 아니라 사물함 열쇠다. 열쇠를 복사해 주면 같은 사물함을 연다. ① b = a 는 열쇠 복사라서 a 와 b 가 같은 배열을 가리킨다(참조 공유). b[1] = 20 이면 a[1] 도 20. ② change(a, n) 을 부르면 열쇠 사본과 숫자 사본이 넘어간다(값에 의한 전달). ③ arr[0] = 100 은 사본 열쇠로 같은 사물함을 열어 바꿨으니 a[0] 이 100 이 된다. ④ n = 100 은 숫자 사본만 바꿨으니 main 의 n 은 그대로 1. ⑤ arr = new int[]{9, 9} 는 사본 열쇠를 새 사물함 열쇠로 바꿔 쥔 것뿐이다. 그 뒤 arr[1] = 50 은 새 사물함에 들어가고 a 와는 상관없다. 합치면 100 20 1. 파이썬 리스트를 함수에 넘길 때와 똑같이 움직인다.",
  },
  {
    id: "q-java-25",
    category: "Java",
    question: "다음 코드의 출력 결과는?",
    quizCode: `public class Test {
    static void f(int n) {
        if (n == 0) return;
        System.out.print(n);
        f(n - 1);
        System.out.print(n);
    }
    public static void main(String[] args) {
        f(3);
    }
}`,
    options: ["321123", "321", "123321", "321321"],
    answer:
      "계단을 내려가면서 층수를 한 번 외치고, 다시 올라오면서 또 외치는 모양이다. ① f(3) 이 3 을 찍고 f(2) 를 부른다. 이때 f(3) 은 아래 출력문을 남겨 둔 채 멈춰서 기다린다(호출 스택에 쌓임). ② f(2) 가 2, f(1) 이 1 을 찍고 f(0) 을 부른다. ③ f(0) 은 바로 return 한다. 바닥에 닿았다. ④ 이제 기다리던 순서 거꾸로 돌아온다. f(1) 이 남은 출력으로 1, f(2) 가 2, f(3) 이 3 을 찍는다. 합치면 321123. 재귀 호출 앞의 출력은 내려가는 순서, 뒤의 출력은 올라오는 순서(나중에 들어간 것이 먼저 나옴)로 찍힌다.",
  },

  {
    id: "q-cs-5",
    category: "CS",
    question: "GET 과 POST 의 핵심 차이는?",
    answer:
      "GET = 정보를 '묻는' 요청. 주소에 ?key=value 로 실어 보내고, '부작용이 없는'(읽기만 하는) 요청에 쓴다. POST = '제출하는' 요청. 본문(body)에 숨겨서 보내고, 서버의 상태를 바꾸는(등록/수정/주문) 데 쓴다. 그래서 로그인/결제/글쓰기는 항상 POST.",
    code: `// GET = 주소에 붙여서 보내는 조회용 요청
//  → 캐시 가능, 길이 제한, URL에 남음 (비밀번호 금지!)
fetch("/api/search?q=react", { method: "GET" });

// POST = 본문에 숨겨서 보내는 제출용 요청
//  → 캐시 안 됨, 길이 제한 없음, URL에 안 남음
fetch("/api/login", {
  method: "POST",
  body: JSON.stringify({ password: "1234" }),
});`,
  },
  {
    id: "q-cs-6",
    category: "CS",
    question: "캐시 메모리가 왜 필요한가?",
    answer:
      "CPU 와 메모리 속도 차이가 너무 크다 (CPU 1ns, RAM 100ns, 디스크 10ms). CPU 가 디스크에서 데이터를 매번 읽으면 병목이 생기니, 자주 쓰는 데이터를 조금 더 빠른 곳에 저장해두는 게 캐시다. 상점에서 자주 파는 물건을 진열대 높은 곳에 두는 것과 같다.",
    code: `// 캐시가 있을 때 / 없을 때 비유

// ❌ 캐시 없이 매번 창고(Disk)에서 꺼내는 경우
function getUser(id) {
  return db.users.find(id);      // 매번 디스크 I/O
}

// ✅ 자주 쓰는 유저를 메모리에 캐시해두는 경우
const cache = new Map<string, User>();
function getUserCached(id) {
  if (cache.has(id)) return cache.get(id);   // 1) 먼저 진열대 확인
  const user = db.users.find(id);
  cache.set(id, user);
  return user;                               // 2) 없으면 창고에서
}`,
  },
  {
    id: "q-cs-7",
    category: "CS",
    question: "비트(bit)와 바이트(byte)는 무슨 차이인가?",
    answer:
      "비트 = 전구 하나 (0 또는 1, 가장 작은 정보 단위). 바이트 = 전구 8개 묶음 (00000000). 컴퓨터는 바이트 단위로 정보를 다룬다. 그래서 1KB = 1024바이트 = 8192비트. 사진/동영상 용량은 이 바이트가 얼마나 되는지로 나타낸다.",
    code: `// 1바이트(1byte) = 8비트(8bit)
//    각 비트가 0 또는 1

// ASCII 문자 'A' = 1바이트 (01000001)
const a = "A";                       // 1바이트
const text = "안녕";                   // 보통 UTF-8 에선 3바이트/문자

// 숫자 255 = 바이트 하나가 감당할 수 있는 최대값
//   11111111 = 255 (2^8 - 1)`,
  },
  {
    id: "q-cs-8",
    category: "CS",
    question: "동기와 비동기의 실용적 차이는?",
    answer:
      "동기 = 물 주면서 그 채소가 자라는 걸 기다리는 것. 기다리는 동안 다른 일을 못 한다. 비동기 = 물 줘놓고 나중에 확인하러 오는 것. 기다리는 동안 다른 채소에 물을 줄 수 있다. JS 는 단일 스레드라, 무거운 작업(네트워크·파일)은 비동기로 안 보내면 화면이 멈춘다.",
    code: `// 동기 — 끝날 때까지 가로채서 기다림
function boilWaterSync() {
  let water = null;
  water = heatWater();   // 10초간 blocking
  return water;
}

// 비동기 — 나중에 알림 받고 계속 다른 일
function orderCoffeeAsync() {
  baristaOrder("americano");
  // 여기서 기다리지 않고 바로 다음 작업 실행
  sliceBread();
}

// JS 에서 대표적 예:
fetch("/api/data").then(res => res.json()); // 응답 올 때까지 기다리지 않고 계속 실행`,
  },
  {
    id: "q-cs-9",
    category: "CS",
    question: "세션(Session)과 쿠키(Cookie)는 무슨 관계인가?",
    answer:
      "'내가 누구인지'를 유지해야 로그인이 풀리지 않는다. 쿠키 = 내 지갑 (클라이언트에 저장). 세션 = 사물함 열쇠 (서버에 저장). 로그인하면 서버가 열쇠(세션 ID)를 만들어서 지갑(쿠키)에 넣어준다. 다음 요청마다 지갑에서 열쇠를 꺼내 서버에 보여주면, 서버가 '아 맞다 너~' 하고 인정해준다.",
    code: `// 로그인 시: 서버가 세션을 만들고 쿠키에 세션ID를 실어줌
app.post("/login", (req, res) => {
  const sessionId = createSession(req.body.userId);
  // 키를 브라우저 쿠키에 심어줌 (만료 24시간)
  res.cookie("sessionId", sessionId, { httpOnly: true, maxAge: 86400000 });
  res.json({ ok: true });
});

// 이후 요청마다 쿠키가 자동으로 같이 가서
// 서버가 sessionId 로 "너구나!" 확인 가능`,
  },
  {
    id: "q-cs-10",
    category: "CS",
    question: "DNS 는 왜 '인터넷 전화번호부' 라고 불리나?",
    answer:
      "사람이 기억하기 쉬운 www.example.com 같은 도메인을, 컴퓨터가 이해하는 숫자 IP 주소로 바꿔주는 시스템. 전화번호부에서 '엄마'를 찾아 010-1234-5678 로 연결해주는 것과 똑같다. 이 과정이 없으면 매번 123.45.67.89 같은 숫자를 외워야 한다.",
    code: `// DNS 변환 과정 (브라우저 → 실제 서버)
//   1) "이 사이트 주소 어디야?" → DNS 서버에 질문
//   2) DNS 서버가 "123.45.67.89 야" 라고 알려줌
//   3) 해당 IP로 TCP 연결 → HTTP 요청

// 개발자용 /etc/hosts 는 '개인 전화번호부'
// 127.0.0.1  localhost    ← 이 한 줄로 IP 없이 이름으로 접근 가능`,
  },
  {
    id: "q-cs-11",
    category: "CS",
    question: "공개키 암호(RSA·ECDSA 등)에서 공개키와 개인키는 각각 무슨 일을 하나?",
    answer:
      "우체통으로 비유하면: 공개키 = 우체통 투입구 (누구나 넣을 수 있게 동네에 공개), 개인키 = 우체통 열쇠 (나만 가짐). 쓰임이 두 가지로 갈린다. ① 암호화 — 남이 내 공개키로 잠그면 내 개인키로만 열린다. ② 서명 — 내가 개인키로 도장을 찍으면 누구나 내 공개키로 '진짜 이 사람 도장 맞네' 검증한다. 즉 개인키는 '만드는 쪽', 공개키는 '확인하는 쪽'이다 (비대칭키 암호).",
    code: `# SSH 키를 만들면 파일이 딱 두 개 나온다
ssh-keygen -t ed25519 -C "me@example.com"
#   ~/.ssh/id_ed25519       ← 개인키: 절대 남에게 주지 말 것 (열쇠)
#   ~/.ssh/id_ed25519.pub   ← 공개키: 깃허브에 등록 (투입구)

# 깃허브는 .pub(공개키)만 갖고 있다가,
# 내가 개인키로 서명해서 접속하면 "이 서명 = 등록된 공개키 주인" 확인 후 통과`,
  },
  {
    id: "q-cs-12",
    category: "CS",
    question: "RSA 는 어떤 원리이고, 왜 아직도 가장 많이 쓰이나?",
    answer:
      "'큰 소수 두 개를 곱하는 건 쉽지만, 곱해진 결과를 다시 소수로 쪼개는 건 어렵다'에 기댄 알고리즘 (소인수분해 문제). 1977년부터 쓰여 온 최고참이라 안 되는 곳이 거의 없고, 서명뿐 아니라 암호화까지 둘 다 된다는 게 큰 장점 (다른 서명 전용 알고리즘과 다른 점). 단점은 느리고 키가 뚱뚱하다는 것 — 같은 안전도를 내려면 2048비트 이상이 필요하다. 그리고 양자컴퓨터가 실용화되면 소인수분해가 순식간에 풀려서 무너질 알고리즘으로 지목된다 (쇼어 알고리즘).",
    code: `# RSA 키 생성 — 2048은 사실상 최소, 요즘은 3072~4096 권장
ssh-keygen -t rsa -b 4096

# 왜 안전한가?
#   61 × 53 = 3233   ← 곱하기: 계산기로 1초
#   3233 = ? × ?     ← 되돌리기: 숫자가 617자리면 현재 컴퓨터로 수백만 년
# 이 '비대칭 난이도'가 열쇠 역할을 한다.

# RSA 만 가능한 것: 암호화 + 서명 둘 다
#   openssl rsautl -encrypt ...   ← ECDSA/Ed25519 로는 이걸 못 한다`,
  },
  {
    id: "q-cs-13",
    category: "CS",
    question: "DSA 는 왜 요즘 잘 안 쓰이나?",
    answer:
      "DSA(Digital Signature Algorithm)는 소인수분해 대신 '이산 로그 문제'(거듭제곱은 쉬운데 지수를 되찾긴 어렵다)에 기댄 서명 전용 알고리즘이다. RSA보다 서명이 빠르다는 장점으로 표준이 됐지만, 결정적 약점이 있다 — 서명할 때마다 뽑는 임시 난수(k)를 한 번이라도 재사용하거나 예측 가능하게 만들면 개인키가 통째로 계산되어 버린다. 실제로 소니 PS3가 이 실수로 마스터키가 털렸다. 그래서 OpenSSH 는 7.0부터 DSA를 기본 비활성화했고, 지금은 사실상 퇴역했다 (역사 공부용).",
    code: `# OpenSSH 8.8+ 에서 DSA 키로 접속하면 이런 취급을 받는다
#   ssh-dss(DSA)는 기본 비활성 → 접속 거부

# 왜 위험한가 (난수 k 재사용 사고)
#   서명1 = f(개인키, k)
#   서명2 = f(개인키, k)   ← 같은 k 재사용!
#   → 두 서명을 연립방정식처럼 풀면 개인키가 튀어나온다

# 새 키를 만들 일이 있다면 DSA 말고:
ssh-keygen -t ed25519`,
  },
  {
    id: "q-cs-14",
    category: "CS",
    question: "ECDSA(타원곡선)는 RSA 보다 키가 작은데 왜 안전한가?",
    answer:
      "문제를 '소인수분해'에서 '타원곡선 위의 점 뛰기'로 바꾼 것 (타원곡선 이산로그). 곡선 위에서 점을 n번 뛴 결과는 쉽게 구하지만, 결과만 보고 몇 번 뛰었는지 되찾는 건 극도로 어렵다. 이 문제가 훨씬 '단단해서' 키를 훨씬 짧게 써도 같은 안전도가 나온다 — 256비트 ECDSA ≈ 3072비트 RSA. 키·서명이 작으니 모바일·IoT·TLS 핸드셰이크에 유리하다. 단점은 구현 난이도 — 난수 k 문제를 DSA에게서 그대로 물려받았고, 곡선을 누가 어떻게 정했는지(NIST 곡선 불신) 논란도 있다.",
    code: `# 같은 안전도를 내는 키 길이 비교 (대략)
#   RSA 3072비트  ≈  ECDSA 256비트   ← 12배 차이!
#   RSA 15360비트 ≈  ECDSA 521비트

ssh-keygen -t ecdsa -b 256    # 짧고 빠른 키

# HTTPS 인증서도 요즘은 ECDSA 가 많다 (핸드셰이크가 가벼워짐)
# 주의: ECDSA 도 서명용 난수 k 를 잘못 만들면 개인키가 노출된다`,
  },
  {
    id: "q-cs-15",
    category: "CS",
    question: "EdDSA 는 ECDSA 와 뭐가 다른가?",
    answer:
      "같은 타원곡선이지만 '에드워즈 곡선'이라는 더 다루기 쉬운 곡선을 쓰고, 무엇보다 서명용 난수 k 를 난수로 뽑지 않는다 — 개인키와 메시지를 해시해서 k 를 결정적으로 만들어 낸다 (deterministic). 그래서 ECDSA·DSA를 무너뜨린 '난수 재사용 사고'가 구조적으로 일어날 수 없다. 덤으로 분기·테이블 참조가 없는 구현이 쉬워서 부채널 공격(전력·시간 측정으로 키 훔치기)에도 강하다. 요약하면 EdDSA = '개발자가 실수하기 어렵게 다시 설계한 타원곡선 서명'.",
    code: `# ECDSA:  서명 = f(개인키, 메시지, 랜덤 k)   ← k 를 잘못 뽑으면 끝장
# EdDSA:  서명 = f(개인키, 메시지)            ← k 를 해시로 만들어 냄 (사고 원천 차단)
#   같은 메시지를 100번 서명하면 항상 같은 서명이 나온다

# EdDSA 의 대표 구현 두 개
#   Ed25519 : Curve25519 기반, 128비트 안전도 (사실상 표준)
#   Ed448   : 더 높은 안전도가 필요할 때`,
  },
  {
    id: "q-cs-16",
    category: "CS",
    question: "Ed25519 는 언제 쓰고, RSA 대신 써도 되나?",
    answer:
      "Ed25519 = EdDSA를 Curve25519 곡선에 얹은 구체적 구현. 키가 256비트(공개키 32바이트)로 아주 작고 서명·검증이 매우 빨라서, 모바일·임베디드처럼 자원이 빠듯한 곳과 SSH/깃 서명에서 사실상 기본값이 됐다. 다만 오해하면 안 되는 게 있다 — 'Ed25519가 RSA 2048보다 더 안전하다'가 아니라, '훨씬 짧은 키로 RSA 3072 수준의 안전도를 훨씬 빠르게 낸다'가 정확한 표현이다. 그리고 서명 전용이라 암호화는 못 한다 (암호화가 필요하면 X25519 키교환이나 RSA를 쓴다). 양자컴퓨터 앞에서는 RSA와 마찬가지로 무력하다는 점도 같다.",
    code: `# 2026년 기준 실무 기본값
ssh-keygen -t ed25519          # 새 SSH 키는 웬만하면 이것
ssh-keygen -t rsa -b 4096      # 옛 장비/시스템 호환이 필요할 때만

# 선택 가이드
#   빠른 서명 · 작은 키 · 모바일   → Ed25519
#   암호화까지 필요 · 레거시 호환  → RSA (3072비트 이상)
#   TLS 인증서 · 광범위 호환       → ECDSA P-256
#   DSA                            → 쓰지 말 것 (퇴역)

# 공개키 크기 실감
#   Ed25519 공개키 ≈  68자 (한 줄)
#   RSA 4096 공개키 ≈ 720자 (화면 넘김)`,
  },
  {
    id: "q-cs-17",
    category: "CS",
    question: "Git 브랜치와 병합(merge)은 왜 쓰나?",
    answer:
      "브랜치 = 원본 문서를 건드리지 않고 복사본에서 마음껏 고쳐보는 평행 세계. main 은 언제나 돌아가는 안정판으로 두고, 기능마다 feature/login 같은 브랜치를 따서 작업한다. 망치면 그 브랜치만 버리면 되고, 여러 사람이 동시에 각자 세계에서 일해도 서로 안 부딪힌다. 병합(merge) = 다 만든 평행 세계의 변경을 원래 세계(main)에 합치는 것. 참고로 브랜치는 파일을 통째로 복사하는 게 아니라 '이 커밋을 가리키는 이름표'라서 아주 가볍다.",
    code: `git switch -c feature/login   # 평행 세계 만들고 이동
# ... 코드 수정 ...
git add .
git commit -m "feat: 로그인 화면"

git switch main               # 원래 세계로 돌아와서
git merge feature/login       # 평행 세계의 변경을 합친다

# 망쳤다면? 브랜치만 버리면 main 은 멀쩡
git branch -D feature/login`,
  },
  {
    id: "q-cs-18",
    category: "CS",
    question: "Git 충돌(conflict)은 왜 나고 어떻게 푸나? PR 흐름은?",
    answer:
      "충돌 = 두 사람이 같은 문서의 같은 줄을 각자 다르게 고친 상황. 다른 줄이면 Git 이 알아서 합치지만, 같은 줄이면 '어느 쪽이 맞는지' 판단을 못 해서 사람에게 묻는다. 파일에 <<<<<<< ======= >>>>>>> 표시가 생기면 ① 둘 중 하나를 고르거나 섞어서 고치고 ② 표시를 지우고 ③ git add → commit 하면 끝. PR(Pull Request) 흐름은 '내 브랜치를 main 에 합쳐도 될까요?' 하고 결재를 올리는 것: 브랜치 push → PR 생성 → 동료 리뷰·자동 테스트 → 승인되면 merge. PR 에 충돌이 뜨면 내 브랜치에 최신 main 을 먼저 받아와(merge 또는 rebase) 내 자리에서 충돌을 풀고 다시 push 한다.",
    code: `# 충돌 난 파일 모습
<<<<<<< HEAD (내 브랜치)
const title = "로그인";
=======
const title = "Sign in";
>>>>>>> main (상대 변경)

# ① 원하는 모양으로 고치고 ② 표시 지우기
const title = "로그인";

# ③ 해결 완료 알리기
git add Login.tsx
git commit

# PR 에 충돌이 뜰 때: 최신 main 을 내 브랜치로 받아와서 해결
git switch feature/login
git pull origin main          # 여기서 충돌 → 위 방법으로 해결
git push                      # PR 이 자동으로 갱신됨`,
  },
  {
    id: "q-cs-19",
    category: "CS",
    question: "Docker 이미지와 컨테이너의 차이는?",
    answer:
      "이미지 = 밀키트. 앱 코드 + 실행에 필요한 것(자바 런타임, 라이브러리, 설정)을 한 봉지에 굳혀 둔 읽기 전용 포장본이다. 컨테이너 = 그 밀키트를 뜯어서 실제로 조리 중인 요리. 이미지 하나로 컨테이너를 여러 개 띄울 수 있고, 컨테이너를 지워도 이미지는 그대로 남는다 (클래스와 객체 관계와 비슷). 덕분에 '내 컴퓨터에선 되는데?' 문제가 사라진다 — 어디서든 같은 밀키트를 쓰니까. 가상머신(VM)과 달리 컨테이너는 운영체제를 통째로 싣지 않고 호스트 커널을 같이 써서 가볍다. 주의: 컨테이너 안에 쓴 파일은 컨테이너를 지우면 같이 사라지므로, 남겨야 할 데이터는 볼륨(volume)에 둔다.",
    code: `# Dockerfile = 밀키트 레시피
FROM eclipse-temurin:17-jre
COPY build/libs/app.jar app.jar
CMD ["java", "-jar", "app.jar"]

docker build -t myapp .          # 레시피로 밀키트(이미지) 포장
docker run -d -p 8080:8080 myapp # 뜯어서 조리 = 컨테이너 1
docker run -d -p 8081:8080 myapp # 같은 이미지로 컨테이너 2

docker images   # 밀키트 목록 (이미지)
docker ps       # 지금 조리 중인 요리 목록 (컨테이너)`,
  },
  {
    id: "q-cs-20",
    category: "CS",
    question: "배포란 뭔가? 스프링 부트 앱은 어떻게 서버에서 돌아가나?",
    answer:
      "배포 = 가게 오픈. 주방(내 컴퓨터)에서 만든 요리를 손님이 먹을 수 있게 매장(서버)에 내놓는 것. 스프링 부트는 ① 빌드: ./gradlew bootJar 로 코드와 라이브러리, 내장 톰캣까지 jar 파일 하나에 굳힌다 ② 실행: 서버에서 java -jar app.jar 로 띄우면 그 프로세스가 계속 살아서 요청을 받는다 ③ 설정: DB 주소·비밀번호처럼 환경마다 다른 값은 코드에 박지 않고 환경변수와 프로파일(dev/prod)로 바꿔 끼운다. 같은 jar 를 다시 빌드하지 않고 설정만 바꿔 개발·운영에 쓰는 게 핵심. React 로 치면 npm run build 로 dist 를 만들고 .env.production 으로 값을 바꾸는 것과 비슷한데, 차이는 React 결과물은 정적 파일이고 jar 는 계속 돌아가는 서버 프로그램이라는 점.",
    code: `# ① 빌드 — jar 하나로 굳히기 (내장 톰캣 포함)
./gradlew bootJar            # → build/libs/app.jar

# ② 실행 + ③ 프로파일 선택
java -jar app.jar --spring.profiles.active=prod
#   → application.yml + application-prod.yml 을 읽는다

# ③ 비밀값은 환경변수로 (코드·깃에 남기지 않기)
export SPRING_DATASOURCE_URL=jdbc:mysql://db:3306/shop
export SPRING_DATASOURCE_PASSWORD=****
#   → spring.datasource.url / password 를 덮어쓴다

# React 비교
# npm run build → dist/ (정적 파일, 웹서버가 나눠주기만 함)
# bootJar      → app.jar (스스로 계속 도는 서버)`,
  },
  // ─── 운영체제 ──────────────────────────────────────────
  {
    id: "q-os-1",
    category: "운영체제",
    question: "프로세스의 주소 공간은 왜 코드·데이터·스택으로 나눠져 있나?",
    answer:
      "한 집을 방으로 나누는 것과 같다. 코드(Code) = 설계도 원본 (프로그램 명령어), 데이터(Data) = 붙박이 가구 (전역변수), 스택(Stack) = 그때그때 펴는 접이식 책상 (함수와 지역변수), 힙(Heap) = 필요할 때 빌리는 창고 (동적 할당). 나누는 진짜 이유는 공유해서 메모리를 아끼려고다. 같은 프로그램을 3개 띄우면 설계도(코드)는 똑같으니 한 장만 두고 셋이 같이 본다.",
    code: `// 메모장을 3개 띄우면?
//   Code 영역  → 1개만 메모리에 (셋이 공유) ← 절약 포인트!
//   Data/Stack → 창마다 따로 (내가 친 글자는 각자 다르니까)

int global = 10;        // Data  — 프로그램 내내 한 자리
void f() {
  int local = 5;        // Stack — 함수 끝나면 사라짐 (LIFO)
  int *p = malloc(100); // Heap  — 내가 free 할 때까지 살아있음
}`,
  },
  {
    id: "q-os-2",
    category: "운영체제",
    question: "인터럽트(Interrupt)는 뭐고, 폴링(Polling)과 뭐가 다른가?",
    answer:
      "인터럽트 = 초인종. 손님이 오면 벨을 눌러주니까 나는 내 일을 하다가 벨 소리에만 반응하면 된다. 폴링 = 1분마다 현관에 나가 '누구 왔나?' 확인하는 것 — 대부분 헛걸음이라 느리다. 종류는 셋: 하드웨어 외부(전원 이상·입출력), 내부=트랩(0으로 나누기·오버플로 같은 잘못된 명령), 소프트웨어(SVC — 프로그램이 커널에 일을 부탁할 때).",
    code: `// 인터럽트 처리 순서 (벨이 울리면)
//   1) 하던 일 멈춤
//   2) 현재 상태(PC·레지스터)를 스택에 저장   ← 돌아올 자리 표시
//   3) 인터럽트 서비스 루틴(ISR)으로 점프     ← 손님 응대
//   4) 저장한 상태 복원 → 하던 일 계속

// 폴링: while(true) { if (button_pressed()) ... }  ← CPU 계속 소모
// 인터럽트: 하드웨어가 알려줄 때만 처리          ← CPU 놀 수 있음`,
  },
  {
    id: "q-os-3",
    category: "운영체제",
    question: "fork() 와 exec() 는 각각 무슨 일을 하나?",
    answer:
      "fork() = 나를 복사해서 쌍둥이 만들기 (프로세스 생성). exec() = 그 사람이 옷을 갈아입고 완전히 다른 사람이 되기 (프로세스 교체 — PID 는 그대로!). 그래서 새 프로그램을 실행할 땐 보통 'fork 로 자식을 만들고, 자식이 exec 로 딴 프로그램이 된다'. fork() 의 반환값으로 부모/자식을 구분하는 게 포인트 — 0 이면 내가 자식, 양수면 내가 부모(값은 자식 PID), 음수면 실패.",
    code: `pid_t pid = fork();   // 여기서 프로세스가 둘로 갈라진다

if (pid == 0) {
  // 자식만 여기 들어옴
  execvp("ls", args);  // ← 여기서 'ls' 로 통째로 바뀜
  printf("이 줄은 절대 안 찍힌다"); // exec 성공하면 뒷 코드는 사라짐
} else if (pid > 0) {
  wait(NULL);          // 부모는 자식이 끝날 때까지 기다림
}
// 주의: fork 다음 줄부터 둘 다 실행된다 (프로그램 처음이 아님!)`,
  },
  {
    id: "q-os-4",
    category: "운영체제",
    question: "PCB(Process Control Block)에는 뭐가 들어있나?",
    answer:
      "PCB = 프로세스의 신상명세서. CPU 를 잠깐 뺏길 때 '내가 어디까지 했는지'를 여기 적어두고 나갔다가, 돌아와서 그대로 이어서 한다. 담기는 것: 프로세스 ID, 상태(준비/실행/대기), 우선순위, CPU 레지스터 값, 소유자, CPU 사용 시간, 메모리 사용량. 운영체제는 이 PCB 들을 연결 리스트로 관리해서 생성·삭제를 쉽게 한다.",
    code: `// PCB 는 커널 영역에 있다 (사용자가 함부로 못 건드림)
struct PCB {
  int pid;              // 프로세스 번호
  enum state;           // ready / running / waiting
  int priority;         // 우선순위
  Registers regs;       // ← 컨텍스트 스위칭 때 여기 저장/복원
  struct PCB *next;     // 연결 리스트로 이어짐
};

// 스레드마다 있는 건 TCB (Thread Control Block)`,
  },
  {
    id: "q-os-5",
    category: "운영체제",
    question: "컨텍스트 스위칭(Context Switching)은 왜 오버헤드인가?",
    answer:
      "책을 읽다가 다른 책으로 갈아탈 때, 지금 페이지에 책갈피를 꽂고(PCB 에 저장) 새 책의 책갈피를 펴는(PCB 에서 복원) 시간. 그 동안은 책을 한 글자도 안 읽는다 — 그래서 순수 오버헤드다. 그런데도 하는 이유는, 한 프로세스가 I/O 를 기다리며 CPU 를 놀리는 것보다 다른 프로세스를 돌리는 게 훨씬 이득이기 때문. 프로세스 간 전환이 스레드 간 전환보다 비싼 이유는 메모리 공간이 달라서 캐시까지 무효화되기 때문이다.",
    code: `// 전환이 일어나는 순간
//   Running → Ready    (시간 다 씀 = time quantum 소진)
//   Running → Waiting  (I/O 요청)
//   Ready   → Running  (내 차례)

// 비용 비교
//   프로세스 전환: 레지스터 + 메모리 맵 + 캐시 무효화 → 비쌈
//   스레드 전환:   레지스터 + 스택만 (메모리 공유)     → 쌈`,
  },
  {
    id: "q-os-6",
    category: "운영체제",
    question: "프로세스끼리 데이터를 주고받는 방법(IPC)에는 뭐가 있나?",
    answer:
      "프로세스는 서로 남의 집이라 담을 넘을 수 없다 (메모리 독립). 그래서 커널이 중간에서 통로를 놔준다. 파이프(한 방향 관 — 반이중), 이름있는 파이프/FIFO(남남인 프로세스끼리도 가능), 메시지 큐(번호표 붙여 던져놓기), 공유 메모리(아예 창고를 같이 씀 — 가장 빠름), 메모리 맵(큰 파일을 메모리에 얹어 공유), 소켓(네트워크로 통신).",
    code: `// 공유 메모리가 가장 빠른 이유: 중간 매개체가 없다
//   파이프:      A → [커널 버퍼] → B   (복사 2번)
//   공유 메모리:  A → [같은 메모리] ← B (복사 0번)

// 대신 공유 메모리는 동시 접근 제어를 안 해준다!
//   → 세마포어·뮤텍스로 직접 동기화해야 함 (이게 함정)`,
  },
  {
    id: "q-os-7",
    category: "운영체제",
    question: "CPU 스케줄링에서 선점(Preemptive)과 비선점의 차이는?",
    answer:
      "비선점 = 한번 마이크를 잡으면 본인이 내려놓을 때까지 못 뺏는다 (FCFS, SJF, HRN). 선점 = 사회자가 시간 되면 마이크를 뺏는다 (Round Robin, Priority). 비선점은 예측이 쉽지만, 앞사람이 길게 말하면 뒤가 다 막힌다 (호위 효과, convoy effect). 선점은 응답성이 좋지만 전환 비용이 든다. 스케줄링의 목표는 셋: 오버헤드↓, CPU 사용률↑, 굶는 프로세스(기아)↓.",
    code: `// 비선점
//   FCFS : 온 순서대로       → 긴 작업 뒤 짧은 작업이 다 막힘(convoy)
//   SJF  : 짧은 것 먼저      → 평균 대기 최소, 근데 긴 작업은 굶음
//   HRN  : (대기+실행)/실행  → 오래 기다렸으면 우선순위↑ (SJF 보완)

// 선점
//   RR       : 정해진 시간씩 돌아가며
//              (quantum 작으면 전환 오버헤드↑, 크면 FCFS 에 수렴)
//   Priority : 우선순위 순 → 낮은 건 굶음
//              해결책 = Aging (기다린 만큼 우선순위 올려줌)`,
  },
  {
    id: "q-os-8",
    category: "운영체제",
    question: "데드락(교착상태)이 생기는 4가지 조건은?",
    answer:
      "좁은 골목에서 차 두 대가 마주 봐서 둘 다 못 가는 상황. 네 조건이 전부 성립해야 발생한다: ① 상호배제 — 한 번에 한 명만 쓸 수 있다 ② 점유와 대기 — 뭔가 쥔 채로 다른 걸 기다린다 ③ 비선점 — 남의 것을 강제로 뺏을 수 없다 ④ 순환 대기 — 기다리는 관계가 동그랗게 돈다. 뒤집으면, 넷 중 하나만 깨면 데드락은 안 생긴다 — 이게 예방(prevention)이다.",
    code: `// 예방 = 4조건 중 하나 깨기
//   상호배제 깨기    → 자원을 공유 가능하게
//   점유와 대기 깨기 → 필요한 자원을 "한 번에 모두" 할당
//   비선점 깨기      → 기다리게 되면 갖고 있던 것 반납
//   순환 대기 깨기   → 자원에 번호 매겨 "번호 순서로만" 요청 ★실무적

// 회피 = 은행원 알고리즘 (빌려주기 전에 "안전한가?" 미리 계산)
// 탐지+회복 = 일단 두고, 사이클 생기면 하나 죽이거나 자원 뺏기`,
  },
  {
    id: "q-os-9",
    category: "운영체제",
    question: "레이스 컨디션(Race Condition)이란? 임계구역과 무슨 관계인가?",
    answer:
      "두 사람이 같은 통장에서 동시에 출금하는 상황. '잔액 읽기 → 계산 → 쓰기' 사이에 상대가 끼어들면 결과가 달라진다 — 즉 접근 순서에 따라 결과가 바뀌는 상태. 문제가 생기는 그 코드 구간을 임계구역(Critical Section)이라 부른다. 해결책이 만족해야 할 3요건: 상호배제(한 번에 하나만), 진행(아무도 안 쓰면 들어갈 수 있어야), 한정 대기(무한정 기다리면 안 됨).",
    code: `// 잔액 100, 둘이 동시에 50 출금하면?
//   T1: 잔액 읽기(100)
//   T2: 잔액 읽기(100)   ← T1 이 아직 안 썼다!
//   T1: 100-50=50 쓰기
//   T2: 100-50=50 쓰기   ← 0원이 되어야 하는데 50원이 남았다

// 해결: 임계구역을 락으로 감싼다
lock(mutex);
  balance -= 50;   // ← 여기가 임계구역
unlock(mutex);`,
  },
  {
    id: "q-os-10",
    category: "운영체제",
    question: "뮤텍스(Mutex)와 세마포어(Semaphore)의 차이는?",
    answer:
      "뮤텍스 = 화장실 열쇠 1개 (한 명만, 그리고 열쇠 가져간 사람이 반납해야 함 — 소유권 있음). 세마포어 = 주차장 자리 N개 (여러 명 가능, 아무나 나갈 수 있음 — 소유권 없음). 세마포어의 값이 0/1 뿐이면 뮤텍스와 같아진다 (이진 세마포어). 그래서 '세마포어는 뮤텍스가 될 수 있지만, 뮤텍스는 세마포어가 될 수 없다'.",
    code: `// 세마포어의 두 연산
//   P(S) = wait   : while(S==0) 대기; S = S-1;   ← 들어갈 때
//   V(S) = signal : S = S+1;                     ← 나올 때

// 정리 (면접 단골)
//         | 개수     | 소유권 | 누가 해제     | 범위
// 뮤텍스  | 1개      | 있음   | 잠근 스레드만 | 프로세스 내
// 세마포어| 1개 이상 | 없음   | 아무 스레드나 | 시스템 전역`,
  },
  {
    id: "q-os-11",
    category: "운영체제",
    question: "Thread Safe 하다는 게 무슨 뜻인가?",
    answer:
      "여러 스레드가 동시에 같은 함수·변수를 건드려도 의도한 대로 동작하는 것. 보장하는 방법은 임계구역을 뮤텍스·세마포어로 감싸는 것(상호배제). 한 단계 더 강한 개념이 재진입 가능(Reentrant) — 공유 자원을 아예 안 쓰고 넘겨받은 매개변수만으로 동작하는 함수다. 중요한 포인트: 재진입 가능하면 thread-safe 지만, 그 역은 성립하지 않는다 (락으로 감싸면 thread-safe 지만 재진입은 아닐 수 있다).",
    code: `// ❌ thread-safe 하지 않음 — 전역 변수를 건드린다
int count = 0;
void bad() { count++; }          // 동시에 부르면 값이 샌다

// ✅ thread-safe (락으로 보호) — 하지만 Reentrant 는 아님
void ok() { lock(m); count++; unlock(m); }

// ✅ Reentrant — 공유 자원 자체를 안 쓴다 (가장 안전)
int best(int x) { return x + 1; }  // 매개변수만으로 동작`,
  },
  {
    id: "q-os-12",
    category: "운영체제",
    question: "페이징과 세그멘테이션은 뭐가 다르고, 단편화는 각각 어떻게 생기나?",
    answer:
      "페이징 = 똑같은 크기의 상자로 나누기 (고정 크기). 세그멘테이션 = 내용물 단위로 나누기 (코드/데이터/스택처럼 논리적 의미, 가변 크기). 여기서 시험 포인트: 페이징은 내부 단편화, 세그멘테이션은 외부 단편화가 생긴다. 페이징은 마지막 상자에 빈 공간이 남고(내부), 세그멘테이션은 크기가 제각각이라 사이사이에 못 쓰는 틈이 생긴다(외부).",
    code: `// 내부 단편화 (페이징) — 상자는 4KB 인데 3KB 만 담김
//   [■■■□] ← 1KB 가 상자 안에서 논다

// 외부 단편화 (세그멘테이션) — 빈 공간 총합은 충분한데 연속이 아님
//   [■■][ ][■■■][ ][■]  ← 빈칸 합쳐도 못 씀 (흩어져서)
//   해결: 압축(compaction) — 밀어서 모으기, 근데 비쌈

// 정리
//   페이징      : 외부 단편화 없음, 내부 단편화 약간
//   세그멘테이션 : 내부 단편화 없음, 외부 단편화 있음`,
  },
  {
    id: "q-os-13",
    category: "운영체제",
    question: "가상 메모리와 MMU 는 무슨 일을 하나?",
    answer:
      "RAM 이 8GB 인데 16GB 짜리 프로그램이 도는 마술의 정체. 당장 쓰는 부분만 메모리에 올리고 나머지는 디스크에 둔다. 프로그램은 '가상 주소'라는 가짜 번지를 쓰고, MMU(Memory Management Unit)라는 하드웨어가 이걸 실제 물리 주소로 즉석 번역해준다. 덕분에 개발자는 메모리 위치를 신경 쓸 필요가 없다. 남의 메모리 침범은 base(시작 주소)·limit(크기) 레지스터로 막고, 벗어나면 trap 을 띄운다.",
    code: `// 주소 변환
//   프로그램이 보는 주소(가상)  →  [MMU]  →  실제 RAM 주소(물리)

// 메모리 보호: base <= 접근주소 < base + limit
//   위반하면 trap → "Segmentation fault" 가 이것!
//   base/limit 레지스터는 커널 모드에서만 수정 가능

// 지역성(Locality) — 가상 메모리가 실제로 잘 도는 이유
//   시간 지역성: 방금 쓴 걸 또 쓴다 (반복문 변수)
//   공간 지역성: 옆 주소를 이어서 쓴다 (배열 순회)`,
  },
  {
    id: "q-os-14",
    category: "운영체제",
    question: "페이지 교체 알고리즘 FIFO · LRU · OPT 는 각각 어떤 기준인가?",
    answer:
      "메모리가 꽉 찼을 때 누구를 내보낼지 정하는 규칙 (내보낼 페이지 = victim). FIFO = 먼저 들어온 놈부터 (단순하지만 자주 쓰는 것도 나감). OPT = 앞으로 가장 오래 안 쓸 놈 (가장 좋지만 미래를 알아야 해서 구현 불가 — 이론상 최선의 기준점). LRU = 가장 오래 안 쓴 놈 (과거로 미래를 추측 — 실무의 현실적 정답). 참고로 내보낼 때 수정 안 된 페이지(dirty bit=0)를 우선 고른다 — 디스크에 다시 안 써도 되니까.",
    code: `// 참조 순서: 1 2 3 1 2 4  (프레임 3개)
//   FIFO → 4 가 들어올 때 가장 먼저 온 1 을 내보냄
//   LRU  → 가장 오랫동안 안 쓰인 3 을 내보냄
//   OPT  → 앞으로 안 쓸 3 을 내보냄 (미래를 봤으니)

// dirty bit — 내보내는 비용이 다르다
//   0 = 수정 안 됨 → 그냥 버리면 끝 (디스크에 원본 있음)
//   1 = 수정됨     → 디스크에 써야 함 (느림) ← 얘를 피하자`,
  },
  // ─── 네트워크 ──────────────────────────────────────────
  {
    id: "q-net-1",
    category: "네트워크",
    question: "OSI 7계층은 왜 나누고, 각 층은 무슨 일을 하나?",
    answer:
      "택배가 집에 오는 과정을 단계로 쪼갠 것과 같다. 나누는 진짜 이유는 문제가 생겼을 때 그 층만 골라서 고칠 수 있어서다 (인터넷이 안 되면 랜선(1층)부터 볼지 DNS(7층)를 볼지 나눠서 본다). 위에서부터: 7 응용(HTTP·FTP·DNS), 6 표현(암호화·인코딩), 5 세션(연결 유지), 4 전송(포트로 앱 구분 — TCP·UDP), 3 네트워크(IP 로 경로 찾기 — 라우터), 2 데이터링크(MAC 주소 — 스위치), 1 물리(전기 신호 — 케이블).",
    code: `// 계층별 "주소"가 다르다 — 이게 핵심
//   4계층 전송   : 포트 번호 (80, 443)   → 어느 '앱'에게?
//   3계층 네트워크: IP 주소              → 어느 '컴퓨터'에게?
//   2계층 데이터링크: MAC 주소           → 어느 '랜카드'에게?

// 계층별 데이터 단위(PDU) 이름도 다르다
//   1 물리 = 비트 / 2 링크 = 프레임
//   3 네트워크 = 패킷 / 4 전송 = 세그먼트
//   → "패킷"은 원래 3계층 전용 용어다 (다 뭉뚱그려 쓰지만)`,
  },
  {
    id: "q-net-2",
    category: "네트워크",
    question: "TCP 흐름제어(Flow Control)는 뭘 막으려는 건가?",
    answer:
      "받는 사람 책상이 넘치는 걸 막는 것. 내가 아무리 빨리 보내도 상대가 처리를 못 하면 넘쳐서 버려진다(overflow). 그래서 수신 측이 '나 지금 이만큼 받을 수 있어'라고 남은 공간을 알려주고(Receive Window), 송신 측은 그만큼만 보낸다. 옛날 방식인 Stop-and-Wait 은 한 개 보내고 답 올 때까지 기다려서 너무 느렸고, 지금 쓰는 슬라이딩 윈도우는 답을 안 기다리고 창 크기만큼 연달아 보낸다.",
    code: `// 슬라이딩 윈도우의 핵심 부등식
//   (보낸 것 - 응답받은 것) ≤ 상대가 알려준 여유 공간
//   LastByteSent - LastByteAcked ≤ ReceiveWindow

// [ACK 받음][보냈는데 응답 대기][아직 안 보냄]
//           └─── 윈도우 ───┘
//   ACK 이 오면 윈도우가 오른쪽으로 슬라이드 → 새로 더 보낼 수 있음

// ★ 흐름제어 = 수신자 보호 / 혼잡제어 = 네트워크 보호 (헷갈리는 함정)`,
  },
  {
    id: "q-net-3",
    category: "네트워크",
    question: "TCP 혼잡제어(Congestion Control)의 AIMD 와 Slow Start 는?",
    answer:
      "흐름제어가 '상대 책상'을 걱정한다면, 혼잡제어는 '도로 전체'를 걱정한다. AIMD = 잘 가면 조금씩 빨리(1씩 더하기), 막히면 확 줄이기(절반으로). Slow Start 는 이름과 달리 가장 공격적이다 — 1에서 시작하지만 매 주기 2배씩 지수로 늘린다. 이름의 뜻은 '느리게 증가'가 아니라 '1부터 시작'이다. 혼잡을 만나면 이전 혼잡 지점의 절반까지만 지수로 늘리고 그 뒤론 선형으로 바꾼다.",
    code: `// 빠른 재전송 (Fast Retransmit)
//   수신 측이 순서가 어긋난 걸 받으면 '중복 ACK' 을 보낸다
//   → 송신 측이 중복 ACK 3개를 받으면
//     타임아웃을 기다리지 않고 즉시 재전송 ★

// 빠른 회복 (Fast Recovery)
//   혼잡을 만나도 윈도우를 1까지 떨구지 않고 '절반'에서 시작
//   → 이후로는 선형 증가 (순수 AIMD 처럼 동작)`,
  },
  {
    id: "q-net-4",
    category: "네트워크",
    question: "TCP 연결은 3번, 종료는 왜 4번인가? (3-way / 4-way handshake)",
    answer:
      "연결은 '여보세요?(SYN) → 네 들려요, 저도 들리세요?(SYN+ACK) → 네 들려요(ACK)' 3번이면 끝난다. 그런데 종료는 4번인데, 이유는 한쪽이 '나 할 말 끝났어(FIN)'라고 해도 상대는 아직 보낼 말이 남아있을 수 있어서다. 그래서 일단 '알았어(ACK)'만 하고, 남은 말을 다 한 뒤에 따로 '나도 끝(FIN)'을 보낸다. 마지막에 클라이언트가 TIME_WAIT 로 잠시 기다리는 건 늦게 도착하는 데이터가 있을 수 있어서다.",
    code: `// 3-way (연결)
//   Client → SYN(seq=x)              "연결하자"
//   Server → SYN(seq=y) + ACK(x+1)   "그래, 나도 연결하자"
//   Client → ACK(y+1)                "확인" → 연결 성립

// 4-way (종료) — ACK 과 FIN 을 한 번에 못 보내서 4번
//   Client → FIN    "나 다 보냈어"
//   Server → ACK    "알았어" (아직 보낼 게 남아서 여기서 끊지 않음)
//   Server → FIN    "나도 다 보냈어"
//   Client → ACK    "확인" → TIME_WAIT 후 종료`,
  },
  {
    id: "q-net-5",
    category: "네트워크",
    question: "TCP 와 UDP 는 언제 각각 쓰나?",
    answer:
      "TCP = 등기우편 (연결 확인, 순서 보장, 빠진 것 재전송 — 느리지만 확실). UDP = 전단지 뿌리기 (그냥 던짐 — 빠르지만 도착·순서 보장 없음). UDP 헤더는 딱 4개 필드(출발지 포트, 목적지 포트, 길이, 체크섬)뿐이라 아주 가볍다. 흔한 오해: UDP 도 체크섬으로 오류를 검출은 한다 — 다만 고쳐주지(정정) 않을 뿐이다. 그래서 실시간 스트리밍·게임·DNS 질의처럼 '늦게 온 정확함보다 지금의 빠름'이 중요할 때 쓴다.",
    code: `// UDP 헤더는 이게 전부 (8바이트)
//   [출발지 포트][목적지 포트][길이][체크섬]
//   TCP 헤더는 20바이트+ (순서번호·확인응답·윈도우...)

// DNS 는 UDP 53번 포트를 쓴다 (질의가 작아서 한 방에 감)
//   단, 응답이 512바이트를 넘거나
//   영역 전송(zone transfer)일 땐 TCP 로 바뀐다`,
  },
  {
    id: "q-net-6",
    category: "네트워크",
    question: "로드 밸런싱(Load Balancing)은 왜 필요하고 어떤 방식이 있나?",
    answer:
      "손님이 몰리는 식당에서 웨이터가 '3번 테이블로 가세요'라고 배정해주는 것. 서버 한 대의 성능을 올리는 게 Scale-up(비쌈), 서버를 여러 대로 늘리는 게 Scale-out(싸고 무중단 가능)인데, Scale-out 을 가능하게 해주는 게 로드 밸런서다. 방식은 셋: 라운드 로빈(순서대로 돌아가며), 최소 연결(지금 제일 한가한 서버에게 — 세션이 긴 서비스에 유리), IP 해시(같은 사용자는 늘 같은 서버로 — 세션 유지에 유리).",
    code: `// Scale-up  : 서버 1대의 CPU/RAM 을 키움 → 비싸고 한계 있음
// Scale-out : 서버를 여러 대로 늘림      → 싸고 무중단 가능
//             ↑ 이걸 하려면 로드밸런서가 필수

// 분배 방식
//   Round Robin      : 순서대로 1→2→3→1→2→3
//   Least Connections: 연결 수가 가장 적은 서버로 (긴 세션에 유리)
//   IP Hash          : hash(사용자IP) → 늘 같은 서버 (세션 유지)

// 로드밸런서 자신도 죽으면 끝이므로 이중화(Active/Passive)`,
  },
  {
    id: "q-net-7",
    category: "네트워크",
    question: "대칭키와 공개키(비대칭키)를 실제로는 왜 섞어 쓰나?",
    answer:
      "대칭키 = 자물쇠 하나에 열쇠 하나 (빠르지만, 열쇠를 상대에게 건네주는 순간 훔쳐갈 수 있다 — 키 분배 문제). 공개키 = 열쇠를 둘로 쪼갬 (안전하지만 느리다). 그래서 실제 HTTPS 는 둘을 섞는다: 느린 공개키는 '대칭키를 안전하게 전달하는 용도'로만 딱 한 번 쓰고, 그 뒤 실제 데이터는 전부 빠른 대칭키로 주고받는다. 이게 하이브리드 방식이다.",
    code: `// 방향에 따라 의미가 완전히 다르다 (면접 단골)
//   공개키로 암호화 → 개인키로 복호화 = 기밀성 (나만 열어봄)
//   개인키로 암호화 → 공개키로 검증   = 전자서명 (내가 썼음을 증명)

// HTTPS 가 실제로 하는 일
//   1) 공개키로 "대칭 세션키"만 안전하게 전달  ← 딱 한 번, 느림
//   2) 그 뒤 모든 통신은 대칭키로              ← 계속, 빠름`,
  },
  {
    id: "q-net-8",
    category: "네트워크",
    question: "HTTPS 의 TLS 핸드셰이크는 어떤 순서로 진행되나?",
    answer:
      "본론(데이터 전송) 전에 '너 진짜 그 사이트 맞아?'를 확인하고 '우리끼리 쓸 암호'를 정하는 절차. ① 클라이언트가 인사하며 쓸 수 있는 암호 방식 목록을 보낸다 ② 서버가 하나 고르고 CA 인증서를 보낸다 ③ 클라이언트가 그 인증서가 진짜인지 신뢰하는 CA 목록과 대조한다 ④ 클라이언트가 랜덤값(pre-master secret)을 서버 공개키로 암호화해 보낸다 ⑤ 서버가 개인키로 풀어 둘이 같은 대칭키를 갖는다 ⑥ 이후 데이터는 전부 그 대칭키로 주고받는다.",
    code: `// 인증서의 정체
//   "서버의 공개키를 CA 가 자기 개인키로 서명해준 것"
//   → 브라우저는 CA 의 공개키로 검증한다 (CA 목록은 미리 내장)

// 그래서 self-signed(자체 서명) 인증서는 경고가 뜬다
//   = 아무도 보증해주지 않은 신분증이라서

// ★ 비대칭키는 '대칭키를 전달할 때'와 '인증'에만 쓰인다
//   실제 데이터는 전부 대칭키 — 여기가 가장 많이 헷갈리는 지점`,
  },
  {
    id: "q-net-9",
    category: "네트워크",
    question: "브라우저에 주소를 치면 DNS 는 어떤 순서로 IP 를 찾나?",
    answer:
      "전화번호부를 뒤지는 순서가 정해져 있다. ① 내 컴퓨터의 hosts 파일 ② 캐시 (브라우저 → OS → 라우터 → 통신사 순서로 '아까 찾아둔 것' 확인) ③ 없으면 Root DNS 에 물어봄 (최상위 .com 담당자 주소를 알려줌) ④ TLD 서버에 물어봄 (그 도메인 담당 서버 주소를 알려줌) ⑤ 그 담당(Authoritative) 서버가 진짜 IP 를 준다. 이렇게 대신 끝까지 물어봐주는 걸 재귀 질의(recursive)라 한다.",
    code: `// 계층 구조 (위에서 아래로 내려가며 좁힌다)
//   Root DNS  →  TLD(.com)  →  Authoritative(example.com)
//   "com 담당자는 저기"  "example 담당자는 저기"  "IP 는 1.2.3.4"

// 개발자용 hosts 파일 = 나만의 전화번호부 (캐시보다 먼저 본다)
//   127.0.0.1  localhost
//   127.0.0.1  dev.myapp.com   ← 로컬 개발할 때 이 한 줄이면 됨`,
  },
  {
    id: "q-net-10",
    category: "네트워크",
    question: "Blocking I/O 와 Non-Blocking I/O 의 차이는?",
    answer:
      "I/O 작업은 커널만 할 수 있어서 프로세스는 커널에 부탁해야 하는데, 그 답을 기다리는 자세가 다르다. Blocking = 부탁하고 답 올 때까지 멈춰 서서 기다림. Non-Blocking = 부탁하면 커널이 '아직 없어(EWOULDBLOCK)'라고 즉시 돌려주니 다른 일을 하다가 다시 물어본다. Blocking 의 진짜 문제는 손님(클라이언트)마다 전용 직원(스레드)이 필요해져서, 손님이 많아지면 스레드 폭증 → 컨텍스트 스위칭 비용으로 성능이 무너진다는 것이다.",
    code: `// Blocking — 손님 1명당 스레드 1개 필요
//   read(sock);  // ← 데이터 올 때까지 이 스레드는 아무것도 못 함

// Non-Blocking — 스레드 1개가 손님 여럿을 상대
//   n = recvfrom(sock);          // 데이터 없으면 즉시 반환
//   if (n < 0 && errno == EWOULDBLOCK) {
//     doOtherWork();             // 멈추지 않고 다른 일
//   }

// ★ Non-blocking 은 I/O 가 빨라지는 게 아니다.
//   "기다리는 동안 다른 일을 할 수 있게" 되는 것이다.`,
  },
  {
    id: "q-net-11",
    category: "네트워크",
    question: "Blocking/Non-blocking 과 동기/비동기는 뭐가 다른 축인가?",
    answer:
      "가장 많이 헷갈리는 것 — 둘은 다른 축이라 4가지 조합이 다 존재한다. Blocking/Non-blocking = 제어권을 돌려주느냐 (내가 기다려야 하나?). 동기/비동기 = 작업 완료를 누가 챙기느냐 (내가 계속 확인하나, 상대가 알려주나?). 치킨집으로 비유하면: 동기+블로킹 = 카운터에서 튀기는 걸 보며 기다림. 비동기+논블로킹 = 볼일 보러 가면 다 되면 전화가 옴 (가장 효율적).",
    code: `//              | 내가 기다림(Blocking) | 다른 일 함(Non-blocking)
//  내가 확인(동기)| 보면서 기다림          | 가끔 와서 "나왔어요?"
//  알려줌(비동기) | 안 물어보고 기다림     | 다 되면 전화옴 ★최고

// 흔한 오해: "Blocking = 동기, Non-blocking = 비동기"
//   → 틀렸다. 독립적인 두 축이라 4가지가 모두 존재한다.`,
  },
  {
    id: "q-net-12",
    category: "네트워크",
    question: "웹소켓(WebSocket)은 일반 HTTP 와 뭐가 다른가?",
    answer:
      "HTTP 는 원래 '클라이언트가 물어봐야 서버가 답하는' 단방향 구조라, 채팅이나 실시간 알림처럼 서버가 먼저 말을 걸어야 하는 걸 못 한다. 예전엔 계속 물어보는 폴링(Polling)으로 흉내 냈는데 낭비가 심했다. 웹소켓은 처음 한 번만 HTTP 로 악수(handshake)한 뒤 연결을 계속 열어두고 양방향으로 주고받는다. 실무적 장점은 80/443 포트를 그대로 쓰기 때문에 방화벽을 새로 열 필요가 없다는 점.",
    code: `// 폴링 — 계속 물어봄 (대부분 헛걸음)
//   매 3초: "새 메시지 있어요?" → "없어요" → "없어요" ...

// 웹소켓 — 한 번 연결하고 계속 열어둠
//   ws://  또는 wss://  (http/https 에 대응)
const ws = new WebSocket("wss://example.com/chat");
ws.onmessage = (e) => console.log("서버가 먼저 보냄:", e.data);
ws.send("안녕");   // 나도 아무 때나 보낼 수 있음

// Socket.io 는 웹소켓이 아니라 그 위의 '포장지' (라이브러리)
//   웹소켓이 안 되면 폴링으로 자동 전환해준다`,
  },
  {
    id: "q-net-13",
    category: "네트워크",
    question: "백엔드(서버)는 정확히 무슨 일을 하나? 프론트에서 다 하면 안 되나?",
    answer:
      "식당으로 치면 React 화면은 손님이 보는 홀(메뉴판·주문서)이고, 백엔드는 손님 눈에 안 보이는 주방이다. 주방은 주문서를 받아 ① 제대로 적혔는지 다시 확인하고(입력 검증) ② 가게 규칙대로 처리하고(업무 규칙 — 재고가 있나, 이 손님이 주문할 자격이 있나) ③ 장부에 적어 남긴다(저장 — DB). 프론트에서 다 하면 안 되는 이유: React 코드는 사용자 브라우저로 통째로 내려가서 누구나 들여다보고 고칠 수 있다. 그래서 프론트 검증은 '친절'이고 서버 검증이 '진짜 방어선'이다. 손님(클라이언트)이 요청하고 주방(서버)이 응답하는 이 구조를 클라이언트-서버 모델이라 한다.",
    code: `// 프론트 (React) — 홀: 보여주고, 주문서를 보낸다
if (qty < 1) return alert("1개 이상 골라주세요"); // 친절한 1차 확인일 뿐
await axios.post("/api/orders", { itemId: 7, qty });

// 백엔드 (Spring) — 주방: 진짜 판단은 여기서
@PostMapping("/api/orders")
public OrderResponse order(@RequestBody @Valid OrderRequest req) { // ① 다시 검증
    return orderService.place(req);  // ② 재고·권한 확인 → ③ DB 저장
}

// 왜 서버에서 또 검사하나?
//   Postman 이나 curl 로 { "qty": -100 } 을 직접 보내면
//   React 의 if 문은 아예 거치지 않는다 → 서버만이 막을 수 있다`,
  },
  {
    id: "q-net-14",
    category: "네트워크",
    question: "HTTP 요청·응답은 어떻게 생겼나? axios 호출 한 줄과 어떻게 대응되나?",
    answer:
      "편지 봉투와 같다. 맨 윗줄(시작줄)은 '무엇을 어디에' — 요청이면 메서드+주소(POST /api/users), 응답이면 결과 번호(201 Created). 그 아래 헤더는 봉투 겉면 메모 — 내용물 종류(Content-Type: application/json), 신분증(Authorization) 같은 것. 빈 줄 하나 뒤의 바디(본문)가 편지 내용물이고, 요즘 API 는 대부분 JSON 을 담는다. axios 는 이 세 칸을 채워주는 도구일 뿐이다 — 객체를 넘기면 JSON 문자열로 바꾸고 Content-Type 도 알아서 붙인다. 돌아온 응답의 상태 번호가 res.status, 바디가 res.data 다.",
    code: `// axios 한 줄이
axios.post("/api/users", { name: "yumin" }, {
  headers: { Authorization: "Bearer abc123" },
});

// 실제로는 이런 글자 덩어리가 날아간다 (요청)
//   POST /api/users HTTP/1.1          ← 시작줄: 메서드 + 주소
//   Host: localhost:8080              ← 헤더 (봉투 겉면)
//   Content-Type: application/json    ←   axios 가 자동으로 붙임
//   Authorization: Bearer abc123
//                                     ← 빈 줄 = 헤더 끝
//   {"name":"yumin"}                  ← 바디 (내용물)

// 돌아오는 응답
//   HTTP/1.1 201 Created              ← 시작줄: 상태코드 → res.status
//   Content-Type: application/json    ← 헤더             → res.headers
//
//   {"id":1,"name":"yumin"}           ← 바디             → res.data

// 개발자도구 Network 탭에서 이 세 칸(Headers / Payload / Response)을 그대로 볼 수 있다
// (HTTP/2 는 이걸 이진 조각으로 나눠 보내지만 칸 구성은 같다)`,
  },
  {
    id: "q-net-15",
    category: "네트워크",
    question: "GET·POST·PUT·PATCH·DELETE 는 각각 CRUD 의 무엇에 해당하나?",
    answer:
      "도서관 대출 카드 관리로 보면 된다. 카드 보기 = GET (Read), 새 카드 만들기 = POST (Create), 카드를 통째로 새로 써서 바꿔 끼우기 = PUT (Update — 전체 교체), 카드의 한 칸만 고치기 = PATCH (Update — 부분 수정), 카드 버리기 = DELETE (Delete). 제일 헷갈리는 건 PUT 과 PATCH — PUT 은 원칙상 '보낸 내용이 곧 새 카드 전체'라서 빠뜨린 칸은 비워진 것으로 보고, PATCH 는 보낸 칸만 바뀐다. 다만 이건 약속일 뿐 실제 동작은 백엔드가 짠 대로다 — PUT 인데 부분 수정하는 API 도 흔하니, 메서드 이름보다 컨트롤러 코드를 확인하자.",
    code: `// 같은 주소(/api/users)에 메서드만 바꿔서 CRUD 를 표현한다
axios.get("/api/users");                 // R 목록 조회
axios.get("/api/users/3");               // R 3번 하나 조회
axios.post("/api/users", user);          // C 새로 만들기
axios.put("/api/users/3", fullUser);     // U 통째로 교체 (모든 칸을 보냄)
axios.patch("/api/users/3", { name: "yumin" }); // U 이름 칸만 수정
axios.delete("/api/users/3");            // D 삭제

// 스프링에서 짝이 되는 어노테이션
//   @GetMapping  @PostMapping  @PutMapping  @PatchMapping  @DeleteMapping

// ⚠️ HTML <form> 은 GET/POST 만 보낼 수 있다
//   → Thymeleaf 화면에서 수정·삭제가 전부 POST 로 되어 있는 이유
//   (th:method="delete" 는 숨은 _method 값으로 흉내 내는 방식 — 서버 설정을 켜야 동작)`,
  },
  {
    id: "q-net-16",
    category: "네트워크",
    question: "HTTP 상태코드 2xx·3xx·4xx·5xx 는 무슨 뜻이고, 자주 보는 코드는?",
    answer:
      "첫 자리만 봐도 '누구 탓인지' 보인다. 2xx = 성공 (200 OK 그냥 성공, 201 Created 새로 만들어짐). 3xx = 다른 데로 가세요 (리다이렉트 — 로그인 안 하고 들어가면 로그인 페이지로 보내는 302). 4xx = 보낸 쪽(클라이언트) 잘못 — 400 요청 내용이 이상함(검증 실패), 401 누군지 모름(로그인 필요), 403 누군지는 아는데 권한 없음, 404 그런 주소나 데이터가 없음. 5xx = 받은 쪽(서버) 잘못 — 500 서버 코드에서 예외가 터짐. 401 과 403 이 제일 헷갈린다: 401 은 '신분증 보여주세요', 403 은 '신분증 확인했는데 출입 금지입니다'.",
    code: `try {
  const res = await axios.post("/api/users", form);
  res.status;   // 201 → 성공 (2xx 는 정상 흐름으로 온다)
} catch (e) {
  // axios 는 기본적으로 4xx·5xx 를 catch 로 던진다
  switch (e.response?.status) {
    case 400: /* 입력값 검증 실패 → 폼에 에러 표시 */ break;
    case 401: /* 로그인 필요 → 로그인 페이지로 */ break;
    case 403: /* 권한 없음 → "접근 권한이 없습니다" */ break;
    case 404: /* 주소 오타 or 없는 데이터 */ break;
    case 500: /* 서버 버그 → 백엔드 로그 확인 요청 */ break;
  }
}

// 4xx → 내가 보낸 요청부터 의심 / 5xx → 서버 로그부터 확인
// 3xx 는 브라우저가 알아서 따라가서 axios 는 보통 최종 결과만 본다`,
  },
  {
    id: "q-net-17",
    category: "네트워크",
    question: "REST API 에서 axios.get('/api/users') 는 백엔드의 어디와 만나나?",
    answer:
      "택배는 주소와 배송 방법이 둘 다 맞아야 도착한다. 스프링도 요청이 오면 '메서드 + 주소' 짝이 맞는 메서드를 찾아 실행한다 — axios.get('/api/users') 는 @GetMapping(\"/api/users\") 가 붙은 메서드와 만난다. 주소가 맞아도 메서드가 다르면(POST 로 보냄) 405, 주소 자체가 없으면 404 가 돌아온다. 값을 꺼내는 자리도 정해져 있다: 주소 속 값(/users/3)은 @PathVariable, 물음표 뒤 값(?page=2)은 @RequestParam, JSON 바디는 @RequestBody. 돌려준 자바 객체는 JSON 으로 바뀌어 res.data 가 된다. REST 는 이렇게 '주소는 명사(자원), 동작은 메서드'로 나누자는 약속이다 (/getUsers 가 아니라 GET /users).",
    code: `// 프론트                                // 백엔드 (같은 짝끼리 만난다)
axios.get("/api/users", { params: { page: 2 } });
//   → GET /api/users?page=2          @GetMapping("/api/users")
//                                    List<UserDto> list(@RequestParam int page)

axios.get("/api/users/3");
//   → GET /api/users/3               @GetMapping("/api/users/{id}")
//                                    UserDto one(@PathVariable Long id)

axios.post("/api/users", { name: "yumin" });
//   → POST /api/users + JSON 바디    @PostMapping("/api/users")
//                                    UserDto create(@RequestBody UserForm form)

// 반환한 UserDto → (Jackson 이 JSON 으로 변환) → res.data

// 회사 코드 읽을 때: 클래스 위 어노테이션부터 본다
//   @RestController → 데이터(JSON)를 돌려줌 = axios 가 부르는 곳
//   @Controller     → "user/list" 같은 화면 이름을 돌려줌 = Thymeleaf HTML
//   클래스에 @RequestMapping("/api") 가 있으면 메서드 주소 앞에 붙는다`,
  },
  {
    id: "q-net-18",
    category: "네트워크",
    question: "React 는 3000, 스프링은 8080 — 포트·localhost 는 뭐고 CORS 에러는 왜 나나?",
    answer:
      "localhost 는 '내 컴퓨터 자신'(127.0.0.1)이고, 포트는 한 건물 안의 호수다 — 3000호엔 React 개발 서버, 8080호엔 스프링 서버가 산다. 브라우저는 '출처(Origin) = 프로토콜 + 주소 + 포트' 셋이 다 같아야 같은 집으로 본다. 그래서 localhost:3000 화면이 localhost:8080 에 요청하면 '남의 집'이 되고, 서버가 '3000 은 받아도 돼'라는 허락 헤더(Access-Control-Allow-Origin)를 안 주면 브라우저가 응답을 막는다 — 이게 CORS 에러. 핵심은 막는 주체가 서버가 아니라 브라우저라는 점 (그래서 Postman 으로는 잘 된다). 해결은 둘: ① 서버가 허락 목록에 3000 을 등록 ② 개발 중엔 React 개발 서버의 프록시가 대신 전달해서 브라우저 눈엔 같은 집 요청으로 보이게 한다.",
    code: `// 방법 ② 개발용 프록시 (Vite 기준 vite.config.ts)
export default defineConfig({
  server: {
    proxy: { "/api": "http://localhost:8080" }, // /api 로 시작하면 8080 으로 대신 전달
  },
});
axios.get("/api/users"); // 브라우저 눈엔 같은 집에 보낸 요청 → CORS 없음
// (CRA 는 package.json 에 "proxy": "http://localhost:8080" 한 줄)

// 방법 ① 서버에서 허락 (스프링)
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**").allowedOrigins("http://localhost:3000");
    }
}

// 포트 기본값: CRA 3000 · Vite 5173 · 스프링부트 8080 · MySQL 3306
// 배포 땐 보통 화면과 /api 를 한 주소 아래로 묶어서 CORS 자체가 안 생기게 한다`,
  },
  // ─── 데이터베이스 ──────────────────────────────────────
  {
    id: "q-db-1",
    category: "데이터베이스",
    question: "후보키·슈퍼키·기본키·외래키는 각각 뭐가 다른가?",
    answer:
      "학생을 구분하는 방법으로 비유하면: 슈퍼키 = 구분은 되는데 군더더기가 붙은 것 ('학번+이름' — 학번만으로 충분한데 이름이 덤). 후보키 = 딱 필요한 만큼만으로 구분되는 것 (유일성 + 최소성 둘 다 만족). 기본키 = 후보키 중에 '이걸로 하자'고 뽑은 대표 (NULL 금지, 중복 금지). 대체키 = 뽑히지 못한 나머지 후보키. 외래키 = 다른 테이블의 기본키를 가리키는 것. 시험 포인트는 슈퍼키와 후보키의 차이가 오직 '최소성'이라는 점.",
    code: `-- 학생(학번, 주민번호, 이름, 학과)
--   슈퍼키 : {학번}, {학번, 이름}, {주민번호, 이름} ...  ← 구분만 되면 다 슈퍼키
--   후보키 : {학번}, {주민번호}                        ← 군더더기 없는 것만
--   기본키 : {학번}          ← 후보키 중 대표로 선택
--   대체키 : {주민번호}      ← 뽑히지 못한 후보키

CREATE TABLE 수강 (
  학번 INT,
  과목코드 VARCHAR(10),
  PRIMARY KEY (학번, 과목코드),        -- 복합 기본키
  FOREIGN KEY (학번) REFERENCES 학생(학번)  -- 외래키
);`,
  },
  {
    id: "q-db-2",
    category: "데이터베이스",
    question: "이상현상(Anomaly) 3가지는 무엇이고 왜 생기나?",
    answer:
      "테이블 하나에 여러 정보를 욱여넣으면 생기는 부작용. 정규화를 하는 이유가 바로 이것이다. ① 삽입 이상 — 아직 수강신청을 안 한 학생은 과목코드가 없는데 그게 기본키라 NULL 이 안 돼서 아예 등록을 못 한다 ② 갱신 이상 — 학과가 바뀌었는데 중복된 행 중 일부만 고치면 데이터가 서로 안 맞게 된다 ③ 삭제 이상 — 수강을 취소하려고 행을 지웠더니 그 학생의 학과 정보까지 통째로 사라진다.",
    code: `-- 문제의 테이블: 수강(학번, 과목코드, 학과, 성적)  PK={학번, 과목코드}
--
-- 삽입 이상: 수강신청 안 한 학생을 넣고 싶은데
--            과목코드가 PK 라 NULL 불가 → 못 넣음
-- 갱신 이상: 20학번 학과를 바꾸려면 그 학생 행을 '전부' 고쳐야 함
--            하나라도 빠뜨리면 → 같은 학생인데 학과가 두 개
-- 삭제 이상: 수강 취소로 행을 지우면 → 학과 정보까지 증발

-- 해결: 테이블을 쪼갠다 (= 정규화)
--   학생(학번, 학과)  +  수강(학번, 과목코드, 성적)`,
  },
  {
    id: "q-db-3",
    category: "데이터베이스",
    question: "정규화 1NF · 2NF · 3NF 는 각각 무슨 조건인가?",
    answer:
      "중복을 없애려고 테이블을 쪼개는 단계별 규칙. 1NF = 한 칸에 값 하나만 (전화번호 3개를 한 칸에 몰아넣지 말고 행을 나눠라). 2NF = 1NF + 부분 함수 종속 제거 (기본키가 여러 개일 때, 그중 일부만으로 결정되는 컬럼을 빼내라 — 복합키일 때만 생기는 문제). 3NF = 2NF + 이행적 종속 제거 (A→B 이고 B→C 면 C 를 따로 빼라). 주의: 정규화는 무조건 좋은 게 아니라 JOIN 이 늘어 조회가 느려질 수 있다.",
    code: `-- 1NF 위반: 한 칸에 여러 값
--   (1, "홍길동", "010-1111, 010-2222")  ← ❌
--   → 행을 나눈다

-- 2NF 위반: PK={제조사, 모델} 인데 제조사국가는 '제조사'만으로 결정됨
--   (현대, 소나타, 한국)  ← 제조사국가가 PK 일부에만 종속 ❌
--   → 제조사(제조사, 국가) 테이블로 분리

-- 3NF 위반: PK={대회, 연도} → 우승자 → 우승자생일 (이행적)
--   → 우승자(이름, 생일) 테이블로 분리

-- ★ 2NF 위반은 '복합키일 때만' 생긴다 (자주 틀리는 지점)`,
  },
  {
    id: "q-db-4",
    category: "데이터베이스",
    question: "인덱스는 왜 빠르고, 왜 남발하면 안 되나?",
    answer:
      "책 뒤의 '찾아보기'와 같다. 500쪽을 다 넘기는 대신(풀스캔) 색인에서 바로 페이지를 찾는다. 대가는 두 가지: 색인을 저장할 공간이 더 들고, 본문이 바뀔 때마다 색인도 고쳐야 해서 INSERT·UPDATE·DELETE 가 느려진다. 특히 UPDATE 는 인덱스를 수정하는 게 아니라 '삭제 후 삽입' 두 번 일한다. 그래서 조회가 잦은 컬럼(WHERE·JOIN·외래키)에는 걸고, 값 종류가 몇 개 없거나(성별 같은 것) 수정이 잦은 컬럼에는 안 거는 게 맞다.",
    code: `-- 인덱스를 거는 게 좋은 컬럼
--   WHERE 에 자주 나오는 / 외래키 / JOIN 에 자주 쓰이는

-- 피해야 할 컬럼
--   중복도가 높은 것 (성별처럼 값이 2~3종류뿐 = 카디널리티 낮음)
--   INSERT/UPDATE 가 매우 잦은 것

-- DML 이 인덱스에 미치는 영향
--   INSERT : 자리 없으면 블록을 쪼갬(index split) → 그동안 잠김
--   DELETE : 인덱스에서 안 지워지고 '사용 안 함' 표시만 남음
--            → 테이블 행 수와 인덱스 항목 수가 달라질 수 있다
--   UPDATE : 수정이 아니라 Delete + Insert = 2배 작업`,
  },
  {
    id: "q-db-5",
    category: "데이터베이스",
    question: "DB 인덱스는 왜 해시가 아니라 B+Tree 를 쓰나?",
    answer:
      "해시는 O(1) 로 가장 빠른데 왜 안 쓸까? 해시는 값을 뒤섞어 버려서 '순서'가 사라지기 때문이다. 그래서 `WHERE age > 20` 같은 범위 검색이나 정렬, LIKE 앞자리 검색을 아예 못 한다. B+Tree 는 값을 리프 노드에만 두고 그 리프끼리 연결 리스트로 이어놔서, 한 지점을 찾은 뒤 옆으로 쭉 훑으면 범위 검색이 된다. 게다가 인덱스 노드에 데이터를 안 담아 한 블록에 더 많은 키가 들어가고, 그만큼 트리 높이가 낮아져 디스크 접근 횟수가 준다.",
    code: `-- 해시 인덱스: WHERE id = 5  ← O(1) 최고
--              WHERE id > 5  ← ❌ 불가능 (순서가 없으니까)

-- B+Tree: 리프끼리 연결되어 있다
--   [10]→[20]→[30]→[40]→[50]   ← 20 찾고 옆으로 쭉 = 범위 검색 ✓

-- B-Tree 와 B+Tree 차이
--   B-Tree : 모든 노드가 데이터를 가짐 → 운 좋으면 루트에서 끝
--   B+Tree : 데이터는 리프에만, 리프끼리 링크
--            → 항상 리프까지 내려가야 하지만 범위 검색이 강함`,
  },
  {
    id: "q-db-6",
    category: "데이터베이스",
    question: "트랜잭션과 ACID 는 무엇을 보장하나?",
    answer:
      "송금이 딱 좋은 예다. '내 잔고 -1만원'과 '상대 잔고 +1만원'은 둘 다 되거나 둘 다 안 돼야 한다. 중간에 멈추면 돈이 증발한다. ACID: 원자성(Atomicity — 전부 아니면 전무), 일관성(Consistency — 규칙을 어기지 않음), 격리성(Isolation — 다른 트랜잭션이 끼어들지 못함), 지속성(Durability — 성공했으면 영구히 남음). 넷 중 격리성만 유일하게 성능 때문에 '수준(level)'을 낮춰 쓰는데, 그게 격리수준이다.",
    code: `-- 트랜잭션
BEGIN;
  UPDATE 계좌 SET 잔고 = 잔고 - 10000 WHERE id = 'A';
  UPDATE 계좌 SET 잔고 = 잔고 + 10000 WHERE id = 'B';
COMMIT;   -- 둘 다 성공 → 확정
-- ROLLBACK; -- 하나라도 실패 → 시작 시점으로 되돌림

-- 어떻게 보장되나
--   원자성  ← UNDO 로그 (되돌리기)
--   지속성  ← REDO 로그 (다시 반영하기)
--   격리성  ← Locking / 격리수준
-- 대부분 DBMS 는 UNDO·REDO 둘 다 필요 (steal + no-force 정책)`,
  },
  {
    id: "q-db-7",
    category: "데이터베이스",
    question: "트랜잭션 격리수준 4단계와 각각 허용하는 이상현상은?",
    answer:
      "격리를 빡세게 할수록 안전하지만 느려진다. 그래서 4단계로 조절한다. ① Read Uncommitted — 커밋 안 된 것도 읽음 (Dirty Read 발생) ② Read Committed — 커밋된 것만 읽음, 대부분 DBMS 기본값 (Non-Repeatable Read 발생) ③ Repeatable Read — 읽는 동안 수정 못 하게 막음, MySQL 기본값 (Phantom Read 발생) ④ Serializable — 수정도 삽입도 못 하게 막음 (완벽하지만 느림). Repeatable Read 와 Serializable 의 차이는 딱 하나, INSERT 를 막느냐다.",
    code: `-- 이상현상 3종
--   Dirty Read          : 커밋도 안 한 남의 수정을 읽음
--   Non-Repeatable Read : 같은 걸 두 번 읽었는데 값이 바뀜 (UPDATE 때문)
--   Phantom Read        : 두 번 읽었는데 없던 행이 나타남 (INSERT 때문)

-- 어느 수준에서 무엇이 발생하나 (O = 발생함)
--                      Dirty  NonRepeat  Phantom
--   Read Uncommitted     O        O         O
--   Read Committed       X        O         O   ← 대부분 DBMS 기본
--   Repeatable Read      X        X         O   ← MySQL 기본
--   Serializable         X        X         X`,
  },
  {
    id: "q-db-8",
    category: "데이터베이스",
    question: "JOIN 의 종류(INNER · OUTER · CROSS)는 각각 뭘 가져오나?",
    answer:
      "두 명단을 맞춰보는 방법의 차이. INNER JOIN = 양쪽에 다 있는 사람만 (교집합). LEFT OUTER JOIN = 왼쪽 명단은 다 살리고, 오른쪽에 없으면 NULL 로 채움. RIGHT 는 그 반대. FULL OUTER = 양쪽 다 살림 (합집합). CROSS JOIN = 조건 없이 모든 조합 (3행 × 4행 = 12행) — 실수로 조건을 빠뜨리면 이게 되어 행이 폭발한다. SELF JOIN = 자기 자신과 조인 (상사-부하 관계 같은 것).",
    code: `-- 회원(id, name) 과 주문(id, member_id) 이 있을 때

-- 주문한 회원만
SELECT * FROM 회원 INNER JOIN 주문 ON 회원.id = 주문.member_id;

-- 모든 회원 + 주문 (주문 없으면 NULL)  ← "주문 안 한 회원" 찾을 때
SELECT * FROM 회원 LEFT JOIN 주문 ON 회원.id = 주문.member_id;
--   WHERE 주문.id IS NULL  을 붙이면 주문 안 한 회원만 나온다

-- ⚠️ ON 조건을 빠뜨리면 CROSS JOIN 이 되어 행이 곱해진다
--   1000명 × 1000주문 = 100만 행`,
  },
  {
    id: "q-db-9",
    category: "데이터베이스",
    question: "SQL Injection 은 어떻게 일어나고, 어떻게 막나?",
    answer:
      "입력칸에 값이 아니라 'SQL 문법'을 적어 넣어 쿼리의 의미를 바꿔버리는 공격. 예를 들어 비밀번호 칸에 `' OR '1'='1` 을 넣으면 조건이 항상 참이 되어 비밀번호 없이 로그인된다. 근본 해결책은 입력값을 문자열로 이어붙이지(concatenation) 말고 PreparedStatement 의 `?` 자리표시자를 쓰는 것 — 이러면 입력값이 '문법'이 아니라 '값'으로만 취급된다. 특수문자 필터링만으로는 우회당할 수 있어서 부족하다.",
    code: `-- ❌ 위험: 문자열을 이어붙임
String sql = "SELECT * FROM user WHERE id='" + id + "' AND pw='" + pw + "'";
-- pw 에 이런 걸 넣으면?   ' OR '1'='1
-- 완성된 쿼리: ... AND pw='' OR '1'='1'   ← 항상 참! 로그인 뚫림

-- ✅ 안전: PreparedStatement (자리표시자)
PreparedStatement ps =
  conn.prepareStatement("SELECT * FROM user WHERE id=? AND pw=?");
ps.setString(1, id);
ps.setString(2, pw);   // ← 여기 들어간 건 무조건 '값'으로만 취급됨

-- 추가 방어: DB 에러 메시지를 사용자에게 그대로 보여주지 말 것
--   (테이블 구조가 노출되어 다음 공격의 힌트가 된다)`,
  },
  {
    id: "q-db-10",
    category: "데이터베이스",
    question: "SQL(관계형)과 NoSQL 은 언제 각각 쓰나?",
    answer:
      "SQL = 정해진 양식의 서류함 (스키마가 있고, 데이터를 여러 테이블에 나눠 담고 관계로 잇는다). NoSQL = 아무 메모나 넣는 상자 (스키마가 없고, 관련 데이터를 한 덩어리로 뭉쳐 담는다 — JSON 비슷). 핵심 차이 두 가지: NoSQL 은 JOIN 이 없어서 필요한 데이터를 복제해 넣고, 그래서 읽기는 빠르지만 값이 바뀌면 복제본을 전부 고쳐야 한다. 또 SQL 은 보통 수직 확장(서버 성능 업)만 되고, 수평 확장(서버 여러 대로 분산)은 NoSQL 이 유리하다.",
    code: `-- SQL: 나눠 담고 JOIN 으로 합침 (중복 없음)
--   회원 테이블 + 주문 테이블  →  JOIN

-- NoSQL: 한 덩어리로 뭉침 (JOIN 없음, 대신 중복)
--   { _id: 1, 회원명: "홍길동", 주문: [ {상품:"책", 가격:1만} ] }
--   → 읽을 때 한 번에 다 나옴 (빠름)
--   → 회원명이 바뀌면? 이걸 품은 모든 문서를 다 고쳐야 함 (느림)

-- 고르는 기준
--   관계가 복잡하고 데이터가 자주 바뀐다      → SQL
--   구조가 유동적, 읽기 위주, 수평 확장 필요  → NoSQL`,
  },
  {
    id: "q-db-11",
    category: "데이터베이스",
    question: "커넥션 풀(Connection Pool)은 왜 쓰나?",
    answer:
      "DB 연결을 만드는 건 생각보다 비싼 작업이라(인증·네트워크 수립), 요청마다 새로 만들면 낭비다. 그래서 미리 몇 개 만들어 두고 빌려줬다 돌려받는다 — 도서관 대출과 같다. 다 빌려나가면 에러가 아니라 다음 사람이 대기한다. 크기 설정이 트레이드오프인데, 크게 잡으면 메모리를 먹고 작게 잡으면 요청이 밀린다. 실무 감각으로는 WAS 의 스레드 풀보다 커넥션 풀을 작게 잡는 게 보통이다 — 모든 요청이 DB 를 쓰는 건 아니니까.",
    code: `// 동작 3단계
//   1) 서버 뜰 때 커넥션을 미리 N개 만들어 pool 에 넣어둠
//   2) 요청이 오면 pool 에서 하나 꺼내 씀
//   3) 다 쓰면 close 가 아니라 pool 에 '반납'   ← 핵심

// 스프링부트 기본값은 HikariCP
spring:
  datasource:
    hikari:
      maximum-pool-size: 10   # 너무 크면 메모리·DB 부하, 작으면 대기

// ★ 스레드 풀 > 커넥션 풀 이 일반적
//   (정적 파일 응답처럼 DB 안 쓰는 요청도 많으니까)`,
  },
  {
    id: "q-db-12",
    category: "데이터베이스",
    question: "파티셔닝과 샤딩(Sharding)은 무슨 관계인가?",
    answer:
      "테이블이 너무 커지면(VLDB) 용량도 성능도 한계가 온다. 그래서 물리적으로 쪼개는 게 파티셔닝. 쪼개는 방향이 둘인데, 세로로 자르면(컬럼 기준) 수직 파티셔닝, 가로로 자르면(행 기준) 수평 파티셔닝이고 이 수평 분할을 샤딩이라 부른다. 좋은 점은 검색 범위가 줄고 I/O 가 분산되며 파티션별로 백업·복구가 가능하다는 것. 대가는 JOIN 비용이 커지고, 테이블과 인덱스를 따로따로 쪼갤 수 없다는 것이다.",
    code: `-- 분할 기준 4가지
--   범위(Range)  : 날짜별 — 2024년, 2025년, 2026년
--   목록(List)   : 지역별 — 서울, 부산, 대구
--   해시(Hash)   : id 를 해시해서 골고루
--   합성(Composite): 위를 조합

-- 수평 분할(= 샤딩): 행을 나눔
--   회원 1~10만  → DB1
--   회원 10만~20만 → DB2

-- 수직 분할: 컬럼을 나눔
--   자주 쓰는 컬럼 / 무거운 컬럼(사진, 긴 글)을 분리

-- ★ 앱은 쪼개진 걸 몰라도 된다 (투명성) — 코드 수정 없이 동작`,
  },
  {
    id: "q-db-13",
    category: "데이터베이스",
    question: "Redis 는 뭐고 어디에 쓰나? 데이터가 날아가지 않나?",
    answer:
      "디스크가 아니라 RAM 에 저장하는 Key-Value 저장소라 아주 빠르다 (디스크를 뒤질 필요가 없으니까). 캐싱, 실시간 채팅, 여러 서버가 로그인 세션을 공유하는 세션 클러스터링에 쓴다. '메모리니까 꺼지면 다 날아가지 않나?'가 흔한 걱정인데, 백업 방법이 두 가지 있다: 스냅샷(특정 시점을 통째로 디스크에 저장)과 AOF(들어온 명령을 기록해 뒀다가 재시작 때 다시 실행). 값으로 String·List·Set·Sorted Set·Hash 를 지원한다.",
    code: `# 캐싱 패턴 — DB 앞에 두고 먼저 물어본다
#   1) Redis 에 있나?  →  있으면 바로 반환 (빠름)
#   2) 없으면 DB 조회  →  Redis 에 저장해두고 반환

SET user:1 "홍길동" EX 3600   # 1시간 뒤 자동 만료
GET user:1

# 자료형 (단순 문자열만 되는 게 아니다)
LPUSH queue "작업1"      # List  — 큐로 활용
SADD tags "java"         # Set   — 중복 없는 집합
ZADD rank 100 "player1"  # Sorted Set — 실시간 랭킹에 딱

# 영속성: snapshot(RDB) + AOF(명령 기록) 로 재시작 시 복구`,
  },
  {
    id: "q-db-14",
    category: "데이터베이스",
    question: "테이블·행·열·기본키(PK)는 엑셀 시트와 뭐가 다른가?",
    answer:
      "겉모습은 엑셀 시트와 똑같다 — 테이블 = 시트, 행(row, 레코드) = 데이터 한 건, 열(column, 컬럼) = 항목 이름. 차이는 '규칙을 강제한다'는 것. 엑셀은 나이 칸에 '스무살'을 써도, 같은 사람을 두 줄 써도 그냥 받아준다. DB 테이블은 미리 정한 설계도(스키마)에 안 맞으면 저장 자체를 거부한다 — 열마다 타입(INT 칸엔 숫자만)을 정하고 NOT NULL(빈칸 금지), UNIQUE(중복 금지) 같은 제약조건을 건다. 그중 기본키(PK)는 '이 행을 딱 하나로 집어내는 번호표'라 NULL 도 중복도 안 된다. 그래서 백엔드는 이름이 아니라 id 로 데이터를 찾는다 (axios.get('/api/users/3') 의 3 이 바로 PK).",
    code: `CREATE TABLE users (
  id         BIGINT       PRIMARY KEY AUTO_INCREMENT, -- 번호표: 1, 2, 3... 자동
  email      VARCHAR(100) NOT NULL UNIQUE,  -- 빈칸 금지 + 중복 금지
  name       VARCHAR(50)  NOT NULL,
  age        INT,                           -- 숫자만 (NULL 은 허용)
  created_at DATETIME     DEFAULT CURRENT_TIMESTAMP -- 안 넣으면 지금 시각
);

INSERT INTO users (email, name, age) VALUES ('a@a.com', '유민', 20);
--   ✅ 들어감 (id 는 1 로 자동 부여)

-- 엑셀이면 그냥 들어갔을 것들이 DB 에선 거절된다
INSERT INTO users (email, name, age) VALUES ('b@b.com', '철수', '스무살');
--   ❌ age 는 INT 칸 → Incorrect integer value (MySQL 기본 엄격 모드)
INSERT INTO users (email, name) VALUES ('a@a.com', '또유민');
--   ❌ email 중복 → Duplicate entry 에러`,
  },
  {
    id: "q-db-15",
    category: "데이터베이스",
    question: "SELECT·INSERT·UPDATE·DELETE 기본형과, WHERE 를 빠뜨리면 생기는 일은?",
    answer:
      "DB 에 하는 말은 거의 이 네 가지다 — 조회 SELECT, 추가 INSERT, 수정 UPDATE, 삭제 DELETE (CRUD 의 R·C·U·D). WHERE 는 '어느 행에?'를 정하는 조건으로, 배열의 filter 와 같다. 무서운 건 UPDATE·DELETE 에서 WHERE 를 빠뜨렸을 때 — 에러가 나는 게 아니라 '조건 없음 = 전부'로 알아듣고 테이블의 모든 행을 바꾸거나 지운다. 그래서 실무에선 ① 같은 WHERE 로 먼저 SELECT 해서 몇 행이 걸리는지 보고 ② 트랜잭션 안에서 실행해 결과를 확인한 뒤 COMMIT 한다. MySQL Workbench 의 '안전 업데이트 모드'가 키 조건 없는 UPDATE·DELETE 를 막아두는 것도 이 사고 때문이다.",
    code: `SELECT id, name FROM users WHERE age >= 20;      -- 조회 (users.filter(u => u.age >= 20))
INSERT INTO users (name, age) VALUES ('유민', 25); -- 추가
UPDATE users SET age = 26 WHERE id = 3;          -- 3번만 수정
DELETE FROM users WHERE id = 3;                  -- 3번만 삭제

-- ⚠️ WHERE 를 빠뜨리면
UPDATE users SET age = 26;  -- 모든 회원 나이가 26 이 된다
DELETE FROM users;          -- 모든 회원이 사라진다 (에러 없이 "N rows affected")

-- 안전하게 하는 순서
SELECT COUNT(*) FROM users WHERE id = 3;  -- 1) 몇 행 걸리나 먼저 확인
START TRANSACTION;
DELETE FROM users WHERE id = 3;           -- 2) 실행
-- 3) 결과가 이상하면 ROLLBACK;  맞으면 COMMIT;`,
  },
  {
    id: "q-db-16",
    category: "데이터베이스",
    question: "GROUP BY·COUNT·SUM·HAVING 은 어떻게 쓰고, WHERE 와 HAVING 은 뭐가 다른가?",
    answer:
      "영수증 더미를 손님별로 묶어 세는 것과 같다. GROUP BY = 같은 값끼리 한 무더기로 묶기, COUNT = 무더기 안의 개수, SUM = 합계 (AVG·MAX·MIN 도 같은 집계 함수). WHERE 와 HAVING 은 거르는 '시점'이 다르다: WHERE 는 묶기 전에 영수증 한 장 한 장을 거르고(취소된 주문 빼기), HAVING 은 묶은 뒤 무더기 단위로 거른다(주문 3건 이상인 손님만). 그래서 COUNT·SUM 같은 집계 결과로 거르는 조건은 WHERE 에 못 쓰고 HAVING 에 써야 한다. 또 SELECT 에는 원칙적으로 묶은 기준 컬럼과 집계 함수만 올 수 있다 — 무더기 하나에 이름이 여러 개면 뭘 보여줄지 모르니까.",
    code: `-- orders(id, user_id, amount, status)
SELECT user_id,
       COUNT(*)    AS order_count,
       SUM(amount) AS total
FROM orders
WHERE status <> 'CANCEL'   -- ① 묶기 전: 취소 주문을 한 장씩 제외
GROUP BY user_id           -- ② 손님별로 무더기 만들기
HAVING COUNT(*) >= 3       -- ③ 묶은 뒤: 3건 이상인 무더기만
ORDER BY total DESC;       -- ④ 정렬

-- 실행 순서: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY
--   그래서 WHERE 시점엔 아직 COUNT(*) 를 모른다 (묶기 전이라)

-- COUNT(*) 는 행 수, COUNT(컬럼) 은 그 컬럼이 NULL 인 행은 안 센다

-- 같은 일을 JS 로 하면
--   const g = Object.groupBy(orders.filter(o => o.status !== "CANCEL"), o => o.userId);
--   Object.entries(g).filter(([, list]) => list.length >= 3);`,
  },
  {
    id: "q-db-17",
    category: "데이터베이스",
    question: "1:N·N:M 관계는 테이블로 어떻게 표현하고, ERD 에선 어떻게 읽나?",
    answer:
      "1:N = 회원 한 명이 주문 여러 개. 외래키(FK)는 항상 'N 쪽'(주문 테이블)에 둔다 — 주문서마다 '누구 주문인지' 회원번호를 적는 것. 반대로 회원 테이블에 주문번호를 적으려면 칸이 몇 개 필요할지 몰라서 불가능하다. N:M = 주문 하나에 상품이 여럿, 상품 하나도 여러 주문에 들어가는 관계. 이건 두 테이블만으로는 표현이 안 돼서 가운데에 '주문 상세' 같은 중간 테이블(연결 테이블)을 두고 양쪽 FK 를 둘 다 담아 1:N 두 개로 쪼갠다. 중간 테이블엔 수량·당시 가격처럼 '관계 자체의 정보'도 담을 수 있다. ERD(테이블 관계도)에선 선 끝이 까마귀 발 모양으로 갈라진 쪽이 N 이다.",
    code: `-- 1:N   회원 1 ────< 주문 N    (까마귀 발 '<' 쪽이 N)
CREATE TABLE orders (
  id      BIGINT PRIMARY KEY,
  user_id BIGINT NOT NULL,                 -- FK 는 N 쪽에!
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- N:M   주문 >───< 상품   → 중간 테이블로 1:N 두 개로 쪼갠다
--       주문 1 ──< 주문상세 >── 1 상품
CREATE TABLE order_items (
  order_id   BIGINT,
  product_id BIGINT,
  quantity   INT NOT NULL,                 -- 관계 자체의 정보
  PRIMARY KEY (order_id, product_id),
  FOREIGN KEY (order_id)   REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- 회사 JPA 코드에선 이렇게 보인다
--   @ManyToOne User user;                    ← FK 를 가진 N 쪽 (orders.user_id)
--   @OneToMany(mappedBy = "user") List<Order> orders;  ← 1 쪽 (실제 칸은 없음)
--   @ManyToMany 는 중간 테이블에 칸(수량)을 못 더해서, 실무에선 중간 엔티티를 따로 만든다`,
  },
  {
    id: "q-db-18",
    category: "데이터베이스",
    question: "스프링부트는 MySQL 에 어떻게 연결하나? (datasource·JDBC 드라이버·ddl-auto)",
    answer:
      "axios 에 baseURL 을 설정하듯, 스프링에는 'DB 주소·아이디·비밀번호'를 application.yml 의 spring.datasource 에 적어준다. 그런데 자바는 MySQL 말을 바로 못 한다 — JDBC 는 자바의 표준 '콘센트 모양'이고, JDBC 드라이버(mysql-connector-j)는 MySQL 에 맞춘 '어댑터'다. 그래서 build.gradle 에 드라이버를 꼭 추가해야 연결된다. JPA 를 쓴다면 spring.jpa.hibernate.ddl-auto 를 반드시 확인할 것 — 엔티티를 보고 테이블을 자동으로 만들어 주는 기능인데, create 는 켤 때마다 테이블을 지우고 새로 만든다. 운영 DB 에 create 가 켜지면 데이터가 통째로 날아간다. 운영은 validate(맞는지 확인만)나 none(아무것도 안 함)이 안전하다.",
    code: `# build.gradle — 어댑터(드라이버) 꽂기
#   runtimeOnly 'com.mysql:mysql-connector-j'
#   implementation 'org.springframework.boot:spring-boot-starter-data-jpa'

# application.yml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/shop  # jdbc:종류://주소:포트/DB이름
    username: app
    password: \${DB_PASSWORD}  # 비밀번호는 코드에 쓰지 말고 환경변수로
    # driver-class-name: com.mysql.cj.jdbc.Driver  ← url 을 보고 자동 추론돼서 생략 가능
  jpa:
    hibernate:
      ddl-auto: validate  # ⚠️ 여기를 꼭 본다

# ddl-auto 값 (켤 때 테이블을 어떻게 할까)
#   create      : 지우고 새로 만든다      → 운영에서 쓰면 데이터 전멸 💀
#   create-drop : create + 끌 때 또 지움  → 테스트용
#   update      : 바뀐 부분만 추가        → 컬럼 삭제·변경은 안 해줘서 꼬이기 쉽다
#   validate    : 엔티티와 테이블이 맞는지 확인만 (안 맞으면 실행 실패)
#   none        : 아무것도 안 함          → 운영의 기본 선택`,
  },
  // ─── 자료구조 ──────────────────────────────────────────
  {
    id: "q-ds-1",
    category: "자료구조",
    question: "배열과 연결 리스트(LinkedList)는 언제 각각 유리한가?",
    answer:
      "배열 = 극장 좌석 (번호를 알면 바로 찾아감 — 접근 O(1), 대신 중간에 한 명 끼워 넣으려면 뒷사람이 다 밀려야 함 O(N)). 연결 리스트 = 보물찾기 쪽지 (다음 위치만 알려줌 — 중간 삽입은 쪽지만 고쳐 쓰면 되니 O(1), 대신 k번째를 찾으려면 처음부터 세어가야 함 O(N)). 함정: '연결 리스트 삽입이 O(1)'은 넣을 위치를 이미 알고 있을 때만이다. 위치를 찾는 것부터 하면 결국 O(N)이다.",
    code: `// 배열        접근 O(1)  |  삽입/삭제 O(N)  |  메모리 연속
// 연결 리스트  접근 O(N)  |  삽입/삭제 O(1)* |  포인터만큼 추가 메모리
//                            (*위치를 이미 알 때)

struct Node { int data; struct Node* next; };

// 연결 리스트는 임의 접근(Random Access)이 안 된다
//   → 그래서 이진 탐색을 적용할 수 없다 ★

// ArrayList: 꽉 차면 2배로 늘려 복사 (재할당은 O(N) 이지만 드물어서
//            평균적으로는 접근 O(1) 을 유지)`,
  },
  {
    id: "q-ds-2",
    category: "자료구조",
    question: "스택과 큐의 차이는? 각각 어디에 쓰이나?",
    answer:
      "스택 = 접시 쌓기 (마지막에 올린 걸 먼저 꺼냄, LIFO). 큐 = 줄 서기 (먼저 온 사람이 먼저 나감, FIFO). 스택은 함수 호출(그래서 '콜 스택'), 되돌리기(Undo), 괄호 검사, 후위 표기법 계산에 쓰인다. 큐는 버퍼, BFS 탐색, 운영체제 스케줄링, 대기열에 쓰인다. 큐를 배열로 만들 때 주의점이 있는데, 앞이 비었는데도 뒤가 끝에 닿으면 꽉 찼다고 오판하는 문제가 있어서 원형 큐를 쓴다.",
    code: `// 스택 (LIFO)          큐 (FIFO)
//   push → [3]            enqueue → [1][2][3] → dequeue
//          [2]                       나가는 쪽    들어오는 쪽
//   pop  ← [1]

// 원형 큐: 끝에 닿으면 다시 앞으로 (index + 1) % size
//   ★ 한 자리는 항상 비워둔다
//     왜? front == rear 일 때 "텅 빔"인지 "꽉 참"인지
//         구분할 방법이 없어서

// 자바스크립트 배열은 둘 다 된다
//   스택: arr.push() / arr.pop()
//   큐:   arr.push() / arr.shift()`,
  },
  {
    id: "q-ds-3",
    category: "자료구조",
    question: "힙(Heap)은 어떤 자료구조이고 왜 쓰나?",
    answer:
      "최댓값이나 최솟값을 계속 빠르게 꺼내야 할 때 쓰는 완전 이진 트리. 우선순위 큐를 만드는 표준 방법이다. 핵심 오해 하나: 힙은 정렬된 게 아니라 '반정렬' 상태다 — 부모가 자식보다 크다(최대 힙)는 것만 보장하고, 형제끼리는 순서가 없다. 삽입·삭제 모두 O(log n). 배열로 구현하는데 인덱스 계산이 깔끔해서다: 왼쪽 자식 = 2i, 오른쪽 자식 = 2i+1, 부모 = i/2 (1부터 시작할 때).",
    code: `// 최대 힙 — 부모 ≥ 자식 (형제끼리는 순서 없음!)
//          9
//        /   \
//       7     8      ← 7 과 8 사이엔 아무 규칙 없다
//      / \
//     3   5

// 삽입: 맨 끝에 붙이고 → 부모와 비교하며 위로 올림 (up-heap)
// 삭제: 루트를 빼고 → 마지막 노드를 루트로 → 아래로 내림 (down-heap)
//   둘 다 트리 높이만큼만 움직이므로 O(log n)

// BST 와 다른 점: 힙은 중복을 허용하고, 중위 순회해도 정렬이 아니다`,
  },
  {
    id: "q-ds-4",
    category: "자료구조",
    question: "트리와 그래프의 차이는? 순회 방법 4가지는?",
    answer:
      "트리는 그래프의 특수한 경우다. 조건 둘: 사이클이 없고, 모든 노드가 연결되어 있어야 한다. 여기서 자주 틀리는 함정 — '사이클 없는 그래프 = 트리'는 틀렸다. 연결까지 되어 있어야 트리고, 끊어져 있으면 숲(Forest)이다. 노드가 N개면 간선은 반드시 N-1개. 순회는 넷: 전위(부모→왼→오), 중위(왼→부모→오), 후위(왼→오→부모), 레벨 순회(층별로 — 이건 BFS 와 같고 큐로 구현한다).",
    code: `//        1
//      /   \
//     2     3
//    / \
//   4   5

// 전위(pre)   부모→왼→오 : 1 2 4 5 3
// 중위(in)    왼→부모→오 : 4 2 5 1 3   ← BST 면 정렬 결과가 됨 ★
// 후위(post)  왼→오→부모 : 4 5 2 3 1
// 레벨(BFS)   층별       : 1 2 3 4 5   ← 큐로 구현

// 트리의 조건
//   ① 사이클 없음  ② 모두 연결됨
//   사이클만 없고 끊겨 있으면 → 숲(Forest)`,
  },
  {
    id: "q-ds-5",
    category: "자료구조",
    question: "이진탐색트리(BST)의 시간복잡도가 O(N)이 되는 경우는?",
    answer:
      "BST 는 왼쪽 < 부모 < 오른쪽 규칙으로 반씩 줄여가며 찾으니 보통 O(log N)이다. 그런데 이미 정렬된 데이터를 순서대로 넣으면 한쪽으로만 자라서 사실상 연결 리스트가 된다 — 이게 편향 트리(skewed tree)고 이때 O(N)이다. 성능이 전적으로 트리 '깊이'에 달려 있기 때문. 이 문제를 막으려고 삽입·삭제할 때마다 자동으로 균형을 맞추는 AVL·레드블랙 트리가 나왔다.",
    code: `// 1,2,3,4,5 를 순서대로 넣으면?
//   1
//    \
//     2         ← 한쪽으로만 자란다 = 사실상 연결 리스트
//      \          탐색 O(N) 😱
//       3
//        \
//         4

// 삭제할 때 자식이 2개면?
//   → 오른쪽 서브트리의 최솟값 (또는 왼쪽의 최댓값) 으로 대체
//     그래야 왼쪽<부모<오른쪽 규칙이 유지된다

// 해결: AVL, Red-Black Tree (자동 균형 → 최악에도 O(log N) 보장)`,
  },
  {
    id: "q-ds-6",
    category: "자료구조",
    question: "해시테이블의 충돌(Collision)은 어떻게 해결하나?",
    answer:
      "해시 함수가 서로 다른 값을 같은 칸으로 보내는 게 충돌이다 (무한한 입력을 유한한 칸에 넣으니 필연). 해결법 둘: ① 체이닝 — 그 칸에 연결 리스트를 매달아 계속 이어 붙인다 (간단하지만 메모리를 더 씀) ② 개방 주소법 — 다른 빈 칸을 찾아간다. 찾는 방식은 선형 조사(바로 옆칸), 이차 조사(1,4,9칸씩 — 뭉치는 현상 완화), 이중 해싱(다른 해시 함수로 다시 계산). 그리고 적재율이 0.7~0.8 을 넘으면 테이블을 키우고 전부 다시 해싱한다.",
    code: `// 충돌: hash("Lee") = 5, hash("Chun") = 5  ← 같은 칸!

// ① 체이닝 — 연결 리스트로 매단다
//   [5] → ("Lee", 값) → ("Chun", 값)

// ② 개방 주소법 — 빈 칸을 찾아간다
//   선형 조사: 5 차면 6, 7, 8...   (한 곳에 뭉치는 문제 = clustering)
//   이차 조사: 5 차면 +1, +4, +9   (뭉침 완화)
//   이중 해싱: 다른 해시 함수로 간격을 계산

// 적재율 = 저장된 개수 / 전체 칸 수
//   0.7~0.8 넘으면 → 테이블 2배로 늘리고 전부 재해싱(rehashing)

// ★ 평균 O(1) 이지만 충돌이 몰리면 최악 O(N)`,
  },
  {
    id: "q-ds-7",
    category: "자료구조",
    question: "트라이(Trie)는 뭐고 언제 쓰나?",
    answer:
      "문자열을 글자 단위로 쪼개서 트리로 만든 것. 앞부분(접두사)이 같으면 길을 공유한다. 검색어 자동완성이 대표적인 용도다. 강점은 속도인데, 단어가 N개여도 찾는 데 걸리는 시간은 단어 개수와 무관하게 '찾는 문자열 길이 M'에만 비례한다 — O(M). 이진탐색트리로 문자열을 다루면 O(M·logN)인 것과 대비된다. 대가는 메모리 — 노드마다 자식 배열(알파벳이면 26칸)을 들고 있어야 해서 낭비가 크다.",
    code: `// "car", "cat", "dog" 를 넣으면 — 'ca' 를 공유한다
//   (root)
//     ├─ c ─ a ─ r*      ← * = 단어 끝
//     │        └─ t*
//     └─ d ─ o ─ g*

// 노드 구조
//   end   : 여기서 단어가 끝나는가 (boolean)
//   child : 자식 노드 배열 (소문자면 26칸, 숫자면 10칸)

// 시간복잡도 — 단어가 100만 개여도 상관없다
//   트라이 : O(M)        M = 찾는 문자열 길이
//   BST    : O(M · logN) N = 단어 개수

// 해시는 정확히 일치하는 검색만 O(1) — 접두사 검색(자동완성)은 못 한다`,
  },
  {
    id: "q-ds-8",
    category: "자료구조",
    question: "B-Tree 가 데이터베이스와 파일 시스템에서 쓰이는 이유는?",
    answer:
      "핵심은 디스크의 특성이다. 디스크는 2바이트를 읽든 1024바이트를 읽든 비용이 거의 같다 — 한 번 읽는 '횟수'가 비용이다. 그래서 노드 하나에 데이터를 잔뜩 담아 자식을 많이 두면(다진 트리) 트리 높이가 확 낮아지고, 디스크를 읽는 횟수가 줄어든다. 이진 트리는 자식이 2개뿐이라 높이가 높아 디스크 접근이 많아진다. 게다가 B-Tree 는 모든 리프까지의 거리가 항상 같아서(자동 균형) 편향될 걱정도 없다.",
    code: `// 이진 트리: 100만 개 → 높이 약 20 → 디스크 접근 20번
// B-Tree(자식 100개): 100만 개 → 높이 3 → 디스크 접근 3번 ★

// B-Tree 규칙
//   데이터가 N개인 노드는 자식이 N+1개
//   노드 안의 데이터는 정렬되어 있음
//   모든 리프까지의 경로 길이가 동일 (자동 균형)

// B+Tree (실제 DB 인덱스가 쓰는 것)
//   데이터는 리프 노드에만, 인덱스 노드는 길잡이만
//   → 한 노드에 키를 더 많이 담을 수 있어 높이가 더 낮아짐
//   → 리프끼리 연결 리스트라 범위 검색이 빠름`,
  },
  {
    id: "q-ds-9",
    category: "자료구조",
    question: "DFS 와 BFS 는 각각 어떤 문제에 쓰나?",
    answer:
      "DFS = 미로에서 한 방향으로 끝까지 가보고 막히면 되돌아오기 (재귀나 스택으로 구현). BFS = 시작점에서 가까운 곳부터 물결처럼 퍼지기 (큐로 구현). 시간복잡도는 둘 다 같아서 선택 기준은 '목적'이다. 모든 경로를 다 봐야 하면 DFS, 최단 거리·최소 횟수를 구해야 하면 BFS 다. BFS 가 최단 거리를 보장하는 이유는 가까운 것부터 순서대로 방문하기 때문이다.",
    code: `// DFS — 스택/재귀. 깊이 먼저.
function dfs(node, visited) {
  visited.add(node);
  for (const next of graph[node]) {
    if (!visited.has(next)) dfs(next, visited);
  }
}

// BFS — 큐. 가까운 것 먼저 → 최단 거리 보장 ★
function bfs(start) {
  const q = [start], visited = new Set([start]);
  while (q.length) {
    const node = q.shift();
    for (const next of graph[node]) {
      if (!visited.has(next)) { visited.add(next); q.push(next); }
    }
  }
}

// 시간복잡도 (둘 다 동일)
//   인접 행렬 O(V²)  |  인접 리스트 O(V+E)  ← 희소 그래프는 리스트가 유리`,
  },
  {
    id: "q-ds-10",
    category: "자료구조",
    question: "퀵 정렬·병합 정렬·힙 정렬은 뭐가 다른가?",
    answer:
      "셋 다 평균 O(n log n) 인데 성격이 다르다. 퀵 = 기준값(피벗)으로 좌우를 가르며 재귀. 평균은 가장 빠르지만 피벗을 최악으로 고르면 O(n²). 병합 = 끝까지 쪼갠 뒤 합치며 정렬. 최악에도 O(n log n) 보장이고 안정 정렬이지만 추가 메모리 O(n) 이 필요하다. 힙 = 힙을 만들어 최댓값을 하나씩 빼냄. 추가 메모리 없이 O(n log n) 보장. 퀵이 실무 기본인 이유는 먼 거리 원소를 교환해서 비교 횟수가 적고 캐시 효율이 좋기 때문이다.",
    code: `//        | 평균      | 최악      | 안정? | 추가메모리
//  퀵     | n log n   | n²        | ❌    | O(log n)
//  병합   | n log n   | n log n   | ✅    | O(n)
//  힙     | n log n   | n log n   | ❌    | O(1)

// 안정 정렬(stable) = 같은 값의 원래 순서가 유지됨
//   안정   : 버블, 삽입, 병합
//   불안정 : 선택, 퀵, 힙

// 퀵의 최악 O(n²): 이미 정렬된 배열에서 첫 원소를 피벗으로 잡을 때
//   → 중간값을 피벗으로 고르면 완화된다

// 병합 정렬은 순차 접근만 하므로 연결 리스트 정렬에 유리
//   (퀵은 임의 접근이 필요해서 연결 리스트에선 비효율)`,
  },
  {
    id: "q-ds-11",
    category: "자료구조",
    question: "시간복잡도 Big-O 는 무엇을 재는 건가?",
    answer:
      "입력이 커질 때 걸리는 시간이 '어떤 모양으로' 늘어나는지를 재는 것. 정확한 초를 재는 게 아니라 증가 추세만 본다 — 그래서 상수와 낮은 차수는 버린다 (3n²+5n+2 → O(n²)). 그리고 Big-O 는 최악의 경우를 말한다. 빠른 순서로: O(1) 상수 < O(log n) 로그 < O(n) 선형 < O(n log n) < O(n²) 제곱 < O(2ⁿ) 지수. 실무 감각으로 O(n²) 은 데이터가 1만 개만 넘어가도 버겁다.",
    code: `// O(1)      — 배열 인덱스 접근, 해시 조회
arr[5];

// O(log n)  — 이진 탐색, 균형 트리 (매번 절반씩 줄임)
while (lo <= hi) { mid = (lo+hi)/2; ... }

// O(n)      — 배열 한 번 훑기
for (const x of arr) { ... }

// O(n log n) — 병합/퀵/힙 정렬 (정렬의 이론적 한계)
arr.sort();

// O(n²)     — 이중 반복문 ← 데이터 1만 개면 1억 번, 위험 신호
for (const a of arr) for (const b of arr) { ... }

// 규칙: 상수와 낮은 차수는 버린다
//   3n² + 5n + 2  →  O(n²)`,
  },
  {
    id: "q-ds-12",
    category: "자료구조",
    question: "해시맵(HashMap)과 트리맵(TreeMap)은 언제 각각 쓰나?",
    answer:
      "해시맵 = 사물함 (번호를 해시로 계산해 바로 감 — 평균 O(1), 대신 순서가 뒤죽박죽). 트리맵 = 사전 (항상 정렬된 상태로 유지 — O(log n), 대신 조금 느림). 그래서 순서가 상관없고 속도만 중요하면 해시맵, 정렬된 순회나 '30 이상 50 이하' 같은 범위 조회가 필요하면 트리맵이다. 트리맵은 보통 레드블랙 트리로 구현되어 최악에도 O(log n) 을 보장하지만, 해시맵은 충돌이 몰리면 최악 O(N) 까지 떨어진다.",
    code: `//          | 접근      | 순서       | 최악
//  HashMap | O(1) 평균 | ❌ 없음    | O(N) (충돌 몰릴 때)
//  TreeMap | O(log n)  | ✅ 정렬됨  | O(log n) 보장

// 자바스크립트에는 TreeMap 이 없다 (Map 은 삽입 순서만 유지)
const m = new Map();
m.set("b", 2); m.set("a", 1);
[...m.keys()];              // ["b", "a"]  ← 삽입 순서, 정렬 아님
[...m.keys()].sort();       // 정렬이 필요하면 직접 해야 함

// 고르는 기준
//   그냥 빠르게 저장/조회       → HashMap
//   정렬 순회, 범위 검색 필요   → TreeMap`,
  },
  {
    id: "q-spring-1",
    category: "SpringBoot",
    question: "스프링부트는 뭐고, 왜 쓰나?",
    answer:
      "자바 웹 서버 개발의 밀키트. 원래는 서버(톰캣) 설치, 설정 파일 잔뜩, 라이브러리 버전 맞추기까지 손질할 게 많았는데, 스프링부트는 그게 다 미리 손질되어 있다. 어노테이션 하나 + main 메서드 몇 줄이면 바로 실행되는 웹 서버가 만들어진다.",
    code: `// 스프링부트 = 반조리 밀키트 🍲
// 서버(톰캣)도 안에 들어있어서 이게 전부다:

@SpringBootApplication  // "여기서 시작!" 표시
public class MyApp {
    public static void main(String[] args) {
        SpringApplication.run(MyApp.class, args);
        // 실행하면 → http://localhost:8080 서버가 켜진다
    }
}`,
  },
  {
    id: "q-spring-2",
    category: "SpringBoot",
    question: "스프링부트로 REST API 는 어떻게 만드나?",
    answer:
      "@RestController 를 붙인 클래스 안에 @GetMapping(\"/주소\") 메서드를 만들면 끝. 그 주소로 요청이 오면 메서드가 실행되고, 반환값이 그대로 응답이 된다. 식당 메뉴판에 \"이 메뉴 주문하면 이 요리가 나옵니다\"를 적는 것과 같다.",
    code: `@RestController              // "나 API 담당 직원이야"
public class HelloController {

    @GetMapping("/hello")    // GET /hello 주문이 오면
    public String hello() {
        return "안녕!";       // 이게 응답으로 나간다
    }

    @GetMapping("/users/{id}")   // 주소 속 값도 받는다
    public String user(@PathVariable Long id) {
        return id + "번 사용자";  // GET /users/3 → "3번 사용자"
    }
}`,
  },
  {
    id: "q-spring-3",
    category: "SpringBoot",
    question: "의존성 주입(DI)이란?",
    answer:
      "필요한 부품(객체)을 내가 직접 만들지(new) 않고, 스프링이 만들어서 꽂아주는 것. 요리사가 장을 직접 보러 가지 않고 재료를 배달받는 셈. 좋은 점: ① 부품 교체가 쉽다 (진짜 DB ↔ 테스트용 가짜) ② 클래스끼리 덜 끈끈해져서(느슨한 결합) 수정이 편하다.",
    code: `@Service
public class OrderService {
    private final OrderRepository repo;

    // 생성자에 "이 부품 필요해요" 라고 적어두면
    // 스프링이 알아서 만들어서 배달해준다 = DI
    public OrderService(OrderRepository repo) {
        this.repo = repo;
        // 직접 new OrderRepository() 안 했다는 게 포인트!
    }
}
// 테스트할 땐 가짜 repo를 꽂으면 되니 테스트도 쉬워진다`,
  },
  {
    id: "q-spring-4",
    category: "SpringBoot",
    question: "JPA 와 @Entity 는 무슨 역할인가?",
    answer:
      "JPA = 자바 객체와 DB 테이블 사이의 자동 통역사 (ORM). 자바는 객체로 말하고 DB 는 표(테이블)로 말하는데, JPA 가 둘 사이를 번역해준다. @Entity 를 붙인 클래스는 테이블과 짝꿍이 되고, SQL 을 직접 안 써도 save(), findById() 같은 자바 메서드로 저장/조회가 된다.",
    code: `// @Entity = "이 클래스는 DB 테이블과 짝꿍"
@Entity
public class Member {
    @Id @GeneratedValue   // 기본키, 번호 자동 증가
    private Long id;
    private String name;  // → name 컬럼과 자동 연결
}

// SQL 없이 자바 코드로 저장/조회
memberRepository.save(new Member("yumin"));
// → 통역사(JPA)가 INSERT INTO member ... 로 번역
memberRepository.findById(1L);
// → SELECT * FROM member WHERE id = 1 로 번역`,
  },
  {
    id: "q-spring-5",
    category: "SpringBoot",
    question: "빈(Bean)과 IoC 컨테이너는 무슨 관계인가?",
    answer:
      "IoC 컨테이너 = 공용 물품 보관소, 빈 = 거기 보관된 물품(객체). @Component / @Service 등을 붙이면 스프링이 앱 시작 때 그 객체를 '미리 만들어서' 보관소에 넣어두고, 필요한 곳에 꽂아준다(DI). 기본은 싱글턴 — 하나만 만들어 모두가 돌려쓴다. '내가 new 하는' 게 아니라 '스프링이 만들어 관리하는' 것이라 제어가 뒤집혔다(IoC = 제어의 역전)고 부른다.",
    code: `// @Service 를 붙이는 순간 → 스프링이 만들어 보관소에 등록 (= 빈)
@Service
public class OrderService { /* ... */ }

// 필요한 곳에서는 생성자에 적어두기만 하면 배달됨 (DI)
@RestController
public class OrderController {
    private final OrderService service; // 보관소에서 꺼내 꽂아줌

    public OrderController(OrderService service) {
        this.service = service; // new OrderService() 안 함!
    }
}
// 기본은 싱글턴: 앱 전체에서 OrderService 는 딱 1개`,
  },
  {
    id: "q-spring-6",
    category: "SpringBoot",
    question: "Controller - Service - Repository 3계층으로 나누는 이유는?",
    answer:
      "식당의 분업과 같다. Controller = 홀 직원 (주문 접수, 요청/응답 형식 담당), Service = 주방 (실제 요리 = 비즈니스 로직), Repository = 창고 (재료 = DB 접근). 홀 직원이 요리까지 하면 가게가 엉망이 되듯, 계층을 나누면 ① 각자 바뀌어도 서로 영향이 적고 ② 주방(로직)만 따로 테스트할 수 있고 ③ 코드를 찾을 때 '어디 있을지'가 예측된다.",
    code: `@RestController  // 홀: 주문 접수와 응답만
public class OrderController {
    private final OrderService service;
    @PostMapping("/orders")
    public OrderResponse order(@RequestBody OrderRequest req) {
        return service.placeOrder(req); // 요리는 주방에 넘긴다
    }
}

@Service         // 주방: 비즈니스 규칙 담당
public class OrderService {
    private final OrderRepository repo;
    public OrderResponse placeOrder(OrderRequest req) {
        // 재고 확인, 할인 계산 같은 "진짜 로직"은 여기
        return repo.save(req.toEntity()).toResponse();
    }
}

public interface OrderRepository extends JpaRepository<Order, Long> { }
// 창고: DB 에서 꺼내고 넣기만`,
  },
  {
    id: "q-spring-7",
    category: "SpringBoot",
    question: "@Transactional 은 뭘 보장해주나?",
    answer:
      "계좌이체를 생각하면 된다. '내 계좌 출금'과 '상대 계좌 입금'은 반드시 둘 다 성공하거나 둘 다 없던 일이 되어야 한다. 출금만 되고 입금이 실패하면 돈이 증발하니까. @Transactional 을 붙인 메서드는 안의 DB 작업들이 '한 묶음(트랜잭션)'이 되어, 중간에 예외가 터지면 전부 자동으로 되돌려진다(롤백). All or Nothing.",
    code: `@Service
public class TransferService {

    @Transactional  // 이 메서드 전체가 "한 묶음"
    public void transfer(Long fromId, Long toId, int amount) {
        Account from = repo.findById(fromId).orElseThrow();
        Account to = repo.findById(toId).orElseThrow();

        from.withdraw(amount);  // 1) 출금
        to.deposit(amount);     // 2) 입금
        // 2)에서 예외가 터지면? → 1)의 출금도 자동 취소 (롤백)
        // @Transactional 이 없으면? → 돈이 증발한다 💸
    }
}`,
  },
  {
    id: "q-spring-8",
    category: "SpringBoot",
    question: "application.yml 과 프로파일(profile)은 왜 쓰나?",
    answer:
      "여행 가방을 나라별로 미리 싸두는 것. 개발할 땐 내 컴퓨터 DB, 배포하면 진짜 서버 DB — 환경마다 설정이 다른데, 이걸 코드에 하드코딩하면 배포할 때마다 코드를 고쳐야 한다. application.yml 에 설정을 빼두고, application-dev.yml / application-prod.yml 처럼 프로파일별 가방을 만들어두면 실행할 때 스위치 하나로 갈아끼울 수 있다.",
    code: `# application.yml — 공통 설정
spring:
  application:
    name: my-app

# application-dev.yml — 개발용 가방 🎒
spring:
  datasource:
    url: jdbc:h2:mem:testdb      # 내 컴퓨터용 임시 DB

# application-prod.yml — 운영용 가방 🧳
spring:
  datasource:
    url: jdbc:mysql://real-server/db  # 진짜 DB

# 실행할 때 가방 선택:
# java -jar app.jar --spring.profiles.active=prod`,
  },
  {
    id: "q-spring-9",
    category: "SpringBoot",
    question: "스프링부트 프로젝트는 어떻게 만들고 실행하나? (내 클래스가 안 잡히는 이유는?)",
    answer:
      "React 의 'npm create vite' 처럼 start.spring.io 에서 빌드 도구(Gradle/Maven), 자바 버전, 필요한 부품(의존성 — Spring Web, JPA, Thymeleaf 등)을 고르면 뼈대 zip 을 준다. build.gradle 이 package.json, './gradlew bootRun' 이 'npm run dev' 역할이고, 실행하면 내장 톰캣이 8080 포트로 뜬다. 주의할 점: @SpringBootApplication 은 '내가 놓인 패키지와 그 하위 폴더'만 훑어서(컴포넌트 스캔) 빈을 등록한다. 메인 클래스보다 바깥 패키지에 만든 컨트롤러는 스프링이 아예 모른다 → 404.",
    code: `// start.spring.io 에서 고르는 것
//   Project: Gradle   Language: Java   Spring Boot: 3.x
//   Java: 17 이상 (부트 3 의 최소 버전)
//   Dependencies: Spring Web, Spring Data JPA, Thymeleaf ...

// React 와 짝 맞추기
//   package.json      ↔ build.gradle      (부품 목록)
//   npm run dev       ↔ ./gradlew bootRun (개발 실행)
//   npm run build     ↔ ./gradlew build   (→ build/libs/*.jar)
//   (배포)             java -jar app.jar

com.example.shop
 ├─ ShopApplication.java   // @SpringBootApplication — 여기가 스캔 시작점
 ├─ order/OrderController  // ✅ 하위 패키지라 자동 등록
 └─ member/MemberService   // ✅
com.example.other.XController // ❌ 바깥 패키지 → 스캔 안 됨 → 404`,
  },
  {
    id: "q-spring-10",
    category: "SpringBoot",
    question: "어노테이션(@)은 정체가 뭔가? 붙이면 왜 동작하나?",
    answer:
      "택배 상자에 붙이는 '취급주의' 스티커. 스티커 자체는 아무 일도 안 한다 — 택배 기사(스프링)가 스티커를 읽고 그에 맞게 다룰 뿐이다. 마찬가지로 어노테이션은 코드에 붙이는 표시(메타데이터)일 뿐이고, 스프링이 앱 시작 때 클래스들을 훑으며 '@Service 가 붙었네 → 객체 만들어 등록', '@GetMapping 이 붙었네 → 이 주소와 연결' 처럼 대신 일해준다. React 테스트에서 data-testid 를 붙여 두면 RTL 이 그걸 읽고 찾아주는 것과 같은 구조. 그래서 스프링이 안 읽는 곳(스캔 범위 밖, new 로 직접 만든 객체)에 붙이면 아무 효과가 없다.",
    code: `@Service              // 스프링: "객체 만들어서 보관소에 등록할게"
public class OrderService {

    @Transactional    // 스프링: "이 메서드는 한 묶음으로 감쌀게"
    public void order() { ... }
}

// 누가 읽느냐에 따라 시점이 다르다
//   @Override        → 컴파일러가 읽음 (오버라이드 맞는지 검사)
//   @Getter (롬복)    → 컴파일할 때 getter 코드를 대신 써 줌
//   @Service 등 스프링 → 앱 실행 시 스프링이 읽고 처리

// ❌ 함정: 직접 new 하면 스프링을 안 거치니 스티커가 무시된다
OrderService s = new OrderService();
s.order();  // @Transactional 효과 없음`,
  },
  {
    id: "q-spring-11",
    category: "SpringBoot",
    question: "@RequestParam / @PathVariable / @RequestBody 는 각각 어디서 값을 꺼내나?",
    answer:
      "편지 봉투로 치면 주소(URL 경로), 주소 뒤 메모(쿼리스트링), 봉투 속 편지(본문)다. axios 로 보낼 때 위치와 그대로 짝이 맞는다: URL 에 끼운 값 → @PathVariable, axios 의 params(?page=1) → @RequestParam, axios 의 data(JSON) → @RequestBody. @RequestBody 는 JSON 을 자바 객체로 자동 변환해준다(Jackson). @RequestParam 은 기본이 필수라 빠지면 400 에러 — 선택값이면 required = false 나 defaultValue 를 준다.",
    code: `// 프론트 (axios)
axios.get("/users/3/orders", { params: { page: 1 } });
axios.post("/users/3/orders", { item: "책", count: 2 });

// 백엔드 (Spring)
@GetMapping("/users/{id}/orders")
public List<OrderDto> list(
        @PathVariable Long id,                          // URL 의 3
        @RequestParam(defaultValue = "0") int page) {   // ?page=1
    ...
}

@PostMapping("/users/{id}/orders")
public OrderDto create(
        @PathVariable Long id,
        @RequestBody OrderRequest req) {  // { item, count } JSON → 객체
    ...
}`,
  },
  {
    id: "q-spring-12",
    category: "SpringBoot",
    question: "요청 하나가 스프링 안에서 어떤 순서로 처리되나?",
    answer:
      "큰 회사 안내 데스크를 떠올리면 된다. 모든 방문객(요청)은 먼저 안내 데스크(DispatcherServlet — 프론트 컨트롤러)를 거친다. 데스크가 주소를 보고 담당 부서(Controller)를 찾아 연결하고(React Router 가 path 로 컴포넌트를 고르는 것과 비슷), 컨트롤러는 일을 Service 에, Service 는 DB 일을 Repository 에 넘긴다. 결과가 돌아오면 @RestController 는 객체를 JSON 으로 바꿔 응답하고, @Controller 는 뷰 이름을 받아 Thymeleaf 가 HTML 을 그려 응답한다. 디버깅할 때 이 순서대로 '어디까지 왔나'를 찾으면 된다.",
    code: `// 요청 한 개의 여정
브라우저 / axios
  → 톰캣 (내장 서버)
  → 필터 (보안·인코딩 등, 스프링 시큐리티는 여기)
  → DispatcherServlet          // 안내 데스크: 담당 컨트롤러 찾기
  → Controller                 // @RequestBody 등으로 값 꺼내기
  → Service                    // 비즈니스 로직, @Transactional
  → Repository → DB            // SQL 실행
  ← 결과 반환
  ← @RestController: 객체 → JSON (Jackson)
    @Controller    : "orders/list" → templates/orders/list.html 렌더링

// 중간에 예외가 나면 → @ExceptionHandler 가 잡아 에러 응답`,
  },
  {
    id: "q-spring-13",
    category: "SpringBoot",
    question: "DTO 와 Entity 는 왜 나누나? @Valid 는 뭘 해주나?",
    answer:
      "Entity = 회사 내부 서류 원본, DTO = 손님에게 보여줄 복사본 양식. 원본(Entity)을 그대로 밖에 내주면 비밀번호 같은 내부 정보가 새고, 화면 요구가 바뀔 때마다 DB 구조까지 흔들린다. 그래서 요청·응답은 DTO 로 따로 만들고, 안쪽에서만 Entity 로 바꿔 쓴다. 요청 DTO 필드에 @NotBlank, @Email 같은 규칙을 붙이고 컨트롤러 파라미터에 @Valid 를 달면, 컨트롤러 코드가 실행되기도 전에 검사해서 어기면 400 에러로 돌려보낸다. 프론트의 폼 검증(zod 등)을 서버에서 한 번 더 하는 것 — 프론트 검증은 우회될 수 있으니 서버 검증이 진짜 문지기다.",
    code: `// 요청 DTO — 밖에서 들어오는 모양 + 검사 규칙
public record SignUpRequest(
    @NotBlank String name,
    @Email @NotBlank String email,
    @Size(min = 8) String password
) {}

// 응답 DTO — 내보낼 것만 (password 없음!)
public record MemberResponse(Long id, String name) {}

@PostMapping("/members")
public MemberResponse signUp(@Valid @RequestBody SignUpRequest req) {
    // 규칙 위반이면 여기 도착 전에 400 Bad Request
    Member saved = memberService.join(req);     // 안쪽은 Entity
    return new MemberResponse(saved.getId(), saved.getName());
}
// 부트 3: spring-boot-starter-validation 의존성 필요 (jakarta.validation)`,
  },
  {
    id: "q-spring-14",
    category: "SpringBoot",
    question: "@Controller + Thymeleaf 와 @RestController 는 뭐가 다른가?",
    answer:
      "@Controller 는 완성된 요리(HTML 화면)를 내주는 식당, @RestController 는 재료(JSON 데이터)만 포장해 주는 가게. @Controller 메서드가 \"orders/list\" 같은 문자열을 반환하면 그건 응답 내용이 아니라 '뷰 이름'이고, Thymeleaf 가 templates/orders/list.html 에 Model 로 넘긴 값을 채워 HTML 을 만든다(서버 사이드 렌더링). React 로 치면 서버가 JSX 렌더링까지 해서 보내는 셈. th:each 는 map 으로 목록 돌리기, th:text 는 {값} 출력과 같다. @RestController 는 반환한 객체를 JSON 으로 보내고, 화면은 React 가 그린다.",
    code: `@Controller
public class OrderPageController {
    @GetMapping("/orders")
    public String list(Model model) {
        model.addAttribute("orders", orderService.findAll()); // props 넘기기
        return "orders/list";  // 뷰 이름 → templates/orders/list.html
    }
}

<!-- templates/orders/list.html (Thymeleaf) -->
<!-- th:each = orders.map(o => ...), th:text = {o.itemName} -->
<ul>
  <li th:each="o : \${orders}">
    <a th:href="@{/orders/{id}(id=\${o.id})}"
       th:text="\${o.itemName}">상품명</a>
  </li>
</ul>

@RestController  // = @Controller + @ResponseBody
public class OrderApiController {
    @GetMapping("/api/orders")
    public List<OrderDto> list() { return ...; }  // → JSON 배열
}`,
  },
  {
    id: "q-spring-15",
    category: "SpringBoot",
    question: "JpaRepository 의 findByXxx 는 어떻게 SQL 없이 동작하나?",
    answer:
      "주문서 양식에 칸만 정확히 채우면 주방이 알아서 요리하는 것. 인터페이스에 메서드 이름을 규칙대로 지으면(쿼리 메서드), 스프링 데이터 JPA 가 이름을 해석해서 쿼리를 자동으로 만들어준다. findByEmail → 'email 로 찾기', findByNameAndAge → 'name 그리고 age', OrderByCreatedAtDesc → '최신순 정렬'. 구현 클래스는 내가 안 만든다 — 인터페이스만 있으면 스프링이 실행 시 대신 만들어 꽂아준다. save / findById / findAll / deleteById 는 JpaRepository 를 상속만 해도 기본으로 생긴다. findById 는 없을 수도 있어서 Optional 로 준다.",
    code: `public interface MemberRepository extends JpaRepository<Member, Long> {
    //                                               엔티티 ↑   ↑ id 타입

    Optional<Member> findByEmail(String email);
    // → select ... from member where email = ?

    List<Member> findByNameAndAgeGreaterThan(String name, int age);
    // → where name = ? and age > ?

    List<Member> findTop10ByOrderByCreatedAtDesc();
    // → order by created_at desc limit 10

    boolean existsByEmail(String email);   // 중복 가입 체크에 딱
}

// 상속만으로 공짜로 생기는 것
memberRepository.save(member);
memberRepository.findById(1L).orElseThrow();  // Optional 이라 꺼내야 함
memberRepository.findAll();`,
  },
  {
    id: "q-spring-16",
    category: "SpringBoot",
    question: "JPA 를 쓰는데도 SQL 을 알아야 하나? @Query 는 언제 쓰나?",
    answer:
      "JPA 는 자동 번역기라서, 번역된 결과(SQL)를 읽을 줄 모르면 이상하게 번역돼도 알아챌 수 없다. JPA 도 결국 SQL 을 만들어 DB 에 보내므로 ① 쿼리가 몇 번, 어떻게 나가는지 로그로 확인하고 ② 느린 쿼리·인덱스·조인을 고치려면 SQL 을 알아야 한다. 메서드 이름 쿼리로 표현이 너무 길어지거나 조인이 필요하면 @Query 로 직접 쓴다. 이때 쓰는 JPQL 은 SQL 과 비슷하지만 테이블이 아니라 엔티티 클래스·필드 이름 기준이다. DB 전용 문법이 꼭 필요하면 nativeQuery = true 로 진짜 SQL 을 쓴다.",
    code: `public interface OrderRepository extends JpaRepository<Order, Long> {

    // JPQL — 테이블(orders)이 아니라 엔티티(Order)와 필드(o.member) 기준
    @Query("select o from Order o join fetch o.member where o.status = :status")
    List<Order> findWithMember(@Param("status") OrderStatus status);

    // 네이티브 SQL — DB 문법 그대로 (DB 를 바꾸면 깨질 수 있음)
    @Query(value = "select * from orders where created_at > now() - interval 1 day",
           nativeQuery = true)
    List<Order> findRecent();
}

# application.yml — 실제로 나가는 SQL 을 눈으로 확인
logging:
  level:
    org.hibernate.SQL: debug`,
  },
  {
    id: "q-spring-17",
    category: "SpringBoot",
    question: "@ManyToOne / @OneToMany 와 '연관관계의 주인'은 무슨 뜻인가?",
    answer:
      "회원(Member) 여러 명이 한 팀(Team)에 속하는 관계에서, DB 에는 member 테이블에만 team_id(외래키) 칸이 있다. 그래서 '어느 팀 소속인지'를 실제로 적을 수 있는 쪽은 Member 의 @ManyToOne 이고, 이쪽이 연관관계의 주인이다. Team 의 @OneToMany(mappedBy = \"team\") 목록은 '저쪽 team 필드를 거울처럼 비춰 보는 것'일 뿐이라 읽기 전용이다. 흔한 실수: team.getMembers().add(member) 만 하면 DB 에는 아무것도 안 바뀐다 — 주인인 member.setTeam(team) 을 해야 외래키가 저장된다. 그래서 보통 두 쪽을 같이 맞춰 주는 편의 메서드를 만들고, @ManyToOne 은 기본이 즉시 로딩(EAGER)이라 LAZY 로 바꿔 두는 게 관례다.",
    code: `@Entity
public class Member {
    @Id @GeneratedValue private Long id;

    @ManyToOne(fetch = FetchType.LAZY)  // 주인 ✅ (기본 EAGER → LAZY 권장)
    @JoinColumn(name = "team_id")       // 외래키 칸을 실제로 가진 쪽
    private Team team;
}

@Entity
public class Team {
    @Id @GeneratedValue private Long id;

    @OneToMany(mappedBy = "team")       // 거울 🪞 (읽기 전용)
    private List<Member> members = new ArrayList<>();

    public void addMember(Member m) {   // 편의 메서드: 양쪽을 같이 맞춤
        members.add(m);
        m.setTeam(this);                // ← DB 에 반영되는 건 이 줄
    }
}
// ❌ team.getMembers().add(m) 만 하면 team_id 는 null 그대로`,
  },
  {
    id: "q-spring-18",
    category: "SpringBoot",
    question: "LAZY 로딩이란? 그리고 N+1 문제는 왜 생기고 어떻게 막나?",
    answer:
      "LAZY(지연 로딩) = 책 목록만 먼저 가져오고, 책을 펼칠 때 내용을 가지러 가는 것. 주문을 조회하면 연결된 회원은 '가짜 대리인(프록시)'으로 채워 두고, order.getMember().getName() 처럼 실제로 건드리는 순간 쿼리를 보낸다. 문제는 목록에서 터진다: 주문 100개를 1번에 가져온 뒤, 반복문으로 각 주문의 회원 이름을 꺼내면 회원 조회가 100번 더 나간다 → 총 1+N 번(N+1 문제). React 에서 목록을 받은 뒤 아이템마다 useEffect 로 상세 API 를 따로 부르는 것과 같은 낭비다. 해결: 처음부터 같이 가져오라고 시키는 fetch join(join fetch)이나 @EntityGraph, 또는 IN 으로 묶어 가져오는 batch size 설정. EAGER 로 바꾸는 건 해결이 아니다 — findAll 같은 JPQL 에서는 EAGER 여도 똑같이 N+1 이 난다.",
    code: `// ❌ N+1: 주문 목록 1번 + 회원 조회 N번
List<Order> orders = orderRepository.findAll();   // 쿼리 1번
for (Order o : orders) {
    o.getMember().getName();   // LAZY → 여기서 회원 쿼리가 주문마다 1번씩
}
// 로그: select ... from orders
//       select ... from member where id=1
//       select ... from member where id=2   ... (N번)

// ✅ 해결 1: fetch join — 한 번에 조인해서 가져오기
@Query("select o from Order o join fetch o.member")
List<Order> findAllWithMember();

// ✅ 해결 2: @EntityGraph
@EntityGraph(attributePaths = "member")
List<Order> findByStatus(OrderStatus status);

// ✅ 해결 3: 묶어서 가져오기 (where id in (...))
// spring.jpa.properties.hibernate.default_batch_fetch_size: 100`,
  },
  {
    id: "q-spring-19",
    category: "SpringBoot",
    question: "@RestControllerAdvice 와 @ExceptionHandler 로 에러 응답을 어떻게 통일하나?",
    answer:
      "고객센터를 하나로 모으는 것. 컨트롤러마다 try-catch 로 에러를 제각각 처리하면 어떤 API 는 500 에 HTML, 어떤 API 는 400 에 다른 모양 JSON 이 나와서 프론트가 매번 다르게 파싱해야 한다. @RestControllerAdvice 클래스 하나를 만들고 그 안에 @ExceptionHandler(예외종류.class) 메서드를 두면, 어느 컨트롤러에서 그 예외가 터지든 여기로 모여서 '상태코드 + 같은 모양의 JSON' 으로 바뀐다. React 의 axios 인터셉터에서 error.response.data.message 하나만 보면 되게 만들어 주는 쪽이다. 부트 3 에는 표준 에러 형식인 ProblemDetail 도 있다.",
    code: `// 서비스에서는 그냥 던진다
throw new NotFoundException("회원이 없습니다: " + id);

// 모든 컨트롤러의 에러를 여기서 한 번에
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ErrorResponse> notFound(NotFoundException e) {
        return ResponseEntity.status(404)
                .body(new ErrorResponse("NOT_FOUND", e.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class) // @Valid 실패
    public ResponseEntity<ErrorResponse> invalid(MethodArgumentNotValidException e) {
        return ResponseEntity.badRequest()
                .body(new ErrorResponse("INVALID", "입력값을 확인하세요"));
    }
}
public record ErrorResponse(String code, String message) {}
// 프론트는 언제나 { code, message } 만 보면 된다`,
  },
  {
    id: "q-spring-20",
    category: "SpringBoot",
    question: "Pageable 과 Page 로 페이지네이션은 어떻게 하나?",
    answer:
      "책을 한 번에 다 주지 않고 '3쪽, 한 쪽에 20줄'처럼 잘라서 주는 것. 컨트롤러 파라미터에 Pageable 을 두면 ?page=0&size=20&sort=createdAt,desc 같은 쿼리를 스프링이 알아서 읽어 담아 준다. page 는 0부터 시작이라 프론트의 '1페이지'는 page=0 이다(자주 틀림). 리포지토리 메서드에 Pageable 을 넘기면 limit/offset 쿼리가 나가고, 결과 Page 에는 목록(content)과 함께 전체 개수(totalElements)·전체 페이지 수(totalPages)가 들어 있어 페이지 번호 버튼을 그릴 수 있다. 전체 개수를 세려고 count 쿼리가 한 번 더 나가므로, '더보기'/무한 스크롤처럼 전체 개수가 필요 없으면 Slice 를 쓰면 더 가볍다.",
    code: `// GET /api/orders?page=0&size=20&sort=createdAt,desc
@GetMapping("/api/orders")
public Page<OrderDto> list(Pageable pageable) {   // 쿼리를 자동으로 담아줌
    return orderRepository.findByStatus(OrderStatus.PAID, pageable)
                          .map(OrderDto::from);   // Entity → DTO
}

// 리포지토리: 마지막 파라미터로 Pageable 만 추가
Page<Order> findByStatus(OrderStatus status, Pageable pageable);

// 응답 JSON (일부)
// { "content": [ ... 20개 ... ],
//   "totalElements": 1234, "totalPages": 62,
//   "number": 0, "size": 20 }

// 프론트: 사람이 보는 1페이지 = page=0
axios.get("/api/orders", { params: { page: currentPage - 1, size: 20 } });`,
  },
  {
    id: "q-spring-21",
    category: "SpringBoot",
    question: "JUnit 의 @Test 와 given-when-then 은 어떻게 쓰나? (React Testing Library 와 비교)",
    answer:
      "요리 시식 순서와 같다 — 재료 준비(given), 조리(when), 맛보기(then). 테스트 하나를 이 3단계로 나눠 쓰면 무엇을 검사하는지 한눈에 보인다. JUnit 에서는 메서드에 @Test 를 붙이면 테스트로 실행되고, 결과 확인은 assertThat(...).isEqualTo(...) 로 한다. RTL 로 치면 render() 가 given, userEvent.click() 이 when, expect(screen...).toBeInTheDocument() 가 then 이다. Jest 의 test(\"...\", () => {}) 자리가 @Test 메서드, expect 자리가 assertThat 인 셈. 실행은 './gradlew test' 또는 IDE 의 초록 화살표.",
    code: `// JUnit 5 + AssertJ
class CartTest {

    @Test
    @DisplayName("상품 두 개를 담으면 합계가 더해진다")
    void addTwoItems() {
        // given — 준비
        Cart cart = new Cart();

        // when — 실행
        cart.add(new Item("책", 10000));
        cart.add(new Item("펜", 2000));

        // then — 검증
        assertThat(cart.total()).isEqualTo(12000);
    }
}

// 같은 구조의 RTL 테스트
// test("버튼 누르면 카운트 증가", async () => {
//   render(<Counter />);                                // given
//   await userEvent.click(screen.getByRole("button"));  // when
//   expect(screen.getByText("1")).toBeInTheDocument();  // then
// });`,
  },
  {
    id: "q-spring-22",
    category: "SpringBoot",
    question: "@SpringBootTest 와 @WebMvcTest(MockMvc)는 언제 쓰나? 버그는 어떻게 추적하나?",
    answer:
      "@SpringBootTest = 가게 전체를 열고 하는 리허설, @WebMvcTest = 홀(컨트롤러)만 열고 주방은 가짜로 두는 연습. @SpringBootTest 는 앱 전체(빈 전부, DB 연결까지)를 띄워 진짜에 가깝지만 느리고, @WebMvcTest 는 컨트롤러 계층만 띄워서 빠르다. 대신 서비스는 가짜(목)로 꽂아야 한다(부트 3.4+ @MockitoBean, 이전엔 @MockBean). MockMvc 는 서버를 실제로 켜지 않고 가짜 HTTP 요청을 보내 상태코드·JSON 을 검사하는 도구. 실제 버그 추적은 ① Postman(또는 브라우저 Network 탭)으로 요청을 재현하고 ② 서버 로그에서 예외 스택트레이스의 첫 'Caused by' 와 내 코드 줄을 찾고 ③ SQL 로그를 켜서 쿼리를 확인하는 순서로 한다.",
    code: `@WebMvcTest(MemberController.class)     // 컨트롤러만 띄움 → 빠름
class MemberControllerTest {

    @Autowired MockMvc mockMvc;           // 가짜 HTTP 요청기
    @MockitoBean MemberService memberService; // 주방은 가짜 (3.4 미만: @MockBean)

    @Test
    void 회원_조회() throws Exception {
        given(memberService.find(1L)).willReturn(new MemberResponse(1L, "yumin"));

        mockMvc.perform(get("/members/1"))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.name").value("yumin"));
    }
}

// @SpringBootTest — 전부 띄움 (느리지만 진짜에 가까움, 통합 테스트용)

// 디버깅 순서
// 1) Postman 으로 같은 요청 재현 (헤더·바디까지 똑같이)
// 2) 로그에서 Exception / Caused by 와 "내 패키지" 줄 찾기
// 3) logging.level.org.hibernate.SQL: debug 로 실제 쿼리 확인`,
  },
  {
    id: "q-spring-23",
    category: "SpringBoot",
    question: "Spring Security 인증은 어떻게 동작하나? (세션 vs JWT, 401 vs 403)",
    answer:
      "건물 입구의 보안 게이트들. 요청은 컨트롤러에 닿기 전에 여러 겹의 보안 필터(필터 체인)를 지나며 '누구냐(인증)'와 '들어갈 수 있냐(인가)'를 검사받는다. 의존성만 추가해도 모든 주소가 잠기고 로그인 화면이 뜨는 이유가 이것. 신원 확인 방식은 두 가지: 세션 = 서버가 방문자 명단을 들고 있고 브라우저는 번호표(JSESSIONID 쿠키)만 냄 — Thymeleaf 같은 서버 렌더링 앱에 흔함. JWT = 서명된 출입증을 클라이언트가 들고 다니며 Authorization: Bearer 헤더로 냄 — 서버가 명단을 안 들고 있어 React SPA·모바일 API 에 흔함. 실패 코드는 401 = 누군지 모름(로그인 안 함·토큰 만료), 403 = 누군지는 알지만 권한 없음(일반 회원이 관리자 페이지). 단, 로그인 안 한 사람을 막는 모양은 앱 종류마다 다르다: API(JWT) 서버는 401 을 그대로 돌려주고 React 가 그걸 보고 로그인 화면으로 보내지만, 기본 formLogin 을 쓰는 화면 앱(회사 Thymeleaf 프로젝트)은 401 대신 302 로 /login 페이지로 리다이렉트한다. 그래서 브라우저 Network 탭에 401 이 안 보이고 302 → /login 이 보이면 '인증 실패'라는 뜻이다.",
    code: `@Configuration
public class SecurityConfig {
    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests(auth -> auth
                .requestMatchers("/login", "/api/public/**").permitAll() // 누구나
                .requestMatchers("/admin/**").hasRole("ADMIN")           // 관리자만
                .anyRequest().authenticated())                           // 나머지는 로그인 필요
            .formLogin(Customizer.withDefaults());   // 세션 방식 로그인 폼
        return http.build();
    }
}

// 요청 흐름: 톰캣 → [보안 필터 체인] → DispatcherServlet → Controller
//                    ↑ 여기서 막히면 컨트롤러 로그는 아예 안 찍힌다

// 401 Unauthorized : 신분증 없음 → 로그인 화면/토큰 재발급으로
// 403 Forbidden    : 신분증은 있는데 출입 권한 없음`,
  },
  {
    id: "q-spring-24",
    category: "SpringBoot",
    question: "Swagger(springdoc-openapi)는 뭐고, README 에는 무엇을 써야 하나?",
    answer:
      "Swagger = 코드에서 자동으로 뽑아 주는 API 메뉴판. springdoc-openapi 의존성을 넣으면 컨트롤러의 주소·파라미터·DTO 모양을 읽어 /swagger-ui/index.html 에 문서 화면을 만들어 주고, 거기서 바로 요청을 보내 볼 수도 있다(Postman 내장판). 코드와 문서가 따로 놀지 않는 게 핵심이라, 프론트는 백엔드에 '이 API 뭐 받아요?' 묻기 전에 여기부터 보면 된다. README 는 처음 온 사람의 길 안내서: ① 실행 방법(자바 버전, 프로파일, 필요한 환경변수 — 값 자체는 비밀이라 쓰지 않음) ② 구조와 기술 스택 ③ API 문서 링크 ④ 왜 이렇게 설계했는지·겪은 문제와 해결.",
    code: `// build.gradle — 부트 3 은 springdoc 2.x
implementation 'org.springdoc:springdoc-openapi-starter-webmvc-ui:2.x.x'
// 실행 후: http://localhost:8080/swagger-ui/index.html
//         http://localhost:8080/v3/api-docs  (JSON 스펙)

@Tag(name = "회원")
@RestController
public class MemberController {
    @Operation(summary = "회원 단건 조회")   // 메뉴판 설명 한 줄
    @GetMapping("/members/{id}")
    public MemberResponse find(@PathVariable Long id) { ... }
}

# README.md 뼈대
## 실행 방법      — Java 17, ./gradlew bootRun --args='--spring.profiles.active=dev'
## 환경 변수      — DB_URL, JWT_SECRET (값은 적지 않는다)
## 구조           — 패키지 구조, ERD 그림
## API 문서       — /swagger-ui/index.html
## 설계 결정 & 트러블슈팅 — 왜 이렇게 했나, N+1 을 어떻게 잡았나`,
  },

  // ─── 구조설계 ─────────────────────────────────────────
  {
    id: "q-arch-1",
    category: "구조설계",
    question: "관심사 분리(Separation of Concerns)란?",
    answer:
      "식당에서 요리사가 주문도 받고, 요리도 하고, 서빙도 하면 가게가 엉망이 된다. 주문(데이터 가져오기)·요리(로직)·서빙(화면 표시)을 각자 담당으로 나누는 게 관심사 분리. 한 담당이 바뀌어도 나머지는 안 건드려도 되고, 담당별로 따로 테스트할 수 있다.",
    code: `// ❌ 한 컴포넌트가 주문+요리+서빙 전부
// ✅ 역할별로 한 가지씩:
function ProfilePage() {
  const user = useUser();           // 1) 주문 — 데이터 (훅)
  const label = formatName(user);   // 2) 요리 — 가공 (순수 함수)
  return <Profile label={label} />; // 3) 서빙 — 표현 (컴포넌트)
}
// formatName은 화면 없이도 단독 테스트 가능!`,
  },
  {
    id: "q-arch-2",
    category: "구조설계",
    question: "프론트엔드에서 '상태' 를 어디에 둘지 판단 기준은?",
    answer:
      "물건 둘 곳 정하기와 같다. 나만 쓰는 물건 → 내 방 (컴포넌트 로컬 state). 형제랑 같이 쓰면 → 거실 (부모로 끌어올리기). 온 가족이 쓰면 → 공용 창고 (전역 스토어). 밖에서 사 온 음식 → 냉장고 (서버 캐시). 핵심: 가장 좁은 곳에서 시작해서, 필요할 때만 넓힌다.",
    code: `// 1) 나만 쓴다 → 내 방 (로컬 state)
const [isOpen, setIsOpen] = useState(false);

// 2) 형제와 공유 → 거실 (가장 가까운 부모로 lift up)

// 3) 온 가족이 쓴다 (테마, 로그인) → 공용 창고
const theme = useAppStore((s) => s.theme); // Zustand 등

// 4) 서버에서 온 데이터 → 냉장고 (서버 캐시)
const { data } = useQuery(["user"], fetchUser); // React Query 등`,
  },
  {
    id: "q-arch-3",
    category: "구조설계",
    question: "비즈니스 로직을 컴포넌트 안에 넣지 말라는 이유는?",
    answer:
      "계산기 기능을 계산기 '버튼 케이스' 안에 접착제로 붙여버리는 것과 같다. 다른 케이스(다른 화면)에서 같은 계산이 필요하면 또 만들어야 하고, 계산이 맞는지 확인하려면 케이스째 켜야 한다. 계산 로직을 순수 함수로 빼두면 어디서든 재사용되고, 화면 없이도 테스트된다.",
    code: `// ❌ 할인 계산이 화면 코드에 접착제로 붙어있다
function Price({ price }: { price: number }) {
  const final = price * 0.9 + (price > 50000 ? 0 : 3000);
  return <p>{final}원</p>; // 재사용 불가, 테스트는 화면 켜야 가능
}

// ✅ 로직을 순수 함수로 분리
export function getFinalPrice(price: number): number {
  return price * 0.9 + (price > 50000 ? 0 : 3000);
}
// 화면은 호출만: <p>{getFinalPrice(price)}원</p>
// → getFinalPrice만 따로 유닛 테스트 가능!`,
  },
  {
    id: "q-arch-4",
    category: "구조설계",
    question: "확장성을 고려한 모듈 설계의 첫 단추는?",
    answer:
      "집 짓기 전에 '문과 콘센트 위치'부터 정하는 것. 모듈끼리 주고받는 약속(인터페이스 = 입출력 계약)을 먼저 정해두면, 안에 들어가는 가구(실제 구현)는 나중에 얼마든지 바꿀 수 있다. 반대로 가구부터 들이면 문 위치 바꿀 때마다 온 집을 뜯어야 한다.",
    code: `// 구현보다 "약속(계약)"을 먼저 정한다
interface QuestionRepo {
  getAll(): Promise<Question[]>;
  save(q: Question): Promise<void>;
}

// 오늘은 localStorage 가구를 들이고…
class LocalRepo implements QuestionRepo { /* ... */ }
// 내일 서버 가구로 바꿔도, 문(인터페이스) 위치는 그대로
class ApiRepo implements QuestionRepo { /* ... */ }
// → 이 인터페이스를 쓰는 쪽 코드는 한 줄도 안 고친다`,
  },
  // ─── 상태관리 (React Query · Zustand · Context) ─────────
  // 출처: https://github.com/ssi02014/react-query-tutorial (TanStack Query v5 기준)
  {
    id: "q-state-1",
    category: "상태관리",
    question: "서버 상태와 클라이언트 상태는 무엇이 다른가?",
    answer:
      "클라이언트 상태 = 내 방 안의 물건 (모달 열림, 입력창 값). 내가 완전히 통제하고 즉시 바뀐다. 서버 상태 = 남의 창고(DB)에 있는 물건의 '복사본'. 가져오는 데 시간이 걸리고(비동기), 내가 모르는 새 원본이 바뀔 수 있어서 '언제 다시 가져올지·얼마나 믿을지'가 핵심 고민이다. 그래서 서버 상태는 React Query 같은 캐시 도구, 클라이언트 상태는 useState/Zustand 로 나눠 관리한다.",
    code: `// 클라이언트 상태 — 내가 주인
const [isOpen, setIsOpen] = useState(false);

// 서버 상태 — DB 원본의 '복사본'. 낡을 수 있다.
const { data } = useQuery({ queryKey: ["user"], queryFn: fetchUser });`,
  },
  {
    id: "q-state-2",
    category: "상태관리",
    question: "React Query 의 queryKey 는 왜 배열이고, 변수를 꼭 넣어야 하나?",
    answer:
      "queryKey 는 캐시 창고의 '선반 이름표'. 같은 이름표면 같은 선반(캐시)을 공유하고, 다르면 다른 선반이다. 페이지 번호·id 같은 변수를 키에 안 넣으면 2페이지를 요청해도 1페이지 선반에서 꺼내오는 사고가 난다. 배열이라서 [\"posts\", 2] 처럼 계층적으로 표현하고, 나중에 [\"posts\"] 하나로 자식 선반 전체를 무효화할 수도 있다.",
    code: `// ❌ page 가 바뀌어도 키가 같아서 캐시가 재활용됨
useQuery({ queryKey: ["posts"], queryFn: () => fetchPosts(page) });

// ✅ 의존하는 변수는 전부 키에
useQuery({ queryKey: ["posts", page], queryFn: () => fetchPosts(page) });`,
  },
  {
    id: "q-state-3",
    category: "상태관리",
    question: "staleTime 과 gcTime 의 차이는?",
    answer:
      "우유의 '유통기한' 과 '냉장고 보관 기한'. staleTime = 유통기한 (기본 0ms). 지나면 stale(낡음)이 되어 다시 마운트되거나 창에 포커스가 오면 자동으로 새로 받아온다. gcTime = 아무도 안 쓰는(inactive) 캐시를 냉장고에 얼마나 두는지 (기본 5분). 지나면 버려진다(가비지 컬렉션). 상식적으로 staleTime < gcTime 이어야 한다 — 유통기한보다 먼저 버리면 의미 없다.",
    code: `useQuery({
  queryKey: ["user"],
  queryFn: fetchUser,
  staleTime: 1000 * 60,      // 1분간은 '신선' → 재요청 안 함
  gcTime: 1000 * 60 * 5,     // 화면에서 사라진 뒤 5분 지나면 캐시 삭제
});`,
  },
  {
    id: "q-state-4",
    category: "상태관리",
    question: "쿼리 캐시의 생명주기(fresh → stale → inactive → deleted)를 설명하면?",
    answer:
      "① 마운트: queryKey 로 선반을 만들고 데이터를 가져온다. ② fresh: staleTime 동안은 신선해서 다시 안 묻는다. ③ stale: 시간이 지나면 낡음 — 다음 마운트/포커스/재연결 때 백그라운드로 새로 받아온다. ④ inactive: 그 쿼리를 쓰는 컴포넌트가 다 사라지면 대기 상태. ⑤ deleted: gcTime 이 지나면 메모리에서 삭제. 이 흐름을 알아야 '왜 화면이 깜빡이지', '왜 갑자기 재요청하지' 를 설명할 수 있다.",
    code: `// 흐름 요약
mount → fetch → fresh ──(staleTime)──▶ stale
                                        │ (refetch 조건 충족 시 재요청)
unmount → inactive ──(gcTime)──▶ deleted`,
  },
  {
    id: "q-state-5",
    category: "상태관리",
    question: "isPending 과 isFetching 은 뭐가 다른가?",
    answer:
      "isPending = '아직 보여줄 데이터가 하나도 없다' (status: pending). 첫 로딩 스피너용. isFetching = '지금 서버에 다녀오는 중' — 캐시에 데이터가 있어서 화면은 이미 보여주는데 뒤에서 새로 받는 중일 수도 있다. 즉 isFetching 이 true 여도 isPending 은 false 일 수 있다. v5 에선 isLoading = isPending && isFetching 이고, 첫 로딩은 isPending 을 권장.",
    code: `const { data, isPending, isFetching } = useQuery({ ... });

if (isPending) return <Spinner />;          // 데이터 자체가 없음
return (
  <>
    {isFetching && <small>갱신 중…</small>}  // 데이터는 있는데 뒤에서 재요청
    <List items={data} />
  </>
);`,
  },
  {
    id: "q-state-6",
    category: "상태관리",
    question: "enabled 옵션은 언제 쓰나? (종속 쿼리)",
    answer:
      "'앞 주문이 나와야 다음 주문을 넣는' 상황. 예: 이메일로 유저를 찾고 → 그 유저 id 로 수강 목록을 가져온다. 두 번째 쿼리는 유저 id 가 없으면 실행하면 안 되니 enabled: !!user?.id 로 잠근다. enabled: false 로 두고 버튼 클릭 시 refetch() 로 수동 실행하는 데도 쓴다. 주의: enabled: false 인 쿼리는 invalidateQueries 로도 안 깨어난다.",
    code: `const { data: user } = useQuery({
  queryKey: ["user", email],
  queryFn: () => getUser(email),
});

const { data: courses } = useQuery({
  queryKey: ["courses", user?.id],
  queryFn: () => getCourses(user!.id),
  enabled: !!user?.id, // user 가 생기기 전엔 실행 금지
});`,
  },
  {
    id: "q-state-7",
    category: "상태관리",
    question: "useMutation 은 useQuery 와 무엇이 다르고, 성공 후 목록은 어떻게 갱신하나?",
    answer:
      "useQuery 는 '읽기(GET)' — 자동으로 실행되고 캐시된다. useMutation 은 '쓰기(POST/PUT/DELETE)' — 내가 mutate() 를 호출해야만 실행된다. 쓰기가 끝났다고 화면의 목록이 저절로 바뀌진 않으니, onSuccess 에서 invalidateQueries 로 관련 선반에 '낡음' 도장을 찍어 재요청시킨다. mutate 는 콜백형(권장), mutateAsync 는 Promise 형(에러를 직접 잡아야 함).",
    code: `const qc = useQueryClient();
const addHero = useMutation({
  mutationFn: (hero) => api.post("/heroes", hero),
  onSuccess: () => {
    // "heroes" 로 시작하는 모든 쿼리를 낡음 처리 → 자동 재요청
    qc.invalidateQueries({ queryKey: ["heroes"] });
  },
});
<button onClick={() => addHero.mutate({ name: "Iron" })}>추가</button>`,
  },
  {
    id: "q-state-8",
    category: "상태관리",
    question: "invalidateQueries 와 setQueryData 는 어떻게 다른가?",
    answer:
      "invalidateQueries = '이 선반 낡았으니 다시 사 와' — 서버에 재요청해서 진짜 최신값을 받는다 (네트워크 한 번 더). setQueryData = '내가 직접 선반에 물건을 갈아끼움' — 네트워크 없이 캐시를 즉시 바꾼다. 응답에 새 데이터가 이미 있으면 setQueryData 로 바로 반영하고, 서버가 계산하는 값이 있으면 invalidate 로 다시 받는 게 안전하다.",
    code: `// 즉시 반영 (네트워크 X)
qc.setQueryData(["heroes"], (old) => [...old, newHero]);

// 재요청으로 동기화 (네트워크 O)
qc.invalidateQueries({ queryKey: ["heroes"] });`,
  },
  {
    id: "q-state-9",
    category: "상태관리",
    question: "낙관적 업데이트(Optimistic Update)란? 어떻게 구현하나?",
    answer:
      "'좋아요' 를 누르면 서버 응답을 기다리지 않고 먼저 하트를 빨갛게 칠하는 것. 성공할 거라 '낙관'하고 UI 부터 바꾸니 느린 인터넷에서도 즉각 반응한다. 구현은 3박자: onMutate 에서 (진행 중 쿼리 취소 → 이전 값 백업 → 캐시 즉시 변경), onError 에서 백업으로 롤백, onSettled 에서 invalidate 로 서버와 최종 동기화.",
    code: `useMutation({
  mutationFn: likePost,
  onMutate: async (id) => {
    await qc.cancelQueries({ queryKey: ["post", id] }); // 덮어쓰기 방지
    const prev = qc.getQueryData(["post", id]);          // 백업
    qc.setQueryData(["post", id], (p) => ({ ...p, liked: true })); // 먼저 칠하기
    return { prev };
  },
  onError: (_e, id, ctx) => qc.setQueryData(["post", id], ctx.prev), // 롤백
  onSettled: (_d, _e, id) => qc.invalidateQueries({ queryKey: ["post", id] }),
});`,
  },
  {
    id: "q-state-10",
    category: "상태관리",
    question: "페이지네이션에서 페이지를 넘길 때 깜빡임을 없애려면? (placeholderData)",
    answer:
      "다음 페이지의 키가 새로 생기면 데이터가 없어서 잠깐 스피너가 뜬다. placeholderData: keepPreviousData 를 주면 새 데이터가 올 때까지 '이전 페이지를 임시로 보여준다' — 책장을 넘길 때 앞 장이 사라지지 않고 겹쳐 있는 느낌. 여기에 다음 페이지를 prefetchQuery 로 미리 받아두면 넘길 때 아예 대기가 없다. (v4 의 keepPreviousData: true 옵션은 v5 에서 이 함수로 바뀜)",
    code: `import { keepPreviousData } from "@tanstack/react-query";

const { data, isPlaceholderData } = useQuery({
  queryKey: ["posts", page],
  queryFn: () => fetchPosts(page),
  placeholderData: keepPreviousData, // 새 페이지 올 때까지 이전 페이지 유지
});

// 다음 페이지 미리 받아두기
useEffect(() => {
  qc.prefetchQuery({ queryKey: ["posts", page + 1], queryFn: () => fetchPosts(page + 1) });
}, [page]);`,
  },
  {
    id: "q-state-11",
    category: "상태관리",
    question: "useInfiniteQuery 로 무한 스크롤은 어떻게 만드나?",
    answer:
      "두루마리 휴지를 조금씩 더 푸는 방식. 한 페이지가 아니라 '페이지들의 묶음(data.pages)' 을 들고 있고, getNextPageParam 이 '다음에 뽑을 페이지 번호' 를 알려준다 (undefined 를 돌려주면 끝). 화면 맨 아래에 닿으면 fetchNextPage() 를 부른다. v5 부턴 initialPageParam 이 필수. maxPages 로 메모리에 쌓이는 페이지 수를 제한할 수도 있다.",
    code: `const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
  queryKey: ["feed"],
  queryFn: ({ pageParam }) => fetchFeed(pageParam),
  initialPageParam: 1,
  getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined, // undefined = 끝
});

data.pages.flatMap((p) => p.items).map(...)  // 모든 페이지 펼쳐서 렌더
{hasNextPage && <button onClick={() => fetchNextPage()}>더 보기</button>}`,
  },
  {
    id: "q-state-12",
    category: "상태관리",
    question: "select 옵션은 무엇이고 왜 쓰나?",
    answer:
      "창고에서 물건을 꺼낼 때 '필요한 부분만 잘라서 받는' 가위. 캐시엔 서버 응답 원본이 그대로 남고, 컴포넌트가 받는 data 만 변환된다. 예: 응답의 히어로 배열에서 이름만 뽑기. 캐시를 안 건드리니 여러 컴포넌트가 같은 쿼리를 각자 다른 모양으로 쓸 수 있고, 선택한 부분이 안 바뀌면 리렌더도 줄어든다.",
    code: `const { data: names } = useQuery({
  queryKey: ["heroes"],
  queryFn: getHeroes,                  // 응답: { data: Hero[] }
  select: (res) => res.data.map((h) => h.name), // names: string[]
});
// 캐시에는 { data: Hero[] } 원본이 그대로 저장됨`,
  },
  {
    id: "q-state-13",
    category: "상태관리",
    question: "refetchOnWindowFocus · refetchInterval 은 각각 언제 쓰나?",
    answer:
      "refetchOnWindowFocus (기본 true) = 다른 탭 갔다가 돌아오면 '그새 바뀐 거 없나?' 하고 stale 쿼리를 자동으로 다시 받는다. 은행 앱 갔다 오면 잔액이 새로고침되는 느낌. 너무 잦으면 staleTime 을 늘리거나 끈다. refetchInterval = 일정 주기로 계속 묻는 폴링(polling). 채팅 알림·주문 상태처럼 실시간성이 필요할 때 쓴다. 탭이 백그라운드여도 계속하려면 refetchIntervalInBackground.",
    code: `useQuery({
  queryKey: ["orders"],
  queryFn: fetchOrders,
  refetchOnWindowFocus: false,  // 탭 복귀 때 재요청 안 함
  refetchInterval: 5000,        // 5초마다 폴링
});`,
  },
  {
    id: "q-state-14",
    category: "상태관리",
    question: "useSuspenseQuery 와 ErrorBoundary 로 '선언적 UI' 를 만든다는 건?",
    answer:
      "컴포넌트마다 if (isPending) / if (isError) 를 쓰는 대신, 로딩은 <Suspense fallback>, 에러는 <ErrorBoundary> 가 위에서 한 번에 받아준다. 컴포넌트는 '데이터가 있다'고 가정하고 행복한 경로만 쓴다 — 식당에서 손님(컴포넌트)은 음식이 나온 뒤만 신경 쓰고, 대기·사고 처리는 매니저(경계 컴포넌트)가 맡는 구조. v5 에선 suspense: true 옵션이 사라지고 useSuspenseQuery 를 써야 한다. 재시도는 useQueryErrorResetBoundary 의 reset 을 onReset 에 연결.",
    code: `function HeroList() {
  const { data } = useSuspenseQuery({ queryKey: ["heroes"], queryFn: getHeroes });
  return <ul>{data.map((h) => <li key={h.id}>{h.name}</li>)}</ul>; // data 는 항상 있음
}

const { reset } = useQueryErrorResetBoundary();
<ErrorBoundary onReset={reset} fallbackRender={({ resetErrorBoundary }) =>
  <button onClick={resetErrorBoundary}>다시 시도</button>}>
  <Suspense fallback={<Spinner />}>
    <HeroList />
  </Suspense>
</ErrorBoundary>`,
  },
  {
    id: "q-state-15",
    category: "상태관리",
    question: "Context API 를 전역 상태 관리 도구로 쓰면 생기는 문제는?",
    answer:
      "Context 는 '방송' 이다. 값이 하나라도 바뀌면 그 Context 를 구독한 모든 컴포넌트가 리렌더된다 — 테마만 바꿨는데 유저 정보만 쓰는 컴포넌트까지 다시 그려진다. 원래 용도는 '자주 안 바뀌는 값(테마, 로케일, 로그인 유저) 을 깊이 내려보내기'. 자주 바뀌는 상태는 Context 를 잘게 쪼개거나, 필요한 조각만 골라 구독(selector)할 수 있는 Zustand 같은 스토어가 낫다.",
    code: `// ❌ 하나의 Context 에 다 넣으면 count 만 바뀌어도 theme 구독자까지 리렌더
const AppCtx = createContext({ theme, user, count, setCount });

// ✅ 관심사별로 쪼개거나…
const ThemeCtx = createContext(theme);
const CountCtx = createContext(count);
// ✅ selector 로 조각 구독 (Zustand)
const count = useStore((s) => s.count); // theme 바뀌어도 리렌더 X`,
  },
  {
    id: "q-state-16",
    category: "상태관리",
    question: "Zustand 는 Redux 와 무엇이 다르고, selector 는 왜 중요한가?",
    answer:
      "Redux = 관공서. 액션 타입·리듀서·디스패치 서류를 갖춰야 상태 하나를 바꾼다 (대신 추적·규칙이 엄격). Zustand = 동네 가게. create() 하나로 상태와 바꾸는 함수를 같이 두고, Provider 도 필요 없다. 핵심은 selector: useStore((s) => s.count) 처럼 '필요한 조각만' 구독하면 그 조각이 바뀔 때만 리렌더된다. useStore() 로 통째로 꺼내면 아무 필드나 바뀔 때마다 리렌더되니 주의.",
    code: `const useStore = create((set) => ({
  count: 0,
  inc: () => set((s) => ({ count: s.count + 1 })),
}));

// ✅ 조각만 구독 — count 바뀔 때만 리렌더
const count = useStore((s) => s.count);
// ❌ 통째로 — 스토어의 어떤 필드가 바뀌어도 리렌더
const store = useStore();`,
  },
  {
    id: "q-state-17",
    category: "상태관리",
    question: "Flux 단방향 데이터 흐름이 왜 상태 관리의 기본 원칙이 됐나?",
    answer:
      "옛날 MVC 는 화면과 모델이 서로를 마음대로 바꿔서, 버그가 나면 '누가 이 값을 바꿨지?' 를 추적하기 어려웠다 (스파게티). Flux 는 물길을 한 방향으로 정한다: 액션(무슨 일이 일어남) → 스토어(상태 갱신) → 뷰(화면) → 다시 액션. 상태를 바꾸는 입구가 하나라서 변경 이력을 남기고, 되돌리고(undo), 디버깅하기 쉽다. Redux·Zustand 의 set 함수도 이 원칙 위에 있다.",
    code: `// 한 방향으로만 흐른다
사용자 클릭 → dispatch(action) → reducer/set → 새 state → 화면 갱신
//                 ↑ 상태를 바꾸는 '유일한 문'`,
  },
  {
    id: "q-state-18",
    category: "상태관리",
    question: "상태가 여러 도구에 흩어질 때, 무엇을 어디에 둘지 정리하면?",
    answer:
      "① 한 컴포넌트만 쓰는 UI 상태 (모달, 탭) → useState. ② 여러 화면이 공유하는 클라이언트 상태 (로그인 유저, 테마, 장바구니) → Zustand/Redux. ③ 서버에서 온 데이터 (목록, 상세) → React Query — 전역 스토어에 복사해 넣지 말 것 (두 곳이 어긋나는 '이중 진실' 이 생김). ④ URL 이 표현해야 할 상태 (검색어, 페이지, 필터) → 쿼리 스트링. 공유 링크로 재현되어야 하니까. 핵심: 서버 데이터를 전역 스토어에 넣는 실수를 가장 자주 한다.",
    code: `// ❌ 서버 데이터를 스토어에 복사 → 캐시와 스토어 둘 다 관리해야 함
const { data } = useQuery(...); useEffect(() => setPosts(data), [data]);

// ✅ 서버 데이터는 React Query 가 단일 진실, 스토어엔 클라이언트 상태만
const { data: posts } = useQuery({ queryKey: ["posts", page], ... });
const page = useSearchParams().get("page");     // URL 상태
const theme = useAppStore((s) => s.theme);      // 클라이언트 전역`,
  },
];

/** 카테고리 목록 — UI 필터에서 사용. Category union 과 동기화 유지. */
export const CATEGORIES: Category[] = Object.values(CATEGORY_GROUPS).flat();

/** 카테고리별 이모지 — 필터·퀴즈·스킬트리에서 공용으로 쓴다. */
export const CATEGORY_EMOJI: Record<Category, string> = {
  CS: "🧠",
  React: "⚛️",
  TypeScript: "🔷",
  상태관리: "🗄️",
  구조설계: "🏗️",
  Java: "☕",
  SpringBoot: "🌱",
  운영체제: "🖥️",
  네트워크: "🌐",
  데이터베이스: "🗃️",
  자료구조: "🌳",
  기술면접: "🎤",
};

// =============================================================
// SUMMARIES — 문제별 "한 줄 정답 요약"
// - 듀오링고식 객관식 보기(칩)에 쓰인다. 긴 answer 를 그대로 보기로 쓰면
//   읽을 게 너무 많아서, 핵심만 1줄로 압축한 라벨을 따로 둔다.
// - 한 문제의 요약은 그 문제의 '정답 보기'이자, 다른 문제의 '오답 보기(distractor)'로도 쓰인다.
//   → 그래서 서로 충분히 구별되게(헷갈리지만 명백히 다르게) 쓴다.
// - 규칙: 문제를 추가하면 QUESTIONS 와 SUMMARIES 를 항상 같이 갱신한다.
//   (id 가 없는 문제는 보기 생성 시 answer 첫 문장으로 자동 폴백되지만, 요약을 꼭 채우는 걸 권장)
// =============================================================
export const SUMMARIES: Record<string, string> = {
  "q-cs-1": "프로세스는 메모리를 따로 쓰고 스레드는 같이 쓴다",
  "q-cs-2": "HTTPS 는 TLS 봉투로 내용을 암호화한 HTTP 다",
  "q-cs-3": "멱등성은 같은 요청을 여러 번 보내도 결과가 같은 성질",
  "q-cs-4": "TCP 는 연결 전에 세 번 인사해서 양방향을 확인한다",
  "q-cs-5": "GET 은 주소에 붙여 묻고 POST 는 본문에 담아 바꾼다",
  "q-cs-6": "캐시는 자주 쓰는 데이터를 더 빠른 곳에 미리 둔다",
  "q-cs-7": "비트는 가장 작은 정보 단위고 바이트는 비트 여덟 개",
  "q-cs-8": "동기는 결과를 기다리고 비동기는 그동안 딴 일을 한다",
  "q-cs-9": "세션은 서버에 두는 열쇠고 쿠키는 그 열쇠를 담는 지갑",
  "q-cs-10": "DNS 는 도메인 이름을 컴퓨터가 쓰는 주소로 바꿔준다",
  "q-cs-11": "개인키로 서명하면 공개키로 누구나 검증할 수 있다",
  "q-cs-12": "RSA 는 소인수분해에 기대고 서명과 암호화를 둘 다 한다",
  "q-cs-13": "DSA 는 서명 난수를 재사용하면 개인키가 통째로 털린다",
  "q-cs-14": "ECDSA 는 타원곡선을 써서 짧은 키로 같은 안전도를 낸다",
  "q-cs-15": "EdDSA 는 서명 난수를 해시로 정해 재사용 사고를 막는다",
  "q-cs-16": "Ed25519 는 키가 작고 빨라 SSH 서명의 기본값이 됐다",
  "q-cs-17": "브랜치는 따로 작업하는 평행 세계고 병합은 그걸 합치는 것",
  "q-cs-18": "충돌은 같은 줄을 둘 다 고쳐서 사람이 골라줘야 하는 상황",
  "q-cs-19": "도커 이미지는 굳힌 포장본이고 컨테이너는 그걸 실행한 것",
  "q-cs-20": "배포는 자르로 굳혀 서버에서 돌리고 설정은 환경변수로 바꾼다",
  "q-os-1": "주소 공간을 코드·데이터·스택으로 나눠 메모리를 아낀다",
  "q-os-2": "인터럽트는 벨을 울려 알리고 폴링은 계속 나가서 확인한다",
  "q-os-3": "fork 는 프로세스를 복제하고 exec 는 알맹이만 갈아끼운다",
  "q-os-4": "PCB 는 프로세스의 상태와 레지스터를 적어두는 명세서",
  "q-os-5": "컨텍스트 스위칭은 저장과 복원만 하는 순수 오버헤드다",
  "q-os-6": "IPC 는 남남인 프로세스끼리 커널이 놔주는 통로다",
  "q-os-7": "선점 스케줄링은 CPU 를 도중에 뺏고 비선점은 못 뺏는다",
  "q-os-8": "데드락은 상호배제·점유대기·비선점·순환대기가 다 모여야 난다",
  "q-os-9": "레이스 컨디션은 접근 순서에 따라 결과가 달라지는 상태",
  "q-os-10": "뮤텍스는 열쇠 하나고 세마포어는 자리 여러 개를 센다",
  "q-os-11": "스레드 세이프는 여러 스레드가 동시에 써도 의도대로 도는 것",
  "q-os-12": "페이징은 내부 단편화 세그멘테이션은 외부 단편화를 낳는다",
  "q-os-13": "MMU 는 프로그램의 가상 주소를 물리 주소로 즉석 번역한다",
  "q-os-14": "페이지 교체는 먼저 온 것 오래 안 쓴 것 순으로 내보낸다",
  "q-net-1": "OSI 7계층은 통신을 층으로 나눠 문제를 층별로 고치게 한다",
  "q-net-2": "흐름제어는 받는 쪽 버퍼가 넘치지 않게 속도를 맞춘다",
  "q-net-3": "혼잡제어는 네트워크 전체가 막히지 않게 전송량을 조절한다",
  "q-net-4": "종료는 남은 데이터를 보낼 틈을 줘야 해서 네 번 오간다",
  "q-net-5": "TCP 는 순서와 도착을 보장하고 UDP 는 빠르게 던지기만 한다",
  "q-net-6": "로드 밸런싱은 요청을 여러 서버에 나눠 스케일아웃을 돕는다",
  "q-net-7": "느린 공개키로 대칭키를 건네고 그다음은 대칭키로 주고받는다",
  "q-net-8": "TLS 핸드셰이크는 인증서를 확인한 뒤 세션키를 합의한다",
  "q-net-9": "DNS 는 캐시부터 보고 없으면 루트와 TLD 를 거쳐 찾아간다",
  "q-net-10": "블로킹은 답이 올 때까지 멈추고 논블로킹은 바로 돌려받는다",
  "q-net-11": "블로킹은 제어권 축이고 동기 비동기는 완료 확인 축이다",
  "q-net-12": "웹소켓은 연결을 열어둬 서버가 먼저 말을 걸 수 있게 한다",
  "q-net-13": "백엔드는 검증·업무 규칙·저장을 맡는 보이지 않는 주방이다",
  "q-net-14": "HTTP 메시지는 시작줄과 헤더와 바디 세 칸으로 이뤄진다",
  "q-net-15": "PUT 은 자원을 통째로 바꾸고 PATCH 는 보낸 칸만 고친다",
  "q-net-16": "4xx 는 요청한 쪽 잘못이고 5xx 는 서버 쪽 잘못이다",
  "q-net-17": "요청은 메서드와 주소 짝이 맞는 컨트롤러 메서드와 만난다",
  "q-net-18": "포트가 다르면 다른 출처라 브라우저가 CORS 로 응답을 막는다",
  "q-db-1": "슈퍼키에서 군더더기를 뺀 최소 조합이 후보키가 된다",
  "q-db-2": "이상현상은 한 테이블에 정보를 몰아넣어 생기는 부작용이다",
  "q-db-3": "정규화는 원자값 부분종속 이행종속을 차례로 걷어낸다",
  "q-db-4": "인덱스는 조회를 빠르게 하지만 쓰기를 느리게 만든다",
  "q-db-5": "해시는 순서를 잃어 범위 검색을 못 해서 B+Tree 를 쓴다",
  "q-db-6": "트랜잭션은 전부 성공 아니면 전부 취소를 ACID 로 보장한다",
  "q-db-7": "격리수준을 올릴수록 이상현상은 줄고 속도는 느려진다",
  "q-db-8": "이너 조인은 교집합만 아우터 조인은 한쪽을 다 살린다",
  "q-db-9": "SQL 인젝션은 입력값이 쿼리 문법이 되어버리는 공격이다",
  "q-db-10": "SQL 은 정해진 스키마 NoSQL 은 한 덩어리로 뭉쳐 담는다",
  "q-db-11": "커넥션 풀은 연결을 미리 만들어 빌려주고 반납받는다",
  "q-db-12": "테이블을 행 단위로 쪼갠 수평 파티셔닝이 곧 샤딩이다",
  "q-db-13": "레디스는 메모리에 올려두는 키밸류 저장소라 아주 빠르다",
  "q-db-14": "엑셀과 달리 테이블은 타입과 제약조건으로 규칙을 강제한다",
  "q-db-15": "WHERE 없는 UPDATE·DELETE 는 테이블의 모든 행에 적용된다",
  "q-db-16": "WHERE 는 묶기 전 행을 거르고 HAVING 은 묶은 뒤 그룹을 거른다",
  "q-db-17": "1:N 의 외래키는 N 쪽에 두고 N:M 은 중간 테이블로 푼다",
  "q-db-18": "ddl-auto 를 create 로 두면 켤 때마다 테이블을 새로 만든다",
  "q-ds-1": "배열은 인덱스 접근이 빠르고 연결 리스트는 중간 삽입이 빠르다",
  "q-ds-2": "스택은 나중에 넣은 걸 먼저 큐는 먼저 온 걸 먼저 꺼낸다",
  "q-ds-3": "힙은 최댓값을 빠르게 꺼내는 반정렬 완전 이진 트리다",
  "q-ds-4": "사이클이 없고 전부 연결된 그래프가 곧 트리가 된다",
  "q-ds-5": "정렬된 값을 순서대로 넣으면 편향 트리가 되어 느려진다",
  "q-ds-6": "해시 충돌은 체이닝으로 매달거나 빈 칸을 찾아가 푼다",
  "q-ds-7": "트라이는 접두사를 공유해 문자열 길이만큼만에 찾아낸다",
  "q-ds-8": "B-Tree 는 노드를 크게 만들어 디스크 읽는 횟수를 줄인다",
  "q-ds-9": "모든 경로를 볼 땐 DFS 최단 거리를 잴 땐 BFS 를 쓴다",
  "q-ds-10": "퀵은 평균이 빠르고 병합은 최악을 보장하고 힙은 제자리다",
  "q-ds-11": "빅오는 입력이 커질 때 시간이 늘어나는 모양만 재는 것",
  "q-ds-12": "해시맵은 순서 없이 빠르고 트리맵은 항상 정렬을 유지한다",
  "q-react-1": "의존성 배열에 넣은 값이 바뀔 때만 이펙트가 실행된다",
  "q-react-2": "키는 목록에서 어떤 항목이 그대로인지 알려주는 이름표다",
  "q-react-3": "유즈메모는 계산 결과를 유즈콜백은 함수 자체를 기억한다",
  "q-react-4": "제어 컴포넌트는 리액트가 값을 쥐고 비제어는 DOM 이 쥔다",
  "q-react-5": "리액트는 화면을 상태의 함수로 봐서 상태가 바뀌면 다시 그린다",
  "q-react-6": "키가 없으면 순서로 판단해 상태가 엉뚱한 항목에 붙는다",
  "q-react-7": "서버 컴포넌트는 서버에서만 돌고 번들에 실리지 않는다",
  "q-react-8": "재조합은 두 트리를 비교해 최소한의 변경만 DOM 에 적용한다",
  "q-react-9": "프롭 드릴링은 중간이 쓰지도 않는 값을 계속 전달하는 것",
  "q-react-10": "값을 상태 하나에 모아 진실의 원천을 하나로 만든다",
  "q-react-11": "서버 액션은 폼·데이터 변경에 쓰는 서버 함수의 한 종류다",
  "q-react-12": "프레임워크가 라우팅·SSR·캐싱 같은 뼈대를 기본으로 깔아준다",
  "q-react-13": "작은 기능 클래스를 마크업에 바로 조립해 스타일을 입힌다",
  "q-react-14": "설치가 아니라 소스를 내 프로젝트로 복사해 직접 소유한다",
  "q-react-15": "타입은 실행 시 사라지니 바깥 입력은 런타임에 검증해야 한다",
  "q-react-16": "URL 에 두면 새로고침·링크 공유·뒤로가기에도 상태가 유지된다",
  "q-react-17": "상태를 주인별로 나누면 클라이언트 전역 상태는 조금만 남는다",
  "q-react-18": "RTL 은 컴포넌트를, Playwright 는 실제 브라우저로 전체 흐름을 본다",
  "q-react-19": "표준 DB 로만 쓰고 ORM 으로 접근해 벤더 교체 가능성을 지킨다",
  "q-ts-1": "인터페이스는 같은 이름이 병합되고 타입은 표현이 자유롭다",
  "q-ts-2": "애니는 검사를 면제하고 언노운은 확인부터 하라고 강제한다",
  "q-ts-3": "애즈 콘스트는 값을 리터럴로 좁히고 읽기 전용으로 얼린다",
  "q-ts-4": "제네릭 제약은 들어올 타입이 갖춰야 할 최소 조건을 건다",
  "q-ts-5": "유니온은 타입가드로 확인하면 분기 안에서 타입이 좁혀진다",
  "q-ts-6": "유틸리티 타입은 원본을 오려 파생 타입을 자동으로 만든다",
  "q-ts-7": "애즈 단언은 검사를 끌 뿐이라 틀리면 런타임에서 터진다",
  "q-ts-8": "옵셔널 체이닝은 없으면 멈추고 널 병합은 기본값을 채운다",
  "q-state-1": "서버 상태는 남의 창고에서 가져온 복사본이라 갱신이 관건",
  "q-state-2": "쿼리키는 캐시 선반 이름표라 변수를 빠뜨리면 안 된다",
  "q-state-3": "스테일타임은 신선한 기간 지씨타임은 캐시를 남겨두는 기간",
  "q-state-4": "캐시는 프레시 스테일 인액티브를 거쳐 결국 삭제된다",
  "q-state-5": "펜딩은 보여줄 데이터가 없는 것 페칭은 뒤에서 받는 중",
  "q-state-6": "이네이블드는 앞 쿼리 결과가 나와야 다음 쿼리를 켜준다",
  "q-state-7": "뮤테이션은 직접 호출하고 성공 후 목록을 무효화한다",
  "q-state-8": "무효화는 다시 받아오고 셋쿼리데이터는 캐시를 직접 고친다",
  "q-state-9": "낙관적 업데이트는 화면부터 바꾸고 실패하면 되돌린다",
  "q-state-10": "플레이스홀더는 새 페이지가 올 때까지 이전 것을 보여준다",
  "q-state-11": "무한 쿼리는 페이지 묶음과 다음 페이지 힌트를 들고 있다",
  "q-state-12": "셀렉트는 캐시 원본은 두고 필요한 부분만 잘라서 준다",
  "q-state-13": "포커스 재요청은 탭 복귀 때 인터벌은 주기마다 다시 받는다",
  "q-state-14": "서스펜스와 에러 바운더리가 로딩과 에러를 대신 처리한다",
  "q-state-15": "컨텍스트는 값이 바뀌면 구독한 컴포넌트가 전부 리렌더된다",
  "q-state-16": "주스탠드는 셀렉터로 필요한 조각만 구독해 리렌더를 줄인다",
  "q-state-17": "플럭스는 상태를 바꾸는 입구를 하나로 두고 한 방향만 흐른다",
  "q-state-18": "서버 데이터를 전역 스토어에 복사하면 이중 진실이 생긴다",
  "q-java-1": "자바는 바이트코드로 번역돼 JVM 이 있는 곳이면 다 돈다",
  "q-java-2": "클래스는 설계도고 객체는 그 설계도로 찍어낸 실체다",
  "q-java-3": "상속은 부모 능력을 물려받고 인터페이스는 직접 구현한다",
  "q-java-4": "이퀄스는 내용을 비교하고 == 는 메모리 주소를 비교한다",
  "q-java-5": "오버로딩은 매개변수를 달리하고 오버라이딩은 부모를 덮어쓴다",
  "q-java-6": "스태틱은 인스턴스가 아니라 클래스가 하나만 갖고 공유한다",
  "q-java-7": "체크 예외는 컴파일러가 처리를 강제하고 런타임은 안 한다",
  "q-java-8": "어레이리스트는 순서로 해시맵은 이름표로 값을 꺼낸다",
  "q-java-9": "인트는 null 이 안 되고 인티저는 null 을 담을 수 있다",
  "q-java-10": "배열은 길이가 고정이고 어레이리스트는 알아서 늘어난다",
  "q-java-11": "생성자는 new 할 때 불리고 this 는 지금 만드는 나 자신이다",
  "q-java-12": "포이치는 번호 없이 요소만 꺼내 JS 의 for...of 와 같다",
  "q-java-13": "캡슐화는 필드를 프라이빗으로 숨기고 게터 세터로 연다",
  "q-java-14": "부모 타입에 담아도 실제 실행은 자식 객체의 메서드다",
  "q-java-15": "제네릭은 타입을 빈칸으로 두고 쓰는 쪽이 채워 넣는다",
  "q-java-16": "부모 생성자에서 부른 오버라이딩 메서드는 아직 0인 자식 필드를 본다",
  "q-java-17": "static 블록은 처음 한 번만, 인스턴스 블록은 객체마다 부모부터 돈다",
  "q-java-18": "static 메서드는 변수 타입을 따라가고 일반 메서드는 실제 객체를 따라간다",
  "q-java-19": "오버로딩은 선언 타입으로 고르고 null 은 더 구체적인 타입이 받는다",
  "q-java-20": "super.get() 사슬은 위층부터 계산해 내려오고 필드는 변수 타입 것을 쓴다",
  "q-java-21": "finally 는 return 뒤에도 돌고 그 안의 return 이 결과를 덮어쓴다",
  "q-java-22": "리터럴과 final 상수끼리 더한 문자열은 컴파일 때 합쳐져 == 가 true 다",
  "q-java-23": "후위 증가는 쓰고 나서 올리고 정수끼리 나누면 소수점이 버려진다",
  "q-java-24": "배열은 참조를 복사해 넘기므로 내용 수정은 보이고 재할당은 안 보인다",
  "q-java-25": "재귀 호출 뒤의 출력은 돌아오면서 역순으로 찍힌다",
  "q-spring-1": "스프링부트는 서버 설정을 미리 해둔 자바 웹 밀키트다",
  "q-spring-2": "레스트 컨트롤러에 매핑을 붙이면 주소와 메서드가 연결된다",
  "q-spring-3": "의존성 주입은 필요한 객체를 스프링이 만들어 꽂아주는 것",
  "q-spring-4": "JPA 는 자바 객체와 DB 테이블 사이를 번역해주는 통역사",
  "q-spring-5": "IoC 컨테이너가 빈을 미리 만들어 두고 필요한 곳에 빌려준다",
  "q-spring-6": "컨트롤러는 접수 서비스는 로직 리포지토리는 DB 를 맡는다",
  "q-spring-7": "트랜잭셔널은 메서드 안 DB 작업을 한 묶음으로 처리한다",
  "q-spring-8": "프로파일은 환경마다 다른 설정을 통째로 갈아끼우게 해준다",
  "q-spring-9": "프로젝트는 이니셜라이저로 받고 메인 클래스 아래 패키지만 스캔된다",
  "q-spring-10": "어노테이션은 스프링이 읽고 대신 일해주는 표시 스티커다",
  "q-spring-11": "경로 값은 패스배리어블 쿼리는 리퀘스트파람 본문은 리퀘스트바디로 받는다",
  "q-spring-12": "요청은 디스패처 서블릿을 거쳐 컨트롤러 서비스 리포지토리로 흐른다",
  "q-spring-13": "요청은 DTO 로 받아 Valid 로 검사하고 엔티티는 밖에 내놓지 않는다",
  "q-spring-14": "컨트롤러는 타임리프 화면을 레스트 컨트롤러는 JSON 데이터를 준다",
  "q-spring-15": "리포지토리 메서드 이름만 규칙대로 지으면 쿼리가 자동으로 생긴다",
  "q-spring-16": "JPA 도 결국 SQL 을 만들기에 SQL 을 알아야 성능을 잡는다",
  "q-spring-17": "외래키를 가진 다대일 쪽이 연관관계의 주인이라 그쪽만 DB 에 반영된다",
  "q-spring-18": "지연 로딩은 프록시를 두고 목록에서 하나씩 건드리면 쿼리가 N+1 번 나간다",
  "q-spring-19": "레스트 컨트롤러 어드바이스가 흩어진 예외를 한 모양 응답으로 모은다",
  "q-spring-20": "Pageable 로 페이지와 크기를 받고 Page 는 전체 개수까지 담아 준다",
  "q-spring-21": "테스트는 준비 실행 검증 순서로 쓰고 Test 를 붙이면 JUnit 이 돌린다",
  "q-spring-22": "스프링부트테스트는 앱 전체를 WebMvcTest 는 웹 계층만 띄워 검사한다",
  "q-spring-23": "시큐리티는 컨트롤러 앞 필터 체인에서 인증과 인가를 검사한다",
  "q-spring-24": "스웨거는 코드에서 API 문서를 자동으로 뽑고 README 엔 실행법을 쓴다",
  "q-arch-1": "관심사 분리는 데이터·로직·화면을 각자 담당으로 나눈다",
  "q-arch-2": "상태는 가장 좁은 곳에서 시작해 필요할 때만 넓혀 올린다",
  "q-arch-3": "비즈니스 로직을 순수 함수로 빼면 화면 없이도 테스트된다",
  "q-arch-4": "모듈 설계는 주고받을 인터페이스 약속부터 먼저 정한다",
  "q-arch-5": "계층은 바뀌는 이유가 같은 코드끼리 묶어서 나눈다",
  "q-arch-6": "응답 형태를 통일하면 클라이언트의 분기 코드가 줄어든다",
  "q-arch-7": "상태 라이브러리는 리프트업과 컨텍스트로 안 되면 그때 쓴다",
  "q-arch-8": "도메인 주도 설계는 코드를 현실 업무 용어에 맞춰 짠다",
  "q-arch-9": "무상태 서버는 아무 노드나 처리해도 돼서 늘리기 쉽다",
  "q-arch-10": "좋은 이름 짓기가 가장 싸고 빠른 유지보수 수단이다",
  "q-arch-11": "결합도는 자료 스탬프 제어 외부 공통 내용 순으로 강해진다",
  "q-arch-12": "객체나 배열을 통째로 넘기면 스탬프 결합도다",
  "q-arch-13": "상대의 처리 흐름을 정하는 플래그를 넘기면 제어 결합도다",
  "q-arch-14": "전역 변수를 함께 읽고 쓰면 공통 결합도다",
  "q-arch-15": "앞 작업의 출력이 다음 작업의 입력이면 순차적 응집도다",
  "q-arch-16": "같은 입력을 나눠 쓰는 작업끼리 모이면 교환적 응집도다",
  "q-interview-1": "기술 답변은 한 줄 정의 특징 내 경험 순으로 쌓는다",
  "q-interview-2": "스프링은 객체를 꽂아주고 공통 관심사를 대신 붙여준다",
  "q-interview-3": "컨트롤러와 서비스를 나누면 로직만 따로 테스트할 수 있다",
  "q-interview-4": "트랜잭셔널은 중간 실패 때 롤백이 필요해서 붙인 선언이다",
  "q-interview-5": "기술 선택 질문은 문제 후보 기준 트레이드오프를 묻는다",
  "q-interview-6": "AI 코드도 읽고 설명하고 검증했으면 내 코드가 된다",
  "q-interview-7": "이력서 기술마다 정의 이유 장단점 사용처를 준비한다",
  "q-interview-8": "비교 질문은 내 요구사항을 먼저 말하고 그에 비춰 고른다",
  "q-interview-9": "직접 부딪히는 프로젝트에서 디버깅하는 법을 배운다",
  "q-interview-10": "AI 가 코드를 써줄수록 판단하는 사람의 가치가 오른다",
};
