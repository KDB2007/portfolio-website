import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { projects, type Project } from '@/data/content'
import { Arrow, Split } from '@/lib/motion'
import { lockScroll, onScroll, scrollToTarget } from '@/lib/scroll'
import SectionHead from './SectionHead'

function Media({ p, aspect, onOpen }: { p: Project; aspect: string; onOpen: (p: Project) => void }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(p)}
      data-cursor="view"
      data-cursor-label="Case study"
      aria-label={`Open project: project ${p.no}`}
      style={p.imageBg ? { backgroundColor: p.imageBg } : undefined}
      className={`project-media group relative block w-full overflow-hidden bg-ink-2 text-left ${aspect}`}
    >
      <div className="project-media-frame absolute inset-0 overflow-hidden">
        <img
          src={p.image}
          alt={p.imageAlt}
          loading="lazy"
          data-parallax
          className={`project-img absolute inset-x-0 -top-[8%] h-[116%] w-full ${p.fit === 'contain' ? 'object-contain p-[8%]' : 'object-cover'}`}
        />
      </div>
      <span className="label absolute bottom-4 left-4 flex translate-y-3 items-center gap-2 bg-ink px-2.5 py-1.5 text-paper opacity-0 transition-all duration-500 ease-[var(--ease-expo)] group-hover:translate-y-0 group-hover:opacity-100 md:bottom-6 md:left-6">
        <span className="size-1.5 bg-ember" /> Open case study
      </span>
    </button>
  )
}

function Details({ p, wide = false, onOpen }: { p: Project; wide?: boolean; onOpen: (p: Project) => void }) {
  return (
    <div className={wide ? 'grid gap-8 md:grid-cols-12 md:gap-6' : ''}>
      <div className={wide ? 'md:col-span-5' : ''}>
        <div className="label fade-up flex items-center gap-3 text-mute">
          <span className="text-ember">{p.no}</span>
          <span className="h-px w-6 bg-paper/25" />
          <span>{p.kind}</span>
        </div>
        {p.event ? (
          <a
            href="#events"
            onClick={(e) => {
              e.preventDefault()
              scrollToTarget('events')
            }}
            className="group label fade-up mt-4 inline-flex items-center gap-2 border border-paper/15 px-2.5 py-1.5 text-paper/80 transition-colors hover:border-ember hover:text-ember"
            style={{ '--d': '40ms' } as CSSProperties}
          >
            <span className="size-1.5 bg-ember" />
            Built at {p.event.name} · {p.event.date}
            <Arrow dir="down" className="size-2.5 transition-transform group-hover:translate-y-0.5" />
          </a>
        ) : null}
        <h3 className="heading fade-up mt-5 fs-h1" style={{ '--d': '80ms' } as CSSProperties}>
          {p.title}
          <span className="text-paper/30">/{p.no}</span>
        </h3>
      </div>
      <div className={wide ? 'md:col-span-4 md:col-start-7 md:pt-8' : ''}>
        <p
          className="fade-up mt-5 max-w-[42ch] text-[14px] leading-relaxed text-paper/60 md:text-[15px]"
          style={{ '--d': '140ms' } as CSSProperties}
        >
          {p.summary}
        </p>
        <ul className="fade-up mt-6 flex flex-wrap gap-2" style={{ '--d': '200ms' } as CSSProperties}>
          {p.stack.map((s) => (
            <li key={s} className="label border border-paper/20 px-2.5 py-1 text-paper/70">
              {s}
            </li>
          ))}
        </ul>
      </div>
      <div className={wide ? 'md:col-span-2 md:col-start-11 md:pt-8' : ''}>
        <ul
          className={`fade-up label mt-8 flex gap-x-6 gap-y-3 ${wide ? 'flex-wrap md:mt-5 md:flex-col' : 'flex-wrap'}`}
          style={{ '--d': '260ms' } as CSSProperties}
        >
          <li>
            {p.github ? (
              <a href={p.github} className="group flex items-center gap-1.5 hover:text-ember">
                GitHub <Arrow className="size-2.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            ) : (
              <span className="text-mute line-through decoration-paper/30">GitHub</span>
            )}
          </li>
          <li>
            {p.demo ? (
              <a href={p.demo} className="group flex items-center gap-1.5 hover:text-ember">
                Live demo <Arrow className="size-2.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            ) : (
              <span className="text-mute line-through decoration-paper/30">Live demo</span>
            )}
          </li>
          <li>
            <button type="button" onClick={() => onOpen(p)} className="group flex items-center gap-1.5 text-ember">
              Case study <Arrow dir="e" className="size-2.5 transition-transform group-hover:translate-x-1" />
            </button>
          </li>
        </ul>
      </div>
    </div>
  )
}

function BigNumber({ no, className = '' }: { no: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={`display outline-text pointer-events-none absolute z-[2] text-[clamp(5rem,13vw,15rem)] ${className}`}
    >
      {no}
    </span>
  )
}

function CaseStudyDialog({ p, onClose }: { p: Project; onClose: () => void }) {
  const closeBtn = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null
    lockScroll(true)
    closeBtn.current?.focus()
    const key = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', key)
    return () => {
      window.removeEventListener('keydown', key)
      lockScroll(false)
      prev?.focus?.()
    }
  }, [onClose])

  const { study: s } = p
  const h = 'label mb-4 flex items-center gap-3 text-mute'
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${p.title} case study`}
      className="fixed inset-0 z-[90] flex justify-end bg-ink/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        data-lenis-prevent
        onClick={(e) => e.stopPropagation()}
        className="h-full w-full overflow-y-auto overscroll-contain bg-ink px-6 pb-20 pt-6 md:w-[min(52rem,90vw)] md:px-12"
      >
        <div className="flex items-center justify-between">
          <span className="label text-mute">
            <span className="text-ember">{p.no}</span> · Case study
          </span>
          <button ref={closeBtn} type="button" onClick={onClose} className="label border border-paper/20 px-3 py-2 hover:border-ember hover:text-ember">
            Close · Esc
          </button>
        </div>

        <h3 className="display mt-10 fs-h1">{p.title}</h3>
        <p className="mt-4 max-w-[52ch] text-paper/70">{p.summary}</p>
        <ul className="mt-6 flex flex-wrap gap-2">
          {p.stack.map((t) => (
            <li key={t} className="label border border-paper/20 px-2.5 py-1 text-paper/70">
              {t}
            </li>
          ))}
        </ul>
        <p className="label mt-6 text-mute">Role · {p.role}</p>

        <section className="mt-12">
          <h4 className={h}><span className="text-ember">01</span> Problem</h4>
          <p className="max-w-[62ch] leading-relaxed text-paper/80">{s.problem}</p>
        </section>

        <section className="mt-12">
          <h4 className={h}><span className="text-ember">02</span> Solution</h4>
          <p className="max-w-[62ch] leading-relaxed text-paper/80">{s.solution.intro}</p>
          <ul className="mt-5 border-t border-paper/12">
            {s.solution.points.map((pt) => (
              <li key={pt.title} className="grid gap-1 border-b border-paper/12 py-4 md:grid-cols-[11rem_1fr] md:gap-6">
                <span className="label text-paper">{pt.title}</span>
                <span className="text-[15px] leading-relaxed text-paper/70">{pt.text}</span>
              </li>
            ))}
          </ul>
          {s.solution.outro ? <p className="mt-5 max-w-[62ch] leading-relaxed text-paper/80">{s.solution.outro}</p> : null}
        </section>

        <section className="mt-12">
          <h4 className={h}><span className="text-ember">03</span> My contribution</h4>
          {s.contribution.map((t) => (
            <p key={t} className="mb-4 max-w-[62ch] leading-relaxed text-paper/80">{t}</p>
          ))}
        </section>

        <section className="mt-12">
          <h4 className={h}><span className="text-ember">04</span> Outcomes and next steps</h4>
          <p className="max-w-[62ch] leading-relaxed text-paper/80">{s.outcome}</p>
        </section>

        <div className="label mt-12 flex flex-wrap gap-6">
          {p.github ? <a href={p.github} className="hover:text-ember">GitHub ↗</a> : null}
          {p.demo ? <a href={p.demo} className="hover:text-ember">{p.demo.includes('youtu') ? 'Demo video' : 'Live demo'} ↗</a> : null}
        </div>
      </div>
    </div>
  )
}

export default function Projects() {
  const root = useRef<HTMLElement>(null)

  useEffect(
    () =>
      onScroll(() => {
        const vh = window.innerHeight
        root.current?.querySelectorAll<HTMLElement>('[data-parallax]').forEach((img) => {
          const r = img.parentElement!.getBoundingClientRect()
          if (r.bottom < 0 || r.top > vh) return
          const off = (r.top + r.height / 2 - vh / 2) / vh
          img.style.translate = `0 ${(off * -7).toFixed(2)}%`
        })
      }),
    [],
  )

  const [a, b, c] = projects
  const [open, setOpen] = useState<Project | null>(null)

  return (
    <section ref={root} id="projects" data-theme="dark" className="section-y relative bg-ink">
      <div className="container-x">
        <SectionHead index="03" name="Selected work" aside={`${String(projects.length).padStart(2, '0')} builds`} />

        <div className="grid grid-cols-12 items-end gap-6">
          <h2 data-reveal data-fit className="display col-span-12 fs-d1 lg:col-span-10">
            <span className="block">
              <Split text="Things" />
            </span>
            <span className="block md:pl-[30%]">
              <Split text="I've built." start={1} wordClass={(_, i) => (i === 1 ? 'text-ember' : undefined)} />
            </span>
          </h2>
          <p data-reveal className="label col-span-12 max-w-xs text-mute lg:col-span-2 lg:pb-3 lg:text-right">
            <span className="fade-up block">Personal projects and hackathon builds. Event context lives in the event log.</span>
          </p>
        </div>

        {/* 01 — media left, details right, bottom aligned */}
        {a ? (
          <article id={`project-${a.no}`} data-reveal className="project-case relative mt-24 grid grid-cols-12 gap-6 md:mt-40">
            <div className="relative col-span-12 md:col-span-8">
              <BigNumber no={a.no} className="-top-[0.42em] right-[-0.08em] md:right-auto md:left-[-0.06em]" />
              <Media onOpen={setOpen} p={a} aspect="aspect-[4/3] md:aspect-[16/11]" />
            </div>
            <div className="col-span-12 self-end md:col-span-4 md:pl-4">
              <Details onOpen={setOpen} p={a} />
            </div>
          </article>
        ) : null}

        {/* 02 — details left-top, media offset right */}
        {b ? (
          <article id={`project-${b.no}`} data-reveal className="project-case relative mt-28 grid grid-cols-12 gap-6 md:mt-56">
            <div className="relative col-span-12 md:col-span-8 md:col-start-5 md:row-start-1">
              <BigNumber no={b.no} className="-bottom-[0.38em] right-[-0.06em]" />
              <Media onOpen={setOpen} p={b} aspect="aspect-[4/3] md:aspect-[16/11]" />
            </div>
            <div className="col-span-12 md:col-span-4 md:col-start-1 md:row-start-1 md:self-end md:pr-4">
              <Details onOpen={setOpen} p={b} />
            </div>
          </article>
        ) : null}

        {/* 03 — same layout and image size as 01 */}
        {c ? (
          <article id={`project-${c.no}`} data-reveal className="project-case relative mt-28 grid grid-cols-12 gap-6 md:mt-56">
            <div className="relative col-span-12 md:col-span-8">
              <BigNumber no={c.no} className="-top-[0.42em] right-[-0.08em] md:right-auto md:left-[-0.06em]" />
              <Media onOpen={setOpen} p={c} aspect="aspect-[4/3] md:aspect-[16/11]" />
            </div>
            <div className="col-span-12 self-end md:col-span-4 md:pl-4">
              <Details onOpen={setOpen} p={c} />
            </div>
          </article>
        ) : null}

        {open ? <CaseStudyDialog p={open} onClose={() => setOpen(null)} /> : null}

        <p className="label mt-20 text-mute">
          <span className="text-ember">*</span> More builds land here as they ship.
        </p>
      </div>
    </section>
  )
}
