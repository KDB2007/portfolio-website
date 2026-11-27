import { useEffect, useRef, type CSSProperties } from 'react'
import { onScroll } from '@/lib/scroll'
import SectionHead from './SectionHead'

const HEADLINE = "I don't just use technology. I experiment with it."
const METHOD = [
  ['Explore', 'Find the edges of a tool before trusting it.'],
  ['Build', 'Make something small that actually works.'],
  ['Test', 'Push it until it breaks, then ask why.'],
  ['Document', 'Write down what was learned, honestly.'],
]

export default function Manifesto() {
  const words = HEADLINE.split(' ')
  const wrap = useRef<HTMLHeadingElement>(null)

  // Scroll-linked ink fill, word by word
  useEffect(
    () =>
      onScroll(() => {
        const el = wrap.current
        if (!el) return
        const r = el.getBoundingClientRect()
        const vh = window.innerHeight
        const p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.35)))
        const spans = el.querySelectorAll<HTMLElement>('[data-w]')
        spans.forEach((s, i) => {
          const local = Math.min(1, Math.max(0, p * (spans.length + 2) - i))
          s.style.opacity = String(0.12 + local * 0.88)
        })
      }),
    [],
  )

  return (
    <section data-theme="light" className="section-y relative bg-paper text-ink">
      <div className="container-x">
        <SectionHead index="01" name="Manifesto" aside="Explore → Build → Test → Document" light />

        <h2
          ref={wrap}
          data-fit
          className="display fs-d2 !leading-[0.9] [text-indent:0] md:[text-indent:16.6%]"
          aria-label={HEADLINE}
        >
          {words.map((w, i) => {
            const em = w.toLowerCase() === 'experiment'
            return (
              <span key={i} aria-hidden>
                <span
                  data-w
                  className={`transition-opacity duration-300 ${em ? 'italic text-ember' : ''}`}
                  style={{ opacity: 0.12 }}
                >
                  {w}
                </span>{' '}
              </span>
            )
          })}
        </h2>

        <div data-reveal className="mt-16 grid grid-cols-12 gap-x-6 gap-y-10 md:mt-28">
          <div className="label fade-up col-span-12 text-ink/50 md:col-span-3">
            <span className="text-ink">Kishan D Belavadi</span>
            <br />
            Engineering student, year one
          </div>
          <p
            className="fade-up col-span-12 fs-lead leading-[1.4] tracking-[-0.01em] text-ink/80 md:col-span-7 md:col-start-6"
            style={{ '--d': '120ms' } as CSSProperties}
          >
            I'm a first-year engineering student in Bengaluru. I put AI tools through real work, write down the
            verdict, and keep the ones that survive. Then I build with them, in public, to understand <em className="font-display not-italic font-semibold text-ink">how things actually work.</em>
          </p>
        </div>

        <ol data-reveal className="mt-20 grid grid-cols-2 md:mt-32 md:grid-cols-4">
          {METHOD.map(([title, line], i) => (
            <li
              key={title}
              className="fade-up group relative border-t border-ink/15 py-6 pr-6 md:py-8"
              style={{ '--d': `${i * 90}ms` } as CSSProperties}
            >
              <span className="absolute left-0 top-[-1px] h-px w-full origin-left scale-x-0 bg-ember transition-transform duration-700 ease-[var(--ease-expo)] group-hover:scale-x-100" />
              <div className="label !text-[15px] text-ink/55 transition-colors group-hover:text-ember">0{i + 1}</div>
              <div className="heading mt-6 text-[clamp(1.6rem,2.6vw,2.6rem)] md:mt-10">{title}</div>
              <p className="mt-4 max-w-[24ch] text-[clamp(1.05rem,1.55vw,1.45rem)] leading-snug text-ink/75">{line}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
