// File: src/components/Map.js
"use client";

import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';

export default function AmalaMap({ spots, selectedSpot, onMarkerClick }) {
  const position = { lat: 6.5244, lng: 3.3792 }; // Center of Lagos

  // NEW: A defensive filter to ensure we only render spots with valid locations.
  const validSpots = spots.filter(spot => 
    spot.location && 
    typeof spot.location.lat === 'number' && 
    typeof spot.location.lng === 'number'
  );

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
      <div style={{ height: "60vh", width: "100%", borderRadius: '12px', overflow: 'hidden' }}>
        <Map 
          defaultCenter={position} 
          defaultZoom={12} 
          mapId="amala-map-id"
          gestureHandling={'greedy'}
          disableDefaultUI={true}
        >
          {/* We now map over the CLEANED list of validSpots */}
          {validSpots.map((spot) => (
            <AdvancedMarker 
              key={spot.id} 
              position={spot.location}
              onClick={() => onMarkerClick(spot)}
            >
              <Pin 
                background={selectedSpot?.id === spot.id ? '#ea580c' : '#4f46e5'}
                borderColor={selectedSpot?.id === spot.id ? '#c2410c' : '#3730a3'}
                glyphColor={'#fff'}
              />
            </AdvancedMarker>
          ))}
        </Map>
      </div>
    </APIProvider>
  );
}