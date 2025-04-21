// Import required dependencies
// express: Web framework for creating routes
// jwt: Library for creating and verifying JSON Web Tokens
// express-validator: Middleware for validating request data
// User: Our User model for database operations
// validateRequest: Custom middleware for request validation
import express from 'express';
import jwt from 'jsonwebtoken';
import { body } from 'express-validator';
import { User } from '../models/User';
import { validateRequest } from '../middleware/validateRequest';

// Create a new router instance
// A router helps organize our routes in a modular way
const router = express.Router();

// Register route
// This endpoint allows new users to create an account
router.post(
  '/register',
  // Request validation middleware
  // This ensures the data sent by the user is valid
  [
    body('email').isEmail().withMessage('Please enter a valid email'),  // Check if email is valid
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),  // Check password length
    body('name').notEmpty().withMessage('Name is required'),  // Check if name is provided
    validateRequest  // Run our custom validation middleware
  ],
  async (req: express.Request, res: express.Response) => {
    try {
      // Get user data from request body
      const { email, password, name } = req.body;

      // Check if user already exists
      // This prevents duplicate accounts with the same email
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Create new user in the database
      // The password will be automatically hashed by the User model
      const user = await User.create({ email, password, name });

      // Create JWT token for authentication
      // This token will be used to identify the user in future requests
      const token = jwt.sign(
        { userId: user.id },  // Store user ID in the token
        process.env.JWT_SECRET as string,  // Sign token with our secret key
        { expiresIn: '24h' }  // Token expires in 24 hours
      );

      // Send success response with token and user data
      // We don't send the password back for security
      res.status(201).json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      });
    } catch (error) {
      // Handle any unexpected errors
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Login route
// This endpoint allows existing users to log in
router.post(
  '/login',
  // Request validation middleware
  [
    body('email').isEmail().withMessage('Please enter a valid email'),  // Check if email is valid
    body('password').exists().withMessage('Password is required'),  // Check if password is provided
    validateRequest  // Run our custom validation middleware
  ],
  async (req: express.Request, res: express.Response) => {
    try {
      // Get login credentials from request body
      const { email, password } = req.body;

      // Check if user exists
      // If not, the email is invalid
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Check if password is correct
      // The User model handles password comparison securely
      const isMatch = await User.comparePassword(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Create JWT token for authentication
      // This token will be used to identify the user in future requests
      const token = jwt.sign(
        { userId: user.id },  // Store user ID in the token
        process.env.JWT_SECRET as string,  // Sign token with our secret key
        { expiresIn: '24h' }  // Token expires in 24 hours
      );

      // Send success response with token and user data
      // We don't send the password back for security
      res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      });
    } catch (error) {
      // Handle any unexpected errors
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Export the router
// This makes our authentication routes available to the main application
export default router; 