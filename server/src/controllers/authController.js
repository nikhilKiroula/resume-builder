import User from '../models/User.js';
import { HTTP_STATUS } from '../constants/index.js';
import {
  generateAccessToken,
  createRefreshToken,
  validateRefreshToken,
  revokeRefreshToken,
  revokeAllUserRefreshTokens,
  getRefreshCookieOptions,
} from '../utils/tokenUtils.js';

// ─── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Issue both tokens, set refresh token in httpOnly cookie,
 * and return access token + user in response body.
 */
const issueTokens = async (user, req, res) => {
  const accessToken = generateAccessToken(user._id);

  const userAgent = req.headers['user-agent'] || '';
  const ipAddress = req.ip || req.connection.remoteAddress || '';

  const { token: refreshToken, expiresAt } = await createRefreshToken(
    user._id,
    userAgent,
    ipAddress
  );

  // Set refresh token as httpOnly cookie — inaccessible to JavaScript
  res.cookie('refreshToken', refreshToken, getRefreshCookieOptions(expiresAt));

  return { accessToken };
};

// ─── Controllers ───────────────────────────────────────────────────────────────

/**
 * POST /api/auth/register
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(HTTP_STATUS.CONFLICT).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }

    const user = await User.create({ name: name.trim(), email, password });
    const { accessToken } = await issueTokens(user, req, res);

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: 'Account created successfully.',
      accessToken,
      user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/login
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    if (!user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    if (!user.isActive) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: 'Your account has been deactivated.',
      });
    }

    user.password = undefined;
    const { accessToken } = await issueTokens(user, req, res);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Logged in successfully.',
      accessToken,
      user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/refresh
 * Uses the httpOnly refresh token cookie to issue a new access token.
 * Implements refresh token rotation — old token is revoked, new one issued.
 */
export const refresh = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;

    if (!token) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: 'No refresh token provided.',
      });
    }

    // Validate and fetch the refresh token record
    let record;
    try {
      record = await validateRefreshToken(token);
    } catch (err) {
      // Clear invalid cookie
      res.clearCookie('refreshToken', { path: '/api/auth' });
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: err.message || 'Invalid or expired session. Please log in again.',
      });
    }

    // Revoke old refresh token (rotation)
    await revokeRefreshToken(token);

    // Fetch the user
    const user = await User.findById(record.userId);
    if (!user || !user.isActive) {
      res.clearCookie('refreshToken', { path: '/api/auth' });
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: 'User not found or account is inactive.',
      });
    }

    // Issue new token pair
    const { accessToken } = await issueTokens(user, req, res);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      accessToken,
      user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/logout
 * Revokes the current refresh token and clears cookie.
 */
export const logout = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;

    if (token) {
      await revokeRefreshToken(token);
    }

    res.clearCookie('refreshToken', { path: '/api/auth' });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Logged out successfully.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/logout-all
 * Revokes ALL refresh tokens for the user (logout from all devices).
 */
export const logoutAll = async (req, res, next) => {
  try {
    await revokeAllUserRefreshTokens(req.user._id);
    res.clearCookie('refreshToken', { path: '/api/auth' });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Logged out from all devices.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/auth/me
 * Returns the current authenticated user (requires valid access token).
 */
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'User not found.',
      });
    }
    res.status(HTTP_STATUS.OK).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};
