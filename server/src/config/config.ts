// Import required dependencies
// dotenv: Loads environment variables from a .env file
// joi: A library for validating data structures
import dotenv from 'dotenv';
import Joi from 'joi';

// Load environment variables from the .env file
// Environment variables are like settings that can change between different environments
// (development, testing, production) without changing the code
dotenv.config();

// Define a schema for validating our environment variables
// A schema is like a set of rules that our environment variables must follow
const envVarsSchema = Joi.object({
  // The environment our application is running in
  // Can be 'development', 'production', or 'test'
  // Defaults to 'development' if not specified
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),

  // The port number our server will listen on
  // Defaults to 5000 if not specified
  PORT: Joi.number().default(5000),

  // Secret key used to sign JWT tokens
  // JWT tokens are like digital keys that prove a user is logged in
  // This must be provided and kept secret
  JWT_SECRET: Joi.string().required().description('JWT secret key'),

  // How long JWT tokens are valid for
  // Defaults to 24 hours
  JWT_EXPIRES_IN: Joi.string().default('24h'),

  // The URL of our frontend application
  // Used for CORS (Cross-Origin Resource Sharing) settings
  CLIENT_URL: Joi.string().required().description('Client URL'),

  // The URL for connecting to Redis
  // Redis is a fast in-memory database used for caching
  // Defaults to localhost if not specified
  REDIS_URL: Joi.string().default('redis://localhost:6379'),

  // The URL for connecting to Supabase
  // Supabase is our main database
  SUPABASE_URL: Joi.string().required().description('Supabase URL'),

  // The API key for Supabase
  // This is like a password for accessing our database
  SUPABASE_KEY: Joi.string().required().description('Supabase API key'),

  // SMTP server settings for sending emails
  // SMTP is the protocol used for sending emails
  SMTP_HOST: Joi.string().description('SMTP host'),
  SMTP_PORT: Joi.number().description('SMTP port'),
  SMTP_USERNAME: Joi.string().description('SMTP username'),
  SMTP_PASSWORD: Joi.string().description('SMTP password'),

  // The email address that emails will be sent from
  EMAIL_FROM: Joi.string().description('Email from address'),

  // How detailed our logging should be
  // Can be 'error', 'warn', 'info', or 'debug'
  // Defaults to 'info'
  LOG_LEVEL: Joi.string()
    .valid('error', 'warn', 'info', 'debug')
    .default('info'),

  // Rate limiting settings
  // Rate limiting prevents users from making too many requests
  RATE_LIMIT_WINDOW_MS: Joi.number().default(15 * 60 * 1000), // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: Joi.number().default(100),
}).unknown(); // Allow other environment variables that aren't defined here

// Validate our environment variables against the schema
const { error, value: envVars } = envVarsSchema.validate(process.env);
if (error) {
  // If validation fails, throw an error with details
  throw new Error(`Config validation error: ${error.message}`);
}

// Export our configuration object
// This makes all our validated environment variables available to the rest of the application
export const config = {
  // Basic application settings
  env: envVars.NODE_ENV,    // Current environment
  port: envVars.PORT,       // Server port

  // JWT (JSON Web Token) settings
  jwt: {
    secret: envVars.JWT_SECRET,     // Secret key for signing tokens
    expiresIn: envVars.JWT_EXPIRES_IN, // Token expiration time
  },

  // Client application settings
  clientUrl: envVars.CLIENT_URL,    // Frontend URL

  // Redis settings
  redis: {
    url: envVars.REDIS_URL,         // Redis connection URL
  },

  // Supabase settings
  supabase: {
    url: envVars.SUPABASE_URL,      // Supabase URL
    key: envVars.SUPABASE_KEY,      // Supabase API key
  },

  // Email settings
  email: {
    smtp: {
      host: envVars.SMTP_HOST,      // SMTP server host
      port: envVars.SMTP_PORT,      // SMTP server port
      auth: {
        user: envVars.SMTP_USERNAME, // SMTP username
        pass: envVars.SMTP_PASSWORD, // SMTP password
      },
    },
    from: envVars.EMAIL_FROM,       // Sender email address
  },

  // Logging settings
  logging: {
    level: envVars.LOG_LEVEL,       // Logging level
  },

  // Rate limiting settings
  rateLimit: {
    windowMs: envVars.RATE_LIMIT_WINDOW_MS,  // Time window for rate limiting
    max: envVars.RATE_LIMIT_MAX_REQUESTS,    // Maximum requests per window
  },
}; 