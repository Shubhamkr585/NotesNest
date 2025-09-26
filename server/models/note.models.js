import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  title: {
     type: String, 
     required: true 
  },
  description: {
     type: String 
    },
  category: {
     type: String, 
     enum: ['JEE', 'UPSC', 'NEET'], 
     required: true 
    },
  price: {
     type: Number, 
     default: 0 
    },
  fileUrl: {
     type: String, 
     required: true 
    },
  public_id: {
     type: String,
     required: true
    },
  coverImageUrl: {
     type: String 
    },
  uploadedBy: {
     type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true 
    },
  isFeatured: {
     type: Boolean, 
     default: false 
    },
    

}, { timestamps: true });

export const Note = mongoose.model('Note', noteSchema);     
