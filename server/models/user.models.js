import mongoose, { Schema } from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [20, 'Username cannot exceed 20 characters'],
      index: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
      match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Invalid email format'],
      index: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      maxlength: [50, 'Full name cannot exceed 50 characters'],
    },
    avatar: {
      type: String, // Cloudinary URL
      default: 'https://res.cloudinary.com/your_cloud_name/image/upload/v1/default-avatar.png', // Replace with your default
    },
    avatarPublicId: {
      type: String, // Public ID for Cloudinary
    },
    role: {
      type: String,
      enum: ['buyer', 'seller', 'admin'],
      default: 'buyer',
      required: true,
    },
    refreshToken: {
      type: String,
    },
    purchasedNotes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Note',
      },
    ], // References to purchased notes
    uploadedNotes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Note',
      },
    ], // References to notes uploaded by sellers
  },
  {
    timestamps: true,
  }
);

// Password hashing middleware
userSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(error);
  }
});

// Check password match
userSchema.methods.isPasswordCorrect = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

// Generate access token
userSchema.methods.generateAccessToken = function () {
  try {
    return jwt.sign(
      {
        _id: this._id,
        email: this.email,
        userName: this.userName,
        fullName: this.fullName,
        role: this.role,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '15m' }
    );
  } catch (error) {
    throw new Error('Access token generation failed');
  }
};

// Generate refresh token
userSchema.methods.generateRefreshToken = function () {
  try {
    return jwt.sign(
      { _id: this._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '7d' }
    );
  } catch (error) {
    throw new Error('Refresh token generation failed');
  }
};

// Update or clear refresh token
userSchema.methods.updateRefreshToken = async function (token = null) {
  try {
    this.refreshToken = token;
    await this.save();
  } catch (error) {
    throw new Error('Refresh token update failed');
  }
};

export const User = mongoose.model('User', userSchema);