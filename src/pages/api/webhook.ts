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
  console.log('🔔 Webhook received!', req.method);
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];
  
  console.log('Webhook signature present:', !!sig);

  if (!sig) {
    console.error('❌ No Stripe signature in webhook request');
    return res.status(400).json({ error: 'No signature' });
  }

  let event: Stripe.Event;

  try {
    // Trim webhook secret to remove any whitespace
    const webhookSecret = (process.env.STRIPE_WEBHOOK_SECRET || '').trim();
    
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      webhookSecret
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  console.log('Received webhook event:', event.type);

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    console.log('Processing checkout session:', session.id);
    console.log('Session metadata:', session.metadata);

    try {
      // Check if this is a program purchase
      if (session.metadata?.type === 'program') {
        console.log('🎓 Processing program purchase');
        
        const { programId, userId, programName } = session.metadata;
        
        // Create user program entry
        await db.collection('userPrograms').add({
          userId,
          programId,
          programName,
          purchasedAt: new Date(),
          progress: {},
          completionPercentage: 0,
        });
        
        console.log('✅ Program access granted:', programName, 'to user:', userId);
        
        return res.status(200).json({ received: true, type: 'program' });
      }

      // Otherwise, handle as regular product order
      // Generate order number (YYMMDD-XXXX format)
      const now = new Date();
      const dateStr = now.getFullYear().toString().slice(-2) + 
                      (now.getMonth() + 1).toString().padStart(2, '0') + 
                      now.getDate().toString().padStart(2, '0');
      const randomCode = Math.random().toString(36).substring(2, 6).toUpperCase();
      const orderNumber = `INF-${dateStr}-${randomCode}`;
      
      // Create order in Firestore
      const items = JSON.parse(session.metadata?.items || '[]');
      
      // Calculate shipping cost from metadata (since it's a line item in Stripe)
      const shippingCost = parseFloat(session.metadata?.shippingCost || '0');
      const insuranceCost = parseFloat(session.metadata?.insuranceCost || '0');
      const insuranceEnabled = session.metadata?.insuranceEnabled === 'true';
      const insuranceCoverage = parseFloat(session.metadata?.insuranceCoverage || '0');
      
      // Stripe's amount_subtotal includes shipping as a line item
      // So we need to subtract shipping and insurance to get the actual item subtotal
      const stripeSubtotal = (session.amount_subtotal || 0) / 100;
      const actualItemSubtotal = stripeSubtotal - shippingCost - (insuranceEnabled ? insuranceCost : 0);
      
      console.log('Order calculation:', {
        stripeSubtotal,
        shippingCost,
        actualItemSubtotal,
        total: (session.amount_total || 0) / 100,
      });
      
      console.log('User tracking:', {
        client_reference_id: session.client_reference_id,
        userId: session.client_reference_id || 'guest',
        customerEmail: session.customer_details?.email,
        customerEmailFallback: session.customer_email,
      });
      
      // Get email from customer_details (newer API) or customer_email (older sessions)
      const customerEmail = session.customer_details?.email || session.customer_email || '';
      
      if (!customerEmail) {
        console.error('⚠️ No customer email found in session. Email notifications will not be sent.');
      }
      
      // Use address from metadata (already validated by Shippo when getting rates)
      const order = {
        orderNumber,
        stripeSessionId: session.id,
        userId: session.client_reference_id || 'guest',
        customerName: session.metadata?.customerName || '',
        email: customerEmail,
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
        subtotal: actualItemSubtotal,
        tax: ((session.total_details?.amount_tax || 0) / 100),
        shipping: shippingCost,
        total: (session.amount_total || 0) / 100,
        shippingCarrier: session.metadata?.shippingCarrier || '',
        shippingService: session.metadata?.shippingService || '',
        shippingCost: shippingCost,
        shippingRateId: session.metadata?.shippingRateId || '',
        insuranceEnabled: insuranceEnabled,
        insuranceCost: insuranceCost,
        insuranceCoverage: insuranceCoverage,
        notes: session.metadata?.notes || '',
        paymentIntent: session.payment_intent,
        paymentStatus: session.payment_status,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      console.log('💾 Attempting to save order to Firestore...');
      console.log('Order data:', {
        orderNumber,
        userId: order.userId,
        email: order.email,
        total: order.total,
      });
      
      const docRef = await db.collection('orders').add(order);

      console.log('✅ Order created successfully:', orderNumber, 'Firestore ID:', docRef.id, 'UserId:', order.userId);

      // Send order confirmation email via Firebase Extension
      try {
        const itemsList = items.map((item: any) => 
          `<tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">
              <strong>${item.name}</strong><br/>
              ${item.colors ? Object.values(item.colors).filter(Boolean).join(', ') : ''}
            </td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">
              ${item.quantity}
            </td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
              $${(item.price * item.quantity).toFixed(2)}
            </td>
          </tr>`
        ).join('');

        const emailHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9f9f9; padding: 30px; }
              .order-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
              .order-number { font-size: 24px; font-weight: bold; color: #667eea; margin: 10px 0; }
              table { width: 100%; border-collapse: collapse; margin: 20px 0; }
              .total-row { font-weight: bold; font-size: 18px; color: #667eea; }
              .footer { background: #f0f0f0; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 14px; color: #666; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0;">🎉 Order Confirmed!</h1>
                <p style="margin: 10px 0 0 0;">Thank you for shopping with Infinity Crochet</p>
              </div>
              
              <div class="content">
                <p>Hi ${order.customerName},</p>
                
                <p>We've received your order and we're getting started on handcrafting your beautiful crochet items!</p>
                
                <div class="order-box">
                  <p style="margin: 0; color: #666;">Order Confirmation Number:</p>
                  <div class="order-number">${orderNumber}</div>
                  <p style="margin: 10px 0 0 0; color: #666; font-size: 14px;">Order Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                
                <h3>Order Details:</h3>
                <table>
                  <thead>
                    <tr style="background: #667eea; color: white;">
                      <th style="padding: 10px; text-align: left;">Item</th>
                      <th style="padding: 10px; text-align: center;">Qty</th>
                      <th style="padding: 10px; text-align: right;">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemsList}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colspan="2" style="padding: 10px; text-align: right;"><strong>Subtotal:</strong></td>
                      <td style="padding: 10px; text-align: right;">$${order.subtotal.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td colspan="2" style="padding: 10px; text-align: right;"><strong>Shipping:</strong></td>
                      <td style="padding: 10px; text-align: right;">$${order.shipping.toFixed(2)}</td>
                    </tr>
                    ${order.tax > 0 ? `
                    <tr>
                      <td colspan="2" style="padding: 10px; text-align: right;"><strong>Tax:</strong></td>
                      <td style="padding: 10px; text-align: right;">$${order.tax.toFixed(2)}</td>
                    </tr>` : ''}
                    <tr class="total-row">
                      <td colspan="2" style="padding: 15px 10px; text-align: right; border-top: 2px solid #667eea;">Total:</td>
                      <td style="padding: 15px 10px; text-align: right; border-top: 2px solid #667eea;">$${order.total.toFixed(2)}</td>
                    </tr>
                  </tfoot>
                </table>
                
                <h3>Shipping Address:</h3>
                <div class="order-box">
                  <p style="margin: 5px 0;">${order.shippingAddress.line1}</p>
                  ${order.shippingAddress.line2 ? `<p style="margin: 5px 0;">${order.shippingAddress.line2}</p>` : ''}
                  <p style="margin: 5px 0;">${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}</p>
                  <p style="margin: 5px 0;">${order.shippingAddress.country}</p>
                </div>
                
                <h3>What's Next?</h3>
                <ul style="padding-left: 20px;">
                  <li>We'll start handcrafting your crochet items with love and care</li>
                  <li>Your order will ship within 3-5 business days</li>
                  <li>You'll receive a tracking number once shipped</li>
                  <li>Track your order anytime at <a href="https://infinity-crochet.com/account/orders">infinity-crochet.com/account/orders</a></li>
                </ul>
                
                <p style="margin-top: 30px;">If you have any questions, feel free to reply to this email or contact us!</p>
                
                <p style="margin-top: 20px;">Thank you for supporting handmade art! ❤️</p>
                <p><strong>The Infinity Crochet Team</strong></p>
              </div>
              
              <div class="footer">
                <p style="margin: 5px 0;">Infinity Crochet</p>
                <p style="margin: 5px 0;">Questions? Contact us at orders@infinity-crochet.com</p>
                <p style="margin: 15px 0 5px 0; font-size: 12px;">
                  <a href="https://infinity-crochet.com" style="color: #667eea; text-decoration: none;">Visit Our Shop</a> | 
                  <a href="https://infinity-crochet.com/account/orders" style="color: #667eea; text-decoration: none;">Track Order</a>
                </p>
              </div>
            </div>
          </body>
          </html>
        `;

        await db.collection('emails').add({
          to: order.email,
          message: {
            subject: `Order Confirmation #${orderNumber} - Infinity Crochet`,
            html: emailHtml,
          },
        });

        console.log('✅ Email queued for:', order.email);
      } catch (emailError) {
        console.error('❌ Error queuing email:', emailError);
        // Don't fail the webhook if email fails
      }
    } catch (error) {
      console.error('❌ Error creating order:', error);
      // Don't return error to Stripe - we've received the payment
    }
  }

  res.status(200).json({ received: true });
}
