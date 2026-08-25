import { Router } from 'express';
import { getProfile, updateProfile, changePassword } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { changePasswordValidator } from '../validators/authValidator.js';

const router = Router();

router.use(protect);

router.route('/profile')
  .get(getProfile)
  .put(updateProfile);

router.put('/password', changePasswordValidator, validate, changePassword);

export default router;
