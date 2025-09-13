
// import { NextResponse } from 'next/server';
// import fs from 'fs/promises';
// import path from 'path';

// export async function POST(request) {
//     const { spotId, action } = await request.json();
//     const dbPath = path.join(process.cwd(), 'db.json');
//     const dbJson = await fs.readFile(dbPath, 'utf8');
//     const db = JSON.parse(dbJson);

//     const spotIndex = db.pending_spots.findIndex(s => s.id === spotId);
//     if (spotIndex === -1) {
//         return NextResponse.json({ message: 'Spot not found' }, { status: 404 });
//     }

//     if (action === 'approve') {
//         const [approvedSpot] = db.pending_spots.splice(spotIndex, 1);
//         // In a real app, you'd geocode the address here to get lat/lng
//         // For the hackathon, we'll add placeholder coordinates
//         approvedSpot.location = { lat: 6.5244, lng: 3.3792 };
//         approvedSpot.is_open = true; // Default value
//         db.spots.push(approvedSpot);
//     } else if (action === 'reject') {
//         db.pending_spots.splice(spotIndex, 1);
//     }

//     await fs.writeFile(dbPath, JSON.stringify(db, null, 2));
//     return NextResponse.json({ message: 'Moderation successful' });
// }

import { NextResponse } from 'next/server';
import { db } from '@/../firebase-admin.config';

export async function POST(request) {
    const { spotId, action } = await request.json();
    const spotRef = db.collection('pending_spots').doc(spotId);
    const spotDoc = await spotRef.get();

    if (!spotDoc.exists) {
        return NextResponse.json({ message: 'Spot not found' }, { status: 404 });
    }

    if (action === 'approve') {
        const approvedSpotData = spotDoc.data();
        approvedSpotData.location = approvedSpotData.location || { lat: 6.5244, lng: 3.3792 }; // Ensure location exists
        await db.collection('spots').add(approvedSpotData);
        await spotRef.delete(); // Delete from pending
    } else if (action === 'reject') {
        await spotRef.delete(); // Delete from pending
    }

    return NextResponse.json({ message: 'Moderation successful' });
}