import type { CapacitorConfig } from "@capacitor/cli";

// Capacitor 설정 — 웹 빌드 결과물(dist)을 안드로이드 앱 껍데기 안에 넣기 위한 명세.
// "앱은 웹뷰 하나짜리 브라우저"라고 보면 된다. 아래 세 줄이 그 브라우저에게
// "누구 이름으로, 어느 폴더를 열어라"를 알려준다.
const config: CapacitorConfig = {
  // 안드로이드 패키지명 = 스토어에서 이 앱을 식별하는 주민등록번호. 한번 정하면 못 바꾼다.
  appId: "io.github.sennaseo.csstudy",
  // 홈 화면 아이콘 밑에 뜨는 이름.
  appName: "csStudy",
  // 웹뷰가 열 폴더. 반드시 npm run build:native 로 만든 dist 여야 한다
  // (일반 npm run build 는 base 가 "/csstudy/" 라 앱 안에서 흰 화면이 된다).
  webDir: "dist",
};

export default config;
