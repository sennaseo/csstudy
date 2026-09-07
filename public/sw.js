// =============================================================
// Service Worker — 오프라인 지원 (지하철에서도 동작!)
//
// 전략: "네트워크 우선, 실패하면 캐시" (network-first)
// - 인터넷이 되면: 항상 최신 버전을 받고, 받은 김에 캐시에 복사해둔다.
// - 인터넷이 안 되면(지하철 터널): 캐시에 복사해둔 걸 꺼내 쓴다.
// 비유: 항상 새 신문을 사되, 못 사는 날엔 어제 신문을 본다.
// =============================================================

const CACHE_NAME = "csstudy-v2";

// 설치 즉시 담아둘 최소한의 자산(앱 셸).
// 이게 없으면 "설치 → 비행기 모드 → 첫 실행"이 빈 화면이 된다.
// network-first 는 한 번 온라인으로 열어본 것만 캐시에 있기 때문.
// 해시가 붙는 JS/CSS 는 여기 적을 수 없어서(빌드마다 이름이 바뀜) fetch 때 캐시된다.
// __BUILD_ASSETS__ 는 빌드 때 vite 플러그인이 해시 붙은 실제 파일명으로 바꿔치기한다.
// (dev 서버에선 치환이 안 되므로 빈 배열로 남고, 그때는 SW 자체가 등록되지 않는다.)
const BUILD_ASSETS = "__BUILD_ASSETS__";
const SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./logo-cat.png", // 헤더 로고 — 없으면 오프라인에서 깨진 이미지로 뜬다
  // 해시 자산(JS/CSS)까지 넣어야 "설치 후 첫 실행이 오프라인"인 경우에도 앱이 뜬다.
  ...(Array.isArray(BUILD_ASSETS) ? BUILD_ASSETS : []),
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      // 하나라도 실패하면 설치 전체가 죽는 addAll 대신 개별로 — 아이콘 하나 없다고
      // 오프라인 지원 전체를 포기할 이유는 없다.
      // cache.add 는 요청을 그대로 저장한다. 그런데 index.html 의 <script> 에는
      // vite 가 crossorigin 을 붙여서, 브라우저는 그 자산을 CORS 모드로 다시 요청한다.
      // 캐시에 no-cors(opaque)나 다른 모드로 저장돼 있으면 모듈 실행이 조용히 실패한다
      // (에러 메시지도 안 뜨고 흰 화면만 남는다 — 실제로 여기서 한참 헤맸다).
      // 그래서 자산은 명시적으로 cors 모드로 받아서 넣는다.
      // 상대 경로("./")를 절대 URL 로 먼저 편다.
      // cache.put/match 의 키는 결국 절대 URL 이라, 넣을 때와 꺼낼 때 형태가
      // 다르면 조용히 어긋난다. 여기서 한 번에 정규화해두면 그 부류의 버그가 사라진다.
      await Promise.all(
        SHELL.map(async (path) => {
          const url = new URL(path, self.location.href).href;
          try {
            const res = await fetch(url);
            if (res.ok && res.type !== "opaque") await cache.put(url, res);
          } catch {
            /* 하나 실패해도 나머지는 캐시한다 */
          }
        })
      );
      await self.skipWaiting();
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // 버전이 바뀌면 옛 캐시 청소
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  // GET + 우리 도메인 요청만 다룬다 (외부 폰트 CDN 등은 브라우저 기본 동작)
  if (request.method !== "GET" || !request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      try {
        const fresh = await fetch(request);
        // opaque 응답(no-cors 결과)은 캐시에 넣어도 나중에 못 쓴다 — 저장하지 않는다.
        if (fresh.ok && fresh.type !== "opaque") {
          cache.put(request, fresh.clone()); // 받은 김에 캐시에 복사
        }
        return fresh;
      } catch {
        // 오프라인! 캐시에서 꺼낸다.
        //
        // ⚠️ ignoreVary 가 핵심이다. 서버가 자산에 `Vary: Origin` 을 붙여 보내면,
        // 캐시는 "저장할 때와 꺼낼 때의 Origin 헤더가 같아야" 매칭시켜 준다.
        // SW 안에서 만든 조회 요청엔 그 헤더가 없어서 — 캐시에 파일이 멀쩡히
        // 들어있는데도 match() 가 null 을 돌려준다. 그러면 스크립트 로드가
        // 조용히 실패하고(콘솔에 메시지조차 안 남는다) 흰 화면만 남는다.
        // ignoreVary:true 는 "헤더 비교는 됐고 URL 만 보라"는 뜻이다.
        //
        // ignoreSearch 는 ?open=deck 같은 쿼리가 붙은 주소를 같은 문서로 취급하기 위한 것.
        const opts = { ignoreVary: true };
        const cached =
          (await cache.match(request.url, opts)) ||
          (await cache.match(request.url, { ...opts, ignoreSearch: true }));
        if (cached) return cached;
        // SPA 라우팅 대비: 페이지 요청이면 index.html 로.
        // 상대 경로("./")는 이 sw.js 가 놓인 위치 기준으로 풀린다 —
        // 루트 배포든 /csstudy/ 하위 경로 배포든 항상 옳은 주소가 된다.
        if (request.mode === "navigate") {
          const index =
            (await cache.match(new URL("./index.html", self.location.href).href, opts)) ||
            (await cache.match(new URL("./", self.location.href).href, opts));
          if (index) return index;
        }
        return Response.error();
      }
    })()
  );
});
