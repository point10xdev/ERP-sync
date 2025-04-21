// Import required dependencies
import { Request, Response, NextFunction } from 'express';

// Middleware to log HTTP requests and responses
export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Record the start time of the request
  const start = Date.now();
  
  // Set up a listener for when the response is finished
  res.on('finish', () => {
    // Calculate the total duration of the request
    const duration = Date.now() - start;
    
    // Log request details including:
    // - HTTP method used
    // - Request URL
    // - Response status code
    // - Request duration in milliseconds
    // - Client IP address
    // - User agent string
    // - Timestamp of the request
    console.log({
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('user-agent'),
      timestamp: new Date().toISOString()
    });
  });

  // Proceed to the next middleware
  next();
}; 