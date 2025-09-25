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
            // Record the rejection so discovery doesn't resurface the same junk again
            const rejectionRecord = {
                name: pendingSpotData.name || '',
                address: pendingSpotData.address || '',
                source: pendingSpotData.source || '',
                source_url: pendingSpotData.source_url || '',
                reason: 'moderator_reject',
                created_at: new Date().toISOString(),
            };
            try {
                await db.collection('rejected_sources').add(rejectionRecord);
            } catch (e) {
                console.error('[API] Failed to record rejection:', e);
            }
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

            const mergeEvent = {
                originalName: pendingSpotData.name,
                source: pendingSpotData.source,
                source_url: pendingSpotData.source_url,
                merged_at: new Date().toISOString(),
            };

            await targetSpotRef.update({
                sources: admin.firestore.FieldValue.arrayUnion(newSource),
                mergeHistory: admin.firestore.FieldValue.arrayUnion(mergeEvent),
                updated_at: new Date().toISOString(),
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