import { NextResponse } from 'next/server';
import { db } from '@/../firebase-admin.config';
import { geocodeAddress } from '@/../scripts/geocoding';

export async function POST() {
  try {
    const snapshot = await db.collection('pending_spots').get();
    const updates = [];

    for (const doc of snapshot.docs) {
      const spot = { id: doc.id, ...doc.data() };
      const hasCoords = spot.location && typeof spot.location.lat === 'number' && typeof spot.location.lng === 'number';
      if (hasCoords || !spot.address) continue;

      const coords = await geocodeAddress(spot.address);
      if (coords) {
        updates.push(
          db.collection('pending_spots').doc(spot.id).update({
            location: { lat: coords.lat, lng: coords.lng },
            geocoded_address: coords.address,
            geocoding_confidence: coords.confidence,
            geocoding_status: 'success',
            updated_at: new Date().toISOString(),
          })
        );
      }
    }

    await Promise.all(updates);
    return NextResponse.json({ message: 'Geocoded missing spots', updated: updates.length });
  } catch (e) {
    console.error('[API] geocode-missing failed:', e);
    return NextResponse.json({ message: 'Failed to geocode missing spots', error: e.message }, { status: 500 });
  }
}


