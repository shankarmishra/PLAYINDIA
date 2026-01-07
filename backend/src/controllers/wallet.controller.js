const Wallet = require('../models/Wallet.model');
const User = require('../models/user.model');
const Booking = require('../models/booking.model');
const Order = require('../models/order.model');

/**
 * Get user wallet balance and transaction history
 */
exports.getWalletBalance = async (req, res, next) => {
  try {
    const wallet = await Wallet.findOne({ userId: req.user.id })
      .populate('userId', 'name mobile email');

    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: 'Wallet not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        balance: wallet.balance,
        currency: wallet.currency,
        totalCredits: wallet.totalCredits,
        totalDebits: wallet.totalDebits,
        lastTransactionDate: wallet.lastTransactionDate,
        transactions: wallet.transactions.slice(0, 20) // Last 20 transactions
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Add money to wallet
 */
exports.addMoney = async (req, res, next) => {
  try {
    const { amount, paymentMethod } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount is required and must be greater than 0'
      });
    }

    const wallet = await Wallet.findOne({ userId: req.user.id });
    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: 'Wallet not found'
      });
    }

    // In a real app, you would process the payment through a payment gateway
    // For now, we'll just add the amount directly
    const newBalance = wallet.balance + amount;

    // Generate transaction ID
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    const transactionId = `TXN-${timestamp}-${random}`.toUpperCase();

    // Update wallet
    const updatedWallet = await Wallet.findOneAndUpdate(
      { userId: req.user.id },
      {
        $set: {
          balance: newBalance,
          lastTransactionDate: new Date()
        },
        $inc: {
          totalCredits: amount
        },
        $push: {
          transactions: {
            transactionId,
            type: 'credit',
            amount,
            balanceAfter: newBalance,
            category: 'wallet_recharge',
            description: `Wallet recharge via ${paymentMethod}`,
            relatedTo: 'wallet',
            paymentMethod,
            transactionDate: new Date()
          }
        }
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: {
        balance: updatedWallet.balance,
        transaction: updatedWallet.transactions[0] // Return the new transaction
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Process booking payment from wallet
 */
exports.processBookingPayment = async (req, res, next) => {
  try {
    const { bookingId, amount } = req.body;
    
    // Verify booking exists and belongs to user
    const booking = await Booking.findById(bookingId);
    if (!booking || booking.userId.toString() !== req.user.id) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found or unauthorized'
      });
    }

    // Verify wallet exists and has sufficient balance
    const wallet = await Wallet.findOne({ userId: req.user.id });
    if (!wallet || wallet.balance < amount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient wallet balance'
      });
    }

    // Process payment
    const newBalance = wallet.balance - amount;

    // Update wallet
    const updatedWallet = await Wallet.findOneAndUpdate(
      { userId: req.user.id },
      {
        $set: {
          balance: newBalance,
          lastTransactionDate: new Date()
        },
        $inc: {
          totalDebits: amount
        },
        $push: {
          transactions: {
            transactionId: `TXN-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 5)}`.toUpperCase(),
            type: 'debit',
            amount,
            balanceAfter: newBalance,
            category: 'booking_payment',
            description: `Payment for booking ${booking.bookingId}`,
            relatedTo: 'booking',
            relatedId: bookingId,
            transactionDate: new Date()
          }
        }
      },
      { new: true }
    );

    // Update booking payment status
    await Booking.findByIdAndUpdate(bookingId, {
      'payment.status': 'completed',
      'payment.amount': amount,
      'payment.transactionId': updatedWallet.transactions[0].transactionId
    });

    res.status(200).json({
      success: true,
      data: {
        balance: updatedWallet.balance,
        booking: await Booking.findById(bookingId)
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Process order payment from wallet
 */
exports.processOrderPayment = async (req, res, next) => {
  try {
    const { orderId, amount } = req.body;
    
    // Verify order exists and belongs to user
    const order = await Order.findById(orderId);
    if (!order || order.userId.toString() !== req.user.id) {
      return res.status(404).json({
        success: false,
        message: 'Order not found or unauthorized'
      });
    }

    // Verify wallet exists and has sufficient balance
    const wallet = await Wallet.findOne({ userId: req.user.id });
    if (!wallet || wallet.balance < amount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient wallet balance'
      });
    }

    // Process payment
    const newBalance = wallet.balance - amount;

    // Update wallet
    const updatedWallet = await Wallet.findOneAndUpdate(
      { userId: req.user.id },
      {
        $set: {
          balance: newBalance,
          lastTransactionDate: new Date()
        },
        $inc: {
          totalDebits: amount
        },
        $push: {
          transactions: {
            transactionId: `TXN-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 5)}`.toUpperCase(),
            type: 'debit',
            amount,
            balanceAfter: newBalance,
            category: 'order_payment',
            description: `Payment for order ${order.orderId}`,
            relatedTo: 'order',
            relatedId: orderId,
            transactionDate: new Date()
          }
        }
      },
      { new: true }
    );

    // Update order payment status
    await Order.findByIdAndUpdate(orderId, {
      'payment.status': 'completed',
      'payment.amount': amount,
      'payment.transactionId': updatedWallet.transactions[0].transactionId
    });

    res.status(200).json({
      success: true,
      data: {
        balance: updatedWallet.balance,
        order: await Order.findById(orderId)
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get wallet transaction history
 */
exports.getTransactionHistory = async (req, res, next) => {
  try {
    const { type, category, dateFrom, dateTo, limit = 20, page = 1 } = req.query;
    
    const query = { userId: req.user.id };
    
    if (type) {
      query['transactions.type'] = type;
    }
    
    if (category) {
      query['transactions.category'] = category;
    }
    
    if (dateFrom || dateTo) {
      query['transactions.transactionDate'] = {};
      if (dateFrom) query['transactions.transactionDate'].$gte = new Date(dateFrom);
      if (dateTo) query['transactions.transactionDate'].$lte = new Date(dateTo);
    }
    
    const wallet = await Wallet.findOne(query)
      .populate('userId', 'name mobile');

    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: 'Wallet not found'
      });
    }

    // Filter transactions based on query parameters
    let filteredTransactions = wallet.transactions;
    
    if (type) {
      filteredTransactions = filteredTransactions.filter(t => t.type === type);
    }
    
    if (category) {
      filteredTransactions = filteredTransactions.filter(t => t.category === category);
    }
    
    if (dateFrom || dateTo) {
      filteredTransactions = filteredTransactions.filter(t => {
        const transactionDate = new Date(t.transactionDate);
        return (
          (!dateFrom || transactionDate >= new Date(dateFrom)) &&
          (!dateTo || transactionDate <= new Date(dateTo))
        );
      });
    }
    
    // Sort by date descending
    filteredTransactions.sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate));
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);

    res.status(200).json({
      success: true,
      count: filteredTransactions.length,
      totalPages: Math.ceil(filteredTransactions.length / limit),
      currentPage: page,
      data: paginatedTransactions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Transfer money to another user
 */
exports.transferMoney = async (req, res, next) => {
  try {
    const { recipientId, amount, description } = req.body;
    
    if (!recipientId || !amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Recipient ID and amount are required and amount must be greater than 0'
      });
    }

    // Verify sender wallet exists and has sufficient balance
    const senderWallet = await Wallet.findOne({ userId: req.user.id });
    if (!senderWallet || senderWallet.balance < amount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient wallet balance'
      });
    }

    // Verify recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: 'Recipient not found'
      });
    }

    // Verify recipient wallet exists
    const recipientWallet = await Wallet.findOne({ userId: recipientId });
    if (!recipientWallet) {
      return res.status(404).json({
        success: false,
        message: 'Recipient wallet not found'
      });
    }

    // Perform the transfer
    const senderNewBalance = senderWallet.balance - amount;
    const recipientNewBalance = recipientWallet.balance + amount;

    // Generate transaction IDs
    const senderTransactionId = `TXN-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 5)}`.toUpperCase();
    const recipientTransactionId = `TXN-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 5)}`.toUpperCase();

    // Update sender wallet
    await Wallet.findOneAndUpdate(
      { userId: req.user.id },
      {
        $set: {
          balance: senderNewBalance,
          lastTransactionDate: new Date()
        },
        $inc: {
          totalDebits: amount
        },
        $push: {
          transactions: {
            transactionId: senderTransactionId,
            type: 'debit',
            amount,
            balanceAfter: senderNewBalance,
            category: 'transfer',
            description: `Transfer to ${recipient.name}: ${description}`,
            relatedTo: 'user',
            relatedId: recipientId,
            transactionDate: new Date()
          }
        }
      }
    );

    // Update recipient wallet
    await Wallet.findOneAndUpdate(
      { userId: recipientId },
      {
        $set: {
          balance: recipientNewBalance,
          lastTransactionDate: new Date()
        },
        $inc: {
          totalCredits: amount
        },
        $push: {
          transactions: {
            transactionId: recipientTransactionId,
            type: 'credit',
            amount,
            balanceAfter: recipientNewBalance,
            category: 'transfer',
            description: `Transfer from ${req.user.name}: ${description}`,
            relatedTo: 'user',
            relatedId: req.user.id,
            transactionDate: new Date()
          }
        }
      }
    );

    res.status(200).json({
      success: true,
      message: 'Transfer completed successfully',
      data: {
        senderBalance: senderNewBalance,
        recipientBalance: recipientNewBalance
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = exports;