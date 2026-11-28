import { useEffect, useState, type CSSProperties } from 'react'
import { workbench } from '@/data/content'
import { prefersReducedMotion } from '@/lib/scroll'

const LOG = '$ bench --status   # what is on the bench right now'

function TypedLine() {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (prefersReducedMotion()) {
      setN(LOG.length)
      return
    }
    let i = 0
    let id = 0
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || id) return
      id = window.setInterval(() => {
        i++
        setN(i)
        if (i >= LOG.length) window.clearInterval(id)
      }, 32)
    })
    const el = document.getElementById('bench-log')
    if (el) io.observe(el)
    return () => {
      io.disconnect()
      window.clearInterval(id)
    }
  }, [])
  const typed = LOG.slice(0, n)
  const [cmd, comment] = typed.split('#')
  return (
    <div id="bench-log" className="font-mono text-[12px] text-paper/70">
      <span>{cmd}</span>
      {comment !== undefined ? <span className="text-mute">#{comment}</span> : null}
      <span className="caret ml-0.5 inline-block h-[1.1em] w-[0.55em] translate-y-[0.2em] bg-ember" />
    </div>
  )
}

export default function Workbench() {
  return (
    <section data-theme="dark" className="relative border-t border-paper/10 bg-ink py-24 md:py-36">
      <div className="container-x">
        <div data-reveal className="grid grid-cols-12 items-end gap-6">
          <div className="col-span-12 lg:col-span-8">
            <div className="label fade-up mb-6 flex items-center gap-3">
              <span className="text-ember">(05)</span> Workbench
            </div>
            <h2 data-fit className="display fade-up fs-d1">
              Currently on
              <br />
              my workbench<span className="text-ember">.</span>
            </h2>
          </div>
          <div className="col-span-12 lg:col-span-4 lg:text-right">
            <div className="fade-up inline-block text-left" style={{ '--d': '120ms' } as CSSProperties}>
              <TypedLine />
              <div className="label mt-2 text-mute">Last updated — Nov 2026</div>
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('terminal:run', { detail: 'bench --status' }))}
                className="group label mt-5 inline-flex items-center gap-2 border border-paper/20 px-3 py-2 transition-colors hover:border-ember hover:text-ember"
              >
                <span className="text-ember">&gt;_</span> Run it in the real terminal
              </button>
            </div>
          </div>
        </div>

        <div data-reveal className="mt-14 grid grid-cols-1 border-paper/12 sm:grid-cols-2 lg:grid-cols-4 md:mt-20">
          {workbench.map((w, i) => (
            <div
              key={w.key}
              className="fade-up group relative border-t border-paper/12 py-8 sm:pr-8 lg:border-l lg:px-7 lg:first:border-l-0 lg:first:pl-0"
              style={{ '--d': `${i * 90}ms` } as CSSProperties}
            >
              <div className="flex items-center justify-between">
                <span className="label flex items-center gap-2.5">
                  {w.state === 'live' ? (
                    <span className="pulse size-1.5 rounded-full bg-ember" />
                  ) : (
                    <span className="size-1.5 rounded-full border border-paper/50" />
                  )}
                  {w.key}
                </span>
                <span className="label text-mute">0{i + 1}</span>
              </div>
              <p className="heading mt-12 fs-h2 !leading-[1.2] text-paper/40 transition-colors duration-500 group-hover:text-paper">
                {w.text}
              </p>
              <div className="label mt-8 text-mute">
                Status: <span className={w.state === 'live' ? 'text-ember' : ''}>{w.state === 'live' ? 'Active' : 'Idle'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
