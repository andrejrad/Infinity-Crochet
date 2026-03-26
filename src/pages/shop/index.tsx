import { useState, useEffect } from 'react';
import CategoryTile from '@/components/CategoryTile';
import SEO from '@/components/SEO';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Category } from '@/types/user';

export default function Shop() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesRef = collection(db, 'categories');
        const categoriesSnapshot = await getDocs(categoriesRef);
        const categoriesData = categoriesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Category[];
        setCategories(categoriesData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);
  return (
    <>
      <SEO 
        title="Shop - Handmade Crochet Products"
        description="Browse our full collection of handmade crochet items including amigurumi, bags, clothing, home décor, and custom pieces."
        url="https://infinity-crochet.com/shop"
      />
      
      {/* Hero Banner */}
      <section className="gradient-bg pt-32 pb-20">
        <div className="container-custom text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Our Shop
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Discover our full collection of handmade crochet treasures
          </p>
        </div>
      </section>

      {/* All Categories */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-purple-dark mb-4">
              Shop by Category
            </h2>
            <p className="text-lg text-gray-700">
              Explore our collections and find exactly what you're looking for
            </p>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-purple"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
              {categories.map(category => (
                <CategoryTile key={category.id} {...category} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
