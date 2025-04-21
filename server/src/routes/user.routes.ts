// Import required dependencies
// express: Web framework for creating routes
// auth: Our authentication middleware to protect routes
// User: Our User model for database operations
import express from 'express';
import { auth } from '../middleware/auth';
import { User } from '../models/User';

// Create a new router instance
// A router helps organize our routes in a modular way
const router = express.Router();

// Get current user profile
// This endpoint returns the profile of the currently logged-in user
// The auth middleware ensures only authenticated users can access this route
router.get('/me', auth, async (req: express.Request, res: express.Response) => {
  try {
    // Find the user by their ID
    // The ID is stored in req.user by the auth middleware
    const user = await User.findById(req.user as string);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove the password from the user object before sending it
    // This is a security measure to prevent password exposure
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    // Handle any unexpected errors
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
// This endpoint allows users to update their profile information
// The auth middleware ensures only authenticated users can access this route
router.put(
  '/me',
  auth,
  async (req: express.Request, res: express.Response) => {
    try {
      // Get the new user data from the request body
      const { name, email } = req.body;
      
      // Find the current user
      const user = await User.findById(req.user as string);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // If the email is being changed, check if it's already in use
      if (email && email !== user.email) {
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
          return res.status(400).json({ message: 'Email already in use' });
        }
      }

      // Update the user's information in the database
      const updatedUser = await User.update(req.user as string, { name, email });
      if (!updatedUser) {
        return res.status(500).json({ message: 'Failed to update user' });
      }

      // Remove the password from the updated user object before sending it
      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      // Handle any unexpected errors
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Export the router
// This makes our user routes available to the main application
export default router; 