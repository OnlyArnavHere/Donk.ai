'use client'

import { memo } from 'react'
import { BaseEdge, EdgeLabelRenderer, getSmoothStepPath, type EdgeProps } from '@xyflow/react'
import type { BusFlowEdge, BusClass } from './types'

/** Stroke + label styling per physical bus class */
const BUS_STYLE: Record<BusClass, { stroke: string; width: number; dash?: string; labelClass: string }> = {
  // Power rails: thick amber, dashed
  power: {
    stroke: '#f59e0b',
    width: 2.5,
    dash: '8 4',
    labelClass: 'border-amber-400/40 bg-amber-400/10 text-amber-600 dark:text-amber-300',
  },
  // High-speed data: cyan with animated marching dashes
  data: {
    stroke: '#22d3ee',
    width: 1.75,
    labelClass: 'border-cyan-400/40 bg-cyan-400/10 text-cyan-600 dark:text-cyan-300',
  },
  // Control buses: subtle grey step traces
  control: {
    stroke: '#94a3b8',
    width: 1.25,
    labelClass: 'border-border bg-background/90 text-muted-foreground',
  },
}

export const BusEdge = memo(
  ({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data, label, markerEnd }: EdgeProps<BusFlowEdge>) => {
    const busClass: BusClass = data?.busClass || 'control'
    const active = !!data?.active
    const dimmed = !!data?.dimmed
    const s = BUS_STYLE[busClass]

    const [path, labelX, labelY] = getSmoothStepPath({
      sourceX,
      sourceY,
      targetX,
      targetY,
      sourcePosition,
      targetPosition,
      borderRadius: 6,
    })

    return (
      <>
        <BaseEdge
          id={id}
          path={path}
          markerEnd={markerEnd}
          className={busClass === 'data' ? 'hw-edge-data' : undefined}
          style={{
            stroke: s.stroke,
            strokeWidth: active ? s.width + 1 : s.width,
            strokeDasharray: busClass === 'data' ? '6 6' : s.dash,
            opacity: dimmed ? 0.12 : active ? 1 : 0.65,
            filter: active ? `drop-shadow(0 0 5px ${s.stroke})` : undefined,
            transition: 'opacity 0.25s, stroke-width 0.25s',
          }}
        />
        {/* Pulse travelling along active high-speed traces */}
        {busClass === 'data' && !dimmed && (
          <circle r={active ? 3.5 : 2.5} fill={s.stroke} opacity={active ? 1 : 0.7}>
            <animateMotion dur={active ? '1.2s' : '2.4s'} repeatCount="indefinite" path={path} />
          </circle>
        )}
        {label && (
          <EdgeLabelRenderer>
            <div
              className={`pointer-events-none absolute rounded border px-1.5 py-0.5 font-mono text-[9px] backdrop-blur transition-opacity duration-300 ${s.labelClass}`}
              style={{
                transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
                opacity: dimmed ? 0.1 : 1,
              }}
            >
              {String(label)}
            </div>
          </EdgeLabelRenderer>
        )}
      </>
    )
  }
)
BusEdge.displayName = 'BusEdge'

export const edgeTypes = { bus: BusEdge }
