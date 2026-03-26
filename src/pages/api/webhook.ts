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

export const config = {
  api: {
    bodyParser: false, // Stripe requires raw body
  },
};

async function buffer(req: NextApiRequest) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];

  if (!sig) {
    return res.status(400).json({ error: 'No signature' });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      // Create order in Firestore
      const items = JSON.parse(session.metadata?.items || '[]');
      
      const order = {
        userId: session.client_reference_id || 'guest',
        customerName: session.metadata?.customerName || '',
        email: session.customer_email || '',
        phone: session.metadata?.phone || '',
        shippingAddress: {
          line1: session.metadata?.addressLine1 || '',
          line2: session.metadata?.addressLine2 || '',
          city: session.metadata?.city || '',
          state: session.metadata?.state || '',
          zipCode: session.metadata?.zipCode || '',
          country: session.metadata?.country || '',
        },
        products: items,
        subtotal: (session.amount_subtotal || 0) / 100,
        tax: ((session.total_details?.amount_tax || 0) / 100),
        shipping: ((session.total_details?.amount_shipping || 0) / 100),
        total: (session.amount_total || 0) / 100,
        paymentIntent: session.payment_intent,
        paymentStatus: session.payment_status,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await db.collection('orders').add(order);

      console.log('Order created successfully for session:', session.id);
    } catch (error) {
      console.error('Error creating order:', error);
      // Don't return error to Stripe - we've received the payment
    }
  }

  res.status(200).json({ received: true });
}
