import type { NextApiRequest, NextApiResponse } from 'next';
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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { programId, userId, userEmail } = req.body;

    console.log('Create program checkout request:', { programId, userId, userEmail });

    if (!programId || !userId || !userEmail) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate environment variables
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('STRIPE_SECRET_KEY is not configured');
      return res.status(500).json({ error: 'Server configuration error: Missing Stripe key' });
    }

    if (!process.env.NEXT_PUBLIC_BASE_URL) {
      console.error('NEXT_PUBLIC_BASE_URL is not configured');
      return res.status(500).json({ error: 'Server configuration error: Missing base URL' });
    }

    // Check if user already owns this program
    console.log('Checking existing purchase...');
    const existingPurchase = await db.collection('userPrograms')
      .where('userId', '==', userId)
      .where('programId', '==', programId)
      .get();

    if (!existingPurchase.empty) {
      console.log('User already owns this program');
      return res.status(400).json({ error: 'You already own this program' });
    }

    // Get program details
    console.log('Fetching program details...');
    const programDoc = await db.collection('trainingPrograms').doc(programId).get();
    
    if (!programDoc.exists) {
      console.log('Program not found:', programId);
      return res.status(404).json({ error: 'Program not found' });
    }

    const program = programDoc.data();
    console.log('Program found:', program?.name);

    // Create Stripe checkout session
    console.log('Creating Stripe checkout session...');
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: userEmail,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: program!.name,
              description: `Online Training Program - ${program!.estimatedTime}`,
              images: program!.thumbnail ? [program!.thumbnail] : [],
            },
            unit_amount: Math.round(program!.price * 100),
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/training/${programId}?purchase=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/training/${programId}?purchase=cancelled`,
      metadata: {
        type: 'program',
        programId,
        userId,
        programName: program!.name,
      },
    });

    console.log('Stripe session created successfully:', session.id);
    return res.status(200).json({ url: session.url });

  } catch (error: any) {
    console.error('Error creating program checkout session:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      type: error.type,
      code: error.code,
    });
    return res.status(500).json({ 
      error: error.message || 'Failed to create checkout session',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
