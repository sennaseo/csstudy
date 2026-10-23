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
        { type: "key", text: "에러는 못 막고, 예외는 잡아서 처리한다" },
        { type: "h2", text: "에러 vs 예외" },
        {
          type: "compare",
          cols: [
            { title: "💥 에러 (Error)", tone: "bad", items: ["JVM이나 시스템 쪽 문제", "`OutOfMemoryError`, `StackOverflowError`", "코드로 복구 불가"] },
            { title: "⚠️ 예외 (Exception)", tone: "good", items: ["프로그램 실행 중 생긴 문제", "`NullPointerException`, `IOException`", "try-catch로 대비 가능"] },
          ],
        },
        {
          type: "tip",
          kind: "analogy",
          text: "에러는 지진, 예외는 비. 지진은 막을 수 없지만 비는 우산(try-catch)을 챙겨서 대비한다.",
        },
        { type: "h2", text: "예외 계층" },
        {
          type: "list",
          style: "flow",
          items: ["`Object`", "`Throwable` (던질 수 있는 모든 것)", "`Error` / `Exception` 으로 갈라짐", "`Exception` 아래에 `RuntimeException` 과 나머지"],
        },
        {
          type: "table",
          head: ["클래스", "대표 자식", "언제"],
          rows: [
            ["`Error`", "`OutOfMemoryError`", "메모리 부족 같은 시스템 문제"],
            ["`RuntimeException`", "`NullPointerException`, `ArithmeticException`, `ArrayIndexOutOfBoundsException`", "대부분 코드 실수"],
            ["그 밖의 `Exception`", "`IOException`, `SQLException`", "파일·네트워크 같은 외부 상황"],
          ],
        },
        { type: "h2", text: "예외도 객체다" },
        {
          type: "code",
          code: `int[] arr = {1, 2, 3};
try {
    System.out.println(arr[5]);
} catch (ArrayIndexOutOfBoundsException e) {
    System.out.println(e.getMessage());
}
System.out.println("프로그램 계속");`,
          out: "Index 5 out of bounds for length 3\n프로그램 계속",
        },
        {
          type: "p",
          text: "예외가 나면 자바는 예외 객체를 만들어 던진다. 아무도 안 잡으면 프로그램이 멈추고 스택 트레이스가 찍힌다.",
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
        { type: "key", text: "try에서 터지면 catch, finally는 항상" },
        { type: "h2", text: "기본 모양" },
        {
          type: "code",
          code: `try {
    int n = Integer.parseInt("abc");
    System.out.println(10 / n);      // 실행 안 됨
} catch (NumberFormatException e) {
    System.out.println("숫자 아님: " + e.getMessage());
} finally {
    System.out.println("finally 는 항상");
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
        { type: "h2", text: "멀티 catch" },
        {
          type: "code",
          code: `static void test(String s) {
    try {
        System.out.println(10 / Integer.parseInt(s));
    } catch (NumberFormatException | ArithmeticException e) {
        System.out.println(e.getClass().getSimpleName());
    }
}

test("0");
test("x");`,
          out: "ArithmeticException\nNumberFormatException",
        },
        {
          type: "tip",
          kind: "warn",
          text: "catch를 여러 개 쓸 땐 자식 예외부터 적는다. `catch (Exception e)` 를 맨 위에 두면 아래 catch에 닿을 수 없어 컴파일 에러.",
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
        { type: "key", text: "checked는 처리 강제, unchecked는 선택" },
        { type: "h2", text: "checked vs unchecked" },
        {
          type: "table",
          head: ["", "checked", "unchecked"],
          rows: [
            ["범위", "`RuntimeException` 이 아닌 `Exception`", "`RuntimeException` 과 그 자식"],
            ["컴파일러", "처리 안 하면 컴파일 에러", "검사 안 함"],
            ["예", "`IOException`, `InterruptedException`", "`NullPointerException`, `IllegalArgumentException`"],
            ["원인", "외부 상황 (파일, 네트워크)", "주로 코드 실수"],
          ],
        },
        {
          type: "p",
          text: "파이썬은 모든 예외가 unchecked처럼 동작한다. 자바의 checked 예외는 '이건 꼭 대비해' 하고 컴파일러가 확인하는 장치.",
        },
        { type: "h2", text: "throws와 throw" },
        {
          type: "compare",
          cols: [
            { title: "`throws` (선언)", items: ["메서드 시그니처 뒤에", "'나는 이 예외를 던질 수 있다'", "호출한 쪽이 처리하게 떠넘김"] },
            { title: "`throw` (실행)", items: ["메서드 몸통 안에서", "예외 객체를 실제로 던짐", "`throw new 예외(...)`"] },
          ],
        },
        { type: "h2", text: "사용자 정의 예외" },
        {
          type: "code",
          code: `class InsufficientBalanceException extends Exception {   // checked
    InsufficientBalanceException(String message) {
        super(message);
    }
}

static void withdraw(int balance, int amount) throws InsufficientBalanceException {
    if (amount > balance) {
        throw new InsufficientBalanceException("잔액 " + balance + "원 부족");
    }
    System.out.println("출금 완료");
}

try {
    withdraw(1000, 5000);
} catch (InsufficientBalanceException e) {
    System.out.println("실패: " + e.getMessage());
}`,
          out: "실패: 잔액 1000원 부족",
        },
        {
          type: "compare",
          cols: [
            { title: "`extends Exception`", items: ["checked 예외", "호출하는 쪽이 꼭 try-catch나 throws"] },
            { title: "`extends RuntimeException`", items: ["unchecked 예외", "처리는 선택, 요즘 실무에서 많이 씀"] },
          ],
        },
        {
          type: "list",
          style: "check",
          items: ["checked는 try-catch 아니면 throws 필수", "`throws` 는 선언, `throw` 는 던지기", "예외 클래스는 `Exception` 이나 `RuntimeException` 을 상속"],
        },
      ],
    },
    {
      id: "n-jv-6-4",
      emoji: "🧹",
      title: "try-with-resources",
      summary: "try 괄호 안에 연 자원은 블록이 끝나면 자동으로 close() 된다",
      blocks: [
        { type: "key", text: "괄호 안에 열면 끝날 때 알아서 닫힌다" },
        { type: "h2", text: "finally로 닫던 방식" },
        {
          type: "code",
          code: `BufferedReader br = null;
try {
    br = new BufferedReader(new FileReader("a.txt"));
    System.out.println(br.readLine());
} finally {
    if (br != null) br.close();      // 닫기도 또 예외가 날 수 있음
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
          code: `class Res implements AutoCloseable {
    String name;
    Res(String name) { this.name = name; System.out.println(name + " 열기"); }
    @Override
    public void close() { System.out.println(name + " 닫기"); }
}

try (Res a = new Res("A"); Res b = new Res("B")) {
    System.out.println("사용 중");
}
System.out.println("끝");`,
          out: "A 열기\nB 열기\n사용 중\nB 닫기\nA 닫기\n끝",
        },
        {
          type: "tip",
          kind: "memo",
          text: "닫는 순서는 연 순서의 반대. 나중에 연 B가 먼저 닫힌다.",
        },
        {
          type: "tip",
          kind: "analogy",
          text: "파이썬 `with open(...) as f:` 와 같은 역할. 블록을 나가면 문이 저절로 닫힌다.",
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
        { type: "key", text: "`int` 는 값, `Integer` 는 객체. 객체 비교는 `equals`" },
        { type: "h2", text: "기본형과 래퍼 클래스" },
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
        {
          type: "p",
          text: "`ArrayList<int>` 는 안 되고 `ArrayList<Integer>` 만 된다. 컬렉션에는 객체만 들어가기 때문.",
        },
        { type: "h2", text: "오토박싱과 언박싱" },
        {
          type: "code",
          code: `Integer boxed = 10;      // 오토박싱: int → Integer
int raw = boxed + 5;     // 언박싱: Integer → int
System.out.println(raw);

Integer nil = null;
int z = nil;             // NullPointerException`,
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
System.out.println(a == b);
System.out.println(c == d);
System.out.println(c.equals(d));`,
          out: "true\nfalse\ntrue",
        },
        {
          type: "compare",
          cols: [
            { title: "`==`", tone: "bad", items: ["같은 객체인지 비교", "-128~127은 캐시된 객체를 재사용해서 우연히 true", "128부터 false"] },
            { title: "`equals`", tone: "good", items: ["값이 같은지 비교", "범위와 상관없이 정확"] },
          ],
        },
        { type: "h2", text: "문자열 ↔ 숫자" },
        {
          type: "code",
          code: `int n = Integer.parseInt("42");
double x = Double.parseDouble("3.5");
System.out.println(n + x);
System.out.println(String.valueOf(n) + 1);`,
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
        { type: "key", text: "직접 만들기 전에 표준 API부터 찾는다" },
        { type: "h2", text: "Math" },
        {
          type: "code",
          code: `System.out.println(Math.abs(-7));
System.out.println(Math.max(3, 9));
System.out.println(Math.pow(2, 10));
System.out.println(Math.sqrt(16));
System.out.println(Math.round(3.5));
System.out.println(Math.round(-3.5));`,
          out: "7\n9\n1024.0\n4.0\n4\n-3",
        },
        {
          type: "tip",
          kind: "warn",
          text: "`Math.pow` 와 `Math.sqrt` 는 `double` 을 돌려준다. `Math.round(-3.5)` 는 -4가 아니라 -3. 0.5를 더하고 내림하는 방식이라서.",
        },
        { type: "h2", text: "Random" },
        {
          type: "code",
          code: `Random r = new Random(42);       // 씨앗(seed) 고정
System.out.println(r.nextInt(10)); // 0~9
System.out.println(r.nextInt(10));`,
          out: "0\n3",
        },
        {
          type: "compare",
          cols: [
            { title: "`Math.random()`", items: ["0.0 이상 1.0 미만 double", "주사위: `(int) (Math.random() * 6) + 1`"] },
            { title: "`new Random()`", items: ["`nextInt(n)` 으로 0~n-1 정수", "seed를 주면 매번 같은 순서"] },
          ],
        },
        { type: "h2", text: "LocalDate" },
        {
          type: "code",
          code: `LocalDate d = LocalDate.of(2026, 1, 31);
System.out.println(d.plusMonths(1));
System.out.println(d.plusDays(1));
System.out.println(d.getDayOfWeek());
System.out.println(d.isLeapYear());`,
          out: "2026-02-28\n2026-02-01\nSATURDAY\nfalse",
        },
        {
          type: "list",
          items: [
            "오늘 날짜는 `LocalDate.now()`",
            "`plusMonths` 는 말일을 넘기면 그 달 마지막 날로 맞춘다",
            "`LocalDate` 는 불변 객체. `plus` 는 새 객체를 돌려주고 원본은 그대로",
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
          items: ["`Math` 메서드는 static이라 `Math.이름()` 으로 바로", "테스트용 난수는 seed 고정", "날짜는 `LocalDate`, 계산 결과는 새 객체"],
        },
      ],
    },
  ],
};
