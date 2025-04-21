import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';

const { combine, timestamp, printf, colorize, json } = winston.format;

// Define custom log format for console output
const logFormat = printf((info) => {
  // Base log message with timestamp and level
  let msg = `${info.timestamp} [${info.level}] : ${info.message}`;
  // Add metadata if present
  if (Object.keys(info).length > 3) {
    const { timestamp, level, message, ...metadata } = info;
    msg += ` ${JSON.stringify(metadata)}`;
  }
  return msg;
});

// Define path for log files
const logsDir = path.join(__dirname, '../../logs');

// Create and configure the logger instance
const logger = winston.createLogger({
  // Set log level based on environment
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  // Configure log format
  format: combine(
    // Add timestamp to each log entry
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    // Format logs as JSON
    json()
  ),
  // Add default metadata to all logs
  defaultMeta: { service: 'erp-sync-api' },
  // Configure log transports (output destinations)
  transports: [
    // Console transport for immediate feedback
    new winston.transports.Console({
      format: combine(
        // Add colors to console output
        colorize(),
        // Use custom log format
        logFormat
      )
    }),
    // Daily rotating file for all logs
    new DailyRotateFile({
      // File naming pattern with date
      filename: path.join(logsDir, 'combined-%DATE%.log'),
      // Date pattern for file rotation
      datePattern: 'YYYY-MM-DD',
      // Maximum size of each log file
      maxSize: '20m',
      // Keep logs for 14 days
      maxFiles: '14d',
      format: combine(
        timestamp(),
        json()
      )
    }),
    // Separate file for error logs
    new DailyRotateFile({
      filename: path.join(logsDir, 'error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',
      // Only log errors to this file
      level: 'error',
      format: combine(
        timestamp(),
        json()
      )
    })
  ]
});

// Create a stream object for Morgan (HTTP request logger)
export const stream = {
  write: (message: string) => {
    // Log HTTP requests using the logger
    logger.info(message.trim());
  }
};

// Export the configured logger
export default logger; 