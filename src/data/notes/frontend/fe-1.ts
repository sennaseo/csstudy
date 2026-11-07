// 프론트엔드 단원 1 — 컴포넌트 패턴 (React 기준). 작성 규칙은 ../python.ts 상단 주석.
import type { NoteUnit } from "../types";

export const FE1: NoteUnit = {
  id: "fe-1",
  title: "컴포넌트 패턴",
  notes: [
    {
      id: "n-fe-1-1",
      emoji: "🧩",
      title: "Presentational · Container",
      summary: "데이터 가져오기와 화면 그리기를 다른 컴포넌트로 나눈다",
      blocks: [
        { type: "key", text: "가져오는 놈과 그리는 놈을 나눈다" },
        {type: "figure", kind: "flow", nodes: [{icon: "🗄️", label: "API"}, {icon: "🛰️", label: "가져오는 쪽", sub: "Container", ink: "blue"}, {icon: "🖼️", label: "그리는 쪽", sub: "Presentational", ink: "green"}], edges: ["데이터", "props"]},
        { type: "h2", text: "역할 나누기" },
        {
          type: "compare",
          cols: [
            { title: "Container", items: ["fetch·상태·이벤트 처리", "화면 모양은 모름", "props 로 데이터를 내려줌"] },
            { title: "Presentational", items: ["props 만 받아 그림", "fetch·전역 상태 없음", "스토리북·테스트가 쉬움"] },
          ],
        },
        { type: "h2", text: "코드로 보기" },
        {
          type: "code",
          code: `// 그리는 쪽: props 만 안다
function UserList({ users }: { users: User[] }) {
  return <ul>{users.map((u) => <li key={u.id}>{u.name}</li>)}</ul>;
}

// 가져오는 쪽: 화면은 UserList 에 맡긴다
function UserListContainer() {
  const users = useUsers();
  return <UserList users={users} />;
}`,
        },
        {
          type: "tip",
          kind: "memo",
          text: "Hooks 이후엔 Container 컴포넌트 대신 커스텀 훅(`useUsers`)이 그 역할을 많이 가져갔다. 나누는 생각 자체는 그대로 쓴다.",
        },
        {
          type: "list",
          style: "check",
          items: ["데이터 로직과 UI 를 분리", "그리는 컴포넌트는 props 만 받는다", "요즘은 Container 자리를 커스텀 훅이 대신"],
        },
      ],
    },
    {
      id: "n-fe-1-2",
      emoji: "🪝",
      title: "커스텀 훅 (Custom Hook)",
      summary: "여러 컴포넌트가 쓰는 상태 로직을 use 함수 하나로 뽑아낸다",
      blocks: [
        { type: "key", text: "UI 는 두고 로직만 떼어 재사용한다" },
        {type: "figure", kind: "tree", root: {icon: "🪝", label: "`useToggle()`", sub: "로직 한 벌", ink: "red"}, children: [{icon: "🪟", label: "모달"}, {icon: "📂", label: "아코디언"}, {icon: "🌙", label: "다크모드"}], caption: "훅은 하나, 상태는 쓰는 곳마다 따로"},
        { type: "h2", text: "반복되던 로직" },
        {
          type: "compare",
          cols: [
            { title: "훅 없이", tone: "bad", items: ["컴포넌트마다 `useState` + `useEffect` 복붙", "버그 고칠 때 여러 군데 수정"] },
            { title: "커스텀 훅", tone: "good", items: ["`useToggle()` 한 줄로 재사용", "고칠 곳이 한 군데"] },
          ],
        },
        { type: "h2", text: "만들고 쓰기" },
        {
          type: "code",
          code: `function useToggle(initial = false) {
  const [on, setOn] = useState(initial);
  const toggle = () => setOn((v) => !v);
  return [on, toggle] as const;
}

function Modal() {
  const [open, toggle] = useToggle();
  return <button onClick={toggle}>{open ? "닫기" : "열기"}</button>;
}`,
        },
        { type: "h2", text: "규칙" },
        {
          type: "table",
          head: ["규칙", "이유"],
          rows: [
            ["이름은 `use` 로 시작", "린터가 훅 규칙을 검사하는 표시"],
            ["최상위에서만 호출", "if·반복문 안이면 호출 순서가 꼬인다"],
            ["상태는 공유되지 않음", "부를 때마다 각자 자기 상태를 가진다"],
          ],
        },
        {
          type: "list",
          style: "check",
          items: ["상태 로직 재사용은 커스텀 훅", "이름은 `use` 로 시작", "같은 훅을 두 곳에서 써도 상태는 따로"],
        },
      ],
    },
    {
      id: "n-fe-1-3",
      emoji: "🧱",
      title: "합성 컴포넌트 (Compound Components)",
      summary: "부모와 자식 부품이 상태를 몰래 공유해 조립식으로 쓰는 컴포넌트",
      blocks: [
        { type: "key", text: "props 한 무더기 대신 부품을 조립한다" },
        {type: "figure", kind: "tree", root: {icon: "🗂️", label: "`<Tabs>`", sub: "상태 보관", ink: "red"}, children: [{icon: "🔘", label: "`Tabs.Tab`", leaves: ["눌린 탭 바꿈"]}, {icon: "📄", label: "`Tabs.Panel`", leaves: ["보일지 결정"]}], caption: "자식 부품이 Context 로 상태를 꺼내 쓴다"},
        { type: "h2", text: "props 지옥 vs 조립" },
        {
          type: "compare",
          cols: [
            { title: "props 지옥", tone: "bad", items: ["`<Tabs items titles onChange iconPos ... />`", "옵션 하나 늘 때마다 props 추가"] },
            { title: "합성", tone: "good", items: ["`<Tabs><Tabs.List /><Tabs.Panel /></Tabs>`", "순서·모양을 쓰는 쪽이 정함"] },
          ],
        },
        { type: "h2", text: "Context 로 상태 공유" },
        {
          type: "code",
          code: `const TabsCtx = createContext({ index: 0, setIndex: (i: number) => {} });

function Tabs({ children }: { children: ReactNode }) {
  const [index, setIndex] = useState(0);
  return <TabsCtx.Provider value={{ index, setIndex }}>{children}</TabsCtx.Provider>;
}
Tabs.Tab = function Tab({ i, children }: { i: number; children: ReactNode }) {
  const { index, setIndex } = useContext(TabsCtx);
  return <button aria-selected={index === i} onClick={() => setIndex(i)}>{children}</button>;
};`,
        },
        {
          type: "tip",
          kind: "analogy",
          text: "레고 세트. 블록(부품)은 정해져 있지만 어떤 순서로 쌓을지는 내 맘이다. `<select>` 와 `<option>` 이 원조다.",
        },
        {
          type: "list",
          style: "check",
          items: ["부모가 상태, 자식 부품이 Context 로 꺼내 씀", "`<select>` / `<option>` 이 같은 구조", "옵션이 많은 UI(탭·아코디언·드롭다운)에 맞다"],
        },
      ],
    },
    {
      id: "n-fe-1-4",
      emoji: "🎭",
      title: "Render Props",
      summary: "무엇을 그릴지를 함수 prop 으로 받아 로직과 화면을 분리한다",
      blocks: [
        { type: "key", text: "데이터는 내가 줄게, 그림은 네가 그려" },
        {type: "figure", kind: "flow", nodes: [{icon: "🖱️", label: "Tracker", sub: "x, y 관리", ink: "blue"}, {icon: "🧾", label: "`render(x,y)`"}, {icon: "🖼️", label: "내 JSX", ink: "green"}], edges: ["호출", "반환"]},
        { type: "h2", text: "모양" },
        {
          type: "code",
          code: `function MouseTracker({ render }: { render: (p: { x: number; y: number }) => ReactNode }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  return (
    <div onMouseMove={(e) => setPos({ x: e.clientX, y: e.clientY })}>
      {render(pos)}
    </div>
  );
}

<MouseTracker render={({ x, y }) => <p>{x}, {y}</p>} />`,
        },
        { type: "h2", text: "흐름" },
        {
          type: "list",
          style: "flow",
          items: ["컴포넌트가 상태(마우스 위치)를 관리", "그릴 때 `render(상태)` 함수를 호출", "부른 쪽이 넘긴 함수가 실제 JSX 를 만든다"],
        },
        {
          type: "compare",
          cols: [
            { title: "지금도 보이는 곳", items: ["`children` 을 함수로 받는 라이브러리", "Formik, React Router 옛 API"] },
            { title: "요즘 대세", items: ["같은 일을 커스텀 훅으로", "`const { x, y } = useMouse()`"] },
          ],
        },
        {
          type: "list",
          style: "check",
          items: ["함수 prop 으로 \"어떻게 그릴지\"를 받는다", "로직 재사용이 목적, 지금은 훅이 더 흔함", "중첩되면 콜백 지옥이 된다"],
        },
      ],
    },
    {
      id: "n-fe-1-5",
      emoji: "🎁",
      title: "고차 컴포넌트 (HOC)",
      summary: "컴포넌트를 받아 기능을 덧입힌 새 컴포넌트를 돌려주는 함수",
      blocks: [
        { type: "key", text: "컴포넌트를 포장지로 감싸 기능을 더한다" },
        {type: "figure", kind: "stack", nested: true, layers: [{icon: "🛡️", label: "`withAuth`", sub: "로그인 검사 포장지", ink: "red"}, {icon: "📊", label: "`Dashboard`", sub: "원래 컴포넌트 (안 건드림)", ink: "ink"}], caption: "포장지가 원래 컴포넌트를 감싼다"},
        { type: "h2", text: "함수가 컴포넌트를 반환" },
        {
          type: "code",
          code: `function withAuth<P extends object>(Comp: ComponentType<P>) {
  return function Guarded(props: P) {
    const user = useUser();
    if (!user) return <Login />;
    return <Comp {...props} />;
  };
}

const SecretPage = withAuth(Dashboard);`,
        },
        { type: "h2", text: "장단점" },
        {
          type: "compare",
          cols: [
            { title: "좋은 점", tone: "good", items: ["권한·로깅 같은 공통 기능을 한 번에 입힘", "원래 컴포넌트 코드는 안 건드림"] },
            { title: "아쉬운 점", tone: "bad", items: ["여러 겹 감싸면 래퍼 지옥", "어떤 prop 이 어디서 왔는지 헷갈림"] },
          ],
        },
        {
          type: "tip",
          kind: "warn",
          text: "HOC 를 렌더 함수 안에서 만들면 매 렌더마다 새 컴포넌트가 돼 상태가 날아간다. 모듈 최상단에서 한 번만 감싼다.",
        },
        {
          type: "list",
          style: "check",
          items: ["`with` 로 시작하는 함수가 컴포넌트를 감싼다", "공통 기능(권한·로깅)에 쓴다", "렌더 안에서 만들지 않는다"],
        },
      ],
    },
    {
      id: "n-fe-1-6",
      emoji: "🎛️",
      title: "제어 · 비제어 컴포넌트",
      summary: "입력값을 React state 가 쥐는지, DOM 이 쥐는지의 차이",
      blocks: [
        { type: "key", text: "값의 주인이 React 인가 DOM 인가" },
        {type: "figure", kind: "tree", root: {icon: "⌨️", label: "입력값의 주인은?"}, children: [{icon: "⚛️", label: "제어", sub: "React state", ink: "blue", leaves: ["`value` + `onChange`", "타이핑마다 리렌더"]}, {icon: "🌐", label: "비제어", sub: "DOM", ink: "green", leaves: ["`defaultValue` + `ref`", "필요할 때 꺼내 봄"]}]},
        { type: "h2", text: "두 방식" },
        {
          type: "code",
          code: `// 제어: state 가 주인
const [name, setName] = useState("");
<input value={name} onChange={(e) => setName(e.target.value)} />

// 비제어: DOM 이 주인, 필요할 때 꺼내 봄
const ref = useRef<HTMLInputElement>(null);
<input defaultValue="" ref={ref} />
// 제출할 때 ref.current.value`,
        },
        { type: "h2", text: "언제 무엇을" },
        {
          type: "table",
          head: ["", "제어", "비제어"],
          rows: [
            ["값 위치", "`useState`", "DOM (`ref`)"],
            ["실시간 검증·포맷", "쉬움", "어려움"],
            ["리렌더", "타이핑마다", "거의 없음"],
            ["예", "검색어 자동완성", "파일 업로드, 큰 폼(react-hook-form)"],
          ],
        },
        {
          type: "tip",
          kind: "warn",
          text: "`value` 만 주고 `onChange` 를 안 주면 글자가 안 써진다. 반대로 `value` 가 `undefined` 였다가 값이 생기면 비제어→제어 경고가 뜬다. 초기값은 `\"\"` 로 둔다.",
        },
        {
          type: "list",
          style: "check",
          items: ["제어 = `value` + `onChange`", "비제어 = `defaultValue` + `ref`", "한 입력에서 두 방식을 섞지 않는다"],
        },
      ],
    },
    {
      id: "n-fe-1-7",
      emoji: "📡",
      title: "Provider 패턴 (Context)",
      summary: "여러 층 아래로 props 를 넘기지 않고 Context 로 바로 꺼내 쓴다",
      blocks: [
        { type: "key", text: "props 릴레이 대신 방송국을 세운다" },
        {type: "figure", kind: "tree", root: {icon: "📡", label: "Provider", sub: "`value=\"dark\"`", ink: "red"}, children: [{icon: "🧱", label: "Layout", sub: "안 씀"}, {icon: "📋", label: "Sidebar", sub: "안 씀"}, {icon: "🔘", label: "Button", sub: "`useContext`", ink: "green"}], caption: "중간층을 건너뛰고 필요한 곳이 바로 받는다"},
        { type: "h2", text: "Prop drilling 문제" },
        {
          type: "list",
          style: "flow",
          items: ["`App` 이 `theme` 을 가짐", "`Layout` → `Sidebar` → `Menu` 가 쓰지도 않으면서 전달만", "맨 아래 `Button` 이 겨우 사용"],
        },
        { type: "h2", text: "Provider 로 해결" },
        {
          type: "code",
          code: `const ThemeCtx = createContext<"light" | "dark">("light");

function App() {
  return (
    <ThemeCtx.Provider value="dark">
      <Layout />
    </ThemeCtx.Provider>
  );
}

function Button() {
  const theme = useContext(ThemeCtx); // 중간층을 건너뜀
  return <button className={theme}>OK</button>;
}`,
        },
        {
          type: "tip",
          kind: "warn",
          text: "Provider 의 `value` 가 바뀌면 그걸 쓰는 모든 컴포넌트가 다시 그려진다. 자주 바뀌는 값(입력 중인 글자)을 넣으면 느려진다.",
        },
        {
          type: "list",
          style: "check",
          items: ["전역에 가까운 값(테마·로그인 유저·언어)에 쓴다", "`createContext` → `Provider` → `useContext`", "자주 바뀌는 값은 Context 를 나누거나 상태 라이브러리로"],
        },
      ],
    },
    {
      id: "n-fe-1-8",
      emoji: "👻",
      title: "헤드리스 컴포넌트",
      summary: "동작과 접근성만 제공하고 모양은 하나도 정하지 않는 컴포넌트",
      blocks: [
        { type: "key", text: "뇌는 빌려주고 얼굴은 내가 그린다" },
        {type: "figure", kind: "stack", layers: [{icon: "🎨", label: "얼굴", sub: "내가: 색·크기·마크업", ink: "blue"}, {icon: "🧠", label: "뇌", sub: "라이브러리: 키보드·aria", ink: "red"}]},
        { type: "h2", text: "무엇을 나누나" },
        {
          type: "compare",
          cols: [
            { title: "라이브러리가 주는 것", items: ["열기·닫기·키보드 이동", "`aria-*` 속성, 포커스 관리"] },
            { title: "내가 정하는 것", items: ["색·크기·애니메이션", "마크업 구조와 클래스"] },
          ],
        },
        { type: "h2", text: "쓰는 모양" },
        {
          type: "code",
          code: `function Select() {
  const { isOpen, getToggleProps, getItemProps, selected } = useSelect(items);
  return (
    <div>
      <button {...getToggleProps()} className="rounded-xl border px-3">{selected}</button>
      {isOpen && items.map((it, i) => (
        <li key={it} {...getItemProps(it, i)} className="px-3 py-2">{it}</li>
      ))}
    </div>
  );
}`,
        },
        {
          type: "table",
          head: ["라이브러리", "특징"],
          rows: [
            ["Radix UI", "부품(Primitive) 컴포넌트 제공"],
            ["Headless UI", "Tailwind 팀이 만듦"],
            ["TanStack Table", "표 로직만, 마크업은 직접"],
          ],
        },
        {
          type: "list",
          style: "check",
          items: ["동작·접근성과 디자인을 분리", "디자인 시스템을 직접 만들 때 기반으로 쓴다", "`getXxxProps()` 를 요소에 펼쳐 붙이는 모양이 흔하다"],
        },
      ],
    },
    {
      id: "n-fe-1-9",
      emoji: "⚛️",
      title: "아토믹 디자인",
      summary: "UI 를 원자→분자→유기체→템플릿→페이지 다섯 단계로 쌓는 설계법",
      blocks: [
        { type: "key", text: "작은 조각을 쌓아 페이지를 만든다" },
        {type: "figure", kind: "stack", layers: [{icon: "📄", label: "페이지", sub: "실제 데이터"}, {icon: "📐", label: "템플릿", sub: "빈 뼈대"}, {icon: "🦠", label: "유기체", sub: "헤더"}, {icon: "🧪", label: "분자", sub: "검색창"}, {icon: "⚛️", label: "원자", sub: "버튼·입력", ink: "red"}], caption: "아래 작은 조각을 쌓아 위로 올라간다"},
        { type: "h2", text: "다섯 단계" },
        {
          type: "list",
          style: "flow",
          items: [
            "Atom 원자 — `Button`, `Input`, `Label`",
            "Molecule 분자 — 검색창 (`Input` + `Button`)",
            "Organism 유기체 — 헤더 (로고 + 검색창 + 메뉴)",
            "Template 템플릿 — 데이터 없는 페이지 뼈대",
            "Page 페이지 — 실제 데이터가 들어간 화면",
          ],
        },
        { type: "h2", text: "폴더 예시" },
        {
          type: "code",
          code: `components/
  atoms/      Button.tsx  Input.tsx
  molecules/  SearchBar.tsx
  organisms/  Header.tsx
  templates/  ListTemplate.tsx
pages/        ProductsPage.tsx`,
        },
        {
          type: "compare",
          cols: [
            { title: "좋은 점", tone: "good", items: ["재사용 단위가 분명", "디자이너와 같은 말을 씀"] },
            { title: "주의", tone: "bad", items: ["분자냐 유기체냐 분류 논쟁에 시간 낭비", "기능(도메인) 단위로는 찾기 어려움"] },
          ],
        },
        {
          type: "list",
          style: "check",
          items: ["원자 → 분자 → 유기체 → 템플릿 → 페이지", "작은 것일수록 데이터를 모른다", "분류가 애매하면 팀 규칙 하나로 정하고 넘어간다"],
        },
      ],
    },
  ],
};
