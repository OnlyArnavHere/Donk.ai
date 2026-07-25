import { asyncHandler } from '../utils/asyncHandler.js';
import { send } from '../utils/response.js';
import * as service from '../services/file.service.js';

export const uploadFile = asyncHandler(async (req, res) => {
  if (!req.file) {
    return send(res, { status: 400, message: 'No file uploaded' });
  }
  const projectId = req.body.project || null;
  const file = await service.uploadFile(req.file, projectId, req.user, req);
  send(res, { status: 201, message: 'File uploaded', data: file });
});

// Multiple file upload
export const uploadFiles = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return send(res, { status: 400, message: 'No files uploaded' });
  }
  const projectId = req.body.project || null;
  const files = await Promise.all(
    req.files.map((file) => service.uploadFile(file, projectId, req.user, req))
  );
  send(res, { status: 201, message: `${files.length} file(s) uploaded`, data: files });
});

export const list = asyncHandler(async (req, res) => {
  send(res, { data: await service.listFiles(req.params.projectId, req.user, req.query) });
});

export const get = asyncHandler(async (req, res) => {
  send(res, { data: await service.getFile(req.params.id, req.user) });
});

export const remove = asyncHandler(async (req, res) => {
  await service.deleteFile(req.params.id, req.user);
  send(res, { message: 'File deleted' });
});
