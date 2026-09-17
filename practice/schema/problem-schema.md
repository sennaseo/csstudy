# 문제 정의 스키마 (v0.1)

BackendQuest의 모든 문제는 JSON 하나로 정의된다. 이 문서만 보고 문제를 쓸 수 있어야 한다.

관련: 기획서 8장(퀴즈 예시), 11장(유형별 UX), 12장(채점), 15장(`problems` 테이블), 20장(첫 레슨).

---

## 0. 5분 요약

```json
{
  "id": "c3-l1-p3",
  "type": "FILL",
  "prompt": "`/posts` 주소로 들어왔을 때 이 함수가 실행되게 하려면?",
  "payload": { "...유형마다 다름..." },
  "answer_key": { "value": "...유형마다 다름..." },
  "hint": "주소를 '가져와서 보여주기'는 어떤 방식일까요?",
  "why_explain": "GET = 가져오기. 글을 '보는' 거니까 GET이에요.",
  "xp": 10
}
```

- **공통 필드는 위 8개가 전부**다. 나머지(`code`, `apply`, `time_limit_sec`)는 필요할 때만.
- 유형별로 다른 건 **`payload`와 `answer_key.value` 두 곳뿐**이다. 이것만 외우면 된다.
- 한국어로 쓴다. `prompt`/`hint`/`why_explain`은 전부 한글.
- prompt·hint·why_explain 안에서 백틱(`` ` ``)으로 감싼 부분은 코드로 렌더된다.

---

## 1. 공통 필드

| 필드 | 필수 | 타입 | 설명 |
|---|---|---|---|
| `id` | ✅ | string | 전역 유일. 컨벤션: `c{챕터}-l{레슨}-p{문제}` (예: `c3-l1-p3`) |
| `type` | ✅ | string | 아래 7종 중 하나 |
| `prompt` | ✅ | string | 질문 한두 줄. 짧게. |
| `payload` | ✅ | object | 문제 본문 데이터. 유형별 규격은 3장. |
| `answer_key` | ✅ | object | 정답 + 채점 방식. 4장. |
| `hint` | ✅ | string | **1차 오답 때** 보여줄 한 칸짜리 힌트. 정답을 말하지 않는다. |
| `why_explain` | | string | 💡왜? 버튼 뒤에 접히는 설명. 3줄 이내. |
| `xp` | | number | 기본값 10. |
| `code` | | object | 문제에 같이 보여줄 코드 블록. 2장. |
| `apply` | | array | 맞히면 사용자 프로젝트에 쌓이는 코드. 5장. |
| `time_limit_sec` | | number | 목표 소요시간(초). UX 표시용, 강제 아님. |

### `type` 7종

| 값 | 유형 | UX |
|---|---|---|
| `CONNECT` | A. 연결하기 | 왼쪽 점 → 오른쪽 점 선 긋기 |
| `PLACE` | B. 위치 맞추기 | 코드 블록을 영역 중 하나로 탭/드롭 |
| `ORDER` | C. 순서 맞추기 | 카드 위아래 드래그 정렬 |
| `SELECT` | D. 코드 블록 선택 | 보기 중 탭 1번 |
| `FILL` | E. 빈칸 채우기 | 보기 탭 **또는** 키보드 입력 |
| `WRITE` | F. 직접 입력 | 코드 에디터에 직접 작성 |
| `DEBUG` | G. 디버깅 | 에러 보고 원인 선택 → 수정 입력 |

(15장 DB의 enum 값과 동일. `problems.type`에 그대로 들어간다.)

---

## 2. `code` — 문제와 같이 보여주는 코드 블록

문제 본문에 코드가 필요할 때만 쓴다.

```json
"code": {
  "lang": "java",
  "body": "@______(\"/posts\")\npublic String list(Model model) { ... }"
}
```

- `lang`: `java` / `html` / `yaml` / `text` / `bash`
- `body`: 그대로 렌더. **빈칸은 `______`(언더바 6개)** 로 표시한다. 여러 개면 순서대로 1번, 2번 빈칸.
- 화살표 주석(`// ← 주소`)도 그냥 body에 적으면 된다.

---

## 3. 유형별 `payload`

### A. `CONNECT` — 연결하기

```json
"payload": {
  "left":  [{ "id": "L1", "text": "@GetMapping(\"/posts\")" }, ...],
  "right": [{ "id": "R1", "text": "\"/posts 주소로 들어오면 받기\"" }, ...]
}
```
- 왼쪽·오른쪽 개수는 달라도 된다(오른쪽에 오답 미끼를 더 넣어도 됨).
- 렌더 시 오른쪽은 섞어서 보여준다. JSON에 정답 순서대로 써도 무방.

### B. `PLACE` — 위치 맞추기

```json
"payload": {
  "item": "return postService.findAll();  // 글을 다 가져와",
  "zones": [
    { "id": "controller", "label": "Controller" },
    { "id": "service",    "label": "Service" },
    { "id": "repository", "label": "Repository" }
  ]
}
```
- 옮길 대상은 **한 개(`item`)**. 여러 개를 여러 영역에 배치시키고 싶으면 문제를 나눈다.
  (한 문제 = 한 판단. 11장의 "10~30초" 원칙.)

### C. `ORDER` — 순서 맞추기

```json
"payload": {
  "cards": [
    { "id": "repo",       "text": "Repository가 DB에서 조회" },
    { "id": "browser",    "text": "브라우저가 /posts 요청" },
    ...
  ]
}
```
- `cards`는 **섞인 상태 그대로** 쓴다. 정답 순서는 `answer_key`에.

### D. `SELECT` — 코드 블록 선택

```json
"payload": {
  "choices": [
    { "id": "a", "text": "Controller" },
    { "id": "b", "text": "Service" },
    { "id": "c", "text": "Repository" }
  ]
}
```

### E. `FILL` — 빈칸 채우기

```json
"payload": {
  "input": "choice",
  "choices": [{ "id": "a", "text": "@GetMapping" }, ...]
}
```
- `input`: `"choice"`(보기 제공) 또는 `"text"`(키보드 입력). 11장의 "보기 제공 → 점차 보기 제거".
- `input: "text"`면 `choices`를 쓰지 않는다.
- 빈칸 위치는 `code.body`의 `______`로 표시.

### F. `WRITE` — 직접 입력

```json
"payload": {
  "input": "text",
  "starter": "@PostMapping(\"/posts\")\npublic String create(PostForm form) {\n    \n}",
  "lang": "java"
}
```
- `starter`: 에디터에 미리 채워둘 뼈대. 없으면 빈 에디터.
- `payload.lang`은 에디터 문법 하이라이트용(`code.lang`과 별개).

### G. `DEBUG` — 디버깅

```json
"payload": {
  "error": "Whitelabel Error Page (404)",
  "cause_choices": [
    { "id": "a", "text": "DB가 비어서" },
    { "id": "b", "text": "주소가 /post라서 /posts를 못 받음" },
    { "id": "c", "text": "함수 이름이 틀려서" }
  ],
  "fix": { "code": "@GetMapping(\"______\")", "lang": "java" }
}
```
- 2단계 문제: **원인 선택 → 수정 입력**.
- `error`: 사용자가 실제로 보는 에러 메시지(진짜 문구 그대로).
- 틀린 코드는 `code.body`에 넣는다.
- `fix`: 생략 가능. 생략하면 원인 선택만 하는 문제가 된다.

---

## 4. `answer_key` — 정답과 채점

```json
"answer_key": {
  "value": ...,          // 필수. 유형마다 모양이 다르다
  "match": "normalized", // 선택. 기본 "exact"
  "accept": [...],       // 선택. 다중 정답
  "require": [...]       // 선택. 필수 토큰
}
```

### 4.1 `value` — 유형별 모양

| 유형 | `value` | 예 |
|---|---|---|
| `CONNECT` | `{왼쪽id: 오른쪽id}` | `{ "L1": "R1", "L2": "R2" }` |
| `PLACE` | zone id | `"controller"` |
| `ORDER` | card id 배열(정답 순서) | `["browser","controller","service","repo","view"]` |
| `SELECT` | choice id | `"a"` |
| `FILL` (choice) | choice id | `"a"` |
| `FILL` (text) | 문자열 | `"posts"` |
| `WRITE` | 모범답안 문자열 | `"postService.save(form);\nreturn \"redirect:/posts\";"` |
| `DEBUG` | `{ "cause": id, "fix": 문자열 }` | `{ "cause": "b", "fix": "/posts" }` |

> `DEBUG`에서 `payload.fix`가 없으면 `value`는 `{ "cause": "b" }`만 쓴다.

### 4.2 `match` — 채점 방식 (12장)

| 값 | 뜻 | 쓰는 곳 |
|---|---|---|
| `exact` | 완전 일치. **기본값** | id 비교(A~E 보기형)는 전부 이것. 명시할 필요 없음 |
| `normalized` | 정규화 후 비교 | 텍스트 입력(FILL text, DEBUG fix) |
| `tokens` | `require`의 토큰이 전부 들어있으면 정답 | WRITE |

**`normalized`가 무시하는 것**(12장 2번):
공백·개행, 따옴표 종류(`"` ↔ `'`), 끝 세미콜론 유무, 자바 키워드 대소문자.
→ `@GetMapping("/posts")` 와 `@GetMapping( '/posts' )` 는 같은 정답.

> AST 비교(12장의 F 고난도, 변수명이 달라도 통과)는 **아직 안 넣었다.**
> 지금은 `tokens`로 커버한다 — 변수명이 답에 안 들어가게 `require`를 짜면 된다.
> 예: 변수명 무관하게 `model.addAttribute("posts", ...)`를 요구하려면
> `require: ["model.addAttribute", "\"posts\""]`.
> 진짜 AST가 필요해지면 `match: "ast"`를 추가하면 된다. 자리는 비워뒀다.

### 4.3 `accept` — 다중 정답 허용

`value`와 같은 모양의 대안 답을 배열로. `value` 또는 `accept` 중 하나만 맞으면 정답.

```json
"answer_key": {
  "value": "List<Post> posts = postService.findAll();",
  "match": "normalized",
  "accept": ["var posts = postService.findAll();"]
}
```

### 4.4 `require` — 필수 토큰 (`match: "tokens"`)

```json
"answer_key": {
  "match": "tokens",
  "value": "postService.save(form);\nreturn \"redirect:/posts\";",
  "require": [
    { "token": "postService.save", "miss_hint": "Service에게 저장을 시키는 줄이 없어요." },
    { "token": "redirect:/posts",  "miss_hint": "저장한 뒤 목록으로 돌려보내야 해요." }
  ]
}
```

- `token`은 **정규화 후** 부분 문자열로 검사한다(`normalized`와 같은 규칙).
- 전부 있으면 정답. 일부만 있으면 **부분 정답** → "거의 다 왔어요" + 빠진 토큰의 `miss_hint`를 보여준다(12장 3번).
- `value`는 이때 채점에 안 쓰이고 **정답 공개용 모범답안**이다.
- `miss_hint`는 생략 가능(그러면 토큰만 표시).

---

## 5. `apply` — 코드 누적 (이 서비스의 핵심)

문제를 맞히면 사용자 프로젝트(`user_projects.files`, 15장)에 코드가 쌓인다.
파일 경로는 9장 파일 트리 기준의 **프로젝트 루트 상대경로**.

```json
"apply": [
  { "file": "src/main/java/com/example/board/post/PostController.java",
    "insert_after": "// @@methods",
    "code": "    @GetMapping(\"/posts\")\n    public String list(Model model) { ... }" }
]
```

배열인 이유: 한 문제가 두 파일을 건드릴 수 있다(예: Controller + list.html).
대부분의 문제는 `apply`가 **없다**. 개념 문제는 코드를 쌓지 않는다.
한 레슨의 여러 문제가 같은 함수를 조금씩 채워 나가는 게 정상이다.

### 5.1 세 가지 연산

각 엔트리는 `file` + **다음 셋 중 정확히 하나**를 가진다.

**① `create` — 파일을 통째로 만든다**

```json
{ "file": "src/main/resources/templates/posts/list.html",
  "create": "<table>\n  ...\n</table>" }
```
파일이 이미 있으면 덮어쓴다. 새 파일 생성에만 쓴다.

**② `insert_after` — 앵커 다음 줄에 끼워 넣는다**

```json
{ "file": "src/main/java/com/example/board/post/PostController.java",
  "insert_after": "// @@methods",
  "code": "    @GetMapping(\"/posts\")\n    public String list(Model model) { }" }
```
`insert_after`는 파일 안에서 **딱 한 번 등장하는 문자열**이어야 한다. 없거나 두 번 이상이면 실패(작성자 실수).

**③ `replace` — 기존 문자열을 바꾼다**

```json
{ "file": "src/main/java/com/example/board/post/PostController.java",
  "replace": "public String list(Model model) { }",
  "code": "public String list(Model model) {\n        model.addAttribute(\"posts\", postService.findAll());\n        return \"posts/list\";\n    }" }
```
빈 껍데기를 채우거나(레슨 진행), 틀린 코드를 고칠 때(DEBUG). `replace`도 유일해야 한다.

> **줄 번호는 절대 쓰지 않는다.** 앞 문제가 한 줄만 더 넣어도 전부 어긋난다.
> 앵커 문자열이 유일하기만 하면 순서가 바뀌어도 살아남는다.

### 5.2 앵커 주석 규칙

`create`로 파일을 만들 때, 나중에 끼워 넣을 자리에 **`@@이름` 앵커 주석**을 미리 심어둔다.

```java
package com.example.board.post;

import org.springframework.stereotype.Controller;
// @@imports

@Controller
public class PostController {
    // @@fields
    // @@methods
}
```

- 자바/HTML/YAML 각각의 주석 문법으로: `// @@methods`, `<!-- @@rows -->`, `# @@datasource`
- 앵커는 **지우지 않는다**. 계속 누적할 자리로 남는다.
- 최종 ZIP 다운로드 시 `@@` 주석 줄만 걷어내면 깨끗한 코드가 된다.

**자바 파일은 `// @@imports` 앵커를 반드시 넣는다.** 새 애노테이션(`@PostMapping` 등)을 쓰는 문제는
import 추가 엔트리를 **같은 `apply` 배열에 하나 더** 적어야 컴파일된다. 이것 때문에 `apply`가 배열이다.

```json
"apply": [
  { "file": "...PostController.java", "insert_after": "// @@imports",
    "code": "import org.springframework.web.bind.annotation.PostMapping;" },
  { "file": "...PostController.java", "insert_after": "    // @@methods",
    "code": "    @PostMapping(\"/posts\") ...", "note": "글쓰기 기능이 붙었어요!" }
]
```

> 같은 import를 두 문제가 각각 넣으면 중복된다. 런타임이 **이미 있는 줄이면 건너뛰도록** 처리한다
> (insert 대상 `code`가 파일에 이미 있으면 no-op). 작성자는 신경 쓰지 않아도 된다.

### 5.3 `note` — 완료 피드백

```json
{ "file": "...PostController.java", "insert_after": "// @@methods", "code": "...",
  "note": "PostController.java의 list() 함수가 완성됐어요!" }
```
"내 프로젝트 뷰"(10장)에서 하이라이트와 함께 띄울 한 줄. 선택.

---

## 6. 오답 피드백 흐름 (12장)

스키마가 지원해야 하는 건 이 흐름이다. 별도 필드를 더 만들지 않았다.

| 시도 | 보여주는 것 | 출처 |
|---|---|---|
| 1회 오답 | 한 칸짜리 힌트 (정답 아님) | `hint` |
| 2회 오답 | 정답 공개 + "💬 AI에게 물어보기" 버튼 | `answer_key.value` + `why_explain` |
| WRITE 부분정답 | "거의 다 왔어요" + 빠진 토큰 안내 | `require[].miss_hint` |

- `hint`가 정답을 그대로 말하면 안 된다. "주소가 한 글자 다르지 않나요?"는 OK, "`/posts`로 고치세요"는 ❌.
- AI 튜터 호출(13장)은 스키마에 없다. 런타임이 `(문제 JSON + 사용자 제출)`을 그대로 LLM에 넘긴다.

---

## 7. 파일 배치

```
schema/
  problem-schema.md      ← 이 문서
  problems-sample.json   ← 챕터3 레슨1 전체 + 7유형 샘플
  check_apply.py         ← 검증기
content/
  c3-l1.json             ← 앞으로 레슨별로 한 파일
```

문제를 쓴 뒤 **반드시 검증기를 돌린다.** 필수 필드·앵커 유일성·apply 체인이 실제 코드를 만드는지 확인한다.

```
python schema/check_apply.py content/c3-l1.json
```

레슨 파일 형태:

```json
{
  "lesson_id": "c3-l1",
  "title": "글 목록을 화면에 띄우기",
  "chapter": 3,
  "problems": [ { ... }, { ... } ]
}
```

`chapter`/`lesson_id`는 15장의 `lessons` 테이블로 들어간다. 문제 JSON 안에 챕터를 또 적지 않는다(`id` 접두어로 충분).

---

## 8. 작성 체크리스트

- [ ] `prompt`가 두 줄 넘지 않는가
- [ ] `hint`가 정답을 흘리지 않는가
- [ ] `why_explain`이 3줄 이내이고 비유로 시작하는가 (부록 톤 규칙)
- [ ] 텍스트 입력인데 `match`를 안 적지 않았는가 (`normalized` 필요)
- [ ] `apply`의 `insert_after`/`replace` 앵커가 그 파일에서 유일한가
- [ ] 이 문제가 진짜 게시판의 한 조각인가 (버려지는 연습문제 ❌)
