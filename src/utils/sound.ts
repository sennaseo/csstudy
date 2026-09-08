// =============================================================
// Sound — Web Audio API (설치 없이 즉시 사운드)
//
// 🔇 음소거: 지하철에서도 쓰는 앱이라 소리를 끌 수 있어야 한다.
//   설정은 localStorage 키 "csStudy:sound" 에 따로 저장한다 —
//   학습 기록("csStudy:v1")과 섞지 않아야 스키마가 오염되지 않는다.
//   (비유: 공부 노트와 리모컨 배터리는 서랍을 따로 쓴다.)
// =============================================================

type SoundType = 'correct' | 'wrong' | 'click' | 'levelup' | 'achievement'

const MUTE_KEY = 'csStudy:sound'

/** 사파리 프라이빗 모드 등에서 localStorage 접근이 던질 수 있어 try 로 감싼다. */
function readMuted(): boolean {
  try {
    return localStorage.getItem(MUTE_KEY) === 'off'
  } catch {
    return false
  }
}

let muted = readMuted()

export function isMuted(): boolean {
  return muted
}

/** 음소거를 뒤집고 "지금 음소거인가"를 돌려준다 (버튼이 바로 화면을 갱신할 수 있게). */
export function toggleMute(): boolean {
  muted = !muted
  try {
    localStorage.setItem(MUTE_KEY, muted ? 'off' : 'on')
  } catch {
    // 저장 실패해도 이번 세션 동안은 동작한다
  }
  return muted
}

/** 촉각 피드백 — 미지원 브라우저(데스크탑 등)에서는 조용히 무시된다. */
export function vibrate(pattern: number | number[]) {
  navigator.vibrate?.(pattern)
}

let ctx: AudioContext | null = null

function ensure(): AudioContext {
  if (!ctx) ctx = new AudioContext()
  return ctx
}

export function initAudio() {
  if (muted) return
  const c = ensure()
  if (c.state === 'suspended') c.resume()
}

export function playSound(type: SoundType) {
  if (muted) return
  try {
    const current = ensure()
    const c = current
    const t = c.currentTime

    const make = () => {
      const o = c.createOscillator()
      const g = c.createGain()
      o.connect(g)
      g.connect(c.destination)
      return { o, g }
    }

    switch (type) {
      case 'click': {
        const { o, g } = make()
        o.type = 'sine'
        o.frequency.setValueAtTime(600, t)
        o.frequency.exponentialRampToValueAtTime(800, t + 0.05)
        g.gain.setValueAtTime(0.1, t)
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.08)
        o.start(t)
        o.stop(t + 0.08)
        break
      }
      case 'correct': {
        const { o, g } = make()
        o.type = 'triangle'
        o.frequency.setValueAtTime(523.25, t)
        o.frequency.setValueAtTime(659.25, t + 0.08)
        o.frequency.setValueAtTime(783.99, t + 0.16)
        g.gain.setValueAtTime(0.15, t)
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.35)
        o.start(t)
        o.stop(t + 0.35)
        break
      }
      case 'wrong': {
        const { o, g } = make()
        o.type = 'sawtooth'
        o.frequency.setValueAtTime(180, t)
        o.frequency.exponentialRampToValueAtTime(120, t + 0.2)
        g.gain.setValueAtTime(0.12, t)
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.3)
        o.start(t)
        o.stop(t + 0.3)
        break
      }
      case 'levelup': {
        ;[440, 554, 659, 880].forEach((f, i) => {
          const { o, g } = make()
          const start = t + i * 0.1
          o.type = 'sine'
          o.frequency.setValueAtTime(f, start)
          g.gain.setValueAtTime(0.18, start)
          g.gain.exponentialRampToValueAtTime(0.001, start + 0.22)
          o.start(start)
          o.stop(start + 0.22)
        })
        break
      }
      case 'achievement': {
        ;[523, 659, 784, 1047].forEach((f, i) => {
          const { o, g } = make()
          const start = t + i * 0.1
          o.type = 'sine'
          o.frequency.setValueAtTime(f, start)
          g.gain.setValueAtTime(0.14, start)
          g.gain.exponentialRampToValueAtTime(0.001, start + 0.22)
          o.start(start)
          o.stop(start + 0.22)
        })
        break
      }
    }
  } catch {
    // ignore unsupported / blocked
  }
}
