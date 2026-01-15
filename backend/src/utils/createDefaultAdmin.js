const Admin = require('../models/Admin.model');
const logger = require('./logger');

/**
 * Creates default admin account if it doesn't exist
 * This runs automatically on server start
 */
async function createDefaultAdmin() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@playindia.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const adminName = process.env.ADMIN_NAME || 'Admin User';

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: adminEmail });
    if (existingAdmin) {
      logger.info(`✅ Admin account already exists: ${adminEmail}`);
      return;
    }

    // Create admin account
    const admin = await Admin.create({
      name: adminName,
      email: adminEmail,
      password: adminPassword, // Will be hashed by pre-save hook
      role: 'super_admin',
      status: 'active',
      performance: {
        rating: 0, // Will use default 0 (now allowed)
        satisfaction: 0 // Will use default 0 (now allowed)
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

    logger.info('\n✅ Default admin account created automatically!\n');
    logger.info('📋 Default Admin Login Credentials:');
    logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    logger.info(`   Email:    ${adminEmail}`);
    logger.info(`   Password: ${adminPassword}`);
    logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    logger.info('🔐 Please change the password after first login!');
    logger.info('🌐 Login URL: http://localhost:3000/admin/login\n');
  } catch (error) {
    logger.error('❌ Error creating default admin:', error);
    // Don't throw - allow server to start even if admin creation fails
  }
}

module.exports = createDefaultAdmin;

