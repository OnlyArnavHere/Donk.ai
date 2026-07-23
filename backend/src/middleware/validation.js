import { validationResult } from 'express-validator';
import { ApiError } from '../utils/ApiError.js';
export const validate = (req, _, next) => { const result = validationResult(req); return result.isEmpty() ? next() : next(ApiError.badRequest('Validation failed', result.array())); };
