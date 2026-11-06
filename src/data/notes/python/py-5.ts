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
        { type: "key", text: "모듈 = 변수·함수를 묶은 .py 파일" },
        {type: "figure", kind: "tree", root: {icon: "📄", label: "`math.py`", sub: "모듈"}, children: [{icon: "📥", label: "`import math`", leaves: ["`math.pi`"]}, {icon: "🎯", label: "`from math import pi`", leaves: ["`pi`"]}, {icon: "🏷️", label: "`as`", leaves: ["별명 붙이기"]}]},
        { type: "h2", text: "모듈(Module)과 두 가지 가져오기" },
        {
          type: "p",
          text: "특정한 기능을 하는 코드가 작성된 파이썬 파일. `math` 는 파이썬이 미리 작성해 둔 수학 관련 내장 모듈.",
        },
        {
          type: "compare",
          cols: [
            { title: "import 문", items: ["`import math`", "`모듈명.이름` 으로 사용", "`math.sqrt(4)`"] },
            { title: "from 절", items: ["`from math import sqrt`", "이름을 바로 사용", "`sqrt(4)`"] },
          ],
        },
        {
          type: "code",
          code: `import math

print(math.pi)       # 모듈명.변수명
print(math.sqrt(4))  # 모듈명.함수명

from math import sqrt

print(sqrt(4))`,
          out: "3.141592653589793\n2.0\n2.0",
        },
        {
          type: "tip",
          kind: "memo",
          text: "math.py 라는 모듈을 import 해옴. `import math` 방식이 더 좋음 — 조금 더 명시적임.",
        },
        {
          type: "p",
          text: "`.`(dot) 연산자: \"점의 왼쪽 객체에서 점의 오른쪽 이름을 찾아라\".",
        },
        { type: "h2", text: "같은 이름은 마지막 import 가 이긴다" },
        {
          type: "code",
          code: `# my_math 는 직접 만든 모듈(my_math.py)이라고 가정
from math import pi, sqrt
from my_math import sqrt   # 뒤의 sqrt 로 덮어써짐

from math import *         # 모든 요소를 한 번에: 비권장

from math import sqrt
from my_math import sqrt as my_sqrt

sqrt(4)     # math 의 sqrt
my_sqrt(4)  # my_math 의 sqrt`,
        },
        {
          type: "compare",
          cols: [
            {
              title: "문제",
              tone: "bad",
              items: [
                "다른 모듈이 같은 이름의 함수를 제공",
                "마지막에 import 된 이름으로 대체됨",
                "`from math import *` 는 뭐가 들어왔는지 안 보여 소리 없이 덮어씀",
              ],
            },
            {
              title: "해결",
              tone: "good",
              items: [
                "`as` 키워드로 별칭 부여",
                "동일한 이름의 변수·함수·클래스를 함께 쓸 수 있음",
                "`import math` + `math.sqrt` 로 출처 남기기",
              ],
            },
          ],
        },
        { type: "h2", text: "모듈 안에 뭐가 들었나: help()" },
        {
          type: "p",
          text: "`help(math)` 는 NAME, DESCRIPTION, FUNCTIONS(예: `acos(x, /)` Return the arc cosine …) 순으로 설명서를 보여 준다. 함수 하나만 볼 수도 있다.",
        },
        {
          type: "code",
          code: `import math
help(math.sqrt)`,
          out: "Help on built-in function sqrt in module math:\n\nsqrt(x, /)\n    Return the square root of x.",
        },
        {
          type: "list",
          style: "check",
          items: [
            "`import 모듈` 후 `모듈.이름` 으로 사용",
            "`from 모듈 import 이름` 은 같은 이름을 마지막 import 가 덮어씀 → `*` 비권장",
            "충돌은 `as 별칭`, 내용물은 `help(모듈)`",
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
        { type: "key", text: "패키지 = 모듈 폴더, 외부 패키지는 pip 로 설치" },
        {type: "figure", kind: "stack", nested: true, layers: [{icon: "📦", label: "패키지", sub: "폴더"}, {icon: "📄", label: "모듈", sub: "`.py` 파일"}, {icon: "⚙️", label: "함수·변수", sub: "실제 도구"}], caption: "외부 패키지는 `pip install` 로 받아 온다"},
        { type: "h2", text: "표준 라이브러리와 패키지" },
        {
          type: "compare",
          cols: [
            { title: "📚 표준 라이브러리(PSL)", items: ["파이썬 언어와 함께 제공", "다양한 모듈과 패키지의 모음"] },
            {
              title: "🗂️ 패키지",
              items: ["연관된 모듈들을 하나의 디렉토리에 모은 것", "이름공간을 구분해 충돌 방지", "모듈을 효율적으로 관리·재사용"],
            },
          ],
        },
        {
          type: "code",
          code: `# 패키지 3개(my_package, math, statistics), 모듈 2개(my_math, tools)
# sample.py
# my_package/
#   math/my_math.py        -> def add(x, y): return x + y
#   statistics/tools.py    -> def mod(x, y): return x % y

# sample.py
from my_package.math import my_math
from my_package.statistics import tools

print(my_math.add(1, 2))
print(tools.mod(1, 2))`,
          out: "3\n1",
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
          type: "code",
          code: `import math       # 내장: 바로 된다
import requests   # 외부: pip install 전이면 에러`,
          out: "ModuleNotFoundError: No module named 'requests'",
        },
        {
          type: "tip",
          kind: "memo",
          text: "외부 패키지는 pip 를 사용하여 설치 후 import 필요 — pip 를 빨간 글씨로 강조.",
        },
        { type: "h2", text: "pip: 파이썬 패키지 관리자" },
        {
          type: "p",
          text: "외부 패키지를 설치(삭제도 가능)하는 패키지 관리 시스템. PyPI(Python Package Index)에 저장된 패키지를 받아 온다.",
        },
        {
          type: "code",
          code: `# 터미널(셸) 명령
$ pip install SomePackage          # 최신 버전
$ pip install SomePackage==1.0.5   # 특정 버전
$ pip install SomePackage>=1.0.4   # 최소 버전

$ pip install requests`,
        },
        {
          type: "list",
          style: "flow",
          items: [
            "터미널에서 `pip install requests` (글로벌에 설치됨)",
            "코드에서 `import requests`",
            "`requests.get(url).json()`: URL 에 요청 → 응답 JSON(딕셔너리처럼 생긴 문자열) → dict",
          ],
        },
        {
          type: "tip",
          kind: "memo",
          text: "requests — 개발자들이 가장 많이 쓰는 모듈. 터미널에서 `pip install requests` 하면 글로벌에 설치됨. 실습: jsonplaceholder 사용자 10명의 name·company·lat·lng 뽑기.",
        },
        {
          type: "list",
          style: "check",
          items: [
            "`from 패키지.하위 import 모듈` 로 내려간다",
            "내부는 바로 import, 외부는 `pip install` 후 import",
            "`==` 특정 버전, `>=` 최소 버전",
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
        { type: "key", text: "위에서부터 차례로 검사, 처음 True 인 블록 하나만" },
        {type: "figure", kind: "flow", nodes: [{icon: "❓", label: "`if` 조건 A"}, {icon: "❓", label: "`elif` 조건 B"}, {icon: "🔚", label: "`else`", sub: "아무것도 아니면"}], edges: ["거짓이면", "거짓이면"], caption: "처음 참인 블록 하나만 실행"},
        { type: "h2", text: "제어문 3종류" },
        {
          type: "compare",
          cols: [
            { title: "🔀 조건문", items: ["`if` `elif` `else`", "조건에 따라 블록 실행"] },
            { title: "🔁 반복문", items: ["`for` `while`", "반복해서 실행"] },
            { title: "🚦 반복 제어", items: ["`break` `continue` `pass`", "반복을 제어"] },
          ],
        },
        { type: "h2", text: "if 문 기본 구조" },
        {
          type: "code",
          code: `# if 표현식:
#     코드 블록
# elif 표현식:
#     코드 블록
# else:
#     코드 블록

a = 5

if a > 3:
    print('3 초과')
else:
    print('3 이하')

print(a)`,
          out: "3 초과\n5",
        },
        {
          type: "list",
          style: "flow",
          items: ["`a > 3` 평가", "True → '3 초과' / False → '3 이하' (`a = 3` 이면 '3 이하')", "두 길 모두 `print(a)` 에서 다시 만남"],
        },
        { type: "tip", kind: "memo", text: "if statement 의 기본 구조." },
        { type: "h2", text: "복수 조건문: 순차적으로 비교" },
        {
          type: "code",
          code: `dust = 35

if dust > 150:
    print('매우 나쁨')
elif dust > 80:
    print('나쁨')
elif dust > 30:
    print('보통')
else:
    print('좋음')`,
          out: "보통",
        },
        {
          type: "list",
          style: "flow",
          items: ["`> 150` → False", "`> 80` → False", "`> 30` → 처음 True, '보통' 출력 후 끝"],
        },
        { type: "h2", text: "중첩 조건문" },
        {
          type: "code",
          code: `dust = 480

if dust > 150:
    print('매우 나쁨')
    if dust > 300:
        print('위험해요! 나가지 마세요!')
elif dust > 80:
    print('나쁨')
elif dust > 30:
    print('보통')
else:
    print('좋음')`,
          out: "매우 나쁨\n위험해요! 나가지 마세요!",
        },
        {
          type: "tip",
          kind: "warn",
          text: "`dust > 30` 을 맨 위에 쓰면 480 도 '보통'에서 끝난다. 좁은(큰 값) 조건부터 쓸 것.",
        },
        {
          type: "list",
          style: "check",
          items: ["`if 조건:` 참이면 실행, `else:` 는 나머지 전부", "`elif` 는 순차 검사, 처음 True 하나만", "조건 안에 조건을 들여쓰면 중첩"],
        },
      ],
    },
    {
      id: "n-py-5-4",
      emoji: "🔁",
      title: "for 반복문과 순회",
      summary: "iterable 의 항목을 순서대로 하나씩 변수에 담아 블록을 실행한다",
      blocks: [
        { type: "key", text: "들어 있는 순서대로 하나씩 꺼내 블록 실행" },
        {type: "figure", kind: "cycle", nodes: [{icon: "🧺", label: "하나 꺼냄"}, {icon: "⚙️", label: "블록 실행", ink: "blue"}, {icon: "❓", label: "남았나?", ink: "red"}]},
        { type: "h2", text: "기본 구조와 작동 원리" },
        {
          type: "code",
          code: `# for 변수 in 반복 가능한 객체:
#     코드 블록

items = ['apple', 'banana', 'coconut']

for item in items:
    print(item)`,
          out: "apple\nbanana\ncoconut",
        },
        {
          type: "list",
          style: "flow",
          items: ["`for item in items`: 첫 항목을 반복 변수 item 에 할당 → 블록 실행", "2번째 항목 할당 → 다시 실행", "… 마지막 요소까지"],
        },
        {
          type: "p",
          text: "반복 가능한 객체(iterable): 반복문에서 순회할 수 있는 객체. 시퀀스뿐 아니라 dict, set 등도 포함.",
        },
        { type: "tip", kind: "memo", text: "for statement 의 기본 구조. 변수 → 임시변수라고도 불림." },
        { type: "h2", text: "문자열·range·딕셔너리 순회" },
        {
          type: "code",
          code: `for char in 'Korea':
    print(char)

for i in range(5):
    print(i)

my_dict = {'x': 10, 'y': 20, 'z': 30}
for key in my_dict:        # key 가 나온다
    print(key, my_dict[key])`,
          out: "K\no\nr\ne\na\n0\n1\n2\n3\n4\nx 10\ny 20\nz 30",
        },
        { type: "h2", text: "요소 바꾸기, 번호 붙이기" },
        {
          type: "code",
          code: `numbers = [4, 6, 10, -8, 5]
for i in range(len(numbers)):
    numbers[i] = numbers[i] * 2
print(numbers)

fruits = ['apple', 'banana', 'cherry']
for index, fruit in enumerate(fruits):
    print(index, fruit)
for index, fruit in enumerate(fruits, 3):
    print(index, fruit)`,
          out: "[8, 12, 20, -16, 10]\n0 apple\n1 banana\n2 cherry\n3 apple\n4 banana\n5 cherry",
        },
        {
          type: "compare",
          cols: [
            { title: "`for n in numbers: n *= 2`", tone: "bad", items: ["`for item in numbers` 의 item 은 요소를 잠깐 가리키는 임시 이름표", "새 값으로 갈아 끼워도 리스트는 안 바뀜"] },
            { title: "`for i in range(len(numbers))`", tone: "good", items: ["`range(len(numbers))` 인덱스로 칸에 직접 접근", "`for i in range(len(numbers)): numbers[i] *= 2` 는 리스트가 바뀜"] },
          ],
        },
        {
          type: "p",
          text: "`enumerate(iterable, start=0)`: 각 요소를 (index, 요소) 튜플로 돌려주는 내장 함수.",
        },
        { type: "h2", text: "중첩 반복문 / 중첩 리스트 순회" },
        {
          type: "code",
          code: `outers = ['A', 'B']
inners = ['c', 'd']
for outer in outers:
    for inner in inners:
        print(outer, inner)

elements = [['A', 'B'], ['c', 'd']]
for elem in elements:
    print(elem)        # 바깥만: 안쪽 리스트가 통째로
for elem in elements:
    for item in elem:
        print(item)    # 중첩해야 안쪽까지`,
          out: "A c\nA d\nB c\nB d\n['A', 'B']\n['c', 'd']\nA\nB\nc\nd",
        },
        {
          type: "tip",
          kind: "memo",
          text: "안쪽 반복문은 outers 리스트의 각 항목에 대해 한 번씩 실행됨. print 가 호출되는 횟수 ⇒ len(outers) × len(inners).",
        },
        {
          type: "list",
          style: "check",
          items: [
            "`for 변수 in iterable:` 하나씩 담아 실행",
            "요소를 고치려면 인덱스, 번호가 필요하면 `enumerate`",
            "중첩 for 실행 횟수 = 바깥 길이 × 안쪽 길이",
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
        { type: "key", text: "조건이 거짓이 될 때까지 반복, 종료 조건 필수" },
        {type: "figure", kind: "cycle", nodes: [{icon: "❓", label: "조건 검사", ink: "red"}, {icon: "⚙️", label: "블록 실행", ink: "blue"}, {icon: "✏️", label: "값 바꾸기", sub: "종료 조건으로", ink: "green"}]},
        { type: "h2", text: "while 문 기본 구조" },
        {
          type: "code",
          code: `# while 조건식:
#     코드 블록

a = 0

while a < 3:
    print(a)
    a += 1

print('끝')`,
          out: "0\n1\n2\n끝",
        },
        {
          type: "list",
          style: "flow",
          items: ["`a` 가 0, 1, 2 → `a < 3` True → 출력, `a += 1`", "`a` 가 3 → `a < 3` False → 탈출"],
        },
        {
          type: "tip",
          kind: "memo",
          text: "while statement 의 기본 구조. while — 주어진 조건식이 거짓이 될 때까지 반복.",
        },
        { type: "h2", text: "사용자 입력에 따른 반복" },
        {
          type: "code",
          code: `number = int(input('양의 정수를 입력해주세요.: '))

while number <= 0:
    if number < 0:
        print('음수를 입력했습니다.')
    else:
        print('0은 양의 정수가 아닙니다.')

    number = int(input('양의 정수를 입력해주세요.: '))

print('잘했습니다!')`,
          out: "양의 정수를 입력해주세요.: 0\n0은 양의 정수가 아닙니다.\n양의 정수를 입력해주세요.: -1\n음수를 입력했습니다.\n양의 정수를 입력해주세요.: 1\n잘했습니다!",
        },
        {
          type: "p",
          text: "양의 정수가 들어올 때까지 되묻는다. 반복 안에서 `number` 를 다시 입력받는 줄이 종료 조건을 향해 가는 장치.",
        },
        { type: "tip", kind: "memo", text: "※ while 문은 반드시 종료 조건이 필요." },
        { type: "h2", text: "for vs while" },
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
          text: "조건 변수를 바꾸는 줄(`a += 1`, `number = int(input())`)을 빼먹으면 무한 루프.",
        },
        {
          type: "list",
          style: "check",
          items: ["`while 조건식:` 참인 동안 반복", "조건 변수를 바꾸는 줄 = 종료 조건", "횟수가 정해졌으면 for, 조건에 달렸으면 while"],
        },
      ],
    },
    {
      id: "n-py-5-6",
      emoji: "🚦",
      title: "반복 제어: break / continue / pass",
      summary: "break 는 즉시 중지, continue 는 다음 바퀴로, pass 는 아무것도 안 함",
      blocks: [
        { type: "key", text: "break 정지, continue 다음 바퀴, pass 그냥 통과" },
        {type: "figure", kind: "tree", root: {icon: "🔁", label: "반복 중에"}, children: [{icon: "🛑", label: "`break`", sub: "반복 끝", ink: "red"}, {icon: "⏭️", label: "`continue`", sub: "다음 바퀴", ink: "blue"}, {icon: "🫥", label: "`pass`", sub: "아무것도 안 함"}]},
        { type: "h2", text: "세 키워드" },
        {
          type: "p",
          text: "for·while 은 매 반복마다 본문 전체를 실행한다. 일부만 실행해야 할 때 쓰는 키워드.",
        },
        {
          type: "compare",
          cols: [
            { title: "break", items: ["반복을 즉시 중지"] },
            { title: "continue", items: ["남은 코드를 건너뛰고 다음 반복으로"] },
            { title: "pass", items: ["아무 동작도 하지 않고 넘어감"] },
          ],
        },
        {
          type: "code",
          code: `for i in range(10):
    if i == 5:
        break
    print(i)`,
          out: "0\n1\n2\n3\n4",
        },
        {
          type: "code",
          code: `for i in range(10):
    if i % 2 == 0:
        continue
    print(i)`,
          out: "1\n3\n5\n7\n9",
        },
        { type: "h2", text: "break 활용: 종료 조건, 첫 번째만 찾기" },
        {
          type: "code",
          code: `number = int(input('양의 정수를 입력해주세요.: '))
while number <= 0:
    if number == -9999:
        print('프로그램을 종료합니다.')
        break
    if number < 0:
        print('음수를 입력했습니다.')
    else:
        print('0은 양의 정수가 아닙니다.')
    number = int(input('양의 정수를 입력해주세요.: '))
print('잘했습니다!')`,
          out: "양의 정수를 입력해주세요.: -9999\n프로그램을 종료합니다.\n잘했습니다!",
        },
        {
          type: "code",
          code: `numbers = [1, 3, 5, 6, 7, 9, 10, 11]
found_even = False
for num in numbers:
    if num % 2 == 0:
        print('첫 번째 짝수를 찾았습니다:', num)
        found_even = True
        break
if not found_even:
    print('짝수를 찾지 못했습니다')`,
          out: "첫 번째 짝수를 찾았습니다: 6",
        },
        {
          type: "tip",
          kind: "memo",
          text: "break 로 프로그램 종료 조건 만들기 / 리스트에서 첫 번째 짝수만 찾은 후 반복 종료하기. continue 는 현재 반복문의 남은 코드를 건너뛰고 다음 반복으로 넘어감 — 홀수만 출력하기에 활용.",
        },
        {
          type: "tip",
          kind: "warn",
          text: "break 는 가장 안쪽 반복문 하나만 빠져나온다. 바깥까지 끊으려면 `found_even` 같은 플래그 변수로 바깥에서 다시 확인.",
        },
        { type: "h2", text: "pass: 빈 자리 채우개" },
        {
          type: "code",
          code: `for i in range(10):
    pass  # 아무 작업도 안 함`,
        },
        {
          type: "table",
          head: ["상황", "예"],
          rows: [
            ["코드 작성 중 미완성 부분 (나중에 구현, 그동안 오류 안 남)", "`def my_function(): pass`"],
            ["조건문에서 아무 동작도 안 해야 할 때", "`if condition: pass` / `else: 다른 동작`"],
            ["무한 루프에서 조건이 충족되지 않을 때 계속 진행", "`while True:` 안에서 `break` / `pass` / 그 외 처리"],
          ],
        },
        {
          type: "p",
          text: "파이썬은 블록을 비워 둘 수 없다. 콜론 뒤 들여쓰기 코드가 하나는 있어야 해서 pass 로 채운다.",
        },
        {
          type: "list",
          style: "check",
          items: [
            "`break` 중지, `continue` 다음 바퀴, `pass` 아무것도 안 함",
            "break + 플래그 변수 = 첫 번째만 찾고 끝내기",
            "pass 는 미완성 함수·빈 조건 블록 자리 채우기",
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
        { type: "key", text: "빈 리스트 + append 4줄을 한 줄로" },
        {type: "figure", kind: "flow", nodes: [{icon: "📋", label: "빈 리스트 + for + append", sub: "4줄"}, {icon: "✨", label: "`[x*2 for x in nums]`", sub: "1줄", ink: "green"}], edges: ["줄이기"]},
        { type: "h2", text: "구조와 사용 전/후" },
        {
          type: "p",
          text: "`[expression for 변수 in iterable]`, 조건은 뒤에 `if 조건식`. `list(expression for 변수 in iterable)` 도 같은 결과.",
        },
        {
          type: "code",
          code: `# 사용 전
numbers = [1, 2, 3, 4, 5]
squared_numbers = []
for num in numbers:
    squared_numbers.append(num**2)
print(squared_numbers)`,
          out: "[1, 4, 9, 16, 25]",
        },
        {
          type: "code",
          code: `# 사용 후
squared_numbers = [num**2 for num in numbers]
print(squared_numbers)

# 조건 붙이기: 홀수만
result = [i for i in range(10) if i % 2 == 1]
print(result)`,
          out: "[1, 4, 9, 16, 25]\n[1, 3, 5, 7, 9]",
        },
        {
          type: "p",
          text: "`append(num**2)` 의 `num**2` 가 앞으로, `for num in numbers` 가 뒤로 간다.",
        },
        {
          type: "tip",
          kind: "memo",
          text: "List Comprehension 구조. `[ ]` → 리스트. 파이썬에서만 리스트라 부르고 다른 언어에서는 배열(array)이라 부름.",
        },
        { type: "h2", text: "2차원 배열(인접행렬) 만들기" },
        {
          type: "code",
          code: `data1 = [[0] * 5 for _ in range(5)]

# 또는
data2 = [[0 for _ in range(5)] for _ in range(5)]

print(data1)`,
          out: "[[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]]",
        },
        {
          type: "tip",
          kind: "memo",
          text: "2차원 배열 생성 시(인접행렬 생성 시). `[0] * 5` 가 `[0, 0, 0, 0, 0]` 한 줄이고, 그걸 5번 만든다.",
        },
        {
          type: "code",
          code: `data = [[0] * 3] * 3   # 안쪽 리스트 하나를 3번 참조
data[0][0] = 1
print(data)`,
          out: "[[1, 0, 0], [1, 0, 0], [1, 0, 0]]",
        },
        {
          type: "compare",
          cols: [
            { title: "`[[0] * 5] * 5`", tone: "bad", items: ["같은 안쪽 리스트 하나를 5번 참조", "`data[0][0] = 1` 하면 모든 행 첫 칸이 1"] },
            { title: "`[[0] * 5 for _ in range(5)]`", tone: "good", items: ["행마다 새 리스트", "한 칸만 바뀜"] },
          ],
        },
        { type: "h2", text: "남용하지 말자: 가독성이 먼저" },
        {
          type: "table",
          head: ["방법", "성능·특징"],
          rows: [
            ["list comprehension", "대부분 가장 빠르고 파이썬스러움(Pythonic)"],
            ["map", "기존 함수를 쓸 때 비슷하거나 약간 빠를 수 있음"],
            ["loop", "가장 느리다고 알려졌지만 버전이 오르며 비슷하거나 더 나은 경우도. 복잡한 로직엔 여전히 유용"],
          ],
        },
        {
          type: "tip",
          kind: "memo",
          text: "`[i for i in range(10) if i % 2 == 1]` 과 for 문 4줄 중 어느 쪽이 가독성이 좋아 보이나? — 왼쪽(한 줄)보단 오른쪽(for 문)이 가독성이 좋아 보인다.",
        },
        {
          type: "list",
          style: "check",
          items: [
            "`[식 for 변수 in iterable if 조건]`",
            "2차원 배열은 `[[0] * n for _ in range(n)]`, `* n` 으로 바깥 복제 금지",
            "\"Simple is better than complex\": 성능 차이는 미미, 가독성·유지보수성 우선",
          ],
        },
      ],
    },
  ],
};
