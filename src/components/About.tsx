import type { CSSProperties } from 'react'
import { site } from '@/data/content'
import { Arrow, Split } from '@/lib/motion'
import SectionHead from './SectionHead'
import SocialIcon from './SocialIcon'

const FACTS = [
  ['Currently', 'First-year engineering undergraduate'],
  ['Based in', site.location],
  ['Does', 'Tests AI tools, builds with the ones that work'],
  ['Open to', 'Internships'],
]

export default function About() {
  return (
    <section id="about" data-theme="light" className="section-y relative bg-paper text-ink">
      <div className="container-x">
        <SectionHead index="06" name="About" aside="Profile" light />

        <h2 data-reveal data-fit className="display fs-d1">
          <span className="block">
            <Split text="An engineer" />
          </span>
          <span className="block md:pl-[22%]">
            <Split text="in progress." start={2} wordClass={(_, i) => (i === 1 ? 'italic' : undefined)} />
          </span>
        </h2>

        <div className="mt-16 grid grid-cols-12 gap-x-6 gap-y-14 md:mt-24">
          <div data-reveal className="col-span-12 lg:col-span-7">
            <p className="fs-h2 fade-up font-medium !leading-[1.3] tracking-[-0.015em]">
              I'm a first-year engineering student in Bengaluru. I put AI tools through real work,
              <span className="text-ink/45">
                {' '}
                write down the verdict, and keep the ones that survive. Then I build with them, in public.
              </span>
            </p>
            <p
              className="fs-lead fade-up mt-8 max-w-[52ch] text-ink/65"
              style={{ '--d': '120ms' } as CSSProperties}
            >
              Right now I'm open to internships where I can do both: test things properly, and ship things people can
              actually use.
            </p>
          </div>

          {/* Spec sheet */}
          <aside data-reveal className="col-span-12 md:col-span-8 lg:col-span-4 lg:col-start-9">
            <div className="fade-up border border-ink/15">
              <div className="label flex items-center justify-between border-b border-ink/15 px-5 py-3 text-ink/55">
                <span>Spec sheet</span>
                <span>KDB</span>
              </div>
              <div className="border-b border-ink/15 px-5 py-5">
                <div className="label flex justify-between text-ink/55">
                  <span>Degree progress</span>
                  <span>
                    <span className="text-ember">01</span>/04
                  </span>
                </div>
                <div className="relative mt-3 grid h-2 grid-cols-4 gap-1">
                  {[0, 1, 2, 3].map((i) => (
                    <span key={i} className={`relative overflow-hidden ${i === 0 ? 'bg-ember' : 'bg-ink/10'}`}>
                      {i === 1 ? (
                        <span className="absolute inset-y-0 left-0 w-1/3 bg-ink/25 [animation:scrollcue_2.6s_var(--ease-quart)_infinite]" />
                      ) : null}
                    </span>
                  ))}
                </div>
                <div className="label mt-3 text-ink/55">Year one · still compiling</div>
              </div>
              <dl>
                {FACTS.map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[6.5rem_1fr] gap-4 border-b border-ink/15 px-5 py-4 last:border-b-0">
                    <dt className="label pt-0.5 text-ink/50">{k}</dt>
                    <dd className="text-[15px] font-medium leading-snug">
                      {k === 'Open to' ? (
                        <span className="flex items-center gap-2">
                          <span className="pulse size-1.5 rounded-full bg-ember" />
                          {v}
                        </span>
                      ) : (
                        v
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </aside>
        </div>

        <ul data-reveal className="mt-20 md:mt-24">
          {site.socials.map((s, i) => (
            <li key={s.id} className="fade-up" style={{ '--d': `${i * 80}ms` } as CSSProperties}>
              <a
                href={s.href}
                className="group relative flex items-center justify-between overflow-hidden border-t border-ink/15 py-6 md:py-8"
              >
                <span className="absolute inset-0 origin-bottom scale-y-0 bg-ink transition-transform duration-700 ease-[var(--ease-expo)] group-hover:scale-y-100" />
                <span className="relative flex items-baseline gap-4 transition-[color,translate] duration-700 ease-[var(--ease-expo)] group-hover:translate-x-4 group-hover:text-paper md:gap-8">
                  <span className="label text-ember">0{i + 1}</span>
                  <SocialIcon id={s.id} className="size-5 self-center md:size-8" />
                  <span className="display fs-h1">{s.label}</span>
                </span>
                <span className="relative flex items-center gap-4 transition-[color,translate] duration-700 ease-[var(--ease-expo)] group-hover:-translate-x-4 group-hover:text-paper">
                  <span className="label hidden text-current/60 sm:inline">{s.handle}</span>
                  <Arrow className="size-4 transition-transform duration-500 group-hover:rotate-45 md:size-6" />
                </span>
              </a>
            </li>
          ))}
          <li className="border-t border-ink/15" />
        </ul>
      </div>
    </section>
  )
}
