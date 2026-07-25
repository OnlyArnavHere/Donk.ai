'use client';

import React, { useState } from 'react';
import { TopBar } from '@/components/workspace/top-bar';
import { Sidebar } from '@/components/workspace/sidebar';
import { MainEditor } from '@/components/workspace/main-editor';

export default function WorkspacePage() {
  const [activeProject, setActiveProject] = useState('smart-iot-sensor');
  const [activeTab, setActiveTab] = useState('chat');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="h-screen w-full flex flex-col bg-background text-foreground relative overflow-hidden noise-overlay">
      {/* Animated Background - Landing Page Style */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background/80" />
        <div className="absolute top-0 right-1/3 w-[800px] h-[800px] bg-foreground/2 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-foreground/2 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '12s' }} />
        <div className="absolute top-1/2 -right-1/4 w-[500px] h-[500px] bg-foreground/1 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s' }} />
      </div>

      <TopBar activeProject={activeProject} />
      
      <div className="flex min-h-0 flex-1">
        <aside className={`shrink-0 border-r border-foreground/10 transition-[width] duration-300 ${sidebarCollapsed ? 'w-[68px]' : 'w-[248px]'}`}>
          <Sidebar activeProject={activeProject} setActiveProject={setActiveProject} setActiveTab={setActiveTab} collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed((value) => !value)} />
        </aside>
        <main className="relative min-w-0 flex-1"><MainEditor activeProject={activeProject} activeTab={activeTab} setActiveTab={setActiveTab} /></main>
      </div>
    </div>
  );
}
