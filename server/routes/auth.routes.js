import { Router } from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  getUserByUsername,
  forgotPassword,
  resetPassword
} from '../controllers/authController.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);

// Secured Routes
router.post('/logout', authMiddleware, logoutUser);
router.post('/refresh-token', refreshAccessToken);
router.get('/current-user', authMiddleware, getCurrentUser);
router.patch('/update-account', authMiddleware, updateAccountDetails);
router.patch('/update-avatar', authMiddleware, upload.fields([{ name: 'avatar', maxCount: 1 }]), updateUserAvatar);
router.get('/:username', getUserByUsername);


export default router;
