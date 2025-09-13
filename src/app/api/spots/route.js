import { NextResponse } from 'next/server';
import { db } from '@/../firebase-admin.config';

export async function GET() {
    try {
        // Get all spots
        const spotsSnapshot = await db.collection('spots').get();
        const spots = spotsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Get all reviews
        const reviewsSnapshot = await db.collection('reviews').get();
        const allReviews = reviewsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Calculate ratings for each spot based on reviews
        const spotsWithCalculatedRatings = spots.map(spot => {
            const spotReviews = allReviews.filter(review => review.spot_id === spot.id);
            
            let averageRating = 0;
            let reviewCount = 0;
            
            if (spotReviews.length > 0) {
                const validReviews = spotReviews.filter(review => review.rating && review.rating >= 1 && review.rating <= 5);
                if (validReviews.length > 0) {
                    const totalRating = validReviews.reduce((sum, review) => sum + review.rating, 0);
                    averageRating = totalRating / validReviews.length;
                    reviewCount = validReviews.length;
                }
            }
            
            return {
                ...spot,
                rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
                review_count: reviewCount
            };
        });
        
        return NextResponse.json(spotsWithCalculatedRatings);
    } catch (error) {
        console.error('Error fetching spots:', error);
        return NextResponse.json({ message: 'Error fetching spots', error: error.message }, { status: 500 });
    }
}