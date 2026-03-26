import { NextApiRequest, NextApiResponse } from 'next';
const Shippo = require('shippo');

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
    // Check if API key exists
    if (!process.env.SHIPPO_API_KEY) {
      console.error('SHIPPO_API_KEY is not set');
      return res.status(500).json({ error: 'Shippo API key not configured' });
    }

    const { destinationAddress, items } = req.body;

    if (!destinationAddress || !items) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const shippo = getShippo();

    // Calculate total weight (assuming each item is ~8oz for crochet items)
    const totalWeight = items.reduce((sum: number, item: any) => {
      return sum + (item.quantity * 8); // 8 oz per item
    }, 0);

    // Your origin address (shipping from)
    const fromAddress = {
      name: "Infinity Crochet",
      street1: process.env.SHIPPO_FROM_ADDRESS_STREET || "123 Main St",
      city: process.env.SHIPPO_FROM_CITY || "Your City",
      state: process.env.SHIPPO_FROM_STATE || "CA",
      zip: process.env.SHIPPO_FROM_ZIP || "90001",
      country: "US",
    };

    // Customer's address
    const toAddress = {
      name: destinationAddress.name || "Customer",
      street1: destinationAddress.line1,
      street2: destinationAddress.line2 || "",
      city: destinationAddress.city,
      state: destinationAddress.state,
      zip: destinationAddress.postalCode,
      country: destinationAddress.country || "US",
    };

    // Package details (adjust based on your typical package size)
    const parcel = {
      length: "12",
      width: "10",
      height: "6",
      distance_unit: "in",
      weight: totalWeight.toString(),
      mass_unit: "oz",
    };

    // Create shipment to get rates
    const shipment = await shippo.shipments.create({
      address_from: fromAddress,
      address_to: toAddress,
      parcels: [parcel],
      async: false,
    });

    // Filter and format rates
    const rates = shipment.rates
      .filter((rate: any) => rate.available)
      .map((rate: any) => ({
        objectId: rate.object_id,
        provider: rate.provider,
        servicelevel: {
          name: rate.servicelevel.name,
          token: rate.servicelevel.token,
        },
        amount: parseFloat(rate.amount),
        currency: rate.currency,
        estimatedDays: rate.estimated_days,
        durationTerms: rate.duration_terms,
      }))
      .sort((a: any, b: any) => a.amount - b.amount); // Sort by price

    res.status(200).json({ rates, shipmentId: shipment.object_id });
  } catch (error: any) {
    console.error('Shippo rate error:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    res.status(500).json({ 
      error: error.message || 'Failed to get shipping rates',
      details: error.toString()
    });
  }
}
