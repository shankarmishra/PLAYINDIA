const User = require('../models/user.model');
const config = require('../config');
const { verifyFirebaseToken } = require('../utils/firebase');

// Firebase Authentication middleware
const authenticateWithFirebase = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No Firebase token provided.'
      });
    }

    // Verify Firebase token
    const decodedToken = await verifyFirebaseToken(token);
    const { uid, email, name, phone_number } = decodedToken;

    // Find user by Firebase UID
    const user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. User not found.'
      });
    }

    // Check if user is active
    if (user.status === 'inactive' || user.status === 'suspended') {
      return res.status(401).json({
        success: false,
        message: 'Account is inactive or suspended.'
      });
    }

    req.user = user;
    req.userId = user._id;
    req.userType = user.role;
    req.firebaseDecoded = decodedToken;
    
    next();
  } catch (error) {
    if (error.message.includes('Invalid Firebase token')) {
      return res.status(401).json({
        success: false,
        message: 'Invalid Firebase token.'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Internal server error during Firebase authentication.'
    });
  }
};

module.exports = {
  authenticateWithFirebase
};