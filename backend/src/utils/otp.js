const crypto = require('crypto');

/**
 * Generate a random OTP
 * @param {number} length - Length of the OTP (default: 6)
 * @returns {string} Generated OTP
 */
const generateOTP = (length = 6) => {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
};

/**
 * Send OTP to user (placeholder function)
 * In a real app, this would integrate with an SMS service
 * @param {string} mobile - Mobile number to send OTP to
 * @param {string} otp - OTP to send
 * @returns {Promise<void>}
 */
const sendOTP = async (mobile, otp) => {
  // In a real application, integrate with an SMS service like Twilio, MSG91, etc.
  console.log(`OTP ${otp} sent to mobile: ${mobile}`);
  
  // For development purposes only - in production, use a real SMS service
  return Promise.resolve();
};

module.exports = {
  generateOTP,
  sendOTP
};