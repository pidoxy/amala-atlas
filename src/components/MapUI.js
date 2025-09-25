// File: src/components/MapUI.js
"use client";

import { useMap } from '@vis.gl/react-google-maps';
import PlacesSearch from './PlacesSearch';

export default function MapUI({ activeFilters, onFilterChange, onPlaceSelected, totalSpots, filteredSpots, onSpotSelect }) {
  const map = useMap();

  // IMPORTANT: Don't render the UI until the map is loaded
  if (!map) {
    return null;
  }

  return (
    <div className="absolute top-4 left-4 z-10 bg-card/95 backdrop-blur-sm p-4 shadow-xl rounded-lg w-[calc(100%-2rem)] max-w-sm border border-border">
      
      {/* Unified Search Input */}
      <div className="relative">
        <label htmlFor="search-spots" className="sr-only">Search spots</label>
        <input 
          id="search-spots"
          type="text" 
          placeholder="Search spots by name, address, or location..." 
          value={activeFilters.searchQuery || ''}
          onChange={(e) => onFilterChange('searchQuery', e.target.value)}
          className="w-full pl-10 pr-10 py-2 bg-background text-foreground border border-input rounded-md focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200 placeholder:text-muted-foreground"
          aria-label="Search spots by name, address, or location"
        />
        {activeFilters.searchQuery && (
          <button
            onClick={() => onFilterChange('searchQuery', '')}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
        {/* Search icon */}
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none">
          🔍
        </div>
      </div>

      {/* Search results dropdown */}
      {activeFilters.searchQuery && filteredSpots.length > 0 && (
        <div className="mt-2 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-y-auto" aria-live="polite">
          <div className="p-2 text-xs text-muted-foreground border-b border-border">
            Found {filteredSpots.length} spot{filteredSpots.length === 1 ? '' : 's'}
          </div>
          {filteredSpots.slice(0, 10).map((spot, index) => (
            <button
              key={spot.id || index}
              onClick={() => onSpotSelect(spot)}
              className="w-full text-left p-3 hover:bg-accent hover:text-accent-foreground transition-colors border-b border-border last:border-b-0"
            >
              <div className="font-medium text-sm text-foreground truncate">
                {spot.name || 'Unnamed Spot'}
              </div>
              <div className="text-xs text-muted-foreground truncate">
                {spot.address || 'Address not available'}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500">⭐</span>
                  <span className="text-xs text-muted-foreground">
                    {spot.rating ? spot.rating.toFixed(1) : 'No rating'}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {spot.category && spot.category.length > 0 ? spot.category.join(', ') : 'Dine-in'}
                </div>
              </div>
            </button>
          ))}
          {filteredSpots.length > 10 && (
            <div className="p-2 text-xs text-muted-foreground text-center">
              ... and {filteredSpots.length - 10} more spots
            </div>
          )}
        </div>
      )}

      {/* No results message */}
      {activeFilters.searchQuery && filteredSpots.length === 0 && (
        <div className="mt-2 p-3 bg-muted/50 rounded-md" aria-live="polite">
          <div className="text-sm text-muted-foreground text-center">
            No spots found for &ldquo;{activeFilters.searchQuery}&rdquo;
          </div>
          <div className="text-xs text-muted-foreground text-center mt-1">
            💡 Try: &ldquo;Mama&apos;s Kitchen&rdquo;, &ldquo;Downtown&rdquo;, or &ldquo;Toronto&rdquo;
          </div>
        </div>
      )}

      {/* Filter status display */}
      {!activeFilters.searchQuery && (
        <div className="mt-2 p-2 bg-muted/30 rounded-md">
          <div className="text-xs text-muted-foreground">
            Showing {filteredSpots.length} of {totalSpots} spots
            {activeFilters.openNow && ' (Open Now)'}
            {activeFilters.serviceTypes.length > 0 && ` (${activeFilters.serviceTypes.join(', ')})`}
          </div>
        </div>
      )}

      {/* Places API Search - Hidden but functional for location-based searches */}
      <div className="hidden">
        <PlacesSearch onPlaceSelected={onPlaceSelected} />
      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        {/* Filter buttons with improved styling */}
        <button 
          onClick={() => onFilterChange('openNow', true)}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
            activeFilters.openNow 
              ? 'bg-primary text-primary-foreground shadow-md' 
              : 'bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground hover:shadow-sm'
          }`}
          aria-pressed={activeFilters.openNow}
        >
          {activeFilters.openNow ? '✓' : ''} Open Now
        </button>
        <button 
          onClick={() => onFilterChange('serviceType', 'dine-in')}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
            activeFilters.serviceTypes.includes('dine-in')
              ? 'bg-primary text-primary-foreground shadow-md' 
              : 'bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground hover:shadow-sm'
          }`}
          aria-pressed={activeFilters.serviceTypes.includes('dine-in')}
        >
          {activeFilters.serviceTypes.includes('dine-in') ? '✓' : ''} Dine-in
        </button>
        <button 
          onClick={() => onFilterChange('serviceType', 'takeaway')}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
            activeFilters.serviceTypes.includes('takeaway')
              ? 'bg-primary text-primary-foreground shadow-md' 
              : 'bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground hover:shadow-sm'
          }`}
          aria-pressed={activeFilters.serviceTypes.includes('takeaway')}
        >
          {activeFilters.serviceTypes.includes('takeaway') ? '✓' : ''} Takeaway
        </button>
        <button className="px-3 py-1.5 bg-secondary text-secondary-foreground rounded-md text-sm font-medium opacity-50 cursor-not-allowed">
          Price (Coming Soon)
        </button>
        <button 
          onClick={() => onFilterChange('clearAll', true)}
          className="px-3 py-1.5 bg-destructive text-destructive-foreground rounded-md text-sm font-medium hover:bg-destructive/90 transition-colors"
        >
          Clear All
        </button>
      </div>
    </div>
  );
}