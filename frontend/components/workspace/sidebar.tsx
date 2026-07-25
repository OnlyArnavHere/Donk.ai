'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
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
  Clock,
  Star,
  MoreVertical,
  Copy,
  Archive,
  Trash2,
  AlertCircle,
  Loader2,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useWorkspaceStore } from '@/lib/store'
import { useProjects, useToggleFavourite, useArchiveProject, useDuplicateProject, useDeleteProject } from '@/hooks/use-projects'
import type { Project } from '@/lib/types'
import { toast } from 'sonner'

const PROJECT_ICONS = [Zap, Package, CheckCircle, FileText]

function getProjectIcon(_id: string, index: number) {
  return PROJECT_ICONS[index % PROJECT_ICONS.length]
}

function formatRelativeTime(date: string): string {
  const diff = Date.now() - new Date(date).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Date(date).toLocaleDateString()
}

export function Sidebar() {
  const { activeProjectId, setActiveProjectId, activeTab, setActiveTab, sidebarCollapsed, toggleSidebar } = useWorkspaceStore()
  const { data, isLoading, isError } = useProjects()
  const toggleFavourite = useToggleFavourite()
  const archiveProject = useArchiveProject()
  const duplicateProject = useDuplicateProject()
  const deleteProject = useDeleteProject()
  const router = useRouter()

  const [search, setSearch] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null)

  const allProjects = data?.items || []
  const filteredProjects = search
    ? allProjects.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
      )
    : allProjects

  const recentProjects = [...allProjects]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3)

  const tabs = [
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'requirements', label: 'Requirements', icon: FileText },
    { id: 'architecture', label: 'Architecture', icon: Zap },
    { id: 'bom', label: 'BOM', icon: Package },
    { id: 'validation', label: 'Validation', icon: CheckCircle },
    { id: 'docs', label: 'Documentation', icon: FileText },
    { id: 'pcb', label: 'PCB Board', icon: Package },
  ]

  // Projects are created through the AI chat, not a form — the "+" simply
  // clears the active project so the New Project chat is shown
  const handleNewProject = () => {
    setActiveProjectId(null)
    setActiveTab('chat')
  }

  const handleToggleFav = (id: string) => {
    toggleFavourite.mutate(id)
  }

  const handleArchive = (id: string) => {
    archiveProject.mutate(id)
    toast.success('Project archived')
  }

  const handleDuplicate = async (id: string) => {
    try {
      await duplicateProject.mutateAsync(id)
      toast.success('Project duplicated')
    } catch {
      toast.error('Failed to duplicate project')
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    const project = deleteTarget
    setDeleteTarget(null)
    try {
      await deleteProject.mutateAsync(project._id)
      toast.success('Project deleted')
      if (activeProjectId === project._id) {
        setActiveProjectId(null)
      }
    } catch {
      toast.error('Failed to delete project')
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header — brand lives in the top bar, so only the collapse toggle here */}
      <div className="p-4 border-b border-foreground/10">
        <div className={`flex items-center gap-2 mb-4 ${sidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!sidebarCollapsed && (
            <p className="text-xs font-semibold uppercase text-sidebar-foreground/50 tracking-wider">Workspace</p>
          )}
          <Button
            onClick={toggleSidebar}
            size="icon"
            variant="outline"
            aria-label={sidebarCollapsed ? 'Show sidebar' : 'Hide sidebar'}
            title={sidebarCollapsed ? 'Show sidebar' : 'Hide sidebar'}
            className="h-8 w-8 rounded-lg border-border bg-secondary/40 text-foreground hover:bg-secondary"
          >
            <ChevronRight className={`w-4 h-4 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} />
          </Button>
        </div>

        {!sidebarCollapsed && (
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 text-muted-foreground transition-colors group-focus-within:text-foreground" />
            <Input
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-8 bg-background/50 border border-foreground/10 text-xs text-foreground placeholder:text-muted-foreground hover:border-foreground/20 focus:border-foreground/30 transition-all duration-300 rounded-md"
            />
          </div>
        )}
      </div>

      <ScrollArea className="flex-1">
        {/* Projects Section */}
        <div className="p-4">
          <div className={`flex items-center mb-3 ${sidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
                {!sidebarCollapsed && (
                  <p className="text-xs font-semibold uppercase text-sidebar-foreground/50 tracking-wider">Projects</p>
                )}
                <Button
                  onClick={handleNewProject}
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 text-sidebar-foreground/50 hover:text-foreground hover:bg-foreground/5"
                  title="New project"
                >
                  <Plus className="w-3.5 h-3.5" />
                </Button>
          </div>

          {isLoading && (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-4 h-4 rounded" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-2 w-16 mt-2" />
                </div>
              ))}
            </div>
          )}

          {isError && (
            <div className="text-xs text-muted-foreground flex items-center gap-2 px-3 py-2">
              <AlertCircle className="w-3 h-3 text-destructive" />
              Failed to load
            </div>
          )}

          {!isLoading && !isError && filteredProjects.length === 0 && !sidebarCollapsed && (
            <div className="text-xs text-muted-foreground px-3 py-4 text-center">
              {search ? 'No projects found' : 'No projects yet'}
            </div>
          )}

          <div className="space-y-1">
            {filteredProjects.map((project, index) => {
              const Icon = getProjectIcon(project._id, index)
              const isActive = activeProjectId === project._id
              return (
                <div key={project._id} className="group relative">
                  <button
                    onClick={() => setActiveProjectId(project._id)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg transition-all duration-300 flex items-start justify-between gap-2 active:scale-95 ${
                      isActive
                        ? 'bg-foreground/10 text-foreground'
                        : 'hover:bg-foreground/5 text-foreground/70 active:bg-foreground/15'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        {!sidebarCollapsed && (
                          <span className="text-xs font-medium truncate">{project.title}</span>
                        )}
                        {project.isFavourite && !sidebarCollapsed && (
                          <Star className="w-3 h-3 text-amber-500 fill-amber-500 flex-shrink-0" />
                        )}
                      </div>
                      {!sidebarCollapsed && (
                        <p className="text-xs text-sidebar-foreground/60 mt-1 capitalize">
                          {project.status === 'archived' ? 'Archived' : project.currentStage || 'Active'}
                        </p>
                      )}
                    </div>
                    {isActive && !sidebarCollapsed && <ChevronRight className="w-4 h-4 flex-shrink-0" />}
                  </button>

                  {!sidebarCollapsed && (
                    <div className="absolute right-1 top-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6 text-sidebar-foreground/50 hover:text-foreground hover:bg-foreground/10"
                          >
                            <MoreVertical className="w-3 h-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-background/95 backdrop-blur-xl border border-foreground/10">
                          <DropdownMenuItem
                            onClick={() => handleToggleFav(project._id)}
                            className="text-xs cursor-pointer hover:bg-background/50"
                          >
                            <Star className={`w-3 h-3 mr-2 ${project.isFavourite ? 'fill-amber-500 text-amber-500' : ''}`} />
                            {project.isFavourite ? 'Unfavorite' : 'Favorite'}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDuplicate(project._id)}
                            className="text-xs cursor-pointer hover:bg-background/50"
                          >
                            <Copy className="w-3 h-3 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleArchive(project._id)}
                            className="text-xs cursor-pointer hover:bg-background/50"
                          >
                            <Archive className="w-3 h-3 mr-2" />
                            Archive
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-foreground/10" />
                          <DropdownMenuItem
                            onClick={() => setDeleteTarget(project)}
                            className="text-xs cursor-pointer text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="w-3 h-3 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Divider */}
        <div className="px-4">
          <div className="h-px bg-sidebar-border"></div>
        </div>

        {/* Views Section */}
        <div className="p-4">
          {!sidebarCollapsed && (
            <p className="text-xs font-semibold uppercase text-sidebar-foreground/50 tracking-wider mb-3">Views</p>
          )}
          <div className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActiveTab = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-300 hover:bg-foreground/5 active:scale-95 flex items-center gap-2 text-xs ${
                    isActiveTab ? 'bg-foreground/10 text-foreground' : 'text-foreground/70 hover:text-foreground'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {!sidebarCollapsed && <span className="font-medium">{tab.label}</span>}
                </button>
              )
            })}
          </div>
        </div>

        {/* Divider */}
        <div className="px-4">
          <div className="h-px bg-sidebar-border"></div>
        </div>

        {/* Recent Section */}
        {!sidebarCollapsed && (
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold uppercase text-sidebar-foreground/50 tracking-wider">Recent</p>
              <Clock className="w-3 h-3 text-sidebar-foreground/50" />
            </div>
            <div className="space-y-2 text-xs">
              {recentProjects.map((project) => (
                <button
                  key={project._id}
                  onClick={() => setActiveProjectId(project._id)}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-sidebar-accent transition-colors"
                >
                  <p className="text-sidebar-foreground truncate">{project.title}</p>
                  <p className="text-sidebar-foreground/50 text-xs mt-1">{formatRelativeTime(project.updatedAt)}</p>
                </button>
              ))}
              {recentProjects.length === 0 && (
                <p className="text-xs text-sidebar-foreground/40 px-3 py-2">No recent activity</p>
              )}
            </div>
          </div>
        )}
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border space-y-2">
        {!sidebarCollapsed && (
          <Button variant="outline" size="sm" className="w-full text-xs border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent">
            Upgrade
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/settings')}
          className={`w-full text-xs text-sidebar-foreground hover:bg-sidebar-accent flex items-center gap-2 ${sidebarCollapsed ? 'justify-center px-0' : ''}`}
          title="Settings"
        >
          <Settings className="w-4 h-4" />
          {!sidebarCollapsed && 'Settings'}
        </Button>
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent className="bg-background/95 backdrop-blur-xl border-foreground/10">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete project?</AlertDialogTitle>
            <AlertDialogDescription>
              {`"${deleteTarget?.title ?? ''}" and all of its data will be permanently removed. This action cannot be undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteProject.isPending}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {deleteProject.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
