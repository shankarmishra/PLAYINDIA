const express = require('express');
const { authenticate } = require('../middleware/auth.middleware');
const { 
  verifyBankAccount,
  initiatePennyDrop,
  verifyPennyDropReceipt,
  getBankVerificationStatus
} = require('../controllers/bank.verification.controller');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Bank verification routes
router.get('/status', getBankVerificationStatus);
router.post('/verify', verifyBankAccount);
router.post('/penny-drop/initiate', initiatePennyDrop);
router.post('/penny-drop/verify', verifyPennyDropReceipt);

module.exports = router;