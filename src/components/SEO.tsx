import Head from 'next/head';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

export default function SEO({ 
  title = 'Infinity Crochet - Handmade Crochet Creations',
  description = 'Discover unique handmade crochet items including amigurumi, bags, clothing, and home décor. Every piece is crafted with love and care.',
  image = '/og-image.jpg',
  url = 'https://infinity-crochet.com'
}: SEOProps) {
  const fullTitle = title.includes('Infinity Crochet') ? title : `${title} | Infinity Crochet`;
  
  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
      
      {/* Additional Meta Tags */}
      <meta name="keywords" content="crochet, handmade, amigurumi, bags, clothing, home decor, custom crochet, infinity crochet" />
      <meta name="author" content="Infinity Crochet" />
      <link rel="canonical" href={url} />
    </Head>
  );
}
