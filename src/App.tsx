// =============================================================
// App
// - 화면(view)을 3가지로 분기한다:
//     · path           : 탭 화면 — 하단 탭바로 홈/이론/실무/도감/마이를 오간다
//     · quiz           : 문제 풀이 — 상단바(닫기/진행도/하트) + 퀴즈 카드
//     · lessonComplete : 레슨 완료(또는 실패) 화면
// - 탭 화면(TabsScreen) 안의 5개 탭 (store 의 tab):
//     · home       : 목표 게이지 · 트랙 고르기 · 원탭 시작 · 버디
//     · quiz       : 트랙 진행도 + 감긴 길(스킬 패스)
//     · practice   : 실무 — BackendQuest 프로토타입 iframe
//     · collection : 캐릭터 도감
//     · my         : 연속 학습 · 하트 · 단어장 · 클라우드 동기화
//   예전엔 이 전부가 홈 한 장에 세로로 쌓여 있어서 첫 화면이 8000px 짜리
//   두루마리였다. 탭으로 나눠 한 화면에 한 가지 일만 보이게 했다.
// - 좁은 한 컬럼 — 모바일/데스크탑 동일 레이아웃, 가독성 위해 max-w 제한.
// - safe-area padding: 홈 화면에 설치(PWA)했을 때 노치/홈바와 안 겹치게.
//   단, 탭 화면은 .safe-area 를 쓰지 않는다 (아래 <main> 주석 참고).
// =============================================================

import { useEffect, useState } from "react";

import { Buddy } from "./components/Buddy";
import { CardDeck } from "./components/CardDeck";
import { CategoryFilter } from "./components/CategoryFilter";
import { CollectionBook } from "./components/CollectionBook";
import { DailyStats } from "./components/DailyStats";
import { GoalGauge } from "./components/GoalGauge";
import { LessonComplete } from "./components/LessonComplete";
import { LessonPath } from "./components/LessonPath";
import { QuestionCard } from "./components/QuestionCard";
import { QuickActions } from "./components/QuickActions";
import { RewardOverlay } from "./components/RewardOverlay";
import { SyncSettings } from "./components/SyncSettings";
import { TabBar } from "./components/TabBar";
import { TrackPicker, TrackProgress } from "./components/TrackPicker";
import { MAX_HEARTS, useStudyStore } from "./store/useStudyStore";
import { useBack } from "./utils/useBack";

// 하트 1개가 차는 데 걸리는 시간. 스토어의 HEART_REGEN_MS 와 같은 값인데
// 그쪽이 export 가 아니라 여기서 한 번 더 적었다 — "읽기 전용" 사본이다.
// 밸런스를 바꿀 일이 생기면 스토어 쪽이 원본이고 여기를 따라 고쳐야 한다.
const HEART_REGEN_MS = 30 * 60 * 1000;

/** 하트 배지 — 홈 헤더와 퀴즈 상단바에서 공용.
 *  가득 차지 않았으면 "다음 하트까지 N분"을 글자로도 보여준다.
 *  예전엔 title 속성뿐이었는데, 폰에는 마우스 커서가 없어서 아무도 못 봤다. */
function Hearts({ withTime = false }: { withTime?: boolean }) {
  const hearts = useStudyStore((s) => s.hearts);
  const heartsUpdatedAt = useStudyStore((s) => s.heartsUpdatedAt);

  // 1분마다 다시 그려서 남은 시간이 실제로 줄어드는 게 보이게 한다.
  const [, tick] = useState(0);
  const isFull = hearts >= MAX_HEARTS;
  useEffect(() => {
    if (isFull) return;
    const id = window.setInterval(() => tick((n) => n + 1), 60 * 1000);
    return () => window.clearInterval(id);
  }, [isFull]);

  // 남은 시간 = 30분 - (마지막 회복 시점 이후 흐른 시간). 올림이라 "0분"은 안 뜬다.
  const leftMin = isFull
    ? 0
    : Math.max(
        1,
        Math.ceil((HEART_REGEN_MS - ((Date.now() - heartsUpdatedAt) % HEART_REGEN_MS)) / 60000),
      );

  return (
    <span
      className="flex shrink-0 items-center gap-1 rounded-full bg-white px-2.5 py-1.5 shadow-chip"
      title={
        "하트 — 레슨에서 틀리면 1개 소모, 30분마다 1개 회복" +
        (isFull ? "" : ` (다음 하트까지 약 ${leftMin}분)`)
      }
      aria-label={
        `하트 ${hearts}개` + (isFull ? " (가득)" : ` — 다음 하트까지 약 ${leftMin}분`)
      }
    >
      <span className={"text-sm leading-none" + (hearts === 0 ? " grayscale" : "")}>
        ❤️
      </span>
      {/* 숫자는 font-round(Baloo 2) — 듀오링고의 둥근 숫자 느낌 */}
      <span
        className={
          "font-round text-sm font-extrabold tabular-nums " +
          (hearts === 0 ? "text-ink-400" : "text-duo-red")
        }
      >
        {hearts}
      </span>
      {/* "N분"은 좁은 홈 헤더에서 배지를 넓혀 제목 위로 아이콘을 밀어 올렸다.
          숫자만 남기고, 남은 시간은 title/aria 로만 알린다 (퀴즈 상단바처럼
          자리가 넉넉한 곳은 withTime 으로 글자도 같이 보여준다). */}
      {!isFull && withTime && (
        <span className="font-round text-xs font-bold tabular-nums text-ink-400">
          {leftMin}분
        </span>
      )}
    </span>
  );
}

/** 하트 0 안내 — 예전엔 길(LessonPath) 맨 위에 있어서 top 758px, 즉
 *  360x640 첫 화면 밖이었다. 정작 "왜 레슨이 안 열리지?" 를 설명하는 유일한
 *  문구라서 헤더 바로 밑, 스크롤 없이 보이는 자리로 올렸다. */
function HeartWarning() {
  const hearts = useStudyStore((s) => s.hearts);
  if (hearts > 0) return null;
  return (
    <div
      role="status"
      className="rounded-2xl border-2 border-b-4 border-duo-red-dim bg-duo-red-soft px-4 py-3 text-center text-xs font-extrabold text-duo-red-ink"
    >
      💔 하트를 다 썼어요 — 길의 레슨은 잠깐 쉬어요.
      <br />
      🔁 복습이나 ⚡ 오늘의 5문제는 하트 없이 계속할 수 있어요! (30분마다 1개 회복)
    </div>
  );
}

/** 마이 탭 — 예전엔 헤더 우측에 아이콘으로 다닥다닥 붙어 있던 것들
 *  (연속 학습 칩 · 하트 · 단어장 · 클라우드 동기화)을 한 카드에 줄 세운 곳.
 *  360px 폰에서는 아이콘 4개만으로 헤더 폭이 터졌는데, 하루에 한 번 쓸까 말까 한
 *  기능들이라 "서랍"을 따로 만들어 옮겼다.
 *
 *  App.tsx 안의 로컬 함수인 이유: 하트 행이 이 파일의 <Hearts withTime /> 을
 *  재사용해야 하는데, 별도 파일로 빼면 App ↔ MyScreen 순환 import 가 된다. */
function MyScreen({ onOpenDeck }: { onOpenDeck: () => void }) {
  return (
    <div className="divide-y-2 divide-ink-200 rounded-2xl border-2 border-ink-200 bg-white">
      <div className="flex items-center justify-between px-4 py-3">
        <span className="text-sm font-extrabold text-ink-900">🔥 연속 학습</span>
        <DailyStats />
      </div>

      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <span className="min-w-0">
          <span className="block text-sm font-extrabold text-ink-900">❤️ 하트</span>
          <span className="block text-xs text-ink-500">
            틀리면 1개 소모 · 30분마다 1개 회복
          </span>
        </span>
        <Hearts withTime />
      </div>

      {/* 행 전체가 버튼 — 폰에서 ›(작은 글자) 만 누르게 하면 과녁이 너무 좁다 */}
      <button
        onClick={onOpenDeck}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors active:bg-ink-100"
      >
        <span className="min-w-0">
          <span className="block text-sm font-extrabold text-ink-900">📇 단어장</span>
          <span className="block text-xs text-ink-500">CS 지식을 한두 줄로 훑어보기</span>
        </span>
        <span className="shrink-0 text-lg font-extrabold text-ink-400">›</span>
      </button>

      <div className="flex items-center justify-between px-4 py-3">
        <span className="text-sm font-extrabold text-ink-900">☁️ 클라우드 동기화</span>
        <SyncSettings />
      </div>
    </div>
  );
}

/** 탭 화면 — 헤더 + 지금 고른 탭의 본문 + 하단 탭바.
 *  단어장은 풀이가 아니라 "훑어보기"라 탭을 따로 주지 않고 모달로 띄운다 —
 *  하트·큐 같은 진행 상태를 건드릴 이유가 없고, 어느 탭에서든 열려야 하니까. */
function TabsScreen() {
  const tab = useStudyStore((s) => s.tab);

  // PWA 홈화면 아이콘을 길게 누르면 나오는 바로가기(manifest 의 shortcuts)가
  // ./?open=deck / ./?open=today 로 들어온다. 앱이 뜨자마자 그 화면으로 점프시킨다.
  // 한 번 읽고 주소는 지운다 — 안 지우면 새로고침할 때마다 같은 화면이 다시 열린다.
  const [isDeckOpen, setIsDeckOpen] = useState(
    () => new URLSearchParams(window.location.search).get("open") === "deck",
  );
  const startToday = useStudyStore((s) => s.startToday);

  useEffect(() => {
    const open = new URLSearchParams(window.location.search).get("open");
    if (!open) return;
    // state 는 보존한다 — ?open=deck 로 들어오면 CardDeck 이 먼저 pushState 한 항목 위에 서 있어서,
    // null 로 덮으면 useBack 장부가 이 항목을 "우리 것 아님"으로 본다.
    window.history.replaceState(window.history.state, "", window.location.pathname);
    if (open === "today") startToday();
  }, [startToday]);

  return (
    <>
      {/* 헤더 — 우측에 아이콘 4개가 있던 시절엔 360px 폰에서 폭이 터졌다.
          지금은 나머지를 전부 마이 탭으로 내려보내고 하트만 남겼다.
          그래도 (1) 부제는 좁은 화면에서 숨기고(sm:inline), (2) 로고 묶음은 shrink 를 허용하고,
          (3) 우측 묶음은 shrink-0 으로 안 찌그러뜨리는 원칙은 그대로 둔다. */}
      <header className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          {/* 로고 고양이 — 글자는 이미지로 안 넣는다.
              원본 로고의 'Study'가 흰색이라 앱의 밝은 배경(#FBFAF7)에서 안 보인다.
              글자는 기존처럼 텍스트로 두는 게 대비도 확실하고 어느 크기에서도 안 흐려진다. */}
          <img
            src={`${import.meta.env.BASE_URL}logo-cat.png`}
            alt=""
            className="h-7 w-auto shrink-0"
          />
          <div className="flex min-w-0 items-baseline gap-2">
            {/* whitespace-nowrap: 제목이 "csStud / y" 로 쪼개지지 않게.
                제목은 앱 이름이라 줄이지 않고, 대신 아래 우측 묶음이 줄어든다. */}
            <h1 className="whitespace-nowrap text-lg font-extrabold tracking-tight text-ink-900">
              cs<span className="text-accent">Study</span>
            </h1>
            {/* 부제는 있으면 좋고 없어도 되는 정보 — 좁은 화면에선 자리를 양보한다 */}
            <span className="hidden truncate text-xs text-ink-500 sm:inline">개발 사고 회복</span>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Hearts />
        </div>
      </header>

      {/* 하트 0 경고 — 첫 화면 안(스크롤 없이 보이는 자리) */}
      <HeartWarning />

      {tab === "home" && (
        <>
          <GoalGauge />
          {/* 역할별 로드맵(트랙) 선택 + 완주 목표 */}
          <TrackPicker />
          {/* 원탭 시작 — 오늘의 5문제 / 복습 */}
          <QuickActions />
          {/* 버디(캐릭터) — 예전엔 길(8000px) 맨 아래라 사실상 아무도 못 봤다.
              캐릭터가 이 앱의 정서적 핵심이니 스크롤 없이 보이는 자리로 올렸다. */}
          <Buddy />
        </>
      )}

      {tab === "quiz" && (
        <>
          {/* 지금 트랙을 어디까지 걸었는지 — 길 위에 붙는 머리말 */}
          <TrackProgress />
          {/* 감긴 길 (랜덤 연습 버튼도 길 끝에 포함) */}
          <LessonPath />
        </>
      )}

      {/* 실무 탭 — BackendQuest 프로토타입(public/practice/index.html)을 iframe 으로 연다.
          항상 마운트 + hidden: 프로토타입은 저장 기능이 없어서 언마운트하면 진도가 날아간다.
          iframe 이라 이론 쪽 하트·히스토리 장부와 완전히 분리된다 (프로토타입은 location/history 를 안 쓴다). */}
      <div hidden={tab !== "practice"} className="flex flex-col gap-2">
        <p className="text-xs text-ink-500">
          🛠️ 실무 — 백엔드를 조립하는 실험판 (챕터 3 · 7문제). 진도는 저장되지 않아요.
        </p>
        <iframe
          title="실무 — BackendQuest 프로토타입"
          src={`${import.meta.env.BASE_URL}practice/index.html`}
          className="h-[calc(100dvh-13rem)] w-full rounded-2xl border-2 border-ink-200 bg-white"
        />
      </div>

      {tab === "collection" && <CollectionBook />}

      {tab === "my" && <MyScreen onOpenDeck={() => setIsDeckOpen(true)} />}

      {/* 단어장 — 마이 탭에서 여는 모달. 탭과 무관하게 마운트해 둬서
          ?open=deck 로 들어왔을 때도 어느 탭에서든 열린다. */}
      {isDeckOpen && <CardDeck onClose={() => setIsDeckOpen(false)} />}

      {/* 하단 탭바 — fixed 라 본문 흐름에서 빠진다.
          가려지는 만큼은 <main> 의 pb 로 비워준다. */}
      <TabBar />
    </>
  );
}

/** 문제 풀이 화면 — 상단바 + 퀴즈 카드.
 *
 *  레이아웃(듀오링고식 3층 구조):
 *    [상단바: ✕ + 진행바 + 하트]  ← 고정
 *    [본문: 문제와 보기]           ← 남는 공간 전부, 넘치면 스크롤
 *    [하단 footer: 확인/피드백]    ← 화면 바닥에 고정
 *  아래 두 층(본문/footer)은 QuestionCard 안에서 만든다.
 *  여기서는 "상단바는 안 줄어들게(shrink-0), 카드는 남는 높이를 다 먹게(flex-1)"만
 *  정해주면 된다. min-h-0 은 flexbox 에서 스크롤이 생기게 하는 필수 주문. */
function QuizScreen() {
  const mode = useStudyStore((s) => s.mode);
  const goHome = useStudyStore((s) => s.goHome);
  const lessonIndex = useStudyStore((s) => s.lessonIndex);
  const lessonQueue = useStudyStore((s) => s.lessonQueue);

  const total = lessonQueue.length || 1;
  // 큐 기반 모드(레슨/복습/오늘의 5문제)는 전부 진행도 바를 보여준다.
  const isQueueMode = mode !== "random";
  const pct = isQueueMode ? Math.round((lessonIndex / total) * 100) : 0;

  return (
    <>
      {/* 상단바: 닫기(✕) + 진행도 바(레슨) + 하트(레슨 모드만) */}
      <div className="flex shrink-0 items-center gap-3">
        <button
          onClick={goHome}
          className="text-xl font-extrabold text-ink-400 transition-colors hover:text-ink-900"
          title="그만두고 홈으로"
          aria-label="홈으로"
        >
          ✕
        </button>
        {isQueueMode ? (
          <>
            {mode === "review" && (
              <span className="shrink-0 text-sm font-bold text-duo-fox-ink">🔁</span>
            )}
            {mode === "today" && (
              <span className="shrink-0 text-sm font-bold text-duo-green">⚡</span>
            )}
            {/* 듀오링고식 진행바 — 두꺼운 16px 트랙 + 젤리 하이라이트 (index.css).
                스크린리더는 색칠된 div 를 못 읽으므로 role/aria 로 "몇 %인지"를 말해준다. */}
            <div
              className="progress-track flex-1"
              role="progressbar"
              aria-label="레슨 진행도"
              aria-valuenow={pct}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div className="progress-fill" style={{ width: `${pct}%` }} />
            </div>
            {/* 하트는 레슨 모드에서만 소모되므로 레슨에서만 보여준다 */}
            {mode === "lesson" && <Hearts withTime />}
          </>
        ) : (
          <span className="flex-1 text-sm font-bold text-ink-500">🎲 랜덤 연습</span>
        )}
      </div>

      {/* 랜덤 모드에서만 카테고리 필터 노출 */}
      {mode === "random" && <CategoryFilter />}

      <QuestionCard />
    </>
  );
}

export default function App() {
  const view = useStudyStore((s) => s.view);
  const goHome = useStudyStore((s) => s.goHome);
  // 안드로이드 뒤로가기: 퀴즈/완료 화면에선 홈으로. 홈에서 한 번 더 누르면 앱 종료(안드로이드 기본).
  useBack(goHome, view !== "path");

  // 퀴즈 화면만 "화면에 딱 맞는 높이"로 만든다 (h-full + overflow-hidden).
  // 그래야 안쪽 QuestionCard 가 본문만 스크롤시키고 확인 버튼을 바닥에 붙여둘 수 있다.
  // 나머지 화면(홈/완료)은 예전처럼 페이지 전체가 자연스럽게 늘어나며 스크롤된다.
  const isQuiz = view === "quiz";

  return (
    <div className={isQuiz ? "h-full overflow-hidden" : "min-h-full"}>
      <main
        className={
          "mx-auto flex w-full max-w-xl flex-col gap-5 px-4 " +
          (isQuiz
            ? // 하단 padding 은 footer 가 직접 safe-area 를 챙기므로 여기선 위쪽만.
              "h-full pt-[max(1rem,env(safe-area-inset-top))]"
            : view === "path"
              ? // 탭 화면은 .safe-area 를 못 쓴다 — index.css 에서 @tailwind utilities
                // *뒤에* 정의돼 있어서 py-* 를 덮어쓴다(=pb-20 같은 유틸이 안 먹는다).
                // 그래서 안전영역을 arbitrary value 로 직접 적는다.
                // 아래 4.5rem 은 fixed 탭바에 가려지는 높이만큼 비워두는 자리.
                "pt-[max(1.5rem,env(safe-area-inset-top))] pb-[calc(4.5rem+env(safe-area-inset-bottom))]"
              : "safe-area py-6 sm:py-10")
        }
      >
        {view === "path" && <TabsScreen />}
        {view === "quiz" && <QuizScreen />}
        {view === "lessonComplete" && <LessonComplete />}
      </main>

      {/* 획득/진화 축하 모달 — pendingReward 있을 때만 뜬다 (어느 화면에서나) */}
      <RewardOverlay />
    </div>
  );
}
