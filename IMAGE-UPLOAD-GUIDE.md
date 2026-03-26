# 📸 Image Upload System - Setup Guide

Your Infinity Crochet admin panel now supports direct image uploads! Admins can upload up to 10 images per product, mark a main image, and manage images easily.

## ✅ What Was Built

### Image Upload Features
- ✅ **Upload up to 10 images** per product
- ✅ **Drag & drop** or click to upload
- ✅ **Image validation** (JPG, PNG, WebP, GIF - max 5MB each)
- ✅ **Preview thumbnails** with hover actions
- ✅ **Set main image** - one click to mark primary product image
- ✅ **Delete images** - remove unwanted images
- ✅ **Add more later** - edit products to add/remove images
- ✅ **Progress indicator** - see upload progress
- ✅ **Stored in Firebase Storage** - secure cloud storage

### Components Created
- `ImageUploadManager` - Reusable image upload component
- `imageUpload.ts` - Helper functions for uploads
- Updated product forms (add & edit)

## 🔧 Firebase Storage Setup Required

### Step 1: Enable Firebase Storage

1. Go to [Firebase Console](https://console.firebase.google.com/project/infinity-crochet)
2. Click **Storage** in the left menu
3. Click **Get Started**
4. Start in **Production mode**
5. Choose your storage location (same as Firestore)
6. Click **Done**

### Step 2: Set Storage Security Rules

In Firebase Console → **Storage** → **Rules** tab, replace the default rules with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Helper function to check if user is admin
    function isAdmin() {
      return request.auth != null && 
             firestore.get(/databases/(default)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Product images - anyone can read, only admins can write
    match /products/{productId}/{allPaths=**} {
      allow read: if true; // Public read access for shop
      allow write: if isAdmin(); // Only admins can upload/delete
    }
    
    // Prevent access to other paths
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

**Important:** Click **Publish** to save the rules!

### Step 3: Update CORS Configuration (Optional)

If you encounter CORS issues when uploading from localhost:

1. Install Google Cloud SDK: https://cloud.google.com/sdk/docs/install
2. Run these commands:

```bash
# Create cors.json file
echo '[{"origin": ["*"], "method": ["GET", "POST", "DELETE"], "maxAgeSeconds": 3600}]' > cors.json

# Set CORS policy
gsutil cors set cors.json gs://infinity-crochet.appspot.com
```

## 🎯 How It Works

### Adding Products

1. **Go to** `/admin/products/new`
2. **Fill in** product details (name, price, description, etc.)
3. **Click "+ Add Images"** or drag & drop images
4. **Upload up to 10 images** (JPG, PNG, WebP, GIF - max 5MB each)
5. **Preview** shows all uploaded images
6. **Click "Set as Main"** on your primary product image
7. **Click "Delete"** to remove unwanted images
8. **Submit** - Images upload to Firebase Storage automatically
9. **Done!** Product is created with uploaded images

### Editing Products

1. **Go to** `/admin/products`
2. **Click "Edit"** on any product
3. **See existing images** loaded automatically
4. **Add more images** using "+ Add Images" button
5. **Delete images** by clicking "Delete" on any image
6. **Change main image** by clicking "Set as Main"
7. **Save Changes** - New images upload, deleted images remove from storage

### Image Management

- **Main Image Badge** - Shows which image is the primary one
- **Image Numbers** - Shows position (1, 2, 3, etc.)
- **Hover Actions** - Set as Main and Delete buttons appear on hover
- **Upload Progress** - Progress bar shows during upload
- **Validation** - Automatic checks for file type and size

## 📊 Storage Structure

Images are organized in Firebase Storage:

```
products/
  ├── product-id-1/
  │   ├── 1234567890-image1.jpg
  │   ├── 1234567890-image2.jpg
  │   └── 1234567890-image3.jpg
  ├── product-id-2/
  │   ├── 1234567891-photo1.png
  │   └── 1234567891-photo2.png
  └── ...
```

Each product has its own folder with timestamped image files.

## 🎨 User Experience

### Upload Interface

```
┌─────────────────────────────────────┐
│  Product Images (3/10)   [+ Add]   │
├─────────────────────────────────────┤
│  ┌────┐  ┌────┐  ┌────┐            │
│  │IMG1│  │IMG2│  │IMG3│            │
│  │Main│  │ 2  │  │ 3  │            │
│  └────┘  └────┘  └────┘            │
│  Hover for actions: Set Main/Delete│
└─────────────────────────────────────┘
```

### Features
- ✅ Visual thumbnails
- ✅ Main image highlighted with purple border
- ✅ Image numbers for reference
- ✅ Hover to see action buttons
- ✅ Progress indicator during upload

## ⚠️ Important Notes

### File Limitations
- **Max 10 images** per product
- **Max 5MB** per image
- **Formats:** JPG, PNG, WebP, GIF only
- **Validation:** Automatic checks prevent invalid files

### Storage Costs (Firebase)
- **Free Tier:** 5GB storage, 1GB/day downloads
- **Your typical usage:** ~100 products × 10 images × 1MB = ~1GB
- **Costs:** Likely free forever, minimal if exceeded
- **Monitoring:** Check Firebase Console → Usage & Billing

### Best Practices
1. **Compress images** before upload (use TinyPNG.com or similar)
2. **Use consistent dimensions** (e.g., 1200x1200px square)
3. **Good lighting** - well-lit, clear product photos
4. **Main image** - Choose your best photo as main
5. **Multiple angles** - Show product from different views
6. **Details** - Include close-ups of textures/details

## 🐛 Troubleshooting

### "Permission denied" when uploading
- Verify you're logged in as admin
- Check Storage security rules are published
- Ensure Firebase Storage is enabled

### Upload fails or hangs
- Check file size (max 5MB)
- Verify file format (JPG, PNG, WebP, GIF)
- Check internet connection
- Try different browser

### Images don't display
- Verify Storage rules allow public read
- Check browser console for errors
- Confirm images uploaded successfully in Storage console

### CORS errors (localhost only)
- Follow CORS configuration steps above
- Or test on deployed site (no CORS issues there)

## 📝 Testing Checklist

Before going live:

- [ ] Firebase Storage enabled
- [ ] Security rules published
- [ ] Test upload single image
- [ ] Test upload multiple images
- [ ] Test set main image
- [ ] Test delete image
- [ ] Test add more images to existing product
- [ ] Test edit product with images
- [ ] Verify images display on shop pages
- [ ] Check images display on mobile
- [ ] Test file size validation
- [ ] Test file type validation

## 🚀 Deployment

When deploying updated code:

```bash
# Build with image upload features
npm run build

# Deploy to Firebase
firebase deploy
```

**Note:** Environment variables (`.env.local`) are not deployed. Firebase config in code is expected to be public.

## 🎯 Next Steps

After setup:

1. ✅ Enable Firebase Storage
2. ✅ Set security rules
3. ✅ Test locally with `npm run dev`
4. ✅ Upload test products with images
5. ✅ Deploy with `npm run deploy`
6. ✅ Test on live site

## 💡 Tips for Product Photography

### Lighting
- Natural window light works best
- Avoid harsh shadows
- Consistent lighting across all photos

### Background
- Clean, uncluttered background
- Neutral colors (white, light gray)
- Or lifestyle shots in context

### Angles
1. Main: Straight-on product shot
2. Detail: Close-up of texture/stitching
3. Scale: Show size reference
4. Context: In-use or lifestyle shot
5. Variations: Different colors/sizes

### Editing
- Adjust brightness/contrast
- Crop to consistent aspect ratio
- Remove distracting elements
- Don't over-edit - keep realistic

---

**Your image upload system is ready! Enable Firebase Storage and start uploading beautiful product photos! 📸**
