// =============================================================
// Sound — Web Audio API (설치 없이 즉시 사운드)
// =============================================================

type SoundType = 'correct' | 'wrong' | 'click' | 'levelup' | 'achievement'

let ctx: AudioContext | null = null

function ensure(): AudioContext {
  if (!ctx) ctx = new AudioContext()
  return ctx
}

export function initAudio() {
  const c = ensure()
  if (c.state === 'suspended') c.resume()
}

export function playSound(type: SoundType) {
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
