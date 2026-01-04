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

// Global test setup
let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

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