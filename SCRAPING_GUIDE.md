# Amala Atlas Web Scraping Guide

This guide explains how to use the web scraping system to discover new Amala spots from articles around the web.

## 🚀 Quick Start

### Manual Discovery
1. Go to `/admin` in your browser
2. Click "🚀 Run Discovery Agent" 
3. Wait for the scraping to complete
4. Review and moderate the discovered spots

### Automated Discovery
The system can automatically discover new spots daily at 9 AM UTC via Vercel Cron.

## 📊 How It Works

### 1. Source Configuration
Sources are defined in `scripts/sources.js`. Each source includes:
- **name**: Display name for the source
- **url**: Article URL to scrape
- **scraperConfig**: CSS selectors for data extraction
  - `container`: Main content area selector
  - `nameSelector`: Selector for restaurant names
  - `addressSelector`: Selector for addresses

### 2. Data Extraction
The discovery agent (`scripts/discovery-agent.js`):
- Fetches web pages with retry logic and proper headers
- Uses multiple strategies to find restaurant names and addresses
- Extracts additional data like descriptions and images
- Handles various website structures automatically

### 3. Geocoding
The geocoding system (`scripts/geocoding.js`):
- Converts addresses to GPS coordinates using OpenStreetMap Nominatim
- Validates coordinates are within Lagos bounds
- Includes confidence scoring for geocoding accuracy

### 4. Data Processing
The discovery API (`src/app/api/discover/route.js`):
- Removes duplicate spots across sources
- Filters out already-known spots
- Adds default values for missing fields
- Saves spots to pending approval queue

## 🛠️ Configuration

### Adding New Sources
Edit `scripts/sources.js` to add new sources:

```javascript
{
  name: 'NewSource',
  url: 'https://example.com/amala-spots',
  scraperConfig: {
    container: '.article-content',
    nameSelector: 'h3',
    addressSelector: 'p',
  }
}
```

### Adjusting Scraping Behavior
- **Retry Logic**: Modify `maxRetries` in `fetchWithRetry()`
- **Rate Limiting**: Adjust `delayMs` in `geocodeSpots()`
- **Timeout**: Change `timeout` in axios requests

## 📈 Monitoring

### Admin Panel Features
- **Real-time Discovery**: Run scraping on demand
- **Filter Views**: Filter by geocoding status
- **Detailed Info**: View source, confidence, and metadata
- **Batch Actions**: Approve/reject multiple spots

### Discovery Results
The system provides detailed feedback:
- Total spots found
- Spots with coordinates vs. needing geocoding
- Source attribution
- Error handling and logging

## 🔧 API Endpoints

### Manual Discovery
```
POST /api/discover
```
Runs the discovery agent immediately.

### Scheduled Discovery
```
GET /api/cron/discover
```
Called by cron services for automated discovery.

### Manual Geocoding
```
POST /api/geocode
Body: { spotId: "123", address: "Lagos address" }
```
Manually geocode a specific spot.

### Pending Spots
```
GET /api/pending-spots
```
Retrieve all pending spots for moderation.

## 🚨 Troubleshooting

### Common Issues

1. **No spots found**
   - Check if sources are accessible
   - Verify CSS selectors are correct
   - Check browser developer tools for page structure changes

2. **Geocoding failures**
   - Addresses might be too vague
   - Try manual geocoding with more specific addresses
   - Check if addresses are actually in Lagos

3. **Rate limiting**
   - Increase delays between requests
   - Use different geocoding services
   - Implement IP rotation

### Debugging
- Check browser console for detailed logs
- Review server logs for API errors
- Test individual sources manually

## 📝 Best Practices

1. **Source Quality**: Choose reliable, well-structured sources
2. **Selector Accuracy**: Test selectors before adding sources
3. **Rate Limiting**: Respect website terms of service
4. **Data Validation**: Always review discovered spots before approval
5. **Error Handling**: Monitor and fix failing sources promptly

## 🔄 Maintenance

### Regular Tasks
- Review and update source URLs
- Test selectors when websites change
- Monitor geocoding success rates
- Clean up old pending spots

### Performance Optimization
- Implement caching for frequently accessed sources
- Use database instead of JSON file for production
- Add more sophisticated duplicate detection
- Implement machine learning for better data extraction

## 📊 Analytics

Track scraping performance:
- Success rates per source
- Geocoding accuracy
- Discovery frequency
- Data quality metrics

This system is designed to be robust, scalable, and maintainable for discovering new Amala spots across the web!
