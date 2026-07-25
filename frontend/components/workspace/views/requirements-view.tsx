'use client';

import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle, Circle, AlertCircle, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RequirementsViewProps {
  projectId: string;
}

export function RequirementsView({ projectId }: RequirementsViewProps) {
  const requirements = [
    {
      id: '1',
      category: 'Functional',
      title: 'WiFi Connectivity',
      status: 'completed',
      description: '802.11ac with WPA3 security, -10dBm minimum sensitivity',
    },
    {
      id: '2',
      category: 'Functional',
      title: 'Temperature Sensing',
      status: 'completed',
      description: '-40°C to +125°C range, ±1°C accuracy',
    },
    {
      id: '3',
      category: 'Power',
      title: 'Battery Life',
      status: 'in-progress',
      description: 'Minimum 5 years on 2x AA batteries with daily reading',
    },
    {
      id: '4',
      category: 'Physical',
      title: 'Form Factor',
      status: 'pending',
      description: 'Compact rectangular shape, max 80x50x30mm',
    },
    {
      id: '5',
      category: 'Regulatory',
      title: 'FCC Compliance',
      status: 'pending',
      description: 'Must meet FCC Part 15B emissions limits',
    },
  ];

  return (
    <div className="h-full flex flex-col bg-background">
      <ScrollArea className="flex-1">
        <div className="p-6 space-y-4 pr-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold">Project Requirements</h2>
              <p className="text-xs text-muted-foreground mt-1">Analyzed from your description</p>
            </div>
            <Button variant="outline" size="sm" className="border-border text-muted-foreground">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>

          <div className="space-y-3">
            {requirements.map((req) => (
              <div key={req.id} className="bg-secondary rounded-lg border border-border p-4 hover:border-accent/50 transition-colors">
                <div className="flex items-start gap-3">
                  {req.status === 'completed' && (
                    <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  )}
                  {req.status === 'in-progress' && (
                    <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  )}
                  {req.status === 'pending' && (
                    <Circle className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-sm">{req.title}</h3>
                      <span className="text-xs bg-primary/10 text-accent px-2 py-1 rounded">
                        {req.category}
                      </span>
                      <span className="text-xs text-muted-foreground capitalize">
                        {req.status.replace('-', ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">{req.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 mt-6">
            <p className="text-xs text-foreground">
              <strong>Next Step:</strong> Review these requirements with your team. All requirements will be validated during the design phase.
            </p>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
