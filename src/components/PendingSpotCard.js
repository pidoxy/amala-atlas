import { useState, useEffect } from 'react';

export default function PendingSpotCard({ spot, onModerate }) {
  const [duplicates, setDuplicates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showMergeOptions, setShowMergeOptions] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);

  useEffect(() => {
    async function findDuplicates() {
      const res = await fetch('/api/find-duplicates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pendingSpotName: spot.name }),
      });
      const data = await res.json();
      setDuplicates(data.duplicates);
      setIsLoading(false);
    }
    findDuplicates();
  }, [spot.name]);

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Spot Info */}
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="text-xl font-bold text-card-foreground">{spot.name}</h3>
            {typeof spot.confidence === 'number' && (
              <span className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-600 text-white">Confidence: {Math.round(spot.confidence)}%</span>
            )}
            {spot.source_url && (
              <a href={spot.source_url} target="_blank" rel="noreferrer" className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground underline">Open source</a>
            )}
          </div>
          <p className="text-muted-foreground mb-2">{spot.address}</p>
          {spot.geocoding_status === 'failed' && (
            <p className="text-xs text-amber-600">Geocoding failed. Try manual re-geocode.</p>
          )}
          {/* ... other spot details */}
        </div>
        
        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2 lg:ml-4">
          <button onClick={() => onModerate(spot.id, 'approve')} className="bg-green-500 text-white px-4 py-2 rounded-lg" aria-label={`Approve ${spot.name}`}>✓ Approve</button>
          
          {/* DUPLICATE/MERGE BUTTON */}
          {isLoading ? (
            <button className="bg-gray-400 text-white px-4 py-2 rounded-lg" disabled>Checking...</button>
          ) : duplicates.length > 0 ? (
            <button onClick={() => setShowMergeOptions(!showMergeOptions)} className="bg-amber-500 text-white px-4 py-2 rounded-lg" aria-expanded={showMergeOptions} aria-controls={`merge-options-${spot.id}`}>Merge ({duplicates.length})</button>
          ) : null}
          
          <button onClick={() => onModerate(spot.id, 'reject')} className="bg-red-500 text-white px-4 py-2 rounded-lg" aria-label={`Reject ${spot.name}`}>✗ Reject</button>
          {spot.geocoding_status === 'failed' && (
            <button
              onClick={async () => {
                const manualAddress = window.prompt('Enter an address to geocode:', spot.address || '');
                if (!manualAddress) return;
                try {
                  setIsGeocoding(true);
                  const res = await fetch('/api/geocode', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ spotId: spot.id, address: manualAddress })
                  });
                  const data = await res.json();
                  if (!res.ok || !data.success) {
                    alert(data.message || 'Geocoding failed');
                  } else {
                    alert('Geocoding updated');
                  }
                } catch (e) {
                  alert('Error geocoding: ' + e.message);
                } finally {
                  setIsGeocoding(false);
                }
              }}
              disabled={isGeocoding}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-60"
            >
              {isGeocoding ? 'Geocoding...' : 'Re-geocode'}
            </button>
          )}
        </div>
      </div>
      
      {/* MERGE OPTIONS DROPDOWN */}
      {showMergeOptions && (
        <div id={`merge-options-${spot.id}`} className="mt-4 p-4 border-t border-border" role="region" aria-label="Merge options">
          <h4 className="font-bold mb-2">Select a spot to merge with:</h4>
          <div className="space-y-2">
            {duplicates.map(dup => (
              <div key={dup.id} className="flex justify-between items-center bg-secondary p-2 rounded-md">
                <span>{dup.name}</span>
                <button onClick={() => { onModerate(spot.id, 'merge', dup.id); setShowMergeOptions(false); }} className="bg-blue-500 text-white text-sm px-3 py-1 rounded">Merge into this</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}