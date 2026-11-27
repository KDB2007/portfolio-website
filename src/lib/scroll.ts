import Lenis from 'lenis'

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

let lenis: Lenis | null = null

export function initScroll() {
  if (lenis || prefersReducedMotion()) return lenis
  lenis = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 4), touchMultiplier: 1.4 })
  const raf = (time: number) => {
    lenis?.raf(time)
    requestAnimationFrame(raf)
  }
  requestAnimationFrame(raf)
  return lenis
}

export function scrollToTarget(target: string | number, immediate = false) {
  const el = typeof target === 'string' ? (target === 'top' ? 0 : document.getElementById(target)) : target
  if (el === null) return
  if (lenis) {
    lenis.scrollTo(el as HTMLElement | number, immediate ? { immediate: true, force: true } : { duration: 1.6 })
  } else if (typeof el === 'number') {
    window.scrollTo({ top: el })
  } else {
    el.scrollIntoView()
  }
}

export function lockScroll(locked: boolean) {
  if (lenis) locked ? lenis.stop() : lenis.start()
  document.documentElement.style.overflow = locked ? 'hidden' : ''
}

/** Subscribe to scroll with rAF batching. Returns an unsubscribe. */
export function onScroll(cb: () => void) {
  let frame = 0
  const handler = () => {
    if (frame) return
    frame = requestAnimationFrame(() => {
      frame = 0
      cb()
    })
  }
  window.addEventListener('scroll', handler, { passive: true })
  window.addEventListener('resize', handler)
  cb()
  return () => {
    cancelAnimationFrame(frame)
    window.removeEventListener('scroll', handler)
    window.removeEventListener('resize', handler)
  }
}
