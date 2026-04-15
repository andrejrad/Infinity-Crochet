import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import SEO from '@/components/SEO';

export default function LoginPage() {
  const router = useRouter();
  const { signIn, resetPassword, user, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState('');

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
    setLoading(true);

    try {
      await signIn(email, password);
      // Navigation will happen via the useEffect above after user state updates
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: FormEvent) => {
    e.preventDefault();
    setResetError('');
    setResetSuccess(false);
    setResetLoading(true);

    try {
      await resetPassword(resetEmail);
      setResetSuccess(true);
      setResetEmail('');
    } catch (err: any) {
      setResetError(err.message || 'Failed to send reset email');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <>
      <SEO 
        title="Login"
        description="Sign in to your Infinity Crochet account"
      />
      
      <div className="min-h-screen pt-24 pb-16 bg-gradient-to-br from-lilac-light to-white">
        <div className="container-custom">
          <div className="max-w-md mx-auto">
            <div className="card p-8">
              <h1 className="text-3xl font-bold text-purple-dark mb-2 text-center">
                Welcome Back
              </h1>
              <p className="text-gray-600 mb-8 text-center">
                Sign in to your account
              </p>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
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
                  <div className="flex justify-between items-center mb-2">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-sm text-purple-600 hover:text-purple-800"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  Don't have an account?{' '}
                  <Link 
                    href={router.query.redirect ? `/signup?redirect=${encodeURIComponent(router.query.redirect as string)}` : '/signup'} 
                    className="text-purple font-medium hover:text-purple-dark"
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Forgot Password Modal */}
        {showForgotPassword && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
              <h2 className="text-2xl font-bold text-purple-dark mb-2">
                Reset Password
              </h2>
              <p className="text-gray-600 mb-6">
                Enter your email address and we'll send you a link to reset your password.
              </p>

              {resetSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
                  <p className="font-medium">Password reset email sent!</p>
                  <p className="text-sm mt-1">Check your inbox and junk/spam folder if you don't see it.</p>
                </div>
              )}

              {resetError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                  {resetError}
                </div>
              )}

              <form onSubmit={handleForgotPassword} className="space-y-6">
                <div>
                  <label htmlFor="resetEmail" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    id="resetEmail"
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(false);
                      setResetEmail('');
                      setResetError('');
                      setResetSuccess(false);
                    }}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {resetLoading ? 'Sending...' : 'Send Reset Link'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
