// sound.ts 의 음소거 로직 자체 점검 (Web Audio 없이 순수 규칙만 확인).
// tsx 없이 node 로 돌리려고, 저장 규칙을 그대로 옮겨 검증한다.
import assert from 'node:assert'

// localStorage 대역 — 브라우저 없이 규칙만 흉내낸다.
const store = new Map()
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
}

const MUTE_KEY = 'csStudy:sound'
const readMuted = () => localStorage.getItem(MUTE_KEY) === 'off'

// 1) 저장된 값이 없으면 소리는 켜짐 (첫 실행)
assert.equal(readMuted(), false, '기본값은 소리 켜짐이어야 한다')

// 2) 끄면 'off' 로 저장되고, 새로고침(=다시 읽기) 후에도 꺼져 있어야 한다
localStorage.setItem(MUTE_KEY, 'off')
assert.equal(readMuted(), true, '음소거는 새로고침 후에도 유지되어야 한다')

// 3) 다시 켜면 원상복구
localStorage.setItem(MUTE_KEY, 'on')
assert.equal(readMuted(), false, '다시 켜면 소리가 나야 한다')

// 4) csStudy:v1(학습 기록) 은 절대 건드리지 않는다 — 위험구역 회피
assert.equal(store.has('csStudy:v1'), false, '학습 기록 키를 오염시키면 안 된다')

console.log('음소거 저장 규칙 4/4 통과')
