// =============================================================
// QuestCard — 홈 1순위 카드 "오늘의 퀘스트" (예전 "오늘 할 일" 카드 자리)
//
// 홈에서 밈이 "세게" 들어가는 곳은 이 카드 한 군데뿐이다.
// 나머지 카드는 깔끔하게 두고, 여기서만 캐릭터 + 효과선 한 단어 + 말풍선 한 문장을 쓴다.
// 배치는 만화 밈 한 컷처럼(위에서 아래로):
//   ① 위 블록 왼쪽 — 라벨 "⭐ 오늘의 퀘스트" · 제목(mood 별 "5문제만 풀자." …) · 진행 n / 5 + 바
//      (색만이 아니라 숫자로도 진행을 보여준다)
//   ② 위 블록 오른쪽 — 캐릭터 존 96×96: 노란 집중선 배경 + 로고 고양이 80px
//      + 존 왼쪽 위에 겹친 빨간 효과선 글자(MemeBurst, "오늘도?" 같은 한 단어)
//   ③ 말풍선 — 꼬리가 위의 고양이를 가리킨다. 같은 날·같은 상태면 같은 문구(날짜 시드).
//   ④ 보상 칩 — 스토어가 "실제로" 주는 것만 적는다(거짓 보상 금지). 한 줄.
//   ⑤ Primary CTA — 오늘의 5문제 (진행 중엔 "이어서", 달성 후엔 "한 판 더").
//      전폭 56px · 카드 안 유일한 초록 덩어리라 밈보다 눈에 더 세게 들어온다.
// 스트릭이 끊겼다/놓쳤다 같은 죄책감 문구는 쓰지 않는다.
// 손글씨(font-display)는 말풍선·효과선에만 — 숫자·보상·버튼은 읽기 쉬운 기본 글꼴.
// 스토어는 읽기만 한다(파생값은 여기서 계산).
// =============================================================

import { CHARACTERS } from "../data/characters";
import { questBurst, questLine, questMood } from "../data/memes";
import { dateKeyOf } from "../data/missions";
import { DAILY_GOAL, useStudyStore } from "../store/useStudyStore";
import { MemeBurst, MemeFigure } from "./MemeFigure";

export function QuestCard() {
  const count = useStudyStore((s) => s.getTodayCount());
  const reviewCount = useStudyStore((s) => s.getReviewCount());
  const startToday = useStudyStore((s) => s.startToday);
  const lastGoalRewardDay = useStudyStore((s) => s.lastGoalRewardDay);
  const buddies = useStudyStore((s) => s.buddies);

  const now = new Date();
  const todayKey = dateKeyOf(now);
  // 0~100 사이로 자르기 — 목표를 넘겨 풀어도 바는 100% 에서 멈춘다.
  const percent = Math.min((count / DAILY_GOAL) * 100, 100);
  const isDone = count >= DAILY_GOAL;
  const left = DAILY_GOAL - count;
  const mood = questMood(count, now, DAILY_GOAL);
  const line = questLine(mood, { left, done: count }, todayKey);

  // 제목 4갈래 — 지금 상태에서 "다음에 뭘 하면 되는지"를 한 문장으로.
  const title = {
    idle: `${DAILY_GOAL}문제만 풀자.`,
    progress: `${left}문제만 더.`,
    done: "오늘 몫 끝.",
    // 이미 몇 개 풀었으면 남은 개수로 — 아래 CTA "이어서 풀기 (3개)" 와 숫자가 맞는다.
    night: count > 0 ? `${left}개만 하고 자자.` : `딱 ${DAILY_GOAL}개만 하고 자자.`,
  }[mood];

  // 보상 줄 3갈래 — 스토어 규칙 그대로:
  //  하루 5문제 달성 시 확정 뽑기 1회(lastGoalRewardDay 로 하루 1번),
  //  12종 전부 모았으면 뽑기 대신 대표 버디 +20 XP. 문제당 최대 12 XP × 5 = 60.
  const allOwned = Object.keys(buddies).length >= CHARACTERS.length;
  const reward =
    lastGoalRewardDay === todayKey
      ? "🎁 오늘 보상 받음 ✓"
      : `🎁 보상 · ${allOwned ? "버디 XP +20" : "새 버디 1마리"} + 최대 ${DAILY_GOAL * 12} XP`;

  // 오늘의 5문제는 복습 급한 문제를 먼저 채운다 — 몇 개가 섞이는지는 버튼 설명으로만 남긴다
  // (화면엔 아래 복습 행이 따로 있다).
  const hint =
    reviewCount > 0
      ? `복습 ${Math.min(reviewCount, DAILY_GOAL)}개 포함 · 3분이면 끝`
      : "3분이면 끝";

  const cta = isDone
    ? "🔥 한 판 더"
    : count > 0
      ? `🚀 이어서 풀기 (${left}개)`
      : `🚀 오늘의 ${DAILY_GOAL}문제 시작`;

  return (
    <section
      aria-label="오늘의 퀘스트"
      className="rounded-2xl border border-duo-green/20 bg-duo-green-tint p-4"
    >
      {/* ①② 위 블록 — 왼쪽 글자 열 + 오른쪽 캐릭터 존을 가로로 나란히 */}
      <div className="flex gap-3">
        {/* 왼쪽 — 라벨·제목·진행. min-w-0 이 있어야 긴 제목이 칸을 밀어내지 않고 줄바꿈된다. */}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-duo-green-ink">⭐ 오늘의 퀘스트</p>
          <h2 className="mt-1 break-keep text-2xl font-extrabold leading-tight text-ink-900">
            {title}
          </h2>
          <div className="mt-2 flex items-center gap-2">
            <span
              className={
                "shrink-0 font-round text-base font-extrabold tabular-nums " +
                (isDone ? "text-duo-green-ink" : "text-ink-900")
              }
            >
              {Math.min(count, DAILY_GOAL)} / {DAILY_GOAL}
            </span>
            {/* 게이지 — .progress-track/.progress-fill 이 모양을 그린다. width 만 % 로 넘긴다.
                색칠된 div 는 스크린리더가 못 읽으니 role/aria 로 진행도를 말해준다. */}
            <div
              className="progress-track flex-1"
              role="progressbar"
              aria-label={`오늘의 목표 ${count}/${DAILY_GOAL}문제`}
              aria-valuenow={Math.round(percent)}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div className="progress-fill" style={{ width: `${percent}%` }} />
            </div>
          </div>
        </div>

        {/* 오른쪽 — 캐릭터 존 96×96. 뒤에 집중선(.meme-stage::before)이 깔리고,
            그 위에 고양이 80px(아래 가운데), 효과선 글자는 존 왼쪽 위로 삐져나오게 겹친다. */}
        <div className="meme-stage relative h-24 w-24 shrink-0">
          <MemeFigure
            slot="quest"
            size={80}
            className="absolute bottom-0 left-1/2 -translate-x-1/2"
          />
          <MemeBurst className="absolute -left-4 -top-1">{questBurst(mood)}</MemeBurst>
        </div>
      </div>

      {/* ③ 말풍선 — 꼬리가 위·오른쪽(캐릭터 턱 밑)을 가리킨다(.meme-bubble).
          장식이 아니라 내용이라 aria-hidden 을 붙이지 않는다. */}
      <p className="meme-bubble mt-4 break-keep font-display text-base text-ink-900">{line}</p>

      {/* ④ 보상 칩 — 스토어가 실제로 주는 것만. 한 줄에 들어가야 한다. */}
      <p className="mt-3 inline-flex max-w-full items-center break-keep rounded-lg border border-duo-green/20 bg-white/70 px-2 py-1 text-xs font-semibold text-ink-700">
        {reward}
      </p>

      {/* 메인 CTA — 고민 없이 이것만 누르면 된다. 복습 포함 여부는 title·sr-only 로만. */}
      <button
        type="button"
        onClick={startToday}
        title={hint}
        aria-describedby="quest-hint"
        className="btn-3d mt-3 min-h-14 w-full rounded-xl border-b-4 border-duo-green-dim bg-duo-green px-4 text-base font-extrabold text-white hover:brightness-105"
      >
        {cta}
      </button>
      <span id="quest-hint" className="sr-only">
        {hint}
      </span>
    </section>
  );
}
