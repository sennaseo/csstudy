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
        { type: "key", text: "`class 자식 extends 부모` 하나로 필드·메서드를 물려받는다" },
        { type: "h2", text: "extends로 물려받기" },
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

class Dog extends Animal {
    Dog(String name) {
        super(name);                 // 부모 생성자 먼저
        System.out.println("Dog 생성자");
    }
    void bark() { System.out.println(name + " 멍멍"); }
}

Dog d = new Dog("초코");
d.eat();     // 부모에게 물려받은 메서드
d.bark();`,
          out: "Animal 생성자\nDog 생성자\n초코 냠냠\n초코 멍멍",
        },
        { type: "h2", text: "생성자 호출 순서" },
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
          head: ["문법", "가리키는 것"],
          rows: [
            ["`super(...)`", "부모 생성자 호출. 생성자 첫 줄에만"],
            ["`super.메서드()`", "부모 쪽 메서드 호출"],
            ["`this(...)`", "같은 클래스의 다른 생성자 호출"],
          ],
        },
        {
          type: "tip",
          kind: "warn",
          text: "`super(...)` 를 안 쓰면 컴파일러가 `super()` 를 몰래 넣는다. 부모에 매개변수 없는 생성자가 없으면 컴파일 에러.",
        },
        { type: "h2", text: "자바는 단일 상속" },
        {
          type: "compare",
          cols: [
            { title: "🐍 파이썬", items: ["`class C(A, B):` 다중 상속 가능", "충돌은 MRO 순서로 해결"] },
            { title: "☕ 자바", items: ["`extends` 뒤에 클래스 하나만", "여러 개가 필요하면 인터페이스로"] },
          ],
        },
        {
          type: "p",
          text: "부모를 안 적으면 자동으로 `Object` 를 상속한다. 그래서 모든 클래스의 조상은 `Object`.",
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
        { type: "key", text: "이름·매개변수가 같은 메서드를 자식이 다시 쓰면 오버라이딩" },
        { type: "h2", text: "부모 메서드 덮어쓰기" },
        {
          type: "code",
          code: `class Animal {
    void sound() { System.out.println("..."); }
}

class Dog extends Animal {
    @Override
    void sound() { System.out.println("멍멍"); }
}

class Cat extends Animal {
    @Override
    void sound() {
        super.sound();               // 부모 것도 호출
        System.out.println("야옹");
    }
}

new Dog().sound();
new Cat().sound();`,
          out: "멍멍\n...\n야옹",
        },
        { type: "h2", text: "@Override를 붙이는 이유" },
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
            ["뜻", "부모 메서드를 다시 정의", "같은 이름, 다른 매개변수"],
            ["위치", "부모와 자식 사이", "같은 클래스 안"],
            ["매개변수", "똑같아야 함", "개수나 타입이 달라야 함"],
            ["반환 타입", "같거나 하위 타입", "상관없음"],
            ["접근 제어자", "부모보다 좁게 못 함", "상관없음"],
          ],
        },
        {
          type: "tip",
          kind: "memo",
          text: "오버라이딩은 덮어쓰기(override), 오버로딩은 짐 더 싣기(overload). 이름 뜻으로 외우면 안 헷갈린다.",
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
        { type: "key", text: "변수 타입은 부모, 실행되는 메서드는 실제 객체 것" },
        { type: "h2", text: "부모 타입으로 받기" },
        {
          type: "code",
          code: `Animal[] zoo = { new Dog(), new Cat() };
for (Animal a : zoo) {
    a.sound();                   // 실제 객체의 메서드
}`,
          out: "멍멍\n야옹",
        },
        {
          type: "tip",
          kind: "analogy",
          text: "리모컨(변수 타입)에 있는 버튼만 누를 수 있다. 하지만 버튼을 누르면 실제 TV(객체)가 자기 방식대로 반응한다.",
        },
        {
          type: "p",
          text: "파이썬은 타입 선언이 없어 원래 이렇게 동작한다. 자바는 변수 타입이 있어서 부모 타입으로 묶어야 같은 코드로 다룰 수 있다.",
        },
        { type: "h2", text: "업캐스팅과 다운캐스팅" },
        {
          type: "code",
          code: `Animal a = new Dog();            // 업캐스팅 (자동)
// a.fetch();                    // 컴파일 에러: Animal 에는 없음
Dog d = (Dog) a;                 // 다운캐스팅 (명시)
d.fetch();`,
          out: "공 물어 옴",
        },
        {
          type: "compare",
          cols: [
            { title: "⬆️ 업캐스팅", items: ["자식 → 부모", "자동, 항상 안전", "부모에 있는 멤버만 보임"] },
            { title: "⬇️ 다운캐스팅", items: ["부모 → 자식", "`(Dog)` 처럼 직접 적어야 함", "실제 객체가 다르면 `ClassCastException`"] },
          ],
        },
        { type: "h2", text: "instanceof로 확인부터" },
        {
          type: "code",
          code: `Animal c = new Cat();
if (c instanceof Dog dog) {      // Java 16+ 패턴 매칭
    dog.fetch();
} else {
    System.out.println("Dog 아님");
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
        { type: "key", text: "final은 잠금, Object는 모든 클래스의 조상" },
        { type: "h2", text: "final 세 군데" },
        {
          type: "table",
          head: ["붙는 곳", "의미", "예"],
          rows: [
            ["변수", "값 재할당 금지 (상수)", "`final int MAX = 10;`"],
            ["메서드", "오버라이딩 금지", "`final void pay()`"],
            ["클래스", "상속 금지", "`final class String`"],
          ],
        },
        {
          type: "tip",
          kind: "memo",
          text: "`String` 이 final 클래스다. 아무도 상속해서 동작을 바꾸지 못하게 잠가 뒀다.",
        },
        { type: "h2", text: "Object가 주는 메서드" },
        {
          type: "table",
          head: ["메서드", "기본 동작", "파이썬 대응"],
          rows: [
            ["`toString()`", "`클래스명@해시값` 출력", "`__str__`"],
            ["`equals(Object o)`", "`==` 와 같음 (같은 객체인가)", "`__eq__`"],
            ["`hashCode()`", "객체마다 다른 정수", "`__hash__`"],
          ],
        },
        { type: "h2", text: "재정의하면 값으로 비교" },
        {
          type: "code",
          code: `class Point {
    final int x, y;
    Point(int x, int y) { this.x = x; this.y = y; }

    @Override
    public String toString() { return "Point(" + x + ", " + y + ")"; }

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof Point p)) return false;
        return x == p.x && y == p.y;
    }

    @Override
    public int hashCode() { return Objects.hash(x, y); }
}

Point p1 = new Point(1, 2);
Point p2 = new Point(1, 2);
System.out.println(p1);
System.out.println(p1 == p2);       // 같은 객체?
System.out.println(p1.equals(p2));  // 같은 값?

Set<Point> set = new HashSet<>();
set.add(p1);
set.add(p2);
System.out.println(set.size());`,
          out: "Point(1, 2)\nfalse\ntrue\n1",
        },
        {
          type: "tip",
          kind: "warn",
          text: "`equals` 와 `hashCode` 는 짝으로 재정의한다. `equals` 만 바꾸면 `HashSet` 이 같은 값을 다른 칸에 넣어 중복이 생긴다.",
        },
        {
          type: "list",
          style: "check",
          items: ["final: 변수는 상수, 메서드는 오버라이딩 금지, 클래스는 상속 금지", "`==` 는 같은 객체, `equals` 는 같은 값", "`equals` 를 바꾸면 `hashCode` 도 같이"],
        },
      ],
    },
    {
      id: "n-jv-5-5",
      emoji: "📐",
      title: "추상 클래스 abstract",
      summary: "몸통 없는 추상 메서드를 가진 미완성 설계도, 자식이 반드시 채워야 한다",
      blocks: [
        { type: "key", text: "추상 클래스는 미완성 설계도, new로 못 만든다" },
        { type: "h2", text: "추상 메서드와 추상 클래스" },
        {
          type: "code",
          code: `abstract class Shape {
    abstract double area();          // 몸통 없음

    void describe() {                // 일반 메서드도 가능
        System.out.printf("넓이: %.2f%n", area());
    }
}

class Circle extends Shape {
    double r;
    Circle(double r) { this.r = r; }
    @Override double area() { return Math.PI * r * r; }
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
        {
          type: "tip",
          kind: "analogy",
          text: "빈칸이 있는 신청서 양식. 양식 자체는 제출 못 하고, 빈칸(추상 메서드)을 다 채운 사본(자식 클래스)만 낼 수 있다.",
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
        { type: "key", text: "상속은 하나만, 인터페이스는 여러 개 구현 가능" },
        { type: "h2", text: "implements와 다중 구현" },
        {
          type: "code",
          code: `interface Flyable {
    void fly();                      // public abstract 생략
    default void rest() { System.out.println("날개 접고 쉼"); }
}

interface Swimmable {
    void swim();
}

class Duck implements Flyable, Swimmable {
    @Override public void fly()  { System.out.println("푸드덕"); }
    @Override public void swim() { System.out.println("첨벙"); }
}

Duck d = new Duck();
d.fly();
d.swim();
d.rest();                        // default 메서드
Flyable f = d;                   // 인터페이스 타입으로 받기
f.fly();`,
          out: "푸드덕\n첨벙\n날개 접고 쉼\n푸드덕",
        },
        {
          type: "tip",
          kind: "analogy",
          text: "인터페이스는 자격증. 오리는 비행 자격증과 수영 자격증을 동시에 딸 수 있다. 부모(혈통)는 하나뿐이지만 자격증은 여러 개.",
        },
        { type: "h2", text: "인터페이스 멤버" },
        {
          type: "table",
          head: ["멤버", "자동으로 붙는 것", "비고"],
          rows: [
            ["추상 메서드", "`public abstract`", "구현 클래스가 반드시 오버라이딩"],
            ["상수", "`public static final`", "인스턴스 필드는 못 가짐"],
            ["default 메서드", "`public`", "Java 8+, 몸통 있음, 골라서 오버라이딩"],
            ["static 메서드", "`public`", "`인터페이스명.메서드()` 로 호출"],
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
            ["관계", "~은 ~이다 (is-a)", "~할 수 있다 (can-do)"],
          ],
        },
        {
          type: "p",
          text: "파이썬은 다중 상속을 MRO로 정리한다. 자바는 상태(필드)는 하나에서만 물려받고, 기능 약속은 인터페이스로 여러 개 받는 방식으로 충돌을 피한다.",
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
