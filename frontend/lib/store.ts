import { create } from 'zustand'

interface WorkspaceState {
  activeProjectId: string | null
  activeTab: string
  sidebarCollapsed: boolean
  pendingPrompt: string | null
  setActiveProjectId: (id: string | null) => void
  setActiveTab: (tab: string) => void
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
  setPendingPrompt: (prompt: string | null) => void
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  activeProjectId: null,
  activeTab: 'chat',
  // Sidebar starts hidden — the user expands it on demand
  sidebarCollapsed: true,
  pendingPrompt: null,
  setActiveProjectId: (id) => set({ activeProjectId: id }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  setPendingPrompt: (prompt) => set({ pendingPrompt: prompt }),
}))
