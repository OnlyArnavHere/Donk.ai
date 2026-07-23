import 'dotenv/config';

const required = (name, fallback) => process.env[name] || fallback;

export const env = Object.freeze({
  nodeEnv: required('NODE_ENV', 'development'),
  port: Number(required('PORT', '4000')),
  mongoUri: required('MONGODB_URI', 'mongodb://127.0.0.1:27017/dunk-ai'),
  accessSecret: required('JWT_ACCESS_SECRET', 'development-access-secret-change-me'),
  refreshSecret: required('JWT_REFRESH_SECRET', 'development-refresh-secret-change-me'),
  accessTtl: required('ACCESS_TOKEN_TTL', '15m'),
  refreshTtl: required('REFRESH_TOKEN_TTL', '30d'),
  supervisorUrl: required('SUPERVISOR_AGENT_URL', 'http://127.0.0.1:8000'),
  supervisorPath: required('SUPERVISOR_AGENT_PATH', '/api/v1/supervisor'),
  supervisorToken: process.env.SUPERVISOR_AGENT_TOKEN || '',
  clientOrigin: required('CLIENT_ORIGIN', 'http://localhost:3000'),
  uploadDir: required('UPLOAD_DIR', 'uploads'),
  maxFileSize: Number(required('MAX_FILE_SIZE_MB', '25')) * 1024 * 1024
});

if (env.nodeEnv === 'production' && (env.accessSecret.includes('change-me') || env.refreshSecret.includes('change-me'))) {
  throw new Error('JWT secrets must be configured in production');
}
