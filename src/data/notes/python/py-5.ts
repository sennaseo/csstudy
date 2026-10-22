// 파이썬 단원 5 — 함수와 제어문 2 (노션 SSAFY 파이썬 강의 정리본). 작성 규칙은 ../python.ts 상단 주석.
import type { NoteUnit } from "../types";

export const PY5: NoteUnit = {
  id: "py-5",
  title: "함수와 제어문 2",
  notes: [
    {
      id: "n-py-5-1",
      emoji: "📚",
      title: "모듈: import 와 from, as",
      summary: "모듈 = 변수·함수를 묶은 파이썬 파일 — 점(.)으로 안의 이름을 꺼내 쓴다",
      blocks: [
        {
          type: "tip",
          kind: "analogy",
          text: "모듈은 공구 상자다. `import math` 는 'math 라는 상자를 작업대에 올려라', `math.sqrt` 는 '그 상자(점 왼쪽)에서 sqrt 라는 공구(점 오른쪽)를 꺼내라'. `from math import sqrt` 는 공구 하나만 미리 꺼내 손에 쥐는 것.",
        },
        { type: "h2", text: "모듈(Module)이란" },
        {
          type: "p",
          text: "한 파일로 묶인 변수와 함수의 모음. 특정한 기능을 하는 코드가 작성된 파이썬 파일이다. 예를 들어 `math` 는 파이썬이 미리 작성해 둔 수학 관련 변수와 함수가 들어 있는 내장 모듈.",
        },
        {
          type: "code",
          code: "# 1) import 문 — 모듈명.이름 으로 사용\nimport math\n\nprint(math.pi)       # 결과: 3.141592653589793  (모듈명.변수명)\nprint(math.sqrt(4))  # 결과: 2.0                (모듈명.함수명)\n\n# 2) from 절 — 이름을 바로 사용\nfrom math import sqrt\n\nprint(sqrt(4))  # 결과: 2.0",
        },
        {
          type: "tip",
          kind: "memo",
          text: "math.py 라는 모듈을 import 해옴. `import math` 방식이 더 좋음 — 조금 더 명시적임.",
        },
        {
          type: "p",
          text: "`.`(dot) 연산자의 뜻: \"점의 왼쪽 객체에서 점의 오른쪽 이름을 찾아라\".",
        },
        { type: "h2", text: "주의: 같은 이름이 충돌하면 마지막 import 가 이긴다" },
        {
          type: "code",
          code: "# my_math 는 내가 직접 만든 모듈(my_math.py)이라고 가정 — 없으면 ModuleNotFoundError\nfrom math import pi, sqrt\nfrom my_math import sqrt   # 뒤에 import 된 sqrt 로 덮어써진다\n\n# 그래서 모듈 안 모든 요소를 한 번에 가져오는 * 표기는 권장하지 않음\nfrom math import *\n\n# 해결: as 로 별칭 부여\nfrom math import sqrt\nfrom my_math import sqrt as my_sqrt\n\nsqrt(4)     # math 의 sqrt\nmy_sqrt(4)  # my_math 의 sqrt",
        },
        {
          type: "list",
          items: [
            "서로 다른 모듈이 같은 이름의 함수를 제공하면 문제 발생 → 마지막에 import 된 이름으로 대체됨",
            "`as` 키워드: 별칭을 부여해 두 개 이상의 모듈에서 동일한 이름의 변수·함수·클래스를 가져올 때 생기는 이름 충돌을 해결",
          ],
        },
        { type: "h2", text: "참고: 모듈 안에 뭐가 들었나 — help()" },
        {
          type: "p",
          text: "내장 함수 `help(math)` 를 찍으면 NAME, DESCRIPTION, FUNCTIONS(예: `acos(x, /)` Return the arc cosine …) 순으로 모듈 설명서가 나온다. 어떤 함수가 있는지 모를 때 먼저 열어 보는 목차.",
        },
        {
          type: "tip",
          kind: "warn",
          text: "`from math import *` 는 편해 보이지만 어떤 이름이 들어왔는지 안 보여서, 내 변수나 다른 모듈 이름을 소리 없이 덮어쓴다. `import math` 로 쓰고 `math.sqrt` 처럼 출처를 남기는 게 안전하다.",
        },
        { type: "h2", text: "3줄 정리" },
        {
          type: "list",
          items: [
            "모듈 = 변수·함수를 담은 .py 파일, `import 모듈` 후 `모듈.이름` 으로 사용",
            "`from 모듈 import 이름` 은 바로 쓰지만, 같은 이름은 마지막 import 가 덮어쓴다 → `*` 비권장",
            "충돌은 `as 별칭` 으로 해결, 내용물은 `help(모듈)` 로 확인",
          ],
        },
      ],
    },
    {
      id: "n-py-5-2",
      emoji: "🗂️",
      title: "패키지와 표준 라이브러리, pip",
      summary: "패키지 = 모듈을 모은 폴더. 내장은 바로 import, 외부는 pip install 먼저",
      blocks: [
        {
          type: "tip",
          kind: "analogy",
          text: "모듈이 공구 상자라면 패키지는 상자들을 모아 둔 선반이고, 표준 라이브러리는 파이썬이 처음부터 갖춰 둔 공구실이다. 공구실에 없는 건 pip 라는 택배로 PyPI 창고에서 받아 온다.",
        },
        { type: "h2", text: "표준 라이브러리와 패키지" },
        {
          type: "list",
          items: [
            "파이썬 표준 라이브러리(PSL): 파이썬 언어와 함께 제공되는 다양한 모듈과 패키지의 모음",
            "패키지: 연관된 모듈들을 하나의 디렉토리에 모아 놓은 것",
            "사용 목적: 모듈들의 이름공간을 구분해 충돌을 방지하고, 모듈을 효율적으로 관리·재사용하도록 돕는다",
          ],
        },
        {
          type: "code",
          code: "# 디렉토리 구조 — 패키지 3개(my_package, math, statistics), 모듈 2개(my_math, tools)\n# sample.py\n# my_package/\n#   math/my_math.py        -> def add(x, y): return x + y\n#   statistics/tools.py    -> def mod(x, y): return x % y\n\n# sample.py — 각 패키지의 모듈을 import 해서 사용\nfrom my_package.math import my_math\nfrom my_package.statistics import tools\n\nprint(my_math.add(1, 2))  # 결과: 3\nprint(tools.mod(1, 2))    # 결과: 1",
        },
        { type: "h2", text: "내부 패키지 vs 외부 패키지" },
        {
          type: "table",
          head: ["구분", "설치", "사용"],
          rows: [
            ["PSL 내부 패키지", "설치 없음", "바로 `import`"],
            ["외부 패키지", "`pip` 로 설치", "설치 후 `import`"],
          ],
        },
        {
          type: "tip",
          kind: "memo",
          text: "외부 패키지는 pip 를 사용하여 설치 후 import 필요 — pip 를 빨간 글씨로 강조.",
        },
        { type: "h2", text: "pip: 파이썬 패키지 관리자" },
        {
          type: "p",
          text: "외부 패키지를 설치(삭제도 가능)하도록 도와주는 파이썬의 패키지 관리 시스템. PyPI(Python Package Index)에 저장된 외부 패키지들을 설치한다. 최신 버전 / 특정 버전 / 최소 버전을 명시할 수 있다.",
        },
        {
          type: "code",
          code: "# 터미널(셸)에서 치는 명령 — 파이썬 코드가 아니다\n$ pip install SomePackage          # 최신 버전\n$ pip install SomePackage==1.0.5   # 특정 버전\n$ pip install SomePackage>=1.0.4   # 최소 버전\n\n$ pip install requests             # 예: requests 외부 패키지 설치",
        },
        {
          type: "p",
          text: "설치한 뒤에는 `import requests` 로 쓴다. `requests.get(url).json()` 처럼 URL 에 요청을 보내고 응답을 JSON(딕셔너리와 비슷하게 생긴 문자열 형태) → dict 로 바꿔 받는 흐름이 실습(jsonplaceholder 사용자 10명의 name·company·lat·lng 뽑기)의 뼈대였다.",
        },
        {
          type: "tip",
          kind: "memo",
          text: "requests — 개발자들이 가장 많이 쓰는 모듈. 터미널에서 `pip install requests` 하면 글로벌에 설치됨.",
        },
        {
          type: "tip",
          kind: "warn",
          text: "`import requests` 에서 ModuleNotFoundError 가 나면 코드 문제가 아니라 설치를 안 한 것. 외부 패키지는 반드시 `pip install` 이 먼저다.",
        },
        { type: "h2", text: "3줄 정리" },
        {
          type: "list",
          items: [
            "패키지 = 모듈을 모은 디렉토리, `from 패키지.하위 import 모듈` 로 내려간다",
            "표준 라이브러리(내부)는 바로 import, 외부 패키지는 `pip install` 후 import",
            "pip 는 PyPI 에서 받아 오며 `==` 특정 버전, `>=` 최소 버전 지정 가능",
          ],
        },
      ],
    },
    {
      id: "n-py-5-3",
      emoji: "🔀",
      title: "조건문 if / elif / else",
      summary: "조건이 True 인 블록만 실행 — elif 는 동시가 아니라 위에서부터 순차 검사",
      blocks: [
        {
          type: "tip",
          kind: "analogy",
          text: "조건문은 갈림길 표지판이다. '3보다 크면 왼쪽, 아니면 오른쪽'. elif 가 여러 개면 표지판을 위에서부터 차례로 읽다가 처음 맞는 길로 들어가고, 나머지 표지판은 보지도 않는다.",
        },
        { type: "h2", text: "제어문이란" },
        {
          type: "p",
          text: "코드의 실행 흐름을 제어하는 구문. 조건에 따라 코드 블록을 실행하거나(조건문 if·elif·else), 반복적으로 실행하거나(반복문 for·while), 반복을 제어한다(break·continue·pass).",
        },
        { type: "h2", text: "if 문 기본 구조" },
        {
          type: "code",
          code: "# if 표현식:\n#     코드 블록\n# elif 표현식:\n#     코드 블록\n# else:\n#     코드 블록\n\na = 5\n\nif a > 3:\n    print('3 초과')\nelse:\n    print('3 이하')\n\nprint(a)\n# 결과: 3 초과\n#       5",
        },
        {
          type: "p",
          text: "주어진 조건식을 평가해 참(True)인 경우에만 코드 블록을 실행하거나 건너뛴다. 순서도로 보면 `a > 3` 에서 True 면 '3 초과' 쪽, False 면 '3 이하' 쪽으로 갈라졌다가 둘 다 `print(a)` 에서 다시 만난다. `a = 3` 이면 False 경로라 '3 이하'.",
        },
        {
          type: "tip",
          kind: "memo",
          text: "if statement 의 기본 구조.",
        },
        { type: "h2", text: "복수 조건문: 순차적으로 비교" },
        {
          type: "code",
          code: "dust = 35\n\nif dust > 150:\n    print('매우 나쁨')\nelif dust > 80:\n    print('나쁨')\nelif dust > 30:\n    print('보통')\nelse:\n    print('좋음')\n# 결과: 보통",
        },
        {
          type: "p",
          text: "조건식을 동시에 검사하는 게 아니라 \"순차적\"으로 비교한다. 35 는 `> 150` 도 `> 80` 도 아니고 `> 30` 에서 처음 True 가 되어 '보통'이 찍힌 뒤 끝난다.",
        },
        { type: "h2", text: "중첩 조건문" },
        {
          type: "code",
          code: "dust = 480\n\nif dust > 150:\n    print('매우 나쁨')\n    if dust > 300:\n        print('위험해요! 나가지 마세요!')\nelif dust > 80:\n    print('나쁨')\nelif dust > 30:\n    print('보통')\nelse:\n    print('좋음')\n# 결과: 매우 나쁨\n#       위험해요! 나가지 마세요!",
        },
        {
          type: "tip",
          kind: "warn",
          text: "elif 순서를 `dust > 30` 부터 쓰면 480 도 '보통'에서 걸려 끝난다. 순차 검사라서 넓은 조건을 위에 두면 아래 조건은 영원히 안 걸린다 — 좁은(큰 값) 조건부터 쓸 것.",
        },
        { type: "h2", text: "3줄 정리" },
        {
          type: "list",
          items: [
            "`if 조건:` 참이면 실행, `else:` 는 나머지 전부",
            "`elif` 는 위에서부터 순차 검사 → 처음 True 인 블록 하나만 실행",
            "조건 안에 조건을 들여쓰기로 넣으면 중첩 조건문",
          ],
        },
      ],
    },
    {
      id: "n-py-5-4",
      emoji: "🔁",
      title: "for 반복문과 순회",
      summary: "iterable 의 항목을 순서대로 하나씩 변수에 담아 블록을 실행한다",
      blocks: [
        {
          type: "tip",
          kind: "analogy",
          text: "for 문은 줄 서 있는 손님을 한 명씩 창구로 부르는 것이다. `for item in items` 는 '줄(items)에서 다음 손님을 item 이라는 창구 의자에 앉히고, 처리(코드 블록)하고, 다음 손님' — 줄이 끝날 때까지.",
        },
        { type: "h2", text: "for 문 기본 구조와 작동 원리" },
        {
          type: "code",
          code: "# for 변수 in 반복 가능한 객체:\n#     코드 블록\n\nitems = ['apple', 'banana', 'coconut']\n\nfor item in items:\n    print(item)\n# 결과: apple\n#       banana\n#       coconut",
        },
        {
          type: "list",
          items: [
            "임의의 시퀀스의 항목들을 그 시퀀스에 들어 있는 순서대로 반복",
            "리스트 첫 항목이 반복 변수에 할당되고 코드 블록 실행 → 2번째 항목 할당, 다시 실행 → … 마지막 요소까지",
            "반복 가능한 객체(iterable): 반복문에서 순회할 수 있는 객체. 시퀀스뿐 아니라 dict, set 등도 포함",
          ],
        },
        {
          type: "tip",
          kind: "memo",
          text: "for statement 의 기본 구조. 변수 → 임시변수라고도 불림.",
        },
        { type: "h2", text: "여러 가지 순회" },
        {
          type: "code",
          code: "# 문자열 순회\nfor char in 'Korea':\n    print(char)  # 결과: K o r e a (한 줄에 하나씩)\n\n# range 순회\nfor i in range(5):\n    print(i)  # 결과: 0 1 2 3 4\n\n# 딕셔너리 순회 — key 가 나온다\nmy_dict = {'x': 10, 'y': 20, 'z': 30}\nfor key in my_dict:\n    print(key, my_dict[key])  # 결과: x 10 / y 20 / z 30\n\n# 인덱스로 리스트 순회 — 요소를 '변경'할 때\nnumbers = [4, 6, 10, -8, 5]\nfor i in range(len(numbers)):\n    numbers[i] = numbers[i] * 2\nprint(numbers)  # 결과: [8, 12, 20, -16, 10]\n\n# enumerate — 인덱스와 요소를 같이 (start 로 시작 번호 지정)\nfruits = ['apple', 'banana', 'cherry']\nfor index, fruit in enumerate(fruits):\n    print(index, fruit)  # 결과: 0 apple / 1 banana / 2 cherry\nfor index, fruit in enumerate(fruits, 3):\n    print(index, fruit)  # 결과: 3 apple / 4 banana / 5 cherry",
        },
        {
          type: "p",
          text: "`for item in numbers` 는 요소의 '복사된 값'을 받으므로 리스트 자체를 고치려면 인덱스(`range(len(numbers))`)로 접근해야 한다. `enumerate(iterable, start=0)` 은 각 요소를 (index, 요소) 튜플로 돌려주는 내장 함수.",
        },
        { type: "h2", text: "중첩된 반복문 / 중첩 리스트 순회" },
        {
          type: "code",
          code: "outers = ['A', 'B']\ninners = ['c', 'd']\nfor outer in outers:\n    for inner in inners:\n        print(outer, inner)\n# 결과: A c / A d / B c / B d\n\nelements = [['A', 'B'], ['c', 'd']]\nfor elem in elements:\n    print(elem)      # 결과: ['A', 'B'] / ['c', 'd']  (바깥만 돌면 안쪽 리스트가 통째로)\nfor elem in elements:\n    for item in elem:\n        print(item)  # 결과: A / B / c / d  (안쪽까지 들어가려면 중첩 반복)",
        },
        {
          type: "tip",
          kind: "memo",
          text: "안쪽 반복문은 outers 리스트의 각 항목에 대해 한 번씩 실행됨. print 가 호출되는 횟수 ⇒ len(outers) × len(inners).",
        },
        {
          type: "tip",
          kind: "warn",
          text: "`for i in range(len(numbers)): numbers[i] *= 2` 는 되지만 `for n in numbers: n *= 2` 는 리스트가 안 바뀐다. n 은 요소를 가리키는 임시 이름표라, n 을 새 값으로 갈아 끼워도 리스트 칸은 그대로다.",
        },
        { type: "h2", text: "3줄 정리" },
        {
          type: "list",
          items: [
            "`for 변수 in iterable:` — 항목을 순서대로 하나씩 변수에 담아 블록 실행",
            "문자열·range·dict(key)·리스트 전부 순회 가능, 요소를 고치려면 인덱스로, 번호가 필요하면 `enumerate`",
            "중첩 for 의 실행 횟수 = 바깥 길이 × 안쪽 길이, 2차원 리스트는 중첩으로 파고든다",
          ],
        },
      ],
    },
    {
      id: "n-py-5-5",
      emoji: "⏳",
      title: "while 반복문, for 와 while 고르기",
      summary: "조건이 참인 동안 반복 — 종료 조건이 없으면 영원히 돈다",
      blocks: [
        {
          type: "tip",
          kind: "analogy",
          text: "for 는 '손님 10명 처리'처럼 횟수가 정해진 일, while 은 '물이 끓을 때까지 지켜보기'처럼 언제 끝날지 모르는 일이다. 불을 끄는 조건(종료 조건)을 안 만들면 냄비가 타 버린다.",
        },
        { type: "h2", text: "while 문 기본 구조" },
        {
          type: "code",
          code: "# while 조건식:\n#     코드 블록\n\na = 0\n\nwhile a < 3:\n    print(a)\n    a += 1\n\nprint('끝')\n# 결과: 0\n#       1\n#       2\n#       끝   (3바퀴 돈다)",
        },
        {
          type: "p",
          text: "주어진 조건식이 참인 동안 코드를 반복해서 실행한다 == 조건식이 거짓이 될 때까지 반복. `a` 가 0, 1, 2 일 때 돌고 3 이 되는 순간 `a < 3` 이 False 라 빠져나온다.",
        },
        {
          type: "tip",
          kind: "memo",
          text: "while statement 의 기본 구조. while — 주어진 조건식이 거짓이 될 때까지 반복.",
        },
        { type: "h2", text: "사용자 입력에 따른 반복" },
        {
          type: "code",
          code: "number = int(input('양의 정수를 입력해주세요.: '))\n\nwhile number <= 0:\n    if number < 0:\n        print('음수를 입력했습니다.')\n    else:\n        print('0은 양의 정수가 아닙니다.')\n\n    number = int(input('양의 정수를 입력해주세요.: '))\n\nprint('잘했습니다!')\n\n# 결과 (0, -1, 1 을 차례로 입력):\n# 0은 양의 정수가 아닙니다.\n# 음수를 입력했습니다.\n# 잘했습니다!",
        },
        {
          type: "p",
          text: "양의 정수가 들어올 때까지 계속 되묻는다. 반복 안에서 `number` 를 다시 입력받는 줄이 바로 종료 조건을 향해 가는 장치다.",
        },
        {
          type: "tip",
          kind: "memo",
          text: "※ while 문은 반드시 종료 조건이 필요.",
        },
        { type: "h2", text: "for vs while — 언제 무엇을" },
        {
          type: "table",
          head: ["", "for", "while"],
          rows: [
            ["동작", "iterable 의 요소를 하나씩 순회하며 반복", "주어진 조건식이 참인 동안 반복"],
            ["유용한 경우", "반복 횟수가 명확하게 정해진 경우", "반복 횟수가 불명확하거나 조건에 따라 종료해야 할 때"],
            ["예", "리스트·튜플·문자열 같은 시퀀스 데이터 처리", "사용자 입력을 받아 특정 조건이 충족될 때까지 반복"],
          ],
        },
        {
          type: "tip",
          kind: "warn",
          text: "while 안에서 조건에 쓰인 변수를 바꾸는 줄(`a += 1`, `number = int(input())`)을 빼먹으면 조건이 영원히 True 라 무한 루프. 실행 전에 '이 변수가 언제 조건을 거짓으로 만드나' 한 번 확인.",
        },
        { type: "h2", text: "3줄 정리" },
        {
          type: "list",
          items: [
            "`while 조건식:` — 참인 동안 반복, 거짓이 되는 순간 탈출",
            "반복 안에서 조건 변수를 바꿔 주는 줄 = 종료 조건, 반드시 필요",
            "횟수가 정해졌으면 for, 조건에 달렸으면 while",
          ],
        },
      ],
    },
    {
      id: "n-py-5-6",
      emoji: "🚦",
      title: "반복 제어: break / continue / pass",
      summary: "break 는 즉시 중지, continue 는 다음 바퀴로, pass 는 아무것도 안 함",
      blocks: [
        {
          type: "tip",
          kind: "analogy",
          text: "러닝머신을 돌리는 중에 break 는 정지 버튼(아예 내려옴), continue 는 '이번 구간은 건너뛰고 다음 구간부터', pass 는 버튼을 누르는 시늉만 하고 그대로 계속 뛰는 것이다.",
        },
        { type: "h2", text: "세 키워드" },
        {
          type: "p",
          text: "for 문과 while 은 매 반복마다 본문 안 모든 코드를 실행하지만, 때때로 일부만 실행하는 것이 필요할 때가 있다.",
        },
        {
          type: "code",
          code: "# break — 반복을 즉시 중지\nfor i in range(10):\n    if i == 5:\n        break\n    print(i)  # 결과: 0 1 2 3 4\n\n# continue — 다음 반복으로 건너뜀\nfor i in range(10):\n    if i % 2 == 0:\n        continue\n    print(i)  # 결과: 1 3 5 7 9\n\n# pass — 아무런 동작도 수행하지 않고 넘어감\nfor i in range(10):\n    pass  # 아무 작업도 안 함",
        },
        { type: "h2", text: "break 활용: 종료 조건 만들기, 첫 번째만 찾기" },
        {
          type: "code",
          code: "# 1) -9999 를 입력하면 프로그램 종료\nnumber = int(input('양의 정수를 입력해주세요.: '))\nwhile number <= 0:\n    if number == -9999:\n        print('프로그램을 종료합니다.')\n        break\n    if number < 0:\n        print('음수를 입력했습니다.')\n    else:\n        print('0은 양의 정수가 아닙니다.')\n    number = int(input('양의 정수를 입력해주세요.: '))\nprint('잘했습니다!')\n# 결과 (-9999 입력): 프로그램을 종료합니다. / 잘했습니다!\n\n# 2) 리스트에서 첫 번째 짝수만 찾고 반복 종료\nnumbers = [1, 3, 5, 6, 7, 9, 10, 11]\nfound_even = False\nfor num in numbers:\n    if num % 2 == 0:\n        print('첫 번째 짝수를 찾았습니다:', num)\n        found_even = True\n        break\nif not found_even:\n    print('짝수를 찾지 못했습니다')\n# 결과: 첫 번째 짝수를 찾았습니다: 6",
        },
        {
          type: "tip",
          kind: "memo",
          text: "break 로 프로그램 종료 조건 만들기 / 리스트에서 첫 번째 짝수만 찾은 후 반복 종료하기. continue 는 현재 반복문의 남은 코드를 건너뛰고 다음 반복으로 넘어감 — 홀수만 출력하기에 활용.",
        },
        { type: "h2", text: "pass 를 쓰는 세 가지 상황" },
        {
          type: "list",
          ordered: true,
          items: [
            "코드 작성 중 미완성 부분 — `def my_function(): pass` 구현할 부분이 나중에 추가될 수 있고, 그동안 오류가 나지 않음",
            "조건문에서 아무 동작도 수행하지 않아야 할 때 — `if condition: pass` / `else: 다른 동작`",
            "무한 루프에서 조건이 충족되지 않을 때 루프를 계속 진행 — `while True:` 안에서 `break` / `pass` / 그 외 처리로 갈라 쓰기",
          ],
        },
        {
          type: "p",
          text: "파이썬은 블록을 비워 둘 수 없다. 콜론 뒤에 들여쓰기 된 코드가 하나는 있어야 하는데, '아직 없음'을 표현하는 자리 채우개가 pass 다.",
        },
        {
          type: "tip",
          kind: "warn",
          text: "break 는 '가장 안쪽' 반복문 하나만 빠져나온다. 중첩 for 에서 안쪽에 break 를 써도 바깥 for 는 계속 돈다. 바깥까지 끊으려면 `found_even` 같은 플래그 변수로 바깥에서 다시 확인해야 한다.",
        },
        { type: "h2", text: "3줄 정리" },
        {
          type: "list",
          items: [
            "`break` 반복 즉시 중지, `continue` 남은 코드 건너뛰고 다음 바퀴, `pass` 아무것도 안 함",
            "break + 플래그 변수 = '첫 번째 것만 찾고 끝내기' 패턴",
            "pass 는 미완성 함수·빈 조건 블록·무한 루프 자리 채우기",
          ],
        },
      ],
    },
    {
      id: "n-py-5-7",
      emoji: "🧮",
      title: "List Comprehension",
      summary: "[식 for 변수 in iterable if 조건] — 한 줄로 리스트 만들기, 남용 금지",
      blocks: [
        {
          type: "tip",
          kind: "analogy",
          text: "컴프리헨션은 '재료 하나씩 꺼내(for) → 손질해서(expression) → 새 바구니에 담기'를 한 줄 레시피로 적은 것이다. 빈 바구니를 준비하고 append 로 하나씩 넣던 4줄짜리 과정을 압축한 셈.",
        },
        { type: "h2", text: "구조와 사용 전/후" },
        {
          type: "code",
          code: "# [expression for 변수 in iterable]\n# [expression for 변수 in iterable if 조건식]\n# list(expression for 변수 in iterable) 도 같은 결과\n\n# 사용 전\nnumbers = [1, 2, 3, 4, 5]\nsquared_numbers = []\nfor num in numbers:\n    squared_numbers.append(num**2)\nprint(squared_numbers)  # 결과: [1, 4, 9, 16, 25]\n\n# 사용 후\nsquared_numbers = [num**2 for num in numbers]\nprint(squared_numbers)  # 결과: [1, 4, 9, 16, 25]\n\n# 조건 붙이기 — 홀수만\nresult = [i for i in range(10) if i % 2 == 1]\nprint(result)  # 결과: [1, 3, 5, 7, 9]",
        },
        {
          type: "p",
          text: "간결하고 효율적인 리스트 생성 방법. `append(num**2)` 의 `num**2` 가 앞으로 나오고, `for num in numbers` 가 뒤에 붙는다고 보면 된다.",
        },
        {
          type: "tip",
          kind: "memo",
          text: "List Comprehension 구조. `[ ]` → 리스트. 파이썬에서만 리스트라 부르고 다른 언어에서는 배열(array)이라 부름.",
        },
        { type: "h2", text: "활용: 2차원 배열(인접행렬) 만들기" },
        {
          type: "code",
          code: "data1 = [[0] * 5 for _ in range(5)]\n\n# 또는\ndata2 = [[0 for _ in range(5)] for _ in range(5)]\n\nprint(data1)\n# 결과: [[0, 0, 0, 0, 0],\n#        [0, 0, 0, 0, 0],\n#        [0, 0, 0, 0, 0],\n#        [0, 0, 0, 0, 0],\n#        [0, 0, 0, 0, 0]]",
        },
        {
          type: "tip",
          kind: "memo",
          text: "2차원 배열 생성 시(인접행렬 생성 시). `[0] * 5` 가 `[0, 0, 0, 0, 0]` 한 줄이고, 그걸 5번 만든다.",
        },
        { type: "h2", text: "남용하지 말자 — 가독성이 먼저" },
        {
          type: "list",
          items: [
            "\"Simple is better than complex\", \"Keep it simple, stupid\" — 컴프리헨션 한 줄보다 평범한 for 문이 더 읽기 쉬울 때가 많다",
            "성능 비교: ① list comprehension 대부분 가장 빠르고 파이썬스러움(Pythonic) ② map 은 기존 함수를 쓸 때 비슷하거나 약간 빠를 수 있음 ③ loop 는 가장 느리다고 알려졌지만 버전이 오르며 비슷하거나 더 나은 경우도 있고, 복잡한 로직엔 여전히 유용",
            "결론: 성능 차이는 대부분 미미 → 가독성과 유지보수성을 고려해 상황에 맞게 선택",
          ],
        },
        {
          type: "tip",
          kind: "memo",
          text: "`[i for i in range(10) if i % 2 == 1]` 과 for 문 4줄 중 어느 쪽이 가독성이 좋아 보이나? — 왼쪽(한 줄)보단 오른쪽(for 문)이 가독성이 좋아 보인다.",
        },
        {
          type: "tip",
          kind: "warn",
          text: "2차원 배열을 `[[0] * 5] * 5` 로 만들면 안 된다. 같은 안쪽 리스트 하나를 5번 참조하는 거라 `data[0][0] = 1` 하면 모든 행의 첫 칸이 1 로 바뀐다. 행마다 새 리스트를 만들려면 반드시 `for _ in range(5)` 컴프리헨션.",
        },
        { type: "h2", text: "3줄 정리" },
        {
          type: "list",
          items: [
            "`[식 for 변수 in iterable if 조건]` — 빈 리스트 + append 반복을 한 줄로",
            "`[[0] * n for _ in range(n)]` 이 2차원 배열(인접행렬) 단골 — `* n` 으로 바깥을 복제하면 안 됨",
            "성능 차이는 미미하니 가독성 우선, 복잡하면 그냥 for 문",
          ],
        },
      ],
    },
  ],
};
