// 자바 단원 7 — 제네릭과 컬렉션 (시중 입문서 목차 기준). 작성 규칙은 ../python.ts 상단 주석.
import type { NoteUnit } from "../types";

export const JV7: NoteUnit = {
  id: "jv-7",
  title: "제네릭과 컬렉션",
  notes: [
    {
      id: "n-jv-7-1",
      emoji: "🏷️",
      title: "제네릭 기초 — 타입 파라미터와 다이아몬드 <>",
      summary: "상자에 '무엇을 담는지' 이름표를 붙여 꺼낼 때 형변환을 없앤다",
      blocks: [
        { type: "key", text: "상자에 '과일만' 이름표를 붙여 두면 꺼낼 때 확인할 필요가 없다" },
        {type: "figure", kind: "flow", nodes: [{icon: "📦", label: "`Box<T>`", sub: "타입 빈칸"}, {icon: "🏭", label: "`new Box<String>()`", ink: "blue"}, {icon: "🔤", label: "String 전용 상자", ink: "green"}], edges: ["쓸 때 정함", ""]},
        {
          type: "p",
          text: "제네릭(generic, 담을 타입을 꺾쇠 `<>` 로 정해 두는 문법)이 그 이름표다. 넣을 때 컴파일러가 검사하니 꺼낼 때는 안심하고 쓴다.",
        },
        { type: "h2", text: "이름표 없이 쓰면" },
        {
          type: "code",
          code: 'List list = new ArrayList();  // 이름표 없음 (raw 타입)\nlist.add("hello");\nlist.add(10);                 // 숫자도 그냥 들어간다\nString s = (String) list.get(1);  // 10 을 String 으로 우기다 실행 중 폭발',
          out: "Exception in thread \"main\" java.lang.ClassCastException: class java.lang.Integer cannot be cast to class java.lang.String (java.lang.Integer and java.lang.String are in module java.base of loader 'bootstrap')",
        },
        {
          type: "compare",
          cols: [
            { title: "이름표 없음 `List`", tone: "bad", items: ["뭐든 들어간다", "꺼낼 때마다 `(String)` 형변환", "실수는 실행해야 드러난다"] },
            { title: "이름표 있음 `List<String>`", tone: "good", items: ["String 만 들어간다", "형변환 없음", "실수는 컴파일 때 빨간 줄"] },
          ],
        },
        { type: "code", code: 'List<String> list = new ArrayList<>();\nlist.add("hello");\nlist.add(10);  // 컴파일 에러: int 는 String 이 아니다' },
        { type: "h2", text: "`<T>` 로 이름표 칸 직접 만들기" },
        {
          type: "p",
          text: "`T` 는 타입 파라미터(type parameter, '아직 안 정한 타입' 자리)다. 쓰는 쪽에서 `Box<String>` 처럼 채워 넣는다.",
        },
        {
          type: "code",
          code: 'class Box<T> {          // T 자리는 아직 비어 있다\n    private T item;\n    void set(T item) { this.item = item; }\n    T get() { return item; }\n}\n\nBox<String> b1 = new Box<>();  // 이 상자의 T 는 String\nb1.set("사과");\nString s = b1.get();  // 형변환 없음\nSystem.out.println(s);\n\nBox<Integer> b2 = new Box<>();  // 이 상자의 T 는 Integer\nb2.set(100);\nint n = b2.get();\nSystem.out.println(n + 1);',
          out: "사과\n101",
        },
        {
          type: "table",
          head: ["자주 쓰는 이름", "뜻"],
          rows: [
            ["`T`", "Type, 아무 타입"],
            ["`E`", "Element, 목록에 담긴 하나하나"],
            ["`K`, `V`", "Key·Value, Map 의 열쇠와 값"],
          ],
        },
        { type: "h2", text: "다이아몬드 `<>` 와 기본 타입" },
        {
          type: "compare",
          cols: [
            { title: "옛날 방식", items: ["`new ArrayList<String>()`", "양쪽에 타입을 두 번 쓴다"] },
            { title: "다이아몬드 (자바 7+)", tone: "good", items: ["`new ArrayList<>()`", "왼쪽 타입을 보고 알아서 채운다"] },
          ],
        },
        {
          type: "tip",
          kind: "warn",
          text: "`<int>` 는 안 된다. 이름표 칸에는 클래스만 들어간다. `int` 대신 `Integer`, `double` 대신 `Double` 같은 래퍼 클래스(기본 타입을 감싼 클래스)를 쓴다.",
        },
        {
          type: "list",
          style: "check",
          items: ["제네릭은 타입 실수를 실행 전(컴파일)에 잡는다", "`new ArrayList<>()` 의 `<>` 는 왼쪽 타입을 따라간다", "`<int>` 불가, `<Integer>` 로"],
        },
      ],
    },
    {
      id: "n-jv-7-2",
      emoji: "🗺️",
      title: "컬렉션 프레임워크 지도 — List / Set / Map",
      summary: "순서 있는 줄(List), 중복 없는 주머니(Set), 이름표 사물함(Map)",
      blocks: [
        { type: "key", text: "자료를 담는 그릇은 줄, 주머니, 사물함 세 가지다" },
        {type: "figure", kind: "tree", root: {icon: "🗃️", label: "컬렉션"}, children: [{icon: "📋", label: "`List`", sub: "순서 O, 중복 O", leaves: ["`ArrayList`"]}, {icon: "🎯", label: "`Set`", sub: "중복 X", ink: "blue", leaves: ["`HashSet`"]}, {icon: "🗄️", label: "`Map`", sub: "키 → 값", ink: "green", leaves: ["`HashMap`"]}]},
        {
          type: "compare",
          cols: [
            { title: "`List` = 줄 서기", items: ["번호표(인덱스) 순서대로 선다", "같은 사람이 두 번 서도 된다"] },
            { title: "`Set` = 구슬 주머니", items: ["순서 없이 섞여 있다", "같은 구슬은 하나만 남는다"] },
            { title: "`Map` = 이름표 사물함", items: ["이름표(키)로 칸을 연다", "같은 이름표는 하나뿐"] },
          ],
        },
        {
          type: "p",
          text: "자바는 이런 그릇들을 컬렉션(collection, 여러 값을 담는 자료구조 묶음)이라 부른다. 파이썬의 `list`·`set`·`dict` 와 같은 역할이다.",
        },
        { type: "h2", text: "족보: 누가 누구 밑에 있나" },
        {
          type: "list",
          style: "flow",
          items: [
            "`Iterable` : for-each 로 돌 수 있다",
            "`Collection` : add·remove·size·contains 공통 기능",
            "`List` (순서 O, 중복 O) / `Set` (순서 X, 중복 X)",
            "실제로 쓰는 클래스: `ArrayList`·`LinkedList` / `HashSet`·`TreeSet`",
          ],
        },
        {
          type: "tip",
          kind: "warn",
          text: "`Map` 은 `Collection` 밑에 있지 않다. 값 하나가 아니라 키·값 한 쌍을 담는 별도 계열이다. 쓰는 클래스는 `HashMap`·`TreeMap`.",
        },
        { type: "h2", text: "세 갈래 비교" },
        {
          type: "table",
          head: ["종류", "순서", "중복", "파이썬 짝", "대표 클래스"],
          rows: [
            ["`List`", "O (인덱스)", "허용", "`list`", "`ArrayList`"],
            ["`Set`", "X", "불가", "`set`", "`HashSet`"],
            ["`Map`", "X", "키는 불가", "`dict`", "`HashMap`"],
          ],
        },
        {
          type: "code",
          code: 'List<String> list = new ArrayList<>();\nlist.add("b"); list.add("a"); list.add("b");  // b 가 두 번 들어간다\n\nSet<String> set = new HashSet<>();\nset.add("b"); set.add("a"); set.add("b");     // 두 번째 b 는 무시\n\nMap<String, Integer> map = new HashMap<>();\nmap.put("b", 1); map.put("a", 2); map.put("b", 3);  // b 의 값이 3 으로 덮인다\n\nSystem.out.println(list);\nSystem.out.println(set);\nSystem.out.println(map);',
          out: "[b, a, b]\n[a, b]\n{a=2, b=3}",
        },
        {
          type: "tip",
          kind: "memo",
          text: "Set 과 Map 의 출력 순서는 넣은 순서가 아니다. 여기선 우연히 a, b 순으로 나왔을 뿐 보장되지 않는다.",
        },
        { type: "h2", text: "변수 타입은 인터페이스로" },
        {
          type: "compare",
          cols: [
            { title: "`List<String> a = new ArrayList<>();`", tone: "good", items: ["나중에 `LinkedList` 로 바꿔도 오른쪽만 고친다", "보통 이렇게 쓴다"] },
            { title: "`ArrayList<String> a = new ArrayList<>();`", items: ["틀린 건 아니다", "특정 클래스에 묶여 바꾸기 번거롭다"] },
          ],
        },
        {
          type: "list",
          style: "check",
          items: ["List 순서·중복 O, Set 중복 X, Map 키·값 쌍", "Map 은 Collection 계열이 아니다", "변수 타입은 `List`·`Set`·`Map` 으로 선언"],
        },
      ],
    },
    {
      id: "n-jv-7-3",
      emoji: "📋",
      title: "List — ArrayList vs LinkedList, 주요 메서드",
      summary: "파이썬 list 와 가장 닮은 ArrayList, 메서드 이름만 다르다",
      blocks: [
        { type: "key", text: "번호표 순서대로 줄 세워 두는 그릇. 파이썬 list, JS 배열과 같은 역할" },
        {type: "figure", kind: "tree", root: {icon: "📋", label: "`List`"}, children: [{icon: "🚃", label: "`ArrayList`", sub: "번호로 바로 찾기 빠름", ink: "green"}, {icon: "🔗", label: "`LinkedList`", sub: "앞뒤 넣고 빼기 빠름", ink: "blue"}]},
        { type: "h2", text: "주요 메서드" },
        {
          type: "table",
          head: ["자바 `List`", "파이썬 `list`", "하는 일"],
          rows: [
            ["`add(x)`", "`append(x)`", "맨 뒤에 추가"],
            ["`add(i, x)`", "`insert(i, x)`", "i 번째에 끼워 넣기"],
            ["`get(i)`", "`a[i]`", "i 번째 꺼내기"],
            ["`set(i, x)`", "`a[i] = x`", "i 번째 바꾸기"],
            ["`remove(i)` / `remove(x)`", "`pop(i)` / `remove(x)`", "번호로 / 값으로 삭제"],
            ["`size()`", "`len(a)`", "개수"],
            ["`contains(x)` / `indexOf(x)`", "`x in a` / `a.index(x)`", "있나 / 몇 번째"],
          ],
        },
        {
          type: "code",
          code: 'List<String> fruits = new ArrayList<>();\nfruits.add("사과");\nfruits.add("바나나");\nfruits.add(1, "딸기");  // 1번 자리에 끼우면 바나나는 뒤로 밀린다\nSystem.out.println(fruits);\nSystem.out.println(fruits.get(0));\nSystem.out.println(fruits.size());\n\nfruits.set(0, "포도");  // 0번을 포도로 교체\nSystem.out.println(fruits);\nSystem.out.println(fruits.contains("바나나"));\nSystem.out.println(fruits.indexOf("바나나"));\n\nfruits.remove("딸기");\nSystem.out.println(fruits);',
          out: "[사과, 딸기, 바나나]\n사과\n3\n[포도, 딸기, 바나나]\ntrue\n2\n[포도, 바나나]",
        },
        { type: "h2", text: "`remove` 함정: 번호냐 값이냐" },
        {
          type: "code",
          code: "List<Integer> nums = new ArrayList<>(List.of(10, 20, 30));\nnums.remove(1);                   // 1번 칸(20) 삭제\nSystem.out.println(nums);\nnums.remove(Integer.valueOf(10)); // 값 10 삭제\nSystem.out.println(nums);",
          out: "[10, 30]\n[30]",
        },
        {
          type: "tip",
          kind: "warn",
          text: "`List<Integer>` 에서 `remove(1)` 은 값 1이 아니라 1번 칸을 지운다. 값으로 지우려면 `Integer.valueOf(1)` 로 감싼다.",
        },
        { type: "h2", text: "ArrayList vs LinkedList" },
        {
          type: "compare",
          cols: [
            { title: "`ArrayList` = 붙어 있는 사물함 칸", tone: "good", items: ["`get(5)` 는 5번 칸으로 바로 간다", "중간에 끼우면 뒤 칸을 전부 한 칸씩 민다", "대부분 이걸 쓴다"] },
            { title: "`LinkedList` = 손잡은 사람들의 줄", items: ["`get(5)` 는 앞에서부터 세어 간다", "앞·중간에 끼우기는 손만 바꿔 잡으면 된다", "큐(줄 서서 차례 기다리기) 용도로 가끔"] },
          ],
        },
        {
          type: "tip",
          kind: "warn",
          text: "`List.of(...)` 로 만든 리스트는 읽기 전용이다. `add` 하면 `UnsupportedOperationException`. 바꿀 거면 `new ArrayList<>(List.of(...))` 로 복사한다.",
        },
        {
          type: "list",
          style: "check",
          items: ["`add` `get` `set` `remove` `size` 가 기본 5종", "`List<Integer>` 의 `remove(1)` 은 1번 칸 삭제", "고민되면 `ArrayList`"],
        },
      ],
    },
    {
      id: "n-jv-7-4",
      emoji: "🎒",
      title: "Set — HashSet·TreeSet과 중복 판단",
      summary: "같은 객체인지는 equals 와 hashCode 두 개로 판단한다",
      blocks: [
        { type: "key", text: "같은 건 두 번 안 담는 주머니. 무엇이 '같은지'는 내가 정해 줘야 한다" },
        {type: "figure", kind: "flow", nodes: [{icon: "🧮", label: "`hashCode()`", sub: "같은 칸?"}, {icon: "🟰", label: "`equals()`", sub: "내용 같나?", ink: "blue"}, {icon: "🚫", label: "중복 → 버림", ink: "red"}], edges: ["같으면", "같으면"]},
        { type: "h2", text: "HashSet vs TreeSet" },
        {
          type: "code",
          code: 'Set<String> hash = new HashSet<>(List.of("banana", "apple", "cherry", "apple"));\nSet<String> tree = new TreeSet<>(List.of("banana", "apple", "cherry", "apple"));\nSystem.out.println(hash);  // apple 은 한 번만\nSystem.out.println(tree);  // 알파벳순으로 정렬돼 있다\nSystem.out.println(hash.add("apple"));  // 이미 있어서 false\nSystem.out.println(hash.size());',
          out: "[banana, apple, cherry]\n[apple, banana, cherry]\nfalse\n3",
        },
        {
          type: "compare",
          cols: [
            { title: "`HashSet`", items: ["해시(값으로 계산한 칸 번호)로 자리를 정한다", "가장 빠르다", "순서 보장 없음 (위 출력도 우연)"] },
            { title: "`TreeSet`", items: ["넣을 때마다 정렬해 둔다", "항상 오름차순", "조금 느리다"] },
          ],
        },
        { type: "p", text: "`add` 는 새로 들어가면 true, 이미 있으면 false 를 돌려준다." },
        { type: "h2", text: "직접 만든 클래스는 중복이 안 걸러진다" },
        {
          type: "code",
          code: 'class Member {\n    String name; int age;\n    Member(String name, int age) { this.name = name; this.age = age; }\n}\n\nSet<Member> set = new HashSet<>();\nset.add(new Member("홍길동", 30));\nset.add(new Member("홍길동", 30));  // 내용은 같아도 다른 객체\nSystem.out.println(set.size());',
          out: "2",
        },
        { type: "p", text: "기본 `equals` 는 '같은 객체(같은 메모리 주소)냐'만 본다. `new` 를 두 번 했으니 내용이 같아도 다른 객체다." },
        { type: "h2", text: "equals 와 hashCode 를 함께 재정의" },
        {
          type: "tip",
          kind: "analogy",
          text: "신발장에 신발 넣기. `hashCode` 는 '몇 번 칸이냐'를 정하고, `equals` 는 그 칸 안의 신발과 짝이 맞는지 하나씩 대 본다.",
        },
        {
          type: "list",
          style: "flow",
          items: ["`hashCode()` 로 들어갈 칸 번호를 찾는다", "같은 칸에 이미 있는 것과 `equals()` 로 비교", "true 면 중복이라 안 넣는다"],
        },
        {
          type: "code",
          code: '@Override\npublic boolean equals(Object o) {\n    if (!(o instanceof Member m)) return false;  // Member 가 아니면 다르다\n    return name.equals(m.name) && age == m.age;  // 이름·나이가 같으면 같다\n}\n\n@Override\npublic int hashCode() { return Objects.hash(name, age); }  // 같은 내용이면 같은 칸 번호\n\n// 위 두 메서드를 Member 에 넣고 다시 실행\nSystem.out.println(set.size());',
          out: "1",
        },
        {
          type: "tip",
          kind: "warn",
          text: "`equals` 만 고치고 `hashCode` 를 빼먹으면 칸 번호가 달라 비교까지 가지도 못한다. 둘은 항상 세트로 재정의한다.",
        },
        {
          type: "tip",
          kind: "memo",
          text: "`record Point(int x, int y) {}` 처럼 record 로 만들면 `equals`·`hashCode` 가 자동으로 생긴다. 파이썬에서 set 에 넣으려면 hashable 해야 하는 것과 같은 이야기다.",
        },
        {
          type: "list",
          style: "check",
          items: ["`HashSet` 빠르고 순서 없음, `TreeSet` 정렬됨", "중복 판단 = `hashCode` 로 칸 찾고 `equals` 로 비교", "둘은 반드시 함께 재정의"],
        },
      ],
    },
    {
      id: "n-jv-7-5",
      emoji: "🗝️",
      title: "Map — HashMap 주요 메서드와 순회",
      summary: "파이썬 dict 의 자바판, d[k] 대신 get·put 을 쓴다",
      blocks: [
        { type: "key", text: "이름으로 번호를 찾는 전화번호부. 파이썬 `dict`, JS 객체와 같은 역할" },
        {type: "figure", kind: "flow", nodes: [{icon: "🏷️", label: "키 `\"apple\"`"}, {icon: "🗄️", label: "`HashMap`", ink: "blue"}, {icon: "🎁", label: "값 `3`", ink: "green"}], edges: ["`get`", ""]},
        { type: "h2", text: "주요 메서드" },
        {
          type: "table",
          head: ["자바 `Map`", "파이썬 `dict`", "하는 일"],
          rows: [
            ["`put(k, v)`", "`d[k] = v`", "넣기·덮어쓰기. 덮기 전 값을 돌려준다"],
            ["`get(k)`", "`d.get(k)`", "꺼내기. 없으면 `null`"],
            ["`getOrDefault(k, v)`", "`d.get(k, v)`", "없으면 기본값 v"],
            ["`containsKey(k)`", "`k in d`", "키가 있나"],
            ["`remove(k)`", "`d.pop(k)`", "삭제"],
            ["`size()`", "`len(d)`", "쌍의 개수"],
          ],
        },
        {
          type: "code",
          code: 'Map<String, Integer> scores = new HashMap<>();\nscores.put("철수", 85);\nscores.put("영희", 92);\nSystem.out.println(scores.put("철수", 90));  // 90 으로 덮고, 덮기 전 값 85 를 돌려준다\nSystem.out.println(scores.get("철수"));\nSystem.out.println(scores.get("민수"));     // 없는 키라 null\nSystem.out.println(scores.getOrDefault("민수", 0));\nSystem.out.println(scores.containsKey("영희"));\nSystem.out.println(scores.size());\n\nscores.remove("영희");\nSystem.out.println(scores);',
          out: "85\n90\nnull\n0\ntrue\n2\n{철수=90}",
        },
        {
          type: "compare",
          cols: [
            { title: "파이썬 `d['민수']`", tone: "bad", items: ["없는 키면 바로 KeyError"] },
            { title: "자바 `get(\"민수\")`", items: ["에러 없이 `null`", "그대로 `int` 에 담으면 NullPointerException (null 을 쓰려다 나는 에러)"] },
          ],
        },
        { type: "h2", text: "순회: entrySet 으로 키·값 함께" },
        {
          type: "code",
          code: 'Map<String, Integer> scores = new HashMap<>();\nscores.put("철수", 90);\nscores.put("영희", 92);\nscores.put("민수", 78);\n\nfor (Map.Entry<String, Integer> e : scores.entrySet()) {  // e 하나 = 키·값 한 쌍\n    System.out.println(e.getKey() + " " + e.getValue());\n}\nfor (String name : scores.keySet()) {  // 키만 돈다\n    System.out.println(name);\n}',
          out: "철수 90\n영희 92\n민수 78\n철수\n영희\n민수",
        },
        {
          type: "table",
          head: ["자바", "파이썬"],
          rows: [
            ["`entrySet()`", "`items()`"],
            ["`keySet()`", "`keys()`"],
            ["`values()`", "`values()`"],
          ],
        },
        {
          type: "tip",
          kind: "warn",
          text: "위 출력이 넣은 순서와 같은 건 우연이다. `HashMap` 은 순서를 보장하지 않는다. 넣은 순서가 필요하면 `LinkedHashMap`, 키 정렬이 필요하면 `TreeMap`.",
        },
        { type: "h2", text: "단어 세기 패턴" },
        {
          type: "code",
          code: 'String[] words = {"a", "b", "a", "c", "a", "b"};\nMap<String, Integer> count = new TreeMap<>();  // TreeMap 이라 키가 정렬돼 나온다\nfor (String w : words) {\n    count.put(w, count.getOrDefault(w, 0) + 1);  // 지금 개수(없으면 0)에 1 더하기\n}\nSystem.out.println(count);',
          out: "{a=3, b=2, c=1}",
        },
        {
          type: "list",
          style: "check",
          items: ["`put` 넣기, `get` 없으면 `null`, `getOrDefault` 로 안전하게", "키·값 함께 돌 땐 `entrySet()`", "`HashMap` 순서 보장 X, 필요하면 `LinkedHashMap`·`TreeMap`"],
        },
      ],
    },
    {
      id: "n-jv-7-6",
      emoji: "🔢",
      title: "Iterator와 정렬 — Comparable vs Comparator",
      summary: "돌면서 지울 땐 Iterator, 정렬 기준은 Comparable·Comparator",
      blocks: [
        { type: "key", text: "줄 세우는 기준은 두 가지. 타고난 기본 순서와 그때그때 정하는 순서" },
        {type: "figure", kind: "tree", root: {icon: "🔃", label: "정렬 기준"}, children: [{icon: "🏠", label: "`Comparable`", sub: "클래스 안에 기본 기준", ink: "blue", leaves: ["`compareTo`"]}, {icon: "🧩", label: "`Comparator`", sub: "밖에서 그때그때", ink: "green", leaves: ["`compare`"]}]},
        { type: "h2", text: "Iterator: 돌면서 안전하게 지우기" },
        {
          type: "p",
          text: "Iterator(반복자)는 목록을 한 칸씩 짚어 가는 손가락이다. 손가락으로 짚은 칸을 지우면 순회가 꼬이지 않는다.",
        },
        {
          type: "code",
          code: "List<Integer> nums = new ArrayList<>(List.of(1, 2, 3, 4, 5));\nIterator<Integer> it = nums.iterator();\nwhile (it.hasNext()) {     // 다음 칸이 있으면\n    int n = it.next();     // 한 칸 앞으로 가서 값을 꺼낸다\n    if (n % 2 == 0) it.remove();  // 방금 짚은 칸을 지운다\n}\nSystem.out.println(nums);",
          out: "[1, 3, 5]",
        },
        {
          type: "code",
          code: "List<Integer> nums = new ArrayList<>(List.of(1, 2, 3, 4, 5));\nfor (Integer n : nums) {\n    if (n == 2) nums.remove(n);  // for-each 안에서 직접 삭제\n}",
          out: 'Exception in thread "main" java.util.ConcurrentModificationException',
        },
        {
          type: "tip",
          kind: "warn",
          text: "for-each 도중에 리스트를 직접 고치면 `ConcurrentModificationException`(도는 중에 바뀌었다는 에러). 지울 땐 `it.remove()` 나 `nums.removeIf(n -> n % 2 == 0)` 를 쓴다.",
        },
        { type: "h2", text: "기본 정렬: Collections.sort / List.sort" },
        {
          type: "code",
          code: 'List<String> names = new ArrayList<>(List.of("banana", "kiwi", "apple"));\nCollections.sort(names);                 // 알파벳순\nSystem.out.println(names);\nnames.sort(Comparator.reverseOrder());   // 거꾸로\nSystem.out.println(names);\nnames.sort(Comparator.comparing(String::length));  // 글자 수 순\nSystem.out.println(names);',
          out: "[apple, banana, kiwi]\n[kiwi, banana, apple]\n[kiwi, apple, banana]",
        },
        {
          type: "tip",
          kind: "memo",
          text: "파이썬 `a.sort(key=len)` 이 자바에선 `a.sort(Comparator.comparing(String::length))`. 길이 4·5·6 순으로 kiwi, apple, banana.",
        },
        { type: "h2", text: "Comparable vs Comparator" },
        {
          type: "compare",
          cols: [
            { title: "`Comparable` = 출석번호", items: ["클래스 안에 `compareTo` 하나를 적는다", "그 클래스의 '기본 순서'", "`Collections.sort(list)` 가 이걸 쓴다"] },
            { title: "`Comparator` = 오늘의 줄 서기 규칙", items: ["클래스 밖에서 기준을 따로 만든다", "키순·이름순 등 여러 개 가능", "`list.sort(기준)` 에 넘긴다"] },
          ],
        },
        {
          type: "code",
          code: 'class Student implements Comparable<Student> {\n    String name; int score;\n    // 생성자 생략, toString 은 "이름:점수"\n    @Override\n    public int compareTo(Student o) { return Integer.compare(score, o.score); }  // 점수 작은 쪽이 앞\n}\n\nList<Student> list = new ArrayList<>(List.of(\n    new Student("철수", 85), new Student("영희", 92), new Student("민수", 78)));\n\nCollections.sort(list);  // 기본: 점수 오름차순\nSystem.out.println(list);\nlist.sort(Comparator.comparing((Student s) -> s.name));  // 이름순\nSystem.out.println(list);\nlist.sort(Comparator.comparingInt((Student s) -> s.score).reversed());  // 점수 내림차순\nSystem.out.println(list);',
          out: "[민수:78, 철수:85, 영희:92]\n[민수:78, 영희:92, 철수:85]\n[영희:92, 철수:85, 민수:78]",
        },
        {
          type: "table",
          head: ["`compareTo` 결과", "뜻"],
          rows: [
            ["음수", "내가 앞"],
            ["0", "같음"],
            ["양수", "내가 뒤"],
          ],
        },
        {
          type: "list",
          style: "check",
          items: ["돌면서 지우기는 `it.remove()` 또는 `removeIf`", "`Comparable` = 기본 순서, `Comparator` = 바꿔 끼우는 기준", "`reversed()` 로 내림차순"],
        },
      ],
    },
  ],
};
