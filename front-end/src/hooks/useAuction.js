import { useState, useEffect, useCallback, useRef } from 'react';
import {
  getLiveAuctions,
  getAuctionDetails,
  placeBid,
  buyNow,
  cancelAuction,
} from '../utils/api';
import {
  initializeSocket,
  joinAuction,
  leaveAuction,
  onNewBid,
  onCountdownUpdate,
  onAuctionEndingSoon,
  onAuctionEnded,
  onAuctionCancelled,
  formatTimeRemaining,
} from '../utils/socket';

/**
 * Custom Hooks for Auction Management
 * Provides real-time auction data, bidding, and Socket.io integration
 */

/**
 * Hook to fetch and manage live auctions
 * @param {Object} initialParams - Initial query parameters
 * @returns {Object} Live auctions data and actions
 */
export const useLiveAuctions = (initialParams = {}) => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  /**
   * Fetch live auctions
   */
  const fetchAuctions = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);

    try {
      const mergedParams = { ...initialParams, ...params };
      const response = await getLiveAuctions(mergedParams);

      setAuctions(response.data || []);
      setPagination(response.pagination || {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch auctions');
      console.error('Error fetching auctions:', err);
    } finally {
      setLoading(false);
    }
  }, [initialParams]);

  /**
   * Refresh auctions
   */
  const refresh = useCallback(() => {
    fetchAuctions({ page: pagination.page });
  }, [fetchAuctions, pagination.page]);

  // Initial fetch
  useEffect(() => {
    fetchAuctions();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    auctions,
    loading,
    error,
    pagination,
    fetchAuctions,
    refresh,
  };
};

/**
 * Hook for managing a single auction with real-time updates
 * @param {String} auctionId - Auction collectible ID
 * @returns {Object} Auction data, real-time updates, and actions
 */
export const useAuction = (auctionId) => {
  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isEndingSoon, setIsEndingSoon] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);
  const cleanupRef = useRef([]);

  /**
   * Fetch auction details
   */
  const fetchAuction = useCallback(async () => {
    if (!auctionId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await getAuctionDetails(auctionId);
      setAuction(response.data);
      
      // Set initial time remaining
      if (response.data.stats) {
        setTimeRemaining(response.data.stats.timeRemaining || 0);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch auction');
      console.error('Error fetching auction:', err);
    } finally {
      setLoading(false);
    }
  }, [auctionId]);

  /**
   * Setup real-time listeners
   */
  useEffect(() => {
    if (!auctionId) return;

    // Initialize socket only once
    const socket = initializeSocket();
    if (!socket) return;

    // Join auction room
    joinAuction(auctionId, (data) => {
      setTimeRemaining(data.timeRemaining || 0);
    });

    // Listen for new bids
    const cleanupNewBid = onNewBid((data) => {
      if (data.collectibleId === auctionId) {
        setAuction((prev) => {
          if (!prev) return prev;
          
          return {
            ...prev,
            auction: {
              ...prev.auction,
              currentBid: data.currentBid,
              totalBids: data.totalBids,
              bidHistory: [
                ...(prev.auction.bidHistory || []),
                {
                  amount: data.bidAmount,
                  bidderName: data.bidderName,
                  timestamp: data.timestamp,
                },
              ],
            },
          };
        });
      }
    });

    // Listen for countdown updates
    const cleanupCountdown = onCountdownUpdate((data) => {
      if (data.collectibleId === auctionId) {
        setTimeRemaining(data.timeRemaining);
        setIsEndingSoon(data.timeRemaining < 5 * 60 * 1000); // < 5 minutes
      }
    });

    // Listen for ending soon alert
    const cleanupEndingSoon = onAuctionEndingSoon((data) => {
      if (data.collectibleId === auctionId) {
        setIsEndingSoon(true);
      }
    });

    // Listen for auction ended
    const cleanupEnded = onAuctionEnded((data) => {
      if (data.collectibleId === auctionId) {
        setHasEnded(true);
        setTimeRemaining(0);
        
        setAuction((prev) => {
          if (!prev) return prev;
          
          return {
            ...prev,
            auction: {
              ...prev.auction,
              auctionStatus: data.status,
              winner: data.winner,
              winningBid: data.finalPrice,
            },
            status: 'sold',
          };
        });
      }
    });

    // Listen for auction cancelled
    const cleanupCancelled = onAuctionCancelled((data) => {
      if (data.collectibleId === auctionId) {
        setHasEnded(true);
        
        setAuction((prev) => {
          if (!prev) return prev;
          
          return {
            ...prev,
            auction: {
              ...prev.auction,
              auctionStatus: 'cancelled',
            },
            status: 'inactive',
          };
        });
      }
    });

    // Store cleanup functions
    cleanupRef.current = [
      cleanupNewBid,
      cleanupCountdown,
      cleanupEndingSoon,
      cleanupEnded,
      cleanupCancelled,
    ];

    // Cleanup on unmount
    return () => {
      leaveAuction(auctionId);
      cleanupRef.current.forEach((cleanup) => cleanup());
    };
  }, [auctionId]);

  /**
   * Initial fetch
   */
  useEffect(() => {
    fetchAuction();
  }, [fetchAuction]);

  /**
   * Refresh auction data
   */
  const refresh = useCallback(() => {
    fetchAuction();
  }, [fetchAuction]);

  /**
   * Get formatted time remaining
   */
  const formattedTime = formatTimeRemaining(timeRemaining);

  return {
    auction,
    loading,
    error,
    timeRemaining,
    formattedTime,
    isEndingSoon,
    hasEnded,
    refresh,
  };
};

/**
 * Hook for placing bids
 * @returns {Object} Bid function and state
 */
export const usePlaceBid = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  /**
   * Place a bid
   */
  const bid = useCallback(async (auctionId, bidData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await placeBid(auctionId, bidData);
      setSuccess(true);
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to place bid';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Reset state
   */
  const reset = useCallback(() => {
    setError(null);
    setSuccess(false);
    setLoading(false);
  }, []);

  return {
    bid,
    loading,
    error,
    success,
    reset,
  };
};

/**
 * Hook for buy-now purchases
 * @returns {Object} Buy now function and state
 */
export const useBuyNow = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  /**
   * Execute buy-now purchase
   */
  const buy = useCallback(async (itemId, buyerData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await buyNow(itemId, buyerData);
      setSuccess(true);
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to complete purchase';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Reset state
   */
  const reset = useCallback(() => {
    setError(null);
    setSuccess(false);
    setLoading(false);
  }, []);

  return {
    buy,
    loading,
    error,
    success,
    reset,
  };
};

/**
 * Hook for cancelling auctions
 * @returns {Object} Cancel function and state
 */
export const useCancelAuction = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  /**
   * Cancel an auction
   */
  const cancel = useCallback(async (auctionId) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await cancelAuction(auctionId);
      setSuccess(true);
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to cancel auction';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Reset state
   */
  const reset = useCallback(() => {
    setError(null);
    setSuccess(false);
    setLoading(false);
  }, []);

  return {
    cancel,
    loading,
    error,
    success,
    reset,
  };
};

export default {
  useLiveAuctions,
  useAuction,
  usePlaceBid,
  useBuyNow,
  useCancelAuction,
};
