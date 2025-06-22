import express from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  getUserByUsername,
} from '../controllers/authController.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', authMiddleware, logoutUser);
router.post('/refresh-token', refreshAccessToken);
router.get('/current-user', authMiddleware, getCurrentUser);
router.patch('/update-account', authMiddleware, updateAccountDetails);
router.patch('/update-avatar', authMiddleware, upload.fields([{ name: 'avatar', maxCount: 1 }]), updateUserAvatar);
router.get('/:username', getUserByUsername);

export default router;