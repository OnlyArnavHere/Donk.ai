export const openapi = {
  openapi: '3.0.3',
  info: {
    title: 'Dunk AI Backend API',
    version: '1.0.0',
    description:
      'Production-ready API gateway for DunkAI — AI-powered Hardware Engineering Copilot. ' +
      'The backend owns authentication, projects, chats, files, documents, and Supervisor Agent orchestration.',
    contact: { name: 'DunkAI', url: 'https://dunkai.io' },
  },
  servers: [
    { url: '/api/v1', description: 'API v1' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      cookieAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: 'dunk_access',
      },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          avatar: { type: 'string' },
          role: { type: 'string', enum: ['user', 'admin'] },
          provider: { type: 'string', enum: ['local', 'google'] },
          isVerified: { type: 'boolean' },
          subscription: {
            type: 'object',
            properties: {
              plan: { type: 'string' },
              status: { type: 'string' },
            },
          },
          lastLogin: { type: 'string', format: 'date-time' },
        },
      },
      Project: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          title: { type: 'string' },
          description: { type: 'string' },
          status: { type: 'string', enum: ['active', 'archived'] },
          currentStage: { type: 'string' },
          isFavourite: { type: 'boolean' },
          tags: { type: 'array', items: { type: 'string' } },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          message: { type: 'string' },
          data: { type: 'object', nullable: true },
          errors: { type: 'array', items: { type: 'object' } },
        },
      },
    },
  },
  paths: {
    // ---- Auth ----
    '/auth/register': {
      post: {
        summary: 'Register a new user',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password'],
                properties: {
                  name: { type: 'string', minLength: 2 },
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string', minLength: 8 },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'User registered' },
          400: { description: 'Validation error' },
        },
      },
    },
    '/auth/login': {
      post: {
        summary: 'Login user',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Login successful' },
          401: { description: 'Invalid credentials' },
        },
      },
    },
    '/auth/logout': {
      post: {
        summary: 'Logout user',
        tags: ['Auth'],
        responses: { 200: { description: 'Logged out' } },
      },
    },
    '/auth/refresh': {
      post: {
        summary: 'Refresh access token',
        tags: ['Auth'],
        responses: { 200: { description: 'Token refreshed' } },
      },
    },
    '/auth/me': {
      get: {
        summary: 'Get current user',
        tags: ['Auth'],
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        responses: { 200: { description: 'Current user' } },
      },
    },
    '/auth/forgot-password': {
      post: {
        summary: 'Request password reset',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { type: 'object', required: ['email'], properties: { email: { type: 'string' } } },
            },
          },
        },
        responses: { 200: { description: 'Reset link sent if account exists' } },
      },
    },
    '/auth/reset-password': {
      post: {
        summary: 'Reset password with token',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { type: 'object', required: ['token', 'password'], properties: { token: { type: 'string' }, password: { type: 'string' } } },
            },
          },
        },
        responses: { 200: { description: 'Password reset' } },
      },
    },
    '/auth/google': {
      get: { summary: 'Start Google OAuth flow', tags: ['Auth'], responses: { 302: { description: 'Redirect to Google' } } },
    },
    '/auth/google/callback': {
      get: { summary: 'Google OAuth callback', tags: ['Auth'], responses: { 302: { description: 'Redirect to frontend' } } },
    },
    // ---- Projects ----
    '/projects': {
      get: {
        summary: 'List user projects (paginated)',
        tags: ['Projects'],
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer' } },
          { name: 'limit', in: 'query', schema: { type: 'integer' } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['active', 'archived'] } },
        ],
        responses: { 200: { description: 'Paginated list of projects' } },
      },
      post: {
        summary: 'Create a new project',
        tags: ['Projects'],
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['title'], properties: { title: { type: 'string' }, description: { type: 'string' }, tags: { type: 'array', items: { type: 'string' } } } } } } },
        responses: { 201: { description: 'Project created' } },
      },
    },
    '/projects/{id}': {
      get: { summary: 'Get project by ID', tags: ['Projects'], security: [{ bearerAuth: [] }, { cookieAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Project details' } } },
      patch: { summary: 'Update project', tags: ['Projects'], security: [{ bearerAuth: [] }, { cookieAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Project updated' } } },
      delete: { summary: 'Delete project', tags: ['Projects'], security: [{ bearerAuth: [] }, { cookieAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Project deleted' } } },
    },
    '/projects/{id}/archive': { post: { summary: 'Archive project', tags: ['Projects'], security: [{ bearerAuth: [] }, { cookieAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Project archived' } } } },
    '/projects/{id}/duplicate': { post: { summary: 'Duplicate project', tags: ['Projects'], security: [{ bearerAuth: [] }, { cookieAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 201: { description: 'Project duplicated' } } } },
    '/projects/{id}/favourite': { post: { summary: 'Toggle favourite', tags: ['Projects'], security: [{ bearerAuth: [] }, { cookieAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Favourite toggled' } } } },
    '/projects/{id}/share': { post: { summary: 'Share project with user', tags: ['Projects'], security: [{ bearerAuth: [] }, { cookieAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Project shared' } } } },
    '/projects/recent': { get: { summary: 'Get recent projects', tags: ['Projects'], security: [{ bearerAuth: [] }, { cookieAuth: [] }], responses: { 200: { description: 'Recent projects' } } } },
    '/projects/favourites': { get: { summary: 'Get favourite projects', tags: ['Projects'], security: [{ bearerAuth: [] }, { cookieAuth: [] }], responses: { 200: { description: 'Favourite projects' } } } },
    '/projects/search': { get: { summary: 'Search projects', tags: ['Projects'], security: [{ bearerAuth: [] }, { cookieAuth: [] }], parameters: [{ name: 'q', in: 'query', schema: { type: 'string' } }], responses: { 200: { description: 'Search results' } } } },
    // ---- Chats ----
    '/chats': { post: { summary: 'Create chat', tags: ['Chat'], security: [{ bearerAuth: [] }, { cookieAuth: [] }], responses: { 201: { description: 'Chat created' } } } },
    '/chats/project/{projectId}': { get: { summary: 'List chats for project', tags: ['Chat'], security: [{ bearerAuth: [] }, { cookieAuth: [] }], parameters: [{ name: 'projectId', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'List of chats' } } } },
    '/chats/{id}/messages': { get: { summary: 'Get chat messages', tags: ['Chat'], security: [{ bearerAuth: [] }, { cookieAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Messages' } } }, post: { summary: 'Send message', tags: ['Chat'], security: [{ bearerAuth: [] }, { cookieAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 201: { description: 'Message sent' } } } },
    // ---- AI ----
    '/ai/chat': { post: { summary: 'Send AI chat message', tags: ['AI'], security: [{ bearerAuth: [] }, { cookieAuth: [] }], responses: { 200: { description: 'AI response' } } } },
    '/ai/run': { post: { summary: 'Run AI workflow', tags: ['AI'], security: [{ bearerAuth: [] }, { cookieAuth: [] }], responses: { 202: { description: 'Workflow submitted' } } } },
    '/ai/status/{id}': { get: { summary: 'Get AI job status', tags: ['AI'], security: [{ bearerAuth: [] }, { cookieAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Job status' } } } },
    '/ai/project/{projectId}': { get: { summary: 'Get AI artifacts for project', tags: ['AI'], security: [{ bearerAuth: [] }, { cookieAuth: [] }], parameters: [{ name: 'projectId', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Artifacts' } } } },
    '/ai/cancel': { post: { summary: 'Cancel AI job', tags: ['AI'], security: [{ bearerAuth: [] }, { cookieAuth: [] }], responses: { 200: { description: 'Job cancelled' } } } },
    // ---- Files ----
    '/files': { post: { summary: 'Upload file', tags: ['Files'], security: [{ bearerAuth: [] }, { cookieAuth: [] }], requestBody: { content: { 'multipart/form-data': { schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' }, project: { type: 'string' } } } } } }, responses: { 201: { description: 'File uploaded' } } } },
    '/files/project/{projectId}': { get: { summary: 'List files for project', tags: ['Files'], security: [{ bearerAuth: [] }, { cookieAuth: [] }], parameters: [{ name: 'projectId', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'List of files' } } } },
    '/files/{id}': { get: { summary: 'Get file details', tags: ['Files'], security: [{ bearerAuth: [] }, { cookieAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'File details' } } }, delete: { summary: 'Delete file', tags: ['Files'], security: [{ bearerAuth: [] }, { cookieAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'File deleted' } } } },
    // ---- Documents ----
    '/documents/project/{projectId}': { get: { summary: 'List documents for project', tags: ['Documents'], security: [{ bearerAuth: [] }, { cookieAuth: [] }], parameters: [{ name: 'projectId', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Documents' } } }, post: { summary: 'Create document version', tags: ['Documents'], security: [{ bearerAuth: [] }, { cookieAuth: [] }], parameters: [{ name: 'projectId', in: 'path', required: true, schema: { type: 'string' } }], responses: { 201: { description: 'Document created' } } } },
    '/documents/project/{projectId}/packages': { get: { summary: 'List engineering packages', tags: ['Documents'], security: [{ bearerAuth: [] }, { cookieAuth: [] }], parameters: [{ name: 'projectId', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Packages' } } }, post: { summary: 'Create engineering package', tags: ['Documents'], security: [{ bearerAuth: [] }, { cookieAuth: [] }], parameters: [{ name: 'projectId', in: 'path', required: true, schema: { type: 'string' } }], responses: { 201: { description: 'Package created' } } } },
    // ---- Notifications ----
    '/notifications': { get: { summary: 'List notifications', tags: ['Notifications'], security: [{ bearerAuth: [] }, { cookieAuth: [] }], responses: { 200: { description: 'Notifications' } } } },
    '/notifications/unread/count': { get: { summary: 'Get unread count', tags: ['Notifications'], security: [{ bearerAuth: [] }, { cookieAuth: [] }], responses: { 200: { description: 'Unread count' } } } },
    '/notifications/{id}/read': { patch: { summary: 'Mark notification as read', tags: ['Notifications'], security: [{ bearerAuth: [] }, { cookieAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Marked as read' } } } },
    '/notifications/read-all': { patch: { summary: 'Mark all as read', tags: ['Notifications'], security: [{ bearerAuth: [] }, { cookieAuth: [] }], responses: { 200: { description: 'All marked as read' } } } },
  },
};
