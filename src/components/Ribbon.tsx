const WORDS = ['Explore', 'Build', 'Test', 'Document', 'Repeat']

/** The one deliberate grid disruption: a tilted ember band. */
export default function Ribbon() {
  const run = (hidden: boolean) => (
    <div aria-hidden={hidden} className="flex shrink-0 items-center">
      {WORDS.map((w) => (
        <span key={w} className="flex items-center">
          <span className="display px-6 text-[clamp(2.2rem,5.2vw,5.4rem)] !leading-none md:px-10">{w}</span>
          <span className="size-[0.6em] rotate-45 border-2 border-ink text-[clamp(1rem,2vw,2rem)]" />
        </span>
      ))}
    </div>
  )
  return (
    <div data-theme="dark" className="relative z-[5] overflow-hidden bg-ink py-10 md:py-16">
      <div className="-mx-8 -rotate-[2.5deg] bg-ember py-4 text-ink md:py-6">
        <div className="flex w-max [animation:marquee_28s_linear_infinite]">
          {run(false)}
          {run(true)}
        </div>
      </div>
    </div>
  )
}
