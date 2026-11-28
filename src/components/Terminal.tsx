import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { categoryLabel, events, experiments, projects, site } from '@/data/content'
import { lockScroll, scrollToTarget } from '@/lib/scroll'

type Line = { id: number; node: ReactNode }

const SECTIONS = ['top', 'experiments', 'projects', 'about', 'contact'] as const
const COMMANDS = ['help', 'about', 'projects', 'experiments', 'contact', 'goto', 'whoami', 'ls', 'date', 'clear', 'exit']

const BANNER = [
  " _  __ ___  ___  _  _    _    _  _     ___      ___  ___  _       _   __   __   _    ___   ___",
  "| |/ /|_ _|/ __|| || |  /_\\  | \\| |   |   \\    | _ )| __|| |     /_\\  \\ \\ / /  /_\\  |   \\ |_ _|",
  "| ' <  | | \\__ \\| __ | / _ \\ | .` | _ | |) | _ | _ \\| _| | |__  / _ \\  \\ V /  / _ \\ | |) | | |",
  "|_|\\_\\|___||___/|_||_|/_/ \\_\\|_|\\_|(_)|___/ (_)|___/|___||____|/_/ \\_\\  \\_/  /_/ \\_\\|___/ |___|",
].join('\n')

const Key = ({ children }: { children: ReactNode }) => <span className="text-ember">{children}</span>
const Dim = ({ children }: { children: ReactNode }) => <span className="text-paper/45">{children}</span>

function Table({ rows }: { rows: [ReactNode, ReactNode][] }) {
  return (
    <div className="grid grid-cols-[minmax(7rem,max-content)_1fr] gap-x-6 gap-y-0.5">
      {rows.map(([a, b], i) => (
        <div key={i} className="contents">
          <span>{a}</span>
          <span className="text-paper/60">{b}</span>
        </div>
      ))}
    </div>
  )
}

export default function Terminal() {
  const [open, setOpen] = useState(false)
  const [lines, setLines] = useState<Line[]>([])
  const [value, setValue] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [hIndex, setHIndex] = useState(-1)
  const input = useRef<HTMLInputElement>(null)
  const body = useRef<HTMLDivElement>(null)
  const restoreFocus = useRef<HTMLElement | null>(null)
  const wasOpen = useRef(false)
  const uid = useRef(0)
  const [nudge, setNudge] = useState(false)

  // One-time nudge once the visitor has scrolled past the hero
  useEffect(() => {
    if (localStorage.getItem('kdb-terminal-seen')) return
    let timer = 0
    const onScrollOnce = () => {
      if (window.scrollY < window.innerHeight * 0.9 || timer) return
      timer = window.setTimeout(() => setNudge(true), 900)
      window.removeEventListener('scroll', onScrollOnce)
    }
    window.addEventListener('scroll', onScrollOnce, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScrollOnce)
      window.clearTimeout(timer)
    }
  }, [])
  const dismissNudge = () => {
    setNudge(false)
    localStorage.setItem('kdb-terminal-seen', '1')
  }

  const print = useCallback((node: ReactNode) => setLines((l) => [...l, { id: uid.current++, node }]), [])

  const welcome = useCallback(() => {
    setLines([])
    print(<pre className="overflow-x-auto pb-1 text-[8px] leading-[1.15] text-ember [scrollbar-width:none] sm:text-[10px] md:text-[11px]">{BANNER}</pre>)
    print(
      <span>
        Lab terminal v0.1 — type <Key>help</Key> to list commands. <Dim>Esc to close.</Dim>
      </span>,
    )
  }, [print])

  useEffect(() => welcome(), [welcome])

  // Toggle: backtick anywhere (outside other text fields) or the custom event
  useEffect(() => {
    const toggle = () =>
      setOpen((o) => {
        if (!o) restoreFocus.current = document.activeElement as HTMLElement
        return !o
      })
    const key = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement
      const typing = t.matches?.('input, textarea, [contenteditable]') && t !== input.current
      if ((e.key === '`' || e.key === '~') && !typing && !e.metaKey && !e.ctrlKey) {
        e.preventDefault()
        toggle()
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', key)
    window.addEventListener('terminal:toggle', toggle)
    return () => {
      window.removeEventListener('keydown', key)
      window.removeEventListener('terminal:toggle', toggle)
    }
  }, [])

  useEffect(() => {
    if (open) {
      wasOpen.current = true
      setNudge(false)
      localStorage.setItem('kdb-terminal-seen', '1')
      lockScroll(true)
      const id = setTimeout(() => input.current?.focus(), 60)
      return () => clearTimeout(id)
    }
    if (wasOpen.current) {
      lockScroll(false)
      restoreFocus.current?.focus?.()
    }
  }, [open])

  useEffect(() => {
    body.current?.scrollTo({ top: body.current.scrollHeight })
  }, [lines])

  const go = (id: string) => {
    setOpen(false)
    setTimeout(() => scrollToTarget(id), 350)
  }

  const run = (raw: string) => {
    const cmd = raw.trim()
    print(
      <span>
        <Key>kishan@lab</Key>
        <Dim>:~$</Dim> {cmd}
      </span>,
    )
    if (!cmd) return
    setHistory((h) => [cmd, ...h].slice(0, 50))
    setHIndex(-1)
    const [name, ...args] = cmd.split(/\s+/)
    switch (name.toLowerCase()) {
      case 'help':
        print(
          <Table
            rows={[
              [<Key>about</Key>, 'who is behind this lab'],
              [<Key>projects</Key>, 'things I have built'],
              [<Key>experiments</Key>, 'tools tested and reviewed'],
              [<Key>contact</Key>, 'ways to reach me'],
              [<Key>goto &lt;section&gt;</Key>, `jump to: ${SECTIONS.join(', ')}`],
              [<Key>whoami · ls · date</Key>, 'small utilities'],
              [<Key>clear</Key>, 'clear the screen'],
              [<Key>exit</Key>, 'close the terminal'],
            ]}
          />,
        )
        break
      case 'about':
        print(
          <span>
            {site.name} — first-year engineering student in Bengaluru. {site.pitch} <Dim>Run</Dim> <Key>goto about</Key> <Dim>for the full profile.</Dim>
          </span>,
        )
        break
      case 'projects':
        print(
          <Table
            rows={projects.map((p) => [
              <span>
                <Dim>{p.no}</Dim> {p.title}
              </span>,
              p.kind,
            ])}
          />,
        )
        print(
          <span>
            <Key>goto projects</Key> <Dim>to view case studies.</Dim>
          </span>,
        )
        break
      case 'experiments':
        print(
          <Table
            rows={experiments.map((e) => [
              <span>
                <Dim>{e.id}</Dim> {e.name}
              </span>,
              `${categoryLabel[e.category]} · ${e.status}`,
            ])}
          />,
        )
        break
      case 'contact':
        print(<Table rows={site.socials.map((s) => [<Key>{s.label.toLowerCase()}</Key>, s.handle])} />)
        break
      case 'goto': {
        const target = (args[0] ?? '').toLowerCase().replace(/^home$/, 'top')
        if ((SECTIONS as readonly string[]).includes(target)) {
          print(<Dim>→ navigating to {target}…</Dim>)
          go(target)
        } else print(<span>usage: goto {`<${SECTIONS.join('|')}>`}</span>)
        break
      }
      case 'whoami':
        print('visitor — curious, evidently.')
        break
      case 'ls':
        print(
          <span className="flex flex-wrap gap-x-6">
            {['experiments/', 'projects/', 'events/', 'about.md', 'contact.md'].map((f) => (
              <span key={f} className={f.endsWith('/') ? 'text-ember' : ''}>
                {f}
              </span>
            ))}
            <Dim>({events.length} event slots)</Dim>
          </span>,
        )
        break
      case 'date':
        print(new Date().toString())
        break
      case 'sudo':
        print('Permission denied. Nice try though.')
        break
      case 'clear':
        setLines([])
        break
      case 'exit':
        setOpen(false)
        break
      default:
        print(
          <span>
            command not found: {name}. <Dim>Try</Dim> <Key>help</Key>
          </span>,
        )
    }
  }

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === '`') {
      e.preventDefault()
      return
    }
    if (e.key === 'Enter') {
      // Closing the terminal restores focus to the launcher, so without this the
      // Enter default action would immediately re-activate it and reopen the panel.
      e.preventDefault()
      run(value)
      setValue('')
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const i = Math.min(history.length - 1, hIndex + 1)
      if (i >= 0) {
        setHIndex(i)
        setValue(history[i])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const i = hIndex - 1
      setHIndex(Math.max(-1, i))
      setValue(i >= 0 ? history[i] : '')
    } else if (e.key === 'Tab') {
      e.preventDefault()
      const [head, arg] = value.split(/\s+/)
      if (arg !== undefined && head === 'goto') {
        const m = SECTIONS.find((s) => s.startsWith(arg))
        if (m) setValue(`goto ${m}`)
      } else if (value) {
        const m = COMMANDS.find((c) => c.startsWith(value))
        if (m) setValue(m)
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault()
      setLines([])
    }
  }

  return (
    <>
      {/* Corner launcher + one-time nudge */}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col items-end gap-3 md:bottom-7 md:right-7">
        <div
          role="status"
          className="w-[17rem] border border-paper/15 bg-ink-2 p-4 text-paper shadow-[0_20px_60px_-10px_rgb(0_0_0/0.8)] transition-[opacity,transform] duration-700 ease-[var(--ease-expo)]"
          style={{
            opacity: nudge ? 1 : 0,
            transform: nudge ? 'none' : 'translateY(12px)',
            pointerEvents: nudge ? 'auto' : 'none',
            visibility: nudge ? 'visible' : 'hidden',
          }}
        >
          <div className="label flex items-center justify-between text-mute">
            <span className="flex items-center gap-2 text-ember">
              <span className="pulse size-1.5 rounded-full bg-ember" /> Hidden feature
            </span>
            <button onClick={dismissNudge} className="hover:text-paper" aria-label="Dismiss" tabIndex={nudge ? 0 : -1}>
              ✕
            </button>
          </div>
          <p className="mt-3 text-[13px] leading-snug text-paper/80">
            This site has a working terminal. Type <span className="font-mono text-ember">help</span> to look around.
          </p>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('terminal:toggle'))}
            tabIndex={nudge ? 0 : -1}
            className="label mt-4 flex w-full items-center justify-between bg-ember px-3 py-2.5 text-ink transition-colors hover:bg-paper"
          >
            Open terminal <kbd className="opacity-60">`</kbd>
          </button>
        </div>
        <button
          onClick={() => window.dispatchEvent(new CustomEvent('terminal:toggle'))}
          aria-label="Open terminal"
          className="group label flex h-11 items-center gap-2.5 border border-paper/20 bg-ink/85 px-3.5 text-paper backdrop-blur-md transition-colors hover:border-ember hover:text-ember"
        >
          <span className="font-mono text-[12px] text-ember">&gt;_</span>
          <span className="hidden sm:inline">Terminal</span>
          <kbd className="hidden border-l border-paper/20 pl-2.5 opacity-50 md:inline">`</kbd>
        </button>
      </div>

      <div
        className="fixed inset-0 z-[160] flex items-end justify-center p-3 sm:items-center sm:p-8"
        style={{ visibility: open ? 'visible' : 'hidden', transition: `visibility 0s ${open ? '0s' : '0.6s'}` }}
        aria-hidden={!open}
      >
        <div
          className="absolute inset-0 bg-ink/75 transition-opacity duration-500"
          style={{ opacity: open ? 1 : 0 }}
          onClick={() => setOpen(false)}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Lab terminal"
          className="relative flex h-[min(78vh,620px)] w-full max-w-[860px] flex-col border border-paper/15 bg-[#0c0c0b] shadow-[0_40px_120px_-20px_rgb(0_0_0/0.9)] transition-[opacity,transform] duration-[600ms] ease-[var(--ease-expo)]"
          style={{ opacity: open ? 1 : 0, transform: open ? 'none' : 'translateY(24px) scale(0.98)' }}
          onClick={() => input.current?.focus()}
        >
          <div className="flex h-10 shrink-0 items-center justify-between border-b border-paper/10 px-4">
            <div className="flex items-center gap-1.5">
              <span className="size-2 bg-ember" />
              <span className="size-2 bg-paper/20" />
              <span className="size-2 bg-paper/20" />
            </div>
            <span className="label hidden text-mute sm:inline">kishan@lab — ~/portfolio</span>
            <button onClick={() => setOpen(false)} className="label text-mute hover:text-ember" tabIndex={open ? 0 : -1}>
              Esc
            </button>
          </div>
          <div
            ref={body}
            data-lenis-prevent
            className="flex-1 space-y-2 overflow-y-auto px-5 py-5 font-mono text-[12.5px] leading-relaxed text-paper/90 [scrollbar-color:rgb(241_239_232/0.15)_transparent] md:px-7"
          >
            {lines.map((l) => (
              <div key={l.id} className="[animation:rowin_0.4s_var(--ease-expo)_both]">
                {l.node}
              </div>
            ))}
            <label className="flex items-center gap-2">
              <span className="shrink-0">
                <Key>kishan@lab</Key>
                <Dim>:~$</Dim>
              </span>
              <input
                ref={input}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={onKey}
                tabIndex={open ? 0 : -1}
                spellCheck={false}
                autoComplete="off"
                autoCapitalize="off"
                aria-label="Terminal input"
                className="min-w-0 flex-1 bg-transparent text-paper caret-ember outline-none focus-visible:outline-none"
              />
            </label>
          </div>
          <div className="label flex h-8 shrink-0 items-center justify-between border-t border-paper/10 px-4 text-mute">
            <span>↑↓ history · tab complete</span>
            <span className="flex items-center gap-2">
              <span className="pulse size-1.5 rounded-full bg-ember" /> session live
            </span>
          </div>
        </div>
      </div>
    </>
  )
}
