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
        {
          type: "tip",
          kind: "analogy",
          text: "자료구조는 주방 수납함이다. 양념통·칼꽂이·냉장고처럼 '무엇을 어떻게 넣고 꺼낼지'에 맞춰 칸을 나눠 둔 것. 메서드는 그 수납함에 딸려 나오는 전용 도구(냉장고의 제빙기 버튼 같은 것)다.",
        },
        { type: "h2", text: "자료구조(Data Structure)란" },
        {
          type: "p",
          text: "여러 데이터를 효과적으로 사용·관리하기 위한 구조. 컴퓨터 공학에서는 '자료 구조'라고 부르고, 데이터를 효율적으로 저장·관리하려고 구조를 나눠 놓은 것이다.",
        },
        {
          type: "list",
          items: [
            "단순 구조: 정수, 실수, 문자, 문자열",
            "선형 구조: 순차 리스트, 연결 리스트(단순·이중·원형), 스택, 큐, 덱",
            "비선형 구조: 트리(일반·이진), 그래프(방향·무방향)",
            "파일 구조: 순차 파일, 색인 파일, 직접 파일",
          ],
        },
        {
          type: "p",
          text: "활용법은 간단하다. 문자열·리스트·딕셔너리 같은 각 데이터 구조의 메서드를 호출해서 다양한 기능을 쓰는 것.",
        },
        { type: "h2", text: "메서드 = 객체에 속한 함수" },
        {
          type: "tip",
          kind: "memo",
          text: "메서드는 어딘가(클래스)에 속해 있는 '함수'이며, 각 데이터 타입별로 다양한 기능을 가진 메서드가 존재한다. — '함수'라는 점을 빨간 글씨로 강조했음.",
        },
        {
          type: "list",
          items: [
            "메서드는 클래스 내부에 정의되는 함수 → 객체의 상태를 조작하거나 동작을 수행",
            "클래스는 파이썬에서 '타입을 표현하는 방법'. 이미 은연중에 써 왔다",
            "`help(str)` 을 찍어 보면 `class str(object)` 가 나온다 — 문자열도 사실은 클래스였다 (클래스 챕터에서 자세히)",
          ],
        },
        { type: "h2", text: "호출 방법: 객체.메서드()" },
        {
          type: "code",
          code: "# 문자열 메서드 예시\nprint('hello'.capitalize())  # 결과: Hello\n\n# 리스트 메서드 예시\nnumbers = [1, 2, 3]\nnumbers.append(4)\nprint(numbers)  # 결과: [1, 2, 3, 4]",
        },
        {
          type: "p",
          text: "`'hello'` 가 데이터 타입 객체, `.capitalize()` 가 메서드. 점(.)은 '이 객체의 도구함을 열어라'라는 뜻이다.",
        },
        {
          type: "tip",
          kind: "warn",
          text: "`capitalize` 처럼 괄호 없이 쓰면 호출이 아니라 '도구를 가리키기만' 한 것. 반드시 `()` 를 붙여야 실행된다.",
        },
        { type: "h2", text: "3줄 정리" },
        {
          type: "list",
          items: [
            "자료구조 = 데이터를 효율적으로 저장·관리하려고 나눠 놓은 그릇",
            "메서드 = 클래스(타입)에 속한 함수, 타입마다 전용 도구가 다르다",
            "호출은 `객체.메서드()` — str 도 list 도 전부 클래스",
          ],
        },
      ],
    },
    {
      id: "n-py-6-2",
      emoji: "🔍",
      title: "문자열 조회·탐색·검증 메서드",
      summary: "find/index 는 위치 찾기, is~ 는 참/거짓 판정",
      blocks: [
        {
          type: "tip",
          kind: "analogy",
          text: "`find` 는 '이 글자 어디 있어?' 하고 물었을 때 없으면 '몰라(-1)' 하고 넘어가는 친구, `index` 는 없으면 화를 내는(오류) 친구다. `is~` 들은 '맞아? 아니야?'만 대답하는 예/아니오 질문지.",
        },
        { type: "h2", text: "조회·탐색·검증 메서드 표" },
        {
          type: "table",
          head: ["메서드", "설명"],
          rows: [
            ["`s.find(x)`", "x 의 첫 번째 위치를 반환. 없으면 -1"],
            ["`s.index(x)`", "x 의 첫 번째 위치를 반환. 없으면 오류"],
            ["`s.isupper()`", "모두 대문자인지"],
            ["`s.islower()`", "모두 소문자인지"],
            ["`s.isalpha()`", "알파벳 문자인지 (유니코드 Letter — 한국어도 포함)"],
          ],
        },
        {
          type: "tip",
          kind: "memo",
          text: "is 가 붙은 메서드의 공통점 → 반환값이 '맞냐 아니냐'(True/False).",
        },
        { type: "h2", text: "find 와 index" },
        {
          type: "code",
          code: "print('banana'.find('a'))   # 결과: 1\nprint('banana'.find('z'))   # 결과: -1\n\nprint('banana'.index('a'))  # 결과: 1\nprint('banana'.index('z'))  # 에러: ValueError: substring not found",
        },
        { type: "h2", text: "isupper / islower / isalpha" },
        {
          type: "code",
          code: "string1 = 'HELLO'\nstring2 = 'Hello'\nprint(string1.isupper())  # 결과: True\nprint(string2.isupper())  # 결과: False\nprint(string1.islower())  # 결과: False\nprint(string2.islower())  # 결과: False\n\nprint('Hello'.isalpha())  # 결과: True\nprint('123'.isalpha())    # 결과: False",
        },
        {
          type: "p",
          text: "`'Hello'` 는 대소문자가 섞여 있어서 isupper 도 islower 도 False. '전부' 대문자/소문자여야 True 다.",
        },
        {
          type: "tip",
          kind: "warn",
          text: "`find` 가 -1 을 돌려줬는데 그대로 인덱싱하면 `s[-1]` 이 되어 마지막 글자가 나온다. '없음'을 -1 로 표현한다는 걸 꼭 기억.",
        },
        { type: "h2", text: "3줄 정리" },
        {
          type: "list",
          items: [
            "`find` 없으면 -1, `index` 없으면 ValueError",
            "`is~` 메서드는 전부 True/False 를 돌려준다",
            "`isalpha` 는 영어만이 아니라 한글 같은 유니코드 글자도 True",
          ],
        },
      ],
    },
    {
      id: "n-py-6-3",
      emoji: "✂️",
      title: "문자열 조작 메서드 (새 문자열 반환)",
      summary: "문자열은 불변이라 원본은 그대로, 바뀐 '복사본'을 돌려준다",
      blocks: [
        {
          type: "tip",
          kind: "analogy",
          text: "문자열은 돌에 새긴 글씨다. 지우고 고칠 수 없으니, 고친 버전을 '새 돌'에 다시 새겨서 준다. 그래서 조작 메서드는 전부 새 문자열을 반환한다.",
        },
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
          text: "표의 대괄호 `[ ]` 안에 있는 인자 = 선택 인자(안 넣어도 됨). 표에서 빨간 괄호로 묶여 강조된 replace·strip·split·join 네 개가 핵심.",
        },
        { type: "h2", text: "핵심 4개: replace / strip / split / join" },
        {
          type: "code",
          code: "text = 'Hello, world!'\nprint(text.replace('world', 'Python'))  # 결과: Hello, Python!\n\nprint('   Hello, world!   '.strip())    # 결과: Hello, world!\n\nwords = text.split(',')\nprint(words)                            # 결과: ['Hello', ' world!']\n\nprint('-'.join(['Hello', 'world!']))    # 결과: Hello-world!",
        },
        {
          type: "p",
          text: "`split` 은 문자열 → 리스트, `join` 은 리스트 → 문자열. 서로 반대 방향이라 짝으로 외우면 편하다. `join` 은 구분자 문자열이 주인(앞)이고 리스트가 재료(괄호 안)라는 점이 헷갈리기 쉽다.",
        },
        { type: "h2", text: "메서드는 이어서 쓸 수 있다 (chaining)" },
        {
          type: "code",
          code: "text = 'heLLo, woRld!'\nnew_text = text.swapcase().replace('l', 'z')\nprint(new_text)  # 결과: HEzzO, WOrLD!",
        },
        {
          type: "p",
          text: "`text.swapcase()` 가 새 문자열을 돌려주니까, 그 결과에 바로 `.replace()` 를 이어 붙일 수 있다. 공장 컨베이어 벨트처럼 앞 공정의 결과물이 다음 공정으로 넘어가는 것.",
        },
        {
          type: "tip",
          kind: "memo",
          text: "100퍼 다 chaining 이 되는 것은 아님. (앞 메서드가 문자열을 돌려줄 때만 다음 문자열 메서드를 이어 쓸 수 있다.)",
        },
        {
          type: "tip",
          kind: "warn",
          text: "`text.strip()` 만 써 놓고 `text` 가 바뀌었다고 착각하는 실수가 가장 흔하다. 결과를 쓰려면 `new = text.strip()` 처럼 반드시 다시 받아야 한다.",
        },
        { type: "h2", text: "3줄 정리" },
        {
          type: "list",
          items: [
            "문자열은 불변 → 조작 메서드는 원본을 두고 새 문자열을 반환",
            "핵심은 `replace` `strip` `split` `join` 네 개 (split ↔ join 은 반대 방향)",
            "결과가 문자열이면 `.a().b()` 로 이어 쓸 수 있지만, 전부 되는 건 아니다",
          ],
        },
      ],
    },
    {
      id: "n-py-6-4",
      emoji: "📥",
      title: "리스트 값 추가·삭제 메서드",
      summary: "리스트는 원본을 직접 고친다 — append 는 돌려주는 게 없다",
      blocks: [
        {
          type: "tip",
          kind: "analogy",
          text: "리스트는 칸을 늘렸다 줄였다 할 수 있는 서랍장이다. 문자열(돌에 새긴 글씨)과 달리 서랍장 자체를 직접 고치니까, 메서드가 '새 서랍장'을 돌려줄 필요가 없다.",
        },
        { type: "h2", text: "추가·삭제 메서드 표" },
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
          code: "my_list = [1, 2, 3]\nmy_list.append(4)\nprint(my_list)  # 결과: [1, 2, 3, 4]\n\nmy_list = [1, 2, 3]\nmy_list.extend([4, 5, 6])\nprint(my_list)  # 결과: [1, 2, 3, 4, 5, 6]\n\nmy_list = [1, 2, 3]\nmy_list.insert(1, 5)\nprint(my_list)  # 결과: [1, 5, 2, 3]",
        },
        {
          type: "tip",
          kind: "memo",
          text: "`print(my_list.append(4))` 는 `None` 이 찍힌다 — append 는 반환이 없기 때문. 리스트는 바뀌지만 돌려주는 값은 없다.",
        },
        {
          type: "p",
          text: "`append([4, 5])` 는 리스트 하나를 통째로 한 칸에 넣고, `extend([4, 5])` 는 안의 항목을 하나씩 풀어서 넣는다. 상자째 넣기 vs 상자 뜯어서 넣기.",
        },
        { type: "h2", text: "삭제: remove / pop / clear" },
        {
          type: "code",
          code: "my_list = [1, 2, 3]\nmy_list.remove(2)\nprint(my_list)  # 결과: [1, 3]\n\nmy_list = [1, 2, 3, 4, 5]\nitem1 = my_list.pop()\nitem2 = my_list.pop(0)\nprint(item1)    # 결과: 5\nprint(item2)    # 결과: 1\nprint(my_list)  # 결과: [2, 3, 4]\n\nmy_list.clear()\nprint(my_list)  # 결과: []",
        },
        {
          type: "p",
          text: "`remove` 는 '값'으로 찾아 지우고, `pop` 은 '위치'로 꺼내면서 지운다. pop 은 꺼낸 값을 돌려주니까 변수에 받아 쓸 수 있다.",
        },
        {
          type: "tip",
          kind: "warn",
          text: "`my_list = my_list.append(4)` 라고 쓰면 my_list 가 None 이 되어 버린다. 리스트 메서드는 대부분 원본을 고치고 None 을 반환하니, 결과를 다시 대입하지 말 것.",
        },
        { type: "h2", text: "3줄 정리" },
        {
          type: "list",
          items: [
            "리스트 메서드는 원본을 직접 바꾼다 (append·extend·pop 이 빨간 글씨 핵심)",
            "`append` 는 한 덩어리, `extend` 는 풀어서 (`+=` 과 같음)",
            "`remove` 는 값으로, `pop` 은 인덱스로 — pop 만 값을 돌려준다",
          ],
        },
      ],
    },
    {
      id: "n-py-6-5",
      emoji: "🔃",
      title: "리스트 탐색·정렬 메서드",
      summary: "index/count 는 찾기, reverse 는 뒤집기(정렬 아님), sort 는 정렬",
      blocks: [
        {
          type: "tip",
          kind: "analogy",
          text: "`reverse` 는 책꽂이 책을 그냥 거꾸로 꽂는 것이고, `sort` 는 제목 순으로 다시 꽂는 것이다. 둘 다 '정렬'처럼 보이지만 reverse 는 순서만 뒤집을 뿐 크기 순으로 세우지 않는다.",
        },
        { type: "h2", text: "탐색·정렬 메서드 표" },
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
          type: "p",
          text: "슬라이드 판서에서 reverse·sort 두 행을 괄호로 묶고 '(정렬 X)'에 동그라미를 쳐 두었다 — reverse 는 정렬이 아니라는 점이 이 표의 강조 포인트.",
        },
        { type: "h2", text: "index / count" },
        {
          type: "code",
          code: "my_list = [1, 2, 3]\nprint(my_list.index(2))  # 결과: 1\n\nmy_list = [1, 2, 2, 3, 3, 3]\nprint(my_list.count(3))  # 결과: 3",
        },
        { type: "h2", text: "reverse / sort" },
        {
          type: "code",
          code: "my_list = [1, 3, 2, 8, 1, 9]\nmy_list.reverse()\nprint(my_list)  # 결과: [9, 1, 8, 2, 3, 1]\n\nmy_list = [3, 2, 1]\nmy_list.sort()\nprint(my_list)  # 결과: [1, 2, 3]\n\n# 내림차순\nmy_list.sort(reverse=True)\nprint(my_list)  # 결과: [3, 2, 1]",
        },
        {
          type: "p",
          text: "`sort()` 는 원본 리스트를 오름차순으로 정렬한다. 내림차순은 `reverse=True` 매개변수. 더 많은 리스트 기능은 파이썬 공식 튜토리얼 'More on Lists' 참고.",
        },
        {
          type: "tip",
          kind: "warn",
          text: "`[1, 2, 3].reverse()` 결과가 `[3, 2, 1]` 이라서 '내림차순 정렬됐네?' 하고 착각하기 쉽다. 우연일 뿐 — `[1, 3, 2, 8]` 을 reverse 하면 `[8, 2, 3, 1]` 로 뒤집히기만 한다.",
        },
        { type: "h2", text: "3줄 정리" },
        {
          type: "list",
          items: [
            "`index` 는 첫 번째 위치, `count` 는 개수",
            "`reverse` 는 순서 뒤집기일 뿐 정렬이 아니다",
            "`sort()` 는 오름차순, `sort(reverse=True)` 는 내림차순 — 둘 다 원본을 고친다",
          ],
        },
      ],
    },
    {
      id: "n-py-6-6",
      emoji: "🪞",
      title: "참고: 복사 — 가변/불변과 할당",
      summary: "= 는 복사가 아니라 같은 물건에 이름표 하나 더 붙이기",
      blocks: [
        {
          type: "tip",
          kind: "analogy",
          text: "`b = a` 는 서류를 복사하는 게 아니라, 같은 서류에 포스트잇 이름표를 하나 더 붙이는 것이다. 리스트(가변)는 한 이름표로 고치면 다른 이름표로 봐도 고쳐져 있다.",
        },
        { type: "h2", text: "데이터 타입에 따라 복사가 다르다" },
        {
          type: "p",
          text: "파이썬은 '변경 가능한(가변) 데이터 타입'과 '변경 불가능한(불변) 데이터 타입'을 다르게 다룬다.",
        },
        {
          type: "code",
          code: "# 변경 가능 (리스트): a, b 가 같은 리스트를 가리킴\na = [1, 2, 3, 4]\nb = a\nb[0] = 100\nprint(a)  # 결과: [100, 2, 3, 4]\nprint(b)  # 결과: [100, 2, 3, 4]\n\n# 변경 불가능 (정수): b = 10 은 새 객체를 가리키게 되는 것\na = 20\nb = a\nb = 10\nprint(a)  # 결과: 20\nprint(b)  # 결과: 10",
        },
        {
          type: "p",
          text: "정수는 돌에 새긴 값이라 '고치기'가 불가능하고, `b = 10` 은 b 의 이름표를 다른 돌(10)로 옮긴 것일 뿐이다. 그래서 a 는 그대로 20.",
        },
        { type: "h2", text: "복사 유형 세 가지" },
        {
          type: "list",
          ordered: true,
          items: [
            "할당 — 할당 연산자(`=`)는 객체 자체가 아니라 '객체 참조'를 복사. 같은 서류에 이름표만 추가",
            "얕은 복사 — 겉 서랍장은 새로 만들지만, 한계가 있다: 리스트 요소 안의 요소(안에 든 리스트)는 같이 바뀜",
            "깊은 복사 — 안에 든 것까지 전부 새로 만든 완전한 복사본",
          ],
        },
        { type: "h2", text: "할당 예시 (Python Tutor 로 보면)" },
        {
          type: "code",
          code: "original_list = [1, 2, 3]\ncopy_list = original_list\nprint(original_list, copy_list)  # 결과: [1, 2, 3] [1, 2, 3]\n\ncopy_list[0] = 'hi'\nprint(original_list, copy_list)  # 결과: ['hi', 2, 3] ['hi', 2, 3]",
        },
        {
          type: "p",
          text: "Python Tutor 그림에서 `original_list` 와 `copy_list` 화살표가 같은 list 상자 하나를 가리킨다. 그래서 copy_list 를 고쳤는데 original_list 도 'hi' 가 됐다.",
        },
        {
          type: "tip",
          kind: "warn",
          text: "리스트를 '백업해 두려고' `backup = data` 라고 쓰는 건 백업이 아니다. 같은 리스트에 이름만 하나 더 붙인 것이라 원본을 고치면 백업도 같이 바뀐다.",
        },
        { type: "h2", text: "3줄 정리" },
        {
          type: "list",
          items: [
            "가변(리스트)은 같은 객체를 공유, 불변(정수)은 재할당 시 새 객체",
            "`=` 는 객체 참조 복사 = 이름표 추가",
            "얕은 복사는 안쪽 리스트까지 못 지키고, 깊은 복사만 속까지 새것",
          ],
        },
      ],
    },
    {
      id: "n-py-6-7",
      emoji: "🔢",
      title: "참고: 문자 유형 판별 isdecimal / isdigit / isnumeric",
      summary: "숫자 판정 엄격함 순서: isdecimal ⊆ isdigit ⊆ isnumeric",
      blocks: [
        {
          type: "tip",
          kind: "analogy",
          text: "세 메서드는 심사 기준이 다른 세 명의 심사위원이다. isdecimal 은 '0~9 만 숫자' 하는 깐깐이, isdigit 은 '② 나 ² 도 숫자지' 하는 보통, isnumeric 은 '½ 도 Ⅳ 도 壹 도 다 숫자' 하는 느슨이.",
        },
        { type: "h2", text: "세 메서드의 차이" },
        {
          type: "list",
          items: [
            "`isdecimal()` 엄격 — 모두 숫자 문자(0~9)로만 이루어져야 True",
            "`isdigit()` 중간 — isdecimal 과 비슷하지만 유니코드 숫자도 인식 (`'①'` 도 숫자)",
            "`isnumeric()` 느슨함 — isdigit 과 비슷하지만 분수·지수·루트 기호 등 추가 유니코드 문자도 인식",
          ],
        },
        {
          type: "p",
          text: "포함 관계로 쓰면 `isdecimal() ⊆ isdigit() ⊆ isnumeric()`. 깐깐이가 통과시킨 건 나머지 둘도 전부 통과시킨다.",
        },
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
          code: "# isdecimal() : 오직 일반 십진수(0-9)만 True\nprint('12345'.isdecimal())   # 결과: True\nprint('123.45'.isdecimal())  # 결과: False\nprint('-123'.isdecimal())    # 결과: False\nprint('Ⅳ'.isdecimal())       # 결과: False\nprint('½'.isdecimal())       # 결과: False\nprint('²'.isdecimal())       # 결과: False\n\n# isdigit() : 지수 표현(²)도 True\nprint('Ⅳ'.isdigit())         # 결과: False\nprint('½'.isdigit())         # 결과: False\nprint('²'.isdigit())         # 결과: True\n\n# isnumeric() : 로마 숫자, 분수, 지수까지 True\nprint('Ⅳ'.isnumeric())       # 결과: True\nprint('½'.isnumeric())       # 결과: True\nprint('²'.isnumeric())       # 결과: True",
        },
        {
          type: "tip",
          kind: "warn",
          text: "셋 다 `'123.45'` 와 `'-123'` 은 False 다. 소수점·마이너스 부호는 숫자 '문자'가 아니라서, 입력값이 실수인지 검사할 땐 이 메서드만으로는 부족하다.",
        },
        { type: "h2", text: "3줄 정리" },
        {
          type: "list",
          items: [
            "`isdecimal` ⊆ `isdigit` ⊆ `isnumeric` — 뒤로 갈수록 느슨",
            "평범한 `'0'~'9'` 문자열은 셋 다 True",
            "소수점·부호가 섞이면 셋 다 False",
          ],
        },
      ],
    },
  ],
};
