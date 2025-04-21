// Import required dependencies
// express: Web framework for creating routes
// redisClient: Our Redis database client for caching
// supabase: Our main database client
// logger: Our custom logging utility
import express from 'express';
import { redisClient } from '../config/redis';
import { supabase } from '../config/supabase';
import { logger } from '../utils/logger';

// Create a new router instance
// A router helps organize our routes in a modular way
const router = express.Router();

// Health check endpoint
// This endpoint checks if our application and its dependencies are working properly
// It's like a doctor's checkup for our server
router.get('/health', async (req: express.Request, res: express.Response) => {
  try {
    // Create a health check object with initial status
    // This will store information about our application's health
    const health = {
      status: 'ok',                    // Overall status (ok or error)
      timestamp: new Date().toISOString(),  // Current time
      uptime: process.uptime(),        // How long the server has been running
      services: {
        database: 'unknown',           // Database connection status
        redis: 'unknown',              // Redis connection status
        memory: {                      // Memory usage information
          rss: process.memoryUsage().rss,         // Resident Set Size (total memory allocated)
          heapTotal: process.memoryUsage().heapTotal,  // Total heap memory
          heapUsed: process.memoryUsage().heapUsed,    // Used heap memory
          external: process.memoryUsage().external      // Memory used by C++ objects
        }
      }
    };

    // Check database connection
    // This ensures we can communicate with our main database
    try {
      // Try to count users in the database
      // If this works, our database connection is healthy
      const { data, error } = await supabase.from('users').select('count');
      if (error) throw error;
      health.services.database = 'ok';  // Mark database as healthy
    } catch (error) {
      health.services.database = 'error';  // Mark database as unhealthy
      logger.error('Database health check failed:', error);  // Log the error
    }

    // Check Redis connection
    // This ensures our caching system is working
    try {
      // Try to ping Redis
      // If Redis responds, our connection is healthy
      await redisClient.ping();
      health.services.redis = 'ok';     // Mark Redis as healthy
    } catch (error) {
      health.services.redis = 'error';  // Mark Redis as unhealthy
      logger.error('Redis health check failed:', error);  // Log the error
    }

    // If any service is down, set overall status to error
    // This helps monitoring systems know if something is wrong
    if (health.services.database === 'error' || health.services.redis === 'error') {
      health.status = 'error';
    }

    // Send the health check results
    // Use 200 status code if everything is ok, 503 if there are problems
    res.status(health.status === 'ok' ? 200 : 503).json(health);
  } catch (error) {
    // If something unexpected goes wrong, log it and send an error response
    logger.error('Health check failed:', error);
    res.status(503).json({
      status: 'error',
      message: 'Service unavailable',
      timestamp: new Date().toISOString()
    });
  }
});

// Status endpoint
// This endpoint provides basic information about our application
// It's like a quick summary of our server's state
router.get('/status', (req: express.Request, res: express.Response) => {
  res.json({
    status: 'ok',                      // Current status
    version: process.env.npm_package_version,  // Application version
    environment: process.env.NODE_ENV,  // Current environment (development/production)
    nodeVersion: process.version,       // Node.js version
    platform: process.platform,         // Operating system
    uptime: process.uptime()           // Server uptime in seconds
  });
});

// Export the router
// This makes our health check routes available to the main application
export default router; 