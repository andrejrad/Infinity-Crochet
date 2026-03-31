import { NextApiRequest, NextApiResponse} from 'next';

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

    // Import and initialize Shippo SDK
    const { Shippo, WeightUnitEnum, DistanceUnitEnum } = await import('shippo');
    const shippo = new Shippo({ apiKeyHeader: process.env.SHIPPO_API_KEY });

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
      email: process.env.SHIPPO_FROM_EMAIL || "contact@infinitycrochet.com",
      phone: process.env.SHIPPO_FROM_PHONE || "5555555555",
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
      distanceUnit: DistanceUnitEnum.In,
      weight: totalWeight.toString(),
      massUnit: WeightUnitEnum.Oz,
    };

    // Log all parameters being sent to Shippo
    console.log('=== SHIPPO REQUEST PARAMETERS ===');
    console.log('From Address:', JSON.stringify(fromAddress, null, 2));
    console.log('To Address:', JSON.stringify(toAddress, null, 2));
    console.log('Parcel:', JSON.stringify(parcel, null, 2));
    console.log('Total Weight:', totalWeight, 'oz');
    console.log('Items:', JSON.stringify(items, null, 2));

    // Create shipment to get rates
    const shipment = await shippo.shipments.create({
      addressFrom: fromAddress,
      addressTo: toAddress,
      parcels: [parcel],
      async: false,
    });

    console.log('=== SHIPPO RESPONSE ===');
    console.log('Shipment:', JSON.stringify(shipment, null, 2));

    // Filter and format rates - Shippo v2 doesn't have 'available' property, all returned rates are available
    const rates = shipment.rates
      .map((rate: any) => ({
        objectId: rate.objectId,
        provider: rate.provider,
        servicelevel: {
          name: rate.servicelevel.name,
          token: rate.servicelevel.token,
        },
        amount: parseFloat(rate.amount),
        currency: rate.currency,
        estimatedDays: rate.estimatedDays,
        durationTerms: rate.durationTerms,
      }))
      .sort((a: any, b: any) => a.amount - b.amount); // Sort by price

    console.log('=== FORMATTED RATES ===');
    console.log('Rates count:', rates.length);
    console.log('Rates:', JSON.stringify(rates, null, 2));

    res.status(200).json({ rates, shipmentId: shipment.objectId });
  } catch (error: any) {
    console.error('Shippo rate error:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    res.status(500).json({ 
      error: error.message || 'Failed to get shipping rates',
      details: error.toString()
    });
  }
}
