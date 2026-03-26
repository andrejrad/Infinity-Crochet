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
    const { amount, items, customerInfo } = req.body;

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

    // Add shipping if applicable
    const subtotal = items.reduce((sum: number, item: any) => sum + (item.product.price * item.quantity), 0);
    const shippingCost = subtotal >= 50 ? 0 : 10;
    
    if (shippingCost > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Shipping',
          },
          unit_amount: shippingCost * 100,
        },
        quantity: 1,
      });
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${req.headers.origin}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/checkout`,
      customer_email: customerInfo.email,
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'AU'],
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
        items: JSON.stringify(items),
      },
    });

    res.status(200).json({ url: session.url, sessionId: session.id });
  } catch (error: any) {
    console.error('Stripe error:', error);
    res.status(500).json({ error: error.message || 'Payment processing failed' });
  }
}
