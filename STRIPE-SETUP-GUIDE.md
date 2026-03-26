# Stripe E-Commerce Setup Guide
## Infinity Crochet - Complete Configuration

---

## ✅ Implementation Complete!

Your full shopping cart and checkout system has been successfully built. Here's what we added:

### 📦 New Pages (23 total, up from 20)
- **`/checkout`** - Customer information and checkout form
- **`/order/success`** - Order confirmation page
- **`/account/orders`** - Customer order history

### 🔌 New API Routes
- **`/api/create-payment-intent`** - Creates Stripe Checkout session
- **`/api/webhook`** - Handles payment confirmations and creates orders

### 📚 New Dependencies Installed
- `stripe` - Stripe server SDK
- `@stripe/stripe-js` - Stripe client SDK
- `@stripe/react-stripe-js` - React Stripe components
- `firebase-admin` - Firebase Admin SDK for server-side operations

---

## 🚀 IMPORTANT: Additional Setup Required

Your code is ready, but you need to configure a few more environment variables for the system to work.

### Step 1: Get Firebase Service Account Credentials

The webhook needs Firebase Admin credentials to create orders in Firestore.

1. Go to **Firebase Console**: https://console.firebase.google.com/
2. Select your **Infinity Crochet** project
3. Click the **gear icon** ⚙️ next to "Project Overview"
4. Click **"Project settings"**
5. Go to the **"Service accounts"** tab
6. Click **"Generate new private key"**
7. Download the JSON file (keep it secure!)

### Step 2: Add Firebase Admin Credentials to .env.local

Open the downloaded JSON file and add these to your `.env.local`:

```env
# Firebase Admin (for webhook order creation)
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@infinity-crochet.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYourPrivateKeyHere\n-----END PRIVATE KEY-----\n"
```

**⚠️ CRITICAL:**
- Keep the `FIREBASE_PRIVATE_KEY` in quotes
- Make sure it includes the `\n` characters (they're important!)
- **NEVER commit this file to Git!**

### Step 3: Set Up Stripe Webhook

For the webhook to create orders after successful payments:

1. Go to **Stripe Dashboard**: https://dashboard.stripe.com/test/webhooks
2. Click **"Add endpoint"**
3. Enter your endpoint URL:
   ```
   https://infinity-crochet.web.app/api/webhook
   ```
   (Or your development URL for testing: `http://localhost:3000/api/webhook`)

4. Select events to listen for:
   - `checkout.session.completed`

5. Click **"Add endpoint"**
6. Copy the **"Signing secret"** (starts with `whsec_`)

### Step 4: Add Webhook Secret to .env.local

```env
# Stripe Webhook Secret
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### Your Complete .env.local File

After all steps, your `.env.local` should have:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=infinity-crochet.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=infinity-crochet
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=infinity-crochet.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=805800169806
NEXT_PUBLIC_FIREBASE_APP_ID=1:805800169806:web:...

# Stripe Keys (LIVE MODE - use test keys for development!)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...

# Stripe Webhook Secret
STRIPE_WEBHOOK_SECRET=whsec_...

# Firebase Admin (for webhook order creation)
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-...@infinity-crochet.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

---

## 🧪 Testing the Checkout Flow

### Local Development Testing

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Test the cart:**
   - Go to a product page
   - Add items to cart
   - View cart at `/cart`
   - Proceed to checkout

3. **Use Stripe Test Cards:**
   
   **For live mode**, you'll need test mode keys. Get them from:
   - Stripe Dashboard → Developers → API keys → **Toggle to "Test mode"**
   - Replace your keys with test keys (pk_test_ and sk_test_)
   
   **Test card numbers:**
   - Success: `4242 4242 4242 4242`
   - 3D Secure: `4000 0025 0000 3155`
   - Decline: `4000 0000 0000 0002`
   - Any future expiry date, any 3-digit CVC

4. **Complete checkout:**
   - Fill in customer info
   - Click "Proceed to Payment"
   - You'll be redirected to Stripe Checkout
   - Enter test card details
   - Complete payment
   - You should be redirected to `/order/success`

5. **Verify order creation:**
   - Check Firebase Console → Firestore → `orders` collection
   - Order should appear with all details
   - Customer can view it at `/account/orders`
   - Admin can manage it at `/admin/orders`

### For Local Webhook Testing

Stripe webhooks don't work on localhost by default. You have two options:

**Option 1: Use Stripe CLI (Recommended for development)**
```bash
# Install Stripe CLI: https://stripe.com/docs/stripe-cli
stripe listen --forward-to localhost:3000/api/webhook

# In another terminal, trigger test events:
stripe trigger checkout.session.completed
```

**Option 2: Deploy to Firebase and test on production URL**
```bash
npm run build
firebase deploy
```
Then test on https://infinity-crochet.web.app

---

## 📊 Admin Order Management

Log in as admin and go to `/admin/orders` to:
- View all orders
- Filter by status (pending, processing, shipped, delivered, cancelled)
- Update order status
- View customer details and shipping addresses
- Track revenue

---

## 🎯 Production Deployment Checklist

Before going live with real payments:

### 1. Security
- [ ] Confirm `.env.local` is in `.gitignore`
- [ ] Never expose secret keys in code
- [ ] Use live Stripe keys only in production
- [ ] Enable Stripe fraud detection

### 2. Stripe Configuration
- [ ] Switch from test to live mode in Stripe Dashboard
- [ ] Update `.env.local` with **live** keys (pk_live_ and sk_live_)
- [ ] Set up production webhook endpoint
- [ ] Add webhook signing secret
- [ ] Configure Stripe payment methods (cards, wallets, etc.)

### 3. Firebase
- [ ] Set up proper Firestore security rules for `orders` collection
- [ ] Configure Firebase Admin service account
- [ ] Set environment variables in Firebase Hosting

### 4. Testing
- [ ] Test full checkout flow on production
- [ ] Verify order creation in Firestore
- [ ] Test order status updates from admin panel
- [ ] Check email notifications (if configured)
- [ ] Test with different amounts (free shipping threshold)

### 5. Customer Experience
- [ ] Verify shipping costs are accurate
- [ ] Confirm tax calculation is correct (currently 8%)
- [ ] Test on mobile devices
- [ ] Verify order confirmation emails

---

## 🔧 Customization Options

### Adjust Tax Rate
Edit [src/pages/cart.tsx](src/pages/cart.tsx) and [src/pages/checkout.tsx](src/pages/checkout.tsx):
```typescript
const tax = subtotal * 0.08; // Change 0.08 to your tax rate
```

### Adjust Free Shipping Threshold
Edit the same files:
```typescript
const shipping = subtotal >= 50 ? 0 : 10; // Change $50 threshold or $10 shipping cost
```

### Add More Countries
Edit [src/pages/checkout.tsx](src/pages/checkout.tsx):
```typescript
<option value="Germany">Germany</option>
<option value="France">France</option>
// etc.
```

And update [src/pages/api/create-payment-intent.ts](src/pages/api/create-payment-intent.ts):
```typescript
shipping_address_collection: {
  allowed_countries: ['US', 'CA', 'GB', 'AU', 'DE', 'FR'], // Add more
}
```

---

## 📧 Email Notifications (Optional)

To send order confirmation emails, you can:

1. **Use Stripe's built-in emails** (enabled by default)
2. **Use Firebase Extensions:**
   ```bash
   firebase ext:install firestore-send-email
   ```
3. **Use a service like SendGrid, Mailgun, or Postmark**

---

## 🐛 Troubleshooting

### Orders Not Being Created

**Check:**
1. Webhook is set up correctly in Stripe Dashboard
2. `STRIPE_WEBHOOK_SECRET` is in `.env.local`
3. Firebase Admin credentials are correct
4. Webhook endpoint is accessible (not localhost)

**Debug:**
- Check Stripe Dashboard → Developers → Webhooks → Your endpoint → "Events"
- Look for errors in webhook delivery
- Check browser console for errors
- Check Firebase Functions logs (if using Functions)

### Payment Intent Creation Fails

**Check:**
1. Stripe secret key is correct
2. Cart has items
3. Customer information is filled in
4. Network connection is stable

**Debug:**
- Open browser console during checkout
- Look for API errors
- Check Stripe Dashboard → Developers → Logs

### Can't Access Admin Orders Page

**Check:**
1. You're logged in as admin
2. Admin email is: `admin@infinitycrochet.com`
3. Admin authentication is working

---

## 📞 Support

Having issues? Check:
- Stripe Dashboard → Developers → Logs
- Firebase Console → Firestore → `orders`
- Browser console for errors
- Network tab for failed requests

---

## 🎉 You're Ready!

Your complete e-commerce system is built and ready to test. Follow the steps above to:
1. Add Firebase Admin credentials
2. Set up Stripe webhook
3. Test the checkout flow
4. Deploy to production

Happy selling! 🧶✨