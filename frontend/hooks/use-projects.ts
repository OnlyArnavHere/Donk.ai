'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { projectApi } from '@/lib/axios-client'
import type { Project, PaginatedResponse } from '@/lib/types'

export function useProjects(params: Record<string, string | number> = {}) {
  return useQuery({
    queryKey: ['projects', params],
    queryFn: () => projectApi.list(params),
  })
}

export function useProject(id: string | null) {
  return useQuery({
    queryKey: ['project', id],
    queryFn: () => projectApi.get(id!),
    enabled: !!id,
  })
}

export function useRecentProjects(limit = 5) {
  return useQuery({
    queryKey: ['projects', 'recent', limit],
    queryFn: () => projectApi.recent(limit),
  })
}

export function useFavouriteProjects() {
  return useQuery({
    queryKey: ['projects', 'favourites'],
    queryFn: () => projectApi.favourites(),
  })
}

export function useCreateProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { title: string; description?: string; tags?: string[] }) =>
      projectApi.create(data),
    onMutate: async (newProject) => {
      await queryClient.cancelQueries({ queryKey: ['projects'] })
      const previous = queryClient.getQueryData<PaginatedResponse<Project>>(['projects', {}])
      const tempProject: Project = {
        _id: `temp-${Date.now()}`,
        title: newProject.title,
        description: newProject.description || '',
        status: 'active',
        currentStage: 'requirements',
        isFavourite: false,
        tags: newProject.tags || [],
        agentsCompleted: [],
        owner: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      queryClient.setQueryData<PaginatedResponse<Project> | undefined>(['projects', {}], (old) => {
        if (!old) return old
        return { ...old, items: [tempProject, ...old.items] }
      })
      return { previous }
    },
    onError: (_err, _newProject, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['projects', {}], context.previous)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'], exact: false })
    },
  })
}

export function useUpdateProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Project> }) =>
      projectApi.update(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ['projects'] })
      const previous = queryClient.getQueryData<PaginatedResponse<Project>>(['projects', {}])
      queryClient.setQueryData<PaginatedResponse<Project> | undefined>(['projects', {}], (old) => {
        if (!old) return old
        return {
          ...old,
          items: old.items.map((p) => (p._id === id ? { ...p, ...data } : p)),
        }
      })
      return { previous }
    },
    onError: (_err, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['projects', {}], context.previous)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'], exact: false })
    },
  })
}

export function useDeleteProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => projectApi.delete(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['projects'] })
      const previous = queryClient.getQueryData<PaginatedResponse<Project>>(['projects', {}])
      queryClient.setQueryData<PaginatedResponse<Project> | undefined>(['projects', {}], (old) => {
        if (!old) return old
        return { ...old, items: old.items.filter((p) => p._id !== id) }
      })
      return { previous }
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['projects', {}], context.previous)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'], exact: false })
    },
  })
}

export function useToggleFavourite() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => projectApi.toggleFavourite(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['projects'] })
      const previous = queryClient.getQueryData<PaginatedResponse<Project>>(['projects', {}])
      queryClient.setQueryData<PaginatedResponse<Project> | undefined>(['projects', {}], (old) => {
        if (!old) return old
        return {
          ...old,
          items: old.items.map((p) =>
            p._id === id ? { ...p, isFavourite: !p.isFavourite } : p
          ),
        }
      })
      return { previous }
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['projects', {}], context.previous)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'], exact: false })
    },
  })
}

export function useArchiveProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => projectApi.archive(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['projects'] })
      const previous = queryClient.getQueryData<PaginatedResponse<Project>>(['projects', {}])
      queryClient.setQueryData<PaginatedResponse<Project> | undefined>(['projects', {}], (old) => {
        if (!old) return old
        return {
          ...old,
          items: old.items.map((p) =>
            p._id === id ? { ...p, status: 'archived' as const } : p
          ),
        }
      })
      return { previous }
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['projects', {}], context.previous)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'], exact: false })
    },
  })
}

export function useDuplicateProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => projectApi.duplicate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'], exact: false })
    },
  })
}
