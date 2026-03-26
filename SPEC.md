You are GitHub Copilot. Generate the full project structure, components, and code for a modern, elegant, mobile first website for a crochet business called **Infinity Crochet**.
 
## PROJECT OVERVIEW
Build a combined **landing page + web shop** under a single domain:  
**https://infinity-crochet.com**
 
The landing page is the entry point and must clearly communicate:
- What Infinity Crochet is
- What products and services are offered
- Visual identity: lilac + purple as dominant colors
- Simple, elegant, warm, handmade aesthetic
- Clear navigation to the shop (same domain, no external redirects)
 
The shop should be integrated into the same codebase and domain, not a separate platform.
 
## TECH STACK REQUIREMENTS
Use:
- **HTML5, CSS3, JavaScript** OR **Next.js / React** (choose whichever produces cleaner structure)
- **Responsive design** (mobile-first)
- **Reusable components**
- **Vite or Next.js dev environment**
- **Modern CSS (Tailwind or CSS modules)** — choose the cleaner option
- **Image optimization**
- **SEO-friendly structure**
- **Accessible design**
 
## BRANDING REQUIREMENTS
- Dominant colors: **lilac (#C8A2C8)** and **purple (#7D3C98)**  
- Soft, rounded shapes  
- Handmade, cozy, feminine aesthetic  
- Typography:  
  - Headings: elegant serif  
  - Body: clean sans-serif  
 
## CONTENT SOURCES
Extract product categories and visual style inspiration from:
- https://www.instagram.com/crochet_by_infinity
- https://tedooo.com/shop/655538e626c0d454f5ed35d2
- https://www.tiktok.com/@crochet_by_infinity
 
From these links, infer categories such as (examples):
- Amigurumi
- Bags & Totes
- Clothing & Wearables
- Home Decor
- Seasonal Items
- Custom Orders
 
Use these categories to build the landing page tiles and shop structure.
 
## LANDING PAGE REQUIREMENTS
Create a homepage with:
1. **Hero section**
   - Large welcoming headline
   - Subheadline explaining Infinity Crochet
   - Background in lilac/purple gradient
   - CTA button: “Enter Shop”
 
2. **About section**
   - Short description of the brand
   - Visuals inspired by Instagram feed style
 
3. **Category Tiles Section**
   - Grid of clickable tiles
   - Each tile links to a category page within the same domain
   - Placeholder images (I will replace them later)
 
4. **Featured Products Section**
   - 3–6 items pulled from sample data
   - Clean card layout
 
5. **Personalized training for all levels**
   - Clear description of online and in-person trainings

6. **Footer**
   - Instagram link
   - Tedooo shop link
   - Contact email placeholder
 
## SHOP REQUIREMENTS
Create a simple shop system (static for now):
- Category pages
- Product listing pages
- Product detail pages
- Reusable product card component
- Reusable category tile component
- JSON-based product data structure (I will fill in real data later)
 
## FILE STRUCTURE
Generate a clean, production-ready structure such as:
 
/src  
  /components  
    Hero.jsx  
    CategoryTile.jsx  
    ProductCard.jsx  
    Footer.jsx  
  /pages  
    index.jsx  
    /shop  
      index.jsx  
      [category].jsx  
      [product].jsx  
  /data  
    products.json  
    categories.json  
  /styles  
    globals.css  
    theme.css  
 
(Adjust if using Vite or plain HTML/CSS/JS.)
 
## FUNCTIONAL REQUIREMENTS
- Smooth scroll
- Hover animations
- Mobile menu
- Lazy-loaded images
- SEO meta tags
- OG tags for social sharing
- Clean semantic HTML
 
## WHAT TO GENERATE NOW
1. Full project scaffold  
2. All components  
3. All pages  
4. Placeholder images  
5. Sample product data  
6. CSS theme with lilac/purple palette  
7. Comments explaining where I should insert real images and product data  
 
Start coding immediately. Produce complete files, not partial snippets.