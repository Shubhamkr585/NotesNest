import mongoose from 'mongoose';

const viewHistorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  note: { type: mongoose.Schema.Types.ObjectId, ref: 'Note', required: true },
  viewedAt: { type: Date, default: Date.now },
});

viewHistorySchema.index({ user: 1, note: 1 });

export const ViewHistory = mongoose.model('ViewHistory', viewHistorySchema);