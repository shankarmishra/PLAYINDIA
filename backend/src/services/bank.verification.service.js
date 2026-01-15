const User = require('../models/user.model');
const config = require('../config');
const axios = require('axios');

/**
 * Bank Verification Service
 * Handles automatic bank verification using Razorpay penny drop method
 */

/**
 * Verify bank account using penny drop method
 * @param {string} userId - User ID
 * @param {Object} bankDetails - Bank account details
 * @returns {Promise<Object>} Verification result
 */
const verifyBankAccount = async (userId, bankDetails) => {
  try {
    const { accountNumber, ifsc, name } = bankDetails;
    
    if (!accountNumber || !ifsc || !name) {
      throw new Error('Account number, IFSC code, and account holder name are required');
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // In a real implementation, we would use Razorpay API for penny drop verification
    // For now, we'll simulate the verification process
    const verificationResult = await simulateBankVerification(accountNumber, ifsc, name);

    // Update user bank verification status
    if (!user.verification.bank) {
      user.verification.bank = {};
    }
    
    user.verification.bank.accountNumber = accountNumber;
    user.verification.bank.ifsc = ifsc;
    user.verification.bank.name = name;

    if (verificationResult.confidenceScore > 85) {
      // Auto-approve if confidence is high
      user.verification.bank.verified = true;
      user.verification.bank.verifiedAt = new Date();
      user.verification.bank.status = 'approved';
      user.verification.bank.verificationData = verificationResult.data;
    } else if (verificationResult.confidenceScore > 60) {
      // Send for manual review if confidence is medium
      user.verification.bank.status = 'manual_review';
      user.verification.bank.verificationData = verificationResult.data;
    } else {
      // Reject if confidence is low
      user.verification.bank.status = 'rejected';
      user.verification.bank.rejectionReason = verificationResult.reason || 'Low confidence score';
    }

    await user.save();

    return {
      success: true,
      status: user.verification.bank.status,
      confidenceScore: verificationResult.confidenceScore,
      message: `Bank verification ${user.verification.bank.status}`,
      data: user.verification.bank
    };
  } catch (error) {
    console.error('Bank verification error:', error);
    throw error;
  }
};

/**
 * Simulate bank verification using penny drop
 * @param {string} accountNumber - Account number
 * @param {string} ifsc - IFSC code
 * @param {string} name - Account holder name
 * @returns {Promise<Object>} Verification result
 */
const simulateBankVerification = async (accountNumber, ifsc, name) => {
  // In a real implementation, this would use Razorpay API for actual penny drop
  // For simulation, we'll return a random confidence score and extracted data
  
  // Simulate bank verification process
  const confidenceScore = Math.floor(Math.random() * 40) + 60; // Random score between 60-100
  
  // Simulate data extraction
  const extractedData = {
    accountNumber: accountNumber,
    ifsc: ifsc,
    name: name,
    bankName: 'State Bank of India',
    branch: 'Mumbai Central',
    verifiedAt: new Date()
  };

  return {
    confidenceScore,
    data: extractedData,
    reason: confidenceScore < 70 ? 'Account details mismatch or verification failed' : null
  };
};

/**
 * Initiate penny drop verification
 * @param {string} userId - User ID
 * @param {Object} bankDetails - Bank account details
 * @returns {Promise<Object>} Penny drop initiation result
 */
const initiatePennyDrop = async (userId, bankDetails) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Validate bank details
    const { accountNumber, ifsc, name } = bankDetails;
    if (!accountNumber || !ifsc || !name) {
      throw new Error('Account number, IFSC code, and account holder name are required');
    }

    // In a real implementation, we would use Razorpay API to initiate penny drop
    // For now, we'll simulate the process
    const pennyDropResult = await simulatePennyDrop(accountNumber, ifsc, name);

    // Store pending verification details
    if (!user.verification.bank) {
      user.verification.bank = {};
    }
    user.verification.bank.pendingVerification = {
      transactionId: pennyDropResult.transactionId,
      initiatedAt: new Date(),
      amount: pennyDropResult.amount
    };

    await user.save();

    return {
      success: true,
      message: 'Penny drop initiated successfully',
      data: {
        transactionId: pennyDropResult.transactionId,
        amount: pennyDropResult.amount,
        estimatedCompletion: pennyDropResult.estimatedCompletion
      }
    };
  } catch (error) {
    console.error('Initiate penny drop error:', error);
    throw error;
  }
};

/**
 * Simulate penny drop process
 * @param {string} accountNumber - Account number
 * @param {string} ifsc - IFSC code
 * @param {string} name - Account holder name
 * @returns {Promise<Object>} Penny drop simulation result
 */
const simulatePennyDrop = async (accountNumber, ifsc, name) => {
  // In a real implementation, this would use Razorpay API
  // For simulation, we'll return a fake transaction ID and amount
  
  return {
    transactionId: `TXN_${Math.random().toString(36).substr(2, 9)}`,
    amount: 0.01, // Penny drop amount
    estimatedCompletion: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
  };
};

/**
 * Verify penny drop receipt
 * @param {string} userId - User ID
 * @param {string} transactionId - Transaction ID
 * @param {number} amount - Amount received
 * @returns {Promise<Object>} Verification result
 */
const verifyPennyDropReceipt = async (userId, transactionId, amount) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (!transactionId || !amount) {
      throw new Error('Transaction ID and amount are required');
    }

    // Check if there's a pending verification for this transaction
    if (!user.verification.bank?.pendingVerification || 
        user.verification.bank.pendingVerification.transactionId !== transactionId) {
      throw new Error('No pending verification found for this transaction');
    }

    // In a real implementation, we would verify the actual receipt
    // For now, we'll simulate the verification
    const verificationResult = await simulatePennyDropVerification(transactionId, amount);

    if (verificationResult.success) {
      // Mark bank verification as successful
      user.verification.bank.verified = true;
      user.verification.bank.verifiedAt = new Date();
      user.verification.bank.status = 'approved';
      user.verification.bank.pendingVerification = null;
    } else {
      user.verification.bank.status = 'rejected';
      user.verification.bank.pendingVerification = null;
    }

    await user.save();

    return {
      success: verificationResult.success,
      message: verificationResult.success ? 'Bank verification successful' : 'Verification failed',
      data: {
        verified: verificationResult.success,
        transactionId
      }
    };
  } catch (error) {
    console.error('Verify penny drop receipt error:', error);
    throw error;
  }
};

/**
 * Simulate penny drop verification
 * @param {string} transactionId - Transaction ID
 * @param {number} amount - Amount
 * @returns {Promise<Object>} Verification result
 */
const simulatePennyDropVerification = async (transactionId, amount) => {
  // Simulate verification success/failure
  const isSuccess = Math.random() > 0.3; // 70% success rate
  
  return {
    success: isSuccess,
    transactionId,
    amount,
    verifiedAt: new Date()
  };
};

/**
 * Get bank verification status
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Verification status
 */
const getBankVerificationStatus = async (userId) => {
  try {
    const user = await User.findById(userId).select('verification.bank');
    if (!user) {
      throw new Error('User not found');
    }

    return {
      success: true,
      bankVerification: user.verification.bank
    };
  } catch (error) {
    console.error('Get bank verification status error:', error);
    throw error;
  }
};

module.exports = {
  verifyBankAccount,
  initiatePennyDrop,
  verifyPennyDropReceipt,
  getBankVerificationStatus
};