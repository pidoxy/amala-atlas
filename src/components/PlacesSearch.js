// File: src/components/PlacesSearch.js
"use client";

import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import { useMap } from '@vis.gl/react-google-maps';

export default function PlacesSearch({ onPlaceSelected }) {
  const map = useMap(); // This will now work reliably

  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: { componentRestrictions: { country: 'ng' } },
    debounce: 300,
  });

  const handleSelect = async (address) => {
    setValue(address, false);
    clearSuggestions();

    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      
      if(map) {
        map.panTo({ lat, lng });
        map.setZoom(14);
      }
      
      if (onPlaceSelected) {
        onPlaceSelected({ lat, lng });
      }
    } catch (error) {
      console.error('Error geocoding selected place:', error);
    }
  };

  return (
    <div className="relative">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={!ready}
        placeholder="Find Amala near you"
        className="w-full px-3 py-2 bg-background text-foreground border border-input rounded-md focus:ring-2 focus:ring-ring"
      />
      {status === 'OK' && (
        <ul className="absolute z-10 w-full bg-card border border-border rounded-md shadow-lg mt-1">
          {data.map(({ place_id, description }) => (
            <li key={place_id} onClick={() => handleSelect(description)} className="px-4 py-2 cursor-pointer hover:bg-accent">
              {description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}