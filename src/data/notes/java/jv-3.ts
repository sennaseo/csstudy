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
      summary: "같은 타입 값을 정해진 칸 수로 묶는 배열, new 로 만들기와 기본값",
      blocks: [
        { type: "key", text: "같은 종류 값만, 처음 정한 칸 수만큼 담는 상자 줄" },
        {type: "figure", kind: "flow", nodes: [{icon: "📝", label: "`int[] a`", sub: "선언"}, {icon: "🏗️", label: "`new int[3]`", sub: "칸 3개", ink: "blue"}, {icon: "📦", label: "[0, 0, 0]", sub: "기본값", ink: "green"}]},
        { type: "h2", text: "파이썬 리스트와 다른 점" },
        {
          type: "compare",
          cols: [
            { title: "파이썬 list", items: ["숫자·문자열을 섞어 담아도 된다", "`append` 로 길이가 늘어난다"] },
            { title: "자바 배열", items: ["한 가지 타입만 담는다", "만들 때 정한 길이가 끝까지 그대로"] },
          ],
        },
        {
          type: "tip",
          kind: "analogy",
          text: "배열은 칸 수가 정해진 계란판이다. 10구 판에 11번째 계란은 못 넣는다. 더 필요하면 큰 판을 새로 사야 한다.",
        },
        { type: "h2", text: "선언 → 생성 → 값 넣기" },
        {
          type: "list",
          style: "flow",
          items: [
            "`int[] scores;` 배열을 가리킬 변수 이름만 만든다",
            "`new int[3]` 칸 3개짜리 배열을 실제로 만든다",
            "`scores[0] = 90;` 칸 번호(인덱스)로 값을 넣는다",
          ],
        },
        {
          type: "code",
          code: `int[] scores = new int[3];       // 칸 3개, 처음엔 전부 0
System.out.println(scores[0]);
scores[0] = 90;                  // 0번 칸에 90
System.out.println(scores[0]);
System.out.println(scores.length); // 칸 개수`,
          out: "0\n90\n3",
        },
        { type: "h2", text: "빈 칸은 기본값으로 채워진다" },
        {
          type: "table",
          head: ["타입", "처음 들어 있는 값"],
          rows: [
            ["`int` `long` `byte` `short`", "`0`"],
            ["`double` `float`", "`0.0`"],
            ["`boolean`", "`false`"],
            ["`char`", "`'\\u0000'` (빈 문자)"],
            ["`String` 같은 객체 타입", "`null` (아무것도 안 가리킴)"],
          ],
        },
        {
          type: "code",
          code: `int[] nums = {10, 20, 30};          // 만들면서 값까지 넣기
String[] names = new String[2];
double[] ds = new double[2];
boolean[] flags = new boolean[2];
System.out.println(nums[1]);
System.out.println(names[0]);      // 아직 아무 문자열도 없음
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
      summary: "length 로 도는 for, 값만 꺼내는 향상된 for, 범위 밖 번호 에러",
      blocks: [
        { type: "key", text: "칸 번호는 0번부터, 마지막 칸은 칸 수보다 하나 작다" },
        {type: "figure", kind: "stack", layers: [{icon: "📦", label: "10 · 20 · 30", sub: "값"}, {icon: "🔢", label: "0 · 1 · 2", sub: "인덱스", ink: "blue"}, {icon: "💥", label: "`a[3]`", sub: "범위 밖 → 예외", ink: "red"}]},
        { type: "h2", text: "두 가지 for" },
        {
          type: "code",
          code: `int[] scores = {90, 85, 77};
for (int i = 0; i < scores.length; i++) {   // i 는 0, 1, 2
    System.out.println(i + ": " + scores[i]);
}
int sum = 0;
for (int s : scores) {                       // 값을 하나씩 s 에 꺼낸다
    sum += s;
}
System.out.println("합계 " + sum);`,
          out: "0: 90\n1: 85\n2: 77\n합계 252",
        },
        {
          type: "compare",
          cols: [
            { title: "기본 for", items: ["칸 번호 `i` 를 쓸 수 있다", "칸의 값을 바꿀 때", "일부 구간만 돌 때"] },
            { title: "향상된 for", items: ["`for (int s : scores)`", "파이썬 `for s in scores:` 와 같은 모양", "값을 읽기만 할 때"] },
          ],
        },
        { type: "h2", text: "향상된 for 로는 값을 못 바꾼다" },
        {
          type: "code",
          code: `int[] scores = {90, 85, 77};
for (int s : scores) {
    s = 0;               // 꺼낸 복사본만 바뀐다
}
System.out.println(scores[0]);
for (int i = 0; i < scores.length; i++) {
    scores[i] = 0;       // 칸을 직접 바꾼다
}
System.out.println(scores[0]);`,
          out: "90\n0",
        },
        {
          type: "tip",
          kind: "analogy",
          text: "향상된 for 의 `s` 는 칸 안 값을 베껴 쓴 메모지다. 메모지를 고쳐도 원래 칸은 그대로다.",
        },
        { type: "h2", text: "없는 칸 번호는 에러" },
        {
          type: "code",
          code: `int[] scores = {90, 85, 77};
System.out.println(scores[3]);   // 칸은 0~2 뿐`,
          out: 'Exception in thread "main" java.lang.ArrayIndexOutOfBoundsException: Index 3 out of bounds for length 3',
        },
        {
          type: "tip",
          kind: "warn",
          text: "자바에는 음수 인덱스가 없다. 파이썬처럼 `scores[-1]` 을 쓰면 `Index -1 out of bounds` 에러가 난다. 마지막 칸은 `scores[scores.length - 1]`.",
        },
        {
          type: "tip",
          kind: "memo",
          text: "배열 길이는 `scores.length` (괄호 없음). 문자열 길이는 `s.length()` (괄호 있음). 헷갈리기 쉽다.",
        },
        {
          type: "list",
          style: "check",
          items: [
            "조건은 `i < arr.length`, `<=` 쓰면 마지막에 에러",
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
        { type: "key", text: "2차원 배열은 줄마다 또 하나의 배열이 들어 있는 표" },
        {type: "figure", kind: "refs", vars: [{name: "m[0]", to: 0}, {name: "m[1]", to: 1}], objs: [{icon: "📦", label: "[1, 2, 3]", sub: "0행"}, {icon: "📦", label: "[4, 5]", sub: "1행 (길이 달라도 됨)", ink: "blue"}], caption: "2차원 배열 = 배열을 칸으로 가진 배열"},
        { type: "h2", text: "행과 열" },
        {
          type: "code",
          code: `int[][] grid = {
    {1, 2, 3},      // 0행
    {4, 5, 6}       // 1행
};
System.out.println(grid[1][2]);      // 1행의 2번 칸
System.out.println(grid.length);     // 행이 몇 줄인가
System.out.println(grid[0].length);  // 0행에 칸이 몇 개인가`,
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
          text: "아파트에 층이 있고, 층마다 호가 있다. `grid[1]` 이 한 층(배열 하나)이고 `grid[1][2]` 가 그 층의 2호다.",
        },
        { type: "h2", text: "이중 for 로 전체 돌기" },
        {
          type: "code",
          code: `for (int[] row : grid) {        // 한 층(행)씩 꺼낸다
    for (int v : row) {         // 그 층의 호(칸)를 하나씩
        System.out.print(v + " ");
    }
    System.out.println();       // 한 줄 끝나면 줄바꿈
}`,
          out: "1 2 3 \n4 5 6 ",
        },
        { type: "h2", text: "행마다 길이가 달라도 된다" },
        {
          type: "code",
          code: `int[][] board = new int[2][3];   // 2행 3열, 전부 0
System.out.println(Arrays.deepToString(board));

int[][] tri = new int[3][];   // 행만 3개, 열 길이는 비워 둠
tri[0] = new int[1];          // 0행은 칸 1개
tri[1] = new int[2];
tri[2] = new int[3];
System.out.println(Arrays.deepToString(tri));`,
          out: "[[0, 0, 0], [0, 0, 0]]\n[[0], [0, 0], [0, 0, 0]]",
        },
        {
          type: "tip",
          kind: "memo",
          text: "`Arrays` 는 `import java.util.Arrays;` 가 필요하다. 2차원 이상은 `toString` 대신 `deepToString` 으로 찍는다.",
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
        { type: "key", text: "`b = a` 는 배열을 하나 더 만드는 게 아니라 같은 배열에 이름을 하나 더 붙인다" },
        {type: "figure", kind: "refs", vars: [{name: "a", to: 0}, {name: "b = a", to: 0}, {name: "c = a.clone()", to: 1}], objs: [{icon: "📦", label: "[1, 2]", sub: "같은 배열 공유", ink: "red"}, {icon: "📦", label: "[1, 2]", sub: "새 배열", ink: "green"}]},
        { type: "h2", text: "= 는 복사가 아니다" },
        {
          type: "code",
          code: `int[] a = {1, 2, 3};
int[] b = a;          // 같은 배열을 b 도 가리킨다
b[0] = 99;
System.out.println(a[0]);    // b 로 바꿨는데 a 도 바뀜
System.out.println(a == b);  // 같은 배열인가?`,
          out: "99\ntrue",
        },
        {
          type: "compare",
          cols: [
            { title: "`b = a`", tone: "bad", items: ["같은 집 주소를 쪽지에 한 장 더 적은 것", "어느 쪽지로 가도 같은 집", "가구를 옮기면 둘 다 바뀐다"] },
            { title: "`a.clone()`", tone: "good", items: ["똑같은 집을 한 채 더 지은 것", "주소가 다른 두 집", "한쪽을 고쳐도 다른 쪽은 그대로"] },
          ],
        },
        {
          type: "p",
          text: "변수에는 배열 자체가 아니라 배열이 있는 곳의 주소(참조)가 들어 있다. 파이썬 리스트의 `b = a` 와 똑같다.",
        },
        { type: "h2", text: "새 배열로 복사하기" },
        {
          type: "code",
          code: `int[] a = {1, 2, 3};
int[] c = Arrays.copyOf(a, a.length);  // 같은 길이로 새로 복사
int[] d = a.clone();                   // 위와 같은 결과
int[] e = Arrays.copyOf(a, 5);         // 길이 5, 남는 칸은 0
c[0] = 0;                              // c 만 바뀐다
System.out.println(Arrays.toString(a));
System.out.println(Arrays.toString(c));
System.out.println(Arrays.toString(d));
System.out.println(Arrays.toString(e));
System.out.println(Arrays.toString(Arrays.copyOfRange(a, 1, 3)));  // 1번~2번 칸`,
          out: "[1, 2, 3]\n[0, 2, 3]\n[1, 2, 3]\n[1, 2, 3, 0, 0]\n[2, 3]",
        },
        {
          type: "table",
          head: ["방법", "하는 일"],
          rows: [
            ["`Arrays.copyOf(a, n)`", "길이 n 으로 복사, 남는 칸은 기본값 (배열 늘리기에 씀)"],
            ["`Arrays.copyOfRange(a, from, to)`", "구간 복사, to 는 빼고 (파이썬 슬라이싱 느낌)"],
            ["`a.clone()`", "같은 길이 그대로 복사"],
            ["`System.arraycopy(...)`", "이미 있는 배열의 특정 위치에 덮어쓰기"],
          ],
        },
        { type: "h2", text: "출력과 정렬" },
        {
          type: "code",
          code: `int[] nums = {5, 2, 9, 1};
System.out.println(Arrays.toString(nums));
Arrays.sort(nums);                        // nums 자체가 정렬된다
System.out.println(Arrays.toString(nums));

String[] words = {"banana", "apple", "cherry"};
Arrays.sort(words);                       // 문자열은 사전 순
System.out.println(Arrays.toString(words));`,
          out: "[5, 2, 9, 1]\n[1, 2, 5, 9]\n[apple, banana, cherry]",
        },
        {
          type: "tip",
          kind: "warn",
          text: "`System.out.println(nums)` 는 값이 아니라 `[I@58fdd99` 같은 알 수 없는 문자열을 찍는다. 내용을 보려면 `Arrays.toString(nums)`.",
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
            "`=` 는 같은 배열 공유, 진짜 복사는 `copyOf` `clone`",
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
      summary: "한번 만든 문자열은 안 바뀐다, == 대신 equals 로 내용 비교",
      blocks: [
        { type: "key", text: "글자가 같은지 물을 땐 `==` 말고 `equals`" },
        {type: "figure", kind: "refs", vars: [{name: "s1 = \"hi\"", to: 0}, {name: "s2 = \"hi\"", to: 0}, {name: "s3 = new", to: 1}], objs: [{icon: "🏊", label: "\"hi\"", sub: "리터럴 풀"}, {icon: "🆕", label: "\"hi\"", sub: "새 객체", ink: "red"}], caption: "`s1 == s3` 는 false → 내용 비교는 `equals`"},
        { type: "h2", text: "String 은 한번 만들면 못 바꾼다" },
        {
          type: "p",
          text: "String 은 불변(만든 뒤 내용을 못 바꿈)이다. 바꾸는 듯한 메서드는 전부 새 문자열을 만들어 돌려준다.",
        },
        {
          type: "code",
          code: `String s = "hi";
s.toUpperCase();          // 새 문자열 "HI" 를 만들고 그냥 버림
System.out.println(s);
s = s.toUpperCase();      // 새 문자열을 다시 받아야 바뀐다
System.out.println(s);`,
          out: "hi\nHI",
        },
        {
          type: "tip",
          kind: "memo",
          text: "파이썬 str 과 같다. 결과를 변수에 다시 담지 않으면 아무 일도 안 일어난다.",
        },
        { type: "h2", text: "== 와 equals" },
        {
          type: "table",
          head: ["비교", "묻는 것", "파이썬으로 치면"],
          rows: [
            ["`a == b`", "같은 객체(같은 메모리 위치)인가", "`a is b`"],
            ["`a.equals(b)`", "글자 내용이 같은가", "`a == b`"],
          ],
        },
        {
          type: "tip",
          kind: "analogy",
          text: "일란성 쌍둥이는 생김새(내용)가 같아서 `equals` 는 `true` 다. 그래도 서로 다른 사람이라 `==` 는 `false` 다.",
        },
        {
          type: "code",
          code: `String a = "java";
String b = "java";               // a 와 같은 객체를 재사용
String c = new String("java");   // 내용만 같은 새 객체
System.out.println(a == b);
System.out.println(a == c);
System.out.println(a.equals(c));`,
          out: "true\nfalse\ntrue",
        },
        { type: "h2", text: "왜 a == b 는 true 였나" },
        {
          type: "compare",
          cols: [
            { title: "`\"java\"` 처럼 따옴표로 쓴 값", items: ["상수 풀(같은 글자를 한 번만 보관하는 창고)에서 꺼낸다", "같은 글자면 같은 객체"] },
            { title: "`new String(\"java\")`", items: ["힙(객체가 생기는 메모리 공간)에 매번 새로 만든다", "내용이 같아도 다른 객체"] },
          ],
        },
        {
          type: "tip",
          kind: "warn",
          text: "따옴표 값끼리는 `==` 가 우연히 `true` 라서 맞는 줄 착각한다. 입력값이나 계산 결과는 새 객체라 `false` 가 난다. 문자열은 항상 `equals`.",
        },
        {
          type: "code",
          code: `String t = null;
System.out.println("hi".equals(t));                  // 확실한 쪽에서 부르면 안전
System.out.println("JAVA".equalsIgnoreCase("java")); // 대소문자 무시`,
          out: "false\ntrue",
        },
        {
          type: "tip",
          kind: "memo",
          text: "`t.equals(\"hi\")` 는 `t` 가 `null` 이면 NullPointerException(빈 변수로 메서드를 부른 에러)이 난다. `\"hi\".equals(t)` 순서로 쓰면 안전하다.",
        },
        {
          type: "list",
          style: "check",
          items: [
            "String 은 불변, 바꾼 결과는 다시 대입",
            "`==` 는 같은 객체인지, `equals` 는 내용",
            "null 일 수 있으면 `\"상수\".equals(변수)`",
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
        { type: "key", text: "읽고 자를 땐 String, 계속 덧붙일 땐 StringBuilder" },
        {type: "figure", kind: "tree", root: {icon: "🔤", label: "문자열 다루기"}, children: [{icon: "📖", label: "`String`", sub: "읽기·자르기", leaves: ["`substring`", "`split`"]}, {icon: "🧱", label: "`StringBuilder`", sub: "반복해서 붙이기", ink: "green", leaves: ["`append`", "`reverse`"]}]},
        { type: "h2", text: "자주 쓰는 메서드" },
        {
          type: "code",
          code: `String s = "Hello, Java";
System.out.println(s.length());
System.out.println(s.charAt(0));          // 0번 글자
System.out.println(s.substring(7));       // 7번부터 끝까지
System.out.println(s.substring(0, 5));    // 0~4번 (5는 빠짐)
System.out.println(s.indexOf("Java"));    // "Java" 가 시작하는 위치
System.out.println(s.contains("lo"));
System.out.println(s.replace("Java", "World"));
System.out.println(s.toLowerCase());
System.out.println("  hi  ".trim());      // 앞뒤 공백 제거`,
          out: "11\nH\nJava\nHello\n7\ntrue\nHello, World\nhello, java\nhi",
        },
        {
          type: "table",
          head: ["자바", "파이썬", "뜻"],
          rows: [
            ["`s.length()`", "`len(s)`", "길이"],
            ["`s.charAt(i)`", "`s[i]`", "i번째 글자 (`char` 한 글자)"],
            ["`s.substring(a, b)`", "`s[a:b]`", "구간 자르기, b 는 빼고"],
            ["`s.indexOf(x)`", "`s.find(x)`", "위치, 없으면 -1"],
            ["`s.contains(x)`", "`x in s`", "들어 있는가"],
            ["`s.trim()`", "`s.strip()`", "앞뒤 공백 제거"],
          ],
        },
        { type: "h2", text: "split 과 join" },
        {
          type: "code",
          code: `String csv = "kim,lee,park";
String[] parts = csv.split(",");     // 쉼표로 잘라 배열로
System.out.println(parts.length);
System.out.println(Arrays.toString(parts));
System.out.println(String.join(" / ", parts));  // 사이사이 " / " 넣어 합치기`,
          out: "3\n[kim, lee, park]\nkim / lee / park",
        },
        { type: "h2", text: "+ 연결은 왼쪽부터" },
        {
          type: "code",
          code: `System.out.println("a" + 1 + 2);   // "a1" 다음 "a12"
System.out.println(1 + 2 + "a");   // 3 다음 "3a"`,
          out: "a12\n3a",
        },
        {
          type: "p",
          text: "문자열을 만나는 순간부터 `+` 는 이어 붙이기가 된다. 그 전에 숫자끼리 만나면 먼저 더해진다.",
        },
        { type: "h2", text: "StringBuilder: 고쳐 쓰는 문자열" },
        {
          type: "compare",
          cols: [
            { title: "반복문 안 `s += i`", tone: "bad", items: ["한 번 찍으면 끝인 인쇄물", "붙일 때마다 새 String 을 다시 만든다", "횟수가 많으면 느리다"] },
            { title: "`StringBuilder`", tone: "good", items: ["지우고 덧쓰는 화이트보드", "버퍼(글자를 모아 두는 작업 공간) 하나에 계속 붙인다", "다 만들고 `toString()` 한 번"] },
          ],
        },
        {
          type: "code",
          code: `StringBuilder sb = new StringBuilder();
for (int i = 1; i <= 5; i++) {
    sb.append(i).append(",");     // 같은 sb 에 계속 덧붙임
}
sb.setLength(sb.length() - 1);   // 마지막 쉼표 제거
System.out.println(sb.toString());
sb.reverse();                    // sb 자체가 뒤집힌다
System.out.println(sb);`,
          out: "1,2,3,4,5\n5,4,3,2,1",
        },
        {
          type: "list",
          style: "check",
          items: [
            "`substring(a, b)` 는 b 빼고, `indexOf` 는 없으면 -1",
            "`+` 는 문자열을 만난 뒤부터 이어 붙이기",
            "반복문에서 붙이기는 `StringBuilder.append`",
          ],
        },
      ],
    },
  ],
};
