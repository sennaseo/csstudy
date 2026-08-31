import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// 서비스워커에 "이번 빌드의 자산 목록"을 심어주는 플러그인.
// JS/CSS 파일명엔 해시가 붙어서(index-a1b2c3.js) sw.js 에 손으로 못 적는다.
// 빌드가 끝난 뒤 dist/assets 를 읽어 __BUILD_ASSETS__ 자리에 끼워넣는다.
// 이게 없으면 "설치 → 비행기 모드 → 첫 실행"이 빈 화면이 된다 (실제로 그랬다).
function swPrecache() {
  return {
    name: "sw-precache",
    apply: "build" as const,
    closeBundle() {
      const dist = "dist";
      // 해시가 붙는 JS/CSS + 내장 폰트.
      // 폰트를 빼먹으면 "설치 → 비행기 모드 → 첫 실행"에서 손글씨가 안 나오고
      // 시스템 고딕으로 나온다. 앱은 안 깨지지만 테마가 무너지니 같이 캐시한다.
      // (woff2 만 — 같은 폴더의 OFL.txt 는 화면에 안 쓰이므로 캐시할 이유가 없다.)
      const assets = [
        ...readdirSync(join(dist, "assets")).map((f) => `./assets/${f}`),
        ...readdirSync(join(dist, "fonts"))
          .filter((f) => f.endsWith(".woff2"))
          .map((f) => `./fonts/${f}`),
      ];
      // <script crossorigin> 제거.
      // 같은 출처 자산엔 필요 없는 속성인데, 이게 붙으면 모듈 요청이 CORS 모드로 나가고
      // 서비스워커가 돌려주는 캐시 응답엔 CORS 헤더가 없어 오프라인에서 모듈 실행이
      // 거부된다 (에러도 안 뜨고 흰 화면). 일반 fetch 는 되는데 <script type=module> 만
      // 죽는 게 이 증상의 특징이다.
      const htmlPath = join(dist, "index.html");
      writeFileSync(
        htmlPath,
        readFileSync(htmlPath, "utf8").replace(/\s+crossorigin(?==|\s|>)/g, ""),
      );

      const swPath = join(dist, "sw.js");
      const src = readFileSync(swPath, "utf8");
      writeFileSync(
        swPath,
        // 캐시 이름에도 자산 목록 해시를 섞어, 새 빌드가 나오면 옛 캐시가 자동으로 버려지게 한다.
        src
          .replace('"__BUILD_ASSETS__"', JSON.stringify(assets))
          .replace("csstudy-v2", `csstudy-${assets.length}-${assets.join("").length}`),
      );
    },
  };
}

// Vite 설정 — 로컬 개발 + 빠른 HMR 만 필요하므로 최소 설정.
// mode 로 "웹(GitHub Pages) 빌드"와 "안드로이드 앱(Capacitor) 빌드"를 가른다.
// npm run build       → mode "production" (웹, 기존 동작 그대로)
// npm run build:native → mode "native"    (앱, .env.native 를 함께 읽는다)
export default defineConfig(({ mode }) => {
  const isNative = mode === "native";

  return {
    // 웹: GitHub Pages 가 https://sennaseo.github.io/csstudy/ 하위 경로로 서빙하므로
    //     빌드 결과물의 모든 링크 앞에 이 base 를 붙인다. (개발 서버는 영향 없음 — vite 가 알아서 / 로)
    // 앱: Capacitor 는 폰 안의 파일을 file:// (또는 capacitor://) 로 열기 때문에
    //     "/csstudy/" 는 폰의 루트 폴더를 가리키게 돼 자산을 못 찾고 흰 화면이 뜬다.
    //     그래서 "현재 폴더 기준"인 상대경로 "./" 로 바꾼다.
    base: isNative ? "./" : "/csstudy/",
    // 서비스워커 프리캐시 플러그인은 웹 전용.
    // 앱은 이미 자산이 폰 안에 통째로 들어있어 오프라인 캐시가 필요 없고,
    // 오히려 SW 캐시가 남아 앱을 업데이트해도 옛 화면이 나오는 사고만 난다.
    plugins: [react(), ...(isNative ? [] : [swPrecache()])],
    server: {
      port: 5173,
      open: true,
    },
  };
});
