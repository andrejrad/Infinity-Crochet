import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from './AuthContext';
import type { CartItem, Product } from '@/types/user';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedColors?: {
    option1?: string;
    option2?: string;
    option3?: string;
  }) => void;
  removeFromCart: (productId: string, selectedColors?: {
    option1?: string;
    option2?: string;
    option3?: string;
  }) => void;
  updateQuantity: (productId: string, quantity: number, selectedColors?: {
    option1?: string;
    option2?: string;
    option3?: string;
  }) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const isLoadingRef = useRef(false);

  // Load cart from localStorage or Firestore on mount
  useEffect(() => {
    const loadCart = async () => {
      isLoadingRef.current = true; // Block saves during load
      
      if (user) {
        // Logged in: Load from Firestore
        try {
          const cartDoc = await getDoc(doc(db, 'carts', user.uid));
          if (cartDoc.exists()) {
            const firestoreCart = cartDoc.data().items || [];
            
            // Merge with localStorage cart (if any items were added as guest)
            const localCart = localStorage.getItem('infinity-crochet-cart');
            if (localCart) {
              const parsedLocalCart = JSON.parse(localCart);
              if (parsedLocalCart.length > 0) {
                // Merge carts - combine items
                const mergedCart = [...firestoreCart];
                parsedLocalCart.forEach((localItem: CartItem) => {
                  const existingIndex = mergedCart.findIndex(item => 
                    item.product.id === localItem.product.id &&
                    JSON.stringify(item.selectedColors) === JSON.stringify(localItem.selectedColors)
                  );
                  if (existingIndex !== -1) {
                    mergedCart[existingIndex].quantity += localItem.quantity;
                  } else {
                    mergedCart.push(localItem);
                  }
                });
                setCart(mergedCart);
                // Clear localStorage after merge
                localStorage.removeItem('infinity-crochet-cart');
                setIsLoaded(true);
                isLoadingRef.current = false;
                return;
              }
            }
            setCart(firestoreCart);
          } else {
            // No cart in Firestore, check localStorage
            const localCart = localStorage.getItem('infinity-crochet-cart');
            if (localCart) {
              setCart(JSON.parse(localCart));
            }
          }
        } catch (error) {
          console.error('Error loading cart from Firestore:', error);
          // Fallback to localStorage
          const localCart = localStorage.getItem('infinity-crochet-cart');
          if (localCart) {
            setCart(JSON.parse(localCart));
          }
        }
      } else {
        // Not logged in: Load from localStorage
        const savedCart = localStorage.getItem('infinity-crochet-cart');
        if (savedCart) {
          try {
            setCart(JSON.parse(savedCart));
          } catch (error) {
            console.error('Error loading cart:', error);
          }
        }
      }
      setIsLoaded(true);
      isLoadingRef.current = false;
    };

    loadCart();
  }, [user]);

  // Save cart to localStorage and/or Firestore whenever it changes
  useEffect(() => {
    const saveCart = async () => {
      // Don't save during initial load
      if (!isLoaded || isLoadingRef.current) return;

      if (user) {
        // Logged in: Save to Firestore
        try {
          await setDoc(doc(db, 'carts', user.uid), {
            items: cart,
            updatedAt: new Date(),
          });
        } catch (error) {
          console.error('Error saving cart to Firestore:', error);
        }
      } else {
        // Not logged in: Save to localStorage
        localStorage.setItem('infinity-crochet-cart', JSON.stringify(cart));
      }
    };

    saveCart();
  }, [cart, isLoaded, user]);

  const addToCart = (product: Product, quantity = 1, selectedColors?: {
    option1?: string;
    option2?: string;
    option3?: string;
  }) => {
    setCart(currentCart => {
      // Check if product with same colors already exists
      const existingItemIndex = currentCart.findIndex(item => {
        if (item.product.id !== product.id) return false;
        
        // Check if colors match
        const existingColors = item.selectedColors || {};
        const newColors = selectedColors || {};
        
        return (
          existingColors.option1 === newColors.option1 &&
          existingColors.option2 === newColors.option2 &&
          existingColors.option3 === newColors.option3
        );
      });

      if (existingItemIndex !== -1) {
        // Update quantity of existing item
        const newCart = [...currentCart];
        newCart[existingItemIndex] = {
          ...newCart[existingItemIndex],
          quantity: newCart[existingItemIndex].quantity + quantity
        };
        return newCart;
      } else {
        // Add new item
        return [...currentCart, { product, quantity, selectedColors }];
      }
    });
  };

  const removeFromCart = (productId: string, selectedColors?: {
    option1?: string;
    option2?: string;
    option3?: string;
  }) => {
    setCart(currentCart => currentCart.filter(item => {
      if (item.product.id !== productId) return true;
      
      // If no colors specified, remove all variants of this product
      if (!selectedColors) return false;
      
      // Check if colors match - keep items that don't match
      const itemColors = item.selectedColors || {};
      return (
        itemColors.option1 !== selectedColors.option1 ||
        itemColors.option2 !== selectedColors.option2 ||
        itemColors.option3 !== selectedColors.option3
      );
    }));
  };

  const updateQuantity = (productId: string, quantity: number, selectedColors?: {
    option1?: string;
    option2?: string;
    option3?: string;
  }) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedColors);
      return;
    }

    setCart(currentCart =>
      currentCart.map(item => {
        if (item.product.id !== productId) return item;
        
        // If no colors specified, update first matching product
        if (!selectedColors) return { ...item, quantity };
        
        // Check if colors match
        const itemColors = item.selectedColors || {};
        const colorsMatch = (
          itemColors.option1 === selectedColors.option1 &&
          itemColors.option2 === selectedColors.option2 &&
          itemColors.option3 === selectedColors.option3
        );
        
        return colorsMatch ? { ...item, quantity } : item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
