// File: /scripts/geocoding.js
import axios from 'axios';

async function geocodeAddressGoogle(address) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: { address, key: apiKey },
      timeout: 10000,
    });

    if (res.data && res.data.status === 'OK' && res.data.results && res.data.results.length > 0) {
      const r = res.data.results[0];
      const loc = r.geometry?.location;
      if (!loc) return null;
      return {
        lat: Number(loc.lat),
        lng: Number(loc.lng),
        address: r.formatted_address,
        confidence: r.geometry?.location_type === 'ROOFTOP' ? 1 : 0.8,
        provider: 'google',
      };
    }
    return null;
  } catch (e) {
    console.error('[Geocoding][Google] Error:', e.message);
    return null;
  }
}

// Geocoding service using OpenStreetMap Nominatim (free)
export async function geocodeAddress(address) {
  // Try Google first if available
  const google = await geocodeAddressGoogle(address);
  if (google) return google;

  // Fallback to OSM Nominatim
  try {
    console.log(`[Geocoding][OSM] Looking up: ${address}`);
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: { q: `${address}`, format: 'json', limit: 1 },
      headers: { 'User-Agent': 'AmalaAtlas/1.0 (Food Discovery App)' },
      timeout: 10000,
    });

    if (response.data && response.data.length > 0) {
      const result = response.data[0];
      return {
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon),
        address: result.display_name,
        confidence: parseFloat(result.importance) || 0,
        provider: 'osm',
      };
    }
    console.log(`[Geocoding][OSM] No coordinates found for: ${address}`);
    return null;
  } catch (error) {
    console.error(`[Geocoding][OSM] Failed to geocode ${address}:`, error.message);
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
