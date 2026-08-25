import User from '../models/User.js';
import { HTTP_STATUS } from '../constants/index.js';
import { verifyAccessToken } from '../utils/tokenUtils.js';

/**
 * Protect routes — verify short-lived JWT access token.
 * The client sends: Authorization: Bearer <accessToken>
 *
 * If expired, the client should call POST /api/auth/refresh
 * using the httpOnly refresh token cookie to get a new access token.
 */
export const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: 'Access denied. Please log in to continue.',
        code: 'NO_TOKEN',
      });
    }

    let decoded;
    try {
      decoded = verifyAccessToken(token);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: 'Access token expired.',
          code: 'TOKEN_EXPIRED', // Frontend intercepts this to trigger refresh
        });
      }
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: 'Invalid access token.',
        code: 'INVALID_TOKEN',
      });
    }

    if (decoded.type !== 'access') {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: 'Invalid token type.',
        code: 'INVALID_TOKEN',
      });
    }

    const user = await User.findById(decoded.id).select('-password');
    if (!user || !user.isActive) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: 'User not found or account is inactive.',
        code: 'USER_NOT_FOUND',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
