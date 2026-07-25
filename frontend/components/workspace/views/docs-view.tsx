'use client';

import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Download, FileText, ExternalLink } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface DocsViewProps {
  projectId: string;
}

export function DocsView({ projectId }: DocsViewProps) {
  const documents = [
    { title: 'System Architecture', file: 'architecture.pdf', size: '2.3 MB', icon: FileText },
    { title: 'Circuit Schematic', file: 'schematic.pdf', size: '1.8 MB', icon: FileText },
    { title: 'PCB Layout', file: 'pcb_layout.pdf', size: '3.1 MB', icon: FileText },
    { title: 'Component Datasheet Pack', file: 'datasheets.zip', size: '12.4 MB', icon: FileText },
    { title: 'BOM & Suppliers', file: 'bom.xlsx', size: '0.5 MB', icon: FileText },
    { title: 'Validation Report', file: 'validation.pdf', size: '0.8 MB', icon: FileText },
  ];

  return (
    <div className="h-full flex flex-col bg-background">
      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6 pr-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Engineering Design Package</h2>
              <p className="text-xs text-muted-foreground mt-1">Complete manufacturing-ready documentation</p>
            </div>
            <Button variant="default" size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Download className="w-4 h-4 mr-2" />
              Download All
            </Button>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="documents" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-secondary border border-border">
              <TabsTrigger value="documents" className="text-xs">Documents</TabsTrigger>
              <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
              <TabsTrigger value="exports" className="text-xs">Exports</TabsTrigger>
            </TabsList>

            {/* Documents Tab */}
            <TabsContent value="documents" className="space-y-3 mt-4">
              {documents.map((doc, idx) => (
                <div
                  key={idx}
                  className="bg-secondary rounded-lg border border-border p-4 hover:border-accent/50 transition-colors flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <FileText className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{doc.title}</p>
                      <p className="text-xs text-muted-foreground">{doc.file}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">{doc.size}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </TabsContent>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4 mt-4">
              <div className="bg-secondary rounded-lg border border-border p-4">
                <h3 className="font-semibold text-sm mb-3">Project Summary</h3>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  <li className="flex gap-2"><span className="text-accent">→</span> Smart IoT Temperature Sensor with WiFi Connectivity</li>
                  <li className="flex gap-2"><span className="text-accent">→</span> Target: Low-power battery operation (5+ years on AA batteries)</li>
                  <li className="flex gap-2"><span className="text-accent">→</span> PCB Layers: 4-layer (FR-4, 1.6mm thickness)</li>
                  <li className="flex gap-2"><span className="text-accent">→</span> Manufacturing: SMD assembly with pick-and-place compatible footprints</li>
                </ul>
              </div>

              <div className="bg-secondary rounded-lg border border-border p-4">
                <h3 className="font-semibold text-sm mb-3">Key Design Decisions</h3>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  <li className="flex gap-2"><span className="text-accent">✓</span> STM32L476 chosen for ultra-low power consumption (sleep: 1.4μA)</li>
                  <li className="flex gap-2"><span className="text-accent">✓</span> ESP32-S3 for integrated WiFi with antenna on-chip</li>
                  <li className="flex gap-2"><span className="text-accent">✓</span> TMP117 for high-accuracy temperature (±0.1°C)</li>
                  <li className="flex gap-2"><span className="text-accent">✓</span> Separate power domains to minimize cross-talk</li>
                </ul>
              </div>

              <div className="bg-secondary rounded-lg border border-border p-4">
                <h3 className="font-semibold text-sm mb-3">Manufacturing Notes</h3>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  <li className="flex gap-2"><span className="text-accent">→</span> IPC-A-610 Class 2 recommended for quality assurance</li>
                  <li className="flex gap-2"><span className="text-accent">→</span> BGA components: 0.4mm pitch requires X-ray inspection</li>
                  <li className="flex gap-2"><span className="text-accent">→</span> Reflow profile: Lead-free Sn/Ag/Cu (SAC305)</li>
                  <li className="flex gap-2"><span className="text-accent">→</span> Test points included for boundary scan testing</li>
                </ul>
              </div>
            </TabsContent>

            {/* Exports Tab */}
            <TabsContent value="exports" className="space-y-4 mt-4">
              <div className="bg-secondary rounded-lg border border-border p-4">
                <h3 className="font-semibold text-sm mb-4">Export Formats Available</h3>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent"></span>
                    PDF (vector graphics, ideal for documentation)
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent"></span>
                    Gerber RS-274X (CAM file for PCB manufacturing)
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent"></span>
                    STEP 3D models (for mechanical CAD integration)
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent"></span>
                    Netlist (Spice simulation)
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent"></span>
                    JSON (programmatic access to design data)
                  </p>
                </div>
              </div>

              <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                <Download className="w-4 h-4 mr-2" />
                Download Complete Package
              </Button>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  );
}
