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
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { orderId, rateId } = req.body;

    console.log('Creating label for order:', orderId, 'with rate:', rateId);

    if (!orderId || !rateId) {
      return res.status(400).json({ error: 'Missing order ID or rate ID' });
    }

    // Get order from Firestore to access shipping details
    const orderRef = db.collection('orders').doc(orderId);
    const orderDoc = await orderRef.get();
    
    if (!orderDoc.exists) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    const order = orderDoc.data()!;

    // Import and initialize Shippo SDK
    const { Shippo, WeightUnitEnum, DistanceUnitEnum } = await import('shippo');
    const shippo = new Shippo({ apiKeyHeader: process.env.SHIPPO_API_KEY });

    console.log('Calling Shippo to create transaction...');

    // Create transaction (purchase the label) with complete address info
    const transactionConfig: any = {
      rate: rateId,
      labelFileType: "PDF",
      async: false,
      metadata: `Order ${order.orderNumber}`,
    };

    // Add insurance if enabled in the order
    if (order.insuranceEnabled && order.insuranceCoverage) {
      transactionConfig.insurance = {
        amount: order.insuranceCoverage.toString(),
        currency: "USD",
      };
      console.log('Adding insurance to label:', {
        amount: order.insuranceCoverage,
        coverage: order.insuranceCost,
      });
    }

    const transaction = await shippo.transactions.create(transactionConfig);

    console.log('Shippo transaction response:', transaction.status, transaction.objectId);

    if (transaction.status !== 'SUCCESS') {
      console.error('Shippo transaction failed:', transaction.messages);
      throw new Error('Label creation failed: ' + JSON.stringify(transaction.messages));
    }

    // Update order in Firestore with tracking info
    await orderRef.update({
      trackingNumber: transaction.trackingNumber,
      trackingUrl: transaction.trackingUrlProvider,
      shippingLabelUrl: transaction.labelUrl,
      shippingStatus: 'label_created',
      status: 'processing',
      updatedAt: new Date().toISOString(),
    });

    console.log('✅ Label created successfully. Tracking:', transaction.trackingNumber);

    res.status(200).json({
      success: true,
      trackingNumber: transaction.trackingNumber,
      trackingUrl: transaction.trackingUrlProvider,
      labelUrl: transaction.labelUrl,
    });
  } catch (error: any) {
    console.error('❌ Shippo transaction error:', error);
    res.status(500).json({ error: error.message || 'Failed to create shipping label' });
  }
}
