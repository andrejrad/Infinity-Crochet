import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import SEO from '@/components/SEO';
import ProductCard from '@/components/ProductCard';
import { collection, getDocs, query, where, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Product, Category } from '@/types/user';
import { AVAILABLE_COLORS } from '@/components/ColorMultiSelect';
import { useCart } from '@/contexts/CartContext';

export default function ProductPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [product, setProduct] = useState<Product | null>(null);
  const [categoryName, setCategoryName] = useState<string>('');
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [selectedColors, setSelectedColors] = useState<{
    option1?: string;
    option2?: string;
    option3?: string;
  }>({});
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const { addToCart } = useCart();

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (product?.images) {
      if (isLeftSwipe && selectedImageIndex < product.images.length - 1) {
        setSelectedImageIndex(selectedImageIndex + 1);
      }
      if (isRightSwipe && selectedImageIndex > 0) {
        setSelectedImageIndex(selectedImageIndex - 1);
      }
    }
  };

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      try {
        // Find product by slug
        const productsRef = collection(db, 'products');
        const productsSnapshot = await getDocs(productsRef);
        const productDoc = productsSnapshot.docs.find(doc => doc.data().slug === slug);
        
        if (!productDoc) {
          router.push('/404');
          return;
        }

        const productData = {
          id: productDoc.id,
          ...productDoc.data()
        } as Product;
        setProduct(productData);

        // Get category name
        const categoriesRef = collection(db, 'categories');
        const categoriesSnapshot = await getDocs(categoriesRef);
        const categoryDoc = categoriesSnapshot.docs.find(doc => doc.id === productData.category);
        setCategoryName(categoryDoc?.data().name || productData.category);

        // Get related products from the same category
        const relatedQuery = query(
          productsRef,
          where('category', '==', productData.category),
          limit(5)
        );
        const relatedSnapshot = await getDocs(relatedQuery);
        const related = relatedSnapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          }) as Product)
          .filter(prod => prod.id !== productData.id)
          .slice(0, 4);
        setRelatedProducts(related);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching product data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [slug, router]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-purple"></div>
      </div>
    );
  }

  if (!product) {
    return null;
  }
  return (
    <>
      <SEO 
        title={product.name}
        description={product.description}
        url={`https://infinity-crochet.com/shop/product/${product.slug}`}
        image={product.image}
      />
      
      <div className="pt-24 bg-white">
        {/* Breadcrumb */}
        <div className="container-custom py-6">
          <nav className="text-gray-600 text-sm">
            <Link href="/" className="hover:text-purple">Home</Link>
            {' / '}
            <Link href="/shop" className="hover:text-purple">Shop</Link>
            {' / '}
            <Link href={`/shop/category/${product.category}`} className="hover:text-purple">
              {categoryName}
            </Link>
            {' / '}
            <span className="text-purple-dark">{product.name}</span>
          </nav>
        </div>

        {/* Product Details */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="grid md:grid-cols-2 gap-12 items-start">
              {/* Product Image */}
              <div className="space-y-4">
                <div 
                  className="card overflow-hidden bg-gradient-to-br from-lilac-light to-white cursor-pointer"
                  onClick={() => setIsFullscreen(true)}
                  onTouchStart={onTouchStart}
                  onTouchMove={onTouchMove}
                  onTouchEnd={onTouchEnd}
                >
                  <div className="relative h-96 md:h-[600px] flex items-center justify-center p-4">
                    {product.images && product.images.length > 0 ? (
                      <img 
                        src={product.images[selectedImageIndex]} 
                        alt={product.name}
                        className="max-w-full max-h-full object-contain"
                      />
                    ) : product.image ? (
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="max-w-full max-h-full object-contain"
                      />
                    ) : (
                      <div className="text-9xl">🧶</div>
                    )}
                    {/* Swipe indicators */}
                    {product.images && product.images.length > 1 && (
                      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                        {product.images.map((_, index) => (
                          <div
                            key={index}
                            className={`h-2 rounded-full transition-all ${
                              index === selectedImageIndex 
                                ? 'w-8 bg-purple' 
                                : 'w-2 bg-purple/30'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Thumbnail Gallery */}
                {product.images && product.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-4">
                    {product.images.map((img, index) => (
                      <div 
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`card cursor-pointer hover:ring-2 ring-purple transition-all overflow-hidden bg-gradient-to-br from-lilac-light to-white ${
                          selectedImageIndex === index ? 'ring-2 ring-purple' : ''
                        }`}
                      >
                        <div className="relative h-24 flex items-center justify-center p-2">
                          {img ? (
                            <img 
                              src={img} 
                              alt={`${product.name} ${index + 1}`}
                              className="max-w-full max-h-full object-contain"
                            />
                          ) : (
                            <span className="text-3xl">🧶</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Product Video */}
                {product.video && (
                  <div className="card overflow-hidden bg-gradient-to-br from-lilac-light to-white">
                    <video
                      src={product.video}
                      controls
                      className="w-full h-auto max-h-[600px] object-contain bg-black"
                      poster={product.image}
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="space-y-6">
                <div>
                  <div className="text-sm text-lilac-dark uppercase tracking-wide mb-2">
                    {categoryName}
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold text-purple-dark mb-4">
                    {product.name}
                  </h1>
                  <div className="text-3xl font-bold text-purple mb-6">
                    ${product.price.toFixed(2)}
                  </div>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 text-lg leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Stock Status */}
                <div className="flex items-center gap-2">
                  {product.inStock ? (
                    <>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-green-700 font-medium">In Stock</span>
                    </>
                  ) : (
                    <>
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-red-700 font-medium">Out of Stock</span>
                    </>
                  )}
                </div>

                {/* Color Customization */}
                {product.colorOptions && (
                  product.colorOptions.option1?.enabled || 
                  product.colorOptions.option2?.enabled || 
                  product.colorOptions.option3?.enabled
                ) && (
                  <div className="bg-lilac-light/30 border border-lilac rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Customize Your Colors</h3>
                    <div className="space-y-4">
                      {product.colorOptions.option1?.enabled && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">
                            {product.colorOptions.option1.label}
                            {selectedColors.option1 && (
                              <span className="ml-2 text-purple font-normal">
                                ({AVAILABLE_COLORS.find(c => c.value === selectedColors.option1)?.name})
                              </span>
                            )}
                          </label>
                          <div className="flex flex-wrap gap-3">
                            {(product.colorOptions.option1.availableColors || []).map(colorValue => {
                              const colorObj = AVAILABLE_COLORS.find(c => c.value === colorValue);
                              if (!colorObj) return null;
                              const isSelected = selectedColors.option1 === colorValue;
                              return (
                                <button
                                  key={colorValue}
                                  type="button"
                                  onClick={() => setSelectedColors({ ...selectedColors, option1: colorValue })}
                                  className={`group relative flex flex-col items-center gap-2 p-2 rounded-lg transition-all ${
                                    isSelected ? 'ring-2 ring-purple ring-offset-2' : 'hover:bg-gray-50'
                                  }`}
                                  title={colorObj.name}
                                >
                                  <div
                                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                                      isSelected ? 'border-purple scale-110' : 'border-gray-300 group-hover:border-purple group-hover:scale-105'
                                    }`}
                                    style={{ backgroundColor: colorObj.hex }}
                                  />
                                  <span className="text-xs text-gray-600 text-center leading-tight max-w-[60px]">
                                    {colorObj.name}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                      {product.colorOptions.option2?.enabled && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">
                            {product.colorOptions.option2.label}
                            {selectedColors.option2 && (
                              <span className="ml-2 text-purple font-normal">
                                ({AVAILABLE_COLORS.find(c => c.value === selectedColors.option2)?.name})
                              </span>
                            )}
                          </label>
                          <div className="flex flex-wrap gap-3">
                            {(product.colorOptions.option2.availableColors || []).map(colorValue => {
                              const colorObj = AVAILABLE_COLORS.find(c => c.value === colorValue);
                              if (!colorObj) return null;
                              const isSelected = selectedColors.option2 === colorValue;
                              return (
                                <button
                                  key={colorValue}
                                  type="button"
                                  onClick={() => setSelectedColors({ ...selectedColors, option2: colorValue })}
                                  className={`group relative flex flex-col items-center gap-2 p-2 rounded-lg transition-all ${
                                    isSelected ? 'ring-2 ring-purple ring-offset-2' : 'hover:bg-gray-50'
                                  }`}
                                  title={colorObj.name}
                                >
                                  <div
                                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                                      isSelected ? 'border-purple scale-110' : 'border-gray-300 group-hover:border-purple group-hover:scale-105'
                                    }`}
                                    style={{ backgroundColor: colorObj.hex }}
                                  />
                                  <span className="text-xs text-gray-600 text-center leading-tight max-w-[60px]">
                                    {colorObj.name}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                      {product.colorOptions.option3?.enabled && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">
                            {product.colorOptions.option3.label}
                            {selectedColors.option3 && (
                              <span className="ml-2 text-purple font-normal">
                                ({AVAILABLE_COLORS.find(c => c.value === selectedColors.option3)?.name})
                              </span>
                            )}
                          </label>
                          <div className="flex flex-wrap gap-3">
                            {(product.colorOptions.option3.availableColors || []).map(colorValue => {
                              const colorObj = AVAILABLE_COLORS.find(c => c.value === colorValue);
                              if (!colorObj) return null;
                              const isSelected = selectedColors.option3 === colorValue;
                              return (
                                <button
                                  key={colorValue}
                                  type="button"
                                  onClick={() => setSelectedColors({ ...selectedColors, option3: colorValue })}
                                  className={`group relative flex flex-col items-center gap-2 p-2 rounded-lg transition-all ${
                                    isSelected ? 'ring-2 ring-purple ring-offset-2' : 'hover:bg-gray-50'
                                  }`}
                                  title={colorObj.name}
                                >
                                  <div
                                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                                      isSelected ? 'border-purple scale-110' : 'border-gray-300 group-hover:border-purple group-hover:scale-105'
                                    }`}
                                    style={{ backgroundColor: colorObj.hex }}
                                  />
                                  <span className="text-xs text-gray-600 text-center leading-tight max-w-[60px]">
                                    {colorObj.name}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {product.tags && product.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map(tag => (
                      <span 
                        key={tag}
                        className="px-3 py-1 bg-lilac-light text-purple-dark text-sm rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Product Specifications */}
                {(product.dimensions || product.weight) && (
                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-3">Product Specifications</h3>
                    <div className="space-y-2 text-sm text-gray-700">
                      {product.dimensions && (
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-purple-dark">Dimensions:</span>
                          <span>
                            {product.dimensions.width} × {product.dimensions.height} × {product.dimensions.depth} {product.dimensions.unit}
                          </span>
                          <span className="text-gray-500">(W × H × D)</span>
                        </div>
                      )}
                      {product.weight && (
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-purple-dark">Weight:</span>
                          <span>
                            {product.weight.value} {product.weight.unit}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Add to Cart */}
                <div className="pt-6 border-t border-gray-200">
                  <div className="flex items-center gap-4 mb-4">
                    <label className="text-sm font-medium text-gray-700">Quantity:</label>
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-3 py-2 hover:bg-gray-100 transition-colors"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-16 text-center border-x border-gray-300 py-2"
                      />
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-3 py-2 hover:bg-gray-100 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={() => {
                        addToCart(product, quantity, selectedColors);
                        setAddedToCart(true);
                        setTimeout(() => setAddedToCart(false), 2000);
                      }}
                      disabled={!product.inStock}
                      className={`flex-1 btn-primary text-center disabled:opacity-50 disabled:cursor-not-allowed ${
                        addedToCart ? 'bg-green-600 hover:bg-green-700' : ''
                      }`}
                    >
                      {addedToCart ? '✓ Added to Cart!' : product.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                    <Link
                      href="/cart"
                      className="flex-1 btn-secondary text-center"
                    >
                      View Cart
                    </Link>
                  </div>

                  <p className="text-sm text-gray-600 mt-4 text-center">
                    Or{' '}
                    <a
                      href={(() => {
                        const subject = `Interest in ${product.name}`;
                        let body = `Hi, I'm interested in purchasing the ${product.name}.`;
                        
                        const colorSelections = [];
                        if (product.colorOptions?.option1?.enabled && selectedColors.option1) {
                          colorSelections.push(`${product.colorOptions.option1.label}: ${selectedColors.option1}`);
                        }
                        if (product.colorOptions?.option2?.enabled && selectedColors.option2) {
                          colorSelections.push(`${product.colorOptions.option2.label}: ${selectedColors.option2}`);
                        }
                        if (product.colorOptions?.option3?.enabled && selectedColors.option3) {
                          colorSelections.push(`${product.colorOptions.option3.label}: ${selectedColors.option3}`);
                        }
                        
                        if (colorSelections.length > 0) {
                          body += `\n\nColor preferences:\n${colorSelections.join('\n')}`;
                        }
                        
                        return `mailto:contact@infinity-crochet.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                      })()}
                      className="text-purple hover:text-purple-dark underline"
                    >
                      contact us for custom orders
                    </a>
                  </p>
                </div>

                {/* Instagram Link */}
                <div className="pt-4">
                  <a 
                    href="https://www.instagram.com/crochet_by_infinity"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple hover:text-purple-dark text-sm flex items-center gap-2 justify-center"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    Follow us on Instagram
                  </a>
                </div>

                {/* Additional Info */}
                <div className="pt-6 border-t border-gray-200 space-y-3 text-sm text-gray-600">
                  <div className="flex items-start gap-2">
                    <span className="text-purple">✓</span>
                    <span>Handmade with love and care</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-purple">✓</span>
                    <span>Made with high-quality, soft yarn</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-purple">✓</span>
                    <span>Each piece is unique and may have slight variations</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-purple">✓</span>
                    <span>Custom colors and sizes available upon request</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="section-padding bg-gradient-to-br from-lilac-light to-white">
            <div className="container-custom">
              <h2 className="text-3xl md:text-4xl font-bold text-purple-dark mb-8">
                You May Also Like
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {relatedProducts.map(relatedProduct => (
                  <ProductCard key={relatedProduct.id} {...relatedProduct} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Fullscreen Image Modal */}
        {isFullscreen && (
          <div 
            className="fixed inset-0 z-50 bg-black flex items-center justify-center"
            onClick={() => setIsFullscreen(false)}
          >
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
              aria-label="Close fullscreen"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div 
              className="w-full h-full flex items-center justify-center p-4"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              onClick={(e) => e.stopPropagation()}
            >
              {product.images && product.images.length > 0 ? (
                <img 
                  src={product.images[selectedImageIndex]} 
                  alt={product.name}
                  className="max-w-full max-h-full object-contain"
                />
              ) : product.image ? (
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="max-w-full max-h-full object-contain"
                />
              ) : null}
            </div>

            {/* Navigation arrows for multiple images */}
            {product.images && product.images.length > 1 && (
              <>
                {selectedImageIndex > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImageIndex(selectedImageIndex - 1);
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 bg-black/50 rounded-full p-2"
                    aria-label="Previous image"
                  >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )}
                
                {selectedImageIndex < product.images.length - 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImageIndex(selectedImageIndex + 1);
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 bg-black/50 rounded-full p-2"
                    aria-label="Next image"
                  >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}

                {/* Image counter */}
                <div className="absolute bottom-4 left-0 right-0 text-center text-white text-sm">
                  {selectedImageIndex + 1} / {product.images.length}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}
