import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from "crypto";

const userSchema = new mongoose.Schema({
  fullName: {
     type: String,
     required: true,
     trim: true 
      },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true, 
    trim: true,
    //apply regex for email validation
    match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Please enter a valid email address"]
  },
  userName: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true, 
    trim: true 
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    match: [
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character",
    ],
  },
  role: 
  { type: String, 
    enum: ['primary', 'seller'], 
    default: 'primary' 
  },
  avatar: 
  { 
    type: String 
  },
  refreshToken: 
  { 
    type: String 
  },

  resetPasswordToken: String,
  resetPasswordExpire: Date,

  
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcryptjs.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (password) {
  return await bcryptjs.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { _id: this._id, email: this.email, userName: this.userName, role: this.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { _id: this._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};



userSchema.methods.getResetPasswordToken = function () {
  // Generate token
  console.log("here is the actual problem lies")
  const resetToken = crypto.randomBytes(20).toString('hex');
  const cp=resetToken

  // Hash token and save to DB
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expiry (15 minutes here)
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return cp;
}

export const User = mongoose.model('User', userSchema);