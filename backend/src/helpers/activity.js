import { ActivityLog } from '../models/ActivityLog.js';

/**
 * Log a user activity. Fire-and-forget (does not block the request).
 */
export const logActivity = (action, userId = null, details = {}, req = null) =>
  ActivityLog.create({
    user: userId,
    action,
    method: req?.method || '',
    path: req?.originalUrl || '',
    ipAddress: req?.ip || '',
    userAgent: req?.headers?.['user-agent'] || '',
    details,
  }).catch(() => {});

/**
 * Get activity logs for a user (paginated).
 */
export const getUserActivity = (userId, { page = 1, limit = 20 } = {}) =>
  ActivityLog.find({ user: userId })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
