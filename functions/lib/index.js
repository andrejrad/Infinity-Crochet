"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOrderStatusChangeEmail = exports.sendOrderConfirmationEmail = void 0;
const functions = __importStar(require("firebase-functions/v1"));
const admin = __importStar(require("firebase-admin"));
const nodemailer = __importStar(require("nodemailer"));
admin.initializeApp();
// Gmail SMTP configuration
const gmailEmail = 'infinitycrochet1@gmail.com';
const gmailAppPassword = 'pirjlcxbgszhoffw'; // Spaces already removed
// Lazy initialize transporter
let transporter = null;
function getTransporter() {
    if (!transporter) {
        transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: gmailEmail,
                pass: gmailAppPassword,
            },
        });
    }
    return transporter;
}
// Helper function to generate order items HTML
function generateItemsList(items) {
    return items.map((item) => `<tr>
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
    </tr>`).join('');
}
// Helper function to generate customer order confirmation email HTML
function generateCustomerOrderEmail(order) {
    const itemsList = generateItemsList(order.products);
    return `
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
            <div class="order-number">${order.orderNumber}</div>
            <p style="margin: 10px 0 0 0; color: #666; font-size: 14px;">Order Date: ${new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
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
              ${order.insuranceEnabled ? `
              <tr>
                <td colspan="2" style="padding: 10px; text-align: right;"><strong>Insurance:</strong></td>
                <td style="padding: 10px; text-align: right;">$${order.insuranceCost.toFixed(2)}</td>
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
          
          ${order.notes ? `
          <h3>Your Notes:</h3>
          <div class="order-box">
            <p style="margin: 0;">${order.notes}</p>
          </div>
          ` : ''}
          
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
          <p style="margin: 5px 0;">Questions? Contact us at infinitycrochet1@gmail.com</p>
          <p style="margin: 15px 0 5px 0; font-size: 12px;">
            <a href="https://infinity-crochet.com" style="color: #667eea; text-decoration: none;">Visit Our Shop</a> | 
            <a href="https://infinity-crochet.com/account/orders" style="color: #667eea; text-decoration: none;">Track Order</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}
// Helper function to generate admin notification email HTML
function generateAdminOrderEmail(order) {
    const itemsList = generateItemsList(order.products);
    return `
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
        .alert-box { background: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 8px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">🔔 New Order Received!</h1>
          <p style="margin: 10px 0 0 0;">Infinity Crochet Admin Notification</p>
        </div>
        
        <div class="content">
          <div class="alert-box">
            <strong>⚡ Action Required:</strong> A new order needs your attention!
          </div>
          
          <div class="order-box">
            <p style="margin: 0; color: #666;">Order Number:</p>
            <div class="order-number">${order.orderNumber}</div>
            <p style="margin: 10px 0 0 0; color: #666; font-size: 14px;">Order Date: ${new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
          </div>
          
          <h3>Customer Information:</h3>
          <div class="order-box">
            <p style="margin: 5px 0;"><strong>Name:</strong> ${order.customerName}</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> ${order.email}</p>
            <p style="margin: 5px 0;"><strong>Phone:</strong> ${order.phone || 'Not provided'}</p>
          </div>
          
          <h3>Shipping Address:</h3>
          <div class="order-box">
            <p style="margin: 5px 0;">${order.shippingAddress.line1}</p>
            ${order.shippingAddress.line2 ? `<p style="margin: 5px 0;">${order.shippingAddress.line2}</p>` : ''}
            <p style="margin: 5px 0;">${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}</p>
            <p style="margin: 5px 0;">${order.shippingAddress.country}</p>
          </div>
          
          <h3>Order Items:</h3>
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
              ${order.insuranceEnabled ? `
              <tr>
                <td colspan="2" style="padding: 10px; text-align: right;"><strong>Insurance:</strong></td>
                <td style="padding: 10px; text-align: right;">$${order.insuranceCost.toFixed(2)}</td>
              </tr>` : ''}
              <tr class="total-row">
                <td colspan="2" style="padding: 15px 10px; text-align: right; border-top: 2px solid #667eea;">Total:</td>
                <td style="padding: 15px 10px; text-align: right; border-top: 2px solid #667eea;">$${order.total.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
          
          ${order.notes ? `
          <h3>⚠️ Customer Notes:</h3>
          <div class="alert-box">
            <p style="margin: 0;"><strong>${order.notes}</strong></p>
          </div>
          ` : ''}
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="https://infinity-crochet.com/admin/orders" style="display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">
              View Order in Admin Panel
            </a>
          </div>
          
          <p style="margin-top: 30px; text-align: center; color: #666; font-size: 14px;">
            This is an automated notification from your Infinity Crochet store.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}
// Helper function to generate order status change email HTML
function generateStatusChangeEmail(order, oldStatus) {
    let statusMessage = '';
    let statusEmoji = '';
    let nextSteps = '';
    switch (order.status) {
        case 'processing':
            statusEmoji = '⚙️';
            statusMessage = 'Your order is now being processed';
            nextSteps = `
        <h3>What's Happening:</h3>
        <ul style="padding-left: 20px;">
          <li>We're currently handcrafting your crochet items</li>
          <li>Each piece is made with care and attention to detail</li>
          <li>You'll receive a notification once your order ships</li>
        </ul>
      `;
            break;
        case 'shipped':
            statusEmoji = '📦';
            statusMessage = 'Your order has been shipped!';
            nextSteps = `
        <h3>Tracking Information:</h3>
        <div class="order-box">
          ${order.trackingNumber ? `
            <p style="margin: 5px 0;"><strong>Tracking Number:</strong> ${order.trackingNumber}</p>
            <p style="margin: 15px 0;">
              <a href="${order.trackingUrl}" style="display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
                Track Your Package
              </a>
            </p>
          ` : '<p>Tracking information will be updated shortly.</p>'}
        </div>
        
        <h3>What's Next:</h3>
        <ul style="padding-left: 20px;">
          <li>Your package is on its way!</li>
          <li>You can track it using the link above</li>
          <li>You'll receive another email when it's delivered</li>
        </ul>
      `;
            break;
        case 'delivered':
            statusEmoji = '✅';
            statusMessage = 'Your order has been delivered!';
            nextSteps = `
        <h3>Delivery Confirmed:</h3>
        <p>Your handmade crochet items have been delivered! We hope you love them!</p>
        
        <h3>Share Your Experience:</h3>
        <ul style="padding-left: 20px;">
          <li>We'd love to see your items! Tag us on social media</li>
          <li>Leave us a review to help others discover Infinity Crochet</li>
          <li>Have any issues? Contact us and we'll make it right</li>
        </ul>
        
        <p style="margin-top: 30px;">Thank you for supporting handmade art! ❤️</p>
      `;
            break;
        case 'cancelled':
            statusEmoji = '❌';
            statusMessage = 'Your order has been cancelled';
            nextSteps = `
        <h3>Order Cancelled:</h3>
        <p>Your order has been cancelled as requested. If this was a mistake or you have any questions, please contact us immediately.</p>
        
        <h3>Refund Information:</h3>
        <ul style="padding-left: 20px;">
          <li>Your refund will be processed within 5-7 business days</li>
          <li>The amount will be credited to your original payment method</li>
          <li>You'll receive a separate confirmation email once the refund is complete</li>
        </ul>
        
        <p style="margin-top: 30px;">We hope to see you again soon!</p>
      `;
            break;
        default:
            statusEmoji = '📝';
            statusMessage = 'Order status updated';
            nextSteps = '<p>Your order status has been updated. Check your account for more details.</p>';
    }
    return `
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
        .status-badge { display: inline-block; padding: 8px 16px; background: #667eea; color: white; border-radius: 20px; font-weight: bold; text-transform: uppercase; font-size: 12px; }
        .footer { background: #f0f0f0; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 14px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">${statusEmoji} Order Status Update</h1>
          <p style="margin: 10px 0 0 0;">${statusMessage}</p>
        </div>
        
        <div class="content">
          <p>Hi ${order.customerName},</p>
          
          <p>Your order status has been updated!</p>
          
          <div class="order-box">
            <p style="margin: 0; color: #666;">Order Number:</p>
            <div class="order-number">${order.orderNumber}</div>
            <p style="margin: 15px 0 0 0;">
              <span class="status-badge">${order.status}</span>
            </p>
          </div>
          
          ${nextSteps}
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="https://infinity-crochet.com/account/orders" style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">
              View Order Details
            </a>
          </div>
          
          <p style="margin-top: 30px;">If you have any questions, feel free to reply to this email or contact us!</p>
          
          <p style="margin-top: 20px;"><strong>The Infinity Crochet Team</strong></p>
        </div>
        
        <div class="footer">
          <p style="margin: 5px 0;">Infinity Crochet</p>
          <p style="margin: 5px 0;">Questions? Contact us at infinitycrochet1@gmail.com</p>
          <p style="margin: 15px 0 5px 0; font-size: 12px;">
            <a href="https://infinity-crochet.com" style="color: #667eea; text-decoration: none;">Visit Our Shop</a> | 
            <a href="https://infinity-crochet.com/account/orders" style="color: #667eea; text-decoration: none;">Track Order</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}
// Cloud Function: Send order confirmation emails (customer + admin)
exports.sendOrderConfirmationEmail = functions.firestore
    .document('orders/{orderId}')
    .onCreate(async (snapshot, context) => {
    const order = snapshot.data();
    console.log(`Processing new order: ${order.orderNumber}`);
    console.log(`Order email: ${order.email || 'NOT FOUND'}`);
    // Validate email exists
    if (!order.email || order.email.trim() === '') {
        console.error(`❌ No email address found for order ${order.orderNumber}. Cannot send confirmation email.`);
        // Still send admin email if possible
        try {
            const adminEmail = {
                from: `Infinity Crochet <${gmailEmail}>`,
                to: 'infinitycrochet1@gmail.com',
                subject: `🔔 New Order #${order.orderNumber} (No Customer Email)`,
                html: generateAdminOrderEmail(order),
            };
            await getTransporter().sendMail(adminEmail);
            console.log(`✅ Admin notification email sent (customer email was missing)`);
        }
        catch (adminError) {
            console.error('❌ Error sending admin notification:', adminError);
        }
        return; // Exit early
    }
    try {
        // Send email to customer
        const customerEmail = {
            from: `Infinity Crochet <${gmailEmail}>`,
            to: order.email,
            subject: `Order Confirmation #${order.orderNumber} - Infinity Crochet`,
            html: generateCustomerOrderEmail(order),
        };
        await getTransporter().sendMail(customerEmail);
        console.log(`✅ Customer confirmation email sent to: ${order.email}`);
        // Send email to admin
        const adminEmail = {
            from: `Infinity Crochet <${gmailEmail}>`,
            to: 'infinitycrochet1@gmail.com',
            subject: `🔔 New Order #${order.orderNumber}`,
            html: generateAdminOrderEmail(order),
        };
        await getTransporter().sendMail(adminEmail);
        console.log(`✅ Admin notification email sent`);
    }
    catch (error) {
        console.error('❌ Error sending order confirmation emails:', error);
        throw error;
    }
});
// Cloud Function: Send status change email to customer
exports.sendOrderStatusChangeEmail = functions.firestore
    .document('orders/{orderId}')
    .onUpdate(async (change, context) => {
    const oldData = change.before.data();
    const newData = change.after.data();
    // Check if status changed
    if (oldData.status === newData.status) {
        console.log('Status unchanged, skipping email');
        return null;
    }
    const oldStatus = oldData.status;
    const newStatus = newData.status;
    console.log(`Order ${newData.orderNumber} status changed: ${oldStatus} → ${newStatus}`);
    // Validate email exists
    if (!newData.email || newData.email.trim() === '') {
        console.error(`❌ No email address found for order ${newData.orderNumber}. Cannot send status update email.`);
        return null;
    }
    // Only send emails for specific status changes
    const emailStatuses = ['processing', 'shipped', 'delivered', 'cancelled'];
    if (!emailStatuses.includes(newStatus)) {
        console.log(`Status ${newStatus} doesn't trigger email, skipping`);
        return null;
    }
    try {
        const statusEmail = {
            from: `Infinity Crochet <${gmailEmail}>`,
            to: newData.email,
            subject: `Order ${newData.orderNumber} - Status Update: ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`,
            html: generateStatusChangeEmail(newData, oldStatus),
        };
        await getTransporter().sendMail(statusEmail);
        console.log(`✅ Status change email sent to: ${newData.email}`);
    }
    catch (error) {
        console.error('❌ Error sending status change email:', error);
        throw error;
    }
    return null;
});
//# sourceMappingURL=index.js.map