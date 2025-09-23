# 🚀 Amala Atlas Setup Guide

This guide will help you set up and test all the new features in your Amala Atlas application.

## 📋 Prerequisites

- Node.js 18+ installed
- Firebase project set up
- Google Maps API key
- (Optional) Social media API keys for full functionality

## 🔑 Step 1: Get API Keys

### Required: Google Maps API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable these APIs:
   - Maps JavaScript API
   - Geocoding API
   - Places API (optional)
4. Create credentials → API Key
5. Restrict the key to your domain for security

### Optional: Instagram Basic Display API
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app → "Consumer" type
3. Add "Instagram Basic Display" product
4. Go to Instagram Basic Display → Basic Display
5. Create a new app
6. Get your App ID and App Secret
7. Generate a User Access Token

### Optional: Twitter API v2
1. Go to [Twitter Developer Portal](https://developer.twitter.com/)
2. Apply for a developer account (free tier available)
3. Create a new app
4. Go to "Keys and Tokens"
5. Generate "Bearer Token" (for read-only access)

### Optional: Mapbox Access Token
1. Go to [Mapbox](https://www.mapbox.com/)
2. Sign up for free account
3. Go to Account → Access Tokens
4. Create a new token with "Geocoding API" scope

## ⚙️ Step 2: Environment Setup

1. Copy the environment template:
```bash
cp env.example .env.local
```

2. Edit `.env.local` with your API keys:
```env
# Firebase Configuration (Required)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com

# Google Maps (Required)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
GOOGLE_GEOCODING_API_KEY=your-google-geocoding-key

# Social Media APIs (Optional)
INSTAGRAM_ACCESS_TOKEN=your-instagram-token
TWITTER_BEARER_TOKEN=your-twitter-bearer-token
TWITTER_CLIENT_ID=your-twitter-client-id
TWITTER_CLIENT_SECRET=your-twitter-client-secret

# Geocoding Services (Optional)
NOMINATIM_USER_AGENT=AmalaAtlas/1.0
MAPBOX_ACCESS_TOKEN=your-mapbox-token

# App Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret

# Discovery Agent Configuration
DISCOVERY_RATE_LIMIT=1000
DISCOVERY_MAX_RETRIES=3
DISCOVERY_TIMEOUT=10000

# PWA Configuration
NEXT_PUBLIC_APP_NAME=Amala Atlas
NEXT_PUBLIC_APP_DESCRIPTION=Global Food Discovery Platform
```

## 🏃‍♂️ Step 3: Install and Run

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to [http://localhost:3000](http://localhost:3000)

## 🧪 Step 4: Test the Upgrades

### Option 1: Use the Test Page (Recommended)
1. Go to [http://localhost:3000/test](http://localhost:3000/test)
2. Configure your test parameters
3. Click "Run Tests" or test individual features
4. View results in real-time

### Option 2: Use the API Endpoints
Test individual features via API:

```bash
# Test all features
curl "http://localhost:3000/api/test-scraping?test=all&query=amala&location=Lagos,Nigeria"

# Test Instagram only
curl "http://localhost:3000/api/test-scraping?test=instagram&query=jollof&location=Lagos,Nigeria"

# Test Twitter only
curl "http://localhost:3000/api/test-scraping?test=twitter&query=food&location=New%20York,USA"

# Test geocoding only
curl "http://localhost:3000/api/test-scraping?test=geocoding&location=Tokyo,Japan"
```

### Option 3: Run the Test Script
```bash
# Run comprehensive test suite
node scripts/test-upgrades.js
```

## 🔍 Step 5: Test Individual Features

### Test Geocoding
```bash
curl -X POST http://localhost:3000/api/test-scraping \
  -H "Content-Type: application/json" \
  -d '{"testType": "geocoding", "location": "Lagos, Nigeria"}'
```

### Test Instagram Scraping
```bash
curl -X POST http://localhost:3000/api/test-scraping \
  -H "Content-Type: application/json" \
  -d '{"testType": "instagram-hashtag", "query": "amala"}'
```

### Test Twitter Scraping
```bash
curl -X POST http://localhost:3000/api/test-scraping \
  -H "Content-Type: application/json" \
  -d '{"testType": "twitter-hashtag", "query": "jollof"}'
```

### Test Trending Hashtags
```bash
curl -X POST http://localhost:3000/api/test-scraping \
  -H "Content-Type: application/json" \
  -d '{"testType": "trending"}'
```

## 📊 Step 6: Monitor Performance

### Check Discovery Stats
```bash
curl http://localhost:3000/api/discover
```

### Check PWA Status
1. Open Chrome DevTools
2. Go to Application tab
3. Check Service Worker status
4. Test offline functionality

### Check Geocoding Performance
1. Go to the test page
2. Test different locations worldwide
3. Verify fallback providers work

## 🚨 Troubleshooting

### Common Issues

1. **Instagram/Twitter API Errors**
   - Check if API keys are correctly set
   - Verify rate limits aren't exceeded
   - Check if APIs are enabled

2. **Geocoding Failures**
   - Verify Google Maps API key is valid
   - Check if Geocoding API is enabled
   - Try different locations

3. **PWA Not Working**
   - Check if service worker is registered
   - Verify manifest.json is accessible
   - Test on HTTPS (required for PWA)

4. **Rate Limiting**
   - Wait between tests
   - Check rate limit status in logs
   - Use different test parameters

### Debug Mode

Enable debug logging by setting:
```env
NODE_ENV=development
DEBUG=amala-atlas:*
```

## 🎯 Expected Results

### Successful Test Results Should Show:
- ✅ Geocoding: 5/5 locations successful
- ✅ Instagram: 2/4 tests successful (depends on API access)
- ✅ Twitter: 2/3 tests successful (depends on API access)
- ✅ Deduplication: 1/1 test successful
- ✅ Discovery: 2/3 strategies successful

### Performance Benchmarks:
- Geocoding: < 2 seconds per location
- Instagram: < 5 seconds per search
- Twitter: < 3 seconds per search
- Deduplication: < 1 second for 10 spots

## 🚀 Next Steps

1. **Deploy to Production**
   - Set up production environment variables
   - Deploy to Vercel or your preferred platform
   - Configure domain and HTTPS

2. **Monitor and Optimize**
   - Set up logging and monitoring
   - Monitor API usage and costs
   - Optimize based on real usage

3. **Scale Up**
   - Add more social media platforms
   - Implement machine learning for better deduplication
   - Add more geocoding providers

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review the test results for specific errors
3. Check the browser console for client-side errors
4. Check the server logs for API errors

## 🎉 Success!

Once all tests pass, your Amala Atlas application is ready with:
- ✅ Global geocoding support
- ✅ Social media scraping
- ✅ Smart deduplication
- ✅ PWA capabilities
- ✅ Autonomous discovery
- ✅ Production-ready architecture

Happy coding! 🚀
