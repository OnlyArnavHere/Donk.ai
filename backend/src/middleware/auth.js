import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { verifyAccessToken } from '../utils/tokens.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const authenticate = asyncHandler(async (req, _, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) throw ApiError.unauthorized();
  let payload; try { payload = verifyAccessToken(header.slice(7)); } catch { throw ApiError.unauthorized('Invalid or expired access token'); }
  const user = await User.findById(payload.sub); if (!user) throw ApiError.unauthorized();
  req.user = user; next();
});
export const authorize = (...roles) => (req, _, next) => roles.includes(req.user.role) ? next() : next(ApiError.forbidden());
