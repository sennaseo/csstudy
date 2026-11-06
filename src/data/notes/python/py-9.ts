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
        { type: "key", text: "`class 자식(부모):` 한 줄로 부모의 속성·메서드를 물려받는다" },
        {type: "figure", kind: "tree", root: {icon: "🧑", label: "`Person`", sub: "이름·인사", ink: "blue"}, children: [{icon: "🎓", label: "`Student`", sub: "+ 학번"}, {icon: "💼", label: "`Professor`", sub: "+ 학과"}], caption: "자식은 부모 것을 물려받고 자기 것만 더한다"},
        { type: "h2", text: "상속이 필요한 이유" },
        {
          type: "compare",
          cols: [
            { title: "♻️ 코드 재사용", items: ["기존 속성·메서드를 그대로 활용", "중복 코드 감소"] },
            { title: "🌳 계층 구조", items: ["부모·자식 관계 표현", "더 구체적인 클래스 만들기"] },
            { title: "🔧 유지 보수 용이", items: ["부모 클래스만 고치면 끝", "수정 범위 최소, 코드 일관성 유지"] },
          ],
        },
        { type: "h2", text: "상속 없이 만들면 중복" },
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

    def talk(self):  # 중복
        print(f'반갑습니다. {self.name}입니다.')`,
        },
        {
          type: "compare",
          cols: [
            { title: "Person 하나로", tone: "bad", items: ["학생/교수 정보를 따로 표현하기 어렵다"] },
            { title: "교수/학생 따로", tone: "bad", items: ["`talk` 같은 메서드가 중복 정의된다"] },
          ],
        },
        { type: "h2", text: "상속으로 계층 구조 바꾸기" },
        {
          type: "compare",
          cols: [
            { title: "👤 Person (부모)", items: ["name, age", "talk()"] },
            { title: "🎓 Student(Person)", items: ["+ gpa"] },
            { title: "🧑‍🏫 Professor(Person)", items: ["+ department"] },
          ],
        },
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
p1.talk()
s1.talk()`,
          out: "반갑습니다. 박교수입니다.\n반갑습니다. 김학생입니다.",
        },
        { type: "h2", text: "없으면 부모에게 올라가 찾는다" },
        {
          type: "list",
          style: "flow",
          items: ["`s1.talk()` 호출", "Student 안에서 talk 찾기 → 없음", "부모 Person 으로 올라가 찾기 → 있음", "Person 의 talk 실행"],
        },
        {
          type: "code",
          code: `class Person:
    def talk(self):
        print('Person의 talk')

class Student(Person):
    pass

Student().talk()`,
          out: "Person의 talk",
        },
        {
          type: "tip",
          kind: "warn",
          text: "자식에서 `__init__`을 새로 쓰면 부모의 `__init__`은 자동 실행되지 않는다. 그래서 위 코드는 name·age를 다시 넣었다. 이 중복은 다음 노트의 `super()`로 없앤다.",
        },
        {
          type: "list",
          style: "check",
          items: ["`class 자식(부모):` 로 속성·메서드 상속", "이유: 코드 재사용, 계층 구조, 유지 보수", "자식에 없으면 부모에게 올라가 찾는다"],
        },
      ],
    },
    {
      id: "n-py-9-2",
      emoji: "💎",
      title: "다중 상속·MRO·super()",
      summary: "부모가 여럿이면 MRO 순서로 찾고, super()는 그 순서의 '다음 부모'를 부른다",
      blocks: [
        { type: "key", text: "`super()`는 '내 부모'가 아니라 'MRO에서 내 다음'" },
        {type: "figure", kind: "flow", nodes: [{icon: "👶", label: "`Child`"}, {icon: "👨", label: "`Dad`", sub: "왼쪽 부모 먼저", ink: "blue"}, {icon: "👩", label: "`Mom`"}, {icon: "🧓", label: "`object`"}], edges: ["MRO", "", ""], caption: "`super()` = 이 줄에서 내 다음 칸"},
        { type: "h2", text: "다중 상속: 왼쪽 부모가 우선" },
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
print(baby1.cry())
print(baby1.swim())   # 자기 것이 먼저
print(baby1.walk())
print(baby1.gene)     # Dad 가 먼저라서 XY`,
          out: "첫째가 응애\n첫째가 수영\n아빠가 걷기\nXY",
        },
        {
          type: "tip",
          kind: "memo",
          text: "다중 상속에서 중복된 속성이나 메서드가 있으면 상속 순서에 의해 결정된다. `class FirstChild(Dad, Mom)`이면 Dad 것이 우선 → gene은 'XY'.",
        },
        { type: "h2", text: "다이아몬드 문제와 MRO" },
        {
          type: "compare",
          cols: [
            { title: "문제", tone: "bad", items: ["B·C가 A를 상속, D가 B·C를 상속 → ◇ 모양", "B·C 둘 다 A의 메서드를 재정의, D는 안 함", "D는 B 버전? C 버전?"] },
            { title: "해결: MRO", tone: "good", items: ["Method Resolution Order (메서드 결정 순서)", "깊이 우선, 왼쪽 → 오른쪽", "같은 클래스는 두 번 검색 안 함"] },
          ],
        },
        {
          type: "list",
          style: "flow",
          items: ["D", "B", "C", "A", "object"],
        },
        {
          type: "p",
          text: "`class D(B, C)`의 탐색 순서. 부모마다 한 번만, 좌→우 순서를 지키고 `클래스.mro()`로 확인한다.",
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
D()`,
          out: "[<class '__main__.D'>, <class '__main__.B'>, <class '__main__.C'>, <class '__main__.A'>, <class 'object'>]\nA Constructor\nC Constructor\nB Constructor\nD Constructor",
        },
        {
          type: "list",
          style: "flow",
          items: ["D 의 `super()` → B", "B 의 `super()` → C (B의 부모 A가 아니라 MRO 다음)", "C 의 `super()` → A, 'A Constructor' 출력", "되돌아오며 C → B → D 순으로 출력"],
        },
        { type: "h2", text: "super() 단일 상속: 부모 __init__ 재활용" },
        {
          type: "code",
          code: `class Person:
    def __init__(self, name, age, number, email):
        self.name = name
        self.age = age
        self.number = number
        self.email = email

class Student(Person):
    def __init__(self, name, age, number, email, student_id):
        super().__init__(name, age, number, email)   # Person 의 __init__ 호출
        self.student_id = student_id

s1 = Student('김학생', 20, '010-1234-5678', 'kim@ssafy.com', 1)
print(s1.name, s1.student_id)`,
          out: "김학생 1",
        },
        { type: "h2", text: "super() 다중 상속: MRO 다음 하나만" },
        {
          type: "code",
          code: `class ParentA:
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

Child().show_value()`,
          out: "Value from ParentA: ParentA\nValue from Child: Child",
        },
        {
          type: "tip",
          kind: "warn",
          text: "`super().__init__()` 한 번은 ParentA만 실행한다. ParentB의 `__init__`은 건너뛰니 `self.value_b`가 없다는 에러가 나면 이것 때문.",
        },
        {
          type: "tip",
          kind: "memo",
          text: "ParentB를 먼저(또는 같이) 쓰고 싶다면 따로 호출해야 한다 ⇒ `ParentB.show_value(self)` 처럼 클래스 이름으로 직접.",
        },
        {
          type: "table",
          head: ["super() 사용", "이점"],
          rows: [
            ["단일 상속", "부모 이름을 직접 안 씀 → 클래스 이름이 바뀌거나 부모가 교체돼도 수정이 적다"],
            ["다중 상속", "MRO를 따라 호출 → 다이아몬드 같은 문제 방지"],
          ],
        },
        {
          type: "list",
          style: "check",
          items: [
            "`class 자식(A, B)` 는 왼쪽(A) 우선, 순서는 `클래스.mro()`",
            "MRO: 깊이 우선·좌→우·중복 제외",
            "`super()`는 MRO 다음 클래스 호출, 다중 상속에선 첫 부모만",
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
        { type: "key", text: "문법 에러는 실행 전에, 예외는 실행 중에 터진다" },
        {type: "figure", kind: "tree", root: {icon: "🐞", label: "에러"}, children: [{icon: "📝", label: "문법 에러", sub: "실행 전에 막힘", ink: "red", leaves: ["`SyntaxError`"]}, {icon: "💥", label: "예외", sub: "실행 중에 터짐", ink: "blue", leaves: ["`ZeroDivisionError`", "`KeyError`"]}]},
        { type: "h2", text: "버그와 디버깅" },
        {
          type: "compare",
          cols: [
            { title: "🐛 버그", items: ["소프트웨어의 오류 또는 결함", "'예상된 동작'과 '실제 동작'의 불일치"] },
            { title: "🔍 디버깅", items: ["버그를 찾아 수정하는 과정", "오작동 원인을 식별해 고치기"] },
          ],
        },
        {
          type: "table",
          head: ["방법", "내용"],
          rows: [
            ["`print` 찍기", "함수 결과, 반복/조건 결과를 나눠 출력. 코드를 반으로 나눠(bisection) 범위 좁히기"],
            ["개발 환경 기능", "text editor, IDE 의 breakpoint, 변수 조회 등"],
            ["Python Tutor", "단순 파이썬 코드일 때"],
            ["뇌 컴파일", "눈 디버깅 등"],
          ],
        },
        {
          type: "code",
          code: `def average(nums):
    total = sum(nums)
    print('total:', total)   # 중간값 찍어 보기
    return total / len(nums)

print(average([1, 2, 3]))`,
          out: "total: 6\n2.0",
        },
        { type: "h2", text: "문법 에러 vs 예외" },
        {
          type: "compare",
          cols: [
            { title: "문법 에러", items: ["구문이 틀려 실행조차 못 함", "오타, 괄호·콜론 누락"] },
            { title: "예외", items: ["실행 중에 감지되는 에러"] },
          ],
        },
        {
          type: "code",
          code: `# 한 줄씩 따로 실행해야 메시지가 보인다
while            # 문법 오류
5 = 3            # 잘못된 할당
print('hello     # 따옴표 안 닫힘
print(           # 괄호 안 닫힘

for i in range(10):
print(i)         # 들여쓰기`,
          out: "SyntaxError: invalid syntax\nSyntaxError: cannot assign to literal here. Maybe you meant '==' instead of '='?\nSyntaxError: unterminated string literal (detected at line 1)\nSyntaxError: '(' was never closed\nIndentationError: expected an indented block after 'for' statement on line 1",
        },
        { type: "p", text: "에러 문구는 파이썬 버전마다 조금 다르다. 위는 Python 3.13 기준." },
        { type: "h2", text: "내장 예외" },
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
          code: `# 한 줄씩 따로 실행
'2' + 2
sum()
int('1.5')
range(3).index(6)
[][2]
{'name': 'Alice'}['age']`,
          out: "TypeError: can only concatenate str (not \"int\") to str\nTypeError: sum() takes at least 1 positional argument (0 given)\nValueError: invalid literal for int() with base 10: '1.5'\nValueError: 6 is not in range\nIndexError: list index out of range\nKeyError: 'age'",
        },
        {
          type: "compare",
          cols: [
            { title: "TypeError = 종류 문제", items: ["`'2' + 2`", "문자열과 숫자는 못 더함"] },
            { title: "ValueError = 값 문제", items: ["`int('1.5')`", "종류(문자열)는 맞지만 정수로 못 바뀜"] },
          ],
        },
        {
          type: "list",
          style: "check",
          items: [
            "버그 = 예상과 실제의 불일치, 디버깅은 print·breakpoint·Python Tutor",
            "SyntaxError·IndentationError 는 실행 전, 예외는 실행 중",
            "내장 예외는 이름이 곧 설명",
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
        { type: "key", text: "try 시도 → except 터지면 → else 안 터지면 → finally 무조건" },
        {type: "figure", kind: "flow", nodes: [{icon: "🧪", label: "`try`", sub: "일단 해 봄"}, {icon: "🚑", label: "`except`", sub: "터지면", ink: "red"}, {icon: "🎉", label: "`else`", sub: "안 터지면", ink: "green"}, {icon: "🧹", label: "`finally`", sub: "무조건", ink: "blue"}]},
        { type: "h2", text: "예외 처리 4개 키워드" },
        {
          type: "table",
          head: ["키워드", "실행 시점", "예"],
          rows: [
            ["try", "예외가 발생할 수 있는 코드", "`int(input())`"],
            ["except", "예외가 발생했을 때", "`except ValueError:`"],
            ["else", "예외가 발생하지 않았을 때", "추가 작업"],
            ["finally", "예외 여부와 상관없이 항상", "파일 닫기, 마무리 메시지"],
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
    print('프로그램이 종료되었습니다.')`,
        },
        {
          type: "table",
          head: ["입력", "출력"],
          rows: [
            ["0", "0으로 나눌 수 없습니다. / 프로그램이 종료되었습니다."],
            ["a", "유효한 숫자가 아닙니다. / 프로그램이 종료되었습니다."],
            ["2", "결과: 5.0 / 프로그램이 종료되었습니다."],
          ],
        },
        { type: "h2", text: "예외가 나면 try 를 즉시 빠져나온다" },
        {
          type: "list",
          style: "flow",
          items: ["try 블록 실행", "예외 발생 → try 의 남은 줄은 건너뜀", "맞는 except 블록으로 이동"],
        },
        {
          type: "code",
          code: `try:
    print('A')
    10 / 0
    print('B')   # 실행 안 됨
except ZeroDivisionError:
    print('C')`,
          out: "A\nC",
        },
        {
          type: "p",
          text: "`10 / 0` → `except ZeroDivisionError:`로, `int(input())`에 'a' 입력 → `except ValueError:`로 점프.",
        },
        { type: "h2", text: "복수 예외 처리" },
        {
          type: "p",
          text: "연습: 100을 입력값으로 나눠 출력. 예상 에러는 `int('a')` 같은 형변환의 ValueError, `100 / 0`의 ZeroDivisionError.",
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
          type: "table",
          head: ["입력", "① 튜플", "② 별도"],
          rows: [
            ["a", "제대로 입력해주세요.", "숫자를 넣어주세요."],
            ["0", "제대로 입력해주세요.", "0으로 나눌 수 없습니다."],
          ],
        },
        {
          type: "tip",
          kind: "warn",
          text: "이름 없는 `except:`는 모든 예외를 삼켜 원인을 알 수 없게 만든다. 예상되는 예외는 이름을 명시하고, `except:`는 맨 마지막 안전망으로만.",
        },
        {
          type: "list",
          style: "check",
          items: ["try → except → else → finally", "except 는 여러 개, 또는 `except (A, B):` 튜플로", "예외가 나면 try 를 즉시 빠져나와 맞는 except 로"],
        },
      ],
    },
    {
      id: "n-py-9-5",
      emoji: "🎯",
      title: "예외 처리 심화: 계층·as·EAFP/LBYL",
      summary: "except는 하위 예외부터, as로 예외 객체 받기, 검사 먼저냐 실행 먼저냐",
      blocks: [
        { type: "key", text: "except 는 구체적인 하위 예외부터 쓴다" },
        {type: "figure", kind: "tree", root: {icon: "🧱", label: "`Exception`"}, children: [{icon: "🧮", label: "`ArithmeticError`", leaves: ["`ZeroDivisionError`"]}, {icon: "🔍", label: "`LookupError`", leaves: ["`KeyError`", "`IndexError`"]}], caption: "except 는 아래(구체적인 것)부터 쓴다"},
        { type: "h2", text: "내장 예외의 상속 계층" },
        {
          type: "list",
          style: "flow",
          items: ["BaseException (가장 넓음)", "Exception", "ArithmeticError", "ZeroDivisionError (가장 구체적)"],
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
          type: "code",
          code: `try:
    10 / 0
except Exception:
    print('Exception 에서 잡힘')
except ZeroDivisionError:
    print('여기는 못 옴')`,
          out: "Exception 에서 잡힘",
        },
        {
          type: "tip",
          kind: "warn",
          text: "`except Exception:`·`except BaseException:`을 맨 위에 두는 실수가 제일 흔하다. 상위 클래스가 먼저면 아래 except 절에는 영영 도달하지 못한다.",
        },
        { type: "h2", text: "예외 객체 받기: as" },
        {
          type: "code",
          code: `my_list = []

try:
    number = my_list[1]
except IndexError as error:
    print(f'{error}가 발생했습니다.')`,
          out: "list index out of range가 발생했습니다.",
        },
        {
          type: "p",
          text: "`except 예외 as 이름:` 으로 받으면 예외 정보(메시지 등)를 except 블록에서 쓸 수 있다.",
        },
        { type: "h2", text: "try-except 안에 if-else" },
        {
          type: "code",
          code: `for s in ['5', '-3', 'a']:
    try:
        x = int(s)
        if x < 0:
            print('음수는 허용되지 않습니다.')
        else:
            print(x)
    except ValueError:
        print('숫자가 아닙니다.')`,
          out: "5\n음수는 허용되지 않습니다.\n숫자가 아닙니다.",
        },
        {
          type: "p",
          text: "강의 예제는 `x = int(input())`로 받고 `if x < 0:` 검사, `except ValueError:`로 숫자가 아닌 입력을 잡는다.",
        },
        { type: "h2", text: "EAFP vs LBYL" },
        {
          type: "table",
          head: ["", "EAFP (try-except)", "LBYL (if-else)"],
          rows: [
            ["한 줄로", "일단 실행하고 예외를 처리", "실행하기 전에 조건을 검사"],
            ["방식", "예외처리 중심. 실행하고 예외가 나면 그때 처리", "값 검사 중심. 조건문으로 예외 상황을 미리 피함"],
            ["특징", "예측해 대비하지 않고 발생한 후에 처리", "동작이 더 예측 가능, 코드가 길고 복잡해질 수 있음"],
            ["유용할 때", "예외 상황을 예측하기 어려울 때", "예외 상황을 미리 방지하고 싶을 때"],
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
    print('Key가 존재하지 않습니다.')

# LBYL: Look Before You Leap
if 'key' in my_dict:
    result = my_dict['key']
    print(result)
else:
    print('Key가 존재하지 않습니다.')`,
          out: "Key가 존재하지 않습니다.\nKey가 존재하지 않습니다.",
        },
        {
          type: "tip",
          kind: "memo",
          text: "슬라이드에 펜으로 EAFP 코드엔 X, LBYL 코드엔 O 판서. 정답이 하나라기보다, 이 예제처럼 미리 검사할 수 있으면 if 로 막는 쪽을 권한 것으로 보인다.",
        },
        {
          type: "list",
          style: "check",
          items: [
            "except 순서는 하위 → 상위. 거꾸로면 아래 절은 죽은 코드",
            "`except 예외 as e:` 로 예외 객체 받기",
            "EAFP = 일단 실행 후 except, LBYL = if 로 먼저 검사",
          ],
        },
      ],
    },
  ],
};
