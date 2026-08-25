import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import { protect } from '../middleware/auth.js';
import {
  generateSummary,
  generateBulletPoints,
  getSkillSuggestions,
  analyzeResume,
  getAIStatus,
} from '../controllers/aiController.js';

// Rate limit AI endpoints — 20 requests per 10 minutes per user
const aiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many AI requests. Please wait a few minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const router = Router();

router.use(protect);

router.get('/status', getAIStatus);
router.post('/summary', aiLimiter, generateSummary);
router.post('/bullet-points', aiLimiter, generateBulletPoints);
router.post('/suggestions', aiLimiter, getSkillSuggestions);
router.post('/improve', aiLimiter, analyzeResume);

export default router;
