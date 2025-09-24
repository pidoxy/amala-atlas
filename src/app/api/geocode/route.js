// File: src/app/api/geocode/route.js
import { NextResponse } from 'next/server';
import { geocodeAddress, isWithinLagosBounds } from '@/../scripts/geocoding';
import fs from 'fs/promises';
import path from 'path';

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

    // Validate coordinates are within Lagos bounds
    if (!isWithinLagosBounds(coordinates.lat, coordinates.lng)) {
      return NextResponse.json({ 
        message: 'Address is outside Lagos bounds',
        success: false,
        coordinates: coordinates
      });
    }

    // Update the spot in the database
    const dbPath = path.join(process.cwd(), 'db.json');
    const dbJson = await fs.readFile(dbPath, 'utf8');
    const db = JSON.parse(dbJson);

    // Find and update the spot
    const spotIndex = db.pending_spots.findIndex(spot => spot.id === spotId);
    
    if (spotIndex === -1) {
      return NextResponse.json({ 
        message: 'Spot not found' 
      }, { status: 404 });
    }

    // Update the spot with coordinates
    db.pending_spots[spotIndex] = {
      ...db.pending_spots[spotIndex],
      location: {
        lat: coordinates.lat,
        lng: coordinates.lng,
      },
      geocoded_address: coordinates.address,
      geocoding_confidence: coordinates.confidence,
      geocoding_status: 'success',
    };

    await fs.writeFile(dbPath, JSON.stringify(db, null, 2));

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
