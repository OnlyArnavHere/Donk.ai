'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { notificationApi } from '@/lib/axios-client'
import type { AppNotification, PaginatedResponse } from '@/lib/types'

export function useNotifications(enabled = true) {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationApi.list(),
    enabled,
    staleTime: 30_000,
  })
}

export function useUnreadCount() {
  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: () => notificationApi.unreadCount(),
    refetchInterval: 60_000,
    staleTime: 30_000,
  })
}

export function useMarkAsRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => notificationApi.markAsRead(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['notifications'], exact: true })
      const previous = queryClient.getQueryData<PaginatedResponse<AppNotification>>(['notifications'])
      if (previous) {
        queryClient.setQueryData<PaginatedResponse<AppNotification>>(['notifications'], {
          ...previous,
          items: previous.items.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
        })
      }
      return { previous }
    },
    onError: (_err, _id, context) => {
      if (context?.previous) queryClient.setQueryData(['notifications'], context.previous)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}

export function useMarkAllAsRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => notificationApi.markAllAsRead(),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['notifications'], exact: true })
      const previous = queryClient.getQueryData<PaginatedResponse<AppNotification>>(['notifications'])
      if (previous) {
        queryClient.setQueryData<PaginatedResponse<AppNotification>>(['notifications'], {
          ...previous,
          items: previous.items.map((n) => ({ ...n, isRead: true })),
        })
      }
      return { previous }
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(['notifications'], context.previous)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}
