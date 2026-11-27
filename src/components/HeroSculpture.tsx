import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'

const EMBER = new THREE.Color('#ff5a1f')

/** (p,q) torus-knot curve. */
class KnotCurve extends THREE.Curve<THREE.Vector3> {
  constructor(
    private p: number,
    private q: number,
    private R: number,
    private r: number,
    private t0 = 0,
    private t1 = 1,
  ) {
    super()
  }
  getPoint(t: number, target = new THREE.Vector3()) {
    const phi = (this.t0 + (this.t1 - this.t0) * t) * Math.PI * 2
    const k = this.R + this.r * Math.cos(this.q * phi)
    return target.set(k * Math.cos(this.p * phi), k * Math.sin(this.p * phi), this.r * Math.sin(this.q * phi))
  }
}

// Largest extent of the object (all modes) in model units — used to fit it inside its stage
const EXTENT = 3.0

export type SpecimenMode = 'explore' | 'build' | 'test' | 'document'

// Per-mode targets, eased between: how far apart, how fast, how stressed, how hot
const MODES: Record<SpecimenMode, { open: number; speed: number; jitter: number; heat: number; ring: number }> = {
  explore: { open: 0.6, speed: 0.28, jitter: 0, heat: 0.35, ring: 0.35 },
  build: { open: 0, speed: 0.1, jitter: 0, heat: 0.25, ring: 0 },
  test: { open: 0.14, speed: 0.55, jitter: 1, heat: 1.6, ring: 0.12 },
  document: { open: 0.3, speed: 0.05, jitter: 0, heat: 0.15, ring: 0.2 },
}

export default function HeroSculpture({
  ready,
  modeRef,
  statsRef,
  stageRef,
}: {
  stageRef: { current: HTMLElement | null }
  ready: boolean
  modeRef: { current: SpecimenMode }
  statsRef: { current: HTMLElement[] }
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const readyRef = useRef(ready)
  readyRef.current = ready

  useEffect(() => {
    const canvas = canvasRef.current!
    const mobile = window.innerWidth < 768
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: !mobile, alpha: true, powerPreference: 'high-performance' })
    } catch {
      return
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.5 : 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.05
    renderer.outputColorSpace = THREE.SRGBColorSpace

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100)
    camera.position.set(0, 0, 14)

    const pmrem = new THREE.PMREMGenerator(renderer)
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    scene.environment = envTex

    const root = new THREE.Group()
    const sculpture = new THREE.Group()
    root.add(sculpture)
    scene.add(root)

    // ── Fragmented knot: machined square-section segments with gaps
    const metal = new THREE.MeshPhysicalMaterial({
      color: 0x0e0e0e,
      metalness: 1,
      roughness: 0.24,
      clearcoat: 1,
      clearcoatRoughness: 0.18,
      flatShading: true,
      envMapIntensity: 1.15,
    })
    const emberMetal = new THREE.MeshPhysicalMaterial({
      color: EMBER,
      metalness: 0.6,
      roughness: 0.3,
      emissive: EMBER,
      emissiveIntensity: 0.35,
      flatShading: true,
    })
    const blueprint = new THREE.MeshBasicMaterial({ color: 0xf1efe8, wireframe: true, transparent: true, opacity: 0.32 })
    const blueprintEmber = new THREE.MeshBasicMaterial({ color: EMBER, wireframe: true, transparent: true, opacity: 0.8 })
    const FRAGMENTS = mobile ? 18 : 26
    const fragments: { mesh: THREE.Mesh; accent: boolean; phase: number; dir: THREE.Vector3; spin: THREE.Vector3 }[] = []
    for (let i = 0; i < FRAGMENTS; i++) {
      const t0 = i / FRAGMENTS
      const t1 = t0 + (1 / FRAGMENTS) * 0.86
      const curve = new KnotCurve(2, 3, 1.3, 0.62, t0, t1)
      const geo = new THREE.TubeGeometry(curve, mobile ? 18 : 28, 0.23, 4, false)
      const accent = i % 9 === 4
      const mesh = new THREE.Mesh(geo, accent ? emberMetal : metal)
      const mid = curve.getPoint(0.5)
      fragments.push({
        mesh,
        accent,
        phase: Math.random() * Math.PI * 2,
        dir: mid.clone().normalize(),
        spin: new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).multiplyScalar(0.9),
      })
      sculpture.add(mesh)
    }

    // ── Orbit wire + travelling node
    const wireCurve = new KnotCurve(3, 5, 1.55, 0.8)
    const wire = new THREE.Mesh(
      new THREE.TubeGeometry(wireCurve, mobile ? 300 : 600, 0.0085, 5, true),
      new THREE.MeshBasicMaterial({ color: EMBER, transparent: true, opacity: 0.85 }),
    )
    sculpture.add(wire)
    const node = new THREE.Mesh(new THREE.SphereGeometry(0.06, 16, 16), new THREE.MeshBasicMaterial({ color: 0xfff1e6 }))
    sculpture.add(node)

    // ── Twisted blade ring (instanced)
    const SLATS = mobile ? 56 : 96
    const ringR = 2.35
    const slatGeo = new THREE.BoxGeometry(0.035, 0.62, 0.2)
    const slatMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.92, roughness: 0.28, envMapIntensity: 1 })
    const ring = new THREE.InstancedMesh<THREE.BoxGeometry, THREE.Material>(slatGeo, slatMat, SLATS)
    const dummy = new THREE.Object3D()
    const dark = new THREE.Color(0x1c1c1c)
    for (let i = 0; i < SLATS; i++) ring.setColorAt(i, i % 16 === 0 ? EMBER : dark)
    const ringPivot = new THREE.Group()
    ringPivot.rotation.set(1.15, 0.25, 0.2)
    ringPivot.add(ring)
    sculpture.add(ringPivot)

    const layoutSlats = (spread: number, t: number) => {
      const R = ringR + spread * 0.9
      for (let i = 0; i < SLATS; i++) {
        const a = (i / SLATS) * Math.PI * 2
        const wave = Math.sin(a * 3 + t * 0.6) * 0.08
        dummy.position.set(Math.cos(a) * (R + wave), Math.sin(a * 2 + t * 0.4) * 0.05, Math.sin(a) * (R + wave))
        dummy.lookAt(0, dummy.position.y, 0)
        dummy.rotateZ(a * 1.5 + spread * 2)
        dummy.updateMatrix()
        ring.setMatrixAt(i, dummy.matrix)
      }
      ring.instanceMatrix.needsUpdate = true
    }
    layoutSlats(0, 0)

    // ── Lights: warm key, orange rim that follows the pointer
    const key = new THREE.DirectionalLight(0xfff4ea, 2.2)
    key.position.set(4, 5, 6)
    scene.add(key)
    const rim = new THREE.PointLight(EMBER, 60, 14, 1.6)
    rim.position.set(-3, 1, 2)
    scene.add(rim)
    const back = new THREE.DirectionalLight(EMBER, 1.2)
    back.position.set(-5, -2, -6)
    scene.add(back)

    // ── Sizing
    // Stage = the empty grid cell reserved for the object (centre + radius, in 0–1 of canvas height)
    let stage = { x: 0.65, y: 0.45, r: 0.2 }
    let worldH = 1,
      worldW = 1
    const resize = () => {
      const w = canvas.clientWidth,
        h = canvas.clientHeight
      if (!w || !h) return
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      worldH = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z
      worldW = worldH * camera.aspect
      const st = stageRef.current
      if (st) {
        const sr = st.getBoundingClientRect()
        const cr = canvas.getBoundingClientRect()
        const shift = parseFloat(st.closest<HTMLElement>('[data-hero-content]')?.style.translate.split(' ')[1] ?? '0') || 0
        stage = {
          x: (sr.left + sr.width / 2 - cr.left) / cr.width,
          y: (sr.top - shift + sr.height / 2 - cr.top) / cr.height,
          r: (Math.min(sr.width, sr.height) / 2) / cr.height,
        }
      }
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    if (stageRef.current) ro.observe(stageRef.current)
    document.fonts?.ready.then(resize)

    // ── Input
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 }
    const move = (e: PointerEvent) => {
      pointer.tx = (e.clientX / window.innerWidth) * 2 - 1
      pointer.ty = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', move, { passive: true })

    // Drag to spin (mouse/pen only, so touch scrolling stays native)
    const drag = { active: false, lastX: 0, lastY: 0, vy: 0, vx: 0, rotY: 0, rotX: 0 }
    const down = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return
      const t = e.target as HTMLElement
      if (!t.closest('#top') || t.closest('a, button')) return
      drag.active = true
      drag.lastX = e.clientX
      drag.lastY = e.clientY
      document.documentElement.classList.add('is-dragging')
    }
    const dragMove = (e: PointerEvent) => {
      if (!drag.active) return
      drag.vy = (e.clientX - drag.lastX) * 0.006
      drag.vx = (e.clientY - drag.lastY) * 0.004
      drag.lastX = e.clientX
      drag.lastY = e.clientY
    }
    const up = () => {
      drag.active = false
      document.documentElement.classList.remove('is-dragging')
    }
    window.addEventListener('pointerdown', down)
    window.addEventListener('pointermove', dragMove, { passive: true })
    window.addEventListener('pointerup', up)

    let visible = true
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (visible && !raf) raf = requestAnimationFrame(frame)
    })
    io.observe(canvas)

    // ── Loop
    let lastT = performance.now()
    const delta = () => {
      const now = performance.now()
      const d = (now - lastT) / 1000
      lastT = now
      return d
    }
    let raf = 0
    let t = 0
    let intro = 0
    let spread = 0
    const cur = { ...MODES.build, open: 0.8 }
    let wireMode = false
    let fpsAcc = 0,
      fpsFrames = 0,
      fps = 60,
      statT = 0,
      spin = 0
    const tmpV = new THREE.Vector3()
    const frame = () => {
      raf = 0
      const dt = Math.min(delta(), 0.05)
      if (!reduced) t += dt
      if (readyRef.current) intro = Math.min(1, intro + dt / 2.2)
      const ease = 1 - Math.pow(1 - intro, 4)

      const scroll = Math.min(1, Math.max(0, window.scrollY / window.innerHeight))
      spread += (scroll - spread) * 0.08

      pointer.x += (pointer.tx - pointer.x) * 0.05
      pointer.y += (pointer.ty - pointer.y) * 0.05

      // Ease toward the selected mode
      const mode = modeRef.current
      const target = MODES[mode]
      const k = 1 - Math.pow(0.04, dt)
      cur.open += (target.open - cur.open) * k
      cur.speed += (target.speed - cur.speed) * k
      cur.jitter += (target.jitter - cur.jitter) * k
      cur.heat += (target.heat - cur.heat) * k
      cur.ring += (target.ring - cur.ring) * k
      const wantWire = mode === 'document'
      if (wantWire !== wireMode) {
        wireMode = wantWire
        for (const f of fragments)
          f.mesh.material = wireMode ? (f.accent ? blueprintEmber : blueprint) : f.accent ? emberMetal : metal
        ring.material = wireMode ? blueprint : slatMat
      }

      // Drag inertia
      drag.rotY += drag.vy
      drag.rotX = THREE.MathUtils.clamp(drag.rotX + drag.vx, -0.9, 0.9)
      if (!drag.active) {
        drag.vy *= 0.93
        drag.vx *= 0.9
        drag.rotX *= 0.985
      }
      if (!reduced) spin += dt * cur.speed

      const base = (worldH * stage.r * 0.96) / EXTENT
      const s = base * (0.72 + 0.28 * ease) * (1 - spread * 0.12)
      root.scale.setScalar(s)
      const shake = reduced ? 0 : cur.jitter * 0.025
      root.position.set(
        worldW * (stage.x - 0.5) + Math.sin(t * 47) * shake * s,
        -worldH * (stage.y - 0.5) + spread * worldH * 0.12 + Math.cos(t * 53) * shake * s,
        0,
      )

      sculpture.rotation.y = spin + drag.rotY + pointer.x * 0.35 + (1 - ease) * -1.6 + spread * 1.2
      sculpture.rotation.x = 0.35 + drag.rotX + pointer.y * 0.25 + Math.sin(t * 0.3) * 0.06 + spread * 0.6
      sculpture.rotation.z = Math.sin(t * 0.2) * 0.08

      const breathe = reduced ? 0 : (Math.sin(t * 0.9) * 0.5 + 0.5) * 0.04
      const open = cur.open + spread * 0.9 + breathe + (1 - ease) * 0.5
      for (const f of fragments) {
        const j = cur.jitter * 0.05 * Math.sin(t * 31 + f.phase)
        f.mesh.position.copy(f.dir).multiplyScalar(open + j)
        f.mesh.rotation.set(f.spin.x * open + j, f.spin.y * open, f.spin.z * open - j)
      }
      emberMetal.emissiveIntensity = 0.2 + cur.heat * 0.6 + (cur.jitter > 0.5 ? Math.sin(t * 18) * 0.25 : 0)
      ringPivot.rotation.y = 0.25 + t * 0.1
      ringPivot.rotation.x = 1.15 - spread * 0.5
      layoutSlats(spread + cur.ring, t)

      wireCurve.getPoint((t * 0.035) % 1, tmpV)
      node.position.copy(tmpV)

      rim.position.set(pointer.x * 4.5 + Math.sin(t * 0.5) * 1.2, -pointer.y * 3 + 1, 3)
      rim.intensity = 30 + cur.heat * 32 + Math.sin(t * 1.3) * 8

      // Live readouts (~8 Hz)
      fpsAcc += dt
      fpsFrames++
      if (fpsAcc > 0.5) {
        fps = Math.round(fpsFrames / fpsAcc)
        fpsAcc = 0
        fpsFrames = 0
      }
      statT += dt
      if (statT > 0.12) {
        statT = 0
        const deg = ((((sculpture.rotation.y * 180) / Math.PI) % 360) + 360) % 360
        const vals = [
          `${String(Math.round(deg)).padStart(3, '0')}°`,
          open.toFixed(2),
          `${Math.round(cur.heat * 60)}%`,
          String(Math.min(fps, 120)),
        ]
        for (const el of statsRef.current) {
          el.querySelectorAll<HTMLElement>('[data-stat]').forEach((n, i) => (n.textContent = vals[i] ?? ''))
        }
      }

      renderer.render(scene, camera)
      if (visible && !document.hidden) raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    const vis = () => {
      if (!document.hidden && visible && !raf) {
        delta()
        raf = requestAnimationFrame(frame)
      }
    }
    document.addEventListener('visibilitychange', vis)
    const kick = () => {
      if (reduced && !raf) raf = requestAnimationFrame(frame)
    }
    window.addEventListener('scroll', kick, { passive: true })

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('pointermove', dragMove)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('scroll', kick)
      document.removeEventListener('visibilitychange', vis)
      scene.traverse((o) => {
        if (o instanceof THREE.Mesh) o.geometry.dispose()
      })
      ;[metal, emberMetal, slatMat, blueprint, blueprintEmber].forEach((m) => m.dispose())
      envTex.dispose()
      pmrem.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="absolute inset-0 h-full w-full transition-opacity duration-[2000ms] ease-out"
      style={{ opacity: ready ? 1 : 0 }}
    />
  )
}
