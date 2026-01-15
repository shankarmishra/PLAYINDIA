const admin = require('firebase-admin');
require('dotenv').config();
 
// Initialize Firebase Admin SDK
let initialized = false;
let firestore = null;
let storage = null;
let auth = null;

// Check if all required environment variables are present
const requiredEnvVars = [
  'FIREBASE_TYPE',
  'FIREBASE_PROJECT_ID',
  'FIREBASE_PRIVATE_KEY_ID',
  'FIREBASE_PRIVATE_KEY',
  'FIREBASE_CLIENT_EMAIL',
  'FIREBASE_CLIENT_ID',
  'FIREBASE_AUTH_URI',
  'FIREBASE_TOKEN_URI',
  'FIREBASE_AUTH_PROVIDER_X509_CERT_URL',
  'FIREBASE_CLIENT_X509_CERT_URL',
  'FIREBASE_UNIVERSE_DOMAIN'
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
if (missingEnvVars.length === 0) {
  try {
    const serviceAccount = {
      type: process.env.FIREBASE_TYPE,
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      // The private key in env may contain escaped newlines ("\n"); normalize to real newlines
      private_key: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined,
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: process.env.FIREBASE_AUTH_URI,
      token_uri: process.env.FIREBASE_TOKEN_URI,
      auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
      client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
      universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN
    };
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET
    });
    
    initialized = true;
    firestore = admin.firestore();
    storage = admin.storage();
    auth = admin.auth();
    
    console.log('✅ Firebase Admin SDK initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing Firebase Admin SDK:', error.message);
  }
} else {
  console.warn('⚠️ Missing Firebase environment variables:', missingEnvVars);
  console.log('Firebase Admin SDK will not be initialized');
  
  // Create placeholder functions for when Firebase is not initialized
  const placeholderFunction = (methodName) => {
    return (...args) => {
      console.warn(`⚠️ Firebase ${methodName} called but Firebase is not initialized`);
      return Promise.reject(new Error('Firebase not initialized'));
    };
  };
  
  // Create placeholder objects
  admin.auth = () => ({
    verifyIdToken: placeholderFunction('auth.verifyIdToken'),
    createCustomToken: placeholderFunction('auth.createCustomToken')
  });
  
  firestore = {
    collection: placeholderFunction('firestore.collection')
  };
  
  storage = {
    bucket: placeholderFunction('storage.bucket')
  };
}

module.exports = {
  admin,
  firestore,
  storage,
  auth,
  initialized
};