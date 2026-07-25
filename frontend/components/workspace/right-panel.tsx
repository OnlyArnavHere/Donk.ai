'use client';

import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  CheckCircle,
  Circle,
  AlertCircle,
  Loader,
  Zap,
  Package,
  Wand2,
  FileText,
  Users,
  Clock,
  TrendingUp,
} from 'lucide-react';

interface RightPanelProps {
  activeProject: string;
}

export function RightPanel({ activeProject }: RightPanelProps) {
  const [activeTab, setActiveTab] = useState('agents');

  const agents = [
    {
      id: '1',
      name: 'Requirement Analysis',
      status: 'completed',
      progress: 100,
      description: 'Parsed 12 requirements from description',
    },
    {
      id: '2',
      name: 'Hardware Architecture',
      status: 'completed',
      progress: 100,
      description: 'Designed 3-tier system architecture',
    },
    {
      id: '3',
      name: 'Component Intelligence',
      status: 'completed',
      progress: 100,
      description: 'Selected 27 components from database',
    },
    {
      id: '4',
      name: 'Circuit & PCB Design',
      status: 'in-progress',
      progress: 65,
      description: 'Generating schematics...',
    },
    {
      id: '5',
      name: 'Validation & Optimization',
      status: 'pending',
      progress: 0,
      description: 'Waiting for circuit design',
    },
    {
      id: '6',
      name: 'Documentation',
      status: 'pending',
      progress: 0,
      description: 'Waiting for all agents',
    },
  ];

  const activities = [
    {
      id: '1',
      type: 'design',
      title: 'Circuit Schematic Generated',
      description: 'STM32L4 + ESP32-S3 schematic created',
      time: '2 min ago',
      icon: Zap,
    },
    {
      id: '2',
      type: 'component',
      title: 'Components Selected',
      description: '27 components from DigiKey & Mouser',
      time: '5 min ago',
      icon: Package,
    },
    {
      id: '3',
      type: 'analysis',
      title: 'Architecture Designed',
      description: 'Multi-domain system topology created',
      time: '8 min ago',
      icon: TrendingUp,
    },
    {
      id: '4',
      type: 'requirements',
      title: 'Requirements Extracted',
      description: 'Functional, power, and regulatory specs',
      time: '12 min ago',
      icon: FileText,
    },
  ];

  const collaborators = [
    {
      name: 'You',
      role: 'Owner',
      avatar: 'Y',
      status: 'online',
    },
    {
      name: 'Sarah Chen',
      role: 'Hardware Lead',
      avatar: 'SC',
      status: 'online',
    },
    {
      name: 'Alex Rodriguez',
      role: 'Firmware',
      avatar: 'AR',
      status: 'idle',
    },
    {
      name: 'Maya Patel',
      role: 'Validation',
      avatar: 'MP',
      status: 'offline',
    },
  ];

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-background/40 via-background/30 to-background/40">
      {/* Tabs */}
      <div className="border-b border-foreground/10 px-6 pt-6">
        <div className="flex gap-4 pb-4">
          <button
            onClick={() => setActiveTab('agents')}
            className={`px-3 py-1.5 text-xs font-medium transition-all duration-300 relative ${
              activeTab === 'agents'
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Agents
            {activeTab === 'agents' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-accent via-accent to-accent/50 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`px-3 py-1.5 text-xs font-medium transition-all duration-300 relative ${
              activeTab === 'activity'
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Activity
            {activeTab === 'activity' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-accent via-accent to-accent/50 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('team')}
            className={`px-3 py-1.5 text-xs font-medium transition-all duration-300 relative ${
              activeTab === 'team'
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Team
            {activeTab === 'team' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-accent via-accent to-accent/50 rounded-full" />
            )}
          </button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        {/* Agents Tab */}
        {activeTab === 'agents' && (
          <div className="p-6 space-y-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-mono">
              AI Agent Orchestration
            </p>

            {agents.map((agent) => {
              const Icon = [Zap, Package, Wand2, Zap, AlertCircle, FileText][parseInt(agent.id) - 1] || Circle;
              return (
                <div key={agent.id} className="bg-background/60 border border-foreground/10 rounded-lg p-4 hover:border-accent/40 hover:bg-background/80 transition-all duration-300 group">
                  <div className="flex items-start gap-2 mb-2">
                    <Icon className="w-4 h-4 text-sidebar-primary flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-sidebar-foreground">{agent.name}</p>
                      <p className="text-xs text-sidebar-foreground/60 mt-0.5">{agent.description}</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-sidebar-border rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          agent.status === 'completed'
                            ? 'bg-accent'
                            : agent.status === 'in-progress'
                            ? 'bg-accent'
                            : 'bg-muted'
                        }`}
                        style={{ width: `${agent.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-sidebar-foreground/60 min-w-fit">{agent.progress}%</span>
                  </div>

                  {/* Status Badge */}
                  <div className="mt-2 flex items-center gap-1">
                    {agent.status === 'completed' && (
                      <>
                        <CheckCircle className="w-3 h-3 text-accent" />
                        <span className="text-xs text-accent font-medium">Completed</span>
                      </>
                    )}
                    {agent.status === 'in-progress' && (
                      <>
                        <Loader className="w-3 h-3 text-accent animate-spin" />
                        <span className="text-xs text-accent font-medium">In Progress</span>
                      </>
                    )}
                    {agent.status === 'pending' && (
                      <>
                        <Circle className="w-3 h-3 text-muted" />
                        <span className="text-xs text-sidebar-foreground/50 font-medium">Pending</span>
                      </>
                    )}
                  </div>
                </div>
              );
            })}

            <div className="bg-sidebar-primary/10 border border-sidebar-primary/20 rounded-lg p-3 mt-4">
              <p className="text-xs text-sidebar-foreground">
                <strong>5 of 6 agents complete.</strong> Generating circuit & PCB designs...
              </p>
            </div>
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === 'activity' && (
          <div className="p-4 space-y-3">
            <p className="text-xs text-sidebar-foreground/50 uppercase tracking-wider font-semibold">
              Recent Activity
            </p>

            {activities.map((activity) => {
              const Icon = activity.icon;
              return (
                <div key={activity.id} className="bg-sidebar-accent rounded-lg p-3 hover:bg-sidebar-accent/80 transition-colors">
                  <div className="flex items-start gap-2">
                    <Icon className="w-4 h-4 text-sidebar-primary flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-sidebar-foreground">{activity.title}</p>
                      <p className="text-xs text-sidebar-foreground/60 mt-0.5">{activity.description}</p>
                      <p className="text-xs text-sidebar-foreground/40 mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {activity.time}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Team Tab */}
        {activeTab === 'team' && (
          <div className="p-4 space-y-3">
            <p className="text-xs text-sidebar-foreground/50 uppercase tracking-wider font-semibold">
              Project Collaborators
            </p>

            {collaborators.map((collab, idx) => (
              <div key={idx} className="bg-sidebar-accent rounded-lg p-3 hover:bg-sidebar-accent/80 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    collab.status === 'online' ? 'bg-accent/20 text-accent' :
                    collab.status === 'idle' ? 'bg-amber-500/20 text-amber-500' :
                    'bg-muted text-sidebar-foreground/60'
                  }`}>
                    {collab.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-sidebar-foreground">{collab.name}</p>
                    <p className="text-xs text-sidebar-foreground/60">{collab.role}</p>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${
                    collab.status === 'online' ? 'bg-accent' :
                    collab.status === 'idle' ? 'bg-amber-500' :
                    'bg-muted'
                  }`}></div>
                </div>
              </div>
            ))}

            <Button variant="outline" size="sm" className="w-full border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent mt-4">
              <Users className="w-4 h-4 mr-2" />
              Add Team Member
            </Button>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
