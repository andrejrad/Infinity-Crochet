# SETUP CHECKLIST

Follow these steps to complete your Infinity Crochet website setup:

## ✅ Initial Setup

- [x] Install Node.js (v18 or higher)
- [ ] Run `npm install` in the project directory
- [ ] Run `npm run dev` to start development server
- [ ] Visit http://localhost:3000 to see your site

## 📸 Add Your Images

### Category Images (Priority: HIGH)
- [ ] Add `amigurumi.jpg` to `/public/images/categories/`
- [ ] Add `bags.jpg` to `/public/images/categories/`
- [ ] Add `clothing.jpg` to `/public/images/categories/`
- [ ] Add `home-decor.jpg` to `/public/images/categories/`
- [ ] Add `seasonal.jpg` to `/public/images/categories/`
- [ ] Add `custom.jpg` to `/public/images/categories/`

### Product Images (Priority: HIGH)
- [ ] Add product images to `/public/images/products/`
- [ ] Replace all placeholder images listed in `/public/images/products/README.md`

### Other Images
- [ ] Add `favicon.ico` to `/public/`
- [ ] Add `og-image.jpg` (1200x630px) to `/public/` for social media sharing

## 📝 Update Content

### Contact Information
- [ ] Replace `infinitycrochet1@gmail.com` with your actual email in:
  - `/src/components/Footer.tsx`
  - `/src/pages/index.tsx`
  - `/src/pages/shop/product/[slug].tsx`

### Social Media Links
- [ ] Verify Instagram link in `/src/components/Footer.tsx`
- [ ] Verify TikTok link in `/src/components/Footer.tsx`
- [ ] Verify Tedooo shop link in `/src/components/Footer.tsx`

### Product Data
- [ ] Edit `/src/data/products.json` with your actual products
- [ ] Update product prices
- [ ] Update product descriptions
- [ ] Update stock status
- [ ] Add product images paths

### Category Data
- [ ] Review `/src/data/categories.json`
- [ ] Adjust category descriptions if needed
- [ ] Ensure all categories match your offerings

## 🎨 Customization (Optional)

- [ ] Review color scheme in `/tailwind.config.js`
- [ ] Adjust spacing/padding if needed
- [ ] Customize font choices (currently: Playfair Display + Inter)
- [ ] Update hero section text in `/src/components/Hero.tsx`
- [ ] Update about section in `/src/pages/index.tsx`

## 🚀 Pre-Launch

- [ ] Test all pages on mobile device
- [ ] Test all internal links
- [ ] Test external social media links
- [ ] Verify all images load correctly
- [ ] Check spelling and grammar
- [ ] Test email contact links
- [ ] Run `npm run build` to ensure no errors

## 🔥 Firebase Deployment (Configured & Ready!)

### Firebase Setup
- [x] Firebase CLI installed
- [x] Firebase configuration files created
- [x] Next.js configured for static export
- [x] Build scripts ready
- [ ] Login to Firebase: `firebase login`
- [ ] Select/create Firebase project: `firebase use --add`
- [ ] First deployment: `npm run deploy`

### Verify Deployment
- [ ] Site accessible at `https://infinity-crochet.web.app`
- [ ] All pages load correctly
- [ ] Images display properly
- [ ] Navigation works
- [ ] Mobile view looks good

### Custom Domain (Optional)
- [ ] Connect `infinity-crochet.com` in Firebase Console
- [ ] Add DNS records to domain registrar
- [ ] Wait for DNS propagation (24-48 hours)
- [ ] Verify SSL certificate applied

**📖 Detailed Firebase Guide:** See [QUICKSTART-FIREBASE.md](QUICKSTART-FIREBASE.md)

## 🌐 Alternative Deployment Options

- [ ] Deploy to Vercel (alternative to Firebase)
- [ ] Deploy to Netlify (alternative to Firebase)

## 📊 Post-Launch

- [ ] Set up Google Analytics (optional)
- [ ] Submit sitemap to Google Search Console
- [ ] Share website on social media
- [ ] Monitor for any issues
- [ ] Test site performance with PageSpeed Insights

---

**Questions?** 
- Firebase: See [FIREBASE-DEPLOYMENT.md](FIREBASE-DEPLOYMENT.md)
- General: See [README.md](README.md)
