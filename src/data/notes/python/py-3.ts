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
        {
          type: "tip",
          kind: "analogy",
          text: "list 는 '포스트잇 메모판' — 붙이고 떼고 바꿀 수 있다. tuple 은 '코팅된 메모' — 한 번 만들면 못 고친다. range 는 '번호표 뽑는 기계' — 숫자를 미리 다 적어 두지 않고 필요할 때 차례로 뽑아 준다.",
        },
        { type: "h2", text: "list: 변경 가능한 시퀀스" },
        {
          type: "p",
          text: "여러 값을 순서대로 저장하는, 변경 가능한(mutable) 시퀀스. 대괄호 `[]` 로 표기하고 0개 이상의 객체를 담으며, 어떤 자료형이든 섞어 넣을 수 있다. 담을 수 있는 데이터 개수에 한계도 없다.",
        },
        {
          type: "code",
          code: `my_list_1 = []
my_list_2 = [1, 'a', 3, 'b', 5]
my_list = [1, 2, 3, ['python', 'hello', 100]]  # 리스트 안에 리스트

print(len(my_list))          # 결과 4  (안쪽 리스트는 통째로 1개)
print(my_list[3][1])         # 결과 hello  (안쪽 리스트의 1번)
print(my_list[3][1][-1])     # 결과 o  (그 문자열의 마지막 글자)`,
        },
        {
          type: "p",
          text: "중첩된 리스트는 `[바깥 인덱스][안쪽 인덱스]` 처럼 대괄호를 이어 붙여 파고든다.",
        },
        { type: "h2", text: "tuple: 변경 불가능한 시퀀스" },
        {
          type: "p",
          text: "list 와 같지만 변경 불가능(immutable)하고 소괄호 `()` 로 표기한다. 불변이라 여러 값을 안전하게 전달·그룹화·다중 할당하는 데 쓰이는데, 개발자가 직접 쓰기보다 '파이썬 내부 동작'에서 주로 사용된다.",
        },
        {
          type: "code",
          code: `my_tuple_1 = ()
my_tuple_2 = (1,)             # 요소 1개짜리 튜플은 쉼표 필수
my_tuple_3 = (1, 'a', 3, 'b', 5)

x, y = (10, 20)               # 다중 할당
print(x, y)                   # 결과 10 20
x, y = 10, 20                 # 쉼표가 튜플을 만드니 괄호 생략 가능`,
        },
        {
          type: "tip",
          kind: "memo",
          text: "`(1,)` 인 이유는 `(1)` 하게 되면 int 가 되어버림.",
        },
        { type: "h2", text: "range: 연속된 정수 시퀀스 생성" },
        {
          type: "tip",
          kind: "memo",
          text: "연속된 정수 시퀀스를 '생성'하는 변경 불가능한 자료형. 함수 모양이다 — `range(시작 값, 끝 값, 증가 값)`.",
        },
        {
          type: "list",
          items: [
            "`range(n)` → 0 부터 n-1 까지 (예: `range(10)` 은 0 ~ 9)",
            "`range(n, m)` → n 부터 m-1 까지",
            "증가 값이 없으면 1씩 증가, 0이면 에러(ValueError)",
            "증가 값이 양수면 증가 → 시작 값이 끝 값보다 작아야 함 / 음수면 감소 → 시작 값이 끝 값보다 커야 함",
          ],
        },
        {
          type: "code",
          code: `print(range(5))              # 결과 range(0, 5)
print(list(range(1, 10)))    # 결과 [1, 2, 3, 4, 5, 6, 7, 8, 9]
print(list(range(10, 0, -3))) # 결과 [10, 7, 4, 1]`,
        },
        {
          type: "tip",
          kind: "warn",
          text: "`range(5, 1)` 은 에러가 아니라 빈 시퀀스다. 증가 값이 양수인데 시작이 끝보다 크면 뽑을 숫자가 없어 조용히 비어 버린다. 끝 값이 포함되지 않는 것(`range(5)` 에 5 없음)도 자주 틀리는 포인트.",
        },
        { type: "h2", text: "3줄 정리" },
        {
          type: "list",
          items: [
            "list `[]` 는 변경 가능, 어떤 타입이든 섞어 담고 중첩 가능",
            "tuple `()` 는 변경 불가능, 요소 하나면 `(1,)`, 다중 할당에 쓰임",
            "range 는 끝 값 미포함, 증가 값 방향과 시작·끝의 대소가 맞아야 함",
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
        {
          type: "tip",
          kind: "analogy",
          text: "dict 는 '이름표 달린 사물함' — 번호가 아니라 이름(key)으로 찾는다. set 은 '출석부 체크' — 누가 왔는지만 중요하고 순서도 중복도 없다. None 은 '빈 사물함', Boolean 은 'O/X 표'.",
        },
        { type: "h2", text: "dict: key-value 쌍, 순서·중복 없음, 변경 가능" },
        {
          type: "list",
          items: [
            "중괄호 `{}` 로 표기, `key: value` 쌍으로 저장",
            "key 는 변경 불가능한 자료형만 가능 (`str` `int` `float` `tuple` `range` …), value 는 모든 자료형",
            "key 로 value 에 접근하고, 없는 key 에 대입하면 추가, 있는 key 에 대입하면 변경",
          ],
        },
        {
          type: "code",
          code: `my_dict = {'apple': 12, 'list': [1, 2, 3]}

print(my_dict['apple'])  # 결과 12
print(my_dict['list'])   # 결과 [1, 2, 3]

my_dict['banana'] = 50   # 추가
my_dict['apple'] = 100   # 변경
print(my_dict)  # 결과 {'apple': 100, 'list': [1, 2, 3], 'banana': 50}`,
        },
        { type: "h2", text: "set: 집합, 순서·중복 없음, 변경 가능" },
        {
          type: "p",
          text: "수학의 집합과 똑같은 연산이 된다. dict 와 같이 중괄호를 쓰기 때문에 빈 set 은 `{}` 가 아니라 `set()` 으로 만들어야 한다.",
        },
        {
          type: "code",
          code: `my_set_1 = set()          # 빈 set ({} 는 빈 dict!)
my_set_3 = {1, 1, 1}
print(my_set_3)           # 결과 {1}  — 중복이 사라진다

a = {1, 2, 3}
b = {3, 6, 9}
print(a | b)  # 결과 {1, 2, 3, 6, 9}  합집합
print(a - b)  # 결과 {1, 2}           차집합
print(a & b)  # 결과 {3}              교집합`,
        },
        {
          type: "tip",
          kind: "memo",
          text: "set 는 중복 없애기/집합 연산 문제에서 자주 나옴.",
        },
        { type: "h2", text: "None 과 Boolean" },
        {
          type: "p",
          text: "`None` 은 '값이 없음'을 표현하는 자료형. `variable = None` 하고 출력하면 `None`. `Boolean` 은 참(`True`)과 거짓(`False`) 두 값뿐이며, 비교·논리 연산의 결과로 나오고 주로 조건문·반복문과 함께 쓴다.",
        },
        {
          type: "code",
          code: `print(3 > 1)     # 결과 True
print('3' != 3)  # 결과 True  (문자 '3' 과 숫자 3 은 다르다)`,
        },
        { type: "h2", text: "컬렉션 한눈에 보기" },
        {
          type: "p",
          text: "컬렉션(Collection)은 여러 항목을 담는 자료형을 통틀어 부르는 말이다.",
        },
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
          type: "p",
          text: "dict 의 '순서 X'는 인덱스로 꺼낼 수 없다는 뜻이다. 파이썬 3.7부터 dict 는 넣은 순서를 기억해서, 출력하면 넣은 순서대로 나온다(삽입 순서 보존).",
        },
        {
          type: "tip",
          kind: "warn",
          text: "`my_set = {}` 라고 쓰면 set 이 아니라 빈 dict 가 만들어진다. 그리고 dict 의 key 에 list 를 넣으면 TypeError — key 는 변경 불가능한 타입이어야 한다.",
        },
        { type: "h2", text: "3줄 정리" },
        {
          type: "list",
          items: [
            "dict 는 `{key: value}`, key 는 불변 타입만, 대입으로 추가·변경",
            "set 은 중복 제거 + `|` `-` `&` 집합 연산, 빈 set 은 `set()`",
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
        {
          type: "tip",
          kind: "analogy",
          text: "형변환은 '환전'이다. 암시적 형변환은 가게가 알아서 동전을 지폐로 바꿔 주는 것(정수 + 실수 → 실수), 명시적 형변환은 내가 환전소에 가서 '달러로 바꿔 주세요' 하는 것(`int('1')`). 환전 불가능한 돈도 있다(`int('3.5')` 는 에러).",
        },
        { type: "h2", text: "암시적 형변환: 파이썬이 자동으로" },
        {
          type: "p",
          text: "정수와 실수를 같이 연산하면 정수가 실수로 바뀐다. Boolean 과 Numeric Type 사이에서만 일어난다 (`True` 는 1, `False` 는 0 취급).",
        },
        {
          type: "code",
          code: `print(3 + 5.0)        # 결과 8.0  (int → float)
print(True + 3)       # 결과 4    (True → 1)
print(True + False)   # 결과 1`,
        },
        { type: "h2", text: "명시적 형변환: 프로그래머가 직접" },
        {
          type: "p",
          text: "암시적이 아닌 모든 경우. `int()` `float()` `str()` 같은 함수로 바꾼다. str → int 는 '형식에 맞는 숫자'만 가능하고, int → str 은 항상 가능하다.",
        },
        {
          type: "code",
          code: `print(int('1'))      # 결과 1
# print(int('3.5'))  # 에러: ValueError: invalid literal for int() with base 10: '3.5'
print(int(3.5))      # 결과 3    (float → int 는 소수점 버림)
print(float('3.5'))  # 결과 3.5
print(str(1) + '등') # 결과 1등  (int 를 str 로 바꿔야 문자열과 결합)`,
        },
        { type: "h2", text: "컬렉션 간 형변환" },
        {
          type: "p",
          text: "행이 원래 타입, 열이 바꿀 타입. range 로는 아무것도 못 바꾸고(정수 범위만 만드는 타입이라), dict 로는 쌍 구조가 있어야 해서 대부분 안 된다.",
        },
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
          type: "code",
          code: `print(list('abc'))          # 결과 ['a', 'b', 'c']
print(set([1, 1, 2]))       # 결과 {1, 2}
print(list({'a': 1, 'b': 2}))  # 결과 ['a', 'b']  (dict 는 key 만 넘어간다)`,
        },
        {
          type: "tip",
          kind: "warn",
          text: "`int('3.5')` 는 안 되고 `int(3.5)` 는 된다. 문자열은 '정수 모양'이어야 int 로 바뀌니, 소수 문자열은 `int(float('3.5'))` 처럼 두 번 거친다. 그리고 `1 + '등'` 은 TypeError — 숫자와 문자열은 암시적으로 안 섞인다.",
        },
        { type: "h2", text: "3줄 정리" },
        {
          type: "list",
          items: [
            "암시적: int + float → float, bool 은 숫자 취급 (Boolean·Numeric 사이만)",
            "명시적: `int()` `float()` `str()` 등, str → int 는 정수 모양만",
            "컬렉션끼리는 대체로 서로 변환 가능, range·dict 로는 X, dict 에서는 key 만",
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
        {
          type: "tip",
          kind: "analogy",
          text: "`==` 는 '같은 디자인의 옷인가', `is` 는 '진짜 그 옷 한 벌인가'다. 똑같이 생긴 옷 두 벌은 `==` 로는 같지만 `is` 로는 다르다. 동등성(equality)과 식별성(identity)의 차이.",
        },
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
        { type: "h2", text: "비교 연산자" },
        {
          type: "p",
          text: "`<` 미만, `<=` 이하, `>` 초과, `>=` 이상, `==` 같음, `!=` 같지 않음. 그리고 `is` / `is not` 은 '메모리에서 같은 객체를 참조하는지'를 본다 — 값을 비교하는 `==` 와 다르다.",
        },
        {
          type: "tip",
          kind: "memo",
          text: "`!`(느낌표)는 보통 코드에서 부정의 의미를 가지고 있음.",
        },
        {
          type: "code",
          code: `print(3 > 6)        # 결과 False
print(2.0 == 2)     # 결과 True   (값이 같다)
print('HI' == 'hi') # 결과 False  (대소문자 구분)
print(1 == True)    # 결과 True   (True 는 1 취급)

# SyntaxWarning: "is" with a literal. Did you mean "=="?
print(1 is True)    # 결과 False  (값은 같아도 다른 객체)
print(2 is 2.0)     # 결과 False`,
        },
        {
          type: "p",
          text: "`==` 은 값(데이터)을, `is` 는 레퍼런스(주소)를 비교한다. 위 두 줄은 항상 `False` 라서 파이썬이 '`is` 대신 `==` 를 쓰라'고 경고를 띄운다. `is` 는 `x is None` 처럼 '같은 객체인지' 볼 때만 쓴다.",
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
          code: `print(True and False)  # 결과 False
print(True or False)   # 결과 True
print(not True)        # 결과 False
print(not 0)           # 결과 True  (0 은 거짓 취급)

num = 15
print((num > 10) and (num % 2 == 0))         # 결과 False
name, age = 'Alice', 25
print((name == 'Alice') or (age == 30))      # 결과 True`,
        },
        {
          type: "tip",
          kind: "warn",
          text: "`if a is 1:` 처럼 숫자·문자열 리터럴에 `is` 를 쓰지 말 것. 작은 정수는 우연히 같은 객체라 True 가 나오기도 해서 버그가 숨는다. 값 비교는 언제나 `==`.",
        },
        { type: "h2", text: "3줄 정리" },
        {
          type: "list",
          items: [
            "`a += b` 는 `a = a + b` 의 줄임, 7개 산술 연산자 모두 가능",
            "`==` 는 값 비교(동등성), `is` 는 같은 객체인지(식별성)",
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
        {
          type: "tip",
          kind: "analogy",
          text: "단축평가는 '게으른 면접관'이다. `and` 면접관은 첫 번째 답이 탈락이면 두 번째는 묻지도 않고 그 답을 그대로 돌려준다. `or` 면접관은 첫 번째가 합격이면 거기서 끝. 그래서 결과가 True/False 가 아니라 '마지막으로 본 값' 그 자체다.",
        },
        { type: "h2", text: "단축평가 (Short-circuit evaluation)" },
        {
          type: "p",
          text: "논리 연산에서 두 번째 피연산자를 평가하지 않고 결과를 결정하는 동작. 결과는 True/False 로 바뀌지 않고 '결정에 쓰인 피연산자 값'이 그대로 나온다.",
        },
        {
          type: "list",
          items: [
            "`and`: 첫 번째가 False 면 전체가 False 로 결정 → 첫 번째 값 반환, 두 번째는 무시. 첫 번째가 True 면 두 번째가 결과",
            "`or`: 첫 번째가 True 면 전체가 True 로 결정 → 첫 번째 값 반환, 두 번째는 무시. 첫 번째가 False 면 두 번째가 결과",
          ],
        },
        {
          type: "code",
          code: `print(3 and 5)  # 결과 5  (3 이 참 → 두 번째 값)
print(3 and 0)  # 결과 0
print(0 and 3)  # 결과 0  (0 이 거짓 → 바로 0, 3 은 안 봄)
print(5 or 3)   # 결과 5  (5 가 참 → 바로 5)
print(0 or 3)   # 결과 3
print(0 or 0)   # 결과 0

vowels = 'aeiou'
print(('a' and 'b') in vowels)  # 결과 False ('a' and 'b' → 'b')
print(('b' and 'a') in vowels)  # 결과 True  ('b' and 'a' → 'a')`,
        },
        { type: "h2", text: "멤버십 연산자: in / not in" },
        {
          type: "p",
          text: "특정 값이 시퀀스나 컬렉션에 속하는지 확인한다. `in` 은 왼쪽이 오른쪽에 속하는지, `not in` 은 속하지 않는지.",
        },
        {
          type: "code",
          code: `word = 'hello'
numbers = [1, 2, 3, 4, 5]
print('h' in word)         # 결과 True
print('z' in word)         # 결과 False
print(4 not in numbers)    # 결과 False
print(6 not in numbers)    # 결과 True`,
        },
        { type: "h2", text: "시퀀스형 연산자: + 는 결합, * 는 반복" },
        {
          type: "p",
          text: "`+` 와 `*` 는 시퀀스끼리 만나면 산술 연산자일 때와 다른 역할을 한다. `+` 는 이어 붙이기(결합), `*` 는 되풀이(반복).",
        },
        {
          type: "code",
          code: `print('Gildong' + ' Hong')   # 결과 Gildong Hong
print('hi' * 5)              # 결과 hihihihihi
print([1, 2] + ['a', 'b'])   # 결과 [1, 2, 'a', 'b']
print([1, 2] * 2)            # 결과 [1, 2, 1, 2]`,
        },
        { type: "h2", text: "연산자 우선순위 총정리 (높음 → 낮음)" },
        {
          type: "list",
          ordered: true,
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
          type: "tip",
          kind: "warn",
          text: "`'a' and 'b' in vowels` 에 괄호가 없으면 `in` 이 `and` 보다 먼저라 `'a' and ('b' in vowels)` 로 읽힌다. 단축평가 결과를 다른 연산에 넘길 땐 괄호로 묶자. 또 `3 and 5` 가 `True` 가 아니라 `5` 라는 걸 잊지 말 것.",
        },
        { type: "h2", text: "3줄 정리" },
        {
          type: "list",
          items: [
            "`and` 는 첫 거짓 값, `or` 는 첫 참 값에서 멈추고 그 값을 그대로 돌려준다",
            "`in` / `not in` 으로 포함 여부, 시퀀스에서 `+` 는 결합 `*` 는 반복",
            "우선순위: 괄호 → 인덱싱 → 산술 → 비교 → `is` → `in` → `not` → `and` → `or`",
          ],
        },
      ],
    },
  ],
};
