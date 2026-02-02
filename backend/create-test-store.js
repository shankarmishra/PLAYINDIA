require('dotenv').config();
const mongoose = require('mongoose');
const config = require('./src/config');
const User = require('./src/models/user.model');
const Store = require('./src/models/Store.model');
const Wallet = require('./src/models/Wallet.model');

const TEST_EMAIL = process.env.TEST_EMAIL || 'store@test.com';
const TEST_PASSWORD = process.env.TEST_PASSWORD || 'Test123!@#';
const TEST_MOBILE = '9876543210';

async function createTestStore() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(config.mongoURI);
    console.log('✅ Connected to database');

    // Check if user already exists
    const normalizedEmail = TEST_EMAIL.toLowerCase().trim();
    let user = await User.findOne({ email: normalizedEmail });

    if (user) {
      console.log(`✅ User already exists: ${normalizedEmail}`);
      
      // Check if store profile exists
      const store = await Store.findOne({ userId: user._id });
      if (store) {
        console.log('✅ Store profile already exists');
        console.log(`📋 Store ID: ${store._id}`);
      } else {
        console.log('⚠️  Store profile does not exist');
      }
      
      // Check wallet
      const wallet = await Wallet.findOne({ userId: user._id });
      if (wallet) {
        console.log('✅ Wallet already exists');
      } else {
        console.log('⚠️  Wallet does not exist');
      }

      console.log('\n📋 Test Store Credentials:');
      console.log(`Email: ${TEST_EMAIL}`);
      console.log(`Password: ${TEST_PASSWORD}`);
      console.log(`Status: ${user.status}`);
      console.log(`Role: ${user.role}`);
      
      await mongoose.connection.close();
      return;
    }

    console.log('👤 Creating test store user...');
    
    // Create user
    user = await User.create({
      name: 'Test Store Owner',
      email: normalizedEmail,
      mobile: TEST_MOBILE,
      password: TEST_PASSWORD,
      role: 'seller',
      status: 'active',
      profileComplete: false
    });
    console.log(`✅ User created: ${normalizedEmail}`);

    // Create wallet
    console.log('💰 Creating wallet...');
    await Wallet.create({
      userId: user._id,
      balance: 0,
      transactions: []
    });
    console.log('✅ Wallet created');

    // Create store profile
    console.log('🏪 Creating store profile...');
    const store = await Store.create({
      userId: user._id,
      storeName: 'Test Sports Store',
      ownerName: 'Test Store Owner',
      category: 'multi-sports',
      status: 'active',
      verified: true,
      address: {
        street: '123 Test Street',
        city: 'Test City',
        state: 'Test State',
        pincode: '123456',
        coordinates: [0, 0]
      }
    });
    console.log('✅ Store profile created');
    console.log(`📋 Store ID: ${store._id}`);

    console.log('\n🎉 Test store user created successfully!');
    console.log('\n📋 Test Store Credentials:');
    console.log(`Email: ${TEST_EMAIL}`);
    console.log(`Password: ${TEST_PASSWORD}`);
    console.log(`Mobile: ${TEST_MOBILE}`);
    console.log(`Role: seller`);
    console.log(`Status: active`);

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

createTestStore();

