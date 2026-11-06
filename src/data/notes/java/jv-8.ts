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
        { type: "key", text: "이름 붙일 필요 없는 짧은 함수를 그 자리에서 바로 건넨다" },
        {
          type: "p",
          text: "이 짧은 함수가 람다(lambda, 이름 없는 함수)다. JS 화살표 함수 `(a, b) => a + b` 와 거의 같다.",
        },
        { type: "h2", text: "문법" },
        {
          type: "compare",
          cols: [
            { title: "JS", items: ["`(a, b) => a + b`", "`=>` 굵은 화살표", "그대로 변수에 담긴다"] },
            { title: "파이썬", items: ["`lambda a, b: a + b`", "그대로 변수에 담긴다"] },
            { title: "자바", tone: "good", items: ["`(a, b) -> a + b`", "`->` 가는 화살표", "담을 변수에 '함수형 인터페이스' 타입이 필요하다"] },
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
        { type: "h2", text: "람다를 담는 그릇: 함수형 인터페이스" },
        {
          type: "p",
          text: "자바에는 '함수 타입'이 따로 없다. 대신 메서드가 딱 하나인 인터페이스(함수형 인터페이스)를 그릇으로 쓴다.",
        },
        {
          type: "code",
          code: "@FunctionalInterface\ninterface Calculator {\n    int calc(int a, int b);  // 추상 메서드 딱 하나\n}\n\nCalculator add = (a, b) -> a + b;  // 이 람다가 곧 calc 의 내용\nCalculator mul = (a, b) -> {\n    int r = a * b;\n    return r;\n};\nSystem.out.println(add.calc(3, 4));  // 부를 땐 메서드 이름 calc 로\nSystem.out.println(mul.calc(3, 4));",
          out: "7\n12",
        },
        {
          type: "tip",
          kind: "analogy",
          text: "빈칸 하나짜리 신청서. 빈칸이 하나뿐이니 '무엇을 할지'만 적어 내면 된다. 그 빈칸이 추상 메서드, 적어 낸 내용이 람다다.",
        },
        {
          type: "tip",
          kind: "memo",
          text: "`@FunctionalInterface` 는 없어도 동작한다. 붙여 두면 추상 메서드가 두 개가 될 때 컴파일 에러로 알려 준다.",
        },
        { type: "h2", text: "이미 있는 곳에서 써 보기" },
        {
          type: "code",
          code: 'Runnable hello = () -> System.out.println("안녕");  // Runnable 도 메서드 run() 하나짜리\nhello.run();\n\nList<String> names = new ArrayList<>(List.of("kim", "lee", "park"));\nnames.forEach(n -> System.out.println(n.toUpperCase()));  // JS arr.forEach(n => ...) 와 같다',
          out: "안녕\nKIM\nLEE\nPARK",
        },
        {
          type: "tip",
          kind: "warn",
          text: "람다 안에서 바깥 지역 변수는 읽기만 된다. 선언 뒤 값이 한 번도 안 바뀐 변수(effectively final)만 쓸 수 있고, 바꾸려 하면 컴파일 에러.",
        },
        {
          type: "list",
          style: "check",
          items: ["`(매개변수) -> 본문`, 식 하나면 return 생략", "람다를 담는 타입 = 메서드 하나짜리 함수형 인터페이스", "바깥 지역 변수는 읽기만"],
        },
      ],
    },
    {
      id: "n-jv-8-2",
      emoji: "🧰",
      title: "표준 함수형 인터페이스와 메서드 참조 ::",
      summary: "Function·Predicate·Consumer·Supplier 네 개면 대부분 해결",
      blocks: [
        { type: "key", text: "그릇을 매번 새로 만들지 말고 이미 만들어 둔 네 가지를 꺼내 쓴다" },
        { type: "h2", text: "기본 그릇 4종" },
        {
          type: "table",
          head: ["인터페이스", "비유", "모양", "부를 때"],
          rows: [
            ["`Function<T, R>`", "믹서기: 넣으면 다른 게 나온다", "T → R", "`apply`"],
            ["`Predicate<T>`", "검문소: 통과/불통만 말한다", "T → boolean", "`test`"],
            ["`Consumer<T>`", "우체통: 받기만 하고 돌려주지 않는다", "T → (없음)", "`accept`"],
            ["`Supplier<T>`", "자판기: 누르면 나온다", "(없음) → T", "`get`"],
          ],
        },
        {
          type: "p",
          text: "모두 `java.util.function` 패키지에 들어 있다. `<T, R>` 은 '받는 타입, 돌려주는 타입' 자리다.",
        },
        {
          type: "code",
          code: 'Function<String, Integer> len = s -> s.length();  // String 을 받아 Integer 를 돌려준다\nPredicate<Integer> isEven = n -> n % 2 == 0;\nConsumer<String> printer = s -> System.out.println("출력: " + s);\nSupplier<String> hello = () -> "안녕";\n\nSystem.out.println(len.apply("java"));\nSystem.out.println(isEven.test(7));\nprinter.accept("자바");\nSystem.out.println(hello.get());',
          out: "4\nfalse\n출력: 자바\n안녕",
        },
        { type: "h2", text: "메서드 참조 `::`" },
        {
          type: "p",
          text: "람다가 메서드 하나를 그대로 부르기만 하면 `클래스::메서드` 로 줄일 수 있다. 이게 메서드 참조(method reference)다.",
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
          code: 'Function<String, String> upper = String::toUpperCase;\nFunction<String, Integer> parse = Integer::parseInt;\nSystem.out.println(upper.apply("java"));\nSystem.out.println(parse.apply("42") + 1);  // 문자열 "42" 가 숫자 42 가 됐다\n\nList.of("a", "b").forEach(System.out::println);  // 하나씩 println 에 넘긴다\n\nSupplier<List<String>> maker = ArrayList::new;  // 부를 때마다 새 빈 리스트\nSystem.out.println(maker.get());',
          out: "JAVA\n43\na\nb\n[]",
        },
        {
          type: "tip",
          kind: "warn",
          text: "`::` 뒤에는 괄호를 쓰지 않는다. `String::toUpperCase()` 는 문법 오류. 지금 부르는 게 아니라 '이 메서드를 써라'고 가리키기만 한다.",
        },
        {
          type: "list",
          style: "check",
          items: ["Function 변환, Predicate 조건, Consumer 받기만, Supplier 만들기", "람다가 메서드 하나만 부르면 `::` 로 줄인다", "`::` 뒤엔 괄호 없음"],
        },
      ],
    },
    {
      id: "n-jv-8-3",
      emoji: "🚰",
      title: "스트림이란 — 생성 → 중간 연산 → 최종 연산",
      summary: "데이터를 흘려보내며 거르고 바꾸는 파이프, 최종 연산이 있어야 흐른다",
      blocks: [
        { type: "key", text: "자료를 벨트에 올려 거르고 바꾼 뒤 끝에서 받는다. 원본은 그대로" },
        {
          type: "p",
          text: "이 벨트가 스트림(stream, 자료를 하나씩 흘려보내는 통로)이다. JS 의 `arr.filter(...).map(...)` 체인과 모양이 거의 같다.",
        },
        { type: "h2", text: "3단계 흐름" },
        {
          type: "list",
          style: "flow",
          items: [
            "생성(벨트에 올리기): `list.stream()`, `Stream.of(...)`, `IntStream.range(0, 5)`",
            "중간 연산(가공 단계): `filter` `map` `sorted` … 몇 개든 이어 붙인다",
            "최종 연산(끝에서 받기): `toList` `forEach` `count` … 딱 하나, 여기서 결과가 나온다",
          ],
        },
        {
          type: "code",
          code: "List<Integer> nums = List.of(1, 2, 3, 4, 5, 6);\nList<Integer> result = nums.stream()  // 벨트에 올린다\n    .filter(n -> n % 2 == 0)          // 짝수만 남긴다\n    .map(n -> n * n)                  // 제곱으로 바꾼다\n    .toList();                        // 끝에서 리스트로 받는다\nSystem.out.println(result);\nSystem.out.println(nums);  // 원본은 안 바뀐다",
          out: "[4, 16, 36]\n[1, 2, 3, 4, 5, 6]",
        },
        {
          type: "compare",
          cols: [
            { title: "JS 배열", items: ["`nums.filter(n => n % 2 === 0).map(n => n * n)`", "단계마다 새 배열이 바로 만들어진다"] },
            { title: "파이썬 컴프리헨션", items: ["`[n * n for n in nums if n % 2 == 0]`", "한 줄 안에 조건·변환"] },
            { title: "자바 스트림", items: ["`nums.stream().filter(...).map(...).toList()`", "끝에 `toList()` 같은 최종 연산이 꼭 있어야 한다"] },
          ],
        },
        { type: "h2", text: "최종 연산 전엔 아무 일도 없다" },
        {
          type: "p",
          text: "중간 연산은 '할 일 목록'만 적어 둔다. 최종 연산이 불려야 그제야 움직인다(지연 평가, 필요할 때까지 미루기).",
        },
        {
          type: "code",
          code: 'Stream<String> s = Stream.of("a", "b", "c")\n    .filter(x -> {\n        System.out.println("filter " + x);\n        return true;\n    });                                  // 아직 적어 두기만 했다\nSystem.out.println("아직 아무것도 안 함");\nSystem.out.println(s.count());           // 여기서 비로소 filter 가 돈다',
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
          text: "공장 컨베이어 벨트. 물건 하나가 거르기 → 바꾸기 → 포장을 끝까지 통과한 뒤 다음 물건이 출발한다. 단계별로 전체를 한 번씩 도는 JS 배열 체인과 다른 점이다.",
        },
        { type: "h2", text: "스트림은 일회용" },
        {
          type: "code",
          code: 'Stream<String> s = Stream.of("a", "b", "c");\nSystem.out.println(s.count());\nSystem.out.println(s.count());  // 이미 다 흘려보낸 벨트를 또 쓰려 함',
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
          items: ["생성 → 중간 연산(여러 개) → 최종 연산(하나)", "최종 연산이 불려야 흐르기 시작한다", "스트림은 일회용, 원본 컬렉션은 안 바뀐다"],
        },
      ],
    },
    {
      id: "n-jv-8-4",
      emoji: "🧪",
      title: "중간 연산 — filter·map·sorted·distinct·limit",
      summary: "거르고(filter) 바꾸고(map) 줄 세우고(sorted) 중복 빼고 자르기",
      blocks: [
        { type: "key", text: "벨트 위 가공 단계: 거르고, 바꾸고, 줄 세우고, 중복 빼고, 자른다" },
        {
          type: "p",
          text: "중간 연산은 스트림을 받아 다시 스트림을 돌려준다. 그래서 점(.)으로 계속 이어 붙일 수 있다.",
        },
        { type: "h2", text: "5종 한눈에" },
        {
          type: "table",
          head: ["연산", "하는 일", "JS 배열로 치면", "넘기는 것"],
          rows: [
            ["`filter`", "조건이 true 인 것만 남김", "`filter`", "조건 람다 (`Predicate`)"],
            ["`map`", "하나씩 다른 값으로 바꿈", "`map`", "변환 람다 (`Function`)"],
            ["`sorted`", "정렬 (기준 생략 시 기본 순서)", "`toSorted`", "정렬 기준 (`Comparator`, 생략 가능)"],
            ["`distinct`", "중복 제거 (`equals` 기준)", "`[...new Set(arr)]`", "없음"],
            ["`limit(n)`", "앞에서 n 개만", "`slice(0, n)`", "개수"],
          ],
        },
        { type: "h2", text: "하나씩 확인" },
        {
          type: "code",
          code: 'List<String> words = List.of("banana", "apple", "kiwi", "apple", "cherry", "fig");\n\nSystem.out.println(words.stream().filter(w -> w.length() >= 5).toList());  // 5글자 이상만\nSystem.out.println(words.stream().map(String::length).toList());  // 단어를 글자 수로\nSystem.out.println(words.stream().distinct().toList());\nSystem.out.println(words.stream().sorted().toList());\nSystem.out.println(words.stream().sorted(Comparator.reverseOrder()).limit(2).toList());  // 거꾸로 정렬 후 앞 2개',
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
          items: ["`filter` 는 조건, `map` 은 변환 람다를 받는다", "`distinct` `sorted` `limit` 로 중복 제거·정렬·자르기", "연산 순서에 따라 결과가 달라진다"],
        },
      ],
    },
    {
      id: "n-jv-8-5",
      emoji: "🏁",
      title: "최종 연산 — forEach·collect·count·reduce",
      summary: "파이프 끝에서 결과를 받는 방법: 모으기·세기·합치기",
      blocks: [
        { type: "key", text: "벨트 끝에서 결과를 받는 방법: 모으기, 세기, 하나로 합치기" },
        { type: "h2", text: "자주 쓰는 최종 연산" },
        {
          type: "table",
          head: ["연산", "결과", "JS 로 치면"],
          rows: [
            ["`forEach(...)`", "하나씩 실행 (돌려주는 값 없음)", "`forEach`"],
            ["`toList()`", "`List`", "체인 끝의 배열"],
            ["`count()`", "개수 (`long` 타입)", "`length`"],
            ["`reduce(초기값, 합치기)`", "값 하나", "`reduce`"],
            ["`collect(Collectors.joining(\", \"))`", "`String`", "`join(\", \")`"],
          ],
        },
        {
          type: "code",
          code: 'List<String> names = List.of("kim", "lee", "park", "choi");\nSystem.out.println(names.stream().filter(n -> n.length() == 3).count());  // kim, lee 두 개\nSystem.out.println(names.stream().collect(Collectors.joining(", ")));\nSystem.out.println(names.stream().collect(Collectors.joining(", ", "[", "]")));  // 앞뒤에 [ ] 를 붙인다\n\nList<Integer> nums = List.of(1, 2, 3, 4, 5);\nSystem.out.println(nums.stream().reduce(0, (a, b) -> a + b));  // 0 에서 출발해 차례로 더한다\nSystem.out.println(nums.stream().mapToInt(Integer::intValue).sum());  // 숫자 전용 스트림으로 바꿔 sum\nnums.stream().filter(n -> n > 3).forEach(System.out::println);',
          out: "2\nkim, lee, park, choi\n[kim, lee, park, choi]\n15\n15\n4\n5",
        },
        {
          type: "list",
          style: "flow",
          items: ["`reduce(0, (a, b) -> a + b)` 는 0에서 출발", "0+1=1 → 1+2=3 → 3+3=6 → 6+4=10 → 10+5=15"],
        },
        {
          type: "tip",
          kind: "memo",
          text: "`toList()`(자바 16+)는 읽기 전용 리스트를 돌려줘 `add` 하면 UnsupportedOperationException. 옛날 방식 `collect(Collectors.toList())` 는 실제로 `ArrayList` 가 나와 `add` 가 되지만, 수정 가능을 보장하진 않는다.",
        },
        { type: "h2", text: "groupingBy: 기준별로 묶기" },
        {
          type: "tip",
          kind: "analogy",
          text: "우편물 분류함. 첫 글자(기준)가 칸 이름이 되고, 같은 칸에 들어온 것끼리 리스트로 묶인다. `counting()` 을 붙이면 칸마다 개수만 센다.",
        },
        {
          type: "code",
          code: 'List<String> words = List.of("apple", "avocado", "banana", "blueberry", "cherry");\n\nMap<Character, List<String>> byFirst = words.stream()\n    .collect(Collectors.groupingBy(w -> w.charAt(0)));  // 첫 글자가 칸 이름\nSystem.out.println(byFirst);\n\nMap<Integer, Long> byLen = words.stream()\n    .collect(Collectors.groupingBy(String::length, Collectors.counting()));  // 글자 수별 개수\nSystem.out.println(byLen);',
          out: "{a=[apple, avocado], b=[banana, blueberry], c=[cherry]}\n{5=1, 6=2, 7=1, 9=1}",
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
        { type: "key", text: "'빈 상자일 수도 있음'이라고 겉에 적어 둔 택배 상자" },
        {
          type: "compare",
          cols: [
            { title: "그냥 `null` 을 돌려주면", tone: "bad", items: ["받는 쪽은 비었는지 모른다", "모르고 쓰다 NullPointerException (null 을 쓰려다 나는 에러)"] },
            { title: "`Optional` 로 돌려주면", tone: "good", items: ["타입만 봐도 '없을 수 있다'를 안다", "꺼낼 때 '비었으면 어떻게 할지'를 같이 적게 된다"] },
          ],
        },
        { type: "h2", text: "만들기와 꺼내기" },
        {
          type: "code",
          code: 'Optional<String> some = Optional.of("자바");\nOptional<String> none = Optional.empty();\nOptional<String> maybe = Optional.ofNullable(null);  // null 이면 빈 상자가 된다\n\nSystem.out.println(some);\nSystem.out.println(none);\nSystem.out.println(maybe.isPresent());  // 값이 들어 있나\nSystem.out.println(some.orElse("기본값"));\nSystem.out.println(none.orElse("기본값"));  // 비었으니 기본값',
          out: "Optional[자바]\nOptional.empty\nfalse\n자바\n기본값",
        },
        {
          type: "table",
          head: ["메서드", "하는 일"],
          rows: [
            ["`Optional.of(v)`", "값이 확실히 있을 때 (null 넣으면 NullPointerException)"],
            ["`Optional.ofNullable(v)`", "null 일 수도 있을 때"],
            ["`Optional.empty()`", "빈 상자"],
            ["`orElse(기본값)`", "비었으면 기본값. JS 의 `??` 와 비슷"],
            ["`orElseGet(() -> ...)`", "비었을 때만 기본값을 만든다"],
            ["`orElseThrow()`", "비었으면 NoSuchElementException"],
          ],
        },
        { type: "h2", text: "스트림에서 나오는 Optional" },
        {
          type: "code",
          code: 'List<String> names = List.of("kim", "lee", "park");\n\nOptional<String> p = names.stream().filter(n -> n.startsWith("p")).findFirst();\np.ifPresent(n -> System.out.println("찾음: " + n));  // 값이 있을 때만 실행\n\nOptional<String> z = names.stream().filter(n -> n.startsWith("z")).findFirst();  // 못 찾아서 빈 상자\nSystem.out.println(z.map(String::toUpperCase).orElse("없음"));\nSystem.out.println(p.map(String::toUpperCase).orElse("없음"));\nSystem.out.println(z.orElseGet(() -> "만든 값"));',
          out: "찾음: park\n없음\nPARK\n만든 값",
        },
        {
          type: "p",
          text: "`findFirst` `max` `min` 처럼 결과가 없을 수 있는 최종 연산은 `Optional` 을 돌려준다. `map` 은 값이 있을 때만 바꾸고, 비었으면 빈 상자를 그대로 넘긴다.",
        },
        {
          type: "tip",
          kind: "memo",
          text: "`z.map(String::toUpperCase).orElse(\"없음\")` 은 JS 의 `z?.toUpperCase() ?? \"없음\"` 과 같은 흐름이다.",
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
          code: "Optional<String> none = Optional.empty();\nnone.orElseThrow();  // 빈 상자를 억지로 열면 예외",
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
