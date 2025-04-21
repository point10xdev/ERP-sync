// Import required dependencies
// rateLimit: Middleware for limiting request rates
// RedisStore: Store for rate limiting data in Redis
// createClient: Function to create a Redis client
// AppError: Our custom error class
// Request, Response, NextFunction: Types from Express
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { createClient } from 'redis';
import { AppError } from './errorHandler';
import { Request, Response, NextFunction } from 'express';

// Create Redis client for rate limiting storage
// Redis is a fast in-memory database perfect for tracking request counts
const redisClient = createClient({
  // Use Redis URL from environment or default to localhost
  // This allows us to use different Redis instances in different environments
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

// Handle Redis connection errors
// This helps us know if there are problems with our Redis connection
redisClient.on('error', (err: Error) => console.error('Redis Client Error', err));
// Connect to Redis
// This establishes the connection to our Redis server
redisClient.connect();

// Create Redis store for rate limiting
// This tells the rate limiter to use Redis to store request counts
const redisStore = new RedisStore({
  // @ts-ignore - Redis client method
  sendCommand: (...args: string[]) => redisClient.sendCommand(args)
});

// Common configuration for all rate limiters
// This defines settings that are shared across all rate limiters
const commonConfig = {
  // Time window for rate limiting (15 minutes)
  // This is how long we track requests before resetting the count
  windowMs: 15 * 60 * 1000,
  // Use standard headers for rate limit information
  // This adds headers like X-RateLimit-Limit to responses
  standardHeaders: true,
  // Disable legacy headers
  // We don't need the older style headers
  legacyHeaders: false,
  // Use Redis as the store for rate limiting data
  // This ensures rate limits work across multiple server instances
  store: redisStore as any, // Type assertion to fix type compatibility
  // Custom handler for rate limit exceeded
  // This defines what happens when someone exceeds the rate limit
  handler: (req: Request, res: Response, next: NextFunction) => {
    next(new AppError('Too many requests, please try again later', 429));
  }
};

// Rate limiter for authentication endpoints
// This protects login and registration endpoints from brute force attacks
export const authLimiter = rateLimit({
  ...commonConfig,  // Use the common configuration
  // Maximum 5 requests per window for auth endpoints
  // This prevents too many login attempts
  max: 5,
  // Custom message for auth rate limit exceeded
  // This tells users they've tried to log in too many times
  message: 'Too many login attempts, please try again later',
  // Skip rate limiting for token verification
  // We don't want to limit token verification requests
  skip: (req: Request) => {
    return req.path === '/api/auth/verify' && req.method === 'POST';
  }
});

// Rate limiter for general API endpoints
// This protects all API endpoints from excessive use
export const apiLimiter = rateLimit({
  ...commonConfig,  // Use the common configuration
  // Maximum 100 requests per window for general API
  // This allows normal usage while preventing abuse
  max: 100,
  // Skip rate limiting for health check endpoints
  // We don't want to limit health checks as they're used for monitoring
  skip: (req: Request) => {
    const skipPaths = ['/api/health', '/api/status'];
    return skipPaths.includes(req.path);
  }
});

// Strict rate limiter for sensitive operations
// This provides extra protection for operations that could be abused
export const strictLimiter = rateLimit({
  ...commonConfig,  // Use the common configuration
  // Maximum 3 requests per hour for sensitive operations
  // This is very restrictive to prevent abuse
  max: 3,
  // Custom message for strict rate limit exceeded
  // This tells users they've tried too many times
  message: 'Too many attempts, please try again later',
  // 1 hour window for strict rate limiting
  // Longer window for sensitive operations
  windowMs: 60 * 60 * 1000,
  // Skip rate limiting for admin users
  // Admins can perform these operations more frequently
  skip: (req: Request) => {
    return req.user?.role === 'admin';
  }
}); 