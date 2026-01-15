const User = require('../models/user.model');
const { uploadFileToFirebaseStorage } = require('../utils/firebase');
const config = require('../config');

/**
 * Vehicle Verification Service
 * Handles automatic vehicle document verification using Firebase and OCR
 */

/**
 * Verify vehicle RC document
 * @param {string} userId - User ID
 * @param {Object} rcDocument - RC document file
 * @returns {Promise<Object>} Verification result
 */
const verifyRC = async (userId, rcDocument) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Validate document
    if (!rcDocument) {
      throw new Error('RC document is required');
    }

    // Upload document to Firebase Storage
    const documentUrl = await uploadFileToFirebaseStorage(
      rcDocument.buffer, 
      rcDocument.originalname, 
      'documents/rc'
    );

    // Update user document reference
    if (!user.verification.vehicle) {
      user.verification.vehicle = {};
    }
    user.verification.vehicle.rcDocument = documentUrl;

    // In a real implementation, we would use Firebase ML Kit or Google Vision API for OCR
    // For now, we'll simulate the verification process
    const verificationResult = await simulateRCVerification(documentUrl);

    if (verificationResult.confidenceScore > 85) {
      // Auto-approve if confidence is high
      user.verification.vehicle.verified = true;
      user.verification.vehicle.verifiedAt = new Date();
      user.verification.vehicle.status = 'approved';
      user.verification.vehicle.verificationData = verificationResult.data;
    } else if (verificationResult.confidenceScore > 60) {
      // Send for manual review if confidence is medium
      user.verification.vehicle.status = 'manual_review';
      user.verification.vehicle.verificationData = verificationResult.data;
    } else {
      // Reject if confidence is low
      user.verification.vehicle.status = 'rejected';
      user.verification.vehicle.rejectionReason = verificationResult.reason || 'Low confidence score';
    }

    await user.save();

    return {
      success: true,
      status: user.verification.vehicle.status,
      confidenceScore: verificationResult.confidenceScore,
      message: `RC verification ${user.verification.vehicle.status}`,
      documentUrl
    };
  } catch (error) {
    console.error('RC verification error:', error);
    throw error;
  }
};

/**
 * Verify vehicle insurance document
 * @param {string} userId - User ID
 * @param {Object} insuranceDocument - Insurance document file
 * @returns {Promise<Object>} Verification result
 */
const verifyInsurance = async (userId, insuranceDocument) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Validate document
    if (!insuranceDocument) {
      throw new Error('Insurance document is required');
    }

    // Upload document to Firebase Storage
    const documentUrl = await uploadFileToFirebaseStorage(
      insuranceDocument.buffer, 
      insuranceDocument.originalname, 
      'documents/insurance'
    );

    // Update user document reference
    if (!user.verification.vehicle) {
      user.verification.vehicle = {};
    }
    user.verification.vehicle.insuranceDocument = documentUrl;

    // In a real implementation, we would use Firebase ML Kit or Google Vision API for OCR
    // For now, we'll simulate the verification process
    const verificationResult = await simulateInsuranceVerification(documentUrl);

    if (verificationResult.confidenceScore > 85) {
      // Auto-approve if confidence is high
      user.verification.vehicle.insuranceVerified = true;
      user.verification.vehicle.insuranceVerifiedAt = new Date();
      user.verification.vehicle.insuranceStatus = 'approved';
      user.verification.vehicle.insuranceData = verificationResult.data;
    } else if (verificationResult.confidenceScore > 60) {
      // Send for manual review if confidence is medium
      user.verification.vehicle.insuranceStatus = 'manual_review';
      user.verification.vehicle.insuranceData = verificationResult.data;
    } else {
      // Reject if confidence is low
      user.verification.vehicle.insuranceStatus = 'rejected';
      user.verification.vehicle.rejectionReason = verificationResult.reason || 'Low confidence score';
    }

    await user.save();

    return {
      success: true,
      status: user.verification.vehicle.insuranceStatus,
      confidenceScore: verificationResult.confidenceScore,
      message: `Insurance verification ${user.verification.vehicle.insuranceStatus}`,
      documentUrl
    };
  } catch (error) {
    console.error('Insurance verification error:', error);
    throw error;
  }
};

/**
 * Simulate RC verification using OCR
 * @param {string} documentUrl - Document URL
 * @returns {Promise<Object>} Verification result
 */
const simulateRCVerification = async (documentUrl) => {
  // In a real implementation, this would use Firebase ML Kit or Google Vision API
  // For simulation, we'll return a random confidence score and extracted data
  
  // Simulate OCR extraction and validation
  const confidenceScore = Math.floor(Math.random() * 40) + 60; // Random score between 60-100
  const rcNumber = 'KA01AB1234'; // Sample RC format
  
  // Simulate data extraction
  const extractedData = {
    rcNumber: rcNumber,
    vehicleNumber: 'KA01AB1234',
    ownerName: 'John Doe',
    vehicleClass: 'LMV',
    fuelType: 'PETROL',
    manufacturer: 'MARUTI SUZUKI',
    model: 'SWIFT',
    yearOfManufacture: '2020',
    engineNumber: 'K12MN1234567',
    chassisNumber: 'MA3XXXX1234567890',
    extractedAt: new Date()
  };

  return {
    confidenceScore,
    data: extractedData,
    reason: confidenceScore < 70 ? 'Low quality image or mismatched data' : null
  };
};

/**
 * Simulate insurance verification using OCR
 * @param {string} documentUrl - Document URL
 * @returns {Promise<Object>} Verification result
 */
const simulateInsuranceVerification = async (documentUrl) => {
  // In a real implementation, this would use Firebase ML Kit or Google Vision API
  // For simulation, we'll return a random confidence score and extracted data
  
  // Simulate OCR extraction and validation
  const confidenceScore = Math.floor(Math.random() * 40) + 60; // Random score between 60-100
  const policyNumber = 'INS123456789'; // Sample policy format
  
  // Simulate data extraction
  const extractedData = {
    policyNumber: policyNumber,
    companyName: 'ICICI Lombard',
    vehicleNumber: 'KA01AB1234',
    ownerName: 'John Doe',
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 335 * 24 * 60 * 60 * 1000),
    premiumAmount: 5000,
    coverageAmount: 500000,
    extractedAt: new Date()
  };

  return {
    confidenceScore,
    data: extractedData,
    reason: confidenceScore < 70 ? 'Low quality image or mismatched data' : null
  };
};

/**
 * Get vehicle verification status
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Verification status
 */
const getVehicleVerificationStatus = async (userId) => {
  try {
    const user = await User.findById(userId).select('verification.vehicle');
    if (!user) {
      throw new Error('User not found');
    }

    return {
      success: true,
      vehicleVerification: user.verification.vehicle
    };
  } catch (error) {
    console.error('Get vehicle verification status error:', error);
    throw error;
  }
};

module.exports = {
  verifyRC,
  verifyInsurance,
  getVehicleVerificationStatus
};