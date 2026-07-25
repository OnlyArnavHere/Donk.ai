import fs from 'node:fs';
import path from 'node:path';
import { File } from '../models/File.js';
import { ApiError } from '../utils/ApiError.js';
import { getProject } from './project.service.js';
import { cloudinary, isCloudinaryConfigured } from '../config/cloudinary.js';
import { categorizeFile } from '../middleware/upload.js';
import { logActivity } from '../helpers/activity.js';

// ---- Upload to Cloudinary (if configured) or use local path ----

const uploadToCloudinary = async (filePath, folder = 'dunkai') => {
  if (!isCloudinaryConfigured()) {
    return null; // Use local storage
  }

  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: 'auto',
    });
    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error.message);
    return null;
  }
};

const deleteFromCloudinary = async (publicId) => {
  if (!isCloudinaryConfigured() || !publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: 'auto' });
  } catch (error) {
    console.error('Cloudinary delete error:', error.message);
  }
};

// ---- Upload file ----

export const uploadFile = async (file, projectId, user, req = null) => {
  if (projectId) {
    await getProject(projectId, user, true);
  }

  const category = categorizeFile(file.mimetype);

  // Try Cloudinary, fall back to local
  const cloudinaryResult = await uploadToCloudinary(file.path, `dunkai/${projectId || 'general'}`);

  const fileDoc = await File.create({
    project: projectId || null,
    uploadedBy: user._id,
    originalName: file.originalname,
    path: cloudinaryResult ? '' : file.path,
    url: cloudinaryResult ? cloudinaryResult.url : `/uploads/${path.basename(file.path)}`,
    cloudinaryPublicId: cloudinaryResult?.publicId || '',
    mimeType: file.mimetype,
    size: file.size,
    category,
  });

  // Clean up local file if uploaded to Cloudinary
  if (cloudinaryResult) {
    fs.unlink(file.path, () => {});
  }

  await logActivity('file_upload', user._id, { fileId: fileDoc._id, name: file.originalname }, req);
  return fileDoc;
};

// ---- List files for a project ----

export const listFiles = async (projectId, user, query = {}) => {
  await getProject(projectId, user);
  const filter = { project: projectId, isDeleted: false };
  if (query.category) filter.category = query.category;
  return File.find(filter).sort({ createdAt: -1 });
};

// ---- Delete file ----

export const deleteFile = async (fileId, user) => {
  const file = await File.findById(fileId);
  if (!file) throw ApiError.notFound('File not found');

  // Check ownership or project access
  if (file.uploadedBy.toString() !== user._id.toString()) {
    if (file.project) {
      await getProject(file.project, user, true);
    } else {
      throw ApiError.forbidden('You can only delete your own files');
    }
  }

  // Delete from Cloudinary
  if (file.cloudinaryPublicId) {
    await deleteFromCloudinary(file.cloudinaryPublicId);
  }

  // Delete local file
  if (file.path) {
    fs.unlink(file.path, () => {});
  }

  file.isDeleted = true;
  await file.save();
  return file;
};

// ---- Get file by ID ----

export const getFile = async (fileId, user) => {
  const file = await File.findById(fileId);
  if (!file || file.isDeleted) throw ApiError.notFound('File not found');
  return file;
};

