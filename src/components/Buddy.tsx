// =============================================================
// Buddy
// - 대표 캐릭터를 메인 화면에 데리고 다니는 위젯.
// - 캐릭터 아트 + 단계 이름 + 다음 진화까지의 XP 바.
// - 아직 한 마리도 없으면 "첫 문제를 풀어보세요" 안내.
// - 우측 상단 버튼으로 도감(CollectionBook) 열기.
// =============================================================

import { useState } from "react";
import {
  findCharacter,
  RARITY_INFO,
  stageOf,
  stageProgress,
  STAGE_XP,
} from "../data/characters";
import { useStudyStore } from "../store/useStudyStore";
import { CollectionBook } from "./CollectionBook";

export function Buddy() {
  const buddies = useStudyStore((s) => s.buddies);
  const activeBuddyId = useStudyStore((s) => s.activeBuddyId);
  const [isBookOpen, setIsBookOpen] = useState(false);

  const ownedCount = Object.keys(buddies).length;
  const character = activeBuddyId ? findCharacter(activeBuddyId) : undefined;
  const record = activeBuddyId ? buddies[activeBuddyId] : undefined;

  return (
    <>
      <div className="rounded-2xl bg-white p-4 shadow-card">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-ink-900">내 버디</span>
          <button
            onClick={() => setIsBookOpen(true)}
            className="rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent-dim transition-colors hover:bg-accent hover:text-white"
          >
            📖 도감 {ownedCount}/12
          </button>
        </div>

        {character && record ? (
          <BuddyCard
            charId={character.id}
            xp={record.xp}
          />
        ) : (
          <p className="mt-3 text-center text-sm leading-relaxed text-ink-500">
            아직 버디가 없어요.
            <br />
            <span className="font-semibold text-accent">
              첫 문제를 풀면 친구가 찾아옵니다! 🐣
            </span>
          </p>
        )}
      </div>

      {isBookOpen && <CollectionBook onClose={() => setIsBookOpen(false)} />}
    </>
  );
}

/** 대표 캐릭터 카드 — 아트 + 단계 + XP 바 */
function BuddyCard({ charId, xp }: { charId: string; xp: number }) {
  const character = findCharacter(charId);
  if (!character) return null;

  const stage = stageOf(xp);
  const stageInfo = character.stages[stage - 1];
  const rarity = RARITY_INFO[character.rarity];
  const percent = stageProgress(xp);
  const isMax = stage === 3;

  return (
    <div className="mt-3 flex items-center gap-4">
      {/* 아트 — 줄 배열을 그대로 pre 로. 레어 이상은 은은한 글로우 */}
      <div
        className={
          "flex h-20 min-w-20 items-center justify-center rounded-xl bg-accent-soft/50 px-3 " +
          rarity.glow
        }
      >
        <pre className="text-center font-mono text-base leading-snug text-ink-900">
          {stageInfo.art.join("\n")}
        </pre>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="truncate text-sm font-bold text-ink-900">
            {stageInfo.title}
          </span>
          <span
            className={
              "shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-bold " +
              rarity.badge
            }
          >
            {rarity.label}
          </span>
        </div>
        <p className="text-xs text-ink-500">
          {character.name} · {stage}단계
        </p>

        {/* XP 바 */}
        <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-ink-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-accent to-sky-400 transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="mt-0.5 text-[10px] tabular-nums text-ink-300">
          {isMax
            ? `최종 진화 완료! (XP ${xp})`
            : `다음 진화까지 XP ${xp} / ${STAGE_XP[stage]}`}
        </p>
      </div>
    </div>
  );
}
