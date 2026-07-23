import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

// Security boundary: Node.js talks only to the Supervisor Agent. Downstream agents are never addressed here.
export const callSupervisor = async ({ action, project, messages, files = [] }) => {
  const controller = new AbortController(); const timeout = setTimeout(() => controller.abort(), 120000);
  try {
    const headers = { 'content-type': 'application/json' }; if (env.supervisorToken) headers.authorization = `Bearer ${env.supervisorToken}`;
    const response = await fetch(new URL(env.supervisorPath, env.supervisorUrl), { method: 'POST', headers, signal: controller.signal, body: JSON.stringify({ action, project, messages, files }) });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw new ApiError(502, body.message || 'Supervisor Agent request failed');
    return body.data || body;
  } catch (error) { if (error instanceof ApiError) throw error; throw new ApiError(502, 'Supervisor Agent is unavailable'); }
  finally { clearTimeout(timeout); }
};
