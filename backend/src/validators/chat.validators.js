import { body } from 'express-validator';

export const createChatValidation = [
  body('project').isMongoId().withMessage('Valid project ID is required'),
  body('title').optional().isLength({ min: 1, max: 160 }).withMessage('Title must be 1-160 characters'),
];

export const sendMessageValidation = [
  body('content').isLength({ min: 1, max: 50000 }).withMessage('Message content is required (1-50000 chars)'),
  body('attachments').optional().isArray(),
  body('agentType').optional().isString(),
];

export const renameChatValidation = [
  body('title').trim().isLength({ min: 1, max: 160 }).withMessage('Title is required'),
];
