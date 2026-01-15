const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

const testPlayerRegistration = async () => {
  try {
    console.log('\n=== Testing Player Registration ===\n');

    // Test 1: Register a player with role 'user'
    console.log('1. Testing Player Registration (role: user)...');
    try {
      const playerData = {
        name: 'Test Player',
        email: `player_${Date.now()}@example.com`,
        password: 'Player@123',
        mobile: '9876543210',
        role: 'user',
        favoriteSports: ['cricket', 'football'],
        location: 'Mumbai'
      };
      
      const response = await axios.post(`${BASE_URL}/auth/register`, playerData);
      
      if (response.data.success) {
        console.log('✓ Player Registration: SUCCESS');
        console.log('  - Token received:', response.data.token ? response.data.token.substring(0, 20) + '...' : 'N/A');
        console.log('  - User ID:', response.data.user.id);
        console.log('  - Role:', response.data.user.role);
        console.log('  - Status:', response.data.user.status);
        console.log('  - Email:', response.data.user.email);
        console.log('  - Mobile:', response.data.user.mobile);
      } else {
        console.log('✗ Player Registration: FAILED');
        console.log('  - Message:', response.data.message);
      }
    } catch (error) {
      console.log('✗ Player Registration: FAILED');
      console.log('  - Error:', error.response?.data?.message || error.message);
      if (error.response?.data) {
        console.log('  - Response:', JSON.stringify(error.response.data, null, 2));
      }
    }

    // Test 2: Test mobile number normalization
    console.log('\n2. Testing Mobile Number Normalization for Player...');
    const mobileTests = [
      { input: '+919876543210', expected: '9876543210', desc: 'With +91 prefix' },
      { input: '919876543210', expected: '9876543210', desc: 'With 91 prefix' },
      { input: '09876543210', expected: '9876543210', desc: 'With 0 prefix' },
      { input: '9876543210', expected: '9876543210', desc: '10 digits only' }
    ];

    for (const test of mobileTests) {
      try {
        const testData = {
          name: `Test Player ${test.desc}`,
          email: `player_${Date.now()}_${Math.random().toString(36).substr(2, 5)}@example.com`,
          password: 'Player@123',
          mobile: test.input,
          role: 'user'
        };
        const response = await axios.post(`${BASE_URL}/auth/register`, testData);
        if (response.data.success && response.data.user) {
          const actualMobile = response.data.user.mobile || 'N/A';
          const passed = actualMobile === test.expected;
          console.log(`  ${passed ? '✓' : '✗'} ${test.desc}: ${test.input} → ${actualMobile} ${passed ? '(PASS)' : '(FAIL - expected ' + test.expected + ')'}`);
        }
      } catch (error) {
        console.log(`  ✗ ${test.desc}: FAILED - ${error.response?.data?.message || error.message}`);
      }
    }

    // Test 3: Test duplicate registration prevention
    console.log('\n3. Testing Duplicate Registration Prevention...');
    try {
      const duplicateData = {
        name: 'Duplicate Player Test',
        email: `duplicate_player_${Date.now()}@example.com`,
        password: 'Player@123',
        mobile: '9999999999',
        role: 'user'
      };
      
      // First registration
      await axios.post(`${BASE_URL}/auth/register`, duplicateData);
      console.log('  - First registration: SUCCESS');
      
      // Try duplicate
      try {
        await axios.post(`${BASE_URL}/auth/register`, duplicateData);
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

    console.log('\n=== Player Registration Tests Completed ===\n');
  } catch (error) {
    console.log('\n❌ Test suite failed:', error.message);
    console.log('Error details:', error);
  }
};

// Run tests
testPlayerRegistration().catch(console.error);
