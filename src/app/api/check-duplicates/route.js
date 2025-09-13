import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request) {
  try {
    const { name } = await request.json();

    if (!name || name.trim().length < 3) {
      // Don't check if the name is too short
      return NextResponse.json({ isDuplicate: false, message: 'Name too short' });
    }

    const dbPath = path.join(process.cwd(), 'db.json');
    const dbJson = await fs.readFile(dbPath, 'utf8');
    const db = JSON.parse(dbJson);

    // Combine both approved and pending spots into one list for a thorough check
    const allSpots = [...db.spots, ...db.pending_spots];

    const searchTerm = name.toLowerCase().trim();

    // Find the first spot that has a similar name
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
    return NextResponse.json({ message: 'Error checking duplicates', error: error.message }, { status: 500 });
  }
}