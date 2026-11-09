// =============================================================
// TabBar
// - 화면 하단에 붙는 5개 탭(홈/이론/실무/노트/마이) 이동 바.
// - 도감은 탭에서 뺐다 — 보상을 "가끔 구경하는" 곳이라 핵심 루프(오늘 5문제) 밖이다.
//   홈 버디 카드·마이 탭 "도감" 행으로 들어가고, 도감에 있는 동안은 마이 탭이 켜져 보인다.
// - 아이콘은 이모지 대신 인라인 SVG(라이브러리 없음) — 색이 활성/비활성 글자색(currentColor)을 따라간다.
//   활성색은 Primary 와 같은 초록.
// - 게임기 컨트롤러의 방향 버튼처럼, 어디서든 손 안 떼고 다른 화면으로 점프한다.
//
// 왜 fixed 인가
//   이 앱은 (모달 빼고는) 문서 전체가 스크롤되는 구조다. 탭바를 그냥
//   레이아웃 흐름에 두면 스크롤할 때 같이 흘러가버려서 "항상 하단 고정"이
//   깨진다. fixed + inset-x-0 bottom-0 으로 뷰포트에 못 박아 둔다.
//
// 왜 z-30 인가
//   모달들은 z-40(CardDeck·CollectionBook·StudyCalendar 계열)이나
//   z-50(RewardOverlay·SyncSettings)을 쓴다. 탭바는 그보다 낮은 z-30이어야
//   모달이 뜰 때 탭바가 위로 뚫고 나와 모달을 가리는 사고가 안 난다.
//
// 왜 window 가 아니라 #root 를 굴리는가
//   index.css 가 html, body, #root 에 height:100% 를 줘서 실제로 스크롤되는
//   상자는 문서가 아니라 #root 다. 그래서 window.scrollTo 는 아무 일도 안 한다
//   (실제로 그렇게 썼다가 안 먹는 걸 확인했다).
//   스크롤 위치는 탭이 바뀌어도 그 상자에 그대로 남는다. 퀴즈 탭에서 긴 길을
//   내려간 채 도감으로 넘어가면 도감이 중간부터 보인다. 탭을 바꿀 때마다
//   그 상자를 맨 위로 되돌린다.
// =============================================================

import { useStudyStore, type AppTab } from "../store/useStudyStore";

// 아이콘 = 24x24 칸에 그린 단순한 선(path). 집 / 책 / 렌치 / 공책 / 사람.
// 공책 = 네모 표지 + 왼쪽 세로줄(제본) + 가로줄 두 개(필기).
const TABS: { id: AppTab; icon: string; label: string }[] = [
  { id: "home", icon: "M3 11l9-7 9 7M5 10v10h5v-6h4v6h5V10", label: "홈" },
  { id: "quiz", icon: "M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2V5zM4 21a2 2 0 012-2h13", label: "이론" },
  {
    id: "practice",
    icon: "M14.7 6.3a4 4 0 015 5L19 12l-7 7a2.1 2.1 0 01-3-3l7-7 .7-.7a4 4 0 01-2-2z",
    label: "실무",
  },
  {
    id: "notes",
    icon: "M6 3h12a1 1 0 011 1v16a1 1 0 01-1 1H6a1 1 0 01-1-1V4a1 1 0 011-1zM9 3v18M12 8h4M12 12h4",
    label: "노트",
  },
  { id: "my", icon: "M12 12a4 4 0 100-8 4 4 0 000 8zM4 21a8 8 0 0116 0", label: "마이" },
];

export function TabBar() {
  const tab = useStudyStore((s) => s.tab);
  const setTab = useStudyStore((s) => s.setTab);

  return (
    <nav
      aria-label="주요 메뉴"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-ink-200 bg-white pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="mx-auto flex max-w-xl">
        {TABS.map((t) => {
          // 도감(collection)은 탭바에 없으니, 들어가는 문인 마이 탭을 켜 둔다.
          const active = tab === t.id || (tab === "collection" && t.id === "my");
          return (
            <li key={t.id} className="flex-1">
              <button
                type="button"
                onClick={() => {
                  setTab(t.id);
                  document.getElementById("root")?.scrollTo(0, 0);
                }}
                aria-current={active ? "page" : undefined}
                className={
                  "flex min-h-14 w-full flex-col items-center justify-center gap-0.5 px-1 text-xs font-bold transition-colors "
                  + (active ? "text-accent-dim" : "text-ink-400 hover:text-ink-700")
                }
              >
                <svg
                  aria-hidden
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d={t.icon} />
                </svg>
                {t.label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
