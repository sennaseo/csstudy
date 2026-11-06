// 자바 단원 8 — 람다와 스트림 (시중 입문서 목차 기준). 작성 규칙은 ../python.ts 상단 주석.
import type { NoteUnit } from "../types";

export const JV8: NoteUnit = {
  id: "jv-8",
  title: "람다와 스트림",
  notes: [
    {
      id: "n-jv-8-1",
      emoji: "➡️",
      title: "람다식 문법과 함수형 인터페이스",
      summary: "이름 없는 함수 (a, b) -> a + b, 담는 그릇은 메서드 하나짜리 인터페이스",
      blocks: [
        { type: "key", text: "람다 = 메서드 하나짜리 인터페이스를 짧게 구현하는 문법" },
        {type: "figure", kind: "flow", nodes: [{icon: "📜", label: "익명 클래스", sub: "5줄"}, {icon: "⚡", label: "`(a, b) -> a + b`", sub: "1줄", ink: "green"}], edges: ["줄이기"], caption: "메서드가 하나뿐인 인터페이스를 짧게 구현"},
        {
          type: "tip",
          kind: "analogy",
          text: "빈칸 하나짜리 신청서. 빈칸이 하나뿐이니 '무엇을 할지'만 적어 내면 된다. 그 빈칸이 추상 메서드, 적어 낸 내용이 람다.",
        },
        { type: "h2", text: "문법" },
        {
          type: "compare",
          cols: [
            { title: "파이썬", items: ["`lambda a, b: a + b`", "그대로 변수에 담긴다"] },
            { title: "자바", items: ["`(a, b) -> a + b`", "함수형 인터페이스 타입 변수에 담는다"] },
          ],
        },
        {
          type: "table",
          head: ["모양", "예"],
          rows: [
            ["매개변수 없음", "`() -> System.out.println(\"안녕\")`"],
            ["매개변수 하나", "`n -> n * 2` (괄호 생략 가능)"],
            ["식 하나", "`(a, b) -> a + b` (return 생략)"],
            ["여러 줄", "`(a, b) -> { int r = a * b; return r; }`"],
          ],
        },
        { type: "h2", text: "함수형 인터페이스 만들기" },
        {
          type: "code",
          code: "@FunctionalInterface\ninterface Calculator {\n    int calc(int a, int b);  // 추상 메서드 딱 하나\n}\n\nCalculator add = (a, b) -> a + b;\nCalculator mul = (a, b) -> {\n    int r = a * b;\n    return r;\n};\nSystem.out.println(add.calc(3, 4));\nSystem.out.println(mul.calc(3, 4));",
          out: "7\n12",
        },
        {
          type: "list",
          style: "flow",
          items: ["`Calculator` 타입 변수에 람다를 대입", "컴파일러가 `calc(int, int)` 를 구현한 것으로 본다", "`add.calc(3, 4)` 로 호출"],
        },
        {
          type: "tip",
          kind: "memo",
          text: "`@FunctionalInterface` 는 없어도 동작한다. 붙여 두면 추상 메서드가 두 개가 될 때 컴파일 에러로 알려 준다.",
        },
        { type: "h2", text: "이미 있는 곳에서 써 보기" },
        {
          type: "code",
          code: 'Runnable hello = () -> System.out.println("안녕");\nhello.run();\n\nList<String> names = new ArrayList<>(List.of("kim", "lee", "park"));\nnames.forEach(n -> System.out.println(n.toUpperCase()));',
          out: "안녕\nKIM\nLEE\nPARK",
        },
        {
          type: "tip",
          kind: "warn",
          text: "람다 안에서 바깥 지역 변수는 읽기만 된다. 대입이 한 번뿐인 변수(effectively final)만 쓸 수 있고, 바꾸려 하면 컴파일 에러.",
        },
        {
          type: "list",
          style: "check",
          items: ["`(매개변수) -> 본문`, 식 하나면 return 생략", "람다를 담는 타입 = 추상 메서드 하나짜리 함수형 인터페이스", "바깥 지역 변수는 읽기만"],
        },
      ],
    },
    {
      id: "n-jv-8-2",
      emoji: "🧰",
      title: "표준 함수형 인터페이스와 메서드 참조 ::",
      summary: "Function·Predicate·Consumer·Supplier 네 개면 대부분 해결",
      blocks: [
        { type: "key", text: "인터페이스를 매번 만들지 말고 `java.util.function` 에 있는 걸 쓴다" },
        {type: "figure", kind: "tree", root: {icon: "🧰", label: "`java.util.function`"}, children: [{icon: "🏭", label: "`Supplier`", sub: "() → 값"}, {icon: "🍽️", label: "`Consumer`", sub: "값 → ()"}, {icon: "🔄", label: "`Function`", sub: "값 → 값", ink: "blue"}, {icon: "❓", label: "`Predicate`", sub: "값 → boolean", ink: "green"}]},
        { type: "h2", text: "표준 4종" },
        {
          type: "table",
          head: ["인터페이스", "메서드", "모양", "용도"],
          rows: [
            ["`Function<T, R>`", "`apply`", "T → R", "변환"],
            ["`Predicate<T>`", "`test`", "T → boolean", "조건 검사"],
            ["`Consumer<T>`", "`accept`", "T → (없음)", "받아서 쓰기만"],
            ["`Supplier<T>`", "`get`", "(없음) → T", "만들어 주기"],
          ],
        },
        {
          type: "code",
          code: 'Function<String, Integer> len = s -> s.length();\nPredicate<Integer> isEven = n -> n % 2 == 0;\nConsumer<String> printer = s -> System.out.println("출력: " + s);\nSupplier<String> hello = () -> "안녕";\n\nSystem.out.println(len.apply("java"));\nSystem.out.println(isEven.test(7));\nprinter.accept("자바");\nSystem.out.println(hello.get());',
          out: "4\nfalse\n출력: 자바\n안녕",
        },
        {
          type: "tip",
          kind: "analogy",
          text: "Function 은 믹서기(넣으면 다른 게 나옴), Predicate 는 검문소(통과/불통), Consumer 는 쓰레기통(받기만), Supplier 는 자판기(누르면 나옴).",
        },
        { type: "h2", text: "메서드 참조 `::`" },
        {
          type: "p",
          text: "람다가 메서드 하나를 그대로 부르기만 하면 `클래스::메서드` 로 줄일 수 있다.",
        },
        {
          type: "table",
          head: ["람다", "메서드 참조"],
          rows: [
            ["`s -> s.toUpperCase()`", "`String::toUpperCase`"],
            ["`s -> Integer.parseInt(s)`", "`Integer::parseInt`"],
            ["`x -> System.out.println(x)`", "`System.out::println`"],
            ["`() -> new ArrayList<>()`", "`ArrayList::new`"],
          ],
        },
        {
          type: "code",
          code: 'Function<String, String> upper = String::toUpperCase;\nFunction<String, Integer> parse = Integer::parseInt;\nSystem.out.println(upper.apply("java"));\nSystem.out.println(parse.apply("42") + 1);\n\nList.of("a", "b").forEach(System.out::println);\n\nSupplier<List<String>> maker = ArrayList::new;\nSystem.out.println(maker.get());',
          out: "JAVA\n43\na\nb\n[]",
        },
        {
          type: "tip",
          kind: "warn",
          text: "`::` 뒤에는 괄호를 쓰지 않는다. `String::toUpperCase()` 는 문법 오류. 호출이 아니라 '이 메서드를 써라'는 가리킴이다.",
        },
        {
          type: "list",
          style: "check",
          items: ["Function 변환, Predicate 조건, Consumer 소비, Supplier 공급", "람다가 메서드 하나만 부르면 `::` 로 줄인다", "`::` 뒤엔 괄호 없음"],
        },
      ],
    },
    {
      id: "n-jv-8-3",
      emoji: "🚰",
      title: "스트림이란 — 생성 → 중간 연산 → 최종 연산",
      summary: "데이터를 흘려보내며 거르고 바꾸는 파이프, 최종 연산이 있어야 흐른다",
      blocks: [
        { type: "key", text: "스트림 = 컬렉션을 파이프에 흘려 가공하는 방법, 원본은 그대로" },
        {type: "figure", kind: "flow", nodes: [{icon: "🚰", label: "생성", sub: "`list.stream()`"}, {icon: "🔧", label: "중간 연산", sub: "`filter` `map`", ink: "blue"}, {icon: "🎁", label: "최종 연산", sub: "`toList()`", ink: "green"}], edges: ["", ""], caption: "최종 연산 전엔 아무 일도 안 일어난다"},
        { type: "h2", text: "3단계 흐름" },
        {
          type: "list",
          style: "flow",
          items: ["생성: `list.stream()`, `Stream.of(...)`, `IntStream.range(0, 5)`", "중간 연산: `filter` `map` `sorted` … 몇 개든 이어 붙인다", "최종 연산: `toList` `forEach` `count` … 딱 하나, 여기서 결과가 나온다"],
        },
        {
          type: "code",
          code: "List<Integer> nums = List.of(1, 2, 3, 4, 5, 6);\nList<Integer> result = nums.stream()\n    .filter(n -> n % 2 == 0)\n    .map(n -> n * n)\n    .toList();\nSystem.out.println(result);\nSystem.out.println(nums);  // 원본은 안 바뀐다",
          out: "[4, 16, 36]\n[1, 2, 3, 4, 5, 6]",
        },
        {
          type: "compare",
          cols: [
            { title: "파이썬 컴프리헨션", items: ["`[n * n for n in nums if n % 2 == 0]`", "한 줄 안에 조건·변환"] },
            { title: "자바 스트림", items: ["`nums.stream().filter(...).map(...).toList()`", "단계를 점(.)으로 이어 붙인다"] },
          ],
        },
        { type: "h2", text: "지연 평가: 최종 연산 전엔 아무 일도 없다" },
        {
          type: "code",
          code: 'Stream<String> s = Stream.of("a", "b", "c")\n    .filter(x -> {\n        System.out.println("filter " + x);\n        return true;\n    });\nSystem.out.println("아직 아무것도 안 함");\nSystem.out.println(s.count());',
          out: "아직 아무것도 안 함\nfilter a\nfilter b\nfilter c\n3",
        },
        {
          type: "code",
          code: 'Stream.of("a", "b", "c")\n    .filter(x -> { System.out.println("filter " + x); return true; })\n    .map(x -> { System.out.println("map " + x); return x.toUpperCase(); })\n    .forEach(x -> System.out.println("forEach " + x));',
          out: "filter a\nmap a\nforEach A\nfilter b\nmap b\nforEach B\nfilter c\nmap c\nforEach C",
        },
        {
          type: "tip",
          kind: "analogy",
          text: "공장 컨베이어 벨트. 물건 하나가 거르기 → 바꾸기 → 포장을 끝까지 통과한 뒤 다음 물건이 출발한다. 단계별로 전체를 한 번씩 도는 게 아니다.",
        },
        { type: "h2", text: "스트림은 일회용" },
        {
          type: "code",
          code: 'Stream<String> s = Stream.of("a", "b", "c");\nSystem.out.println(s.count());\nSystem.out.println(s.count());  // 두 번째 사용',
          out: '3\nException in thread "main" java.lang.IllegalStateException: stream has already been operated upon or closed',
        },
        {
          type: "tip",
          kind: "warn",
          text: "스트림을 변수에 담아 두고 재사용하지 않는다. 필요할 때마다 `list.stream()` 으로 새로 만든다. 파이썬 제너레이터를 한 번 다 돌면 끝나는 것과 비슷하다.",
        },
        {
          type: "list",
          style: "check",
          items: ["생성 → 중간 연산(여러 개) → 최종 연산(하나)", "최종 연산이 불려야 흐르기 시작한다 (지연 평가)", "스트림은 일회용, 원본 컬렉션은 안 바뀐다"],
        },
      ],
    },
    {
      id: "n-jv-8-4",
      emoji: "🧪",
      title: "중간 연산 — filter·map·sorted·distinct·limit",
      summary: "거르고(filter) 바꾸고(map) 줄 세우고(sorted) 중복 빼고 자르기",
      blocks: [
        { type: "key", text: "중간 연산은 스트림을 받아 스트림을 돌려준다, 그래서 계속 이어 붙인다" },
        {type: "figure", kind: "flow", nodes: [{icon: "🔢", label: "1 2 3 4 5"}, {icon: "🧹", label: "`filter(짝수)`", sub: "2 4", ink: "blue"}, {icon: "✖️", label: "`map(x*10)`", sub: "20 40", ink: "green"}]},
        { type: "h2", text: "5종 한눈에" },
        {
          type: "table",
          head: ["연산", "하는 일", "받는 것"],
          rows: [
            ["`filter`", "조건이 true 인 것만 남김", "`Predicate`"],
            ["`map`", "하나씩 다른 값으로 바꿈", "`Function`"],
            ["`sorted`", "정렬 (기준 생략 시 기본 순서)", "`Comparator` (선택)"],
            ["`distinct`", "중복 제거 (`equals` 기준)", "없음"],
            ["`limit(n)`", "앞에서 n 개만", "개수"],
          ],
        },
        { type: "h2", text: "하나씩 확인" },
        {
          type: "code",
          code: 'List<String> words = List.of("banana", "apple", "kiwi", "apple", "cherry", "fig");\n\nSystem.out.println(words.stream().filter(w -> w.length() >= 5).toList());\nSystem.out.println(words.stream().map(String::length).toList());\nSystem.out.println(words.stream().distinct().toList());\nSystem.out.println(words.stream().sorted().toList());\nSystem.out.println(words.stream().sorted(Comparator.reverseOrder()).limit(2).toList());',
          out: "[banana, apple, apple, cherry]\n[6, 5, 4, 5, 6, 3]\n[banana, apple, kiwi, cherry, fig]\n[apple, apple, banana, cherry, fig, kiwi]\n[kiwi, fig]",
        },
        {
          type: "tip",
          kind: "memo",
          text: "`map` 은 타입도 바꿀 수 있다. `Stream<String>` 이 `map(String::length)` 를 지나면 `Stream<Integer>` 가 된다.",
        },
        { type: "h2", text: "이어 붙이기" },
        {
          type: "code",
          code: "List<String> r = words.stream()\n    .distinct()                 // 중복 apple 하나로\n    .filter(w -> w.length() >= 5)\n    .map(String::toUpperCase)\n    .sorted()\n    .limit(2)\n    .toList();\nSystem.out.println(r);",
          out: "[APPLE, BANANA]",
        },
        {
          type: "list",
          style: "flow",
          items: ["distinct: banana, apple, kiwi, cherry, fig", "filter (5글자 이상): banana, apple, cherry", "map: BANANA, APPLE, CHERRY", "sorted: APPLE, BANANA, CHERRY", "limit(2): APPLE, BANANA"],
        },
        {
          type: "tip",
          kind: "warn",
          text: "순서가 결과를 바꾼다. `limit(2)` 를 `sorted()` 앞에 두면 정렬 전 앞의 두 개를 잘라 버린다. 거르기는 되도록 앞쪽에 두면 뒤 단계 일이 줄어든다.",
        },
        {
          type: "list",
          style: "check",
          items: ["`filter` 는 Predicate, `map` 은 Function 을 받는다", "`distinct` `sorted` `limit` 로 중복 제거·정렬·자르기", "연산 순서에 따라 결과가 달라진다"],
        },
      ],
    },
    {
      id: "n-jv-8-5",
      emoji: "🏁",
      title: "최종 연산 — forEach·collect·count·reduce",
      summary: "파이프 끝에서 결과를 받는 방법: 모으기·세기·합치기",
      blocks: [
        { type: "key", text: "최종 연산이 스트림을 리스트·문자열·숫자·Map 으로 바꾼다" },
        {type: "figure", kind: "tree", root: {icon: "🎁", label: "최종 연산"}, children: [{icon: "📋", label: "`toList()`", sub: "리스트"}, {icon: "🔢", label: "`count()`", sub: "개수", ink: "blue"}, {icon: "➕", label: "`reduce`", sub: "하나로 합치기", ink: "green"}, {icon: "🗂️", label: "`groupingBy`", sub: "Map 으로 묶기", ink: "red"}]},
        { type: "h2", text: "자주 쓰는 최종 연산" },
        {
          type: "table",
          head: ["연산", "결과", "파이썬 비슷한 것"],
          rows: [
            ["`forEach(Consumer)`", "하나씩 실행 (반환 없음)", "`for x in ...`"],
            ["`toList()`", "`List`", "`list(...)`"],
            ["`count()`", "`long` 개수", "`len(...)`"],
            ["`reduce(초기값, 합치기)`", "값 하나", "`functools.reduce`"],
            ["`collect(Collectors.joining(\", \"))`", "`String`", "`', '.join(...)`"],
          ],
        },
        {
          type: "code",
          code: 'List<String> names = List.of("kim", "lee", "park", "choi");\nSystem.out.println(names.stream().filter(n -> n.length() == 3).count());\nSystem.out.println(names.stream().collect(Collectors.joining(", ")));\nSystem.out.println(names.stream().collect(Collectors.joining(", ", "[", "]")));\n\nList<Integer> nums = List.of(1, 2, 3, 4, 5);\nSystem.out.println(nums.stream().reduce(0, (a, b) -> a + b));\nSystem.out.println(nums.stream().mapToInt(Integer::intValue).sum());\nnums.stream().filter(n -> n > 3).forEach(System.out::println);',
          out: "2\nkim, lee, park, choi\n[kim, lee, park, choi]\n15\n15\n4\n5",
        },
        {
          type: "list",
          style: "flow",
          items: ["`reduce(0, (a, b) -> a + b)` 는 0에서 출발", "0+1=1 → 1+2=3 → 3+3=6 → 6+4=10 → 10+5=15"],
        },
        { type: "h2", text: "`toList()` vs `collect(Collectors.toList())`" },
        {
          type: "compare",
          cols: [
            { title: "`toList()` (자바 16+)", items: ["짧다", "읽기 전용 리스트", "`add` 하면 UnsupportedOperationException"] },
            { title: "`collect(Collectors.toList())`", items: ["옛날 방식", "실제로는 `ArrayList` 가 나와 `add` 가 된다", "다만 수정 가능을 보장하진 않는다"] },
          ],
        },
        { type: "h2", text: "groupingBy: 기준별로 묶기" },
        {
          type: "code",
          code: 'List<String> words = List.of("apple", "avocado", "banana", "blueberry", "cherry");\n\nMap<Character, List<String>> byFirst = words.stream()\n    .collect(Collectors.groupingBy(w -> w.charAt(0)));\nSystem.out.println(byFirst);\n\nMap<Integer, Long> byLen = words.stream()\n    .collect(Collectors.groupingBy(String::length, Collectors.counting()));\nSystem.out.println(byLen);',
          out: "{a=[apple, avocado], b=[banana, blueberry], c=[cherry]}\n{5=1, 6=2, 7=1, 9=1}",
        },
        {
          type: "tip",
          kind: "analogy",
          text: "우편물 분류함. 첫 글자(기준)가 칸 이름이 되고, 같은 칸에 들어온 것끼리 리스트로 묶인다. `counting()` 을 붙이면 칸마다 개수만 센다.",
        },
        {
          type: "tip",
          kind: "memo",
          text: "`groupingBy` 결과는 `HashMap` 이라 키 순서가 보장되지 않는다. 위 출력은 실제 실행 결과이고 우연히 정렬돼 보일 뿐이다.",
        },
        {
          type: "list",
          style: "check",
          items: ["모으기 `toList`, 세기 `count`, 합치기 `reduce`·`sum`", "문자열 잇기는 `Collectors.joining`", "기준별 묶기는 `Collectors.groupingBy`"],
        },
      ],
    },
    {
      id: "n-jv-8-6",
      emoji: "📦",
      title: "Optional로 null 다루기",
      summary: "값이 있을 수도 없을 수도 있음을 상자로 감싸 null 사고를 막는다",
      blocks: [
        { type: "key", text: "`Optional` = 값이 들어 있거나 비어 있는 상자, 열기 전에 확인하게 만든다" },
        {type: "figure", kind: "tree", root: {icon: "📦", label: "`Optional<T>`"}, children: [{icon: "🎁", label: "값 있음", sub: "`get()` / `orElse`", ink: "green"}, {icon: "🫙", label: "비어 있음", sub: "`orElse(기본값)`", ink: "red"}], caption: "열어 보기 전에 비었는지 확인하게 만든다"},
        {
          type: "tip",
          kind: "analogy",
          text: "택배 상자. 빈 상자일 수도 있다는 걸 겉에 적어 둔 셈. 그냥 `null` 을 주면 받는 쪽이 모르고 열다 다친다(NullPointerException).",
        },
        { type: "h2", text: "만들기와 꺼내기" },
        {
          type: "code",
          code: 'Optional<String> some = Optional.of("자바");\nOptional<String> none = Optional.empty();\nOptional<String> maybe = Optional.ofNullable(null);\n\nSystem.out.println(some);\nSystem.out.println(none);\nSystem.out.println(maybe.isPresent());\nSystem.out.println(some.orElse("기본값"));\nSystem.out.println(none.orElse("기본값"));',
          out: "Optional[자바]\nOptional.empty\nfalse\n자바\n기본값",
        },
        {
          type: "table",
          head: ["메서드", "하는 일"],
          rows: [
            ["`Optional.of(v)`", "값이 확실히 있을 때 (null 넣으면 NullPointerException)"],
            ["`Optional.ofNullable(v)`", "null 일 수도 있을 때"],
            ["`Optional.empty()`", "빈 상자"],
            ["`orElse(기본값)`", "비었으면 기본값"],
            ["`orElseGet(() -> ...)`", "비었을 때만 기본값을 만든다"],
            ["`orElseThrow()`", "비었으면 NoSuchElementException"],
          ],
        },
        { type: "h2", text: "스트림에서 나오는 Optional" },
        {
          type: "code",
          code: 'List<String> names = List.of("kim", "lee", "park");\n\nOptional<String> p = names.stream().filter(n -> n.startsWith("p")).findFirst();\np.ifPresent(n -> System.out.println("찾음: " + n));\n\nOptional<String> z = names.stream().filter(n -> n.startsWith("z")).findFirst();\nSystem.out.println(z.map(String::toUpperCase).orElse("없음"));\nSystem.out.println(p.map(String::toUpperCase).orElse("없음"));\nSystem.out.println(z.orElseGet(() -> "만든 값"));',
          out: "찾음: park\n없음\nPARK\n만든 값",
        },
        {
          type: "p",
          text: "`findFirst` `max` `min` 처럼 결과가 없을 수 있는 최종 연산은 `Optional` 을 돌려준다. `map` 은 값이 있을 때만 바꾸고, 비었으면 빈 상자를 그대로 넘긴다.",
        },
        { type: "h2", text: "쓰는 법 O / X" },
        {
          type: "compare",
          cols: [
            { title: "피할 것", tone: "bad", items: ["`opt.get()` 바로 호출 (비었으면 예외)", "`if (opt.isPresent()) opt.get()` 반복", "필드·매개변수 타입으로 쓰기"] },
            { title: "권장", tone: "good", items: ["`orElse` · `orElseGet` 로 기본값", "`ifPresent` 로 있을 때만 실행", "메서드 반환 타입으로 쓰기"] },
          ],
        },
        {
          type: "code",
          code: "Optional<String> none = Optional.empty();\nnone.orElseThrow();",
          out: 'Exception in thread "main" java.util.NoSuchElementException: No value present',
        },
        {
          type: "list",
          style: "check",
          items: ["null 일 수 있으면 `Optional.ofNullable`", "꺼낼 땐 `get` 대신 `orElse`·`orElseGet`·`ifPresent`", "`findFirst`·`max` 결과는 Optional"],
        },
      ],
    },
  ],
};
