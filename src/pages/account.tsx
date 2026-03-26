import { useAuth } from '@/contexts/AuthContext';
import SEO from '@/components/SEO';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';

export default function AccountPage() {
  const { user, isAdmin } = useAuth();

  return (
    <ProtectedRoute>
      <SEO 
        title="My Account"
        description="Manage your Infinity Crochet account"
      />
      
      <div className="min-h-screen pt-24 pb-16 bg-gradient-to-br from-lilac-light to-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-purple-dark mb-8">
              My Account
            </h1>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Profile Card */}
              <div className="card p-6">
                <h2 className="text-2xl font-semibold text-purple-dark mb-4">
                  Profile Information
                </h2>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-600">Name</label>
                    <p className="text-lg font-medium">{user?.displayName || 'Not set'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Email</label>
                    <p className="text-lg font-medium">{user?.email}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Account Type</label>
                    <p className="text-lg font-medium capitalize">
                      {user?.role === 'admin' ? (
                        <span className="text-purple font-bold">Admin</span>
                      ) : (
                        'Customer'
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="card p-6">
                <h2 className="text-2xl font-semibold text-purple-dark mb-4">
                  Quick Actions
                </h2>
                <div className="space-y-3">
                  {isAdmin && (
                    <Link 
                      href="/admin"
                      className="block w-full btn-primary text-center"
                    >
                      Go to Admin Dashboard
                    </Link>
                  )}
                  <Link 
                    href="/shop"
                    className="block w-full btn-secondary text-center"
                  >
                    Continue Shopping
                  </Link>
                  <Link 
                    href="/shop/category/custom"
                    className="block w-full text-center px-6 py-3 border-2 border-purple text-purple rounded-soft hover:bg-purple hover:text-white transition-all"
                  >
                    Request Custom Order
                  </Link>
                </div>
              </div>
            </div>

            {/* Orders Section */}
            <div className="mt-8 card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold text-purple-dark">
                  Order History
                </h2>
                <Link 
                  href="/account/orders"
                  className="text-purple hover:text-purple-dark font-medium"
                >
                  View All Orders →
                </Link>
              </div>
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📦</div>
                <p className="text-gray-600 mb-4">
                  Track your orders and view order history
                </p>
                <Link href="/account/orders" className="btn-primary inline-block mr-3">
                  View Orders
                </Link>
                <Link href="/shop" className="btn-secondary inline-block">
                  Start Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
