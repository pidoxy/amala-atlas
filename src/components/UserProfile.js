"use client";

import { signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';

export default function UserProfile({ user, reviews, stats }) {
  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-card rounded-xl border border-border shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Image
              src={user.image || '/default-avatar.png'}
              alt={user.name}
              width={64}
              height={64}
              className="rounded-full"
            />
            <div>
              <h1 className="text-2xl font-bold text-card-foreground">{user.name}</h1>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-card rounded-lg border border-border p-4 text-center">
          <div className="text-2xl font-bold text-primary">{stats.totalReviews}</div>
          <div className="text-sm text-muted-foreground">Reviews Written</div>
        </div>
        <div className="bg-card rounded-lg border border-border p-4 text-center">
          <div className="text-2xl font-bold text-green-500">{stats.totalLikes}</div>
          <div className="text-sm text-muted-foreground">Likes Received</div>
        </div>
        <div className="bg-card rounded-lg border border-border p-4 text-center">
          <div className="text-2xl font-bold text-amber-500">{stats.averageRating}</div>
          <div className="text-sm text-muted-foreground">Average Rating</div>
        </div>
        <div className="bg-card rounded-lg border border-border p-4 text-center">
          <div className="text-2xl font-bold text-blue-500">{stats.helpfulScore}</div>
          <div className="text-sm text-muted-foreground">Helpful Score</div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-card rounded-xl border border-border shadow-lg p-6">
        <h2 className="text-xl font-bold text-card-foreground mb-4">My Reviews</h2>
        
        {reviews.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-lg font-semibold text-card-foreground mb-2">No Reviews Yet</h3>
            <p className="text-muted-foreground mb-4">
              Start exploring spots and share your experiences!
            </p>
            <Link 
              href="/"
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Explore Spots
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="border border-border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Link 
                      href={`/spots/${review.spotId}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {review.spot?.name || 'Unknown Spot'}
                    </Link>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/reviews/${review.id}/edit`}
                      className="text-xs text-primary hover:underline"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
                
                <div className="flex items-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <span 
                      key={i} 
                      className={`text-lg ${i < review.rating ? 'text-amber-400' : 'text-muted-foreground'}`}
                    >
                      ★
                    </span>
                  ))}
                  <span className="ml-2 text-sm text-muted-foreground">
                    ({review.rating}/5)
                  </span>
                </div>
                
                <p className="text-muted-foreground text-sm leading-relaxed mb-2">
                  {review.text}
                </p>
                
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    👍 {review.likes || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    👎 {review.dislikes || 0}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
