// File: src/app/page.js
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import AmalaMap from '../components/Map';
import Link from 'next/link';
import SpotDetails from '../components/SpotDetails';
import ThemeToggle from '../components/ThemeToggle';
import AuthButton from '../components/AuthButton';
import { APIProvider } from '@vis.gl/react-google-maps';
import MapUI from '../components/MapUI'; // <-- IMPORT THE NEW WRAPPER

export default function HomePage() {
  const [spots, setSpots] = useState([]);
  const [filteredSpots, setFilteredSpots] = useState([]);
  const [selectedSpot, setSelectedSpot] = useState(null);

  const [activeFilters, setActiveFilters] = useState({
    openNow: false,
    serviceTypes: [], // Array of selected service types
    searchQuery: '', // Text search query
  });

  // Utility function to normalize spot data
  const normalizeSpot = (spot) => {
    return {
      ...spot,
      category: Array.isArray(spot.category) ? spot.category : 
                typeof spot.category === 'string' ? [spot.category] : 
                ['Dine-in', 'Takeaway'], // Default fallback
      name: spot.name || 'Unnamed Spot',
      address: spot.address || 'Address not available',
      description: spot.description || 'No description available',
      rating: typeof spot.rating === 'number' ? spot.rating : 0,
      review_count: typeof spot.review_count === 'number' ? spot.review_count : 0,
      is_open: typeof spot.is_open === 'boolean' ? spot.is_open : true,
      // Ensure coordinates are properly formatted
      coordinates: spot.coordinates || spot.location || null,
    };
  };

  // Fetch all data once when the component first loads
  useEffect(() => {
    async function getSpots() {
      const res = await fetch('/api/spots');
      const data = await res.json();
      const normalizedData = data.map(normalizeSpot);
      setSpots(normalizedData);
    }
    getSpots();
  }, []);

  // This effect runs whenever the filters or the original spot list change
  useEffect(() => {
    let result = spots;

    // Apply text search filter with enhanced matching
    if (activeFilters.searchQuery.trim()) {
      const query = activeFilters.searchQuery.toLowerCase().trim();
      
      // Enhanced search that includes fuzzy matching and location keywords
      result = result.filter(spot => {
        const name = (spot.name || '').toLowerCase();
        const address = (spot.address || '').toLowerCase();
        const description = spot.description ? spot.description.toLowerCase() : '';
        
        // Exact matches get highest priority
        if (name === query || address === query) return true;
        
        // Partial matches
        if (name.includes(query) || address.includes(query) || description.includes(query)) return true;
        
        // Location-based searches (common Lagos areas)
        const locationKeywords = [
          'victoria island', 'vi', 'ikoyi', 'lekki', 'ajah', 'surulere', 
          'yaba', 'ikeja', 'maryland', 'gbagada', 'magodo', 'ogba',
          'agege', 'oshodi', 'mushin', 'oshodi', 'festac', 'amowo'
        ];
        
        const isLocationSearch = locationKeywords.some(keyword => 
          query.includes(keyword) || keyword.includes(query)
        );
        
        if (isLocationSearch) {
          return address.includes(query) || 
                 locationKeywords.some(keyword => 
                   query.includes(keyword) && address.includes(keyword)
                 );
        }
        
        return false;
      });
    }

    // Apply "Open Now" filter
    if (activeFilters.openNow) {
      result = result.filter(spot => spot.is_open === true);
    }

    // Apply "Service Type" filter
    if (activeFilters.serviceTypes.length > 0) {
      result = result.filter(spot => {
        // Check if spot has any of the selected service types
        const spotCategories = spot.category.map(c => c.toLowerCase());
        return activeFilters.serviceTypes.some(selectedType => 
          spotCategories.includes(selectedType)
        );
      });
    }

    setFilteredSpots(result);

    // Logic to handle the selected spot when filters change
    if (result.length > 0) {
      const isSelectedSpotStillVisible = result.find(s => s.id === selectedSpot?.id);
      setSelectedSpot(isSelectedSpotStillVisible ? selectedSpot : result[0]);
    } else {
      setSelectedSpot(null);
    }
  }, [spots, activeFilters, selectedSpot]); // Note: selectedSpot added as dependency for robustness

  const handleFilterChange = (filterName, value) => {
    if (filterName === 'clearAll') {
      setActiveFilters({
        openNow: false,
        serviceTypes: [],
        searchQuery: '',
      });
      return;
    }
    
    if (filterName === 'serviceType') {
      setActiveFilters(prevFilters => {
        const currentServiceTypes = prevFilters.serviceTypes;
        const isSelected = currentServiceTypes.includes(value);
        
        if (isSelected) {
          // Remove the service type if it's already selected
          return {
            ...prevFilters,
            serviceTypes: currentServiceTypes.filter(type => type !== value)
          };
        } else {
          // Add the service type if it's not selected
          return {
            ...prevFilters,
            serviceTypes: [...currentServiceTypes, value]
          };
        }
      });
      return;
    }
    
    setActiveFilters(prevFilters => {
      const currentValue = prevFilters[filterName];
      const newValue = currentValue === value ? (filterName === 'openNow' ? false : '') : value;
      return { ...prevFilters, [filterName]: newValue };
    });
  };

  // Helper function to calculate distance between two coordinates
  const getDistance = (coord1, coord2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (coord2.latitude - coord1.latitude) * Math.PI / 180;
    const dLon = (coord2.longitude - coord1.longitude) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(coord1.latitude * Math.PI / 180) * Math.cos(coord2.latitude * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const handlePlaceSelected = (placeCoords) => {
    if (filteredSpots.length === 0) return; // Don't do anything if no spots are visible

    let closestSpot = null;
    let minDistance = Infinity;

    filteredSpots.forEach(spot => {
      const coords = spot.coordinates || spot.location;
      if (coords) {
        const distance = getDistance(
          { latitude: placeCoords.lat, longitude: placeCoords.lng },
          { latitude: coords.lat, longitude: coords.lng }
        );

        if (distance < minDistance) {
          minDistance = distance;
          closestSpot = spot;
        }
      }
    });

    if (closestSpot) {
      setSelectedSpot(closestSpot);
    }
  };

  const handleSpotSelect = (spot) => {
    setSelectedSpot(spot);
    // Clear search query after selection
    setActiveFilters(prev => ({ ...prev, searchQuery: '' }));
  };

  return (
    // WRAP EVERYTHING IN THE APIPROVIDER TO GIVE THE SEARCH BAR AND MAP ACCESS
    <APIProvider 
      apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY} 
      libraries={['places']}
    >
      <main className="container mx-auto px-4 py-8 bg-background text-foreground min-h-screen">
        {/* Header */}
        <header className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="relative w-8 h-8">
              <Image
                src="/logo_dark.png" // dark text logo for light mode
                alt="Amala Atlas"
                fill
                className="object-contain dark:hidden"
                priority
              />
              <Image
                src="/logo.png" // white logo for dark mode
                alt="Amala Atlas"
                fill
                className="object-contain hidden dark:block"
                priority
              />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Amala Atlas</h1>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <ThemeToggle />
            <AuthButton />
            <Link href="/add" className="bg-primary text-primary-foreground font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-all duration-200 shadow-md hover:shadow-lg whitespace-nowrap text-sm">
              + Add a Spot
            </Link>
          </div>
        </header>
        
        <div className="relative mb-6">
        <AmalaMap 
            spots={filteredSpots} 
            selectedSpot={selectedSpot}
            onMarkerClick={setSelectedSpot} 
          />
          <MapUI 
            activeFilters={activeFilters}
            onFilterChange={handleFilterChange}
            onPlaceSelected={handlePlaceSelected}
            onSpotSelect={handleSpotSelect}
            totalSpots={spots.length}
            filteredSpots={filteredSpots}
          />
        </div>

         {/* Conditionally render details or a "not found" message */}
         {selectedSpot ? (
           <SpotDetails spot={selectedSpot} />
         ) : (
           <div className="text-center py-10">
             <h2 className="text-2xl font-bold text-foreground">No spots found</h2>
             <p className="text-muted-foreground">
               {activeFilters.searchQuery 
                 ? `No spots found for "${activeFilters.searchQuery}". Try a different search term or clear the search.`
                 : "Try adjusting your filters to find more great Amala!"
               }
             </p>
             {activeFilters.searchQuery && (
               <button
                 onClick={() => setActiveFilters(prev => ({ ...prev, searchQuery: '' }))}
                 className="mt-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
               >
                 Clear Search
               </button>
             )}
           </div>
         )}
      </main>
    </APIProvider>
  );
}