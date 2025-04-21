// Import required dependencies for the server
// express: A web framework for Node.js that makes it easy to build web applications
// cors: Middleware that allows our server to accept requests from different origins (domains)
// dotenv: Loads environment variables from a .env file
// helmet: Adds security headers to protect our application
// compression: Compresses responses to make them smaller and faster to transfer
// authRoutes and userRoutes: Our custom route handlers for authentication and user management
// errorHandler: Custom middleware to handle errors gracefully
// requestLogger: Custom middleware to log HTTP requests
// rateLimiter: Middleware to prevent too many requests from the same IP
// supabase: Our database client
import express, { Request } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import compression from 'compression';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/logger.js';
import { apiLimiter, authLimiter } from './middleware/rateLimiter.js';
import { supabase } from './config/supabase.js';

// Define a custom type for request body verification
// This type includes the rawBody property we need for security checks
interface RequestWithRawBody extends Request {
  rawBody?: Buffer;
}

// Extend Express Request type to include rawBody for signature verification
// This is like adding a new property to the Request object that Express uses
// We need this to store the raw request body for security checks
declare module 'express' {
  interface Request {
    rawBody?: Buffer;
  }
}

// Load environment variables from .env file
// Environment variables are like settings that can change between different environments
// (development, testing, production) without changing the code
dotenv.config();

// Initialize Express application
// This creates our web server
const app = express();

// Configure security headers using Helmet
// Helmet helps secure our Express app by setting various HTTP headers
// Think of it as adding armor to our server
app.use(helmet({
  // Content Security Policy settings
  // This tells browsers what resources (scripts, styles, images) are allowed to load
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],  // Only allow resources from our own domain
      scriptSrc: ["'self'", "'unsafe-inline'"],  // Allow scripts from our domain and inline scripts
      styleSrc: ["'self'", "'unsafe-inline'"],   // Allow styles from our domain and inline styles
      imgSrc: ["'self'", "data:", "https:"],     // Allow images from our domain, data URLs, and HTTPS
      connectSrc: ["'self'"],                    // Only allow connections to our own domain
    },
  },
  // Additional security headers
  crossOriginEmbedderPolicy: true,      // Prevent cross-origin embedding
  crossOriginOpenerPolicy: true,        // Control how new windows are opened
  crossOriginResourcePolicy: { policy: "same-site" },  // Only allow resources from same site
  dnsPrefetchControl: { allow: false }, // Prevent DNS prefetching
  frameguard: { action: "deny" },       // Prevent our site from being loaded in iframes
  hidePoweredBy: true,                  // Hide the fact that we're using Express
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },  // Force HTTPS
  ieNoOpen: true,                       // Prevent IE from executing downloads
  noSniff: true,                        // Prevent MIME type sniffing
  originAgentCluster: true,             // Enable origin isolation
  permittedCrossDomainPolicies: { permittedPolicies: "none" },  // No cross-domain policies
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },  // Control referrer information
  xssFilter: true,                      // Enable XSS protection
}));

// Configure CORS for cross-origin requests
// CORS (Cross-Origin Resource Sharing) controls which websites can access our API
app.use(cors({
  // Allow requests from client application
  origin: process.env.CLIENT_URL || 'http://localhost:3000',  // Our frontend URL
  // Allowed HTTP methods
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],      // What actions are allowed
  // Allowed headers
  allowedHeaders: ['Content-Type', 'Authorization'],         // What headers can be sent
  // Enable credentials
  credentials: true,                                         // Allow cookies and auth headers
  // Cache preflight requests
  maxAge: 86400,                                            // Cache CORS settings for 24 hours
}));

// Configure response compression
// This makes our responses smaller and faster to transfer
app.use(compression({
  // Compression level (0-9)
  level: 6,                                                 // Balance between speed and size
  // Minimum size to compress
  threshold: 10 * 1024,                                     // Only compress if > 10KB
  // Filter for compression
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {                  // Skip if client doesn't want compression
      return false;
    }
    return compression.filter(req, res);
  },
}));

// Configure JSON body parsing
// This allows our server to understand JSON data sent in requests
app.use(express.json({ 
  // Maximum request size
  limit: '10kb',                                           // Prevent very large requests
  // Store raw body for verification
  verify: (req: RequestWithRawBody, res, buf) => {
    req.rawBody = buf;                                     // Save original request body
  }
}));

// Configure URL-encoded body parsing
// This allows our server to understand form data
app.use(express.urlencoded({ 
  extended: true,                                          // Use the qs library for parsing
  limit: '10kb',                                          // Maximum form size
  parameterLimit: 1000                                    // Maximum number of form fields
}));

// Add request logging middleware
// This logs every request to our server
app.use(requestLogger);

// Apply rate limiting to routes
// This prevents too many requests from the same IP
app.use('/api/auth', authLimiter);  // Stricter limits for auth routes
app.use('/api', apiLimiter);        // General limits for all API routes

// Test database connection on startup
// This ensures we can connect to our database before accepting requests
const testSupabaseConnection = async () => {
  try {
    // Test connection by querying users table
    const { data, error } = await supabase.from('users').select('count');
    if (error) throw error;
    console.log('Connected to Supabase successfully');
  } catch (error) {
    console.error('Supabase connection error:', error);
    process.exit(1);  // Stop the server if we can't connect to the database
  }
};

// Test database connection
testSupabaseConnection();

// Register API routes
// These are the paths that our API will respond to
app.use('/api/auth', authRoutes);   // Authentication routes (login, register)
app.use('/api/users', userRoutes);  // User management routes

// Add error handling middleware
// This catches any errors and sends a proper response
app.use(errorHandler);

// Set server port
// The port is where our server will listen for requests
const PORT = process.env.PORT || 5000;

// Start the server
// This makes our server start listening for requests
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 