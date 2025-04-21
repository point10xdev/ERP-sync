import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

// Custom error class for application-specific errors
// This helps us distinguish between different types of errors
export class AppError extends Error {
  statusCode: number;    // HTTP status code for the error
  status: string;        // 'fail' for client errors, 'error' for server errors
  isOperational: boolean;  // Whether this is an operational error (true) or programming error (false)

  constructor(message: string, statusCode: number) {
    super(message);  // Call the parent Error constructor
    this.statusCode = statusCode;
    // Set status based on status code (4xx = fail, 5xx = error)
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;  // Mark as operational error

    // Capture the stack trace for debugging
    Error.captureStackTrace(this, this.constructor);
  }
}

// Global error handling middleware
// This catches all errors in our application and sends appropriate responses
export const errorHandler = (
  err: Error | AppError,  // The error that occurred
  req: Request,          // The request that caused the error
  res: Response,         // The response we'll send
  next: NextFunction    // Function to call to move to the next middleware
) => {
  // Handle our custom AppError
  if (err instanceof AppError) {
    // Log the error with request details
    logger.error(`${err.statusCode} - ${err.message}`, {
      path: req.path,    // The URL path that caused the error
      method: req.method,  // The HTTP method used
      ip: req.ip        // The client's IP address
    });

    // Send error response to client
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  }

  // Handle validation errors (e.g., from express-validator)
  if (err.name === 'ValidationError') {
    logger.error(`400 - ${err.message}`, {
      path: req.path,
      method: req.method,
      ip: req.ip
    });

    return res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }

  // Handle invalid JWT token errors
  if (err.name === 'JsonWebTokenError') {
    logger.error('401 - Invalid token', {
      path: req.path,
      method: req.method,
      ip: req.ip
    });

    return res.status(401).json({
      status: 'fail',
      message: 'Invalid token. Please log in again!'
    });
  }

  // Handle expired JWT token errors
  if (err.name === 'TokenExpiredError') {
    logger.error('401 - Token expired', {
      path: req.path,
      method: req.method,
      ip: req.ip
    });

    return res.status(401).json({
      status: 'fail',
      message: 'Your token has expired! Please log in again.'
    });
  }

  // Handle duplicate key errors (e.g., trying to create a user with an existing email)
  if ((err as any).code === 11000) {
    // Extract the duplicate value from the error message
    const value = (err as any).errmsg.match(/(["'])(\\?.)*?\1/)[0];
    logger.error(`400 - Duplicate field value: ${value}`, {
      path: req.path,
      method: req.method,
      ip: req.ip
    });

    return res.status(400).json({
      status: 'fail',
      message: `Duplicate field value: ${value}. Please use another value!`
    });
  }

  // Handle all other errors (unexpected errors)
  logger.error(`500 - ${err.message}`, {
    path: req.path,
    method: req.method,
    ip: req.ip,
    stack: err.stack  // Include stack trace for debugging
  });

  // Send error response
  // In development, include error details and stack trace
  // In production, send a generic error message
  res.status(500).json({
    status: 'error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
}; 