import type { NextApiRequest, NextApiResponse } from 'next';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

// Initialize Firebase Admin
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = getFirestore();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { programId, programName, userId, userName, rating, comment } = req.body;

    // Validation
    if (!programId || !userId || !userName || !rating) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    // Verify that the user owns this program
    const userProgramsSnapshot = await db.collection('userPrograms')
      .where('userId', '==', userId)
      .where('programId', '==', programId)
      .get();

    if (userProgramsSnapshot.empty) {
      return res.status(403).json({ error: 'You must purchase this program before reviewing it' });
    }

    // Check if user already has a review for this program
    const existingReviews = await db.collection('programReviews')
      .where('userId', '==', userId)
      .where('programId', '==', programId)
      .get();

    // Generate user initials
    const nameParts = userName.trim().split(' ');
    const userInitials = nameParts.length > 1
      ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`
      : `${nameParts[0][0]}${nameParts[0][1] || ''}`;

    const reviewData = {
      programId,
      programName,
      userId,
      userName,
      userInitials: userInitials.toUpperCase(),
      rating,
      comment: comment || '',
      verifiedPurchase: true,
      updatedAt: FieldValue.serverTimestamp(),
    };

    let reviewId: string;

    if (!existingReviews.empty) {
      // Update existing review
      reviewId = existingReviews.docs[0].id;
      await db.collection('programReviews').doc(reviewId).set(reviewData, { merge: true });
    } else {
      // Create new review
      reviewId = `${userId}_${programId}`;
      await db.collection('programReviews').doc(reviewId).set({
        ...reviewData,
        createdAt: FieldValue.serverTimestamp(),
      });
    }

    return res.status(200).json({ 
      success: true, 
      reviewId,
      message: existingReviews.empty ? 'Review submitted successfully' : 'Review updated successfully'
    });

  } catch (error: any) {
    console.error('Error submitting program review:', error);
    return res.status(500).json({ error: 'Failed to submit review' });
  }
}
