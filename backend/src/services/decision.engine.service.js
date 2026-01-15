/**
 * Decision Engine Service
 * Implements the automatic verification decision-making system
 * Based on the scoring mechanism you described
 */

/**
 * Evaluate verification scores and make automated decisions
 * @param {Object} verificationData - Verification data with scores
 * @returns {Object} Decision result with status and confidence
 */
const evaluateVerification = (verificationData) => {
  try {
    const {
      aadhaarScore = 0,
      panScore = 0,
      faceMatchScore = 0,
      rcScore = 0,
      bankScore = 0
    } = verificationData;

    // Calculate overall score
    const totalScore = (aadhaarScore + panScore + faceMatchScore + rcScore + bankScore) / 5;
    
    // Apply the decision logic you specified
    if (totalScore >= 90) {
      return {
        status: 'AUTO_APPROVED',
        confidence: 'high',
        message: 'High confidence verification - auto-approved',
        score: totalScore
      };
    } else if (totalScore >= 70) {
      return {
        status: 'MANUAL_REVIEW',
        confidence: 'medium',
        message: 'Medium confidence verification - requires manual review',
        score: totalScore
      };
    } else {
      return {
        status: 'REJECTED',
        confidence: 'low',
        message: 'Low confidence verification - rejected',
        score: totalScore
      };
    }
  } catch (error) {
    console.error('Decision engine evaluation error:', error);
    return {
      status: 'ERROR',
      confidence: 'unknown',
      message: 'Error in evaluation',
      score: 0
    };
  }
};

/**
 * Calculate individual verification scores
 * @param {string} verificationType - Type of verification
 * @param {Object} data - Verification data
 * @returns {number} Score (0-100)
 */
const calculateVerificationScore = (verificationType, data) => {
  try {
    switch (verificationType) {
      case 'aadhaar':
        return calculateAadhaarScore(data);
      case 'pan':
        return calculatePanScore(data);
      case 'faceMatch':
        return calculateFaceMatchScore(data);
      case 'rc':
        return calculateRCScore(data);
      case 'bank':
        return calculateBankScore(data);
      default:
        return 0;
    }
  } catch (error) {
    console.error('Score calculation error:', error);
    return 0;
  }
};

/**
 * Calculate Aadhaar verification score
 * @param {Object} data - Aadhaar verification data
 * @returns {number} Score (0-100)
 */
const calculateAadhaarScore = (data) => {
  let score = 0;
  
  // Check if all required fields are present
  if (data.aadhaarNumber) score += 20;
  if (data.name) score += 15;
  if (data.dob) score += 15;
  if (data.address) score += 20;
  if (data.extractedAt) score += 10;
  
  // Check image quality
  if (data.imageQuality) {
    if (data.imageQuality >= 0.8) score += 10;
    else if (data.imageQuality >= 0.6) score += 5;
  } else {
    score += 10; // Assume good quality if not specified
  }
  
  // Check data consistency
  if (data.consistencyCheck === true) score += 10;
  
  // Cap at 100
  return Math.min(score, 100);
};

/**
 * Calculate PAN verification score
 * @param {Object} data - PAN verification data
 * @returns {number} Score (0-100)
 */
const calculatePanScore = (data) => {
  let score = 0;
  
  // Check if all required fields are present
  if (data.panNumber) score += 25;
  if (data.name) score += 20;
  if (data.fatherName) score += 15;
  if (data.dob) score += 15;
  if (data.extractedAt) score += 10;
  
  // Check image quality
  if (data.imageQuality) {
    if (data.imageQuality >= 0.8) score += 10;
    else if (data.imageQuality >= 0.6) score += 5;
  } else {
    score += 10; // Assume good quality if not specified
  }
  
  // Check data consistency
  if (data.consistencyCheck === true) score += 5;
  
  // Cap at 100
  return Math.min(score, 100);
};

/**
 * Calculate face match verification score
 * @param {Object} data - Face match verification data
 * @returns {number} Score (0-100)
 */
const calculateFaceMatchScore = (data) => {
  let score = 0;
  
  // Use the match score if available
  if (data.matchScore && typeof data.matchScore === 'number') {
    score = data.matchScore;
  } else {
    // Calculate based on other factors
    if (data.similarityScore) score += data.similarityScore * 100;
    if (data.confidence) score += data.confidence * 100;
  }
  
  // Check image quality
  if (data.imageQuality) {
    if (data.imageQuality >= 0.8) score += 10;
    else if (data.imageQuality >= 0.6) score += 5;
  }
  
  // Cap at 100
  return Math.min(score, 100);
};

/**
 * Calculate RC verification score
 * @param {Object} data - RC verification data
 * @returns {number} Score (0-100)
 */
const calculateRCScore = (data) => {
  let score = 0;
  
  // Check if all required fields are present
  if (data.rcNumber) score += 15;
  if (data.vehicleNumber) score += 15;
  if (data.ownerName) score += 15;
  if (data.vehicleClass) score += 10;
  if (data.fuelType) score += 10;
  if (data.manufacturer) score += 10;
  if (data.model) score += 10;
  if (data.yearOfManufacture) score += 10;
  if (data.extractedAt) score += 5;
  
  // Check image quality
  if (data.imageQuality) {
    if (data.imageQuality >= 0.8) score += 10;
    else if (data.imageQuality >= 0.6) score += 5;
  } else {
    score += 10; // Assume good quality if not specified
  }
  
  // Check data consistency
  if (data.consistencyCheck === true) score += 10;
  
  // Cap at 100
  return Math.min(score, 100);
};

/**
 * Calculate bank verification score
 * @param {Object} data - Bank verification data
 * @returns {number} Score (0-100)
 */
const calculateBankScore = (data) => {
  let score = 0;
  
  // Check if all required fields are present
  if (data.accountNumber) score += 25;
  if (data.ifsc) score += 25;
  if (data.name) score += 20;
  if (data.bankName) score += 15;
  if (data.verifiedAt) score += 15;
  
  // Cap at 100
  return Math.min(score, 100);
};

/**
 * Process verification workflow
 * @param {string} userId - User ID
 * @param {string} verificationType - Type of verification
 * @param {Object} verificationData - Verification data
 * @returns {Promise<Object>} Processing result
 */
const processVerificationWorkflow = async (userId, verificationType, verificationData) => {
  try {
    // Calculate score for this verification
    const score = calculateVerificationScore(verificationType, verificationData);
    
    // Evaluate the overall decision
    const decision = evaluateVerification({
      [`${verificationType}Score`]: score
    });
    
    return {
      success: true,
      score,
      decision,
      userId,
      verificationType,
      processedAt: new Date()
    };
  } catch (error) {
    console.error('Verification workflow error:', error);
    return {
      success: false,
      error: error.message,
      userId,
      verificationType
    };
  }
};

/**
 * Get verification recommendations
 * @param {Object} userData - User data with verification status
 * @returns {Array} Recommendations for next steps
 */
const getVerificationRecommendations = (userData) => {
  const recommendations = [];
  const verification = userData.verification || {};
  
  // Check what's missing
  if (!verification.aadhaar?.verified) {
    recommendations.push({
      type: 'aadhaar',
      priority: 'high',
      message: 'Aadhaar verification is required for full account activation'
    });
  }
  
  if (!verification.pan?.verified) {
    recommendations.push({
      type: 'pan',
      priority: 'high',
      message: 'PAN verification is required for financial transactions'
    });
  }
  
  if (!verification.faceMatch?.verified) {
    recommendations.push({
      type: 'faceMatch',
      priority: 'medium',
      message: 'Face verification increases account security'
    });
  }
  
  if (!verification.vehicle?.verified && userData.role === 'delivery') {
    recommendations.push({
      type: 'vehicle',
      priority: 'high',
      message: 'Vehicle verification is required for delivery partners'
    });
  }
  
  if (!verification.bank?.verified) {
    recommendations.push({
      type: 'bank',
      priority: 'medium',
      message: 'Bank verification is required for payouts'
    });
  }
  
  return recommendations;
};

module.exports = {
  evaluateVerification,
  calculateVerificationScore,
  processVerificationWorkflow,
  getVerificationRecommendations
};