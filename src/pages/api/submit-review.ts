import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/firebase';
import { collection, doc, setDoc, query, where, getDocs, getDoc, Timestamp } from 'firebase/firestore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { productId, productName, orderId, userId, userName, rating, comment } = req.body;

    // Validation
    if (!productId || !orderId || !userId || !userName || !rating) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    // Verify that the order exists and belongs to the user
    const orderDoc = await getDoc(doc(db, 'orders', orderId));
    if (!orderDoc.exists()) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const orderData = orderDoc.data();
    if (orderData.userId !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Verify that the product was part of this order
    const productInOrder = orderData.products.some((p: any) => 
      p.productId === productId || p.id === productId
    );
    if (!productInOrder) {
      return res.status(400).json({ error: 'Product not found in order' });
    }

    // Check if user already has a review for this product
    const reviewsQuery = query(
      collection(db, 'reviews'),
      where('userId', '==', userId),
      where('productId', '==', productId)
    );
    const existingReviews = await getDocs(reviewsQuery);

    // Generate user initials
    const nameParts = userName.trim().split(' ');
    const userInitials = nameParts.length > 1
      ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`
      : `${nameParts[0][0]}${nameParts[0][1] || ''}`;

    const reviewData = {
      productId,
      productName,
      orderId,
      userId,
      userName,
      userInitials: userInitials.toUpperCase(),
      rating,
      comment: comment || '',
      verifiedPurchase: true,
      updatedAt: Timestamp.now(),
    };

    let reviewId: string;

    if (!existingReviews.empty) {
      // Update existing review
      reviewId = existingReviews.docs[0].id;
      await setDoc(doc(db, 'reviews', reviewId), reviewData, { merge: true });
    } else {
      // Create new review
      reviewId = `${userId}_${productId}`;
      await setDoc(doc(db, 'reviews', reviewId), {
        ...reviewData,
        createdAt: Timestamp.now(),
      });
    }

    return res.status(200).json({ 
      success: true, 
      reviewId,
      message: existingReviews.empty ? 'Review submitted successfully' : 'Review updated successfully'
    });

  } catch (error: any) {
    console.error('Error submitting review:', error);
    return res.status(500).json({ error: 'Failed to submit review' });
  }
}
