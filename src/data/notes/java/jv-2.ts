// 자바 단원 2 — 연산자와 제어문 (시중 입문서 목차 기준). 작성 규칙은 ../python.ts 상단 주석.
import type { NoteUnit } from "../types";

export const JV2: NoteUnit = {
  id: "jv-2",
  title: "연산자와 제어문",
  notes: [
    {
      id: "n-jv-2-1",
      emoji: "➗",
      title: "산술·증감 연산자",
      summary: "정수끼리 나누면 몫만, %는 나머지, ++는 앞에 붙나 뒤에 붙나가 핵심",
      blocks: [
        { type: "key", text: "정수끼리 나누면 나머지는 버려진다. ++ 는 앞에 붙나 뒤에 붙나로 순서가 갈린다" },
        {type: "figure", kind: "tree", root: {icon: "➗", label: "`7 / 2`"}, children: [{icon: "🔢", label: "int ÷ int", sub: "= 3 (버림)", ink: "red"}, {icon: "🎯", label: "double 섞기", sub: "`7 / 2.0` = 3.5", ink: "green"}]},
        { type: "h2", text: "산술 연산자" },
        {
          type: "table",
          head: ["기호", "뜻", "파이썬과 비교"],
          rows: [
            ["`+` `-` `*`", "덧셈, 뺄셈, 곱셈", "같음"],
            ["`/`", "나눗셈. 정수끼리면 몫만", "파이썬 `/` 는 항상 실수"],
            ["`%`", "나머지", "음수일 때 결과가 다름"],
            ["없음", "거듭제곱", "파이썬 `**` 대신 `Math.pow(2, 10)` (결과는 실수 1024.0)"],
          ],
        },
        {
          type: "code",
          code: `System.out.println(7 / 2);     // 정수끼리라 몫 3 만
System.out.println(7 / 2.0);   // 실수가 섞여 3.5
System.out.println(7 % 3);     // 나머지 1
System.out.println(-7 / 2);    // 0 쪽으로 버려서 -3
System.out.println(-7 % 3);    // 왼쪽 수(-7)의 부호를 따라 -1`,
          out: "3\n3.5\n1\n-3\n-1",
        },
        {
          type: "tip",
          kind: "warn",
          text: "파이썬 `-7 // 2` 는 -4, 자바 `-7 / 2` 는 -3. `-7 % 3` 도 파이썬은 2, 자바는 -1 이다.",
        },
        { type: "h2", text: "증감 연산자 ++ --" },
        {
          type: "p",
          text: "`++` 는 1 더하기, `--` 는 1 빼기다. 앞에 붙이면 전위, 뒤에 붙이면 후위라고 부른다.",
        },
        {
          type: "tip",
          kind: "analogy",
          text: "은행 번호표 기계를 떠올린다. `a++` 는 지금 번호를 뽑아 주고 나서 숫자를 올린다. `++a` 는 숫자를 먼저 올리고 새 번호를 준다.",
        },
        {
          type: "code",
          code: `int a = 5;
int b = a++;   // 후위: b 에 5 를 먼저 넣고, 그다음 a 가 6
System.out.println(a + " " + b);

int c = 5;
int d = ++c;   // 전위: c 를 먼저 6 으로 올리고, d 에 6
System.out.println(c + " " + d);`,
          out: "6 5\n6 6",
        },
        {
          type: "compare",
          cols: [
            { title: "전위 `++x`", items: ["먼저 1 증가", "증가한 값을 사용"] },
            { title: "후위 `x++`", items: ["지금 값을 먼저 사용", "그다음 1 증가"] },
          ],
        },
        {
          type: "tip",
          kind: "memo",
          text: "파이썬에는 `++` 가 없어서 `x += 1` 로 썼다. 혼자 한 줄에 쓰면 `x++` 와 `++x` 결과는 같다. 다른 식 안에 섞일 때만 차이가 난다.",
        },
        { type: "h2", text: "복합 대입 연산자" },
        {
          type: "p",
          text: "`x += 3` 은 `x = x + 3` 의 줄임말이다. 계산하고 같은 상자에 다시 넣는다.",
        },
        {
          type: "code",
          code: `int x = 10;
x += 3;   // x = x + 3 → 13
x *= 2;   // x = x * 2 → 26
System.out.println(x);`,
          out: "26",
        },
        {
          type: "list",
          style: "check",
          items: ["정수 `/` 정수는 몫만, 실수가 하나라도 있으면 실수", "음수 나눗셈·나머지는 파이썬과 다르다", "`a++` 는 쓰고 증가, `++a` 는 증가하고 씀"],
        },
      ],
    },
    {
      id: "n-jv-2-2",
      emoji: "⚖️",
      title: "비교·논리·삼항 연산자",
      summary: "&&·||·!와 단락 평가, 삼항 연산자, 문자열은 == 말고 equals",
      blocks: [
        { type: "key", text: "&& 와 || 는 답이 나오는 순간 나머지는 쳐다보지도 않는다" },
        {type: "figure", kind: "flow", nodes: [{icon: "🔍", label: "`false && …`"}, {icon: "🛑", label: "뒤는 계산 안 함", ink: "red"}, {icon: "↩️", label: "`false`", ink: "green"}], edges: ["왼쪽부터", "멈춤"]},
        { type: "h2", text: "비교·논리 연산자" },
        {
          type: "table",
          head: ["자바", "파이썬", "뜻"],
          rows: [
            ["`==` `!=` `<` `>` `<=` `>=`", "같음", "비교. 결과는 `true` 나 `false` (`boolean`)"],
            ["`&&`", "`and`", "둘 다 true 여야 true"],
            ["`||`", "`or`", "하나만 true 여도 true"],
            ["`!`", "`not`", "true ↔ false 뒤집기"],
          ],
        },
        {
          type: "tip",
          kind: "warn",
          text: "파이썬의 `1 < x < 10` 같은 연쇄 비교는 자바에서 컴파일 에러. `1 < x && x < 10` 으로 나눠 쓴다.",
        },
        { type: "h2", text: "단락 평가: 답이 나오면 멈춘다" },
        {
          type: "code",
          code: `int zero = 0;
System.out.println(zero != 0 && 10 / zero > 1);  // 왼쪽이 false 라 나누기는 실행 안 됨
System.out.println(zero == 0 || 10 / zero > 1);  // 왼쪽이 true 라 나누기는 실행 안 됨`,
          out: "false\ntrue",
        },
        {
          type: "list",
          style: "flow",
          items: ["`&&` 왼쪽이 false → 전체 false 확정, 오른쪽은 건너뜀", "`||` 왼쪽이 true → 전체 true 확정, 오른쪽은 건너뜀", "그래서 `10 / zero` 가 실행되지 않아 에러도 없다"],
        },
        {
          type: "tip",
          kind: "analogy",
          text: "면접관이 첫 질문에서 탈락을 정하면 다음 질문은 안 한다. 위험한 검사(0 으로 나누기)는 오른쪽에 두고 안전 검사를 왼쪽에 둔다.",
        },
        {
          type: "tip",
          kind: "memo",
          text: "이 동작을 단락 평가(short-circuit)라고 부른다. 전기 회로가 중간에서 끊기는 모습에서 온 이름이다.",
        },
        { type: "h2", text: "삼항 연산자: 한 줄짜리 if" },
        {
          type: "code",
          code: `int score = 85;
String r = score >= 60 ? "합격" : "불합격";   // 조건이 true 라 "합격"
System.out.println(r);`,
          out: "합격",
        },
        {
          type: "p",
          text: "`조건 ? 참일 때 값 : 거짓일 때 값` 순서다. 파이썬 `'합격' if score >= 60 else '불합격'` 과 같다.",
        },
        { type: "h2", text: "== 와 equals 맛보기" },
        {
          type: "code",
          code: `String s1 = "java";
String s2 = new String("java");   // 글자는 같지만 새 객체를 따로 만듦
System.out.println(s1 == s2);     // 같은 객체인가? 아니다
System.out.println(s1.equals(s2)); // 글자가 같은가? 같다`,
          out: "false\ntrue",
        },
        {
          type: "compare",
          cols: [
            { title: "`==`", tone: "bad", items: ["같은 사람인가?", "참조형이면 주소를 비교", "글자가 같아도 다른 객체면 false"] },
            { title: "`equals()`", tone: "good", items: ["생김새가 같은가?", "내용(글자)을 비교", "문자열 비교는 항상 이것"] },
          ],
        },
        {
          type: "list",
          style: "check",
          items: ["`&&` `||` `!` 는 파이썬 `and` `or` `not`", "답이 정해지면 오른쪽은 계산 안 함", "문자열 비교는 `==` 가 아니라 `equals()`"],
        },
      ],
    },
    {
      id: "n-jv-2-3",
      emoji: "🔀",
      title: "if / else if / else",
      summary: "조건은 괄호와 boolean, 블록은 중괄호, 파이썬 elif는 else if",
      blocks: [
        { type: "key", text: "위에서부터 차례로 묻고, 처음 '예'가 나온 곳 하나만 실행한다" },
        {type: "figure", kind: "flow", nodes: [{icon: "❓", label: "`if (조건)`", sub: "boolean 만"}, {icon: "❓", label: "`else if`"}, {icon: "🔚", label: "`else`"}], edges: ["false", "false"]},
        { type: "h2", text: "기본 모양" },
        {
          type: "code",
          code: `int score = 85;
if (score >= 90) {           // 85 >= 90? 아니오
    System.out.println("A");
} else if (score >= 80) {    // 85 >= 80? 예 → 여기만 실행
    System.out.println("B");
} else {                     // 앞에서 이미 걸려서 안 봄
    System.out.println("C");
}`,
          out: "B",
        },
        {
          type: "list",
          style: "flow",
          items: ["위에서부터 조건을 차례로 검사", "처음 true 인 블록 하나만 실행", "나머지는 검사도 안 하고 건너뜀"],
        },
        { type: "h2", text: "파이썬에서 넘어올 때" },
        {
          type: "compare",
          cols: [
            { title: "🐍 파이썬", items: ["`if score >= 90:`", "`elif`", "들여쓰기로 블록"] },
            { title: "☕ 자바", items: ["`if (score >= 90) {`", "`else if`", "중괄호로 블록, 들여쓰기는 보기용"] },
          ],
        },
        {
          type: "code",
          code: `int x = 1;
if (x) System.out.println(1);   // 숫자는 조건이 될 수 없다`,
          out: "error: incompatible types: int cannot be converted to boolean",
        },
        {
          type: "tip",
          kind: "warn",
          text: "파이썬은 0, 빈 문자열도 거짓으로 친다. 자바 조건에는 `true` `false` 만 들어간다. `x != 0` 처럼 비교식으로 써야 한다.",
        },
        { type: "h2", text: "중괄호를 생략하면" },
        {
          type: "code",
          code: `int t = -1;
if (t > 0)
    System.out.println("양수");   // 이 한 줄만 if 소속
    System.out.println("끝");     // 들여썼지만 if 와 상관없이 항상 실행`,
          out: "끝",
        },
        {
          type: "tip",
          kind: "warn",
          text: "중괄호가 없으면 바로 다음 한 문장만 if 에 속한다. 자바는 들여쓰기를 보지 않는다. 한 줄이어도 중괄호를 쓰는 게 안전하다.",
        },
        {
          type: "list",
          style: "check",
          items: ["조건은 `( )` 안에 true/false 만", "`elif` 대신 `else if`", "중괄호 생략은 한 문장만, 웬만하면 쓰기"],
        },
      ],
    },
    {
      id: "n-jv-2-4",
      emoji: "🎚️",
      title: "switch 문과 switch 식",
      summary: "옛 switch의 break 함정, Java 14+ 화살표 case와 값을 돌려주는 yield",
      blocks: [
        { type: "key", text: "옛 switch 는 미끄럼틀이라 break 턱이 나올 때까지 미끄러진다. 화살표 case 는 그 칸에서 딱 멈춘다" },
        {type: "figure", kind: "tree", root: {icon: "🔀", label: "switch"}, children: [{icon: "🌊", label: "옛 `case 1:`", sub: "break 없으면 흘러내림", ink: "red"}, {icon: "➡️", label: "`case 1 ->`", sub: "안 흘러내림", ink: "green"}]},
        { type: "h2", text: "옛 switch 문과 흘러내림" },
        {
          type: "code",
          code: `int day = 2;
switch (day) {
    case 1:
        System.out.println("월");
    case 2:                         // 여기로 점프
        System.out.println("화");
    case 3:                         // break 가 없어서 계속 내려옴
        System.out.println("수");
        break;                      // 여기서 탈출
    default:
        System.out.println("기타");
}`,
          out: "화\n수",
        },
        {
          type: "list",
          style: "flow",
          items: ["`day` 와 같은 `case 2` 로 점프", "`break` 를 만날 때까지 아래 case 를 계속 실행", "`case 3` 의 `break` 에서 탈출"],
        },
        {
          type: "tip",
          kind: "memo",
          text: "아래 case 로 흘러내리는 동작을 fall-through 라고 부른다. 일부러 쓰는 일은 드물고 대부분 `break` 를 빠뜨린 버그다.",
        },
        { type: "h2", text: "switch 식: 화살표 case (Java 14+)" },
        {
          type: "code",
          code: `int dd = 7;
String name = switch (dd) {   // switch 결과를 name 에 바로 담음
    case 1 -> "월";
    case 2 -> "화";
    case 6, 7 -> "주말";       // 7 이라 여기서 끝
    default -> "평일";
};                            // 식이라서 끝에 ; 필요
System.out.println(name);`,
          out: "주말",
        },
        {
          type: "compare",
          cols: [
            { title: "옛 `case 1:`", tone: "bad", items: ["`break` 빠뜨리면 흘러내림", "값을 돌려주지 못함", "여러 값은 case 를 줄줄이"] },
            { title: "새 `case 1 ->`", tone: "good", items: ["해당 case 만 실행", "식(값이 되는 코드)이라 결과를 변수에 바로 담음", "`case 6, 7 ->` 쉼표로 묶기"] },
          ],
        },
        { type: "h2", text: "여러 줄이면 블록과 yield" },
        {
          type: "code",
          code: `String grade = "B";
int point = switch (grade) {
    case "A" -> 4;
    case "B" -> {
        System.out.println("B 블록 실행");
        yield 3;                // 이 값이 switch 의 결과가 됨
    }
    default -> 0;
};
System.out.println(point);`,
          out: "B 블록 실행\n3",
        },
        {
          type: "p",
          text: "블록 `{ }` 안에서 돌려줄 값은 `return` 이 아니라 `yield` 로 낸다. 위처럼 문자열로도 분기할 수 있다.",
        },
        {
          type: "tip",
          kind: "warn",
          text: "switch 식은 모든 경우를 덮어야 한다. `default` 를 빼면 컴파일 에러가 난다. 식 끝의 `;` 도 잊기 쉽다.",
        },
        {
          type: "list",
          style: "check",
          items: ["옛 `case :` 는 `break` 가 없으면 아래로 흘러내림", "`case ->` 는 흘러내림 없음, 결과를 변수에 담기", "블록에서 값을 낼 땐 `yield`"],
        },
      ],
    },
    {
      id: "n-jv-2-5",
      emoji: "🔁",
      title: "for · while · do-while",
      summary: "for는 초기식;조건식;증감식, while은 조건 먼저, do-while은 최소 1번",
      blocks: [
        { type: "key", text: "몇 번 돌지 알면 for, 언제 멈출지만 알면 while, 일단 한 번 해 보고 따지면 do-while" },
        {type: "figure", kind: "tree", root: {icon: "🔁", label: "반복문 고르기"}, children: [{icon: "🔢", label: "`for`", sub: "횟수가 정해짐"}, {icon: "❓", label: "`while`", sub: "조건만 있음", ink: "blue"}, {icon: "1️⃣", label: "`do-while`", sub: "일단 한 번", ink: "green"}]},
        { type: "h2", text: "for: 세 칸 구조" },
        {
          type: "code",
          code: `int sum = 0;
for (int i = 1; i <= 10; i++) {   // 시작값; 계속할 조건; 한 바퀴 뒤 할 일
    sum += i;                     // 1 + 2 + ... + 10
}
System.out.println(sum);`,
          out: "55",
        },
        {
          type: "list",
          style: "flow",
          items: ["초기식 `int i = 1` 을 딱 한 번 실행", "조건식 `i <= 10` 검사, false 면 종료", "본문 실행", "증감식 `i++` 실행 후 조건식으로 돌아감"],
        },
        {
          type: "compare",
          cols: [
            { title: "🐍 파이썬", items: ["`for i in range(1, 11):`", "끝 값 11 은 미포함"] },
            { title: "☕ 자바", items: ["`for (int i = 1; i <= 10; i++)`", "조건식을 직접 적어 범위를 정함"] },
          ],
        },
        {
          type: "tip",
          kind: "memo",
          text: "for 의 `( )` 안에서 만든 `i` 는 반복문이 끝나면 사라진다. 반복문 밖에서 `i` 를 쓰면 컴파일 에러.",
        },
        { type: "h2", text: "while: 조건이 참인 동안" },
        {
          type: "code",
          code: `int n = 1;
while (n < 100) {   // 100 보다 작으면 계속
    n *= 2;         // 1 → 2 → 4 → ... → 128
}
System.out.println(n);`,
          out: "128",
        },
        { type: "h2", text: "do-while: 실행 먼저, 검사는 나중" },
        {
          type: "code",
          code: `int k = 10;
do {
    System.out.println("한 번은 실행: " + k);   // 조건을 보기 전에 먼저 실행
} while (k < 5);                              // 10 < 5 는 false 라 여기서 끝`,
          out: "한 번은 실행: 10",
        },
        {
          type: "tip",
          kind: "analogy",
          text: "do-while 은 시식 코너. 일단 한 입 먹어 보고, 맛있으면 더 먹는다. while 은 메뉴판부터 보고 안 끌리면 아예 안 먹는다.",
        },
        {
          type: "table",
          head: ["반복문", "조건 검사", "최소 실행", "어울리는 곳"],
          rows: [
            ["`for`", "매번 본문 전", "0번", "횟수가 정해진 반복"],
            ["`while`", "매번 본문 전", "0번", "끝나는 시점을 모를 때"],
            ["`do-while`", "매번 본문 후", "1번", "입력을 먼저 받고 검사할 때"],
          ],
        },
        {
          type: "tip",
          kind: "warn",
          text: "`do { } while (조건);` 맨 끝 `;` 를 빠뜨리기 쉽다. 파이썬에는 do-while 이 없다.",
        },
        {
          type: "list",
          style: "check",
          items: ["for 는 초기식 → 조건식 → 본문 → 증감식", "while 은 0번, do-while 은 최소 1번", "for 에서 만든 변수는 반복문 밖에서 못 쓴다"],
        },
      ],
    },
    {
      id: "n-jv-2-6",
      emoji: "🪜",
      title: "break · continue · 라벨, 중첩 반복",
      summary: "break는 탈출, continue는 건너뛰기, 라벨로 바깥 반복문까지 제어",
      blocks: [
        { type: "key", text: "break 는 그만두기, continue 는 이번 판만 넘기기. 둘 다 가장 가까운 반복문에만 걸린다" },
        {type: "figure", kind: "stack", nested: true, layers: [{icon: "🏷️", label: "`outer: for`", sub: "`break outer` → 여기까지 탈출"}, {icon: "🔁", label: "안쪽 `for`", sub: "그냥 `break` → 여기만 탈출"}]},
        { type: "h2", text: "break 와 continue" },
        {
          type: "code",
          code: `for (int i = 1; i <= 5; i++) {
    if (i == 2) continue;  // 2 는 출력 안 하고 다음 회차로
    if (i == 4) break;     // 4 에서 반복문 자체를 끝냄
    System.out.println(i);
}`,
          out: "1\n3",
        },
        {
          type: "compare",
          cols: [
            { title: "`break`", items: ["놀이기구에서 내리기", "반복문을 즉시 끝냄", "switch 에서도 탈출용"] },
            { title: "`continue`", items: ["이번 차례만 패스", "남은 본문을 건너뜀", "for 면 증감식으로 가서 다음 회차"] },
          ],
        },
        { type: "h2", text: "중첩 반복" },
        {
          type: "code",
          code: `for (int i = 1; i <= 3; i++) {       // 바깥: 줄 번호
    for (int j = 1; j <= i; j++) {   // 안쪽: i 개만큼 별 찍기
        System.out.print("*");
    }
    System.out.println();            // 한 줄 끝나면 줄바꿈
}`,
          out: "*\n**\n***",
        },
        {
          type: "tip",
          kind: "analogy",
          text: "시계의 시침과 분침. 바깥 `i` 가 한 칸 갈 때 안쪽 `j` 는 한 바퀴를 다 돈다.",
        },
        { type: "h2", text: "라벨: 바깥 반복문 지정" },
        {
          type: "p",
          text: "반복문 앞에 `이름:` 을 붙이면 라벨(반복문 이름표)이 된다. `break 이름` 으로 그 반복문을 콕 집어 제어한다.",
        },
        {
          type: "code",
          code: `outer:                                   // 바깥 for 에 outer 라는 이름표
for (int i = 1; i <= 3; i++) {
    for (int j = 1; j <= 3; j++) {
        if (j == 2) continue outer;  // 바깥 for 의 다음 회차로
        if (i == 3) break outer;     // 바깥 for 까지 한 번에 탈출
        System.out.println(i + "," + j);
    }
}
System.out.println("끝");`,
          out: "1,1\n2,1\n끝",
        },
        {
          type: "tip",
          kind: "memo",
          text: "파이썬에는 라벨이 없어서 플래그 변수(멈출지 적어 두는 표시)로 돌아 나왔다. 자바는 이 일을 한 줄로 한다.",
        },
        {
          type: "tip",
          kind: "warn",
          text: "라벨 없는 `break` 는 안쪽 for 만 끝낸다. 바깥 반복은 계속 돈다. 라벨을 남발하면 흐름이 꼬이니 중첩 탈출이 필요할 때만 쓴다.",
        },
        {
          type: "list",
          style: "check",
          items: ["`break` 는 탈출, `continue` 는 이번 회차만 건너뛰기", "둘 다 가장 가까운 반복문에만 적용", "바깥까지 제어하려면 `outer:` 라벨"],
        },
      ],
    },
  ],
};
