'use client'

import { useState } from 'react'
import { Download, Maximize2, Plus, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

const initialNodes = [
  { id: 'power', label: 'Power domain', detail: 'BQ27441 · 3.3V rail', x: 8, y: 14, tone: 'text-chart-4 border-chart-4/50' },
  { id: 'mcu', label: 'MCU domain', detail: 'STM32L476 · 1MB flash', x: 39, y: 14, tone: 'text-accent border-accent/50' },
  { id: 'sensor', label: 'Sensor domain', detail: 'TMP117 · I²C', x: 70, y: 14, tone: 'text-chart-3 border-chart-3/50' },
  { id: 'radio', label: 'Connectivity', detail: 'ESP32-S3 · WiFi', x: 39, y: 63, tone: 'text-chart-5 border-chart-5/50' },
]

export function ArchitectureView() {
  const [nodes, setNodes] = useState(initialNodes)
  const [dragging, setDragging] = useState<string | null>(null)
  const move = (event: React.PointerEvent, id: string) => {
    if (dragging !== id) return
    const rect = event.currentTarget.parentElement?.getBoundingClientRect()
    if (!rect) return
    setNodes((current) => current.map((node) => node.id === id ? { ...node, x: Math.max(2, Math.min(78, ((event.clientX - rect.left) / rect.width) * 100 - 10)), y: Math.max(4, Math.min(80, ((event.clientY - rect.top) / rect.height) * 100 - 8)) } : node))
  }
  return <div className="h-full overflow-auto p-6 lg:p-8"><div className="mx-auto max-w-6xl space-y-5"><div className="flex items-start justify-between gap-4"><div><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">System map / interactive canvas</p><h2 className="mt-2 font-display text-4xl">Architecture</h2><p className="mt-2 text-sm text-muted-foreground">Drag domains around to explore the signal path.</p></div><div className="flex gap-2"><Button variant="outline" size="icon" className="rounded-xl" onClick={() => setNodes(initialNodes)}><RotateCcw className="h-4 w-4"/></Button><Button variant="outline" className="rounded-xl"><Download className="mr-2 h-4 w-4"/>Export</Button></div></div><div className="relative h-[520px] overflow-hidden rounded-2xl border border-border bg-secondary/30" onPointerMove={(event) => dragging && move(event, dragging)} onPointerUp={() => setDragging(null)}><div className="absolute inset-0 opacity-30" style={{backgroundImage:'radial-gradient(circle, hsl(var(--muted-foreground)) 1px, transparent 1px)',backgroundSize:'24px 24px'}}/><svg className="pointer-events-none absolute inset-0 h-full w-full"><line x1="18%" y1="23%" x2="48%" y2="23%" stroke="currentColor" className="text-chart-4/50" strokeDasharray="5 5"/><line x1="61%" y1="23%" x2="75%" y2="23%" stroke="currentColor" className="text-chart-3/50" strokeDasharray="5 5"/><line x1="51%" y1="35%" x2="51%" y2="66%" stroke="currentColor" className="text-accent/50" strokeDasharray="5 5"/></svg>{nodes.map((node) => <div key={node.id} onPointerDown={() => setDragging(node.id)} style={{left:`${node.x}%`,top:`${node.y}%`}} className={`absolute w-[180px] cursor-grab select-none rounded-2xl border bg-background/90 p-4 shadow-2xl backdrop-blur active:cursor-grabbing ${node.tone}`}><div className="flex items-center justify-between"><span className="font-mono text-[10px] uppercase tracking-widest opacity-70">{node.id}</span><Maximize2 className="h-3 w-3 opacity-50"/></div><p className="mt-3 text-sm font-medium text-foreground">{node.label}</p><p className="mt-1 text-xs text-muted-foreground">{node.detail}</p></div>)}<button className="absolute bottom-5 right-5 flex items-center gap-2 rounded-xl border border-border bg-background/80 px-3 py-2 text-xs text-muted-foreground hover:text-foreground"><Plus className="h-3.5 w-3.5"/>Add domain</button></div></div></div>
}
