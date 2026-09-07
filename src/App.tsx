// =============================================================
// App
// - 화면(view)을 3가지로 분기한다:
//     · path           : 스킬 패스(홈) — 감긴 길 + 스탯 + 버디 + 랜덤 연습
//     · quiz           : 문제 풀이 — 상단바(닫기/진행도/하트) + 퀴즈 카드
//     · lessonComplete : 레슨 완료(또는 실패) 화면
// - 좁은 한 컬럼 — 모바일/데스크탑 동일 레이아웃, 가독성 위해 max-w 제한.
// - safe-area padding: 홈 화면에 설치(PWA)했을 때 노치/홈바와 안 겹치게.
// =============================================================

import { useEffect, useState } from "react";

import { Buddy } from "./components/Buddy";
import { CardDeck } from "./components/CardDeck";
import { CategoryFilter } from "./components/CategoryFilter";
import { DailyStats } from "./components/DailyStats";
import { GoalGauge } from "./components/GoalGauge";
import { LessonComplete } from "./components/LessonComplete";
import { LessonPath } from "./components/LessonPath";
import { QuestionCard } from "./components/QuestionCard";
import { QuickActions } from "./components/QuickActions";
import { RewardOverlay } from "./components/RewardOverlay";
import { SyncSettings } from "./components/SyncSettings";
import { TrackPicker } from "./components/TrackPicker";
import { useStudyStore } from "./store/useStudyStore";
import { useBack } from "./utils/useBack";

/** 하트 배지 — 홈 헤더와 퀴즈 상단바에서 공용. */
function Hearts() {
  const hearts = useStudyStore((s) => s.hearts);
  return (
    <span
      className="flex items-center gap-1 rounded-full bg-white px-2.5 py-1.5 shadow-chip"
      title="하트 — 레슨에서 틀리면 1개 소모, 30분마다 1개 회복"
    >
      <span className={"text-sm leading-none" + (hearts === 0 ? " grayscale" : "")}>
        ❤️
      </span>
      {/* 숫자는 font-round(Baloo 2) — 듀오링고의 둥근 숫자 느낌 */}
      <span
        className={
          "font-round text-sm font-extrabold tabular-nums " +
          (hearts === 0 ? "text-ink-300" : "text-duo-red")
        }
      >
        {hearts}
      </span>
    </span>
  );
}

/** 홈 화면 — 감긴 길(스킬 패스)이 메인.
 *  단어장은 풀이가 아니라 "훑어보기"라 화면(view)을 새로 만들지 않고
 *  도감과 같은 모달로 띄운다 — 하트·큐 같은 진행 상태를 건드릴 이유가 없다. */
function PathScreen() {
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
    window.history.replaceState(null, "", window.location.pathname);
    if (open === "today") startToday();
  }, [startToday]);

  return (
    <>
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* 로고 고양이 — 글자는 이미지로 안 넣는다.
              원본 로고의 'Study'가 흰색이라 앱의 밝은 배경(#FBFAF7)에서 안 보인다.
              글자는 기존처럼 텍스트로 두는 게 대비도 확실하고 어느 크기에서도 안 흐려진다. */}
          <img
            src={`${import.meta.env.BASE_URL}logo-cat.png`}
            alt=""
            className="h-7 w-auto"
          />
          <div className="flex items-baseline gap-2">
            <h1 className="text-lg font-extrabold tracking-tight text-ink-900">
              cs<span className="text-accent">Study</span>
            </h1>
            <span className="text-xs text-ink-500">개발 사고 회복</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsDeckOpen(true)}
            className="rounded-full bg-white px-2.5 py-1.5 text-sm shadow-chip transition-transform active:scale-95"
            title="단어장 — CS 지식을 한두 줄로 훑어보기"
            aria-label="단어장 열기"
          >
            📇
          </button>
          <SyncSettings />
          <Hearts />
          <DailyStats />
        </div>
      </header>

      <GoalGauge />

      {/* 역할별 로드맵(트랙) 선택 + 완주 목표 */}
      <TrackPicker />

      {/* 원탭 시작 — 오늘의 5문제 / 복습 */}
      <QuickActions />

      {/* 감긴 길 (랜덤 연습 버튼도 길 끝에 포함) */}
      <LessonPath />

      {/* 버디(캐릭터) */}
      <Buddy />

      {/* 단어장 — 상단 📇 버튼으로 여는 모달 */}
      {isDeckOpen && <CardDeck onClose={() => setIsDeckOpen(false)} />}
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
          className="text-xl font-extrabold text-ink-300 transition-colors hover:text-ink-500"
          title="그만두고 홈으로"
          aria-label="홈으로"
        >
          ✕
        </button>
        {isQueueMode ? (
          <>
            {mode === "review" && (
              <span className="shrink-0 text-sm font-bold text-duo-fox">🔁</span>
            )}
            {mode === "today" && (
              <span className="shrink-0 text-sm font-bold text-duo-green">⚡</span>
            )}
            {/* 듀오링고식 진행바 — 두꺼운 16px 트랙 + 젤리 하이라이트 (index.css) */}
            <div className="progress-track flex-1">
              <div className="progress-fill" style={{ width: `${pct}%` }} />
            </div>
            {/* 하트는 레슨 모드에서만 소모되므로 레슨에서만 보여준다 */}
            {mode === "lesson" && <Hearts />}
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
            : "safe-area py-6 sm:py-10")
        }
      >
        {view === "path" && <PathScreen />}
        {view === "quiz" && <QuizScreen />}
        {view === "lessonComplete" && <LessonComplete />}
      </main>

      {/* 획득/진화 축하 모달 — pendingReward 있을 때만 뜬다 (어느 화면에서나) */}
      <RewardOverlay />
    </div>
  );
}
