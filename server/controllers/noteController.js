import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Note } from '../models/note.models.js';
import { User } from '../models/user.models.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';

const createNote = asyncHandler(async (req, res) => {
  if (req.user.role !== 'seller') {
    throw new ApiError(403, 'Only sellers can upload notes');
  }

  const { title, description, category, price, isFeatured } = req.body;
  const file = req.files?.file?.[0]?.path;
  const cover = req.files?.cover?.[0]?.path;

  if (!title || !category || !file) {
    throw new ApiError(400, 'Title, category, and file are required');
  }

  const fileUpload = await uploadOnCloudinary(file);
  if (!fileUpload?.url) {
    throw new ApiError(500, 'File upload failed');
  }

  let coverUpload = null;
  if (cover) {
    coverUpload = await uploadOnCloudinary(cover);
  }

  const note = await Note.create({
    title,
    description,
    category,
    price: parseFloat(price) || 0,
    fileUrl: fileUpload.url,
    coverImageUrl: coverUpload?.url || null,
    uploadedBy: req.user._id,
    isFeatured: isFeatured === 'true',
  });

  return res.status(201).json(new ApiResponse(201, note, 'Note created successfully'));
});

const getNotes = asyncHandler(async (req, res) => {
  const { category, search, isFeatured } = req.query;
  const query = {};

  if (category) query.category = category;
  if (search) query.title = { $regex: search, $options: 'i' };
  if (isFeatured) query.isFeatured = isFeatured === 'true';

  const notes = await Note.find(query)
    .populate('uploadedBy', 'userName')
    .select('title description category price createdAt uploadedBy isFeatured')
    .lean();

  const formattedNotes = notes.map(note => ({
    ...note,
    authorUsername: note.uploadedBy?.userName || 'Unknown',
  }));

  return res.status(200).json(new ApiResponse(200, formattedNotes, 'Notes fetched successfully'));
});

const getNoteById = asyncHandler(async (req, res) => {
  const { noteId } = req.params;

  const note = await Note.findById(noteId)
    .populate('uploadedBy', 'userName')
    .select('title description category price fileUrl uploadedBy createdAt')
    .lean();

  if (!note) {
    throw new ApiError(404, 'Note not found');
  }

  return res.status(200).json(new ApiResponse(200, {
    ...note,
    authorUsername: note.uploadedBy?.userName || 'Unknown',
  }, 'Note fetched successfully'));
});

const getUploadedNotes = asyncHandler(async (req, res) => {
  const { username } = req.params;

  const user = await User.findOne({
    userName: { $regex: `^${username}$`, $options: 'i' }
  }).select('_id').lean();

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const notes = await Note.find({ uploadedBy: user._id })
    .select('title description category price createdAt')
    .lean();

  return res.status(200).json(new ApiResponse(200, notes, 'Uploaded notes fetched successfully'));
});

export { createNote, getNotes, getNoteById, getUploadedNotes };
