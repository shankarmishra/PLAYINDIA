const User = require('../models/user.model');
const {
  verifyBankAccount,
  initiatePennyDrop,
  verifyPennyDropReceipt,
  getBankVerificationStatus
} = require('../services/bank.verification.service');

/**
 * Verify bank account using details
 */
exports.verifyBankAccount = async (req, res, next) => {
  try {
    const { accountNumber, ifsc, name } = req.body;
    
    if (!accountNumber || !ifsc || !name) {
      return res.status(400).json({
        success: false,
        message: 'Account number, IFSC code, and account holder name are required'
      });
    }

    const result = await verifyBankAccount(req.user._id, {
      accountNumber,
      ifsc,
      name
    });

    res.status(200).json({
      success: true,
      message: result.message,
      data: result.data
    });
  } catch (error) {
    console.error('Verify bank account error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Initiate penny drop verification
 */
exports.initiatePennyDrop = async (req, res, next) => {
  try {
    const { accountNumber, ifsc, name } = req.body;
    
    if (!accountNumber || !ifsc || !name) {
      return res.status(400).json({
        success: false,
        message: 'Account number, IFSC code, and account holder name are required'
      });
    }

    const result = await initiatePennyDrop(req.user._id, {
      accountNumber,
      ifsc,
      name
    });

    res.status(200).json({
      success: true,
      message: result.message,
      data: result.data
    });
  } catch (error) {
    console.error('Initiate penny drop error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Verify penny drop receipt
 */
exports.verifyPennyDropReceipt = async (req, res, next) => {
  try {
    const { transactionId, amount } = req.body;
    
    if (!transactionId || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Transaction ID and amount are required'
      });
    }

    const result = await verifyPennyDropReceipt(req.user._id, transactionId, amount);

    res.status(200).json({
      success: result.success,
      message: result.message,
      data: result.data
    });
  } catch (error) {
    console.error('Verify penny drop receipt error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get bank verification status
 */
exports.getBankVerificationStatus = async (req, res, next) => {
  try {
    const result = await getBankVerificationStatus(req.user._id);

    res.status(200).json({
      success: true,
      data: result.bankVerification
    });
  } catch (error) {
    console.error('Get bank verification status error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};