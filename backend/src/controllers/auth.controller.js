const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const Coach = require('../models/coach.model');
const Store = require('../models/Store.model');
const Delivery = require('../models/delivery.model');
const Admin = require('../models/Admin.model');
const Wallet = require('../models/Wallet.model');
const Achievement = require('../models/achievement.model');
const PlayPoint = require('../models/PlayPoint.model');
const Notification = require('../models/Notification.model');
const config = require('../config');
const { generateOTP, sendOTP } = require('../utils/otp');
const { sendEmail } = require('../utils/email');
const { generateToken } = require('../utils/security');
const { generateReferralCode } = require('../utils/referral');
const bcrypt = require('bcryptjs');
const { verifyFirebaseToken, createCustomFirebaseToken } = require('../utils/firebase');

// Generate JWT token
const signToken = (id, userType) => {
  return jwt.sign({ id, userType }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn
  });
};

// Set token in cookie
const createSendToken = (user, statusCode, res, message = 'Success') => {
  const token = signToken(user._id, user.role || 'user');

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    success: true,
    message,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
      status: user.status,
      profileComplete: user.profileComplete,
      trustScore: user.trustScore,
      level: user.level,
      experiencePoints: user.experiencePoints,
      walletBalance: user.walletBalance,
      preferences: user.preferences,
      profile: user.profile,
      ...(user.location && { location: user.location })
    }
  });
};

// Register user
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, mobile, role = 'user' } = req.body;

    // Normalize mobile number - remove country code and keep only 10 digits
    let normalizedMobile = mobile;
    if (normalizedMobile) {
      // Remove all non-digit characters
      normalizedMobile = normalizedMobile.replace(/\D/g, '');
      // If it starts with 91 and has 12 digits, remove the 91 prefix
      if (normalizedMobile.length === 12 && normalizedMobile.startsWith('91')) {
        normalizedMobile = normalizedMobile.substring(2);
      }
      // If it starts with 0 and has 11 digits, remove the 0
      if (normalizedMobile.length === 11 && normalizedMobile.startsWith('0')) {
        normalizedMobile = normalizedMobile.substring(1);
      }
      // Ensure it's exactly 10 digits
      if (normalizedMobile.length !== 10) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid 10-digit mobile number'
        });
      }
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { mobile: normalizedMobile }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email or mobile already exists.'
      });
    }

    // Generate referral code
    const referralCode = await generateReferralCode();

    // Extract additional data if provided
    const { additionalData } = req.body;

    // Create user with enhanced enterprise features
    const user = await User.create({
      name,
      email,
      password,
      mobile: normalizedMobile,
      role: role.toLowerCase(),
      status: role.toLowerCase() === 'user' ? 'active' : 'pending', // Users are active by default, others pending for approval
      referral: {
        code: referralCode
      },
      preferences: {
        favoriteGames: additionalData?.favoriteGames || [],
        skillLevel: (additionalData?.skillLevel || 'beginner').toLowerCase(),
        notificationSettings: {
          push: additionalData?.notificationsEnabled ?? true,
          email: true,
          sms: false,
          whatsapp: false
        }
      },
      profile: {
        gender: additionalData?.gender,
        dateOfBirth: additionalData?.dateOfBirth,
        city: additionalData?.city,
        bio: additionalData?.bio,
        experience: additionalData?.experience,
        preferredTime: additionalData?.preferredTime,
        availableDays: additionalData?.availableDays,
        emergencyContact: additionalData?.emergencyContact,
        preferredRadius: additionalData?.preferredRadius || 5,
        locationSharing: additionalData?.locationSharing || false
      }
    });

    // Create user wallet
    await Wallet.create({
      userId: user._id,
      balance: 0
    });

    // Create role-specific profile if needed
    if (role === 'coach') {
      await Coach.create({
        userId: user._id,
        experience: { years: 0 },
        sports: [],
        verified: false,
        earnings: {
          total: 0,
          available: 0,
          pending: 0
        }
      });
    } else if (role === 'seller' || role === 'store') {
      await Store.create({
        userId: user._id,
        storeName: `${name}'s Store`,
        ownerName: name,
        gst: { number: '' },
        category: 'multi-sports',
        verified: false,
        earnings: {
          total: 0,
          available: 0,
          pending: 0
        }
      });
    } else if (role === 'delivery') {
      await Delivery.create({
        userId: user._id,
        vehicle: {
          type: 'bicycle',
          number: 'XX00XX0000', // Placeholder - should be updated during profile completion
          licenseNumber: 'TEMP-LICENSE' // Placeholder - should be updated during profile completion
        },
        verified: false,
        earnings: {
          total: 0,
          available: 0,
          pending: 0
        }
      });
    }

    createSendToken(user, 201, res, 'User registered successfully');
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Login user
exports.login = async (req, res, next) => {
  try {
    const { email, mobile, password } = req.body;

    // Validate input
    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide password'
      });
    }

    // Check if user provided email or mobile
    let user;
    if (email) {
      user = await User.findOne({ email }).select('+password');
    } else if (mobile) {
      user = await User.findOne({ mobile }).select('+password');
    } else {
      return res.status(400).json({
        success: false,
        message: 'Please provide email or mobile number'
      });
    }

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if account is active
    if (user.status === 'suspended' || user.status === 'rejected') {
      return res.status(401).json({
        success: false,
        message: 'Account is inactive or suspended'
      });
    }

    // Update security fields
    user.security.lastLogin = new Date();
    user.security.loginCount = (user.security.loginCount || 0) + 1;
    await user.save({ validateBeforeSave: false });

    createSendToken(user, 200, res, 'Login successful');
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Admin login
exports.adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    const admin = await Admin.findOne({ email }).select('+password');

    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    if (admin.status === 'inactive' || admin.status === 'suspended') {
      return res.status(401).json({
        success: false,
        message: 'Admin account is inactive or suspended'
      });
    }

    // Update last login
    admin.lastLogin = new Date();
    admin.loginCount = (admin.loginCount || 0) + 1;
    await admin.save({ validateBeforeSave: false });

    const token = signToken(admin._id, 'admin');

    res.status(200).json({
      success: true,
      message: 'Admin login successful',
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        status: admin.status,
        permissions: admin.permissions,
        profile: admin.profile
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get current user profile
exports.getMe = async (req, res, next) => {
  try {
    let user;
    if (req.userType === 'admin') {
      user = await Admin.findById(req.userId).select('-password');
    } else {
      user = await User.findById(req.userId).select('-password');
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user wallet and additional data
    const wallet = await Wallet.findOne({ userId: req.userId });

    let roleData = {};
    if (user.role === 'coach') {
      roleData = await Coach.findOne({ userId: req.userId });
    } else if (user.role === 'delivery') {
      roleData = await Delivery.findOne({ userId: req.userId });
    } else if (user.role === 'seller' || user.role === 'store') {
      roleData = await Store.findOne({ userId: req.userId });
    }

    res.status(200).json({
      success: true,
      user: {
        ...user.toObject(),
        walletBalance: wallet ? wallet.balance : 0,
        roleData
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update user profile
exports.updateMe = async (req, res, next) => {
  try {
    if (req.userType === 'admin') {
      // Update admin profile
      const admin = await Admin.findByIdAndUpdate(
        req.userId,
        req.body,
        {
          new: true,
          runValidators: true
        }
      ).select('-password');

      return res.status(200).json({
        success: true,
        admin
      });
    }

    // Update regular user profile
    let updateData = { ...req.body };

    // Handle nested preferences
    if (req.body.preferences) {
      const prefs = req.body.preferences;
      Object.keys(prefs).forEach(key => {
        updateData[`preferences.${key}`] = prefs[key];
      });
      delete updateData.preferences;
    }

    // Handle nested profile info
    if (req.body.profile) {
      const profileInfo = req.body.profile;
      Object.keys(profileInfo).forEach(key => {
        updateData[`profile.${key}`] = profileInfo[key];
      });
      delete updateData.profile;
    }

    // Ensure age is synced if provided at top level or in preferences
    if (req.body.age) {
      updateData['preferences.age'] = req.body.age;
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Logout user
exports.logout = (req, res, next) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
};

// Forgot password
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email address'
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No user found with this email address'
      });
    }

    // Generate reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password Reset Token',
        message: `Your password reset token is: ${resetToken}`
      });

      res.status(200).json({
        success: true,
        message: 'Reset token sent to email'
      });
    } catch (error) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({
        success: false,
        message: 'Error sending reset email'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Reset password
exports.resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide new password'
      });
    }

    // Get user based on token
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Token is invalid or has expired'
      });
    }

    // Set new password
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    createSendToken(user, 200, res, 'Password reset successful');
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Verify mobile number with OTP
exports.verifyMobile = async (req, res, next) => {
  try {
    const { mobile, otp } = req.body;

    if (!mobile || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Please provide mobile number and OTP'
      });
    }

    const user = await User.findOne({ mobile });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found with this mobile number'
      });
    }

    if (user.verification.mobile.otp !== otp || user.verification.mobile.otpExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }

    // Verify mobile number
    user.verification.mobile.verified = true;
    user.verification.mobile.otp = undefined;
    user.verification.mobile.otpExpires = undefined;

    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: 'Mobile number verified successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Send OTP for mobile verification
exports.sendMobileOTP = async (req, res, next) => {
  try {
    const { mobile } = req.body;

    if (!mobile) {
      return res.status(400).json({
        success: false,
        message: 'Please provide mobile number'
      });
    }

    const user = await User.findOne({ mobile });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found with this mobile number'
      });
    }

    // Generate OTP
    const otp = generateOTP();
    user.verification.mobile.otp = otp;
    user.verification.mobile.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save({ validateBeforeSave: false });

    // Send OTP (in real app, integrate with SMS service)
    await sendOTP(mobile, otp);

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

// Firebase Authentication Methods

// Login with Firebase ID token
exports.firebaseLogin = async (req, res, next) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: 'Firebase ID token is required'
      });
    }

    // Verify Firebase token
    const decodedToken = await verifyFirebaseToken(idToken);
    const { uid, email, name, phone_number } = decodedToken;

    // Find or create user based on Firebase UID
    let user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      // Create new user if doesn't exist
      const referralCode = await generateReferralCode();

      user = await User.create({
        name: name || 'New User',
        email: email || '',
        mobile: phone_number || '',
        firebaseUid: uid,
        role: 'user', // Default role for Firebase users
        status: 'active',
        referral: {
          code: referralCode
        },
        preferences: {
          favoriteGames: [],
          skillLevel: 'beginner',
          notificationSettings: {
            push: true,
            email: true,
            sms: false,
            whatsapp: false
          }
        }
      });

      // Create user wallet
      await Wallet.create({
        userId: user._id,
        balance: 0
      });
    }

    // Update last login
    user.security.lastLogin = new Date();
    user.security.loginCount = (user.security.loginCount || 0) + 1;
    await user.save({ validateBeforeSave: false });

    createSendToken(user, 200, res, 'Firebase login successful');
  } catch (error) {
    console.error('Firebase login error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Generate Firebase custom token
exports.generateFirebaseCustomToken = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Create custom Firebase token
    const customToken = await createCustomFirebaseToken(user._id.toString(), {
      role: user.role,
      email: user.email,
      name: user.name
    });

    res.status(200).json({
      success: true,
      customToken
    });
  } catch (error) {
    console.error('Generate custom token error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Role-based dashboard redirect
exports.getDashboard = async (req, res, next) => {
  try {
    const { role } = req.user;

    let dashboardUrl = '';

    switch (role) {
      case 'user':
        dashboardUrl = '/user-dashboard';
        break;
      case 'coach':
        dashboardUrl = '/coach-dashboard';
        break;
      case 'seller':
      case 'store':
        dashboardUrl = '/store-dashboard';
        break;
      case 'delivery':
        dashboardUrl = '/delivery-dashboard';
        break;
      case 'admin':
        dashboardUrl = '/admin-dashboard';
        break;
      default:
        dashboardUrl = '/user-dashboard';
    }

    res.status(200).json({
      success: true,
      dashboardUrl,
      role,
      message: `Redirect to ${role} dashboard`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};