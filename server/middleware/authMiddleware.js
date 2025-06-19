import jwt from 'jsonwebtoken';
import { User } from '../models/user.models.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const authMiddleware = asyncHandler(async (req, res, next) => {
  // Extract token from cookies or Authorization header
  const token =
    req.cookies?.accessToken || 
    req.header('Authorization')?.replace(/^Bearer\s+/, '');

  if (!token) {
    throw new ApiError(401, 'No token provided');
  }

  try {
    // Verify the access token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    
    // Fetch user, excluding sensitive fields
    const user = await User.findById(decoded._id).select('-password -refreshToken');
    if (!user) {
      throw new ApiError(401, 'User not found');
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new ApiError(401, 'Access token expired');
    }
    if (error.name === 'JsonWebTokenError') {
      throw new ApiError(401, 'Invalid token');
    }
    throw new ApiError(401, error.message || 'Authentication failed');
  }
});

export default authMiddleware;