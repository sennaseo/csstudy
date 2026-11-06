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
        { type: "key", text: "데이터와 함수를 따로 두나, 한 객체로 묶나" },
        {type: "figure", kind: "tree", root: {icon: "🧭", label: "코드를 묶는 법"}, children: [{icon: "📜", label: "절차 지향", ink: "blue", leaves: ["데이터 따로", "함수 따로"]}, {icon: "🧱", label: "객체 지향", ink: "green", leaves: ["데이터 + 함수", "한 객체로"]}]},
        {
          type: "tip",
          kind: "analogy",
          text: "절차 지향은 레시피. 재료는 냉장고, 조리법은 책에 따로 있고 순서대로 따라간다. 객체 지향은 요리사 고용. 재료와 기술을 가진 요리사에게 '요리해 줘'라고 메시지만 보낸다.",
        },
        { type: "h2", text: "절차 지향 프로그래밍" },
        {
          type: "list",
          style: "flow",
          items: ["메인 프로그램", "function1 호출", "function2 호출", "… 끝까지 순서대로 실행"],
        },
        {
          type: "code",
          code: `hp = 100                  # 데이터

def attack(target_hp):    # 함수 (데이터와 따로)
    return target_hp - 10

hp = attack(hp)
print(hp)`,
          out: "90",
        },
        {
          type: "list",
          items: [
            "프로그램을 '데이터'와 '절차(함수)'로 나눠 구성하는 패러다임",
            "데이터와 처리 함수가 분리, 함수 호출의 흐름이 중요",
            "'무엇이 실행되는가'가 중요. 데이터 재사용보다 처음부터 끝까지 실행된 결과물이 핵심",
            "소프트웨어 위기(Software Crisis): 하드웨어 발전으로 계산 용량과 문제 복잡성이 급증, 여러 프로그램이 함수들을 얽히고설키게 부르는 상황",
          ],
        },
        { type: "h2", text: "객체 지향 프로그래밍" },
        {
          type: "tip",
          kind: "memo",
          text: "데이터와 해당 데이터를 조작하는 메서드를 하나의 객체로 묶어 관리하는 방식의 프로그래밍 패러다임.",
        },
        {
          type: "code",
          code: `class Character:
    def __init__(self):
        self.hp = 100        # 데이터
    def attacked(self):      # 메서드 (데이터와 한 몸)
        self.hp -= 10

c = Character()
c.attacked()
print(c.hp)`,
          out: "90",
        },
        {
          type: "compare",
          cols: [
            { title: "절차 지향", items: ["'전사'·'마법사' 데이터", "'공격'·'수비' 함수", "데이터와 함수가 교차로 엮임"] },
            { title: "객체 지향", items: ["'캐릭터' 클래스(공격, 수비)", "'전사': 돈·명예 / 베기·찌르기", "'마법사': 돈·마력 / 회복·파이어볼"] },
          ],
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
          type: "compare",
          cols: [
            { title: "착각", tone: "bad", items: ["둘은 대조되는 개념", "절차 지향 = 나쁜 것"] },
            { title: "실제", tone: "good", items: ["객체 지향은 절차 지향이 기반", "'객체'를 도입해 상속·코드 재사용성·유지보수성을 보완"] },
          ],
        },
        {
          type: "list",
          style: "check",
          items: ["절차 지향: 데이터와 함수가 따로, 호출 흐름이 핵심", "객체 지향: 데이터 + 메서드를 한 객체로, 객체끼리 메시지", "둘은 보완 관계"],
        },
      ],
    },
    {
      id: "n-py-8-2",
      emoji: "🎤",
      title: "클래스·객체·인스턴스",
      summary: "클래스는 설계도, 객체는 속성+행동, 인스턴스는 그 설계도로 찍은 실물",
      blocks: [
        { type: "key", text: "클래스를 만든다 == 타입을 만든다" },
        {type: "figure", kind: "flow", nodes: [{icon: "📐", label: "클래스", sub: "설계도"}, {icon: "🏭", label: "`Person()`", ink: "blue"}, {icon: "🧍", label: "인스턴스", sub: "실제 객체", ink: "green"}], edges: ["찍어내기", ""]},
        { type: "h2", text: "세 용어" },
        {
          type: "table",
          head: ["용어", "뜻"],
          rows: [
            ["클래스(class)", "파이썬에서 타입을 표현하는 방법. 객체를 만드는 설계도, 데이터와 기능을 함께 묶음"],
            ["객체(object)", "클래스 정의를 토대로 메모리에 할당된 것. '속성'과 '행동'으로 구성된 모든 것"],
            ["인스턴스(instance)", "클래스의 속성과 행동을 기반으로 생성된 개별 객체"],
          ],
        },
        {
          type: "compare",
          cols: [
            { title: "🎤 클래스: 가수", items: ["직업이라는 틀"] },
            { title: "👩 인스턴스: 아이유", items: ["속성: 직업=가수, 생년월일=1993년 5월 16일, 국적=대한민국", "행동: 랩(), 댄스(), 소몰이()"] },
          ],
        },
        {
          type: "code",
          code: `class Singer:
    pass

iu = Singer()      # Singer 의 인스턴스
print(type(iu))`,
          out: "<class '__main__.Singer'>",
        },
        {
          type: "tip",
          kind: "memo",
          text: "클래스로 만든 객체를 '인스턴스'라 부른다. 객체 = 속성(변수) + 행동(메서드).",
        },
        {
          type: "table",
          head: ["말", "판정"],
          rows: [
            ["아이유는 객체다", "⭕"],
            ["아이유는 인스턴스다", "❌ 무엇의 인스턴스인지 빠짐"],
            ["아이유는 가수의 인스턴스다", "⭕"],
          ],
        },
        { type: "h2", text: "여태 쓰던 타입은 전부 클래스" },
        {
          type: "code",
          code: `name = 'Alice'
print(type(name))
print(type([1, 2, 3]))
print(type(123))
print('hello'.upper())`,
          out: "<class 'str'>\n<class 'list'>\n<class 'int'>\nHELLO",
        },
        {
          type: "table",
          head: ["값", "어느 클래스의 인스턴스"],
          rows: [
            ["`''` `'hello'` `'파이썬'`", "str"],
            ["`[1, 2, 3]` `[1]` `[]` `['hi']`", "list"],
            ["`123` `900` `5`", "int"],
          ],
        },
        {
          type: "tip",
          kind: "memo",
          text: "변수 name은 str 클래스의 인스턴스이다. 우리가 사용해 왔던 데이터 타입은 사실 모두 클래스였다. 결국 문자열 타입의 변수는 str 클래스로 만든 인스턴스이다. 클래스를 만든다 == 타입을 만든다.",
        },
        {
          type: "list",
          style: "flow",
          items: ["`'hello'.upper()`", "문자열.대문자로()", "객체.행동()", "인스턴스.메서드()"],
        },
        {
          type: "p",
          text: "`help(str)` 을 찍으면 `class str(object)` 가 나온다. str이 진짜 클래스라는 증거.",
        },
        { type: "h2", text: "객체를 보는 세 가지 질문" },
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
          type: "compare",
          cols: [
            { title: "객체", items: ["그 자체를 가리키는 말"] },
            { title: "인스턴스", items: ["'어떤 클래스에서 나왔나' 관계를 강조", "하나의 객체는 특정 타입의 인스턴스"] },
          ],
        },
        {
          type: "list",
          style: "check",
          items: ["클래스 = 설계도 = 타입, 인스턴스 = 특정 클래스로 찍은 객체", "`'hello'` 는 str의 인스턴스", "`'hello'.upper()` = 인스턴스.메서드()"],
        },
      ],
    },
    {
      id: "n-py-8-3",
      emoji: "🏗️",
      title: "클래스 정의와 구조",
      summary: "class 키워드로 설계도 작성 → __init__·인스턴스 변수·클래스 변수·메서드",
      blocks: [
        { type: "key", text: "`self.x` 는 각자, 클래스 바로 밑 변수는 공유" },
        {type: "figure", kind: "tree", root: {icon: "📐", label: "`class Person`", sub: "`count = 0` 공유", ink: "red"}, children: [{icon: "🧍", label: "p1", sub: "`self.name='Kim'`"}, {icon: "🧍", label: "p2", sub: "`self.name='Lee'`"}], caption: "`self.x` 는 각자, 클래스 변수는 모두 공유"},
        {
          type: "tip",
          kind: "analogy",
          text: "클래스는 붕어빵 틀(Blue Print), 인스턴스는 찍어낸 붕어빵. 틀에 새긴 '팥' 글씨(클래스 변수)는 모두 같고, 넣는 재료(인스턴스 변수)는 하나하나 다르다.",
        },
        { type: "h2", text: "정의하고 찍어내기" },
        {
          type: "table",
          head: ["할 일", "문법"],
          rows: [
            ["정의", "`class` 키워드, 이름은 PascalCase(== 대문자 카멜케이스)"],
            ["인스턴스 생성", "`iu = Person()` (함수처럼 `클래스()` 호출)"],
            ["메서드 호출", "`iu.메서드()`"],
            ["속성 접근", "`iu.attribute`"],
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


singer1 = Person('iu')
print(singer1.singing())
print(singer1.name)
print(singer1.blood_color)`,
          out: "iu가 노래합니다.\niu\nred",
        },
        { type: "h2", text: "클래스 구조 네 조각" },
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
        {
          type: "tip",
          kind: "memo",
          text: "생성자 메서드(== 매직 메서드): 객체를 생성할 때 자동으로 호출되는 특별한 메서드. `__init__`이라는 이름으로 정의되며 객체의 초기화를 담당. 인스턴스를 생성하면서 필요한 초기값을 설정한다.",
        },
        { type: "h2", text: "클래스 변수로 개수 세기" },
        {
          type: "code",
          code: `class Person:
    count = 0

    def __init__(self, name):
        self.name = name
        Person.count += 1          # 클래스 이름으로 접근


person1 = Person('iu')
person2 = Person('BTS')
print(Person.count)`,
          out: "2",
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
print(Circle.pi, c1.pi, c2.pi)

Circle.pi = 5                      # 클래스 변수 변경
print(Circle.pi, c1.pi, c2.pi)

Circle.pi = 3.14
c2.pi = 5                          # c2 에만 인스턴스 변수 생김
print(Circle.pi, c1.pi, c2.pi)`,
          out: "3.14 3.14 3.14\n5 5 5\n3.14 3.14 5",
        },
        {
          type: "compare",
          cols: [
            { title: "`c2.pi = 5`", tone: "bad", items: ["클래스 변수는 그대로", "c2 전용 인스턴스 변수 pi가 새로 생김"] },
            { title: "`Circle.pi = 5`", tone: "good", items: ["클래스 이름으로 접근", "모든 인스턴스에 반영"] },
          ],
        },
        {
          type: "list",
          style: "check",
          items: ["`이름()` 으로 생성하면 `__init__` 자동 호출", "클래스 변수는 `클래스.변수` 로 건드린다", "`인스턴스.변수 = 값` 은 그 인스턴스 전용 변수를 새로 만든다"],
        },
      ],
    },
    {
      id: "n-py-8-4",
      emoji: "🔧",
      title: "메서드 3종: 인스턴스·클래스·스태틱",
      summary: "self를 받으면 인스턴스, cls를 받으면 클래스, 아무것도 안 받으면 스태틱",
      blocks: [
        { type: "key", text: "self면 인스턴스, cls면 클래스, 없으면 스태틱" },
        {type: "figure", kind: "tree", root: {icon: "🔧", label: "메서드 3종"}, children: [{icon: "🧍", label: "인스턴스", sub: "`self`", ink: "green"}, {icon: "📐", label: "클래스", sub: "`cls`", ink: "blue"}, {icon: "🪨", label: "스태틱", sub: "아무것도 안 받음"}]},
        { type: "h2", text: "self 동작 원리" },
        {
          type: "code",
          code: `print('hello'.upper())       # 우리가 쓰는 표현 (단축형 호출)
print(str.upper('hello'))    # 파이썬 내부에서 실제로 일어나는 일`,
          out: "HELLO\nHELLO",
        },
        {
          type: "list",
          style: "flow",
          items: ["str 클래스가 upper 메서드를 호출", "첫 번째 인자로 인스턴스 `'hello'` 가 들어감", "그래서 인스턴스 메서드의 첫 매개변수는 항상 self"],
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
    def instance_method(self, arg1):
        return 'instance method', self

    @classmethod
    def class_method(cls, arg1):
        return 'class method', cls

    @staticmethod
    def static_method(arg1):
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
          type: "tip",
          kind: "analogy",
          text: "인스턴스 메서드는 직원 개인 업무, 클래스 메서드는 회사 차원 업무, 스태틱 메서드는 회사 건물에 비치된 계산기.",
        },
        {
          type: "list",
          items: [
            "`__init__` 도 인스턴스 메서드. `Person('지민')` 하면 `self.name = '지민'` 처럼 초기값 설정",
            "데코레이터(@classmethod 등): 함수를 꾸미는 함수 == 기능 추가",
            "`self` · `cls` 는 매개변수 이름일 뿐. 다른 이름도 되지만 강력히 비권장",
            "스태틱 예: `StringUtils.reverse_string('hello, world')` → `'dlrow ,olleh'`",
          ],
        },
        { type: "h2", text: "할 수 있다 != 써도 된다" },
        {
          type: "code",
          code: `instance = MyClass()

MyClass.instance_method(instance, 1)   # 가능하지만 쓰지 말 것
MyClass.class_method(1)                # ('class method', <class '__main__.MyClass'>)
MyClass.static_method(1)               # 'static method'

instance.instance_method(1)            # ('instance method', <__main__.MyClass object at 0x...>)
instance.class_method(1)               # 가능하지만 쓰지 말 것
instance.static_method(1)              # 가능하지만 쓰지 말 것`,
        },
        {
          type: "compare",
          cols: [
            { title: "클래스가 쓰는 것", tone: "good", items: ["클래스 메서드", "스태틱 메서드"] },
            { title: "인스턴스가 쓰는 것", tone: "good", items: ["인스턴스 메서드"] },
          ],
        },
        {
          type: "tip",
          kind: "warn",
          text: "파이썬은 셋 다 어디서든 호출을 허용한다. 하지만 각 메서드는 OOP 목적에 맞게 설계됐으니 위 짝을 지킨다.",
        },
        {
          type: "list",
          style: "check",
          items: ["`'hello'.upper()` 의 정체는 `str.upper('hello')`", "self / cls + @classmethod / 없음 + @staticmethod", "할 수 있다고 다 쓰면 안 된다"],
        },
      ],
    },
    {
      id: "n-py-8-5",
      emoji: "🪄",
      title: "참고: 이름 공간·매직 메서드·데코레이터",
      summary: "속성은 인스턴스 → 클래스 순으로 찾고, __str__ 같은 매직 메서드는 자동 호출",
      blocks: [
        { type: "key", text: "속성은 인스턴스 먼저, 없으면 클래스" },
        {type: "figure", kind: "flow", nodes: [{icon: "🧍", label: "인스턴스", sub: "먼저 찾음"}, {icon: "📐", label: "클래스", ink: "blue"}, {icon: "💥", label: "AttributeError", ink: "red"}], edges: ["없으면", "없으면"]},
        { type: "h2", text: "인스턴스와 클래스의 이름 공간" },
        {
          type: "list",
          style: "flow",
          items: ["클래스 정의 → 클래스 이름 공간 생성", "인스턴스 생성 → '독립적인' 인스턴스 이름 공간 생성", "속성 접근 시 인스턴스 → 클래스 순으로 탐색"],
        },
        {
          type: "tip",
          kind: "analogy",
          text: "내 방 서랍(인스턴스)을 먼저 뒤지고, 없으면 거실 공용 서랍(클래스)으로 간다. 내 방에 같은 이름 물건을 넣으면 그 뒤론 내 방 것만 쓴다.",
        },
        {
          type: "code",
          code: `class Person:
    name = 'unknown'

    def talk(self):
        print(self.name)

p1 = Person()
p1.talk()            # 인스턴스에 없음 → 클래스 변수

p2 = Person()
p2.talk()
p2.name = 'Kim'      # p2 이름 공간에 name 생김
p2.talk()

print(Person.name)
print(p1.name)
print(p2.name)`,
          out: "unknown\nunknown\nKim\nunknown\nunknown\nKim",
        },
        {
          type: "compare",
          cols: [
            { title: "착각", tone: "bad", items: ["`p2.name = 'Kim'` 하면 `Person.name` 도 Kim"] },
            { title: "실제", tone: "good", items: ["p2 인스턴스 변수 name에 Kim 저장", "클래스 변수를 바꾸려면 `Person.name = ...`"] },
          ],
        },
        {
          type: "p",
          text: "인스턴스끼리 서로의 데이터에 직접 접근하지 못하고 독립적으로 동작한다. 덕분에 모듈화되어 충돌 없이 움직이고, 가독성·유지보수성·재사용성이 올라간다.",
        },
        { type: "h2", text: "매직 메서드" },
        {
          type: "list",
          items: [
            "인스턴스 메서드, 특정 상황에 자동 호출",
            "더블 언더스코어(`__`)로 감싼 이름. 스페셜 메서드 혹은 매직 메서드",
            "예: `__str__(self)`, `__len__(self)`, 비교 연산자 `__lt__`·`__le__`·`__eq__`·`__gt__`·`__ge__`·`__ne__(self, other)`",
          ],
        },
        {
          type: "code",
          code: `class Circle:
    def __init__(self, r):
        self.r = r

    def __str__(self):               # print() 가 호출
        return f'원의 반지름: {self.r}'

c1 = Circle(10)
c2 = Circle(1)
print(c1)
print(c2)`,
          out: "원의 반지름: 10\n원의 반지름: 1",
        },
        { type: "h2", text: "데코레이터" },
        {
          type: "list",
          style: "flow",
          items: ["원본 함수(func)를 받는다", "앞뒤에 작업을 덧붙인 새 함수(wrapper)를 만든다", "wrapper를 돌려준다. `@이름` 을 함수 위에 붙이면 적용"],
        },
        {
          type: "code",
          code: `def my_decorator(func):
    def wrapper():
        print('함수 실행 전')
        result = func()          # 원본 함수 호출
        print('함수 실행 후')
        return result
    return wrapper

@my_decorator
def my_function():
    print('원본 함수 실행')

my_function()`,
          out: "함수 실행 전\n원본 함수 실행\n함수 실행 후",
        },
        {
          type: "list",
          style: "check",
          items: ["탐색 순서: 인스턴스 → 클래스, 인스턴스 변수가 우선", "`__str__` 은 print() 할 때 자동 호출", "데코레이터는 원본 함수를 감싸는 함수. `@classmethod` 도 같은 원리"],
        },
      ],
    },
  ],
};
