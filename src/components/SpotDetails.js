// File: src/components/SpotDetails.js
import Image from 'next/image'; // Next.js component for optimized images

export default function SpotDetails({ spot }) {
  // A placeholder image if the spot doesn't have one
  const placeholderImage = "https://i.imgur.com/gO0wOJG.jpg";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mt-8 p-6 bg-card border border-border rounded-xl shadow-lg">
      {/* Left side: Details */}
      <div className="space-y-4">
        <p className="text-muted-foreground text-sm font-medium">{spot.rating} stars · {spot.review_count}+ reviews</p>
        <h2 className="text-4xl font-bold text-card-foreground">{spot.name}</h2>
        <p className="text-lg text-muted-foreground leading-relaxed">{spot.description}</p>
        
        <div className="space-y-2">
          <h3 className="font-bold text-card-foreground text-lg">Address</h3>
          <p className="text-muted-foreground">{spot.address}</p>
        </div>

        <div className="space-y-2">
          <h3 className="font-bold text-card-foreground text-lg">Hours</h3>
          <p className="text-muted-foreground">Open daily, 11 AM – 10 PM</p>
        </div>

        <button className="w-full md:w-auto bg-primary text-primary-foreground font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-all duration-200 shadow-md hover:shadow-lg">
          Get Directions
        </button>
      </div>

      {/* Right side: Image */}
      <div className="w-full h-80 relative rounded-lg overflow-hidden shadow-lg">
        <Image 
          src={spot.image_url || placeholderImage}
          alt={`Photo of ${spot.name}`}
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-300 hover:scale-105"
        />
      </div>
    </div>
  );
}