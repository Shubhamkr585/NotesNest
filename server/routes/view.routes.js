import express from 'express';
import { viewNote } from '../controllers/viewController.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/:noteId', authMiddleware, viewNote);

export default router;