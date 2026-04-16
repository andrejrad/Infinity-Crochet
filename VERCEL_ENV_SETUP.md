# Vercel Environment Variables Setup

## Required Environment Variables for Training Programs

To enable the Training Programs purchase functionality, you need to configure these environment variables in Vercel:

### 1. Go to Vercel Dashboard
- Visit https://vercel.com/
- Select your `infinity-crochet` project
- Go to **Settings** → **Environment Variables**

### 2. Add the following variables:

#### Already Configured (from previous setup):
- `STRIPE_SECRET_KEY` - Your Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Your Stripe webhook secret
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID` - infinity-crochet
- `FIREBASE_CLIENT_EMAIL` - From Firebase Admin SDK
- `FIREBASE_PRIVATE_KEY` - From Firebase Admin SDK

#### NEW - Required for Training Programs:
```
NEXT_PUBLIC_BASE_URL=https://infinity-crochet.com
```

### 3. Important Notes:

- Make sure to set the environment for: **Production**, **Preview**, and **Development**
- After adding the variable, you need to **redeploy** for changes to take effect
- The `NEXT_PUBLIC_BASE_URL` should NOT have a trailing slash

### 4. Redeploy

After adding the environment variable:
```bash
vercel --prod
```

## Troubleshooting

If you're still getting 500 errors after adding `NEXT_PUBLIC_BASE_URL`:

1. **Check Vercel logs:**
   - Go to Vercel Dashboard → Your Project → Deployments
   - Click on the latest deployment
   - Go to **Functions** tab
   - Look for errors in `api/create-program-checkout`

2. **Verify all environment variables are set correctly**

3. **Check that Firebase Admin credentials are valid**

## Testing

After deployment, you can test by:
1. Creating a test program in admin panel
2. Clicking "Purchase Program" on the program detail page
3. You should be redirected to Stripe checkout

If you see an alert with a specific error message, check the Vercel function logs for details.
