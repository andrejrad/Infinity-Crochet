# 🔐 Authentication & Admin System Setup Guide

Complete guide for setting up authentication and managing your Infinity Crochet shop.

## 🚀 Quick Start

### Step 1: Set Up Firebase Web App

1. **Go to [Firebase Console](https://console.firebase.google.com/)**
2. Select your `infinity-crochet` project
3. Click the **gear icon** → **Project settings**
4. Scroll to "Your apps" section
5. Click **"Add app"** → Select **Web app** (</>) icon
6. Give it a nickname: "Infinity Crochet Web"
7. **Copy the configuration object**

### Step 2: Configure Environment Variables

1. Create `.env.local` file in project root:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` with your Firebase config values:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=infinity-crochet.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=infinity-crochet
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=infinity-crochet.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

### Step 3: Enable Authentication

1. In Firebase Console, go to **Authentication** → **Get started**
2. Click **Sign-in method** tab
3. Enable **Email/Password** provider
4. Click **Save**

### Step 4: Enable Firestore Database

1. In Firebase Console, go to **Firestore Database** → **Create database**
2. Start in **Production mode**
3. Choose your database location (closest to your users)
4. Click **Enable**

### Step 5: Set Up Firestore Security Rules

In Firestore Database → **Rules** tab, add these rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
      allow update: if request.auth != null && 
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Products collection
    match /products/{productId} {
      allow read: if true;  // Anyone can view products
      allow create, update, delete: if request.auth != null && 
                                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Categories collection
    match /categories/{categoryId} {
      allow read: if true;
      allow write: if request.auth != null && 
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Orders collection
    match /orders/{orderId} {
      allow read: if request.auth != null && 
                    (request.auth.uid == resource.data.userId || 
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
                              get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

Click **Publish** to save the rules.

## 👤 Creating Your First Admin User

### Method 1: Via Website (Recommended)

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Open** http://localhost:3000

3. **Sign up** for a new account:
   - Click "Sign Up" in the navigation
   - Fill in your details
   - Create your account

4. **Make yourself admin** (Firebase Console):
   - Go to Firebase Console → **Firestore Database**
   - Find the `users` collection
   - Click on your user document
   - Edit the `role` field → Change from `"user"` to `"admin"`
   - Click **Update**

5. **Refresh the page** - You now have admin access!

### Method 2: Direct Firestore Creation

1. Go to Firebase Console → **Firestore Database**
2. Click **+ Start collection**
3. Collection ID: `users`
4. Add a document with your email as ID or auto-ID:
   ```
   email: "your@email.com"
   displayName: "Your Name"
   role: "admin"  
   createdAt: [Click "Add field" → Type: timestamp → "Set to current time"]
   ```
5. Sign up on the website with the same email

## 📊 Migrating Products to Firestore

After setting up authentication:

1. **Login as admin**
2. Go to **Admin Dashboard**
3. Click **"Data Migration"** or visit: `/admin/migrate`
4. Click **"Start Migration"**
5. Wait for completion

This will copy all products from JSON to Firestore. After migration:
- Products are managed through the admin panel
- JSON files remain as backup

## 🛍️ Managing Products

### Add New Product

1. **Admin Dashboard** → **Manage Products**
2. Click **"+ Add New Product"**
3. Fill in product details:
   - Name (auto-generates URL slug)
   - Category
   - Price
   - Description
   - Image URLs
   - Tags
   - Stock status
   - Featured status
4. Click **"Add Product"**

### Edit Product

1. **Admin Dashboard** → **Manage Products**
2. Find the product
3. Click **"Edit"**
4. Update details
5. Click **"Save Changes"**

### Delete Product

1. **Admin Dashboard** → **Manage Products**
2. Find the product
3. Click **"Delete"**
4. Confirm deletion

## 🎨 Image Management

Products use image URLs. To add product images:

### Option 1: Use Public Folder

1. Add images to `/public/images/products/`
2. Reference as: `/images/products/your-image.jpg`
3. Rebuild and deploy:
   ```bash
   npm run deploy
   ```

### Option 2: Use Firebase Storage

1. In Firebase Console → **Storage** → **Get started**
2. Start in production mode
3. Upload images
4. Get public URL
5. Use URL in product image field

## 👥 Managing Users

1. **Admin Dashboard** → **Manage Users**
2. View all registered users
3. Toggle user roles between "User" and "Admin"

**Note:** Always keep at least one admin user!

## 🔒 Security Best Practices

### Protect Your Credentials

1. **Never commit `.env.local`** to git (already in .gitignore)
2. Keep Firebase config values private
3. Rotate API keys if exposed

### Production Deployment

When deploying to Firebase:

1. Firebase automatically uses production config
2. Environment variables are set via `.env.local` (not deployed)
3. Firebase config is public (expected by Firebase)

## 🚦 Current Features

### For Customers
- ✅ Sign up / Login
- ✅ View products
- ✅ Browse categories
- ✅ View account
- ⏳ Purchase flow (coming soon)
- ⏳ Order history (coming soon)

### For Admins
- ✅ Full product management (CRUD)
- ✅ User role management
- ✅ Admin dashboard
- ✅ Product categorization
- ⏳ Order management (coming soon)
- ⏳ Category management (coming soon)

## 🐛 Troubleshooting

### "Firebase not configured" error
- Check `.env.local` file exists
- Verify all NEXT_PUBLIC_* variables are set
- Restart development server

### "Permission denied" when adding products
- Verify user has `role: "admin"` in Firestore
- Check Firestore security rules are published
- Try logging out and back in

### Products not showing in shop
- Run the migration tool at `/admin/migrate`
- Check Firestore has products in `products` collection
- Verify Firestore rules allow public read access

### Can't login
- Verify Email/Password is enabled in Firebase Auth
- Check console for errors
- Ensure `.env.local` is configured correctly

## 📝 Development Workflow

### Local Development

```bash
# Start dev server
npm run dev

# Access admin at
http://localhost:3000/admin
```

### Deploy to Production

```bash
# Build and deploy
npm run deploy

# Or separate steps
npm run build
firebase deploy
```

## 🎯 Next Steps

After setup:

1. ✅ Create your admin account
2. ✅ Migrate products to Firestore
3. ✅ Add your product images
4. ✅ Update product details
5. ✅ Test the admin panel
6. ✅ Invite team members (assign admin role as needed)
7. 🚀 Launch!

## 📞 Need Help?

- **Firebase Documentation:** https://firebase.google.com/docs
- **Next.js Documentation:** https://nextjs.org/docs
- **Check Firestore Rules:** Firebase Console → Firestore → Rules

---

**Your authentication system is ready! Create your admin account and start managing your shop! 🎉**
