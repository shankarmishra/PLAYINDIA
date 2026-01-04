const express = require('express');
const { authValidations } = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const {
  register,
  login,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerificationEmail,
  getCurrentUser,
  updatePassword,
  updateProfile
} = require('../controllers/auth.controller');

const router = express.Router();

// Public routes
router.post('/register', authValidations.register, register);
router.post('/login', authValidations.login, login);
router.post('/logout', logout);
router.post('/refresh-token', refreshToken);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/verify-email/:token', verifyEmail);
router.post('/resend-verification', resendVerificationEmail);

// Protected routes
router.use(protect); // Apply protection to all routes below this
router.get('/me', getCurrentUser);
router.patch('/update-password', authValidations.updatePassword, updatePassword);
router.patch('/update-profile', authValidations.updateProfile, updateProfile);

module.exports = router; 