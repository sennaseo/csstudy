// 파이썬 단원 7 — 데이터 구조 2 (노션 SSAFY 파이썬 강의 정리본). 작성 규칙은 ../python.ts 상단 주석.
import type { NoteUnit } from "../types";

export const PY7: NoteUnit = {
  id: "py-7",
  title: "데이터 구조 2",
  notes: [
    {
      id: "n-py-7-1",
      emoji: "🗝️",
      title: "딕셔너리 조회 메서드 — get / keys / values / items",
      summary: "딕셔너리는 번호(인덱스) 대신 이름표(키)로 찾는 사물함",
      blocks: [
        { type: "key", text: "딕셔너리는 몇 번째가 아니라 이름표(키)로 찾는다" },
        {
          type: "tip",
          kind: "analogy",
          text: "이름표 붙은 사물함. '3번 칸' 대신 'name 칸'을 연다. keys 는 이름표 목록, values 는 내용물 목록, items 는 (이름표, 내용물) 짝 목록.",
        },
        { type: "h2", text: "비시퀀스: 딕셔너리" },
        {
          type: "compare",
          cols: [
            { title: "강의 정의", items: ["고유한 항목들의 정렬되지 않은 컬렉션", "키는 있고 순서는 없다"] },
            {
              title: "덧붙임 (3.7+)",
              items: ["실제로는 넣은 순서를 기억한다(삽입 순서 보존)", "'순서 없음' = 인덱스로 못 꺼낸다", "`d[0]` 은 키가 0인 값을 찾는다"],
            },
          ],
        },
        {
          type: "code",
          code: "d = {0: 'zero', 'name': 'Alice'}\nprint(d[0])  # 0번째가 아니라 키 0\nprint(d)",
          out: "zero\n{0: 'zero', 'name': 'Alice'}",
        },
        {
          type: "table",
          head: ["메서드", "설명"],
          rows: [
            ["`D.get(k)`", "키 k 에 연결된 값 반환 (없으면 None)"],
            ["`D.get(k, v)`", "키 k 의 값 반환, 없으면 기본값 v 반환"],
            ["`D.keys()`", "키를 모은 객체 반환"],
            ["`D.values()`", "값을 모은 객체 반환"],
            ["`D.items()`", "키/값 쌍을 모은 객체 반환"],
          ],
        },
        { type: "h2", text: "`get`: 없어도 에러 없는 조회" },
        {
          type: "code",
          code: "person = {'name': 'Alice', 'age': 25}\n\nprint(person.get('name'))\nprint(person.get('country'))\nprint(person.get('country', 'Unknown'))",
          out: "Alice\nNone\nUnknown",
        },
        {
          type: "compare",
          cols: [
            { title: "`person['country']`", tone: "bad", items: ["키가 없으면 KeyError"] },
            { title: "`person.get('country')`", tone: "good", items: ["None 또는 내가 정한 기본값"] },
          ],
        },
        { type: "h2", text: "keys / values / items: 꺼내서 돌리기" },
        {
          type: "code",
          code: "person = {'name': 'Alice', 'age': 25}\n\nprint(person.keys())\nprint(person.values())\nprint(person.items())\n\nfor v in person.values():\n    print(v)\n\nfor k, v in person.items():\n    print(k, v)",
          out: "dict_keys(['name', 'age'])\ndict_values(['Alice', 25])\ndict_items([('name', 'Alice'), ('age', 25)])\nAlice\n25\nname Alice\nage 25",
        },
        {
          type: "tip",
          kind: "memo",
          text: "values() 를 for 문에 넣으면 값(인자)만 쭉 꺼낼 수 있음. items() 는 `for item in` 으로 돌리면 `('name', 'Alice')` 튜플 한 덩어리가, `for key, item in` 으로 받으면 키와 값이 따로 풀려서 온다.",
        },
        {
          type: "tip",
          kind: "warn",
          text: "`for key, item in person.items():` 처럼 두 변수로 받았으면 이름을 정확히. `itemin` 으로 붙여 쓰는 바람에 `item` 이 엉뚱한 값을 가리켜 출력이 꼬였던 적이 있다.",
        },
        {
          type: "list",
          style: "check",
          items: ["키는 있고 순서는 없다 → 인덱스 대신 키로 접근", "`get(k, 기본값)` 은 키가 없어도 에러 없이 기본값", "`keys()` `values()` `items()` 를 for 문에 넣어 순회"],
        },
      ],
    },
    {
      id: "n-py-7-2",
      emoji: "🛠️",
      title: "딕셔너리 변경 메서드 — pop / setdefault / update / clear",
      summary: "키로 빼고(pop), 없으면 넣고(setdefault), 통째로 덮고(update)",
      blocks: [
        { type: "key", text: "`pop` 은 빼고, `setdefault` 는 없을 때만 넣고, `update` 는 덮는다" },
        {
          type: "table",
          head: ["메서드", "설명"],
          rows: [
            ["`D.clear()`", "모든 키/값 쌍 제거"],
            ["`D.pop(k)`", "키 k 를 제거하고 값을 반환 (없으면 오류)"],
            ["`D.pop(k, v)`", "키 k 를 제거하고 값을 반환 (없으면 v 반환)"],
            ["`D.setdefault(k)`", "키 k 의 값을 반환"],
            ["`D.setdefault(k, v)`", "키 k 의 값 반환. k 가 없으면 k:v 를 추가하고 v 반환"],
            ["`D.update(other)`", "other 의 키가 D 에 있으면 값을 덮어쓰고, 없으면 쌍을 추가"],
          ],
        },
        { type: "h2", text: "pop: 인덱스가 없으니 키로 제거" },
        {
          type: "code",
          code: "person = {'name': 'Alice', 'age': 25}\n\nprint(person.pop('age'))\nprint(person)\nprint(person.pop('country', None))\n\nperson.clear()\nprint(person)",
          out: "25\n{'name': 'Alice'}\nNone\n{}",
        },
        { type: "code", code: "print(person.pop('country'))  # 키도 없고 기본값도 없음", out: "KeyError: 'country'" },
        {
          type: "tip",
          kind: "memo",
          text: "`pop('age')` 는 25 를 반환하면서 출력된다 — 지우기만 하는 게 아니라 값을 돌려준다. 딕셔너리는 인덱스가 존재하지 않기 때문에 키로 제거한다.",
        },
        { type: "h2", text: "setdefault: get + 없으면 추가" },
        {
          type: "code",
          code: "person = {'name': 'Alice', 'age': 25}\n\nprint(person.setdefault('country', 'KOREA'))\nprint(person)",
          out: "KOREA\n{'name': 'Alice', 'age': 25, 'country': 'KOREA'}",
        },
        {
          type: "tip",
          kind: "memo",
          text: "setdefault 는 get 메서드 + 알파 같은 느낌. get 은 없으면 기본값만 돌려주고 끝인데, setdefault 는 그 기본값을 딕셔너리에 실제로 넣어 둔다.",
        },
        {
          type: "tip",
          kind: "warn",
          text: "`setdefault('age', 99)` 는 age 가 이미 있으면 25 를 돌려주고 아무것도 안 바꾼다. 바꾸려면 `update` 나 `person['age'] = 99`.",
        },
        { type: "h2", text: "update: 덮어쓰기 + 추가" },
        {
          type: "code",
          code: "person = {'name': 'Alice', 'age': 25}\nother_person = {'name': 'Jane', 'gender': 'Female'}\n\nperson.update(other_person)\nprint(person)\n\nperson.update(age=50, country='KOREA')\nprint(person)",
          out: "{'name': 'Jane', 'age': 25, 'gender': 'Female'}\n{'name': 'Jane', 'age': 50, 'gender': 'Female', 'country': 'KOREA'}",
        },
        {
          type: "compare",
          cols: [
            { title: "기존 키 (name)", items: ["값을 덮어쓴다"] },
            { title: "새 키 (gender)", items: ["쌍을 추가한다"] },
          ],
        },
        { type: "p", text: "`키=값` 형태의 키워드 인자로도 넣을 수 있다." },
        {
          type: "list",
          style: "check",
          items: ["`pop(k)` 는 빼면서 값을 돌려준다, `pop(k, 기본값)` 이면 없어도 안전", "`setdefault(k, v)` = get + 없으면 추가", "`update` 는 같은 키는 덮고 새 키는 추가"],
        },
      ],
    },
    {
      id: "n-py-7-3",
      emoji: "🎒",
      title: "세트 메서드 — add / remove / discard / pop / update",
      summary: "세트는 중복 없고 순서 없는 주머니, 꺼낼 땐 '임의'로",
      blocks: [
        { type: "key", text: "세트 = 중복 없음 + 순서 없음" },
        {
          type: "tip",
          kind: "analogy",
          text: "구슬 주머니. 같은 구슬은 두 개 못 넣고, 넣은 순서대로 나오지도 않는다. 손 넣어 아무거나 꺼내는 게 `pop`.",
        },
        {
          type: "table",
          head: ["메서드", "설명"],
          rows: [
            ["`s.add(x)`", "x 추가. 이미 있으면 변화 없음"],
            ["`s.clear()`", "모든 항목 제거"],
            ["`s.remove(x)`", "x 제거. 없으면 KeyError"],
            ["`s.pop()`", "임의의 항목을 반환하고 제거"],
            ["`s.discard(x)`", "x 제거. remove 와 달리 없어도 에러 없음"],
            ["`s.update(iterable)`", "다른 iterable 의 요소를 추가"],
          ],
        },
        {
          type: "tip",
          kind: "memo",
          text: "세트의 `.update` 는 리스트의 `.extend` 와 비슷함 (여러 개를 풀어서 한꺼번에 추가). 그리고 세트를 print 하면 순서가 계속 바뀜 — 순서가 없는 자료구조라서.",
        },
        { type: "h2", text: "add / update / clear" },
        {
          type: "code",
          code: "my_set = {1, 2, 3}\n\nmy_set.add(4)\nprint(my_set)\n\nmy_set.add(4)  # 이미 있으니 변화 없음\nprint(my_set)\n\nmy_set.update([1, 4, 5])\nprint(my_set)\n\nmy_set.clear()\nprint(my_set)",
          out: "{1, 2, 3, 4}\n{1, 2, 3, 4}\n{1, 2, 3, 4, 5}\nset()",
        },
        { type: "tip", kind: "warn", text: "빈 세트는 `set()`. `{}` 는 빈 딕셔너리다." },
        { type: "h2", text: "remove / discard / pop" },
        {
          type: "code",
          code: "my_set = {1, 2, 3}\nmy_set.remove(2)\nprint(my_set)\n\nmy_set = {1, 2, 3}\nmy_set.discard(2)\nprint(my_set)\nmy_set.discard(10)  # 없어도 조용히 넘어감\n\nmy_set = {1, 2, 3}\nelement = my_set.pop()\nprint(element)  # 임의의 요소\nprint(my_set)",
          out: "{1, 3}\n{1, 3}\n1\n{2, 3}",
        },
        { type: "code", code: "my_set.remove(10)  # 없는 값은 remove 못 함", out: "KeyError: 10" },
        {
          type: "compare",
          cols: [
            { title: "remove(x)", tone: "bad", items: ["없으면 KeyError", "문자열의 index 와 같은 짝"] },
            { title: "discard(x)", tone: "good", items: ["없어도 무반응", "문자열의 find 와 같은 짝"] },
          ],
        },
        {
          type: "tip",
          kind: "warn",
          text: "`pop()` 의 '임의의 요소'는 랜덤이 아니다. 해시 테이블에 저장된 순서대로 나올 뿐. 문자열이 섞인 세트는 실행할 때마다 결과가 달라 보인다. '첫 번째 것'을 기대하지 말 것.",
        },
        {
          type: "list",
          style: "check",
          items: ["빈 세트는 `set()`", "`add` 하나, `update` 여러 개(extend 와 비슷)", "`remove` 는 없으면 에러, `discard` 는 조용, `pop` 은 임의의 것"],
        },
      ],
    },
    {
      id: "n-py-7-4",
      emoji: "🔗",
      title: "세트의 집합 메서드 — 차집합·교집합·합집합",
      summary: "수학 집합 연산 그대로: - & | 와 부분집합 <= >=",
      blocks: [
        { type: "key", text: "차집합 - · 교집합 & · 합집합 |" },
        {
          type: "tip",
          kind: "analogy",
          text: "두 반 동아리 명단 비교. 우리 반에만 있는 애(차집합), 양쪽 다 있는 애(교집합), 합친 명단(합집합), 우리 반 애들이 전부 저쪽에도 있나(부분집합).",
        },
        {
          type: "table",
          head: ["메서드", "설명", "연산자"],
          rows: [
            ["`set1.difference(set2)`", "set1 에는 있지만 set2 에는 없는 항목", "`set1 - set2`"],
            ["`set1.intersection(set2)`", "set1 과 set2 모두에 있는 항목", "`set1 & set2`"],
            ["`set1.issubset(set2)`", "set1 의 항목이 모두 set2 에 있으면 True", "`set1 <= set2`"],
            ["`set1.issuperset(set2)`", "set1 이 set2 의 항목을 모두 포함하면 True", "`set1 >= set2`"],
            ["`set1.union(set2)`", "set1 또는 set2 (혹은 둘 다)에 있는 항목", "`set1 | set2`"],
          ],
        },
        { type: "p", text: "difference·intersection·union 은 새 세트를 만들어 돌려준다. 원본 두 세트는 그대로." },
        { type: "h2", text: "코드로 확인" },
        {
          type: "code",
          code: "set1 = {0, 1, 2, 3, 4}\nset2 = {1, 3, 5, 7, 9}\n\nprint(set1.difference(set2))\nprint(set1.intersection(set2))\nprint(set1.issubset(set2))\nprint(set1.issuperset(set2))\nprint(set1.union(set2))\n\n# 연산자로 똑같이\nprint(set1 - set2)\nprint(set1 & set2)\nprint(set1 | set2)",
          out: "{0, 2, 4}\n{1, 3}\nFalse\nFalse\n{0, 1, 2, 3, 4, 5, 7, 9}\n{0, 2, 4}\n{1, 3}\n{0, 1, 2, 3, 4, 5, 7, 9}",
        },
        {
          type: "code",
          code: "set1 = {1, 3}\nset2 = {1, 3, 5, 7, 9}\n\nprint(set1 <= set2)  # set1 이 전부 set2 안에\nprint(set2 >= set1)",
          out: "True\nTrue",
        },
        {
          type: "compare",
          cols: [
            { title: "방향 있음", tone: "bad", items: ["차집합", "`set1 - set2` → `{0, 2, 4}`", "`set2 - set1` → `{5, 7, 9}`"] },
            { title: "방향 없음", tone: "good", items: ["교집합·합집합", "순서를 바꿔도 같다"] },
          ],
        },
        {
          type: "list",
          style: "check",
          items: ["`-` `&` `|`: 메서드 이름과 연산자 둘 다 기억", "`issubset` `<=`, `issuperset` `>=` 는 True/False", "차집합만 방향이 있다"],
        },
      ],
    },
    {
      id: "n-py-7-5",
      emoji: "🔐",
      title: "참고: 해시 테이블과 hashable",
      summary: "set 요소와 dict 키가 빠르고 중복 없는 이유 = 해시(지문)",
      blocks: [
        { type: "key", text: "set 요소·dict 키는 해시 테이블에 저장된다" },
        {
          type: "tip",
          kind: "analogy",
          text: "해시는 데이터의 지문. 해시 테이블은 지문 번호를 사물함 번호로 써서, 하나하나 뒤지지 않고 바로 그 칸을 연다.",
        },
        { type: "h2", text: "해시와 해시 테이블" },
        {
          type: "compare",
          cols: [
            { title: "해시", items: ["임의 크기 데이터 → 고정 크기의 고유한 값", "파이썬에서는 정수로 표현"] },
            { title: "해시 테이블", items: ["해시 값을 색인(index)으로 삼아 키(key)와 데이터(value)를 저장", "데이터 검색이 매우 빠름"] },
          ],
        },
        {
          type: "list",
          style: "flow",
          items: ["keys: John Smith, Lisa Smith, Sandra Dee", "hash function", "buckets(00~15) 중 02, 01, 14 번 칸에 저장 (나머지 칸은 비어 있음)"],
        },
        {
          type: "tip",
          kind: "memo",
          text: "hash function → 파이썬이 재실행될 때마다 갱신됨. (그래서 문자열의 해시 값은 실행할 때마다 다르다.)",
        },
        { type: "code", code: "print(hash(1))  # 같은 정수는 항상 같은 값\nprint(hash(1))\nprint(hash(42))\nprint(type(hash('abc')))", out: "1\n1\n42\n<class 'int'>" },
        { type: "h2", text: "그래서 빠르고 중복이 없다" },
        {
          type: "list",
          style: "flow",
          items: ["각 요소/키를 해시 함수로 해시 값으로 바꾼다", "그 위치에 넣는다"],
        },
        { type: "p", text: "그래서 탐색이 매우 빠르고 중복이 허용되지 않는다." },
        { type: "code", code: "print({1, 1, 2, 2, 3})\nprint({'a': 1, 'a': 2})  # 같은 키는 하나만", out: "{1, 2, 3}\n{'a': 2}" },
        { type: "code", code: "print(hash('a'))  # 실행할 때마다 다름\nprint(hash('a'))  # 같은 실행 안에서는 같음" },
        {
          type: "table",
          head: ["타입", "해시 값"],
          rows: [
            ["정수", "같은 정수는 항상 같다. `hash(1)` 과 `hash(2)` 는 다르지만 `hash(1)` 은 언제나 같다"],
            ["문자열", "가변 길이라 각 문자의 유니코드 코드 포인트 등을 기반으로 계산 → 실행 시마다 다름"],
          ],
        },
        { type: "h2", text: "set.pop() 의 '임의' ≠ 랜덤" },
        {
          type: "compare",
          cols: [
            { title: "무작위(random)", tone: "bad", items: ["실행할 때마다 다른 걸 뽑는다", "판서에 '랜덤 X' 라고 적어 둠"] },
            { title: "임의(arbitrary)", tone: "good", items: ["`pop()` 은 해시 테이블에 나타나는 순서대로 반환"] },
          ],
        },
        {
          type: "code",
          code: "for _ in range(3):\n    s = {3, 1, 2}\n    print(s.pop())  # 매번 같은 것",
          out: "1\n1\n1",
        },
        { type: "h2", text: "hashable 과 불변성" },
        {
          type: "list",
          items: [
            "해시 테이블의 키는 불변해야 한다. 생성 후 값을 바꿀 수 없어야 함",
            "불변 객체는 해시 값이 변하지 않아 같은 값에 일관된 해시 값을 유지",
            "가변 객체는 값이 바뀌면 해시 값도 바뀔 수 있어 해시 테이블의 무결성·해시 값의 일관성을 못 지킨다 → hashable 아님",
          ],
        },
        {
          type: "tip",
          kind: "warn",
          text: "'hash 가능하다 != 불변하다'. 둘은 같은 말이 아니다. 예: 직접 만든 클래스의 인스턴스는 값을 바꿀 수 있어도 기본적으로 hashable 이다.",
        },
        {
          type: "code",
          code: "# 세 줄 모두 에러 — 한 줄씩 따로 실행해 볼 것\nprint(hash([1, 2, 3]))\nmy_set = {[1, 2, 3], 1, 2, 3}\nmy_dict = {{3, 2}: 'a'}",
          out: "TypeError: unhashable type: 'list'\nTypeError: unhashable type: 'list'\nTypeError: unhashable type: 'set'",
        },
        {
          type: "tip",
          kind: "warn",
          text: "리스트·세트는 세트 요소나 딕셔너리 키로 못 쓴다(`unhashable type`). 묶음을 키로 쓰려면 튜플(불변)로.",
        },
        {
          type: "list",
          style: "check",
          items: ["해시 = 데이터의 지문(고정 길이 정수), 해시 테이블 = 지문을 칸 번호로 쓰는 보관소", "set 요소·dict 키가 빠르고 중복 없는 이유가 해시 테이블", "키는 hashable 이어야 한다, `set.pop` 은 랜덤이 아니라 테이블 순서"],
        },
      ],
    },
    {
      id: "n-py-7-6",
      emoji: "📜",
      title: "참고: BNF / EBNF — 공식 문서의 대괄호 읽는 법",
      summary: "pop(key[, default]) 의 [ ] 는 '있어도 되고 없어도 되는 것'",
      blocks: [
        { type: "key", text: "문서의 [ ] 는 넣어도 되고 안 넣어도 되는 것" },
        {
          type: "compare",
          cols: [
            { title: "BNF", items: ["Backus-Naur Form", "프로그래밍 언어의 문법을 표현하는 표기법"] },
            { title: "EBNF", items: ["Extended Backus-Naur Form", "BNF 에 메타 기호를 추가해 더 간결하고 표현력이 강해진 형태"] },
          ],
        },
        { type: "p", text: "쓰는 이유: 서로 다른 언어, 데이터 형식, 프로토콜 등의 문법을 통일해서 정의하기 위해." },
        { type: "h2", text: "대표적인 EBNF 메타기호" },
        {
          type: "table",
          head: ["메타 기호", "의미"],
          rows: [
            ["`[ ]`", "선택적 요소"],
            ["`{ }`", "0번 이상 반복"],
            ["`( )`", "그룹화"],
          ],
        },
        { type: "h2", text: "예시: 딕셔너리의 pop" },
        {
          type: "code",
          code: "# 파이썬 공식 문서 표기\n# pop(key[, default])\n#   키가 있으면 제거하고 값을 반환, 없으면 default 를 반환.\n#   default 가 없고 키도 없으면 KeyError.\n\nperson = {'name': 'Alice'}\nprint(person.pop('name'))          # default 생략\nprint(person.pop('name', 'none'))  # default 사용",
          out: "Alice\nnone",
        },
        {
          type: "tip",
          kind: "memo",
          text: "문서상의 표기법 — `[, default]` 처럼 대괄호로 묶인 부분은 넣어도 되고 안 넣어도 되는 선택 인자라는 뜻. 앞에서 본 `s.replace(old, new[,count])`, `s.strip([chars])` 도 같은 규칙.",
        },
        { type: "code", code: "print('  hi  '.strip())      # [chars] 생략\nprint('xxhixx'.strip('x'))  # [chars] 사용", out: "hi\nhi" },
        {
          type: "compare",
          cols: [
            { title: "문서 그대로 친 코드", tone: "bad", items: ["`person.pop('name'[, 'none'])`", "문법 오류"] },
            { title: "실제 코드", tone: "good", items: ["`person.pop('name', 'none')`", "대괄호는 '선택' 표시일 뿐"] },
          ],
        },
        {
          type: "list",
          style: "check",
          items: ["BNF/EBNF = 언어 문법을 적는 공통 표기법", "`[ ]` 선택, `{ }` 0번 이상 반복, `( )` 그룹", "`pop(key[, default])` 에서 default 는 선택 인자"],
        },
      ],
    },
  ],
};
