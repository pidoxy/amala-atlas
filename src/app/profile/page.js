import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '../api/auth/[...nextauth]/route.js';
import { db } from '@/../firebase-admin.config';
import UserProfile from '../../components/UserProfile';

async function getUserReviews(userId) {
  try {
    const reviewsSnapshot = await db.collection('reviews')
      .where('userId', '==', userId)
      .orderBy('created_at', 'desc')
      .get();
    
    const reviews = reviewsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Get spot details for each review
    const reviewsWithSpots = await Promise.all(
      reviews.map(async (review) => {
        const spotDoc = await db.collection('spots').doc(review.spotId).get();
        return {
          ...review,
          spot: spotDoc.exists ? { id: spotDoc.id, ...spotDoc.data() } : null
        };
      })
    );

    return reviewsWithSpots;
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    return [];
  }
}

async function getUserStats(userId) {
  try {
    const reviewsSnapshot = await db.collection('reviews')
      .where('userId', '==', userId)
      .get();
    
    const reviews = reviewsSnapshot.docs.map(doc => doc.data());
    
    const totalReviews = reviews.length;
    const totalLikes = reviews.reduce((sum, review) => sum + (review.likes || 0), 0);
    const totalDislikes = reviews.reduce((sum, review) => sum + (review.dislikes || 0), 0);
    const averageRating = reviews.length > 0 
      ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
      : 0;

    return {
      totalReviews,
      totalLikes,
      totalDislikes,
      averageRating,
      helpfulScore: totalLikes - totalDislikes
    };
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return {
      totalReviews: 0,
      totalLikes: 0,
      totalDislikes: 0,
      averageRating: 0,
      helpfulScore: 0
    };
  }
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  const [reviews, stats] = await Promise.all([
    getUserReviews(session.user.id),
    getUserStats(session.user.id)
  ]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <UserProfile 
          user={session.user}
          reviews={reviews}
          stats={stats}
        />
      </div>
    </div>
  );
}
