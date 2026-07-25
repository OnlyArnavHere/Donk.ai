import { Document } from '../models/Document.js';
import { EngineeringPackage } from '../models/EngineeringPackage.js';
import { ApiError } from '../utils/ApiError.js';
import { getProject } from './project.service.js';
import { parsePagination, buildPaginatedResponse } from '../helpers/pagination.js';

// ---- List documents for a project (latest versions by default) ----

export const listDocuments = async (projectId, user, query = {}) => {
  await getProject(projectId, user);
  const { page, limit, skip } = parsePagination(query);

  const filter = { project: projectId };
  if (query.type) filter.type = query.type;
  if (query.latest === 'true') filter.isLatest = true;

  const [items, total] = await Promise.all([
    Document.find(filter).sort({ type: 1, version: -1 }).skip(skip).limit(limit),
    Document.countDocuments(filter),
  ]);

  return buildPaginatedResponse(items, total, { page, limit });
};

// ---- Get a specific document ----

export const getDocument = async (docId, user) => {
  const doc = await Document.findById(docId);
  if (!doc) throw ApiError.notFound('Document not found');
  await getProject(doc.project, user);
  return doc;
};

// ---- Get version history for a document type in a project ----

export const getVersionHistory = async (projectId, type, user) => {
  await getProject(projectId, user);
  return Document.find({ project: projectId, type })
    .sort({ version: -1 })
    .select('version title summary createdBy createdAt');
};

// ---- Get latest document by type ----

export const getLatestByType = async (projectId, type, user) => {
  await getProject(projectId, user);
  const doc = await Document.findOne({ project: projectId, type, isLatest: true });
  if (!doc) throw ApiError.notFound(`No ${type} document found`);
  return doc;
};

// ---- Create a new version of a document ----

export const createDocumentVersion = async (projectId, type, content, user, summary = '') => {
  await getProject(projectId, user, true);

  const latest = await Document.findOne({ project: projectId, type, isLatest: true }).sort({ version: -1 });
  const newVersion = (latest?.version || 0) + 1;

  if (latest) {
    latest.isLatest = false;
    await latest.save();
  }

  const doc = await Document.create({
    project: projectId,
    type,
    title: `${type} v${newVersion}`,
    version: newVersion,
    isLatest: true,
    content,
    summary,
    createdBy: user._id,
    previousVersion: latest?._id,
  });

  return doc;
};

// ---- Engineering Packages ----

export const createEngineeringPackage = async (projectId, data, user) => {
  await getProject(projectId, user, true);

  // Gather latest documents of each type
  const types = ['requirements', 'architecture', 'components', 'pcb', 'validation', 'documentation'];
  const documents = await Promise.all(
    types.map(async (type) => {
      const doc = await Document.findOne({ project: projectId, type, isLatest: true });
      return doc ? { type, documentId: doc._id, version: doc.version } : null;
    })
  );

  const latestPackage = await EngineeringPackage.findOne({ project: projectId })
    .sort({ version: -1 });
  const newVersion = (latestPackage?.version || 0) + 1;

  const pkg = await EngineeringPackage.create({
    project: projectId,
    name: data.name || `Engineering Package v${newVersion}`,
    description: data.description || '',
    version: newVersion,
    status: 'complete',
    documents: documents.filter(Boolean),
    createdBy: user._id,
  });

  return pkg;
};

export const listEngineeringPackages = async (projectId, user) => {
  await getProject(projectId, user);
  return EngineeringPackage.find({ project: projectId }).sort({ version: -1 });
};

export const getEngineeringPackage = async (packageId, user) => {
  const pkg = await EngineeringPackage.findById(packageId);
  if (!pkg) throw ApiError.notFound('Engineering package not found');
  await getProject(pkg.project, user);
  return pkg;
};
