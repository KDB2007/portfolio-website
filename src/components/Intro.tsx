import { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from '@/lib/scroll'

/** Cinematic entrance: a calibration counter, then the curtain lifts. */
export default function Intro({ onDone }: { onDone: () => void }) {
  const [count, setCount] = useState(0)
  const [leaving, setLeaving] = useState(false)
  const [gone, setGone] = useState(false)
  const done = useRef(onDone)
  done.current = onDone

  useEffect(() => {
    if (prefersReducedMotion()) {
      setGone(true)
      done.current()
      return
    }
    const start = performance.now()
    const dur = 1500
    let raf = 0
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur)
      const eased = 1 - Math.pow(1 - p, 3)
      setCount(Math.round(eased * 100))
      if (p < 1) raf = requestAnimationFrame(tick)
      else {
        setTimeout(() => {
          setLeaving(true)
          done.current()
          setTimeout(() => setGone(true), 1300)
        }, 180)
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  if (gone) return null
  return (
    <div
      aria-hidden
      className="fixed inset-0 z-[150] bg-ink text-paper"
      style={{
        clipPath: leaving ? 'inset(0 0 100% 0)' : 'inset(0 0 0% 0)',
        transition: 'clip-path 1.15s cubic-bezier(0.76, 0, 0.24, 1)',
      }}
    >
      <div className="container-x flex h-full flex-col justify-between py-6">
        <div className="label flex justify-between text-mute">
          <span>KDB / LAB</span>
          <span>Calibrating instruments</span>
        </div>
        <div className="flex items-end justify-between gap-8">
          <div className="label max-w-56 text-mute">
            Curious by default.
            <br />
            Experimental by nature.
          </div>
          <div className="display text-[clamp(5rem,18vw,16rem)] tabular-nums leading-[0.8]">
            {String(count).padStart(3, '0')}
          </div>
        </div>
        <div className="relative mt-6 h-px w-full bg-paper/10">
          <div className="absolute inset-y-0 left-0 bg-ember" style={{ width: `${count}%` }} />
        </div>
      </div>
    </div>
  )
}
