import type { CSSProperties, ReactNode } from 'react'

/** Technical label row that opens every section. */
export default function SectionHead({
  index,
  name,
  aside,
  light = false,
}: {
  index: string
  name: string
  aside?: ReactNode
  light?: boolean
}) {
  return (
    <div data-reveal className="mb-14 md:mb-20">
      <div className="label fade-up flex items-center justify-between gap-6">
        <span className="flex items-center gap-3">
          <span className="text-ember">({index})</span>
          <span>{name}</span>
        </span>
        {aside ? <span className={light ? 'text-ink/50' : 'text-mute'}>{aside}</span> : null}
      </div>
      <div
        className={`rule mt-4 h-px ${light ? 'bg-ink/15' : 'bg-paper/15'}`}
        style={{ '--d': '120ms' } as CSSProperties}
      />
    </div>
  )
}
