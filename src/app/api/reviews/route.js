import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route.js';
import { db } from '@/../firebase-admin.config';

export async function POST(request) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { spot_id, rating, text, image_url } = await request.json();

    // Validate required fields
    if (!spot_id || !rating || !text) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
    }

    // Validate text length
    if (text.trim().length < 10) {
      return NextResponse.json({ error: 'Review text must be at least 10 characters' }, { status: 400 });
    }

    // Check if spot exists
    const spotDoc = await db.collection('spots').doc(spot_id).get();
    if (!spotDoc.exists) {
      return NextResponse.json({ error: 'Spot not found' }, { status: 404 });
    }

    // Create review data
    const reviewData = {
      spot_id,
      user_id: session.user.id,
      user_name: session.user.name,
      user_email: session.user.email,
      user_image: session.user.image,
      rating: parseInt(rating),
      text: text.trim(),
      image_url: image_url || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      helpful_count: 0,
      reported: false,
    };

    // Save review to Firestore
    const reviewRef = await db.collection('reviews').add(reviewData);

    return NextResponse.json({ 
      success: true, 
      review_id: reviewRef.id,
      message: 'Review submitted successfully' 
    });

  } catch (error) {
    console.error('Review submission error:', error);
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const spotId = searchParams.get('spot_id');

    if (!spotId) {
      return NextResponse.json({ error: 'Spot ID is required' }, { status: 400 });
    }

    // Get reviews for the spot
    const reviewsSnapshot = await db.collection('reviews')
      .where('spot_id', '==', spotId)
      .where('reported', '==', false)
      .get();

    const reviews = reviewsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Sort by creation date (newest first)
    reviews.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return NextResponse.json(reviews);

  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}
