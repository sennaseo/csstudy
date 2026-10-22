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
        { type: "key", text: "`def` 로 한 번 만들고, `이름(인자)` 로 몇 번이든 부른다" },
        {
          type: "tip",
          kind: "analogy",
          text: "함수는 자판기. 동전(입력)을 넣으면 음료(출력)가 나오고, 다시 조립할 필요 없이 버튼만 누르면 된다.",
        },
        { type: "h2", text: "함수를 쓰는 이유" },
        {
          type: "compare",
          cols: [
            { title: "♻️ 재사용성", items: ["두 수의 합 코드를 매번 다시 안 씀", "코드 중복 제거"] },
            { title: "📖 가독성·유지보수성", items: ["한 곳만 고치면 됨", "이름만 봐도 하는 일이 보임"] },
          ],
        },
        {
          type: "tip",
          kind: "memo",
          text: "재사용성 / 가독성과 유지보수성 — 함수를 쓰는 이유 두 가지. 좀 더 간편하게 쓸 수 있도록 하는 것.",
        },
        {
          type: "code",
          code: "def make_sum(a, b):\n    return a + b\n\nprint(make_sum(1, 2))\nprint(make_sum(10, 20))\nprint(make_sum(100, 30))",
          out: "3\n30\n130",
        },
        { type: "h2", text: "함수 구조: 입력 → 설명서 → 본문 → 출력" },
        {
          type: "code",
          code: "def make_sum(pram1, pram2):\n    \"\"\"이것은 두 수를 받아\n    두 수의 합을 반환하는 함수입니다.\n\n    >>> make_sum(1, 2)\n    3\n    \"\"\"\n    return pram1 + pram2\n\nresult = make_sum(100, 30)\nprint(result)",
          out: "130",
        },
        {
          type: "list",
          style: "flow",
          items: [
            "정의: `def 이름(매개변수):` (parameter = 함수에 전달되는 값)",
            "Docstring: body 앞에 선택적으로 쓰는 설명서 `\"\"\"...\"\"\"`",
            "body: 콜론(:) 다음 들여쓴 코드 블록, 실행 때 수행됨",
            "반환: `return` 이 실행을 끝내고 값을 호출한 곳으로 돌려줌",
            "호출: `함수이름(인자)`, 인자(argument)가 매개변수에 대입됨",
          ],
        },
        {
          type: "tip",
          kind: "memo",
          text: "두 수가 인풋, 두 수의 합이 아웃풋. 덕스트링은 설명서.",
        },
        { type: "h2", text: "return 이 없으면 None" },
        {
          type: "code",
          code: "def my_func():\n    print('hello')\n\nresult = my_func()\nprint(result)\n\nreturn_value = print('hi')  # print 도 return 이 없는 함수\nprint(return_value)",
          out: "hello\nNone\nhi\nNone",
        },
        {
          type: "compare",
          cols: [
            { title: "착각", tone: "bad", items: ["`print(값)` 으로 화면에 보였으니 그 값을 쓸 수 있다"] },
            { title: "실제", tone: "good", items: ["화면에 찍기 ≠ 값 돌려주기", "밖으로 꺼내려면 반드시 `return`"] },
          ],
        },
        {
          type: "tip",
          kind: "memo",
          text: "print 함수는 return 이 없다. 화면에 찍는 것과 값을 돌려주는 것은 다른 일이다.",
        },
        {
          type: "list",
          style: "check",
          items: [
            "`def 이름(매개변수):` 로 정의, `이름(인자)` 로 호출",
            "`return` 은 실행을 끝내고 값을 돌려준다",
            "return 없는 함수(print 포함)의 결과는 `None`",
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
        { type: "key", text: "정의할 때 빈칸 = 매개변수, 호출할 때 넣는 값 = 인자" },
        {
          type: "code",
          code: "def add_numbers(x, y):  # x, y 는 매개변수(parameter)\n    result = x + y\n    return result\n\na = 2\nb = 3\nsum_result = add_numbers(a, b)  # a, b 는 인자(argument)\nprint(sum_result)",
          out: "5",
        },
        {
          type: "compare",
          cols: [
            { title: "매개변수 (parameter)", items: ["함수를 정의할 때", "받을 값을 나타내는 변수"] },
            { title: "인자 (argument)", items: ["함수를 호출할 때", "실제로 전달되는 값"] },
          ],
        },
        { type: "h2", text: "인자의 종류 5가지" },
        {
          type: "table",
          head: ["종류", "모양", "설명"],
          rows: [
            ["1. 위치 인자", "`greet('Harry', 20)`", "순서대로 전달, 반드시 값을 줘야 함"],
            ["2. 기본 인자 값", "`def greet(name, age=20)`", "안 주면 기본값 사용"],
            ["3. 키워드 인자", "`greet(name='Dave', age=35)`", "이름으로 전달, 순서 무관"],
            ["4. 임의의 인자 목록", "`def f(*args)`", "개수 미정 인자를 tuple 로"],
            ["5. 임의의 키워드 인자 목록", "`def f(**kwargs)`", "개수 미정 키워드 인자를 dict 로"],
          ],
        },
        {
          type: "tip",
          kind: "memo",
          text: "위치 인자는 함수 호출 시 반드시 값을 전달해야 함. 키워드 인자는 호출 시 위치 인자 뒤에 와야 함 — `greet(age=35, 'Dave')` 는 SyntaxError. 위치인자가 제일 쎔. `*` 는 tuple, `**` 는 dictionary.",
        },
        {
          type: "code",
          code: "def greet(name, age):\n    print(f'안녕하세요, {name}님! {age}살이시군요')\n\ngreet('Harry', 20)\ngreet(20, 'Harry')  # 순서가 뒤집혀도 에러는 안 남\ngreet('Harry')",
          out: "안녕하세요, Harry님! 20살이시군요\n안녕하세요, 20님! Harry살이시군요\nTypeError: greet() missing 1 required positional argument: 'age'",
        },
        {
          type: "code",
          code: "def calculate_sum(*args):\n    print(args, type(args))\n\ncalculate_sum(1, 100, 5000, 30)\n\ndef print_info(**kwargs):\n    print(kwargs)\n\nprint_info(name='Eve', age=30)",
          out: "(1, 100, 5000, 30) <class 'tuple'>\n{'name': 'Eve', 'age': 30}",
        },
        {
          type: "tip",
          kind: "warn",
          text: "`def calculate_sum(params, *args)` 면 첫 값 1 은 params 로 가고 args 는 `(100, 5000, 30)`. 강의 슬라이드 주석은 `(1, 100, 5000, 30)` 이었지만 실제 결과는 다르다.",
        },
        { type: "h2", text: "권장 순서: 위치 → 기본 → 가변 → 가변 키워드" },
        {
          type: "code",
          code: "def func(pos1, pos2, default_arg='default', *args, **kwargs):\n    print('pos1:', pos1)\n    print('pos2:', pos2)\n    print('default_arg:', default_arg)\n    print('args:', args)\n    print('kwargs:', kwargs)\n\nfunc(1, 2, 3, 4, 5, 6, key1='value1', key2='value2')",
          out: "pos1: 1\npos2: 2\ndefault_arg: 3\nargs: (4, 5, 6)\nkwargs: {'key1': 'value1', 'key2': 'value2'}",
        },
        {
          type: "tip",
          kind: "memo",
          text: "호출 시 인자를 전달하는 과정에서 혼란을 줄이려는 순서. 단, 모든 상황에 적용되는 절대적인 규칙은 아니다. key1·key2 가 kwargs 에 해당되는 값.",
        },
        {
          type: "tip",
          kind: "warn",
          text: "`def f(*args, params)` 처럼 `*args` 뒤에 두면 params 는 키워드로만 받는다. `f(1, 2, 3)` 은 TypeError. 가변 인자는 뒤쪽에.",
        },
        {
          type: "list",
          style: "check",
          items: [
            "위치 인자는 필수, 키워드 인자는 위치 인자 뒤에",
            "`*args` 는 tuple, `**kwargs` 는 dict",
            "순서는 위치 → 기본 → 가변 → 가변 키워드",
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
        { type: "key", text: "같은 문제를 더 작은 입력으로 자기 자신에게 다시 맡긴다" },
        {
          type: "tip",
          kind: "analogy",
          text: "마트료시카 인형. 열수록 작은 인형이 나오고, 가장 작은 인형(base case)에서 멈춰 다시 하나씩 닫으며 올라온다.",
        },
        { type: "h2", text: "factorial 로 보는 재귀" },
        {
          type: "compare",
          cols: [
            { title: "풀어 쓰면", items: ["n! = n × (n-1) × … × 1", "5! = 5 × 4 × 3 × 2 × 1 = 120"] },
            { title: "재귀로 쓰면", items: ["n! = n × (n-1)!", "더 작은 입력의 같은 문제"] },
          ],
        },
        {
          type: "code",
          code: "def factorial(n):\n    if n == 1:\n        return 1\n    else:\n        return n * factorial(n - 1)\n\nprint(factorial(5))",
          out: "120",
        },
        { type: "h2", text: "호출은 내려가고, 값은 거꾸로 올라온다" },
        {
          type: "table",
          head: ["내려가기 (호출)", "올라오기 (값 조합)"],
          rows: [
            ["f(5) = 5 * f(4)", "f(5) = 5 * 24 = 120"],
            ["f(4) = 4 * f(3)", "f(4) = 4 * 6 = 24"],
            ["f(3) = 3 * f(2)", "f(3) = 3 * 2 = 6"],
            ["f(2) = 2 * f(1)", "f(2) = 2 * 1 = 2"],
            ["f(1) = 1 ← base case (수렴)", "여기서 되돌아가기 시작"],
          ],
        },
        {
          type: "code",
          code: "def factorial(n):\n    print('호출', n)\n    if n == 1:\n        return 1\n    result = n * factorial(n - 1)\n    print('반환', n, result)\n    return result\n\nfactorial(3)",
          out: "호출 3\n호출 2\n호출 1\n반환 2 2\n반환 3 6",
        },
        {
          type: "p",
          text: "f(3), f(2), f(1) 은 전부 같은 문제를 다른 input 으로 해결한다. 문제를 작은 단위로 분할하고, 결과를 조합해 최종 결과를 낸다.",
        },
        { type: "h2", text: "특징과 쓰는 이유" },
        {
          type: "compare",
          cols: [
            { title: "📝 자연스러운 표현", items: ["복잡한 문제를 간결·직관적으로", "변수 사용이 줄고 가독성 ↑"] },
            { title: "✂️ 코드 간결성", items: ["상황에 따라 반복문보다 간결·명확"] },
            { title: "➗ 수학적 문제 해결", items: ["수학적 정의가 재귀적이면 그대로 구현"] },
          ],
        },
        {
          type: "code",
          code: "# 반복문 버전\ndef fact_loop(n):\n    result = 1\n    for i in range(1, n + 1):\n        result *= i\n    return result\n\n# 재귀 버전: 수학 정의 n! = n × (n-1)! 그대로\ndef fact_rec(n):\n    if n == 1:\n        return 1\n    return n * fact_rec(n - 1)\n\nprint(fact_loop(5), fact_rec(5))",
          out: "120 120",
        },
        {
          type: "tip",
          kind: "warn",
          text: "`if n == 1` 을 빼먹거나 `factorial(n)` 처럼 입력이 줄지 않으면 끝없이 부르다 RecursionError.",
        },
        {
          type: "list",
          style: "check",
          items: ["종료 조건(base case)은 1개 이상, 명확히", "반복 호출은 종료 조건을 향해 수렴", "base case 에서 결과가 거꾸로 올라오며 조합된다"],
        },
      ],
    },
    {
      id: "n-py-4-4",
      emoji: "🧰",
      title: "내장 함수: len·sum·sorted, map, zip",
      summary: "import 없이 바로 쓰는 함수들 — map 은 하나씩 적용, zip 은 짝 맞추기",
      blocks: [
        { type: "key", text: "`map` 은 요소마다 함수 적용, `zip` 은 앞에서부터 짝짓기" },
        { type: "h2", text: "자주 쓰는 내장 함수" },
        {
          type: "code",
          code: "numbers = [1, 2, 3, 4, 5]\n\nprint(len(numbers))\nprint(max(numbers))\nprint(min(numbers))\nprint(sum(numbers))\nprint(sorted(numbers, reverse=True))",
          out: "5\n5\n1\n15\n[5, 4, 3, 2, 1]",
        },
        {
          type: "compare",
          cols: [
            { title: "`sorted(reverse=True)`", items: ["정렬 후 뒤집기", "내림차순"] },
            { title: "`[::-1]`", items: ["정렬 없이 그냥 거꾸로"] },
          ],
        },
        {
          type: "tip",
          kind: "memo",
          text: "`sorted(reverse=True)` 와 `[::-1]` 은 같은 게 아니다! sorted 는 정렬 후 뒤집기(내림차순), `[::-1]` 은 그냥 거꾸로 뒤집는 것.",
        },
        { type: "h2", text: "map(function, iterable)" },
        {
          type: "p",
          text: "iterable 의 모든 요소에 함수를 적용해 map object 로 반환한다. 인자로 '함수'를 받는다.",
        },
        {
          type: "code",
          code: "numbers = [1, 2, 3]\nresult = map(str, numbers)\nprint(result)\nprint(list(result))",
          out: "<map object at 0x...>\n['1', '2', '3']",
        },
        {
          type: "code",
          code: "# SWEA 문제처럼 '1 2 3' 이 입력될 때\nnumbers1 = input().split()                  # ['1', '2', '3'] 문자열 그대로\nnumbers2 = list(map(int, input().split()))  # [1, 2, 3] 전부 int",
        },
        {
          type: "tip",
          kind: "memo",
          text: "iterable = 반복 가능한 객체(요소) → 대표적으로 컬렉션(Collection).",
        },
        { type: "h2", text: "zip(*iterables)" },
        {
          type: "p",
          text: "여러 iterable 을 모아 튜플을 원소로 하는 zip object 를 반환한다. `*` 는 개수 제한 없음.",
        },
        {
          type: "code",
          code: "girls = ['jane', 'ashley']\nboys = ['peter', 'jay']\nprint(list(zip(girls, boys)))",
          out: "[('jane', 'peter'), ('ashley', 'jay')]",
        },
        {
          type: "compare",
          cols: [
            {
              title: "여러 리스트 동시 조회",
              items: ["`for s in zip(kr, math, en):`", "→ (10, 20, 40) (20, 40, 20) …"],
            },
            {
              title: "2차원 리스트 같은 열끼리",
              items: ["`for s in zip(*scores):`", "→ (10, 40, 20) (20, 50, 40) …"],
            },
          ],
        },
        {
          type: "code",
          code: "kr = [10, 20, 30, 50]\nmath = [20, 40, 50, 70]\nen = [40, 20, 30, 50]\nfor student_scores in zip(kr, math, en):\n    print(student_scores)\n\nscores = [[10, 20, 30], [40, 50, 39], [20, 40, 50]]\nfor score in zip(*scores):\n    print(score)",
          out: "(10, 20, 40)\n(20, 40, 20)\n(30, 50, 30)\n(50, 70, 50)\n(10, 40, 20)\n(20, 50, 40)\n(30, 39, 50)",
        },
        {
          type: "tip",
          kind: "memo",
          text: "`[('jane', 'peter')]` → 튜플 사용. 2차원 리스트는 IM 문제에 자주 나옴.",
        },
        {
          type: "tip",
          kind: "warn",
          text: "map·zip 을 그냥 `print` 하면 `<map object ...>` 만 보인다. `list()` 로 감쌀 것. 한 번 꺼내 쓴 map/zip 객체는 비어서 두 번 못 쓴다.",
        },
        {
          type: "list",
          style: "check",
          items: [
            "`len` `max` `min` `sum` `sorted` 는 import 없이 바로",
            "`map(함수, iterable)` 은 요소마다 적용, `list(map(int, input().split()))` 이 단골",
            "`zip(*2차원리스트)` 는 같은 열끼리 묶기",
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
        { type: "key", text: "이름은 Local → Enclosed → Global → Built-in 순서로 찾는다" },
        { type: "h2", text: "local scope 와 global scope" },
        {
          type: "compare",
          cols: [
            { title: "global scope", items: ["코드 어디서든 참조 가능", "여기 정의 = global variable"] },
            { title: "local scope", items: ["함수가 만든 scope, 함수 내부에서만", "여기 정의 = local variable"] },
          ],
        },
        {
          type: "code",
          code: "def func():\n    num = 20\n    print('local', num)\n\nfunc()\nprint('global', num)",
          out: "local 20\nNameError: name 'num' is not defined",
        },
        {
          type: "tip",
          kind: "memo",
          text: "함수는 코드 내부에 local scope 를 생성하며, 그 외 공간인 global scope 로 구분. num 은 local 쪽에서 죽음(수명이) — 변수의 수명주기와 연관.",
        },
        {
          type: "table",
          head: ["scope", "수명주기 (lifecycle)"],
          rows: [
            ["built-in", "파이썬이 실행된 이후부터 영원히"],
            ["global", "모듈이 호출된 시점 이후 혹은 인터프리터가 끝날 때까지"],
            ["local", "함수가 호출될 때 생성, 종료될 때까지"],
          ],
        },
        { type: "h2", text: "이름 검색 규칙 LEGB" },
        {
          type: "list",
          style: "flow",
          items: [
            "Local: 함수 안",
            "Enclosed: 한 단계 위 함수",
            "Global: 최상단",
            "Built-in: 정의 없이 쓸 수 있는 모든 것",
          ],
        },
        {
          type: "p",
          text: "이름(식별자)은 이름공간(namespace)에 저장된다. 바깥 scope 변수는 접근만 되고 수정은 안 된다.",
        },
        {
          type: "code",
          code: "# 퀴즈: 어디서 찾아오나?\na = 1\nb = 2\n\ndef enclosed():\n    a = 10\n    c = 3\n\n    def local(c):\n        print(a, b, c)  # a 는 E, b 는 G, c 는 L(매개변수)\n\n    local(500)\n    print(a, b, c)\n\nenclosed()\nprint(a, b)",
          out: "10 2 500\n10 2 3\n1 2",
        },
        {
          type: "code",
          code: "# 내장 함수를 덮어쓰면?\nprint(sum(range(3)))\nsum = 5  # global 에 sum 이 생김 → G 가 B 보다 먼저 검색됨\nprint(sum(range(3)))\n# 되돌리려면 del sum 으로 변수를 지운 뒤 진행",
          out: "3\nTypeError: 'int' object is not callable",
        },
        {
          type: "tip",
          kind: "warn",
          text: "`sum` `max` `list` `str` 같은 내장 함수 이름을 변수명으로 쓰지 말 것. 조용히 덮어써지고 한참 뒤에 'int object is not callable' 로 터진다.",
        },
        { type: "h2", text: "global 키워드" },
        {
          type: "code",
          code: "num = 0  # 전역 변수\n\ndef increment():\n    global num  # num 을 전역 변수로 선언\n    num += 1\n\nprint(num)\nincrement()\nprint(num)",
          out: "0\n1",
        },
        {
          type: "table",
          head: ["주의", "에러"],
          rows: [
            ["선언 전에 참조 불가 (`print(num)` 뒤 `global num`)", "SyntaxError: name 'num' is used prior to global declaration"],
            ["매개변수엔 사용 불가 (`def increment(num): global num`)", "SyntaxError: name 'num' is parameter and global"],
          ],
        },
        {
          type: "list",
          style: "check",
          items: [
            "local 은 호출 때 생겨 종료 때 사라진다",
            "L → E → G → B, 바깥 변수는 읽기만",
            "안에서 전역을 고치려면 `global num`",
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
        { type: "key", text: "`*` 는 묶기도 풀기도, `**` 는 dict 를 키워드 인자로 풀기" },
        { type: "h2", text: "Packing: 여러 값을 변수 하나에" },
        {
          type: "code",
          code: "packed_values = 1, 2, 3, 4, 5\nprint(packed_values)\n\n# * 로 '남은 요소' 패킹\nnumbers = [1, 2, 3, 4, 5]\na, *b, c = numbers\nprint(a)\nprint(b)\nprint(c)",
          out: "(1, 2, 3, 4, 5)\n1\n[2, 3, 4]\n5",
        },
        {
          type: "tip",
          kind: "memo",
          text: "변수에 담긴 값들은 하나의 튜플(tuple)로 묶임. `*b` 는 남은 요소들을 리스트로 패킹해서 할당한 경우.",
        },
        {
          type: "p",
          text: "`print(1, 2, 3, 4, 5)` 처럼 인자를 몇 개든 받는 이유. 공식 문서 `print(*objects, sep=' ', end='\\n', ...)` 의 `*objects` 가 튜플 하나로 패킹한다.",
        },
        { type: "h2", text: "Unpacking: 묶인 값을 개별 변수로" },
        {
          type: "code",
          code: "packed_values = 1, 2, 3, 4, 5\na, b, c, d, e = packed_values\nprint(a, b, c, d, e)\n\ndef my_function(x, y, z):\n    print(x, y, z)\n\nnames = ['alice', 'jane', 'peter']\nmy_function(*names)    # 리스트 요소 → 위치 인자\n\nmy_dict = {'x': 1, 'y': 2, 'z': 3}\nmy_function(**my_dict)  # 키-값 → 키워드 인자",
          out: "1 2 3 4 5\nalice jane peter\n1 2 3",
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
            ["`*`", "패킹", "여러 인자를 하나의 튜플로 (`def f(*args)`)"],
            ["`*`", "언패킹", "시퀀스·반복 가능 객체를 요소로 풀어 인자로 (`f(*list)`)"],
            ["`**`", "언패킹", "딕셔너리 키-값 쌍을 풀어 키워드 인자로 (`f(**dict)`)"],
          ],
        },
        {
          type: "code",
          code: "def show(*args, **kwargs):  # 받을 때: 패킹\n    print(args, kwargs)\n\nshow(*[1, 2], **{'a': 3})  # 넘길 때: 언패킹",
          out: "(1, 2) {'a': 3}",
        },
        {
          type: "tip",
          kind: "warn",
          text: "`**my_dict` 의 키 이름은 매개변수 이름과 같아야 한다. `{'x':1, 'y':2, 'w':3}` 을 `my_function(**d)` 에 넣으면 'unexpected keyword argument w'.",
        },
        {
          type: "list",
          style: "check",
          items: [
            "`a = 1, 2, 3` 은 tuple, `a, *b, c = ...` 의 b 는 리스트",
            "`f(*리스트)` 는 위치 인자, `f(**딕셔너리)` 는 키워드 인자",
            "print 가 인자를 몇 개든 받는 이유 = `*objects`",
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
        { type: "key", text: "`lambda 매개변수: 표현식` 한 줄짜리 이름 없는 함수" },
        {
          type: "tip",
          kind: "analogy",
          text: "lambda 는 포스트잇. 정식 문서(def)로 보관할 것 없이 그 자리에서 한 번 쓰고 버린다.",
        },
        { type: "h2", text: "구조" },
        {
          type: "table",
          head: ["부분", "역할"],
          rows: [
            ["`lambda`", "람다 함수 선언 키워드"],
            ["매개변수", "여러 개면 쉼표로 구분"],
            ["표현식", "결과값을 반환하는 '표현식'으로 작성 (return 안 씀)"],
          ],
        },
        {
          type: "code",
          code: "# def 버전\ndef addition(x, y):\n    return x + y\n\n# lambda 버전 (같은 일)\naddition = lambda x, y: x + y\n\nresult = addition(3, 5)\nprint(result)",
          out: "8",
        },
        { type: "h2", text: "활용: map 과 함께" },
        {
          type: "code",
          code: "numbers = [1, 2, 3, 4, 5]\n\ndef square(x):\n    return x**2\n\n# lambda 미사용\nsquared1 = list(map(square, numbers))\nprint(squared1)\n\n# lambda 사용: def square 를 통째로 대체\nsquared2 = list(map(lambda x: x**2, numbers))\nprint(squared2)",
          out: "[1, 4, 9, 16, 25]\n[1, 4, 9, 16, 25]",
        },
        {
          type: "compare",
          cols: [
            { title: "def", items: ["이름이 있음", "여러 곳에서 다시 호출", "복잡한 로직"] },
            { title: "lambda", items: ["익명, 한 줄", "그 자리에서 한 번", "함수를 매개변수로 넘길 때"] },
          ],
        },
        {
          type: "tip",
          kind: "warn",
          text: "lambda 안에는 `return` `if` 문 `for` 문 같은 '문장'을 못 쓴다. 값 하나로 계산되는 표현식만. 복잡해지면 def 로.",
        },
        {
          type: "list",
          style: "check",
          items: [
            "return 생략, 표현식 결과가 곧 반환값",
            "`map(lambda x: x**2, numbers)` 처럼 함수를 인자로 넘길 때",
            "재사용·복잡하면 def",
          ],
        },
      ],
    },
  ],
};
