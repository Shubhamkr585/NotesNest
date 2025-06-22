import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Note } from '../models/note.models.js';
import { Order } from '../models/order.models.js';
import { ViewHistory } from '../models/viewHistory.models.js';

const viewNote = asyncHandler(async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findById(noteId).select('title fileUrl price');
  if (!note) throw new ApiError(404, 'Note not found');
  if (note.price > 0) {
    const order = await Order.findOne({ buyer: req.user._id, note: noteId, status: 'completed' });
    if (!order) throw new ApiError(403, 'Note not purchased');
  }
  await ViewHistory.create({ user: req.user._id, note: noteId });
  return res.status(200).json(new ApiResponse(200, { fileUrl: note.fileUrl }, 'Note view granted'));
});

export { viewNote };