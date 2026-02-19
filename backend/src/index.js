const mongoose = require('mongoose');
const config = require('./config/index');
const logger = require('./utils/logger');
const app = require('./app');
const createDefaultAdmin = require('./utils/createDefaultAdmin');

// Create uploads and logs directories if they don't exist
const fs = require('fs');
const path = require('path');
['uploads', 'logs'].forEach(dir => {
  const dirPath = path.join(__dirname, '..', dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    logger.info(`Created directory: ${dirPath}`);
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  logger.error(err.name, err.message);
  logger.error(err.stack);
  process.exit(1);
});

// Connect to MongoDB with fallback
logger.info('Connecting to MongoDB...');
mongoose
  .connect(config.mongoURI, {
    serverSelectionTimeoutMS: 5000, // 5 second timeout
    socketTimeoutMS: 45000, // 45 second timeout
  })
  .then(async () => {
    logger.info('Connected to MongoDB');

    // Create default admin account if it doesn't exist
    await createDefaultAdmin();

    // Start server
    const server = app.listen(config.port, () => {
      logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${config.port}`);
      logger.info('MongoDB database connected and ready');
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      logger.error('UNHANDLED REJECTION! 💥 Shutting down...');
      logger.error(err.name, err.message);
      logger.error(err.stack);
      server.close(() => {
        process.exit(1);
      });
    });

    // Handle SIGTERM (nodemon restart trigger)
    process.on('SIGTERM', () => {
      logger.info('👋 SIGTERM RECEIVED. Shutting down gracefully');
      server.close(() => {
        logger.info('💥 Process terminated!');
      });
    });
  })
  .catch((err) => {
    logger.warn('MongoDB connection failed, starting with mock data mode:', err.message);
    logger.info('Starting server in mock data mode...');
    
    // Start server without MongoDB connection
    const server = app.listen(config.port, () => {
      logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${config.port}`);
      logger.info('⚠️  WARNING: Running in mock data mode - no database connection');
      logger.info('Some features may not work properly without database connection');
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      logger.error('UNHANDLED REJECTION! 💥 Shutting down...');
      logger.error(err.name, err.message);
      logger.error(err.stack);
      server.close(() => {
        process.exit(1);
      });
    });

    // Handle SIGTERM (nodemon restart trigger)
    process.on('SIGTERM', () => {
      logger.info('👋 SIGTERM RECEIVED. Shutting down gracefully');
      server.close(() => {
        logger.info('💥 Process terminated!');
      });
    });
  });
