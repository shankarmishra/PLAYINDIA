/**
 * Application Constants
 * Centralized configuration for backend URLs and environment variables
 */

// Backend API Base URL - matches mobile app configuration
export const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'https://playindia-3.onrender.com';

// Export for backward compatibility
export const API_BASE_URL = BACKEND_API_URL;

// Environment configuration
export const ENV = {
  API_BASE_URL: BACKEND_API_URL,
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
};

export default {
  BACKEND_API_URL,
  API_BASE_URL,
  ENV,
};
