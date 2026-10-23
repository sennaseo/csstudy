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
        { type: "key", text: "제네릭 = 클래스를 만들 때가 아니라 쓸 때 타입을 정한다" },
        {
          type: "tip",
          kind: "analogy",
          text: "'과일 전용' 이름표가 붙은 상자. 넣을 때 컴파일러가 검사하니 꺼낼 때 '이거 과일 맞나?' 확인할 필요가 없다.",
        },
        { type: "h2", text: "제네릭 없이 쓰면" },
        {
          type: "code",
          code: 'List list = new ArrayList();  // 타입 이름표 없음 (raw 타입)\nlist.add("hello");\nlist.add(10);                 // 아무거나 들어간다\nString s = (String) list.get(1);  // 형변환 필요 + 실행 중 폭발',
          out: "Exception in thread \"main\" java.lang.ClassCastException: class java.lang.Integer cannot be cast to class java.lang.String (java.lang.Integer and java.lang.String are in module java.base of loader 'bootstrap')",
        },
        {
          type: "compare",
          cols: [
            { title: "raw 타입 `List`", tone: "bad", items: ["뭐든 들어간다", "꺼낼 때마다 형변환", "실수는 실행해야 드러난다"] },
            { title: "제네릭 `List<String>`", tone: "good", items: ["String 만 들어간다", "형변환 없음", "실수는 컴파일 때 빨간 줄"] },
          ],
        },
        { type: "code", code: 'List<String> list = new ArrayList<>();\nlist.add("hello");\nlist.add(10);  // 컴파일 에러: int 는 String 이 아니다' },
        { type: "h2", text: "타입 파라미터 `<T>` 로 직접 만들기" },
        {
          type: "code",
          code: 'class Box<T> {\n    private T item;\n    void set(T item) { this.item = item; }\n    T get() { return item; }\n}\n\nBox<String> b1 = new Box<>();\nb1.set("사과");\nString s = b1.get();  // 형변환 없음\nSystem.out.println(s);\n\nBox<Integer> b2 = new Box<>();\nb2.set(100);\nint n = b2.get();\nSystem.out.println(n + 1);',
          out: "사과\n101",
        },
        {
          type: "table",
          head: ["관례 이름", "뜻"],
          rows: [
            ["`T`", "Type"],
            ["`E`", "Element (컬렉션 요소)"],
            ["`K`, `V`", "Key, Value (Map)"],
          ],
        },
        { type: "h2", text: "다이아몬드 `<>` 와 기본 타입" },
        {
          type: "compare",
          cols: [
            { title: "옛날 방식", items: ["`new ArrayList<String>()`", "양쪽에 타입을 두 번 쓴다"] },
            { title: "다이아몬드 (자바 7+)", tone: "good", items: ["`new ArrayList<>()`", "왼쪽 타입을 보고 추론한다"] },
          ],
        },
        {
          type: "tip",
          kind: "warn",
          text: "`<int>` 는 안 된다. 타입 파라미터에는 클래스만 들어간다. `int` 대신 `Integer`, `double` 대신 `Double` 같은 래퍼 클래스를 쓴다.",
        },
        {
          type: "list",
          style: "check",
          items: ["제네릭은 타입 실수를 실행 전(컴파일)에 잡는다", "`new ArrayList<>()` 의 `<>` 는 왼쪽 타입을 추론", "`<int>` 불가, `<Integer>` 로"],
        },
      ],
    },
    {
      id: "n-jv-7-2",
      emoji: "🗺️",
      title: "컬렉션 프레임워크 지도 — List / Set / Map",
      summary: "순서 있는 줄(List), 중복 없는 주머니(Set), 이름표 사물함(Map)",
      blocks: [
        { type: "key", text: "자료를 담는 그릇은 List·Set·Map 세 갈래" },
        { type: "h2", text: "인터페이스 계층" },
        {
          type: "list",
          style: "flow",
          items: [
            "`Iterable` : for-each 로 돌 수 있다",
            "`Collection` : add·remove·size·contains 공통 기능",
            "`List` (순서 O, 중복 O) / `Set` (순서 X, 중복 X)",
            "구현 클래스: `ArrayList`·`LinkedList` / `HashSet`·`TreeSet`",
          ],
        },
        {
          type: "tip",
          kind: "warn",
          text: "`Map` 은 `Collection` 밑에 있지 않다. 요소 하나가 아니라 키·값 한 쌍을 담는 별도 계열이다. 구현은 `HashMap`·`TreeMap`.",
        },
        { type: "h2", text: "세 갈래 비교" },
        {
          type: "table",
          head: ["종류", "순서", "중복", "파이썬 짝", "대표 구현"],
          rows: [
            ["`List`", "O (인덱스)", "허용", "`list`", "`ArrayList`"],
            ["`Set`", "X", "불가", "`set`", "`HashSet`"],
            ["`Map`", "X", "키는 불가", "`dict`", "`HashMap`"],
          ],
        },
        {
          type: "code",
          code: 'List<String> list = new ArrayList<>();\nlist.add("b"); list.add("a"); list.add("b");\n\nSet<String> set = new HashSet<>();\nset.add("b"); set.add("a"); set.add("b");\n\nMap<String, Integer> map = new HashMap<>();\nmap.put("b", 1); map.put("a", 2); map.put("b", 3);\n\nSystem.out.println(list);\nSystem.out.println(set);\nSystem.out.println(map);',
          out: "[b, a, b]\n[a, b]\n{a=2, b=3}",
        },
        {
          type: "tip",
          kind: "memo",
          text: "Set 과 Map 의 출력 순서는 넣은 순서가 아니다. 여기선 우연히 a, b 순으로 나왔을 뿐 보장되지 않는다. 같은 키 b 는 나중 값 3 으로 덮였다.",
        },
        { type: "h2", text: "변수 타입은 인터페이스로" },
        {
          type: "compare",
          cols: [
            { title: "`List<String> a = new ArrayList<>();`", tone: "good", items: ["나중에 `LinkedList` 로 바꿔도 오른쪽만 고친다", "보통 이렇게 쓴다"] },
            { title: "`ArrayList<String> a = new ArrayList<>();`", items: ["틀린 건 아니다", "구현에 묶여 바꾸기 번거롭다"] },
          ],
        },
        {
          type: "list",
          style: "check",
          items: ["List 순서·중복 O, Set 중복 X, Map 키·값 쌍", "Map 은 Collection 계열이 아니다", "변수 타입은 `List`·`Set`·`Map` 인터페이스로 선언"],
        },
      ],
    },
    {
      id: "n-jv-7-3",
      emoji: "📋",
      title: "List — ArrayList vs LinkedList, 주요 메서드",
      summary: "파이썬 list 와 가장 닮은 ArrayList, 메서드 이름만 다르다",
      blocks: [
        { type: "key", text: "번호(인덱스)로 쓰는 줄 서기 = `ArrayList`" },
        { type: "h2", text: "주요 메서드" },
        {
          type: "table",
          head: ["자바 `List`", "파이썬 `list`", "설명"],
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
          code: 'List<String> fruits = new ArrayList<>();\nfruits.add("사과");\nfruits.add("바나나");\nfruits.add(1, "딸기");\nSystem.out.println(fruits);\nSystem.out.println(fruits.get(0));\nSystem.out.println(fruits.size());\n\nfruits.set(0, "포도");\nSystem.out.println(fruits);\nSystem.out.println(fruits.contains("바나나"));\nSystem.out.println(fruits.indexOf("바나나"));\n\nfruits.remove("딸기");\nSystem.out.println(fruits);',
          out: "[사과, 딸기, 바나나]\n사과\n3\n[포도, 딸기, 바나나]\ntrue\n2\n[포도, 바나나]",
        },
        { type: "h2", text: "`remove` 함정: 번호냐 값이냐" },
        {
          type: "code",
          code: "List<Integer> nums = new ArrayList<>(List.of(10, 20, 30));\nnums.remove(1);                   // 1번 칸 삭제\nSystem.out.println(nums);\nnums.remove(Integer.valueOf(10)); // 값 10 삭제\nSystem.out.println(nums);",
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
            { title: "`ArrayList`", tone: "good", items: ["칸이 붙어 있는 배열", "`get(i)` 바로 찾는다", "중간 삽입·삭제는 뒤 칸을 다 민다", "대부분 이걸 쓴다"] },
            { title: "`LinkedList`", items: ["손잡은 사람들의 줄", "`get(i)` 앞에서부터 세어 간다", "앞·중간 삽입·삭제가 싸다", "큐·덱 용도로 가끔"] },
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
        { type: "key", text: "Set 은 중복을 거른다. '같다'의 기준은 `equals` + `hashCode`" },
        { type: "h2", text: "HashSet vs TreeSet" },
        {
          type: "code",
          code: 'Set<String> hash = new HashSet<>(List.of("banana", "apple", "cherry", "apple"));\nSet<String> tree = new TreeSet<>(List.of("banana", "apple", "cherry", "apple"));\nSystem.out.println(hash);\nSystem.out.println(tree);\nSystem.out.println(hash.add("apple"));  // 이미 있음\nSystem.out.println(hash.size());',
          out: "[banana, apple, cherry]\n[apple, banana, cherry]\nfalse\n3",
        },
        {
          type: "compare",
          cols: [
            { title: "`HashSet`", items: ["해시 테이블에 저장", "가장 빠르다", "순서 보장 없음 (위 출력도 우연)"] },
            { title: "`TreeSet`", items: ["정렬된 나무에 저장", "항상 오름차순", "조금 느리다"] },
          ],
        },
        { type: "p", text: "`add` 는 새로 들어가면 true, 이미 있으면 false 를 돌려준다." },
        { type: "h2", text: "직접 만든 클래스는 중복이 안 걸러진다" },
        {
          type: "code",
          code: 'class Member {\n    String name; int age;\n    Member(String name, int age) { this.name = name; this.age = age; }\n}\n\nSet<Member> set = new HashSet<>();\nset.add(new Member("홍길동", 30));\nset.add(new Member("홍길동", 30));\nSystem.out.println(set.size());',
          out: "2",
        },
        { type: "p", text: "기본 `equals` 는 '같은 객체(주소)냐'만 본다. `new` 를 두 번 했으니 내용이 같아도 다른 객체다." },
        { type: "h2", text: "equals 와 hashCode 를 함께 재정의" },
        {
          type: "list",
          style: "flow",
          items: ["`hashCode()` 로 들어갈 칸 번호를 찾는다", "같은 칸에 이미 있는 것과 `equals()` 로 비교", "true 면 중복이라 안 넣는다"],
        },
        {
          type: "code",
          code: '@Override\npublic boolean equals(Object o) {\n    if (!(o instanceof Member m)) return false;\n    return name.equals(m.name) && age == m.age;\n}\n\n@Override\npublic int hashCode() { return Objects.hash(name, age); }\n\n// 위 두 메서드를 Member 에 넣고 다시 실행\nSystem.out.println(set.size());',
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
          text: "`record Point(int x, int y) {}` 처럼 record 로 만들면 `equals`·`hashCode` 가 자동으로 생긴다. 파이썬의 hashable 과 같은 이야기.",
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
        { type: "key", text: "`HashMap` = 키로 값을 찾는 사물함, 파이썬 `dict` 와 같은 역할" },
        { type: "h2", text: "주요 메서드" },
        {
          type: "table",
          head: ["자바 `Map`", "파이썬 `dict`", "설명"],
          rows: [
            ["`put(k, v)`", "`d[k] = v`", "넣기·덮어쓰기. 이전 값을 돌려준다"],
            ["`get(k)`", "`d.get(k)`", "없으면 `null`"],
            ["`getOrDefault(k, v)`", "`d.get(k, v)`", "없으면 기본값 v"],
            ["`containsKey(k)`", "`k in d`", "키가 있나"],
            ["`remove(k)`", "`d.pop(k)`", "삭제"],
            ["`size()`", "`len(d)`", "쌍의 개수"],
          ],
        },
        {
          type: "code",
          code: 'Map<String, Integer> scores = new HashMap<>();\nscores.put("철수", 85);\nscores.put("영희", 92);\nSystem.out.println(scores.put("철수", 90));  // 이전 값\nSystem.out.println(scores.get("철수"));\nSystem.out.println(scores.get("민수"));\nSystem.out.println(scores.getOrDefault("민수", 0));\nSystem.out.println(scores.containsKey("영희"));\nSystem.out.println(scores.size());\n\nscores.remove("영희");\nSystem.out.println(scores);',
          out: "85\n90\nnull\n0\ntrue\n2\n{철수=90}",
        },
        {
          type: "compare",
          cols: [
            { title: "파이썬 `d['민수']`", tone: "bad", items: ["없는 키면 KeyError"] },
            { title: "자바 `get(\"민수\")`", items: ["에러 없이 `null`", "그대로 `int` 에 담으면 NullPointerException"] },
          ],
        },
        { type: "h2", text: "순회: entrySet 으로 키·값 함께" },
        {
          type: "code",
          code: 'Map<String, Integer> scores = new HashMap<>();\nscores.put("철수", 90);\nscores.put("영희", 92);\nscores.put("민수", 78);\n\nfor (Map.Entry<String, Integer> e : scores.entrySet()) {\n    System.out.println(e.getKey() + " " + e.getValue());\n}\nfor (String name : scores.keySet()) {\n    System.out.println(name);\n}',
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
          text: "위 출력은 철수·영희·민수를 넣은 뒤 돌린 결과다. 넣은 순서와 같게 나왔지만 우연이다. `HashMap` 은 순서를 보장하지 않는다. 넣은 순서가 필요하면 `LinkedHashMap`, 키 정렬이 필요하면 `TreeMap`.",
        },
        { type: "h2", text: "단어 세기 패턴" },
        {
          type: "code",
          code: 'String[] words = {"a", "b", "a", "c", "a", "b"};\nMap<String, Integer> count = new TreeMap<>();\nfor (String w : words) {\n    count.put(w, count.getOrDefault(w, 0) + 1);\n}\nSystem.out.println(count);',
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
        { type: "key", text: "기본 정렬 기준은 `Comparable`, 그때그때 바꾸는 기준은 `Comparator`" },
        { type: "h2", text: "Iterator: 돌면서 안전하게 지우기" },
        {
          type: "code",
          code: "List<Integer> nums = new ArrayList<>(List.of(1, 2, 3, 4, 5));\nIterator<Integer> it = nums.iterator();\nwhile (it.hasNext()) {\n    int n = it.next();\n    if (n % 2 == 0) it.remove();\n}\nSystem.out.println(nums);",
          out: "[1, 3, 5]",
        },
        {
          type: "code",
          code: "for (Integer n : nums) {\n    if (n == 2) nums.remove(n);  // for-each 안에서 직접 삭제\n}",
          out: 'Exception in thread "main" java.util.ConcurrentModificationException',
        },
        {
          type: "tip",
          kind: "warn",
          text: "for-each 도중에 리스트를 직접 고치면 `ConcurrentModificationException`. 지울 땐 `it.remove()` 나 `nums.removeIf(n -> n % 2 == 0)` 를 쓴다.",
        },
        { type: "h2", text: "기본 정렬: Collections.sort / List.sort" },
        {
          type: "code",
          code: 'List<String> names = new ArrayList<>(List.of("banana", "kiwi", "apple"));\nCollections.sort(names);\nSystem.out.println(names);\nnames.sort(Comparator.reverseOrder());\nSystem.out.println(names);\nnames.sort(Comparator.comparing(String::length));\nSystem.out.println(names);',
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
            { title: "`Comparable`", items: ["클래스 안에 `compareTo` 하나", "그 클래스의 '기본 순서'", "`Collections.sort(list)` 가 이걸 쓴다"] },
            { title: "`Comparator`", items: ["클래스 밖에서 만드는 기준", "이름순·점수순 등 여러 개 가능", "`list.sort(기준)` 에 넘긴다"] },
          ],
        },
        {
          type: "code",
          code: 'class Student implements Comparable<Student> {\n    String name; int score;\n    // 생성자 생략, toString 은 "이름:점수"\n    @Override\n    public int compareTo(Student o) { return Integer.compare(score, o.score); }\n}\n\nList<Student> list = new ArrayList<>(List.of(\n    new Student("철수", 85), new Student("영희", 92), new Student("민수", 78)));\n\nCollections.sort(list);  // 기본: 점수 오름차순\nSystem.out.println(list);\nlist.sort(Comparator.comparing((Student s) -> s.name));  // 이름순\nSystem.out.println(list);\nlist.sort(Comparator.comparingInt((Student s) -> s.score).reversed());  // 점수 내림차순\nSystem.out.println(list);',
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
          items: ["돌면서 지우기는 `it.remove()` 또는 `removeIf`", "`Comparable` = 클래스의 기본 순서, `Comparator` = 바꿔 끼우는 기준", "`reversed()` 로 내림차순"],
        },
      ],
    },
  ],
};
