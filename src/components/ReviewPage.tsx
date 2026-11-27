import { useEffect } from 'react'
import { categoryLabel, experiments, site } from '@/data/content'
import { Arrow } from '@/lib/motion'
import Footer from './Footer'
import { Status } from './ExperimentLab'

export default function ReviewPage({ slug }: { slug: string }) {
  const i = experiments.findIndex((e) => e.slug === slug)
  const e = experiments[i]
  const next = experiments[(i + 1) % experiments.length]

  useEffect(() => {
    document.title = `${e ? e.name : 'Review'} — ${site.name}`
    return () => {
      document.title = site.name
    }
  }, [e])

  return (
    <>
      <div data-theme="dark" className="min-h-screen bg-ink">
        <header className="container-x flex items-center justify-between py-6">
          <a href="#top" className="heading fs-h2" aria-label="Back to home">
            {site.mark}
            <span className="ml-0.5 inline-block size-[0.28em] bg-ember" />
          </a>
          <a href="#experiments" className="group label flex items-center gap-2 hover:text-ember">
            <span aria-hidden className="transition-transform group-hover:-translate-x-1">←</span> All experiments
          </a>
        </header>

        {!e ? (
          <div className="container-x py-32">
            <p className="heading fs-h1">Review not found.</p>
            <a href="#experiments" className="label mt-6 inline-block text-ember">
              Back to the experiment lab
            </a>
          </div>
        ) : (
          <article className="container-x pb-24 pt-16 md:pt-24">
            <div className="label flex flex-wrap items-center gap-x-6 gap-y-2 text-mute">
              <span className="text-ember">EXP—{e.id}</span>
              <span>{categoryLabel[e.category]}</span>
              <Status status={e.status} />
              <span>{e.date}</span>
            </div>
            <h1 className="display fs-d1 mt-8">{e.name}</h1>
            <p className="mt-8 max-w-[56ch] fs-lead leading-snug text-paper/70">{e.summary}</p>
            <div className="label mt-6 text-mute">
              Verdict · <span className="text-paper">{e.verdict ?? 'In testing'}</span>
            </div>

            {e.image ? (
              <img src={e.image.src} alt={e.image.alt} className="mt-14 w-full max-w-4xl border border-paper/15" />
            ) : null}

            <div className="mt-14 max-w-[62ch] space-y-5 leading-relaxed text-paper/80">
              {e.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>

            {e.checking ? (
              <section className="mt-14 max-w-[62ch]">
                <h2 className="label mb-4 text-mute">What I'm checking</h2>
                <ul className="border-t border-paper/12">
                  {e.checking.map((c) => (
                    <li key={c} className="border-b border-paper/12 py-3 text-paper/80">
                      {c}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {e.note ? (
              <p className="mt-10 max-w-[62ch] border-l-2 border-ember pl-4 text-paper/70">
                <span className="label mb-1 block text-mute">Latest note</span>
                {e.note}
              </p>
            ) : null}

            {e.tags ? (
              <ul className="mt-10 flex flex-wrap gap-2">
                {e.tags.map((t) => (
                  <li key={t} className="label border border-paper/20 px-2.5 py-1 text-paper/70">
                    {t}
                  </li>
                ))}
              </ul>
            ) : null}

            <a
              href={next.href}
              className="group mt-24 flex items-center justify-between border-t border-paper/15 pt-6"
            >
              <span>
                <span className="label text-mute">Next experiment</span>
                <span className="heading fs-h2 mt-2 block">{next.name}</span>
              </span>
              <Arrow className="size-5 transition-transform group-hover:translate-x-1" />
            </a>
          </article>
        )}
      </div>
      <Footer />
    </>
  )
}
