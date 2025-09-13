// File: src/app/api/discover/route.js
import { NextResponse } from 'next/server';
import { db } from '../../../../../firebase-admin.config';
import { sources } from '../../../../scripts/sources';
import { findPotentialSpots } from '../../../../scripts/discovery-agent';
import { geocodeSpots, isWithinLagosBounds } from '../../../../scripts/geocoding';

export async function POST() {
  try {
    console.log('[API] Multi-Source Discovery triggered.');
    const allCandidatesPromises = sources.map(source => findPotentialSpots(source));
    const allCandidatesArrays = await Promise.all(allCandidatesPromises);
    const allPotentialSpots = allCandidatesArrays.flat();

    if (allPotentialSpots.length === 0) {
      return NextResponse.json({ message: 'Discovery ran, but no new spots were found.', count: 0 });
    }

    const geocodedSpots = await geocodeSpots(allPotentialSpots, 500);

    // Fetch existing names from Firestore
    const spotsPromise = db.collection('spots').select('name').get();
    const pendingSpotsPromise = db.collection('pending_spots').select('name').get();
    const [spotsSnapshot, pendingSpotsSnapshot] = await Promise.all([spotsPromise, pendingSpotsPromise]);
    const allExistingNames = [
      ...spotsSnapshot.docs.map(doc => doc.data().name.toLowerCase()),
      ...pendingSpotsSnapshot.docs.map(doc => doc.data().name.toLowerCase())
    ];
    
    const newSpots = geocodedSpots.filter(spot => !allExistingNames.includes(spot.name.toLowerCase()));
    const uniqueNewSpots = Array.from(new Set(newSpots.map(s => s.name))).map(name => newSpots.find(s => s.name === name));

    if (uniqueNewSpots.length > 0) {
      const batch = db.batch();
      uniqueNewSpots.forEach(spot => {
        const docRef = db.collection('pending_spots').doc(); // Create a new doc with a random ID
        batch.set(docRef, {
            // ... (your existing processing logic)
            name: spot.name,
            address: spot.address,
            description: spot.description || '',
            image_url: spot.image_url || '',
            rating: 0, review_count: 0, is_open: true,
            category: ['Dine-in', 'Takeaway'],
            location: spot.location || null,
            geocoded_address: spot.geocoded_address || null,
            geocoding_confidence: spot.geocoding_confidence || 0,
            geocoding_status: spot.geocoding_status || (spot.location ? 'success' : 'failed'),
            source: spot.source,
            source_url: spot.source_url,
            scraped_at: spot.scraped_at,
            status: 'pending',
            created_at: new Date().toISOString(),
        });
      });
      await batch.commit(); // Commit all new spots at once
    }
    
    return NextResponse.json({ message: `Discovery complete. Found ${uniqueNewSpots.length} new unique spots.`, count: uniqueNewSpots.length });
  } catch (error) {
    console.error('[API] Discovery failed:', error);
    return NextResponse.json({ message: 'Discovery agent failed to run.', error: error.message }, { status: 500 });
  }
}