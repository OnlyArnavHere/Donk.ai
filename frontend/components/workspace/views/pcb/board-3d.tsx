'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// ---------------------------------------------------------------------------
// Minimal .kicad_pcb s-expression parsing — enough geometry for a 3D preview
// (board slab, pads, component bodies, tracks, vias). KiCanvas has no 3D view
// yet, so this renders an approximate board with three.js.
// ---------------------------------------------------------------------------

type SExpr = string | SExpr[]

function parseSExpr(src: string): SExpr[] {
  const tokens = src.match(/"(?:[^"\\]|\\.)*"|[()]|[^\s()"]+/g) || []
  let i = 0
  const parseList = (): SExpr[] => {
    const list: SExpr[] = []
    while (i < tokens.length) {
      const t = tokens[i++]
      if (t === '(') list.push(parseList())
      else if (t === ')') return list
      else list.push(t.startsWith('"') ? t.slice(1, -1) : t)
    }
    return list
  }
  // top level: expect single (kicad_pcb ...) form
  while (i < tokens.length) {
    if (tokens[i++] === '(') return parseList()
  }
  return []
}

const num = (v: SExpr | undefined) => (typeof v === 'string' ? parseFloat(v) : NaN)
const isForm = (e: SExpr, name: string): e is SExpr[] => Array.isArray(e) && e[0] === name
const find = (list: SExpr[], name: string) => list.find((e): e is SExpr[] => isForm(e, name))
const findAll = (list: SExpr[], name: string) => list.filter((e): e is SExpr[] => isForm(e, name))

interface ParsedPad {
  dx: number
  dy: number
  rot: number
  w: number
  h: number
  thru: boolean
  drill: number
}
interface ParsedFootprint {
  x: number
  y: number
  rot: number
  pads: ParsedPad[]
  body: { w: number; h: number } | null
}
interface ParsedBoard {
  outline: { x: number; y: number; w: number; h: number }
  footprints: ParsedFootprint[]
  segments: { x1: number; y1: number; x2: number; y2: number; w: number; back: boolean }[]
  vias: { x: number; y: number; size: number; drill: number }[]
}

function parseBoard(source: string): ParsedBoard {
  const root = parseSExpr(source)
  const board: ParsedBoard = {
    outline: { x: 0, y: 0, w: 80, h: 50 },
    footprints: [],
    segments: [],
    vias: [],
  }

  // Edge.Cuts rectangle → board outline (fallback keeps the default)
  for (const rect of findAll(root, 'gr_rect')) {
    const layer = find(rect, 'layer')
    if (!layer || layer[1] !== 'Edge.Cuts') continue
    const s = find(rect, 'start')
    const e = find(rect, 'end')
    if (!s || !e) continue
    const x1 = num(s[1]), y1 = num(s[2]), x2 = num(e[1]), y2 = num(e[2])
    board.outline = { x: Math.min(x1, x2), y: Math.min(y1, y2), w: Math.abs(x2 - x1), h: Math.abs(y2 - y1) }
  }

  for (const fp of findAll(root, 'footprint')) {
    const at = find(fp, 'at')
    if (!at) continue
    const parsed: ParsedFootprint = {
      x: num(at[1]),
      y: num(at[2]),
      rot: num(at[3]) || 0,
      pads: [],
      body: null,
    }
    for (const pad of findAll(fp, 'pad')) {
      const pAt = find(pad, 'at')
      const pSize = find(pad, 'size')
      if (!pAt || !pSize) continue
      const drill = find(pad, 'drill')
      parsed.pads.push({
        dx: num(pAt[1]),
        dy: num(pAt[2]),
        rot: num(pAt[3]) || 0,
        w: num(pSize[1]),
        h: num(pSize[2]) || num(pSize[1]),
        thru: pad.includes('thru_hole'),
        drill: drill ? num(drill[1]) : 0,
      })
    }
    // silkscreen fp_rect approximates the component body
    const bodyRect = find(fp, 'fp_rect')
    if (bodyRect) {
      const s = find(bodyRect, 'start')
      const e = find(bodyRect, 'end')
      if (s && e) parsed.body = { w: Math.abs(num(e[1]) - num(s[1])), h: Math.abs(num(e[2]) - num(s[2])) }
    }
    board.footprints.push(parsed)
  }

  for (const seg of findAll(root, 'segment')) {
    const s = find(seg, 'start')
    const e = find(seg, 'end')
    const w = find(seg, 'width')
    const layer = find(seg, 'layer')
    if (!s || !e || !w) continue
    board.segments.push({
      x1: num(s[1]), y1: num(s[2]), x2: num(e[1]), y2: num(e[2]),
      w: num(w[1]),
      back: !!layer && layer[1] === 'B.Cu',
    })
  }

  for (const via of findAll(root, 'via')) {
    const at = find(via, 'at')
    const size = find(via, 'size')
    if (!at || !size) continue
    const drill = find(via, 'drill')
    board.vias.push({ x: num(at[1]), y: num(at[2]), size: num(size[1]), drill: drill ? num(drill[1]) : 0.4 })
  }

  return board
}

// ---------------------------------------------------------------------------
// three.js scene — KiCad mm map 1:1 to scene units, Y-down board coords map
// onto the XZ plane (three Y is board thickness)
// ---------------------------------------------------------------------------

const BOARD_T = 1.6
const COLORS = {
  mask: 0x0e5c2e,
  maskEdge: 0x0a4a24,
  pad: 0xd8b34a,
  track: 0xc9a03c,
  body: 0x26262e,
  drill: 0x101014,
}

function rotate(dx: number, dy: number, deg: number): [number, number] {
  const a = (-deg * Math.PI) / 180 // y-down board coords
  return [dx * Math.cos(a) - dy * Math.sin(a), dx * Math.sin(a) + dy * Math.cos(a)]
}

function buildScene(board: ParsedBoard): THREE.Group {
  const group = new THREE.Group()
  const { x, y, w, h } = board.outline
  const cx = x + w / 2
  const cy = y + h / 2
  const toScene = (px: number, py: number): [number, number] => [px - cx, py - cy]

  const maskMat = new THREE.MeshStandardMaterial({ color: COLORS.mask, roughness: 0.85 })
  const padMat = new THREE.MeshStandardMaterial({ color: COLORS.pad, roughness: 0.35, metalness: 0.8 })
  const trackMat = new THREE.MeshStandardMaterial({ color: COLORS.track, roughness: 0.5, metalness: 0.6 })
  const bodyMat = new THREE.MeshStandardMaterial({ color: COLORS.body, roughness: 0.6 })
  const drillMat = new THREE.MeshStandardMaterial({ color: COLORS.drill, roughness: 0.9 })

  // Board slab
  const slab = new THREE.Mesh(new THREE.BoxGeometry(w, BOARD_T, h), maskMat)
  group.add(slab)

  const top = BOARD_T / 2

  for (const fp of board.footprints) {
    const [fx, fz] = toScene(fp.x, fp.y)

    for (const pad of fp.pads) {
      const [rdx, rdz] = rotate(pad.dx, pad.dy, fp.rot)
      const px = fx + rdx
      const pz = fz + rdz
      if (pad.thru) {
        const ring = new THREE.Mesh(
          new THREE.CylinderGeometry(pad.w / 2, pad.w / 2, BOARD_T + 0.15, 24),
          padMat
        )
        ring.position.set(px, 0, pz)
        group.add(ring)
        if (pad.drill > 0) {
          const hole = new THREE.Mesh(
            new THREE.CylinderGeometry(pad.drill / 2, pad.drill / 2, BOARD_T + 0.25, 24),
            drillMat
          )
          hole.position.set(px, 0, pz)
          group.add(hole)
        }
      } else {
        const smd = new THREE.Mesh(new THREE.BoxGeometry(pad.w, 0.08, pad.h), padMat)
        smd.position.set(px, top + 0.04, pz)
        smd.rotation.y = ((fp.rot + pad.rot) * Math.PI) / 180
        group.add(smd)
      }
    }

    // Component body (SMD parts with a silkscreen outline)
    if (fp.body && fp.pads.some((p) => !p.thru)) {
      const bodyH = Math.min(2.2, Math.max(1, Math.min(fp.body.w, fp.body.h) * 0.22))
      const body = new THREE.Mesh(new THREE.BoxGeometry(fp.body.w, bodyH, fp.body.h), bodyMat)
      body.position.set(fx, top + bodyH / 2, fz)
      body.rotation.y = (fp.rot * Math.PI) / 180
      group.add(body)
    }
  }

  for (const seg of board.segments) {
    const [x1, z1] = toScene(seg.x1, seg.y1)
    const [x2, z2] = toScene(seg.x2, seg.y2)
    const len = Math.hypot(x2 - x1, z2 - z1)
    if (len === 0) continue
    const track = new THREE.Mesh(new THREE.BoxGeometry(len, 0.05, seg.w), trackMat)
    track.position.set((x1 + x2) / 2, seg.back ? -top - 0.025 : top + 0.025, (z1 + z2) / 2)
    track.rotation.y = -Math.atan2(z2 - z1, x2 - x1)
    group.add(track)
  }

  for (const via of board.vias) {
    const [vx, vz] = toScene(via.x, via.y)
    const barrel = new THREE.Mesh(
      new THREE.CylinderGeometry(via.size / 2, via.size / 2, BOARD_T + 0.12, 20),
      padMat
    )
    barrel.position.set(vx, 0, vz)
    group.add(barrel)
    const hole = new THREE.Mesh(
      new THREE.CylinderGeometry(via.drill / 2, via.drill / 2, BOARD_T + 0.2, 20),
      drillMat
    )
    hole.position.set(vx, 0, vz)
    group.add(hole)
  }

  return group
}

export function Board3D({ source }: { source: string }) {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const board = parseBoard(source)
    const { w, h } = board.outline
    const diag = Math.hypot(w, h)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, diag * 10)
    camera.position.set(0, diag * 0.65, diag * 0.75)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    mount.appendChild(renderer.domElement)

    scene.add(new THREE.AmbientLight(0xffffff, 0.55))
    const key = new THREE.DirectionalLight(0xffffff, 1.6)
    key.position.set(diag, diag * 1.5, diag * 0.8)
    scene.add(key)
    const fill = new THREE.DirectionalLight(0x8899ff, 0.4)
    fill.position.set(-diag, -diag, -diag * 0.5)
    scene.add(fill)

    scene.add(buildScene(board))

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.08
    controls.maxDistance = diag * 4
    controls.minDistance = diag * 0.25

    let raf = 0
    const tick = () => {
      controls.update()
      renderer.render(scene, camera)
      raf = requestAnimationFrame(tick)
    }
    tick()

    const resize = () => {
      const { clientWidth, clientHeight } = mount
      if (!clientWidth || !clientHeight) return
      camera.aspect = clientWidth / clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(clientWidth, clientHeight)
    }
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(mount)

    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
      controls.dispose()
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose()
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material]
          mats.forEach((m) => m.dispose())
        }
      })
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [source])

  return <div ref={mountRef} className="h-full w-full" />
}
