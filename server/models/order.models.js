import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  note: { type: mongoose.Schema.Types.ObjectId, ref: 'Note', required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  razorpayOrderId: { type: String },
  createdAt: { type: Date, default: Date.now },
});

orderSchema.index({ buyer: 1, status: 1 });

export const Order = mongoose.model('Order', orderSchema);