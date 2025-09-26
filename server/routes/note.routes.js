import { Router } from 'express';
import {
  createNote,
  getNotes,
  getNoteById,
  getUploadedNotes,
} from '../controllers/noteController.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = Router();

router.route('/')
    .post(authMiddleware, upload.fields([{ name: 'file', maxCount: 1 }, { name: 'cover', maxCount: 1 }]), createNote)
    .get(getNotes);

router.get('/:noteId', getNoteById);
router.get('/uploaded/:username', getUploadedNotes);

export default router;