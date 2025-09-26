import dotenv from 'dotenv';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Order } from '../models/order.models.js';
import { Note } from '../models/note.models.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createOrder = asyncHandler(async (req, res) => {
  const { noteId } = req.body;
  if (!noteId) throw new ApiError(400, 'Note ID is required');
  
  const note = await Note.findById(noteId);
  if (!note) throw new ApiError(404, 'Note not found');
  if (note.price <= 0) throw new ApiError(400, 'Note is free or has an invalid price');
 
  let razorpayOrder;
  try {
    razorpayOrder = await razorpay.orders.create({
      amount: Math.round(note.price * 100),
      currency: 'INR',
      receipt: `note_${noteId}`,
    });
  } catch (error) {
    console.error("Razorpay order creation failed:", error);
    throw new ApiError(500, "Failed to create payment order with Razorpay. Please check server logs and Razorpay credentials.");
  }

  const dbOrder = await Order.create({
    buyer: req.user._id,
    note: noteId,
    amount: note.price,
    razorpayOrderId: razorpayOrder.id,
  });

  return res.status(200).json(new ApiResponse(200, { order: dbOrder, razorpayOrder }, 'Order created successfully'));
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
    throw new ApiError(400, 'Invalid payment signature. Please try again.');
  }

  await Order.findOneAndUpdate(
    { razorpayOrderId: razorpay_order_id },
    { status: 'completed', razorpayPaymentId: razorpay_payment_id },
    { new: true }
  );

  return res.status(200).json(new ApiResponse(200, {}, 'Payment verified successfully'));
});

const getPurchasedNotes = asyncHandler(async (req, res) => {
  const orders = await Order.find({ buyer: req.user._id, status: 'completed' })
    .populate('note', 'title description category price fileUrl coverImageUrl')
    .select('note');

  const notes = orders.map(order => order.note).filter(Boolean);

  return res.status(200).json(new ApiResponse(200, notes, 'Purchased notes fetched successfully'));
});

export { createOrder, verifyPayment, getPurchasedNotes };