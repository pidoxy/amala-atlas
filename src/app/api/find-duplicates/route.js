// File: src/app/api/find-duplicates/route.js
import { NextResponse } from 'next/server';
import { db } from '@/../firebase-admin.config';

const areNamesSimilar = (name1, name2) => {
  const n1 = name1.toLowerCase().replace(/[^a-z0-9]/g, '');
  const n2 = name2.toLowerCase().replace(/[^a-z0-9]/g, '');
  return n1.includes(n2) || n2.includes(n1);
};

export async function POST(request) {
  try {
    const { pendingSpotName } = await request.json();

    if (!pendingSpotName) {
      return NextResponse.json({ duplicates: [] });
    }

    const spotsSnapshot = await db.collection('spots').get();
    const allSpots = spotsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const duplicates = allSpots.filter(spot => areNamesSimilar(spot.name, pendingSpotName));
    
    // We only need the name and ID for the UI
    const result = duplicates.map(d => ({ id: d.id, name: d.name }));

    return NextResponse.json({ duplicates: result });

  } catch (error) {
    console.error('[API] Find duplicates failed:', error);
    return NextResponse.json({ duplicates: [] }, { status: 500 });
  }
}