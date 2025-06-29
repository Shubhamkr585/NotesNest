import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Note } from '../models/note.models.js';
import { Order } from '../models/order.models.js';
import { ViewHistory } from '../models/viewHistory.models.js';

const viewNote = asyncHandler(async (req, res) => {
  const { noteId } = req.params;

  // 1. Validate input
  if (!noteId) {
    throw new ApiError(400, 'Note ID is required');
  }

  // 2. Fetch the note
  const note = await Note.findById(noteId).select('title fileUrl price');
  if (!note) {
    throw new ApiError(404, 'Note not found');
  }

  // 3. Check access
  if (note.price > 0) {
    const order = await Order.findOne({
      buyer: req.user._id,
      note: noteId,
      status: 'completed'
    });

    if (!order) {
      throw new ApiError(403, 'Access denied. You must purchase this note to view it.');
    }
  }

  // 4. Log view history
  await ViewHistory.create({ user: req.user._id, note: noteId });

  // 5. Return success response
  return res.status(200).json(
    new ApiResponse(200, { fileUrl: note.fileUrl }, 'Note view granted')
  );
});

export { viewNote };
