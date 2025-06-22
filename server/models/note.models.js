import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, enum: ['JEE', 'UPSC'], required: true },
  price: { type: Number, default: 0 },
  fileUrl: { type: String, required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isFeatured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

noteSchema.index({ category: 1, title: 1, isFeatured: 1 });

export const Note = mongoose.model('Note', noteSchema);