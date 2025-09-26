import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Note } from '../models/note.models.js';
import { User } from '../models/user.models.js';
import { uploadOnCloudinary, cloudinary } from '../utils/cloudinary.js';

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
  if (!fileUpload?.url) throw new ApiError(500, 'File upload failed');

  let coverUpload = null;
  if (cover) {
    coverUpload = await uploadOnCloudinary(cover);
  }

  const note = await Note.create({
    title,
    description,
    category,
    price: parseFloat(price) || 0, // Ensure price is a number
    fileUrl: fileUpload.url,
    public_id: fileUpload.public_id,
    coverImageUrl: coverUpload?.url || null,
    uploadedBy: req.user._id,
    isFeatured: isFeatured === 'true' || isFeatured === true,
  });

  return res.status(201).json(
    new ApiResponse(201, note, 'Note created successfully')
  );
});

const getNotes = asyncHandler(async (req, res) => {
  const { category, search, isFeatured } = req.query;
  const query = {};

  if (category) query.category = category;
  if (search) query.title = { $regex: search, $options: 'i' };
  if (isFeatured) query.isFeatured = isFeatured === 'true';

  const notes = await Note.find(query)
    .populate('uploadedBy', 'userName')
    .select('title description category price createdAt uploadedBy isFeatured coverImageUrl')
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
    .select('title description category price fileUrl public_id uploadedBy createdAt coverImageUrl')
    .lean();
  if (!note) throw new ApiError(404, 'Note not found');
  
  // Generate a new, correctly formed URL using the Cloudinary SDK
  const resourceType = note.fileUrl.includes('/raw/') ? 'raw' : 'image';
  const viewableUrl = cloudinary.url(note.public_id, {
    resource_type: resourceType,
    flags: ['inline'],
    format: 'pdf' // Explicitly set format for raw files
  });

  const formattedNote = { 
    ...note, 
    authorUsername: note.uploadedBy?.userName || 'Unknown',
    fileUrl: viewableUrl // Override with the viewable URL
  };
  return res.status(200).json(new ApiResponse(200, formattedNote, 'Note fetched successfully'));
});

const getUploadedNotes = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const user = await User.findOne({ userName: { $regex: `^${username}$`, $options: 'i' } }).select('_id').lean();
  if (!user) throw new ApiError(404, 'User not found');
  const notes = await Note.find({ uploadedBy: user._id }).select('-__v').lean();
  return res.status(200).json(new ApiResponse(200, notes, 'Uploaded notes fetched successfully'));
});

export { createNote, getNotes, getNoteById, getUploadedNotes };