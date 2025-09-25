// File: src/components/Map.js
"use client";

import { Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';

export default function AmalaMap({ spots, selectedSpot, onMarkerClick }) {
  // Global default center (near Gulf of Guinea to show Africa/Europe/Americas reasonably)
  const position = { lat: 0, lng: 0 };

  // NEW: A defensive filter to ensure we only render spots with valid locations.
  const validSpots = spots.filter(spot => 
    spot.location && 
    typeof spot.location.lat === 'number' && 
    typeof spot.location.lng === 'number'
  );

  return (
      <div style={{ height: "420px", width: "100%", borderRadius: '12px', overflow: 'hidden' }} role="region" aria-label="Map showing Amala spots">
        <Map 
          defaultCenter={position} 
          defaultZoom={2} 
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
  );
}