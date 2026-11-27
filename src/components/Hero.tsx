import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { site } from '@/data/content'
import { Arrow, Magnetic, Split } from '@/lib/motion'
import { onScroll, prefersReducedMotion, scrollToTarget } from '@/lib/scroll'
import type { SpecimenMode } from './HeroSculpture'
import { openTerminal, StatusDot } from './Nav'

const HeroSculpture = lazy(() => import('./HeroSculpture'))

const WORD = 'KISHAN'

const MODES: { id: SpecimenMode; label: string; line: string }[] = [
  { id: 'explore', label: 'Explore', line: 'Pull it apart. See what it is made of.' },
  { id: 'build', label: 'Build', line: 'Put the pieces back until it holds.' },
  { id: 'test', label: 'Test', line: 'Apply stress. Watch where it fails.' },
  { id: 'document', label: 'Document', line: 'Strip it to wireframe. Write it down.' },
]
const CYCLE_MS = 5200

/**
 * Monumental wordmark in normal flow (so nothing can ever sit on top of it),
 * drawn twice: solid beneath the 3D canvas and as a hairline outline above it,
 * so the sculpture appears to pass through the letters.
 * Desktop: fits the width along the bottom edge. Mobile: vertical, fits the height.
 */
function HeroWord({ ready }: { ready: boolean }) {
  const box = useRef<HTMLDivElement>(null)
  const meas = useRef<HTMLSpanElement>(null)
  const layers = useRef<HTMLSpanElement[]>([])
  const [fs, setFs] = useState(0)
  const [vertical, setVertical] = useState(false)

  useLayoutEffect(() => {
    const fit = () => {
      const v = window.innerWidth < 768
      const el = meas.current
      const b = box.current
      if (!el || !b) return
      const len = el.getBoundingClientRect().width // measured at 100px
      const target = v ? Math.max(window.innerHeight, 640) - 96 - 24 : b.clientWidth
      setVertical(v)
      setFs(Math.floor((100 * target) / len))
    }
    fit()
    document.fonts?.ready.then(fit)
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [])

  useEffect(
    () =>
      onScroll(() => {
        const p = Math.min(1, window.scrollY / window.innerHeight)
        layers.current.forEach((l) => (l.style.translate = vertical ? `0 ${p * -8}vh` : `0 ${p * 18}vh`))
      }),
    [vertical],
  )

  const style: CSSProperties = {
    fontSize: fs || 100,
    writingMode: vertical ? 'vertical-rl' : undefined,
    rotate: vertical ? '180deg' : undefined,
    visibility: fs ? 'visible' : 'hidden',
  }

  const letters = (outline: boolean) => (
    <span
      ref={(el) => {
        if (el) layers.current[outline ? 1 : 0] = el
      }}
      aria-hidden
      className={`display block whitespace-nowrap !leading-[0.8] ${
        outline ? 'outline-text absolute inset-0 z-[3]' : 'relative z-[1] text-paper'
      } ${ready ? 'is-in' : ''}`}
      style={style}
    >
      {WORD.split('').map((ch, i) => (
        <span key={i} className="word !mb-0 !pb-0">
          <span style={{ '--i': 0, '--d': `${180 + i * 75}ms`, transitionDuration: '1.7s' } as CSSProperties}>{ch}</span>
        </span>
      ))}
    </span>
  )

  return (
    <div className="pointer-events-none relative shrink-0 pb-5 pl-[var(--gutter)] pt-24 md:order-last md:px-[var(--gutter)] md:pb-0 md:pt-0">
      <span ref={meas} aria-hidden className="display invisible absolute left-0 top-0 whitespace-nowrap" style={{ fontSize: 100 }}>
        {WORD}
      </span>
      <div ref={box} className="relative" style={{ marginBottom: vertical || !fs ? 0 : -fs * 0.1 }}>
        {letters(false)}
        {letters(true)}
      </div>
    </div>
  )
}

function Specimen({
  mode,
  onPick,
  auto,
  statsRef,
  compact = false,
}: {
  mode: SpecimenMode
  onPick: (m: SpecimenMode) => void
  auto: boolean
  statsRef: (el: HTMLElement | null) => void
  compact?: boolean
}) {
  const active = MODES.find((m) => m.id === mode)!
  if (compact) {
    return (
      <div className="w-full max-w-md">
        <div className="label flex items-center justify-between text-mute">
          <span>[ Specimen 01 ] Tap a mode</span>
        </div>
        <div role="radiogroup" aria-label="Specimen mode" className="mt-3 grid grid-cols-4 border border-paper/15">
          {MODES.map((m) => (
            <button
              key={m.id}
              role="radio"
              aria-checked={mode === m.id}
              onClick={() => onPick(m.id)}
              className={`label relative overflow-hidden border-l border-paper/15 py-2.5 !text-[10px] first:border-l-0 ${
                mode === m.id ? 'bg-paper text-ink' : 'text-paper/70'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
        <p className="label mt-3 normal-case tracking-normal text-paper/60" aria-live="polite">
          {active.line}
        </p>
      </div>
    )
  }
  return (
    <div className="w-full max-w-[15.5rem] border border-paper/12 bg-ink/40 p-4">
      <div className="label flex items-center justify-between">
        <span className="text-mute">[ Specimen 01 ]</span>
        <span className="flex items-center gap-2 text-ember">
          <StatusDot /> Live
        </span>
      </div>
      <div role="radiogroup" aria-label="Specimen mode" className="mt-4 border-t border-paper/12">
        {MODES.map((m, i) => {
          const on = mode === m.id
          return (
            <button
              key={m.id}
              role="radio"
              aria-checked={on}
              onClick={() => onPick(m.id)}
              className={`group label relative flex w-full items-center justify-between border-b border-paper/12 py-2.5 text-left transition-colors ${
                on ? 'text-paper' : 'text-mute hover:text-paper'
              }`}
            >
              <span className="flex items-center gap-3">
                <span className={on ? 'text-ember' : ''}>0{i + 1}</span>
                {m.label}
              </span>
              <span className={`size-1.5 transition-colors ${on ? 'bg-ember' : 'bg-paper/15 group-hover:bg-paper/40'}`} />
              {on && auto ? (
                <span
                  key={`${m.id}-bar`}
                  className="absolute bottom-[-1px] left-0 h-px w-full origin-left bg-ember"
                  style={{ animation: `specimenbar ${CYCLE_MS}ms linear both` }}
                />
              ) : null}
            </button>
          )
        })}
      </div>
      <p className="mt-4 min-h-[2.6em] text-[13px] leading-snug text-paper/75" aria-live="polite">
        {active.line}
      </p>
      <dl ref={statsRef} className="label mt-4 grid grid-cols-2 gap-x-4 gap-y-1.5 border-t border-paper/12 pt-3 text-mute">
        {['Rot', 'Open', 'Heat', 'FPS'].map((k) => (
          <div key={k} className="flex justify-between">
            <dt>{k}</dt>
            <dd data-stat className="tabular-nums text-paper">
              —
            </dd>
          </div>
        ))}
      </dl>
      <div className="label mt-3 text-mute">Drag the object to spin it</div>
    </div>
  )
}

export default function Hero({ ready }: { ready: boolean }) {
  const content = useRef<HTMLDivElement>(null)
  const [mode, setMode] = useState<SpecimenMode>('explore')
  const [auto, setAuto] = useState(true)
  const modeRef = useRef<SpecimenMode>(mode)
  modeRef.current = mode
  const statsRef = useRef<HTMLElement[]>([])
  const stage = useRef<HTMLDivElement>(null)

  useEffect(
    () =>
      onScroll(() => {
        const el = content.current
        if (!el) return
        const p = Math.min(1, window.scrollY / (window.innerHeight * 0.8))
        el.style.opacity = String(1 - p * 1.1)
        el.style.translate = `0 ${-p * 60}px`
      }),
    [],
  )

  // Self-demo: cycle modes until the visitor picks one
  useEffect(() => {
    if (!ready || !auto || prefersReducedMotion()) return
    const id = window.setInterval(() => {
      if (window.scrollY > window.innerHeight) return
      setMode((m) => MODES[(MODES.findIndex((x) => x.id === m) + 1) % MODES.length].id)
    }, CYCLE_MS)
    return () => window.clearInterval(id)
  }, [ready, auto])

  const pick = (m: SpecimenMode) => {
    setAuto(false)
    setMode(m)
  }
  const statRef = (i: number) => (el: HTMLElement | null) => {
    if (el) statsRef.current[i] = el
  }

  return (
    <section id="top" data-theme="dark" className="relative flex min-h-[100svh] overflow-hidden bg-ink md:min-h-[max(100svh,680px)] md:flex-col">
      <h1 className="sr-only">Kishan D Belavadi — first-year engineering student in Bengaluru who tests AI tools and builds with the ones that work</h1>

      <div className="absolute inset-0 z-[2]">
        <Suspense fallback={null}>
          <HeroSculpture ready={ready} modeRef={modeRef} statsRef={statsRef} stageRef={stage} />
        </Suspense>
      </div>

      <HeroWord ready={ready} />

      <div
        ref={content}
        data-hero-content
        className={`relative z-[4] flex min-w-0 flex-1 flex-col pb-8 pl-4 pr-[var(--gutter)] pt-20 md:px-[var(--gutter)] md:pb-8 md:pt-28 ${ready ? 'is-in' : ''}`}
      >
        {/* Technical header row */}
        <div className="grid grid-cols-12 gap-x-6 gap-y-3">
          <div className="label fade-up col-span-12 hidden text-mute md:col-span-3 md:block" style={{ '--d': '700ms' } as CSSProperties}>
            N°00 — Index
          </div>
          <p className="label fade-up col-span-12 md:col-span-6" style={{ '--d': '780ms' } as CSSProperties}>
            Independent builder <span className="text-ember">/</span> Engineering student{' '}
            <span className="text-ember">/</span> Open-source explorer
          </p>
          <div
            className="label fade-up col-span-12 flex items-center gap-2.5 md:col-span-3 md:justify-end"
            style={{ '--d': '860ms' } as CSSProperties}
          >
            <StatusDot /> {site.availability}
          </div>
          <div className="rule col-span-12 hidden h-px bg-paper/15 md:block" style={{ '--d': '600ms' } as CSSProperties} />
        </div>

        {/* Three zones that never share space: copy · sculpture stage · specimen controls */}
        <div className="mt-6 grid flex-1 grid-cols-12 grid-rows-[minmax(190px,1fr)_auto] gap-x-6 gap-y-8 md:mt-[clamp(1.5rem,5vh,4rem)] md:grid-rows-1">
          <div ref={stage} aria-hidden className="col-span-12 md:order-2 md:col-span-5 md:min-h-[340px] lg:col-span-4" />

          <div className="col-span-12 flex flex-col justify-end md:order-1 md:col-span-7 md:justify-center lg:col-span-5">
            <h2 className="heading fs-h1">
              <span className="block">
                <Split text="Curious by default." delay={850} />
              </span>
              <span className="block italic text-paper/45">
                <Split text="Experimental by nature." delay={850} start={3} />
              </span>
            </h2>
            <p
              className="fade-up mt-5 max-w-[40ch] text-[14px] leading-relaxed text-paper/60 md:mt-7 md:text-[15px]"
              style={{ '--d': '1150ms' } as CSSProperties}
            >
              I explore technology by building with it, testing tools, questioning assumptions and documenting what I
              discover.
            </p>
            <div
              className="fade-up mt-7 flex flex-col items-start gap-5 xs:flex-row xs:items-center md:mt-9 md:gap-8"
              style={{ '--d': '1250ms' } as CSSProperties}
            >
              <Magnetic>
                <a
                  href="#experiments"
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToTarget('experiments')
                  }}
                  className="group label flex h-12 items-center gap-4 bg-ember px-5 !text-[11px] text-ink transition-colors hover:bg-paper md:h-14 md:px-6"
                >
                  <span className="roll">
                    <span>Explore my work</span>
                    <span aria-hidden>Explore my work</span>
                  </span>
                  <Arrow dir="down" className="size-3 transition-transform duration-500 group-hover:translate-y-0.5" />
                </a>
              </Magnetic>
              <a
                href="#about"
                onClick={(e) => {
                  e.preventDefault()
                  scrollToTarget('about')
                }}
                className="group label relative flex items-center gap-3 py-2 !text-[11px]"
              >
                <span className="roll">
                  <span>About me</span>
                  <span aria-hidden className="text-ember">
                    About me
                  </span>
                </span>
                <span className="absolute bottom-0 left-0 h-px w-full origin-right bg-paper/30 transition-transform duration-700 ease-[var(--ease-expo)] group-hover:scale-x-0" />
              </a>
            </div>

            <div className="fade-up mt-9 lg:hidden" style={{ '--d': '1400ms' } as CSSProperties}>
              <Specimen mode={mode} onPick={pick} auto={auto} statsRef={statRef(1)} compact />
            </div>
          </div>

          <div
            className="fade-up hidden lg:order-3 lg:col-span-3 lg:flex lg:items-center lg:justify-end"
            style={{ '--d': '1500ms' } as CSSProperties}
          >
            <Specimen mode={mode} onPick={pick} auto={auto} statsRef={statRef(0)} />
          </div>
        </div>

        {/* Bottom rail — terminal invitation + scroll cue, sitting above the wordmark */}
        <div
          className="fade-up mt-8 flex items-center justify-between gap-6 md:mt-10"
          style={{ '--d': '1600ms' } as CSSProperties}
        >
          <button onClick={openTerminal} className="group label flex items-center gap-3 text-left">
            <span className="grid h-7 place-items-center border border-paper/25 px-2 text-paper transition-colors group-hover:border-ember group-hover:text-ember">
              <span className="hidden md:inline">`</span>
              <span className="md:hidden">&gt;_</span>
            </span>
            <span className="text-mute transition-colors group-hover:text-paper">
              <span className="hidden md:inline">Press backtick to open the lab terminal</span>
              <span className="md:hidden">Open the lab terminal</span>
            </span>
          </button>
          <div className="hidden items-center gap-3 md:flex">
            <span className="label text-mute">Scroll to explore</span>
            <span className="relative block h-px w-12 overflow-hidden bg-paper/15">
              <span className="absolute inset-y-0 left-0 w-1/2 bg-ember [animation:scrollcue_2.2s_var(--ease-quart)_infinite]" />
            </span>
          </div>
        </div>
      </div>

    </section>
  )
}
