// 프론트엔드 단원 2 — 상태·구조 패턴. 작성 규칙은 ../python.ts 상단 주석.
import type { NoteUnit } from "../types";

export const FE2: NoteUnit = {
  id: "fe-2",
  title: "상태·구조 패턴",
  notes: [
    {
      id: "n-fe-2-1",
      emoji: "➡️",
      title: "Flux · 단방향 데이터 흐름",
      summary: "상태는 한곳에, 바꾸는 길은 action 하나뿐 — Redux 의 뿌리",
      blocks: [
        { type: "key", text: "데이터는 한 방향으로만 흐른다" },
        {type: "figure", kind: "cycle", nodes: [{icon: "🖱️", label: "View", sub: "클릭"}, {icon: "📨", label: "Action", ink: "red"}, {icon: "⚙️", label: "Reducer", sub: "새 상태", ink: "blue"}, {icon: "🏪", label: "Store", sub: "알림", ink: "green"}]},
        { type: "h2", text: "한 바퀴" },
        {
          type: "list",
          style: "flow",
          items: ["View 에서 클릭 → `dispatch(action)`", "Reducer 가 이전 상태 + action 으로 새 상태를 만든다", "Store 가 바뀐 상태를 알림", "View 가 새 상태로 다시 그려진다"],
        },
        { type: "h2", text: "useReducer 로 맛보기" },
        {
          type: "code",
          code: `type Action = { type: "add" } | { type: "reset" };

function reducer(state: number, action: Action) {
  switch (action.type) {
    case "add": return state + 1;
    case "reset": return 0;
  }
}

let s = reducer(0, { type: "add" });
s = reducer(s, { type: "add" });
console.log(s);
console.log(reducer(s, { type: "reset" }));`,
          out: "2\n0",
        },
        {
          type: "compare",
          cols: [
            { title: "양방향 바인딩", tone: "bad", items: ["화면과 모델이 서로를 고침", "값이 왜 바뀌었는지 추적 어려움"] },
            { title: "단방향", tone: "good", items: ["바꾸는 길은 action 하나", "action 로그만 보면 원인이 보인다"] },
          ],
        },
        {
          type: "list",
          style: "check",
          items: ["상태 변경은 action → reducer 로만", "reducer 는 순수 함수, 새 객체를 돌려준다", "Redux·`useReducer`·Zustand 모두 이 흐름"],
        },
      ],
    },
    {
      id: "n-fe-2-2",
      emoji: "🔔",
      title: "옵저버 패턴 (구독)",
      summary: "값이 바뀌면 구독자 모두에게 알림을 보내는 발행·구독 구조",
      blocks: [
        { type: "key", text: "바뀌면 알려줄게, 구독만 해" },
        {type: "figure", kind: "tree", root: {icon: "📢", label: "`set(1)`", sub: "값이 바뀜 → 발행", ink: "red"}, children: [{icon: "🅰️", label: "구독자 A"}, {icon: "🅱️", label: "구독자 B"}, {icon: "🖼️", label: "화면"}], caption: "구독한 모두에게 동시에 알림"},
        { type: "h2", text: "직접 만들기" },
        {
          type: "code",
          code: `function createStore<T>(value: T) {
  const subs = new Set<(v: T) => void>();
  return {
    get: () => value,
    set(next: T) { value = next; subs.forEach((fn) => fn(value)); },
    subscribe(fn: (v: T) => void) { subs.add(fn); return () => subs.delete(fn); },
  };
}

const count = createStore(0);
const off = count.subscribe((v) => console.log("A", v));
count.subscribe((v) => console.log("B", v));
count.set(1);
off();
count.set(2);`,
          out: "A 1\nB 1\nB 2",
        },
        { type: "h2", text: "프론트에서 만나는 곳" },
        {
          type: "table",
          head: ["어디", "구독하는 것"],
          rows: [
            ["`addEventListener`", "DOM 이벤트"],
            ["Zustand · Redux store", "상태 변화"],
            ["`useSyncExternalStore`", "외부 store 를 React 에 연결"],
            ["RxJS Observable", "값의 흐름(스트림)"],
          ],
        },
        {
          type: "tip",
          kind: "warn",
          text: "구독만 하고 해제를 안 하면 언마운트된 컴포넌트가 계속 알림을 받는다(메모리 누수). `useEffect` 에서 해제 함수를 return 한다.",
        },
        {
          type: "list",
          style: "check",
          items: ["`subscribe` 는 해제 함수를 돌려준다", "값이 바뀌면 구독자 전원에게 알림", "언마운트 때 꼭 구독 해제"],
        },
      ],
    },
    {
      id: "n-fe-2-3",
      emoji: "1️⃣",
      title: "싱글턴 · 모듈 패턴",
      summary: "앱 전체에서 딱 하나만 있어야 하는 객체를 ES 모듈로 만든다",
      blocks: [
        { type: "key", text: "import 할 때마다 같은 하나를 받는다" },
        {type: "figure", kind: "refs", vars: [{name: "a.ts", to: 0}, {name: "b.ts", to: 0}, {name: "c.ts", to: 0}], objs: [{icon: "🔌", label: "`api`", sub: "딱 하나뿐인 객체"}], caption: "어디서 import 해도 같은 하나"},
        { type: "h2", text: "ES 모듈은 한 번만 실행된다" },
        {
          type: "code",
          code: `// api.ts
export const api = createApiClient({ baseURL: "/api" });

// a.ts, b.ts
import { api } from "./api"; // 둘 다 같은 객체`,
        },
        {
          type: "list",
          style: "flow",
          items: ["처음 `import` 될 때 모듈 코드가 한 번 실행", "결과를 모듈 캐시에 저장", "다음 `import` 부터는 캐시된 같은 객체를 준다"],
        },
        { type: "h2", text: "어디에 쓰나" },
        {
          type: "compare",
          cols: [
            { title: "잘 맞는 것", tone: "good", items: ["API 클라이언트", "로거, 분석 SDK", "React Query 의 `QueryClient`"] },
            { title: "피할 것", tone: "bad", items: ["유저별로 달라야 하는 값", "테스트마다 초기화가 필요한 상태", "SSR 서버에서 요청 간 공유되는 데이터"] },
          ],
        },
        {
          type: "tip",
          kind: "warn",
          text: "Next.js 같은 SSR 서버에서 모듈 변수에 유저 데이터를 담으면 다른 사람 요청과 섞인다. 서버에서는 요청마다 새로 만든다.",
        },
        {
          type: "list",
          style: "check",
          items: ["ES 모듈 = 공짜 싱글턴", "공용 클라이언트·로거에 쓴다", "유저별 데이터는 싱글턴에 담지 않는다"],
        },
      ],
    },
    {
      id: "n-fe-2-4",
      emoji: "🗄️",
      title: "서버 상태 vs 클라이언트 상태",
      summary: "서버에서 온 데이터는 캐시로 다루고, UI 상태만 직접 관리한다",
      blocks: [
        { type: "key", text: "서버 데이터는 내 것이 아니라 빌려 온 사본" },
        {type: "figure", kind: "flow", nodes: [{icon: "🗄️", label: "서버 DB", sub: "진짜 주인", ink: "red"}, {icon: "📦", label: "캐시", sub: "React Query", ink: "blue"}, {icon: "🖼️", label: "화면", ink: "green"}], edges: ["fetch", "data"]},
        { type: "h2", text: "두 종류" },
        {
          type: "compare",
          cols: [
            { title: "서버 상태", items: ["주인이 서버(DB)", "내 화면 값은 언제든 낡을 수 있음", "예: 상품 목록, 유저 정보"] },
            { title: "클라이언트 상태", items: ["주인이 브라우저", "내가 바꾸면 그게 정답", "예: 모달 열림, 입력 중인 글자"] },
          ],
        },
        { type: "h2", text: "React Query 로 서버 상태" },
        {
          type: "code",
          code: `function Products() {
  const { data, isPending, error } = useQuery({
    queryKey: ["products"],
    queryFn: () => fetch("/api/products").then((r) => r.json()),
    staleTime: 60_000,
  });
  if (isPending) return <Spinner />;
  if (error) return <ErrorBox />;
  return <List items={data} />;
}`,
        },
        {
          type: "table",
          head: ["직접 하면", "React Query 가 대신"],
          rows: [
            ["로딩·에러 state 3개 관리", "`isPending` `error` 제공"],
            ["같은 요청 중복 호출", "`queryKey` 로 캐시·중복 제거"],
            ["언제 다시 받을지 고민", "`staleTime`, 창 포커스 시 재요청"],
          ],
        },
        {
          type: "list",
          style: "check",
          items: ["서버 데이터를 `useState` 에 복사해 두지 않는다", "서버 상태는 캐시 라이브러리, UI 상태는 `useState`", "`queryKey` 가 캐시의 이름표"],
        },
      ],
    },
    {
      id: "n-fe-2-5",
      emoji: "⚡",
      title: "낙관적 업데이트 (Optimistic UI)",
      summary: "서버 응답 전에 성공했다고 치고 화면부터 바꾼 뒤 실패하면 되돌린다",
      blocks: [
        { type: "key", text: "일단 바꾸고, 틀리면 되돌린다" },
        {type: "figure", kind: "flow", nodes: [{icon: "👍", label: "화면 먼저 +1", ink: "green"}, {icon: "💾", label: "이전 값 저장"}, {icon: "🌐", label: "서버 요청", ink: "blue"}, {icon: "↩️", label: "실패면 되돌리기", ink: "red"}], edges: ["", "", "실패?"]},
        { type: "h2", text: "흐름" },
        {
          type: "list",
          style: "flow",
          items: ["좋아요 클릭 → 화면 숫자를 바로 +1", "이전 값을 따로 저장해 둔다", "서버에 요청", "실패하면 저장한 이전 값으로 되돌리고 알림"],
        },
        { type: "h2", text: "코드" },
        {
          type: "code",
          code: `async function like() {
  const prev = count;
  setCount(prev + 1);          // ① 먼저 바꾼다
  try {
    await api.post("/like");   // ② 서버 요청
  } catch {
    setCount(prev);            // ③ 실패면 원래대로
    toast("좋아요 실패");
  }
}`,
        },
        {
          type: "compare",
          cols: [
            { title: "잘 맞는 곳", tone: "good", items: ["좋아요·북마크·체크박스", "거의 항상 성공하는 요청"] },
            { title: "안 맞는 곳", tone: "bad", items: ["결제·송금", "서버가 값을 계산해 줘야 하는 요청"] },
          ],
        },
        {
          type: "list",
          style: "check",
          items: ["바꾸기 전 값을 꼭 저장", "실패 시 롤백 + 사용자 알림", "돈이 걸린 요청엔 쓰지 않는다"],
        },
      ],
    },
    {
      id: "n-fe-2-6",
      emoji: "🗂️",
      title: "기능 단위 폴더 구조 (FSD)",
      summary: "파일 종류가 아니라 기능별로 폴더를 나누고 층 사이 import 방향을 정한다",
      blocks: [
        { type: "key", text: "종류별 서랍 대신 기능별 상자" },
        {type: "figure", kind: "stack", layers: [{icon: "🚀", label: "app", sub: "라우터·Provider"}, {icon: "📄", label: "pages", sub: "화면 조립"}, {icon: "🧱", label: "widgets", sub: "큰 블록"}, {icon: "✨", label: "features", sub: "사용자 행동", ink: "red"}, {icon: "📦", label: "entities", sub: "도메인 모델"}, {icon: "🧰", label: "shared", sub: "버튼·유틸", ink: "blue"}], caption: "import 는 위에서 아래로만 ↓"},
        { type: "h2", text: "종류별 vs 기능별" },
        {
          type: "compare",
          cols: [
            { title: "종류별", tone: "bad", items: ["`components/` `hooks/` `api/` 에 흩어짐", "기능 하나 고치려면 폴더 4곳을 오감"] },
            { title: "기능별", tone: "good", items: ["`features/cart/` 안에 UI·훅·API 같이", "지울 때 폴더 하나만 지우면 끝"] },
          ],
        },
        { type: "h2", text: "Feature-Sliced Design 층" },
        {
          type: "table",
          head: ["층", "담는 것"],
          rows: [
            ["`app`", "라우터, Provider, 전역 스타일"],
            ["`pages`", "화면 단위 조립"],
            ["`widgets`", "헤더·사이드바 같은 큰 블록"],
            ["`features`", "장바구니 담기, 로그인 같은 사용자 행동"],
            ["`entities`", "상품·유저 같은 도메인 모델"],
            ["`shared`", "버튼, api 클라이언트, 유틸"],
          ],
        },
        { type: "h2", text: "import 는 아래로만" },
        {
          type: "list",
          style: "flow",
          items: ["위층은 아래층을 import 할 수 있다 (`pages` → `features`)", "아래층은 위층을 모른다 (`shared` 는 `features` 를 import 금지)", "같은 층끼리도 서로 import 하지 않는다"],
        },
        {
          type: "list",
          style: "check",
          items: ["기능 하나 = 폴더 하나", "import 는 위에서 아래로만", "작은 프로젝트면 `features` + `shared` 두 층만으로 시작"],
        },
      ],
    },
  ],
};
