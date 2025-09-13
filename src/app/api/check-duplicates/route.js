// File: src/app/api/check-duplicates/route.js
import { NextResponse } from 'next/server';
import { db } from '@/../firebase-admin.config';

export async function POST(request) {
  try {
    const { name } = await request.json();
    if (!name || name.trim().length < 3) {
      return NextResponse.json({ isDuplicate: false });
    }

    const searchTerm = name.toLowerCase().trim();

    // Fetch documents from both collections in parallel
    const spotsPromise = db.collection('spots').get();
    const pendingSpotsPromise = db.collection('pending_spots').get();
    const [spotsSnapshot, pendingSpotsSnapshot] = await Promise.all([spotsPromise, pendingSpotsPromise]);

    const allSpots = [
      ...spotsSnapshot.docs.map(doc => doc.data()),
      ...pendingSpotsSnapshot.docs.map(doc => doc.data())
    ];

    const potentialDuplicate = allSpots.find(spot => 
      spot.name.toLowerCase().includes(searchTerm)
    );

    if (potentialDuplicate) {
      return NextResponse.json({ 
        isDuplicate: true, 
        suggestion: potentialDuplicate.name 
      });
    }

    return NextResponse.json({ isDuplicate: false });
  } catch (error) {
    console.error('[API Check-Duplicates] Error:', error);
    return NextResponse.json({ message: 'Error checking duplicates' }, { status: 500 });
  }
}