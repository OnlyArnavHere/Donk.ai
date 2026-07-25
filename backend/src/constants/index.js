// Application-wide constants

export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
};

export const MEMBER_ROLES = {
  VIEWER: 'viewer',
  EDITOR: 'editor',
};

export const PROJECT_STATUS = {
  ACTIVE: 'active',
  ARCHIVED: 'archived',
};

export const PROJECT_STAGES = [
  'requirements',
  'architecture',
  'components',
  'pcb',
  'validation',
  'documentation',
];

export const AGENT_TYPES = {
  REQUIREMENT: 'requirement',
  ARCHITECTURE: 'architecture',
  COMPONENT: 'component',
  PCB: 'pcb',
  VALIDATION: 'validation',
  DOCUMENTATION: 'documentation',
};

export const MESSAGE_TYPES = {
  USER: 'user',
  ASSISTANT: 'assistant',
  SYSTEM: 'system',
  AGENT: 'agent',
  TOOL: 'tool',
};

export const ARTIFACT_TYPES = {
  REQUIREMENTS: 'requirements',
  ARCHITECTURE: 'architecture',
  COMPONENTS: 'components',
  PCB_DESIGN: 'pcb_design',
  VALIDATION: 'validation',
  DOCUMENTATION: 'documentation',
  ENGINEERING_PACKAGE: 'engineering_package',
};

export const NOTIFICATION_TYPES = {
  PROJECT_SHARED: 'project_shared',
  AI_COMPLETE: 'ai_complete',
  AI_FAILED: 'ai_failed',
  SYSTEM: 'system',
};

export const ACTIVITY_ACTIONS = {
  LOGIN: 'login',
  LOGOUT: 'logout',
  REGISTER: 'register',
  PROJECT_CREATED: 'project_created',
  PROJECT_UPDATED: 'project_updated',
  PROJECT_DELETED: 'project_deleted',
  AI_REQUEST: 'ai_request',
  FILE_UPLOAD: 'file_upload',
  ERROR: 'error',
};

export const FILE_CATEGORIES = {
  IMAGE: 'image',
  PDF: 'pdf',
  DATASHEET: 'datasheet',
  DOCUMENT: 'document',
};

export const COOKIE_NAMES = {
  ACCESS_TOKEN: 'dunk_access',
  REFRESH_TOKEN: 'dunk_refresh',
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE: 422,
  TOO_MANY: 429,
  INTERNAL_ERROR: 500,
  BAD_GATEWAY: 502,
};

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
};

export const RATE_LIMITS = {
  WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  GENERAL: 300,
  AUTH: 10,
  AI: 20,
};
