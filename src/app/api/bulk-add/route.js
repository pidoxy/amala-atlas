// File: src/app/api/bulk-add/route.js
import { NextResponse } from 'next/server';
import { db } from '@/../firebase-admin.config'; 

export async function POST(request) {
  try {
    const { spots } = await request.json();

    if (!spots || !Array.isArray(spots)) {
      return NextResponse.json({ message: 'Invalid data format. "spots" array is required.' }, { status: 400 });
    }

    console.log(`[API] Received request to bulk-add ${spots.length} spots.`);

    // Create a batch write operation for efficiency
    const batch = db.batch();

    spots.forEach(spot => {
      // Ensure the ID is a string, which is best practice for Firestore document IDs
      const docId = String(spot.id);
      const spotRef = db.collection('spots').doc(docId);
      batch.set(spotRef, spot);
    });

    // Commit the batch
    await batch.commit();

    const successMessage = `Successfully added ${spots.length} spots to the database.`;
    console.log(`[API] ${successMessage}`);
    return NextResponse.json({ message: successMessage });

  } catch (error) {
    console.error('[API] Bulk-add failed:', error);
    return NextResponse.json({ message: 'Error adding spots to database.', error: error.message }, { status: 500 });
  }
}