import { asyncHandler } from '../utils/asyncHandler.js';
import { send } from '../utils/response.js';
import * as service from '../services/document.service.js';

export const list = asyncHandler(async (req, res) => {
  send(res, { data: await service.listDocuments(req.params.projectId, req.user, req.query) });
});

export const get = asyncHandler(async (req, res) => {
  send(res, { data: await service.getDocument(req.params.id, req.user) });
});

export const versions = asyncHandler(async (req, res) => {
  send(res, { data: await service.getVersionHistory(req.params.projectId, req.params.type, req.user) });
});

export const latest = asyncHandler(async (req, res) => {
  send(res, { data: await service.getLatestByType(req.params.projectId, req.params.type, req.user) });
});

export const createVersion = asyncHandler(async (req, res) => {
  send(res, {
    status: 201,
    message: 'Document version created',
    data: await service.createDocumentVersion(req.params.projectId, req.body.type, req.body.content, req.user, req.body.summary),
  });
});

// Engineering packages
export const createPackage = asyncHandler(async (req, res) => {
  send(res, {
    status: 201,
    message: 'Engineering package created',
    data: await service.createEngineeringPackage(req.params.projectId, req.body, req.user),
  });
});

export const listPackages = asyncHandler(async (req, res) => {
  send(res, { data: await service.listEngineeringPackages(req.params.projectId, req.user) });
});

export const getPackage = asyncHandler(async (req, res) => {
  send(res, { data: await service.getEngineeringPackage(req.params.id, req.user) });
});
