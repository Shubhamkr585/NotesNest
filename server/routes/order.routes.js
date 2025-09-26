import { Router } from 'express';
import {
  createOrder,
  verifyPayment,
  getPurchasedNotes,
} from '../controllers/orderController.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authMiddleware);

router.post('/', createOrder);
router.post('/verify', verifyPayment); 
router.get('/purchased', getPurchasedNotes);

export default router;