import { Router } from 'express';
import { register, login, refresh, logout, logoutAll, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { registerValidator, loginValidator } from '../validators/authValidator.js';

const router = Router();

// Public routes
router.post('/register', registerValidator, validate, register);
router.post('/login', loginValidator, validate, login);
router.post('/refresh', refresh);   // Uses httpOnly cookie
router.post('/logout', logout);     // Revokes refresh token

// Protected routes
router.post('/logout-all', protect, logoutAll);
router.get('/me', protect, getMe);

export default router;
