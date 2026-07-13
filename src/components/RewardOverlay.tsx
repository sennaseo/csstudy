// =============================================================
// RewardOverlay
// - 새 캐릭터 획득 / 진화 시 가운데 뜨는 축하 모달.
// - store 의 pendingReward 를 구독 → 있으면 표시, 닫으면 clearReward.
// - 컨페티는 모달이 열릴 때 1회 발사.
// =============================================================

import { useEffect, useState } from "react";
import { findCharacter, RARITY_INFO, stageOf } from "../data/characters";
import { useStudyStore } from "../store/useStudyStore";
import { Confetti } from "./Confetti";

export function RewardOverlay() {
  const reward = useStudyStore((s) => s.pendingReward);
  const buddies = useStudyStore((s) => s.buddies);
  const clearReward = useStudyStore((s) => s.clearReward);

  // 모달이 새로 열릴 때마다 컨페티 1발
  const [burstId, setBurstId] = useState(0);
  useEffect(() => {
    if (reward) setBurstId((b) => b + 1);
  }, [reward]);

  if (!reward) return null;

  const character = findCharacter(reward.buddyId);
  const record = buddies[reward.buddyId];
  if (!character || !record) return null;

  const isNew = reward.type === "new";
  // 새 획득은 1단계 모습, 진화는 도달한 단계 모습을 보여준다
  const stage = isNew ? 1 : (reward.stage ?? stageOf(record.xp));
  const stageInfo = character.stages[stage - 1];
  const rarity = RARITY_INFO[character.rarity];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/50 p-6 backdrop-blur-sm"
      onClick={clearReward}
      role="dialog"
      aria-label={isNew ? "새 버디 획득" : "버디 진화"}
    >
      <div
        className="relative w-full max-w-xs rounded-3xl bg-white p-6 text-center shadow-card animate-pop"
        onClick={(e) => e.stopPropagation()}
      >
        <Confetti burstId={burstId} />

        <p className="text-xs font-bold uppercase tracking-widest text-accent">
          {isNew ? "✨ NEW BUDDY ✨" : "⬆️ EVOLVED ⬆️"}
        </p>

        <div
          className={
            "mx-auto mt-4 flex h-24 w-fit min-w-24 items-center justify-center rounded-2xl bg-accent-soft/60 px-4 " +
            rarity.glow
          }
        >
          <pre className="font-mono text-lg leading-snug text-ink-900">
            {stageInfo.art.join("\n")}
          </pre>
        </div>

        <h3 className="mt-3 text-lg font-extrabold text-ink-900">
          {stageInfo.title}
        </h3>
        <div className="mt-1 flex items-center justify-center gap-1.5">
          <span className="text-xs text-ink-500">{character.name}</span>
          <span
            className={
              "rounded-full px-2 py-0.5 text-[10px] font-bold " + rarity.badge
            }
          >
            {rarity.label}
          </span>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-ink-500">
          {isNew ? character.desc : `${stage}단계로 진화했어요!`}
        </p>

        <button
          onClick={clearReward}
          className="mt-5 w-full rounded-xl bg-accent px-4 py-2.5 text-sm font-bold text-white transition-all hover:bg-accent-dim active:scale-[0.98]"
        >
          {isNew ? "반가워! 🤝" : "멋지다! 🎉"}
        </button>
      </div>
    </div>
  );
}
