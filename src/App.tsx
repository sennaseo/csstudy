// =============================================================
// App
// - 화면(view)을 3가지로 분기한다:
//     · path           : 스킬 패스(홈) — 감긴 길 + 스탯 + 버디 + 랜덤 연습
//     · quiz           : 문제 풀이 — 상단바(닫기/진행도/하트) + 퀴즈 카드
//     · lessonComplete : 레슨 완료(또는 실패) 화면
// - 좁은 한 컬럼 — 모바일/데스크탑 동일 레이아웃, 가독성 위해 max-w 제한.
// - safe-area padding: 홈 화면에 설치(PWA)했을 때 노치/홈바와 안 겹치게.
// =============================================================

import { Buddy } from "./components/Buddy";
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

/** 홈 화면 — 감긴 길(스킬 패스)이 메인. */
function PathScreen() {
  return (
    <>
      <header className="flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          <h1 className="text-lg font-extrabold tracking-tight text-ink-900">
            cs<span className="text-accent">Study</span>
          </h1>
          <span className="text-xs text-ink-500">개발 사고 회복</span>
        </div>
        <div className="flex items-center gap-2">
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
