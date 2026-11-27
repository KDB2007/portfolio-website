import { useEffect, useRef, type ElementType, type ReactNode, type CSSProperties } from 'react'

/** Adds .is-in to [data-reveal] elements once they enter the viewport. */
export function useRevealObserver() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-in')
            io.unobserve(e.target)
          }
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.01 },
    )
    const scan = () => document.querySelectorAll('[data-reveal]:not(.is-in)').forEach((el) => io.observe(el))
    scan()
    const mo = new MutationObserver(scan)
    mo.observe(document.body, { childList: true, subtree: true })
    return () => {
      io.disconnect()
      mo.disconnect()
    }
  }, [])
}

/** Word-masked text that rises in when its reveal container enters. */
export function Split({
  text,
  delay = 0,
  start = 0,
  wordClass,
}: {
  text: string
  delay?: number
  start?: number
  wordClass?: (word: string, i: number) => string | undefined
}) {
  const words = text.split(' ')
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {words.map((w, i) => (
          <span key={i}>
            <span className="word">
              <span
                className={wordClass?.(w, i)}
                style={{ '--i': i + start, '--d': `${delay}ms` } as CSSProperties}
              >
                {w}
              </span>
            </span>
            {i < words.length - 1 ? ' ' : null}
          </span>
        ))}
      </span>
    </>
  )
}

/** Element that eases toward the pointer while hovered. */
export function Magnetic({
  children,
  strength = 0.35,
  className,
  as: Tag = 'div',
}: {
  children: ReactNode
  strength?: number
  className?: string
  as?: ElementType
}) {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || !window.matchMedia('(pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    let tx = 0,
      ty = 0,
      x = 0,
      y = 0
    const loop = () => {
      x += (tx - x) * 0.18
      y += (ty - y) * 0.18
      el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`
      if (Math.abs(tx - x) > 0.05 || Math.abs(ty - y) > 0.05) raf = requestAnimationFrame(loop)
      else raf = 0
    }
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(loop)
    }
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      tx = (e.clientX - (r.left + r.width / 2)) * strength
      ty = (e.clientY - (r.top + r.height / 2)) * strength
      kick()
    }
    const leave = () => {
      tx = 0
      ty = 0
      kick()
    }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
    }
  }, [strength])
  return (
    <Tag ref={ref} className={className} style={{ willChange: 'transform' }}>
      {children}
    </Tag>
  )
}

/** Small arrow used across links. */
export function Arrow({ className = '', dir = 'ne' }: { className?: string; dir?: 'ne' | 'e' | 'up' | 'down' }) {
  const rot = { ne: 0, e: 45, up: -45, down: 135 }[dir]
  return (
    <svg
      viewBox="0 0 12 12"
      className={className}
      style={{ transform: `rotate(${rot}deg)` }}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      aria-hidden
    >
      <path d="M3 9 9 3M4 3h5v5" />
    </svg>
  )
}

/**
 * Display headlines are sized in vw for drama; [data-fit] makes sure no single
 * word ever overflows its column (which would overlap neighbouring content).
 */
export function useFitHeadings() {
  useEffect(() => {
    let frame = 0
    const fit = () => {
      document.querySelectorAll<HTMLElement>('[data-fit]').forEach((el) => {
        el.style.fontSize = ''
        const base = parseFloat(getComputedStyle(el).fontSize)
        // Only real line boxes count — skip the sr-only copy and inline wrappers
        const boxes = [el, ...Array.from(el.querySelectorAll<HTMLElement>(':scope > span'))].filter(
          (b) => !b.classList.contains('sr-only') && getComputedStyle(b).display === 'block' || b === el,
        )
        let ratio = 1
        for (const b of boxes) {
          if (b.clientWidth > 40 && b.scrollWidth > b.clientWidth + 1) ratio = Math.min(ratio, b.clientWidth / b.scrollWidth)
        }
        if (ratio < 1) el.style.fontSize = `${Math.max(24, Math.floor(base * ratio * 0.97))}px`
      })
    }
    const schedule = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(fit)
    }
    schedule()
    document.fonts?.ready.then(schedule)
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', schedule)
    }
  }, [])
}
