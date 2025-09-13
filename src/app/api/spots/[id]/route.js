// File: src/app/api/spots/[id]/route.js
import { NextResponse } from 'next/server';
import { db } from '@/../firebase-admin.config';

export async function GET(request, { params }) {
  const { id } = params; // Get the ID from the URL

  try {
    // Fetch spot from Firestore
    const spotDoc = await db.collection('spots').doc(id).get();
    
    if (!spotDoc.exists) {
      return NextResponse.json({ message: 'Spot not found' }, { status: 404 });
    }

    const spot = { id: spotDoc.id, ...spotDoc.data() };

    // Fetch reviews for this spot from Firestore
    const reviewsSnapshot = await db.collection('reviews')
      .where('spot_id', '==', id)
      .get();

    const reviews = reviewsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Sort reviews by created_at in descending order (newest first)
    reviews.sort((a, b) => {
      const dateA = new Date(a.created_at || 0);
      const dateB = new Date(b.created_at || 0);
      return dateB - dateA;
    });

    // Calculate average rating from reviews
    let averageRating = 0;
    let reviewCount = 0;
    
    if (reviews.length > 0) {
      const validReviews = reviews.filter(review => review.rating && review.rating >= 1 && review.rating <= 5);
      if (validReviews.length > 0) {
        const totalRating = validReviews.reduce((sum, review) => sum + review.rating, 0);
        averageRating = totalRating / validReviews.length;
        reviewCount = validReviews.length;
      }
    }

    // Update spot with calculated rating and review count
    const updatedSpot = {
      ...spot,
      rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
      review_count: reviewCount
    };

    // Return the spot and its reviews together
    return NextResponse.json({ ...updatedSpot, reviews });

  } catch (error) {
    console.error('Error fetching spot details:', error);
    return NextResponse.json({ message: 'Error fetching spot details', error: error.message }, { status: 500 });
  }
}