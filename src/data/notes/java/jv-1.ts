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
        { type: "key", text: "자바는 한 번 번역(컴파일)해 두고 JVM 위에서 어디서나 실행" },
        { type: "h2", text: "세 가지 이름 정리" },
        {
          type: "table",
          head: ["이름", "정체", "들어 있는 것"],
          rows: [
            ["JVM", "Java Virtual Machine", "`.class` 를 읽어 실행하는 가상 컴퓨터"],
            ["JRE", "Java Runtime Environment", "JVM + 표준 라이브러리 (실행만 가능)"],
            ["JDK", "Java Development Kit", "JRE + `javac` 같은 개발 도구"],
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
            "`Hello.java` 소스 파일 작성",
            "`javac Hello.java` 로 컴파일 → `Hello.class` (바이트코드) 생성",
            "`java Hello` 로 JVM 이 `.class` 를 읽어 실행",
          ],
        },
        {
          type: "code",
          code: `// Hello.java
public class Hello {
    public static void main(String[] args) {
        System.out.println("Hello, Java!");
    }
}

// 터미널
// javac Hello.java
// java Hello`,
          out: "Hello, Java!",
        },
        {
          type: "tip",
          kind: "memo",
          text: "Java 11 부터는 `java Hello.java` 한 줄로 컴파일과 실행을 같이 할 수 있다. 파일 하나짜리 연습용으로 편하다.",
        },
        { type: "h2", text: "파이썬과 무엇이 다른가" },
        {
          type: "compare",
          cols: [
            { title: "🐍 파이썬", items: ["인터프리터가 소스를 바로 실행", "실행해 봐야 타입 오류를 앎", "`.py` 하나로 끝"] },
            { title: "☕ 자바", items: ["먼저 컴파일, 그다음 실행", "타입 오류는 컴파일 단계에서 잡힘", "`.java` → `.class` 두 파일"] },
          ],
        },
        {
          type: "p",
          text: "`.class` 는 운영체제가 아니라 JVM 용 코드다. 그래서 윈도우에서 만든 `.class` 를 맥의 JVM 도 그대로 실행한다.",
        },
        {
          type: "list",
          style: "check",
          items: ["JDK ⊃ JRE ⊃ JVM", "`.java` → `javac` → `.class` → `java` (JVM)", "컴파일 단계에서 타입 오류를 미리 잡는다"],
        },
      ],
    },
    {
      id: "n-jv-1-2",
      emoji: "🏗️",
      title: "클래스와 main, 화면 출력",
      summary: "모든 코드는 클래스 안, 시작점은 main, 출력은 print·println·printf",
      blocks: [
        { type: "key", text: "자바 프로그램은 클래스 안의 main 메서드에서 시작한다" },
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
            ["`public class Hello`", "Hello 라는 클래스. 파일명도 `Hello.java` 여야 한다"],
            ["`public static void main(String[] args)`", "JVM 이 제일 먼저 찾아 부르는 메서드"],
            ["`{ }`", "블록의 시작과 끝"],
            ["`;`", "문장 하나가 끝났다는 표시"],
          ],
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
System.out.print("B");
System.out.println();
System.out.println("C");
System.out.printf("%s는 %d살, 키 %.1f%n", "민수", 20, 175.48);`,
          out: "AB\nC\n민수는 20살, 키 175.5",
        },
        {
          type: "table",
          head: ["메서드", "줄바꿈", "쓰임"],
          rows: [
            ["`print`", "안 함", "이어서 출력"],
            ["`println`", "끝에 함", "가장 흔한 출력. 파이썬 `print` 와 비슷"],
            ["`printf`", "`%n` 을 써야 함", "형식 지정 출력. `%d` 정수, `%s` 문자열, `%.1f` 소수 1자리"],
          ],
        },
        { type: "h2", text: "문자열 + 숫자는 왼쪽부터" },
        {
          type: "code",
          code: `System.out.println("합계: " + 3 + 4);
System.out.println("합계: " + (3 + 4));`,
          out: "합계: 34\n합계: 7",
        },
        {
          type: "tip",
          kind: "warn",
          text: "`\"합계: \" + 3` 이 먼저 문자열이 되고, 거기에 4가 붙는다. 숫자 계산을 먼저 하려면 괄호로 묶는다.",
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
        { type: "key", text: "자바 변수는 타입이 정해진 상자. 한 번 정한 타입은 못 바꾼다" },
        { type: "h2", text: "선언 → 초기화 → 사용" },
        {
          type: "code",
          code: `int age;          // 선언: int 상자 만들기
age = 20;         // 초기화: 처음 값 넣기
int score = 90;   // 선언 + 초기화 한 번에
score = 95;       // 재할당
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
System.out.println(x);`,
          out: "error: variable x might not have been initialized",
        },
        {
          type: "code",
          code: `int n = "hi";`,
          out: "error: incompatible types: String cannot be converted to int",
        },
        {
          type: "tip",
          kind: "memo",
          text: "둘 다 실행 전, 컴파일할 때 걸린다. 파이썬이면 그 줄을 실행해야 알 수 있는 오류다.",
        },
        { type: "h2", text: "이름 짓는 규칙" },
        {
          type: "table",
          head: ["규칙", "예"],
          rows: [
            ["영문·숫자·`_`·`$` 로 구성", "`total2` ⭕"],
            ["숫자로 시작 불가", "`2nd` ❌"],
            ["대소문자 구분", "`Age` ≠ `age`"],
            ["예약어 금지", "`int` `class` `if` `for` `new` ❌"],
          ],
        },
        {
          type: "table",
          head: ["대상", "관례", "예"],
          rows: [
            ["변수·메서드", "camelCase (소문자 시작)", "`userName` `getScore`"],
            ["클래스", "PascalCase (대문자 시작)", "`HelloWorld`"],
            ["상수", "대문자 + `_`", "`MAX_SIZE`"],
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
          items: ["`타입 이름 = 값;` 순서로 선언", "초기화 안 한 지역 변수는 못 쓴다", "변수는 camelCase, 클래스는 PascalCase"],
        },
      ],
    },
    {
      id: "n-jv-1-4",
      emoji: "🧱",
      title: "기본형 8가지와 참조형",
      summary: "정수 4·실수 2·문자·논리 기본형 8종과 주소를 담는 참조형",
      blocks: [
        { type: "key", text: "기본형은 값 자체를, 참조형은 값이 있는 곳의 주소를 담는다" },
        { type: "h2", text: "기본형 8가지" },
        {
          type: "table",
          head: ["분류", "타입", "크기", "범위·예"],
          rows: [
            ["정수", "`byte`", "1바이트", "-128 ~ 127"],
            ["정수", "`short`", "2바이트", "약 ±3만 2천"],
            ["정수", "`int`", "4바이트", "약 ±21억 (기본 정수)"],
            ["정수", "`long`", "8바이트", "약 ±922경, 값 뒤에 `L`"],
            ["실수", "`float`", "4바이트", "소수 7자리 정도, 값 뒤에 `f`"],
            ["실수", "`double`", "8바이트", "소수 15자리 정도 (기본 실수)"],
            ["문자", "`char`", "2바이트", "`'A'` 글자 하나, 0 ~ 65535"],
            ["논리", "`boolean`", "1바이트", "`true` `false`"],
          ],
        },
        {
          type: "code",
          code: `System.out.println(Integer.MAX_VALUE);
System.out.println(Long.MAX_VALUE);
long big = 3_000_000_000L;
float f = 3.14f;
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
System.out.println(c + 1);
System.out.println((char) (c + 1));`,
          out: "66\nB",
        },
        {
          type: "p",
          text: "`'A'` 는 내부적으로 유니코드 65. 더하면 정수가 되고, `(char)` 로 되돌리면 다시 글자다.",
        },
        { type: "h2", text: "기본형 vs 참조형" },
        {
          type: "compare",
          cols: [
            { title: "기본형 (8가지)", items: ["소문자로 시작 `int` `double`", "상자에 값 자체가 들어 있음", "`null` 불가"] },
            { title: "참조형 (나머지 전부)", items: ["대문자로 시작 `String` 배열 클래스", "상자에 객체의 주소가 들어 있음", "`null` 가능"] },
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
          text: "파이썬은 숫자도 전부 객체(참조)다. 자바는 성능 때문에 숫자·문자·논리만 기본형으로 따로 뺐다.",
        },
        {
          type: "list",
          style: "check",
          items: ["정수 `byte` `short` `int` `long`, 실수 `float` `double`, `char`, `boolean`", "기본 정수는 `int`, 기본 실수는 `double`", "기본형은 값, 참조형은 주소"],
        },
      ],
    },
    {
      id: "n-jv-1-5",
      emoji: "🔄",
      title: "형변환과 오버플로",
      summary: "작은→큰 타입은 자동, 큰→작은 타입은 (타입) 강제, int 승격과 오버플로",
      blocks: [
        { type: "key", text: "작은 그릇에서 큰 그릇은 자동, 큰 그릇에서 작은 그릇은 직접 따른다" },
        { type: "h2", text: "자동 형변환 vs 강제 형변환" },
        {
          type: "code",
          code: `int i = 10;
double d = i;          // 자동: int → double
System.out.println(d);

double pi = 3.99;
int n = (int) pi;      // 강제: 소수점 아래 버림
System.out.println(n);`,
          out: "10.0\n3",
        },
        {
          type: "list",
          style: "flow",
          items: ["`byte` → `short` → `int` → `long` → `float` → `double`", "화살표 방향은 자동 변환", "반대 방향은 `(타입)` 을 붙여야 컴파일된다"],
        },
        {
          type: "code",
          code: `int i = 3.14;`,
          out: "error: incompatible types: possible lossy conversion from double to int",
        },
        {
          type: "tip",
          kind: "warn",
          text: "`(int) 3.99` 는 반올림이 아니라 버림이라 3. 반올림은 `Math.round()` 를 쓴다.",
        },
        { type: "h2", text: "연산하면 int 로 승격" },
        {
          type: "p",
          text: "`byte` 나 `short` 끼리 더해도 결과는 `int` 다. 그래서 `byte` 상자에 다시 담으려면 에러가 난다.",
        },
        {
          type: "code",
          code: `byte a = 10, b = 20;
// byte c = a + b;  // error: possible lossy conversion from int to byte
int sum = a + b;
System.out.println(sum);
System.out.println(5 / 2 + " " + 5 / 2.0);`,
          out: "30\n2 2.5",
        },
        {
          type: "tip",
          kind: "memo",
          text: "타입이 섞이면 큰 쪽으로 맞춘다. `5 / 2` 는 int 끼리라 2, `5 / 2.0` 은 double 로 맞춰져 2.5.",
        },
        { type: "h2", text: "정수 오버플로" },
        {
          type: "code",
          code: `int max = Integer.MAX_VALUE;
System.out.println(max + 1);
System.out.println(1_000_000 * 3000);
System.out.println(1_000_000L * 3000);`,
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
          items: ["작은→큰 자동, 큰→작은 `(타입)` 강제", "`byte` `short` 연산 결과는 `int`", "큰 수는 `long` 과 `L`, 넘치면 에러 없이 틀린 값"],
        },
      ],
    },
    {
      id: "n-jv-1-6",
      emoji: "🔒",
      title: "상수 final·리터럴·var",
      summary: "final로 값 고정, 진법·밑줄 리터럴, var로 타입 추론",
      blocks: [
        { type: "key", text: "final 은 값을 잠그고, var 는 타입 적기를 컴파일러에게 맡긴다" },
        { type: "h2", text: "final: 한 번 넣으면 끝" },
        {
          type: "code",
          code: `final double TAX = 0.1;
System.out.println(10000 * TAX);
TAX = 0.2;`,
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
            ["정수", "`0b1010` `017` `0xFF`", "2진수, 8진수(`0` 시작), 16진수"],
            ["밑줄", "`1_000_000`", "읽기 쉽게 끊기. 값은 1000000"],
            ["long · float", "`10L` `3.14f`", "접미사로 타입 지정"],
            ["문자", "`'A'`", "작은따옴표, 글자 하나 (`char`)"],
            ["문자열", "`\"A\"`", "큰따옴표 (`String`)"],
          ],
        },
        {
          type: "code",
          code: `System.out.println(0b1010 + " " + 017 + " " + 0xFF);
System.out.println('A' + 'B');
System.out.println("A" + "B");`,
          out: "10 15 255\n131\nAB",
        },
        {
          type: "tip",
          kind: "warn",
          text: "파이썬은 따옴표 종류가 상관없지만 자바는 다르다. `'A' + 'B'` 는 글자 이어 붙이기가 아니라 65 + 66 = 131.",
        },
        { type: "h2", text: "var: 타입 추론 (Java 10+)" },
        {
          type: "code",
          code: `var name = "자바";   // String 으로 추론
var count = 3;      // int 로 추론
System.out.println(name + " " + count);`,
          out: "자바 3",
        },
        {
          type: "compare",
          cols: [
            { title: "되는 것", tone: "good", items: ["메서드 안 지역 변수", "오른쪽 값으로 타입이 분명할 때"] },
            { title: "안 되는 것", tone: "bad", items: ["`var v;` 초기값 없이 선언", "선언 뒤 다른 타입 넣기"] },
          ],
        },
        {
          type: "p",
          text: "`var` 는 파이썬처럼 타입이 없는 게 아니다. 컴파일할 때 타입이 정해지고 그 뒤로는 고정이다.",
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
