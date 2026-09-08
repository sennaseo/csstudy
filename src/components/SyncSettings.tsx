// =============================================================
// SyncSettings — 클라우드 동기화 설정 (헤더의 ☁️ 버튼)
//
// - AWS 에 배포한 백엔드의 [함수 URL + 비밀 토큰]을 입력하면
//   이 기기의 진행상황이 서버와 자동으로 오간다.
// - 기기마다 딱 1번만 입력하면 됨 (localStorage 에 저장).
// - 상태 아이콘: ☁️ 연결됨 / ⏳ 동기화 중 / ⚠️ 오류 / (회색) 미설정
// =============================================================

import { useState } from "react";
import { useStudyStore } from "../store/useStudyStore";
import { getSyncConfig } from "../utils/sync";
import { useBack } from "../utils/useBack";
import { useDialog } from "../utils/useDialog";

function statusIcon(status: string): string {
  if (status === "ok") return "☁️";
  if (status === "syncing") return "⏳";
  if (status === "error") return "⚠️";
  return "☁";
}

export function SyncSettings() {
  const syncStatus = useStudyStore((s) => s.syncStatus);
  const lastSyncAt = useStudyStore((s) => s.lastSyncAt);
  const configureSync = useStudyStore((s) => s.configureSync);
  const disableSync = useStudyStore((s) => s.disableSync);
  const syncNow = useStudyStore((s) => s.syncNow);

  const [open, setOpen] = useState(false);
  useBack(() => setOpen(false), open); // 안드로이드 뒤로가기 = 닫기
  // 이 컴포넌트는 늘 마운트돼 있고 open 만 토글된다 → 열려 있을 때만 훅을 켠다.
  const dialogRef = useDialog<HTMLDivElement>(() => setOpen(false), open);
  const [url, setUrl] = useState(() => getSyncConfig()?.url ?? "");
  const [token, setToken] = useState(() => getSyncConfig()?.token ?? "");

  const save = () => {
    if (!url.trim() || !token.trim()) return;
    configureSync({ url: url.trim(), token: token.trim() });
    setOpen(false);
  };

  return (
    <>
      {/* 헤더용 작은 버튼 — 상태가 아이콘으로 보인다 */}
      <button
        onClick={() => setOpen(true)}
        title="클라우드 동기화 설정"
        aria-label="동기화 설정"
        className={
          "text-lg transition-opacity " +
          (syncStatus === "off" ? "opacity-30 grayscale" : "opacity-90")
        }
      >
        {statusIcon(syncStatus)}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setOpen(false)}
        >
          {/* 본체 — role="dialog" 는 배경 막이 아니라 여기에 붙는다 */}
          <div
            ref={dialogRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="sync-title"
            className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-card outline-none"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="sync-title" className="text-base font-extrabold text-ink-900">☁️ 클라우드 동기화</h3>
            <p className="mt-1 text-xs leading-relaxed text-ink-500">
              AWS 에 만든 서버 주소와 토큰을 넣으면, 폰이든 컴퓨터든 진행상황이
              이어져요. (설정 방법: 프로젝트의 <b>AWS-DEPLOY.md</b> 참고)
            </p>

            <label htmlFor="sync-url" className="mt-4 block text-xs font-bold text-ink-500">
              서버 주소 (Lambda 함수 URL)
            </label>
            <input
              id="sync-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://xxxx.lambda-url.ap-northeast-2.on.aws/"
              className="mt-1 w-full rounded-xl border-2 border-ink-200 px-3 py-2 text-sm outline-none focus:border-accent"
            />

            <label htmlFor="sync-token" className="mt-3 block text-xs font-bold text-ink-500">비밀 토큰</label>
            <input
              id="sync-token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="서버에 설정한 SYNC_TOKEN 과 동일하게"
              className="mt-1 w-full rounded-xl border-2 border-ink-200 px-3 py-2 text-sm outline-none focus:border-accent"
            />

            {/* 상태 표시 */}
            <p className="mt-3 text-xs text-ink-500">
              상태:{" "}
              {syncStatus === "ok" && lastSyncAt
                ? `연결됨 ✓ (마지막 동기화 ${new Date(lastSyncAt).toLocaleTimeString()})`
                : syncStatus === "syncing"
                ? "동기화 중..."
                : syncStatus === "error"
                ? "연결 실패 — 주소/토큰을 확인해주세요"
                : "미설정 (이 기기에만 저장 중)"}
            </p>

            <div className="mt-4 flex gap-2">
              <button
                onClick={save}
                className="btn-3d flex-1 rounded-xl border-duo-green-dim bg-duo-green px-4 py-2.5 text-sm font-extrabold text-white"
              >
                저장하고 연결
              </button>
              {syncStatus !== "off" && (
                <button
                  onClick={() => void syncNow()}
                  className="btn-3d rounded-xl border-2 border-ink-200 bg-white px-3 py-2.5 text-sm font-bold text-ink-500"
                  title="지금 동기화"
                  aria-label="지금 동기화"
                >
                  🔄
                </button>
              )}
            </div>
            {syncStatus !== "off" && (
              <button
                onClick={() => {
                  disableSync();
                  setOpen(false);
                }}
                className="mt-2 w-full text-center text-xs text-ink-400 hover:text-duo-red"
              >
                동기화 끄기
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
