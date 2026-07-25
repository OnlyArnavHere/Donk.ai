import { Router } from 'express';
import * as c from '../controllers/project.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';
import {
  createProjectValidation,
  updateProjectValidation,
  shareProjectValidation,
} from '../validators/project.validators.js';

export const projectRoutes = Router();

// All project routes require authentication
projectRoutes.use(authenticate);

// List / search / recent / favourites
projectRoutes.get('/', c.list);
projectRoutes.get('/search', c.search);
projectRoutes.get('/recent', c.recent);
projectRoutes.get('/favourites', c.favourites);

// CRUD
projectRoutes.post('/', createProjectValidation, validate, c.create);
projectRoutes.get('/:id', c.get);
projectRoutes.patch('/:id', updateProjectValidation, validate, c.update);
projectRoutes.delete('/:id', c.remove);

// Actions
projectRoutes.post('/:id/archive', c.archive);
projectRoutes.post('/:id/duplicate', c.duplicate);
projectRoutes.post('/:id/favourite', c.toggleFavourite);
projectRoutes.post('/:id/share', shareProjectValidation, validate, c.share);
projectRoutes.delete('/:id/members/:memberId', c.removeMember);
