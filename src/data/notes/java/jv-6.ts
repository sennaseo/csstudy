// 자바 단원 6 — 예외 처리와 기본 API (시중 입문서 목차 기준). 작성 규칙은 ../python.ts 상단 주석.
import type { NoteUnit } from "../types";

export const JV6: NoteUnit = {
  id: "jv-6",
  title: "예외 처리와 기본 API",
  notes: [
    {
      id: "n-jv-6-1",
      emoji: "🚨",
      title: "에러와 예외, 예외 계층",
      summary: "에러는 손쓸 수 없는 문제, 예외는 코드로 대비할 수 있는 문제",
      blocks: [
        { type: "key", text: "손쓸 수 없는 고장이 있고, 미리 대비할 수 있는 사고가 있다" },
        { type: "h2", text: "에러 vs 예외" },
        {
          type: "compare",
          cols: [
            { title: "💥 에러 (Error)", tone: "bad", items: ["JVM(자바 실행기)이나 시스템 쪽 문제", "`OutOfMemoryError`(메모리 바닥), `StackOverflowError`(호출이 너무 깊음)", "코드로 복구 불가"] },
            { title: "⚠️ 예외 (Exception)", tone: "good", items: ["프로그램 실행 중 생긴 문제", "`NullPointerException`, `IOException`", "try-catch로 대비 가능"] },
          ],
        },
        {
          type: "tip",
          kind: "analogy",
          text: "에러는 지진, 예외는 비. 지진은 막을 수 없지만 비는 우산(try-catch)을 챙겨서 대비한다.",
        },
        { type: "h2", text: "예외 족보" },
        {
          type: "list",
          style: "flow",
          items: ["`Object` (모든 클래스의 조상)", "`Throwable` (던질 수 있는 모든 것)", "`Error` / `Exception` 으로 갈라짐", "`Exception` 아래에 `RuntimeException` 과 나머지"],
        },
        {
          type: "table",
          head: ["클래스", "대표 자식", "언제"],
          rows: [
            ["`Error`", "`OutOfMemoryError`", "메모리 부족 같은 시스템 문제"],
            ["`RuntimeException`", "`NullPointerException`(빈 값 사용), `ArithmeticException`(0으로 나누기), `ArrayIndexOutOfBoundsException`(배열 범위 밖)", "대부분 코드 실수"],
            ["그 밖의 `Exception`", "`IOException`(입출력 실패), `SQLException`(DB 실패)", "파일·네트워크 같은 외부 상황"],
          ],
        },
        { type: "h2", text: "예외도 객체다" },
        {
          type: "code",
          code: `int[] arr = {1, 2, 3};
try {
    System.out.println(arr[5]);              // 5번 칸이 없다 → 예외 객체가 던져짐
} catch (ArrayIndexOutOfBoundsException e) { // 던져진 예외를 e 로 받는다
    System.out.println(e.getMessage());      // 예외에 담긴 설명 꺼내기
}
System.out.println("프로그램 계속");          // 잡았으니 멈추지 않는다`,
          out: "Index 5 out of bounds for length 3\n프로그램 계속",
        },
        {
          type: "p",
          text: "예외가 나면 자바는 예외 객체를 만들어 던진다. 아무도 안 잡으면 프로그램이 멈추고 스택 트레이스(어디서 터졌는지 호출 경로 목록)가 찍힌다.",
        },
        {
          type: "list",
          style: "check",
          items: ["Error는 복구 불가, Exception은 처리 대상", "모든 예외의 뿌리는 `Throwable`", "`RuntimeException` 은 대부분 코드 실수"],
        },
      ],
    },
    {
      id: "n-jv-6-2",
      emoji: "🪤",
      title: "try-catch-finally와 멀티 catch",
      summary: "try에서 터지면 catch로 점프, finally는 무슨 일이 있어도 실행된다",
      blocks: [
        { type: "key", text: "try는 줄타기, catch는 아래 안전망, finally는 공연 뒤 뒷정리" },
        { type: "h2", text: "기본 모양" },
        {
          type: "code",
          code: `try {
    int n = Integer.parseInt("abc");     // 숫자가 아니라서 여기서 예외
    System.out.println(10 / n);          // 위에서 터졌으니 실행 안 됨
} catch (NumberFormatException e) {      // 터진 예외 타입이 맞으니 여기로 점프
    System.out.println("숫자 아님: " + e.getMessage());
} finally {
    System.out.println("finally 는 항상");   // 예외가 있든 없든 실행
}`,
          out: "숫자 아님: For input string: \"abc\"\nfinally 는 항상",
        },
        {
          type: "list",
          style: "flow",
          items: ["try 블록 실행", "예외 발생 → 그 아래 줄은 건너뜀", "타입이 맞는 catch 블록 실행", "finally 블록 실행 (예외가 없어도)"],
        },
        {
          type: "table",
          head: ["🐍 파이썬", "☕ 자바"],
          rows: [
            ["`try:`", "`try { }`"],
            ["`except ValueError as e:`", "`catch (NumberFormatException e) { }`"],
            ["`finally:`", "`finally { }`"],
            ["`else:`", "없음. try 끝에 이어 쓴다"],
          ],
        },
        { type: "h2", text: "catch 하나로 여러 예외 받기" },
        {
          type: "code",
          code: `static void test(String s) {
    try {
        System.out.println(10 / Integer.parseInt(s));
    } catch (NumberFormatException | ArithmeticException e) {   // | 는 "또는"
        System.out.println(e.getClass().getSimpleName());       // 어떤 예외였는지 이름 출력
    }
}

test("0");   // 10 / 0 → ArithmeticException
test("x");   // "x" 는 숫자 아님 → NumberFormatException`,
          out: "ArithmeticException\nNumberFormatException",
        },
        {
          type: "tip",
          kind: "warn",
          text: "catch를 여러 개 쓸 땐 좁은(자식) 예외부터 적는다. `catch (Exception e)` 를 맨 위에 두면 아래 catch에 닿을 수 없어 컴파일 에러.",
        },
        {
          type: "list",
          style: "check",
          items: ["예외가 나면 try의 나머지 줄은 건너뛴다", "`|` 로 여러 예외를 catch 하나에", "catch 순서는 좁은 예외 → 넓은 예외"],
        },
      ],
    },
    {
      id: "n-jv-6-3",
      emoji: "🎯",
      title: "checked·unchecked와 throws·throw",
      summary: "checked 예외는 컴파일러가 처리를 강제, throws로 떠넘기고 throw로 던진다",
      blocks: [
        { type: "key", text: "어떤 예외는 '대비책 없으면 출발 금지'라고 컴파일러가 막아 선다" },
        { type: "h2", text: "checked vs unchecked" },
        {
          type: "table",
          head: ["", "checked (검사받는 예외)", "unchecked (검사 안 받는 예외)"],
          rows: [
            ["범위", "`RuntimeException` 이 아닌 `Exception`", "`RuntimeException` 과 그 자식"],
            ["컴파일러", "처리 안 하면 컴파일 에러", "검사 안 함"],
            ["예", "`IOException`, `InterruptedException`", "`NullPointerException`, `IllegalArgumentException`"],
            ["원인", "외부 상황 (파일, 네트워크)", "주로 코드 실수"],
          ],
        },
        {
          type: "p",
          text: "파이썬은 모든 예외가 unchecked처럼 동작한다. 자바의 checked 예외는 '이건 꼭 대비해' 하고 컴파일러가 확인하는 장치다.",
        },
        { type: "h2", text: "throws와 throw" },
        {
          type: "compare",
          cols: [
            { title: "`throws` (미리 알리기)", items: ["메서드 이름 줄 끝에 붙임", "'나는 이 예외를 던질 수 있다'는 경고 표지판", "처리는 부른 쪽에 떠넘김"] },
            { title: "`throw` (실제로 던지기)", items: ["메서드 몸통 안에서", "예외 객체를 진짜로 던짐", "`throw new 예외(...)`"] },
          ],
        },
        { type: "h2", text: "내가 만드는 예외" },
        {
          type: "code",
          code: `class InsufficientBalanceException extends Exception {   // Exception 을 물려받아 checked 예외가 됨
    InsufficientBalanceException(String message) {
        super(message);                                      // 메시지는 부모에게 맡김
    }
}

static void withdraw(int balance, int amount) throws InsufficientBalanceException {   // 던질 수 있다고 미리 알림
    if (amount > balance) {
        throw new InsufficientBalanceException("잔액 " + balance + "원 부족");      // 실제로 던짐
    }
    System.out.println("출금 완료");
}

try {
    withdraw(1000, 5000);          // try 로 감싸지 않으면 컴파일 에러
} catch (InsufficientBalanceException e) {
    System.out.println("실패: " + e.getMessage());
}`,
          out: "실패: 잔액 1000원 부족",
        },
        {
          type: "compare",
          cols: [
            { title: "`extends Exception`", items: ["checked 예외", "부르는 쪽이 꼭 try-catch나 throws"] },
            { title: "`extends RuntimeException`", items: ["unchecked 예외", "처리는 선택, 요즘 실무에서 많이 씀"] },
          ],
        },
        {
          type: "list",
          style: "check",
          items: ["checked는 try-catch 아니면 throws 필수", "`throws` 는 예고, `throw` 는 진짜 던지기", "예외 클래스는 `Exception` 이나 `RuntimeException` 을 상속"],
        },
      ],
    },
    {
      id: "n-jv-6-4",
      emoji: "🧹",
      title: "try-with-resources",
      summary: "try 괄호 안에 연 자원은 블록이 끝나면 자동으로 close() 된다",
      blocks: [
        { type: "key", text: "빌린 물건을 블록이 끝나면 알아서 반납해 준다" },
        { type: "h2", text: "finally로 닫던 방식" },
        {
          type: "p",
          text: "파일·DB 연결 같은 자원(resource)은 다 쓰면 `close()` 로 닫아야 한다. 예전엔 finally에서 직접 닫았다.",
        },
        {
          type: "code",
          code: `BufferedReader br = null;
try {
    br = new BufferedReader(new FileReader("a.txt"));   // 파일 열기
    System.out.println(br.readLine());                 // 한 줄 읽기
} finally {
    if (br != null) br.close();      // 열기 전에 실패했으면 null 이라 검사 필요
}`,
        },
        {
          type: "compare",
          cols: [
            { title: "finally에서 close", tone: "bad", items: ["null 검사 필요", "코드가 길어짐", "닫는 걸 잊기 쉬움"] },
            { title: "try-with-resources", tone: "good", items: ["`try (자원 선언) { }`", "블록이 끝나면 자동 close", "예외가 나도 닫힘"] },
          ],
        },
        { type: "h2", text: "자동으로 닫히는 순서" },
        {
          type: "code",
          code: `class Res implements AutoCloseable {   // AutoCloseable 이면 자동 닫기 대상
    String name;
    Res(String name) { this.name = name; System.out.println(name + " 열기"); }
    @Override
    public void close() { System.out.println(name + " 닫기"); }
}

try (Res a = new Res("A"); Res b = new Res("B")) {   // 괄호 안에서 연다
    System.out.println("사용 중");
}                                                      // 여기서 close() 가 자동 호출
System.out.println("끝");`,
          out: "A 열기\nB 열기\n사용 중\nB 닫기\nA 닫기\n끝",
        },
        {
          type: "tip",
          kind: "memo",
          text: "닫는 순서는 연 순서의 반대. 쌓은 접시를 위에서부터 꺼내듯 나중에 연 B가 먼저 닫힌다.",
        },
        {
          type: "tip",
          kind: "analogy",
          text: "파이썬 `with open(...) as f:` 와 같은 역할. 호텔 방을 나가면 문이 저절로 잠기듯 블록을 나가면 자원이 닫힌다.",
        },
        {
          type: "list",
          style: "check",
          items: ["`AutoCloseable` 을 구현한 객체만 괄호 안에 넣을 수 있다", "여러 개는 `;` 로 구분, 닫기는 역순", "파일·DB 연결은 try-with-resources가 기본"],
        },
      ],
    },
    {
      id: "n-jv-6-5",
      emoji: "📦",
      title: "래퍼 클래스와 오토박싱",
      summary: "기본형을 객체로 감싼 게 래퍼 클래스, 비교는 ==가 아니라 equals",
      blocks: [
        { type: "key", text: "맨 숫자는 컬렉션에 못 들어간다. 상자에 넣어 포장해야 들어간다" },
        { type: "h2", text: "기본형과 래퍼 클래스" },
        {
          type: "p",
          text: "래퍼 클래스(wrapper, 감싸는 클래스)는 `int` 같은 기본형 값을 담는 객체 상자다. `ArrayList<int>` 는 안 되고 `ArrayList<Integer>` 만 된다.",
        },
        {
          type: "table",
          head: ["기본형", "래퍼 클래스"],
          rows: [
            ["`int`", "`Integer`"],
            ["`char`", "`Character`"],
            ["`double`", "`Double`"],
            ["`boolean`", "`Boolean`"],
            ["`long` · `byte` · `short` · `float`", "첫 글자만 대문자"],
          ],
        },
        { type: "h2", text: "자동 포장과 자동 개봉" },
        {
          type: "code",
          code: `Integer boxed = 10;      // 오토박싱: int 를 Integer 상자에 자동 포장
int raw = boxed + 5;     // 언박싱: 계산하려고 상자를 자동으로 열어 int 로
System.out.println(raw);

Integer nil = null;      // 빈 상자 (아무것도 없음)
int z = nil;             // 빈 상자를 열면 NullPointerException`,
          out: "15",
        },
        {
          type: "tip",
          kind: "warn",
          text: "`null` 인 `Integer` 를 `int` 로 꺼내면 `NullPointerException`. 기본형은 null을 담을 수 없다.",
        },
        { type: "h2", text: "Integer 캐시 == 함정" },
        {
          type: "code",
          code: `Integer a = 127, b = 127;
Integer c = 128, d = 128;
System.out.println(a == b);        // 작은 수는 미리 만든 상자를 같이 써서 true
System.out.println(c == d);        // 128 부터는 상자가 따로라 false
System.out.println(c.equals(d));   // 상자 속 값 비교라 true`,
          out: "true\nfalse\ntrue",
        },
        {
          type: "compare",
          cols: [
            { title: "`==`", tone: "bad", items: ["같은 상자(객체)인지 비교", "-128~127은 자바가 미리 만든 상자를 재사용해서 우연히 true", "128부터 false"] },
            { title: "`equals`", tone: "good", items: ["상자 속 값이 같은지 비교", "범위와 상관없이 정확"] },
          ],
        },
        { type: "h2", text: "문자열 ↔ 숫자" },
        {
          type: "code",
          code: `int n = Integer.parseInt("42");          // 문자열 → int
double x = Double.parseDouble("3.5");    // 문자열 → double
System.out.println(n + x);               // 숫자끼리 더하기
System.out.println(String.valueOf(n) + 1);   // 문자열 "42" 뒤에 1 을 이어 붙임`,
          out: "45.5\n421",
        },
        {
          type: "list",
          style: "check",
          items: ["래퍼 클래스 비교는 무조건 `equals`", "문자열 → 숫자는 `Integer.parseInt`", "null 언박싱은 `NullPointerException`"],
        },
      ],
    },
    {
      id: "n-jv-6-6",
      emoji: "🧰",
      title: "자주 쓰는 API: Math·Random·LocalDate",
      summary: "계산은 Math, 난수는 Random, 날짜는 LocalDate부터 써 보자",
      blocks: [
        { type: "key", text: "직접 만들기 전에 자바 공구함부터 열어 본다" },
        { type: "h2", text: "Math: 계산 도구" },
        {
          type: "code",
          code: `System.out.println(Math.abs(-7));       // 절댓값
System.out.println(Math.max(3, 9));     // 큰 쪽
System.out.println(Math.pow(2, 10));    // 2의 10제곱, 결과는 double
System.out.println(Math.sqrt(16));      // 제곱근, 결과는 double
System.out.println(Math.round(3.5));    // 반올림
System.out.println(Math.round(-3.5));   // -4 가 아니라 -3`,
          out: "7\n9\n1024.0\n4.0\n4\n-3",
        },
        {
          type: "tip",
          kind: "warn",
          text: "`Math.round` 는 0.5를 더한 뒤 내림한다. 그래서 `Math.round(-3.5)` 는 -3.0을 내림한 -3이다.",
        },
        { type: "h2", text: "Random: 난수 도구" },
        {
          type: "code",
          code: `Random r = new Random(42);         // 씨앗(seed) 고정: 매번 같은 순서로 나옴
System.out.println(r.nextInt(10)); // 0~9 중 하나
System.out.println(r.nextInt(10));`,
          out: "0\n3",
        },
        {
          type: "compare",
          cols: [
            { title: "`Math.random()`", items: ["0.0 이상 1.0 미만 실수", "주사위: `(int) (Math.random() * 6) + 1`"] },
            { title: "`new Random()`", items: ["`nextInt(n)` 으로 0~n-1 정수", "seed를 주면 매번 같은 순서"] },
          ],
        },
        { type: "h2", text: "LocalDate: 날짜 도구" },
        {
          type: "code",
          code: `LocalDate d = LocalDate.of(2026, 1, 31);
System.out.println(d.plusMonths(1));   // 2월 31일은 없으니 2월 말일로
System.out.println(d.plusDays(1));
System.out.println(d.getDayOfWeek());  // 요일
System.out.println(d.isLeapYear());    // 윤년인가`,
          out: "2026-02-28\n2026-02-01\nSATURDAY\nfalse",
        },
        {
          type: "list",
          items: [
            "오늘 날짜는 `LocalDate.now()`",
            "`plusMonths` 는 말일을 넘기면 그 달 마지막 날로 맞춘다",
            "`LocalDate` 는 불변(한번 만들면 안 바뀜) 객체. `plus` 는 새 객체를 돌려주고 원본은 그대로",
          ],
        },
        {
          type: "tip",
          kind: "memo",
          text: "`Math` 는 `java.lang` 이라 import가 필요 없다. `Random` 은 `java.util`, `LocalDate` 는 `java.time` 에서 import.",
        },
        {
          type: "list",
          style: "check",
          items: ["`Math` 메서드는 static(객체 없이 부름)이라 `Math.이름()` 으로 바로", "테스트용 난수는 seed 고정", "날짜는 `LocalDate`, 계산 결과는 새 객체"],
        },
      ],
    },
  ],
};
