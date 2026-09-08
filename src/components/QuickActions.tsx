// =============================================================
// QuickActions — 홈 최상단의 "바로 시작" 버튼 2개
//
// 왜 필요한가: 기존에는 문제 풀기까지 [스테이지 → 레슨 → 시작] 3단계.
// 지하철에서 30초 짬 날 때는 그게 다 마찰이다.
// → 앱 열자마자 한 번 탭하면 바로 문제가 나오게 한다.
//
// 1) ⚡ 오늘의 5문제 : 복습 급한 문제 우선 + 새 문제로 자동 구성
// 2) 🔁 복습        : 틀렸거나 헷갈렸던 문제만 (개수 뱃지 표시)
// =============================================================

import { DAILY_GOAL, useStudyStore } from "../store/useStudyStore";

export function QuickActions() {
  const startToday = useStudyStore((s) => s.startToday);
  const startReview = useStudyStore((s) => s.startReview);
  const reviewCount = useStudyStore((s) => s.getReviewCount());
  const todayCount = useStudyStore((s) => s.getTodayCount());

  const goalDone = todayCount >= DAILY_GOAL;

  return (
    <div className="flex flex-col gap-2">
      {/* 메인: 오늘의 5문제 — 제일 크고 제일 위. 고민 없이 이것만 누르면 된다.
          듀오링고 메인 CTA 스타일: 두꺼운 초록 3D + 굵은 글자. */}
      <button
        onClick={startToday}
        className="btn-3d flex w-full items-center justify-between rounded-2xl border-b-4 border-duo-green-dim bg-duo-green px-5 py-4 text-left text-white hover:brightness-105"
      >
        <div>
          <p className="text-base font-extrabold">
            ⚡ {goalDone ? "한 판 더!" : "오늘의 5문제 시작"}
          </p>
          <p className="text-xs font-semibold opacity-90">
            {reviewCount > 0
              ? `복습 ${Math.min(reviewCount, DAILY_GOAL)}개 포함 · 자동으로 골라줘요`
              : "자동으로 골라줘요 · 1분이면 끝"}
          </p>
        </div>
        <span className="text-2xl">›</span>
      </button>

      {/* 서브: 복습 — 듀오링고 보조 버튼(흰 배경 + Swan 테두리 + accent 글자).
          밀린 게 있을 때만 활성화. 개수 뱃지는 duo-fox(주황) 배경으로 눈에 띄게. */}
      <button
        onClick={startReview}
        disabled={reviewCount === 0}
        className={
          "btn-3d flex w-full items-center justify-between rounded-2xl border-2 border-b-4 px-5 py-3 text-left " +
          (reviewCount === 0
            ? "cursor-not-allowed border-ink-200 bg-ink-100 text-ink-400"
            : "border-ink-200 bg-white text-accent hover:brightness-[0.98]")
        }
      >
        <p className="text-sm font-extrabold">
          🔁 복습
          {reviewCount > 0 && (
            <span className="ml-2 rounded-full bg-duo-fox px-2 py-0.5 text-xs font-round font-extrabold text-white">
              {reviewCount}
            </span>
          )}
        </p>
        <span className="text-xs font-semibold">
          {reviewCount === 0 ? "밀린 거 없음 👍" : "잊기 전에 다시 보기"}
        </span>
      </button>
    </div>
  );
}
