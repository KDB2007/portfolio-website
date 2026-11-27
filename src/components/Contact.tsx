import { useState, type CSSProperties } from 'react'
import { site } from '@/data/content'
import { Arrow, Magnetic, Split } from '@/lib/motion'
import SocialIcon from './SocialIcon'

export default function Contact() {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      window.location.href = `mailto:${site.email}`
    }
  }

  return (
    <section id="contact" data-theme="dark" className="relative overflow-hidden bg-ink pb-24 pt-[var(--section-y)] md:pb-32">
      <div className="container-x">
        <div data-reveal className="label fade-up mb-16 flex items-center justify-between md:mb-24">
          <span className="flex items-center gap-3">
            <span className="text-ember">(07)</span> Contact
          </span>
          <span className="flex items-center gap-2.5 text-mute">
            <span className="pulse size-1.5 rounded-full bg-ember" /> {site.availability} & collaborations
          </span>
        </div>

        <h2 data-reveal data-fit className="display fs-d1">
          <span className="block">
            <Split text="Have something" />
          </span>
          <span className="block text-right md:pr-[6%]">
            <Split text="interesting" start={2} wordClass={() => 'italic text-ember'} />
          </span>
          <span className="block md:pl-[18%]">
            <Split text="in mind?" start={3} />
          </span>
        </h2>

        <div data-reveal className="mt-20 grid grid-cols-12 items-center gap-x-6 gap-y-14 md:mt-28">
          <p className="fade-up col-span-12 max-w-[30ch] fs-lead leading-snug text-paper/70 md:col-span-4">
            Let's build something, experiment with an idea or explore something interesting.
            <span className="mt-5 block text-[15px] leading-relaxed text-paper/50">
              I'm currently open to <span className="text-ember">internships</span>. If your team is building something
              interesting, I'd like to hear about it.
            </span>
          </p>

          <div className="fade-up col-span-12 flex justify-start md:col-span-3 md:justify-center" style={{ '--d': '120ms' } as CSSProperties}>
            <Magnetic strength={0.4}>
              <a
                href={`mailto:${site.email}`}
                data-cursor="link"
                className="group relative grid size-40 place-items-center overflow-hidden rounded-full bg-ember text-ink md:size-48"
              >
                <span className="absolute inset-0 translate-y-full rounded-full bg-paper transition-transform duration-700 ease-[var(--ease-expo)] group-hover:translate-y-0" />
                <span className="label relative flex flex-col items-center gap-2 !text-[12px]">
                  <Arrow className="size-5 transition-transform duration-700 ease-[var(--ease-expo)] group-hover:rotate-45" />
                  Say hello
                </span>
              </a>
            </Magnetic>
          </div>

          <div className="fade-up col-span-12 md:col-span-5 md:text-right" style={{ '--d': '200ms' } as CSSProperties}>
            <div className="label text-mute">Email</div>
            <button
              onClick={copy}
              data-cursor="view"
              data-cursor-label={copied ? 'Copied' : 'Copy'}
              className="group heading mt-3 inline-flex max-w-full items-center gap-3 text-left text-[clamp(1rem,2.1vw,2rem)] [overflow-wrap:anywhere] md:whitespace-nowrap"
              aria-label={`Copy email address ${site.email}`}
            >
              <span className="bg-[linear-gradient(var(--color-ember),var(--color-ember))] bg-[length:0%_2px] bg-left-bottom bg-no-repeat transition-[background-size] duration-700 ease-[var(--ease-expo)] group-hover:bg-[length:100%_2px]">
                {site.email}
              </span>
            </button>
            <div className="label mt-3 h-4 text-ember" aria-live="polite">
              {copied ? 'Copied to clipboard' : ''}
            </div>
            <ul className="label mt-8 flex flex-wrap gap-x-6 gap-y-3 md:justify-end">
              {site.socials
                .filter((s) => s.id !== 'email')
                .map((s) => (
                  <li key={s.id}>
                    <a href={s.href} className="group flex items-center gap-2 hover:text-ember">
                      <SocialIcon id={s.id} className="size-3.5" />
                      {s.label}
                      <Arrow className="size-2.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </a>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
