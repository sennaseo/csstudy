// 파이썬 단원 3 — 기초문법 2 (노션 SSAFY 파이썬 강의 정리본). 작성 규칙은 ../python.ts 상단 주석.
import type { NoteUnit } from "../types";

export const PY3: NoteUnit = {
  id: "py-3",
  title: "기초문법 2",
  notes: [
    {
      id: "n-py-3-1",
      emoji: "📋",
      title: "list · tuple · range",
      summary: "변경 가능한 list, 변경 불가능한 tuple, 정수 시퀀스를 만드는 range",
      blocks: [
        { type: "key", text: "list는 고칠 수 있고, tuple은 못 고치고, range는 숫자를 뽑아 준다" },
        {type: "figure", kind: "tree", root: {icon: "📏", label: "시퀀스 3형제"}, children: [{icon: "📋", label: "`list`", sub: "고칠 수 있음", ink: "green"}, {icon: "🔒", label: "`tuple`", sub: "못 고침", ink: "red"}, {icon: "🔢", label: "`range`", sub: "숫자 뽑기", ink: "blue"}]},
        {
          type: "compare",
          cols: [
            { title: "📋 list `[]`", items: ["변경 가능(mutable)", "포스트잇 메모판: 붙이고 떼고 바꾸기"] },
            { title: "🔒 tuple `()`", items: ["변경 불가능(immutable)", "코팅된 메모: 한 번 만들면 못 고침"] },
            { title: "🎫 range", items: ["연속 정수 시퀀스를 생성, 변경 불가능", "번호표 기계: 미리 적지 않고 차례로 뽑음"] },
          ],
        },
        { type: "h2", text: "list: 변경 가능한 시퀀스" },
        {
          type: "list",
          items: [
            "여러 값을 순서대로 저장, 대괄호 `[]`",
            "0개 이상의 객체, 어떤 자료형이든 섞어 담기",
            "담을 수 있는 개수에 한계 없음",
            "중첩 리스트는 `[바깥 인덱스][안쪽 인덱스]` 로 파고든다",
          ],
        },
        {
          type: "code",
          code: `my_list_1 = []
my_list_2 = [1, 'a', 3, 'b', 5]
my_list = [1, 2, 3, ['python', 'hello', 100]]  # 리스트 안에 리스트

print(len(my_list))          # 안쪽 리스트는 통째로 1개
print(my_list[3][1])         # 안쪽 리스트의 1번
print(my_list[3][1][-1])     # 그 문자열의 마지막 글자`,
          out: "4\nhello\no",
        },
        { type: "h2", text: "tuple: 변경 불가능한 시퀀스" },
        {
          type: "p",
          text: "list 와 같지만 불변, 소괄호 `()`. 값을 안전하게 전달·그룹화·다중 할당할 때 쓴다. 직접 쓰기보다 파이썬 내부 동작에서 주로 쓰인다.",
        },
        {
          type: "code",
          code: `my_tuple_1 = ()
my_tuple_2 = (1,)             # 요소 1개짜리 튜플은 쉼표 필수
my_tuple_3 = (1, 'a', 3, 'b', 5)

x, y = (10, 20)               # 다중 할당
print(x, y)
x, y = 10, 20                 # 쉼표가 튜플을 만드니 괄호 생략 가능`,
          out: "10 20",
        },
        { type: "tip", kind: "memo", text: "`(1,)` 인 이유는 `(1)` 하게 되면 int 가 되어버림." },
        { type: "h2", text: "range: 연속된 정수 시퀀스 생성" },
        {
          type: "tip",
          kind: "memo",
          text: "연속된 정수 시퀀스를 '생성'하는 변경 불가능한 자료형. 함수 모양이다 — `range(시작 값, 끝 값, 증가 값)`.",
        },
        {
          type: "table",
          head: ["쓰는 법", "결과"],
          rows: [
            ["`range(n)`", "0 ~ n-1 (`range(10)` 은 0 ~ 9)"],
            ["`range(n, m)`", "n ~ m-1"],
            ["증가 값 생략", "1씩 증가"],
            ["증가 값 0", "에러(ValueError)"],
            ["증가 값 양수", "증가, 시작 < 끝이어야 함"],
            ["증가 값 음수", "감소, 시작 > 끝이어야 함"],
          ],
        },
        {
          type: "code",
          code: `print(range(5))
print(list(range(1, 10)))
print(list(range(10, 0, -3)))`,
          out: "range(0, 5)\n[1, 2, 3, 4, 5, 6, 7, 8, 9]\n[10, 7, 4, 1]",
        },
        {
          type: "tip",
          kind: "warn",
          text: "`range(5, 1)` 은 에러가 아니라 빈 시퀀스. 끝 값은 포함되지 않는다(`range(5)` 에 5 없음).",
        },
        {
          type: "list",
          style: "check",
          items: [
            "list `[]` 는 변경 가능, 섞어 담고 중첩 가능",
            "tuple `()` 는 변경 불가능, 요소 하나면 `(1,)`",
            "range 는 끝 값 미포함, 증가 방향과 시작·끝 대소를 맞춘다",
          ],
        },
      ],
    },
    {
      id: "n-py-3-2",
      emoji: "🗂️",
      title: "dict · set · None · Boolean",
      summary: "key-value 쌍 dict, 중복 없는 set, 값 없음 None, 참거짓 Boolean + 컬렉션 표",
      blocks: [
        { type: "key", text: "dict는 이름으로 찾는 사물함, set은 중복 없는 출석부" },
        {type: "figure", kind: "tree", root: {icon: "🧺", label: "비시퀀스"}, children: [{icon: "🗄️", label: "`dict`", sub: "이름표로 찾는 사물함", ink: "blue"}, {icon: "📝", label: "`set`", sub: "중복 없는 출석부", ink: "green"}]},
        { type: "h2", text: "dict: key-value 쌍, 순서·중복 없음, 변경 가능" },
        {
          type: "compare",
          cols: [
            { title: "🔑 key", items: ["변경 불가능한 자료형만", "`str` `int` `float` `tuple` `range` …"] },
            { title: "📦 value", items: ["모든 자료형 가능", "key 로 접근"] },
          ],
        },
        {
          type: "list",
          items: ["중괄호 `{}`, `key: value` 쌍으로 저장", "없는 key 에 대입 → 추가", "있는 key 에 대입 → 변경"],
        },
        {
          type: "code",
          code: `my_dict = {'apple': 12, 'list': [1, 2, 3]}

print(my_dict['apple'])
print(my_dict['list'])

my_dict['banana'] = 50   # 추가
my_dict['apple'] = 100   # 변경
print(my_dict)`,
          out: "12\n[1, 2, 3]\n{'apple': 100, 'list': [1, 2, 3], 'banana': 50}",
        },
        { type: "h2", text: "set: 집합, 순서·중복 없음, 변경 가능" },
        {
          type: "code",
          code: `my_set_1 = set()          # 빈 set ({} 는 빈 dict!)
my_set_3 = {1, 1, 1}
print(my_set_3)           # 중복이 사라진다

a = {1, 2, 3}
b = {3, 6, 9}
print(a | b)  # 합집합
print(a - b)  # 차집합
print(a & b)  # 교집합`,
          out: "{1}\n{1, 2, 3, 6, 9}\n{1, 2}\n{3}",
        },
        { type: "tip", kind: "memo", text: "set 는 중복 없애기/집합 연산 문제에서 자주 나옴." },
        { type: "h2", text: "None 과 Boolean" },
        {
          type: "compare",
          cols: [
            { title: "∅ `None`", items: ["'값이 없음'을 표현", "`variable = None` 출력하면 `None`"] },
            { title: "⭕ `Boolean`", items: ["`True` `False` 두 값뿐", "비교·논리 연산의 결과", "조건문·반복문과 함께"] },
          ],
        },
        {
          type: "code",
          code: `variable = None
print(variable)
print(3 > 1)
print('3' != 3)  # 문자 '3' 과 숫자 3 은 다르다`,
          out: "None\nTrue\nTrue",
        },
        { type: "h2", text: "컬렉션 한눈에 보기" },
        {
          type: "table",
          head: ["컬렉션", "변경 가능", "순서 있음", "분류"],
          rows: [
            ["`str`", "X", "O", "시퀀스"],
            ["`list`", "O", "O", "시퀀스"],
            ["`tuple`", "X", "O", "시퀀스"],
            ["`dict`", "O", "X", "비시퀀스"],
            ["`set`", "O", "X", "비시퀀스"],
          ],
        },
        {
          type: "code",
          code: `my_str = 'abc'
my_dict = {'b': 1, 'a': 2}
print(my_str[0])   # 시퀀스는 인덱스로 꺼낸다
print(my_dict)     # 넣은 순서대로 출력
print(my_dict[0])  # 0 을 key 로 찾는다`,
          out: "a\n{'b': 1, 'a': 2}\nKeyError: 0",
        },
        {
          type: "p",
          text: "컬렉션(Collection)은 여러 항목을 담는 자료형의 총칭. dict 의 '순서 X'는 인덱스로 못 꺼낸다는 뜻이고, 파이썬 3.7부터는 넣은 순서대로 출력된다(삽입 순서 보존).",
        },
        {
          type: "tip",
          kind: "warn",
          text: "`my_set = {}` 는 set 이 아니라 빈 dict. dict 의 key 에 list 를 넣으면 TypeError.",
        },
        {
          type: "list",
          style: "check",
          items: [
            "dict 는 `{key: value}`, key 는 불변 타입만, 대입으로 추가·변경",
            "set 은 중복 제거 + `|` `-` `&`, 빈 set 은 `set()`",
            "변경 가능: list dict set / 순서 있음: str list tuple",
          ],
        },
      ],
    },
    {
      id: "n-py-3-3",
      emoji: "🔄",
      title: "형변환 (Type Conversion)",
      summary: "파이썬이 알아서 하는 암시적 형변환, 내가 지정하는 명시적 형변환",
      blocks: [
        { type: "key", text: "섞어 계산하면 자동 변환, 나머지는 직접 int()·str()" },
        {type: "figure", kind: "tree", root: {icon: "🔄", label: "형변환"}, children: [{icon: "🤖", label: "암시적", sub: "파이썬이 자동", ink: "blue", leaves: ["`3 + 5.0` → `8.0`"]}, {icon: "✋", label: "명시적", sub: "내가 직접", ink: "green", leaves: ["`int('3')` → `3`"]}]},
        {
          type: "compare",
          cols: [
            { title: "🤖 암시적", items: ["파이썬이 자동으로", "Boolean·Numeric 사이에서만", "가게가 알아서 거슬러 주는 환전"] },
            { title: "✋ 명시적", items: ["프로그래머가 직접", "`int()` `float()` `str()` …", "내가 환전소에서 바꾸는 것: `int('1')`"] },
          ],
        },
        { type: "h2", text: "암시적 형변환: 파이썬이 자동으로" },
        {
          type: "code",
          code: `print(3 + 5.0)        # int → float
print(True + 3)       # True → 1
print(True + False)`,
          out: "8.0\n4\n1",
        },
        { type: "p", text: "정수 + 실수는 실수로. `True` 는 1, `False` 는 0 취급." },
        { type: "h2", text: "명시적 형변환: 프로그래머가 직접" },
        {
          type: "table",
          head: ["방향", "가능?"],
          rows: [
            ["str → int", "형식에 맞는 숫자만"],
            ["int → str", "항상 가능"],
            ["float → int", "가능, 소수점 버림"],
          ],
        },
        {
          type: "code",
          code: `print(int('1'))
print(int(3.5))      # 소수점 버림
print(float('3.5'))
print(str(1) + '등') # int 를 str 로 바꿔야 문자열과 결합`,
          out: "1\n3\n3.5\n1등",
        },
        {
          type: "code",
          code: `print(int('3.5'))`,
          out: "ValueError: invalid literal for int() with base 10: '3.5'",
        },
        {
          type: "tip",
          kind: "warn",
          text: "`int('3.5')` 는 안 되고 `int(3.5)` 는 된다. 소수 문자열은 `int(float('3.5'))` 처럼 두 번 거친다. `1 + '등'` 은 TypeError, 숫자와 문자열은 암시적으로 안 섞인다.",
        },
        { type: "h2", text: "컬렉션 간 형변환" },
        {
          type: "table",
          head: ["→", "str", "list", "tuple", "range", "set", "dict"],
          rows: [
            ["str", "-", "O", "O", "X", "O", "X"],
            ["list", "O", "-", "O", "X", "O", "X"],
            ["tuple", "O", "O", "-", "X", "O", "X"],
            ["range", "O", "O", "O", "-", "O", "X"],
            ["set", "O", "O", "O", "X", "-", "X"],
            ["dict", "O", "O (key만)", "O (key만)", "X", "O (key만)", "-"],
          ],
        },
        {
          type: "p",
          text: "행이 원래 타입, 열이 바꿀 타입. range 로는 못 바꾼다(정수 범위만 만드는 타입). dict 로는 쌍 구조가 필요해 대부분 X.",
        },
        {
          type: "code",
          code: `print(list('abc'))
print(set([1, 1, 2]))
print(list({'a': 1, 'b': 2}))  # dict 는 key 만 넘어간다`,
          out: "['a', 'b', 'c']\n{1, 2}\n['a', 'b']",
        },
        {
          type: "list",
          style: "check",
          items: [
            "암시적: int + float → float, bool 은 숫자 취급",
            "str → int 는 정수 모양 문자열만",
            "range·dict 로는 변환 X, dict 에서는 key 만",
          ],
        },
      ],
    },
    {
      id: "n-py-3-4",
      emoji: "⚖️",
      title: "복합·비교·논리 연산자",
      summary: "+= 복합 연산자, == 와 is 의 차이, and·or·not 논리 연산",
      blocks: [
        { type: "key", text: "== 는 값이 같은지, is 는 같은 객체인지" },
        {type: "figure", kind: "refs", vars: [{name: "a", to: 0}, {name: "b", to: 1}], objs: [{icon: "📋", label: "[1, 2]", sub: "객체 ①"}, {icon: "📋", label: "[1, 2]", sub: "객체 ②", ink: "blue"}], caption: "`a == b` → True (값 같음) · `a is b` → False (다른 객체)"},
        { type: "h2", text: "복합 연산자: 연산 + 할당 한 번에" },
        {
          type: "table",
          head: ["기호", "예시", "의미"],
          rows: [
            ["`+=`", "`a += b`", "`a = a + b`"],
            ["`-=`", "`a -= b`", "`a = a - b`"],
            ["`*=`", "`a *= b`", "`a = a * b`"],
            ["`/=`", "`a /= b`", "`a = a / b`"],
            ["`//=`", "`a //= b`", "`a = a // b`"],
            ["`%=`", "`a %= b`", "`a = a % b`"],
            ["`**=`", "`a **= b`", "`a = a ** b`"],
          ],
        },
        {
          type: "code",
          code: `a = 10
a += 5
print(a)
a //= 4
print(a)
a **= 2
print(a)`,
          out: "15\n3\n9",
        },
        { type: "h2", text: "비교 연산자" },
        {
          type: "table",
          head: ["기호", "뜻"],
          rows: [
            ["`<` `<=`", "미만, 이하"],
            ["`>` `>=`", "초과, 이상"],
            ["`==` `!=`", "같음, 같지 않음"],
            ["`is` `is not`", "메모리에서 같은 객체를 참조하는지"],
          ],
        },
        { type: "tip", kind: "memo", text: "`!`(느낌표)는 보통 코드에서 부정의 의미를 가지고 있음." },
        {
          type: "compare",
          cols: [
            { title: "`==` 동등성", items: ["값(데이터) 비교", "같은 디자인의 옷인가"] },
            { title: "`is` 식별성", items: ["레퍼런스(주소) 비교", "진짜 그 옷 한 벌인가", "`x is None` 처럼 쓴다"] },
          ],
        },
        {
          type: "code",
          code: `print(3 > 6)
print(2.0 == 2)     # 값이 같다
print('HI' == 'hi') # 대소문자 구분
print(1 == True)    # True 는 1 취급

# SyntaxWarning: "is" with 'int' literal. Did you mean "=="?
print(1 is True)    # 값은 같아도 다른 객체
print(2 is 2.0)`,
          out: "False\nTrue\nFalse\nTrue\nFalse\nFalse",
        },
        {
          type: "tip",
          kind: "warn",
          text: "위 `is` 두 줄은 항상 `False` 라 파이썬이 경고를 띄운다. `if a is 1:` 처럼 리터럴에 `is` 금지. 작은 정수는 우연히 같은 객체라 True 가 나오기도 해서 버그가 숨는다. 값 비교는 `==`.",
        },
        { type: "h2", text: "논리 연산자" },
        {
          type: "table",
          head: ["기호", "이름", "내용"],
          rows: [
            ["`and`", "논리곱", "둘 다 True 일 때만 True"],
            ["`or`", "논리합", "하나라도 True 면 True"],
            ["`not`", "논리부정", "하나의 피연산자를 뒤집음"],
          ],
        },
        {
          type: "code",
          code: `print(True and False)
print(True or False)
print(not True)
print(not 0)           # 0 은 거짓 취급

num = 15
print((num > 10) and (num % 2 == 0))
name, age = 'Alice', 25
print((name == 'Alice') or (age == 30))`,
          out: "False\nTrue\nFalse\nTrue\nFalse\nTrue",
        },
        {
          type: "list",
          style: "check",
          items: [
            "`a += b` 는 `a = a + b`, 7개 산술 연산자 모두 가능",
            "`==` 는 값, `is` 는 같은 객체인지",
            "`and` 둘 다, `or` 하나라도, `not` 뒤집기",
          ],
        },
      ],
    },
    {
      id: "n-py-3-5",
      emoji: "⚡",
      title: "단축평가·멤버십·시퀀스 연산자",
      summary: "and/or 가 값을 돌려주는 단축평가, in, + 와 * 의 두 얼굴, 우선순위",
      blocks: [
        { type: "key", text: "and·or 는 True/False 가 아니라 마지막으로 본 값을 돌려준다" },
        {type: "figure", kind: "flow", nodes: [{icon: "🔍", label: "`0 and 5`"}, {icon: "🛑", label: "0 이 거짓", sub: "더 볼 필요 없음", ink: "red"}, {icon: "↩️", label: "`0` 반환", ink: "green"}], edges: ["왼쪽부터", "멈춤"]},
        { type: "h2", text: "단축평가 (Short-circuit evaluation)" },
        {
          type: "p",
          text: "두 번째 피연산자를 보지 않고 결과를 정하는 동작. 결과는 결정에 쓰인 피연산자 값 그대로.",
        },
        {
          type: "compare",
          cols: [
            { title: "`and`", items: ["첫 번째가 False → 첫 번째 값 반환, 두 번째 무시", "첫 번째가 True → 두 번째가 결과"] },
            { title: "`or`", items: ["첫 번째가 True → 첫 번째 값 반환, 두 번째 무시", "첫 번째가 False → 두 번째가 결과"] },
          ],
        },
        {
          type: "code",
          code: `print(3 and 5)  # 3 이 참 → 두 번째 값
print(3 and 0)
print(0 and 3)  # 0 이 거짓 → 바로 0, 3 은 안 봄
print(5 or 3)   # 5 가 참 → 바로 5
print(0 or 3)
print(0 or 0)

vowels = 'aeiou'
print(('a' and 'b') in vowels)  # 'a' and 'b' → 'b'
print(('b' and 'a') in vowels)  # 'b' and 'a' → 'a'`,
          out: "5\n0\n0\n5\n3\n0\nFalse\nTrue",
        },
        {
          type: "tip",
          kind: "warn",
          text: "`'a' and 'b' in vowels` 처럼 괄호가 없으면 `in` 이 먼저라 `'a' and ('b' in vowels)` 로 읽힌다. 단축평가 결과를 넘길 땐 괄호. `3 and 5` 는 `True` 가 아니라 `5`.",
        },
        { type: "h2", text: "멤버십 연산자: in / not in" },
        {
          type: "code",
          code: `word = 'hello'
numbers = [1, 2, 3, 4, 5]
print('h' in word)
print('z' in word)
print(4 not in numbers)
print(6 not in numbers)`,
          out: "True\nFalse\nFalse\nTrue",
        },
        { type: "p", text: "값이 시퀀스나 컬렉션에 속하는지 확인. `in` 은 속하는지, `not in` 은 속하지 않는지." },
        { type: "h2", text: "시퀀스형 연산자: + 는 결합, * 는 반복" },
        {
          type: "compare",
          cols: [
            { title: "숫자끼리", items: ["`+` 덧셈", "`*` 곱셈"] },
            { title: "시퀀스끼리", items: ["`+` 이어 붙이기(결합)", "`*` 되풀이(반복)"] },
          ],
        },
        {
          type: "code",
          code: `print('Gildong' + ' Hong')
print('hi' * 5)
print([1, 2] + ['a', 'b'])
print([1, 2] * 2)`,
          out: "Gildong Hong\nhihihihihi\n[1, 2, 'a', 'b']\n[1, 2, 1, 2]",
        },
        { type: "h2", text: "연산자 우선순위 총정리 (높음 → 낮음)" },
        {
          type: "list",
          style: "flow",
          items: [
            "`()` 소괄호 grouping",
            "`[]` 인덱싱·슬라이싱",
            "`**` 거듭제곱",
            "`+` `-` 단항(양수·음수 부호)",
            "`*` `/` `//` `%` 산술",
            "`+` `-` 산술",
            "`<` `<=` `>` `>=` `==` `!=` 비교",
            "`is` `is not` 객체 비교",
            "`in` `not in` 멤버십",
            "`not` 논리 부정",
            "`and` 논리 AND",
            "`or` 논리 OR",
          ],
        },
        {
          type: "code",
          code: `print(-2 ** 2)                       # ** 가 부호보다 먼저
print(2 + 3 * 4 > 10 and not False)  # 산술 → 비교 → not → and
print([1, 2, 3][0] ** 2)             # 인덱싱이 ** 보다 먼저`,
          out: "-4\nTrue\n1",
        },
        {
          type: "list",
          style: "check",
          items: [
            "`and` 는 첫 거짓 값, `or` 는 첫 참 값에서 멈추고 그 값을 돌려준다",
            "시퀀스에서 `+` 는 결합, `*` 는 반복",
            "헷갈리면 괄호로 묶는다",
          ],
        },
      ],
    },
  ],
};
