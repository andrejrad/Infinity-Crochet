# 🔥 Firebase Deployment Guide

Complete guide for deploying your Infinity Crochet website to Firebase Hosting.

## ✅ Prerequisites Completed

- [x] Firebase CLI installed globally
- [x] Firebase tools added to project
- [x] Next.js configured for static export
- [x] Firebase configuration files created
- [x] deployment scripts added to package.json

## 🚀 Step-by-Step Deployment Instructions

### Step 1: Login to Firebase

Open your terminal and run:

```bash
firebase login
```

This will open your browser. Sign in with your Google account.

### Step 2: Create a Firebase Project

You have two options:

**Option A: Create via Firebase Console (Recommended)**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `infinity-crochet` (or your preferred name)
4. Follow the setup wizard
5. Enable Google Analytics (optional)

**Option B: Create via CLI**
```bash
firebase projects:create infinity-crochet
```

### Step 3: Link Your Local Project

If you used a different project name than "infinity-crochet", update `.firebaserc`:

```bash
firebase use --add
```

Select your project from the list.

Alternatively, manually edit `.firebaserc`:
```json
{
  "projects": {
    "default": "your-project-id"
  }
}
```

### Step 4: Build Your Website

Run the build command:

```bash
npm run build
```

This will:
- Build your Next.js site
- Generate static HTML files
- Output everything to the `/out` directory

### Step 5: Deploy to Firebase

Deploy your website:

```bash
firebase deploy
```

Or use the npm script:

```bash
npm run deploy
```

This will:
1. Build your site
2. Upload all files to Firebase Hosting
3. Provide you with a live URL

### Step 6: View Your Live Site

After deployment completes, you'll see a URL like:
```
https://infinity-crochet.web.app
https://infinity-crochet.firebaseapp.com
```

## 🔧 Configuration Details

### What Was Configured

**`next.config.js`:**
- `output: 'export'` - Enables static HTML export
- `images.unoptimized: true` - Required for static export
- `trailingSlash: true` - Better URLs for static hosting

**`firebase.json`:**
- `public: "out"` - Points to Next.js output directory
- Caching headers for images and static assets
- Clean URLs enabled
- 404 page configured

**`package.json`:**
- `npm run export` - Builds the static site
- `npm run deploy` - Builds and deploys in one command

## 🌐 Custom Domain Setup

### Connect Your Domain (infinity-crochet.com)

1. Go to Firebase Console → Hosting
2. Click "Add custom domain"
3. Enter `infinity-crochet.com`
4. Follow the DNS configuration instructions
5. Add the provided TXT and A records to your domain registrar
6. Wait for DNS propagation (can take up to 24 hours)

### Add WWW Subdomain

Also add:
- `www.infinity-crochet.com` (Firebase will auto-redirect)

## 📝 Deployment Workflow

### Making Updates

Every time you make changes:

1. **Edit your files** (components, data, images)
2. **Test locally:**
   ```bash
   npm run dev
   ```
3. **Build and deploy:**
   ```bash
   npm run deploy
   ```

### Quick Deploy Commands

```bash
# Full deploy (recommended)
npm run deploy

# Deploy only (skip build)
firebase deploy --only hosting

# Preview before deploying
firebase hosting:channel:deploy preview
```

## 🔍 Troubleshooting

### Build Errors

If you get build errors:

1. **Check for TypeScript errors:**
   ```bash
   npm run lint
   ```

2. **Clear cache and rebuild:**
   ```bash
   rm -rf .next out
   npm run build
   ```

3. **Check image paths:**
   - All images must be in `/public/images/`
   - Reference as `/images/filename.jpg` (not `public/images/`)

### Deployment Errors

**"Project not found":**
- Run `firebase use --add` to select correct project
- Verify project ID in `.firebaserc`

**"Permission denied":**
- Run `firebase login` again
- Make sure you're logged in with the correct Google account

**"Build failed":**
- Fix any errors shown in the terminal
- Ensure all required files exist
- Check that image paths are correct

### 404 Errors on Refresh

Firebase is configured to handle client-side routing, but if pages show 404:

1. Check that `trailingSlash: true` is in `next.config.js`
2. Verify `firebase.json` has the rewrites section
3. Ensure the build completed successfully

## 📊 Post-Deployment Checklist

After deploying:

- [ ] Visit your live URL
- [ ] Test all pages (Home, Shop, Categories, Products)
- [ ] Test mobile responsive design
- [ ] Check all images load correctly
- [ ] Test all navigation links
- [ ] Test external links (Instagram, TikTok, Tedooo)
- [ ] Test contact email links
- [ ] Check page load speed
- [ ] Test 404 page by visiting a non-existent URL

## 🎯 Performance Tips

### Optimize Before Deploy

1. **Compress images:**
   - Use tools like TinyPNG or ImageOptim
   - Keep images under 500KB when possible
   - Use WebP format for better compression

2. **Check bundle size:**
   ```bash
   npm run build
   ```
   Look at the size report in the terminal

3. **Test performance:**
   - Use Google PageSpeed Insights
   - Aim for 90+ score on mobile

## 🔐 Security Best Practices

1. **Never commit sensitive data:**
   - `.env` files are gitignored
   - Don't hardcode API keys in code

2. **Set up security rules:**
   - Go to Firebase Console → Hosting
   - Review security settings

3. **Enable SSL:**
   - Firebase auto-enables HTTPS
   - All traffic is encrypted

## 📈 Analytics Setup (Optional)

### Add Google Analytics

1. Go to Firebase Console → Analytics
2. Enable Google Analytics
3. Your site will automatically track:
   - Page views
   - User behavior
   - Traffic sources

### View Analytics

- Firebase Console → Analytics Dashboard
- See real-time visitors
- Track conversions and engagement

## 💰 Costs

**Firebase Free Tier (Spark Plan):**
- 10 GB storage
- 360 MB/day data transfer
- **Perfect for small to medium websites**

Your site will likely stay within free tier limits unless you get massive traffic.

## 🆘 Support

### Need Help?

**Firebase Documentation:**
- [Firebase Hosting Docs](https://firebase.google.com/docs/hosting)
- [Next.js Static Export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)

**Common Issues:**
- Check Firebase Status: [status.firebase.google.com](https://status.firebase.google.com/)
- Firebase Support: [firebase.google.com/support](https://firebase.google.com/support)

**Your Project Links:**
- Firebase Console: `https://console.firebase.google.com/project/infinity-crochet`
- Hosting Dashboard: `https://console.firebase.google.com/project/infinity-crochet/hosting`

---

## ⚡ Quick Reference

```bash
# Login
firebase login

# Build site
npm run build

# Deploy
npm run deploy

# Preview deploy
firebase hosting:channel:deploy preview

# View logs
firebase hosting:channel:list
```

**Your site will be live at:**
- `https://infinity-crochet.web.app`
- `https://infinity-crochet.firebaseapp.com`
- `https://infinity-crochet.com` (after domain setup)

---

**Ready to deploy? Start with Step 1! 🚀**
