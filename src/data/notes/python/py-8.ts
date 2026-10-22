// 파이썬 단원 8 — OOP 1 (노션 SSAFY 파이썬 강의 정리본). 작성 규칙은 ../python.ts 상단 주석.
import type { NoteUnit } from "../types";

export const PY8: NoteUnit = {
  id: "py-8",
  title: "OOP 1",
  notes: [
    {
      id: "n-py-8-1",
      emoji: "🧭",
      title: "절차 지향 vs 객체 지향",
      summary: "데이터와 함수를 따로 두면 절차 지향, 한 덩어리로 묶으면 객체 지향",
      blocks: [
        {
          type: "tip",
          kind: "analogy",
          text: "절차 지향은 '레시피'다 — 재료(데이터)는 냉장고에, 조리법(함수)은 책에 따로 있고 1번부터 순서대로 따라간다. 객체 지향은 '요리사'를 고용하는 것 — 요리사(객체)가 자기 재료와 자기 기술을 함께 갖고 있어서, 우리는 '요리해 줘'라고 메시지만 보내면 된다.",
        },
        { type: "h2", text: "절차 지향 프로그래밍" },
        {
          type: "p",
          text: "프로그램을 '데이터'와 '절차(함수)'로 나눠 구성하는 방식(패러다임). 메인 프로그램이 function1 → function2 → … 순서로 함수를 부르는 흐름이 핵심이다.",
        },
        {
          type: "list",
          items: [
            "데이터와 그 데이터를 처리하는 함수가 분리되어 있고, 함수 호출의 흐름이 중요",
            "실제로 '무엇이 실행되는가'가 중요 — 데이터 재사용보다 처음부터 끝까지 실행된 결과물이 핵심",
            "소프트웨어 위기(Software Crisis): 하드웨어가 발전해 계산 용량과 문제의 복잡성이 급증하자, 프로그램 여러 개가 함수들을 얽히고설키게 부르는 상황이 생김",
          ],
        },
        { type: "h2", text: "객체 지향 프로그래밍" },
        {
          type: "tip",
          kind: "memo",
          text: "데이터와 해당 데이터를 조작하는 메서드를 하나의 객체로 묶어 관리하는 방식의 프로그래밍 패러다임.",
        },
        {
          type: "p",
          text: "게임 캐릭터로 비교해 보자. 절차 지향은 '전사'·'마법사' 데이터가 '공격'·'수비' 함수와 교차로 엮여 있다. 객체 지향은 '캐릭터' 클래스(공격, 수비)가 있고, 그 아래 '전사'(돈·명예 / 베기·찌르기), '마법사'(돈·마력 / 회복·파이어볼)가 각자 데이터와 메서드를 품는다.",
        },
        {
          type: "table",
          head: ["", "절차 지향", "객체 지향"],
          rows: [
            ["데이터와 함수", "분리", "하나의 객체(클래스)로 묶음"],
            ["중요한 것", "함수 호출의 흐름", "객체 간 상호작용과 메시지 전달"],
          ],
        },
        {
          type: "tip",
          kind: "warn",
          text: "절차 지향과 객체 지향은 대조되는 개념이 아니다. 객체 지향은 절차 지향을 기반으로 두고, '객체'라는 개념을 도입해 상속·코드 재사용성·유지보수성을 보완한 패러다임이다. '절차 지향 = 나쁜 것'이 아니다.",
        },
        { type: "h2", text: "3줄 정리" },
        {
          type: "list",
          items: [
            "절차 지향: 데이터와 함수가 따로, 순서대로 호출하는 흐름이 핵심",
            "객체 지향: 데이터 + 메서드를 한 객체로 묶고, 객체끼리 메시지를 주고받음",
            "둘은 적이 아니라 보완 관계 — 객체 지향은 절차 지향 위에 세워졌다",
          ],
        },
      ],
    },
    {
      id: "n-py-8-2",
      emoji: "🎤",
      title: "클래스·객체·인스턴스",
      summary: "클래스는 설계도, 객체는 속성+행동, 인스턴스는 그 설계도로 찍은 실물",
      blocks: [
        {
          type: "tip",
          kind: "analogy",
          text: "'가수'라는 직업(클래스)이 있고, 아이유는 그 직업으로 존재하는 실제 사람(인스턴스)이다. 아이유는 속성(직업=가수, 생년월일=1993년 5월 16일, 국적=대한민국)과 행동(랩(), 댄스(), 소몰이())을 갖는다.",
        },
        { type: "h2", text: "클래스 · 객체 · 인스턴스" },
        {
          type: "list",
          items: [
            "클래스(class): 파이썬에서 타입을 표현하는 방법. 객체를 만들기 위한 설계도이며, 데이터와 기능을 함께 묶는다",
            "객체(object): 클래스에서 정의한 것을 토대로 메모리에 할당된 것. '속성'과 '행동'으로 구성된 모든 것",
            "인스턴스(instance): 클래스의 속성과 행동을 기반으로 생성된 개별 객체",
          ],
        },
        {
          type: "tip",
          kind: "memo",
          text: "클래스로 만든 객체를 '인스턴스'라 부른다. 객체 = 속성(변수) + 행동(메서드).",
        },
        {
          type: "p",
          text: "말로 구분해 보면 — '아이유는 객체다'(O), '아이유는 인스턴스다'(X, 무엇의 인스턴스인지 빠짐), '아이유는 가수의 인스턴스다'(O). 인스턴스는 항상 '어떤 클래스의' 인스턴스다.",
        },
        { type: "h2", text: "우리가 쓰던 타입은 전부 클래스였다" },
        {
          type: "code",
          code: `name = 'Alice'
print(type(name))  # 결과: <class 'str'>

# '', 'hello', '파이썬'      → 모두 str 클래스의 인스턴스
# [1, 2, 3], [1], [], ['hi'] → 모두 list 클래스의 인스턴스
# 123, 900, 5                → 모두 int 클래스의 인스턴스`,
        },
        {
          type: "tip",
          kind: "memo",
          text: "변수 name은 str 클래스의 인스턴스이다. 우리가 사용해 왔던 데이터 타입은 사실 모두 클래스였다. 결국 문자열 타입의 변수는 str 클래스로 만든 인스턴스이다. 클래스를 만든다 == 타입을 만든다.",
        },
        {
          type: "p",
          text: "`help(str)`을 찍어 보면 `class str(object)` 가 나온다 — str이 진짜 클래스라는 증거. 그리고 `'hello'.upper()`는 '문자열.대문자로()' → '객체.행동()' → '인스턴스.메서드()' 로 읽힌다. 즉 인스턴스에 메서드를 호출하는 것.",
        },
        { type: "h2", text: "객체 정리: 세 가지 질문" },
        {
          type: "table",
          head: ["항목", "질문"],
          rows: [
            ["타입(type)", "어떤 연산자(operator)와 조작(method)이 가능한가?"],
            ["속성(attribute)", "어떤 상태(데이터)를 가지는가?"],
            ["조작법(method)", "어떤 행위(함수)를 할 수 있는가?"],
          ],
        },
        {
          type: "tip",
          kind: "warn",
          text: "'객체'와 '인스턴스'를 같은 말로 쓰면 틀리기 쉽다. 객체는 그 자체를 가리키는 말이고, 인스턴스는 '어떤 클래스에서 나왔는가'라는 관계를 강조하는 말이다. 하나의 객체는 특정 타입의 인스턴스이다.",
        },
        { type: "h2", text: "3줄 정리" },
        {
          type: "list",
          items: [
            "클래스 = 설계도 = 타입, 객체 = 속성 + 행동, 인스턴스 = 특정 클래스로 찍어낸 객체",
            "str·list·int 등 여태 쓰던 타입은 전부 클래스였고, `'hello'`는 str의 인스턴스",
            "`'hello'.upper()`는 인스턴스.메서드() — 객체 스스로 행동하는 표현",
          ],
        },
      ],
    },
    {
      id: "n-py-8-3",
      emoji: "🏗️",
      title: "클래스 정의와 구조",
      summary: "class 키워드로 설계도 작성 → __init__·인스턴스 변수·클래스 변수·메서드",
      blocks: [
        {
          type: "tip",
          kind: "analogy",
          text: "클래스는 붕어빵 틀(설계도, Blue Print), 인스턴스는 틀에서 찍어낸 붕어빵이다. 틀에 '팥'이라고 새겨진 글씨(클래스 변수)는 모든 붕어빵에 똑같이 찍히고, 각 붕어빵에 넣는 재료(인스턴스 변수)는 하나하나 다를 수 있다.",
        },
        { type: "h2", text: "클래스 정의와 인스턴스 생성" },
        {
          type: "list",
          items: [
            "`class` 키워드로 정의. 클래스 이름은 파스칼 케이스(PascalCase == 대문자 카멜케이스)로 쓴다",
            "함수를 `함수()`로 부르듯 `클래스()`로 호출하면 인스턴스가 생성된다: `iu = Person()`",
            "메서드 호출은 `iu.메서드()`, 속성(변수) 접근은 `iu.attribute`",
          ],
        },
        {
          type: "code",
          code: `class Person:
    blood_color = 'red'            # 클래스 변수

    def __init__(self, name):      # 생성자 메서드
        self.name = name           # 인스턴스 변수

    def singing(self):             # 인스턴스 메서드
        return f'{self.name}가 노래합니다.'


singer1 = Person('iu')             # 인스턴스 생성
print(singer1.singing())           # 결과: iu가 노래합니다.
print(singer1.name)                # 결과: iu
print(singer1.blood_color)         # 결과: red`,
        },
        { type: "h2", text: "클래스 구조 네 조각" },
        {
          type: "tip",
          kind: "memo",
          text: "생성자 메서드(== 매직 메서드): 객체를 생성할 때 자동으로 호출되는 특별한 메서드. `__init__`이라는 이름으로 정의되며 객체의 초기화를 담당 — 인스턴스를 생성하면서 필요한 초기값을 설정한다.",
        },
        {
          type: "table",
          head: ["조각", "코드", "설명"],
          rows: [
            ["생성자 메서드", "`def __init__(self, name)`", "인스턴스 생성 시 자동 호출, 초기값 설정"],
            ["인스턴스 변수", "`self.name = name`", "인스턴스마다 별도로 유지, 생성될 때마다 초기화"],
            ["클래스 변수", "`blood_color = 'red'`", "클래스 내부에 선언, 모든 인스턴스가 공유"],
            ["인스턴스 메서드", "`def singing(self)`", "각 인스턴스에서 호출, 인스턴스 변수를 읽고 수정"],
          ],
        },
        { type: "h2", text: "클래스 변수 활용: 가수가 몇 명?" },
        {
          type: "p",
          text: "인스턴스가 생성될 때마다 클래스 변수가 늘어나도록 하면 '지금까지 몇 개 만들었나'를 셀 수 있다.",
        },
        {
          type: "code",
          code: `class Person:
    count = 0

    def __init__(self, name):
        self.name = name
        Person.count += 1          # 클래스 이름으로 클래스 변수 접근


person1 = Person('iu')
person2 = Person('BTS')
print(Person.count)                # 결과: 2`,
        },
        { type: "h2", text: "클래스 변수 vs 인스턴스 변수" },
        {
          type: "tip",
          kind: "memo",
          text: "클래스 변수는 `클래스.클래스변수` 로 참조한다. 예: `Circle.pi`",
        },
        {
          type: "code",
          code: `class Circle:
    pi = 3.14

    def __init__(self, r):
        self.r = r

c1 = Circle(5)
c2 = Circle(10)
print(Circle.pi, c1.pi, c2.pi)     # 결과: 3.14 3.14 3.14

Circle.pi = 5                      # 클래스 변수 변경 → 모두 바뀜
print(Circle.pi, c1.pi, c2.pi)     # 결과: 5 5 5

Circle.pi = 3.14
c2.pi = 5                          # c2 에만 새 인스턴스 변수가 생김
print(Circle.pi, c1.pi, c2.pi)     # 결과: 3.14 3.14 5`,
        },
        {
          type: "tip",
          kind: "warn",
          text: "`c2.pi = 5`는 클래스 변수를 바꾸는 게 아니다. c2 전용 인스턴스 변수 pi가 '새로' 생기고, Circle.pi와 c1.pi는 그대로다. 모두 바꾸고 싶으면 `Circle.pi = 5`처럼 클래스 이름으로 접근해야 한다.",
        },
        { type: "h2", text: "3줄 정리" },
        {
          type: "list",
          items: [
            "`class 이름:` 으로 정의하고 `이름()` 으로 인스턴스를 만든다 — 이때 `__init__`이 자동 호출",
            "`self.x`는 인스턴스마다 따로(인스턴스 변수), 클래스 바로 밑 변수는 모두가 공유(클래스 변수)",
            "클래스 변수는 `클래스.변수`로 건드려라 — `인스턴스.변수 = 값`은 그 인스턴스 전용 변수를 새로 만든다",
          ],
        },
      ],
    },
    {
      id: "n-py-8-4",
      emoji: "🔧",
      title: "메서드 3종: 인스턴스·클래스·스태틱",
      summary: "self를 받으면 인스턴스, cls를 받으면 클래스, 아무것도 안 받으면 스태틱",
      blocks: [
        {
          type: "tip",
          kind: "analogy",
          text: "회사에 비유하면 — 인스턴스 메서드는 '직원 개인 업무'(그 직원 self의 상태를 다룸), 클래스 메서드는 '회사 차원 업무'(회사 cls 전체 설정을 다룸), 스태틱 메서드는 '회사 건물에 비치된 계산기'(회사와 관련은 있지만 누구 상태도 안 건드리는 순수 기능).",
        },
        { type: "h2", text: "self 동작 원리" },
        {
          type: "code",
          code: `'hello'.upper()       # 우리가 쓰는 표현 (객체지향 방식의 단축형 호출)
str.upper('hello')    # 파이썬 내부에서 실제로 일어나는 일

# 둘 다 결과: 'HELLO'`,
        },
        {
          type: "p",
          text: "str 클래스가 upper 메서드를 호출했고, 그 첫 번째 인자로 문자열 인스턴스 `'hello'`가 들어간 것. 그래서 인스턴스 메서드는 반드시 첫 번째 매개변수(첫 번째 위치 인자)로 인스턴스 자신(self)을 받는다.",
        },
        {
          type: "tip",
          kind: "memo",
          text: "⇒ 이것이 인스턴스 메서드의 첫 번째 매개변수가 반드시 인스턴스 자기 자신인 이유. `'hello'.upper()`는 'hello'가 어딘가 함수의 인자로 들어가는 게 아니라, 객체 스스로 메서드를 호출하는 객체 지향적 표현(단축형 호출)이다.",
        },
        { type: "h2", text: "세 가지 메서드 구조" },
        {
          type: "code",
          code: `class MyClass:
    def instance_method(self, arg1):     # self 필수, 데코레이터 없음
        return 'instance method', self

    @classmethod
    def class_method(cls, arg1):         # cls 필수, @classmethod
        return 'class method', cls

    @staticmethod
    def static_method(arg1):             # self/cls 없음, @staticmethod
        return 'static method'`,
        },
        {
          type: "table",
          head: ["종류", "첫 매개변수", "데코레이터", "하는 일"],
          rows: [
            ["인스턴스 메서드", "self (인스턴스 자신)", "없음", "인스턴스의 상태를 조작하거나 동작 수행"],
            ["클래스 메서드", "cls (호출한 클래스)", "@classmethod", "클래스 변수 조작, 클래스 레벨 동작"],
            ["스태틱 메서드", "없음", "@staticmethod", "클래스·인스턴스 상태와 무관한 기능만"],
          ],
        },
        {
          type: "list",
          items: [
            "생성자 메서드 `__init__`도 인스턴스 메서드다 — 인스턴스가 생성될 때 자동 호출되어 인스턴스 변수의 초기값을 설정. 예: `Person('지민')` 하면 `self.name = '지민'`",
            "데코레이터(@classmethod 등)는 '함수를 꾸미는 함수' == 기능을 추가하는 것",
            "`self`·`cls`는 매개변수 이름일 뿐이라 다른 이름도 되지만, 다른 이름을 쓰지 않을 것을 강력히 권장",
            "스태틱 메서드 예: `StringUtils.reverse_string('hello, world')` → `'dlrow ,olleh'` 처럼 인자만 받아 처리하는 유틸 함수",
          ],
        },
        { type: "h2", text: "할 수 있다 != 써도 된다" },
        {
          type: "code",
          code: `# 위에서 정의한 MyClass 를 이어서 사용
instance = MyClass()

# 클래스가 호출 — 모두 가능하지만, 클래스는 클래스·스태틱 메서드만 쓴다
MyClass.instance_method(instance, 1)   # 가능은 하지만 쓰지 말 것
MyClass.class_method(1)                # 결과: ('class method', <class '__main__.MyClass'>)
MyClass.static_method(1)               # 결과: static method

# 인스턴스가 호출 — 모두 가능하지만, 인스턴스는 인스턴스 메서드만 쓴다
instance.instance_method(1)            # 결과: ('instance method', <__main__.MyClass object at 0x...>)
instance.class_method(1)               # 가능은 하지만 쓰지 말 것
instance.static_method(1)              # 가능은 하지만 쓰지 말 것`,
        },
        {
          type: "tip",
          kind: "warn",
          text: "파이썬은 클래스도 인스턴스도 세 메서드를 전부 호출할 수 있게 허용한다. 하지만 각 메서드는 OOP 패러다임에 따라 명확한 목적으로 설계된 것이라, 클래스는 클래스·스태틱 메서드만, 인스턴스는 인스턴스 메서드만 사용한다.",
        },
        { type: "h2", text: "3줄 정리" },
        {
          type: "list",
          items: [
            "`'hello'.upper()`의 정체는 `str.upper('hello')` — 그래서 인스턴스 메서드 첫 인자는 self",
            "인스턴스 메서드(self) / 클래스 메서드(cls, @classmethod) / 스태틱 메서드(없음, @staticmethod)",
            "누가 쓰나: 클래스 → 클래스·스태틱 메서드, 인스턴스 → 인스턴스 메서드. 할 수 있다고 다 쓰면 안 된다",
          ],
        },
      ],
    },
    {
      id: "n-py-8-5",
      emoji: "🪄",
      title: "참고: 이름 공간·매직 메서드·데코레이터",
      summary: "속성은 인스턴스 → 클래스 순으로 찾고, __str__ 같은 매직 메서드는 자동 호출",
      blocks: [
        {
          type: "tip",
          kind: "analogy",
          text: "이름 공간은 '내 방 서랍'과 '거실 공용 서랍'이다. 물건(속성)을 찾을 때 먼저 내 방(인스턴스)을 뒤지고, 없으면 거실(클래스)로 간다. 내 방에 같은 이름의 물건을 새로 넣으면(인스턴스 변수 설정) 그 뒤로는 내 방 것만 쓰고, 거실 물건은 그대로다.",
        },
        { type: "h2", text: "인스턴스와 클래스의 이름 공간" },
        {
          type: "list",
          items: [
            "클래스를 정의하면 클래스에 해당하는 이름 공간이 생긴다",
            "인스턴스를 만들면 인스턴스 객체가 생성되고 '독립적인' 이름 공간이 생긴다",
            "인스턴스에서 속성에 접근하면 인스턴스 → 클래스 순으로 탐색한다",
          ],
        },
        {
          type: "code",
          code: `class Person:
    name = 'unknown'

    def talk(self):
        print(self.name)

p1 = Person()
p1.talk()            # 결과: unknown  (인스턴스에 없음 → 클래스 변수)

p2 = Person()
p2.talk()            # 결과: unknown
p2.name = 'Kim'      # p2 인스턴스 이름 공간에 name 이 생김
p2.talk()            # 결과: Kim

print(Person.name)   # 결과: unknown  (클래스 변수는 그대로)
print(p1.name)       # 결과: unknown
print(p2.name)       # 결과: Kim`,
        },
        {
          type: "p",
          text: "클래스 변수 name이 Kim으로 바뀐 게 아니라, p2 인스턴스의 인스턴스 변수 name에 Kim이 저장된 것. 독립적인 이름 공간 덕분에 각 인스턴스는 서로의 데이터에 직접 접근하지 못하고 독립적으로 동작한다 → 모듈화가 되어 충돌 없이 움직이고, 가독성·유지보수성·재사용성이 올라간다.",
        },
        { type: "h2", text: "매직 메서드" },
        {
          type: "list",
          items: [
            "인스턴스 메서드이며, 특정 상황에 자동으로 호출된다",
            "더블 언더스코어(`__`)로 감싼 이름 — 스페셜 메서드 혹은 매직 메서드라 부름",
            "예: `__str__(self)`, `__len__(self)`, `__lt__`·`__le__`·`__eq__`·`__gt__`·`__ge__`·`__ne__(self, other)` (비교 연산자)",
          ],
        },
        {
          type: "code",
          code: `class Circle:
    def __init__(self, r):
        self.r = r

    def __str__(self):               # print() 가 호출해 문자열 표현을 돌려줌
        return f'원의 반지름: {self.r}'

c1 = Circle(10)
c2 = Circle(1)
print(c1)   # 결과: 원의 반지름: 10
print(c2)   # 결과: 원의 반지름: 1`,
        },
        { type: "h2", text: "데코레이터" },
        {
          type: "p",
          text: "다른 함수의 코드를 유지한 채로 수정하거나 확장하기 위해 사용되는 함수. 원본 함수를 받아서(func) 앞뒤에 작업을 덧붙인 새 함수(wrapper)를 돌려준다. `@이름`을 함수 위에 붙이면 적용된다.",
        },
        {
          type: "code",
          code: `def my_decorator(func):
    def wrapper():
        print('함수 실행 전')     # 함수 실행 전에 수행할 작업
        result = func()          # 원본 함수 호출
        print('함수 실행 후')     # 함수 실행 후에 수행할 작업
        return result
    return wrapper

@my_decorator
def my_function():
    print('원본 함수 실행')

my_function()
# 결과:
# 함수 실행 전
# 원본 함수 실행
# 함수 실행 후`,
        },
        {
          type: "tip",
          kind: "warn",
          text: "`p2.name = 'Kim'` 하고 나서 `Person.name`도 바뀌었을 거라 생각하기 쉽다. 아니다 — 인스턴스 쪽 서랍에 새 물건이 들어간 것뿐. 클래스 변수를 바꾸려면 `Person.name = ...`로 클래스 이름을 통해 접근해야 한다.",
        },
        { type: "h2", text: "3줄 정리" },
        {
          type: "list",
          items: [
            "속성 탐색 순서: 인스턴스 이름 공간 → 클래스 이름 공간. 인스턴스 변수가 생기면 그것이 우선",
            "매직 메서드 `__xxx__`는 특정 상황에 자동 호출 — `__str__`은 print() 할 때",
            "데코레이터는 원본 함수를 감싸 앞뒤 작업을 덧붙이는 함수. `@classmethod`도 같은 원리",
          ],
        },
      ],
    },
  ],
};
