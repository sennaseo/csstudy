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
        {
          type: "tip",
          kind: "analogy",
          text: "변수는 값이 든 상자가 아니라 '방 번호표'다. `degrees = 36.5` 는 36.5가 들어 있는 방의 번호를 degrees 라는 이름표에 적어 두는 것. 이름표를 다른 방 번호로 바꿔 적어도(재할당) 원래 방의 물건은 그대로다.",
        },
        { type: "h2", text: "표현식과 평가" },
        {
          type: "p",
          text: "표현식(expression)은 '값으로 평가될 수 있는 조각'이다. `3 + 4` 도, `36.5` 도, `degrees` 도 표현식. 파이썬은 표현식을 위에서부터 순서대로 평가(evaluate)해 프로그램의 동작을 결정한다.",
        },
        { type: "h2", text: "할당문은 2단계로 움직인다" },
        {
          type: "code",
          code: `degrees = 36.5   # "변수 degrees 에 값 36.5 를 할당했다"
degrees = 'abc'  # 재할당 — 이제 degrees 는 'abc' 를 가리킨다`,
        },
        {
          type: "list",
          ordered: true,
          items: [
            "`=` 오른쪽 표현식을 먼저 평가해서 값(=메모리 주소)을 만든다",
            "그 주소를 `=` 왼쪽 변수에 저장한다 — 없던 변수면 새로 만들고, 있던 변수면 들어 있는 주소만 바꾼다",
          ],
        },
        {
          type: "tip",
          kind: "memo",
          text: "객체 = 타입을 갖는 메모리 주소 안의 값(값이 들어 있는 상자). 변수 = 그 객체의 메모리 주소를 가짐(들어가는 방의 번호를 갖고 있음).",
        },
        { type: "h2", text: "재할당해도 옆 변수는 안 바뀐다" },
        {
          type: "code",
          code: `number = 10
double = 2 * number
print(double)  # 결과 20

number = 5
print(double)  # 결과 20 — double 은 여전히 '20의 주소'를 들고 있다`,
        },
        {
          type: "p",
          text: "`double` 은 계산식이 아니라 계산 결과(20)의 주소를 저장했다. 그래서 `number` 를 5로 바꿔도 `double` 은 20을 가리킨 채 그대로다.",
        },
        { type: "h2", text: "변수명 규칙" },
        {
          type: "list",
          items: [
            "영문 알파벳·언더스코어(`_`)·숫자로 구성, 숫자로 시작 불가",
            "대소문자 구분 (`Age` 와 `age` 는 다른 변수)",
            "예약어는 변수명으로 못 쓴다: `False` `None` `True` `and` `as` `assert` `async` `await` `break` `class` `continue` `def` `del` `elif` `else` `except` `finally` `for` `from` `global` `if` `import` `in` `is` `lambda` `nonlocal` `not` `or` `pass` `raise` `return` `try` `while` `with` `yield`",
          ],
        },
        {
          type: "tip",
          kind: "warn",
          text: "`double = 2 * number` 를 '수식을 저장했다'고 착각하기 쉽다. 저장되는 건 평가가 끝난 값(의 주소)이다. 나중에 number 를 바꿔도 double 은 자동으로 다시 계산되지 않는다.",
        },
        { type: "h2", text: "3줄 정리" },
        {
          type: "list",
          items: [
            "표현식 = 값으로 평가되는 조각, 파이썬은 이를 순서대로 평가한다",
            "할당 = 오른쪽을 먼저 평가 → 그 값의 주소를 왼쪽 이름표에 적는다",
            "재할당은 이름표의 방 번호만 바꾼다, 다른 변수는 영향 없음",
          ],
        },
      ],
    },
    {
      id: "n-py-2-2",
      emoji: "🗺️",
      title: "자료형 지도와 산술 연산자",
      summary: "파이썬 자료형 5갈래 분류, 산술 연산자 8개와 우선순위",
      blocks: [
        {
          type: "tip",
          kind: "analogy",
          text: "자료형(Data Type)은 식재료 라벨이다. '고기'인지 '채소'인지 알아야 굽거나 데칠지 정하듯, 값의 타입을 알아야 어떤 연산이 가능한지 정해진다. 문자끼리 더하고, 숫자끼리 곱하는 식.",
        },
        { type: "h2", text: "자료형이 하는 일" },
        {
          type: "p",
          text: "자료형은 '값의 종류'와 '그 값에 쓸 수 있는 연산·동작'을 결정하는 속성이다. 타입이 분명하면 읽는 사람이 변수의 의도를 쉽게 알고, 잘못된 타입으로 생기는 오류를 미리 막을 수 있다.",
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
        { type: "h2", text: "산술 연산자" },
        {
          type: "table",
          head: ["기호", "뜻"],
          rows: [
            ["`-`", "음수 부호"],
            ["`+` `-`", "덧셈, 뺄셈"],
            ["`*` `/`", "곱셈, 나눗셈"],
            ["`//`", "정수 나눗셈(몫)"],
            ["`%`", "나머지"],
            ["`**`", "지수(거듭제곱)"],
          ],
        },
        {
          type: "code",
          code: `print(7 / 2)    # 결과 3.5  (나눗셈은 항상 float)
print(7 // 2)   # 결과 3    (몫)
print(7 % 3)    # 결과 1    (나머지)
print(2 ** 10)  # 결과 1024 (거듭제곱)`,
        },
        { type: "h2", text: "연산자 우선순위 (높음 → 낮음)" },
        {
          type: "list",
          ordered: true,
          items: [
            "`**` 지수",
            "`-` 음수 부호",
            "`*` `/` `//` `%` 곱셈·나눗셈·몫·나머지",
            "`+` `-` 덧셈·뺄셈",
          ],
        },
        {
          type: "tip",
          kind: "warn",
          text: "`-2 ** 2` 는 `-4` 다. 지수가 음수 부호보다 먼저라서 `-(2 ** 2)` 로 계산된다. `(-2) ** 2` 를 원하면 괄호를 꼭 쓰자. `/` 는 `6 / 2` 도 `3.0` (float) 을 돌려준다.",
        },
        { type: "h2", text: "3줄 정리" },
        {
          type: "list",
          items: [
            "자료형 = 값의 종류 + 가능한 연산을 정하는 라벨",
            "Numeric · Sequence · Text · Non-sequence · 기타 5갈래",
            "우선순위는 `**` → 음수 부호 → `* / // %` → `+ -`, 헷갈리면 괄호",
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
        {
          type: "tip",
          kind: "analogy",
          text: "float 은 '칸 수가 정해진 메모장'이다. 2/3 = 0.666… 을 무한히 적을 수 없으니 메모장 칸이 허락하는 만큼만 적는다. 그래서 저장된 값은 언제나 '가장 가까운 근삿값'이다.",
        },
        { type: "h2", text: "int: 정수 자료형" },
        {
          type: "p",
          text: "정수를 표현한다. 10진수 말고도 접두어로 다른 진수를 쓸 수 있다 — 2진수 `0b`(binary), 8진수 `0o`(octal), 16진수 `0x`(hexadecimal).",
        },
        {
          type: "code",
          code: `print(0b10)  # 결과 2
print(0o30)  # 결과 24
print(0x10)  # 결과 16`,
        },
        { type: "h2", text: "float: 실수 자료형과 유한 정밀도" },
        {
          type: "p",
          text: "컴퓨터 메모리는 한정돼 있어 한 숫자에 쓸 수 있는 용량도 제한된다. `2 / 3` 의 결과 `0.6666666666666666` 과 `5 / 3` 의 결과 `1.6666666666666667` 은 제한된 메모리에 저장할 수 있는, 2/3 과 5/3 에 가장 가까운 값이다.",
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
print(a)       # 결과 0.10000000000000009
print(b)       # 결과 0.09999999999999987
print(a == b)  # 결과 False  ← 둘 다 0.1 인데!

from decimal import Decimal
a = Decimal('3.2') - Decimal('3.1')
b = Decimal('1.2') - Decimal('1.1')
print(a)       # 결과 0.1
print(b)       # 결과 0.1
print(a == b)  # 결과 True`,
        },
        {
          type: "p",
          text: "대표적으로 `decimal` 모듈을 써서 부동소수점 연산의 정확성을 보장한다. 이외에도 여러 해결 방법이 있다. 주의: `Decimal(3.2)` 처럼 숫자를 그대로 넣으면 이미 근삿값이 된 float 이 들어가니, 문자열 `'3.2'` 로 넣는다.",
        },
        { type: "h2", text: "지수 표현 방식" },
        {
          type: "code",
          code: `number = 314e-2   # 314 * 0.01  (e 또는 E 를 쓴다)
print(number)     # 결과 3.14`,
        },
        {
          type: "tip",
          kind: "warn",
          text: "실수끼리 `==` 로 비교하면 눈에는 같아 보여도 `False` 가 나올 수 있다. 돈 계산처럼 정확도가 중요하면 `Decimal`, 대충 같은지만 보면 되면 `abs(a - b) < 1e-9` 같은 오차 허용 비교를 쓴다.",
        },
        { type: "h2", text: "3줄 정리" },
        {
          type: "list",
          items: [
            "int 는 `0b` `0o` `0x` 접두어로 2·8·16진수 표기 가능",
            "float 은 메모리 한계 때문에 항상 근삿값 → 부동소수점 에러",
            "정확한 소수 계산은 `Decimal('문자열')`, 지수 표기는 `314e-2`",
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
        {
          type: "tip",
          kind: "analogy",
          text: "시퀀스는 '번호표 붙은 줄서기'다. 들어온 순서대로 서 있고(순서), 각자 번호가 있고(인덱스), 몇 번부터 몇 번까지 불러낼 수 있고(슬라이싱), 몇 명인지 셀 수 있고(길이), 한 명씩 차례로 부를 수 있다(반복). 문자열은 글자들이 줄 선 것.",
        },
        { type: "h2", text: "Sequence Types 의 5가지 특징" },
        {
          type: "p",
          text: "여러 값을 '순서대로 나열해' 저장하는 자료형이다. 정렬(sort)이 아니라 넣은 순서가 유지된다는 뜻.",
        },
        {
          type: "list",
          ordered: true,
          items: [
            "순서(Sequence) — 값들이 저장된 순서를 기억한다 (정렬 X)",
            "인덱싱(Indexing) — 각 값에 고유한 번호(인덱스)가 있어 특정 위치를 고르거나 수정",
            "슬라이싱(Slicing) — 인덱스 범위를 잘라 부분을 추출",
            "길이(Length) — `len()` 으로 값의 개수를 구함",
            "반복(Iteration) — 반복문으로 값들을 하나씩 처리",
          ],
        },
        { type: "h2", text: "str: 변경 불가능한 문자 시퀀스" },
        {
          type: "p",
          text: "문자들의 순서가 있는, 변경 불가능한(immutable) 시퀀스 자료형. 작은따옴표(`'`) 또는 큰따옴표(`\"`)로 감싸 표현한다.",
        },
        {
          type: "code",
          code: `print('Hello, World!')        # 결과 Hello, World!
print(type('Hello, World!'))  # 결과 <class 'str'>

# 중첩 따옴표: 안에 쓸 따옴표와 다른 종류로 감싼다
print('문자열 안에 "큰따옴표"를 쓰려면 작은따옴표로 묶는다.')
print("문자열 안에 '작은따옴표'를 쓰려면 큰따옴표로 묶는다.")`,
        },
        {
          type: "tip",
          kind: "memo",
          text: "작은따옴표랑 큰따옴표를 섞어서 사용 불가!! (`'hello\"` 처럼 열고 닫는 따옴표가 다르면 에러)",
        },
        { type: "h2", text: "Escape sequence: 문법을 잠시 탈출" },
        {
          type: "p",
          text: "역슬래시(`\\`) 뒤에 특정 문자가 와서 특수한 기능을 하는 조합. '파이썬의 일반 문법 규칙을 잠시 탈출한다'는 뜻이다. 문자열 안에서 엔터를 치면 실행되지 않기 때문에 엔터용 문자 `\\n` 이 따로 있다.",
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
          code: `print('철수야 \\'안녕\\'')     # 결과 철수야 '안녕'
print('이 다음은 엔터\\n입니다.')  # 결과 이 다음은 엔터
                               #      입니다.

# f-string: 문자열 앞에 f, 표현식은 {} 안에
bugs = 'roaches'
counts = 13
print(f'Debugging {bugs} {counts}')  # 결과 Debugging roaches 13`,
        },
        {
          type: "p",
          text: "f-string(String Interpolation)은 문자열 안에 변수나 표현식을 끼워 넣는 방법이다. 문자열 앞에 `f` 또는 `F` 를 붙이고 `{표현식}` 으로 쓴다.",
        },
        {
          type: "tip",
          kind: "warn",
          text: "`'It's'` 처럼 작은따옴표 안에 작은따옴표를 그냥 쓰면 문자열이 `'It'` 에서 끝나 버려 SyntaxError. 바깥을 큰따옴표로 바꾸거나 `\\'` 로 탈출시키자.",
        },
        { type: "h2", text: "3줄 정리" },
        {
          type: "list",
          items: [
            "시퀀스 = 순서·인덱싱·슬라이싱·길이·반복 5종 세트",
            "str 은 변경 불가능, 따옴표는 같은 종류로 열고 닫는다",
            "특수문자는 `\\n` `\\t` `\\'` 로 탈출, 값 끼워 넣기는 `f'{변수}'`",
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
        {
          type: "tip",
          kind: "analogy",
          text: "인덱스는 아파트 호수다. 앞에서 세면 0호부터, 뒤에서 세면 -1호부터. 슬라이싱은 '2호부터 4호 앞까지' 하고 범위를 부르는 것 — 끝 번호 집은 안 들어간다.",
        },
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
print(my_str[1])    # 결과 e   (인덱싱)
print(my_str[-1])   # 결과 o   (뒤에서 첫 번째)
print(len(my_str))  # 결과 5   (길이)`,
        },
        { type: "h2", text: "슬라이싱: [start:end:step]" },
        {
          type: "p",
          text: "시작 인덱스와 끝 인덱스를 지정해 그 범위의 값으로 '새로운 시퀀스'를 만든다. 끝 인덱스는 포함되지 않는다.",
        },
        {
          type: "code",
          code: `my_str = 'hello'
print(my_str[2:4])    # 결과 ll    (인덱스 2, 3)
print(my_str[:3])     # 결과 hel   (start 생략 = 0부터)
print(my_str[3:])     # 결과 lo    (end 생략 = 끝까지)
print(my_str[0:5:2])  # 결과 hlo   (step 2 = 두 칸씩 건너뜀)
print(my_str[::-1])   # 결과 olleh (step -1 = 거꾸로)
print(my_str[4:1:-1]) # 결과 oll   (4부터 2까지 거꾸로)`,
        },
        {
          type: "list",
          items: [
            "step 이 양수(생략하면 1): start 부터 end - 1 까지 step 만큼 증가 → `start < end` 여야 결과가 있다",
            "step 이 음수: start 부터 end + 1 까지 step 만큼 감소 → `start > end` 여야 결과가 있다",
            "start 생략 = 처음부터, end 생략 = 끝까지. `[::-1]` 은 '전체를 거꾸로'",
          ],
        },
        { type: "h2", text: "문자열은 중간을 못 바꾼다" },
        {
          type: "tip",
          kind: "memo",
          text: "중간의 요소를 바꿀 수 없다. 재할당을 해야 할 것.",
        },
        {
          type: "code",
          code: `my_str = 'hello'
my_str[1] = 'z'  # 에러: TypeError: 'str' object does not support item assignment

my_str = 'hzllo'  # 바꾸고 싶으면 새 문자열을 통째로 재할당`,
        },
        {
          type: "tip",
          kind: "warn",
          text: "`my_str[1:4:-1]` 은 에러가 아니라 빈 문자열 `''` 이다. step 이 음수인데 start 가 end 보다 작으면 갈 곳이 없어서 조용히 빈 결과를 돌려주니, 뒤집을 땐 start > end 인지 확인하자.",
        },
        { type: "h2", text: "3줄 정리" },
        {
          type: "list",
          items: [
            "인덱스는 0부터, 뒤에서는 -1부터",
            "`[start:end:step]` — end 는 미포함, step 음수면 거꾸로",
            "str 은 불변: 한 글자만 바꿀 수 없고 통째로 재할당",
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
        {
          type: "tip",
          kind: "analogy",
          text: "스타일 가이드는 '교통 규칙'이다. 안 지켜도 차는 굴러가지만, 모두가 같은 규칙으로 달려야 서로 읽기 쉽고 사고가 안 난다. 파이썬의 교통 규칙이 PEP 8.",
        },
        { type: "h2", text: "Style Guide (PEP 8)" },
        {
          type: "p",
          text: "코드의 일관성과 가독성을 높이기 위한 규칙·권장사항 모음. 전문: peps.python.org/pep-0008",
        },
        {
          type: "list",
          items: [
            "변수명은 '무엇을 위한 변수인지' 직관적으로 — `a = 5` 는 ??? 뭘 뜻하는지 알 수 없다",
            "들여쓰기는 공백(space) 4칸",
            "한 줄은 79자 제한, 길어지면 줄 바꿈",
            "함수·변수·속성 이름은 소문자와 밑줄(`_`) — 스네이크 케이스 (`user_name`)",
            "함수 정의나 클래스 정의 등 블록 사이에는 빈 줄 추가",
          ],
        },
        { type: "tip", kind: "memo", text: "변수명 짓는 것이 중요!" },
        { type: "h2", text: "주석(Comment)" },
        {
          type: "p",
          text: "코드 안에 쓰는 설명·메모로, 인터프리터가 실행하지 않는다. 특정 부분을 설명하거나 임시로 코드를 끄거나(비활성화), 다른 개발자나 미래의 나에게 의도를 알려 주는 용도. 단축키는 `Ctrl + /`.",
        },
        {
          type: "code",
          code: `# 이것은 한 줄 주석
age = 10

"""
여러 줄 주석은
따옴표 세 개로 감싼다
"""
print(age)  # 결과 10`,
        },
        { type: "h2", text: "도구와 자세" },
        {
          type: "list",
          items: [
            "Python Tutor(pythontutor.com) — 코드가 한 줄씩 실행될 때 변수와 객체가 어떻게 연결되는지 그림으로 보여 주는 시각화 도우미. 옵션에서 'render all objects on the heap' 을 고르면 앞서 본 메모리 화살표 그림 그대로 보인다",
            "구글링 — 영어로, 완벽한 문장이 아니어도 좋으니 문제의 키워드를 명확히. 공식 문서 → Stack Overflow·GitHub Issues 같은 신뢰할 수 있는 출처 우선",
            "AI — 처음 배울 땐 AI 답이 좋은지 나쁜지 판단하기 어렵다. 기본 개념을 익히고 스스로 풀어 보는 경험을 쌓자. AI 는 보조 수단이지 대체재가 아니다",
          ],
        },
        {
          type: "tip",
          kind: "warn",
          text: "개발자의 가치는 논리적 사고력과 문제해결 능력인데, 이건 하루아침에 안 생긴다. 실수와 버그를 만나 고민하는 시간에서 진짜 성장이 온다 — AI 로 그 시간을 통째로 건너뛰면 남는 게 없다.",
        },
        { type: "h2", text: "3줄 정리" },
        {
          type: "list",
          items: [
            "PEP 8: 의미 있는 이름, 공백 4칸, 79자, 스네이크 케이스",
            "주석은 실행 안 됨 — 의도 설명과 임시 비활성화에 쓴다",
            "구글링은 영어 키워드 + 공식 문서, AI 는 보조 수단",
          ],
        },
      ],
    },
  ],
};
