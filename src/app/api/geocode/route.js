// File: src/app/api/geocode/route.js
import { NextResponse } from 'next/server';
import { geocodeAddress } from '@/../scripts/geocoding';
import { db } from '@/../firebase-admin.config';

export async function POST(request) {
  try {
    const { spotId, address } = await request.json();
    
    if (!spotId || !address) {
      return NextResponse.json({ 
        message: 'Spot ID and address are required' 
      }, { status: 400 });
    }

    console.log(`[Geocoding] Manual geocoding for spot ${spotId}: ${address}`);
    
    const coordinates = await geocodeAddress(address);
    
    if (!coordinates) {
      return NextResponse.json({ 
        message: 'Could not find coordinates for this address',
        success: false
      });
    }

    // Update Firestore pending_spots document
    const pendingRef = db.collection('pending_spots').doc(spotId);
    const doc = await pendingRef.get();
    if (!doc.exists) {
      return NextResponse.json({ message: 'Spot not found' }, { status: 404 });
    }

    await pendingRef.update({
      location: {
        lat: coordinates.lat,
        lng: coordinates.lng,
      },
      geocoded_address: coordinates.address,
      geocoding_confidence: coordinates.confidence,
      geocoding_status: 'success',
      updated_at: new Date().toISOString(),
    });

    return NextResponse.json({ 
      message: 'Spot geocoded successfully',
      success: true,
      coordinates: coordinates
    });

  } catch (error) {
    console.error('[Geocoding] Manual geocoding failed:', error);
    return NextResponse.json({ 
      message: 'Geocoding failed', 
      error: error.message 
    }, { status: 500 });
  }
}
