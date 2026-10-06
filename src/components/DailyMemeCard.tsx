// =============================================================
// DailyMemeCard — 홈 아래쪽 "오늘의 개발자 운세 / 버그 / 한마디"
//
// - 퀘스트 카드가 "센 밈"이라면 이건 조용한 보조 카드. 효과선 없이 본문 한 문장만 손글씨.
// - 종류와 문구는 날짜로 정해진다(src/data/memes.ts 의 dailyMeme).
//   5일 중 하루는 null 이라 카드 자체가 안 뜬다 — "오늘은 뭐 떴지?" 하고 다시 보러 올 이유.
// - 버튼이 아니다: 눌러도 갈 곳이 없는데 눌리는 척하면 안 된다(거짓 어포던스 금지).
// =============================================================

import { dailyMeme } from "../data/memes";
import { dateKeyOf } from "../data/missions";
import { MemeFigure } from "./MemeFigure";

const LABEL = {
  fortune: "🍀 오늘의 개발자 운세",
  bug: "🐛 오늘의 버그",
  quote: "💀 오늘의 한마디",
} as const;

export function DailyMemeCard() {
  const meme = dailyMeme(dateKeyOf(new Date()));
  if (!meme) return null;

  return (
    <section
      aria-label={LABEL[meme.kind]}
      className="flex items-center gap-3 rounded-2xl border border-ink-200 bg-white p-4"
    >
      <MemeFigure slot="daily" size={40} />
      <div className="min-w-0">
        <p className="text-xs font-bold text-ink-500">{LABEL[meme.kind]}</p>
        <p className="mt-0.5 break-keep font-display text-base text-ink-900">{meme.text}</p>
        {meme.kind === "fortune" && (
          <p className="mt-0.5 text-xs text-ink-500">행운의 개념 · {meme.concept}</p>
        )}
      </div>
    </section>
  );
}
