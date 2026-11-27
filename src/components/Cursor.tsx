import { useEffect, useRef, useState } from 'react'

/**
 * Contextual cursor. The dot tracks 1:1 so precision never suffers; the ring
 * trails and morphs. Elements opt in with data-cursor="view|link|text" and an
 * optional data-cursor-label.
 */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<{ mode: string; label: string; theme: string }>({
    mode: 'idle',
    label: '',
    theme: 'dark',
  })
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    if (!fine) return
    setEnabled(true)
    document.documentElement.classList.add('has-cursor')
    let x = -100,
      y = -100,
      rx = -100,
      ry = -100,
      raf = 0,
      visible = false

    const loop = () => {
      rx += (x - rx) * 0.16
      ry += (y - ry) * 0.16
      if (dot.current) dot.current.style.transform = `translate3d(${x}px, ${y}px, 0)`
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    const move = (e: PointerEvent) => {
      x = e.clientX
      y = e.clientY
      if (!visible) {
        visible = true
        rx = x
        ry = y
        document.documentElement.classList.add('cursor-on')
      }
      const t = (e.target as HTMLElement | null)?.closest<HTMLElement>(
        '[data-cursor], a, button, input, textarea, [role="button"]',
      )
      let mode = 'idle',
        label = ''
      if (t) {
        mode = t.dataset.cursor ?? (t.matches('input, textarea') ? 'text' : 'link')
        label = t.dataset.cursorLabel ?? ''
      }
      const theme = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-theme]')?.dataset.theme ?? 'dark'
      setState((s) => (s.mode === mode && s.label === label && s.theme === theme ? s : { mode, label, theme }))
    }
    const leave = () => {
      visible = false
      document.documentElement.classList.remove('cursor-on')
    }
    const down = () => ring.current?.classList.add('is-down')
    const up = () => ring.current?.classList.remove('is-down')
    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerleave', leave)
    window.addEventListener('pointerdown', down)
    window.addEventListener('pointerup', up)
    return () => {
      cancelAnimationFrame(raf)
      document.documentElement.classList.remove('has-cursor', 'cursor-on')
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerleave', leave)
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
    }
  }, [])

  if (!enabled) return null
  const { mode, label, theme } = state
  return (
    <div aria-hidden className="cursor pointer-events-none fixed inset-0 z-[200]" data-mode={mode} data-theme-cursor={theme}>
      <div ref={ring} className="cursor-ring fixed left-0 top-0">
        <div className="cursor-ring-inner">
          <span className="label !text-[10px] !tracking-[0.12em]">{label}</span>
        </div>
      </div>
      <div ref={dot} className="cursor-dot fixed left-0 top-0" />
    </div>
  )
}
