import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { type Product, type DimensionOption } from '../data/products'; // Import DimensionOption

// localStorage utility functions
const CART_STORAGE_KEY = 'hardalum_cart';

const saveCartToLocalStorage = (cart: CartItem[]) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error('Failed to save cart to localStorage:', error);
  }
};

const loadCartFromLocalStorage = (): CartItem[] => {
  try {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    return storedCart ? JSON.parse(storedCart) : [];
  } catch (error) {
    console.error('Failed to load cart from localStorage:', error);
    return [];
  }
};

interface CartItem extends Product {
  quantity: number;
  selectedDimension?: DimensionOption; // Updated to DimensionOption
  price: number; // Ensure CartItem has a price, which will be the selected dimension's price or product's base price
  dimensionId?: number; // Add dimensionId for backend integration
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedDimension?: DimensionOption) => void; // Update selectedDimension type
  removeFromCart: (productId: number, selectedDimension?: DimensionOption) => void; // Update selectedDimension type
  updateQuantity: (productId: number, quantity: number, selectedDimension?: DimensionOption) => void; // Update selectedDimension type
  clearCart: () => void;
  cartError: string | null; // Add cartError state
  clearCartError: () => void; // Add function to clear cart error
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartError, setCartError] = useState<string | null>(null); // State for cart-related errors

  // Load cart items from localStorage when the component mounts
  useEffect(() => {
    const savedCart = loadCartFromLocalStorage();
    if (savedCart.length > 0) {
      setCart(savedCart);
    }
  }, []);

  const addToCart = async (product: Product, quantity: number = 1, selectedDimension?: DimensionOption) => {
    // Determine the price and dimension ID to use for the cart item
    const itemPrice = Number(selectedDimension ? selectedDimension.price : (product.price || 0));
    const dimensionId = selectedDimension ? selectedDimension.id : null;

    try {
      const response = await fetch('http://localhost:5000/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, productId: product.id, dimensionId, quantity }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newCartItem = await response.json();
      setCartError(null); // Clear any previous errors on successful API call

      setCart((prevCart) => {
        const updatedCart = (() => {
          const existingItem = prevCart.find(
            (item) =>
              item.id === product.id &&
              ((!item.selectedDimension && !selectedDimension) ||
                (item.selectedDimension?.dimension === selectedDimension?.dimension))
          );

          if (existingItem) {
            return prevCart.map((item) =>
              item.id === product.id &&
              ((!item.selectedDimension && !selectedDimension) ||
                (item.selectedDimension?.dimension === selectedDimension?.dimension))
                ? { ...item, quantity: item.quantity + quantity, price: itemPrice }
                : item
            );
          } else {
            return [...prevCart, { ...product, quantity, selectedDimension, price: itemPrice, dimensionId: newCartItem.dimension_id || undefined }];
          }
        })();

        // Save to localStorage
        saveCartToLocalStorage(updatedCart);
        return updatedCart;
      });

    } catch (error: any) {
      console.error("Failed to add item to cart:", error);
      setCartError("Failed to add item to cart. Please try again."); // Set error message
      // Fallback to local state update if API call fails (optional, depending on error handling strategy)
      setCart((prevCart) => {
        const updatedCart = (() => {
          const existingItem = prevCart.find(
            (item) =>
              item.id === product.id &&
              ((!item.selectedDimension && !selectedDimension) ||
                (item.selectedDimension?.dimension === selectedDimension?.dimension))
          );

          if (existingItem) {
            return prevCart.map((item) =>
              item.id === product.id &&
              ((!item.selectedDimension && !selectedDimension) ||
                (item.selectedDimension?.dimension === selectedDimension?.dimension))
                ? { ...item, quantity: item.quantity + quantity, price: itemPrice }
                : item
            );
          } else {
            return [...prevCart, { ...product, quantity, selectedDimension, price: itemPrice }];
          }
        })();

        // Save to localStorage
        saveCartToLocalStorage(updatedCart);
        return updatedCart;
      });
    }
  };

  const removeFromCart = (productId: number, selectedDimension?: DimensionOption) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter(
        (item) =>
          !(item.id === productId &&
            ((!item.selectedDimension && !selectedDimension) ||
              (item.selectedDimension?.dimension === selectedDimension?.dimension)))
      );
      // Save to localStorage
      saveCartToLocalStorage(updatedCart);
      return updatedCart;
    });
  };

  const updateQuantity = (productId: number, quantity: number, selectedDimension?: DimensionOption) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.map((item) =>
        item.id === productId &&
        ((!item.selectedDimension && !selectedDimension) ||
          (item.selectedDimension?.dimension === selectedDimension?.dimension))
          ? { ...item, quantity }
          : item
      );
      // Save to localStorage
      saveCartToLocalStorage(updatedCart);
      return updatedCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    // Clear localStorage
    saveCartToLocalStorage([]);
  };

  const clearCartError = () => {
    setCartError(null);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartError, clearCartError }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
