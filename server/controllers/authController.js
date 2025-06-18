import fs from 'fs/promises';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { User } from '../models/user.models.js';
import { deleteFromCloudinary, uploadOnCloudinary } from '../utils/cloudinary.js';
import jwt from 'jsonwebtoken';

const generateAccessTokenAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, 'Failed to generate tokens');
  }
};

const registerUser = asyncHandler(async (req, res) => {
  let avatarUpload = null;
  const avatarLocalPath = req.files?.avatar?.[0]?.path;

  try {
    const { fullName, email, password, userName } = req.body;

    if ([fullName, email, password, userName].some(field => !field?.trim())) {
      throw new ApiError(400, 'All fields are required');
    }

    const doesUserAlreadyExist = await User.findOne({ $or: [{ email }, { userName }] });
    if (doesUserAlreadyExist) {
      throw new ApiError(409, 'User already exists');
    }

    if (!avatarLocalPath) {
      throw new ApiError(400, 'Avatar is required');
    }

    avatarUpload = await uploadOnCloudinary(avatarLocalPath, 'avatar');
    if (!avatarUpload?.url) {
      throw new ApiError(500, 'Avatar upload failed');
    }

    const user = await User.create({
      fullName,
      userName: userName.toLowerCase(),
      email: email.toLowerCase(),
      password,
      avatar: avatarUpload.url,
      avatarPublicId: avatarUpload.publicId,
    });

    const createdUser = await User.findById(user._id).select('-password -refreshToken');
    if (!createdUser) {
      throw new ApiError(500, 'Error creating user');
    }

    return res.status(201).json(
      new ApiResponse(201, createdUser, 'User created successfully')
    );
  } catch (error) {
    if (avatarUpload?.publicId) await deleteFromCloudinary(avatarUpload.publicId, 'image');
    if (avatarLocalPath) await fs.unlink(avatarLocalPath).catch(err => console.error('Failed to delete avatar:', err));
    throw error instanceof ApiError ? error : new ApiError(500, 'Error creating user');
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, userName, password } = req.body;

  if (!email && !userName) {
    throw new ApiError(400, 'Email or username is required');
  }

  const user = await User.findOne({ $or: [{ email }, { userName }] });
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    throw new ApiError(401, 'Invalid password');
  }

  const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id);

  const loggedInUser = await User.findById(user._id).select('-password -refreshToken');

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  };

  return res
    .status(200)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', refreshToken, options)
    .json(new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, 'Login successful'));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
  if (!incomingRefreshToken) {
    throw new ApiError(401, 'Refresh token is required');
  }

  try {
    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decodedToken?._id);
    if (!user || user.refreshToken !== incomingRefreshToken) {
      throw new ApiError(401, 'Invalid refresh token');
    }

    const { accessToken, refreshToken: newRefreshToken } = await generateAccessTokenAndRefreshToken(user._id);

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    };

    return res
      .status(200)
      .cookie('accessToken', accessToken, options)
      .cookie('refreshToken', newRefreshToken, options)
      .json(new ApiResponse(200, { accessToken, refreshToken: newRefreshToken }, 'Token refreshed successfully'));
  } catch (error) {
    throw error instanceof ApiError ? error : new ApiError(401, 'Failed to refresh token');
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { $set: { refreshToken: undefined } }, { new: true });

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  };

  return res
    .status(200)
    .clearCookie('accessToken', options)
    .clearCookie('refreshToken', options)
    .json(new ApiResponse(200, null, 'Logout successful'));
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new ApiError(400, 'Old and new passwords are required');
  }

  const user = await User.findById(req.user._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
  if (!isPasswordCorrect) {
    throw new ApiError(401, 'Old password is incorrect');
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res.status(200).json(new ApiResponse(200, null, 'Password changed successfully'));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password -refreshToken');
  return res.status(200).json(new ApiResponse(200, user, 'User fetched successfully'));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;
  if (!fullName && !email) {
    throw new ApiError(400, 'Provide at least one detail to update');
  }

  const updateData = {};
  if (fullName) updateData.fullName = fullName.trim();
  if (email) updateData.email = email.toLowerCase();

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: updateData },
    { new: true }
  ).select('-password -refreshToken');

  return res.status(200).json(new ApiResponse(200, user, 'Account details updated successfully'));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, 'Avatar is required');
  }

  const user = await User.findById(req.user._id);
  if (user.avatarPublicId) {
    await deleteFromCloudinary(user.avatarPublicId, 'image');
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath, 'avatar');
  if (!avatar.url) {
    throw new ApiError(500, 'Failed to upload avatar');
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { avatar: avatar.url, avatarPublicId: avatar.publicId } },
    { new: true }
  ).select('-password -refreshToken');

  return res.status(200).json(new ApiResponse(200, updatedUser, 'Avatar updated successfully'));
});

export {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
};