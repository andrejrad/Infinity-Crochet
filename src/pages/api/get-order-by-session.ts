import { NextApiRequest, NextApiResponse } from 'next';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { session_id } = req.query;

    if (!session_id || typeof session_id !== 'string') {
      return res.status(400).json({ error: 'Missing session_id' });
    }

    // Query Firestore for order with matching stripeSessionId
    const ordersRef = db.collection('orders');
    const querySnapshot = await ordersRef
      .where('stripeSessionId', '==', session_id)
      .limit(1)
      .get();

    if (querySnapshot.empty) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const orderDoc = querySnapshot.docs[0];
    const orderData: any = {
      id: orderDoc.id,
      ...orderDoc.data(),
    };

    // Only return order if it was created within the last 10 minutes (security)
    const createdAt = new Date(orderData.createdAt);
    const now = new Date();
    const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000);

    if (createdAt < tenMinutesAgo) {
      return res.status(403).json({ error: 'Order access expired. Please log in to view order details.' });
    }

    res.status(200).json(orderData);
  } catch (error: any) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch order' });
  }
}
