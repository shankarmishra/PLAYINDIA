const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./src/models/Admin.model');
const config = require('./src/config');

// Connect to MongoDB
mongoose.connect(config.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('✅ Connected to MongoDB\n');
  
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@playindia.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    
    // Find admin
    const admin = await Admin.findOne({ email: adminEmail });
    
    if (!admin) {
      console.log('❌ Admin account not found!');
      console.log(`   Looking for: ${adminEmail}`);
      console.log('\n💡 Creating new admin account...\n');
      
      // Create new admin
      const newAdmin = await Admin.create({
        name: 'Admin User',
        email: adminEmail,
        password: adminPassword, // Will be hashed by pre-save hook
        role: 'super_admin',
        status: 'active',
        permissions: {
          users: { view: true, create: true, edit: true, delete: true, approve: true },
          coaches: { view: true, create: true, edit: true, delete: true, approve: true },
          stores: { view: true, create: true, edit: true, delete: true, approve: true },
          deliveries: { view: true, create: true, edit: true, delete: true, approve: true },
          bookings: { view: true, edit: true, cancel: true },
          orders: { view: true, edit: true, cancel: true },
          payments: { view: true, process: true, refund: true },
          content: { view: true, create: true, edit: true, delete: true },
          analytics: { view: true, export: true }
        },
        performance: {
          rating: 5, // Set to maximum rating
          satisfaction: 5 // Set to maximum satisfaction
        }
      });
      
      console.log('✅ Admin account created successfully!\n');
      console.log('📋 Admin Login Credentials:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`   Email:    ${adminEmail}`);
      console.log(`   Password: ${adminPassword}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    } else {
      console.log('✅ Admin account found!');
      console.log(`   Email: ${admin.email}`);
      console.log(`   Name: ${admin.name}`);
      console.log(`   Role: ${admin.role}`);
      console.log(`   Status: ${admin.status}\n`);
      
      // Reset password
      console.log('🔄 Resetting password...');
      admin.password = adminPassword; // Will be hashed by pre-save hook
      await admin.save();
      
      console.log('✅ Password reset successfully!\n');
      console.log('📋 Updated Admin Login Credentials:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`   Email:    ${adminEmail}`);
      console.log(`   Password: ${adminPassword}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      
      // Test password comparison
      console.log('🔍 Testing password verification...');
      const isPasswordValid = await admin.comparePassword(adminPassword);
      if (isPasswordValid) {
        console.log('✅ Password verification successful!\n');
      } else {
        console.log('❌ Password verification failed!\n');
      }
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}).catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

