import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import SEO from '@/components/SEO';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    orders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [productsSnap, categoriesSnap, ordersSnap] = await Promise.all([
        getDocs(collection(db, 'products')),
        getDocs(collection(db, 'categories')),
        getDocs(collection(db, 'orders')),
      ]);
      
      setStats({
        products: productsSnap.size,
        categories: categoriesSnap.size,
        orders: ordersSnap.size,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute requireAdmin>
      <SEO 
        title="Admin Dashboard"
        description="Manage your Infinity Crochet shop"
      />
      
      <div className="min-h-screen pt-24 pb-16 bg-gray-50">
        <div className="container-custom">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-purple-dark mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600">
              Welcome back, {user?.displayName}! Manage your shop here.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Products</p>
                  <p className="text-3xl font-bold text-purple-dark">
                    {loading ? '...' : stats.products}
                  </p>
                </div>
                <div className="text-4xl">🧶</div>
              </div>
            </div>
            
            <div className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Categories</p>
                  <p className="text-3xl font-bold text-purple-dark">
                    {loading ? '...' : stats.categories}
                  </p>
                </div>
                <div className="text-4xl">📁</div>
              </div>
            </div>
            
            <div className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Orders</p>
                  <p className="text-3xl font-bold text-purple-dark">
                    {loading ? '...' : stats.orders}
                  </p>
                </div>
                <div className="text-4xl">📦</div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/admin/products" className="card p-6 hover:shadow-xl transition-all">
              <div className="text-4xl mb-4">🛍️</div>
              <h3 className="text-xl font-semibold text-purple-dark mb-2">
                Manage Products
              </h3>
              <p className="text-gray-600">
                Add, edit, or remove products from your shop
              </p>
            </Link>

            <Link href="/admin/programs" className="card p-6 hover:shadow-xl transition-all">
              <div className="text-4xl mb-4">🎓</div>
              <h3 className="text-xl font-semibold text-purple-dark mb-2">
                Training Programs
              </h3>
              <p className="text-gray-600">
                Manage online training programs and videos
              </p>
            </Link>

            <Link href="/admin/categories" className="card p-6 hover:shadow-xl transition-all">
              <div className="text-4xl mb-4">📂</div>
              <h3 className="text-xl font-semibold text-purple-dark mb-2">
                Manage Categories
              </h3>
              <p className="text-gray-600">
                Organize and edit product categories
              </p>
            </Link>

            <Link href="/admin/orders" className="card p-6 hover:shadow-xl transition-all">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-purple-dark mb-2">
                View Orders
              </h3>
              <p className="text-gray-600">
                Manage customer orders and inquiries
              </p>
            </Link>

            <Link href="/admin/users" className="card p-6 hover:shadow-xl transition-all">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-xl font-semibold text-purple-dark mb-2">
                Manage Users
              </h3>
              <p className="text-gray-600">
                View and manage user accounts
              </p>
            </Link>

            <Link href="/" className="card p-6 hover:shadow-xl transition-all">
              <div className="text-4xl mb-4">🌐</div>
              <h3 className="text-xl font-semibold text-purple-dark mb-2">
                View Public Site
              </h3>
              <p className="text-gray-600">
                See what customers see
              </p>
            </Link>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
