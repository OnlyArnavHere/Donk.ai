'use client'

import { useEffect, useState } from 'react'
import { CircuitBoard, Loader2 } from 'lucide-react'

// KiCanvas ships as a bundled ES module (no npm package during alpha) that
// registers the <kicanvas-embed>/<kicanvas-source> custom elements on load.
// https://kicanvas.org/embedding/
const KICANVAS_SRC = 'https://kicanvas.org/kicanvas/kicanvas.js'

// React 19 custom-element typings for the KiCanvas web components
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'kicanvas-embed': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string
        controls?: 'none' | 'basic' | 'full'
        controlslist?: string
        theme?: 'kicad' | 'witchhazel'
        zoom?: string
      }
      'kicanvas-source': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string
        type?: 'schematic' | 'board' | 'project' | 'worksheet'
        name?: string
      }
    }
  }
}

// Load the script exactly once, shared across every viewer instance
let kicanvasLoader: Promise<void> | null = null
function loadKiCanvas(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve()
  if (customElements.get('kicanvas-embed')) return Promise.resolve()
  if (!kicanvasLoader) {
    kicanvasLoader = new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.type = 'module'
      script.src = KICANVAS_SRC
      script.onload = () => resolve()
      script.onerror = () => {
        kicanvasLoader = null
        script.remove()
        reject(new Error('Failed to load KiCanvas'))
      }
      document.head.appendChild(script)
    })
  }
  return kicanvasLoader
}

interface KiCanvasViewerProps {
  /** Raw KiCad file contents (.kicad_pcb or .kicad_sch) rendered inline */
  source: string
  /** File name KiCanvas uses to link documents & label downloads */
  name?: string
  type?: 'board' | 'schematic'
  controls?: 'none' | 'basic' | 'full'
}

export function KiCanvasViewer({
  source,
  name = 'board.kicad_pcb',
  type = 'board',
  controls = 'full',
}: KiCanvasViewerProps) {
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  useEffect(() => {
    let mounted = true
    loadKiCanvas()
      .then(() => mounted && setStatus('ready'))
      .catch(() => mounted && setStatus('error'))
    return () => {
      mounted = false
    }
  }, [])

  if (status === 'error') {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-muted-foreground">
        <CircuitBoard className="h-8 w-8" />
        <p className="text-sm">Could not load the KiCanvas viewer.</p>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em]">Check your network connection and reload</p>
      </div>
    )
  }

  if (status === 'loading') {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin" />
        <p className="font-mono text-[10px] uppercase tracking-[0.18em]">Loading KiCanvas engine…</p>
      </div>
    )
  }

  return (
    // Keyed on source: KiCanvas reads inline sources once on connect, so a
    // fresh mount is the reliable way to re-render edited board files
    <kicanvas-embed
      key={source}
      controls={controls}
      controlslist="nooverlay"
      style={{ display: 'block', width: '100%', height: '100%' }}
    >
      <kicanvas-source type={type} name={name}>
        {source}
      </kicanvas-source>
    </kicanvas-embed>
  )
}
