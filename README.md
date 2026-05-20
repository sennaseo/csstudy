# csStudy

도파민 과부하 상태에서도 1~5문제씩 가볍게 푸는 **개인용 개발 학습 툴**.
숏폼 대신 잠깐 켜는 "개발자 메모 툴" 느낌의 초경량 로컬 웹앱.

> 목적: 공부의 완벽함이 아니라 **개발 사고 회복**.

---

## 빠른 시작

```bash
# 1. 의존성 설치
npm install

# 2. 개발 서버
npm run dev      # http://localhost:5173

# 3. 프로덕션 빌드
npm run build
npm run preview
```

> Node 18+ 권장. `npm` 대신 `pnpm` / `bun` 도 그대로 동작.

---

## 폴더 구조

```
csStudy/
├─ index.html              # 다크 클래스 고정 + #root
├─ vite.config.ts          # 최소 Vite 설정 (React 플러그인만)
├─ tailwind.config.js      # darkMode: "class", 자체 ink/accent 팔레트
├─ tsconfig.json
├─ src/
│  ├─ main.tsx             # 진입점 (StrictMode + createRoot)
│  ├─ App.tsx              # 레이아웃 + 최초 문제 픽
│  ├─ index.css            # Tailwind 베이스 + 전역
│  ├─ types.ts             # 도메인 타입 단일 소스
│  ├─ data/
│  │  └─ questions.ts      # 하드코딩 문제 데이터 + CATEGORIES
│  ├─ store/
│  │  └─ useStudyStore.ts  # Zustand 전역 스토어 + localStorage 영속화
│  └─ components/
│     ├─ CategoryFilter.tsx
│     ├─ QuestionCard.tsx
│     └─ DailyStats.tsx
```

### 역할 요약

| 파일 | 역할 |
| --- | --- |
| `types.ts` | `Question`, `QuestionRecord`, `Category` 등 도메인 타입. 다른 파일은 이걸만 import. |
| `data/questions.ts` | 문제 데이터(하드코딩). 추후 JSON 파일이나 API 로 교체 가능. |
| `store/useStudyStore.ts` | 전역 상태 + 액션. localStorage 읽기/쓰기. **확장의 중심**. |
| `App.tsx` | 컴포지션만 담당 — 로직 없음. |
| `components/*` | 표현 컴포넌트. 모두 store 셀렉터로 데이터 접근. |

---

## Zustand 스토어 구조

`useStudyStore` 하나에 모든 상태/액션이 모여 있다.

**Persisted (localStorage 저장)**

- `records: Record<id, QuestionRecord>` — 문제별 마지막 평가/리뷰 횟수.
- `dailyCounts: Record<'YYYY-MM-DD', number>` — 날짜별 푼 개수.
- `activeCategory: Category | null` — 현재 필터.

**In-memory only**

- `currentQuestion` — 현재 화면 문제.
- `isAnswerVisible` — 정답 토글.

**Actions**

- `setCategory(c)` — 필터 변경 + 새 문제 자동 픽.
- `pickRandom()` — 현재 필터 풀에서 랜덤 1개 (직전과 같지 않게).
- `toggleAnswer()` — 정답 보기 토글.
- `recordStatus(status)` — 평가 저장 + 오늘 카운트 +1 + 다음 문제로 이동.
- `getTodayCount()` — 오늘 푼 개수 selector.

> 컴포넌트는 항상 **셀렉터로 좁혀서** 구독한다: `useStudyStore(s => s.currentQuestion)`.
> 그래야 다른 상태가 바뀌어도 리렌더가 안 일어난다.

---

## 확장 로드맵 (구조에 미리 자리만 잡아둠)

| 기능 | 어디서 시작할지 |
| --- | --- |
| **Spaced repetition (망각곡선)** | `QuestionRecord.lastReviewedAt + reviewCount` 가 이미 있다. `store` 에 `pickDue()` 셀렉터 추가 → 우선순위 기반 픽으로 교체. |
| **AI 면접관 모드** | `store` 에 `askFollowup()` async 액션 추가. OpenAI/Claude API 호출 → `currentQuestion.hint` 에 후속 질문 채우기. UI 는 `QuestionCard` 거의 그대로. |
| **실무 구조 암기 카드** | `Category` union 에 `"실무구조"` 추가 + `questions.ts` 에 새 카테고리 항목들. |
| **코드 빈칸 맞추기** | `Question` 에 `cloze?: string[]` 옵셔널 추가. `QuestionCard` 에서 cloze 가 있으면 빈칸 입력 컴포넌트 렌더. |
| **데이터 분리** | `data/questions.ts` → `data/questions.json` 으로 분리하고 import 만 바꿔도 끝. |

---

## 디자인 원칙

- **자극 최소**: 색은 ink(어두운 그레이) 1톤 + accent(청록) 1포인트.
- **모노 폰트**: 개발자 메모 느낌.
- **애니메이션 없음**: 색 트랜지션만 허용.
- **한 컬럼 max-w-xl**: 모바일/데스크탑 동일 — 시선이 흩어지지 않게.
- **버튼 하나 누르면 다음 문제**: 평가 → 자동 진행으로 마찰 제거.

---

## 데이터 리셋

브라우저 콘솔에서:

```js
localStorage.removeItem("csStudy:v1");
location.reload();
```
