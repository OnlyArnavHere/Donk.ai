import { Router } from 'express';
import * as c from '../controllers/document.controller.js';
import { authenticate } from '../middleware/auth.js';

export const documentRoutes = Router();

documentRoutes.use(authenticate);

// Documents
documentRoutes.get('/project/:projectId', c.list);
documentRoutes.get('/:id', c.get);
documentRoutes.get('/project/:projectId/type/:type/versions', c.versions);
documentRoutes.get('/project/:projectId/type/:type/latest', c.latest);
documentRoutes.post('/project/:projectId', c.createVersion);

// Engineering packages
documentRoutes.post('/project/:projectId/package', c.createPackage);
documentRoutes.get('/project/:projectId/packages', c.listPackages);
documentRoutes.get('/packages/:id', c.getPackage);
