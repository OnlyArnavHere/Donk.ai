import { asyncHandler } from '../utils/asyncHandler.js';
import { send } from '../utils/response.js';
import * as service from '../services/project.service.js';

export const list = asyncHandler(async (req, res) => {
  send(res, { data: await service.listProjects(req.user, req.query) });
});

export const get = asyncHandler(async (req, res) => {
  send(res, { data: await service.getProject(req.params.id, req.user) });
});

export const create = asyncHandler(async (req, res) => {
  send(res, {
    status: 201,
    message: 'Project created',
    data: await service.createProject(req.body, req.user, req),
  });
});

export const update = asyncHandler(async (req, res) => {
  send(res, { message: 'Project updated', data: await service.updateProject(req.params.id, req.body, req.user, req) });
});

export const remove = asyncHandler(async (req, res) => {
  await service.deleteProject(req.params.id, req.user, req);
  send(res, { message: 'Project deleted' });
});

export const archive = asyncHandler(async (req, res) => {
  send(res, { message: 'Project archived', data: await service.archiveProject(req.params.id, req.user, req) });
});

export const duplicate = asyncHandler(async (req, res) => {
  send(res, { status: 201, message: 'Project duplicated', data: await service.duplicateProject(req.params.id, req.user, req) });
});

export const toggleFavourite = asyncHandler(async (req, res) => {
  send(res, { data: await service.toggleFavourite(req.params.id, req.user) });
});

export const share = asyncHandler(async (req, res) => {
  send(res, { message: 'Project shared', data: await service.shareProject(req.params.id, req.body.email, req.body.role, req.user, req) });
});

export const removeMember = asyncHandler(async (req, res) => {
  send(res, { message: 'Member removed', data: await service.removeMember(req.params.id, req.params.memberId, req.user) });
});

export const search = asyncHandler(async (req, res) => {
  send(res, { data: await service.searchProjects(req.user, req.query) });
});

export const recent = asyncHandler(async (req, res) => {
  send(res, { data: await service.getRecentProjects(req.user, parseInt(req.query.limit, 10) || 5) });
});

export const favourites = asyncHandler(async (req, res) => {
  send(res, { data: await service.getFavouriteProjects(req.user) });
});
