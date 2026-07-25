'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Paperclip, Zap, Loader, Copy, Download } from 'lucide-react';
import { ChatInterface } from './chat-interface';
import { RequirementsView } from './views/requirements-view';
import { ArchitectureView } from './views/architecture-view';
import { BOMView } from './views/bom-view';
import { ValidationView } from './views/validation-view';
import { DocsView } from './views/docs-view';
import { PcbView } from './views/pcb-view';

interface MainEditorProps {
  activeProject: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function MainEditor({ activeProject, activeTab, setActiveTab }: MainEditorProps) {
  const viewComponents: Record<string, React.ReactNode> = {
    chat: <ChatInterface projectId={activeProject} />,
    requirements: <RequirementsView projectId={activeProject} />,
    architecture: <ArchitectureView projectId={activeProject} />,
    bom: <BOMView projectId={activeProject} />,
    validation: <ValidationView projectId={activeProject} />,
    docs: <DocsView projectId={activeProject} />,
    pcb: <PcbView />,
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-background/50 via-background/40 to-background/50">
      {/* View Tabs */}
      <div className="border-b border-foreground/10 px-8 pt-6">
        <div className="flex items-center gap-2 pb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-2 text-sm font-medium transition-all duration-300 whitespace-nowrap relative group active:scale-95 ${
              activeTab === 'chat'
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground active:text-foreground'
            }`}
          >
            Chat
            {activeTab === 'chat' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground rounded-full" />
            )}
          </button>
          <button onClick={() => setActiveTab('pcb')} className={`px-4 py-2 text-sm font-medium transition-all duration-300 whitespace-nowrap relative ${activeTab === 'pcb' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>PCB{activeTab === 'pcb' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent rounded-full" />}</button>
          <button
            onClick={() => setActiveTab('requirements')}
            className={`px-4 py-2 text-sm font-medium transition-all duration-300 whitespace-nowrap relative group active:scale-95 ${
              activeTab === 'requirements'
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground active:text-foreground'
            }`}
          >
            Requirements
            {activeTab === 'requirements' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-4 py-2 text-sm font-medium transition-all duration-300 whitespace-nowrap relative group active:scale-95 ${
              activeTab === 'architecture'
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground active:text-foreground'
            }`}
          >
            Architecture
            {activeTab === 'architecture' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('bom')}
            className={`px-4 py-2 text-sm font-medium transition-all duration-300 whitespace-nowrap relative group active:scale-95 ${
              activeTab === 'bom'
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground active:text-foreground'
            }`}
          >
            BOM
            {activeTab === 'bom' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('validation')}
            className={`px-4 py-2 text-sm font-medium transition-all duration-300 whitespace-nowrap relative group active:scale-95 ${
              activeTab === 'validation'
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground active:text-foreground'
            }`}
          >
            Validation
            {activeTab === 'validation' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('docs')}
            className={`px-4 py-2 text-sm font-medium transition-all duration-300 whitespace-nowrap relative group active:scale-95 ${
              activeTab === 'docs'
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground active:text-foreground'
            }`}
          >
            Docs
            {activeTab === 'docs' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground rounded-full" />
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {viewComponents[activeTab] || <ChatInterface projectId={activeProject} />}
      </div>
    </div>
  );
}
