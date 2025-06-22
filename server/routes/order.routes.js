import express from 'express';
import { createOrder, verifyPayment, getPurchasedNotes } from '../controllers/orderController.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', authMiddleware, createOrder);
router.post('/verify', authMiddleware, verifyPayment);
router.get('/purchased', authMiddleware, getPurchasedNotes);

export default router;