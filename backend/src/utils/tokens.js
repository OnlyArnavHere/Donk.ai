import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { COOKIE_NAMES } from '../constants/index.js';

// ---- JWT Signing ----

export const signAccessToken = (user) =>
  jwt.sign({ sub: user._id.toString(), role: user.role, name: user.name }, env.accessSecret, {
    expiresIn: env.accessTtl,
  });

export const signRefreshToken = (user, sessionId) =>
  jwt.sign({ sub: user._id.toString(), sid: sessionId, role: user.role }, env.refreshSecret, {
    expiresIn: env.refreshTtl,
  });

export const verifyAccessToken = (token) => jwt.verify(token, env.accessSecret);
export const verifyRefreshToken = (token) => jwt.verify(token, env.refreshSecret);

// ---- Token hashing (for secure storage) ----

export const hashToken = (token) =>
  crypto.createHash('sha256').update(token).digest('hex');

// ---- Password reset token generation ----

export const generateResetToken = () => {
  const rawToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = hashToken(rawToken);
  const expires = new Date(Date.now() + env.resetTokenExpiry * 60 * 1000);
  return { rawToken, hashedToken, expires };
};

// ---- Email verification token ----

export const generateVerificationToken = () => {
  const rawToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = hashToken(rawToken);
  return { rawToken, hashedToken };
};

// ---- Cookie helpers ----

const baseCookieOptions = {
  httpOnly: true,
  secure: env.cookieSecure,
  sameSite: env.isProduction ? 'strict' : 'lax',
  domain: env.isProduction ? env.cookieDomain : undefined,
  path: '/',
};

export const getAccessTokenCookieOptions = () => ({
  ...baseCookieOptions,
  maxAge: 15 * 60 * 1000, // 15 minutes
});

export const getRefreshTokenCookieOptions = () => ({
  ...baseCookieOptions,
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
});

export const setAuthCookies = (res, accessToken, refreshToken) => {
  res.cookie(COOKIE_NAMES.ACCESS_TOKEN, accessToken, getAccessTokenCookieOptions());
  res.cookie(COOKIE_NAMES.REFRESH_TOKEN, refreshToken, getRefreshTokenCookieOptions());
};

export const clearAuthCookies = (res) => {
  res.clearCookie(COOKIE_NAMES.ACCESS_TOKEN, { ...baseCookieOptions });
  res.clearCookie(COOKIE_NAMES.REFRESH_TOKEN, { ...baseCookieOptions });
};

export const extractTokensFromCookies = (req) => ({
  accessToken: req.cookies?.[COOKIE_NAMES.ACCESS_TOKEN],
  refreshToken: req.cookies?.[COOKIE_NAMES.REFRESH_TOKEN],
});
