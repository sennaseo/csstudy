// 자바 단원 1 — 자바 시작하기 (시중 입문서 목차 기준). 작성 규칙은 ../python.ts 상단 주석.
import type { NoteUnit } from "../types";

export const JV1: NoteUnit = {
  id: "jv-1",
  title: "자바 시작하기",
  notes: [
    {
      id: "n-jv-1-1",
      emoji: "☕",
      title: "JDK·JRE·JVM과 실행 흐름",
      summary: ".java를 javac로 번역해 .class를 만들고 JVM이 실행하는 흐름",
      blocks: [
        { type: "key", text: "자바 코드는 한 번 번역해 두면, 어느 컴퓨터든 같은 통역사(JVM)가 읽어 준다" },
        {type: "figure", kind: "stack", nested: true, layers: [{icon: "🧰", label: "JDK", sub: "개발 도구 (`javac`)"}, {icon: "🏃", label: "JRE", sub: "실행 환경 (라이브러리)"}, {icon: "⚙️", label: "JVM", sub: "바이트코드 실행기"}]},
        { type: "h2", text: "세 가지 이름 정리" },
        {
          type: "table",
          head: ["이름", "풀네임", "쉽게 말하면"],
          rows: [
            ["JVM", "Java Virtual Machine", "`.class` 를 읽어 실행하는 가상 컴퓨터(통역사)"],
            ["JRE", "Java Runtime Environment", "JVM + 기본 도구 모음. 실행만 할 수 있다"],
            ["JDK", "Java Development Kit", "JRE + `javac`(번역기) 같은 개발 도구. 개발자는 이걸 깐다"],
          ],
        },
        {
          type: "tip",
          kind: "analogy",
          text: "JDK 는 주방 전체, JRE 는 데우는 전자레인지, JVM 은 그 안의 회전판. 요리(개발)하려면 주방이 통째로 필요하다.",
        },
        { type: "h2", text: "소스에서 실행까지" },
        {
          type: "list",
          style: "flow",
          items: [
            "`Hello.java` 에 사람이 읽는 코드(소스)를 쓴다",
            "`javac Hello.java` 로 컴파일(사람 말 → 기계 말 번역)하면 `Hello.class` 가 생긴다",
            "`.class` 안은 바이트코드(JVM 만 읽는 중간 언어)",
            "`java Hello` 로 JVM 이 `.class` 를 읽어 실행한다",
          ],
        },
        {
          type: "code",
          code: `// Hello.java
public class Hello {
    public static void main(String[] args) {
        System.out.println("Hello, Java!");   // 화면에 한 줄 출력
    }
}

// 터미널
// javac Hello.java   → Hello.class 생김
// java Hello         → JVM 이 실행`,
          out: "Hello, Java!",
        },
        {
          type: "tip",
          kind: "memo",
          text: "Java 11 부터는 `java Hello.java` 한 줄로 번역과 실행을 같이 한다. 파일 하나짜리 연습용으로 편하다.",
        },
        { type: "h2", text: "파이썬과 무엇이 다른가" },
        {
          type: "compare",
          cols: [
            { title: "🐍 파이썬", items: ["소스를 읽으면서 바로 실행", "실행해 봐야 타입 오류를 앎", "`.py` 하나로 끝"] },
            { title: "☕ 자바", items: ["먼저 통째로 번역, 그다음 실행", "타입 오류는 번역 단계에서 잡힘", "`.java` → `.class` 두 파일"] },
          ],
        },
        {
          type: "p",
          text: "`.class` 는 윈도우나 맥이 아니라 JVM 이 읽는 코드다. 그래서 윈도우에서 만든 `.class` 를 맥의 JVM 도 그대로 실행한다.",
        },
        {
          type: "list",
          style: "check",
          items: ["JDK 안에 JRE, JRE 안에 JVM", "`.java` → `javac`(번역) → `.class` → `java`(실행)", "타입 오류는 실행 전 번역 단계에서 잡힌다"],
        },
      ],
    },
    {
      id: "n-jv-1-2",
      emoji: "🏗️",
      title: "클래스와 main, 화면 출력",
      summary: "모든 코드는 클래스 안, 시작점은 main, 출력은 print·println·printf",
      blocks: [
        { type: "key", text: "자바 프로그램은 클래스라는 건물이고, main 은 JVM 이 들어오는 정문이다" },
        {type: "figure", kind: "stack", nested: true, layers: [{icon: "📐", label: "`class Hello`", sub: "파일 이름과 같게"}, {icon: "🚪", label: "`main(String[] args)`", sub: "여기서 시작"}, {icon: "🖨️", label: "`System.out.println`", sub: "화면 출력"}]},
        { type: "h2", text: "기본 뼈대" },
        {
          type: "code",
          code: `public class Hello {                          // 클래스 이름 = 파일 이름
    public static void main(String[] args) {  // 실행 시작점
        System.out.println("Hello, Java!");   // 문장 끝은 ;
    }
}`,
          out: "Hello, Java!",
        },
        {
          type: "table",
          head: ["조각", "뜻"],
          rows: [
            ["`public class Hello`", "Hello 라는 클래스(코드를 담는 큰 묶음). 파일명도 `Hello.java` 여야 한다"],
            ["`public static void main(String[] args)`", "JVM 이 제일 먼저 찾아 부르는 메서드(클래스 안의 함수)"],
            ["`{ }`", "블록의 시작과 끝"],
            ["`;`", "문장 하나가 끝났다는 표시"],
          ],
        },
        {
          type: "tip",
          kind: "memo",
          text: "main 줄은 지금은 주문처럼 통째로 외운다. `public` 누구나 호출 가능, `static` 객체 없이 바로 호출, `void` 돌려주는 값 없음. 자세한 뜻은 뒤 단원에서 나온다.",
        },
        {
          type: "compare",
          cols: [
            { title: "🐍 파이썬", items: ["들여쓰기로 블록 구분", "줄바꿈이 문장의 끝", "파일 맨 위부터 바로 실행"] },
            { title: "☕ 자바", items: ["중괄호 `{ }` 로 블록 구분", "`;` 가 문장의 끝", "`main` 부터 실행"] },
          ],
        },
        { type: "h2", text: "print · println · printf" },
        {
          type: "code",
          code: `System.out.print("A");
System.out.print("B");       // 줄바꿈 없이 A 옆에 붙음
System.out.println();        // 빈 println = 줄만 바꿈
System.out.println("C");
System.out.printf("%s는 %d살, 키 %.1f%n", "민수", 20, 175.48);  // %.1f 라서 175.5`,
          out: "AB\nC\n민수는 20살, 키 175.5",
        },
        {
          type: "table",
          head: ["메서드", "줄바꿈", "쓰임"],
          rows: [
            ["`print`", "안 함", "이어서 출력"],
            ["`println`", "끝에 함", "가장 흔한 출력. 파이썬 `print` 와 비슷"],
            ["`printf`", "`%n` 을 써야 함", "빈칸 채우기 출력. `%d` 정수, `%s` 문자열, `%.1f` 소수 1자리"],
          ],
        },
        { type: "h2", text: "문자열 + 숫자는 왼쪽부터" },
        {
          type: "code",
          code: `System.out.println("합계: " + 3 + 4);    // "합계: 3" 이 먼저 되고 4 가 붙음
System.out.println("합계: " + (3 + 4));  // 괄호 안 3 + 4 를 먼저 계산`,
          out: "합계: 34\n합계: 7",
        },
        {
          type: "tip",
          kind: "warn",
          text: "문자열에 숫자를 더하면 숫자도 글자가 된다. 숫자 계산을 먼저 하려면 괄호로 묶는다.",
        },
        {
          type: "list",
          style: "check",
          items: ["코드는 클래스 안, 시작은 `main`", "블록은 `{ }`, 문장 끝은 `;`", "`println` 은 줄바꿈, `printf` 는 `%n` 직접"],
        },
      ],
    },
    {
      id: "n-jv-1-3",
      emoji: "🏷️",
      title: "변수 선언과 명명 규칙",
      summary: "타입을 먼저 적고 선언, 초기화해야 쓸 수 있음, camelCase와 예약어",
      blocks: [
        { type: "key", text: "자바 변수는 '정수 전용' 같은 라벨이 붙은 상자. 라벨은 한 번 붙이면 못 바꾼다" },
        {type: "figure", kind: "flow", nodes: [{icon: "📦", label: "선언", sub: "`int age;`"}, {icon: "✏️", label: "초기화", sub: "`age = 20;`", ink: "blue"}, {icon: "🖨️", label: "사용", sub: "`println(age)`", ink: "green"}]},
        { type: "h2", text: "선언 → 초기화 → 사용" },
        {
          type: "code",
          code: `int age;          // 선언: int(정수) 상자 만들기
age = 20;         // 초기화: 처음 값 넣기
int score = 90;   // 선언 + 초기화 한 번에
score = 95;       // 재할당: 값만 바꿔 넣기
System.out.println(age + " " + score);`,
          out: "20 95",
        },
        {
          type: "compare",
          cols: [
            { title: "🐍 파이썬", items: ["`age = 20` 만 쓰면 끝", "같은 변수에 나중에 문자열도 넣을 수 있음"] },
            { title: "☕ 자바", items: ["`int age = 20;` 타입을 앞에", "`int` 상자에는 정수만 들어감"] },
          ],
        },
        { type: "h2", text: "컴파일러가 막아 주는 실수" },
        {
          type: "code",
          code: `int x;
System.out.println(x);   // 빈 상자를 열어 보려 함`,
          out: "error: variable x might not have been initialized",
        },
        {
          type: "code",
          code: `int n = "hi";   // 정수 상자에 글자를 넣으려 함`,
          out: "error: incompatible types: String cannot be converted to int",
        },
        {
          type: "p",
          text: "둘 다 실행 전, 번역(컴파일)할 때 걸린다. 파이썬이면 그 줄을 실행해야 알 수 있는 오류다.",
        },
        { type: "h2", text: "이름 짓는 규칙" },
        {
          type: "table",
          head: ["규칙", "예"],
          rows: [
            ["영문·숫자·`_`·`$` 로 구성", "`total2` ⭕"],
            ["숫자로 시작 불가", "`2nd` ❌"],
            ["대소문자 구분", "`Age` ≠ `age`"],
            ["예약어(자바가 미리 찜한 단어) 금지", "`int` `class` `if` `for` `new` ❌"],
          ],
        },
        {
          type: "table",
          head: ["대상", "관례", "예"],
          rows: [
            ["변수·메서드", "camelCase (소문자 시작, 낙타 혹처럼 중간만 대문자)", "`userName` `getScore`"],
            ["클래스", "PascalCase (첫 글자부터 대문자)", "`HelloWorld`"],
            ["상수", "전부 대문자 + `_`", "`MAX_SIZE`"],
          ],
        },
        {
          type: "tip",
          kind: "warn",
          text: "파이썬 습관대로 `user_name` 이라고 써도 컴파일은 된다. 하지만 자바 관례는 `userName`. 남의 코드와 섞이면 바로 티가 난다.",
        },
        {
          type: "list",
          style: "check",
          items: ["`타입 이름 = 값;` 순서로 선언", "값을 안 넣은 지역 변수(메서드 안 변수)는 못 쓴다", "변수는 camelCase, 클래스는 PascalCase"],
        },
      ],
    },
    {
      id: "n-jv-1-4",
      emoji: "🧱",
      title: "기본형 8가지와 참조형",
      summary: "정수 4·실수 2·문자·논리 기본형 8종과 주소를 담는 참조형",
      blocks: [
        { type: "key", text: "숫자·글자·참거짓 8가지만 값을 직접 담고, 나머지는 전부 주소를 담는다" },
        {type: "figure", kind: "refs", vars: [{name: "int n", to: 0}, {name: "String s", to: 1}], objs: [{icon: "🔢", label: "10", sub: "값이 직접 들어감", ink: "blue"}, {icon: "🏠", label: "\"hi\"", sub: "힙의 객체 (주소로)"}], caption: "기본형은 값, 참조형은 주소"},
        { type: "h2", text: "기본형 8가지" },
        {
          type: "table",
          head: ["분류", "타입", "크기", "쉽게 말하면"],
          rows: [
            ["정수", "`byte`", "1바이트", "-128 ~ 127, 아주 작은 정수"],
            ["정수", "`short`", "2바이트", "약 ±3만 2천"],
            ["정수", "`int`", "4바이트", "약 ±21억. 정수는 보통 이것"],
            ["정수", "`long`", "8바이트", "약 ±922경. 값 뒤에 `L`"],
            ["실수", "`float`", "4바이트", "숫자 7자리쯤까지 정확. 값 뒤에 `f`"],
            ["실수", "`double`", "8바이트", "숫자 15자리쯤까지 정확. 실수는 보통 이것"],
            ["문자", "`char`", "2바이트", "`'A'` 글자 하나"],
            ["논리", "`boolean`", "보통 1바이트", "`true` `false` 둘 중 하나"],
          ],
        },
        {
          type: "tip",
          kind: "memo",
          text: "당장은 정수 `int`, 실수 `double`, 글자 `char`, 참거짓 `boolean` 네 개면 충분하다. `byte` `short` 는 파일·네트워크 데이터를 다룰 때 주로 쓴다.",
        },
        {
          type: "code",
          code: `System.out.println(Integer.MAX_VALUE);   // int 가 담을 수 있는 가장 큰 수
System.out.println(Long.MAX_VALUE);      // long 의 가장 큰 수
long big = 3_000_000_000L;               // 21억을 넘으니 L 필수
float f = 3.14f;                         // float 은 f 필수
System.out.println(big + " " + f);`,
          out: "2147483647\n9223372036854775807\n3000000000 3.14",
        },
        {
          type: "tip",
          kind: "warn",
          text: "`long l = 3000000000;` 은 `integer number too large` 에러. 숫자는 기본이 `int` 라서 21억을 넘으면 `L` 을 붙여야 한다. `float f = 3.14;` 도 `f` 가 없으면 에러.",
        },
        { type: "h2", text: "char 는 사실 숫자" },
        {
          type: "code",
          code: `char c = 'A';
System.out.println(c + 1);            // 'A' 는 65 라서 66
System.out.println((char) (c + 1));   // 66 을 글자로 되돌리면 B`,
          out: "66\nB",
        },
        {
          type: "p",
          text: "글자마다 유니코드(전 세계 글자에 붙인 번호표) 번호가 있다. `'A'` 의 번호는 65다.",
        },
        { type: "h2", text: "기본형 vs 참조형" },
        {
          type: "compare",
          cols: [
            { title: "기본형 (8가지)", items: ["소문자로 시작 `int` `double`", "상자에 값 자체가 들어 있음", "`null`(비어 있음) 불가"] },
            { title: "참조형 (나머지 전부)", items: ["대문자로 시작 `String` 배열 클래스", "상자에 객체(값 덩어리)의 주소가 들어 있음", "`null` 가능"] },
          ],
        },
        {
          type: "tip",
          kind: "analogy",
          text: "기본형은 지갑 속 현금, 참조형은 은행 계좌번호. 계좌번호를 복사해 주면 같은 통장을 둘이 보게 된다.",
        },
        {
          type: "tip",
          kind: "memo",
          text: "파이썬은 숫자도 전부 객체(참조)다. 자바는 빠르게 돌리려고 숫자·문자·논리만 기본형으로 따로 뺐다.",
        },
        {
          type: "list",
          style: "check",
          items: ["정수는 `int`, 실수는 `double` 이 기본", "큰 정수는 `long` + `L`, `float` 은 `f`", "기본형은 값, 참조형은 주소를 담는다"],
        },
      ],
    },
    {
      id: "n-jv-1-5",
      emoji: "🔄",
      title: "형변환과 오버플로",
      summary: "작은→큰 타입은 자동, 큰→작은 타입은 (타입) 강제, int 승격과 오버플로",
      blocks: [
        { type: "key", text: "작은 컵의 물은 큰 컵에 그냥 붓고, 큰 컵의 물을 작은 컵에 옮길 땐 넘칠 각오를 하고 직접 붓는다" },
        {type: "figure", kind: "flow", nodes: [{icon: "🥛", label: "`byte`"}, {icon: "🥤", label: "`int`"}, {icon: "🪣", label: "`long`"}, {icon: "🛁", label: "`double`", ink: "blue"}], edges: ["자동", "자동", "자동"], caption: "작은 → 큰 그릇은 자동, 반대는 `(int)` 처럼 직접"},
        { type: "h2", text: "자동 형변환 vs 강제 형변환" },
        {
          type: "p",
          text: "형변환은 값의 타입을 바꾸는 일이다. 손해가 없으면 자바가 알아서, 손해가 있으면 내가 `(타입)` 을 적어야 한다.",
        },
        {
          type: "code",
          code: `int i = 10;
double d = i;          // 자동: int → double, 잃는 것 없음
System.out.println(d);

double pi = 3.99;
int n = (int) pi;      // 강제: 소수점 아래를 버림
System.out.println(n);`,
          out: "10.0\n3",
        },
        {
          type: "list",
          style: "flow",
          items: ["`byte` → `short` → `int` → `long` → `float` → `double` (작은 컵 → 큰 컵)", "화살표 방향은 자동 변환", "반대 방향은 `(타입)` 을 붙여야 컴파일된다"],
        },
        {
          type: "code",
          code: `int i = 3.14;   // (int) 없이 실수를 정수 상자에`,
          out: "error: incompatible types: possible lossy conversion from double to int",
        },
        {
          type: "tip",
          kind: "warn",
          text: "`(int) 3.99` 는 반올림이 아니라 버림이라 3. 반올림은 `Math.round()` 를 쓴다.",
        },
        { type: "h2", text: "계산하면 int 로 올라간다" },
        {
          type: "p",
          text: "`byte` 나 `short` 끼리 더해도 결과는 `int` 다. 이걸 승격(더 큰 타입으로 올려 계산)이라 한다.",
        },
        {
          type: "code",
          code: `byte a = 10, b = 20;
// byte c = a + b;  // error: possible lossy conversion from int to byte
int sum = a + b;    // 결과가 int 라서 int 상자에 담는다
System.out.println(sum);
System.out.println(5 / 2 + " " + 5 / 2.0);   // int 끼리는 2, double 이 섞이면 2.5`,
          out: "30\n2 2.5",
        },
        {
          type: "tip",
          kind: "memo",
          text: "타입이 섞이면 큰 쪽으로 맞춘다. `5 / 2` 는 int 끼리라 2, `5 / 2.0` 은 double 로 맞춰져 2.5.",
        },
        { type: "h2", text: "정수 오버플로" },
        {
          type: "p",
          text: "오버플로는 상자에 담을 수 있는 크기를 넘는 일이다. 자바는 에러 대신 엉뚱한 값을 낸다.",
        },
        {
          type: "code",
          code: `int max = Integer.MAX_VALUE;           // 2147483647
System.out.println(max + 1);           // 최솟값으로 넘어감
System.out.println(1_000_000 * 3000);  // int 끼리 곱해서 넘침
System.out.println(1_000_000L * 3000); // L 을 붙여 long 으로 계산`,
          out: "-2147483648\n-1294967296\n3000000000",
        },
        {
          type: "tip",
          kind: "analogy",
          text: "자동차 주행거리계와 같다. 끝자리까지 차면 0 으로 돌아가듯, `int` 최댓값에서 1 을 더하면 최솟값으로 넘어간다.",
        },
        {
          type: "compare",
          cols: [
            { title: "🐍 파이썬", tone: "good", items: ["정수 크기 제한 없음", "`10 ** 30` 도 정확"] },
            { title: "☕ 자바", tone: "bad", items: ["`int` 는 약 21억에서 넘침", "에러 없이 조용히 틀린 값"] },
          ],
        },
        {
          type: "list",
          style: "check",
          items: ["작은→큰 자동, 큰→작은 `(타입)` 강제", "`byte` `short` 계산 결과는 `int`", "큰 수는 `long` 과 `L`, 넘치면 에러 없이 틀린 값"],
        },
      ],
    },
    {
      id: "n-jv-1-6",
      emoji: "🔒",
      title: "상수 final·리터럴·var",
      summary: "final로 값 고정, 진법·밑줄 리터럴, var로 타입 추론",
      blocks: [
        { type: "key", text: "final 은 값에 자물쇠를 채우고, var 는 타입 적기를 컴파일러에게 맡긴다" },
        {type: "figure", kind: "tree", root: {icon: "🔐", label: "값·타입 다루기"}, children: [{icon: "🔒", label: "`final`", sub: "값 잠금", ink: "red"}, {icon: "✍️", label: "리터럴", sub: "`10` `'a'` `\"hi\"`"}, {icon: "🤖", label: "`var`", sub: "타입은 컴파일러가", ink: "blue"}]},
        { type: "h2", text: "final: 한 번 넣으면 끝" },
        {
          type: "code",
          code: `final double TAX = 0.1;      // 자물쇠 채운 상수
System.out.println(10000 * TAX);
TAX = 0.2;                   // 바꾸려 하면 컴파일 에러`,
          out: "error: cannot assign a value to final variable TAX",
        },
        {
          type: "p",
          text: "에러 줄을 지우면 `1000.0` 이 출력된다. 상수 이름은 `MAX_SIZE` 처럼 대문자와 `_` 로 짓는다.",
        },
        {
          type: "tip",
          kind: "memo",
          text: "파이썬은 대문자 이름으로 상수라고 약속만 한다. 자바의 `final` 은 컴파일러가 재할당을 실제로 막는다.",
        },
        { type: "h2", text: "리터럴: 코드에 직접 쓴 값" },
        {
          type: "table",
          head: ["종류", "예", "뜻"],
          rows: [
            ["밑줄", "`1_000_000`", "읽기 쉽게 끊기. 값은 1000000"],
            ["long · float", "`10L` `3.14f`", "뒤에 붙인 글자로 타입 지정"],
            ["문자", "`'A'`", "작은따옴표, 글자 하나 (`char`)"],
            ["문자열", "`\"A\"`", "큰따옴표 (`String`)"],
          ],
        },
        {
          type: "code",
          code: `System.out.println('A' + 'B');   // char 는 숫자라서 65 + 66
System.out.println("A" + "B");   // String 은 이어 붙이기`,
          out: "131\nAB",
        },
        {
          type: "tip",
          kind: "warn",
          text: "파이썬은 따옴표 종류가 상관없지만 자바는 다르다. 글자를 이어 붙이려면 큰따옴표를 쓴다.",
        },
        {
          type: "tip",
          kind: "memo",
          text: "진법 리터럴도 있다. `0b1010` 은 2진수로 10, `0xFF` 는 16진수로 255. `017` 처럼 `0` 으로 시작하면 8진수라 15가 된다.",
        },
        { type: "h2", text: "var: 타입 추론 (Java 10+)" },
        {
          type: "code",
          code: `var name = "자바";   // 오른쪽이 글자라 String 으로 정해짐
var count = 3;      // 오른쪽이 정수라 int 로 정해짐
System.out.println(name + " " + count);`,
          out: "자바 3",
        },
        {
          type: "tip",
          kind: "analogy",
          text: "`var` 는 라벨 자동 인쇄기. 처음 넣은 값을 보고 라벨을 찍어 붙인다. 붙은 라벨은 못 뗀다.",
        },
        {
          type: "compare",
          cols: [
            { title: "되는 것", tone: "good", items: ["메서드 안 지역 변수", "오른쪽 값으로 타입이 분명할 때"] },
            { title: "안 되는 것", tone: "bad", items: ["`var v;` 초기값 없이 선언", "선언 뒤 다른 타입 넣기"] },
          ],
        },
        {
          type: "list",
          style: "check",
          items: ["`final` 변수는 재할당하면 컴파일 에러", "`'A'` 는 `char`, `\"A\"` 는 `String`", "`var` 는 타입을 숨길 뿐 고정은 그대로"],
        },
      ],
    },
  ],
};
