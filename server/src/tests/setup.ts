// Import required dependencies
// MongoMemoryServer: A tool that creates a temporary MongoDB instance in memory for testing
// mongoose: A MongoDB object modeling tool for Node.js
// jsonwebtoken: A library for creating and verifying JSON Web Tokens
// config: Our application configuration
// User: Our User model for database operations
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import { User } from '../models/User';

// Declare a variable to hold our MongoDB memory server instance
// This will be used throughout our tests
let mongoServer: MongoMemoryServer;

// This function runs once before all tests start
// It sets up our testing environment
beforeAll(async () => {
  // Create a new MongoDB memory server
  // This is like having a fresh, empty MongoDB database just for testing
  mongoServer = await MongoMemoryServer.create();
  
  // Get the connection string (URL) for our memory server
  // This is like the address where our test database lives
  const mongoUri = mongoServer.getUri();

  // Connect mongoose to our test database
  // Mongoose is our tool for talking to MongoDB
  await mongoose.connect(mongoUri);
});

// This function runs before each individual test
// It ensures each test starts with a clean database
beforeEach(async () => {
  // Get all collections (tables) in our database
  const collections = mongoose.connection.collections;
  
  // Loop through each collection and delete all documents
  // This ensures no leftover data from previous tests affects our current test
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

// This function runs once after all tests are complete
// It cleans up our testing environment
afterAll(async () => {
  // Close the connection to our test database
  await mongoose.connection.close();
  
  // Stop the MongoDB memory server
  // This frees up the memory used by our test database
  await mongoServer.stop();
});

// Helper function to create a test user
// This makes it easy to create users for testing without repeating code
export const createTestUser = async (userData = {}) => {
  // Default user data that will be used if no specific data is provided
  const defaultUser = {
    name: 'Test User',        // Default name
    email: 'test@example.com', // Default email
    password: 'password123',   // Default password
    role: 'user'              // Default role
  };

  // Create a new user by combining default data with any custom data provided
  // The spread operator (...) copies all properties from both objects
  const user = await User.create({ ...defaultUser, ...userData });
  return user;
};

// Helper function to generate a JWT token for testing authenticated routes
// JWT tokens are like digital keys that prove a user is logged in
export const getAuthToken = (userId: string) => {
  // Create a new JWT token containing the user's ID
  // The token is signed with our secret key and will expire in 24 hours
  return jwt.sign({ userId }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn
  });
};

// Helper function to create test HTTP requests
// This makes it easier to test our API endpoints
export const createTestRequest = (app: any) => {
  return {
    // Function to create a GET request
    // GET requests are used to retrieve data
    get: (url: string, token?: string) => {
      // Create a basic GET request
      const request = app.get(url);
      
      // If a token is provided, add it to the request headers
      // This simulates an authenticated request
      if (token) {
        request.set('Authorization', `Bearer ${token}`);
      }
      return request;
    },

    // Function to create a POST request
    // POST requests are used to create new data
    post: (url: string, data?: any, token?: string) => {
      // Create a POST request with the provided data
      const request = app.post(url).send(data);
      
      // Add authentication if needed
      if (token) {
        request.set('Authorization', `Bearer ${token}`);
      }
      return request;
    },

    // Function to create a PUT request
    // PUT requests are used to update existing data
    put: (url: string, data?: any, token?: string) => {
      // Create a PUT request with the provided data
      const request = app.put(url).send(data);
      
      // Add authentication if needed
      if (token) {
        request.set('Authorization', `Bearer ${token}`);
      }
      return request;
    },

    // Function to create a DELETE request
    // DELETE requests are used to remove data
    delete: (url: string, token?: string) => {
      // Create a basic DELETE request
      const request = app.delete(url);
      
      // Add authentication if needed
      if (token) {
        request.set('Authorization', `Bearer ${token}`);
      }
      return request;
    }
  };
}; 