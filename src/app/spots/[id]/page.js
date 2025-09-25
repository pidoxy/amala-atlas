// File: src/app/spots/[id]/page.js
import Image from 'next/image';
import Link from 'next/link';
import ReviewsList from '../../../components/ReviewsList';

// This function fetches the data for a single spot
async function getSpotDetails(id) {
  // Use relative URL for production deployment
  const baseUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : process.env.NODE_ENV === 'production' 
      ? 'https://amala-atlas-oon3.vercel.app'
      : 'http://localhost:3000';
  
  const res = await fetch(`${baseUrl}/api/spots/${id}`, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
}

export default async function SpotDetailsPage({ params }) {
  const { id } = await params;
  const spot = await getSpotDetails(id);

  if (!spot) {
    return (
      <div className="bg-background min-h-screen">
        <div className="container mx-auto max-w-2xl p-4">
          <Link href="/" className="text-primary hover:underline mb-4 inline-block">&larr; Back to Map</Link>
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Spot Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The spot you&apos;re looking for doesn&apos;t exist or may have been removed.
            </p>
            <Link 
              href="/" 
              className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Back to Map
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const placeholderImage = "https://i.imgur.com/gO0wOJG.jpg";
  const coords = spot.location || spot.coordinates || null;

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto max-w-2xl p-4">
        {/* Back button */}
        <Link href="/" className="text-primary hover:underline mb-4 inline-block">&larr; Back to Map</Link>

        <div className="bg-card rounded-xl border border-border shadow-lg overflow-hidden">
          <div className="p-6">
            <h1 className="text-3xl font-bold text-center mb-4 text-card-foreground">{spot.name}</h1>
          </div>
          
          {/* Image */}
          <div className="w-full h-64 relative">
            <Image 
              src={spot.image_url || placeholderImage}
              alt={`Photo of ${spot.name}`}
              layout="fill"
              objectFit="cover"
            />
          </div>
          
          <div className="p-6 space-y-4">
            {/* Address & Hours */}
            <div className="p-4 bg-secondary rounded-lg">
              <h2 className="font-bold text-secondary-foreground mb-1">Address</h2>
              <p className="text-muted-foreground">{spot.address}</p>
            </div>
            <div className="p-4 bg-secondary rounded-lg">
              <h2 className="font-bold text-secondary-foreground mb-1">Hours</h2>
              <p className="text-muted-foreground">{spot.hours || 'Open daily, 11 AM – 10 PM'}</p>
            </div>

            {coords && typeof coords.lat === 'number' && typeof coords.lng === 'number' && (
              <div className="p-4 bg-secondary rounded-lg">
                <h2 className="font-bold text-secondary-foreground mb-1">Coordinates</h2>
                <p className="text-muted-foreground select-all">
                  {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}
                </p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-sm text-primary hover:underline"
                >
                  Open in Google Maps
                </a>
              </div>
            )}
            
            {/* Get Directions Button */}
            <a 
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(spot.address)}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="block w-full text-center bg-primary text-primary-foreground font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-all duration-200"
            >
              Get Directions
            </a>
          </div>

          {/* User Reviews Section */}
          <div className="p-6 border-t border-border">
            <h2 className="text-2xl font-bold mb-6 text-card-foreground">Reviews & Photos</h2>
            <ReviewsList spotId={spot.id} />
          </div>

        </div>
      </div>
    </div>
  );
}