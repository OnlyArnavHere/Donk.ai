'use client'

import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import {
  Cpu,
  Gauge,
  HardDrive,
  Zap,
  Radio,
  BatteryCharging,
  Activity,
  Wifi,
} from 'lucide-react'
import type { HardwareFlowNode, HardwareKind } from './types'

/* ------------------------------------------------------------------ */
/* Shared chrome                                                       */
/* ------------------------------------------------------------------ */

const ACCENT: Record<HardwareKind, { border: string; text: string; glow: string; chip: string }> = {
  mcu: {
    border: 'border-cyan-400/50',
    text: 'text-cyan-500 dark:text-cyan-400',
    glow: 'shadow-[0_0_24px_-4px_rgba(34,211,238,0.55)]',
    chip: 'bg-cyan-400/10 border-cyan-400/30',
  },
  sensor: {
    border: 'border-emerald-400/50',
    text: 'text-emerald-500 dark:text-emerald-400',
    glow: 'shadow-[0_0_24px_-4px_rgba(52,211,153,0.55)]',
    chip: 'bg-emerald-400/10 border-emerald-400/30',
  },
  memory: {
    border: 'border-violet-400/50',
    text: 'text-violet-500 dark:text-violet-400',
    glow: 'shadow-[0_0_24px_-4px_rgba(167,139,250,0.55)]',
    chip: 'bg-violet-400/10 border-violet-400/30',
  },
  power: {
    border: 'border-amber-400/50',
    text: 'text-amber-500 dark:text-amber-400',
    glow: 'shadow-[0_0_24px_-4px_rgba(251,191,36,0.55)]',
    chip: 'bg-amber-400/10 border-amber-400/30',
  },
  peripheral: {
    border: 'border-pink-400/50',
    text: 'text-pink-500 dark:text-pink-400',
    glow: 'shadow-[0_0_24px_-4px_rgba(244,114,182,0.55)]',
    chip: 'bg-pink-400/10 border-pink-400/30',
  },
}

/** Pin-style connection handles: power top/bottom, data left/right */
function Pins({ accent }: { accent: string }) {
  const cls = `!h-2 !w-2 !rounded-sm !border-none ${accent}`
  return (
    <>
      <Handle id="power-in" type="target" position={Position.Top} className={cls} style={{ background: 'currentColor' }} />
      <Handle id="in" type="target" position={Position.Left} className={cls} style={{ background: 'currentColor' }} />
      <Handle id="out" type="source" position={Position.Right} className={cls} style={{ background: 'currentColor' }} />
      <Handle id="power-out" type="source" position={Position.Bottom} className={cls} style={{ background: 'currentColor' }} />
    </>
  )
}

function Shell({
  kind,
  selected,
  dimmed,
  icon: Icon,
  tag,
  title,
  part,
  inferred,
  children,
}: {
  kind: HardwareKind
  selected?: boolean
  dimmed?: boolean
  icon: React.ComponentType<{ className?: string }>
  tag: string
  title: string
  part?: string
  inferred?: boolean
  children?: React.ReactNode
}) {
  const a = ACCENT[kind]
  return (
    <div
      className={`w-[220px] rounded-lg border bg-background/95 backdrop-blur transition-all duration-300 ${a.border} ${a.text} ${
        selected ? `${a.glow} scale-[1.02]` : 'shadow-lg'
      } ${dimmed ? 'opacity-30' : 'opacity-100'}`}
    >
      <Pins accent={a.text} />
      {/* Header strip */}
      <div className={`flex items-center justify-between gap-2 border-b px-3 py-1.5 ${a.border}`}>
        <span className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.18em]">
          <Icon className="h-3 w-3" />
          {tag}
        </span>
        {inferred && (
          <span className="rounded-sm border border-dashed border-current px-1 font-mono text-[8px] uppercase opacity-70">
            inferred
          </span>
        )}
      </div>
      {/* Body */}
      <div className="px-3 py-2.5">
        <p className="text-sm font-medium text-foreground">{title}</p>
        {part && <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">{part}</p>}
        {children}
      </div>
    </div>
  )
}

function Chip({ kind, children }: { kind: HardwareKind; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 font-mono text-[9px] ${ACCENT[kind].chip}`}>
      {children}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/* Node components                                                     */
/* ------------------------------------------------------------------ */

export const McuNode = memo(({ data, selected }: NodeProps<HardwareFlowNode>) => {
  const { spec, dimmed } = data
  const s = spec.specs || {}
  return (
    <Shell kind="mcu" selected={selected} dimmed={dimmed} icon={Cpu} tag={spec.category || 'SoC / MCU'} title={spec.label} part={spec.part} inferred={spec.inferred}>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {s.clock && <Chip kind="mcu"><Activity className="h-2.5 w-2.5" />{s.clock}</Chip>}
        {s.cores != null && <Chip kind="mcu">{s.cores}×core</Chip>}
        {s.arch && <Chip kind="mcu">{s.arch}</Chip>}
      </div>
    </Shell>
  )
})
McuNode.displayName = 'McuNode'

export const SensorNode = memo(({ data, selected }: NodeProps<HardwareFlowNode>) => {
  const { spec, dimmed } = data
  const s = spec.specs || {}
  return (
    <Shell kind="sensor" selected={selected} dimmed={dimmed} icon={Gauge} tag={spec.category || 'Sensor'} title={spec.label} part={spec.part} inferred={spec.inferred}>
      <div className="mt-2 flex items-center justify-between gap-2">
        {s.signal && <Chip kind="sensor">{s.signal}</Chip>}
        {s.reading && (
          <span className="flex items-center gap-1.5 font-mono text-[10px] text-foreground/80">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            {s.reading}
          </span>
        )}
      </div>
    </Shell>
  )
})
SensorNode.displayName = 'SensorNode'

export const MemoryNode = memo(({ data, selected }: NodeProps<HardwareFlowNode>) => {
  const { spec, dimmed } = data
  const s = spec.specs || {}
  return (
    <Shell kind="memory" selected={selected} dimmed={dimmed} icon={HardDrive} tag={spec.category || 'Memory'} title={spec.label} part={spec.part} inferred={spec.inferred}>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {s.size && <Chip kind="memory">{s.size}</Chip>}
        {s.busWidth && <Chip kind="memory">{s.busWidth}</Chip>}
      </div>
    </Shell>
  )
})
MemoryNode.displayName = 'MemoryNode'

export const PowerNode = memo(({ data, selected }: NodeProps<HardwareFlowNode>) => {
  const { spec, dimmed } = data
  const s = spec.specs || {}
  const Icon = /batt/i.test(spec.label) ? BatteryCharging : Zap
  return (
    <Shell kind="power" selected={selected} dimmed={dimmed} icon={Icon} tag={spec.category || 'Power'} title={spec.label} part={spec.part} inferred={spec.inferred}>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {(s.rails || []).map((rail) => (
          <Chip key={rail} kind="power">{rail}</Chip>
        ))}
      </div>
      {s.draw && s.draw !== '—' && (
        <p className="mt-1.5 font-mono text-[9px] text-muted-foreground">draw: {s.draw}</p>
      )}
    </Shell>
  )
})
PowerNode.displayName = 'PowerNode'

export const PeripheralNode = memo(({ data, selected }: NodeProps<HardwareFlowNode>) => {
  const { spec, dimmed } = data
  const s = spec.specs || {}
  const Icon = s.rf ? Wifi : Radio
  return (
    <Shell kind="peripheral" selected={selected} dimmed={dimmed} icon={Icon} tag={spec.category || 'Comms'} title={spec.label} part={spec.part} inferred={spec.inferred}>
      <div className="mt-2 flex items-center gap-1.5">
        {s.protocol && <Chip kind="peripheral">{s.protocol}</Chip>}
        {s.rf && (
          <span className="flex items-end gap-[2px]" aria-label="RF signal">
            {[3, 5, 7].map((h) => (
              <span key={h} className="w-[3px] animate-pulse rounded-sm bg-pink-400/80" style={{ height: h * 2, animationDelay: `${h * 80}ms` }} />
            ))}
          </span>
        )}
      </div>
    </Shell>
  )
})
PeripheralNode.displayName = 'PeripheralNode'

export const nodeTypes = {
  mcu: McuNode,
  sensor: SensorNode,
  memory: MemoryNode,
  power: PowerNode,
  peripheral: PeripheralNode,
}
