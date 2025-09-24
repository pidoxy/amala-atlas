import { NextResponse } from 'next/server';
import { db } from '@/../firebase-admin.config';
import admin from 'firebase-admin';

export async function POST(request) {
    try {
        // Check if Firebase is properly initialized
        if (!db) {
            throw new Error('Firebase database not initialized. Please check your environment variables.');
        }

        const { spotId, action, mergeTargetId } = await request.json();
        
        if (!spotId || !action) {
            return NextResponse.json({ message: 'spotId and action are required' }, { status: 400 });
        }

        // Validate action before checking spot existence
        if (!['approve', 'reject', 'merge'].includes(action)) {
            return NextResponse.json({ message: 'Invalid action. Must be approve, reject, or merge' }, { status: 400 });
        }

        const pendingSpotRef = db.collection('pending_spots').doc(spotId);
        const pendingSpotDoc = await pendingSpotRef.get();

        if (!pendingSpotDoc.exists) {
            return NextResponse.json({ message: 'Spot not found' }, { status: 404 });
        }
        
        const pendingSpotData = pendingSpotDoc.data();

        if (action === 'approve') {
            await db.collection('spots').add(pendingSpotData);
            await pendingSpotRef.delete();
        } else if (action === 'reject') {
            await pendingSpotRef.delete();
        } else if (action === 'merge') {
            if (!mergeTargetId) {
                return NextResponse.json({ message: 'Merge target ID is required' }, { status: 400 });
            }
            const targetSpotRef = db.collection('spots').doc(mergeTargetId);
            
            const newSource = {
                source: pendingSpotData.source,
                source_url: pendingSpotData.source_url,
                scraped_at: pendingSpotData.scraped_at,
            };

            await targetSpotRef.update({
                sources: admin.firestore.FieldValue.arrayUnion(newSource)
            });

            await pendingSpotRef.delete();
        }

        return NextResponse.json({ message: 'Moderation successful' });
    } catch (error) {
        console.error('[API] Moderation failed:', error);
        return NextResponse.json({ 
            message: 'Moderation failed', 
            error: error.message 
        }, { status: 500 });
    }
}