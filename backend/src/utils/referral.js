const crypto = require('crypto');

/**
 * Generate a unique referral code
 * @returns {Promise<string>} A unique referral code
 */
const generateReferralCode = async () => {
  try {
    // Generate a random 8-character alphanumeric code
    const referralCode = crypto
      .randomBytes(4)
      .toString('hex')
      .toUpperCase()
      .substring(0, 8);
    
    // Ensure uniqueness by checking against existing codes
    // In a real implementation, you would check against the database
    // to ensure the code doesn't already exist
    
    return referralCode;
  } catch (error) {
    console.error('Error generating referral code:', error);
    // Fallback: generate a simple timestamp-based code
    return `REF${Date.now().toString(36).toUpperCase()}`;
  }
};

module.exports = { generateReferralCode };