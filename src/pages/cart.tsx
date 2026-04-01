import { useCart } from '@/contexts/CartContext';
import SEO from '@/components/SEO';
import Link from 'next/link';
import Image from 'next/image';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

  if (cart.length === 0) {
    return (
      <>
        <SEO title="Shopping Cart" description="Your shopping cart" />
        <div className="min-h-screen pt-24 pb-16 bg-gray-50">
          <div className="container-custom max-w-4xl px-4">
            <div className="card p-8 sm:p-12 text-center">
              <div className="text-6xl mb-4">🛒</div>
              <h1 className="text-2xl sm:text-3xl font-bold text-purple-dark mb-4">
                Your Cart is Empty
              </h1>
              <p className="text-gray-600 mb-6">
                Looks like you haven't added any items to your cart yet.
              </p>
              <Link href="/shop" className="btn-primary inline-block">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  const subtotal = getCartTotal();

  return (
    <>
      <SEO title="Shopping Cart" description="Review your shopping cart" />
      <div className="min-h-screen pt-24 pb-16 bg-gray-50">
        <div className="container-custom max-w-6xl px-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-purple-dark mb-6 sm:mb-8">Shopping Cart</h1>

          <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item, index) => (
                <div key={`${item.product.id}-${index}`} className="card p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                    {/* Product Image */}
                    <Link href={`/shop/product/${item.product.slug}`} className="flex-shrink-0">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-gradient-to-br from-lilac-light to-white mx-auto sm:mx-0">
                        {item.product.image ? (
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-4xl">
                            🧶
                          </div>
                        )}
                      </div>
                    </Link>

                    {/* Product Info and Controls */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-4">
                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <Link href={`/shop/product/${item.product.slug}`}>
                            <h3 className="text-base sm:text-lg font-semibold text-purple-dark hover:text-purple truncate">
                              {item.product.name}
                            </h3>
                          </Link>
                          <p className="text-sm text-gray-600 mt-1">${item.product.price.toFixed(2)} each</p>

                          {/* Selected Colors */}
                          {item.selectedColors && (
                            <div className="mt-2 space-y-1">
                              {item.selectedColors.option1 && (
                                <p className="text-xs text-gray-600">
                                  {item.product.colorOptions?.option1?.label || 'Flower color'}: {item.selectedColors.option1}
                                </p>
                              )}
                              {item.selectedColors.option2 && (
                                <p className="text-xs text-gray-600">
                                  {item.product.colorOptions?.option2?.label || 'Pot color'}: {item.selectedColors.option2}
                                </p>
                              )}
                              {item.selectedColors.option3 && (
                                <p className="text-xs text-gray-600">
                                  {item.product.colorOptions?.option3?.label || 'Color 3'}: {item.selectedColors.option3}
                                </p>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Item Total - Hidden on mobile, shown on tablet+ */}
                        <div className="hidden sm:block text-right flex-shrink-0">
                          <p className="text-lg font-bold text-purple">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>

                      {/* Quantity Controls and Remove Button */}
                      <div className="flex items-center justify-between sm:justify-start gap-4 mt-4">
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedColors)}
                            className="px-3 py-1 hover:bg-gray-100 transition-colors text-lg leading-none"
                          >
                            −
                          </button>
                          <span className="px-4 py-1 border-x border-gray-300 min-w-[3rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedColors)}
                            className="px-3 py-1 hover:bg-gray-100 transition-colors text-lg leading-none">
                            +
                          </button>
                        </div>

                        {/* Item Total - Visible on mobile only */}
                        <div className="sm:hidden font-bold text-purple">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </div>

                        <button
                          onClick={() => removeFromCart(item.product.id, item.selectedColors)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={clearCart}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Clear Cart
              </button>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="card p-4 sm:p-6 lg:sticky lg:top-24">
                <h2 className="text-xl sm:text-2xl font-bold text-purple-dark mb-4">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span className="font-semibold">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700 text-sm sm:text-base">
                    <span>Shipping</span>
                    <span className="text-sm">Calculated at checkout</span>
                  </div>
                  <div className="flex justify-between text-gray-700 text-sm sm:text-base">
                    <span>Tax</span>
                    <span className="text-sm">Calculated at checkout</span>
                  </div>
                  <p className="text-xs text-gray-500 text-center mt-2">
                    Final shipping cost based on your address
                  </p>
                </div>

                <Link href="/checkout" className="btn-primary w-full text-center block mb-3">
                  Proceed to Checkout
                </Link>

                <Link href="/shop" className="btn-secondary w-full text-center block">
                  Continue Shopping
                </Link>

                <div className="mt-6 pt-6 border-t border-gray-200 space-y-2 text-sm text-gray-600">
                  <div className="flex items-start gap-2">
                    <span className="text-purple">✓</span>
                    <span>Secure checkout</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-purple">✓</span>
                    <span>Real-time shipping rates</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-purple">✓</span>
                    <span>Handmade with care</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
