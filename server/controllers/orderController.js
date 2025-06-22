import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Order } from '../models/order.models.js';
import { Note } from '../models/note.models.js';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createOrder = asyncHandler(async (req, res) => {
  const { noteId } = req.body;
  const note = await Note.findById(noteId);
  if (!note) throw new ApiError(404, 'Note not found');
  if (note.price === 0) throw new ApiError(400, 'Note is free');
  const order = await razorpay.orders.create({
    amount: note.price * 100, // In paise
    currency: 'INR',
    receipt: `note_${noteId}`,
  });
  const dbOrder = await Order.create({
    buyer: req.user._id,
    note: noteId,
    amount: note.price,
    razorpayOrderId: order.id,
  });
  return res.status(200).json(new ApiResponse(200, { order: dbOrder, razorpayOrder: order }, 'Order created'));
});

const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const crypto = require('crypto');
  const generated_signature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');
  if (generated_signature !== razorpay_signature) {
    throw new ApiError(400, 'Invalid payment signature');
  }
  await Order.updateOne({ razorpayOrderId: razorpay_order_id }, { status: 'completed' });
  return res.status(200).json(new ApiResponse(200, {}, 'Payment verified'));
});

const getPurchasedNotes = asyncHandler(async (req, res) => {
  const orders = await Order.find({ buyer: req.user._id, status: 'completed' })
    .populate('note', 'title description category price fileUrl')
    .select('note');
  const notes = orders.map((order) => order.note);
  return res.status(200).json(new ApiResponse(200, notes, 'Purchased notes fetched successfully'));
});

export { createOrder, verifyPayment, getPurchasedNotes };