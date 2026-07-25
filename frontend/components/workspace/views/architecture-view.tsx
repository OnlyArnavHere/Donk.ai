'use client';

import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Download, Copy, Eye } from 'lucide-react';

interface ArchitectureViewProps {
  projectId: string;
}

export function ArchitectureView({ projectId }: ArchitectureViewProps) {
  return (
    <div className="h-full flex flex-col bg-background">
      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6 pr-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold">System Architecture</h2>
              <p className="text-xs text-muted-foreground mt-1">Multi-tier hardware design</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="border-border text-muted-foreground">
                <Eye className="w-4 h-4 mr-2" />
                View
              </Button>
              <Button variant="outline" size="sm" className="border-border text-muted-foreground">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Architecture Diagram */}
          <div className="bg-secondary rounded-lg border border-border p-6 overflow-auto">
            <div className="min-w-full">
              <svg viewBox="0 0 600 400" className="w-full h-auto" style={{ minHeight: '300px' }}>
                {/* Power Domain */}
                <rect x="20" y="20" width="120" height="100" fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5,5" rx="8" />
                <text x="30" y="40" fontSize="12" fontWeight="bold" fill="#e5e5e5">Power Domain</text>
                <rect x="30" y="55" width="100" height="25" fill="#1a1a1a" stroke="#3b82f6" strokeWidth="1" rx="4" />
                <text x="40" y="72" fontSize="11" fill="#e5e5e5">Battery Management</text>
                <rect x="30" y="85" width="100" height="25" fill="#1a1a1a" stroke="#3b82f6" strokeWidth="1" rx="4" />
                <text x="40" y="102" fontSize="11" fill="#e5e5e5">Regulator (3.3V)</text>

                {/* MCU Domain */}
                <rect x="200" y="20" width="140" height="100" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="5,5" rx="8" />
                <text x="210" y="40" fontSize="12" fontWeight="bold" fill="#e5e5e5">MCU Domain</text>
                <rect x="210" y="55" width="120" height="25" fill="#1a1a1a" stroke="#8b5cf6" strokeWidth="1" rx="4" />
                <text x="220" y="72" fontSize="11" fill="#e5e5e5">ARM Cortex-M4</text>
                <rect x="210" y="85" width="120" height="25" fill="#1a1a1a" stroke="#8b5cf6" strokeWidth="1" rx="4" />
                <text x="220" y="102" fontSize="11" fill="#e5e5e5">256KB RAM / 1MB Flash</text>

                {/* Sensor Domain */}
                <rect x="410" y="20" width="170" height="100" fill="none" stroke="#ec4899" strokeWidth="2" strokeDasharray="5,5" rx="8" />
                <text x="420" y="40" fontSize="12" fontWeight="bold" fill="#e5e5e5">Sensor Domain</text>
                <rect x="420" y="55" width="150" height="25" fill="#1a1a1a" stroke="#ec4899" strokeWidth="1" rx="4" />
                <text x="430" y="72" fontSize="11" fill="#e5e5e5">Temperature Sensor</text>
                <rect x="420" y="85" width="150" height="25" fill="#1a1a1a" stroke="#ec4899" strokeWidth="1" rx="4" />
                <text x="430" y="102" fontSize="11" fill="#e5e5e5">I2C Interface</text>

                {/* Connectivity Domain */}
                <rect x="200" y="180" width="140" height="100" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="5,5" rx="8" />
                <text x="210" y="200" fontSize="12" fontWeight="bold" fill="#e5e5e5">Connectivity</text>
                <rect x="210" y="215" width="120" height="25" fill="#1a1a1a" stroke="#10b981" strokeWidth="1" rx="4" />
                <text x="220" y="232" fontSize="11" fill="#e5e5e5">WiFi Module (802.11ac)</text>
                <rect x="210" y="245" width="120" height="25" fill="#1a1a1a" stroke="#10b981" strokeWidth="1" rx="4" />
                <text x="220" y="262" fontSize="11" fill="#e5e5e5">Antenna + Matching</text>

                {/* Connections */}
                <line x1="140" y1="70" x2="200" y2="70" stroke="#666" strokeWidth="2" />
                <line x1="340" y1="70" x2="410" y2="70" stroke="#666" strokeWidth="2" />
                <line x1="270" y1="120" x2="270" y2="180" stroke="#666" strokeWidth="2" />
                <line x1="490" y1="120" x2="400" y2="160" stroke="#666" strokeWidth="2" />

                {/* Labels */}
                <text x="165" y="65" fontSize="10" fill="#a0a0a0">SPI</text>
                <text x="370" y="65" fontSize="10" fill="#a0a0a0">I2C</text>
                <text x="275" y="155" fontSize="10" fill="#a0a0a0">Data Bus</text>
              </svg>
            </div>
          </div>

          {/* Design Details */}
          <div className="space-y-4">
            <div className="bg-secondary rounded-lg border border-border p-4">
              <h3 className="font-semibold text-sm mb-3">Component Topology</h3>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li className="flex gap-2"><span className="text-accent">•</span> Primary MCU: STM32L476 (ultra-low power)</li>
                <li className="flex gap-2"><span className="text-accent">•</span> WiFi Module: ESP32-S3 with integrated antenna</li>
                <li className="flex gap-2"><span className="text-accent">•</span> Temperature Sensor: TMP117 (high accuracy)</li>
                <li className="flex gap-2"><span className="text-accent">•</span> Power Management: BQ27441 (fuel gauge IC)</li>
              </ul>
            </div>

            <div className="bg-secondary rounded-lg border border-border p-4">
              <h3 className="font-semibold text-sm mb-3">Communication Protocols</h3>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li className="flex gap-2"><span className="text-accent">•</span> I2C: Sensor interface (100kHz)</li>
                <li className="flex gap-2"><span className="text-accent">•</span> SPI: WiFi module (40MHz)</li>
                <li className="flex gap-2"><span className="text-accent">•</span> UART: Debug/programming</li>
              </ul>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
