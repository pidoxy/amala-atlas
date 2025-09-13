// File: src/app/page.js
"use client";

import { useState, useEffect } from 'react';
import AmalaMap from '../components/Map';
import Link from 'next/link';
import SpotDetails from '../components/SpotDetails';
import ThemeToggle from '../components/ThemeToggle'; // Assuming you have this component

export default function HomePage() {
  const [spots, setSpots] = useState([]); // Holds the original list of all spots from the API
  const [filteredSpots, setFilteredSpots] = useState([]); // The list of spots to actually display on the map
  const [selectedSpot, setSelectedSpot] = useState(null);

  // NEW: State to manage our active filters
  const [activeFilters, setActiveFilters] = useState({
    openNow: false,
    serviceType: 'all', // can be 'all', 'dine-in', or 'takeaway'
  });

  // 1. Fetch all data once when the component first loads
  useEffect(() => {
    async function getSpots() {
      const res = await fetch('/api/spots');
      const data = await res.json();
      setSpots(data);
    }
    getSpots();
  }, []);

  // 2. NEW: This powerful effect runs whenever the filters OR the original spot list change.
  // It recalculates the `filteredSpots` list.
  useEffect(() => {
    let result = spots;

    // Apply "Open Now" filter if it's active
    if (activeFilters.openNow) {
      result = result.filter(spot => spot.is_open === true);
    }

    // Apply "Service Type" filter if it's not 'all'
    if (activeFilters.serviceType !== 'all') {
      result = result.filter(spot => 
        spot.category.map(c => c.toLowerCase()).includes(activeFilters.serviceType)
      );
    }

    setFilteredSpots(result);

    // Logic to handle the selected spot when filters change
    if (result.length > 0) {
      const isSelectedSpotStillVisible = result.find(s => s.id === selectedSpot?.id);
      setSelectedSpot(isSelectedSpotStillVisible ? selectedSpot : result[0]);
    } else {
      setSelectedSpot(null); // If no spots match, deselect everything
    }
  }, [spots, activeFilters]); // This effect depends on these values

  // 3. NEW: A handler function to update the filter state when a button is clicked
  const handleFilterChange = (filterName, value) => {
    setActiveFilters(prevFilters => {
      const currentValue = prevFilters[filterName];
      // This allows toggling: clicking an active filter deactivates it
      const newValue = currentValue === value ? (filterName === 'openNow' ? false : 'all') : value;
      return { ...prevFilters, [filterName]: newValue };
    });
  };

  return (
    <main className="container mx-auto px-4 py-8 bg-background text-foreground min-h-screen">
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-foreground">Amala Atlas</h1>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link href="/add" className="bg-primary text-primary-foreground font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-all duration-200 shadow-md hover:shadow-lg">
            + Add a Spot
          </Link>
        </div>
      </header>
      
      <div className="relative mb-6">
        {/* Search and filter section with working onClick handlers */}
        <div className="absolute top-4 left-4 z-10 bg-card/95 backdrop-blur-sm p-4 shadow-xl rounded-lg w-[calc(100%-2rem)] max-w-sm border border-border">
          <input 
            type="text" 
            placeholder="Find Amala near you" 
            className="w-full px-3 py-2 bg-background text-foreground border border-input rounded-md focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200 placeholder:text-muted-foreground"
          />
          <div className="flex flex-wrap gap-2 mt-3">
            <button 
              onClick={() => handleFilterChange('openNow', true)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 ${activeFilters.openNow ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground'}`}
            >
              Open Now
            </button>
            <button 
              onClick={() => handleFilterChange('serviceType', 'dine-in')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 ${activeFilters.serviceType === 'dine-in' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground'}`}
            >
              Dine-in
            </button>
            <button 
              onClick={() => handleFilterChange('serviceType', 'takeaway')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 ${activeFilters.serviceType === 'takeaway' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground'}`}
            >
              Takeaway
            </button>
            <button className="px-3 py-1.5 bg-secondary text-secondary-foreground rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors duration-200 opacity-50 cursor-not-allowed">
              Price
            </button>
          </div>
        </div>

        {/* The Map Component now correctly receives the FILTERED spots list */}
        <AmalaMap 
          spots={filteredSpots} 
          selectedSpot={selectedSpot}
          onMarkerClick={setSelectedSpot} 
        />
      </div>

      {/* Conditionally render details or a "not found" message */}
      {selectedSpot ? (
        <SpotDetails spot={selectedSpot} />
      ) : (
        <div className="text-center py-10">
          <h2 className="text-2xl font-bold text-neutral-700">No spots found</h2>
          <p className="text-neutral-500">Try adjusting your filters to find more great Amala!</p>
        </div>
      )}
    </main>
  );
}