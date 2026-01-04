const { config } = require('dotenv');
const path = require('path');

module.exports = async () => {
  // Load test environment variables
  config({
    path: path.join(__dirname, '../../.env.test')
  });

  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test-jwt-secret';
  process.env.JWT_EXPIRES_IN = '1h';
  
  // Mock external services
  process.env.CLOUDINARY_CLOUD_NAME = 'test-cloud';
  process.env.CLOUDINARY_API_KEY = 'test-api-key';
  process.env.CLOUDINARY_API_SECRET = 'test-api-secret';
  
  process.env.FIREBASE_PROJECT_ID = 'test-project';
  process.env.FIREBASE_PRIVATE_KEY = 'test-private-key';
  process.env.FIREBASE_CLIENT_EMAIL = 'test@example.com';
  
  process.env.SMTP_HOST = 'smtp.test.com';
  process.env.SMTP_PORT = '587';
  process.env.SMTP_USER = 'test@example.com';
  process.env.SMTP_PASS = 'test-password';
  
  process.env.SENTRY_DSN = 'https://test@test.ingest.sentry.io/test';
  
  process.env.RATE_LIMIT_WINDOW_MS = '900000';
  process.env.RATE_LIMIT_MAX_REQUESTS = '100';
  
  // Disable logging during tests
  process.env.DISABLE_LOGGING = 'true';
  
  // Set test database URL
  process.env.MONGODB_URI = 'mongodb://localhost:27017/teamup-india-test';
  
  // Set test Redis URL
  process.env.REDIS_URL = 'redis://localhost:6379/1';
  
  // Set test AWS credentials
  process.env.AWS_ACCESS_KEY_ID = 'test-access-key';
  process.env.AWS_SECRET_ACCESS_KEY = 'test-secret-key';
  process.env.AWS_REGION = 'us-east-1';
  process.env.AWS_BUCKET_NAME = 'test-bucket';
}; 