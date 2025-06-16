import mongoose, { Schema } from 'mongoose';

const noteSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: [50, 'Title cannot exceed 50 characters'],
    },
    coverImage: {
      type: String, // Cloudinary URL for cover image
      default: 'https://res.cloudinary.com/your_cloud_name/image/upload/v1/default-cover.png', // Replace with your default
      match: [/^https:\/\/res\.cloudinary\.com\/.*\.(jpg|jpeg|png|gif)$/, 'Invalid cover image URL'], // Basic validation
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: [300, 'Description cannot exceed 300 characters'],
    },
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    buyerIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ], // Renamed for clarity
    price: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be negative'],
    },
    examType: {
      type: String,
      required: true,
      enum: ['JEE Main', 'JEE Advanced', 'UPSC Prelims', 'UPSC Mains', 'Other'],
      default: 'Other',
    },
    subject: {
      type: String,
      required: true,
      enum: [
        'Physics',
        'Chemistry',
        'Mathematics',
        'History',
        'Geography',
        'Polity',
        'Economy',
        'Other',
      ],
      default: 'Other',
    },
    fileUrl: {
      type: String, // Cloudinary URL for note PDF
      required: true,
      match: [/^https:\/\/res\.cloudinary\.com\/.*\.pdf$/, 'Invalid note file URL'],
    },
    tricksAndGuides: {
      type: String, // Cloudinary URL for exclusive content
      match: [/^https:\/\/res\.cloudinary\.com\/.*\.pdf$/, 'Invalid tricks/guides URL'],
    },
    isPublished: {
      type: Boolean,
      default: false, // Allows drafts
    },
  },
  {
    timestamps: true,
  }
);

export const Note = mongoose.model('Note', noteSchema);