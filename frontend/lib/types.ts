// Shared types for DunkAI frontend

export interface User {
  _id: string
  name: string
  email: string
  avatar: string
  role: 'user' | 'admin'
  provider: 'local' | 'google'
  isVerified: boolean
  subscription: {
    plan: string
    status: string
  }
  lastLogin?: string
}

export interface AuthResponse {
  user: User
  accessToken: string
  refreshToken: string
}

export interface ProjectOwner {
  _id: string
  name: string
  email: string
  avatar: string
}

export interface Project {
  _id: string
  title: string
  description: string
  status: 'active' | 'archived'
  currentStage: string
  isFavourite: boolean
  tags: string[]
  agentsCompleted: string[]
  owner: string | ProjectOwner
  members?: Array<{ user: string | ProjectOwner; role: string }>
  createdAt: string
  updatedAt: string
}

export interface Chat {
  _id: string
  project: string
  title: string
  pinned: boolean
  messageCount: number
  lastMessageAt: string
  createdAt: string
  updatedAt: string
}

export interface Message {
  _id: string
  chat: string
  sender?: string
  type: 'user' | 'assistant' | 'system' | 'agent' | 'tool'
  content: string
  metadata?: Record<string, unknown>
  createdAt: string
}

export interface AppNotification {
  _id: string
  user: string
  project?: string
  type: 'project_shared' | 'ai_complete' | 'ai_failed' | 'document_ready' | 'system' | 'mention'
  title: string
  message: string
  data?: Record<string, unknown>
  isRead: boolean
  readAt?: string
  createdAt: string
  updatedAt: string
}

export interface ApiResponse<T = unknown> {
  success: boolean
  message: string
  data: T
  errors: unknown[]
  timestamp: string
}

export interface PaginatedResponse<T> {
  items: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}
