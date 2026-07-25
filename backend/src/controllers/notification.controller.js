import { asyncHandler } from '../utils/asyncHandler.js';
import { send } from '../utils/response.js';
import { Notification } from '../models/Notification.js';
import { getUnreadCount } from '../helpers/notification.js';
import { parsePagination, buildPaginatedResponse } from '../helpers/pagination.js';

export const list = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);
  const filter = { user: req.user._id };
  if (req.query.unread === 'true') filter.isRead = false;

  const [items, total] = await Promise.all([
    Notification.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Notification.countDocuments(filter),
  ]);

  send(res, { data: buildPaginatedResponse(items, total, { page, limit }) });
});

export const unreadCount = asyncHandler(async (req, res) => {
  send(res, { data: { count: await getUnreadCount(req.user._id) } });
});

export const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { isRead: true, readAt: new Date() },
    { new: true }
  );
  send(res, { message: 'Notification marked as read', data: notification });
});

export const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { user: req.user._id, isRead: false },
    { isRead: true, readAt: new Date() }
  );
  send(res, { message: 'All notifications marked as read' });
});

export const remove = asyncHandler(async (req, res) => {
  await Notification.deleteOne({ _id: req.params.id, user: req.user._id });
  send(res, { message: 'Notification deleted' });
});
