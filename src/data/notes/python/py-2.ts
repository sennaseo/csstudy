// 파이썬 단원 2 — 기초문법 1 (노션 SSAFY 파이썬 강의 정리본). 작성 규칙은 ../python.ts 상단 주석.
import type { NoteUnit } from "../types";

export const PY2: NoteUnit = {
  id: "py-2",
  title: "기초문법 1",
  notes: [
    {
      id: "n-py-2-1",
      emoji: "📦",
      title: "표현식·변수·할당",
      summary: "값이 되는 조각(표현식)을 상자(변수)에 담는 법과 재할당의 함정",
      blocks: [
        { type: "key", text: "변수는 값을 담는 상자가 아니라 값이 있는 방의 번호표" },
        {type: "figure", kind: "refs", vars: [{name: "number", to: 0}, {name: "double", to: 1}], objs: [{icon: "🔢", label: "5", sub: "재할당 후", ink: "blue"}, {icon: "🔢", label: "20", sub: "계산 끝난 값"}], caption: "변수는 값이 있는 방을 가리키는 번호표"},
        { type: "h2", text: "표현식 = 값이 되는 조각" },
        {
          type: "p",
          text: "`3 + 4`, `36.5`, `degrees` 모두 표현식(expression)이다. 파이썬은 이걸 위에서부터 차례로 평가(evaluate)한다.",
        },
        {
          type: "code",
          code: `degrees = 36.5
print(3 + 4)
print(degrees)`,
          out: "7\n36.5",
        },
        { type: "h2", text: "할당은 2단계" },
        {
          type: "list",
          style: "flow",
          items: ["`=` 오른쪽을 먼저 계산해 값(메모리 주소)을 만든다", "그 주소를 `=` 왼쪽 이름표에 적는다 (없으면 새로, 있으면 덮어쓰기)"],
        },
        {
          type: "code",
          code: `x = 3 + 4
print(x)
x = x + 1
print(x)`,
          out: "7\n8",
        },
        {
          type: "compare",
          cols: [
            { title: "객체", items: ["타입이 있는 값 자체", "방 안의 물건"] },
            { title: "변수", items: ["객체의 메모리 주소를 가짐", "방 번호표"] },
          ],
        },
        { type: "h2", text: "재할당해도 옆 변수는 그대로" },
        {
          type: "code",
          code: `number = 10
double = 2 * number
number = 5
print(double)`,
          out: "20",
        },
        {
          type: "compare",
          cols: [
            { title: "착각", tone: "bad", items: ["`double` 에 `2 * number` 라는 수식이 저장됐다", "number 가 바뀌면 다시 계산된다"] },
            { title: "실제", tone: "good", items: ["계산이 끝난 20의 주소가 저장됐다", "number 를 바꿔도 double 은 20"] },
          ],
        },
        { type: "h2", text: "변수명 규칙" },
        {
          type: "table",
          head: ["규칙", "예"],
          rows: [
            ["영문·`_`·숫자로 구성", "`my_age2` ⭕"],
            ["숫자로 시작 불가", "`2age` ❌"],
            ["대소문자 구분", "`Age` ≠ `age`"],
            ["예약어 금지", "`class` `for` `if` `True` `None` ❌"],
          ],
        },
        {
          type: "tip",
          kind: "memo",
          text: "예약어 전체: `False` `None` `True` `and` `as` `assert` `async` `await` `break` `class` `continue` `def` `del` `elif` `else` `except` `finally` `for` `from` `global` `if` `import` `in` `is` `lambda` `nonlocal` `not` `or` `pass` `raise` `return` `try` `while` `with` `yield`",
        },
        {
          type: "list",
          style: "check",
          items: ["할당은 오른쪽 계산 → 왼쪽 이름표", "저장되는 건 수식이 아니라 결과값의 주소", "재할당은 번호표만 바꾼다"],
        },
      ],
    },
    {
      id: "n-py-2-2",
      emoji: "🗺️",
      title: "자료형 지도와 산술 연산자",
      summary: "파이썬 자료형 5갈래 분류, 산술 연산자 8개와 우선순위",
      blocks: [
        { type: "key", text: "타입이 할 수 있는 연산을 정한다" },
        {type: "figure", kind: "tree", root: {icon: "🗺️", label: "파이썬 자료형"}, children: [{icon: "🔢", label: "숫자", leaves: ["`int`", "`float`"]}, {icon: "📏", label: "시퀀스", leaves: ["`str`", "`list`", "`tuple`"]}, {icon: "🧺", label: "비시퀀스", leaves: ["`dict`", "`set`"]}, {icon: "⚪", label: "기타", leaves: ["`bool`", "`None`"]}]},
        { type: "h2", text: "자료형이 하는 일" },
        {
          type: "compare",
          cols: [
            { title: "정하는 것", items: ["값의 종류", "그 값에 쓸 수 있는 연산·동작"] },
            { title: "타입이 분명하면", items: ["읽는 사람이 변수의 의도를 쉽게 앎", "잘못된 타입으로 생기는 오류를 미리 막음"] },
          ],
        },
        {
          type: "code",
          code: `print('3' + '4')
print(3 + 4)
print(type(3), type(3.0), type('3'))`,
          out: "34\n7\n<class 'int'> <class 'float'> <class 'str'>",
        },
        {
          type: "tip",
          kind: "analogy",
          text: "자료형(Data Type)은 식재료 라벨. 고기인지 채소인지 알아야 굽거나 데칠지 정하듯, 타입을 알아야 가능한 연산이 정해진다.",
        },
        { type: "h2", text: "자료형 5갈래" },
        {
          type: "table",
          head: ["갈래", "자료형"],
          rows: [
            ["Numeric Type", "`int` `float` `complex`"],
            ["Sequence Types", "`list` `tuple` `range`"],
            ["Text Sequence Type", "`str`"],
            ["Non-sequence Types", "`set` `dict`"],
            ["기타", "`Boolean` `None` `Functions`"],
          ],
        },
        {
          type: "code",
          code: `print(type([1, 2]))
print(type((1, 2)))
print(type({1, 2}))
print(type({'a': 1}))
print(type(None))`,
          out: "<class 'list'>\n<class 'tuple'>\n<class 'set'>\n<class 'dict'>\n<class 'NoneType'>",
        },
        { type: "h2", text: "산술 연산자" },
        {
          type: "table",
          head: ["기호", "뜻"],
          rows: [
            ["`-`", "음수 부호"],
            ["`+` `-`", "덧셈, 뺄셈"],
            ["`*` `/`", "곱셈, 나눗셈 (`/` 는 항상 float)"],
            ["`//`", "정수 나눗셈(몫)"],
            ["`%`", "나머지"],
            ["`**`", "지수(거듭제곱)"],
          ],
        },
        {
          type: "code",
          code: `print(7 / 2)
print(7 // 2)
print(7 % 3)
print(2 ** 10)`,
          out: "3.5\n3\n1\n1024",
        },
        { type: "h2", text: "연산자 우선순위" },
        {
          type: "list",
          style: "flow",
          items: [
            "`**` 지수 (가장 먼저)",
            "`-` 음수 부호",
            "`*` `/` `//` `%` 곱셈·나눗셈·몫·나머지",
            "`+` `-` 덧셈·뺄셈 (가장 나중)",
          ],
        },
        {
          type: "code",
          code: `print(-2 ** 2)
print((-2) ** 2)
print(6 / 2)`,
          out: "-4\n4\n3.0",
        },
        {
          type: "tip",
          kind: "warn",
          text: "`-2 ** 2` 는 `-(2 ** 2)` 로 계산돼 `-4`. 지수가 음수 부호보다 먼저다. `(-2) ** 2` 를 원하면 괄호 필수.",
        },
        {
          type: "list",
          style: "check",
          items: [
            "자료형 = 값의 종류 + 가능한 연산",
            "Numeric · Sequence · Text · Non-sequence · 기타 5갈래",
            "`**` → 음수 부호 → `* / // %` → `+ -`, 헷갈리면 괄호",
          ],
        },
      ],
    },
    {
      id: "n-py-2-3",
      emoji: "🔢",
      title: "int와 float, 부동소수점 에러",
      summary: "진수 표기, 실수의 유한 정밀도와 부동소수점 에러, Decimal 해결책",
      blocks: [
        { type: "key", text: "float 은 언제나 가장 가까운 근삿값" },
        {type: "figure", kind: "flow", nodes: [{icon: "🧮", label: "`0.1 + 0.2`"}, {icon: "💾", label: "2진수 근삿값", sub: "딱 떨어지지 않음", ink: "red"}, {icon: "😱", label: "`0.300…04`", ink: "red"}], edges: ["저장", "출력"], caption: "정확한 돈 계산은 `decimal` 로"},
        { type: "h2", text: "int: 진수 표기" },
        {
          type: "table",
          head: ["접두어", "진수"],
          rows: [
            ["`0b` (binary)", "2진수"],
            ["`0o` (octal)", "8진수"],
            ["`0x` (hexadecimal)", "16진수"],
          ],
        },
        {
          type: "code",
          code: `print(0b10)
print(0o30)
print(0x10)`,
          out: "2\n24\n16",
        },
        { type: "h2", text: "float: 유한 정밀도" },
        {
          type: "p",
          text: "메모리가 한정돼 한 숫자에 쓸 용량도 제한된다. `2 / 3` 의 `0.6666666666666666`, `5 / 3` 의 `1.6666666666666667` 은 제한된 메모리에 담을 수 있는 가장 가까운 값.",
        },
        {
          type: "code",
          code: `print(2 / 3)
print(5 / 3)`,
          out: "0.6666666666666666\n1.6666666666666667",
        },
        {
          type: "tip",
          kind: "analogy",
          text: "float 은 칸 수가 정해진 메모장. 0.666… 을 무한히 못 적으니 칸이 허락하는 만큼만 적는다.",
        },
        {
          type: "tip",
          kind: "memo",
          text: "근삿값을 표시하는 과정에서 정확히 동일한 값이 아니어서 예상치 못한 결과가 나타남. 이를 '부동소수점 에러'라고 말한다.",
        },
        { type: "h2", text: "해결책: decimal 모듈" },
        {
          type: "code",
          code: `a = 3.2 - 3.1
b = 1.2 - 1.1
print(a)
print(b)
print(a == b)  # 둘 다 0.1 인데!

from decimal import Decimal
a = Decimal('3.2') - Decimal('3.1')
b = Decimal('1.2') - Decimal('1.1')
print(a)
print(b)
print(a == b)`,
          out: "0.10000000000000009\n0.09999999999999987\nFalse\n0.1\n0.1\nTrue",
        },
        {
          type: "compare",
          cols: [
            { title: "`Decimal(3.2)`", tone: "bad", items: ["이미 근삿값이 된 float 이 들어감"] },
            { title: "`Decimal('3.2')`", tone: "good", items: ["문자열 `'3.2'` 로 넣어야 정확"] },
          ],
        },
        {
          type: "p",
          text: "대표적인 방법이 `decimal` 모듈. 이외에도 여러 해결 방법이 있다.",
        },
        {
          type: "tip",
          kind: "warn",
          text: "실수끼리 `==` 비교는 눈에 같아 보여도 `False` 가 나올 수 있다. 돈 계산처럼 정확해야 하면 `Decimal`, 대충 같은지만 보면 `abs(a - b) < 1e-9` 같은 오차 허용 비교.",
        },
        { type: "h2", text: "지수 표현 방식" },
        {
          type: "code",
          code: `number = 314e-2   # 314 * 0.01  (e 또는 E)
print(number)`,
          out: "3.14",
        },
        {
          type: "list",
          style: "check",
          items: [
            "int 는 `0b` `0o` `0x` 로 2·8·16진수 표기",
            "float 은 항상 근삿값 → 부동소수점 에러",
            "정확한 소수는 `Decimal('문자열')`, 지수 표기는 `314e-2`",
          ],
        },
      ],
    },
    {
      id: "n-py-2-4",
      emoji: "🧵",
      title: "시퀀스와 문자열(str)",
      summary: "시퀀스 5가지 특징, 따옴표 규칙, 이스케이프 시퀀스, f-string",
      blocks: [
        { type: "key", text: "str 은 글자가 순서대로 줄 선 불변 시퀀스" },
        {type: "figure", kind: "flow", nodes: [{icon: "🅷", label: "h", sub: "[0]"}, {icon: "🅸", label: "i", sub: "[1]"}, {icon: "❗", label: "!", sub: "[2]"}], caption: "str = 글자가 순서대로 줄 선 시퀀스 (못 고침)"},
        { type: "h2", text: "Sequence Types 의 5가지 특징" },
        {
          type: "table",
          head: ["특징", "뜻"],
          rows: [
            ["순서(Sequence)", "넣은 순서를 기억 (정렬 X)"],
            ["인덱싱(Indexing)", "값마다 고유 번호(인덱스), 특정 위치를 고르거나 수정"],
            ["슬라이싱(Slicing)", "인덱스 범위를 잘라 부분 추출"],
            ["길이(Length)", "`len()` 으로 값의 개수"],
            ["반복(Iteration)", "반복문으로 하나씩 처리"],
          ],
        },
        {
          type: "code",
          code: `word = 'abc'
print(word[0])
print(word[0:2])
print(len(word))
for ch in word:
    print(ch)`,
          out: "a\nab\n3\na\nb\nc",
        },
        {
          type: "tip",
          kind: "analogy",
          text: "번호표 붙은 줄서기. 문자열은 글자들이 줄 선 것.",
        },
        { type: "h2", text: "str: 따옴표로 감싼다" },
        {
          type: "p",
          text: "변경 불가능한(immutable) 문자 시퀀스. 작은따옴표(`'`)나 큰따옴표(`\"`)로 감싼다. 안에 쓸 따옴표와 다른 종류로 감싸면 중첩 가능.",
        },
        {
          type: "code",
          code: `print('Hello, World!')
print(type('Hello, World!'))
print('문자열 안에 "큰따옴표"를 쓰려면 작은따옴표로 묶는다.')
print("문자열 안에 '작은따옴표'를 쓰려면 큰따옴표로 묶는다.")`,
          out: "Hello, World!\n<class 'str'>\n문자열 안에 \"큰따옴표\"를 쓰려면 작은따옴표로 묶는다.\n문자열 안에 '작은따옴표'를 쓰려면 큰따옴표로 묶는다.",
        },
        {
          type: "tip",
          kind: "memo",
          text: "작은따옴표랑 큰따옴표를 섞어서 사용 불가!! (`'hello\"` 처럼 열고 닫는 따옴표가 다르면 에러)",
        },
        {
          type: "tip",
          kind: "warn",
          text: "`'It's'` 는 `'It'` 에서 문자열이 끝나 SyntaxError. 바깥을 큰따옴표로 바꾸거나 `\\'` 로 탈출.",
        },
        { type: "h2", text: "Escape sequence: 문법을 잠시 탈출" },
        {
          type: "p",
          text: "역슬래시(`\\`) + 특정 문자 = 특수 기능. 문자열 안에서 엔터를 칠 수 없어 `\\n` 이 따로 있다.",
        },
        {
          type: "table",
          head: ["예약 문자", "의미"],
          rows: [
            ["`\\n`", "줄 바꿈"],
            ["`\\t`", "탭"],
            ["`\\\\`", "백슬래시"],
            ["`\\'`", "작은따옴표"],
            ["`\\\"`", "큰따옴표"],
          ],
        },
        {
          type: "code",
          code: `print('철수야 \\'안녕\\'')
print('이 다음은 엔터\\n입니다.')`,
          out: "철수야 '안녕'\n이 다음은 엔터\n입니다.",
        },
        { type: "h2", text: "f-string: 값 끼워 넣기" },
        {
          type: "p",
          text: "String Interpolation. 문자열 앞에 `f` 또는 `F`, 변수나 표현식은 `{표현식}` 안에.",
        },
        {
          type: "code",
          code: `bugs = 'roaches'
counts = 13
print(f'Debugging {bugs} {counts}')`,
          out: "Debugging roaches 13",
        },
        {
          type: "list",
          style: "check",
          items: [
            "시퀀스 = 순서·인덱싱·슬라이싱·길이·반복",
            "str 은 불변, 따옴표는 같은 종류로 열고 닫기",
            "특수문자는 `\\n` `\\t` `\\'`, 끼워 넣기는 `f'{변수}'`",
          ],
        },
      ],
    },
    {
      id: "n-py-2-5",
      emoji: "✂️",
      title: "인덱싱과 슬라이싱",
      summary: "양수·음수 인덱스, [start:end:step] 규칙, 뒤집기 [::-1]",
      blocks: [
        { type: "key", text: "끝 번호는 안 들어간다, step 이 음수면 거꾸로" },
        {type: "figure", kind: "stack", layers: [{icon: "🔤", label: "p y t h o n", sub: "글자"}, {icon: "➡️", label: "0 1 2 3 4 5", sub: "앞에서 셀 때", ink: "blue"}, {icon: "⬅️", label: "-6 … -2 -1", sub: "뒤에서 셀 때", ink: "red"}], caption: "`s[1:4]` → 1, 2, 3번만 (끝 번호 4는 빠짐)"},
        { type: "h2", text: "인덱스: 값의 위치 번호" },
        {
          type: "table",
          head: ["문자", "h", "e", "l", "l", "o"],
          rows: [
            ["앞에서", "0", "1", "2", "3", "4"],
            ["뒤에서", "-5", "-4", "-3", "-2", "-1"],
          ],
        },
        {
          type: "code",
          code: `my_str = 'hello'
print(my_str[1])    # 인덱싱
print(my_str[-1])   # 뒤에서 첫 번째
print(len(my_str))  # 길이`,
          out: "e\no\n5",
        },
        { type: "h2", text: "슬라이싱: [start:end:step]" },
        {
          type: "p",
          text: "범위의 값으로 '새로운 시퀀스'를 만든다. 끝 인덱스는 포함되지 않는다.",
        },
        {
          type: "tip",
          kind: "analogy",
          text: "인덱스는 아파트 호수. 슬라이싱은 '2호부터 4호 앞까지'. 끝 번호 집은 안 들어간다.",
        },
        {
          type: "code",
          code: `my_str = 'hello'
print(my_str[2:4])    # 인덱스 2, 3
print(my_str[:3])     # start 생략 = 0부터
print(my_str[3:])     # end 생략 = 끝까지
print(my_str[0:5:2])  # 두 칸씩 건너뜀
print(my_str[::-1])   # 전체를 거꾸로
print(my_str[4:1:-1]) # 4부터 2까지 거꾸로`,
          out: "ll\nhel\nlo\nhlo\nolleh\noll",
        },
        {
          type: "compare",
          cols: [
            { title: "step 양수 (생략 = 1)", items: ["start 부터 end - 1 까지 증가", "`start < end` 여야 결과가 있다"] },
            { title: "step 음수", items: ["start 부터 end + 1 까지 감소", "`start > end` 여야 결과가 있다"] },
          ],
        },
        {
          type: "tip",
          kind: "warn",
          text: "`my_str[1:4:-1]` 은 에러가 아니라 빈 문자열 `''`. 갈 곳이 없으면 조용히 빈 결과를 준다. 뒤집을 땐 start > end 확인.",
        },
        { type: "h2", text: "문자열은 중간을 못 바꾼다" },
        {
          type: "code",
          code: `my_str = 'hello'
my_str[1] = 'z'`,
          out: "TypeError: 'str' object does not support item assignment",
        },
        {
          type: "tip",
          kind: "memo",
          text: "중간의 요소를 바꿀 수 없다. 재할당을 해야 할 것.",
        },
        {
          type: "code",
          code: `my_str = 'hello'
my_str = 'hzllo'  # 새 문자열을 통째로 재할당
print(my_str)`,
          out: "hzllo",
        },
        {
          type: "list",
          style: "check",
          items: [
            "인덱스는 0부터, 뒤에서는 -1부터",
            "`[start:end:step]`: end 미포함, `[::-1]` 은 전체를 거꾸로",
            "str 은 불변, 한 글자만 못 바꾸고 통째로 재할당",
          ],
        },
      ],
    },
    {
      id: "n-py-2-6",
      emoji: "📐",
      title: "참고: 스타일 가이드·주석·공부 자세",
      summary: "PEP 8 핵심 규칙, 주석의 목적, Python Tutor, 구글링·AI 활용 자세",
      blocks: [
        { type: "key", text: "같은 규칙으로 써야 서로 읽힌다" },
        {type: "figure", kind: "tree", root: {icon: "📘", label: "읽히는 코드"}, children: [{icon: "📏", label: "PEP 8", sub: "같은 규칙"}, {icon: "💬", label: "주석", sub: "왜를 적기"}, {icon: "🧰", label: "도구", sub: "포매터·린터"}]},
        { type: "h2", text: "Style Guide (PEP 8)" },
        {
          type: "p",
          text: "코드의 일관성과 가독성을 높이는 규칙·권장사항 모음. 전문: peps.python.org/pep-0008",
        },
        {
          type: "table",
          head: ["항목", "규칙"],
          rows: [
            ["변수명", "무엇을 위한 변수인지 직관적으로. `a = 5` 는 ??? 뭘 뜻하는지 모름"],
            ["들여쓰기", "공백(space) 4칸"],
            ["한 줄 길이", "79자 제한, 길어지면 줄 바꿈"],
            ["함수·변수·속성 이름", "소문자 + 밑줄(`_`), 스네이크 케이스 `user_name`"],
            ["블록 사이", "함수 정의·클래스 정의 등 사이에 빈 줄"],
          ],
        },
        {
          type: "code",
          code: `def greet(user_name):
    message = f'hi {user_name}'
    return message


print(greet('ssafy'))`,
          out: "hi ssafy",
        },
        { type: "tip", kind: "memo", text: "변수명 짓는 것이 중요!" },
        {
          type: "tip",
          kind: "analogy",
          text: "스타일 가이드는 교통 규칙. 안 지켜도 차는 굴러가지만 모두 같은 규칙으로 달려야 사고가 안 난다.",
        },
        { type: "h2", text: "주석(Comment)" },
        {
          type: "compare",
          cols: [
            { title: "용도", items: ["특정 부분 설명", "임시로 코드 끄기(비활성화)", "다른 개발자·미래의 나에게 의도 전달"] },
            { title: "특징", items: ["인터프리터가 실행하지 않음", "단축키 `Ctrl + /`"] },
          ],
        },
        {
          type: "code",
          code: `# 이것은 한 줄 주석
age = 10

"""
여러 줄 주석은
따옴표 세 개로 감싼다
"""
print(age)`,
          out: "10",
        },
        { type: "h2", text: "도구와 자세" },
        {
          type: "compare",
          cols: [
            {
              title: "🔍 Python Tutor",
              items: [
                "pythontutor.com",
                "한 줄씩 실행하며 변수와 객체 연결을 그림으로 보여 줌",
                "옵션 'render all objects on the heap' 을 고르면 메모리 화살표 그림 그대로",
              ],
            },
            {
              title: "🌐 구글링",
              items: [
                "영어로, 완벽한 문장 아니어도 OK",
                "문제의 키워드를 명확히",
                "공식 문서 → Stack Overflow·GitHub Issues 같은 신뢰할 출처",
              ],
            },
            {
              title: "🤖 AI",
              items: [
                "처음엔 AI 답의 좋고 나쁨을 판단하기 어렵다",
                "기본 개념을 익히고 스스로 풀어 보기",
                "보조 수단이지 대체재가 아니다",
              ],
            },
          ],
        },
        {
          type: "tip",
          kind: "warn",
          text: "개발자의 가치는 논리적 사고력과 문제해결 능력. 하루아침에 안 생긴다. 실수와 버그로 고민하는 시간이 성장이고, AI 로 그 시간을 건너뛰면 남는 게 없다.",
        },
        {
          type: "list",
          style: "check",
          items: [
            "PEP 8: 의미 있는 이름, 공백 4칸, 79자, 스네이크 케이스",
            "주석은 실행 안 됨, 의도 설명과 임시 비활성화용",
            "구글링은 영어 키워드 + 공식 문서, AI 는 보조 수단",
          ],
        },
      ],
    },
  ],
};
