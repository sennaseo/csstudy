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
  프론트엔드: ["React", "TypeScript"],
  "백엔드&프로그래밍": ["CS", "Java", "SpringBoot", "구조설계"],
};

export const QUESTIONS: Question[] = [
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
];

/** 카테고리 목록 — UI 필터에서 사용. Category union 과 동기화 유지. */
export const CATEGORIES: Category[] = Object.values(CATEGORY_GROUPS).flat();

/** 카테고리별 이모지 — 필터·퀴즈·스킬트리에서 공용으로 쓴다. */
export const CATEGORY_EMOJI: Record<Category, string> = {
  CS: "🧠",
  React: "⚛️",
  TypeScript: "🔷",
  구조설계: "🏗️",
  Java: "☕",
  SpringBoot: "🌱",
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
  "q-cs-1": "메모리 독립 vs 공유",
  "q-cs-2": "TLS 암호화 통신",
  "q-cs-3": "여러 번 = 한 번 결과",
  "q-cs-4": "연결 전 3단계 확인",
  "q-cs-5": "주소 붙이기 vs 본문 숨기기",
  "q-cs-6": "빠른 곳에 자주 쓰는 데이터 저장",
  "q-cs-7": "전구 1개 vs 전구 8개 묶음",
  "q-cs-8": "기다림 차단 vs 비차단",
  "q-cs-9": "지갑 vs 열쇠",
  "q-cs-10": "이름 ↔ 숫자 해석기",
  "q-react-1": "값 바뀔 때만 실행",
  "q-react-2": "목록 항목 식별표",
  "q-react-3": "값 기억 vs 함수 기억",
  "q-react-4": "state 관리 vs DOM 관리",
  "q-react-5": "상태 변화 → 화면 재생성",
  "q-react-6": "목록 업데이트시 누가 바뀌는지 추적",
  "q-react-7": "서버 전용 번들 없는 컴포넌트",
  "q-react-8": "트리 비교 최소 변경 적용",
  "q-react-9": "데이터 전달만 반복되는 현상",
  "q-react-10": "한 가지 진실의 입력값",
  "q-ts-1": "선언 병합 vs 자유 표현",
  "q-ts-2": "검사 면제 vs 확인 강제",
  "q-ts-3": "리터럴로 고정·동결",
  "q-ts-4": "타입에 최소 조건",
  "q-ts-5": "확인하면 분기 안에서 확정",
  "q-ts-6": "기존 타입 오려서 재활용",
  "q-ts-7": "검사 끄고 우기기 — 최소한만",
  "q-ts-8": "없으면 멈춤 / 기본값 대체",
  "q-java-1": "바이트코드 실행기",
  "q-java-2": "설계도 vs 실체",
  "q-java-3": "물려받기 vs 구현하기",
  "q-java-4": "주소 비교 vs 내용 비교",
  "q-java-5": "옵션 추가 vs 레시피 재정의",
  "q-java-6": "인스턴스 아닌 클래스 소유",
  "q-java-7": "예고된 사고 vs 돌발 사고",
  "q-java-8": "번호 순 목록 vs 이름표 사물함",
  "q-spring-1": "자바 웹 밀키트",
  "q-spring-2": "주소↔메서드 연결",
  "q-spring-3": "객체를 꽂아줌",
  "q-spring-4": "객체↔테이블 번역",
  "q-spring-5": "미리 만들어 보관·대여",
  "q-spring-6": "접수·요리·창고 3분업",
  "q-spring-7": "전부 성공 아니면 전부 취소",
  "q-spring-8": "환경별 설정 갈아끼우기",
  "q-arch-1": "역할별로 나누기",
  "q-arch-2": "좁게 시작, 필요시 확장",
  "q-arch-3": "로직은 순수 함수로",
  "q-arch-4": "약속(인터페이스) 먼저",
};
