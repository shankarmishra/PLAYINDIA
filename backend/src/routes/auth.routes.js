const express = require('express');
const { authenticate } = require('../middleware/auth.middleware');
const {
  register,
  login,
  adminLogin,
  logout,
  forgotPassword,
  resetPassword,
  getMe,
  updateMe,
  verifyMobile,
  sendMobileOTP,
  getDashboard
} = require('../controllers/auth.controller');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/admin/login', adminLogin);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/verify-mobile', verifyMobile);
router.post('/send-otp', sendMobileOTP);

// Protected routes
router.use(authenticate);
router.get('/me', getMe);
router.patch('/update', updateMe);
router.get('/dashboard', getDashboard);

module.exports = router;