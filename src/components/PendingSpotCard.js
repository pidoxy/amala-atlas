import { useState, useEffect } from 'react';

export default function PendingSpotCard({ spot, onModerate }) {
  const [duplicates, setDuplicates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showMergeOptions, setShowMergeOptions] = useState(false);

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
          <h3 className="text-xl font-bold text-card-foreground">{spot.name}</h3>
          <p className="text-muted-foreground mb-2">{spot.address}</p>
          {/* ... other spot details */}
        </div>
        
        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2 lg:ml-4">
          <button onClick={() => onModerate(spot.id, 'approve')} className="bg-green-500 text-white px-4 py-2 rounded-lg">✓ Approve</button>
          
          {/* DUPLICATE/MERGE BUTTON */}
          {isLoading ? (
            <button className="bg-gray-400 text-white px-4 py-2 rounded-lg" disabled>Checking...</button>
          ) : duplicates.length > 0 ? (
            <button onClick={() => setShowMergeOptions(!showMergeOptions)} className="bg-amber-500 text-white px-4 py-2 rounded-lg">Merge ({duplicates.length})</button>
          ) : null}
          
          <button onClick={() => onModerate(spot.id, 'reject')} className="bg-red-500 text-white px-4 py-2 rounded-lg">✗ Reject</button>
        </div>
      </div>
      
      {/* MERGE OPTIONS DROPDOWN */}
      {showMergeOptions && (
        <div className="mt-4 p-4 border-t border-border">
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