const fetch = require('node-fetch');
require('dotenv').config();

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

// Test results tracking
const results = {
  total: 0,
  passed: 0,
  failed: 0,
  errors: []
};

// Helper function to make API requests
async function makeRequest(method, url, body = null, headers = {}) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  };

  if (body && method !== 'GET') {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);
    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }
    return { status: response.status, data, ok: response.ok };
  } catch (error) {
    // Check if it's a connection error
    if (error.code === 'ECONNREFUSED' || error.message.includes('fetch failed')) {
      return { 
        status: 0, 
        data: { 
          error: `Cannot connect to backend server at ${url}. Make sure the server is running on port 5000.`,
          code: error.code 
        }, 
        ok: false 
      };
    }
    return { status: 0, data: { error: error.message }, ok: false };
  }
}

// Test function wrapper
async function test(name, testFn) {
  results.total++;
  process.stdout.write(`\n🧪 Testing: ${name}\n`);
  try {
    await testFn();
    results.passed++;
    process.stdout.write(`✅ Success\n`);
  } catch (error) {
    results.failed++;
    results.errors.push({ name, error: error.message });
    process.stdout.write(`❌ Failed: ${error.message}\n`);
  }
}

// Main test suite for registration
async function runRegistrationTests() {
  console.log('🚀 Starting Registration API Tests\n');
  console.log(`Backend URL: ${BACKEND_URL}\n`);

  // Generate unique test data
  const timestamp = Date.now();
  const testData = {
    name: `Test User ${timestamp}`,
    email: `testuser${timestamp}@example.com`,
    password: 'TestPass123!',
    mobile: `9876543${timestamp.toString().slice(-4)}`
  };

  // Test 1: Register a new user
  await test('Register New User', async () => {
    const result = await makeRequest('POST', `${BACKEND_URL}/api/auth/register`, testData);

    if (result.status === 0) {
      throw new Error(result.data.error || 'Cannot connect to backend server. Make sure the server is running.');
    }

    if (!result.ok || !result.data.success) {
      const errorMsg = result.data.message || result.data.error || 'Unknown error';
      throw new Error(`Registration failed (${result.status}): ${errorMsg}`);
    }

    console.log(`   ✅ User registered successfully`);
    console.log(`   ✅ User ID: ${result.data.user.id}`);
    console.log(`   ✅ User Name: ${result.data.user.name}`);
    console.log(`   ✅ User Email: ${result.data.user.email}`);
  });

  // Test 2: Try to register with the same email (should fail)
  await test('Register Duplicate User (should fail)', async () => {
    const result = await makeRequest('POST', `${BACKEND_URL}/api/auth/register`, testData);

    if (result.status === 0) {
      throw new Error(result.data.error || 'Cannot connect to backend server. Make sure the server is running.');
    }

    if (result.ok && result.data.success) {
      throw new Error(`Expected duplicate registration to fail, but it succeeded`);
    }

    if (!result.data.message || !result.data.message.toLowerCase().includes('already exists')) {
      throw new Error(`Expected duplicate user error, got: ${result.data.message || JSON.stringify(result.data)}`);
    }

    console.log(`   ✅ Duplicate registration correctly rejected: ${result.data.message}`);
  });

  // Test 3: Register with weak password (should fail)
  await test('Register with Weak Password (should fail)', async () => {
    const weakPasswordData = {
      ...testData,
      email: `weakpass${timestamp}@example.com`,
      password: 'weak'
    };

    const result = await makeRequest('POST', `${BACKEND_URL}/api/auth/register`, weakPasswordData);

    if (result.status === 0) {
      throw new Error(result.data.error || 'Cannot connect to backend server. Make sure the server is running.');
    }

    if (result.ok && result.data.success) {
      throw new Error(`Expected weak password registration to fail, but it succeeded`);
    }

    if (!result.data.message || !result.data.message.toLowerCase().includes('password')) {
      throw new Error(`Expected password validation error, got: ${result.data.message || JSON.stringify(result.data)}`);
    }

    console.log(`   ✅ Weak password correctly rejected: ${result.data.message}`);
  });

  // Test 4: Register with invalid email (should fail)
  await test('Register with Invalid Email (should fail)', async () => {
    const invalidEmailData = {
      ...testData,
      email: 'invalid-email',
      password: 'ValidPass123!'
    };

    const result = await makeRequest('POST', `${BACKEND_URL}/api/auth/register`, invalidEmailData);

    if (result.status === 0) {
      throw new Error(result.data.error || 'Cannot connect to backend server. Make sure the server is running.');
    }

    if (result.ok && result.data.success) {
      throw new Error(`Expected invalid email registration to fail, but it succeeded`);
    }

    if (!result.data.message || !result.data.message.toLowerCase().includes('email')) {
      throw new Error(`Expected email validation error, got: ${result.data.message || JSON.stringify(result.data)}`);
    }

    console.log(`   ✅ Invalid email correctly rejected: ${result.data.message}`);
  });

  // Test 5: Login with the registered user
  await test('Login with Registered User', async () => {
    const result = await makeRequest('POST', `${BACKEND_URL}/api/auth/login`, {
      email: testData.email,
      password: testData.password
    });

    if (result.status === 0) {
      throw new Error(result.data.error || 'Cannot connect to backend server. Make sure the server is running.');
    }

    if (!result.ok || !result.data.success || !result.data.token) {
      const errorMsg = result.data.message || result.data.error || 'Unknown error';
      throw new Error(`Login failed (${result.status}): ${errorMsg}`);
    }

    console.log(`   ✅ User logged in successfully`);
    console.log(`   ✅ Token received: ${result.data.token.substring(0, 20)}...`);
  });

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Registration Test Results Summary');
  console.log('='.repeat(60));
  console.log(`Total Tests: ${results.total}`);
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`Success Rate: ${((results.passed / results.total) * 100).toFixed(1)}%`);
  console.log('='.repeat(60));

  if (results.failed > 0) {
    console.log('\n⚠️  Failed Tests:');
    results.errors.forEach(({ name, error }) => {
      console.log(`   - ${name}: ${error}`);
    });
  }
}

// Run tests
runRegistrationTests().catch(console.error);