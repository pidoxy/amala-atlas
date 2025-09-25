// import { NextResponse } from 'next/server';
// import fs from 'fs/promises';
// import path from 'path';

// export async function POST(request) {
//   try {
//     const newSpot = await request.json();
//     const dbPath = path.join(process.cwd(), 'db.json');
    
//     // Read the current database
//     const dbJson = await fs.readFile(dbPath, 'utf8');
//     const db = JSON.parse(dbJson);
    
//     // Add the new spot to the pending list
//     db.pending_spots.push({
//       id: Date.now(), // simple unique id
//       ...newSpot,
//     });
    
//     // Write back to the file
//     await fs.writeFile(dbPath, JSON.stringify(db, null, 2));
    
//     return NextResponse.json({ message: 'Submission successful!' }, { status: 200 });
//   } catch (error) {
//     return NextResponse.json({ message: 'Error processing submission', error: error.message }, { status: 500 });
//   }
// }

import { NextResponse } from 'next/server';
import { db } from '@/../firebase-admin.config';
import { geocodeAddress } from '@/../scripts/geocoding';

export async function POST(request) {
    try {
        const newSpot = await request.json();

        // Best-effort geocoding so the spot can appear on the map later
        let enriched = { ...newSpot };
        if (newSpot.address && (!newSpot.location || !newSpot.location.lat || !newSpot.location.lng)) {
            const coords = await geocodeAddress(newSpot.address);
            if (coords) {
                enriched = {
                    ...enriched,
                    location: { lat: coords.lat, lng: coords.lng },
                    geocoded_address: coords.address,
                    geocoding_confidence: coords.confidence,
                    geocoding_status: 'success',
                };
            } else {
                enriched = { ...enriched, geocoding_status: 'failed' };
            }
        }

        await db.collection('pending_spots').add({
            ...enriched,
            created_at: new Date().toISOString(),
        });
        return NextResponse.json({ message: 'Submission successful!' });
    } catch (e) {
        console.error('[API] submit failed:', e);
        return NextResponse.json({ message: 'Submission failed', error: e.message }, { status: 500 });
    }
}