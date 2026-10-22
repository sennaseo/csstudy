// 파이썬 단원 6 — 데이터 구조 1 (노션 SSAFY 파이썬 강의 정리본). 작성 규칙은 ../python.ts 상단 주석.
import type { NoteUnit } from "../types";

export const PY6: NoteUnit = {
  id: "py-6",
  title: "데이터 구조 1",
  notes: [
    {
      id: "n-py-6-1",
      emoji: "🧰",
      title: "자료구조와 메서드",
      summary: "데이터를 담는 그릇(자료구조)마다 전용 도구(메서드)가 딸려 있다",
      blocks: [
        { type: "key", text: "그릇(자료구조)마다 전용 도구(메서드)가 있다" },
        { type: "h2", text: "자료구조(Data Structure)" },
        {
          type: "p",
          text: "여러 데이터를 효율적으로 저장·관리하려고 나눠 놓은 구조. 컴퓨터 공학에서는 '자료 구조'라고 부른다.",
        },
        {
          type: "compare",
          cols: [
            { title: "단순 구조", items: ["정수, 실수", "문자, 문자열"] },
            { title: "선형 구조", items: ["순차 리스트", "연결 리스트(단순·이중·원형)", "스택, 큐, 덱"] },
            { title: "비선형 구조", items: ["트리(일반·이진)", "그래프(방향·무방향)"] },
            { title: "파일 구조", items: ["순차 파일, 색인 파일", "직접 파일"] },
          ],
        },
        {
          type: "tip",
          kind: "analogy",
          text: "자료구조는 주방 수납함, 메서드는 그 수납함에 딸려 나오는 전용 도구(냉장고의 제빙기 버튼).",
        },
        { type: "h2", text: "메서드 = 클래스에 속한 함수" },
        {
          type: "tip",
          kind: "memo",
          text: "메서드는 어딘가(클래스)에 속해 있는 '함수'이며, 각 데이터 타입별로 다양한 기능을 가진 메서드가 존재한다. '함수'라는 말을 빨간 글씨로 강조했음.",
        },
        {
          type: "list",
          items: [
            "클래스 내부에 정의된 함수. 객체의 상태를 조작하거나 동작을 수행",
            "클래스 = 파이썬에서 타입을 표현하는 방법. 이미 은연중에 써 왔다",
            "`help(str)` 을 찍으면 `class str(object)` 가 나온다. 문자열도 클래스 (클래스 챕터에서 자세히)",
          ],
        },
        {
          type: "code",
          code: "s = 'hello'\nprint(type(s))\nprint(s.upper())",
          out: "<class 'str'>\nHELLO",
        },
        { type: "h2", text: "호출: 객체.메서드()" },
        {
          type: "code",
          code: "# 문자열 메서드\nprint('hello'.capitalize())\n\n# 리스트 메서드\nnumbers = [1, 2, 3]\nnumbers.append(4)\nprint(numbers)",
          out: "Hello\n[1, 2, 3, 4]",
        },
        {
          type: "compare",
          cols: [
            { title: "`'hello'`", items: ["데이터 타입 객체", "점(.) = 이 객체의 도구함을 연다"] },
            { title: "`.capitalize()`", items: ["메서드", "`()` 를 붙여야 실행"] },
          ],
        },
        {
          type: "tip",
          kind: "warn",
          text: "`capitalize` 처럼 괄호 없이 쓰면 호출이 아니라 도구를 가리키기만 한 상태.",
        },
        {
          type: "list",
          style: "check",
          items: ["자료구조 = 데이터를 저장·관리하는 그릇", "메서드 = 타입(클래스)에 속한 함수", "호출은 `객체.메서드()`"],
        },
      ],
    },
    {
      id: "n-py-6-2",
      emoji: "🔍",
      title: "문자열 조회·탐색·검증 메서드",
      summary: "find/index 는 위치 찾기, is~ 는 참/거짓 판정",
      blocks: [
        { type: "key", text: "find 는 없으면 -1, index 는 없으면 에러" },
        { type: "h2", text: "메서드 표" },
        {
          type: "table",
          head: ["메서드", "설명"],
          rows: [
            ["`s.find(x)`", "x 의 첫 번째 위치를 반환. 없으면 -1"],
            ["`s.index(x)`", "x 의 첫 번째 위치를 반환. 없으면 오류"],
            ["`s.isupper()`", "모두 대문자인지"],
            ["`s.islower()`", "모두 소문자인지"],
            ["`s.isalpha()`", "알파벳 문자인지 (유니코드 Letter, 한국어도 포함)"],
          ],
        },
        {
          type: "tip",
          kind: "memo",
          text: "is 가 붙은 메서드의 공통점 → 반환값이 '맞냐 아니냐'(True/False).",
        },
        { type: "h2", text: "find vs index" },
        {
          type: "code",
          code: "print('banana'.find('a'))\nprint('banana'.find('z'))\n\nprint('banana'.index('a'))\nprint('banana'.index('z'))",
          out: "1\n-1\n1\nValueError: substring not found",
        },
        {
          type: "tip",
          kind: "warn",
          text: "`find` 가 준 -1 을 그대로 인덱싱하면 `s[-1]`, 마지막 글자가 나온다.",
        },
        { type: "h2", text: "isupper / islower / isalpha" },
        {
          type: "code",
          code: "string1 = 'HELLO'\nstring2 = 'Hello'\nprint(string1.isupper())\nprint(string2.isupper())\nprint(string1.islower())\nprint(string2.islower())\n\nprint('Hello'.isalpha())\nprint('123'.isalpha())",
          out: "True\nFalse\nFalse\nFalse\nTrue\nFalse",
        },
        {
          type: "p",
          text: "`'Hello'` 는 대소문자가 섞여 isupper 도 islower 도 False. '전부' 대문자/소문자여야 True.",
        },
        {
          type: "list",
          style: "check",
          items: ["`find` 없으면 -1, `index` 없으면 ValueError", "`is~` 는 전부 True/False", "`isalpha` 는 한글 같은 유니코드 글자도 True"],
        },
      ],
    },
    {
      id: "n-py-6-3",
      emoji: "✂️",
      title: "문자열 조작 메서드 (새 문자열 반환)",
      summary: "문자열은 불변이라 원본은 그대로, 바뀐 '복사본'을 돌려준다",
      blocks: [
        { type: "key", text: "원본은 그대로, 고친 새 문자열을 돌려준다" },
        {
          type: "tip",
          kind: "memo",
          text: "문자열은 불변 데이터 타입이기 때문에 원본을 바꿀 수가 없어서, 원본을 조작한 결과물을 새로운 문자열로 반환하는 것.",
        },
        { type: "h2", text: "조작 메서드 표" },
        {
          type: "table",
          head: ["메서드", "설명"],
          rows: [
            ["`s.replace(old, new[,count])`", "바꿀 대상 글자를 새 글자로 바꿔서 반환"],
            ["`s.strip([chars])`", "시작과 끝의 공백이나 특정 문자를 제거"],
            ["`s.split(sep=None, maxsplit=-1)`", "공백이나 특정 문자를 기준으로 분리 → 리스트"],
            ["`'sep'.join(iterable)`", "구분자로 iterable 의 문자열을 연결"],
            ["`s.capitalize()`", "가장 첫 글자만 대문자로"],
            ["`s.title()`", "띄어쓰기 기준 각 단어 첫 글자 대문자, 나머지 소문자"],
            ["`s.upper()` / `s.lower()`", "모두 대문자 / 모두 소문자"],
            ["`s.swapcase()`", "대↔소문자 서로 바꿈"],
          ],
        },
        {
          type: "tip",
          kind: "memo",
          text: "표의 대괄호 `[ ]` 안 인자 = 선택 인자(안 넣어도 됨). 빨간 괄호로 강조된 replace·strip·split·join 네 개가 핵심.",
        },
        {
          type: "code",
          code: "s = 'hello wORLD'\nprint(s.capitalize())\nprint(s.title())\nprint(s.upper())\nprint(s.lower())\nprint(s.swapcase())",
          out: "Hello world\nHello World\nHELLO WORLD\nhello world\nHELLO World",
        },
        { type: "h2", text: "핵심 4개" },
        {
          type: "code",
          code: "text = 'Hello, world!'\nprint(text.replace('world', 'Python'))\n\nprint('   Hello, world!   '.strip())\n\nwords = text.split(',')\nprint(words)\n\nprint('-'.join(['Hello', 'world!']))",
          out: "Hello, Python!\nHello, world!\n['Hello', ' world!']\nHello-world!",
        },
        {
          type: "compare",
          cols: [
            { title: "`split`", items: ["문자열 → 리스트", "`text.split(',')`"] },
            { title: "`join`", items: ["리스트 → 문자열", "구분자가 앞(주인), 리스트가 괄호 안(재료)"] },
          ],
        },
        { type: "h2", text: "이어 쓰기 (chaining)" },
        {
          type: "code",
          code: "text = 'heLLo, woRld!'\nnew_text = text.swapcase().replace('l', 'z')\nprint(new_text)",
          out: "HEzzO, WOrLD!",
        },
        {
          type: "list",
          style: "flow",
          items: ["`text.swapcase()` → 새 문자열 `'HEllO, WOrLD!'`", "그 결과에 바로 `.replace()` 를 이어 붙임 (`.replace('l', 'z')`)"],
        },
        {
          type: "tip",
          kind: "memo",
          text: "100퍼 다 chaining 이 되는 것은 아님. (앞 메서드가 문자열을 돌려줄 때만 다음 문자열 메서드를 이어 쓸 수 있다.)",
        },
        {
          type: "tip",
          kind: "warn",
          text: "`text.strip()` 만 쓰면 `text` 는 그대로. `new = text.strip()` 처럼 다시 받아야 한다.",
        },
        {
          type: "list",
          style: "check",
          items: ["조작 메서드는 새 문자열을 반환", "`replace` `strip` `split` `join` 네 개가 핵심", "결과가 문자열이면 `.a().b()` 로 이어 쓴다"],
        },
      ],
    },
    {
      id: "n-py-6-4",
      emoji: "📥",
      title: "리스트 값 추가·삭제 메서드",
      summary: "리스트는 원본을 직접 고친다 — append 는 돌려주는 게 없다",
      blocks: [
        { type: "key", text: "리스트 메서드는 원본을 고치고 None 을 돌려준다" },
        { type: "h2", text: "메서드 표" },
        {
          type: "table",
          head: ["메서드", "설명"],
          rows: [
            ["`L.append(x)`", "마지막에 항목 x 추가"],
            ["`L.extend(m)`", "iterable m 의 모든 항목을 끝에 추가 (`+=` 과 같음)"],
            ["`L.insert(i, x)`", "인덱스 i 에 x 삽입"],
            ["`L.remove(x)`", "가장 왼쪽(첫 번째) x 제거. 없으면 ValueError"],
            ["`L.pop()`", "가장 오른쪽(마지막) 항목을 반환 후 제거"],
            ["`L.pop(i)`", "인덱스 i 항목을 반환 후 제거"],
            ["`L.clear()`", "모든 항목 삭제"],
          ],
        },
        { type: "h2", text: "추가: append / extend / insert" },
        {
          type: "code",
          code: "my_list = [1, 2, 3]\nmy_list.append(4)\nprint(my_list)\n\nmy_list = [1, 2, 3]\nmy_list.extend([4, 5, 6])\nprint(my_list)\n\nmy_list = [1, 2, 3]\nmy_list.insert(1, 5)\nprint(my_list)",
          out: "[1, 2, 3, 4]\n[1, 2, 3, 4, 5, 6]\n[1, 5, 2, 3]",
        },
        {
          type: "compare",
          cols: [
            { title: "`append([4, 5])`", items: ["리스트 통째로 한 칸에", "상자째 넣기"] },
            { title: "`extend([4, 5])`", items: ["항목을 하나씩 풀어서", "상자 뜯어서 넣기"] },
          ],
        },
        {
          type: "code",
          code: "a = [1, 2, 3]\na.append([4, 5])\nprint(a)\n\nb = [1, 2, 3]\nb.extend([4, 5])\nprint(b)",
          out: "[1, 2, 3, [4, 5]]\n[1, 2, 3, 4, 5]",
        },
        {
          type: "tip",
          kind: "memo",
          text: "`print(my_list.append(4))` 는 `None` 이 찍힌다. append 는 반환이 없기 때문. 리스트는 바뀌지만 돌려주는 값은 없다.",
        },
        { type: "h2", text: "삭제: remove / pop / clear" },
        {
          type: "code",
          code: "my_list = [1, 2, 3]\nmy_list.remove(2)\nprint(my_list)\n\nmy_list = [1, 2, 3, 4, 5]\nitem1 = my_list.pop()\nitem2 = my_list.pop(0)\nprint(item1)\nprint(item2)\nprint(my_list)\n\nmy_list.clear()\nprint(my_list)",
          out: "[1, 3]\n5\n1\n[2, 3, 4]\n[]",
        },
        {
          type: "compare",
          cols: [
            { title: "`remove`", items: ["'값'으로 찾아 지움", "돌려주는 값 없음"] },
            { title: "`pop`", items: ["'위치'로 꺼내며 지움", "꺼낸 값을 돌려줌"] },
          ],
        },
        {
          type: "tip",
          kind: "warn",
          text: "`my_list = my_list.append(4)` 라고 쓰면 my_list 가 None 이 된다. 결과를 다시 대입하지 말 것.",
        },
        {
          type: "list",
          style: "check",
          items: ["원본을 직접 바꾼다 (append·extend·pop 이 빨간 글씨 핵심)", "`append` 는 한 덩어리, `extend` 는 풀어서", "`remove` 는 값, `pop` 은 인덱스. pop 만 값을 돌려준다"],
        },
      ],
    },
    {
      id: "n-py-6-5",
      emoji: "🔃",
      title: "리스트 탐색·정렬 메서드",
      summary: "index/count 는 찾기, reverse 는 뒤집기(정렬 아님), sort 는 정렬",
      blocks: [
        { type: "key", text: "reverse 는 뒤집기만, 정렬은 sort" },
        { type: "h2", text: "메서드 표" },
        {
          type: "table",
          head: ["메서드", "설명"],
          rows: [
            ["`L.index(x)`", "첫 번째로 일치하는 x 의 인덱스 반환"],
            ["`L.count(x)`", "x 의 개수 반환"],
            ["`L.reverse()`", "순서를 역순으로 변경 (정렬 X)"],
            ["`L.sort()`", "정렬 (매개변수 이용 가능)"],
          ],
        },
        {
          type: "tip",
          kind: "memo",
          text: "판서에서 reverse·sort 두 행을 괄호로 묶고 '(정렬 X)'에 동그라미를 쳐 두었다.",
        },
        { type: "h2", text: "index / count" },
        {
          type: "code",
          code: "my_list = [1, 2, 3]\nprint(my_list.index(2))\n\nmy_list = [1, 2, 2, 3, 3, 3]\nprint(my_list.count(3))",
          out: "1\n3",
        },
        { type: "h2", text: "reverse / sort" },
        {
          type: "code",
          code: "my_list = [1, 3, 2, 8, 1, 9]\nmy_list.reverse()\nprint(my_list)\n\nmy_list = [3, 2, 1]\nmy_list.sort()\nprint(my_list)\n\n# 내림차순\nmy_list.sort(reverse=True)\nprint(my_list)",
          out: "[9, 1, 8, 2, 3, 1]\n[1, 2, 3]\n[3, 2, 1]",
        },
        {
          type: "compare",
          cols: [
            { title: "`reverse()`", items: ["책을 거꾸로 꽂기", "순서만 뒤집음"] },
            { title: "`sort()`", items: ["제목 순으로 다시 꽂기", "오름차순, `reverse=True` 면 내림차순"] },
          ],
        },
        {
          type: "tip",
          kind: "warn",
          text: "`[1, 2, 3].reverse()` 가 `[3, 2, 1]` 인 건 우연. `[1, 3, 2, 8]` 은 `[8, 2, 3, 1]` 로 뒤집히기만 한다.",
        },
        {
          type: "p",
          text: "더 많은 리스트 기능은 파이썬 공식 튜토리얼 'More on Lists' 참고.",
        },
        {
          type: "list",
          style: "check",
          items: ["`index` 는 첫 번째 위치, `count` 는 개수", "`reverse` 는 정렬이 아니다", "`sort()` 오름차순, `sort(reverse=True)` 내림차순. `reverse`·`sort` 둘 다 원본을 고친다"],
        },
      ],
    },
    {
      id: "n-py-6-6",
      emoji: "🪞",
      title: "참고: 복사 — 가변/불변과 할당",
      summary: "= 는 복사가 아니라 같은 물건에 이름표 하나 더 붙이기",
      blocks: [
        { type: "key", text: "= 는 복사가 아니라 이름표 하나 더 붙이기" },
        { type: "h2", text: "가변 vs 불변" },
        {
          type: "code",
          code: "# 변경 가능 (리스트): a, b 가 같은 리스트를 가리킴\na = [1, 2, 3, 4]\nb = a\nb[0] = 100\nprint(a)\nprint(b)\n\n# 변경 불가능 (정수): b = 10 은 새 객체를 가리킴\na = 20\nb = a\nb = 10\nprint(a)\nprint(b)",
          out: "[100, 2, 3, 4]\n[100, 2, 3, 4]\n20\n10",
        },
        {
          type: "compare",
          cols: [
            { title: "가변 (리스트)", items: ["`b = a` 후 a, b 가 같은 객체를 공유", "b 로 고치면 a 도 바뀜"] },
            { title: "불변 (정수)", items: ["고치기 불가능", "`b = 10` 은 이름표를 10 으로 옮긴 것, a 는 20"] },
          ],
        },
        { type: "h2", text: "복사 유형 세 가지" },
        {
          type: "table",
          head: ["유형", "무엇을 복사", "안쪽 리스트"],
          rows: [
            ["할당 `=`", "객체가 아니라 객체 참조. 이름표만 추가", "공유"],
            ["얕은 복사", "겉 리스트만 새로", "같이 바뀜 (한계)"],
            ["깊은 복사", "안에 든 것까지 전부 새로", "따로"],
          ],
        },
        {
          type: "code",
          code: "import copy\n\na = [1, [2, 3]]\nb = a[:]             # 얕은 복사\nc = copy.deepcopy(a)  # 깊은 복사\na[1][0] = 99\nprint(b)\nprint(c)",
          out: "[1, [99, 3]]\n[1, [2, 3]]",
        },
        { type: "h2", text: "할당 예시 (Python Tutor)" },
        {
          type: "code",
          code: "original_list = [1, 2, 3]\ncopy_list = original_list\nprint(original_list, copy_list)\n\ncopy_list[0] = 'hi'\nprint(original_list, copy_list)",
          out: "[1, 2, 3] [1, 2, 3]\n['hi', 2, 3] ['hi', 2, 3]",
        },
        {
          type: "p",
          text: "Python Tutor 그림에서 `original_list` 와 `copy_list` 화살표가 같은 list 상자 하나를 가리킨다. 그래서 original_list 도 'hi' 가 됐다.",
        },
        {
          type: "tip",
          kind: "warn",
          text: "`backup = data` 는 백업이 아니다. 원본을 고치면 백업도 같이 바뀐다.",
        },
        {
          type: "list",
          style: "check",
          items: ["가변은 같은 객체 공유, 불변은 재할당 시 새 객체", "`=` 는 객체 참조 복사", "얕은 복사는 안쪽 리스트까지 못 지킨다. 깊은 복사만 속까지 새것"],
        },
      ],
    },
    {
      id: "n-py-6-7",
      emoji: "🔢",
      title: "참고: 문자 유형 판별 isdecimal / isdigit / isnumeric",
      summary: "숫자 판정 엄격함 순서: isdecimal ⊆ isdigit ⊆ isnumeric",
      blocks: [
        { type: "key", text: "`isdecimal() ⊆ isdigit() ⊆ isnumeric()`" },
        { type: "h2", text: "엄격함 순서" },
        {
          type: "list",
          style: "flow",
          items: [
            "`isdecimal()` 엄격: 숫자 문자(0~9)로만 이루어져야 True",
            "`isdigit()` 중간: 유니코드 숫자도 인식 (`'①'` 도 숫자)",
            "`isnumeric()` 느슨: 분수·지수·루트 기호 등 추가 유니코드 문자도 인식",
          ],
        },
        {
          type: "code",
          code: "print('①'.isdecimal(), '①'.isdigit(), '①'.isnumeric())",
          out: "False True True",
        },
        {
          type: "tip",
          kind: "analogy",
          text: "깐깐한 심사위원(isdecimal)이 통과시킨 건 나머지 둘도 전부 통과시킨다.",
        },
        { type: "h2", text: "판정표" },
        {
          type: "table",
          head: ["isdecimal", "isdigit", "isnumeric", "예시"],
          rows: [
            ["True", "True", "True", "`'038'`, 전각 `'０３８'`"],
            ["False", "True", "True", "위첨자 `'⁰³⁸'`, 동그라미 `'⓪③⑧'`"],
            ["False", "False", "True", "분수 `'⅛'`, 로마 `'ⅠⅢⅧ'`, 한자 `'壹貳參'`"],
            ["False", "False", "False", "`'abc'`, `'38.0'`, `'-38'`"],
          ],
        },
        { type: "h2", text: "코드로 확인" },
        {
          type: "code",
          code: "# isdecimal() : 오직 일반 십진수(0-9)만 True\nprint('12345'.isdecimal())\nprint('123.45'.isdecimal())\nprint('-123'.isdecimal())\nprint('Ⅳ'.isdecimal())\nprint('½'.isdecimal())\nprint('²'.isdecimal())\n\n# isdigit() : 지수 표현(²)도 True\nprint('Ⅳ'.isdigit())\nprint('½'.isdigit())\nprint('²'.isdigit())\n\n# isnumeric() : 로마 숫자, 분수, 지수까지 True\nprint('Ⅳ'.isnumeric())\nprint('½'.isnumeric())\nprint('²'.isnumeric())",
          out: "True\nFalse\nFalse\nFalse\nFalse\nFalse\nFalse\nFalse\nTrue\nTrue\nTrue\nTrue",
        },
        {
          type: "tip",
          kind: "warn",
          text: "셋 다 `'123.45'` 와 `'-123'` 은 False. 실수 입력 검사에는 이 메서드만으로 부족하다.",
        },
        {
          type: "list",
          style: "check",
          items: ["뒤로 갈수록 느슨: `isdecimal` → `isdigit` → `isnumeric`", "평범한 `'0'~'9'` 는 셋 다 True", "소수점·부호가 섞이면 셋 다 False"],
        },
      ],
    },
  ],
};
