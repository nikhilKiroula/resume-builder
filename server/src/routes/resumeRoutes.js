import { Router } from 'express';
import {
  getResumes,
  createResume,
  getResume,
  updateResume,
  deleteResume,
  duplicateResume,
  togglePublic,
  getPublicResume,
} from '../controllers/resumeController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

// Public route — MUST be before /:id to avoid route conflict
router.get('/public/:slug', getPublicResume);

// All routes below require authentication
router.use(protect);

router.route('/')
  .get(getResumes)
  .post(createResume);

router.route('/:id')
  .get(getResume)
  .put(updateResume)
  .delete(deleteResume);

router.post('/:id/duplicate', duplicateResume);
router.patch('/:id/public', togglePublic);

export default router;
