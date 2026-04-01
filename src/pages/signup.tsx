import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import SEO from '@/components/SEO';

export default function SignupPage() {
  const router = useRouter();
  const { signUp, user, loading: authLoading } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [refundAccepted, setRefundAccepted] = useState(false);
  const [shipmentAccepted, setShipmentAccepted] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      const redirect = router.query.redirect as string;
      router.push(redirect || '/account');
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await signUp(email, password, displayName);
      // Navigation will happen via the useEffect above after user state updates
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
      setLoading(false);
    }
  };

  return (
    <>
      <SEO 
        title="Sign Up"
        description="Create your Infinity Crochet account"
      />
      
      <div className="min-h-screen pt-24 pb-16 bg-gradient-to-br from-lilac-light to-white">
        <div className="container-custom">
          <div className="max-w-md mx-auto">
            <div className="card p-8">
              <h1 className="text-3xl font-bold text-purple-dark mb-2 text-center">
                Create Account
              </h1>
              <p className="text-gray-600 mb-8 text-center">
                Join the Infinity Crochet community
              </p>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    id="displayName"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                    placeholder="Jane Doe"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                    placeholder="••••••••"
                  />
                  <p className="text-sm text-gray-500 mt-1">At least 6 characters</p>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                    placeholder="••••••••"
                  />
                </div>

                <div className="space-y-3 pt-2">
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    Please read and accept the following policies:
                  </p>
                  
                  <div className="flex items-start">
                    <input
                      id="privacyPolicy"
                      type="checkbox"
                      checked={privacyAccepted}
                      onChange={(e) => setPrivacyAccepted(e.target.checked)}
                      className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <label htmlFor="privacyPolicy" className="ml-2 text-sm text-gray-600">
                      I have read and accept the{' '}
                      <Link href="/privacy-policy" target="_blank" className="text-purple-600 hover:text-purple-800 underline">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>

                  <div className="flex items-start">
                    <input
                      id="termsOfUse"
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <label htmlFor="termsOfUse" className="ml-2 text-sm text-gray-600">
                      I have read and accept the{' '}
                      <Link href="/terms-of-use" target="_blank" className="text-purple-600 hover:text-purple-800 underline">
                        Terms of Use
                      </Link>
                    </label>
                  </div>

                  <div className="flex items-start">
                    <input
                      id="refundPolicy"
                      type="checkbox"
                      checked={refundAccepted}
                      onChange={(e) => setRefundAccepted(e.target.checked)}
                      className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <label htmlFor="refundPolicy" className="ml-2 text-sm text-gray-600">
                      I have read and accept the{' '}
                      <Link href="/refund-policy" target="_blank" className="text-purple-600 hover:text-purple-800 underline">
                        Refund & Cancelation Policy
                      </Link>
                    </label>
                  </div>

                  <div className="flex items-start">
                    <input
                      id="shipmentPolicy"
                      type="checkbox"
                      checked={shipmentAccepted}
                      onChange={(e) => setShipmentAccepted(e.target.checked)}
                      className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <label htmlFor="shipmentPolicy" className="ml-2 text-sm text-gray-600">
                      I have read and accept the{' '}
                      <Link href="/shipment-policy" target="_blank" className="text-purple-600 hover:text-purple-800 underline">
                        Shipment Policy
                      </Link>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !privacyAccepted || !termsAccepted || !refundAccepted || !shipmentAccepted}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating account...' : 'Create Account'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  Already have an account?{' '}
                  <Link 
                    href={router.query.redirect ? `/login?redirect=${encodeURIComponent(router.query.redirect as string)}` : '/login'} 
                    className="text-purple font-medium hover:text-purple-dark"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
