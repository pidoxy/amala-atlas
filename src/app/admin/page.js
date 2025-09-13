
"use client";

import { useState, useEffect } from 'react';
import ThemeToggle from '../../components/ThemeToggle';

export default function AdminPage() {
  const [pendingSpots, setPendingSpots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [discoveryResult, setDiscoveryResult] = useState(null);
  const [filter, setFilter] = useState('all'); // all, with_coords, without_coords

  const fetchPendingSpots = async () => {
    setIsLoading(true);
    const res = await fetch('/api/pending-spots'); 
    const data = await res.json();
    setPendingSpots(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPendingSpots();
  }, []);

  const handleDiscover = async () => {
    setIsDiscovering(true);
    setDiscoveryResult(null);
    
    try {
      const res = await fetch('/api/discover', { method: 'POST' });
      const result = await res.json();
      setDiscoveryResult(result);
      fetchPendingSpots(); // Refresh the list after discovery
    } catch (error) {
      setDiscoveryResult({ message: 'Discovery failed: ' + error.message, count: 0 });
    } finally {
      setIsDiscovering(false);
    }
  };

  const handleModerate = async (spotId, action) => {
    await fetch('/api/moderate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ spotId, action }),
    });
    fetchPendingSpots(); // Refresh the list after moderation
  };

  const filteredSpots = pendingSpots.filter(spot => {
    if (filter === 'with_coords') return spot.location && spot.location.lat && spot.location.lng;
    if (filter === 'without_coords') return !spot.location || !spot.location.lat || !spot.location.lng;
    return true;
  });

  return (
    <div className="container mx-auto p-8 bg-background text-foreground min-h-screen">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Admin Moderation Panel</h1>
        <ThemeToggle />
      </header>
      
      {/* Discovery Section */}
      <div className="mb-8 bg-card border border-border rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-card-foreground">Discovery Agent</h2>
          <button 
            onClick={handleDiscover}
            disabled={isDiscovering}
            className="bg-primary text-primary-foreground font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            {isDiscovering ? '🔍 Discovering...' : '🚀 Run Discovery Agent'}
          </button>
        </div>
        
        {discoveryResult && (
          <div className={`p-4 rounded-lg border ${
            discoveryResult.count > 0 
              ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200' 
              : 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200'
          }`}>
            <p className="font-medium">{discoveryResult.message}</p>
            {discoveryResult.count > 0 && (
              <div className="mt-2 text-sm">
                <p>• {discoveryResult.with_coordinates || 0} spots with coordinates</p>
                <p>• {discoveryResult.without_coordinates || 0} spots need manual geocoding</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Filter and Stats */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">
          Pending Submissions ({filteredSpots.length})
        </h2>
        
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            All ({pendingSpots.length})
          </button>
          <button
            onClick={() => setFilter('with_coords')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'with_coords' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            With Coords ({pendingSpots.filter(s => s.location && s.location.lat && s.location.lng).length})
          </button>
          <button
            onClick={() => setFilter('without_coords')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'without_coords' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            Need Geocoding ({pendingSpots.filter(s => !s.location || !s.location.lat || !s.location.lng).length})
          </button>
        </div>
      </div>

      {/* Spots List */}
      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading spots...</p>
        </div>
      ) : filteredSpots.length === 0 ? (
        <div className="text-center py-12 bg-card border border-border rounded-xl">
          <p className="text-muted-foreground text-lg">No pending spots found.</p>
          <p className="text-muted-foreground text-sm mt-2">Try running the discovery agent to find new spots!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSpots.map(spot => (
            <div key={spot.id} className="bg-card border border-border rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Spot Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-bold text-card-foreground">{spot.name}</h3>
                    <div className="flex items-center gap-2">
                      {spot.location && spot.location.lat && spot.location.lng ? (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full dark:bg-green-900/20 dark:text-green-200">
                          ✓ Geocoded
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full dark:bg-yellow-900/20 dark:text-yellow-200">
                          ⚠ Needs Geocoding
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-2">{spot.address}</p>
                  
                  {spot.description && (
                    <p className="text-sm text-muted-foreground mb-3">{spot.description}</p>
                  )}
                  
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    {spot.source && (
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        Source: {spot.source}
                      </span>
                    )}
                    {spot.geocoding_confidence && (
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        Confidence: {Math.round(spot.geocoding_confidence * 100)}%
                      </span>
                    )}
                    {spot.scraped_at && (
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
                        Scraped: {new Date(spot.scraped_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-2 lg:ml-4">
                  <button 
                    onClick={() => handleModerate(spot.id, 'approve')} 
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors font-medium"
                  >
                    ✓ Approve
                  </button>
                  <button 
                    onClick={() => handleModerate(spot.id, 'reject')} 
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors font-medium"
                  >
                    ✗ Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}