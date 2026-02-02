const fetch = require('node-fetch');
require('dotenv').config();

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';
const TEST_EMAIL = process.env.TEST_EMAIL || 'store@test.com';
const TEST_PASSWORD = process.env.TEST_PASSWORD || 'Test123!@#';

let token = null;
let storeId = null;
let productId = null;

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

// Main test suite
async function runTests() {
  console.log('🚀 Starting Store API Tests\n');
  console.log(`Backend URL: ${BACKEND_URL}`);
  console.log(`Test Email: ${TEST_EMAIL}\n`);

  // Test 1: Login
  await test('Login', async () => {
    const result = await makeRequest('POST', `${BACKEND_URL}/api/auth/login`, {
      email: TEST_EMAIL,
      password: TEST_PASSWORD
    });

    if (result.status === 0) {
      throw new Error(result.data.error || 'Cannot connect to backend server. Make sure the server is running.');
    }

    if (!result.ok || !result.data.success || !result.data.token) {
      const errorMsg = result.data.message || result.data.error || 'Unknown error';
      throw new Error(`Login failed (${result.status}): ${errorMsg}`);
    }

    token = result.data.token;
    console.log(`   ✅ Token received: ${token.substring(0, 20)}...`);
  });

  if (!token) {
    console.log('\n❌ Login failed - cannot continue with other tests');
    console.log('💡 Create a test store user first or check credentials\n');
    return;
  }

  const authHeaders = { 'Authorization': `Bearer ${token}` };

  // Test 2: Get Store Profile
  await test('Get Store Profile', async () => {
    const result = await makeRequest('GET', `${BACKEND_URL}/api/stores/profile`, null, authHeaders);

    if (!result.ok || !result.data.success) {
      throw new Error(`Failed (${result.status}): ${result.data.message || 'Unknown error'}`);
    }

    if (result.data.data && result.data.data._id) {
      storeId = result.data.data._id;
      console.log(`   ✅ Store ID: ${storeId}`);
      console.log(`   ✅ Store Name: ${result.data.data.storeName || 'N/A'}`);
    } else {
      console.log(`   ⚠️  Store profile not found (this is okay for new users)`);
    }
  });

  // Test 3: Get Store Dashboard
  await test('Get Store Dashboard', async () => {
    const result = await makeRequest('GET', `${BACKEND_URL}/api/stores/dashboard`, null, authHeaders);

    if (!result.ok || !result.data.success) {
      throw new Error(`Failed (${result.status}): ${result.data.message || 'Unknown error'}`);
    }

    const stats = result.data.data?.stats || {};
    console.log(`   ✅ Total Products: ${stats.totalProducts || 0}`);
    console.log(`   ✅ Total Orders: ${stats.totalOrders || 0}`);
    console.log(`   ✅ Monthly Revenue: ${stats.totalRevenue || 0}`);
  });

  // Test 4: Get All Stores
  await test('Get All Stores', async () => {
    const result = await makeRequest('GET', `${BACKEND_URL}/api/stores`, null, authHeaders);

    if (!result.ok || !result.data.success) {
      throw new Error(`Failed (${result.status}): ${result.data.message || 'Unknown error'}`);
    }

    const count = result.data.count || result.data.data?.length || 0;
    console.log(`   ✅ Found ${count} stores`);
  });

  // Test 5: Get Store by ID (if we have a store ID)
  if (storeId) {
    await test('Get Store by ID', async () => {
      const result = await makeRequest('GET', `${BACKEND_URL}/api/stores/${storeId}`, null, authHeaders);

      if (!result.ok || !result.data.success) {
        throw new Error(`Failed (${result.status}): ${result.data.message || 'Unknown error'}`);
      }

      console.log(`   ✅ Store Name: ${result.data.data?.storeName || 'N/A'}`);
    });
  } else {
    console.log('\n⏭️  Skipping: Get Store by ID (no store ID available)');
  }

  // Test 6: Get Store Products
  if (storeId) {
    await test('Get Store Products', async () => {
      const result = await makeRequest('GET', `${BACKEND_URL}/api/stores/${storeId}/products`, null, authHeaders);

      if (!result.ok || !result.data.success) {
        throw new Error(`Failed (${result.status}): ${result.data.message || 'Unknown error'}`);
      }

      const products = result.data.data || [];
      console.log(`   ✅ Found ${products.length} products`);
    });
  } else {
    console.log('\n⏭️  Skipping: Get Store Products (no store ID available)');
  }

  // Test 7: Add Product
  if (storeId) {
    await test('Add Product', async () => {
      const productData = {
        name: `Test Product ${Date.now()}`,
        description: 'This is a test product for API testing',
        category: 'cricket',
        price: {
          original: 1000,
          selling: 800,
          discount: 20
        },
        inventory: {
          quantity: 50,
          reserved: 0,
          lowStockThreshold: 10,
          totalSold: 0
        },
        availability: {
          isActive: true
        },
        sku: `TEST-${Date.now()}`,
        brand: 'Test Brand',
        specifications: {
          material: 'Test Material',
          size: 'Standard'
        }
      };

      const result = await makeRequest('POST', `${BACKEND_URL}/api/stores/${storeId}/products`, productData, authHeaders);

      if (!result.ok || !result.data.success) {
        throw new Error(`Failed (${result.status}): ${result.data.message || JSON.stringify(result.data)}`);
      }

      if (result.data.data && result.data.data._id) {
        productId = result.data.data._id;
        console.log(`   ✅ Product created: ${productId}`);
        console.log(`   ✅ Product Name: ${result.data.data.name}`);
      }
    });
  } else {
    console.log('\n⏭️  Skipping: Add Product (no store ID available)');
  }

  // Test 8: Update Product
  if (productId) {
    await test('Update Product', async () => {
      const updateData = {
        name: `Updated Test Product ${Date.now()}`,
        price: {
          original: 1200,
          selling: 900,
          discount: 25
        },
        inventory: {
          quantity: 60,
          reserved: 0,
          lowStockThreshold: 10,
          totalSold: 0
        },
        availability: {
          isActive: true
        }
      };

      const result = await makeRequest('PUT', `${BACKEND_URL}/api/stores/products/${productId}`, updateData, authHeaders);

      if (!result.ok || !result.data.success) {
        throw new Error(`Failed (${result.status}): ${result.data.message || JSON.stringify(result.data)}`);
      }

      console.log(`   ✅ Product updated: ${result.data.data?.name || 'N/A'}`);
    });
  } else {
    console.log('\n⏭️  Skipping: Update Product (no product ID available)');
  }

  // Test 9: Delete Product
  if (productId) {
    await test('Delete Product', async () => {
      const result = await makeRequest('DELETE', `${BACKEND_URL}/api/stores/products/${productId}`, null, authHeaders);

      if (!result.ok || !result.data.success) {
        throw new Error(`Failed (${result.status}): ${result.data.message || 'Unknown error'}`);
      }

      console.log(`   ✅ Product deleted successfully`);
      productId = null; // Clear product ID after deletion
    });
  } else {
    console.log('\n⏭️  Skipping: Delete Product (no product ID available)');
  }

  // Test 10: Get Store Orders
  await test('Get Store Orders', async () => {
    const result = await makeRequest('GET', `${BACKEND_URL}/api/orders/store`, null, authHeaders);

    if (!result.ok) {
      // 404 is okay if there are no orders
      if (result.status === 404) {
        console.log(`   ✅ No orders found (this is okay)`);
        return;
      }
      throw new Error(`Failed (${result.status}): ${result.data.message || 'Unknown error'}`);
    }

    const orders = result.data.data || result.data.orders || [];
    console.log(`   ✅ Found ${orders.length} orders`);
  });

  // Test 11: Update Store Profile (if store exists)
  if (storeId) {
    await test('Update Store Profile', async () => {
      // Note: This requires FormData for file uploads, so we'll test with basic data
      const updateData = {
        storeName: `Updated Store ${Date.now()}`,
        description: 'Updated store description for testing'
      };

      // For this test, we'll use JSON (file uploads would need FormData)
      const result = await makeRequest('PUT', `${BACKEND_URL}/api/stores/profile`, updateData, authHeaders);

      // 404 is okay if profile doesn't exist yet
      if (result.status === 404) {
        console.log(`   ⚠️  Store profile not found (may need to create it first)`);
        return;
      }

      if (!result.ok || !result.data.success) {
        throw new Error(`Failed (${result.status}): ${result.data.message || 'Unknown error'}`);
      }

      console.log(`   ✅ Store profile updated`);
    });
  } else {
    console.log('\n⏭️  Skipping: Update Store Profile (no store ID available)');
  }

  // Test 12: Test Route (debug route)
  await test('Test Route', async () => {
    const result = await makeRequest('GET', `${BACKEND_URL}/api/stores/test`);

    if (!result.ok || !result.data.success) {
      throw new Error(`Failed (${result.status}): ${result.data.message || 'Unknown error'}`);
    }

    console.log(`   ✅ Response: ${JSON.stringify(result.data)}`);
  });

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Test Results Summary');
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
runTests().catch(console.error);

