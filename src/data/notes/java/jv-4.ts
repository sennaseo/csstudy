// 자바 단원 4 — 클래스와 객체 (시중 입문서 목차 기준). 작성 규칙은 ../python.ts 상단 주석.
import type { NoteUnit } from "../types";

export const JV4: NoteUnit = {
  id: "jv-4",
  title: "클래스와 객체",
  notes: [
    {
      id: "n-jv-4-1",
      emoji: "🏭",
      title: "클래스·객체·인스턴스",
      summary: "클래스는 설계도, new 로 찍어낸 객체, 변수에는 객체 주소가 담긴다",
      blocks: [
        { type: "key", text: "설계도만으로는 아무것도 없다, `new` 를 해야 진짜 물건이 생긴다" },
        {type: "figure", kind: "flow", nodes: [{icon: "📐", label: "`class Car`", sub: "설계도"}, {icon: "🏭", label: "`new Car()`", ink: "blue"}, {icon: "🚗", label: "객체", sub: "실물", ink: "green"}], edges: ["찍기", ""]},
        { type: "h2", text: "세 단어 정리" },
        {
          type: "table",
          head: ["용어", "쉬운 뜻", "비유"],
          rows: [
            ["클래스", "객체를 만드는 설계도", "붕어빵 틀"],
            ["객체", "설계도로 만든 실제 물건", "붕어빵"],
            ["인스턴스", "\"어느 클래스로 만든\" 객체인지 강조하는 말", "이 틀로 구운 붕어빵"],
          ],
        },
        { type: "h2", text: "클래스 만들고 new 로 찍기" },
        {
          type: "code",
          code: `class Car {
    String color;     // 필드: 객체가 가질 값
    int speed;
}

Car myCar = new Car();      // Car 하나를 새로 만든다
myCar.color = "red";
Car yourCar = new Car();    // 또 하나, myCar 와는 별개
System.out.println(myCar.color);
System.out.println(yourCar.color);   // 안 넣었으니 기본값
System.out.println(yourCar.speed);`,
          out: "red\nnull\n0",
        },
        {
          type: "compare",
          cols: [
            { title: "파이썬", items: ["`my_car = Car()`", "속성은 `self.color = ...` 로 그때그때 생김"] },
            { title: "자바", items: ["`Car myCar = new Car();`", "필드(객체 속 변수)를 클래스에 타입과 함께 미리 적는다"] },
          ],
        },
        {
          type: "tip",
          kind: "memo",
          text: "필드는 값을 안 넣어도 배열 칸처럼 기본값(`0`, `null`, `false`)으로 시작한다.",
        },
        { type: "h2", text: "변수에는 주소가 담긴다" },
        {
          type: "code",
          code: `Car myCar = new Car();
Car same = myCar;          // 같은 객체를 가리킴 (복사 아님)
same.speed = 100;
System.out.println(myCar.speed);     // same 으로 바꿨는데 myCar 도 100
System.out.println(myCar == same);
Car other = new Car();
System.out.println(myCar == other);  // 새로 만든 건 다른 객체`,
          out: "100\ntrue\nfalse",
        },
        {
          type: "list",
          style: "flow",
          items: [
            "`new Car()` 가 힙(객체가 사는 메모리 공간)에 객체를 만든다",
            "만든 객체의 주소를 돌려준다",
            "`myCar` 변수는 객체가 아니라 그 주소를 저장한다",
          ],
        },
        {
          type: "list",
          style: "check",
          items: [
            "클래스 = 설계도, 객체 = 실체, 인스턴스 = 특정 클래스의 객체",
            "`new` 로 만들고 `.` 으로 필드에 접근",
            "변수끼리 대입하면 같은 객체를 함께 가리킨다",
          ],
        },
      ],
    },
    {
      id: "n-jv-4-2",
      emoji: "🧰",
      title: "필드와 메서드",
      summary: "객체가 가진 데이터(필드)와 동작(메서드), 메서드 선언 모양",
      blocks: [
        { type: "key", text: "객체가 기억하는 값과 객체가 할 줄 아는 일" },
        {type: "figure", kind: "tree", root: {icon: "🚗", label: "`Car` 객체"}, children: [{icon: "🧠", label: "필드", sub: "아는 것", ink: "blue", leaves: ["`color`", "`speed`"]}, {icon: "🏃", label: "메서드", sub: "하는 것", ink: "green", leaves: ["`run()`", "`stop()`"]}]},
        { type: "h2", text: "객체마다 따로 가진다" },
        {
          type: "code",
          code: `class Counter {
    int count;            // 필드: 기억하는 값

    void increase() {     // 메서드: 하는 일
        count++;          // 자기 count 를 1 올린다
    }

    int get() {
        return count;
    }
}

Counter a = new Counter();
Counter b = new Counter();
a.increase();
a.increase();
b.increase();             // b 의 count 만 올라간다
System.out.println(a.get());
System.out.println(b.get());`,
          out: "2\n1",
        },
        {
          type: "tip",
          kind: "analogy",
          text: "같은 모델 휴대폰이라도 사진첩(필드)은 기기마다 따로다. 카메라 앱(메서드)은 똑같아도 찍은 사진은 그 기기에만 쌓인다.",
        },
        { type: "h2", text: "메서드 선언 읽기" },
        {
          type: "table",
          head: ["자리", "예", "뜻"],
          rows: [
            ["리턴 타입", "`int` / `void`", "돌려줄 값의 타입, 안 돌려주면 `void`"],
            ["이름", "`area`", "소문자로 시작하는 동사, 단어가 이어지면 `getArea` 처럼 대문자로 구분"],
            ["매개변수", "`(int times)`", "받을 값, 타입과 이름을 같이 적는다"],
            ["본문", "`{ return w * h; }`", "리턴 타입이 있으면 `return` 필수"],
          ],
        },
        {
          type: "code",
          code: `class Rect {
    int w, h;

    int area() {                 // int 를 돌려준다
        return w * h;
    }

    void resize(int times) {     // 돌려주는 값 없음
        w *= times;
        h *= times;
    }
}

Rect r = new Rect();
r.w = 3;
r.h = 4;
System.out.println(r.area());
r.resize(2);                     // 3x4 → 6x8
System.out.println(r.area());`,
          out: "12\n48",
        },
        {
          type: "tip",
          kind: "memo",
          text: "파이썬은 메서드 첫 매개변수로 `self` 를 꼭 적는다. 자바는 안 적고, 메서드 안에서 `count` 처럼 필드 이름을 바로 쓴다.",
        },
        { type: "h2", text: "필드와 지역변수의 차이" },
        {
          type: "compare",
          cols: [
            { title: "필드", items: ["클래스 안, 메서드 밖에 선언", "기본값으로 자동 초기화", "객체가 살아 있는 동안 유지"] },
            { title: "지역변수", items: ["메서드 안에 선언한 임시 변수", "값을 안 넣고 쓰면 컴파일 에러", "메서드가 끝나면 사라짐"] },
          ],
        },
        {
          type: "code",
          code: `int x;                  // 메서드 안 지역변수, 값 없음
System.out.println(x);`,
          out: "error: variable x might not have been initialized",
        },
        {
          type: "list",
          style: "check",
          items: [
            "필드는 객체마다 따로, 메서드는 그 객체의 필드를 다룬다",
            "선언 모양은 `리턴타입 이름(매개변수) { }`",
            "지역변수는 직접 값을 넣어야 쓸 수 있다",
          ],
        },
      ],
    },
    {
      id: "n-jv-4-3",
      emoji: "🔧",
      title: "생성자와 this",
      summary: "객체를 만들 때 한 번 도는 생성자, 기본 생성자 규칙, this 와 this()",
      blocks: [
        { type: "key", text: "새 폰을 처음 켜면 딱 한 번 나오는 초기 설정 화면" },
        {type: "figure", kind: "flow", nodes: [{icon: "🏭", label: "`new Car(\"red\")`"}, {icon: "🔧", label: "생성자", sub: "`this.color = color`", ink: "blue"}, {icon: "🚗", label: "준비된 객체", ink: "green"}]},
        { type: "p", text: "생성자(객체를 만들 때 자동으로 도는 준비 코드)가 바로 그 초기 설정이다. `new` 할 때 한 번만 실행된다." },
        { type: "h2", text: "생성자 모양" },
        {
          type: "code",
          code: `class Person {
    String name;
    int age;

    Person(String name, int age) {   // 생성자: 이름이 클래스와 같다
        this.name = name;            // 내 필드 name 에 받은 값 넣기
        this.age = age;
    }

    Person(String name) {
        this(name, 0);     // 위 생성자에게 나이 0 으로 넘김
    }
}

Person p = new Person("민수", 20);   // 첫 번째 생성자
Person q = new Person("지아");       // 두 번째 생성자
System.out.println(p.name + " " + p.age);
System.out.println(q.name + " " + q.age);`,
          out: "민수 20\n지아 0",
        },
        {
          type: "list",
          style: "flow",
          items: [
            "이름이 클래스 이름과 같다",
            "리턴 타입을 적지 않는다 (`void` 도 안 씀)",
            "`new Person(...)` 의 괄호 안 값이 매개변수로 들어간다",
          ],
        },
        { type: "h2", text: "this 와 파이썬 self" },
        {
          type: "compare",
          cols: [
            { title: "파이썬", items: ["`def __init__(self, name):`", "`self.name = name`", "`self` 를 매개변수에 직접 적음"] },
            { title: "자바", items: ["`Person(String name) {`", "`this.name = name;`", "`this`(지금 만드는 그 객체)는 안 적어도 늘 있음"] },
          ],
        },
        {
          type: "code",
          code: `class Person {
    String name;
    Person(String name) {
        name = name;       // 둘 다 매개변수, 필드는 그대로
    }
}

Person p = new Person("민수");
System.out.println(p.name);`,
          out: "null",
        },
        {
          type: "tip",
          kind: "warn",
          text: "매개변수 이름이 필드와 같으면 그냥 `name` 은 매개변수를 뜻한다. 필드에 넣으려면 반드시 `this.name`. 컴파일 에러도 안 나서 찾기 어렵다.",
        },
        { type: "h2", text: "기본 생성자는 조건부" },
        {
          type: "compare",
          cols: [
            { title: "생성자를 하나도 안 쓰면", tone: "good", items: ["컴파일러가 빈 생성자 `Person() {}` 를 몰래 넣어 줌", "`new Person()` 가능"] },
            { title: "생성자를 하나라도 쓰면", tone: "bad", items: ["그 빈 생성자를 안 넣어 줌", "`new Person()` 은 cannot be applied to given types 에러"] },
          ],
        },
        {
          type: "tip",
          kind: "memo",
          text: "`this(...)` 는 같은 클래스의 다른 생성자를 부른다. 생성자 안 첫 줄에만 쓸 수 있다. 초기화 코드를 한곳에 모을 때 쓴다.",
        },
        {
          type: "list",
          style: "check",
          items: [
            "생성자 = 클래스 이름, 리턴 타입 없음",
            "필드와 매개변수 이름이 같으면 `this.필드`",
            "생성자를 직접 만들면 기본 생성자는 없어진다",
          ],
        },
      ],
    },
    {
      id: "n-jv-4-4",
      emoji: "🎛️",
      title: "메서드 오버로딩",
      summary: "같은 이름, 다른 매개변수로 메서드 여러 개 만들기와 규칙",
      blocks: [
        { type: "key", text: "같은 이름을 여러 번 써도, 받는 값이 다르면 따로 구분된다" },
        {type: "figure", kind: "tree", root: {icon: "🖨️", label: "`println`"}, children: [{icon: "🔢", label: "`(int)`"}, {icon: "🔤", label: "`(String)`"}, {icon: "✅", label: "`(boolean)`"}], caption: "이름은 같고 매개변수만 다르다"},
        { type: "h2", text: "같은 이름 여러 개" },
        {
          type: "code",
          code: `class Calc {
    int add(int a, int b) {             // 정수 2개
        return a + b;
    }

    int add(int a, int b, int c) {      // 정수 3개
        return a + b + c;
    }

    double add(double a, double b) {    // 실수 2개
        return a + b;
    }
}

Calc c = new Calc();
System.out.println(c.add(1, 2));        // 정수 2개짜리가 불린다
System.out.println(c.add(1, 2, 3));
System.out.println(c.add(1.5, 2.5));    // 실수용이라 결과도 실수`,
          out: "3\n6\n4.0",
        },
        {
          type: "p",
          text: "계산대 직원은 손님이 내민 게 카드인지 현금인지 보고 처리 방법을 고른다. 컴파일러도 넘긴 값의 개수와 타입을 보고 맞는 `add` 를 고른다.",
        },
        {
          type: "tip",
          kind: "memo",
          text: "이렇게 이름 하나에 메서드를 여러 개 두는 것을 오버로딩(overloading, 같은 이름 겹쳐 쓰기)이라 부른다.",
        },
        { type: "h2", text: "되는 경우, 안 되는 경우" },
        {
          type: "table",
          head: ["무엇이 다른가", "같은 이름으로 둘 수 있나"],
          rows: [
            ["받는 값 개수", "⭕"],
            ["받는 값 타입", "⭕"],
            ["타입 순서 `(int, double)` `(double, int)`", "⭕"],
            ["돌려주는 타입만", "❌ already defined 에러"],
            ["매개변수 이름만", "❌ already defined 에러"],
          ],
        },
        {
          type: "code",
          code: `int add(int a, int b) { return a + b; }
long add(int x, int y) { return x + y; }   // 받는 값이 똑같아서 구분 불가`,
          out: "error: method add(int,int) is already defined in class Calc",
        },
        { type: "h2", text: "이미 매일 쓰고 있다" },
        {
          type: "code",
          code: `System.out.println(10);       // int 용
System.out.println(3.14);     // double 용
System.out.println('A');      // char 용
System.out.println(true);
System.out.println("text");`,
          out: "10\n3.14\nA\ntrue\ntext",
        },
        {
          type: "compare",
          cols: [
            { title: "파이썬", items: ["같은 이름으로 `def` 두 번 하면 뒤 것이 덮어씀", "기본값 매개변수 `def add(a, b, c=0)` 로 대신함"] },
            { title: "자바", items: ["같은 이름을 여러 개 둘 수 있다", "`println` 도 타입별로 따로 만들어져 있다"] },
          ],
        },
        {
          type: "list",
          style: "check",
          items: [
            "오버로딩 = 같은 이름 + 받는 값의 개수·타입·순서가 다름",
            "돌려주는 타입이나 매개변수 이름만 다르면 안 된다",
            "`println` 이 대표 예",
          ],
        },
      ],
    },
    {
      id: "n-jv-4-5",
      emoji: "🏛️",
      title: "static 멤버",
      summary: "모든 객체가 공유하는 클래스 변수·메서드, 인스턴스 멤버와의 차이",
      blocks: [
        { type: "key", text: "static 은 객체마다가 아니라 클래스 전체에 딱 하나" },
        {type: "figure", kind: "tree", root: {icon: "📐", label: "`Car.count`", sub: "static: 클래스에 하나", ink: "red"}, children: [{icon: "🚗", label: "car1", sub: "자기 `color`"}, {icon: "🚙", label: "car2", sub: "자기 `color`"}]},
        { type: "h2", text: "모두의 것 vs 각자의 것" },
        {
          type: "code",
          code: `class Student {
    static int count = 0;   // 모든 학생이 같이 쓰는 하나
    String name;            // 학생마다 따로

    Student(String name) {
        this.name = name;
        count++;            // 누가 만들어지든 같은 count 가 오른다
    }

    static int getCount() {
        return count;
    }
}

new Student("민수");
new Student("지아");
System.out.println(Student.count);       // 객체 없이 클래스 이름으로
System.out.println(Student.getCount());`,
          out: "2\n2",
        },
        {
          type: "table",
          head: ["", "static (클래스 멤버)", "인스턴스 멤버"],
          rows: [
            ["비유", "교실 게시판, 반에 하나", "학생 공책, 한 명당 한 권"],
            ["개수", "클래스당 1개", "객체마다 1개"],
            ["생기는 때", "클래스가 처음 쓰일 때", "`new` 할 때"],
            ["부르는 법", "`Student.count`", "`s.name`"],
            ["쓰는 곳", "공유 값, 상수, 도구 메서드", "객체마다 다른 상태"],
          ],
        },
        { type: "h2", text: "static 메서드는 객체 것을 못 쓴다" },
        {
          type: "code",
          code: `class Student {
    String name;
    static void hello() {
        System.out.println(name);   // 어느 학생의 name?
    }
}`,
          out: "error: non-static variable name cannot be referenced from a static context",
        },
        {
          type: "p",
          text: "static 메서드는 객체 없이도 불린다. 그때는 어느 학생의 `name` 인지 정할 수 없다.",
        },
        { type: "h2", text: "익숙한 static" },
        {
          type: "compare",
          cols: [
            { title: "자바 표준", items: ["`Math.max(3, 7)` → 7", "`Math.PI`", "`Arrays.sort(arr)`", "`main` 도 static"] },
            { title: "파이썬 대응", items: ["클래스 몸통에 쓴 클래스 변수", "`@staticmethod`", "`Car.count` 처럼 클래스로 접근"] },
          ],
        },
        {
          type: "list",
          style: "check",
          items: [
            "static = 클래스에 하나, 모든 객체가 공유",
            "`클래스이름.멤버` 로 부르는 게 원칙",
            "static 메서드 안에서는 객체의 필드·메서드·`this` 사용 불가",
          ],
        },
      ],
    },
    {
      id: "n-jv-4-6",
      emoji: "🔒",
      title: "접근 제어자와 캡슐화",
      summary: "접근 제어자 4단계 범위, getter/setter 캡슐화, package·import",
      blocks: [
        { type: "key", text: "중요한 값은 숨기고, 정해진 창구로만 만지게 한다" },
        {type: "figure", kind: "stack", layers: [{icon: "🌍", label: "`public`", sub: "어디서나", ink: "green"}, {icon: "📦", label: "`protected`", sub: "같은 패키지 + 자식"}, {icon: "🏘️", label: "(default)", sub: "같은 패키지만"}, {icon: "🔒", label: "`private`", sub: "클래스 안에서만", ink: "red"}]},
        { type: "h2", text: "누가 볼 수 있나: 4단계" },
        {
          type: "table",
          head: ["접근 제어자", "같은 클래스", "같은 패키지", "자식 클래스", "어디서나"],
          rows: [
            ["`public`", "⭕", "⭕", "⭕", "⭕"],
            ["`protected`", "⭕", "⭕", "⭕", "❌"],
            ["(안 씀) default", "⭕", "⭕", "❌", "❌"],
            ["`private`", "⭕", "❌", "❌", "❌"],
          ],
        },
        {
          type: "tip",
          kind: "memo",
          text: "패키지는 클래스를 묶는 폴더다. 자식 클래스 칸은 다른 패키지에 있는 자식 기준이다. 상속은 다음 단원에서 다룬다.",
        },
        { type: "h2", text: "캡슐화: 잘못된 값 막기" },
        {
          type: "p",
          text: "캡슐화(encapsulation)는 필드를 `private` 로 숨기고 메서드로만 바꾸게 하는 방식이다. 메서드에서 값을 검사할 수 있다.",
        },
        {
          type: "code",
          code: `class Account {
    private int balance;             // 밖에서 직접 못 만짐

    public int getBalance() {        // 읽기 창구
        return balance;
    }

    public void deposit(int amount) {  // 넣기 창구, 여기서 검사
        if (amount <= 0) {
            System.out.println("잘못된 금액");
            return;
        }
        balance += amount;
    }
}

Account acc = new Account();
acc.deposit(1000);
acc.deposit(-500);                   // 검사에 걸려 무시됨
System.out.println(acc.getBalance());`,
          out: "잘못된 금액\n1000",
        },
        {
          type: "code",
          code: `acc.balance = -999;   // 창구를 건너뛰려 하면`,
          out: "error: balance has private access in Account",
        },
        {
          type: "tip",
          kind: "analogy",
          text: "손님은 은행 금고(private 필드)에 직접 못 들어간다. 창구 직원(public 메서드)이 금액을 확인하고 대신 넣어 준다.",
        },
        { type: "h2", text: "getter / setter 이름 규칙" },
        {
          type: "table",
          head: ["용도", "이름", "예"],
          rows: [
            ["값 읽기 (getter)", "`get` + 필드명", "`getAge()`"],
            ["값 쓰기 (setter)", "`set` + 필드명", "`setAge(int age)`"],
            ["참·거짓 읽기", "`is` + 필드명", "`isAdult()`"],
          ],
        },
        {
          type: "compare",
          cols: [
            { title: "파이썬", items: ["`_age` 는 숨기자는 약속일 뿐", "밖에서 접근해도 실행됨"] },
            { title: "자바", items: ["`private` 는 컴파일러가 막는다", "밖에서 접근하면 컴파일 에러"] },
          ],
        },
        { type: "h2", text: "package 와 import" },
        {
          type: "code",
          code: `package com.shop.order;     // 이 파일이 속한 폴더(패키지), 파일 맨 위

import java.util.Arrays;     // 클래스 하나 가져오기
import java.util.*;          // 패키지 전체 가져오기`,
        },
        {
          type: "list",
          style: "flow",
          items: [
            "패키지 이름은 도메인을 거꾸로 쓴다 (`com.shop.order`)",
            "다른 패키지 클래스는 `import` 해야 짧은 이름으로 쓴다",
            "`String` `Math` 같은 `java.lang` 은 import 없이 자동",
          ],
        },
        {
          type: "list",
          style: "check",
          items: [
            "범위는 public > protected > default > private",
            "필드는 private, 접근은 getter/setter 로, setter 에서 값 검사",
            "`package` 는 파일 맨 위, `java.lang` 은 import 불필요",
          ],
        },
      ],
    },
  ],
};
