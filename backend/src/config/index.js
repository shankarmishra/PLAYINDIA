const dotenv = require('dotenv');
const path = require('path');

// Load .env file from backend root directory
dotenv.config({ path: path.join(__dirname, '../../.env') });

const { admin, firestore, storage, auth } = require('./firebase');

module.exports = {
  port: process.env.PORT || 5000,
  mongoURI: process.env.MONGODB_URI || 'mongodb://localhost:27017/teamup',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '30d',
  nodeEnv: process.env.NODE_ENV || 'development',
  firebase: {
    admin,
    firestore,
    storage,
    auth
  }
}; 