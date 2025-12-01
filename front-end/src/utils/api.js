import axios from 'axios';

/**
 * API Utility - Axios instance configured for backend communication
 * Handles authentication, error handling, and API requests
 */

// Base URL for API - use empty string for relative requests (proxied by Vite)
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const buildEndpoint = (path) => `${API_BASE_URL}/api${path}`;

// API Endpoints - absolute URLs for fetch-based modules
export const API_ENDPOINTS = {
  categories: buildEndpoint('/categories'),
  collectibles: buildEndpoint('/collectibles'),
  artisanProducts: buildEndpoint('/artisan-products'),
  artisans: buildEndpoint('/artisans'),
  collectors: buildEndpoint('/collectors'),
  auth: buildEndpoint('/auth'),
  wishlist: buildEndpoint('/wishlist'),
  cart: buildEndpoint('/cart'),
  orders: buildEndpoint('/orders'),
  seed: buildEndpoint('/seed'),
  admin: buildEndpoint('/admin'),
  messages: buildEndpoint('/messages'),
  reviews: buildEndpoint('/reviews'),
  questions: buildEndpoint('/questions'),
  auction: buildEndpoint('/auction'),
  verification: buildEndpoint('/verification'),
  aboutUs: buildEndpoint('/about-us'),
};

const API_URL = `${API_BASE_URL}/api`;

/**
 * Create axios instance with default configuration
 */
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
  withCredentials: true,
});

/**
 * Request interceptor - Add auth token to requests
 */
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor - Handle errors globally
 */
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle specific error cases
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Unauthorized - redirect to login (only in production or when appropriate)
          if (import.meta.env.PROD) {
            localStorage.removeItem('authToken');
            window.location.href = '/login';
          }
          break;
        case 403:
          // Access forbidden - handled by calling code
          break;
        case 404:
          // Resource not found - handled by calling code
          break;
        case 500:
          // Server error - handled by calling code
          break;
        default:
          // Generic error - handled by calling code
          break;
      }
    }

    return Promise.reject(error);
  }
);

// ============================================================================
// COLLECTIBLES API
// ============================================================================

/**
 * Create a new collectible listing
 * @param {Object} collectibleData - Collectible data
 * @returns {Promise<Object>} Created collectible
 */
export const createCollectible = async (collectibleData) => {
  const response = await api.post('/collectibles', collectibleData);
  return response.data;
};

/**
 * Get all collectibles with filtering
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Collectibles list with pagination
 */
export const getCollectibles = async (params = {}) => {
  const response = await api.get('/collectibles', { params });
  return response.data;
};

/**
 * Get single collectible by ID
 * @param {String} id - Collectible ID
 * @returns {Promise<Object>} Collectible details
 */
export const getCollectibleById = async (id) => {
  const response = await api.get(`/collectibles/${id}`);
  return response.data;
};

/**
 * Update a collectible
 * @param {String} id - Collectible ID
 * @param {Object} updateData - Updated data
 * @returns {Promise<Object>} Updated collectible
 */
export const updateCollectible = async (id, updateData) => {
  const response = await api.put(`/collectibles/${id}`, updateData);
  return response.data;
};

/**
 * Delete a collectible
 * @param {String} id - Collectible ID
 * @returns {Promise<Object>} Deletion result
 */
export const deleteCollectible = async (id) => {
  const response = await api.delete(`/collectibles/${id}`);
  return response.data;
};

/**
 * Like a collectible
 * @param {String} id - Collectible ID
 * @returns {Promise<Object>} Updated likes count
 */
export const likeCollectible = async (id) => {
  const response = await api.put(`/collectibles/${id}/like`);
  return response.data;
};

/**
 * Get featured collectibles
 * @returns {Promise<Object>} Featured collectibles
 */
export const getFeaturedCollectibles = async () => {
  const response = await api.get('/collectibles/featured');
  return response.data;
};

/**
 * Get popular collectibles
 * @returns {Promise<Object>} Popular collectibles
 */
export const getPopularCollectibles = async () => {
  const response = await api.get('/collectibles/popular');
  return response.data;
};

/**
 * Get promoted collectibles
 * @returns {Promise<Object>} Promoted collectibles
 */
export const getPromotedCollectibles = async () => {
  const response = await api.get('/collectibles/promoted');
  return response.data;
};

// ============================================================================
// AUCTION API
// ============================================================================

/**
 * Get all live auctions
 * @param {Object} params - Query parameters (sortBy, page, limit, category)
 * @returns {Promise<Object>} Live auctions with pagination
 */
export const getLiveAuctions = async (params = {}) => {
  const response = await api.get('/auction/live', { params });
  return response.data;
};

/**
 * Get auction details
 * @param {String} id - Auction ID
 * @returns {Promise<Object>} Auction details with stats
 */
export const getAuctionDetails = async (id) => {
  const response = await api.get(`/auction/${id}`);
  return response.data;
};

/**
 * Place a bid on an auction
 * @param {String} id - Auction ID
 * @param {Object} bidData - { bidAmount, bidderId, bidderName, bidderEmail }
 * @returns {Promise<Object>} Bid result
 */
export const placeBid = async (id, bidData) => {
  const response = await api.post(`/auction/${id}/bid`, bidData);
  return response.data;
};

/**
 * Buy now - instant purchase
 * @param {String} id - Auction/Collectible ID
 * @param {Object} buyerData - { buyerId, buyerName, buyerEmail }
 * @returns {Promise<Object>} Purchase result
 */
export const buyNow = async (id, buyerData) => {
  const response = await api.post(`/auction/${id}/buy-now`, buyerData);
  return response.data;
};

/**
 * Cancel an auction
 * @param {String} id - Auction ID
 * @returns {Promise<Object>} Cancellation result
 */
export const cancelAuction = async (id) => {
  const response = await api.post(`/auction/${id}/cancel`);
  return response.data;
};

// ============================================================================
// COLLECTOR API
// ============================================================================

/**
 * Get collector's listings
 * @param {String} collectorId - Collector ID
 * @param {Object} params - Query parameters (status, saleType, page, limit)
 * @returns {Promise<Object>} Collector's listings
 */
export const getCollectorListings = async (collectorId, params = {}) => {
  const response = await api.get(`/collectibles/collector/${collectorId}/listings`, { params });
  return response.data;
};

/**
 * Get collector details
 * @param {String} collectorId - Collector ID
 * @returns {Promise<Object>} Collector details
 */
export const getCollectorDetails = async (collectorId) => {
  const response = await api.get(`/collectors/${collectorId}`);
  return response.data;
};

// ============================================================================
// AUTHENTICATION (if needed)
// ============================================================================

/**
 * Set authentication token
 * @param {String} token - JWT token
 */
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('authToken', token);
  } else {
    localStorage.removeItem('authToken');
  }
};

/**
 * Get current auth token
 * @returns {String|null} Auth token
 */
export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

/**
 * Check if user is authenticated
 * @returns {Boolean} Is authenticated
 */
export const isAuthenticated = () => {
  return !!getAuthToken();
};

// Export the axios instance for custom requests
export default api;
