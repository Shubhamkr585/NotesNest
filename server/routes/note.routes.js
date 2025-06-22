import express from 'express';
import { createNote, getNotes, getNoteById, getUploadedNotes } from '../controllers/noteController.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = express.Router();

router.get('/', getNotes);
router.get('/:noteId', getNoteById);
router.post('/', authMiddleware, upload.fields([{ name: 'file', maxCount: 1 }]), createNote);
router.get('/uploaded/:username', getUploadedNotes);

export default router;