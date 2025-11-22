import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { API_ENDPOINTS } from '@/config/api';

const CartContext = createContext(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper function to get auth token
  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  // Helper function to make authenticated API calls
  const makeAuthRequest = useCallback(async (url, options = {}) => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Request failed');
    }

    return response.json();
  }, []);

  // Fetch cart from backend on mount
  useEffect(() => {
    const fetchCart = async () => {
      const token = getAuthToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await makeAuthRequest(API_ENDPOINTS.cart);
        setCartItems(data.data.items || []);
      } catch (error) {
        console.error('Error fetching cart:', error);
        // Fallback to localStorage if API fails
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          setCartItems(JSON.parse(savedCart));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [makeAuthRequest]);

  // Sync with localStorage as backup (offline support)
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems, loading]);

  // Add item to cart
  const addToCart = async (product) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('Please sign in to add items to your cart');
      }

      console.log('Adding to cart:', product);

      // Make API call first to ensure backend succeeds
      const response = await makeAuthRequest(API_ENDPOINTS.cart, {
        method: 'POST',
        body: JSON.stringify({
          productId: product.id,
          productType: product.type || 'artisan-product',
          name: product.name,
          price: product.price,
          image: product.image,
          artisan: product.artisan,
          category: product.category,
          quantity: 1,
        }),
      });

      console.log('Cart API response:', response);

      // After successful API call, fetch the updated cart
      const cartData = await makeAuthRequest(API_ENDPOINTS.cart);
      setCartItems(cartData.data.items || []);
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId) => {
    // Store previous items for rollback
    const previousItems = [...cartItems];
    
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('Please sign in to manage your cart');
      }

      // Optimistically update UI
      setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));

      // Make API call
      await makeAuthRequest(`${API_ENDPOINTS.cart}/${productId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Error removing from cart:', error);
      // Revert on error
      setCartItems(previousItems);
      throw error;
    }
  };

  // Update item quantity
  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;

    // Store previous items for rollback
    const previousItems = [...cartItems];
    
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('Please sign in to manage your cart');
      }

      // Optimistically update UI
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === productId ? { ...item, quantity } : item
        )
      );

      // Make API call
      await makeAuthRequest(`${API_ENDPOINTS.cart}/${productId}`, {
        method: 'PUT',
        body: JSON.stringify({ quantity }),
      });
    } catch (error) {
      console.error('Error updating cart:', error);
      // Revert on error
      setCartItems(previousItems);
      throw error;
    }
  };

  // Clear cart
  const clearCart = async () => {
    // Store previous items for rollback
    const previousItems = [...cartItems];
    
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('Please sign in to manage your cart');
      }

      // Optimistically update UI
      setCartItems([]);

      // Make API call
      await makeAuthRequest(`${API_ENDPOINTS.cart}/clear`, {
        method: 'POST',
      });
    } catch (error) {
      console.error('Error clearing cart:', error);
      // Revert on error
      setCartItems(previousItems);
      throw error;
    }
  };

  // Check if item is in cart
  const isInCart = (productId) => {
    return cartItems.some((item) => item.id === productId || item.id === productId.toString());
  };

  // Get cart item count
  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Get cart total
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
    getCartCount,
    getCartTotal,
    loading,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
