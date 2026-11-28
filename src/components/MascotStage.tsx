// =============================================================
// MascotStage — 홈 맨 위의 살아 있는 3D 고양이
//
// 고양이 본체는 mascot.html(별도 페이지)이고 여기선 iframe 으로 띄우기만 한다.
// 왜 iframe?
// - three.js 가 앱 본 번들에 섞이지 않는다 → 다른 탭 첫 로딩이 느려지지 않는다.
// - 원래 다른 앱(WebView)용으로 만든 고양이 코드를 거의 그대로 쓸 수 있다.
// 탭하면 움찔, 끌면 고개 돌림, 길게 누르면 쓰다듬기 — 전부 iframe 안에서 처리한다.
// 화면이 가려지면(visibilitychange) iframe 이 스스로 멈추고, 홈 탭을 떠나면 언마운트돼 사라진다.
// 로딩 중엔 투명하게 비어 있다가 고양이가 그려지면 나타난다 (별도 대체 이미지 없음).
// =============================================================

export function MascotStage() {
  return (
    <iframe
      src={`${import.meta.env.BASE_URL}mascot.html`}
      title="마스코트 고양이 — 눌러 보거나 길게 눌러 쓰다듬어 보세요"
      // 장식이라 키보드 탭 순서에선 뺀다 (손가락으로만 노는 공간)
      tabIndex={-1}
      className="block h-[180px] w-full border-0 bg-transparent"
    />
  );
}
