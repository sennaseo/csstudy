# csStudy — 구글 플레이스토어 등록 문구

작성일: 2026-08-31
글자수는 스크립트로 실측(`node -e`, JS 문자열 `.length` 기준 = UTF-16 코드 유닛). 이모지 등 서로게이트 페어 문자는 2로 잡히므로 여유 있게 썼다.

> **개수 확인 완료 (2026-08-31)**: 실제 모듈을 import 해서 센 결과 **문제 139개, 카드 120장**이다.
> (`QUESTIONS.length` / `CARDS.length` — 정규식으로 `id:` 를 세면 문제 데이터 안의 예제 코드까지 잡혀 부풀려진다.)
> 문제·카드는 계속 늘어나므로 등록 직전에 다시 세어볼 것: `npx tsx` 로 위 두 배열 length 확인.

---

## 1. 앱 이름 (30자 제한)

| 후보 | 글자수 |
| --- | --- |
| csStudy | 7 |
| csStudy - 하루 5분 CS 퀴즈 | 21 |
| csStudy: 개발자 CS 학습 | 18 |
| csStudy - 코딩테스트 전 CS 복습 | 23 |

(공백·기호 포함, JS `.length` 기준 실측)

**추천: `csStudy - 하루 5분 CS 퀴즈`** (21자)

이유: 브랜드명(csStudy)은 고정하고, 뒤에 핵심 가치(짧은 시간·CS·퀴즈 형식)를 붙이는 게 검색 노출에 유리하다. "코딩테스트"는 앱의 실제 목적(사고 회복)과 어긋나서 제외.

---

## 2. 짧은 설명 (Short description, 80자 제한, 한국어)

| 후보 | 글자수 |
| --- | --- |
| A. 숏폼 대신 CS 한 문제. 하루 5분, 개발 사고 회복 습관 | 33 |
| B. 도파민 과부하에도 하루 5문제. 게임처럼 쌓는 CS 학습 습관 | 34 |
| C. 위젯으로 잠깐, 앱으로 5분. 로그인 없는 오프라인 CS 퀴즈 | 34 |

**추천: A. "숏폼 대신 CS 한 문제. 하루 5분, 개발 사고 회복 습관"** (33자)

이유: "왜 이 앱인가"(숏폼 대신)를 첫 마디에 넣어서, 기능 나열형 문구보다 사용 동기에 바로 꽂힌다. 80자 제한에 여유가 많이 남아 있어 필요하면 senna가 위젯/오프라인 언급을 덧붙여도 된다.

---

## 3. 자세한 설명 (Full description, 4000자 제한, 한국어)

```
숏폼을 열었다가 정신 차리면 30분이 지나 있던 적, 있으신가요.

csStudy는 그 30분을 5분으로 바꾸는 앱입니다. 완벽하게 공부하자는 게 아니라, 하루에 딱 1~5문제만 풀면서 "개발자로서의 감"을 잃지 않는 게 목표예요. 시험 대비용 방대한 CS 지식이 아니라, 매일 조금씩 두뇌를 개발 모드로 되돌리는 가벼운 습관 도구입니다.

■ 오늘의 5문제
앱을 열면 매일 자동으로 5문제가 뽑힙니다. 뭘 풀지 고민할 필요 없이 그냥 시작하면 됩니다. 1분이면 끝나요.

■ 게임처럼 이어지는 학습 경로
문제들이 구불구불한 하나의 길로 이어져 있고, 순서대로 풀며 앞으로 나아갑니다. 하트(생명력)와 XP, 연속 학습일(스트릭), 함께 성장하는 버디 캐릭터까지 — 공부가 아니라 게임 한 판처럼 느껴지도록 만들었습니다.

■ 다시 만나는 복습
한 번 풀고 끝이 아닙니다. 시간이 지나 잊어버릴 즈음, 잊어버리는 곡선(SRS)에 맞춰 정확한 타이밍에 다시 물어봅니다.

■ 나에게 맞는 트랙
프론트엔드, 백엔드, 또는 전체 — 내 방향에 맞는 트랙을 골라 그 순서대로 학습할 수 있습니다.

■ 단어장
문제 풀이가 부담스러운 순간엔 단어장을 켜세요. 카드를 한 장씩 넘기며 탭하면 뒤집혀 뜻이 나옵니다. 넘기고, 보고, 또 넘기고 — 그게 전부입니다.

■ 홈 화면 위젯
앱을 열 필요도 없습니다. 홈 화면에 CS 용어 카드 위젯을 올려두면, 잠금을 풀 때마다 카드 한 장이 눈에 들어옵니다. 탭하면 뒤집혀 뜻이 보이고, 다음으로 넘기면 새 카드가 옵니다.

■ 다루는 범위
프론트엔드(React, TypeScript, 상태관리), 백엔드(Java, Spring Boot), CS 기초(운영체제, 네트워크, 자료구조), 데이터베이스, 시스템 설계, 기술 면접까지 — 문제 139개, 용어 카드 120장을 담았습니다.

■ 가볍게, 조용히
인터넷 연결 없이도 전부 동작합니다. 계정을 만들 필요도, 로그인할 필요도 없습니다. 광고도 없습니다. 그냥 열어서 몇 문제 풀고 닫으면 됩니다.

완벽한 개발자가 되기 위한 앱이 아니라, 오늘도 개발자로 살아있기 위한 아주 작은 습관 하나. csStudy였습니다.
```

**글자수: 1,071자** (스크립트 실측, 제한 4000자 대비 여유 많음)

작성 방침 메모:
- 첫 3줄("숏폼을 열었다가 ~ 습관 도구입니다")에 "왜 이 앱인가"를 몰아넣었다. 더보기 누르기 전에 이 부분만 보인다.
- 기능은 이모지 없이 `■` 소제목으로만 구분 — 절제된 톤 유지.
- "듀오링고식"이라는 표현은 쓰지 않고 "게임처럼", "학습 경로", "생명력" 등으로 풀어썼다.
- 과장 표현("최고의", "1위", "유일한") 없음.
- 동기화(AWS Lambda) 기능은 작업 지시의 "사실 범위"에 없어서 이번 문구에는 넣지 않았다. 필요하면 추가하되, "계정 없음"과 병기할 때는 "선택적 동기화(계정 불필요)"처럼 모순되지 않게 풀어써야 한다.

---

## 4. 영문 버전

### Short description (80 characters max)

```
A. Skip the scroll. One CS question at a time to reset your dev brain
B. Doomscroll-proof CS drills. 5 quick questions, no account needed
C. Bite-sized CS quiz. 5 questions a day to keep your dev instincts sharp
```

글자수(문자 기준, 스크립트 실측): A. 66 / B. 64 / C. 70

**추천: A** — "why this app" 톤을 그대로 살렸고 여유도 있다.

### Full description

```
Ever opened a short-video app and lost 30 minutes without noticing?

csStudy turns that 30 minutes into 5. It is not about mastering computer science, it is about doing just 1 to 5 questions a day so you do not lose your developer instincts. Not exam prep. A light daily habit that keeps your brain in dev mode.

■ Today's 5 Questions
Open the app and 5 questions are picked for you automatically. No deciding what to study, just start. Takes about a minute.

■ A Path That Keeps Moving
Questions are laid out along one winding path. Hearts (lives), XP, streaks, and a buddy character that grows with you, studying feels less like studying and more like playing a level.

■ Review Before You Forget
Answering once is not the end. Questions come back right before you are about to forget them, timed with a spaced-repetition curve.

■ Pick Your Track
Frontend, backend, or everything, choose the track that matches your direction and follow its order.

■ Flashcards
When solving questions feels like too much, switch to flashcards. Flip through them one at a time, tap to reveal the meaning, swipe to the next.

■ Home Screen Widget
You do not even need to open the app. Add the CS term widget to your home screen, and a new card greets you every time you unlock your phone. Tap to flip, tap next for another.

■ What's Inside
Frontend (React, TypeScript, state management), backend (Java, Spring Boot), CS fundamentals (OS, networking, data structures), databases, system design, and interview practice. 139 questions and 120 term cards.

■ Light and Quiet
Works fully offline. No account, no login required. No ads. Just open it, answer a few questions, close it.

Not an app for becoming a perfect developer. Just a small daily habit for staying one. csStudy.
```

**글자수: 1,763자** (스크립트 실측)

문체 메모: 축약형(It's, don't 등)을 풀어 쓴 건 스마트따옴표(') 처리로 글자수가 흔들리는 걸 피하기 위한 것 — 내용상 문제는 없다. 원하면 senna가 축약형으로 되돌려도 무방.

---

## 5. 카테고리 추천

**추천: 교육 (Education)**

근거:
- 콘텐츠가 CS 지식 문제풀이 + 용어 학습(플래시카드)으로, 구글 플레이 정책상 "교육" 카테고리의 전형적 정의(학습 콘텐츠, 퀴즈, 플래시카드, 튜토리얼)에 정확히 부합.
- "도서/참고자료"는 검색/열람 위주 콘텐츠(사전, 백과사전, e-book 리더)에 가깝고, csStudy는 능동적 문제풀이·진행도·SRS 복습이 핵심이라 "학습 활동"에 더 가깝다.
- Duolingo, Anki, Quizlet 등 유사 앱들도 전부 "교육" 카테고리로 등록돼 있어 사용자 탐색 패턴과도 맞음.

참고로 콘텐츠 유형 태그(선택 가능하다면)는 "퀴즈", "플래시카드", "자기계발" 정도가 적합해 보인다 — 이건 콘솔 UI에서 실제 선택지를 보고 senna가 고르는 게 정확하다.

---

## 6. 콘텐츠 등급 설문 답변 가이드 (IARC)

플레이 콘솔의 콘텐츠 등급 설문은 카테고리별로 "있음/없음" 또는 빈도를 묻는다. csStudy는 CS 학습 퀴즈 앱이라 아래 항목은 전부 "없음"으로 답하면 된다.

| 설문 항목 | 답변 | 근거 |
| --- | --- | --- |
| 폭력성 (사실적/만화적/공포 등) | 없음 | 텍스트 기반 CS 문제/카드 콘텐츠뿐, 폭력 묘사 없음 |
| 성적 콘텐츠 / 노출 | 없음 | 해당 없음 |
| 저속한 언어/욕설 | 없음 | 해당 없음 |
| 도박 관련 콘텐츠 (시뮬레이션 포함) | 없음 | 확률형/도박 요소 없음. 하트·XP·스트릭은 실제 화폐나 도박성 구조가 아닌 순수 게이미피케이션 |
| 약물·알코올·담배 | 없음 | 해당 없음 |
| 사용자 생성 콘텐츠 (UGC) | 없음 | 문제/카드는 모두 앱에 내장된 고정 콘텐츠. 사용자가 콘텐츠를 작성/업로드/공유하는 기능 없음 |
| 사용자 간 상호작용 (채팅, 멀티플레이 등) | 없음 | 로그인/계정 자체가 없고, 다른 사용자와의 상호작용 기능 없음 |
| 위치 공유 | 없음 | 위치 권한 요청 없음 |
| 개인정보 수집/공유 | 없음 (또는 최소) | 계정·로그인 없음. 로컬(localStorage) 저장이 기본. **주의**: README 기준 AWS Lambda 기반 "기기 간 동기화"가 선택 기능으로 존재한다면, 이건 사용자가 켤 경우에 한해 데이터가 서버로 전송되는 것이므로 콘솔의 "데이터 보안" 섹션(수집하는 데이터 유형, 목적, 암호화 여부 등)에 별도로 신고해야 한다. 이 부분은 senna가 실제 배포 버전에 동기화 기능을 포함하는지 확인 후 답변 필요 — 아래 참고 참조 |
| 인앱 구매 | 없음 (확인 필요) | 코드 상 결제/IAP 관련 파일 미발견. senna가 실제 배포 시 다시 확인 |
| 광고 | 없음 | AdMob 등 광고 SDK 코드 없음 확인 (grep 결과 없음) |
| 뉴스/시사 콘텐츠 | 없음 | 해당 없음 |

### senna가 직접 확인/결정해야 할 것
1. **동기화 기능 포함 여부**: README에는 AWS Lambda 기반 동기화가 있다고 나오는데, 작업 지시의 "사실 범위"에는 없었다. 이 앱스토어 등록 시점 배포 빌드에 이 기능이 켜져 있는지에 따라 "데이터 보안" 설문(어떤 데이터를 수집하는지, 서버 전송 여부, 암호화 여부)에 실제로 답해야 하는 항목이 달라진다. 동기화가 선택 사항이고 옵트인이라면 "사용자가 선택적으로 제공하는 데이터"로 신고하면 된다.
2. **최종 인앱결제 여부**: 코드에서 결제 SDK를 못 찾았지만, 스토어 등록 폼에는 "인앱 상품 없음"으로 명시적 체크가 필요하니 최종 확인 권장.
3. **문제/카드 개수**: 139문제·120카드로 확정(실측). 계속 늘어나는 데이터이므로 등록 직전 재확인 권장 — `npx tsx` 로 `QUESTIONS.length`/`CARDS.length` 를 볼 것. `grep -c "id:"` 방식은 예제 코드까지 세므로 쓰지 말 것.
4. **타겟 연령대**: 콘텐츠 자체는 전연령 무해하지만, "교육" 카테고리 + 콘텐츠 등급 설문 결과에 따라 자동 산출되는 등급(대개 전체 이용가 계열)을 콘솔에서 최종 확인.
