"use client";

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import ImageUpload from './ImageUpload';

export default function ReviewForm({ spotId, onReviewSubmitted }) {
  const { data: session, status } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');

  // Handle image upload
  const handleImageSelect = async (file) => {
    if (!file) {
      setSelectedImage(null);
      setImageUrl('');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setImageUrl(result.url);
        setSelectedImage(file);
      } else {
        alert('Image upload failed. Please try again.');
      }
    } catch (error) {
      alert('Image upload failed. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!session) {
      alert('Please sign in to write a review');
      return;
    }

    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    if (reviewText.trim().length < 10) {
      alert('Please write at least 10 characters for your review');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          spot_id: spotId,
          rating: rating,
          text: reviewText.trim(),
          image_url: imageUrl || null,
        }),
      });

      if (response.ok) {
        // Reset form
        setRating(0);
        setReviewText('');
        setSelectedImage(null);
        setImageUrl('');
        
        // Notify parent component
        if (onReviewSubmitted) {
          onReviewSubmitted();
        }
        
        alert('Review submitted successfully!');
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to submit review');
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="bg-card p-6 rounded-lg border border-border">
        <div className="animate-pulse">
          <div className="h-4 bg-muted rounded w-1/4 mb-4"></div>
          <div className="h-20 bg-muted rounded mb-4"></div>
          <div className="h-10 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="bg-card p-6 rounded-lg border border-border text-center">
        <h3 className="text-lg font-semibold text-card-foreground mb-2">Write a Review</h3>
        <p className="text-muted-foreground mb-4">
          Please sign in to write a review for this spot.
        </p>
        <a 
          href="/login" 
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-colors"
        >
          Sign In
        </a>
      </div>
    );
  }

  return (
    <div className="bg-card p-6 rounded-lg border border-border">
      <h3 className="text-lg font-semibold text-card-foreground mb-4">Write a Review</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-card-foreground mb-2">
            Rating *
          </label>
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="star-rating text-2xl focus:outline-none hover:scale-110 transition-transform"
              >
                <span
                  className={`${
                    star <= (hoveredRating || rating)
                      ? 'text-yellow-400'
                      : 'text-muted-foreground'
                  }`}
                >
                  ★
                </span>
              </button>
            ))}
            <span className="ml-2 text-sm text-muted-foreground">
              {rating > 0 ? `${rating} star${rating > 1 ? 's' : ''}` : 'Select rating'}
            </span>
          </div>
        </div>

        {/* Review Text */}
        <div>
          <label htmlFor="reviewText" className="block text-sm font-medium text-card-foreground mb-2">
            Your Review *
          </label>
          <textarea
            id="reviewText"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Share your experience at this spot..."
            rows={4}
            className="w-full px-3 py-2 bg-background text-foreground border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-ring resize-vertical"
            required
          />
          <p className="text-xs text-muted-foreground mt-1">
            {reviewText.length}/500 characters (minimum 10)
          </p>
        </div>

        {/* Photo Upload */}
        <div>
          <ImageUpload
            onImageSelect={handleImageSelect}
            label="Add a Photo (Optional)"
            initialImage={selectedImage}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || rating === 0 || reviewText.trim().length < 10}
          className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-lg hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting Review...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
}
