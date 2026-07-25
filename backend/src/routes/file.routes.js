import { Router } from 'express';
import * as c from '../controllers/file.controller.js';
import { authenticate } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

export const fileRoutes = Router();

fileRoutes.use(authenticate);

// Single file upload
fileRoutes.post('/', upload.single('file'), c.uploadFile);
// Multiple file upload
fileRoutes.post('/multiple', upload.array('files', 5), c.uploadFiles);

fileRoutes.get('/project/:projectId', c.list);
fileRoutes.get('/:id', c.get);
fileRoutes.delete('/:id', c.remove);
