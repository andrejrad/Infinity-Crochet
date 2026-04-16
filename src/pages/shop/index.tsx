import { useState, useEffect } from 'react';
import CategoryTile from '@/components/CategoryTile';
import SEO from '@/components/SEO';
import StarRating from '@/components/StarRating';
import Link from 'next/link';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Category, Product, Review } from '@/types/user';

export default function Shop() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);

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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsRef = collection(db, 'products');
        const productsSnapshot = await getDocs(productsRef);
        const productsData = productsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Product[];
        setAllProducts(productsData);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const reviewsRef = collection(db, 'reviews');
        const reviewsSnapshot = await getDocs(reviewsRef);
        const reviewsData = reviewsSnapshot.docs.map(doc => doc.data()) as Review[];
        setReviews(reviewsData);
        
        if (reviewsData.length > 0) {
          const avg = reviewsData.reduce((sum, review) => sum + review.rating, 0) / reviewsData.length;
          setAverageRating(avg);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);
    const query = searchQuery.toLowerCase();
    const filtered = allProducts.filter(product => 
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      product.tags.some(tag => tag.toLowerCase().includes(query))
    );
    setSearchResults(filtered);
    setSearchLoading(false);
  }, [searchQuery, allProducts]);
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
            Infinity Crochet Shop
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-4">
            Discover full collection of handmade crochet treasures
          </p>
          
          {/* Shop Rating */}
          {reviews.length > 0 && (
            <div className="flex items-center justify-center gap-3 mb-8">
              <StarRating rating={Math.round(averageRating)} readonly size="md" />
              <span className="text-white font-medium">
                {averageRating.toFixed(1)} average rating from {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
              </span>
            </div>
          )}
          
          {/* Global Search */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search all products..."
                className="w-full px-6 py-4 pr-12 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/50 shadow-xl"
              />
              <svg
                className="absolute right-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Search Results */}
      {searchQuery.trim() !== '' && (
        <section className="section-padding bg-gray-50">
          <div className="container-custom">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-purple-dark mb-2">
                Search Results
              </h2>
              <p className="text-gray-600">
                {searchLoading ? 'Searching...' : `${searchResults.length} product${searchResults.length !== 1 ? 's' : ''} found for "${searchQuery}"`}
              </p>
            </div>

            {searchLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-purple"></div>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {searchResults.map(product => (
                  <Link
                    key={product.id}
                    href={`/shop/product/${product.slug}`}
                    className="card group hover:shadow-xl transition-all duration-300"
                  >
                    <div className="aspect-square bg-gray-100 rounded-t-2xl overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-purple-dark mb-2 group-hover:text-purple transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-2xl font-bold text-purple">
                        ${product.price.toFixed(2)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-xl text-gray-600 mb-2">No products found</p>
                <p className="text-gray-500">Try searching with different keywords</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* All Categories */}
      {searchQuery.trim() === '' && (
        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-purple-dark mb-4">
                Shop by Category
              </h2>
              <p className="text-lg text-gray-700">
                Explore all collections and find exactly what you're looking for
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
      )}
    </>
  );
}
