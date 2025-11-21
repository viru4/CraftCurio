import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { API_ENDPOINTS } from '@/config/api';

const WishlistContext = createContext(null);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
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
      let errorMessage = 'Request failed';
      try {
        const error = await response.json();
        errorMessage = error.message || errorMessage;
        console.error('API Error Response:', error);
      } catch (e) {
        console.error('Failed to parse error response:', e);
      }
      console.error('API Request failed:', { url, status: response.status, statusText: response.statusText });
      throw new Error(errorMessage);
    }

    return response.json();
  }, []);

  // Fetch wishlist from backend on mount
  useEffect(() => {
    const fetchWishlist = async () => {
      const token = getAuthToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await makeAuthRequest(API_ENDPOINTS.wishlist);
        setWishlistItems(data.data.items || []);
      } catch (error) {
        console.error('Error fetching wishlist:', error);
        // Fallback to localStorage if API fails
        const savedWishlist = localStorage.getItem('wishlist');
        if (savedWishlist) {
          setWishlistItems(JSON.parse(savedWishlist));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [makeAuthRequest]);

  // Sync with localStorage as backup (offline support)
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
    }
  }, [wishlistItems, loading]);

  // Add item to wishlist
  const addToWishlist = async (product) => {
    // Store previous items for rollback
    const previousItems = [...wishlistItems];
    
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('Please sign in to add items to your wishlist');
      }

      console.log('Adding to wishlist:', product);

      // Optimistically update UI
      const newItem = { 
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        artisan: product.artisan,
        category: product.category,
        type: product.type || 'artisan-product',
        addedAt: new Date().toISOString() 
      };
      setWishlistItems((prevItems) => {
        const exists = prevItems.find((item) => item.id === product.id);
        if (exists) return prevItems;
        return [...prevItems, newItem];
      });

      // Make API call
      const requestBody = {
        productId: product.id,
        productType: product.type || 'artisan-product',
      };
      console.log('Sending to API:', requestBody);
      
      const response = await makeAuthRequest(API_ENDPOINTS.wishlist, {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      console.log('API Response:', response);

      // Refetch wishlist to ensure consistency with backend
      const updatedWishlist = await makeAuthRequest(API_ENDPOINTS.wishlist);
      setWishlistItems(updatedWishlist.data.items || []);
      
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      // Revert on error
      setWishlistItems(previousItems);
      throw error;
    }
  };

  // Remove item from wishlist
  const removeFromWishlist = async (productId) => {
    // Store previous items for rollback
    const previousItems = [...wishlistItems];
    
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('Please sign in to manage your wishlist');
      }

      // Optimistically update UI
      setWishlistItems((prevItems) => 
        prevItems.filter((item) => item.id !== productId)
      );

      // Make API call
      await makeAuthRequest(`${API_ENDPOINTS.wishlist}/${productId}`, {
        method: 'DELETE',
      });

      // Refetch wishlist to ensure consistency with backend
      const updatedWishlist = await makeAuthRequest(API_ENDPOINTS.wishlist);
      setWishlistItems(updatedWishlist.data.items || []);
      
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      // Revert on error
      setWishlistItems(previousItems);
      throw error;
    }
  };

  // Toggle item in wishlist
  const toggleWishlist = async (product) => {
    const isInList = wishlistItems.some((item) => item.id === product.id);
    
    if (isInList) {
      await removeFromWishlist(product.id);
    } else {
      await addToWishlist(product);
    }
  };

  // Clear wishlist
  const clearWishlist = async () => {
    // Store previous items for rollback
    const previousItems = [...wishlistItems];
    
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('Please sign in to manage your wishlist');
      }

      // Optimistically update UI
      setWishlistItems([]);

      // Make API call
      await makeAuthRequest(API_ENDPOINTS.wishlist, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      // Revert on error
      setWishlistItems(previousItems);
      throw error;
    }
  };

  // Check if item is in wishlist
  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item.id === productId);
  };

  // Get wishlist item count
  const getWishlistCount = () => {
    return wishlistItems.length;
  };

  const value = {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    clearWishlist,
    isInWishlist,
    getWishlistCount,
    loading,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};
