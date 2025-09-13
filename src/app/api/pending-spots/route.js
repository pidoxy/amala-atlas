
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
    const dbPath = path.join(process.cwd(), 'db.json');
    const dbJson = await fs.readFile(dbPath, 'utf8');
    const db = JSON.parse(dbJson);
    return NextResponse.json(db.pending_spots);
}