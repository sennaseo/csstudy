// =============================================================
// TabBar
// - 화면 하단에 붙는 5개 탭(홈/이론/실무/도감/마이) 이동 바.
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

const TABS: { id: AppTab; emoji: string; label: string }[] = [
  { id: "home", emoji: "🏠", label: "홈" },
  { id: "quiz", emoji: "📝", label: "이론" },
  { id: "practice", emoji: "🛠️", label: "실무" },
  { id: "collection", emoji: "📖", label: "도감" },
  { id: "my", emoji: "👤", label: "마이" },
];

export function TabBar() {
  const tab = useStudyStore((s) => s.tab);
  const setTab = useStudyStore((s) => s.setTab);

  return (
    <nav
      aria-label="주요 메뉴"
      className="fixed inset-x-0 bottom-0 z-30 border-t-2 border-ink-200 bg-white pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="mx-auto flex max-w-xl">
        {TABS.map((t) => {
          const active = tab === t.id;
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
                  "flex w-full flex-col items-center gap-0.5 px-1 pb-1.5 pt-2 text-[11px] font-extrabold transition-colors "
                  + (active ? "text-accent" : "text-ink-400 hover:text-ink-700")
                }
              >
                <span className="text-xl leading-none" aria-hidden>
                  {t.emoji}
                </span>
                {t.label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
