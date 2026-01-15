const User = require('../models/user.model');
const { uploadFileToFirebaseStorage, deleteFileFromFirebaseStorage } = require('../utils/firebase');
const config = require('../config');

/**
 * Document Verification Service
 * Handles automatic document verification using Firebase and OCR
 */

/**
 * Verify Aadhaar document
 * @param {string} userId - User ID
 * @param {Object} documents - Document files (front and back)
 * @returns {Promise<Object>} Verification result
 */
const verifyAadhaar = async (userId, documents) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Validate required documents
    if (!documents.front || !documents.back) {
      throw new Error('Both front and back of Aadhaar are required');
    }

    // Upload documents to Firebase Storage
    const frontUrl = await uploadFileToFirebaseStorage(
      documents.front.buffer, 
      documents.front.originalname, 
      'documents/aadhaar/front'
    );
    
    const backUrl = await uploadFileToFirebaseStorage(
      documents.back.buffer, 
      documents.back.originalname, 
      'documents/aadhaar/back'
    );

    // Update user document references
    user.verification.aadhaar.documentFront = frontUrl;
    user.verification.aadhaar.documentBack = backUrl;

    // In a real implementation, we would use Firebase ML Kit or Google Vision API for OCR
    // For now, we'll simulate the verification process
    const verificationResult = await simulateAadhaarVerification(frontUrl, backUrl);

    if (verificationResult.confidenceScore > 85) {
      // Auto-approve if confidence is high
      user.verification.aadhaar.verified = true;
      user.verification.aadhaar.verifiedAt = new Date();
      user.verification.aadhaar.status = 'approved';
      user.verification.aadhaar.verificationData = verificationResult.data;
    } else if (verificationResult.confidenceScore > 60) {
      // Send for manual review if confidence is medium
      user.verification.aadhaar.status = 'manual_review';
      user.verification.aadhaar.verificationData = verificationResult.data;
    } else {
      // Reject if confidence is low
      user.verification.aadhaar.status = 'rejected';
      user.verification.aadhaar.rejectionReason = verificationResult.reason || 'Low confidence score';
    }

    await user.save();

    return {
      success: true,
      status: user.verification.aadhaar.status,
      confidenceScore: verificationResult.confidenceScore,
      message: `Aadhaar verification ${user.verification.aadhaar.status}`,
      documentUrls: {
        front: frontUrl,
        back: backUrl
      }
    };
  } catch (error) {
    console.error('Aadhaar verification error:', error);
    throw error;
  }
};

/**
 * Verify PAN document
 * @param {string} userId - User ID
 * @param {Object} document - PAN document file
 * @returns {Promise<Object>} Verification result
 */
const verifyPan = async (userId, document) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Validate document
    if (!document) {
      throw new Error('PAN document is required');
    }

    // Upload document to Firebase Storage
    const documentUrl = await uploadFileToFirebaseStorage(
      document.buffer, 
      document.originalname, 
      'documents/pan'
    );

    // Update user document reference
    user.verification.pan.document = documentUrl;

    // In a real implementation, we would use Firebase ML Kit or Google Vision API for OCR
    // For now, we'll simulate the verification process
    const verificationResult = await simulatePanVerification(documentUrl);

    if (verificationResult.confidenceScore > 85) {
      // Auto-approve if confidence is high
      user.verification.pan.verified = true;
      user.verification.pan.verifiedAt = new Date();
      user.verification.pan.status = 'approved';
      user.verification.pan.number = verificationResult.panNumber;
      user.verification.pan.verificationData = verificationResult.data;
    } else if (verificationResult.confidenceScore > 60) {
      // Send for manual review if confidence is medium
      user.verification.pan.status = 'manual_review';
      user.verification.pan.verificationData = verificationResult.data;
    } else {
      // Reject if confidence is low
      user.verification.pan.status = 'rejected';
      user.verification.pan.rejectionReason = verificationResult.reason || 'Low confidence score';
    }

    await user.save();

    return {
      success: true,
      status: user.verification.pan.status,
      confidenceScore: verificationResult.confidenceScore,
      panNumber: user.verification.pan.number,
      message: `PAN verification ${user.verification.pan.status}`,
      documentUrl
    };
  } catch (error) {
    console.error('PAN verification error:', error);
    throw error;
  }
};

/**
 * Verify face match between selfie and document photo
 * @param {string} userId - User ID
 * @param {Object} selfie - Selfie image file
 * @param {string} documentPhotoUrl - URL of photo from document
 * @returns {Promise<Object>} Verification result
 */
const verifyFaceMatch = async (userId, selfie, documentPhotoUrl) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Validate selfie
    if (!selfie) {
      throw new Error('Selfie is required');
    }

    // Upload selfie to Firebase Storage
    const selfieUrl = await uploadFileToFirebaseStorage(
      selfie.buffer, 
      selfie.originalname, 
      'documents/selfies'
    );

    // Update user selfie reference
    user.verification.faceMatch.selfie = selfieUrl;

    // In a real implementation, we would use Firebase ML Kit for face comparison
    // For now, we'll simulate the verification process
    const verificationResult = await simulateFaceMatchVerification(selfieUrl, documentPhotoUrl);

    if (verificationResult.confidenceScore > 80) {
      // Auto-approve if confidence is high
      user.verification.faceMatch.verified = true;
      user.verification.faceMatch.verifiedAt = new Date();
      user.verification.faceMatch.status = 'approved';
      user.verification.faceMatch.matchScore = verificationResult.confidenceScore;
    } else if (verificationResult.confidenceScore > 60) {
      // Send for manual review if confidence is medium
      user.verification.faceMatch.status = 'manual_review';
      user.verification.faceMatch.matchScore = verificationResult.confidenceScore;
    } else {
      // Reject if confidence is low
      user.verification.faceMatch.status = 'rejected';
      user.verification.faceMatch.matchScore = verificationResult.confidenceScore;
      user.verification.faceMatch.rejectionReason = verificationResult.reason || 'Low match score';
    }

    await user.save();

    return {
      success: true,
      status: user.verification.faceMatch.status,
      confidenceScore: verificationResult.confidenceScore,
      message: `Face match verification ${user.verification.faceMatch.status}`,
      selfieUrl
    };
  } catch (error) {
    console.error('Face match verification error:', error);
    throw error;
  }
};

/**
 * Simulate Aadhaar verification using OCR
 * @param {string} frontUrl - Front document URL
 * @param {string} backUrl - Back document URL
 * @returns {Promise<Object>} Verification result
 */
const simulateAadhaarVerification = async (frontUrl, backUrl) => {
  // In a real implementation, this would use Firebase ML Kit or Google Vision API
  // For simulation, we'll return a random confidence score and extracted data
  
  // Simulate OCR extraction and validation
  const confidenceScore = Math.floor(Math.random() * 40) + 60; // Random score between 60-100
  const aadhaarNumber = Math.random().toString().substr(2, 12); // Random 12-digit number
  
  // Simulate data extraction
  const extractedData = {
    aadhaarNumber: aadhaarNumber,
    name: 'John Doe',
    dob: '01/01/1990',
    gender: 'M',
    address: 'Sample Address, City, State',
    extractedAt: new Date()
  };

  return {
    confidenceScore,
    data: extractedData,
    reason: confidenceScore < 70 ? 'Low quality image or mismatched data' : null
  };
};

/**
 * Simulate PAN verification using OCR
 * @param {string} documentUrl - Document URL
 * @returns {Promise<Object>} Verification result
 */
const simulatePanVerification = async (documentUrl) => {
  // In a real implementation, this would use Firebase ML Kit or Google Vision API
  // For simulation, we'll return a random confidence score and extracted data
  
  // Simulate OCR extraction and validation
  const confidenceScore = Math.floor(Math.random() * 40) + 60; // Random score between 60-100
  const panNumber = 'ABCDE1234F'; // Sample PAN format
  
  // Simulate data extraction
  const extractedData = {
    panNumber: panNumber,
    name: 'John Doe',
    fatherName: 'Jane Doe',
    dob: '01/01/1990',
    extractedAt: new Date()
  };

  return {
    confidenceScore,
    panNumber,
    data: extractedData,
    reason: confidenceScore < 70 ? 'Low quality image or mismatched data' : null
  };
};

/**
 * Simulate face match verification
 * @param {string} selfieUrl - Selfie URL
 * @param {string} documentPhotoUrl - Document photo URL
 * @returns {Promise<Object>} Verification result
 */
const simulateFaceMatchVerification = async (selfieUrl, documentPhotoUrl) => {
  // In a real implementation, this would use Firebase ML Kit for face comparison
  // For simulation, we'll return a random confidence score
  
  // Simulate face matching
  const confidenceScore = Math.floor(Math.random() * 40) + 60; // Random score between 60-100

  return {
    confidenceScore,
    reason: confidenceScore < 70 ? 'Low match confidence or poor image quality' : null
  };
};

/**
 * Get user verification status
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Verification status
 */
const getUserVerificationStatus = async (userId) => {
  try {
    const user = await User.findById(userId).select('verification');
    if (!user) {
      throw new Error('User not found');
    }

    return {
      success: true,
      verification: user.verification
    };
  } catch (error) {
    console.error('Get verification status error:', error);
    throw error;
  }
};

/**
 * Update verification status manually (for admin use)
 * @param {string} userId - User ID
 * @param {string} verificationType - Type of verification (aadhaar, pan, faceMatch)
 * @param {string} status - New status (approved, rejected, manual_review)
 * @param {string} reason - Reason for status change (optional)
 * @returns {Promise<Object>} Updated verification status
 */
const updateVerificationStatus = async (userId, verificationType, status, reason = null) => {
  try {
    const validVerificationTypes = ['aadhaar', 'pan', 'faceMatch'];
    if (!validVerificationTypes.includes(verificationType)) {
      throw new Error('Invalid verification type');
    }

    const validStatuses = ['pending', 'manual_review', 'approved', 'rejected'];
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid status');
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Update verification status
    user.verification[verificationType].status = status;
    
    if (status === 'approved') {
      user.verification[verificationType].verified = true;
      user.verification[verificationType].verifiedAt = new Date();
    } else {
      user.verification[verificationType].verified = false;
      user.verification[verificationType].verifiedAt = null;
    }

    if (reason) {
      user.verification[verificationType].rejectionReason = reason;
    }

    await user.save();

    return {
      success: true,
      message: `Verification status updated to ${status}`,
      verification: user.verification[verificationType]
    };
  } catch (error) {
    console.error('Update verification status error:', error);
    throw error;
  }
};

module.exports = {
  verifyAadhaar,
  verifyPan,
  verifyFaceMatch,
  getUserVerificationStatus,
  updateVerificationStatus
};