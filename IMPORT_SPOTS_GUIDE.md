# Import Amala Spots Guide

This guide will help you import the authentic amala spots data into your Firestore database.

## Prerequisites

You need Firebase credentials to connect to your Firestore database. Choose one of these options:

### Option 1: Use Environment Variables (Recommended)

1. **Get your Firebase credentials:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your project: `amala-atlas`
   - Go to **Project Settings** → **Service Accounts**
   - Click **"Generate new private key"** (if you haven't already)
   - Download the JSON file

2. **Set up environment variables:**
   - Copy `env.example` to `.env.local`
   - Fill in the values from your downloaded JSON file:
     ```bash
     cp env.example .env.local
     ```

3. **Edit `.env.local` with your values:**
   ```env
   FIREBASE_PROJECT_ID=amala-atlas
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_ACTUAL_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@amala-atlas.iam.gserviceaccount.com
   ```

### Option 2: Use Local JSON File

1. **Replace the redacted JSON file:**
   - Download a new service account key from Firebase Console
   - Replace `amala-atlas-firebase-adminsdk.json` with the new file
   - Make sure the private key is not redacted

## Import the Spots

Once you have your Firebase credentials set up, run:

```bash
npm run import-spots
```

## What the Script Does

- ✅ **Adds 11 authentic amala spots** from Chowdeck data
- ✅ **Checks for duplicates** - won't add spots that already exist
- ✅ **Preserves all data** - ratings, reviews, images, locations, etc.
- ✅ **Safe operation** - only adds new spots, doesn't replace existing ones

## Expected Output

```
Starting import of 11 amala spots...
✅ Added: Amala Extra (F673+QCM, Ojo 102101, Lagos, Nigeria)
✅ Added: AFOLASHADE AMALA SPOT (27 Igbo Elerin Rd, Ojo, Lagos 102101, Nigeria)
...

📊 Import Summary:
✅ Added: 11 spots
⏭️  Skipped: 0 spots (already exist)
📝 Total processed: 11 spots
```

## Troubleshooting

### "Firebase private key is redacted"
- The local JSON file has a redacted key
- Either set up environment variables or replace the JSON file

### "Environment variables not found"
- Make sure you have `.env.local` file with the correct values
- Check that the private key includes `\n` characters for newlines

### "Failed to parse private key"
- Make sure the private key is properly formatted
- Check that it includes the full `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` lines

## Data Structure

The imported spots will have this structure in Firestore:
- `name`: Restaurant name
- `description`: Restaurant description
- `address`: Full address
- `location`: { lat, lng } coordinates
- `category`: Array of categories
- `price_band`: Price range (₦₦)
- `is_open`: Boolean for open/closed status
- `rating`: Average rating
- `review_count`: Number of reviews
- `image_url`: Restaurant image
- `source`: "Chowdeck"
- `external_id`: Original ID from source
- `status`: "active"
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp
