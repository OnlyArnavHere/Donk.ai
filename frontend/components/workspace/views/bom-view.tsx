'use client';

import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Download, Copy, ExternalLink } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface BOMViewProps {
  projectId: string;
}

export function BOMView({ projectId }: BOMViewProps) {
  const bomItems = [
    {
      id: '1',
      designator: 'U1',
      component: 'STM32L476RG',
      qty: 1,
      category: 'MCU',
      supplier: 'DigiKey',
      cost: '$12.45',
      availability: '1250+ in stock',
    },
    {
      id: '2',
      designator: 'U2',
      component: 'ESP32-S3',
      qty: 1,
      category: 'WiFi',
      supplier: 'DigiKey',
      cost: '$8.99',
      availability: '3400+ in stock',
    },
    {
      id: '3',
      designator: 'U3',
      component: 'TMP117',
      qty: 1,
      category: 'Sensor',
      supplier: 'DigiKey',
      cost: '$2.15',
      availability: '5200+ in stock',
    },
    {
      id: '4',
      designator: 'U4',
      component: 'BQ27441',
      qty: 1,
      category: 'Power',
      supplier: 'DigiKey',
      cost: '$3.87',
      availability: '890+ in stock',
    },
    {
      id: '5',
      designator: 'R1-R8',
      component: '10kΩ 0603 SMD',
      qty: 8,
      category: 'Passive',
      supplier: 'DigiKey',
      cost: '$0.08 ea',
      availability: '50k+ in stock',
    },
    {
      id: '6',
      designator: 'C1-C12',
      component: '100nF 0603 X7R',
      qty: 12,
      category: 'Passive',
      supplier: 'DigiKey',
      cost: '$0.05 ea',
      availability: '100k+ in stock',
    },
  ];

  const totalCost = '$32.95';

  return (
    <div className="h-full flex flex-col bg-background">
      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6 pr-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Bill of Materials</h2>
              <p className="text-xs text-muted-foreground mt-1">27 components • {totalCost} estimated</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="border-border text-muted-foreground">
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
              <Button variant="outline" size="sm" className="border-border text-muted-foreground">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-secondary rounded-lg border border-border p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Items</p>
              <p className="text-2xl font-bold mt-1">27</p>
            </div>
            <div className="bg-secondary rounded-lg border border-border p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Estimated Cost</p>
              <p className="text-2xl font-bold mt-1">{totalCost}</p>
            </div>
            <div className="bg-secondary rounded-lg border border-border p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Availability</p>
              <p className="text-2xl font-bold mt-1">100%</p>
            </div>
          </div>

          {/* BOM Table */}
          <div className="bg-secondary rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader className="bg-primary/5">
                <TableRow className="border-b border-border hover:bg-transparent">
                  <TableHead className="h-10 text-xs font-semibold text-muted-foreground">Designator</TableHead>
                  <TableHead className="h-10 text-xs font-semibold text-muted-foreground">Component</TableHead>
                  <TableHead className="h-10 text-xs font-semibold text-muted-foreground text-right">Qty</TableHead>
                  <TableHead className="h-10 text-xs font-semibold text-muted-foreground">Category</TableHead>
                  <TableHead className="h-10 text-xs font-semibold text-muted-foreground">Cost</TableHead>
                  <TableHead className="h-10 text-xs font-semibold text-muted-foreground">Availability</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bomItems.map((item) => (
                  <TableRow key={item.id} className="border-b border-border hover:bg-primary/5 cursor-pointer transition-colors">
                    <TableCell className="h-10 text-xs font-mono text-accent">{item.designator}</TableCell>
                    <TableCell className="h-10 text-xs text-foreground">{item.component}</TableCell>
                    <TableCell className="h-10 text-xs text-muted-foreground text-right">{item.qty}</TableCell>
                    <TableCell className="h-10 text-xs">
                      <span className="bg-primary/10 text-accent px-2 py-1 rounded text-xs">
                        {item.category}
                      </span>
                    </TableCell>
                    <TableCell className="h-10 text-xs font-semibold text-foreground">{item.cost}</TableCell>
                    <TableCell className="h-10 text-xs text-accent">{item.availability}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
            <p className="text-xs text-foreground">
              <strong>All components are available from major distributors.</strong> Click any row to view detailed specs and supplier links.
            </p>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
