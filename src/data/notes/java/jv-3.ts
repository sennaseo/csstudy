// 자바 단원 3 — 배열과 문자열 (시중 입문서 목차 기준). 작성 규칙은 ../python.ts 상단 주석.
import type { NoteUnit } from "../types";

export const JV3: NoteUnit = {
  id: "jv-3",
  title: "배열과 문자열",
  notes: [
    {
      id: "n-jv-3-1",
      emoji: "🧱",
      title: "배열 선언·생성·초기화",
      summary: "같은 타입 값을 고정 칸 수로 묶는 배열, new 로 만들기와 기본값",
      blocks: [
        { type: "key", text: "배열은 칸 수가 정해진 같은 타입 상자 줄" },
        { type: "h2", text: "파이썬 리스트와 다른 점" },
        {
          type: "compare",
          cols: [
            { title: "파이썬 list", items: ["타입 섞어 담기 가능", "`append` 로 길이가 늘어난다"] },
            { title: "자바 배열", items: ["한 가지 타입만", "만들 때 정한 길이가 끝까지 고정"] },
          ],
        },
        {
          type: "tip",
          kind: "analogy",
          text: "배열은 칸 수가 정해진 계란판. 10구 판에 11번째 계란은 못 넣는다. 더 필요하면 큰 판을 새로 사야 한다.",
        },
        { type: "h2", text: "선언 → 생성 → 값 넣기" },
        {
          type: "list",
          style: "flow",
          items: [
            "`int[] scores;` 배열을 가리킬 변수 선언",
            "`new int[3]` 칸 3개짜리 배열을 메모리에 생성",
            "`scores[0] = 90;` 인덱스로 칸에 값 저장",
          ],
        },
        {
          type: "code",
          code: `int[] scores = new int[3];
System.out.println(scores[0]);
scores[0] = 90;
System.out.println(scores[0]);
System.out.println(scores.length);`,
          out: "0\n90\n3",
        },
        { type: "h2", text: "칸은 기본값으로 채워진다" },
        {
          type: "table",
          head: ["타입", "기본값"],
          rows: [
            ["`int` `long` `byte` `short`", "`0`"],
            ["`double` `float`", "`0.0`"],
            ["`boolean`", "`false`"],
            ["`char`", "`'\\u0000'` (빈 문자)"],
            ["`String` 등 참조 타입", "`null`"],
          ],
        },
        {
          type: "code",
          code: `int[] nums = {10, 20, 30};
String[] names = new String[2];
double[] ds = new double[2];
boolean[] flags = new boolean[2];
System.out.println(nums[1]);
System.out.println(names[0]);
System.out.println(ds[0]);
System.out.println(flags[0]);`,
          out: "20\nnull\n0.0\nfalse",
        },
        { type: "h2", text: "중괄호 초기화는 선언할 때만" },
        {
          type: "compare",
          cols: [
            { title: "컴파일 에러", tone: "bad", items: ["`int[] a;`", "`a = {1, 2};`", "illegal start of expression"] },
            { title: "정상", tone: "good", items: ["`int[] a = {1, 2};` 선언과 동시에", "`a = new int[]{1, 2};` 나중에 넣을 땐 `new` 붙이기"] },
          ],
        },
        {
          type: "list",
          style: "check",
          items: [
            "배열은 한 타입, 길이 고정",
            "`new` 로 만들면 칸이 0·0.0·false·null 로 채워진다",
            "`{...}` 초기화는 선언 줄에서만, 나중엔 `new int[]{...}`",
          ],
        },
      ],
    },
    {
      id: "n-jv-3-2",
      emoji: "🔁",
      title: "배열 순회와 인덱스 범위",
      summary: "length 로 도는 for, 값만 꺼내는 향상된 for, 범위 밖 인덱스 예외",
      blocks: [
        { type: "key", text: "인덱스는 0 부터 length - 1 까지" },
        { type: "h2", text: "두 가지 for" },
        {
          type: "code",
          code: `int[] scores = {90, 85, 77};
for (int i = 0; i < scores.length; i++) {
    System.out.println(i + ": " + scores[i]);
}
int sum = 0;
for (int s : scores) {
    sum += s;
}
System.out.println("합계 " + sum);`,
          out: "0: 90\n1: 85\n2: 77\n합계 252",
        },
        {
          type: "compare",
          cols: [
            { title: "기본 for", items: ["인덱스 `i` 를 쓸 수 있다", "칸의 값을 바꿀 때", "일부 구간만 돌 때"] },
            { title: "향상된 for", items: ["`for (int s : scores)`", "파이썬 `for s in scores:` 와 같은 모양", "값을 읽기만 할 때"] },
          ],
        },
        { type: "h2", text: "향상된 for 로는 값을 못 바꾼다" },
        {
          type: "code",
          code: `int[] scores = {90, 85, 77};
for (int s : scores) {
    s = 0;               // 복사본만 바뀐다
}
System.out.println(scores[0]);
for (int i = 0; i < scores.length; i++) {
    scores[i] = 0;       // 칸을 직접 바꾼다
}
System.out.println(scores[0]);`,
          out: "90\n0",
        },
        { type: "h2", text: "범위 밖 인덱스는 예외" },
        {
          type: "code",
          code: `int[] scores = {90, 85, 77};
System.out.println(scores[3]);`,
          out: 'Exception in thread "main" java.lang.ArrayIndexOutOfBoundsException: Index 3 out of bounds for length 3',
        },
        {
          type: "tip",
          kind: "warn",
          text: "자바에는 음수 인덱스가 없다. 파이썬처럼 `scores[-1]` 로 마지막 값을 꺼내면 `Index -1 out of bounds` 예외. 마지막 칸은 `scores[scores.length - 1]`.",
        },
        {
          type: "tip",
          kind: "memo",
          text: "배열 길이는 `scores.length` (괄호 없음, 필드). 문자열 길이는 `s.length()` (괄호 있음, 메서드). 헷갈리기 쉽다.",
        },
        {
          type: "list",
          style: "check",
          items: [
            "조건은 `i < arr.length`, `<=` 쓰면 마지막에 예외",
            "읽기만 하면 향상된 for, 바꾸려면 인덱스 for",
            "음수 인덱스 없음, 마지막은 `length - 1`",
          ],
        },
      ],
    },
    {
      id: "n-jv-3-3",
      emoji: "🧮",
      title: "다차원 배열",
      summary: "배열 안에 배열을 담는 2차원 배열, 행·열 길이와 이중 for",
      blocks: [
        { type: "key", text: "2차원 배열은 배열을 칸으로 가진 배열" },
        { type: "h2", text: "행과 열" },
        {
          type: "code",
          code: `int[][] grid = {
    {1, 2, 3},
    {4, 5, 6}
};
System.out.println(grid[1][2]);
System.out.println(grid.length);
System.out.println(grid[0].length);`,
          out: "6\n2\n3",
        },
        {
          type: "table",
          head: ["표현", "뜻"],
          rows: [
            ["`grid[1][2]`", "1행 2열 (0부터 셈)"],
            ["`grid.length`", "행 개수"],
            ["`grid[0].length`", "0행의 열 개수"],
          ],
        },
        {
          type: "tip",
          kind: "analogy",
          text: "아파트 동 안에 층, 층 안에 호. `grid[1]` 이 한 층(배열 하나)이고 `grid[1][2]` 가 그 층의 2호.",
        },
        { type: "h2", text: "이중 for 로 전체 돌기" },
        {
          type: "code",
          code: `for (int[] row : grid) {
    for (int v : row) {
        System.out.print(v + " ");
    }
    System.out.println();
}`,
          out: "1 2 3 \n4 5 6 ",
        },
        { type: "h2", text: "행마다 길이가 달라도 된다" },
        {
          type: "code",
          code: `int[][] board = new int[2][3];
System.out.println(Arrays.deepToString(board));

int[][] tri = new int[3][];   // 열 길이는 비워 둠
tri[0] = new int[1];
tri[1] = new int[2];
tri[2] = new int[3];
System.out.println(Arrays.deepToString(tri));`,
          out: "[[0, 0, 0], [0, 0, 0]]\n[[0], [0, 0], [0, 0, 0]]",
        },
        {
          type: "tip",
          kind: "memo",
          text: "`Arrays` 는 `import java.util.Arrays;` 가 필요. 2차원 이상은 `toString` 대신 `deepToString` 으로 찍는다.",
        },
        {
          type: "list",
          style: "check",
          items: [
            "`arr[행][열]`, 행 수는 `arr.length`, 열 수는 `arr[i].length`",
            "바깥 for 는 행, 안쪽 for 는 열",
            "`new int[3][]` 처럼 행마다 다른 길이 가능",
          ],
        },
      ],
    },
    {
      id: "n-jv-3-4",
      emoji: "📋",
      title: "배열 복사와 Arrays 도구",
      summary: "= 는 같은 배열을 가리킬 뿐, copyOf·clone 으로 진짜 복사, toString·sort",
      blocks: [
        { type: "key", text: "`b = a` 는 복사가 아니라 주소 공유" },
        { type: "h2", text: "참조 복사의 함정" },
        {
          type: "code",
          code: `int[] a = {1, 2, 3};
int[] b = a;
b[0] = 99;
System.out.println(a[0]);
System.out.println(a == b);`,
          out: "99\ntrue",
        },
        {
          type: "tip",
          kind: "analogy",
          text: "`b = a` 는 같은 집 주소를 쪽지에 하나 더 적은 것. 어느 쪽지로 찾아가도 같은 집이라 가구를 옮기면 둘 다 바뀐다. 파이썬 `b = a` 리스트와 똑같다.",
        },
        { type: "h2", text: "새 배열로 복사하기" },
        {
          type: "code",
          code: `int[] a = {1, 2, 3};
int[] c = Arrays.copyOf(a, a.length);
int[] d = a.clone();
int[] e = Arrays.copyOf(a, 5);
c[0] = 0;
System.out.println(Arrays.toString(a));
System.out.println(Arrays.toString(c));
System.out.println(Arrays.toString(d));
System.out.println(Arrays.toString(e));
System.out.println(Arrays.toString(Arrays.copyOfRange(a, 1, 3)));`,
          out: "[1, 2, 3]\n[0, 2, 3]\n[1, 2, 3]\n[1, 2, 3, 0, 0]\n[2, 3]",
        },
        {
          type: "table",
          head: ["방법", "특징"],
          rows: [
            ["`Arrays.copyOf(a, n)`", "길이 n 으로 복사, 남는 칸은 기본값 (배열 늘리기에 씀)"],
            ["`Arrays.copyOfRange(a, from, to)`", "구간 복사, to 미포함 (파이썬 슬라이싱 느낌)"],
            ["`a.clone()`", "같은 길이 그대로 복사"],
            ["`System.arraycopy(...)`", "이미 있는 배열의 특정 위치에 덮어쓰기"],
          ],
        },
        { type: "h2", text: "출력과 정렬" },
        {
          type: "code",
          code: `int[] nums = {5, 2, 9, 1};
System.out.println(Arrays.toString(nums));
Arrays.sort(nums);
System.out.println(Arrays.toString(nums));

String[] words = {"banana", "apple", "cherry"};
Arrays.sort(words);
System.out.println(Arrays.toString(words));`,
          out: "[5, 2, 9, 1]\n[1, 2, 5, 9]\n[apple, banana, cherry]",
        },
        {
          type: "tip",
          kind: "warn",
          text: "`System.out.println(nums)` 는 값이 아니라 `[I@58fdd99` 같은 타입·해시 문자열을 찍는다. 내용을 보려면 `Arrays.toString(nums)`.",
        },
        {
          type: "tip",
          kind: "memo",
          text: "`Arrays.sort` 는 원본을 직접 바꾸고 아무것도 돌려주지 않는다. 파이썬 `list.sort()` 와 같은 쪽이다.",
        },
        {
          type: "list",
          style: "check",
          items: [
            "`=` 는 주소 공유, 진짜 복사는 `copyOf` `clone`",
            "배열 내용 출력은 `Arrays.toString`",
            "`Arrays.sort` 는 원본을 오름차순으로 바꾼다",
          ],
        },
      ],
    },
    {
      id: "n-jv-3-5",
      emoji: "🔤",
      title: "String 기본: 불변과 비교",
      summary: "한번 만든 문자열은 안 바뀐다, 리터럴 풀, == 대신 equals 로 비교",
      blocks: [
        { type: "key", text: "문자열 내용 비교는 무조건 `equals`" },
        { type: "h2", text: "String 은 불변" },
        {
          type: "code",
          code: `String s = "hi";
s.toUpperCase();          // 새 문자열을 만들고 버림
System.out.println(s);
s = s.toUpperCase();      // 새 문자열을 다시 받아야 바뀐다
System.out.println(s);`,
          out: "hi\nHI",
        },
        {
          type: "tip",
          kind: "memo",
          text: "파이썬 str 과 같다. 바꾸는 메서드는 전부 새 문자열을 돌려준다. 결과를 변수에 다시 담지 않으면 아무 일도 안 일어난다.",
        },
        { type: "h2", text: "리터럴 풀과 new String" },
        {
          type: "compare",
          cols: [
            { title: "`\"java\"` 리터럴", items: ["상수 풀에 하나만 만들어 재사용", "같은 리터럴은 같은 객체"] },
            { title: "`new String(\"java\")`", items: ["힙에 매번 새 객체", "내용이 같아도 다른 객체"] },
          ],
        },
        {
          type: "code",
          code: `String a = "java";
String b = "java";
String c = new String("java");
System.out.println(a == b);
System.out.println(a == c);
System.out.println(a.equals(c));`,
          out: "true\nfalse\ntrue",
        },
        { type: "h2", text: "== 와 equals" },
        {
          type: "table",
          head: ["비교", "보는 것", "파이썬으로 치면"],
          rows: [
            ["`a == b`", "같은 객체(주소)인가", "`a is b`"],
            ["`a.equals(b)`", "내용이 같은가", "`a == b`"],
          ],
        },
        {
          type: "tip",
          kind: "warn",
          text: "`a == b` 가 리터럴끼리는 우연히 `true` 라서 맞는 줄 착각한다. 입력값이나 계산 결과는 새 객체라 `false` 가 난다. 문자열은 항상 `equals`.",
        },
        {
          type: "code",
          code: `String t = null;
System.out.println("hi".equals(t));
System.out.println("JAVA".equalsIgnoreCase("java"));`,
          out: "false\ntrue",
        },
        {
          type: "tip",
          kind: "memo",
          text: "`t.equals(\"hi\")` 는 `t` 가 `null` 이면 NullPointerException. 확실한 값 쪽에서 `\"hi\".equals(t)` 로 부르면 안전하다.",
        },
        {
          type: "list",
          style: "check",
          items: [
            "String 은 불변, 바꾼 결과는 다시 대입",
            "`==` 는 주소, `equals` 는 내용",
            "null 가능성이 있으면 `\"상수\".equals(변수)`",
          ],
        },
      ],
    },
    {
      id: "n-jv-3-6",
      emoji: "🛠️",
      title: "String 메서드와 StringBuilder",
      summary: "자주 쓰는 String 메서드, 반복해서 이어 붙일 땐 StringBuilder",
      blocks: [
        { type: "key", text: "읽고 자르는 건 String, 반복해서 붙이는 건 StringBuilder" },
        { type: "h2", text: "자주 쓰는 메서드" },
        {
          type: "code",
          code: `String s = "Hello, Java";
System.out.println(s.length());
System.out.println(s.charAt(0));
System.out.println(s.substring(7));
System.out.println(s.substring(0, 5));
System.out.println(s.indexOf("Java"));
System.out.println(s.contains("lo"));
System.out.println(s.replace("Java", "World"));
System.out.println(s.toLowerCase());
System.out.println("  hi  ".trim());`,
          out: "11\nH\nJava\nHello\n7\ntrue\nHello, World\nhello, java\nhi",
        },
        {
          type: "table",
          head: ["자바", "파이썬", "뜻"],
          rows: [
            ["`s.length()`", "`len(s)`", "길이"],
            ["`s.charAt(i)`", "`s[i]`", "i번째 글자 (`char`)"],
            ["`s.substring(a, b)`", "`s[a:b]`", "구간 자르기, b 미포함"],
            ["`s.indexOf(x)`", "`s.find(x)`", "위치, 없으면 -1"],
            ["`s.contains(x)`", "`x in s`", "포함 여부"],
            ["`s.trim()`", "`s.strip()`", "앞뒤 공백 제거"],
          ],
        },
        { type: "h2", text: "split 과 join" },
        {
          type: "code",
          code: `String csv = "kim,lee,park";
String[] parts = csv.split(",");
System.out.println(parts.length);
System.out.println(Arrays.toString(parts));
System.out.println(String.join(" / ", parts));`,
          out: "3\n[kim, lee, park]\nkim / lee / park",
        },
        { type: "h2", text: "+ 연결은 왼쪽부터" },
        {
          type: "code",
          code: `System.out.println("a" + 1 + 2);
System.out.println(1 + 2 + "a");`,
          out: "a12\n3a",
        },
        {
          type: "p",
          text: "문자열을 만나는 순간부터 `+` 는 이어 붙이기가 된다. 앞에서 숫자끼리 만나면 먼저 더해진다.",
        },
        { type: "h2", text: "StringBuilder: 고쳐 쓰는 문자열" },
        {
          type: "compare",
          cols: [
            { title: "반복문 안 `s += i`", tone: "bad", items: ["돌 때마다 새 String 객체 생성", "횟수가 많으면 느리고 메모리 낭비"] },
            { title: "`StringBuilder`", tone: "good", items: ["한 버퍼에 계속 덧붙인다", "다 만들고 `toString()` 한 번"] },
          ],
        },
        {
          type: "code",
          code: `StringBuilder sb = new StringBuilder();
for (int i = 1; i <= 5; i++) {
    sb.append(i).append(",");
}
sb.setLength(sb.length() - 1);   // 마지막 쉼표 제거
System.out.println(sb.toString());
sb.reverse();
System.out.println(sb);`,
          out: "1,2,3,4,5\n5,4,3,2,1",
        },
        {
          type: "tip",
          kind: "analogy",
          text: "String 은 한 번 쓰면 끝인 인쇄물이라 한 글자 고치려면 새로 인쇄한다. StringBuilder 는 화이트보드라 그 자리에서 지우고 덧쓴다.",
        },
        {
          type: "list",
          style: "check",
          items: [
            "`substring(a, b)` 는 b 미포함, `indexOf` 는 없으면 -1",
            "`+` 는 문자열을 만난 뒤부터 이어 붙이기",
            "반복문에서 붙이기는 `StringBuilder.append`",
          ],
        },
      ],
    },
  ],
};
