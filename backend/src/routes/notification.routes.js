import { Router } from 'express';
import * as c from '../controllers/notification.controller.js';
import { authenticate } from '../middleware/auth.js';

export const notificationRoutes = Router();

notificationRoutes.use(authenticate);

notificationRoutes.get('/', c.list);
notificationRoutes.get('/unread/count', c.unreadCount);
notificationRoutes.patch('/:id/read', c.markAsRead);
notificationRoutes.patch('/read-all', c.markAllAsRead);
notificationRoutes.delete('/:id', c.remove);
