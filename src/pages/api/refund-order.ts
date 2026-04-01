import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-02-25.clover',
});

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
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { orderId, reason } = req.body;

    if (!orderId) {
      return res.status(400).json({ error: 'Order ID is required' });
    }

    // Get the order from Firestore
    const orderRef = db.collection('orders').doc(orderId);
    const orderDoc = await orderRef.get();

    if (!orderDoc.exists) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = orderDoc.data();

    // Check if order has already been refunded
    if (order?.refundId) {
      return res.status(400).json({ error: 'Order has already been refunded' });
    }

    // Get the payment intent ID
    const paymentIntentId = order?.paymentIntent;
    if (!paymentIntentId) {
      return res.status(400).json({ error: 'No payment intent found for this order' });
    }

    console.log('Processing refund for order:', order.orderNumber);
    console.log('Payment Intent:', paymentIntentId);
    console.log('Refund amount:', order.total);

    // Create refund in Stripe for the full amount
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      reason: reason || 'requested_by_customer',
      metadata: {
        orderId: orderId,
        orderNumber: order.orderNumber || '',
      },
    });

    console.log('Refund created:', refund.id);

    // Update order in Firestore
    await orderRef.update({
      status: 'refunded',
      refundId: refund.id,
      refundedAt: new Date().toISOString(),
      refundAmount: refund.amount / 100, // Convert cents to dollars
      refundReason: reason || 'requested_by_customer',
      updatedAt: new Date().toISOString(),
    });

    console.log('Order updated with refund information');

    // TODO: If you want to void the Shippo label, add that logic here
    // You would need the label ID and call Shippo's void/refund endpoint
    // if (order.shippingLabelId && order.status === 'pending') {
    //   // Call Shippo API to void label
    // }

    res.status(200).json({
      success: true,
      refundId: refund.id,
      amount: refund.amount / 100,
      status: refund.status,
      message: `Full refund of $${(refund.amount / 100).toFixed(2)} processed successfully`,
    });

  } catch (error: any) {
    console.error('Refund error:', error);
    
    // Handle Stripe errors
    if (error.type === 'StripeCardError') {
      return res.status(400).json({ error: error.message });
    }
    
    res.status(500).json({ 
      error: 'Failed to process refund',
      details: error.message 
    });
  }
}
