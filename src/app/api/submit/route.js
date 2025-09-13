import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request) {
  try {
    const newSpot = await request.json();
    const dbPath = path.join(process.cwd(), 'db.json');
    
    // Read the current database
    const dbJson = await fs.readFile(dbPath, 'utf8');
    const db = JSON.parse(dbJson);
    
    // Add the new spot to the pending list
    db.pending_spots.push({
      id: Date.now(), // simple unique id
      ...newSpot,
    });
    
    // Write back to the file
    await fs.writeFile(dbPath, JSON.stringify(db, null, 2));
    
    return NextResponse.json({ message: 'Submission successful!' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error processing submission', error: error.message }, { status: 500 });
  }
}