import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const dbPath = path.join(process.cwd(), 'db.json');
    const dbJson = await fs.readFile(dbPath, 'utf8');
    const data = JSON.parse(dbJson);
    
    return NextResponse.json(data.spots, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching spots', error: error.message }, { status: 500 });
  }
}