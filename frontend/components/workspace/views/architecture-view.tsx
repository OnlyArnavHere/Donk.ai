'use client'

import { useMemo } from 'react'
import { HardwareCanvas } from './hardware/hardware-canvas'
import { toHardwareSpec } from './hardware/normalize'
import type { HardwareSpec } from './hardware/types'
import sampleSpec from './hardware/hardware-spec.json'

export function ArchitectureView({ projectId: _projectId }: { projectId?: string } = {}) {
  // Placeholder data source — the AI Architecture Agent's result (same shape as
  // ai_engine/architecture_result.json) will be fetched per project later and
  // passed through toHardwareSpec() the exact same way
  const spec = useMemo(() => toHardwareSpec(sampleSpec) as HardwareSpec, [])

  // Full-bleed canvas — the tab bar already labels the view and the canvas
  // overlay carries the board name, so no page header eating vertical space
  return (
    <div className="h-full w-full">
      <HardwareCanvas spec={spec} />
    </div>
  )
}
