const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const jwt = require('jsonwebtoken');
const { mockCloudinaryUpload, mockCloudinaryDelete } = require('./utils');

// Mock external services
jest.mock('../utils/cloudinary', () => ({
  uploadToCloudinary: mockCloudinaryUpload,
  deleteFromCloudinary: mockCloudinaryDelete
}));

jest.mock('../utils/email', () => ({
  sendEmail: jest.fn().mockResolvedValue(true)
}));

jest.mock('../utils/firebase', () => ({
  sendPushNotification: jest.fn().mockResolvedValue(true),
  verifyIdToken: jest.fn().mockResolvedValue({ uid: 'test-uid' })
}));

// Global test setup helpers
let mongoServer;

async function connect() {
  if (mongoServer && mongoose.connection.readyState === 1) {
    // already connected
    return;
  }
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
}

async function closeDatabase() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  }
  if (mongoServer) {
    await mongoServer.stop();
    mongoServer = null;
  }
}

async function clearDatabase() {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    try {
      await collection.deleteMany();
    } catch (err) {
      // ignore
    }
  }
}

// Jest lifecycle hooks to keep backwards compatibility
beforeEach(() => {
  jest.clearAllMocks();
});

// Global test helpers
global.generateTestToken = (userId = 'test-user-id', role = 'user') => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET || 'test-secret',
    { expiresIn: '1h' }
  );
};

global.createTestUser = async (User, data = {}) => {
  const defaultUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'Password123!',
    role: 'user',
    ...data
  };
  return await User.create(defaultUser);
};

// Global error handler for unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Promise Rejection in tests:', error);
});

module.exports = {
  connect,
  closeDatabase,
  clearDatabase,
  // expose mocks to other test helpers if needed
  mockCloudinaryUpload,
  mockCloudinaryDelete
}; 