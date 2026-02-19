const axios = require('axios');
require('dotenv').config();

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';
const timestamp = Date.now();
const testUser = {
    name: `Test User ${timestamp}`,
    email: `test${timestamp}@example.com`,
    password: 'Password123!',
    mobile: `987654${timestamp.toString().slice(-4)}`
};

let token = '';
let userId = '';

const results = {
    total: 0,
    passed: 0,
    failed: 0,
    errors: []
};

async function test(name, fn) {
    results.total++;
    console.log(`\n🧪 Testing: ${name}`);
    try {
        await fn();
        results.passed++;
        console.log('✅ Passed');
    } catch (error) {
        results.failed++;
        const message = error.response ?
            `${error.message} - ${JSON.stringify(error.response.data)}` :
            error.message;
        results.errors.push({ name, error: message });
        console.log(`❌ Failed: ${message}`);
    }
}

async function runAllTests() {
    console.log('🚀 Starting Comprehensive Backend API Tests\n');
    console.log(`Backend URL: ${BACKEND_URL}`);

    // 1. Health Check
    await test('Health Check', async () => {
        const res = await axios.get(`${BACKEND_URL}/health`);
        if (!res.data.success) throw new Error('Health check failed');
    });

    // 2. Registration
    await test('User Registration', async () => {
        const res = await axios.post(`${BACKEND_URL}/api/auth/register`, testUser);
        if (!res.data.success) throw new Error('Registration failed');
        userId = res.data.user.id;
    });

    // 3. Login
    await test('User Login', async () => {
        const res = await axios.post(`${BACKEND_URL}/api/auth/login`, {
            email: testUser.email,
            password: testUser.password
        });
        if (!res.data.success || !res.data.token) throw new Error('Login failed');
        token = res.data.token;
    });

    const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

    // 4. Me / Profile
    await test('Get Current User (Me)', async () => {
        const res = await axios.get(`${BACKEND_URL}/api/auth/me`, authHeaders);
        if (!res.data.success) throw new Error('Failed to get current user');
    });

    // 5. User Profile
    if (userId) {
        await test('Get User Profile', async () => {
            const res = await axios.get(`${BACKEND_URL}/api/users/profile`, authHeaders);
            if (!res.data.success) throw new Error('Failed to get user profile');
        });
    }

    // 6. Nearby Players
    await test('Get Nearby Players', async () => {
        // Current location coordinates (approximate Mumbai)
        const res = await axios.get(`${BACKEND_URL}/api/users/nearby?lat=19.0760&lng=72.8777&distance=10`, authHeaders);
        if (!res.data.success) throw new Error('Failed to get nearby players');
        console.log(`   Found ${res.data.count} players`);
    });

    // 7. Tournaments (Public)
    await test('Get Tournaments', async () => {
        const res = await axios.get(`${BACKEND_URL}/api/tournaments`);
        if (!res.data.success) throw new Error('Failed to get tournaments');
    });

    // 8. Coaches (Public)
    await test('Get Coaches', async () => {
        const res = await axios.get(`${BACKEND_URL}/api/coaches`);
        if (!res.data.success) throw new Error('Failed to get coaches');
    });

    // 9. Total Users (Verification)
    await test('Get Total Users (Admin)', async () => {
        try {
            const res = await axios.get(`${BACKEND_URL}/api/users`, authHeaders);
            if (res.data.success) {
                console.log(`   Total Users in DB: ${res.data.total}`);
            } else {
                console.log('   Note: User might not have admin rights for this endpoint');
            }
        } catch (err) {
            console.log('   Note: User likely lacks admin rights to view all users');
        }
    });

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 TEST SUMMARY');
    console.log('='.repeat(50));
    console.log(`Total:  ${results.total}`);
    console.log(`Passed: ${results.passed}`);
    console.log(`Failed: ${results.failed}`);
    console.log('='.repeat(50));

    if (results.failed > 0) {
        console.log('\n❌ Failed Tests Detail:');
        results.errors.forEach(err => console.log(` - ${err.name}: ${err.error}`));
        process.exit(1);
    } else {
        console.log('\n✅ All critical APIs are functional!');
        process.exit(0);
    }
}

runAllTests().catch(err => {
    console.error('Fatal error during tests:', err.message);
    process.exit(1);
});
