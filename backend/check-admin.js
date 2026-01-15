const mongoose = require('mongoose');
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
    const admin = await Admin.findOne({ email: adminEmail });
    
    if (admin) {
      console.log('✅ Admin account found!');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`   ID:       ${admin._id}`);
      console.log(`   Name:     ${admin.name}`);
      console.log(`   Email:    ${admin.email}`);
      console.log(`   Role:     ${admin.role}`);
      console.log(`   Status:   ${admin.status}`);
      console.log(`   Created:  ${admin.createdAt}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    } else {
      console.log('❌ Admin account NOT found!');
      console.log(`   Looking for: ${adminEmail}`);
      console.log('\n💡 Run: node create-admin.js to create the admin account');
      console.log('   Or restart the server - it will create automatically.\n');
    }
    
    // List all admins
    const allAdmins = await Admin.find({});
    console.log(`📊 Total admin accounts in database: ${allAdmins.length}`);
    if (allAdmins.length > 0) {
      console.log('\nAll admin accounts:');
      allAdmins.forEach((a, i) => {
        console.log(`   ${i + 1}. ${a.email} (${a.role}, ${a.status})`);
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error checking admin:', error);
    process.exit(1);
  }
}).catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

