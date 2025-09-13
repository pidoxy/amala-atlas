// File: src/app/api/discover/route.js
import { NextResponse } from 'next/server';
import { sources } from '../../../../scripts/sources'; 
import { findPotentialSpots } from '../../../../scripts/discovery-agent';
import { geocodeSpots, isWithinLagosBounds } from '../../../../scripts/geocoding';
import fs from 'fs/promises';
import path from 'path';

export async function POST() {
  try {
    console.log('[API] Multi-Source Discovery triggered.');
    
    // Run the agent on all sources in parallel
    const allCandidatesPromises = sources.map(source => findPotentialSpots(source));
    const allCandidatesArrays = await Promise.all(allCandidatesPromises);
    
    // Flatten the array of arrays into a single list
    const allPotentialSpots = allCandidatesArrays.flat();
    
    if (allPotentialSpots.length === 0) {
      return NextResponse.json({ message: 'Discovery ran, but no new spots were found.', count: 0 });
    }

    console.log(`[API] Found ${allPotentialSpots.length} potential spots, starting geocoding...`);

    // Geocode the addresses to get coordinates
    const geocodedSpots = await geocodeSpots(allPotentialSpots, 500); // 500ms delay between requests

    const dbPath = path.join(process.cwd(), 'db.json');
    const dbJson = await fs.readFile(dbPath, 'utf8');
    const db = JSON.parse(dbJson);

    // Get a unique list of all existing spot names (approved and pending)
    const allExistingNames = [...db.spots, ...db.pending_spots].map(s => s.name.toLowerCase());
    
    // Filter out spots we already know about
    const newSpots = geocodedSpots.filter(spot => 
      !allExistingNames.includes(spot.name.toLowerCase())
    );

    // Use a Set to remove any duplicates found from different articles
    const uniqueNewSpots = Array.from(new Set(newSpots.map(s => s.name)))
      .map(name => newSpots.find(s => s.name === name));

    // Separate spots with and without coordinates
    const spotsWithCoords = uniqueNewSpots.filter(spot => 
      spot.location && spot.location.lat && spot.location.lng && 
      isWithinLagosBounds(spot.location.lat, spot.location.lng)
    );
    
    const spotsWithoutCoords = uniqueNewSpots.filter(spot => 
      !spot.location || !spot.location.lat || !spot.location.lng ||
      !isWithinLagosBounds(spot.location.lat, spot.location.lng)
    );

    if (uniqueNewSpots.length > 0) {
      // Add default values for missing fields
      const processedSpots = uniqueNewSpots.map(spot => ({
        id: Date.now() + Math.random(),
        name: spot.name,
        address: spot.address,
        description: spot.description || '',
        image_url: spot.image_url || '',
        rating: 0,
        review_count: 0,
        is_open: true,
        category: ['Dine-in', 'Takeaway'],
        location: spot.location || null,
        geocoded_address: spot.geocoded_address || null,
        geocoding_confidence: spot.geocoding_confidence || 0,
        geocoding_status: spot.geocoding_status || (spot.location ? 'success' : 'failed'),
        source: spot.source,
        source_url: spot.source_url,
        scraped_at: spot.scraped_at,
        status: 'pending',
        created_at: new Date().toISOString(),
      }));

      db.pending_spots.push(...processedSpots);
      await fs.writeFile(dbPath, JSON.stringify(db, null, 2));
    }
    
    return NextResponse.json({ 
      message: `Discovery complete. Found ${uniqueNewSpots.length} new unique spots (${spotsWithCoords.length} with coordinates, ${spotsWithoutCoords.length} need manual geocoding).`, 
      count: uniqueNewSpots.length,
      with_coordinates: spotsWithCoords.length,
      without_coordinates: spotsWithoutCoords.length,
      spots: uniqueNewSpots.map(spot => ({
        name: spot.name,
        address: spot.address,
        has_coordinates: !!(spot.location && spot.location.lat && spot.location.lng),
        source: spot.source,
      }))
    });

  } catch (error) {
    console.error('[API] Discovery failed:', error);
    return NextResponse.json({ 
      message: 'Discovery agent failed to run.', 
      error: error.message 
    }, { status: 500 });
  }
}