import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route.js';
import { db } from '@/../firebase-admin.config';

export async function POST(request, { params }) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const reviewId = params.id;

    if (!reviewId) {
      return NextResponse.json({ error: 'Review ID is required' }, { status: 400 });
    }

    // Check if review exists
    const reviewDoc = await db.collection('reviews').doc(reviewId).get();
    if (!reviewDoc.exists) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    // Check if user has already voted on this review
    const helpfulVoteDoc = await db.collection('helpful_votes')
      .where('review_id', '==', reviewId)
      .where('user_id', '==', session.user.id)
      .get();

    if (!helpfulVoteDoc.empty) {
      return NextResponse.json({ error: 'You have already voted on this review' }, { status: 400 });
    }

    // Add helpful vote
    await db.collection('helpful_votes').add({
      review_id: reviewId,
      user_id: session.user.id,
      created_at: new Date().toISOString(),
    });

    // Update review helpful count
    await db.collection('reviews').doc(reviewId).update({
      helpful_count: (reviewDoc.data().helpful_count || 0) + 1,
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error marking review as helpful:', error);
    return NextResponse.json({ error: 'Failed to mark review as helpful' }, { status: 500 });
  }
}
