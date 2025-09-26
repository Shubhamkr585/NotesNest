import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Note } from '../models/note.models.js';
import { Order } from '../models/order.models.js';
import { ViewHistory } from '../models/viewHistory.models.js';
import { cloudinary } from '../utils/cloudinary.js';

const viewNote = asyncHandler(async (req, res) => {
  const { noteId } = req.params;
  if (!noteId) throw new ApiError(400, 'Note ID is required');

  const note = await Note.findById(noteId).select('title fileUrl public_id price uploadedBy');
  if (!note) throw new ApiError(404, 'Note not found');

  let message = 'Note view granted';
  if (note.uploadedBy.toString() === req.user._id.toString()) {
    message = 'Note view granted as owner';
  }

  /*
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
  */

  await ViewHistory.findOneAndUpdate(
    { user: req.user._id, note: noteId },
    { user: req.user._id, note: noteId },
    { upsert: true }
  );

  // ✅ Always serve PDFs from Cloudinary as raw resources
  const viewableUrl = cloudinary.url(note.public_id, {
    resource_type: 'raw',
    flags: 'inline'
  });

  return res
    .status(200)
    .json(new ApiResponse(200, { fileUrl: viewableUrl }, message));
});

export { viewNote };
