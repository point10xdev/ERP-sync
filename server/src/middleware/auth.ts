import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { AppError } from './errorHandler';

// Define the structure of our JWT payload
// This tells TypeScript what data is stored in our tokens
interface JwtPayload {
  userId: string;  // The ID of the user
  role: string;    // The user's role (e.g., 'user', 'admin')
  iat: number;     // When the token was issued (timestamp)
  exp: number;     // When the token expires (timestamp)
}

// Extend Express Request type to include user information
// This allows us to access user data in our routes
declare global {
  namespace Express {
    interface Request {
      user?: {      // Optional user object
        id: string;   // User ID
        role: string; // User role
      };
    }
  }
}

// Authentication middleware
// This protects routes by requiring a valid JWT token
export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1) Get token and check if it exists
    // The token is sent in the Authorization header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new AppError('No authentication token, access denied', 401);
    }

    // 2) Verify token
    // This checks if the token is valid and hasn't been tampered with
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

    // 3) Check if user still exists
    // The token might be valid, but the user might have been deleted
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new AppError('The user belonging to this token no longer exists', 401);
    }

    // 4) Check if user changed password after the token was issued
    // If they did, the token should be invalidated
    if (user.passwordChangedAt) {
      const changedTimestamp = Math.floor(user.passwordChangedAt.getTime() / 1000);
      if (decoded.iat < changedTimestamp) {
        throw new AppError('User recently changed password! Please log in again', 401);
      }
    }

    // Grant access to protected route
    // Add user information to the request object
    req.user = {
      id: user.id,
      role: user.role
    };

    // Move to the next middleware or route handler
    next();
  } catch (error) {
    // Pass any errors to the error handling middleware
    next(error);
  }
};

// Role-based access control middleware
// This restricts access to routes based on user roles
export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Check if user is logged in
    if (!req.user) {
      throw new AppError('You are not logged in! Please log in to get access', 401);
    }

    // Check if user has the required role
    if (!roles.includes(req.user.role)) {
      throw new AppError('You do not have permission to perform this action', 403);
    }

    // Move to the next middleware or route handler
    next();
  };
};

// Password reset token verification
// This verifies tokens used for password reset
export const verifyPasswordResetToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from URL parameters
    const { token } = req.params;
    
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

    // Check if user exists
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new AppError('Token is invalid or has expired', 400);
    }

    // Add user information to the request object
    req.user = {
      id: user.id,
      role: user.role
    };

    // Move to the next middleware or route handler
    next();
  } catch (error) {
    // Pass any errors to the error handling middleware
    next(error);
  }
}; 