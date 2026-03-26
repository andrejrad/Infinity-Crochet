# 🚀 Quick Start - Firebase Deployment

Get your Infinity Crochet website live in 5 minutes!

## Prerequisites ✅

- [x] Firebase CLI installed
- [x] Project configured for static export
- [x] Firebase configuration files ready
- [x] Build successful

## Deploy Now! (3 Steps)

### 1️⃣ Login to Firebase

```bash
firebase login
```

Your browser will open. Sign in with your Google account.

### 2️⃣ Initialize Firebase Project

**If you already created a Firebase project:**

```bash
firebase use --add
```

Select `infinity-crochet` from the list (or your project name).

**If you need to create a new project:**

1. Visit [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Name: `infinity-crochet`
4. Follow the setup
5. Then run: `firebase use --add` and select it

### 3️⃣ Deploy!

```bash
npm run deploy
```

That's it! 🎉

Your site will be live at:
- **https://infinity-crochet.web.app**
- **https://infinity-crochet.firebaseapp.com**

## Post-Deployment

### ✅ Test Your Site

Visit your URL and check:
- [ ] Home page loads
- [ ] Shop page works
- [ ] Category pages load
- [ ] Product pages display correctly
- [ ] All links work
- [ ] Mobile view looks good

### 🌐 Connect Custom Domain

To use `infinity-crochet.com`:

1. Go to [Firebase Console](https://console.firebase.google.com/) → Your Project → Hosting
2. Click "Add custom domain"
3. Enter: `infinity-crochet.com`
4. Follow DNS instructions
5. Wait 24-48 hours for DNS propagation

## Making Updates

Whenever you update your site:

```bash
npm run deploy
```

This will:
1. Rebuild your site
2. Deploy to Firebase
3. Update live immediately

## Need Help?

See [FIREBASE-DEPLOYMENT.md](FIREBASE-DEPLOYMENT.md) for:
- Detailed troubleshooting
- Custom domain setup
- Performance optimization
- Analytics setup
- Security best practices

## Quick Commands

```bash
# Login
firebase login

# See current project
firebase use

# Build only
npm run build

# Deploy
npm run deploy

# View hosting URL
firebase hosting:channel:list
```

---

**🎯 Your Next Steps:**

1. Run `firebase login`
2. Run `firebase use --add`
3. Run `npm run deploy`
4. Share your live URL! 🎉

**Happy deploying! 🔥**
