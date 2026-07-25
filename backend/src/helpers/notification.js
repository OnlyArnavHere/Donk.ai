import { Notification } from '../models/Notification.js';

/**
 * Create a notification for a user. Fire-and-forget.
 */
export const notify = (userId, { type, title, message = '', data = {}, project = null }) =>
  Notification.create({
    user: userId,
    project,
    type,
    title,
    message,
    data,
  }).catch(() => {});

/**
 * Create notifications for multiple users.
 */
export const notifyMany = (userIds, payload) =>
  Promise.all(userIds.map((userId) => notify(userId, payload)));

/**
 * Get unread count for a user.
 */
export const getUnreadCount = (userId) => Notification.countDocuments({ user: userId, isRead: false });
