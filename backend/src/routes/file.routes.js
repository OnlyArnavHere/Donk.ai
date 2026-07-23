import { Router } from 'express'; import * as c from '../controllers/file.controller.js'; import { authenticate } from '../middleware/auth.js'; import { upload } from '../middleware/upload.js';
export const fileRoutes=Router(); fileRoutes.use(authenticate); fileRoutes.post('/',upload.single('file'),c.uploadFile); fileRoutes.get('/project/:projectId',c.list);
