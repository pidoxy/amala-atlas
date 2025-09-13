// File: firebase-admin.config.js

import admin from 'firebase-admin';

// This check prevents the app from crashing in development when the server reloads.
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        // Vercel stores multi-line secrets with "\\n", so we replace them with actual newlines.
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
    });
  } catch (error) {
    console.error('Firebase admin initialization error', error.stack);
  }
}

// Export the database connection for our API routes to use.
export const db = admin.firestore();