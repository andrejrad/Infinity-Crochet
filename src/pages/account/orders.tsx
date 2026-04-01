import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { collection, query, where, orderBy, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import type { Order } from '../../types/user';

export default function OrderHistory() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/account/orders');
      return;
    }

    if (user) {
      fetchOrders();
    }
  }, [user, authLoading, router]);

  const enrichOrdersWithProductImages = async (ordersData: Order[]) => {
    // For each order, check if products are missing images and fetch them
    const enrichedOrders = await Promise.all(
      ordersData.map(async (order) => {
        const enrichedProducts = await Promise.all(
          order.products.map(async (product) => {
            // If image is missing, try to fetch product details
            if (!product.image && (product.id || product.productId)) {
              try {
                const productId = product.id || product.productId;
                const productDoc = await getDoc(doc(db, 'products', productId!));
                if (productDoc.exists()) {
                  const productData = productDoc.data();
                  return {
                    ...product,
                    image: productData.images?.[0] || productData.image || '/placeholder.jpg',
                  };
                }
              } catch (error) {
                console.error('Error fetching product image:', error);
              }
            }
            return product;
          })
        );
        
        return {
          ...order,
          products: enrichedProducts,
        };
      })
    );
    
    return enrichedOrders;
  };

  const fetchOrders = async () => {
    if (!user) return;

    try {
      const ordersRef = collection(db, 'orders');
      
      // Query for user's orders
      const q = query(
        ordersRef,
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const ordersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
      
      // Enrich orders with product images if missing
      const enrichedOrders = await enrichOrdersWithProductImages(ordersData);
      
      setOrders(enrichedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      
      // If the composite index is not ready, show a helpful error
      if (error instanceof Error && error.message.includes('index')) {
        console.error('Firebase composite index is still building. Please wait a few minutes and refresh.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (authLoading || loading) {
    return (
      <>
        <Head>
          <title>Order History - Infinity Crochet</title>
        </Head>
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
          <Navbar />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading orders...</p>
            </div>
          </main>
          <Footer />
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Order History - Infinity Crochet</title>
      </Head>

      <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <Navbar />

        <main className="flex-1 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Order History</h1>
              <p className="text-gray-600">View and track your orders</p>
            </div>

            {orders.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <svg
                  className="mx-auto h-24 w-24 text-gray-400 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  No orders yet
                </h2>
                <p className="text-gray-600 mb-8">
                  Start shopping to see your orders here
                </p>
                <Link
                  href="/shop"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105"
                >
                  Browse Products
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    {/* Order Header */}
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-6">
                          <div>
                            <p className="text-sm text-gray-500">Order Date</p>
                            <p className="font-medium text-gray-900">
                              {formatDate(order.createdAt)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Total</p>
                            <p className="font-medium text-gray-900">
                              ${order.total.toFixed(2)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Order Number</p>
                            <p className="font-medium text-gray-900 font-mono text-sm">
                              {order.orderNumber || `#${order.id?.substring(0, 12)}`}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="p-6">
                      <div className="space-y-4">
                        {order.products.map((product, index) => {
                          const colorValues = product.selectedColors
                            ? Object.values(product.selectedColors).filter(Boolean)
                            : [];
                          return (
                          <div key={index} className="flex gap-4">
                            <img
                              src={product.image || '/placeholder.jpg'}
                              alt={product.name}
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-900">
                                {product.name}
                              </h3>
                              {colorValues.length > 0 && (
                                <p className="text-sm text-gray-500">
                                  Colors: {colorValues.join(', ')}
                                </p>
                              )}
                              <p className="text-sm text-gray-600">
                                Quantity: {product.quantity}
                              </p>
                            </div>
                            <p className="font-medium text-gray-900">
                              ${(product.price * product.quantity).toFixed(2)}
                            </p>
                          </div>
                        );})}
                      </div>

                      {/* Shipping Address */}
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <h4 className="font-medium text-gray-900 mb-2">
                          Shipping Address
                        </h4>
                        <p className="text-gray-600 text-sm">
                          {order.customerName}<br />
                          {order.shippingAddress.line1}<br />
                          {order.shippingAddress.line2 && (
                            <>
                              {order.shippingAddress.line2}<br />
                            </>
                          )}
                          {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                          {order.shippingAddress.postalCode}<br />
                          {order.shippingAddress.country}
                        </p>
                      </div>

                      {/* Tracking Information */}
                      {order.trackingNumber && (
                        <div className="mt-6 pt-6 border-t border-gray-200">
                          <h4 className="font-medium text-gray-900 mb-2">
                            Tracking Information
                          </h4>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600">Carrier:</span>
                              <span className="text-sm font-medium text-gray-900">
                                {order.carrier || 'N/A'}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600">Tracking Number:</span>
                              <span className="text-sm font-mono font-medium text-gray-900">
                                {order.trackingNumber}
                              </span>
                            </div>
                            {order.trackingUrl && (
                              <a
                                href={order.trackingUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-sm font-medium text-purple-600 hover:text-purple-700"
                              >
                                Track Package →
                              </a>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Order Summary */}
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between text-gray-600">
                            <span>Subtotal</span>
                            <span>${order.subtotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-gray-600">
                            <span>Shipping</span>
                            <span>${order.shipping.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-gray-600">
                            <span>Tax</span>
                            <span>${order.tax.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between font-medium text-gray-900 text-base pt-2 border-t">
                            <span>Total</span>
                            <span>${order.total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-8 text-center">
              <Link
                href="/shop"
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
