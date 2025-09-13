"use client";

import { useState, useEffect } from 'react';
import ReviewCard from './ReviewCard';
import ReviewForm from './ReviewForm';

export default function ReviewsList({ spotId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/reviews?spot_id=${spotId}`);
      
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      } else {
        setError('Failed to load reviews');
      }
    } catch (err) {
      setError('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [spotId]);

  const handleReviewSubmitted = () => {
    // Refresh reviews when a new one is submitted
    fetchReviews();
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-card border border-border rounded-lg p-4 animate-pulse">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-muted rounded-full"></div>
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-muted rounded w-1/4"></div>
                <div className="h-3 bg-muted rounded w-1/6"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 bg-card border border-border rounded-lg">
        <div className="text-4xl mb-4">⚠️</div>
        <h3 className="text-lg font-semibold text-card-foreground mb-2">Error Loading Reviews</h3>
        <p className="text-muted-foreground text-sm mb-4">{error}</p>
        <button 
          onClick={fetchReviews}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Review Form */}
      <ReviewForm spotId={spotId} onReviewSubmitted={handleReviewSubmitted} />
      
      {/* Reviews List */}
      <div>
        <h3 className="text-xl font-semibold text-card-foreground mb-4">
          Reviews ({reviews.length})
        </h3>
        
        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-card border border-border rounded-lg">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-lg font-semibold text-card-foreground mb-2">No Reviews Yet</h3>
            <p className="text-muted-foreground text-sm">
              Be the first to share your experience!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
