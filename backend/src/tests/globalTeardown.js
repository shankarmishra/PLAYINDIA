const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Redis = require('ioredis');

module.exports = async () => {
  // Close MongoDB connection
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }

  // Stop MongoDB memory server if it exists
  if (global.__MONGOD__ instanceof MongoMemoryServer) {
    await global.__MONGOD__.stop();
  }

  // Close Redis connection if it exists
  if (global.__REDIS__) {
    await global.__REDIS__.quit();
  }

  // Clean up environment variables
  delete process.env.NODE_ENV;
  delete process.env.JWT_SECRET;
  delete process.env.JWT_EXPIRES_IN;
  delete process.env.MONGODB_URI;
  delete process.env.REDIS_URL;
  delete process.env.CLOUDINARY_CLOUD_NAME;
  delete process.env.CLOUDINARY_API_KEY;
  delete process.env.CLOUDINARY_API_SECRET;
  delete process.env.FIREBASE_PROJECT_ID;
  delete process.env.FIREBASE_PRIVATE_KEY;
  delete process.env.FIREBASE_CLIENT_EMAIL;
  delete process.env.SMTP_HOST;
  delete process.env.SMTP_PORT;
  delete process.env.SMTP_USER;
  delete process.env.SMTP_PASS;
  delete process.env.SENTRY_DSN;
  delete process.env.RATE_LIMIT_WINDOW_MS;
  delete process.env.RATE_LIMIT_MAX_REQUESTS;
  delete process.env.DISABLE_LOGGING;
  delete process.env.AWS_ACCESS_KEY_ID;
  delete process.env.AWS_SECRET_ACCESS_KEY;
  delete process.env.AWS_REGION;
  delete process.env.AWS_BUCKET_NAME;
}; 