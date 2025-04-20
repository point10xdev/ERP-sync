/**
 * Environment configuration for the application
 * This centralizes all environment-specific values and provides type safety
 */

// API configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://api.example.com',
  VERSION: import.meta.env.VITE_API_VERSION || 'v1',
  TIMEOUT: Number(import.meta.env.VITE_API_TIMEOUT) || 30000,
};

// Authentication configuration
export const AUTH_CONFIG = {
  TOKEN_KEY: 'auth_token',
  USER_KEY: 'user',
  TOKEN_EXPIRY: Number(import.meta.env.VITE_TOKEN_EXPIRY) || 86400, // 24 hours in seconds
  REFRESH_TOKEN_KEY: 'refresh_token',
};

// Feature flags
export const FEATURES = {
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  ENABLE_NOTIFICATIONS: import.meta.env.VITE_ENABLE_NOTIFICATIONS === 'true',
};

// Application configuration
export const APP_CONFIG = {
  APP_NAME: import.meta.env.VITE_APP_NAME || 'ERP Portal',
  SUPPORT_EMAIL: import.meta.env.VITE_SUPPORT_EMAIL || 'support@example.com',
  DEFAULT_AVATAR_API: 'https://api.dicebear.com/7.x/avatars/svg',
};
