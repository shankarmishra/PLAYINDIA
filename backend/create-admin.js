const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./src/models/Admin.model');
const config = require('./src/config');

// Connect to MongoDB
mongoose.connect(config.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ Connected to MongoDB');
  createAdmin();
}).catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

async function createAdmin() {
  try {
    // Default admin credentials
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@playindia.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const adminName = process.env.ADMIN_NAME || 'Admin User';

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('⚠️  Admin account already exists with email:', adminEmail);
      console.log('📝 To reset password, delete the admin and run this script again');
      process.exit(0);
    }

    // Create admin account
    const admin = await Admin.create({
      name: adminName,
      email: adminEmail,
      password: adminPassword, // Will be hashed by pre-save hook
      role: 'super_admin',
      status: 'active',
      performance: {
        rating: 0, // Default value (now allowed)
        satisfaction: 0 // Default value (now allowed)
      },
      permissions: {
        users: {
          view: true,
          create: true,
          edit: true,
          delete: true,
          approve: true
        },
        coaches: {
          view: true,
          create: true,
          edit: true,
          delete: true,
          approve: true
        },
        stores: {
          view: true,
          create: true,
          edit: true,
          delete: true,
          approve: true
        },
        deliveries: {
          view: true,
          create: true,
          edit: true,
          delete: true,
          approve: true
        },
        bookings: {
          view: true,
          edit: true,
          cancel: true
        },
        orders: {
          view: true,
          edit: true,
          cancel: true
        },
        payments: {
          view: true,
          process: true,
          refund: true
        },
        content: {
          view: true,
          create: true,
          edit: true,
          delete: true
        },
        analytics: {
          view: true,
          export: true
        }
      }
    });

    console.log('\n✅ Admin account created successfully!\n');
    console.log('📋 Default Admin Login Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`   Email:    ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('💡 Note: Admin account is now created automatically on server start!');
    console.log('🔐 Please change the password after first login!');
    console.log('🌐 Login URL: http://localhost:3000/admin/login\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
}

