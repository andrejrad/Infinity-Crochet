# Shippo Integration Setup Guide
## Infinity Crochet - Real-Time Shipping Rates & Label Creation

---

## ✅ What's Been Implemented

### Easy Parts (Completed):
1. ✅ Shippo SDK installed (`npm install shippo`)
2. ✅ API endpoints created:
   - `/api/get-shipping-rates` - Get real-time rates from carriers
   - `/api/create-shipping-label` - Purchase shipping labels
3. ✅ Admin "Create Label" button in orders table

### Medium Parts (Completed):
1. ✅ Real-time rate calculation at checkout
2. ✅ Shipping options displayed to customers
3. ✅ Tracking number saved to orders
4. ✅ Tracking display in order history
5. ✅ Tracking links in admin dashboard

---

## 🔑 Required Setup - Add to `.env.local`

You need to add these environment variables:

```env
# Shippo API Key
SHIPPO_API_KEY=shippo_test_your_key_here

# Your shipping origin address
SHIPPO_FROM_ADDRESS_STREET=123 Main Street
SHIPPO_FROM_CITY=Your City
SHIPPO_FROM_STATE=CA
SHIPPO_FROM_ZIP=90001
```

### How to Get Your Shippo API Key:

1. **Create Shippo Account** (free):
   - Go to: https://goshippo.com/
   - Click "Get Started" or "Sign Up"
   - Fill in your business details

2. **Get API Key**:
   - Log into Shippo Dashboard
   - Go to **Settings** → **API**
   - Copy your **Test API Key** (starts with `shippo_test_`)
   - For production, use **Live API Key** (starts with `shippo_live_`)

3. **Add to `.env.local`**:
   ```env
   SHIPPO_API_KEY=shippo_test_abc123...
   ```

4. **Set Your Shipping Address**:
   - This is where you ship FROM
   - Use your actual business/home address
   ```env
   SHIPPO_FROM_ADDRESS_STREET=456 Oak Avenue
   SHIPPO_FROM_CITY=Los Angeles
   SHIPPO_FROM_STATE=CA
   SHIPPO_FROM_ZIP=90015
   ```

---

## 📦 How It Works

### Customer Checkout Flow:

1. **Customer fills shipping address**
2. **Clicks "Get Rates" button**
3. **System shows real carrier rates:**
   - USPS First Class: ~$4-6
   - USPS Priority: ~$8-12
   - UPS Ground: ~$10-15
   - FedEx: ~$12-18
4. **Customer selects preferred shipping method**
5. **Exact cost added to order total**
6. **Completes payment via Stripe**

### Admin Label Creation Flow:

1. **Order appears in `/admin/orders`**
2. **Click "📦 Create Label" button**
3. **Shippo purchases shipping label**
4. **Label PDF opens in new tab (print it!)**
5. **Tracking number saved to order**
6. **Customer can track package**

---

## 💰 Typical Package Settings

The system assumes these defaults (adjust in `/api/get-shipping-rates.ts`):

```typescript
// Weight: 8 oz per crochet item
const totalWeight = items.reduce((sum, item) => sum + (item.quantity * 8), 0);

// Package dimensions
const parcel = {
  length: "12",   // inches
  width: "10",    // inches
  height: "6",    // inches
  weight: totalWeight,
  mass_unit: "oz",
};
```

### Customize for Your Products:

Edit `src/pages/api/get-shipping-rates.ts`:

```typescript
// If your items are heavier:
const totalWeight = items.reduce((sum, item) => sum + (item.quantity * 16), 0); // 16 oz = 1 lb

// If you use different box sizes:
const parcel = {
  length: "14",
  width: "12", 
  height: "8",
  // ...
};
```

---

## 🧪 Testing

### Test with Shippo Test Mode:

1. Use test API key (`shippo_test_...`)
2. Go to checkout on your site
3. Fill in shipping address
4. Click "Get Rates"
5. **You'll see real rates** from carriers
6. Select one and complete checkout
7. In admin, click "Create Label"
8. **Test labels are FREE** - no charges

### Test Addresses:

```
Test Address (always works):
123 Main St
San Francisco, CA 94105
United States
```

---

## 🚀 Supported Carriers

Shippo supports:
- ✅ USPS (best for lightweight items)
- ✅ UPS
- ✅ FedEx
- ✅ DHL Express
- ✅ Canada Post (for Canadian shipping)
- ✅ Many more regional carriers

---

## 📋 Deployment Checklist

Before deploying with Shippo:

1. ✅ Add `SHIPPO_API_KEY` to `.env.local`
2. ✅ Add shipping origin address variables
3. ✅ Test checkout flow locally
4. ✅ Test label creation
5. ✅ Build project: `npm run build`
6. ✅ Deploy: `firebase deploy`
7. ✅ Test on production URL
8. ✅ Switch to live API key when ready

---

## 💡 Pricing

**Shippo is FREE to use:**
- No monthly fees
- No setup costs
- You only pay for shipping labels you purchase
- Get discounted carrier rates (up to 90% off retail!)

**Example Savings:**
- USPS First Class: $3.50 (vs $5.50 retail) - Save $2
- USPS Priority: $8.45 (vs $10.50 retail) - Save $2.05
- UPS Ground: $9.25 (vs $14.00 retail) - Save $4.75

---

## 🎯 Features Implemented

### Checkout Page:
- ✅ "Get Rates" button
- ✅ Real-time carrier rate display
- ✅ Selectable shipping methods
- ✅ Estimated delivery days
- ✅ Total updates with selected shipping

### Admin Orders Page:
- ✅ Tracking column in table
- ✅ "Create Label" button per order
- ✅ One-click label purchasing
- ✅ Auto-opens label PDF
- ✅ Tracking number display
- ✅ Tracking URL links

### Customer Order History:
- ✅ Tracking information display
- ✅ Carrier name
- ✅ Tracking number
- ✅ "Track Package" link
- ✅ Package status

---

## 🔧 Customization Options

### Change Default Package Weight:

Edit `src/pages/api/get-shipping-rates.ts`:
```typescript
// Line ~29
const totalWeight = items.reduce((sum: number, item: any) => {
  return sum + (item.quantity * YOUR_WEIGHT_PER_ITEM); // Change 8 to your weight
}, 0);
```

### Change Package Dimensions:

Edit same file:
```typescript
// Line ~48
const parcel = {
  length: "YOUR_LENGTH",
  width: "YOUR_WIDTH",
  height: "YOUR_HEIGHT",
  // ...
};
```

### Add More Countries:

Edit `src/pages/checkout.tsx`:
```typescript
<option value="US">United States</option>
<option value="CA">Canada</option>
<option value="GB">United Kingdom</option>
<option value="AU">Australia</option>
<option value="DE">Germany</option>  // Add more
<option value="FR">France</option>   // Add more
```

---

## ❓ Troubleshooting

### "Failed to get shipping rates"
- Check your `SHIPPO_API_KEY` in `.env.local`
- Verify shipping origin address is complete
- Check console for detailed error

### "Failed to create label"
- Ensure you have a Shippo account
- Check API key is correct
- Verify test mode vs live mode matches
- Check you have sufficient balance (live mode)

### Rates not showing
- Verify address is complete (street, city, state, zip)
- Check console network tab for API errors
- Ensure Shippo API is reachable

---

## 📞 Support

**Shippo Documentation:**
- https://goshippo.com/docs

**Shippo Support:**
- support@goshippo.com

**Test API Sandbox:**
- https://goshippo.com/docs/intro/

---

## ✨ Next Steps

1. **Add `.env` variables** as shown above
2. **Test locally** with `npm run dev`
3. **Try creating a test label**
4. **Deploy** with `firebase deploy`
5. **Start shipping!** 🚀

Your customers will now see real carrier rates,
and you'll save money on every label! 📦✨
