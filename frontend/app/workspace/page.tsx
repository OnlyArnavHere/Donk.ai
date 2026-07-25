'use client';

import React, { useState } from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { TopBar } from '@/components/workspace/top-bar';
import { Sidebar } from '@/components/workspace/sidebar';
import { MainEditor } from '@/components/workspace/main-editor';

export default function WorkspacePage() {
  const [activeProject, setActiveProject] = useState('smart-iot-sensor');
  const [activeTab, setActiveTab] = useState('chat');

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
      
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        {/* Left Sidebar */}
        <ResizablePanel defaultSize={16} minSize={12} maxSize={25} className="border-r border-foreground/10">
          <Sidebar activeProject={activeProject} setActiveProject={setActiveProject} setActiveTab={setActiveTab} />
        </ResizablePanel>

        <ResizableHandle className="w-px bg-gradient-to-b from-foreground/0 via-foreground/10 to-foreground/0 hover:bg-gradient-to-b hover:from-foreground/0 hover:via-foreground/20 hover:to-foreground/0 transition-colors cursor-col-resize" />

        {/* Main Content */}
        <ResizablePanel defaultSize={84} minSize={50} className="relative">
          <MainEditor activeProject={activeProject} activeTab={activeTab} setActiveTab={setActiveTab} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
