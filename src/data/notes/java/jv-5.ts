// 자바 단원 5 — 상속과 다형성 (시중 입문서 목차 기준). 작성 규칙은 ../python.ts 상단 주석.
import type { NoteUnit } from "../types";

export const JV5: NoteUnit = {
  id: "jv-5",
  title: "상속과 다형성",
  notes: [
    {
      id: "n-jv-5-1",
      emoji: "🧬",
      title: "상속: extends와 super",
      summary: "extends로 부모를 물려받고, 자식 생성자는 super()로 부모 생성자부터 부른다",
      blocks: [
        { type: "key", text: "자식은 부모가 가진 걸 그대로 물려받고, 자기 것만 더 얹는다" },
        { type: "h2", text: "extends로 물려받기" },
        {
          type: "p",
          text: "상속(inheritance)은 부모 클래스의 필드·메서드를 자식 클래스가 그대로 받아 쓰는 문법이다. `class Dog extends Animal` 이라고 쓰면 Dog 는 Animal 의 모든 걸 가진 채 시작한다.",
        },
        {
          type: "code",
          code: `class Animal {
    String name;
    Animal(String name) {
        this.name = name;
        System.out.println("Animal 생성자");
    }
    void eat() { System.out.println(name + " 냠냠"); }
}

class Dog extends Animal {          // Dog 는 Animal 을 물려받는다
    Dog(String name) {
        super(name);                 // 부모 생성자 먼저 부르기
        System.out.println("Dog 생성자");
    }
    void bark() { System.out.println(name + " 멍멍"); }   // name 은 부모에게 받은 필드
}

Dog d = new Dog("초코");
d.eat();     // Dog 에 안 썼지만 부모에게 받아서 쓸 수 있다
d.bark();`,
          out: "Animal 생성자\nDog 생성자\n초코 냠냠\n초코 멍멍",
        },
        { type: "h2", text: "생성자는 부모부터" },
        {
          type: "list",
          style: "flow",
          items: ["`new Dog(\"초코\")` 호출", "Dog 생성자 첫 줄 `super(name)` 실행", "Animal 생성자가 먼저 끝남", "Dog 생성자 나머지 실행"],
        },
        {
          type: "tip",
          kind: "analogy",
          text: "집은 1층부터 짓는다. 부모 부분(1층)이 먼저 완성돼야 자식 부분(2층)을 올릴 수 있다.",
        },
        {
          type: "table",
          head: ["문법", "하는 일"],
          rows: [
            ["`super(...)`", "부모 생성자 부르기. 생성자 첫 줄에만"],
            ["`super.메서드()`", "부모 쪽 메서드 부르기"],
            ["`this(...)`", "같은 클래스의 다른 생성자 부르기"],
          ],
        },
        {
          type: "tip",
          kind: "warn",
          text: "`super(...)` 를 안 쓰면 컴파일러가 `super()` 를 몰래 넣는다. 부모에 빈 괄호 생성자가 없으면 컴파일 에러(실행 전에 나는 문법 에러)가 난다.",
        },
        { type: "h2", text: "부모는 하나만" },
        {
          type: "compare",
          cols: [
            { title: "🐍 파이썬", items: ["`class C(A, B):` 부모 여럿 가능", "겹치는 이름은 MRO(메서드 찾는 순서)로 정리"] },
            { title: "☕ 자바", items: ["`extends` 뒤에 클래스 하나만", "여러 개가 필요하면 인터페이스로"] },
          ],
        },
        {
          type: "p",
          text: "`extends` 를 안 적으면 자동으로 `Object` 를 물려받는다. 그래서 모든 클래스의 맨 위 조상은 `Object` 다.",
        },
        {
          type: "list",
          style: "check",
          items: ["`extends` 는 부모 하나만", "생성자는 부모 먼저, `super(...)` 는 첫 줄", "안 적으면 컴파일러가 `super()` 를 넣는다"],
        },
      ],
    },
    {
      id: "n-jv-5-2",
      emoji: "🔁",
      title: "메서드 오버라이딩과 @Override",
      summary: "부모 메서드를 같은 모양으로 다시 쓰면 오버라이딩, @Override로 실수 방지",
      blocks: [
        { type: "key", text: "물려받은 요리법을 이름은 그대로 두고 내 입맛대로 고쳐 쓴다" },
        { type: "h2", text: "부모 메서드 덮어쓰기" },
        {
          type: "p",
          text: "오버라이딩(overriding)은 부모 메서드를 자식이 같은 이름·같은 매개변수로 다시 쓰는 문법이다. 자식 객체에서는 새로 쓴 쪽이 실행된다.",
        },
        {
          type: "code",
          code: `class Animal {
    void sound() { System.out.println("..."); }
}

class Dog extends Animal {
    @Override
    void sound() { System.out.println("멍멍"); }   // 부모 것 대신 이게 실행
}

class Cat extends Animal {
    @Override
    void sound() {
        super.sound();               // 부모 것("...")도 먼저 실행
        System.out.println("야옹");
    }
}

new Dog().sound();
new Cat().sound();`,
          out: "멍멍\n...\n야옹",
        },
        { type: "h2", text: "@Override를 붙이는 이유" },
        {
          type: "p",
          text: "`@Override` 는 어노테이션(컴파일러에게 붙이는 메모)이다. '이건 부모 메서드를 덮어쓴 거야'라고 알려서 검사를 받는다.",
        },
        {
          type: "compare",
          cols: [
            { title: "없이 오타", tone: "bad", items: ["`void Sound()` 로 잘못 씀", "새 메서드로 인식, 에러 없음", "부모 것이 그대로 실행됨"] },
            { title: "@Override 붙임", tone: "good", items: ["부모에 같은 메서드가 없으면 컴파일 에러", "오타를 바로 잡아 준다"] },
          ],
        },
        { type: "h2", text: "오버라이딩 vs 오버로딩" },
        {
          type: "table",
          head: ["", "오버라이딩", "오버로딩"],
          rows: [
            ["한 줄 뜻", "부모 메서드를 내용만 새로 쓰기", "같은 이름으로 매개변수만 다른 메서드 여러 개"],
            ["어디서", "부모와 자식 사이", "같은 클래스 안"],
            ["매개변수", "똑같아야 함", "개수나 타입이 달라야 함"],
          ],
        },
        {
          type: "tip",
          kind: "memo",
          text: "오버라이딩은 덮어쓰기(override), 오버로딩은 짐 더 싣기(overload). 세부 규칙: 오버라이딩한 메서드의 반환 타입은 부모와 같거나 그 자식 타입이어야 하고, 접근 제어자(public 같은 공개 범위)는 부모보다 좁힐 수 없다.",
        },
        {
          type: "list",
          style: "check",
          items: ["오버라이딩 = 이름·매개변수 같게, 내용만 새로", "`@Override` 는 항상 붙인다", "부모 것도 쓰려면 `super.메서드()`"],
        },
      ],
    },
    {
      id: "n-jv-5-3",
      emoji: "🎭",
      title: "다형성과 형변환·instanceof",
      summary: "부모 타입 변수에 자식 객체를 담고, 호출은 실제 객체의 메서드가 실행된다",
      blocks: [
        { type: "key", text: "이름표에 '동물'이라고 써 붙여도 짖는 건 진짜 개다" },
        { type: "h2", text: "부모 타입으로 묶어 받기" },
        {
          type: "p",
          text: "다형성(polymorphism)은 같은 코드 한 줄이 실제 객체에 따라 다르게 동작하는 성질이다. 아래 `a.sound()` 는 한 줄인데 개면 멍멍, 고양이면 야옹이 나온다.",
        },
        {
          type: "code",
          code: `Animal[] zoo = { new Dog(), new Cat() };   // 앞 노트의 Dog·Cat
for (Animal a : zoo) {
    a.sound();                   // 변수 타입은 Animal, 실행은 실제 객체(Dog/Cat) 것
}`,
          out: "멍멍\n...\n야옹",
        },
        {
          type: "p",
          text: "파이썬은 타입 선언이 없어 원래 이렇게 동작한다. 자바는 변수에 타입이 있어서 부모 타입으로 묶어야 한 코드로 다룰 수 있다.",
        },
        { type: "h2", text: "업캐스팅과 다운캐스팅" },
        {
          type: "code",
          code: `// Dog 에만 fetch() 메서드가 있다고 하자 ("공 물어 옴" 출력)
Animal a = new Dog();           // 업캐스팅: 자동으로 된다
// a.fetch();                    // 컴파일 에러: Animal 이라는 이름표엔 fetch 가 없음
Dog d = (Dog) a;                 // 다운캐스팅: (Dog) 로 직접 바꿔 줘야 한다
d.fetch();`,
          out: "공 물어 옴",
        },
        {
          type: "tip",
          kind: "analogy",
          text: "리모컨(변수 타입)에 있는 버튼만 누를 수 있다. 버튼을 누르면 실제 TV(객체)가 자기 방식대로 반응한다.",
        },
        {
          type: "compare",
          cols: [
            { title: "⬆️ 업캐스팅", items: ["자식 객체를 부모 타입 변수에 담기", "자동, 항상 안전", "부모에 있는 메서드만 부를 수 있음"] },
            { title: "⬇️ 다운캐스팅", items: ["부모 타입 변수를 다시 자식 타입으로 바꾸기", "`(Dog)` 처럼 직접 적어야 함", "실제 객체가 다르면 `ClassCastException`(형변환 실패 예외)"] },
          ],
        },
        { type: "h2", text: "바꾸기 전에 instanceof로 확인" },
        {
          type: "code",
          code: `Animal c = new Cat();
if (c instanceof Dog dog) {      // c 가 진짜 Dog 면 dog 라는 이름으로 바로 꺼낸다
    dog.fetch();
} else {
    System.out.println("Dog 아님");   // c 는 Cat 이라 여기로
}`,
          out: "Dog 아님",
        },
        {
          type: "compare",
          cols: [
            { title: "옛날 방식", items: ["`if (c instanceof Dog)`", "안에서 `Dog dog = (Dog) c;` 한 번 더"] },
            { title: "Java 16+", tone: "good", items: ["`if (c instanceof Dog dog)`", "검사와 형변환을 한 줄에"] },
          ],
        },
        {
          type: "list",
          style: "check",
          items: ["부모 타입 변수로 받아도 실행은 실제 객체 메서드", "업캐스팅은 자동, 다운캐스팅은 `(타입)`", "다운캐스팅 전엔 `instanceof` 로 확인"],
        },
      ],
    },
    {
      id: "n-jv-5-4",
      emoji: "🔒",
      title: "final과 Object 클래스",
      summary: "final은 더 이상 못 바꾸게 막고, Object의 toString·equals·hashCode는 재정의",
      blocks: [
        { type: "key", text: "final은 자물쇠, Object는 모든 클래스의 공통 조상" },
        { type: "h2", text: "final 세 군데" },
        {
          type: "table",
          head: ["붙는 곳", "막는 것", "예"],
          rows: [
            ["변수", "값 바꾸기 (상수가 된다)", "`final int MAX = 10;`"],
            ["메서드", "자식이 덮어쓰기", "`final void pay()`"],
            ["클래스", "물려받기", "`final class String`"],
          ],
        },
        {
          type: "tip",
          kind: "memo",
          text: "`String` 이 final 클래스다. 아무도 물려받아서 동작을 바꾸지 못하게 잠가 뒀다.",
        },
        { type: "h2", text: "Object가 주는 메서드" },
        {
          type: "table",
          head: ["메서드", "그냥 두면", "파이썬 대응"],
          rows: [
            ["`toString()`", "`Point@1b6d3586` 같은 클래스명@해시값이 찍힘", "`__str__`"],
            ["`equals(Object o)`", "`==` 와 같음 (같은 객체인가)", "`__eq__`"],
            ["`hashCode()`", "객체를 대표하는 정수(해시값), 보통 객체마다 다름", "`__hash__`"],
          ],
        },
        { type: "h2", text: "재정의하면 값으로 비교" },
        {
          type: "code",
          code: `class Point {
    final int x, y;
    Point(int x, int y) { this.x = x; this.y = y; }

    @Override
    public String toString() { return "Point(" + x + ", " + y + ")"; }   // 출력 모양 정하기

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof Point p)) return false;   // Point 가 아니면 다른 것
        return x == p.x && y == p.y;                 // x, y 가 같으면 같은 값
    }

    @Override
    public int hashCode() { return Objects.hash(x, y); }   // 같은 값이면 같은 해시
}

Point p1 = new Point(1, 2);
Point p2 = new Point(1, 2);
System.out.println(p1);             // toString() 이 자동 호출
System.out.println(p1 == p2);       // 같은 객체? 따로 new 했으니 false
System.out.println(p1.equals(p2));  // 같은 값? true

Set<Point> set = new HashSet<>();
set.add(p1);
set.add(p2);                        // 같은 값이라 중복으로 보고 안 넣음
System.out.println(set.size());`,
          out: "Point(1, 2)\nfalse\ntrue\n1",
        },
        {
          type: "tip",
          kind: "analogy",
          text: "`HashSet` 은 사물함이다. `hashCode` 로 몇 번 칸인지 정하고, 그 칸 안에서 `equals` 로 같은 물건인지 확인한다.",
        },
        {
          type: "tip",
          kind: "warn",
          text: "`equals` 와 `hashCode` 는 짝으로 재정의한다. `equals` 만 바꾸면 같은 값이 다른 칸에 들어가 중복이 생긴다.",
        },
        {
          type: "list",
          style: "check",
          items: ["final: 변수는 상수, 메서드는 덮어쓰기 금지, 클래스는 상속 금지", "`==` 는 같은 객체, `equals` 는 같은 값", "`equals` 를 바꾸면 `hashCode` 도 같이"],
        },
      ],
    },
    {
      id: "n-jv-5-5",
      emoji: "📐",
      title: "추상 클래스 abstract",
      summary: "몸통 없는 추상 메서드를 가진 미완성 설계도, 자식이 반드시 채워야 한다",
      blocks: [
        { type: "key", text: "빈칸이 남은 신청서 양식은 그대로 낼 수 없다. 빈칸을 채운 사본만 낸다" },
        { type: "h2", text: "추상 메서드와 추상 클래스" },
        {
          type: "compare",
          cols: [
            { title: "추상 메서드", items: ["이름만 있고 `{ }` 몸통이 없는 메서드", "신청서의 빈칸", "자식이 반드시 채운다"] },
            { title: "추상 클래스", items: ["추상 메서드를 가진 미완성 클래스", "신청서 양식", "`new` 로 객체를 못 만든다"] },
          ],
        },
        {
          type: "code",
          code: `abstract class Shape {
    abstract double area();          // 빈칸: 넓이 구하는 법은 도형마다 다르다

    void describe() {                // 일반 메서드도 가질 수 있다
        System.out.printf("넓이: %.2f%n", area());   // 실제 도형의 area() 가 불린다
    }
}

class Circle extends Shape {
    double r;
    Circle(double r) { this.r = r; }
    @Override double area() { return Math.PI * r * r; }   // 빈칸 채우기
}

class Rect extends Shape {
    double w, h;
    Rect(double w, double h) { this.w = w; this.h = h; }
    @Override double area() { return w * h; }
}

Shape[] shapes = { new Circle(1), new Rect(2, 3) };
for (Shape s : shapes) {
    s.describe();
}`,
          out: "넓이: 3.14\n넓이: 6.00",
        },
        { type: "h2", text: "규칙 정리" },
        {
          type: "list",
          items: [
            "추상 메서드가 하나라도 있으면 클래스에도 `abstract`",
            "`new Shape()` 는 컴파일 에러",
            "자식은 추상 메서드를 전부 오버라이딩해야 한다. 아니면 자식도 abstract",
            "필드, 생성자, 일반 메서드는 평소처럼 가질 수 있다",
          ],
        },
        {
          type: "compare",
          cols: [
            { title: "🐍 파이썬", items: ["`from abc import ABC, abstractmethod`", "모듈을 import해서 흉내"] },
            { title: "☕ 자바", items: ["`abstract` 키워드가 문법에 있음", "안 채우면 컴파일 단계에서 막힘"] },
          ],
        },
        {
          type: "list",
          style: "check",
          items: ["추상 메서드 = 몸통 없는 메서드, 자식이 강제로 구현", "추상 클래스는 `new` 불가", "공통 코드는 부모에, 다른 부분만 추상으로"],
        },
      ],
    },
    {
      id: "n-jv-5-6",
      emoji: "🔌",
      title: "인터페이스와 추상 클래스 비교",
      summary: "인터페이스는 할 수 있는 일의 약속, implements로 여러 개를 동시에 구현한다",
      blocks: [
        { type: "key", text: "부모는 하나뿐이지만 '이런 일을 할 수 있다'는 약속은 여러 개 할 수 있다" },
        { type: "h2", text: "implements와 다중 구현" },
        {
          type: "p",
          text: "인터페이스(interface)는 '이 메서드들을 갖추겠다'는 약속 목록이다. 클래스가 `implements` 로 약속하면 그 메서드를 전부 만들어야 한다.",
        },
        {
          type: "code",
          code: `interface Flyable {
    void fly();                      // 몸통 없는 약속 (public abstract 가 자동으로 붙음)
    default void rest() { System.out.println("날개 접고 쉼"); }   // 기본 구현이 있는 메서드
}

interface Swimmable {
    void swim();
}

class Duck implements Flyable, Swimmable {      // 약속 두 개를 동시에
    @Override public void fly()  { System.out.println("푸드덕"); }
    @Override public void swim() { System.out.println("첨벙"); }
}

Duck d = new Duck();
d.fly();
d.swim();
d.rest();                        // Duck 에 안 썼지만 default 메서드라 쓸 수 있다
Flyable f = d;                   // 인터페이스 타입 변수에도 담을 수 있다
f.fly();`,
          out: "푸드덕\n첨벙\n날개 접고 쉼\n푸드덕",
        },
        {
          type: "tip",
          kind: "analogy",
          text: "인터페이스는 자격증. 오리는 비행 자격증과 수영 자격증을 동시에 딸 수 있다. 부모(혈통)는 하나뿐이지만 자격증은 여러 개.",
        },
        { type: "h2", text: "인터페이스에 넣을 수 있는 것" },
        {
          type: "table",
          head: ["멤버", "쉽게 말하면", "비고"],
          rows: [
            ["추상 메서드", "몸통 없는 약속. `public abstract` 자동", "구현 클래스가 반드시 만든다"],
            ["상수", "바꿀 수 없는 공용 값. `public static final` 자동", "일반 필드는 못 가짐"],
            ["default 메서드", "기본 구현이 들어 있는 메서드", "Java 8+, 필요하면 덮어쓰기"],
            ["static 메서드", "객체 없이 부르는 도구 메서드", "`인터페이스명.메서드()` 로 호출"],
          ],
        },
        {
          type: "tip",
          kind: "warn",
          text: "구현 메서드에 `public` 을 빼면 컴파일 에러. 인터페이스 메서드는 원래 public이라 더 좁힐 수 없다.",
        },
        { type: "h2", text: "추상 클래스 vs 인터페이스" },
        {
          type: "table",
          head: ["", "추상 클래스", "인터페이스"],
          rows: [
            ["키워드", "`extends`", "`implements`"],
            ["개수", "하나만", "여러 개"],
            ["필드", "일반 필드 가능", "상수만"],
            ["생성자", "있음", "없음"],
            ["관계", "~은 ~이다 (개는 동물이다)", "~할 수 있다 (오리는 날 수 있다)"],
          ],
        },
        {
          type: "tip",
          kind: "memo",
          text: "파이썬은 부모 여럿의 충돌을 MRO로 정리한다. 자바는 필드(상태)는 부모 하나에서만 받고, 기능 약속만 인터페이스로 여러 개 받아서 충돌을 피한다.",
        },
        {
          type: "list",
          style: "check",
          items: ["`class A extends B implements C, D` 가 기본 모양", "인터페이스 메서드는 자동 public abstract", "공통 코드 물려주기는 추상 클래스, 능력 약속은 인터페이스"],
        },
      ],
    },
  ],
};
