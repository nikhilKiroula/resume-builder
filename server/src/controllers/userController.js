import User from '../models/User.js';
import { HTTP_STATUS } from '../constants/index.js';

/**
 * GET /api/users/profile
 */
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: 'User not found.' });
    }
    res.status(HTTP_STATUS.OK).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/users/profile
 */
export const updateProfile = async (req, res, next) => {
  try {
    const { name, bio, avatar, darkMode } = req.body;

    const allowed = {};
    if (name !== undefined) allowed.name = name.trim();
    if (bio !== undefined) allowed.bio = bio;
    if (avatar !== undefined) allowed.avatar = avatar;
    if (darkMode !== undefined) allowed.darkMode = darkMode;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: allowed },
      { new: true, runValidators: true }
    );

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Profile updated successfully.',
      user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/users/password
 */
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: 'Current password is incorrect.',
      });
    }

    if (currentPassword === newPassword) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'New password must be different from your current password.',
      });
    }

    user.password = newPassword; // Pre-save hook will hash it
    await user.save();

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Password changed successfully.',
    });
  } catch (error) {
    next(error);
  }
};
