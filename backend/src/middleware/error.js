import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';
import { send } from '../utils/response.js';
export const notFound = (req, _, next) => next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
export const errorHandler = (err, req, res, _) => {
  const status = err.statusCode || (err.name === 'ValidationError' ? 400 : 500);
  const errors = err.errors || (err.name === 'ValidationError' ? Object.values(err.errors).map(e => e.message) : []);
  if (status >= 500) console.error(err);
  send(res, { status, message: status >= 500 && env.nodeEnv === 'production' ? 'Internal server error' : err.message, errors });
};
