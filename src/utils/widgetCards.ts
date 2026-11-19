// =============================================================
// 위젯에 띄울 단어 — 고른 카드 id 목록
// - 저장: 이 기기 localStorage (화면에 체크 표시를 그리려고).
// - 안드로이드 앱에서는 같은 목록을 네이티브 플러그인(WidgetCards)으로도 넘긴다.
//   홈 화면 위젯은 앱 화면과 따로 그려져 localStorage 를 못 보기 때문이다.
//   (안드로이드 쪽 짝: android/.../widget/WidgetCardsPlugin.kt)
// - 하나도 안 고르면 = 전체 카드가 돈다 (위젯 쪽 pickCards 와 같은 규칙).
// - 웹(브라우저)에서는 위젯이 없으니 저장만 하고 조용히 넘어간다.
// =============================================================

import { Capacitor, registerPlugin } from "@capacitor/core";

const KEY = "csstudy-widget-cards";

interface WidgetCardsPlugin {
  setSelected(options: { ids: string[] }): Promise<void>;
}
const WidgetCards = registerPlugin<WidgetCardsPlugin>("WidgetCards");

/** 위젯이 있는 환경(안드로이드 앱)인가 — 화면 안내 문구를 고를 때 쓴다. */
export const hasWidget = Capacitor.isNativePlatform();

export function loadWidgetIds(): string[] {
  try {
    const v = JSON.parse(window.localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

/** 고른 목록을 저장하고 위젯에 알린다. 위젯 쪽 전달이 실패해도 화면은 계속 쓴다. */
export function saveWidgetIds(ids: string[]): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(ids));
  } catch {
    /* 저장이 막혀도 화면은 계속 */
  }
  pushToWidget(ids);
}

/** 네이티브(위젯 저장소)로 목록 보내기. 앱을 켤 때도 한 번 불러 둘을 맞춘다. */
export function pushToWidget(ids: string[] = loadWidgetIds()): void {
  if (!hasWidget) return;
  WidgetCards.setSelected({ ids }).catch(() => {
    /* 옛 버전 앱이라 플러그인이 없을 수 있다 — 무시 */
  });
}
