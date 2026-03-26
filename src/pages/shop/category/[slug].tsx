import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ProductCard from '@/components/ProductCard';
import SEO from '@/components/SEO';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';
import type { Category, Product } from '@/types/user';

export default function CategoryPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      try {
        // Find category by slug
        const categoriesRef = collection(db, 'categories');
        const categoriesSnapshot = await getDocs(categoriesRef);
        const categoryDoc = categoriesSnapshot.docs.find(doc => doc.data().slug === slug);
        
        if (!categoryDoc) {
          router.push('/404');
          return;
        }

        const categoryData = {
          id: categoryDoc.id,
          ...categoryDoc.data()
        } as Category;
        setCategory(categoryData);

        // Fetch products for this category
        const productsRef = collection(db, 'products');
        const productsQuery = query(productsRef, where('category', '==', categoryData.id));
        const productsSnapshot = await getDocs(productsQuery);
        const productsData = productsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Product[];
        setProducts(productsData);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching category data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [slug, router]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-purple"></div>
      </div>
    );
  }

  if (!category) {
    return null;
  }
  return (
    <>
      <SEO 
        title={`${category.name} - Shop`}
        description={category.description}
        url={`https://infinity-crochet.com/shop/category/${category.slug}`}
      />
      
      {/* Category Header */}
      <section className="gradient-bg pt-32 pb-20">
        <div className="container-custom">
          <nav className="text-white/80 mb-6 text-sm">
            <Link href="/" className="hover:text-white">Home</Link>
            {' / '}
            <Link href="/shop" className="hover:text-white">Shop</Link>
            {' / '}
            <span className="text-white">{category.name}</span>
          </nav>
          
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            {category.name}
          </h1>
          <p className="text-xl text-white/90 max-w-2xl">
            {category.description}
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          {products.length > 0 ? (
            <>
              <div className="mb-8">
                <p className="text-gray-600">
                  Showing {products.length} {products.length === 1 ? 'product' : 'products'}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.map(product => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🧶</div>
              <h2 className="text-2xl font-semibold text-purple-dark mb-2">
                No products yet
              </h2>
              <p className="text-gray-600 mb-8">
                We're working on adding beautiful items to this category. Check back soon!
              </p>
              <Link href="/shop" className="btn-primary">
                Browse All Categories
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
