// File: firebase-admin.config.js

import admin from 'firebase-admin';

// This check prevents the app from crashing in development when the server reloads.
if (!admin.apps.length) {
  try {
    // Check if all required environment variables are present
    const requiredEnvVars = [
      'FIREBASE_PROJECT_ID',
      'FIREBASE_PRIVATE_KEY', 
      'FIREBASE_CLIENT_EMAIL'
    ];
    
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      console.error('Missing Firebase environment variables:', missingVars);
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        // Vercel stores multi-line secrets with "\\n", so we replace them with actual newlines.
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
    });
    
    console.log('Firebase Admin initialized successfully');
  } catch (error) {
    console.error('Firebase admin initialization error', error);
    // Don't throw the error to prevent the app from crashing
    // Instead, we'll handle it in the API routes
  }
}

// Export the database connection for our API routes to use.
// Add error handling for when Firebase is not initialized
export const db = admin.apps.length > 0 ? admin.firestore() : null;