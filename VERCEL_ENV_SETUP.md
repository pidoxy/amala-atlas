# Vercel Environment Variables Setup

⚠️ **SECURITY WARNING**: If you've seen this file before, your Firebase private key may have been exposed. Please regenerate your Firebase service account key immediately for security.

To fix the Firebase Admin initialization error, you need to set up the following environment variables in your Vercel dashboard:

## Required Environment Variables

1. **FIREBASE_PROJECT_ID**
   - Value: `amala-atlas`

2. **FIREBASE_PRIVATE_KEY**
   - Value: Copy the `private_key` value from your `amala-atlas-firebase-adminsdk.json` file
   - **IMPORTANT**: Make sure to include the `\n` characters (newlines) in the key

3. **FIREBASE_CLIENT_EMAIL**
   - Value: `firebase-adminsdk-fbsvc@amala-atlas.iam.gserviceaccount.com`

## How to Set Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Navigate to your project: `amala-atlas`
3. Go to Settings → Environment Variables
4. Add each variable above with the exact values provided
5. Make sure to set them for "Production", "Preview", and "Development" environments
6. Redeploy your application

## Additional Environment Variables (if using NextAuth)

If you're using NextAuth with Google OAuth, you'll also need:

- **GOOGLE_CLIENT_ID** - Your Google OAuth Client ID
- **GOOGLE_CLIENT_SECRET** - Your Google OAuth Client Secret  
- **NEXTAUTH_SECRET** - A random secret string for NextAuth
- **NEXTAUTH_URL** - Your Vercel app URL (e.g., `https://amala-atlas-oon3.vercel.app`)

## After Setting Environment Variables

1. The app will automatically redeploy
2. Check the Vercel function logs to see if Firebase initializes successfully
3. Test your API endpoints to ensure they're working

## ⚠️ CRITICAL: Regenerate Firebase Service Account Key

**If you've seen this file before, your private key was exposed and you MUST regenerate it:**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `amala-atlas`
3. Go to Project Settings → Service Accounts
4. Click "Generate new private key"
5. Download the new JSON file
6. Use the new `private_key` value for `FIREBASE_PRIVATE_KEY`
7. Update `FIREBASE_CLIENT_EMAIL` with the new `client_email` value

## Troubleshooting

If you still get errors after setting the environment variables:
1. Check that the private key includes the `\n` characters (newlines)
2. Verify all environment variable names match exactly
3. Check the Vercel function logs for specific error messages
