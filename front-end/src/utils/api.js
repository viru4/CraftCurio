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
 * 
 * Example valid payload:
 * {
 *   title: "Updated Title",
 *   description: "Updated description",
 *   price: 1500,
 *   category: "Pottery",
 *   image: "https://...",
 *   saleType: "direct"
 * }
 * 
 * For auction items:
 * {
 *   title: "Auction Item",
 *   price: 1000,
 *   saleType: "auction",
 *   auction: {
 *     startTime: "2025-12-20T10:00:00.000Z",
 *     endTime: "2025-12-27T10:00:00.000Z",
 *     reservePrice: 1500,
 *     buyNowPrice: 3000
 *   }
 * }
 */
export const updateCollectible = async (id, updateData) => {
  // Sanitize payload before sending
  const sanitizedData = { ...updateData };
  
  // Convert numeric fields from strings to numbers
  if (sanitizedData.price !== undefined && sanitizedData.price !== '') {
    sanitizedData.price = Number(sanitizedData.price);
  }
  
  // Handle auction fields
  if (sanitizedData.auction) {
    // Convert auction numeric fields
    if (sanitizedData.auction.reservePrice !== undefined && sanitizedData.auction.reservePrice !== '') {
      sanitizedData.auction.reservePrice = Number(sanitizedData.auction.reservePrice);
    }
    if (sanitizedData.auction.buyNowPrice !== undefined && sanitizedData.auction.buyNowPrice !== '') {
      sanitizedData.auction.buyNowPrice = Number(sanitizedData.auction.buyNowPrice);
    }
    if (sanitizedData.auction.minimumBidIncrement !== undefined && sanitizedData.auction.minimumBidIncrement !== '') {
      sanitizedData.auction.minimumBidIncrement = Number(sanitizedData.auction.minimumBidIncrement);
    }
  }
  
  // Remove auction field for direct sales
  if (sanitizedData.saleType === 'direct') {
    delete sanitizedData.auction;
  }
  
  // Handle shipping info numeric fields
  if (sanitizedData.shippingInfo) {
    if (sanitizedData.shippingInfo.weight !== undefined && sanitizedData.shippingInfo.weight !== '') {
      sanitizedData.shippingInfo.weight = Number(sanitizedData.shippingInfo.weight);
    }
    if (sanitizedData.shippingInfo.dimensions) {
      if (sanitizedData.shippingInfo.dimensions.height !== undefined && sanitizedData.shippingInfo.dimensions.height !== '') {
        sanitizedData.shippingInfo.dimensions.height = Number(sanitizedData.shippingInfo.dimensions.height);
      }
      if (sanitizedData.shippingInfo.dimensions.width !== undefined && sanitizedData.shippingInfo.dimensions.width !== '') {
        sanitizedData.shippingInfo.dimensions.width = Number(sanitizedData.shippingInfo.dimensions.width);
      }
      if (sanitizedData.shippingInfo.dimensions.depth !== undefined && sanitizedData.shippingInfo.dimensions.depth !== '') {
        sanitizedData.shippingInfo.dimensions.depth = Number(sanitizedData.shippingInfo.dimensions.depth);
      }
    }
  }
  
  console.log('API: updateCollectible payload:', JSON.stringify(sanitizedData, null, 2));
  
  const response = await api.put(`/collectibles/${id}`, sanitizedData);
  console.log('API: updateCollectible response:', response.data);
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

/**
 * Relist an ended/unsold auction
 * @param {String} id - Auction ID
 * @param {Object} relistData - { startTime, endTime, startingBid?, reservePrice?, minimumBidIncrement? }
 * @returns {Promise<Object>} Relist result
 */
export const relistAuction = async (id, relistData) => {
  const response = await api.post(`/auction/${id}/relist`, relistData);
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
  console.log('API: getCollectorListings called with:', { collectorId, params });
  const response = await api.get(`/collectibles/collector/${collectorId}/listings`, { params });
  console.log('API: getCollectorListings response:', response.data);
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
// NOTIFICATIONS
// ============================================================================

/**
 * Get user notifications
 * @param {Object} params - Query parameters (unreadOnly, limit, skip, type)
 * @returns {Promise<Object>} Notifications data
 */
export const getNotifications = async (params = {}) => {
  const response = await api.get('/notifications', { params });
  return response.data;
};

/**
 * Mark notification as read
 * @param {String} notificationId - Notification ID
 * @returns {Promise<Object>} Updated notification
 */
export const markNotificationAsRead = async (notificationId) => {
  const response = await api.patch(`/notifications/${notificationId}/read`);
  return response.data;
};

/**
 * Mark all notifications as read
 * @returns {Promise<Object>} Result
 */
export const markAllNotificationsAsRead = async () => {
  const response = await api.patch('/notifications/read-all');
  return response.data;
};

/**
 * Delete notification
 * @param {String} notificationId - Notification ID
 * @returns {Promise<Object>} Result
 */
export const deleteNotification = async (notificationId) => {
  const response = await api.delete(`/notifications/${notificationId}`);
  return response.data;
};

// ============================================================================
// ORDERS
// ============================================================================

/**
 * Get user orders
 * @returns {Promise<Object>} Orders data
 */
export const getUserOrders = async () => {
  const response = await api.get('/orders');
  return response.data;
};

/**
 * Get order by ID
 * @param {String} orderId - Order ID
 * @returns {Promise<Object>} Order details
 */
export const getOrderById = async (orderId) => {
  const response = await api.get(`/orders/${orderId}`);
  return response.data;
};

/**
 * Update order shipping address
 * @param {String} orderId - Order ID
 * @param {Object} shippingAddress - Shipping address data
 * @returns {Promise<Object>} Updated order
 */
export const updateOrderShippingAddress = async (orderId, shippingAddress) => {
  const response = await api.patch(`/orders/${orderId}/shipping-address`, { shippingAddress });
  return response.data;
};

// ============================================================================
// ADDRESS APIs
// ============================================================================

/**
 * Get all saved addresses
 * @returns {Promise<Object>} List of saved addresses
 */
export const getSavedAddresses = async () => {
  const response = await api.get('/addresses');
  return response.data;
};

/**
 * Add a new address
 * @param {Object} addressData - Address data
 * @returns {Promise<Object>} Created address
 */
export const addAddress = async (addressData) => {
  const response = await api.post('/addresses', addressData);
  return response.data;
};

/**
 * Update an existing address
 * @param {String} addressId - Address ID
 * @param {Object} addressData - Updated address data
 * @returns {Promise<Object>} Updated address
 */
export const updateAddress = async (addressId, addressData) => {
  const response = await api.put(`/addresses/${addressId}`, addressData);
  return response.data;
};

/**
 * Delete an address
 * @param {String} addressId - Address ID
 * @returns {Promise<Object>} Deletion result
 */
export const deleteAddress = async (addressId) => {
  const response = await api.delete(`/addresses/${addressId}`);
  return response.data;
};

/**
 * Set an address as default
 * @param {String} addressId - Address ID
 * @returns {Promise<Object>} Update result
 */
export const setDefaultAddress = async (addressId) => {
  const response = await api.patch(`/addresses/${addressId}/default`);
  return response.data;
};

// ============================================================================
// PAYMENT APIs
// ============================================================================

/**
 * Create Razorpay order
 * @param {String} orderId - Order ID
 * @param {Number} amount - Amount in rupees
 * @returns {Promise<Object>} Razorpay order details
 */
export const createPaymentOrder = async (orderId, amount) => {
  const response = await api.post('/payments/create-order', { orderId, amount });
  return response.data;
};

/**
 * Verify payment after transaction
 * @param {Object} paymentData - Payment verification data
 * @returns {Promise<Object>} Verification result
 */
export const verifyPayment = async (paymentData) => {
  const response = await api.post('/payments/verify', paymentData);
  return response.data;
};

/**
 * Record payment failure
 * @param {String} orderId - Order ID
 * @param {Object} error - Error details
 * @returns {Promise<Object>} Result
 */
export const recordPaymentFailure = async (orderId, error) => {
  const response = await api.post('/payments/failure', { orderId, error });
  return response.data;
};

/**
 * Get payment details
 * @param {String} paymentId - Razorpay payment ID
 * @returns {Promise<Object>} Payment details
 */
export const getPaymentDetails = async (paymentId) => {
  const response = await api.get(`/payments/${paymentId}`);
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
