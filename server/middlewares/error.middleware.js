import { ApiError } from '../utils/ApiError.js';
import logger from '../utils/winston.js';

const errorMiddleware = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  if (err.name === 'CastError') {
      message = `Resource not found. Invalid: ${err.path}`;
      statusCode = 400;
  }
  
  if (err.code === 11000) {
      message = `Duplicate ${Object.keys(err.keyValue)} entered`;
      statusCode = 400;
  }

  if (err.name === 'JsonWebTokenError') {
      message = 'JSON Web Token is invalid. Try again!';
      statusCode = 400;
  }

  if (err.name === 'TokenExpiredError') {
      message = 'JSON Web Token is expired. Try again!';
      statusCode = 400;
  }
  
  logger.error(`${statusCode} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

  return res.status(statusCode).json({
    success: false,
    message: message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

export default errorMiddleware;