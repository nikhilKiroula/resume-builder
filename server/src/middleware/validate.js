import { validationResult } from 'express-validator';
import { HTTP_STATUS } from '../constants/index.js';

/**
 * Runs after express-validator chains.
 * Returns 422 with all field errors if validation fails.
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formatted = errors.array().map((e) => ({
      field: e.path,
      message: e.msg,
    }));
    return res.status(HTTP_STATUS.UNPROCESSABLE).json({
      success: false,
      message: 'Validation failed',
      errors: formatted,
    });
  }
  next();
};
