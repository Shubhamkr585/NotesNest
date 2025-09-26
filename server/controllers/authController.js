import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { User } from '../models/user.models.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import jwt from 'jsonwebtoken';
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js"; 


export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const resetToken = user.getResetPasswordToken();
  console.log(resetToken);
  await user.save({ validateBeforeSave: false });

 // Assuming you set FRONTEND_URL in .env like "https://your-frontend.com"
const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;


  try {
    await sendEmail({
      to: user.email,
      subject: "Password Reset",
      text: `You requested a password reset. Click here: ${resetUrl}`,
    });
    res.json({ message: "Reset link sent to email" });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    res.status(500).json({ message: "Email could not be sent" });
  }
};


export const resetPassword = async (req, res) => {
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  console.log(user);
  if (!user) return res.status(400).json({ message: "Invalid or expired token" });

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  res.json({ message: "Password reset successful" });
};



const generateTokens = async (userId) => {
  const user = await User.findById(userId);
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });
  return { accessToken, refreshToken };
};

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
};

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, userName, password, role } = req.body;
  if ([fullName, email, userName, password].some((field) => !field?.trim())) {
    throw new ApiError(400, 'All fields are required');
  }
  const existedUser = await User.findOne({ $or: [{ email }, { userName }] });
  if (existedUser) {
    throw new ApiError(409, 'User with email or username already exists');
  }
  const user = await User.create({
    fullName,
    email: email.toLowerCase(),
    userName: userName.toLowerCase(),
    password,
    role: role || 'primary',
  });

  const createdUser = await User.findById(user._id).select('-password -refreshToken');
  if (!createdUser) {
    throw new ApiError(500, 'Failed to register user');
  }

  return res.status(201).json(new ApiResponse(201, createdUser, 'User registered successfully'));
});

const loginUser = asyncHandler(async (req, res) => {
    
  console.log(req.body);

  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required');
  }
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid credentials');
  }
  const { accessToken, refreshToken } = await generateTokens(user._id);
  const loggedInUser = await User.findById(user._id).select('-password -refreshToken');

  return res
    .status(200)
    .cookie('accessToken', accessToken, cookieOptions)
    .cookie('refreshToken', refreshToken, cookieOptions)
    .json(new ApiResponse(200, { user: loggedInUser }, 'User logged in successfully'));
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } }, { new: true });

  return res
    .status(200)
    .clearCookie('accessToken', cookieOptions)
    .clearCookie('refreshToken', cookieOptions)
    .json(new ApiResponse(200, {}, 'User logged out successfully'));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
  if (!incomingRefreshToken) throw new ApiError(401, 'Unauthorized request');

  const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
  const user = await User.findById(decodedToken._id);
  if (!user || user.refreshToken !== incomingRefreshToken) {
    throw new ApiError(401, 'Invalid refresh token');
  }
  const { accessToken, refreshToken: newRefreshToken } = await generateTokens(user._id);

  return res
    .status(200)
    .cookie('accessToken', accessToken, cookieOptions)
    .cookie('refreshToken', newRefreshToken, cookieOptions)
    .json(new ApiResponse(200, { accessToken, refreshToken: newRefreshToken }, 'Access token refreshed'));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res.status(200).json(new ApiResponse(200, req.user, 'User fetched successfully'));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const updates = req.body; // grab only what’s sent
  if (!updates || Object.keys(updates).length === 0) {
    return res.status(400).json(new ApiResponse(400, null, 'No fields provided for update'));
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: updates },
    { new: true, runValidators: true }
  ).select("-password -refreshToken");

  return res.status(200).json(new ApiResponse(200, user, 'Account updated successfully'));
});


const updateUserAvatar = asyncHandler(async (req, res) => {

  const avatarLocalPath = req.files?.avatar[0]?.path;
  
  if (!avatarLocalPath) throw new ApiError(400, 'Avatar file is required');
  
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar) throw new ApiError(500, 'Avatar upload failed and here is the error: ' + avatar.error.message);
  
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { avatar: avatar.url } },
    { new: true }
  ).select('-password -refreshToken');
  
  return res.status(200).json(new ApiResponse(200, user, 'Avatar updated successfully'));
});

const getUserByUsername = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const user = await User.findOne({ userName: { $regex: `^${username}$`, $options: 'i' } })
    .select('fullName userName role avatar')
    .lean();
  if (!user) throw new ApiError(404, 'User not found');
  return res.status(200).json(new ApiResponse(200, user, 'User profile fetched successfully'));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  getUserByUsername,
};
