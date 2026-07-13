// =============================================================
// Service Worker — 오프라인 지원 (지하철에서도 동작!)
//
// 전략: "네트워크 우선, 실패하면 캐시" (network-first)
// - 인터넷이 되면: 항상 최신 버전을 받고, 받은 김에 캐시에 복사해둔다.
// - 인터넷이 안 되면(지하철 터널): 캐시에 복사해둔 걸 꺼내 쓴다.
// 비유: 항상 새 신문을 사되, 못 사는 날엔 어제 신문을 본다.
// =============================================================

const CACHE_NAME = "csstudy-v1";

// 새 SW 가 설치되면 바로 활성화 (기본은 기존 탭 닫힐 때까지 대기)
self.addEventListener("install", () => {
  self.skipWaiting();
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
        cache.put(request, fresh.clone()); // 받은 김에 캐시에 복사
        return fresh;
      } catch {
        // 오프라인! 캐시에서 꺼낸다
        const cached = await cache.match(request);
        if (cached) return cached;
        // SPA 라우팅 대비: 페이지 요청이면 index.html 로
        if (request.mode === "navigate") {
          const index = await cache.match("/index.html");
          if (index) return index;
        }
        return Response.error();
      }
    })()
  );
});
