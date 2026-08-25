import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import RefreshToken from '../models/RefreshToken.js';

// ─── Token Generation ──────────────────────────────────────────────────────────

/**
 * Generate a short-lived JWT access token (default 15m)
 */
export const generateAccessToken = (userId) => {
  return jwt.sign(
    { id: userId, type: 'access' },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m' }
  );
};

/**
 * Generate an opaque refresh token string (random, stored in DB)
 * Using a random hex string instead of a JWT for refresh tokens
 * prevents refresh token contents from being decoded client-side.
 */
const generateRefreshTokenString = () => {
  return crypto.randomBytes(64).toString('hex');
};

/**
 * Persist refresh token in DB and return the token string
 */
export const createRefreshToken = async (userId, userAgent = '', ipAddress = '') => {
  const token = generateRefreshTokenString();

  // Parse the expiry duration to a Date
  const expiresInMs = parseDuration(process.env.JWT_REFRESH_EXPIRES_IN || '7d');
  const expiresAt = new Date(Date.now() + expiresInMs);

  await RefreshToken.create({
    token,
    userId,
    expiresAt,
    userAgent,
    ipAddress,
  });

  return { token, expiresAt };
};

/**
 * Verify an access token and return the decoded payload
 */
export const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
};

/**
 * Find and validate a refresh token from DB
 * Returns the record if valid, throws if not
 */
export const validateRefreshToken = async (token) => {
  const record = await RefreshToken.findOne({ token });

  if (!record) {
    throw new Error('Refresh token not found');
  }
  if (record.revoked) {
    // Possible token reuse attack — revoke all tokens for this user
    await RefreshToken.updateMany({ userId: record.userId }, { revoked: true });
    throw new Error('Refresh token has been revoked');
  }
  if (record.expiresAt < new Date()) {
    throw new Error('Refresh token expired');
  }

  return record;
};

/**
 * Revoke a single refresh token (logout)
 */
export const revokeRefreshToken = async (token) => {
  await RefreshToken.findOneAndUpdate({ token }, { revoked: true });
};

/**
 * Revoke ALL refresh tokens for a user (logout all devices)
 */
export const revokeAllUserRefreshTokens = async (userId) => {
  await RefreshToken.updateMany({ userId }, { revoked: true });
};

/**
 * Cookie options for the refresh token cookie
 */
export const getRefreshCookieOptions = (expiresAt) => ({
  httpOnly: true,                              // Not accessible via JS
  secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  expires: expiresAt,
  path: '/api/auth',                           // Only sent to auth endpoints
});

// ─── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Parse duration strings like "7d", "15m", "1h" to milliseconds
 */
const parseDuration = (str) => {
  const units = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
  const match = str.match(/^(\d+)([smhd])$/);
  if (!match) return 7 * 86400000; // default 7 days
  return parseInt(match[1]) * units[match[2]];
};
