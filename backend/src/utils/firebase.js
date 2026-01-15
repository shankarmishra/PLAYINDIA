const config = require('../config');
const { admin, firestore, storage, auth, initialized } = config.firebase;

/**
 * Verify Firebase ID Token
 * @param {string} idToken - Firebase ID token from client
 * @returns {Promise<Object>} Decoded token claims
 */
const verifyFirebaseToken = async (idToken) => {
  try {
    if (!initialized) {
      throw new Error('Firebase is not initialized. Please configure Firebase environment variables.');
    }
    
    if (!idToken) {
      throw new Error('No ID token provided');
    }
    
    const decodedToken = await auth.verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    console.error('Error verifying Firebase token:', error);
    throw new Error('Invalid Firebase token');
  }
};

/**
 * Upload file to Firebase Storage
 * @param {Buffer} fileBuffer - File buffer to upload
 * @param {string} fileName - Name of the file
 * @param {string} folder - Folder in Firebase Storage
 * @returns {Promise<string>} Download URL of the uploaded file
 */
const uploadFileToFirebaseStorage = async (fileBuffer, fileName, folder = 'files') => {
  try {
    if (!initialized) {
      throw new Error('Firebase is not initialized. Please configure Firebase environment variables.');
    }
    
    const bucket = storage.bucket();
    const filePath = `${folder}/${Date.now()}_${fileName}`;
    
    const file = bucket.file(filePath);
    
    await file.save(fileBuffer, {
      metadata: {
        contentType: 'application/octet-stream' // Will be auto-detected
      },
      public: true,
      gzip: true
    });
    
    // Make file publicly readable
    await file.makePublic();
    
    return `https://storage.googleapis.com/${bucket.name}/${filePath}`;
  } catch (error) {
    console.error('Error uploading file to Firebase Storage:', error);
    throw error;
  }
};

/**
 * Delete file from Firebase Storage
 * @param {string} fileUrl - URL of the file to delete
 * @returns {Promise<void>}
 */
const deleteFileFromFirebaseStorage = async (fileUrl) => {
  try {
    if (!initialized) {
      throw new Error('Firebase is not initialized. Please configure Firebase environment variables.');
    }
    
    if (!fileUrl) return;
    
    // Extract file path from URL
    const bucket = storage.bucket();
    const fileName = fileUrl.split(`${bucket.name}/`)[1];
    
    if (fileName) {
      await bucket.file(fileName).delete();
    }
  } catch (error) {
    console.error('Error deleting file from Firebase Storage:', error);
    // Don't throw error as it shouldn't break the flow
  }
};

/**
 * Send Firebase Cloud Message
 * @param {string|Array} tokens - Device token(s) or array of tokens
 * @param {Object} payload - Notification payload
 * @param {Object} options - Message options
 * @returns {Promise<Object>} Result of the message sending
 */
const sendFirebaseMessage = async (tokens, payload, options = {}) => {
  try {
    if (!initialized) {
      throw new Error('Firebase is not initialized. Please configure Firebase environment variables.');
    }
    
    const message = {
      notification: payload.notification,
      data: payload.data,
      tokens: Array.isArray(tokens) ? tokens : [tokens],
      ...options
    };
    
    const response = await admin.messaging().sendMulticast(message);
    return response;
  } catch (error) {
    console.error('Error sending Firebase message:', error);
    throw error;
  }
};

/**
 * Create a custom Firebase token for a user
 * @param {string} uid - User ID
 * @param {Object} additionalClaims - Additional claims to include in the token
 * @returns {Promise<string>} Custom token
 */
const createCustomFirebaseToken = async (uid, additionalClaims = {}) => {
  try {
    if (!initialized) {
      throw new Error('Firebase is not initialized. Please configure Firebase environment variables.');
    }
    
    const customToken = await auth.createCustomToken(uid, additionalClaims);
    return customToken;
  } catch (error) {
    console.error('Error creating custom Firebase token:', error);
    throw error;
  }
};

module.exports = {
  verifyFirebaseToken,
  uploadFileToFirebaseStorage,
  deleteFileFromFirebaseStorage,
  sendFirebaseMessage,
  createCustomFirebaseToken
};