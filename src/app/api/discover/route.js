import { NextResponse } from 'next/server';
import { db } from '../../../../firebase-admin.config'; 
import { sources } from '../../../../scripts/sources';
import { findPotentialSpots } from '../../../../scripts/discovery-agent';
import { geocodeSpots } from '../../../../scripts/geocoding';

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

    // 2. DE-DUPLICATE
    const spotsPromise = db.collection('spots').select('name').get();
    const pendingSpotsPromise = db.collection('pending_spots').select('name').get();
    const [spotsSnapshot, pendingSpotsSnapshot] = await Promise.all([spotsPromise, pendingSpotsPromise]);
    
    const allExistingNames = new Set([
      ...spotsSnapshot.docs.map(doc => doc.data().name.toLowerCase()),
      ...pendingSpotsSnapshot.docs.map(doc => doc.data().name.toLowerCase())
    ]);
    
    const newSpots = allPotentialSpots.filter(spot => !allExistingNames.has(spot.name.toLowerCase()));
    const uniqueNewSpots = Array.from(new Set(newSpots.map(s => s.name)))
      .map(name => newSpots.find(s => s.name === name));
    console.log(`[API] STEP 2/5: De-duplication complete. Found ${uniqueNewSpots.length} unique new spots.`);

    if (uniqueNewSpots.length === 0) {
      return NextResponse.json({ message: 'Discovery found spots, but they already exist in the database.', count: 0 });
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