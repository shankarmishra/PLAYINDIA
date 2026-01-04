const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const Team = require('../models/team.model');
const Tournament = require('../models/tournament.model');

// Generate test JWT token
const generateToken = (user) => {
  return jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'test-secret', {
    expiresIn: '1h'
  });
};

// Create test user
const createTestUser = async (role = 'player') => {
  const user = await User.create({
    name: 'Test User',
    email: `test-${Date.now()}@example.com`,
    password: 'password123',
    role
  });
  const token = generateToken(user);
  return { user, token };
};

// Create test team
const createTestTeam = async (captain) => {
  return await Team.create({
    name: `Test Team ${Date.now()}`,
    sport: 'football',
    captain: captain._id,
    location: {
      type: 'Point',
      coordinates: [0, 0]
    },
    players: [{
      player: captain._id,
      role: 'captain'
    }]
  });
};

// Create test tournament
const createTestTournament = async (organizer) => {
  return await Tournament.create({
    name: `Test Tournament ${Date.now()}`,
    sport: 'football',
    organizer: organizer._id,
    startDate: new Date(Date.now() + 86400000), // Tomorrow
    endDate: new Date(Date.now() + 172800000), // Day after tomorrow
    registrationDeadline: new Date(Date.now() + 43200000), // 12 hours from now
    maxTeams: 8,
    minTeams: 4,
    teamSize: {
      min: 5,
      max: 11
    },
    venue: {
      name: 'Test Venue',
      address: 'Test Address',
      location: {
        type: 'Point',
        coordinates: [0, 0]
      }
    },
    prizeMoney: {
      first: 5000,
      second: 3000,
      third: 1000
    },
    status: 'published',
    description: 'Test tournament description',
    rules: 'Test tournament rules'
  });
};

// Mock responses for external services
const mockCloudinaryUpload = jest.fn().mockImplementation((file) => {
  return Promise.resolve({
    public_id: 'test-public-id',
    secure_url: `https://res.cloudinary.com/test/${file.originalname || 'test-image.jpg'}`
  });
});

const mockCloudinaryDelete = jest.fn().mockImplementation(() => {
  return Promise.resolve({ result: 'ok' });
});

// Test data generators
const generateMockUser = (overrides = {}) => ({
  name: 'Test User',
  email: 'test@example.com',
  password: 'Password123!',
  phone: '+919876543210',
  role: 'user',
  ...overrides
});

const generateMockCoach = (overrides = {}) => ({
  name: 'Test Coach',
  email: 'coach@example.com',
  phone: '+919876543211',
  sport: 'Cricket',
  experience: 5,
  certifications: ['Level 1 Coach'],
  hourlyRate: 1000,
  availability: ['Monday', 'Wednesday', 'Friday'],
  ...overrides
});

const generateMockTeam = (overrides = {}) => ({
  name: 'Test Team',
  sport: 'Cricket',
  city: 'Mumbai',
  level: 'Amateur',
  players: [],
  coach: null,
  ...overrides
});

const generateMockTournament = (overrides = {}) => ({
  name: 'Test Tournament',
  sport: 'Cricket',
  startDate: new Date(),
  endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  venue: 'Test Stadium',
  city: 'Mumbai',
  registrationFee: 1000,
  maxTeams: 8,
  ...overrides
});

const generateMockProduct = (overrides = {}) => ({
  name: 'Test Product',
  description: 'Test Description',
  price: 999,
  category: 'Equipment',
  sport: 'Cricket',
  stock: 10,
  images: ['test-image-1.jpg'],
  ...overrides
});

const generateMockOrder = (overrides = {}) => ({
  user: null,
  products: [],
  totalAmount: 999,
  status: 'pending',
  shippingAddress: {
    street: 'Test Street',
    city: 'Test City',
    state: 'Test State',
    pincode: '400001'
  },
  ...overrides
});

// Test request helpers
const createTestRequest = (method, url, data = null, token = null) => {
  const headers = {
    'Content-Type': 'application/json'
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return {
    method,
    url,
    data,
    headers
  };
};

// Test response assertions
const expectSuccessResponse = (response, statusCode = 200) => {
  expect(response.status).toBe(statusCode);
  expect(response.body).toHaveProperty('success', true);
  expect(response.body).toHaveProperty('data');
};

const expectErrorResponse = (response, statusCode = 400) => {
  expect(response.status).toBe(statusCode);
  expect(response.body).toHaveProperty('success', false);
  expect(response.body).toHaveProperty('error');
};

module.exports = {
  generateToken,
  createTestUser,
  createTestTeam,
  createTestTournament,
  mockCloudinaryUpload,
  mockCloudinaryDelete,
  generateMockUser,
  generateMockCoach,
  generateMockTeam,
  generateMockTournament,
  generateMockProduct,
  generateMockOrder,
  createTestRequest,
  expectSuccessResponse,
  expectErrorResponse
}; 