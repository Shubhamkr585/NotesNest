// server/middlewares/auth.middleware.js
import jwt from 'jsonwebtoken';
import { User } from '../models/user.models.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const authMiddleware = asyncHandler(async (req, res, next) => {
  // Extract tokens
  const accessToken =
    req.cookies?.accessToken || req.header('Authorization')?.replace(/^Bearer\s+/, '');
  const refreshToken = req.cookies?.refreshToken;

  if (!accessToken) {
    throw new ApiError(401, 'No access token provided');
  }

  try {
    // Verify access token
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded._id).select('-password -refreshToken');
    if (!user) {
      throw new ApiError(401, 'User not found');
    }
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError' && refreshToken) {
      try {
        // Verify refresh token
        const decodedRefresh = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decodedRefresh._id);
        if (!user || user.refreshToken !== refreshToken) {
          throw new ApiError(401, 'Invalid refresh token');
        }

        // Generate new tokens
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
          await generateAccessTokenAndRefreshToken(user._id);

        // Set new cookies
        const options = {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
        };
        res
          .cookie('accessToken', newAccessToken, options)
          .cookie('refreshToken', newRefreshToken, options);

        // Attach user to request
        req.user = await User.findById(user._id).select('-password -refreshToken');
        next();
      } catch (refreshError) {
        throw new ApiError(401, 'Failed to refresh token');
      }
    } else {
      if (error.name === 'TokenExpiredError') {
        throw new ApiError(401, 'Access token expired');
      }
      if (error.name === 'JsonWebTokenError') {
        throw new ApiError(401, 'Invalid token');
      }
      throw new ApiError(401, error.message || 'Authentication failed');
    }
  }
});

export default authMiddleware;