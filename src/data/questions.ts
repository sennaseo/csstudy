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
  "q-spring-1": "스프링부트는 서버 설정을 미리 해둔 자바 웹 밀키트다",
  "q-spring-2": "레스트 컨트롤러에 매핑을 붙이면 주소와 메서드가 연결된다",
  "q-spring-3": "의존성 주입은 필요한 객체를 스프링이 만들어 꽂아주는 것",
  "q-spring-4": "JPA 는 자바 객체와 DB 테이블 사이를 번역해주는 통역사",
  "q-spring-5": "IoC 컨테이너가 빈을 미리 만들어 두고 필요한 곳에 빌려준다",
  "q-spring-6": "컨트롤러는 접수 서비스는 로직 리포지토리는 DB 를 맡는다",
  "q-spring-7": "트랜잭셔널은 메서드 안 DB 작업을 한 묶음으로 처리한다",
  "q-spring-8": "프로파일은 환경마다 다른 설정을 통째로 갈아끼우게 해준다",
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
