# Vercel Environment Variables Setup

## Required Environment Variables for Training Programs

The Training Programs feature uses the **same Stripe configuration** as the existing webshop checkout. No additional environment variables are needed!

### Already Configured (from webshop setup):
- `STRIPE_SECRET_KEY` - Your Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Your Stripe webhook secret
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID` - infinity-crochet
- `FIREBASE_CLIENT_EMAIL` - From Firebase Admin SDK
- `FIREBASE_PRIVATE_KEY` - From Firebase Admin SDK

### How It Works:

The program checkout reuses the same Stripe integration as product checkout:
- Uses `req.headers.origin` for dynamic URLs (works in all environments)
- No hardcoded base URLs needed
- Works automatically in development, preview, and production

## Troubleshooting

If you're getting 500 errors when clicking "Purchase Program":

1. **Check Vercel function logs:**
   - Go to Vercel Dashboard → Your Project → Deployments
   - Click on the latest deployment
   - Go to **Functions** tab
   - Look for errors in `api/create-program-checkout`

2. **Verify Stripe webhook is configured:**
   - The webhook should already be handling product orders
   - The same webhook handles program purchases (metadata.type === 'program')

3. **Check that Firebase Admin credentials are valid**

## Testing

After deployment, you can test by:
1. Creating a test program in admin panel
2. Clicking "Purchase Program" on the program detail page
3. You should be redirected to Stripe checkout
4. Complete purchase with test card (4242 4242 4242 4242)
5. Verify program appears in "My Programs" after purchase
