const User = require('../models/user.model');
const {
  verifyAadhaar,
  verifyPan,
  verifyFaceMatch,
  getUserVerificationStatus
} = require('../services/document.verification.service');
const {
  verifyRC,
  verifyInsurance,
  getVehicleVerificationStatus
} = require('../services/vehicle.verification.service');
const {
  verifyBankAccount,
  getBankVerificationStatus
} = require('../services/bank.verification.service');

/**
 * Comprehensive Verification Controller
 * Handles all types of verification in one place
 */

/**
 * Get complete verification status for a user
 */
exports.getCompleteVerificationStatus = async (req, res, next) => {
  try {
    const result = await getUserVerificationStatus(req.user._id);
    const vehicleResult = await getVehicleVerificationStatus(req.user._id);
    const bankResult = await getBankVerificationStatus(req.user._id);

    // Combine all verification statuses
    const completeStatus = {
      document: result.verification,
      vehicle: vehicleResult.vehicleVerification,
      bank: bankResult.bankVerification
    };

    res.status(200).json({
      success: true,
      data: completeStatus
    });
  } catch (error) {
    console.error('Get complete verification status error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get user verification summary
 */
exports.getVerificationSummary = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('verification');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Calculate verification completeness
    const verification = user.verification;
    const summary = {
      overallStatus: calculateOverallVerificationStatus(verification),
      documentVerification: {
        aadhaar: verification.aadhaar.status || 'pending',
        pan: verification.pan.status || 'pending',
        faceMatch: verification.faceMatch.status || 'pending'
      },
      vehicleVerification: {
        rc: verification.vehicle?.status || 'pending',
        insurance: verification.vehicle?.insuranceStatus || 'pending'
      },
      bankVerification: {
        status: verification.bank?.status || 'pending'
      },
      completedPercentage: calculateVerificationPercentage(verification)
    };

    res.status(200).json({
      success: true,
      data: summary
    });
  } catch (error) {
    console.error('Get verification summary error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Calculate overall verification status
 */
const calculateOverallVerificationStatus = (verification) => {
  const statuses = [
    verification.aadhaar.status,
    verification.pan.status,
    verification.faceMatch.status,
    verification.vehicle?.status,
    verification.bank?.status
  ].filter(status => status); // Remove undefined/null values

  // Count completed verifications
  const completed = statuses.filter(status => 
    status === 'approved' || status === 'verified'
  ).length;

  if (completed === statuses.length && statuses.length > 0) {
    return 'complete';
  } else if (completed > 0) {
    return 'partial';
  } else {
    return 'pending';
  }
};

/**
 * Calculate verification percentage
 */
const calculateVerificationPercentage = (verification) => {
  // Define required verification types
  const requiredVerifications = 5; // aadhaar, pan, face, vehicle, bank
  let completedCount = 0;

  if (verification.aadhaar?.status === 'approved') completedCount++;
  if (verification.pan?.status === 'approved') completedCount++;
  if (verification.faceMatch?.status === 'approved') completedCount++;
  if (verification.vehicle?.status === 'approved') completedCount++;
  if (verification.bank?.status === 'approved') completedCount++;

  return Math.round((completedCount / requiredVerifications) * 100);
};