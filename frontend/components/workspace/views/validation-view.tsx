'use client';

import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Download, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

interface ValidationViewProps {
  projectId: string;
}

export function ValidationView({ projectId }: ValidationViewProps) {
  const validationChecks = [
    {
      id: '1',
      category: 'Electrical Rules',
      title: 'Voltage Compliance',
      status: 'passed',
      details: 'All supply rails within ±5% tolerance',
    },
    {
      id: '2',
      category: 'Electrical Rules',
      title: 'Current Capacity',
      status: 'passed',
      details: 'Trace widths rated for 2x maximum current',
    },
    {
      id: '3',
      category: 'Design Rules',
      title: 'PCB Trace Widths',
      status: 'passed',
      details: 'Minimum 5mil traces with 4mil clearance',
    },
    {
      id: '4',
      category: 'Design Rules',
      title: 'Via Sizes',
      status: 'passed',
      details: '12mil vias with 8mil annular ring',
    },
    {
      id: '5',
      category: 'Thermal Analysis',
      title: 'Junction Temperature',
      status: 'warning',
      details: 'MCU @ 45°C ambient: 78°C (within 100°C max, recommend heatsink)',
    },
    {
      id: '6',
      category: 'Power Analysis',
      title: 'Battery Life Estimate',
      status: 'info',
      details: '5.2 years @ 1 reading/hour with 2x AA batteries',
    },
    {
      id: '7',
      category: 'Component Compatibility',
      title: 'Supply Voltage Mismatch',
      status: 'passed',
      details: 'All components operating within datasheet limits',
    },
    {
      id: '8',
      category: 'Signal Integrity',
      title: 'EMI/EMC Compliance',
      status: 'info',
      details: 'Design meets FCC Part 15B Class B requirements (estimated)',
    },
  ];

  return (
    <div className="h-full flex flex-col bg-background">
      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6 pr-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold">Validation Report</h2>
              <p className="text-xs text-muted-foreground mt-1">8 checks performed</p>
            </div>
            <Button variant="outline" size="sm" className="border-border text-muted-foreground">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-secondary rounded-lg border border-border p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Passed</p>
              <p className="text-3xl font-bold mt-1 text-green-500">6</p>
            </div>
            <div className="bg-secondary rounded-lg border border-border p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Warnings</p>
              <p className="text-3xl font-bold mt-1 text-amber-500">1</p>
            </div>
            <div className="bg-secondary rounded-lg border border-border p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Info</p>
              <p className="text-3xl font-bold mt-1 text-blue-500">1</p>
            </div>
            <div className="bg-secondary rounded-lg border border-border p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Status</p>
              <p className="text-2xl font-bold mt-1 text-green-500">Ready</p>
            </div>
          </div>

          {/* Validation Details */}
          <div className="space-y-3">
            {validationChecks.map((check) => (
              <div
                key={check.id}
                className={`rounded-lg border p-4 ${
                  check.status === 'passed'
                    ? 'bg-green-500/5 border-green-500/20'
                    : check.status === 'warning'
                    ? 'bg-amber-500/5 border-amber-500/20'
                    : 'bg-blue-500/5 border-blue-500/20'
                }`}
              >
                <div className="flex items-start gap-3">
                  {check.status === 'passed' && <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />}
                  {check.status === 'warning' && <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />}
                  {check.status === 'info' && <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />}

                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-sm">{check.title}</h3>
                      <span className="text-xs bg-primary/10 text-accent px-2 py-1 rounded">
                        {check.category}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">{check.details}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 mt-6">
            <p className="text-xs text-foreground">
              <strong>Design Status: Ready for Manufacturing.</strong> All electrical and design rules are satisfied. The design meets regulatory requirements and has been validated for production.
            </p>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
