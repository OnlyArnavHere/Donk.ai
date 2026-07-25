import type { Node, Edge } from '@xyflow/react'

/* ------------------------------------------------------------------ */
/* JSON schema — what a hardware-spec.json file looks like             */
/* ------------------------------------------------------------------ */

/** Functional class of a hardware block — drives which custom node renders it */
export type HardwareKind = 'mcu' | 'sensor' | 'memory' | 'power' | 'peripheral'

/** Physical class of a bus/trace — drives edge styling */
export type BusClass = 'power' | 'data' | 'control'

export interface HardwareNodeSpecs {
  /** MCU / SoC */
  clock?: string
  cores?: number
  arch?: string
  /** Sensor */
  signal?: string
  reading?: string
  /** Memory */
  busWidth?: string
  size?: string
  /** Power / PMIC */
  rails?: string[]
  draw?: string
  /** Peripheral / Communication */
  protocol?: string
  rf?: boolean
}

export interface HardwareNodeSpec {
  id: string
  kind: HardwareKind
  label: string
  /** Concrete part number, e.g. "STM32L476RG" */
  part?: string
  /** Passthrough from the AI engine graph */
  category?: string
  inferred?: boolean
  sourceRequirements?: string[]
  specs?: HardwareNodeSpecs
  position?: { x: number; y: number }
}

export interface HardwareEdgeSpec {
  id?: string
  source: string
  target: string
  /** Bus name, e.g. "I2C" | "SPI" | "Power" | "BLE" — classified into a BusClass */
  bus: string
  label?: string
}

export interface HardwareSpec {
  meta?: { name?: string; revision?: string; description?: string }
  nodes: HardwareNodeSpec[]
  edges: HardwareEdgeSpec[]
}

/* ------------------------------------------------------------------ */
/* React Flow payloads                                                 */
/* ------------------------------------------------------------------ */

export type HardwareNodeData = {
  spec: HardwareNodeSpec
  /** True when another node is selected and this one is not connected to it */
  dimmed: boolean
}

export type BusEdgeData = {
  bus: string
  busClass: BusClass
  /** Edge touches the currently selected node — render with glow */
  active: boolean
  /** A selection exists elsewhere — fade this edge out */
  dimmed: boolean
}

export type HardwareFlowNode = Node<HardwareNodeData>
export type BusFlowEdge = Edge<BusEdgeData>

/** Buckets bus names into their physical class */
export function classifyBus(bus: string): BusClass {
  const b = bus.toLowerCase()
  if (/(power|vbat|vcc|vdd|rail|\dv\d?)/.test(b)) return 'power'
  if (/(spi|qspi|pcie|usb|sdio|i2s|audio|rmii|ble|wifi|can|mipi)/.test(b)) return 'data'
  return 'control' // I2C, UART, GPIO, ADC, PWM, ...
}

export const KIND_ACCENTS: Record<HardwareKind, { stroke: string; minimap: string }> = {
  mcu: { stroke: '#22d3ee', minimap: '#22d3ee' },
  sensor: { stroke: '#34d399', minimap: '#34d399' },
  memory: { stroke: '#a78bfa', minimap: '#a78bfa' },
  power: { stroke: '#fbbf24', minimap: '#fbbf24' },
  peripheral: { stroke: '#f472b6', minimap: '#f472b6' },
}
