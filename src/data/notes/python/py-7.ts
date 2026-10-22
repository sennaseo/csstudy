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
        {
          type: "tip",
          kind: "analogy",
          text: "딕셔너리는 번호표가 아니라 이름표가 붙은 사물함이다. '3번 칸'이 아니라 'name 칸'을 열고, 칸의 순서는 의미가 없다. keys 는 이름표 목록, values 는 내용물 목록, items 는 (이름표, 내용물) 짝 목록.",
        },
        { type: "h2", text: "비시퀀스: 딕셔너리" },
        {
          type: "p",
          text: "고유한 항목들의 정렬되지 않은 컬렉션. 키가 존재하고 순서가 존재하지 않는 컬렉션이다.",
        },
        {
          type: "p",
          text: "덧붙임: 파이썬 3.7부터 dict 는 실제로는 넣은 순서를 기억한다(삽입 순서 보존). 강의에서 '순서 없음'이라 한 건 '인덱스(몇 번째)로 꺼낼 수 없다'는 뜻으로 받아들이면 된다 — `d[0]` 은 0번째가 아니라 키가 0인 값을 찾는다.",
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
        { type: "h2", text: "get — 없어도 화내지 않는 조회" },
        {
          type: "code",
          code: "person = {'name': 'Alice', 'age': 25}\n\nprint(person.get('name'))                # 결과: Alice\nprint(person.get('country'))             # 결과: None\nprint(person.get('country', 'Unknown'))  # 결과: Unknown",
        },
        {
          type: "p",
          text: "`person['country']` 는 키가 없으면 KeyError 로 터지지만, `get` 은 None 이나 내가 정한 기본값을 조용히 돌려준다.",
        },
        { type: "h2", text: "keys / values / items — 꺼내서 돌리기" },
        {
          type: "code",
          code: "person = {'name': 'Alice', 'age': 25}\n\nprint(person.keys())    # 결과: dict_keys(['name', 'age'])\nprint(person.values())  # 결과: dict_values(['Alice', 25])\nprint(person.items())   # 결과: dict_items([('name', 'Alice'), ('age', 25)])\n\nfor v in person.values():\n    print(v)            # 결과: Alice, 25 (한 줄씩)\n\nfor k, v in person.items():\n    print(k, v)         # 결과: name Alice, age 25 (한 줄씩)",
        },
        {
          type: "tip",
          kind: "memo",
          text: "values() 를 for 문에 넣으면 값(인자)만 쭉 꺼낼 수 있음. items() 는 `for item in` 으로 돌리면 `('name', 'Alice')` 튜플 한 덩어리가, `for key, item in` 으로 받으면 키와 값이 따로 풀려서 온다.",
        },
        {
          type: "tip",
          kind: "warn",
          text: "`for key, item in person.items():` 처럼 두 변수로 받기로 했으면 변수 이름을 정확히 쓰자. 직접 돌려 보다가 `itemin` 으로 붙여 쓰는 바람에 `item` 이 엉뚱한 값을 가리켜 출력이 꼬였던 적이 있다.",
        },
        { type: "h2", text: "3줄 정리" },
        {
          type: "list",
          items: [
            "딕셔너리는 키는 있고 순서는 없다 — 인덱스 대신 키로 접근",
            "`get(k, 기본값)` 은 키가 없어도 에러 없이 기본값",
            "`keys()` `values()` `items()` 를 for 문에 넣어 키·값·짝을 순회",
          ],
        },
      ],
    },
    {
      id: "n-py-7-2",
      emoji: "🛠️",
      title: "딕셔너리 변경 메서드 — pop / setdefault / update / clear",
      summary: "키로 빼고(pop), 없으면 넣고(setdefault), 통째로 덮고(update)",
      blocks: [
        {
          type: "tip",
          kind: "analogy",
          text: "`pop` 은 이름표 보고 사물함을 통째로 빼 가는 것, `setdefault` 는 '그 이름 칸 있어? 없으면 이걸로 하나 만들어 둬' 하는 것, `update` 는 다른 사물함 세트를 가져와 같은 이름은 갈아 끼우고 새 이름은 추가하는 것.",
        },
        { type: "h2", text: "변경 메서드 표" },
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
        { type: "h2", text: "pop — 인덱스가 없으니 키로 제거" },
        {
          type: "code",
          code: "person = {'name': 'Alice', 'age': 25}\n\nprint(person.pop('age'))            # 결과: 25\nprint(person)                       # 결과: {'name': 'Alice'}\nprint(person.pop('country', None))  # 결과: None\n\nperson.clear()\nprint(person)                       # 결과: {}\n\nprint(person.pop('country'))        # 에러: KeyError: 'country' (키도 없고 기본값도 없음)",
        },
        {
          type: "tip",
          kind: "memo",
          text: "`pop('age')` 는 25 를 반환하면서 출력된다 — 지우기만 하는 게 아니라 값을 돌려준다. 딕셔너리는 인덱스가 존재하지 않기 때문에 키로 제거한다.",
        },
        { type: "h2", text: "setdefault — get 에 '없으면 추가'를 얹은 것" },
        {
          type: "code",
          code: "person = {'name': 'Alice', 'age': 25}\n\nprint(person.setdefault('country', 'KOREA'))  # 결과: KOREA\nprint(person)  # 결과: {'name': 'Alice', 'age': 25, 'country': 'KOREA'}",
        },
        {
          type: "tip",
          kind: "memo",
          text: "setdefault 는 get 메서드 + 알파 같은 느낌. get 은 없으면 기본값만 돌려주고 끝인데, setdefault 는 그 기본값을 딕셔너리에 실제로 넣어 둔다.",
        },
        { type: "h2", text: "update — 덮어쓰기 + 추가" },
        {
          type: "code",
          code: "person = {'name': 'Alice', 'age': 25}\nother_person = {'name': 'Jane', 'gender': 'Female'}\n\nperson.update(other_person)\nprint(person)  # 결과: {'name': 'Jane', 'age': 25, 'gender': 'Female'}\n\nperson.update(age=50, country='KOREA')\nprint(person)  # 결과: {'name': 'Jane', 'age': 50, 'gender': 'Female', 'country': 'KOREA'}",
        },
        {
          type: "p",
          text: "other 가 제공하는 키/값 쌍으로 갱신한다. 기존 키(name)는 덮어쓰고, 새 키(gender)는 추가. `키=값` 형태의 키워드 인자로도 넣을 수 있다.",
        },
        {
          type: "tip",
          kind: "warn",
          text: "`setdefault('age', 99)` 는 age 가 이미 있으면 25 를 돌려주고 아무것도 안 바꾼다. '기본값으로 바꾸기'가 아니라 '없을 때만 넣기'다. 바꾸려면 `update` 나 `person['age'] = 99`.",
        },
        { type: "h2", text: "3줄 정리" },
        {
          type: "list",
          items: [
            "`pop(k)` 는 키로 빼면서 값을 돌려준다 — `pop(k, 기본값)` 이면 없어도 안전",
            "`setdefault(k, v)` = get + 없으면 추가",
            "`update` 는 같은 키는 덮고 새 키는 추가 (키워드 인자도 OK)",
          ],
        },
      ],
    },
    {
      id: "n-py-7-3",
      emoji: "🎒",
      title: "세트 메서드 — add / remove / discard / pop / update",
      summary: "세트는 중복 없고 순서 없는 주머니, 꺼낼 땐 '임의'로",
      blocks: [
        {
          type: "tip",
          kind: "analogy",
          text: "세트는 구슬 주머니다. 같은 구슬은 두 개 못 넣고(중복 없음), 넣은 순서대로 나오지도 않는다(순서 없음). 손을 넣어 아무거나 꺼내는 게 `pop`.",
        },
        { type: "h2", text: "세트(set) 와 메서드 표" },
        {
          type: "p",
          text: "고유한 항목들의 정렬되지 않은 컬렉션. 중복 없고 순서 없음.",
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
          code: "my_set = {1, 2, 3}\n\nmy_set.add(4)\nprint(my_set)  # 결과: {1, 2, 3, 4}\n\nmy_set.add(4)  # 이미 있으니 변화 없음\nprint(my_set)  # 결과: {1, 2, 3, 4}\n\nmy_set.update([1, 4, 5])\nprint(my_set)  # 결과: {1, 2, 3, 4, 5}\n\nmy_set.clear()\nprint(my_set)  # 결과: set()",
        },
        {
          type: "p",
          text: "빈 세트는 `{}` 가 아니라 `set()` 으로 표시된다. `{}` 는 빈 딕셔너리다.",
        },
        { type: "h2", text: "remove / discard / pop" },
        {
          type: "code",
          code: "my_set = {1, 2, 3}\n\nmy_set.remove(2)\nprint(my_set)       # 결과: {1, 3}\n\nmy_set = {1, 2, 3}\nmy_set.discard(2)\nprint(my_set)       # 결과: {1, 3}\nmy_set.discard(10)  # 없어도 조용히 넘어감\n\nmy_set = {1, 2, 3}\nelement = my_set.pop()\nprint(element)      # 결과: 1  (임의의 요소)\nprint(my_set)       # 결과: {2, 3}\n\nmy_set.remove(10)   # 에러: KeyError: 10 (없는 값은 remove 못 함)",
        },
        {
          type: "p",
          text: "`remove` 와 `discard` 는 둘 다 '값으로 제거'인데, 없을 때 remove 는 KeyError, discard 는 무반응. 문자열의 index/find 관계와 똑같은 짝이다.",
        },
        {
          type: "tip",
          kind: "warn",
          text: "`pop()` 이 돌려주는 '임의의 요소'는 랜덤이 아니다. 해시 테이블에 저장된 순서대로 나오는 것뿐이라, 문자열이 섞인 세트는 실행할 때마다 결과가 달라 보인다. 세트에서 '첫 번째 것'을 기대하지 말 것.",
        },
        { type: "h2", text: "3줄 정리" },
        {
          type: "list",
          items: [
            "세트 = 중복 없음 + 순서 없음, 빈 세트는 `set()`",
            "`add` 하나, `update` 여러 개(extend 와 비슷)",
            "`remove` 는 없으면 에러, `discard` 는 없어도 조용, `pop` 은 임의의 것",
          ],
        },
      ],
    },
    {
      id: "n-py-7-4",
      emoji: "🔗",
      title: "세트의 집합 메서드 — 차집합·교집합·합집합",
      summary: "수학 집합 연산 그대로: - & | 와 부분집합 <= >=",
      blocks: [
        {
          type: "tip",
          kind: "analogy",
          text: "두 반의 동아리 명단을 비교하는 것. '우리 반에만 있는 애'(차집합), '양쪽 다 있는 애'(교집합), '합친 전체 명단'(합집합), '우리 반 애들이 전부 저쪽에도 있나?'(부분집합).",
        },
        { type: "h2", text: "집합 메서드와 연산자" },
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
        {
          type: "p",
          text: "difference·intersection·union 은 '새 세트를 만들어서' 돌려준다. 원본 두 세트는 그대로.",
        },
        { type: "h2", text: "코드로 확인" },
        {
          type: "code",
          code: "set1 = {0, 1, 2, 3, 4}\nset2 = {1, 3, 5, 7, 9}\n\nprint(set1.difference(set2))    # 결과: {0, 2, 4}\nprint(set1.intersection(set2))  # 결과: {1, 3}\nprint(set1.issubset(set2))      # 결과: False\nprint(set1.issuperset(set2))    # 결과: False\nprint(set1.union(set2))         # 결과: {0, 1, 2, 3, 4, 5, 7, 9}\n\n# 연산자로 똑같이\nprint(set1 - set2)              # 결과: {0, 2, 4}\nprint(set1 & set2)              # 결과: {1, 3}\nprint(set1 | set2)              # 결과: {0, 1, 2, 3, 4, 5, 7, 9}",
        },
        {
          type: "tip",
          kind: "warn",
          text: "차집합은 방향이 있다. `set1 - set2` 와 `set2 - set1` 은 다르다 (`{0, 2, 4}` vs `{5, 7, 9}`). 교집합·합집합은 순서를 바꿔도 같다.",
        },
        { type: "h2", text: "3줄 정리" },
        {
          type: "list",
          items: [
            "차집합 `-`, 교집합 `&`, 합집합 `|` — 메서드 이름과 연산자 둘 다 기억",
            "`issubset` `<=`, `issuperset` `>=` 는 True/False 를 돌려준다",
            "차집합만 방향이 있다",
          ],
        },
      ],
    },
    {
      id: "n-py-7-5",
      emoji: "🔐",
      title: "참고: 해시 테이블과 hashable",
      summary: "set 요소와 dict 키가 빠르고 중복 없는 이유 = 해시(지문)",
      blocks: [
        {
          type: "tip",
          kind: "analogy",
          text: "해시는 데이터의 '지문'이다. 사람마다 지문이 다르듯 데이터를 고정 길이의 고유한 값으로 바꾼 것. 해시 테이블은 그 지문 번호를 사물함 번호로 써서, 이름을 하나하나 뒤지지 않고 바로 그 칸을 여는 보관소다.",
        },
        { type: "h2", text: "해시와 해시 테이블" },
        {
          type: "list",
          items: [
            "해시: 임의의 크기 데이터를 고정된 크기의 고유한 값으로 변환하는 것. 파이썬에서는 정수로 표현됨",
            "해시 테이블: 해시 함수로 변환한 값을 색인(index)으로 삼아 키(key)와 데이터(value)를 저장하는 자료구조 → 데이터 검색이 매우 빠름",
            "그림: keys(John Smith, Lisa Smith, Sandra Dee) → hash function → buckets(00~15) 중 02, 01, 14 번 칸에 저장. 나머지 칸은 비어 있음",
          ],
        },
        {
          type: "tip",
          kind: "memo",
          text: "hash function → 파이썬이 재실행될 때마다 갱신됨. (그래서 문자열의 해시 값은 실행할 때마다 다르다.)",
        },
        { type: "h2", text: "set 의 요소 · dict 의 키 = 해시 테이블" },
        {
          type: "p",
          text: "세트의 요소와 딕셔너리의 키는 해시 테이블을 이용해 중복되지 않는 고유한 값을 저장한다. 각 요소/키를 해시 함수로 해시 값으로 바꿔 그 위치에 넣기 때문에, 탐색이 매우 빠르고 중복이 허용되지 않는다.",
        },
        {
          type: "code",
          code: "print(hash(1))    # 결과: 1  (같은 정수는 항상 같은 해시 값)\nprint(hash(1))    # 결과: 1\nprint(hash('a'))  # 실행할 때마다 다름\nprint(hash('a'))  # 실행할 때마다 다름 (같은 실행 안에서는 같음)",
        },
        {
          type: "list",
          items: [
            "정수: 같은 정수는 항상 같은 해시 값. `hash(1)` 과 `hash(2)` 는 다르지만 `hash(1)` 은 언제나 같다",
            "문자열: 가변 길이라 각 문자의 유니코드 코드 포인트 등을 기반으로 계산 → 실행 시마다 다르게 계산됨",
          ],
        },
        { type: "h2", text: "set.pop() 의 '임의' ≠ 랜덤" },
        {
          type: "p",
          text: "`pop()` 은 세트에서 임의의 요소를 제거하고 반환한다. 여기서 '임의(arbitrary)'는 실행할 때마다 다른 걸 뽑는다는 '무작위(random)'가 아니다 — 판서로 '랜덤 X' 라고 적어 둔 부분. 그냥 해시 테이블에 나타나는 순서대로 반환하는 것이다.",
        },
        { type: "h2", text: "hashable 과 불변성" },
        {
          type: "list",
          items: [
            "해시 테이블의 키는 불변해야 함 — 객체가 생성된 후 값을 바꿀 수 없어야 한다",
            "불변 객체는 해시 값이 변하지 않으므로 같은 값에 대해 일관된 해시 값을 유지",
            "단, 'hash 가능하다 != 불변하다' — 둘은 같은 말이 아니다. 예: 직접 만든 클래스의 인스턴스는 값을 바꿀 수 있어도 기본적으로 hashable 이다",
            "가변 객체가 hashable 하지 않은 이유: 값이 바뀌면 해시 값도 바뀔 수 있어 해시 테이블의 무결성·해시 값의 일관성을 지킬 수 없음",
          ],
        },
        {
          type: "code",
          code: "# 세 줄 모두 에러 — 한 줄씩 따로 실행해 볼 것\nprint(hash([1, 2, 3]))         # 에러: TypeError: unhashable type: 'list'\nmy_set = {[1, 2, 3], 1, 2, 3}  # 에러: TypeError: unhashable type: 'list'\nmy_dict = {{3, 2}: 'a'}        # 에러: TypeError: unhashable type: 'set'",
        },
        {
          type: "tip",
          kind: "warn",
          text: "리스트를 세트에 넣거나 딕셔너리 키로 쓰면 `unhashable type` 에러. 지문이 바뀌는 물건은 지문 보관소에 못 넣는다. 묶음을 키로 쓰고 싶으면 튜플(불변)로.",
        },
        { type: "h2", text: "3줄 정리" },
        {
          type: "list",
          items: [
            "해시 = 데이터의 지문(고정 길이 정수), 해시 테이블 = 지문을 칸 번호로 쓰는 보관소",
            "set 요소·dict 키가 빠르고 중복 없는 이유가 바로 해시 테이블",
            "키는 hashable 이어야 한다 — 리스트·세트는 못 씀, `set.pop` 은 랜덤이 아니라 테이블 순서",
          ],
        },
      ],
    },
    {
      id: "n-py-7-6",
      emoji: "📜",
      title: "참고: BNF / EBNF — 공식 문서의 대괄호 읽는 법",
      summary: "pop(key[, default]) 의 [ ] 는 '있어도 되고 없어도 되는 것'",
      blocks: [
        {
          type: "tip",
          kind: "analogy",
          text: "BNF 는 '문법을 적는 문법'이다. 레시피를 적을 때 '[취향껏 후추]' 처럼 선택 재료를 괄호로 묶듯이, 프로그래밍 언어 문서도 약속된 기호로 '필수/선택/반복'을 표시한다.",
        },
        { type: "h2", text: "BNF 와 EBNF" },
        {
          type: "list",
          items: [
            "BNF (Backus-Naur Form): 프로그래밍 언어의 문법을 표현하기 위한 표기법",
            "EBNF (Extended Backus-Naur Form): BNF 를 확장한 표기법. 메타 기호를 추가해 더 간결하고 표현력이 강해진 형태",
            "쓰는 이유: 서로 다른 프로그래밍 언어, 데이터 형식, 프로토콜 등의 문법을 통일해서 정의하기 위함",
          ],
        },
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
          code: "# 파이썬 공식 문서 표기\n# pop(key[, default])\n#   키가 있으면 제거하고 값을 반환, 없으면 default 를 반환.\n#   default 가 없고 키도 없으면 KeyError.\n\nperson = {'name': 'Alice'}\nprint(person.pop('name'))         # 결과: Alice   (default 생략)\nprint(person.pop('name', 'none')) # 결과: none    (default 사용)",
        },
        {
          type: "tip",
          kind: "memo",
          text: "문서상의 표기법 — `[, default]` 처럼 대괄호로 묶인 부분은 넣어도 되고 안 넣어도 되는 선택 인자라는 뜻. 앞에서 본 `s.replace(old, new[,count])`, `s.strip([chars])` 도 같은 규칙.",
        },
        {
          type: "tip",
          kind: "warn",
          text: "문서의 `[ ]` 를 보고 코드에 진짜 대괄호를 치면 안 된다. `person.pop('name'[, 'none'])` 은 문법 오류 — 대괄호는 '선택'이라는 표시일 뿐, 실제 코드에선 그냥 `person.pop('name', 'none')`.",
        },
        { type: "h2", text: "3줄 정리" },
        {
          type: "list",
          items: [
            "BNF/EBNF = 언어 문법을 적는 공통 표기법",
            "`[ ]` 선택, `{ }` 0번 이상 반복, `( )` 그룹",
            "공식 문서의 `pop(key[, default])` 에서 default 는 선택 인자",
          ],
        },
      ],
    },
  ],
};
