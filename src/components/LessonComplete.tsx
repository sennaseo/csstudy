// =============================================================
// LessonComplete — 세션을 끝냈을 때 뜨는 "결과 분석" 화면
//
// 건강검진 결과지를 떠올리면 된다. 위에서 아래로 이렇게 흐른다:
//   1) 제목        — 무슨 검사였는지 ("복습 결과", "🌐 네트워크 레슨 2 결과")
//   2) 푼 문제 줄  — 겹친 카테고리 아이콘 + "푼 문제 5개 ›"
//                    (누르면 펼쳐지는 목록 = 네이티브 <details>. state 도 모달도 안 쓴다)
//   3) 큰 도넛     — 종합 점수. 안에 내 버디가 앉아 있고 점수가 크게 박힌다
//   4) 등급 배지   — "최고예요!" 같은 알약
//   5) 개수 + 부제 + 메타 — 맞음·틀림 개수, 격려 문구, XP·콤보 한 줄
//   6) 카테고리 카드 — 과목별 미니 도넛 (어디가 약한지 한눈에)
//   7) CTA 2개     — [홈] [복습하기]
//
// 도넛(Ring)은 차트 라이브러리 없이 SVG <circle> 2개로 그린다.
// 원리: 원 둘레만큼 점선 간격(strokeDasharray)을 주면 "한 칸짜리 점선"이 되고,
// 그걸 offset 으로 밀어내면 밀어낸 만큼 안 보인다. 즉 offset = 못 채운 부분.
// (-90도 회전은 12시 방향에서 시작하게 만들려고. 안 하면 3시에서 시작한다)
// =============================================================

import { useEffect, useState } from "react";
import { findCharacter, stageOf } from "../data/characters";
import { NODE_BY_ID } from "../data/lessonPath";
import { CATEGORY_EMOJI, QUESTIONS } from "../data/questions";
import { DAILY_GOAL, useStudyStore } from "../store/useStudyStore";
import { byCategory, scoreOf, tierOf } from "../utils/score";
import { Confetti } from "./Confetti";

/** qid → 문제 조회표 (모듈 로드 시 한 번만). 펼친 목록에서 문제 지문을 찾는 용도. */
const Q_BY_ID = new Map(QUESTIONS.map((q) => [q.id, q]));

/** SVG 도넛 하나.
 *  @param pct    채울 비율 0~100
 *  @param size   바깥 지름(px)
 *  @param stroke 선 두께(px)
 *  @param tone   진행 원의 색 클래스 (tier.text)
 *  @param label  스크린리더용 설명
 *  @param children 도넛 한가운데에 얹을 것 (점수, 캐릭터 등) */
function Ring({
  pct,
  size,
  stroke,
  tone,
  label,
  children,
}: {
  pct: number;
  size: number;
  stroke: number;
  tone: string;
  label: string;
  children?: React.ReactNode;
}) {
  // 선이 반지름 바깥으로 삐져나가지 않게, 선 두께의 절반씩 안쪽으로 당긴다.
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - pct / 100);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        role="img"
        aria-label={label}
        className="absolute inset-0"
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* 트랙 — 아직 못 채운 회색 밑바탕 */}
        <circle
          className="text-ink-200"
          stroke="currentColor"
          fill="none"
          strokeWidth={stroke}
          cx={size / 2}
          cy={size / 2}
          r={r}
        />
        {/* 진행 — 점수만큼만 보이는 색 원. --circ 는 CSS 애니메이션의 출발점(0%)이다. */}
        <circle
          className={"ring-fill " + tone}
          stroke="currentColor"
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ "--circ": c } as React.CSSProperties}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
}

export function LessonComplete() {
  const result = useStudyStore((s) => s.lessonResult);
  const goHome = useStudyStore((s) => s.goHome);
  const startReview = useStudyStore((s) => s.startReview);
  const reviewCount = useStudyStore((s) => s.getReviewCount());
  const combo = useStudyStore((s) => s.combo);
  const bestCombo = useStudyStore((s) => s.bestCombo);
  const activeBuddyId = useStudyStore((s) => s.activeBuddyId);
  const buddies = useStudyStore((s) => s.buddies);

  // 마운트 시 컨페티 한 번 터뜨린다.
  const [burstId, setBurstId] = useState(0);
  useEffect(() => setBurstId(1), []);

  if (!result) {
    // 안전망 — 결과가 없으면 그냥 홈으로 갈 수 있게.
    return (
      <div className="flex flex-col items-center gap-4 py-16">
        <button
          onClick={goHome}
          className="btn-3d rounded-2xl border-2 border-b-4 border-duo-green-dim bg-duo-green px-6 py-3 text-sm font-extrabold text-white"
        >
          돌아가기
        </button>
      </div>
    );
  }

  const allCorrect = result.correct === result.total;
  // 세션 종류에 따라 문구를 바꾼다 (__review/__today 는 스킬트리 레슨이 아님).
  const isReview = result.lessonId === "__review";
  const isToday = result.lessonId === "__today";
  const failed = !!result.failed;

  const node = NODE_BY_ID[result.lessonId];
  const title = failed
    ? "하트가 다 떨어졌어요"
    : isReview
    ? "복습 결과"
    : isToday
    ? "오늘의 5문제 결과"
    : node
    ? `${CATEGORY_EMOJI[node.category]} ${node.category} ${node.label} 결과`
    : "레슨 결과";

  const subtitle = failed
    ? "🔁 복습을 끝내면 하트 1개 회복! (30분마다 자동 회복돼요)"
    : allCorrect
    ? isReview
      ? "헷갈리던 문제를 전부 맞혔어요. 머리에 붙었네요!"
      : isToday
      ? "전부 정답! 오늘 몫은 충분히 했어요."
      : "전부 맞혔어요. 다음 레슨이 열렸어요."
    : isReview || isToday
    ? "수고했어요. 틀린 건 다음 복습에서 또 만나요."
    : "수고했어요. 틀린 건 복습 노드에서 다시 만나요.";

  // 이번 세션 최고 콤보 — 콤보가 살아있으면 그 값, 끊겼으면 안 보여준다.
  const showCombo = !failed && combo >= 2;

  const pct = scoreOf(result.correct, result.total);
  const tier = tierOf(pct);
  const cats = byCategory(result.answers);

  // 맞음·틀림·안 푼 개수. 틀림은 answers 로 센다 — total - correct 로 하면
  // 실패 레슨(하트 소진)에서 아직 안 푼 문제까지 "틀림"으로 잡히기 때문.
  const wrong = result.answers.filter((a) => !a.correct).length;
  const unanswered = result.total - result.answers.length;

  // 겹친 아이콘은 최대 3개까지만 — 그 이상은 줄만 길어지고 정보가 안 는다.
  const catEmojis = cats.slice(0, 3).map((c) => CATEGORY_EMOJI[c.category]);

  // 도넛 한가운데 앉힐 버디. 없으면 이모지 하나로 대신한다.
  const buddy = activeBuddyId ? findCharacter(activeBuddyId) : undefined;
  const buddyRecord = activeBuddyId ? buddies[activeBuddyId] : undefined;
  const buddyArt =
    buddy && buddyRecord
      ? buddy.stages[stageOf(buddyRecord.xp) - 1]?.art
      : undefined;

  return (
    <div className="relative flex flex-col gap-5 py-6">
      {/* 실패했을 땐 컨페티 없음 — 차분하게 위로하는 화면이라 축포는 안 어울린다 */}
      {!failed && <Confetti burstId={burstId} />}

      {/* 1. 제목 — 결과지 맨 위 제목처럼 왼쪽 정렬 */}
      <h2 className="font-display text-2xl leading-tight text-ink-900">{title}</h2>

      {/* 2. 푼 문제 줄 — <details> 라서 JS 없이 접었다 폈다 된다 */}
      <details>
        <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-semibold text-ink-500 [&::-webkit-details-marker]:hidden">
          {/* -space-x-2 = 옆 칸을 2씩 파고들게 → 동전 겹쳐 놓은 모양 */}
          <span className="flex -space-x-2">
            {catEmojis.map((emoji, i) => (
              <span
                key={i}
                className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-ink-200 bg-white text-xs"
              >
                {emoji}
              </span>
            ))}
          </span>
          푼 문제 {result.answers.length}개 ›
        </summary>
        <ul className="mt-2 flex flex-col gap-1">
          {result.answers.map((a, i) => (
            <li key={i} className="flex gap-2 text-sm text-ink-700">
              <span>{a.correct ? "✅" : "❌"}</span>
              <span className="line-clamp-1">
                {Q_BY_ID.get(a.qid)?.question ?? a.qid}
              </span>
            </li>
          ))}
        </ul>
      </details>

      {/* 3. 큰 도넛 — 이 화면의 주인공 */}
      <div className={"self-center " + (failed ? "" : "animate-bounce-in")}>
        <Ring
          pct={pct}
          size={200}
          stroke={14}
          tone={tier.text}
          label={`정답률 ${pct}퍼센트`}
        >
          {buddyArt ? (
            <pre className="font-mono text-sm leading-tight text-ink-900">
              {buddyArt.join("\n")}
            </pre>
          ) : (
            <span className="text-3xl">{failed ? "💔" : "🎉"}</span>
          )}
          <p
            className={
              "font-round text-4xl font-extrabold leading-none tabular-nums " +
              tier.text
            }
          >
            {pct}
            <span className="text-lg">점</span>
          </p>
        </Ring>
      </div>

      {/* 4. 등급 배지 */}
      <span
        className={
          "self-center rounded-full border-2 border-ink-200 px-4 py-1.5 text-sm font-extrabold " +
          tier.badge
        }
      >
        {tier.label}
      </span>

      {/* 5. 부제 + 메타 한 줄 */}
      <div className="flex flex-col items-center gap-1 text-center text-sm text-ink-500">
        {/* 맞음·틀림 개수 — 도넛은 %만 보여주니 여기서 실제 개수를 박아준다 */}
        <p className="flex flex-wrap justify-center gap-x-3 font-extrabold tabular-nums">
          <span className="text-duo-green-ink">✅ 맞음 {result.correct}개</span>
          <span className={wrong > 0 ? "text-duo-red-ink" : "text-ink-300"}>
            ❌ 틀림 {wrong}개
          </span>
          {unanswered > 0 && <span>안 푼 {unanswered}개</span>}
        </p>
        <p>{subtitle}</p>
        <p className="flex flex-wrap justify-center gap-x-3 text-xs font-extrabold">
          <span className="text-duo-bee-dim">+{result.xpGained} XP</span>
          {showCombo && <span className="text-duo-fox">🔥 콤보 {combo}</span>}
        </p>
        {showCombo && combo === bestCombo && bestCombo >= 3 && (
          <p className="text-xs font-extrabold text-duo-fox">🏅 콤보 신기록!</p>
        )}
        {result.heartsRecovered && (
          <p className="text-xs font-extrabold text-duo-red">❤️ 하트 1개 회복!</p>
        )}
      </div>

      {/* 6. 카테고리별 미니 도넛 — 과목이 하나뿐이면 카드도 하나. 열 수를 개수에 맞춘다. */}
      {cats.length > 0 && (
        <div
          className="grid gap-2"
          style={{
            gridTemplateColumns: `repeat(${Math.min(cats.length, 3)}, minmax(0, 1fr))`,
          }}
        >
          {cats.map((c, i) => {
            const cPct = scoreOf(c.correct, c.total);
            const t = tierOf(cPct);
            return (
              <div
                key={c.category}
                className="animate-slide-up flex flex-col items-center gap-1.5 rounded-2xl border-2 border-ink-200 bg-white p-3"
                style={{ animationDelay: `${100 + i * 80}ms` }}
              >
                <p className="line-clamp-1 text-xs font-bold text-ink-900">
                  {CATEGORY_EMOJI[c.category]} {c.category}
                </p>
                <Ring
                  pct={cPct}
                  size={56}
                  stroke={6}
                  tone={t.text}
                  label={`${c.category} ${c.correct}/${c.total}`}
                >
                  <span className="font-round text-sm font-extrabold tabular-nums text-ink-900">
                    {c.correct}/{c.total}
                  </span>
                </Ring>
                <p className={"text-[11px] font-bold " + t.text}>{t.label}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* 7. CTA — 홈은 작게, 다음 행동(복습/계속)은 크게 */}
      <div className="flex gap-2">
        <button
          onClick={goHome}
          className="btn-3d rounded-2xl border-2 border-ink-200 bg-white px-5 py-4 text-sm font-extrabold text-accent"
        >
          홈
        </button>
        <button
          onClick={reviewCount > 0 ? startReview : goHome}
          className="btn-3d flex-1 rounded-2xl border-2 border-b-4 border-duo-green-dim bg-duo-green px-6 py-4 text-base font-extrabold tracking-wide text-white hover:brightness-105"
        >
          {reviewCount > 0
            ? failed
              ? "❤️ 복습하고 하트 회복"
              : `🔁 복습하기 (${Math.min(reviewCount, DAILY_GOAL)})`
            : "계속"}
        </button>
      </div>
    </div>
  );
}
