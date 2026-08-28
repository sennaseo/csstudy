// =============================================================
// sync.ts — AWS 백엔드와 진행상황 주고받기
//
// 큰 그림 (초보자용):
// - 서버에는 "내 진행상황 전체(PersistedState)"가 JSON 한 덩어리로 저장된다.
//   (은행 금고에 노트 한 권을 통째로 맡겨두는 느낌)
// - 앱 켤 때: 서버에서 노트를 가져와 → 내 폰의 노트와 "합치고"(merge) → 다시 맡긴다.
// - 문제 풀 때: 2초 뒤에 자동으로 서버에 올린다 (debounce — 연타 방지).
// - 설정(서버 주소 + 비밀 토큰)은 localStorage 에 저장 → 기기마다 1번만 입력.
// =============================================================

import type { PersistedState } from "../types";

export interface SyncConfig {
  /** Lambda 함수 URL (예: https://xxxx.lambda-url.ap-northeast-2.on.aws/) */
  url: string;
  /** 서버와 약속한 비밀 토큰 — 이게 맞아야 서버가 응답해준다. */
  token: string;
}

const CFG_KEY = "csStudy:syncConfig";

export function getSyncConfig(): SyncConfig | null {
  try {
    const raw = localStorage.getItem(CFG_KEY);
    if (!raw) return null;
    const cfg = JSON.parse(raw) as SyncConfig;
    return cfg.url && cfg.token ? cfg : null;
  } catch {
    return null;
  }
}

export function saveSyncConfig(cfg: SyncConfig | null) {
  if (cfg) localStorage.setItem(CFG_KEY, JSON.stringify(cfg));
  else localStorage.removeItem(CFG_KEY);
}

// ─── 서버 통신 ────────────────────────────────────────────

interface RemotePayload {
  data: PersistedState | null;
  updatedAt: number | null;
}

/** 서버에서 진행상황 내려받기. 실패하면 throw. */
export async function pullRemote(cfg: SyncConfig): Promise<RemotePayload> {
  const res = await fetch(cfg.url, {
    method: "GET",
    headers: { Authorization: `Bearer ${cfg.token}` },
  });
  if (!res.ok) throw new Error(`pull failed: ${res.status}`);
  return (await res.json()) as RemotePayload;
}

/** 서버에 진행상황 올리기. 실패하면 throw. */
export async function pushRemote(cfg: SyncConfig, data: PersistedState): Promise<void> {
  const res = await fetch(cfg.url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${cfg.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`push failed: ${res.status}`);
}

// ─── 병합(merge) — 두 기기의 기록을 합친다 ─────────────────
// 규칙: "더 많이 한 쪽 / 더 최신인 쪽"이 이긴다. 데이터가 사라지는 일이 없게.

export function mergeStates(a: PersistedState, b: PersistedState): PersistedState {
  // 문제 기록: 더 최근에 복습한 쪽이 이긴다. reviewCount 는 큰 쪽.
  const records = { ...a.records };
  for (const [id, rb] of Object.entries(b.records)) {
    const ra = records[id];
    if (!ra || rb.lastReviewedAt > ra.lastReviewedAt) {
      records[id] = { ...rb, reviewCount: Math.max(rb.reviewCount, ra?.reviewCount ?? 0) };
    } else {
      records[id] = { ...ra, reviewCount: Math.max(ra.reviewCount, rb.reviewCount) };
    }
  }

  // 일일 카운트: 날짜별로 큰 값 (두 기기에서 풀었어도 최소한 잃진 않는다).
  const dailyCounts = { ...a.dailyCounts };
  for (const [day, n] of Object.entries(b.dailyCounts)) {
    dailyCounts[day] = Math.max(dailyCounts[day] ?? 0, n);
  }

  // 레슨 진행: 정답수는 최고 기록, 완료 시각은 더 이른 쪽.
  const lessonProgress = { ...a.lessonProgress };
  for (const [id, pb] of Object.entries(b.lessonProgress)) {
    const pa = lessonProgress[id];
    lessonProgress[id] = pa
      ? {
          correct: Math.max(pa.correct, pb.correct),
          total: Math.max(pa.total, pb.total),
          completedAt: Math.min(pa.completedAt, pb.completedAt),
        }
      : pb;
  }

  // 캐릭터: 합집합. XP 는 큰 쪽, 획득 시각은 더 이른 쪽.
  const buddies = { ...a.buddies };
  for (const [id, bb] of Object.entries(b.buddies)) {
    const ba = buddies[id];
    buddies[id] = ba
      ? { xp: Math.max(ba.xp, bb.xp), obtainedAt: Math.min(ba.obtainedAt, bb.obtainedAt) }
      : bb;
  }

  return {
    records,
    dailyCounts,
    lessonProgress,
    buddies,
    // 화면 설정류는 "지금 이 기기(a)" 우선, 없으면 상대 쪽.
    activeCategory: a.activeCategory ?? b.activeCategory,
    activeGroup: a.activeGroup ?? b.activeGroup,
    activeTrack: a.activeTrack ?? b.activeTrack,
    activeBuddyId: a.activeBuddyId ?? b.activeBuddyId,
    // 보상 중복 방지 — 더 최신 날짜가 이긴다 ('YYYY-MM-DD' 는 문자열 비교 OK).
    lastGoalRewardDay:
      [a.lastGoalRewardDay, b.lastGoalRewardDay].filter(Boolean).sort().pop() ?? null,
    // 최고 콤보: 두 기기 중 더 높은 기록.
    bestCombo: Math.max(a.bestCombo ?? 0, b.bestCombo ?? 0),
    // 하트: 관대하게 더 많은 쪽. 회복 기준 시각은 더 최신.
    hearts: Math.max(a.hearts ?? 5, b.hearts ?? 5),
    heartsUpdatedAt: Math.max(a.heartsUpdatedAt ?? 0, b.heartsUpdatedAt ?? 0),
  };
}

// ─── 자동 업로드 (debounce) ───────────────────────────────
// 문제를 연속으로 풀면 저장이 연달아 일어나는데, 매번 서버에 쏘면 낭비.
// "마지막 저장 후 2초 조용하면" 그때 1번만 올린다.

let pushTimer: ReturnType<typeof setTimeout> | null = null;

export function schedulePush(
  getData: () => PersistedState,
  onResult: (ok: boolean) => void
) {
  const cfg = getSyncConfig();
  if (!cfg) return; // 동기화 미설정 → 아무것도 안 함 (로컬 저장만)
  if (pushTimer) clearTimeout(pushTimer);
  pushTimer = setTimeout(async () => {
    try {
      await pushRemote(cfg, getData());
      onResult(true);
    } catch {
      onResult(false);
    }
  }, 2000);
}
