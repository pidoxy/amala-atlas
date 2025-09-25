import { NextResponse } from 'next/server';
import { db } from '../../../../firebase-admin.config'; 
import { sources } from '../../../../scripts/sources';
import { findPotentialSpots } from '../../../../scripts/discovery-agent';
import { geocodeSpots } from '../../../../scripts/geocoding';

function normalizeName(name = '') {
  return (name || '')
    .toLowerCase()
    .replace(/\b(restaurant|spot|joint|canteen|grill|place)\b/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractCityToken(address = '') {
  if (!address) return '';
  const lower = address.toLowerCase();
  // pick last token after comma as a naive city/area heuristic
  const parts = lower.split(',').map(p => p.trim()).filter(Boolean);
  const candidate = parts.length > 0 ? parts[parts.length - 1] : lower;
  // keep only letters/spaces
  return candidate.replace(/[^a-z\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

async function resolveCityToken(address = '') {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey || !address) return extractCityToken(address);
  try {
    const url = new URL('https://maps.googleapis.com/maps/api/geocode/json');
    url.searchParams.set('address', address);
    url.searchParams.set('key', apiKey);
    const res = await fetch(url.toString(), { cache: 'no-store' });
    const data = await res.json();
    const comp = data?.results?.[0]?.address_components || [];
    const get = (type) => comp.find(c => c.types.includes(type))?.long_name || '';
    // Prefer locality, then sublocality, then admin area level 2/1
    const token = get('locality') || get('sublocality') || get('administrative_area_level_2') || get('administrative_area_level_1');
    return (token || extractCityToken(address)).toLowerCase().replace(/[^a-z\s]/g, ' ').replace(/\s+/g, ' ').trim();
  } catch {
    return extractCityToken(address);
  }
}

export async function POST() {
  console.log('--- [API] Discover Endpoint Triggered ---');
  
  try {
    // DEBUG: Check if Firebase Admin SDK was imported and initialized correctly
    if (!db) {
      console.error('[API] CRITICAL FAILURE: Firebase Admin `db` object is null or undefined.');
      throw new Error('Firebase database not initialized. Check server config and environment variables.');
    }
    console.log('[API] Firebase Admin connection seems OK.');
    
    // 1. DISCOVER
    const allCandidatesPromises = sources.map(source => findPotentialSpots(source));
    const allCandidatesArrays = await Promise.all(allCandidatesPromises);
    const allPotentialSpots = allCandidatesArrays.flat();
    console.log(`[API] STEP 1/5: Discovery complete. Found ${allPotentialSpots.length} raw candidates.`);

    if (allPotentialSpots.length === 0) {
      return NextResponse.json({ message: 'Discovery ran, but no new raw candidates were found.', count: 0 });
    }

    // 2. DE-DUPLICATE (including previously rejected)
    const spotsPromise = db.collection('spots').select('name').get();
    const pendingSpotsPromise = db.collection('pending_spots').select('name', 'address', 'location').get();
    const rejectedPromise = db.collection('rejected_sources').select('name', 'address').get();
    const [spotsSnapshot, pendingSpotsSnapshot, rejectedSnapshot] = await Promise.all([spotsPromise, pendingSpotsPromise, rejectedPromise]);
    
    const allExistingKeys = new Set([
      ...spotsSnapshot.docs.map(doc => {
        const d = doc.data();
        return `${normalizeName(d.name)}::${extractCityToken(d.address)}`;
      }),
      ...pendingSpotsSnapshot.docs.map(doc => {
        const d = doc.data();
        return `${normalizeName(d.name)}::${extractCityToken(d.address)}`;
      }),
      ...rejectedSnapshot.docs.map(doc => {
        const d = doc.data();
        return `${normalizeName(d.name)}::${extractCityToken(d.address)}`;
      }),
    ]);
    
    // Resolve robust city tokens for candidates (Google when available)
    const candidateCityTokens = await Promise.all(
      allPotentialSpots.map(s => resolveCityToken(s.address || ''))
    );

    const newSpots = allPotentialSpots.filter((spot, idx) => {
      const key = `${normalizeName(spot.name)}::${candidateCityTokens[idx]}`;
      return !allExistingKeys.has(key);
    });
    const duplicateCandidates = allPotentialSpots.filter((spot, idx) => {
      const key = `${normalizeName(spot.name)}::${candidateCityTokens[idx]}`;
      return allExistingKeys.has(key);
    });
    const uniqueNewSpots = Array.from(new Set(newSpots.map(s => (s.name || '').toLowerCase())))
      .map(name => newSpots.find(s => (s.name || '').toLowerCase() === name));
    console.log(`[API] STEP 2/5: De-duplication complete. Found ${uniqueNewSpots.length} unique new spots.`);

    if (uniqueNewSpots.length === 0) {
      // Mark duplicates in pending queue so moderators can quickly reject
      if (duplicateCandidates.length > 0) {
        const batch = db.batch();
        duplicateCandidates.slice(0, 50).forEach(spot => {
          const docRef = db.collection('pending_spots').doc();
          batch.set(docRef, {
            name: spot.name,
            address: spot.address || '',
            description: spot.description || '',
            image_url: spot.image_url || '',
            status: 'duplicate',
            duplicate_reason: 'already_exists',
            source: spot.source,
            source_url: spot.source_url,
            scraped_at: spot.scraped_at,
            created_at: new Date().toISOString(),
          });
        });
        await batch.commit();
      }
      return NextResponse.json({ message: 'Discovery found spots, but they already exist in the database.', count: 0, duplicates_marked: duplicateCandidates.length });
    }

    // 3. GEOCODE
    console.log(`[API] STEP 3/5: Starting geocoding for ${uniqueNewSpots.length} spots...`);
    const geocodedSpots = await geocodeSpots(uniqueNewSpots, 1100);
    console.log(`[API] STEP 4/5: Geocoding complete.`);

    // 4. LOAD
    if (geocodedSpots.length > 0) {
      const batch = db.batch();
      geocodedSpots.forEach(spot => {
        const docRef = db.collection('pending_spots').doc();
        batch.set(docRef, {
            name: spot.name,
            address: spot.address,
            description: spot.description || '',
            image_url: spot.image_url || '',
            confidence: spot.confidence || 0,
            rating: 0, 
            review_count: 0, 
            is_open: true,
            category: ['Dine-in', 'Takeaway'],
            location: spot.location || null,
            geocoded_address: spot.geocoded_address || null,
            geocoding_confidence: spot.geocoding_confidence || 0,
            geocoding_status: spot.location ? 'success' : 'failed',
            source: spot.source,
            source_url: spot.source_url,
            scraped_at: spot.scraped_at,
            status: 'pending',
            created_at: new Date().toISOString(),
        });
      });
      await batch.commit();
      console.log(`[API] STEP 5/5: Successfully loaded ${geocodedSpots.length} spots into Firestore.`);
    }
    
    const spotsWithCoords = geocodedSpots.filter(spot => spot.location && spot.location.lat).length;
    const spotsWithoutCoords = geocodedSpots.length - spotsWithCoords;
    const successMessage = `Discovery complete. Added ${geocodedSpots.length} new spots to the verification queue.`;

    return NextResponse.json({ 
      message: successMessage,
      count: geocodedSpots.length,
      with_coordinates: spotsWithCoords,
      without_coordinates: spotsWithoutCoords,
    });

  } catch (error) {
    console.error('[API] CRITICAL DISCOVERY FAILURE:', error);
    return NextResponse.json({ 
      message: 'The discovery agent failed to run.', 
      error: error.message 
    }, { status: 500 });
  }
}