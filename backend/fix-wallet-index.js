/**
 * Script to fix the duplicate key error on wallets collection
 * This script removes the problematic unique index on transactions.transactionId
 * Run this once: node fix-wallet-index.js
 */

const mongoose = require('mongoose');
const config = require('./src/config');

async function fixWalletIndex() {
  try {
    // Connect to MongoDB
    const mongoUri = config.mongoURI || process.env.MONGODB_URI || 'mongodb://localhost:27017/teamup';
    console.log('Connecting to MongoDB:', mongoUri.replace(/\/\/.*@/, '//***:***@')); // Hide credentials in log
    
    await mongoose.connect(mongoUri);
    
    console.log('Connected to MongoDB');
    
    const db = mongoose.connection.db;
    const walletsCollection = db.collection('wallets');
    
    // Get all indexes
    const indexes = await walletsCollection.indexes();
    console.log('Current indexes:', indexes);
    
    // Check if the problematic index exists
    const problematicIndex = indexes.find(
      idx => idx.name === 'transactions.transactionId_1' || 
             (idx.key && idx.key['transactions.transactionId'])
    );
    
    if (problematicIndex) {
      console.log('Found problematic index:', problematicIndex);
      
      // Drop the unique index
      try {
        await walletsCollection.dropIndex(problematicIndex.name);
        console.log(`Successfully dropped index: ${problematicIndex.name}`);
      } catch (err) {
        console.log('Error dropping index (might not exist):', err.message);
      }
    } else {
      console.log('No problematic index found');
    }
    
    // Create a sparse index instead (only indexes non-null values)
    try {
      await walletsCollection.createIndex(
        { 'transactions.transactionId': 1 },
        { 
          sparse: true,
          unique: false,
          name: 'transactions.transactionId_sparse'
        }
      );
      console.log('Created sparse index on transactions.transactionId');
    } catch (err) {
      console.log('Index might already exist or error creating:', err.message);
    }
    
    // Clean up any wallets with null transactionIds in transactions
    const result = await walletsCollection.updateMany(
      { 'transactions.transactionId': null },
      { $pull: { transactions: { transactionId: null } } }
    );
    console.log(`Cleaned up ${result.modifiedCount} wallets with null transactionIds`);
    
    console.log('Fix completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error fixing wallet index:', error);
    process.exit(1);
  }
}

// Run the fix
fixWalletIndex();
