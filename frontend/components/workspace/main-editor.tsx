'use client'

import React from 'react'
import { ChatInterface } from './chat-interface'
import { RequirementsView } from './views/requirements-view'
import { ArchitectureView } from './views/architecture-view'
import { BOMView } from './views/bom-view'
import { ValidationView } from './views/validation-view'
import { DocsView } from './views/docs-view'
import { PcbView } from './views/pcb-view'
import { NewProjectChat } from './new-project-chat'
import { useWorkspaceStore } from '@/lib/store'

const tabs = [
  { id: 'chat', label: 'Chat' },
  { id: 'pcb', label: 'PCB' },
  { id: 'requirements', label: 'Requirements' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'bom', label: 'BOM' },
  { id: 'validation', label: 'Validation' },
  { id: 'docs', label: 'Docs' },
]

export function MainEditor() {
  const { activeProjectId, activeTab, setActiveTab } = useWorkspaceStore()

  // Gemini-style hero chat: first prompt creates the project and starts the agent
  if (!activeProjectId) {
    return <NewProjectChat />
  }

  const viewComponents: Record<string, React.ReactNode> = {
    chat: <ChatInterface projectId={activeProjectId} />,
    requirements: <RequirementsView projectId={activeProjectId} />,
    architecture: <ArchitectureView projectId={activeProjectId} />,
    bom: <BOMView projectId={activeProjectId} />,
    validation: <ValidationView projectId={activeProjectId} />,
    docs: <DocsView projectId={activeProjectId} />,
    pcb: <PcbView projectId={activeProjectId} />,
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-background/50 via-background/40 to-background/50">
      {/* View Tabs */}
      <div className="border-b border-foreground/10 px-8 pt-6">
        <div className="flex items-center gap-2 pb-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium transition-all duration-300 whitespace-nowrap relative group active:scale-95 ${
                activeTab === tab.id
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground active:text-foreground'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {viewComponents[activeTab] || <ChatInterface projectId={activeProjectId} />}
      </div>
    </div>
  )
}
