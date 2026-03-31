# Infinity Crochet Website

A modern, mobile-first website for **Infinity Crochet** - a handmade crochet business. Features a beautiful landing page, integrated web shop, **full authentication system**, and **admin product management**.

## 🎨 Design

- **Colors**: Lilac (#C8A2C8) and Purple (#7D3C98)
- **Style**: Soft, elegant, handmade aesthetic
- **Typography**: Playfair Display (headings) + Inter (body)
- **Approach**: Mobile-first, responsive design

## 🛠 Tech Stack

- **Next.js 14** - React framework with SSG
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **React** - Component-based UI
- **Firebase** - Authentication, Firestore database, hosting
- **Firebase Auth** - User authentication system
- **Firestore** - NoSQL database for products & users

## 📁 Project Structure

```
Infinity-Crochet/
├── src/
│   ├── components/          # Reusable React components
│   │   ├── Hero.tsx         # Landing page hero section
│   │   ├── CategoryTile.tsx # Category grid item
│   │   ├── ProductCard.tsx  # Product card component
│   │   ├── Footer.tsx       # Site footer
│   │   ├── Navbar.tsx       # Navigation bar (auth-aware)
│   │   ├── SEO.tsx          # SEO meta tags component
│   │   └── ProtectedRoute.tsx # Route protection HOC
│   │
│   ├── contexts/            # React contexts
│   │   └── AuthContext.tsx  # Authentication state management
│   │
│   ├── lib/                 # Utilities and config
│   │   └── firebase.ts      # Firebase initialization
│   │
│   ├── types/               # TypeScript definitions
│   │   └── user.ts          # User, Product, Order types
│   │
│   ├── pages/               # Next.js pages (auto-routing)
│   │   ├── _app.tsx         # App wrapper with AuthProvider
│   │   ├── _document.tsx    # HTML document
│   │   ├── index.tsx        # Landing page
│   │   ├── login.tsx        # Login page
│   │   ├── signup.tsx       # Signup page
│   │   ├── account.tsx      # User account page
│   │   ├── shop/
│   │   │   ├── index.tsx                  # Shop main page
│   │   │   ├── category/[slug].tsx        # Category page
│   │   │   └── product/[slug].tsx         # Product detail page
│   │   └── admin/           # Admin pages (protected)
│   │       ├── index.tsx                  # Admin dashboard
│   │       ├── migrate.tsx                # Data migration tool
│   │       ├── users.tsx                  # User management
│   │       ├── categories.tsx             # Category management
│   │       ├── orders.tsx                 # Order management
│   │       └── products/
│   │           ├── index.tsx              # Product list
│   │           ├── new.tsx                # Add product form
│   │           └── edit/[id].tsx          # Edit product form
│   │
│   ├── data/                # Static data files (backup)
│   │   ├── categories.json  # Product categories
│   │   └── products.json    # Sample products
│   │
│   └── styles/
│       └── globals.css      # Global styles + Tailwind
│
├── public/                  # Static assets
│   └── images/              # Product and category images
│       ├── categories/      # Category images (TO BE ADDED)
│       └── products/        # Product images (TO BE ADDED)
│
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Install dependencies:**

```bash
npm install
```

2. **Run the development server:**

```bash
npm run dev
```

3. **Open your browser:**

Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 📝 Customization Guide

### 1. Add Your Product Images

Replace placeholder product images in `/public/images/products/`:

- `bunny.jpg`, `bunny-2.jpg`
- `tote.jpg`, `tote-2.jpg`
- `cardigan.jpg`, `cardigan-2.jpg`
- `cushion.jpg`
- `bear.jpg`
- `crossbody.jpg`
- `ornaments.jpg`
- `blanket.jpg`

**Image recommendations:**
- Format: JPG or WebP
- Size: 1200x1200px minimum
- Quality: High resolution
- Background: Clean, well-lit

### 2. Add Category Images

Add images to `/public/images/categories/`:

- `amigurumi.jpg`
- `bags.jpg`
- `clothing.jpg`
- `home-decor.jpg`
- `seasonal.jpg`
- `custom.jpg`

### 3. Update Product Data

Edit `src/data/products.json` to add/modify products:

```json
{
  "id": "unique-id",
  "name": "Product Name",
  "slug": "product-name",
  "category": "category-id",
  "price": 35.00,
  "description": "Product description",
  "image": "/images/products/image.jpg",
  "images": ["/images/products/image.jpg", "/images/products/image-2.jpg"],
  "featured": true,
  "inStock": true,
  "tags": ["tag1", "tag2"]
}
```

### 4. Update Categories

Edit `src/data/categories.json` to modify categories:

```json
{
  "id": "category-id",
  "name": "Category Name",
  "slug": "category-name",
  "description": "Category description",
  "image": "/images/categories/image.jpg",
  "featured": true
}
```

### 5. Update Contact Information

Search for `infinitycrochet1@gmail.com` across the project and replace with your actual email address.

Files to update:
- `src/components/Footer.tsx`
- `src/pages/index.tsx`
- `src/pages/shop/product/[slug].tsx`

### 6. Update Social Media Links

Update links in `src/components/Footer.tsx`:
- Instagram: Currently set to `@crochet_by_infinity`
- TikTok: Currently set to `@crochet_by_infinity`
- Tedooo Shop: Update the shop URL

## 🎯 Features

### Landing Page
- ✅ Hero section with gradient background
- ✅ About section with brand story
- ✅ Category tiles grid
- ✅ Featured products showcase
- ✅ Training section (online & in-person)
- ✅ Call-to-action sections
- ✅ Responsive navigation with mobile menu

### Shop
- ✅ Category browsing
- ✅ Product listing pages
- ✅ Product detail pages
- ✅ Related products
- ✅ Stock status indicators
- ✅ Breadcrumb navigation

### 🔐 Authentication & User Management
- ✅ Email/password authentication
- ✅ User signup and login
- ✅ Protected routes
- ✅ Role-based access (admin/user)
- ✅ User profile page
- ✅ Persistent authentication state
- ✅ Secure logout

### 👤 User Features
- ✅ Create account
- ✅ Login/logout
- ✅ View account details
- ✅ Account dashboard
- ✅ Order history placeholder (ready for implementation)

### 🛠️ Admin Dashboard
- ✅ **Product Management:**
  - View all products in table
  - Add new products
  - Edit existing products
  - Delete products
  - Product image management
  - Category assignment
  - Stock status control
  - Featured products toggle
  - Tag management
- ✅ **User Management:**
  - View all users
  - Assign admin roles
  - Remove admin roles
- ✅ **Data Migration:**
  - One-click JSON to Firestore migration
  - Progress tracking
- ✅ **Admin-only access** with route protection
- ✅ **Statistics dashboard** (products, categories, orders)

### Technical Features
- ✅ SEO-optimized with meta tags
- ✅ Open Graph tags for social sharing
- ✅ Smooth scroll navigation
- ✅ Hover animations
- ✅ Mobile-first responsive design
- ✅ Accessible HTML structure
- ✅ Static Site Generation (SSG)
- ✅ Type-safe with TypeScript
- ✅ Firebase Authentication integration
- ✅ Firestore database integration
- ✅ Real-time data updates
- ✅ Firebase Hosting ready

## 🎨 Color Palette

```css
Lilac: #C8A2C8
Lilac Light: #E5D4E5
Lilac Dark: #B08FB0

Purple: #7D3C98
Purple Light: #9B59B6
Purple Dark: #5B2C6F
```

## 📱 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🔐 Authentication Setup

**Before deploying, set up Firebase Authentication and Firestore:**

### Quick Setup:

1. **Configure Firebase:**
   - Copy `.env.local.example` to `.env.local`
   - Add your Firebase config values
   - See **[AUTH-SETUP-GUIDE.md](AUTH-SETUP-GUIDE.md)** for detailed instructions

2. **Enable Services:**
   - Firebase Authentication (Email/Password)
   - Firestore Database
   - Set up security rules (provided in guide)

3. **Create Admin Account:**
   - Sign up on website
   - Change role to "admin" in Firestore
   - Access admin panel at `/admin`

4. **Migrate Products:**
   - Login as admin
   - Visit `/admin/migrate`
   - Click "Start Migration"

📖 **Complete Guide:** [AUTH-SETUP-GUIDE.md](AUTH-SETUP-GUIDE.md)

## 🌐 Deployment

### 🔥 Deploy to Firebase (Configured & Recommended)

**Your project is ready for Firebase Hosting!**

1. **Login to Firebase:**
   ```bash
   firebase login
   ```

2. **Create/Select Firebase Project:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create new project named "infinity-crochet" (or use existing)
   - Or run: `firebase use --add`

3. **Deploy:**
   ```bash
   npm run deploy
   ```

4. **View your live site:**
   - `https://infinity-crochet.web.app`
   - `https://infinity-crochet.firebaseapp.com`

**📖 Detailed Instructions:** See [FIREBASE-DEPLOYMENT.md](FIREBASE-DEPLOYMENT.md) for complete step-by-step guide including custom domain setup.

### Alternative: Deploy to Vercel

1. Push your code to GitHub
2. Import project to [Vercel](https://vercel.com)
3. Vercel will auto-detect Next.js and deploy

### Alternative: Deploy to Netlify

1. Build the project: `npm run build`
2. Deploy the `out` folder to Netlify

## 📞 Support & Contact

For questions about this website, contact:
- **Email**: infinitycrochet1@gmail.com
- **Instagram**: [@crochet_by_infinity](https://www.instagram.com/crochet_by_infinity)

## 📄 License

This project is proprietary and confidential.

---

**Built with ❤️ for Infinity Crochet**
