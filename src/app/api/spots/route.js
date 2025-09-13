// import { NextResponse } from 'next/server';
// import fs from 'fs/promises';
// import path from 'path';

// export async function GET() {
//   try {
//     const dbPath = path.join(process.cwd(), 'db.json');
//     const dbJson = await fs.readFile(dbPath, 'utf8');
//     const data = JSON.parse(dbJson);
    
//     return NextResponse.json(data.spots, { status: 200 });
//   } catch (error) {
//     return NextResponse.json({ message: 'Error fetching spots', error: error.message }, { status: 500 });
//   }
// }

import { NextResponse } from 'next/server';
import { db } from '@/../firebase-admin.config';

export async function GET() {
    const spotsSnapshot = await db.collection('spots').get();
    const spots = spotsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(spots);
}