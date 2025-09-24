// File: /scripts/geocoding.js
import axios from 'axios';

// Geocoding service using OpenStreetMap Nominatim (free)
export async function geocodeAddress(address) {
  try {
    console.log(`[Geocoding] Looking up: ${address}`);
    
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: `${address}`,
        format: 'json',
        limit: 1,
      },
      headers: {
        'User-Agent': 'AmalaAtlas/1.0 (Food Discovery App)',
      },
      timeout: 10000,
    });

    if (response.data && response.data.length > 0) {
      const result = response.data[0];
      const coordinates = {
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon),
        address: result.display_name,
        confidence: parseFloat(result.importance) || 0,
      };
      
      console.log(`[Geocoding] Found coordinates: ${coordinates.lat}, ${coordinates.lng}`);
      return coordinates;
    }
    
    console.log(`[Geocoding] No coordinates found for: ${address}`);
    return null;
    
  } catch (error) {
    console.error(`[Geocoding] Failed to geocode ${address}:`, error.message);
    return null;
  }
}

// Batch geocoding with rate limiting
export async function geocodeSpots(spots, delayMs = 1000) {
  const geocodedSpots = [];
  
  for (let i = 0; i < spots.length; i++) {
    const spot = spots[i];
    
    // Skip if already has coordinates
    if (spot.location && spot.location.lat && spot.location.lng) {
      geocodedSpots.push(spot);
      continue;
    }
    
    const coordinates = await geocodeAddress(spot.address);
    
    if (coordinates) {
      geocodedSpots.push({
        ...spot,
        location: {
          lat: coordinates.lat,
          lng: coordinates.lng,
        },
        geocoded_address: coordinates.address,
        geocoding_confidence: coordinates.confidence,
      });
    } else {
      // Keep the spot but mark it as needing manual geocoding
      geocodedSpots.push({
        ...spot,
        location: null,
        geocoding_status: 'failed',
      });
    }
    
    // Rate limiting to avoid overwhelming the service
    if (i < spots.length - 1) {
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
  
  return geocodedSpots;
}

// Validate coordinates are within Lagos bounds
// Deprecated: bounds are now global; keeping a stub for backward-compat
export function isWithinLagosBounds() {
  return true;
}
