import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import {
  categoryLabel,
  experimentFilters,
  experiments,
  type Experiment,
  type ExperimentCategory,
  type ExperimentStatus,
} from '@/data/content'
import { Arrow, Split } from '@/lib/motion'
import SectionHead from './SectionHead'

export function Status({ status }: { status: ExperimentStatus }) {
  const dot =
    status === 'testing' ? (
      <span className="pulse size-1.5 rounded-full bg-ember" />
    ) : status === 'documented' ? (
      <span className="size-1.5 rounded-full bg-paper" />
    ) : (
      <span className="size-1.5 rounded-full border border-paper/45" />
    )
  return (
    <span className="label inline-flex items-center gap-2">
      {dot}
      <span className={status === 'testing' ? 'text-ember' : status === 'queued' ? 'text-mute' : ''}>{status}</span>
    </span>
  )
}

function Rating({ value }: { value: number | null }) {
  if (value === null) return <span className="label text-mute">Pending</span>
  return (
    <span className="inline-flex items-center gap-1" aria-label={`${value} out of 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={`h-2.5 w-[3px] ${i < value ? 'bg-ember' : 'bg-paper/20'}`} />
      ))}
    </span>
  )
}

function Glyph({ e, size = 'sm' }: { e: Experiment; size?: 'sm' | 'lg' }) {
  return (
    <span
      aria-hidden
      className={`relative grid shrink-0 place-items-center overflow-hidden border border-paper/20 font-mono ${
        size === 'lg' ? 'size-full text-[5rem]' : 'size-8 text-[13px]'
      }`}
    >
      {size === 'lg' ? (
        <span className="absolute inset-0 opacity-40 [background:repeating-linear-gradient(0deg,transparent_0_5px,rgb(241_239_232/0.08)_5px_6px)]" />
      ) : null}
      <span className="relative">{e.glyph}</span>
      {size === 'lg' ? <span className="absolute right-3 top-3 size-1.5 bg-ember" /> : null}
    </span>
  )
}

const cols = 'md:grid-cols-[3.5rem_minmax(0,2.6fr)_1.3fr_1fr_0.9fr_0.8fr_1.5rem]'

export default function ExperimentLab() {
  const [filter, setFilter] = useState<'all' | ExperimentCategory>('all')
  const [hover, setHover] = useState<number | null>(null)
  const list = useMemo(
    () => experiments.filter((e) => filter === 'all' || e.category === filter),
    [filter],
  )
  const counts = useMemo(() => {
    const c: Record<string, number> = { all: experiments.length }
    experiments.forEach((e) => (c[e.category] = (c[e.category] ?? 0) + 1))
    return c
  }, [])

  // Sliding indicator under the active filter
  const bar = useRef<HTMLDivElement>(null)
  const btns = useRef<Record<string, HTMLButtonElement | null>>({})
  useLayoutEffect(() => {
    const place = () => {
      const b = btns.current[filter]
      if (b && bar.current) {
        bar.current.style.width = `${b.offsetWidth}px`
        bar.current.style.transform = `translateX(${b.offsetLeft}px)`
      }
    }
    place()
    document.fonts?.ready.then(place)
    window.addEventListener('resize', place)
    return () => window.removeEventListener('resize', place)
  }, [filter])

  // Cursor-following preview card (desktop)
  const card = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    let x = 0,
      y = 0,
      cx = 0,
      cy = 0,
      raf = 0
    const move = (e: PointerEvent) => {
      x = e.clientX
      y = e.clientY
    }
    const loop = () => {
      cx += (x - cx) * 0.14
      cy += (y - cy) * 0.14
      if (card.current) card.current.style.transform = `translate3d(${cx + 28}px, ${cy - 120}px, 0)`
      raf = requestAnimationFrame(loop)
    }
    window.addEventListener('pointermove', move, { passive: true })
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', move)
    }
  }, [])

  const active = hover !== null ? list[hover] : null
  const last = useRef<Experiment | null>(null)
  if (active) last.current = active
  const hovered = active ?? last.current
  const summary = {
    testing: experiments.filter((e) => e.status === 'testing').length,
    queued: experiments.filter((e) => e.status === 'queued').length,
    documented: experiments.filter((e) => e.status === 'documented').length,
  }

  return (
    <section id="experiments" data-theme="dark" className="section-y relative bg-ink">
      <div className="container-x">
        <SectionHead index="02" name="Experiment Lab" aside={`${String(experiments.length).padStart(2, '0')} entries`} />

        <div className="grid grid-cols-12 items-end gap-x-6 gap-y-10">
          <h2 data-reveal data-fit className="display col-span-12 fs-d1">
            <span className="block">
              <Split text="The experiment" />
            </span>
            <span className="block md:pl-[18%]">
              <Split text="lab." start={2} wordClass={() => 'text-ember'} />
            </span>
          </h2>
          <div data-reveal className="col-span-12 md:col-span-7 md:col-start-6 lg:col-span-4 lg:col-start-9">
            <p className="heading fade-up fs-h2 !leading-[1.15]">
              Tools tested. Assumptions challenged. Findings documented.
            </p>
            <div className="label fade-up mt-6 flex flex-wrap gap-x-5 gap-y-2 text-mute" style={{ '--d': '120ms' } as CSSProperties}>
              <span>
                <span className="text-ember">{String(summary.testing).padStart(2, '0')}</span> testing
              </span>
              <span>
                <span className="text-paper">{String(summary.queued).padStart(2, '0')}</span> queued
              </span>
              <span>
                <span className="text-paper">{String(summary.documented).padStart(2, '0')}</span> documented
              </span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div data-reveal className="fade-up relative mt-20 md:mt-28">
          <div className="-mx-[var(--gutter)] overflow-x-auto px-[var(--gutter)] [scrollbar-width:none]">
            <div role="tablist" aria-label="Filter experiments" className="relative flex w-max gap-7 pb-4 md:gap-9">
              {experimentFilters.map((f) => (
                <button
                  key={f.id}
                  ref={(el) => {
                    btns.current[f.id] = el
                  }}
                  role="tab"
                  aria-selected={filter === f.id}
                  onClick={() => {
                    setFilter(f.id)
                    setHover(null)
                  }}
                  className={`label flex items-start gap-1.5 whitespace-nowrap transition-colors duration-300 ${
                    filter === f.id ? 'text-paper' : 'text-mute hover:text-paper'
                  }`}
                >
                  {f.label}
                  <span className={`text-[9px] ${filter === f.id ? 'text-ember' : ''}`}>
                    {String(counts[f.id] ?? 0).padStart(2, '0')}
                  </span>
                </button>
              ))}
              <div
                ref={bar}
                className="absolute bottom-0 left-0 h-px bg-ember transition-[transform,width] duration-700 ease-[var(--ease-expo)]"
              />
            </div>
          </div>
          <div className="h-px bg-paper/15" />
        </div>

        {/* Table */}
        <div role="table" aria-label="Experiments" className="mt-2" onPointerLeave={() => setHover(null)}>
          <div role="row" className={`label hidden py-4 text-mute md:grid ${cols} gap-6`}>
            <span role="columnheader">No.</span>
            <span role="columnheader">Tool</span>
            <span role="columnheader">Category</span>
            <span role="columnheader">Status</span>
            <span role="columnheader">Verdict</span>
            <span role="columnheader">Tested</span>
            <span />
          </div>
          <div key={filter}>
            {list.length === 0 ? (
              <p className="label py-16 text-center text-mute">No experiments in this category yet.</p>
            ) : (
              list.map((e, i) => (
                <a
                  key={e.id}
                  role="row"
                  href={e.href}
                  onPointerEnter={() => setHover(i)}
                  onFocus={() => setHover(i)}
                  onBlur={() => setHover(null)}
                  className={`group relative grid grid-cols-[auto_1fr_auto] items-center gap-x-4 gap-y-2 border-t border-paper/12 py-5 [animation:rowin_0.9s_var(--ease-expo)_both] md:gap-6 md:py-7 ${cols}`}
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <span className="pointer-events-none absolute inset-0 -z-0 origin-left scale-x-0 bg-ink-3 transition-transform duration-700 ease-[var(--ease-expo)] group-hover:scale-x-100 group-focus-visible:scale-x-100" />
                  <span role="cell" className="label relative hidden text-mute md:block">
                    {e.id}
                  </span>
                  <span role="cell" className="relative col-span-2 flex items-center gap-4 md:col-span-1">
                    <Glyph e={e} />
                    <span className="heading fs-h2 transition-transform duration-700 ease-[var(--ease-expo)] group-hover:translate-x-2">
                      {e.name}
                    </span>
                  </span>
                  <span role="cell" className="label relative order-first col-span-3 flex justify-between text-mute md:order-none md:col-span-1 md:block">
                    <span>{categoryLabel[e.category]}</span>
                    <span className="md:hidden">{e.id}</span>
                  </span>
                  <span role="cell" className="relative">
                    <Status status={e.status} />
                  </span>
                  <span role="cell" className="relative">
                    <Rating value={e.rating} />
                  </span>
                  <span role="cell" className="label relative text-mute">
                    {e.date ?? '— —'}
                  </span>
                  <span role="cell" className="relative hidden justify-end md:flex">
                    <Arrow className="size-3.5 text-mute transition-all duration-500 group-hover:rotate-45 group-hover:text-ember" />
                  </span>
                  <p className="relative col-span-3 max-w-[52ch] text-[13px] leading-snug text-paper/55 md:hidden">
                    {e.summary}
                  </p>
                </a>
              ))
            )}
            <div className="h-px bg-paper/12" />
          </div>
        </div>

        <p className="label mt-8 text-mute">
          <span className="text-ember">*</span> Full write-ups and verdicts appear here as each review is published.
        </p>
      </div>

      {/* Hover preview */}
      <div
        ref={card}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[80] hidden w-[300px] md:block"
      >
        <div
          className="border border-paper/15 bg-ink-2 transition-[clip-path,opacity] duration-500 ease-[var(--ease-expo)]"
          style={{
            clipPath: active ? 'inset(0 0 0 0)' : 'inset(0 0 100% 0)',
            opacity: active ? 1 : 0,
          }}
        >
          {hovered ? (
            <>
              <div className="aspect-[4/3] w-full">
                <Glyph e={hovered} size="lg" />
              </div>
              <div className="p-5">
                <div className="label flex justify-between text-mute">
                  <span>EXP—{hovered.id}</span>
                  <span>{categoryLabel[hovered.category]}</span>
                </div>
                <p className="mt-3 text-[13px] leading-snug text-paper/75">{hovered.summary}</p>
                <div className="label mt-4 flex items-center gap-2 text-ember">
                  Detailed review <Arrow className="size-2.5" />
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </section>
  )
}
