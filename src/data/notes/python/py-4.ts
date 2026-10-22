// 파이썬 단원 4 — 함수와 제어문 1 (노션 SSAFY 파이썬 강의 정리본). 작성 규칙은 ../python.ts 상단 주석.
import type { NoteUnit } from "../types";

export const PY4: NoteUnit = {
  id: "py-4",
  title: "함수와 제어문 1",
  notes: [
    {
      id: "n-py-4-1",
      emoji: "🧩",
      title: "함수의 정의와 호출",
      summary: "def 로 만들고 이름() 으로 부른다 — 입력은 매개변수, 출력은 return",
      blocks: [
        {
          type: "tip",
          kind: "analogy",
          text: "함수는 자판기다. 동전(입력)을 넣으면 안에서 뭔가 돌아가고 음료(출력)가 나온다. 한 번 만들어 두면 매번 같은 기계를 다시 조립할 필요 없이 버튼만 누르면 된다.",
        },
        { type: "h2", text: "함수를 쓰는 이유" },
        {
          type: "p",
          text: "두 수의 합을 구하는 코드를 매번 다시 쓰는 대신 함수로 한 번 정의해 두면 코드 중복이 사라진다. 재사용성이 높아지고, 가독성과 유지보수성이 좋아진다.",
        },
        {
          type: "tip",
          kind: "memo",
          text: "재사용성 / 가독성과 유지보수성 — 함수를 쓰는 이유 두 가지. 좀 더 간편하게 쓸 수 있도록 하는 것.",
        },
        { type: "h2", text: "함수 구조: 입력 → 설명서 → 본문 → 출력" },
        {
          type: "code",
          code: "def make_sum(pram1, pram2):\n    \"\"\"이것은 두 수를 받아\n    두 수의 합을 반환하는 함수입니다.\n\n    >>> make_sum(1, 2)\n    3\n    \"\"\"\n    return pram1 + pram2\n\nresult = make_sum(100, 30)\nprint(result)  # 결과: 130",
        },
        {
          type: "list",
          items: [
            "함수 정의 — `def` 키워드로 시작, 뒤에 함수 이름, 괄호 안에 매개변수(parameter: 함수에 전달되는 값)",
            "Docstring — 함수 body 앞에 선택적으로 쓰는 함수 설명서(`\"\"\"...\"\"\"`)",
            "함수 body — 콜론(:) 다음에 들여쓰기 된 코드 블록. 함수가 실행될 때 수행되는 코드",
            "반환 값 — `return` 뒤에 돌려줄 값. return 문은 함수 실행을 종료하고 결과를 호출한 곳으로 돌려준다",
            "호출(call) — `함수이름(인자)` 로 실행. 전달된 인자(argument)가 정의 때 적은 매개변수에 대입된다",
          ],
        },
        {
          type: "tip",
          kind: "memo",
          text: "두 수가 인풋, 두 수의 합이 아웃풋. 덕스트링은 설명서.",
        },
        { type: "h2", text: "return 이 없으면 None 이 돌아온다" },
        {
          type: "code",
          code: "def my_func():\n    print('hello')\n\nresult = my_func()  # 여기서 hello 가 찍힘\nprint(result)       # 결과: None\n\nreturn_value = print('hi')  # print 도 return 이 없는 함수\nprint(return_value)         # 결과: None",
        },
        {
          type: "tip",
          kind: "memo",
          text: "print 함수는 return 이 없다. 화면에 찍는 것과 값을 돌려주는 것은 다른 일이다.",
        },
        {
          type: "tip",
          kind: "warn",
          text: "`print(값)` 으로 화면에 보였다고 해서 그 값을 다른 데서 쓸 수 있는 게 아니다. 함수 밖으로 값을 꺼내려면 반드시 `return` 을 써야 한다.",
        },
        { type: "h2", text: "3줄 정리" },
        {
          type: "list",
          items: [
            "함수 = 중복 제거 + 재사용: `def 이름(매개변수):` 로 정의, `이름(인자)` 로 호출",
            "Docstring 은 선택, body 는 들여쓰기, `return` 은 실행을 끝내고 값을 돌려준다",
            "return 이 없는 함수(print 포함)의 결과는 `None`",
          ],
        },
      ],
    },
    {
      id: "n-py-4-2",
      emoji: "📨",
      title: "매개변수와 인자, 인자의 5가지 종류",
      summary: "위치·기본값·키워드·*args·**kwargs — 권장 순서는 위치→기본→가변→가변키워드",
      blocks: [
        {
          type: "tip",
          kind: "analogy",
          text: "매개변수는 편지봉투에 인쇄된 '받는 사람 ___' 빈칸이고, 인자는 거기 실제로 적어 넣는 이름이다. 빈칸은 정의할 때, 실제 값은 호출할 때 채워진다.",
        },
        { type: "h2", text: "매개변수(parameter) vs 인자(argument)" },
        {
          type: "code",
          code: "def add_numbers(x, y):  # x 와 y 는 매개변수(parameter)\n    result = x + y\n    return result\n\na = 2\nb = 3\nsum_result = add_numbers(a, b)  # a 와 b 는 인자(argument)\nprint(sum_result)  # 결과: 5",
        },
        {
          type: "list",
          items: [
            "매개변수: 함수를 정의할 때, 함수가 받을 값을 나타내는 변수",
            "인자: 함수를 호출할 때, 실제로 전달되는 값",
          ],
        },
        { type: "h2", text: "인자의 종류 5가지" },
        {
          type: "table",
          head: ["종류", "모양", "설명"],
          rows: [
            ["1. 위치 인자", "`greet('Harry', 20)`", "위치(순서)대로 전달. 반드시 값을 줘야 한다"],
            ["2. 기본 인자 값", "`def greet(name, age=20)`", "정의에서 기본값 지정 → 안 주면 기본값 사용"],
            ["3. 키워드 인자", "`greet(name='Dave', age=35)`", "이름으로 전달, 순서 상관없음"],
            ["4. 임의의 인자 목록", "`def f(*args)`", "개수 미정 인자를 tuple 로 묶음"],
            ["5. 임의의 키워드 인자 목록", "`def f(**kwargs)`", "개수 미정 키워드 인자를 dict 로 묶음"],
          ],
        },
        {
          type: "tip",
          kind: "memo",
          text: "위치 인자는 함수 호출 시 반드시 값을 전달해야 함. 키워드 인자는 호출 시 위치 인자 뒤에 와야 함 — `greet(age=35, 'Dave')` 는 SyntaxError. 위치인자가 제일 쎔. `*` 는 tuple, `**` 는 dictionary.",
        },
        {
          type: "code",
          code: "def greet(name, age):\n    print(f'안녕하세요, {name}님! {age}살이시군요')\n\ngreet('Harry', 20)  # 결과: 안녕하세요, Harry님! 20살이시군요\ngreet(20, 'Harry')  # 결과: 안녕하세요, 20님! Harry살이시군요 (순서가 뒤집혀도 에러는 안 남)\n# greet('Harry')    # 에러: TypeError: greet() missing 1 required positional argument: 'age'\n\ndef calculate_sum(*args):\n    print(args, type(args))\n\ncalculate_sum(1, 100, 5000, 30)  # 결과: (1, 100, 5000, 30) <class 'tuple'>\n\ndef print_info(**kwargs):\n    print(kwargs)\n\nprint_info(name='Eve', age=30)  # 결과: {'name': 'Eve', 'age': 30}",
        },
        {
          type: "p",
          text: "`def calculate_sum(params, *args)` 처럼 일반 매개변수가 앞에 있으면 첫 값 1 은 params 로 가고, 나머지 `(100, 5000, 30)` 만 args 로 묶인다. 강의 슬라이드 주석은 `(1, 100, 5000, 30)` 이었지만 실제 실행 결과는 `(100, 5000, 30)`.",
        },
        { type: "h2", text: "권장 작성 순서: 위치 → 기본 → 가변 → 가변 키워드" },
        {
          type: "code",
          code: "def func(pos1, pos2, default_arg='default', *args, **kwargs):\n    print('pos1:', pos1)\n    print('pos2:', pos2)\n    print('default_arg:', default_arg)\n    print('args:', args)\n    print('kwargs:', kwargs)\n\nfunc(1, 2, 3, 4, 5, 6, key1='value1', key2='value2')\n# 결과:\n# pos1: 1\n# pos2: 2\n# default_arg: 3\n# args: (4, 5, 6)\n# kwargs: {'key1': 'value1', 'key2': 'value2'}",
        },
        {
          type: "tip",
          kind: "memo",
          text: "호출 시 인자를 전달하는 과정에서 혼란을 줄이려는 순서. 단, 모든 상황에 적용되는 절대적인 규칙은 아니다. key1·key2 가 kwargs 에 해당되는 값.",
        },
        {
          type: "tip",
          kind: "warn",
          text: "`*args` 뒤에 일반 매개변수를 두면(`def f(*args, params)`) params 는 키워드로만 받을 수 있는 인자가 되어, `f(1, 2, 3)` 처럼 위치로만 넘기면 TypeError 가 난다. 가변 인자는 뒤쪽에 두는 게 안전하다.",
        },
        { type: "h2", text: "3줄 정리" },
        {
          type: "list",
          items: [
            "정의할 때 빈칸 = 매개변수, 호출할 때 실제 값 = 인자",
            "위치 인자는 필수, 키워드 인자는 위치 인자 뒤에, 기본값은 안 주면 자동",
            "`*args` 는 tuple, `**kwargs` 는 dict 로 묶인다 — 순서는 위치→기본→가변→가변키워드",
          ],
        },
      ],
    },
    {
      id: "n-py-4-3",
      emoji: "🪆",
      title: "재귀 함수",
      summary: "자기 자신을 부르되 반드시 종료 조건(base case)으로 수렴해야 한다",
      blocks: [
        {
          type: "tip",
          kind: "analogy",
          text: "재귀는 마트료시카 인형이다. 큰 인형을 열면 조금 작은 같은 모양의 인형이 나오고, 또 열면 더 작은 인형… 가장 작은 인형(base case)에 닿으면 멈추고, 거기서부터 다시 하나씩 닫으며 올라온다.",
        },
        { type: "h2", text: "factorial 로 보는 재귀" },
        {
          type: "p",
          text: "n! = n × (n-1) × (n-2) × … × 1. 예를 들어 5! = 5 × 4 × 3 × 2 × 1 = 120. 이걸 'n! = n × (n-1)!' 이라고 다시 쓰면, 같은 문제를 더 작은 입력으로 푸는 모양이 된다.",
        },
        {
          type: "code",
          code: "def factorial(n):\n    if n == 1:\n        return 1\n    else:\n        return n * factorial(n - 1)\n\nprint(factorial(5))  # 결과: 120",
        },
        {
          type: "list",
          items: [
            "factorial 함수는 자기 자신을 재귀적으로 호출해 n 의 팩토리얼을 계산",
            "재귀 호출은 n 이 1 이 될 때까지 반복되며, 종료 조건을 설정해 재귀 호출이 멈추도록 함",
            "문제를 작은 단위로 분할하고, 분할된 문제들의 결과를 조합해 최종 결과를 도출",
          ],
        },
        { type: "h2", text: "호출은 내려가고, 값은 거꾸로 올라온다" },
        {
          type: "code",
          code: "# 내려가기 (호출)            올라오기 (값 조합)\n# f(5) = 5 * f(4)           f(5) = 5 * 24 = 120\n# f(4) = 4 * f(3)           f(4) = 4 * 6  = 24\n# f(3) = 3 * f(2)           f(3) = 3 * 2  = 6\n# f(2) = 2 * f(1)           f(2) = 2 * 1  = 2\n# f(1) = 1   <- base case (수렴)",
        },
        {
          type: "p",
          text: "f(3), f(2), f(1) 은 전부 '같은 문제를 다른 input 으로 해결'하는 것. 가장 작은 f(1) = 1 이 base case 이고, 여기 도착해야 값이 위로 되돌아가 조합된다.",
        },
        { type: "h2", text: "특징과 쓰는 이유" },
        {
          type: "list",
          items: [
            "특정 알고리즘 식을 표현할 때 변수 사용이 줄고 코드 가독성이 높아짐",
            "1개 이상의 base case(종료되는 상황)가 존재하고, 수렴하도록 작성",
            "문제의 자연스러운 표현: 복잡한 문제를 간결하고 직관적으로",
            "코드 간결성: 상황에 따라 반복문보다 알고리즘 코드가 더 간결하고 명확",
            "수학적 문제 해결: 수학적 정의가 재귀적이면 그대로 구현 가능",
          ],
        },
        {
          type: "tip",
          kind: "warn",
          text: "재귀 활용 시 기억할 것 두 가지 — ① 종료 조건을 명확히 ② 반복되는 호출이 종료 조건을 향하도록. `if n == 1` 을 빼먹거나 `factorial(n)` 처럼 입력이 줄지 않으면 끝없이 부르다 RecursionError 로 터진다.",
        },
        { type: "h2", text: "3줄 정리" },
        {
          type: "list",
          items: [
            "재귀 = 같은 문제를 더 작은 입력으로 자기 자신에게 다시 맡기기",
            "base case 에 닿으면 멈추고, 결과가 거꾸로 올라오며 조합된다",
            "종료 조건을 명확히, 호출은 그 조건을 향해 수렴하게",
          ],
        },
      ],
    },
    {
      id: "n-py-4-4",
      emoji: "🧰",
      title: "내장 함수: len·sum·sorted, map, zip",
      summary: "import 없이 바로 쓰는 함수들 — map 은 하나씩 적용, zip 은 짝 맞추기",
      blocks: [
        {
          type: "tip",
          kind: "analogy",
          text: "내장 함수는 파이썬이 처음부터 서랍에 넣어 둔 기본 공구다. `map` 은 컨베이어 벨트에 올라온 물건마다 같은 도장을 찍는 기계, `zip` 은 두 줄로 선 사람들을 앞에서부터 짝지어 주는 안내원이다.",
        },
        { type: "h2", text: "자주 쓰는 내장 함수" },
        {
          type: "code",
          code: "numbers = [1, 2, 3, 4, 5]\n\nprint(len(numbers))  # 결과: 5\nprint(max(numbers))  # 결과: 5\nprint(min(numbers))  # 결과: 1\nprint(sum(numbers))  # 결과: 15\nprint(sorted(numbers, reverse=True))  # 결과: [5, 4, 3, 2, 1]",
        },
        {
          type: "tip",
          kind: "memo",
          text: "`sorted(reverse=True)` 와 `[::-1]` 은 같은 게 아니다! sorted 는 정렬 후 뒤집기(내림차순), `[::-1]` 은 그냥 거꾸로 뒤집는 것.",
        },
        { type: "h2", text: "map(function, iterable)" },
        {
          type: "p",
          text: "순회 가능한 데이터구조(iterable)의 모든 요소에 함수를 적용하고, 그 결과를 map object 로 반환한다. 인자로 '함수'를 받는다 — 함수인데 반복하는 것처럼 표현되는 것.",
        },
        {
          type: "code",
          code: "numbers = [1, 2, 3]\nresult = map(str, numbers)\nprint(result)        # 결과: <map object at 0x...>\nprint(list(result))  # 결과: ['1', '2', '3']\n\n# SWEA 문제처럼 '1 2 3' 이 입력될 때 (input() 은 키보드 입력을 기다린다)\nnumbers1 = input().split()             # 입력 1 2 3 → ['1', '2', '3'] (문자열 그대로)\nnumbers2 = list(map(int, input().split()))  # 입력 1 2 3 → [1, 2, 3] (전부 int 로)",
        },
        {
          type: "tip",
          kind: "memo",
          text: "iterable = 반복 가능한 객체(요소) → 대표적으로 컬렉션(Collection).",
        },
        { type: "h2", text: "zip(*iterables)" },
        {
          type: "p",
          text: "임의의 iterable 들을 모아 튜플을 원소로 하는 zip object 를 반환한다. `*` 는 임의의 개수를 받는다는 뜻. 여러 리스트를 동시에 조회할 때, 그리고 `zip(*2차원리스트)` 로 같은 컬럼(열)끼리 묶을 때 쓴다.",
        },
        {
          type: "code",
          code: "girls = ['jane', 'ashley']\nboys = ['peter', 'jay']\nprint(list(zip(girls, boys)))  # 결과: [('jane', 'peter'), ('ashley', 'jay')]\n\n# 여러 리스트를 동시에 조회\nkr = [10, 20, 30, 50]\nmath = [20, 40, 50, 70]\nen = [40, 20, 30, 50]\nfor student_scores in zip(kr, math, en):\n    print(student_scores)  # 결과: (10, 20, 40) (20, 40, 20) (30, 50, 30) (50, 70, 50)\n\n# 2차원 리스트의 같은 열끼리\nscores = [[10, 20, 30], [40, 50, 39], [20, 40, 50]]\nfor score in zip(*scores):\n    print(score)  # 결과: (10, 40, 20) (20, 50, 40) (30, 39, 50)",
        },
        {
          type: "tip",
          kind: "memo",
          text: "`[('jane', 'peter')]` → 튜플 사용. 2차원 리스트는 IM 문제에 자주 나옴.",
        },
        {
          type: "tip",
          kind: "warn",
          text: "`map`·`zip` 결과를 `print` 하면 `<map object ...>` 처럼 주소만 보인다. 내용을 보려면 `list()` 로 감싸야 한다. 그리고 한 번 `list()` 로 꺼내 쓴 map/zip 객체는 비어 버려서 두 번 쓸 수 없다.",
        },
        { type: "h2", text: "3줄 정리" },
        {
          type: "list",
          items: [
            "`len` `max` `min` `sum` `sorted` 는 import 없이 바로 — sorted 는 정렬, `[::-1]` 은 뒤집기",
            "`map(함수, iterable)` 은 요소마다 함수 적용 → `list(map(int, input().split()))` 이 단골",
            "`zip` 은 여러 iterable 을 앞에서부터 튜플로 짝짓기, `zip(*2차원)` 은 열 단위 조회",
          ],
        },
      ],
    },
    {
      id: "n-py-4-5",
      emoji: "🔭",
      title: "함수와 Scope, LEGB, global",
      summary: "함수 안은 local, 밖은 global — 이름은 L→E→G→B 순서로 찾는다",
      blocks: [
        {
          type: "tip",
          kind: "analogy",
          text: "scope 는 방이다. 함수를 호출하면 새 방(local)이 생기고, 그 방에서 만든 물건(변수)은 방을 나가면(함수 종료) 사라진다. 물건을 찾을 땐 내 방 → 옆 방 → 거실 → 건물 공용창고 순서로 뒤진다(LEGB).",
        },
        { type: "h2", text: "local scope 와 global scope" },
        {
          type: "list",
          items: [
            "global scope: 코드 어디에서든 참조할 수 있는 공간 → 거기 정의된 변수가 global variable",
            "local scope: 함수가 만든 scope, 함수 내부에서만 참조 가능 → 거기 정의된 변수가 local variable",
          ],
        },
        {
          type: "code",
          code: "def func():\n    num = 20\n    print('local', num)  # 결과: local 20\n\nfunc()\nprint('global', num)  # 에러: NameError: name 'num' is not defined",
        },
        {
          type: "tip",
          kind: "memo",
          text: "함수는 코드 내부에 local scope 를 생성하며, 그 외 공간인 global scope 로 구분. num 은 local 쪽에서 죽음(수명이) — 변수의 수명주기와 연관.",
        },
        {
          type: "p",
          text: "변수 수명주기(lifecycle)는 변수가 선언되는 위치와 scope 에 따라 결정된다.",
        },
        {
          type: "list",
          ordered: true,
          items: [
            "built-in scope: 파이썬이 실행된 이후부터 영원히 유지",
            "global scope: 모듈이 호출된 시점 이후 혹은 인터프리터가 끝날 때까지 유지",
            "local scope: 함수가 호출될 때 생성되고, 함수가 종료될 때까지 유지",
          ],
        },
        { type: "h2", text: "이름 검색 규칙 LEGB" },
        {
          type: "p",
          text: "파이썬의 이름(식별자)들은 이름공간(namespace)에 저장되고, Local → Enclosed(한 단계 위) → Global(최상단) → Built-in(정의 없이 쓸 수 있는 모든 것) 순서로 찾아 나간다. 함수 내에서 바깥 scope 의 변수에 접근은 가능하지만 수정은 할 수 없다.",
        },
        {
          type: "code",
          code: "# 퀴즈: 어디서 찾아오나?\na = 1\nb = 2\n\ndef enclosed():\n    a = 10\n    c = 3\n\n    def local(c):\n        print(a, b, c)  # 결과: 10 2 500  (a 는 E, b 는 G, c 는 L=매개변수)\n\n    local(500)\n    print(a, b, c)  # 결과: 10 2 3\n\nenclosed()\nprint(a, b)  # 결과: 1 2\n\n# 내장 함수를 덮어쓰면?\nprint(sum(range(3)))  # 결과: 3\nsum = 5               # global 에 sum 이 생김 → G 가 B 보다 먼저 검색됨\nprint(sum(range(3)))  # 에러: TypeError: 'int' object is not callable\n# 되돌리려면 del sum 으로 변수를 지운 뒤 진행",
        },
        { type: "h2", text: "global 키워드" },
        {
          type: "code",
          code: "num = 0  # 전역 변수\n\ndef increment():\n    global num  # num 을 전역 변수로 선언\n    num += 1\n\nprint(num)  # 결과: 0\nincrement()\nprint(num)  # 결과: 1",
        },
        {
          type: "list",
          items: [
            "변수의 스코프를 전역 변수로 지정 — 보통 함수 안에서 전역 변수를 '수정'하려 할 때 사용",
            "주의 1: global 선언 전에 참조 불가 → `print(num)` 뒤에 `global num` 을 쓰면 SyntaxError: name 'num' is used prior to global declaration",
            "주의 2: 매개변수에는 global 사용 불가 → `def increment(num): global num` 은 SyntaxError: name 'num' is parameter and global",
          ],
        },
        {
          type: "tip",
          kind: "warn",
          text: "`sum` `max` `list` `str` 같은 내장 함수 이름을 변수명으로 쓰지 말 것. 에러 없이 조용히 덮어써지고, 한참 뒤에 'int object is not callable' 로 터진다.",
        },
        { type: "h2", text: "3줄 정리" },
        {
          type: "list",
          items: [
            "함수 안 = local(호출 때 생겨 종료 때 사라짐), 밖 = global, 파이썬 기본 = built-in",
            "이름 찾기는 L → E → G → B 순서, 바깥 변수는 읽기만 되고 수정은 안 됨",
            "안에서 전역을 고치려면 `global num` — 참조 전에 선언, 매개변수엔 못 씀",
          ],
        },
      ],
    },
    {
      id: "n-py-4-6",
      emoji: "📦",
      title: "Packing & Unpacking",
      summary: "* 는 여럿을 tuple 로 묶거나 풀어서 인자로, ** 는 dict 를 키워드 인자로",
      blocks: [
        {
          type: "tip",
          kind: "analogy",
          text: "패킹은 여러 물건을 상자 하나에 담는 것, 언패킹은 상자를 열어 물건을 각자 자리에 놓는 것. `*` 는 '남은 거 다 상자에' 또는 '상자 뜯어서 하나씩'이라는 양쪽으로 쓰이는 테이프다.",
        },
        { type: "h2", text: "Packing: 여러 값을 변수 하나에 묶기" },
        {
          type: "code",
          code: "packed_values = 1, 2, 3, 4, 5\nprint(packed_values)  # 결과: (1, 2, 3, 4, 5)\n\n# * 로 '남은 요소' 패킹 — 리스트로 묶인다\nnumbers = [1, 2, 3, 4, 5]\na, *b, c = numbers\nprint(a)  # 결과: 1\nprint(b)  # 결과: [2, 3, 4]\nprint(c)  # 결과: 5",
        },
        {
          type: "tip",
          kind: "memo",
          text: "변수에 담긴 값들은 하나의 튜플(tuple)로 묶임. `*b` 는 남은 요소들을 리스트로 패킹해서 할당한 경우.",
        },
        {
          type: "p",
          text: "`print(1, 2, 3, 4, 5)` 처럼 print 에 인자를 몇 개든 넣을 수 있었던 이유도 이것이다. 공식 문서를 보면 `print(*objects, sep=' ', end='\\n', ...)` — 인자 개수에 상관없이 `*objects` 가 튜플 하나로 패킹되어 내부에서 처리된다.",
        },
        { type: "h2", text: "Unpacking: 묶인 값을 개별 변수로 풀기" },
        {
          type: "code",
          code: "packed_values = 1, 2, 3, 4, 5\na, b, c, d, e = packed_values\nprint(a, b, c, d, e)  # 결과: 1 2 3 4 5\n\ndef my_function(x, y, z):\n    print(x, y, z)\n\n# * : 리스트 요소를 풀어서 인자로\nnames = ['alice', 'jane', 'peter']\nmy_function(*names)  # 결과: alice jane peter\n\n# ** : 딕셔너리 키-값을 풀어서 키워드 인자로\nmy_dict = {'x': 1, 'y': 2, 'z': 3}\nmy_function(**my_dict)  # 결과: 1 2 3",
        },
        {
          type: "tip",
          kind: "memo",
          text: "`**` 는 딕셔너리(dict)를 사용하여 언패킹함.",
        },
        { type: "h2", text: "*, ** 정리" },
        {
          type: "table",
          head: ["연산자", "역할", "설명"],
          rows: [
            ["`*`", "패킹", "여러 개의 인자를 하나의 튜플로 묶음 (`def f(*args)`)"],
            ["`*`", "언패킹", "시퀀스·반복 가능 객체를 각각의 요소로 풀어 함수 인자로 전달 (`f(*list)`)"],
            ["`**`", "언패킹", "딕셔너리의 키-값 쌍을 풀어 함수의 키워드 인자로 전달 (`f(**dict)`)"],
          ],
        },
        {
          type: "tip",
          kind: "warn",
          text: "`**my_dict` 는 dict 의 키 이름이 매개변수 이름과 똑같아야 한다. `{'x':1, 'y':2, 'w':3}` 을 `my_function(**d)` 에 넣으면 'unexpected keyword argument w' 로 터진다.",
        },
        { type: "h2", text: "3줄 정리" },
        {
          type: "list",
          items: [
            "`a = 1, 2, 3` 은 tuple 패킹, `a, *b, c = ...` 는 남은 것을 리스트로 패킹",
            "`f(*리스트)` 는 요소를 위치 인자로, `f(**딕셔너리)` 는 키-값을 키워드 인자로 풀어 전달",
            "print 가 인자를 몇 개든 받는 이유 = `*objects` 패킹",
          ],
        },
      ],
    },
    {
      id: "n-py-4-7",
      emoji: "⚡",
      title: "참고: lambda 표현식",
      summary: "이름 없는 한 줄 함수 — map 처럼 함수를 인자로 넘길 때 유용",
      blocks: [
        {
          type: "tip",
          kind: "analogy",
          text: "lambda 는 포스트잇 메모다. 정식 문서(def)를 만들어 보관할 것도 아니고, 그 자리에서 한 번 쓰고 버릴 간단한 계산이면 포스트잇 한 장으로 충분하다.",
        },
        { type: "h2", text: "구조: lambda 매개변수: 표현식" },
        {
          type: "list",
          items: [
            "익명 함수를 만드는 표현식 → 한 줄로 간단한 함수를 정의",
            "`lambda` 키워드: 람다 함수를 선언",
            "매개변수: 여러 개면 쉼표로 구분",
            "표현식: 실행되는 코드 블록, 결과값을 반환하는 '표현식'으로 작성 (return 을 안 쓴다)",
          ],
        },
        {
          type: "code",
          code: "# def 버전\ndef addition(x, y):\n    return x + y\n\n# lambda 버전 — 같은 일\naddition = lambda x, y: x + y\n\nresult = addition(3, 5)\nprint(result)  # 결과: 8",
        },
        { type: "h2", text: "활용: map 과 함께" },
        {
          type: "p",
          text: "간단한 연산이나 함수를 한 줄로 표현할 때, 그리고 함수를 매개변수로 전달하는 경우에 유용하다. map 에 넘길 함수를 따로 def 로 만들지 않고 그 자리에서 쓸 수 있다.",
        },
        {
          type: "code",
          code: "numbers = [1, 2, 3, 4, 5]\n\ndef square(x):\n    return x**2\n\n# lambda 미사용\nsquared1 = list(map(square, numbers))\nprint(squared1)  # 결과: [1, 4, 9, 16, 25]\n\n# lambda 사용 — def square 를 통째로 대체\nsquared2 = list(map(lambda x: x**2, numbers))\nprint(squared2)  # 결과: [1, 4, 9, 16, 25]",
        },
        {
          type: "p",
          text: "def 로 만든 함수는 이름이 있어서 여러 곳에서 다시 부를 수 있고, lambda 는 그 자리에서 한 번 쓰는 용도에 어울린다.",
        },
        {
          type: "tip",
          kind: "warn",
          text: "lambda 안에는 `return` `if` 문 `for` 문 같은 '문장'을 못 쓴다. 값 하나로 계산되는 '표현식'만 가능. 복잡해지면 그냥 def 로 쓰는 게 읽기 좋다.",
        },
        { type: "h2", text: "3줄 정리" },
        {
          type: "list",
          items: [
            "`lambda 매개변수: 표현식` — 이름 없는 한 줄 함수, return 생략",
            "`map(lambda x: x**2, numbers)` 처럼 함수를 인자로 넘길 때 제일 빛난다",
            "재사용하거나 복잡하면 def, 한 번 쓰고 버릴 간단한 계산이면 lambda",
          ],
        },
      ],
    },
  ],
};
