// =============================================================
// HomeScreen — 홈 탭 본문 (헤더·하트 경고·탭바는 App.tsx 가 그린다)
//
// 세로 순서(위 → 아래):
//   ① QuestCard     오늘의 퀘스트 — 5문제 + 밈 말풍선 + 시작 버튼 (홈에서 유일한 "센 밈")
//   ② Buddy         다음 진화까지 XP. 누르면 도감
//   ③ 2열           MissionCard(오늘의 미션) | PracticeCard(실무 탭으로)
//   ④ ReviewRow     복습할 문제가 있을 때만
//   ⑤ DailyMemeCard 오늘의 운세/버그/한마디 (날짜에 따라 없는 날도 있다)
//   ⑥ 트랙·난이도   하루에 한 번도 안 만지는 설정이라 접어 둔다
//
// 왜 App.tsx 에서 따로 뺐나?
// - "카드를 세로로 쌓는다"를 아는 곳을 이 파일 하나로 모으려고.
//   나중에 웹에서 넓은 화면용 배치(2단 그리드 등)를 만들 때 이 파일만 바꾸면 된다.
//   카드들은 각자 스토어를 직접 읽어서 어디에 놓아도 그대로 동작한다.
// =============================================================

import { useState } from "react";
import { PRACTICE_LINE } from "../data/memes";
import { TRACKS } from "../data/tracks";
import { useStudyStore } from "../store/useStudyStore";
import { Buddy } from "./Buddy";
import { DailyMemeCard } from "./DailyMemeCard";
import { MissionCard } from "./MissionCard";
import { QuestCard } from "./QuestCard";
import { ReviewZone } from "./ReviewZone";
import { LEVELS, TrackPicker } from "./TrackPicker";

export function HomeScreen() {
  const activeTrack = useStudyStore((s) => s.activeTrack);
  const activeLevel = useStudyStore((s) => s.activeLevel);
  // 접힌 트랙 설정의 한 줄 요약 — 열지 않아도 지금 뭘로 풀고 있는지 보이게.
  const trackName = TRACKS.find((t) => t.id === activeTrack)?.name ?? "전체";
  const levelName = LEVELS.find((l) => l.level === activeLevel)?.label ?? "믹스";

  return (
    <>
      <QuestCard />
      <Buddy />
      <div className="grid grid-cols-2 gap-3">
        <MissionCard />
        <PracticeCard />
      </div>
      <ReviewRow />
      <DailyMemeCard />
      <details>
        <summary className="flex min-h-11 cursor-pointer items-center text-sm font-semibold text-ink-500 list-none [&::-webkit-details-marker]:hidden">
          ▸ 트랙 {trackName} · 난이도 {levelName}
        </summary>
        <TrackPicker />
      </details>
    </>
  );
}

/** 실무 카드 — 이론(안다)·문제(기억한다) 다음 단계인 "적용한다"로 가는 문.
 *  카드 전체가 버튼이고 "해보기 →" 는 글자일 뿐(버튼 안 버튼 금지). */
function PracticeCard() {
  const setTab = useStudyStore((s) => s.setTab);
  return (
    <button
      type="button"
      onClick={() => setTab("practice")}
      className="flex min-h-[7rem] w-full flex-col rounded-2xl border border-ink-200 bg-white p-3 text-left transition-colors active:bg-ink-100"
    >
      <span className="flex items-center gap-1.5 text-xs font-bold text-ink-500">
        {/* 실무 = 보라(beetle) 계열 — 이모지 칩 배경에만 옅게 쓴다(글자색으로는 안 씀) */}
        <span aria-hidden className="rounded-md bg-duo-beetle/10 px-1">
          🔧
        </span>
        오늘의 실무
      </span>
      <span className="mt-1 block break-keep text-sm font-bold text-ink-900">
        JOIN으로 테이블 하나 합쳐보기
      </span>
      <span className="mt-0.5 block text-xs text-ink-500">챕터 3 · 7문제</span>
      <span className="mt-auto flex items-end justify-between gap-1 pt-1.5">
        {/* 작은 손글씨 양념 — 밈은 퀘스트 카드가 메인이라 여기선 이미지·효과선 없이 한 줄만 */}
        <span className="whitespace-nowrap font-display text-sm text-ink-500">{PRACTICE_LINE}</span>
        <span className="shrink-0 text-sm font-bold text-accent-dim">해보기 →</span>
      </span>
    </button>
  );
}

/** 복습 행 — 밀린 게 없으면 아예 숨긴다(빈 버튼을 보여줄 이유가 없다).
 *  행 전체가 버튼: 작은 "복습 ›" 글자만 누르게 하면 과녁이 너무 좁다. */
function ReviewRow() {
  const reviewCount = useStudyStore((s) => s.getReviewCount());
  // 바로 풀기 대신 "무엇을 틀렸나" 목록(복습 존)을 먼저 보여준다. 거기서 복습 시작.
  const [open, setOpen] = useState(false);
  if (reviewCount === 0) return null;
  return (
    <>
    {open && <ReviewZone onClose={() => setOpen(false)} />}
    <button
      type="button"
      onClick={() => setOpen(true)}
      title="잊기 전에 다시 보기"
      className="flex min-h-14 w-full items-center justify-between gap-3 rounded-2xl border border-ink-200 bg-white px-4 py-3 text-left transition-colors active:bg-ink-100"
    >
      <span className="min-w-0">
        <span className="block text-base font-bold text-ink-900">
          📚 복습할 문제 <span className="font-round tabular-nums">{reviewCount}</span>개
        </span>
        <span className="block text-sm text-ink-500">잊기 전에 다시 보기</span>
      </span>
      <span className="shrink-0 text-sm font-bold text-accent-dim">목록 ›</span>
    </button>
    </>
  );
}
