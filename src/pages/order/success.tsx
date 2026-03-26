import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useCart } from '../../contexts/CartContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function OrderSuccess() {
  const router = useRouter();
  const { session_id } = router.query;
  const { clearCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    if (session_id) {
      // Clear the cart
      clearCart();
      
      // In a real app, you'd fetch order details from your backend
      // For now, we'll just show a success message
      setLoading(false);
    }
  }, [session_id, clearCart]);

  if (loading) {
    return (
      <>
        <Head>
          <title>Processing Order - Infinity Crochet</title>
        </Head>
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
          <Navbar />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Processing your order...</p>
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
        <title>Order Confirmed - Infinity Crochet</title>
      </Head>

      <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <Navbar />

        <main className="flex-1 py-12">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center">
              {/* Success Icon */}
              <div className="mb-8">
                <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100">
                  <svg
                    className="h-12 w-12 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>

              {/* Success Message */}
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Order Confirmed! 🎉
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Thank you for your purchase!
              </p>

              {/* Order Details */}
              <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  What's Next?
                </h2>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-purple-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>You'll receive an email confirmation shortly</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-purple-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>We'll start handcrafting your crochet items</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-purple-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <span>Your order will ship within 3-5 business days</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-purple-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Track your order status in your account</span>
                  </li>
                </ul>
              </div>

              {/* Session ID */}
              {session_id && (
                <div className="mb-8">
                  <p className="text-sm text-gray-500">
                    Order Reference: {session_id}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/account/orders"
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105"
                >
                  View Order History
                </Link>
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-all"
                >
                  Continue Shopping
                </Link>
              </div>

              {/* Contact Info */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <p className="text-gray-600 mb-2">
                  Questions about your order?
                </p>
                <a
                  href="/contact"
                  className="text-purple-600 hover:text-purple-700 font-medium"
                >
                  Contact us
                </a>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
