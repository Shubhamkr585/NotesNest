import express from 'express';
import {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
} from '../controllers/authController.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { upload } from '../middleware/multer.middlewares.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', upload.single('avatar'), asyncHandler(registerUser));
router.post('/login', asyncHandler(loginUser));
router.post('/refresh-token', asyncHandler(refreshAccessToken));
router.post('/logout', authMiddleware, asyncHandler(logoutUser));
router.post('/change-password', authMiddleware, asyncHandler(changeCurrentPassword));
router.get('/current-user', authMiddleware, asyncHandler(getCurrentUser));
router.patch('/update-account', authMiddleware, asyncHandler(updateAccountDetails));
router.patch('/update-avatar', authMiddleware, upload.single('avatar'), asyncHandler(updateUserAvatar));

export default router;