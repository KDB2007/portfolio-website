import { useEffect, useRef } from 'react'
import horizon from '@/assets/horizon.jpg'

const RAMP = ' .·:-=+*xX8#'
// Bucket colours — dim ember → ember → ember/paper blend → paper, plus the wordmark
const COLORS = ['rgba(255,90,31,0.32)', 'rgba(255,90,31,0.78)', '#f5b79c', '#f1efe8', '#ff5a1f']
// 5×7 pixel font for the wordmark
const FONT: Record<string, string[]> = {
  K: ['#...#', '#..#.', '#.#..', '##...', '#.#..', '#..#.', '#...#'],
  I: ['#####', '..#..', '..#..', '..#..', '..#..', '..#..', '#####'],
  S: ['.####', '#....', '#....', '.###.', '....#', '....#', '####.'],
  H: ['#...#', '#...#', '#...#', '#####', '#...#', '#...#', '#...#'],
  A: ['.###.', '#...#', '#...#', '#####', '#...#', '#...#', '#...#'],
  N: ['#...#', '##..#', '##..#', '#.#.#', '#..##', '#..##', '#...#'],
  D: ['####.', '#...#', '#...#', '#...#', '#...#', '#...#', '####.'],
  B: ['####.', '#...#', '#...#', '####.', '#...#', '#...#', '####.'],
  E: ['#####', '#....', '#....', '####.', '#....', '#....', '#####'],
  L: ['#....', '#....', '#....', '#....', '#....', '#....', '#####'],
  V: ['#...#', '#...#', '#...#', '#...#', '#...#', '.#.#.', '..#..'],
  ' ': ['.....', '.....', '.....', '.....', '.....', '.....', '.....'],
}
const HORIZON = 0.535 // horizon line in source image (0–1)

const hash = (x: number, y: number) => {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453
  return s - Math.floor(s)
}

export default function AsciiField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let disposed = false
    let raf = 0
    let visible = false
    let W = 0,
      H = 0,
      cw = 6,
      lh = 11,
      fs = 10,
      cols = 0,
      rows = 0
    let lum = new Float32Array(0)
    let mask = new Float32Array(0)
    let hashes = new Float32Array(0)
    const img = new Image()
    img.src = horizon
    const pointer = { x: -9999, y: -9999, sx: -9999, sy: -9999, energy: 0 }

    const build = () => {
      if (!img.complete || !img.naturalWidth) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      W = canvas.clientWidth
      H = canvas.clientHeight
      if (!W || !H) return
      canvas.width = Math.round(W * dpr)
      canvas.height = Math.round(H * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      fs = W < 640 ? 8 : W < 1100 ? 9 : 10
      ctx.font = `500 ${fs}px "JetBrains Mono", monospace`
      cw = ctx.measureText('M').width
      lh = Math.round(fs * 1.18)
      cols = Math.ceil(W / cw)
      rows = Math.ceil(H / lh)

      // Sample the image (cover-fit) into a cols×rows luminance grid
      const off = document.createElement('canvas')
      off.width = cols
      off.height = rows
      const o = off.getContext('2d', { willReadFrequently: true })!
      const ia = img.naturalWidth / img.naturalHeight
      const ca = (cols * cw) / (rows * lh)
      let sw = img.naturalWidth,
        sh = img.naturalHeight,
        sx = 0,
        sy = 0
      if (ca > ia) {
        sh = sw / ca
        sy = (img.naturalHeight - sh) * HORIZON
      } else {
        sw = sh * ca
        sx = (img.naturalWidth - sw) / 2
      }
      o.drawImage(img, sx, sy, sw, sh, 0, 0, cols, rows)
      const data = o.getImageData(0, 0, cols, rows).data
      lum = new Float32Array(cols * rows)
      for (let i = 0; i < cols * rows; i++) lum[i] = Math.pow(data[i * 4] / 255, 1.25)
      horizonRow = Math.round(((img.naturalHeight * HORIZON - sy) / sh) * rows)

      // Wordmark mask from a 5×7 pixel font — crisp, legible letterforms at any size
      mask = new Float32Array(cols * rows)
      const lines = W < 760 ? ['KISHAN D', 'BELAVADI'] : ['KISHAN D BELAVADI']
      // Glyph advance is 7 units (5 wide + 2 gap) so the letters breathe; units are fractional cells.
      const ADV = 7
      const pxW = (l: string) => l.length * ADV - (ADV - 5)
      const widest = Math.max(...lines.map(pxW))
      const pxf = (cols * 0.9) / widest
      const px = Math.max(1, Math.round(pxf))
      const py = Math.max(1, Math.round((px * cw) / lh))
      const lineGap = 3 * py
      const blockH = lines.length * 7 * py + (lines.length - 1) * lineGap
      const free = rows - horizonRow
      const top0 = Math.max(horizonRow + 2, Math.min(rows - blockH - 2, Math.round(horizonRow + free * 0.56 - blockH / 2)))
      bandTop = top0 - 1
      bandBot = top0 + blockH + 1
      const plot = (cx: number, cy: number, v: number) => {
        if (cx < 0 || cy < 0 || cx >= cols || cy >= rows) return
        const k = cy * cols + cx
        if (mask[k] < v) mask[k] = v
      }
      lines.forEach((line, li) => {
        const left = (cols - pxW(line) * pxf - 1) / 2 // -1 accounts for the extra stroke cell on the right
        const top = top0 + li * (7 * py + lineGap)
        ;[...line].forEach((ch, ci) => {
          const glyph = FONT[ch]
          if (!glyph) return
          for (let gy = 0; gy < 7; gy++)
            for (let gx = 0; gx < 5; gx++) {
              if (glyph[gy][gx] !== '#') continue
              const x0 = Math.round(left + (ci * ADV + gx) * pxf)
              const x1 = Math.round(left + (ci * ADV + gx + 1) * pxf) + 1 // +1 keeps strokes bold
              for (let yy = 0; yy < py; yy++)
                for (let cx = x0; cx < x1; cx++) {
                  const cy = top + gy * py + yy
                  plot(cx, cy, 1)
                  plot(cx + 1, cy + 1, 0.5) // drop shadow
                }
            }
        })
      })

      hashes = new Float32Array(cols * rows)
      for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) hashes[y * cols + x] = hash(x, y)

      draw(0)
    }
    let horizonRow = 0
    let bandTop = 0,
      bandBot = -1 // rows covered by the wordmark; the artwork is faded there so every letter reads

    const buckets: string[][] = COLORS.map(() => [])
    const draw = (t: number) => {
      if (!cols) return
      ctx.clearRect(0, 0, W, H)
      ctx.font = `500 ${fs}px "JetBrains Mono", monospace`
      ctx.textBaseline = 'top'
      pointer.sx += (pointer.x - pointer.sx) * 0.12
      pointer.sy += (pointer.y - pointer.sy) * 0.12
      pointer.energy *= 0.96
      const mx = pointer.sx / cw,
        my = pointer.sy / lh
      const R = W < 640 ? 14 : 22
      const aspect = lh / cw
      const flick = Math.floor(t * 7)
      const rampMax = RAMP.length - 1

      for (let y = 0; y < rows; y++) {
        for (let b = 0; b < buckets.length; b++) buckets[b].length = 0
        const below = y > horizonRow
        const depth = below ? (y - horizonRow) / Math.max(1, rows - horizonRow) : 0
        const shimmer = below ? Math.sin(y * 0.62 + t * 1.7) * (0.6 + depth * 2.4) + Math.sin(y * 1.9 - t * 2.3) * 0.5 : 0
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x
          let sx = x + shimmer
          let syy = y
          let boost = 0
          const dx = x - mx,
            dy = (y - my) * aspect
          const d2 = dx * dx + dy * dy
          if (d2 < R * R) {
            const d = Math.sqrt(d2)
            const f = 1 - d / R
            const k = f * f * 0.42
            sx = sx - dx * k
            syy = y - (dy / aspect) * k
            boost = f * f * (0.18 + pointer.energy * 0.4)
          }
          const ix = Math.min(cols - 1, Math.max(0, Math.round(sx)))
          const iy = Math.min(rows - 1, Math.max(0, Math.round(syy)))
          let v = lum[iy * cols + ix] + boost
          const h = hashes[i]
          if (!below && v < 0.08 && h > 0.994) v = 0.25 + 0.25 * Math.sin(t * 2 + h * 90) // stars
          if (y >= bandTop && y <= bandBot) v *= 0.04 // keep the wordmark clear of the artwork
          if (below) v *= 0.82 + 0.18 * Math.sin(x * 0.08 - t * 0.9 + y * 0.3) // water ripple
          const mk = mask[i]
          let bucket: number
          let ch: string
          if (mk === 1) {
            bucket = 4
            ch = '#'
          } else if (mk > 0) {
            bucket = 0
            ch = ':'
          } else {
            if (v < 0.075) {
              continue
            }
            bucket = v < 0.28 ? 0 : v < 0.55 ? 1 : v < 0.8 ? 2 : 3
            let idx = Math.min(rampMax, Math.max(1, Math.round(v * rampMax)))
            if (hash(i, flick) > 0.97) idx = Math.max(1, idx - 1) // character churn
            ch = RAMP[idx]
          }
          const arr = buckets[bucket]
          while (arr.length < x) arr.push(' ')
          arr.push(ch)
        }
        const top = y * lh
        for (let b = 0; b < buckets.length; b++) {
          if (!buckets[b].length) continue
          ctx.fillStyle = COLORS[b]
          ctx.fillText(buckets[b].join(''), 0, top)
        }
      }
    }

    let last = 0
    const loop = (now: number) => {
      raf = 0
      if (disposed || !visible || document.hidden) return
      if (now - last > 33) {
        last = now
        draw(now / 1000)
      }
      raf = requestAnimationFrame(loop)
    }
    const start = () => {
      if (!reduced && !raf && visible) raf = requestAnimationFrame(loop)
    }

    const move = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      const nx = e.clientX - r.left,
        ny = e.clientY - r.top
      const dist = Math.hypot(nx - pointer.x, ny - pointer.y)
      if (pointer.x < -999) {
        pointer.sx = nx
        pointer.sy = ny
      }
      pointer.x = nx
      pointer.y = ny
      pointer.energy = Math.min(1, pointer.energy + dist / 400)
    }
    const leave = () => {
      pointer.x = -9999
      pointer.y = -9999
    }
    canvas.addEventListener('pointermove', move)
    canvas.addEventListener('pointerleave', leave)

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      start()
    })
    io.observe(canvas)
    const ro = new ResizeObserver(() => build())
    ro.observe(canvas)
    const vis = () => start()
    document.addEventListener('visibilitychange', vis)

    Promise.all([
      img.decode().catch(() => undefined),
      document.fonts?.load('500 10px "JetBrains Mono"'),
      document.fonts?.load('900 100px Archivo'),
    ]).then(() => {
      if (!disposed) build()
    })

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
      canvas.removeEventListener('pointermove', move)
      canvas.removeEventListener('pointerleave', leave)
      document.removeEventListener('visibilitychange', vis)
    }
  }, [])

  return <canvas ref={canvasRef} aria-hidden className="absolute inset-0 h-full w-full touch-pan-y" />
}
