// =============================================================
// MissionToast — "🎯 오늘의 미션 완료!" 2.5초 알림
//
// - 스토어 recordStatus 가 미션 보상을 지급하는 순간 missionDoneAt 에 시각을 찍는다.
//   여기선 그 값이 있으면 위에 띄우고, 2.5초 뒤(또는 누르면 즉시) 지운다.
// - 퀴즈 화면 위에서도 떠야 해서 App 맨 바깥(RewardOverlay 옆)에 둔다.
// - z-40: 탭바(z-30) 위. 진화/획득 모달(pendingReward, z-50)이 떠 있으면 토스트는 숨고
//   타이머도 멈춘다 — 모달이 닫힌 뒤에 뜨고, 그때부터 2.5초를 센다.
// - role="status": 스크린리더가 하던 일을 끊지 않고 조용히 읽어준다.
// =============================================================

import { useEffect } from "react";

import { MISSION_XP } from "../data/missions";
import { useStudyStore } from "../store/useStudyStore";

export function MissionToast() {
  const missionDoneAt = useStudyStore((s) => s.missionDoneAt);
  const clearMissionToast = useStudyStore((s) => s.clearMissionToast);
  // 진화/획득 모달이 떠 있으면 true — 그동안은 토스트를 보류한다(구독만, 스토어는 안 건드림).
  const blocked = useStudyStore((s) => s.pendingReward !== null);

  useEffect(() => {
    // 모달이 떠 있는 동안엔 타이머를 시작하지 않는다. 모달이 닫혀 blocked 가 false 가 되면
    // 이 효과가 다시 돌면서 그때부터 2.5초를 센다.
    if (missionDoneAt === null || blocked) return;
    const id = window.setTimeout(clearMissionToast, 2500);
    // 화면이 사라지거나 값이 바뀌면 이전 타이머는 치운다(안 치우면 엉뚱한 때 닫힌다).
    return () => window.clearTimeout(id);
  }, [missionDoneAt, blocked, clearMissionToast]);

  if (missionDoneAt === null || blocked) return null;

  return (
    <div
      role="status"
      onClick={clearMissionToast}
      className="feedback-rise fixed inset-x-4 top-[max(1rem,env(safe-area-inset-top))] z-40 mx-auto max-w-xl rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm font-bold text-ink-900 shadow-sheet"
    >
      🎯 오늘의 미션 완료! 버디 XP +{MISSION_XP}
    </div>
  );
}
