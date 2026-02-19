const express = require('express');
const router = express.Router();
const { authenticate: protect } = require('../middleware/auth.middleware');
const {
    getWalletBalance,
    addMoney,
    getTransactionHistory,
    transferMoney,
    processBookingPayment,
    processOrderPayment
} = require('../controllers/wallet.controller');

// All wallet routes are protected
router.use(protect);

router.get('/balance', getWalletBalance);
router.post('/add', addMoney);
router.get('/transactions', getTransactionHistory);
router.post('/transfer', transferMoney);
router.post('/booking/:bookingId', processBookingPayment);
router.post('/order/:orderId', processOrderPayment);

module.exports = router;
