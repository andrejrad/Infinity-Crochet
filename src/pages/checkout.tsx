import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Checkout() {
  const router = useRouter();
  const { cart, getCartTotal } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadingRates, setLoadingRates] = useState(false);
  const [error, setError] = useState('');
  const [shippingRates, setShippingRates] = useState<any[]>([]);
  const [selectedRate, setSelectedRate] = useState<any>(null);
  const [insurance, setInsurance] = useState({ enabled: false, cost: 2.50 });

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
    notes: '',
  });

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.length === 0) {
      router.push('/cart');
    }
  }, [cart, router]);

  // Calculate totals
  const subtotal = getCartTotal();
  const shippingCost = selectedRate ? selectedRate.amount : 0;
  const insuranceCost = insurance.enabled ? insurance.cost : 0;
  const estimatedTotal = subtotal + shippingCost + insuranceCost;

  // Fetch shipping rates when address is complete
  const fetchShippingRates = async () => {
    if (!formData.addressLine1 || !formData.city || !formData.state || !formData.zipCode) {
      return;
    }

    setLoadingRates(true);
    try {
      const response = await fetch('/api/get-shipping-rates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destinationAddress: {
            name: formData.name,
            line1: formData.addressLine1,
            line2: formData.addressLine2,
            city: formData.city,
            state: formData.state,
            postalCode: formData.zipCode,
            country: formData.country,
          },
          items: cart,
        }),
      });

      const data = await response.json();
      console.log('Shipping rates response:', data);
      console.log('Response OK?', response.ok);
      console.log('Rates count:', data.rates?.length);
      
      if (response.ok) {
        setShippingRates(data.rates || []);
        // Auto-select cheapest rate
        if (data.rates && data.rates.length > 0) {
          setSelectedRate(data.rates[0]);
          console.log('Selected cheapest rate:', data.rates[0]);
        }
      } else {
        console.error('API error:', data);
        setError(data.error || 'Failed to get shipping rates');
      }
    } catch (err) {
      console.error('Error fetching rates:', err);
      setError('Failed to get shipping rates');
    } finally {
      setLoadingRates(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleGetRates = () => {
    fetchShippingRates();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!selectedRate) {
      setError('Please select a shipping method');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create payment intent
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(estimatedTotal * 100), // Convert to cents
          items: cart,
          customerInfo: formData,
          shippingRate: selectedRate,
          userId: user?.uid || null,
          notes: formData.notes,
          insurance: insurance.enabled ? {
            enabled: true,
            cost: insurance.cost,
            coverage: subtotal,
          } : {
            enabled: false,
          },        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Payment failed');
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.message || 'An error occurred during checkout');
      setLoading(false);
    }
  };

  const isFormValid = () => {
    return (
      formData.name &&
      formData.email &&
      formData.phone &&
      formData.addressLine1 &&
      formData.city &&
      formData.state &&
      formData.zipCode &&
      selectedRate
    );
  };

  if (cart.length === 0) {
    return null; // Will redirect
  }

  return (
    <>
      <Head>
        <title>Checkout - Infinity Crochet</title>
      </Head>

      <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <Navbar />

        <main className="flex-1 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Checkout</h1>
              <p className="text-gray-600">Complete your order</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Checkout Form */}
              <div className="lg:col-span-2">
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8">
                  {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-800 text-sm">{error}</p>
                    </div>
                  )}

                  {/* Customer Information */}
                  <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                      Customer Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="John Doe"
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="john@example.com"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="(555) 123-4567"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                      Shipping Address
                    </h2>
                    <div className="space-y-6">
                      <div>
                        <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-700 mb-2">
                          Address Line 1 *
                        </label>
                        <input
                          type="text"
                          id="addressLine1"
                          name="addressLine1"
                          required
                          value={formData.addressLine1}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="123 Main Street"
                        />
                      </div>

                      <div>
                        <label htmlFor="addressLine2" className="block text-sm font-medium text-gray-700 mb-2">
                          Address Line 2
                        </label>
                        <input
                          type="text"
                          id="addressLine2"
                          name="addressLine2"
                          value={formData.addressLine2}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Apartment, suite, etc. (optional)"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                            City *
                          </label>
                          <input
                            type="text"
                            id="city"
                            name="city"
                            required
                            value={formData.city}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="New York"
                          />
                        </div>

                        <div>
                          <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                            State *
                          </label>
                          <input
                            type="text"
                            id="state"
                            name="state"
                            required
                            value={formData.state}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="NY"
                          />
                        </div>

                        <div>
                          <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-2">
                            ZIP Code *
                          </label>
                          <input
                            type="text"
                            id="zipCode"
                            name="zipCode"
                            required
                            value={formData.zipCode}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="10001"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                          Country *
                        </label>
                        <select
                          id="country"
                          name="country"
                          required
                          value={formData.country}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          <option value="US">United States</option>
                          <option value="CA">Canada</option>
                          <option value="GB">United Kingdom</option>
                          <option value="AU">Australia</option>
                          <option value="" disabled>──── EU Countries ────</option>
                          <option value="AT">Austria</option>
                          <option value="BE">Belgium</option>
                          <option value="BG">Bulgaria</option>
                          <option value="HR">Croatia</option>
                          <option value="CY">Cyprus</option>
                          <option value="CZ">Czech Republic</option>
                          <option value="DK">Denmark</option>
                          <option value="EE">Estonia</option>
                          <option value="FI">Finland</option>
                          <option value="FR">France</option>
                          <option value="DE">Germany</option>
                          <option value="GR">Greece</option>
                          <option value="HU">Hungary</option>
                          <option value="IE">Ireland</option>
                          <option value="IT">Italy</option>
                          <option value="LV">Latvia</option>
                          <option value="LT">Lithuania</option>
                          <option value="LU">Luxembourg</option>
                          <option value="MT">Malta</option>
                          <option value="NL">Netherlands</option>
                          <option value="PL">Poland</option>
                          <option value="PT">Portugal</option>
                          <option value="RO">Romania</option>
                          <option value="SK">Slovakia</option>
                          <option value="SI">Slovenia</option>
                          <option value="ES">Spain</option>
                          <option value="SE">Sweden</option>
                        </select>
                      </div>
                    </div>

                    {/* Customer Notes */}
                    <div>
                      <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                        Order Notes (Optional)
                      </label>
                      <textarea
                        id="notes"
                        name="notes"
                        rows={4}
                        value={formData.notes}
                        onChange={handleChange}
                        placeholder="Any special requests or instructions for your order..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Let us know if you have any special color preferences, gift messages, or other requests.
                      </p>
                    </div>
                  </div>

                  {/* Shipping Options */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-2xl font-semibold text-gray-900">
                        Shipping Method
                      </h2>
                      <button
                        type="button"
                        onClick={handleGetRates}
                        disabled={loadingRates || !formData.addressLine1 || !formData.city || !formData.state || !formData.zipCode}
                        className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                      >
                        {loadingRates ? 'Loading...' : 'Get Rates'}
                      </button>
                    </div>

                    {shippingRates.length === 0 && !loadingRates && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                        <p>📦 Complete your shipping address above and click "Get Rates" to see shipping options</p>
                      </div>
                    )}

                    {loadingRates && (
                      <div className="bg-gray-50 rounded-lg p-6 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-2"></div>
                        <p className="text-gray-600 text-sm">Calculating shipping rates...</p>
                      </div>
                    )}

                    {shippingRates.length > 0 && (
                      <div className="space-y-3">
                        {shippingRates.map((rate) => (
                          <div
                            key={rate.objectId}
                            onClick={() => setSelectedRate(rate)}
                            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                              selectedRate?.objectId === rate.objectId
                                ? 'border-purple-600 bg-purple-50'
                                : 'border-gray-200 hover:border-purple-300'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <input
                                  type="radio"
                                  checked={selectedRate?.objectId === rate.objectId}
                                  onChange={() => setSelectedRate(rate)}
                                  className="w-4 h-4 text-purple-600"
                                />
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {rate.provider} - {rate.servicelevel.name}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {rate.estimatedDays ? `${rate.estimatedDays} business days` : rate.durationTerms}
                                  </p>
                                </div>
                              </div>
                              <p className="text-lg font-bold text-gray-900">
                                ${rate.amount.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Shipping Insurance */}
                  {selectedRate && (
                    <div className="mb-8">
                      <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                        Shipping Insurance
                      </h2>
                      <div className="border-2 border-gray-200 rounded-lg p-4">
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={insurance.enabled}
                            onChange={(e) => setInsurance({ ...insurance, enabled: e.target.checked })}
                            className="w-5 h-5 text-purple-600 mt-1 cursor-pointer"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-gray-900">
                                Protect your package
                              </span>
                              <span className="text-lg font-bold text-gray-900">
                                +${insurance.cost.toFixed(2)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              Covers loss or damage up to ${subtotal.toFixed(2)} during shipping
                            </p>
                          </div>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="bg-purple-100 border-2 border-purple-400 rounded-lg p-4 mb-4">
                    <p className="text-sm font-semibold text-purple-900">
                      ✅ Review Your Shipping Address Above
                    </p>
                    <p className="text-xs text-purple-700 mt-1">
                      This address will be used for shipping. The payment page will only ask for card details.
                    </p>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={!isFormValid() || loading}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      `Proceed to Payment - $${estimatedTotal.toFixed(2)}`
                    )}
                  </button>

                  <p className="text-sm text-gray-500 text-center mt-4">
                    Secure payment processed by Stripe
                  </p>
                </form>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">Order Summary</h2>

                  {/* Cart Items */}
                  <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                    {cart.map((item) => {
                      // Build color labels array with proper names
                      const colorLabels = [];
                      if (item.selectedColors?.option1) {
                        const label = item.product.colorOptions?.option1?.label || 'Color 1';
                        colorLabels.push(`${label}: ${item.selectedColors.option1}`);
                      }
                      if (item.selectedColors?.option2) {
                        const label = item.product.colorOptions?.option2?.label || 'Color 2';
                        colorLabels.push(`${label}: ${item.selectedColors.option2}`);
                      }
                      if (item.selectedColors?.option3) {
                        const label = item.product.colorOptions?.option3?.label || 'Color 3';
                        colorLabels.push(`${label}: ${item.selectedColors.option3}`);
                      }
                      
                      return (
                      <div key={`${item.product.id}-${colorLabels.join(',')}`} className="flex gap-4">
                        <img
                          src={item.product.images?.[0] || '/placeholder.jpg'}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 text-sm">{item.product.name}</h3>
                          {colorLabels.length > 0 && (
                            <p className="text-xs text-gray-500">
                              {colorLabels.join(', ')}
                            </p>
                          )}
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-medium text-gray-900">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    );
                    })}
                  </div>

                  {/* Shipping Address Review */}
                  {(formData.addressLine1 || formData.city) && (
                    <div className="border-t border-b border-gray-200 py-4 mb-6 bg-purple-50">
                      <h3 className="text-base font-bold text-purple-900 mb-3">📦 Shipping Address</h3>
                      <div className="text-sm text-gray-600">
                        {formData.name && <p className="font-medium text-gray-900">{formData.name}</p>}
                        {formData.addressLine1 && <p>{formData.addressLine1}</p>}
                        {formData.addressLine2 && <p>{formData.addressLine2}</p>}
                        {(formData.city || formData.state || formData.zipCode) && (
                          <p>
                            {formData.city}{formData.city && formData.state && ', '}{formData.state} {formData.zipCode}
                          </p>
                        )}
                        {formData.country && formData.country !== 'US' && <p>{formData.country}</p>}
                      </div>
                      {formData.email && (
                        <p className="text-xs text-gray-500 mt-2">
                          ✉️ {formData.email}
                        </p>
                      )}
                      {formData.phone && (
                        <p className="text-xs text-gray-500">
                          📞 {formData.phone}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Totals */}
                  <div className="border-t border-gray-200 pt-6 space-y-3">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Shipping</span>
                      {selectedRate ? (
                        <span>${selectedRate.amount.toFixed(2)}</span>
                      ) : (
                        <span className="text-sm">Select method</span>
                      )}
                    </div>
                    {selectedRate && (
                      <p className="text-xs text-gray-600">
                        {selectedRate.provider} - {selectedRate.servicelevel.name}
                        {selectedRate.estimatedDays && ` (${selectedRate.estimatedDays} days)`}
                      </p>
                    )}
                    <div className="flex justify-between text-gray-600">
                      <span>Tax</span>
                      <span className="text-sm">At checkout</span>
                    </div>
                    {insurance.enabled && (
                      <div className="flex justify-between text-gray-600">
                        <span>Insurance</span>
                        <span>${insurance.cost.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="border-t border-gray-200 pt-3 flex justify-between text-xl font-bold text-gray-900">
                      <span>Estimated Total</span>
                      <span>${estimatedTotal.toFixed(2)}</span>
                    </div>
                    <p className="text-xs text-gray-500 text-center mt-2">
                      Tax calculated by Stripe at checkout
                    </p>
                  </div>

                  <Link
                    href="/cart"
                    className="block text-center text-purple-600 hover:text-purple-700 font-medium mt-6"
                  >
                    ← Back to Cart
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
