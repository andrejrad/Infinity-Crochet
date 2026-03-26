import { NextApiRequest, NextApiResponse } from 'next';
const Shippo = require('shippo');
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

const getShippo = () => {
  return Shippo({ apiKeyHeader: process.env.SHIPPO_API_KEY });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { orderId, rateId } = req.body;

    if (!orderId || !rateId) {
      return res.status(400).json({ error: 'Missing order ID or rate ID' });
    }

    const shippo = getShippo();

    // Create transaction (purchase the label)
    const transaction = await shippo.transactions.create({
      rate: rateId,
      label_file_type: "PDF",
      async: false,
    });

    if (transaction.status !== 'SUCCESS') {
      throw new Error('Label creation failed: ' + transaction.messages);
    }

    // Update order in Firestore with tracking info
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
      trackingNumber: transaction.tracking_number,
      trackingUrl: transaction.tracking_url_provider,
      shippingLabelUrl: transaction.label_url,
      carrier: transaction.rate?.provider,
      shippingStatus: 'label_created',
      updatedAt: new Date().toISOString(),
    });

    res.status(200).json({
      success: true,
      trackingNumber: transaction.tracking_number,
      trackingUrl: transaction.tracking_url_provider,
      labelUrl: transaction.label_url,
      carrier: transaction.rate?.provider,
    });
  } catch (error: any) {
    console.error('Shippo transaction error:', error);
    res.status(500).json({ error: error.message || 'Failed to create shipping label' });
  }
}
