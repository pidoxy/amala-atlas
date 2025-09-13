"use client";

import Image from 'next/image';
import { useState } from 'react';

export default function ReviewCard({ review }) {
  const [isHelpful, setIsHelpful] = useState(false);
  const [helpfulCount, setHelpfulCount] = useState(review.helpful_count || 0);

  const handleHelpful = async () => {
    if (isHelpful) return; // Prevent multiple clicks

    try {
      const response = await fetch(`/api/reviews/${review.id}/helpful`, {
        method: 'POST',
      });

      if (response.ok) {
        setIsHelpful(true);
        setHelpfulCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error marking review as helpful:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return 'Today';
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-lg ${
          i < rating ? 'text-yellow-400' : 'text-muted-foreground'
        }`}
      >
        ★
      </span>
    ));
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-3">
      {/* User Info */}
      <div className="flex items-center space-x-3">
        <div className="relative w-10 h-10">
          <Image
            src={review.user_image || '/default-avatar.png'}
            alt={review.user_name}
            fill
            className="rounded-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-card-foreground truncate">
            {review.user_name}
          </h4>
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              {renderStars(review.rating)}
            </div>
            <span className="text-sm text-muted-foreground">
              {formatDate(review.created_at)}
            </span>
          </div>
        </div>
      </div>

      {/* Review Text */}
      <p className="text-card-foreground leading-relaxed">
        {review.text}
      </p>

      {/* Review Image */}
      {review.image_url && (
        <div className="relative w-full h-48 bg-muted rounded-lg overflow-hidden">
          <Image
            src={review.image_url}
            alt="Review photo"
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Helpful Button */}
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <button
          onClick={handleHelpful}
          disabled={isHelpful}
          className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm transition-colors ${
            isHelpful
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
          </svg>
          <span>
            {isHelpful ? 'Helpful' : 'Helpful'} ({helpfulCount})
          </span>
        </button>
      </div>
    </div>
  );
}
