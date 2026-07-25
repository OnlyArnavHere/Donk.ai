'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Plus,
  MessageSquare,
  Zap,
  Package,
  CheckCircle,
  FileText,
  Settings,
  ChevronRight,
  Search,
  Folder,
  Clock,
  Bookmark,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';

interface SidebarProps {
  activeProject: string;
  setActiveProject: (project: string) => void;
  setActiveTab: (tab: string) => void;
  collapsed?: boolean;
  onToggle?: () => void;
}

export function Sidebar({ activeProject, setActiveProject, setActiveTab, collapsed = false, onToggle }: SidebarProps) {
  const projects = [
    {
      id: 'smart-iot-sensor',
      name: 'Smart IoT Sensor',
      status: 'In Progress',
      icon: Zap,
    },
    {
      id: 'power-management',
      name: 'Power Management',
      status: 'Design Phase',
      icon: Package,
    },
    {
      id: 'wireless-module',
      name: 'Wireless Module',
      status: 'Validation',
      icon: CheckCircle,
    },
  ];

  const tabs = [
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'requirements', label: 'Requirements', icon: FileText },
    { id: 'architecture', label: 'Architecture', icon: Zap },
    { id: 'bom', label: 'BOM', icon: Package },
    { id: 'validation', label: 'Validation', icon: CheckCircle },
    { id: 'docs', label: 'Documentation', icon: FileText },
    { id: 'pcb', label: 'PCB board', icon: Package },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-foreground/10">
        <div className="flex items-center justify-between gap-2 mb-4">
          {!collapsed && <h1 className="text-sm font-display tracking-tight flex items-center gap-2">
            DunkAI
          </h1>}
          <Button onClick={onToggle} size="icon" variant="outline" aria-label={collapsed ? 'Show sidebar' : 'Hide sidebar'} title={collapsed ? 'Show sidebar' : 'Hide sidebar'} className="h-8 w-8 rounded-lg border-border bg-secondary/40 text-foreground hover:bg-secondary">
            {collapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </Button>
        </div>
        
        {!collapsed && <div className="relative group">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 text-muted-foreground transition-colors group-focus-within:text-foreground" />
          <Input
            placeholder="Search..."
            className="pl-8 h-8 bg-background/50 border border-foreground/10 text-xs text-foreground placeholder:text-muted-foreground hover:border-foreground/20 focus:border-foreground/30 transition-all duration-300 rounded-md"
          />
        </div>}
      </div>

      <ScrollArea className="flex-1">
        {/* Projects Section */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            {!collapsed && <p className="text-xs font-semibold uppercase text-sidebar-foreground/50 tracking-wider">Projects</p>}
            <Folder className="w-3 h-3 text-sidebar-foreground/50" />
          </div>

          <div className="space-y-2">
            {projects.map((project) => {
              const Icon = project.icon;
              const isActive = activeProject === project.id;
              return (
                <button
                  key={project.id}
                  onClick={() => setActiveProject(project.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg transition-all duration-300 flex items-start justify-between gap-2 active:scale-95 ${
                    isActive
                      ? 'bg-foreground/10 text-foreground'
                      : 'hover:bg-foreground/5 text-foreground/70 active:bg-foreground/15'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      {!collapsed && <span className="text-xs font-medium truncate">{project.name}</span>}
                    </div>
                    {!collapsed && <p className="text-xs text-sidebar-foreground/60 mt-1">{project.status}</p>}
                  </div>
                  {isActive && !collapsed && <ChevronRight className="w-4 h-4 flex-shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div className="px-4">
          <div className="h-px bg-sidebar-border"></div>
        </div>

        {/* Views Section */}
        <div className="p-4">
          {!collapsed && <p className="text-xs font-semibold uppercase text-sidebar-foreground/50 tracking-wider mb-3">Views</p>}
          <div className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="w-full text-left px-3 py-2 rounded-lg transition-all duration-300 text-foreground hover:bg-foreground/5 hover:text-foreground active:scale-95 active:bg-foreground/10 flex items-center gap-2 text-xs"
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {!collapsed && <span className="font-medium">{tab.label}</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div className="px-4">
          <div className="h-px bg-sidebar-border"></div>
        </div>

        {/* Recent Section */}
        {!collapsed && <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold uppercase text-sidebar-foreground/50 tracking-wider">Recent</p>
            <Clock className="w-3 h-3 text-sidebar-foreground/50" />
          </div>
          <div className="space-y-2 text-xs">
            <div className="px-3 py-2 rounded-lg hover:bg-sidebar-accent transition-colors cursor-pointer">
              <p className="text-sidebar-foreground">Circuit Schematic v3</p>
              <p className="text-sidebar-foreground/50 text-xs mt-1">2h ago</p>
            </div>
            <div className="px-3 py-2 rounded-lg hover:bg-sidebar-accent transition-colors cursor-pointer">
              <p className="text-sidebar-foreground">BOM Analysis</p>
              <p className="text-sidebar-foreground/50 text-xs mt-1">4h ago</p>
            </div>
            <div className="px-3 py-2 rounded-lg hover:bg-sidebar-accent transition-colors cursor-pointer">
              <p className="text-sidebar-foreground">Component Recommendations</p>
              <p className="text-sidebar-foreground/50 text-xs mt-1">1d ago</p>
            </div>
          </div>
        </div>}
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border space-y-2">
        {!collapsed && <Button variant="outline" size="sm" className="w-full text-xs border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent">
          Upgrade
        </Button>}
        {!collapsed && <Button variant="ghost" size="sm" className="w-full text-xs text-sidebar-foreground hover:bg-sidebar-accent flex items-center gap-2">
          <Settings className="w-4 h-4" />
          Settings
        </Button>}
      </div>
    </div>
  );
}
