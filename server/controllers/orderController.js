import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Order } from '../models/order.models.js';
import { Note } from '../models/note.models.js';
import Razorpay from 'razorpay';
import crypto from 'crypto'; // Use top-level import for ESM

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createOrder = asyncHandler(async (req, res) => {
  const { noteId } = req.body;

  if (!noteId) throw new ApiError(400, 'Note ID is required');

  const note = await Note.findById(noteId);
  if (!note) throw new ApiError(404, 'Note not found');
  if (note.price === 0) throw new ApiError(400, 'Note is free');

  const razorpayOrder = await razorpay.orders.create({
    amount: Math.round(note.price * 100), // Convert to paise
    currency: 'INR',
    receipt: `note_${noteId}_${Date.now()}`,
  });

  const dbOrder = await Order.create({
    buyer: req.user._id,
    note: noteId,
    amount: note.price,
    razorpayOrderId: razorpayOrder.id,
  });

  return res.status(200).json(
    new ApiResponse(200, { order: dbOrder, razorpayOrder }, 'Order created successfully')
  );
});

const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    throw new ApiError(400, 'Incomplete payment verification data');
  }

  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (generatedSignature !== razorpay_signature) {
    throw new ApiError(400, 'Invalid payment signature');
  }

  const order = await Order.findOneAndUpdate(
    { razorpayOrderId: razorpay_order_id },
    { status: 'completed' },
    { new: true }
  );

  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  return res.status(200).json(new ApiResponse(200, {}, 'Payment verified successfully'));
});

const getPurchasedNotes = asyncHandler(async (req, res) => {
  const orders = await Order.find({ buyer: req.user._id, status: 'completed' })
    .populate('note', 'title description category price fileUrl')
    .select('note');

  const notes = orders.map(order => order.note);

  return res.status(200).json(new ApiResponse(200, notes, 'Purchased notes fetched successfully'));
});

export { createOrder, verifyPayment, getPurchasedNotes };
