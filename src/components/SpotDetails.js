// File: src/components/SpotDetails.js
import Image from 'next/image';
import Link from 'next/link'; // We still need Link for the "View Details" button

export default function SpotDetails({ spot }) {
  const placeholderImage = "https://i.imgur.com/gO0wOJG.jpg";

  // This function is now only for the "Get Directions" button
  const handleGetDirections = () => {
    if (!spot || !spot.address) return;
    const encodedAddress = encodeURIComponent(spot.address);
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
    window.open(googleMapsUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    // The main container is no longer a Link. It's just a div.
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mt-8 p-4 bg-card border border-border rounded-lg shadow-lg">
      
      {/* Left side: Details */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <span 
                key={i} 
                className={`text-lg ${i < (spot.rating || 0) ? 'text-amber-400' : 'text-muted-foreground'}`}
              >
                ★
              </span>
            ))}
          </div>
          <span className="text-muted-foreground text-sm">
            {spot.rating ? `${spot.rating.toFixed(1)}` : 'No rating'} · {spot.review_count || 0} reviews
          </span>
        </div>
        
        <h2 className="text-4xl font-bold my-2 text-card-foreground">{spot.name}</h2>
        <p className="text-lg text-muted-foreground mb-4">
          {spot.description || 'No description available.'}
        </p>
        
        <div className="mb-4">
          <h3 className="font-bold text-card-foreground mb-1">Address</h3>
          <p className="text-muted-foreground">{spot.address || 'Address not available'}</p>
        </div>

        <div className="mb-6">
          <h3 className="font-bold text-card-foreground mb-1">Hours</h3>
          <p className="text-muted-foreground">{spot.hours || 'Hours not specified'}</p>
        </div>

        {/* NEW: A container for our two clear action buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          {/* Button 1: View Details (uses Link for fast navigation) */}
          <Link 
            href={`/spots/${spot.id}`} 
            className="w-full text-center bg-primary text-primary-foreground font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity"
          >
            View Details & Reviews
          </Link>
          
          {/* Button 2: Get Directions (uses a standard button) */}
          <button 
            onClick={handleGetDirections}
            className="w-full bg-secondary text-secondary-foreground font-bold py-3 px-6 rounded-lg hover:bg-accent transition-colors"
          >
            Get Directions
          </button>
        </div>
      </div>
      
      {/* Right side: Image */}
      <div className="w-full h-80 relative rounded-lg overflow-hidden">
        <Image 
          src={spot.image_url || placeholderImage}
          alt={`Photo of ${spot.name}`}
          layout="fill"
          objectFit="cover"
        />
      </div>
    </div>
  );
}