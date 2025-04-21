import { Request, Response, NextFunction } from 'express';
import { ValidationError, validationResult } from 'express-validator';
import { AppError } from './errorHandler';

// Middleware function to validate request data and sanitize input
// Middleware is like a checkpoint that requests must pass through
export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Get the results of all validation checks that were run on the request
  // These checks are defined in the routes (like checking if email is valid)
  const errors = validationResult(req);
  
  // If there are any validation errors, we need to handle them
  if (!errors.isEmpty()) {
    // Format the errors into a more readable structure
    // This makes it easier to show the user what went wrong
    const formattedErrors = errors.array().map(error => ({
      field: error.param,    // Which field had the error (e.g., 'email', 'password')
      message: error.msg,    // The error message to show the user
      value: error.value     // The invalid value that was provided
    }));

    // Throw a 400 Bad Request error with the validation details
    // This will be caught by our error handler middleware
    throw new AppError('Validation Error', 400);
  }

  // Sanitize the request body by cleaning up string values
  // This helps prevent issues with extra spaces or special characters
  if (req.body) {
    // Loop through each field in the request body
    Object.keys(req.body).forEach(key => {
      // If the value is a string, trim whitespace from both ends
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key].trim();
      }
    });
  }

  // If we get here, all validation passed
  // Call next() to move on to the next middleware or route handler
  next();
};

// Custom validation functions for specific fields
// These are helper functions that can be used in routes

// Function to validate email format
export const validateEmail = (email: string) => {
  // Regular expression (regex) for basic email validation
  // This checks if the email has the basic structure: something@something.something
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Function to validate password strength
export const validatePassword = (password: string) => {
  // Regular expression for strong password validation
  // The password must meet all these requirements:
  // - At least 8 characters long
  // - At least 1 uppercase letter (A-Z)
  // - At least 1 lowercase letter (a-z)
  // - At least 1 number (0-9)
  // - At least 1 special character (@$!%*?&)
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// Function to validate phone number format
export const validatePhoneNumber = (phone: string) => {
  // Regular expression for international phone number validation
  // The phone number must:
  // - Start with an optional + (for international numbers)
  // - Have 1-15 digits
  // - No spaces or special characters allowed
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone);
}; 