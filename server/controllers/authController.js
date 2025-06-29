import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { User } from '../models/user.models.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import jwt from 'jsonwebtoken';

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
  sameSite: 'None',
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
    .json(new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, 'User logged in successfully'));
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
  if (!incomingRefreshToken) {
    throw new ApiError(401, 'Unauthorized request');
  }
  const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
  const user = await User.findById(decodedToken._id);
  if (!user || user.refreshToken !== incomingRefreshToken) {
    throw new ApiError(401, 'Invalid refresh token');
  }
  const { accessToken, refreshToken } = await generateTokens(user._id);

  return res
    .status(200)
    .cookie('accessToken', accessToken, cookieOptions)
    .cookie('refreshToken', refreshToken, cookieOptions)
    .json(new ApiResponse(200, { accessToken, refreshToken }, 'Access token refreshed'));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password -refreshToken');
  if (!user) throw new ApiError(404, 'User not found');
  return res.status(200).json(new ApiResponse(200, user, 'User fetched successfully'));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, email, userName } = req.body;
  if (!fullName || !email || !userName) {
    throw new ApiError(400, 'All fields are required');
  }
  const user = await User.findById(req.user._id);
  if (await User.findOne({ $or: [{ email }, { userName }], _id: { $ne: user._id } })) {
    throw new ApiError(409, 'Email or username already exists');
  }
  user.fullName = fullName;
  user.email = email.toLowerCase();
  user.userName = userName.toLowerCase();
  await user.save();
  return res.status(200).json(new ApiResponse(200, user, 'Account updated successfully'));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.files?.avatar[0]?.path;
  if (!avatarLocalPath) throw new ApiError(400, 'Avatar file is required');
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar) throw new ApiError(500, 'Avatar upload failed');
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { avatar: avatar.url },
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
