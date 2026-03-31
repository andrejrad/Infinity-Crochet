import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-02-25.clover',
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { amount, items, customerInfo, shippingRate, userId, insurance, notes } = req.body;

    // Validate input
    if (!amount || !items || !customerInfo) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create line items for Stripe Checkout
    const lineItems = items.map((item: any) => {
      const colorValues = item.selectedColors 
        ? Object.values(item.selectedColors).filter(Boolean)
        : [];
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.product.name,
            description: colorValues.length > 0
              ? `Colors: ${colorValues.join(', ')}`
              : undefined,
            images: item.product.images?.slice(0, 1) || [],
          },
          unit_amount: Math.round(item.product.price * 100), // Convert to cents
        },
        quantity: item.quantity,
      };
    });

    // Add shipping from Shippo rate
    if (shippingRate && shippingRate.amount) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Shipping - ${shippingRate.provider} ${shippingRate.servicelevel?.name || ''}`,
          },
          unit_amount: Math.round(shippingRate.amount * 100), // Convert to cents
        },
        quantity: 1,
      });
    }

    // Add insurance if enabled
    if (insurance?.enabled && insurance?.cost) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Shipping Insurance',
            description: `Package protection up to $${insurance.coverage?.toFixed(2) || '0.00'}`,
          },
          unit_amount: Math.round(insurance.cost * 100), // Convert to cents
        },
        quantity: 1,
      });
    }

    // Create simplified items for metadata (Stripe has 500 char limit per field)
    const simplifiedItems = items.map((item: any) => ({
      id: item.product.id,
      name: item.product.name,
      quantity: item.quantity,
      price: item.product.price,
      colors: item.selectedColors || {},
    }));

    // Create or retrieve Stripe customer with shipping address prefilled
    const customer = await stripe.customers.create({
      email: customerInfo.email,
      name: customerInfo.name,
      phone: customerInfo.phone,
      address: {
        line1: customerInfo.addressLine1,
        line2: customerInfo.addressLine2 || undefined,
        city: customerInfo.city,
        state: customerInfo.state,
        postal_code: customerInfo.zipCode,
        country: customerInfo.country,
      },
    });

    // Create Stripe Checkout Session
    const sessionConfig: any = {
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${req.headers.origin}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/checkout`,
      customer: customer.id,
      billing_address_collection: 'auto', // Only collect when required, prefilled with customer address
      automatic_tax: {
        enabled: true,
      },
      metadata: {
        customerName: customerInfo.name,
        phone: customerInfo.phone,
        addressLine1: customerInfo.addressLine1,
        addressLine2: customerInfo.addressLine2 || '',
        city: customerInfo.city,
        state: customerInfo.state,
        zipCode: customerInfo.zipCode,
        country: customerInfo.country,
        items: JSON.stringify(simplifiedItems),
        shippingCarrier: shippingRate?.provider || '',
        shippingService: shippingRate?.servicelevel?.name || '',
        shippingCost: shippingRate?.amount?.toString() || '0',
        shippingRateId: shippingRate?.objectId || '',
        insuranceEnabled: insurance?.enabled?.toString() || 'false',
        insuranceCost: insurance?.cost?.toString() || '0',
        insuranceCoverage: insurance?.coverage?.toString() || '0',
        notes: notes ? notes.substring(0, 500) : '', // Truncate to Stripe's 500 char limit
      },
    };

    // Only set client_reference_id if userId is provided (for logged-in users)
    if (userId) {
      sessionConfig.client_reference_id = userId;
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    res.status(200).json({ url: session.url, sessionId: session.id });
  } catch (error: any) {
    console.error('Stripe error:', error);
    res.status(500).json({ error: error.message || 'Payment processing failed' });
  }
}
