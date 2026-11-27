import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { events, projects } from '@/data/content'
import { Arrow, Split } from '@/lib/motion'
import { onScroll, scrollToTarget } from '@/lib/scroll'
import SectionHead from './SectionHead'

/**
 * The event log. Builds live in "Things I've built" — each entry here only
 * carries the context (team, result, learning) and points to its build.
 */
export default function Hackathons() {
  const list = useRef<HTMLOListElement>(null)
  const fill = useRef<HTMLDivElement>(null)
  const [current, setCurrent] = useState(0)

  useEffect(
    () =>
      onScroll(() => {
        const el = list.current
        if (!el) return
        const r = el.getBoundingClientRect()
        const mid = window.innerHeight * 0.55
        const p = Math.min(1, Math.max(0, (mid - r.top) / r.height))
        if (fill.current) fill.current.style.transform = `scaleY(${p})`
        const items = [...el.querySelectorAll<HTMLElement>('[data-entry]')]
        let idx = 0
        items.forEach((it, i) => {
          const on = it.getBoundingClientRect().top < mid
          it.dataset.on = String(on)
          if (on) idx = i
        })
        setCurrent(idx)
      }),
    [],
  )

  return (
    <section id="events" data-theme="dark" className="section-y relative border-t border-paper/10 bg-ink">
      <div className="container-x">
        <SectionHead index="04" name="Event log" aside="Hackathons · competitions · collaborations" />
        <div className="grid grid-cols-12 items-end gap-x-6 gap-y-8">
          <h2 data-reveal data-fit className="display fs-d1 col-span-12 lg:col-span-8">
            <span className="block">
              <Split text="Built under" />
            </span>
            <span className="block text-ember md:pl-[14%]">
              <Split text="pressure." start={2} />
            </span>
          </h2>
          <p className="fs-lead col-span-12 max-w-[36ch] text-paper/60 md:col-span-7 lg:col-span-4 lg:pb-3">
            The context behind the builds: who I built with, what the clock allowed and what I took away. The
            projects themselves live in <span className="text-paper">Things I've built</span>.
          </p>
        </div>

        <div className="mt-20 grid grid-cols-12 gap-x-6 md:mt-28">
          <div className="col-span-12 hidden lg:col-span-3 lg:block">
            <div className="label sticky top-28 flex items-center gap-4">
              <span className="tabular-nums">
                <span className="text-ember">{String(current + 1).padStart(2, '0')}</span>
                <span className="text-mute"> / {String(events.length).padStart(2, '0')}</span>
              </span>
              <span className="h-px w-12 bg-paper/20" />
              <span className="text-mute">Entries</span>
            </div>
          </div>

          <ol ref={list} className="relative col-span-12 lg:col-span-8 lg:col-start-5">
            <div className="absolute bottom-0 left-[5px] top-0 w-px bg-paper/12" />
            <div ref={fill} className="absolute bottom-0 left-[5px] top-0 w-px origin-top scale-y-0 bg-ember" />
            {events.map((e, i) => {
              const build = e.project ? projects.find((p) => p.no === e.project) : null
              return (
                <li key={i} data-entry data-on="false" className="timeline-entry relative pb-16 pl-10 last:pb-0 md:pb-20 md:pl-14">
                  <span className="timeline-dot absolute left-0 top-1.5 size-[11px] rounded-full border border-paper/40 bg-ink" />
                  <div data-reveal>
                    <div className="label fade-up flex flex-wrap gap-x-4 gap-y-1 text-mute">
                      <span className="text-paper/80">{e.kind}</span>
                      <span>{e.date}</span>
                      <span>{e.location}</span>
                    </div>
                    <h3 className="heading fade-up mt-4 fs-h1" style={{ '--d': '80ms' } as CSSProperties}>
                      {e.name}
                    </h3>
                    <dl
                      className="fade-up mt-7 grid grid-cols-1 gap-x-8 gap-y-5 border-t border-paper/12 pt-6 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]"
                      style={{ '--d': '160ms' } as CSSProperties}
                    >
                      <div>
                        <dt className="label text-mute">Team</dt>
                        <dd className="mt-2 text-[14px] text-paper/80">{e.team}</dd>
                      </div>
                      <div>
                        <dt className="label text-mute">Key learning</dt>
                        <dd className="mt-2 text-[14px] text-paper/80">{e.learning}</dd>
                      </div>
                      <div>
                        <dt className="label text-mute">Result</dt>
                        <dd className="mt-2 text-[14px] text-paper/80">{e.result ?? 'No result recorded yet'}</dd>
                      </div>
                    </dl>
                    {build ? (
                      <a
                        href={`#project-${build.no}`}
                        onClick={(ev) => {
                          ev.preventDefault()
                          scrollToTarget(`project-${build.no}`)
                        }}
                        className="group fade-up mt-7 flex items-center justify-between gap-4 border border-paper/15 p-3 pr-4 transition-colors hover:border-ember"
                        style={{ '--d': '220ms' } as CSSProperties}
                      >
                        <span className="flex min-w-0 items-center gap-4">
                          <img src={build.image} alt="" className="size-12 shrink-0 object-cover" loading="lazy" />
                          <span className="min-w-0">
                            <span className="label block text-mute">What we built</span>
                            <span className="heading mt-1 block truncate text-[1.05rem]">
                              {build.title}
                              <span className="text-paper/35">/{build.no}</span>
                            </span>
                          </span>
                        </span>
                        <span className="label flex shrink-0 items-center gap-2 text-ember">
                          <span className="hidden sm:inline">View build</span>
                          <Arrow dir="up" className="size-2.5 transition-transform group-hover:-translate-y-0.5" />
                        </span>
                      </a>
                    ) : null}
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
        <p className="label mt-20 text-mute">
          <span className="text-ember">*</span> Results are added once they are announced.
        </p>
      </div>
    </section>
  )
}
