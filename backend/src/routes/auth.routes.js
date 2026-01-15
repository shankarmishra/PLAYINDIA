const express = require('express');
const { authenticate } = require('../middleware/auth.middleware');
const { authValidations } = require('../middleware/validate');
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
  getDashboard,
  firebaseLogin,
  generateFirebaseCustomToken
} = require('../controllers/auth.controller');

const router = express.Router();

// Public routes
router.post('/register', authValidations.register, register);
router.post('/login', authValidations.login, login);
router.post('/admin/login', adminLogin);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/verify-mobile', verifyMobile);
router.post('/send-otp', sendMobileOTP);
router.post('/firebase-login', firebaseLogin);

// Protected routes
router.use(authenticate);
router.get('/me', getMe);
router.patch('/update', updateMe);
router.get('/dashboard', getDashboard);
router.post('/generate-firebase-token/:userId', generateFirebaseCustomToken);

module.exports = router;