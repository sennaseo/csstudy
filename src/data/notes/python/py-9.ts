// 파이썬 단원 9 — OOP 2 (노션 SSAFY 파이썬 강의 정리본). 작성 규칙은 ../python.ts 상단 주석.
import type { NoteUnit } from "../types";

export const PY9: NoteUnit = {
  id: "py-9",
  title: "OOP 2",
  notes: [
    {
      id: "n-py-9-1",
      emoji: "🧬",
      title: "상속: 부모의 것을 물려받기",
      summary: "class Student(Person) 한 줄로 부모의 속성·메서드를 재사용한다",
      blocks: [
        {
          type: "tip",
          kind: "analogy",
          text: "상속은 '가업 물려받기'다. 부모(Person)가 이미 갖고 있는 기술(talk)을 자식(Student, Professor)이 처음부터 다시 배울 필요 없이 그대로 쓰고, 자기만의 것(gpa, department)만 더하면 된다.",
        },
        { type: "h2", text: "상속이란, 왜 필요한가" },
        {
          type: "p",
          text: "기존 클래스의 속성과 메서드를 물려받아 새로운 하위 클래스를 만드는 것. 필요한 이유 세 가지:",
        },
        {
          type: "list",
          ordered: true,
          items: [
            "코드 재사용 — 기존 클래스의 속성·메서드를 그대로 활용하고 중복 코드를 줄인다",
            "계층 구조 — 부모·자식 관계를 표현하고, 더 구체적인 클래스를 만들 수 있다",
            "유지 보수 용이 — 고칠 게 생기면 부모 클래스만 고치면 된다. 수정 범위가 최소화되고 코드 일관성이 유지된다",
          ],
        },
        { type: "h2", text: "상속 없이 만들면" },
        {
          type: "code",
          code: `class Professor:
    def __init__(self, name, age, department):
        self.name = name
        self.age = age
        self.department = department

    def talk(self):  # 중복
        print(f'반갑습니다. {self.name}입니다.')


class Student:
    def __init__(self, name, age, gpa):
        self.name = name
        self.age = age
        self.gpa = gpa

    def talk(self):  # 중복 — 똑같은 코드가 두 번
        print(f'반갑습니다. {self.name}입니다.')`,
        },
        {
          type: "p",
          text: "Person 하나로 학생·교수를 다 만들면 학생/교수 정보를 따로 표현하기 어렵고, 교수/학생 클래스로 쪼개면 `talk` 같은 메서드가 중복으로 정의된다.",
        },
        { type: "h2", text: "상속으로 계층 구조 바꾸기" },
        {
          type: "code",
          code: `class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def talk(self):  # 메서드 재사용
        print(f'반갑습니다. {self.name}입니다.')


class Professor(Person):           # 괄호 안 = 부모 클래스
    def __init__(self, name, age, department):
        self.name = name
        self.age = age
        self.department = department


class Student(Person):
    def __init__(self, name, age, gpa):
        self.name = name
        self.age = age
        self.gpa = gpa


p1 = Professor('박교수', 49, '컴퓨터공학과')
s1 = Student('김학생', 20, 3.5)
p1.talk()  # 결과: 반갑습니다. 박교수입니다.  (부모 Person 의 talk)
s1.talk()  # 결과: 반갑습니다. 김학생입니다.`,
        },
        {
          type: "p",
          text: "`s1.talk()`를 부르면 Student 안에 talk이 없으니 화살표를 타고 부모 Person으로 올라가 찾는다(자식 → 부모 탐색). 그림으로 그리면 Person(name, age / talk()) 아래에 Student(gpa), Professor(department)가 달린 모양.",
        },
        {
          type: "tip",
          kind: "warn",
          text: "자식 클래스에서 `__init__`을 새로 쓰면 부모의 `__init__`은 자동으로 실행되지 않는다. 위 코드처럼 name·age를 다시 손으로 넣어야 하는데, 이 중복은 다음 노트의 `super()`로 없앤다.",
        },
        { type: "h2", text: "3줄 정리" },
        {
          type: "list",
          items: [
            "`class 자식(부모):` — 부모의 속성과 메서드를 물려받는다",
            "이유: 코드 재사용, 계층 구조, 유지 보수 용이",
            "자식에 없는 메서드는 부모에게 올라가서 찾는다",
          ],
        },
      ],
    },
    {
      id: "n-py-9-2",
      emoji: "💎",
      title: "다중 상속·MRO·super()",
      summary: "부모가 여럿이면 MRO 순서로 찾고, super()는 그 순서의 '다음 부모'를 부른다",
      blocks: [
        {
          type: "tip",
          kind: "analogy",
          text: "다중 상속은 엄마·아빠 양쪽에게서 물려받는 것. 둘 다 같은 걸 갖고 있으면(gene) 누구 걸 받을까? 파이썬은 '족보 탐색 순서표(MRO)'를 미리 만들어 두고, 거기 적힌 순서대로 처음 발견한 것을 쓴다. `super()`는 '이 순서표에서 내 다음 사람'을 부르는 호출 버튼이다.",
        },
        { type: "h2", text: "다중 상속과 상속 순서" },
        {
          type: "code",
          code: `class Person:
    def __init__(self, name):
        self.name = name

class Mom(Person):
    gene = 'XX'
    def swim(self):
        return '엄마가 수영'

class Dad(Person):
    gene = 'XY'
    def walk(self):
        return '아빠가 걷기'

class FirstChild(Dad, Mom):        # Dad 가 1st, Mom 이 2nd
    def swim(self):
        return '첫째가 수영'
    def cry(self):
        return '첫째가 응애'

baby1 = FirstChild('아가')
print(baby1.cry())    # 결과: 첫째가 응애
print(baby1.swim())   # 결과: 첫째가 수영  (자기 것이 먼저)
print(baby1.walk())   # 결과: 아빠가 걷기
print(baby1.gene)     # 결과: XY  (Dad 가 먼저라서)`,
        },
        {
          type: "tip",
          kind: "memo",
          text: "다중 상속에서 중복된 속성이나 메서드가 있으면 상속 순서에 의해 결정된다. `class FirstChild(Dad, Mom)`이면 Dad 것이 우선 → gene은 'XY'.",
        },
        { type: "h2", text: "다이아몬드 문제와 MRO" },
        {
          type: "p",
          text: "B와 C가 A를 상속하고 D가 B·C를 모두 상속하면 그림이 다이아몬드(◇)가 된다. A의 메서드를 B와 C가 각각 재정의했는데 D는 재정의하지 않았다면 — D는 B 버전을 쓸까, C 버전을 쓸까? 이 모호함이 다이아몬드 문제다.",
        },
        {
          type: "list",
          items: [
            "파이썬의 해결책: MRO(Method Resolution Order, 메서드 결정 순서) 알고리즘으로 탐색할 클래스 목록을 만든다",
            "규칙: 깊이 우선으로, 왼쪽에서 오른쪽으로, 겹치는 같은 클래스는 두 번 검색하지 않음",
            "`class D(B, C)`라면 D → B → C → A 순. 각 부모를 오직 한 번만 호출하고 좌→우 순서를 보존하는 단조적 구조라, 메서드 호출 순서가 예측 가능해지고 재사용성·유지보수성이 올라간다",
            "`클래스.mro()`로 확인 가능 — 인스턴스 → 클래스 순으로 이름 공간을 탐색하던 것이, 상속이 있으면 인스턴스 → 자식 클래스 → 부모 클래스로 확장되는 것",
          ],
        },
        {
          type: "code",
          code: `class A:
    def __init__(self):
        print('A Constructor')

class B(A):
    def __init__(self):
        super().__init__()
        print('B Constructor')

class C(A):
    def __init__(self):
        super().__init__()
        print('C Constructor')

class D(B, C):
    def __init__(self):
        super().__init__()
        print('D Constructor')

print(D.mro())
# 결과: [<class '__main__.D'>, <class '__main__.B'>,
#        <class '__main__.C'>, <class '__main__.A'>, <class 'object'>]

D()
# 결과: A Constructor → C Constructor → B Constructor → D Constructor
# (super() 가 MRO 의 '다음' 을 부르므로 D→B→C→A 로 들어갔다가 역순으로 출력)`,
        },
        { type: "h2", text: "super(): 부모를 이름 없이 부르기" },
        {
          type: "p",
          text: "부모 클래스 객체를 반환하는 내장 함수. 다중 상속이면 MRO를 기반으로 '다음에 호출될' 부모의 메서드를 자동으로 결정해 호출한다.",
        },
        {
          type: "code",
          code: `# 단일 상속 — 부모 __init__ 을 재활용해 중복 제거
class Person:
    def __init__(self, name, age, number, email):
        self.name = name
        self.age = age
        self.number = number
        self.email = email

class Student(Person):
    def __init__(self, name, age, number, email, student_id):
        super().__init__(name, age, number, email)   # Person 의 __init__ 호출
        self.student_id = student_id

# 다중 상속 — super() 는 MRO 상 다음인 ParentA 만 부른다
class ParentA:
    def __init__(self):
        self.value_a = 'ParentA'
    def show_value(self):
        print(f'Value from ParentA: {self.value_a}')

class ParentB:
    def __init__(self):
        self.value_b = 'ParentB'
    def show_value(self):
        print(f'Value from ParentB: {self.value_b}')

class Child(ParentA, ParentB):
    def __init__(self):
        super().__init__()          # ParentA 의 __init__
        self.value_c = 'Child'
    def show_value(self):
        super().show_value()        # ParentA 의 show_value
        print(f'Value from Child: {self.value_c}')

Child().show_value()
# 결과: Value from ParentA: ParentA
#       Value from Child: Child`,
        },
        {
          type: "tip",
          kind: "memo",
          text: "ParentB를 먼저(또는 같이) 쓰고 싶다면 따로 호출해야 한다 ⇒ `ParentB.show_value(self)` 처럼 클래스 이름으로 직접.",
        },
        {
          type: "table",
          head: ["super() 사용 사례", "이점"],
          rows: [
            ["단일 상속", "부모 이름을 직접 쓰지 않아도 됨 → 클래스 이름이 바뀌거나 부모가 교체돼도 코드 수정이 적다"],
            ["다중 상속", "MRO를 따라 메서드 호출 → 복잡한 다중 상속에서 생길 수 있는 문제(다이아몬드)를 방지"],
          ],
        },
        {
          type: "tip",
          kind: "warn",
          text: "`super()`는 '내 부모'가 아니라 'MRO에서 내 다음'을 부른다. 다중 상속에서 `super().__init__()` 한 번은 ParentA만 실행하고 ParentB의 `__init__`은 건너뛴다 — `self.value_b`가 없다고 에러 나면 이것 때문이다.",
        },
        { type: "h2", text: "3줄 정리" },
        {
          type: "list",
          items: [
            "`class 자식(A, B)` — 겹치는 건 왼쪽(A)이 우선. 순서는 `클래스.mro()`로 확인",
            "MRO: 깊이 우선·좌→우·중복 제외로 만든 탐색 순서표. 다이아몬드 문제를 해결",
            "`super()`는 MRO의 다음 클래스를 호출 — 부모 `__init__` 재활용에 쓰고, 다중 상속에선 첫 부모만 탄다",
          ],
        },
      ],
    },
    {
      id: "n-py-9-3",
      emoji: "🐛",
      title: "버그·디버깅·에러의 종류",
      summary: "문법 에러는 실행 전에, 예외는 실행 중에 터진다 — 내장 예외 이름 외우기",
      blocks: [
        {
          type: "tip",
          kind: "analogy",
          text: "문법 에러는 '맞춤법 틀린 편지'라 우체국(파이썬)이 접수 자체를 거부한다. 예외는 '편지는 제대로 썼는데 받는 사람 주소가 없는 것' — 배달(실행) 도중에 문제가 터진다. 디버깅은 어디서 잘못됐는지 되짚어 찾는 일.",
        },
        { type: "h2", text: "버그와 디버깅" },
        {
          type: "list",
          items: [
            "버그: 소프트웨어의 오류 또는 결함. 프로그램의 '예상된 동작'과 '실제 동작' 사이의 불일치",
            "디버깅(Debugging): 버그를 찾아내고 수정하는 과정. 오작동 원인을 식별해 고치는 작업",
          ],
        },
        {
          type: "list",
          ordered: true,
          items: [
            "`print` 함수 활용 — 특정 함수 결과, 반복/조건 결과를 나눠서 찍어 보기. 코드를 반으로 나눠(bisection) 범위 좁히기",
            "개발 환경(text editor, IDE) 기능 활용 — breakpoint, 변수 조회 등",
            "Python Tutor 활용 (단순 파이썬 코드인 경우)",
            "뇌 컴파일, 눈 디버깅 등",
          ],
        },
        { type: "h2", text: "에러: 문법 에러 vs 예외" },
        {
          type: "p",
          text: "에러는 프로그램 실행 중 발생하는 예외 상황. 크게 두 종류 — 문법 에러(구문이 틀려서 실행조차 못 함: 오타, 괄호·콜론 누락)와 예외(실행 중에 감지되는 에러).",
        },
        {
          type: "code",
          code: `# 전부 문법 에러라 실행조차 안 된다 — 한 줄씩 따로 실행해야 메시지가 보인다
# (에러 문구는 파이썬 버전마다 조금 다르다)
while            # 에러: SyntaxError: invalid syntax (문법 오류)
5 = 3            # 에러: SyntaxError: cannot assign to literal (잘못된 할당)
print('hello     # 에러: SyntaxError: EOL while scanning string literal (따옴표 안 닫힘)
print(           # 에러: SyntaxError: unexpected EOF while parsing (괄호 안 닫힘)

for i in range(10):
print(i)         # 에러: IndentationError: expected an indented block (들여쓰기)`,
        },
        { type: "h2", text: "내장 예외" },
        {
          type: "p",
          text: "예외 상황을 나타내는 예외 클래스들. 파이썬에 이미 정의되어 있어서 특정 예외 상황을 처리할 때 이 이름으로 잡는다.",
        },
        {
          type: "table",
          head: ["예외", "언제", "예시"],
          rows: [
            ["ZeroDivisionError", "나누기·모듈로의 두 번째 인자가 0", "`10 / 0`"],
            ["NameError", "지역·전역 이름을 찾을 수 없음", "`print(name_error)`"],
            ["TypeError", "타입 불일치 / 인자 누락·초과 / 인자 타입 불일치", "`'2' + 2`, `sum()`, `sum(1, 2, 3)`, `random.sample(1, 2)`"],
            ["ValueError", "연산·함수는 문제없지만 값이 부적절 (IndexError 등 더 구체적 예외로 설명되지 않을 때)", "`int('1.5')`, `range(3).index(6)`"],
            ["IndexError", "시퀀스 인덱스가 범위를 벗어남", "`[][2]`"],
            ["KeyError", "딕셔너리에 해당 키가 없음", "`{'name': 'Alice'}['age']`"],
            ["ModuleNotFoundError", "모듈을 찾을 수 없음", "`import hahaha`"],
            ["ImportError", "import 하려는 이름을 찾을 수 없음", "`from random import hahaha`"],
            ["KeyboardInterrupt", "사용자가 Ctrl-C 또는 Delete 를 누름 (무한루프 강제 종료)", "`while True: continue`"],
          ],
        },
        {
          type: "code",
          code: `# 각 줄이 예외를 일으킨다 — 한 줄씩 따로 실행해 볼 것
'2' + 2          # 에러: TypeError: can only concatenate str (not "int") to str
sum()            # 에러: TypeError: sum() takes at least 1 positional argument (0 given)
int('1.5')       # 에러: ValueError: invalid literal for int() with base 10: '1.5'
range(3).index(6)  # 에러: ValueError: 6 is not in range
[][2]            # 에러: IndexError: list index out of range
{'name': 'Alice'}['age']  # 에러: KeyError: 'age'`,
        },
        {
          type: "tip",
          kind: "warn",
          text: "TypeError와 ValueError를 헷갈리기 쉽다. `'2' + 2`는 '종류'가 안 맞아서 TypeError, `int('1.5')`는 종류(문자열)는 맞지만 '값'이 정수로 못 바뀌어서 ValueError. 종류 문제면 Type, 값 문제면 Value.",
        },
        { type: "h2", text: "3줄 정리" },
        {
          type: "list",
          items: [
            "버그 = 예상과 실제의 불일치, 디버깅 = print·breakpoint·Python Tutor로 원인 찾기",
            "문법 에러(SyntaxError, IndentationError)는 실행 전에 걸리고, 예외는 실행 중에 터진다",
            "내장 예외는 이름이 곧 설명 — ZeroDivision, Name, Type, Value, Index, Key, ModuleNotFound, Import, KeyboardInterrupt",
          ],
        },
      ],
    },
    {
      id: "n-py-9-4",
      emoji: "🛟",
      title: "예외 처리: try·except·else·finally",
      summary: "터질 수 있는 코드는 try에, 터지면 except, 안 터지면 else, 항상 finally",
      blocks: [
        {
          type: "tip",
          kind: "analogy",
          text: "번지점프에 비유하면 — try는 '뛰어내리기', except는 '안전망(줄이 끊기면 받아줌)', else는 '무사히 착지했을 때만 주는 기념 사진', finally는 '성공하든 말든 장비 반납'. 안전망이 없으면 프로그램이 그 자리에서 비정상 종료된다.",
        },
        { type: "h2", text: "예외 처리 구문" },
        {
          type: "p",
          text: "예외가 발생했을 때 프로그램이 비정상적으로 종료되지 않고 적절하게 처리할 수 있도록 하는 방법.",
        },
        {
          type: "table",
          head: ["키워드", "역할"],
          rows: [
            ["try", "예외가 발생할 수 있는 코드 작성"],
            ["except", "예외가 발생했을 때 실행할 코드 작성"],
            ["else", "예외가 발생하지 않았을 때 실행할 코드 작성"],
            ["finally", "예외 발생 여부와 상관없이 항상 실행할 코드 작성"],
          ],
        },
        {
          type: "code",
          code: `try:
    x = int(input('숫자를 입력하세요: '))
    y = 10 / x
except ZeroDivisionError:
    print('0으로 나눌 수 없습니다.')
except ValueError:
    print('유효한 숫자가 아닙니다.')
else:
    print(f'결과: {y}')
finally:
    print('프로그램이 종료되었습니다.')

# 입력 0  → 0으로 나눌 수 없습니다. / 프로그램이 종료되었습니다.
# 입력 a  → 유효한 숫자가 아닙니다. / 프로그램이 종료되었습니다.
# 입력 2  → 결과: 5.0 / 프로그램이 종료되었습니다.`,
        },
        { type: "h2", text: "try-except 흐름" },
        {
          type: "list",
          items: [
            "try 블록 안에는 예외가 발생할 수 있는 코드, except 블록 안에는 예외가 발생했을 때 처리할 코드",
            "예외가 발생하면 프로그램 흐름은 try 블록을 빠져나와 해당 예외에 대응하는 except 블록으로 이동한다 — try 안의 남은 줄은 실행되지 않는다",
            "예: `10 / 0` → `except ZeroDivisionError:`로 점프. `int(input())`에 'a' 입력 → `except ValueError:`로 점프",
          ],
        },
        { type: "h2", text: "복수 예외 처리" },
        {
          type: "p",
          text: "연습: 100을 사용자가 입력한 값으로 나눠 출력하기. 먼저 발생 가능한 에러를 예상해 본다 — `int('a')`처럼 문자열을 int로 형변환하면 ValueError, `100 / 0`이면 ZeroDivisionError.",
        },
        {
          type: "code",
          code: `# ① 한 줄에 모두 명시 — 튜플로 묶기
try:
    num = int(input('100으로 나눌 값을 입력하시오 : '))
    print(100 / num)
except (ValueError, ZeroDivisionError):
    print('제대로 입력해주세요.')

# ② 별도로 작성 — 예외마다 다른 메시지
try:
    num = int(input('100으로 나눌 값을 입력하시오 : '))
    print(100 / num)
except ValueError:
    print('숫자를 넣어주세요.')
except ZeroDivisionError:
    print('0으로 나눌 수 없습니다.')
except:                              # 그 외 모든 예외
    print('에러가 발생하였습니다.')`,
        },
        {
          type: "p",
          text: "else 블록은 예외가 발생하지 않았을 때 추가 작업을 진행하고, finally 블록은 예외 발생 여부와 상관없이 항상 실행된다(파일 닫기, 마무리 메시지 등).",
        },
        {
          type: "tip",
          kind: "warn",
          text: "`except:` 만 덜렁 쓰면 모든 예외를 삼켜 버려서 뭐가 잘못됐는지 알 수 없게 된다. 예상되는 예외는 이름을 명시해 각각 잡고, 이름 없는 `except:`는 맨 마지막 안전망으로만 둔다.",
        },
        { type: "h2", text: "3줄 정리" },
        {
          type: "list",
          items: [
            "try(시도) → except(터지면) → else(안 터지면) → finally(무조건)",
            "except는 여러 개 둘 수 있고, `except (A, B):` 튜플로 한 번에 잡을 수도 있다",
            "예외가 나면 try 블록을 즉시 빠져나와 맞는 except로 점프한다",
          ],
        },
      ],
    },
    {
      id: "n-py-9-5",
      emoji: "🎯",
      title: "예외 처리 심화: 계층·as·EAFP/LBYL",
      summary: "except는 하위 예외부터, as로 예외 객체 받기, 검사 먼저냐 실행 먼저냐",
      blocks: [
        {
          type: "tip",
          kind: "analogy",
          text: "except 절은 '공항 입국 심사 줄'이다. 맨 앞 심사대가 '아무나 통과'(BaseException)면 뒤의 전문 심사대(ZeroDivisionError)에는 아무도 안 간다. 그래서 구체적인(하위) 심사대를 앞에 세워야 한다.",
        },
        { type: "h2", text: "내장 예외의 상속 계층 주의" },
        {
          type: "code",
          code: `try:
    num = int(input('100으로 나눌 값을 입력하시오 : '))
    print(100 / num)
except BaseException:                 # 모든 예외의 조상 → 여기서 다 잡힘
    print('숫자를 넣어주세요.')
except ZeroDivisionError:             # 이 블록에 도달하지 못함
    print('0으로 나눌 수 없습니다.')
except:                               # 여기도 도달하지 못함
    print('에러가 발생하였습니다.')`,
        },
        {
          type: "p",
          text: "내장 예외 클래스는 상속 계층 구조를 가진다. BaseException → Exception → ArithmeticError → ZeroDivisionError 처럼 위로 올라갈수록 넓은 범위라, 상위 클래스를 먼저 쓰면 그 아래 except 절에는 영영 도달하지 못한다. 그래서 except 절로 분기할 때는 반드시 하위 클래스를 먼저 확인하도록 작성해야 한다.",
        },
        {
          type: "table",
          head: ["부모", "자식 예외"],
          rows: [
            ["BaseException", "Exception, KeyboardInterrupt"],
            ["Exception", "AttributeError, ArithmeticError, EOFError, NameError, LookupError, StopIteration, OSError, TypeError, ValueError"],
            ["ArithmeticError", "FloatingPointError, OverflowError, ZeroDivisionError"],
            ["LookupError", "IndexError, KeyError"],
            ["OSError", "FileExistsError, PermissionError"],
          ],
        },
        { type: "h2", text: "예외 객체: as 키워드" },
        {
          type: "p",
          text: "예외 객체는 예외가 발생했을 때 그 예외에 대한 정보를 담고 있는 객체. `except 예외 as 이름:`으로 받으면 except 블록에서 상세한 예외 정보를 활용할 수 있다.",
        },
        {
          type: "code",
          code: `my_list = []

try:
    number = my_list[1]
except IndexError as error:
    print(f'{error}가 발생했습니다.')
# 결과: list index out of range가 발생했습니다.`,
        },
        {
          type: "p",
          text: "try-except와 if-else는 같이 쓸 수 있다. 예: try 안에서 `x = int(input())`을 받고, `if x < 0:`이면 '음수는 허용되지 않습니다.', 아니면 입력값 출력 — 그리고 `except ValueError:`로 숫자가 아닌 입력을 잡는다.",
        },
        { type: "h2", text: "EAFP vs LBYL" },
        {
          type: "table",
          head: ["", "EAFP (try-except)", "LBYL (if-else)"],
          rows: [
            ["한 줄로", "'일단 실행하고 예외를 처리'", "'실행하기 전에 조건을 검사'"],
            ["방식", "예외처리를 중심으로 코드 작성. 실행하고 예외가 나면 그때 처리", "값 검사를 중심으로 코드 작성. 조건문으로 예외 상황을 미리 검사해 피함"],
            ["특징", "예외를 미리 예측해 대비하는 게 아니라 발생한 후에 처리", "동작이 더 예측 가능하지만 코드가 길고 복잡해질 수 있음"],
            ["유용할 때", "예외 상황을 예측하기 어려운 경우", "예외 상황을 미리 방지하고 싶을 때"],
          ],
        },
        {
          type: "code",
          code: `my_dict = {'name': 'Alice'}   # 'key' 는 없다

# EAFP: Easier to Ask for Forgiveness than Permission
try:
    result = my_dict['key']
    print(result)
except KeyError:
    print('Key가 존재하지 않습니다.')   # 결과: Key가 존재하지 않습니다.

# LBYL: Look Before You Leap
if 'key' in my_dict:
    result = my_dict['key']
    print(result)
else:
    print('Key가 존재하지 않습니다.')   # 결과: Key가 존재하지 않습니다.`,
        },
        {
          type: "p",
          text: "슬라이드 캡처에는 펜으로 EAFP 코드에 X, LBYL 코드에 O 가 그려져 있다(강의 중 판서로 보임). 정답이 하나라는 뜻이라기보다, 이 예제처럼 미리 검사할 수 있는 상황이면 if 로 막는 쪽을 권한 것으로 읽힌다.",
        },
        {
          type: "tip",
          kind: "warn",
          text: "`except Exception:` 이나 `except BaseException:` 을 맨 위에 두는 실수가 제일 흔하다. 구체적인 예외(ZeroDivisionError, ValueError …)를 위에, 넓은 예외는 맨 아래에.",
        },
        { type: "h2", text: "3줄 정리" },
        {
          type: "list",
          items: [
            "except 순서는 하위(구체적) → 상위(넓은) 예외. 거꾸로 쓰면 아래 절은 죽은 코드",
            "`except 예외 as e:` 로 예외 객체를 받아 메시지 등 상세 정보를 활용",
            "EAFP = 일단 실행 후 except, LBYL = if로 먼저 검사. 상황에 맞게 고른다",
          ],
        },
      ],
    },
  ],
};
