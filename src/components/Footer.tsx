import { site } from '@/data/content'
import { Arrow } from '@/lib/motion'
import { scrollToTarget } from '@/lib/scroll'
import AsciiField from './AsciiField'
import SocialIcon from './SocialIcon'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer data-theme="dark" className="relative bg-ink">
      <div className="relative h-[clamp(460px,56vw,900px)] w-full overflow-hidden">
        <AsciiField />
        <span className="sr-only">Kishan D Belavadi — a moonlit horizon rendered in ASCII characters.</span>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ink to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink to-transparent" />
        <div className="container-x pointer-events-none absolute inset-x-0 top-6 flex justify-between">
          <span className="label text-mute">[ Fig. 99 ] Horizon, in characters</span>
          <span className="label hidden text-mute md:inline">Move across the field</span>
        </div>
      </div>

      <div className="container-x pb-8">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 border-t border-paper/12 pt-8 md:grid-cols-12">
          <div className="col-span-2 md:col-span-4">
            <p className="heading fs-h2 !leading-[1.15]">
              Built by curiosity.
              <br />
              <span className="text-paper/40">Debugged by persistence.</span>
            </p>
            <button
              onClick={() => scrollToTarget('top')}
              className="group label mt-8 flex h-11 items-center gap-3 border border-paper/20 px-4 transition-colors hover:border-ember hover:text-ember"
            >
              Back to top <Arrow dir="up" className="size-2.5 transition-transform duration-500 group-hover:-translate-y-0.5" />
            </button>
          </div>
          <ul className="label flex flex-col gap-2 md:col-span-2 md:col-start-7">
            {site.socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} className="group inline-flex items-center gap-2.5 hover:text-ember">
                  <span className="grid size-7 place-items-center border border-paper/15 transition-colors group-hover:border-ember">
                    <SocialIcon id={s.id} className="size-3" />
                  </span>
                  {s.label}
                  <Arrow className="size-2.5 opacity-0 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
                </a>
              </li>
            ))}
          </ul>
          <div className="label flex flex-col gap-2.5 text-mute md:col-span-2">
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('terminal:toggle'))}
              className="text-left hover:text-ember"
            >
              Open terminal <kbd className="text-paper/40">`</kbd>
            </button>
            <span>{site.location}</span>
          </div>
        </div>
        <div className="label mt-14 flex flex-col justify-between gap-3 text-mute md:flex-row">
          <span>© {year} Kishan D Belavadi</span>
          <span>An engineer in progress — a builder by curiosity.</span>
          <span>
            End of transmission<span className="caret text-ember">_</span>
          </span>
        </div>
      </div>
    </footer>
  )
}
