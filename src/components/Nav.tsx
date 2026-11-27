import { useEffect, useState, type CSSProperties } from 'react'
import { nav, site } from '@/data/content'
import { lockScroll, onScroll, scrollToTarget } from '@/lib/scroll'
import SocialIcon from './SocialIcon'

export const openTerminal = () => window.dispatchEvent(new CustomEvent('terminal:toggle'))

export function StatusDot({ className = '' }: { className?: string }) {
  return <span className={`pulse inline-block size-1.5 rounded-full bg-ember ${className}`} />
}

export default function Nav({ ready }: { ready: boolean }) {
  const [light, setLight] = useState(false)
  const [active, setActive] = useState<string>('')
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Theme under the bar + hide on scroll down / show on scroll up.
  useEffect(() => {
    let last = window.scrollY
    return onScroll(() => {
      const y = window.scrollY
      setScrolled(y > 24)
      setHidden(y > last + 4 && y > 400)
      if (y < last - 4 || y < 400) setHidden(false)
      last = y
      const probe = 36
      const themed = [...document.querySelectorAll<HTMLElement>('[data-theme]')].find((el) => {
        const r = el.getBoundingClientRect()
        return r.top <= probe && r.bottom >= probe
      })
      setLight(themed?.dataset.theme === 'light')
      const mid = window.innerHeight * 0.45
      const current = nav.find(({ id }) => {
        const el = document.getElementById(id)
        if (!el) return false
        const r = el.getBoundingClientRect()
        return r.top <= mid && r.bottom >= mid
      })
      setActive(current?.id ?? '')
    })
  }, [])

  useEffect(() => {
    lockScroll(open)
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [open])

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    setOpen(false)
    setTimeout(() => scrollToTarget(id), open ? 450 : 0)
  }

  const tone = light && !open ? 'text-ink' : 'text-paper'
  const glass = scrolled && !open

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[120] transition-[transform,color,opacity] duration-700 ease-[var(--ease-expo)] ${tone}`}
        style={{
          transform: hidden && !open ? 'translateY(-110%)' : ready ? 'none' : 'translateY(-100%)',
          opacity: ready ? 1 : 0,
        }}
      >
        {/* Frosted bar — tinted to the section underneath so text always reads */}
        <div
          aria-hidden
          className={`absolute inset-0 border-b backdrop-blur-xl backdrop-saturate-150 transition-[background-color,border-color,opacity] duration-500 ${
            light ? 'border-ink/10 bg-paper/70' : 'border-paper/10 bg-ink/60'
          }`}
          style={{ opacity: glass ? 1 : 0 }}
        />
        <div className="container-x relative flex h-16 items-center justify-between md:h-[4.5rem]">
          <a
            href="#top"
            onClick={go('top')}
            className="display flex items-center gap-1.5 text-[17px] !tracking-[-0.02em] md:text-[19px]"
            aria-label="Kishan D Belavadi — back to top"
          >
            KDB<span className="mb-[0.12em] size-[0.28em] self-end bg-ember" />
          </a>

          <div className="label hidden items-center gap-2.5 xl:flex">
            <StatusDot />
            <span className="opacity-70">Currently experimenting</span>
            <span className="opacity-30">/</span>
            <span>{site.availability}</span>
          </div>

          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-7 lg:gap-9">
              {nav.map((item, i) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={go(item.id)}
                    className="group relative flex items-start gap-1.5 py-2 text-[13px] font-medium tracking-[-0.005em]"
                    aria-current={active === item.id ? 'location' : undefined}
                  >
                    <span className="font-mono text-[9px] leading-none opacity-50">0{i + 1}</span>
                    <span className="roll">
                      <span>{item.label}</span>
                      <span aria-hidden className="text-ember">
                        {item.label}
                      </span>
                    </span>
                    <span
                      className="absolute -bottom-0.5 left-0 h-px w-full origin-left bg-ember transition-transform duration-700 ease-[var(--ease-expo)]"
                      style={{ transform: `scaleX(${active === item.id ? 1 : 0})` }}
                    />
                  </a>
                </li>
              ))}
              <li>
                <button
                  onClick={openTerminal}
                  className="label flex items-center gap-2 border border-current/25 px-2.5 py-1.5 transition-colors hover:border-ember hover:text-ember"
                  aria-label="Open terminal (press backtick)"
                >
                  &gt;_ <kbd className="opacity-50">`</kbd>
                </button>
              </li>
            </ul>
          </nav>

          <button
            className="label relative flex h-10 items-center gap-3 md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            <span className="roll">
              <span>{open ? 'Close' : 'Menu'}</span>
              <span aria-hidden>{open ? 'Close' : 'Menu'}</span>
            </span>
            <span className="relative block h-2.5 w-6">
              <span
                className="absolute left-0 top-0 h-px w-full bg-current transition-transform duration-500 ease-[var(--ease-expo)]"
                style={{ transform: open ? 'translateY(5px) rotate(45deg)' : 'none' }}
              />
              <span
                className="absolute bottom-0 left-0 h-px w-full bg-current transition-transform duration-500 ease-[var(--ease-expo)]"
                style={{ transform: open ? 'translateY(-5px) rotate(-45deg)' : 'scaleX(0.6)', transformOrigin: 'left' }}
              />
            </span>
          </button>
        </div>
      </header>

      {/* Mobile menu: circular wipe from the toggle, staggered oversized links */}
      <div
        id="mobile-menu"
        className="fixed inset-0 z-[110] bg-ink text-paper md:hidden"
        style={{
          clipPath: open ? 'circle(150% at calc(100% - 2.5rem) 2rem)' : 'circle(0% at calc(100% - 2.5rem) 2rem)',
          transition: 'clip-path 0.9s cubic-bezier(0.76, 0, 0.24, 1)',
          visibility: open ? 'visible' : 'hidden',
          transitionProperty: 'clip-path, visibility',
          transitionDuration: open ? '0.9s, 0s' : '0.9s, 0s',
          transitionDelay: open ? '0s, 0s' : '0s, 0.9s',
        }}
        aria-hidden={!open}
      >
        <div className="container-x flex h-full flex-col justify-between pb-8 pt-24">
          <ul className={open ? 'is-in' : ''}>
            {nav.map((item, i) => (
              <li key={item.id} className="border-b border-paper/10">
                <a
                  href={`#${item.id}`}
                  onClick={go(item.id)}
                  tabIndex={open ? 0 : -1}
                  className="flex items-baseline justify-between py-3.5"
                >
                  <span className="word">
                    <span
                      className="display text-[clamp(2.4rem,11vw,4rem)]"
                      style={{ '--i': i, '--d': '250ms' } as CSSProperties}
                    >
                      {item.label}
                    </span>
                  </span>
                  <span className="label text-mute">0{i + 1}</span>
                </a>
              </li>
            ))}
          </ul>
          <div
            className="flex items-end justify-between transition-opacity duration-700"
            style={{ opacity: open ? 1 : 0, transitionDelay: open ? '500ms' : '0ms' }}
          >
            <div className="label flex flex-col gap-2">
              <span className="flex items-center gap-2.5">
                <StatusDot /> Currently experimenting
              </span>
              <span className="pl-4 text-mute">{site.availability}</span>
            </div>
            <div className="flex items-center gap-2">
              {site.socials.map((s) => (
                <a
                  key={s.id}
                  href={s.href}
                  tabIndex={open ? 0 : -1}
                  aria-label={s.label}
                  className="grid size-10 place-items-center border border-paper/15"
                >
                  <SocialIcon id={s.id} className="size-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
