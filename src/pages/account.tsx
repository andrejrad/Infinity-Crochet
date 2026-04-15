import { useAuth } from '@/contexts/AuthContext';
import SEO from '@/components/SEO';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import { useState, FormEvent } from 'react';

export default function AccountPage() {
  const { user, isAdmin, updateUserProfile } = useAuth();
  const [isEditingName, setIsEditingName] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleUpdateName = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!newDisplayName.trim()) {
      setError('Name cannot be empty');
      return;
    }

    setLoading(true);

    try {
      await updateUserProfile(newDisplayName.trim());
      setSuccess('Name updated successfully!');
      setIsEditingName(false);
      setNewDisplayName('');
    } catch (err: any) {
      setError(err.message || 'Failed to update name');
    } finally {
      setLoading(false);
    }
  };

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

                {success && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
                    {success}
                  </div>
                )}

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-600">Name</label>
                    {isEditingName ? (
                      <form onSubmit={handleUpdateName} className="mt-2">
                        <input
                          type="text"
                          value={newDisplayName}
                          onChange={(e) => setNewDisplayName(e.target.value)}
                          placeholder={user?.displayName || 'Enter your name'}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent mb-2"
                          autoFocus
                        />
                        <div className="flex gap-2">
                          <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-purple text-white rounded-lg hover:bg-purple-dark transition-colors disabled:opacity-50"
                          >
                            {loading ? 'Saving...' : 'Save'}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setIsEditingName(false);
                              setNewDisplayName('');
                              setError('');
                            }}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-lg font-medium">{user?.displayName || 'Not set'}</p>
                        <button
                          onClick={() => {
                            setIsEditingName(true);
                            setNewDisplayName(user?.displayName || '');
                            setError('');
                            setSuccess('');
                          }}
                          className="text-purple hover:text-purple-dark text-sm font-medium"
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Email</label>
                    <p className="text-lg font-medium">{user?.email}</p>
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
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
