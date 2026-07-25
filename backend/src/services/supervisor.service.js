import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

// In-memory store for AI job status (replace with Redis in production)
const jobStore = new Map();

export const setJobStatus = (jobId, status, data = {}) => {
  jobStore.set(jobId, { jobId, status, ...data, updatedAt: new Date() });
  // Auto-cleanup after 1 hour
  setTimeout(() => jobStore.delete(jobId), 60 * 60 * 1000);
};

export const getJobStatus = (jobId) => jobStore.get(jobId);

export const deleteJobStatus = (jobId) => {
  const job = jobStore.get(jobId);
  if (job && job.controller) {
    job.controller.abort();
  }
  jobStore.delete(jobId);
  return job;
};

/**
 * Security boundary: Node.js talks ONLY to the Supervisor Agent.
 * Downstream AI agents (Requirement, Architecture, Component, PCB, Validation, Documentation)
 * are internal to the Python engine and are never addressed directly here.
 */
export const callSupervisor = async ({ action, project, messages = [], files = [], jobId = null }) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 120000);

  if (jobId) {
    const existing = jobStore.get(jobId);
    if (existing) existing.controller = controller;
  }

  try {
    const headers = { 'content-type': 'application/json' };
    if (env.supervisorToken) headers.authorization = `Bearer ${env.supervisorToken}`;

    const response = await fetch(new URL(env.supervisorPath, env.supervisorUrl), {
      method: 'POST',
      headers,
      signal: controller.signal,
      body: JSON.stringify({ action, project, messages, files, jobId }),
    });

    const body = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new ApiError(502, body.message || 'Supervisor Agent request failed');
    }

    return body.data || body;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error.name === 'AbortError') {
      throw new ApiError(504, 'Supervisor Agent request timed out');
    }
    throw new ApiError(502, 'Supervisor Agent is unavailable');
  } finally {
    clearTimeout(timeout);
  }
};

/**
 * Check the status of a Supervisor Agent job (if the Python server supports async jobs).
 */
export const getSupervisorStatus = async (jobId) => {
  // First check our local in-memory store
  const local = jobStore.get(jobId);
  if (local && local.status === 'completed') return local;

  // Then check with the Supervisor Agent
  try {
    const headers = {};
    if (env.supervisorToken) headers.authorization = `Bearer ${env.supervisorToken}`;

    const response = await fetch(
      new URL(`${env.supervisorPath}/${jobId}/status`, env.supervisorUrl),
      { headers }
    );

    if (response.ok) {
      const body = await response.json().catch(() => ({}));
      const status = body.data || body;
      setJobStatus(jobId, status.status || 'unknown', status);
      return status;
    }
  } catch {
    // Fall through to local
  }

  return local || { jobId, status: 'unknown' };
};

/**
 * Cancel a Supervisor Agent job.
 */
export const cancelSupervisorJob = async (jobId) => {
  const job = jobStore.get(jobId);
  if (job?.controller) {
    job.controller.abort();
  }

  try {
    const headers = {};
    if (env.supervisorToken) headers.authorization = `Bearer ${env.supervisorToken}`;

    await fetch(new URL(`${env.supervisorPath}/${jobId}/cancel`, env.supervisorUrl), {
      method: 'POST',
      headers,
    });
  } catch {
    // Best-effort cancel
  }

  setJobStatus(jobId, 'cancelled');
  return { jobId, status: 'cancelled' };
};
