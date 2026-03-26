import { useState, useEffect } from 'react';
import Hero from '@/components/Hero';
import CategoryTile from '@/components/CategoryTile';
import ProductCard from '@/components/ProductCard';
import SEO from '@/components/SEO';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Category, Product } from '@/types/user';

export default function Home() {
  const [featuredCategories, setFeaturedCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch featured categories
        const categoriesRef = collection(db, 'categories');
        const categoriesQuery = query(categoriesRef, where('featured', '==', true));
        const categoriesSnapshot = await getDocs(categoriesQuery);
        const categories = categoriesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Category[];
        setFeaturedCategories(categories);

        // Fetch featured products
        const productsRef = collection(db, 'products');
        const productsQuery = query(productsRef, where('featured', '==', true));
        const productsSnapshot = await getDocs(productsQuery);
        const products = productsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Product[];
        setFeaturedProducts(products);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <SEO />
      
      {/* Hero Section */}
      <Hero />

      {/* About Section */}
      <section id="about" className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-purple-dark mb-6">
              About Infinity Crochet
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-lilac to-purple mx-auto mb-8"></div>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Welcome to Infinity Crochet, where every stitch tells a story. We create beautiful, 
              handmade crochet pieces that bring warmth, comfort, and joy to your life. From adorable 
              amigurumi to functional bags and cozy home décor, each item is crafted with love and attention 
              to detail.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Our passion is creating unique pieces that you'll treasure for years to come. Whether you're 
              looking for the perfect gift or something special for yourself, we're here to bring your 
              crochet dreams to life.
            </p>
          </div>
          
          {/* Visual Elements */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 items-start">
            <div className="text-center">
              <div className="mb-4 flex justify-center items-center h-24">
                <img src="/images/quality-material.png" alt="Quality Materials" className="h-24 w-24 object-contain" />
              </div>
              <h3 className="font-semibold text-purple-dark mb-2">Quality Materials</h3>
              <p className="text-sm text-gray-600">Premium, soft yarns</p>
            </div>
            <div className="text-center">
              <div className="mb-4 flex justify-center items-center h-24">
                <img src="/images/made-with-love.png" alt="Made with Love" className="h-24 w-24 object-contain" />
              </div>
              <h3 className="font-semibold text-purple-dark mb-2">Made with Love</h3>
              <p className="text-sm text-gray-600">Handcrafted with care</p>
            </div>
            <div className="text-center">
              <div className="mb-4 flex justify-center items-center h-24">
                <img src="/images/unique-designs.png" alt="Unique Designs" className="h-24 w-24 object-contain" />
              </div>
              <h3 className="font-semibold text-purple-dark mb-2">Unique Designs</h3>
              <p className="text-sm text-gray-600">One-of-a-kind creations</p>
            </div>
            <div className="text-center">
              <div className="mb-4 flex justify-center items-center h-24">
                <img src="/images/perfect-gifts.png" alt="Perfect Gifts" className="h-24 w-24 object-contain" />
              </div>
              <h3 className="font-semibold text-purple-dark mb-2">Perfect Gifts</h3>
              <p className="text-sm text-gray-600">For all occasions</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section-padding bg-gradient-to-br from-lilac-light to-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-purple-dark mb-4">
              Explore Our Collections
            </h2>
            <p className="text-lg text-gray-700">
              Discover beautiful handmade items across all categories
            </p>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-purple"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
              {featuredCategories.map(category => (
                <CategoryTile key={category.id} {...category} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-purple-dark mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-gray-700">
              Handpicked favorites from our collection
            </p>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-purple"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Training Section */}
      <section id="training" className="section-padding bg-gradient-to-br from-purple-dark to-purple">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Learn to Crochet with Us
            </h2>
            <div className="w-24 h-1 bg-white/50 mx-auto mb-8"></div>
            <p className="text-lg leading-relaxed mb-8">
              Whether you're a complete beginner or looking to refine your skills, we offer personalized 
              crochet training for all levels. Learn the art of crochet from the comfort of your home with 
              our online sessions, or join us for hands-on in-person workshops.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mt-12">
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-soft">
                <div className="text-4xl mb-4">💻</div>
                <h3 className="text-2xl font-semibold mb-3">Online Training</h3>
                <p className="text-white/90">
                  Learn at your own pace with personalized video lessons and one-on-one guidance. 
                  Perfect for busy schedules.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-soft">
                <div className="text-4xl mb-4">👥</div>
                <h3 className="text-2xl font-semibold mb-3">In-Person Workshops</h3>
                <p className="text-white/90">
                  Join our interactive workshops for hands-on learning and connect with fellow 
                  crochet enthusiasts in a fun, supportive environment.
                </p>
              </div>
            </div>
            
            <div className="mt-12">
              <a href="mailto:contact@infinity-crochet.com" className="btn-secondary text-lg">
                Inquire About Training
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-lilac">
        <div className="container-custom text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-purple-dark mb-6">
            Ready to Find Your Perfect Piece?
          </h2>
          <p className="text-lg text-purple-dark/80 mb-8 max-w-2xl mx-auto">
            Browse our full collection and discover handmade treasures waiting for you
          </p>
          <a href="/shop" className="btn-primary text-lg">
            Visit Our Shop
          </a>
        </div>
      </section>
    </>
  );
}
