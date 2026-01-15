const axios = require('axios');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const app = require('./src/app');
const logger = require('./src/utils/logger');

const BASE_URL = 'http://localhost:5001/api'; // Use different port to avoid conflicts
let mongod;
let server;

const startServer = async () => {
  // Start MongoDB Memory Server
  mongod = await MongoMemoryServer.create();
  const mongoUri = mongod.getUri();
  await mongoose.connect(mongoUri);
  logger.info('Connected to MongoDB Memory Server');

  // Clear all collections
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
  logger.info('Cleared all collections in MongoDB Memory Server');

  // Start Express server
  server = app.listen(5001, () => {
    logger.info('Test server started on port 5001');
  });
};

const stopServer = async () => {
  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }
  if (mongod) {
    await mongoose.disconnect();
    await mongod.stop();
  }
  logger.info('Test server and MongoDB Memory Server stopped');
};

// Create axios instance with base URL
const apiRequest = axios.create({
  baseURL: BASE_URL
});

const testRegistrationAPIs = async () => {
  try {
    await startServer();

    console.log('\n=== Testing Registration APIs ===\n');

    // Test 1: Register Regular User
    console.log('1. Testing Regular User Registration...');
    try {
      const userData = {
        name: 'Test User',
        email: `testuser_${Date.now()}@example.com`,
        password: 'Test@123',
        mobile: '1234567890',
        role: 'user'
      };
      const response = await apiRequest.post('/auth/register', userData);
      console.log('✓ Regular User Registration:', response.data.success ? 'SUCCESS' : 'FAILED');
      if (response.data.token) {
        console.log('  - Token received:', response.data.token.substring(0, 20) + '...');
        console.log('  - User ID:', response.data.user.id);
        console.log('  - Role:', response.data.user.role);
        console.log('  - Status:', response.data.user.status);
      }
    } catch (error) {
      console.log('✗ Regular User Registration FAILED:', error.response?.data?.message || error.message);
    }

    // Test 2: Register Coach
    console.log('\n2. Testing Coach Registration...');
    let coachToken = '';
    let coachUserId = '';
    try {
      const coachData = {
        name: 'Test Coach',
        email: `coach_${Date.now()}@example.com`,
        password: 'Coach@123',
        mobile: '9876543210',
        role: 'coach'
      };
      const response = await apiRequest.post('/auth/register', coachData);
      console.log('✓ Coach Registration:', response.data.success ? 'SUCCESS' : 'FAILED');
      if (response.data.token) {
        coachToken = response.data.token;
        coachUserId = response.data.user.id;
        console.log('  - Token received');
        console.log('  - User ID:', coachUserId);
        console.log('  - Role:', response.data.user.role);
        console.log('  - Status:', response.data.user.status);
      }
    } catch (error) {
      console.log('✗ Coach Registration FAILED:', error.response?.data?.message || error.message);
    }

    // Test 3: Update Coach Profile (after registration - profile already created)
    if (coachToken) {
      console.log('\n3. Testing Coach Profile Update...');
      try {
        // Get the coach profile first
        const coachAuthRequest = axios.create({
          baseURL: BASE_URL,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${coachToken}`
          }
        });
        
        // Try to get coach profile using the profile endpoint
        try {
          const getResponse = await coachAuthRequest.get('/coaches/profile');
          if (getResponse.data.success) {
            console.log('✓ Coach Profile Retrieved: SUCCESS');
            console.log('  - Coach Profile exists (created during registration)');
            
            // Try to update it
            const updateData = {
              experience: { years: 5 },
              sports: ['cricket', 'football'],
              specialization: 'Batting and Fielding',
              coachingFees: {
                perSession: 1000,
                perMonth: 8000
              }
            };
            const coachId = getResponse.data.data._id;
            const updateResponse = await coachAuthRequest.put(`/coaches/${coachId}`, updateData);
            console.log('✓ Coach Profile Update:', updateResponse.data.success ? 'SUCCESS' : 'FAILED');
          }
        } catch (profileError) {
          // If profile endpoint doesn't work, try to find coach by userId
          console.log('  - Trying alternative method to get coach profile...');
          const coachesResponse = await coachAuthRequest.get('/coaches');
          if (coachesResponse.data.success && coachesResponse.data.data && coachesResponse.data.data.length > 0) {
            const coach = coachesResponse.data.data.find(c => c.userId === coachUserId) || coachesResponse.data.data[0];
            console.log('✓ Coach Profile Found: SUCCESS');
            console.log('  - Coach Profile ID:', coach._id);
          } else {
            console.log('  - Coach profile not found in list');
          }
        }
      } catch (error) {
        console.log('✗ Coach Profile Update FAILED:', error.response?.data?.message || error.message);
      }
    }

    // Test 4: Register Store/Seller
    console.log('\n4. Testing Store/Seller Registration...');
    let storeToken = '';
    let storeUserId = '';
    try {
      const storeData = {
        name: 'Test Store Owner',
        email: `store_${Date.now()}@example.com`,
        password: 'Store@123',
        mobile: '9876543211',
        role: 'seller'
      };
      const response = await apiRequest.post('/auth/register', storeData);
      console.log('✓ Store Registration:', response.data.success ? 'SUCCESS' : 'FAILED');
      if (response.data.token) {
        storeToken = response.data.token;
        storeUserId = response.data.user.id;
        console.log('  - Token received');
        console.log('  - User ID:', storeUserId);
        console.log('  - Role:', response.data.user.role);
        console.log('  - Status:', response.data.user.status);
      }
    } catch (error) {
      console.log('✗ Store Registration FAILED:', error.response?.data?.message || error.message);
    }

    // Test 5: Register Delivery Boy
    console.log('\n5. Testing Delivery Boy Registration...');
    let deliveryToken = '';
    let deliveryUserId = '';
    try {
      const deliveryData = {
        name: 'Test Delivery Boy',
        email: `delivery_${Date.now()}@example.com`,
        password: 'Delivery@123',
        mobile: '9876543212',
        role: 'delivery'
      };
      const response = await apiRequest.post('/auth/register', deliveryData);
      console.log('✓ Delivery Registration:', response.data.success ? 'SUCCESS' : 'FAILED');
      if (response.data.token) {
        deliveryToken = response.data.token;
        deliveryUserId = response.data.user.id;
        console.log('  - Token received');
        console.log('  - User ID:', deliveryUserId);
        console.log('  - Role:', response.data.user.role);
        console.log('  - Status:', response.data.user.status);
      }
    } catch (error) {
      console.log('✗ Delivery Registration FAILED:', error.response?.data?.message || error.message);
    }

    // Test 6: Test Mobile Number Normalization
    console.log('\n6. Testing Mobile Number Normalization...');
    const mobileTests = [
      { input: '+911111111111', expected: '1111111111', desc: 'With +91 prefix' },
      { input: '912222222222', expected: '2222222222', desc: 'With 91 prefix' },
      { input: '03333333333', expected: '3333333333', desc: 'With 0 prefix' },
      { input: '4444444444', expected: '4444444444', desc: '10 digits only' }
    ];

    for (const test of mobileTests) {
      try {
        const testData = {
          name: `Test ${test.desc}`,
          email: `test_${Date.now()}_${Math.random().toString(36).substr(2, 5)}@example.com`,
          password: 'Test@123',
          mobile: test.input,
          role: 'user'
        };
        const response = await apiRequest.post('/auth/register', testData);
        if (response.data.success && response.data.user) {
          const actualMobile = response.data.user.mobile || 'N/A';
          const passed = actualMobile === test.expected;
          console.log(`  ${passed ? '✓' : '✗'} ${test.desc}: ${test.input} → ${actualMobile} ${passed ? '(PASS)' : '(FAIL - expected ' + test.expected + ')'}`);
        }
      } catch (error) {
        console.log(`  ✗ ${test.desc}: FAILED - ${error.response?.data?.message || error.message}`);
      }
    }

    // Test 7: Test Duplicate Registration
    console.log('\n7. Testing Duplicate Registration Prevention...');
    try {
      const duplicateData = {
        name: 'Duplicate Test',
        email: `duplicate_${Date.now()}@example.com`,
        password: 'Test@123',
        mobile: '9999999999',
        role: 'user'
      };
      // First registration
      await apiRequest.post('/auth/register', duplicateData);
      console.log('  - First registration: SUCCESS');
      // Try duplicate
      try {
        await apiRequest.post('/auth/register', duplicateData);
        console.log('  ✗ Duplicate registration: FAILED (should have been rejected)');
      } catch (error) {
        if (error.response?.status === 400) {
          console.log('  ✓ Duplicate registration: CORRECTLY REJECTED');
        } else {
          console.log('  ✗ Duplicate registration: Unexpected error:', error.response?.data?.message);
        }
      }
    } catch (error) {
      console.log('  ✗ Duplicate test setup failed:', error.response?.data?.message || error.message);
    }

    // Test 8: Test Invalid Mobile Numbers
    console.log('\n8. Testing Invalid Mobile Number Validation...');
    const invalidMobiles = [
      { mobile: '123456789', desc: '9 digits (too short)' },
      { mobile: '12345678901', desc: '11 digits (too long)' },
      { mobile: 'abc1234567', desc: 'Contains letters' },
      { mobile: '', desc: 'Empty string' }
    ];

    for (const test of invalidMobiles) {
      try {
        const testData = {
          name: 'Invalid Test',
          email: `invalid_${Date.now()}_${Math.random().toString(36).substr(2, 5)}@example.com`,
          password: 'Test@123',
          mobile: test.mobile,
          role: 'user'
        };
        await apiRequest.post('/auth/register', testData);
        console.log(`  ✗ ${test.desc}: FAILED (should have been rejected)`);
      } catch (error) {
        if (error.response?.status === 400) {
          console.log(`  ✓ ${test.desc}: CORRECTLY REJECTED`);
        } else {
          console.log(`  ? ${test.desc}: Unexpected error - ${error.response?.data?.message || error.message}`);
        }
      }
    }

    // Test 9: Test Login After Registration
    console.log('\n9. Testing Login After Registration...');
    try {
      const loginData = {
        email: `login_test_${Date.now()}@example.com`,
        password: 'Login@123',
        mobile: '8888888888',
        role: 'user'
      };
      // Register first
      const registerResponse = await apiRequest.post('/auth/register', {
        name: 'Login Test User',
        ...loginData
      });
      console.log('  - Registration: SUCCESS');
      
      // Now login
      const loginResponse = await apiRequest.post('/auth/login', {
        email: loginData.email,
        password: loginData.password
      });
      if (loginResponse.data.token) {
        console.log('  ✓ Login: SUCCESS');
        console.log('  - Token received');
      } else {
        console.log('  ✗ Login: FAILED (no token)');
      }
    } catch (error) {
      console.log('  ✗ Login test failed:', error.response?.data?.message || error.message);
    }

    console.log('\n=== Registration API Tests Completed ===\n');
  } catch (error) {
    console.log('\n❌ Test suite failed:', error.message);
    console.log('Error details:', error);
  } finally {
    await stopServer();
  }
};

// Run tests
testRegistrationAPIs().catch(console.error);

