import { useState, useEffect, useCallback } from 'react';
import {
  getCollectibles,
  getCollectibleById,
  createCollectible,
  updateCollectible,
  deleteCollectible,
  getCollectorListings,
} from '../utils/api';

/**
 * Custom Hooks for Collectibles Management
 * Provides data fetching, caching, and state management for collectibles
 */

/**
 * Hook to fetch and manage a list of collectibles
 * @param {Object} initialParams - Initial query parameters
 * @returns {Object} Collectibles data and actions
 */
export const useCollectibles = (initialParams = {}) => {
  const [collectibles, setCollectibles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  /**
   * Fetch collectibles with given parameters
   */
  const fetchCollectibles = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);

    try {
      const mergedParams = { ...initialParams, ...params };
      const response = await getCollectibles(mergedParams);

      setCollectibles(response.data || []);
      setPagination({
        page: response.page || 1,
        limit: response.limit || 20,
        total: response.total || 0,
        totalPages: response.totalPages || 0,
        hasNextPage: response.hasNextPage || false,
        hasPrevPage: response.hasPrevPage || false,
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch collectibles');
      console.error('Error fetching collectibles:', err);
    } finally {
      setLoading(false);
    }
  }, [initialParams]);

  /**
   * Refresh the collectibles list
   */
  const refresh = useCallback(() => {
    fetchCollectibles({ page: pagination.page });
  }, [fetchCollectibles, pagination.page]);

  /**
   * Go to next page
   */
  const nextPage = useCallback(() => {
    if (pagination.hasNextPage) {
      fetchCollectibles({ page: pagination.page + 1 });
    }
  }, [fetchCollectibles, pagination]);

  /**
   * Go to previous page
   */
  const prevPage = useCallback(() => {
    if (pagination.hasPrevPage) {
      fetchCollectibles({ page: pagination.page - 1 });
    }
  }, [fetchCollectibles, pagination]);

  // Initial fetch
  useEffect(() => {
    fetchCollectibles();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    collectibles,
    loading,
    error,
    pagination,
    fetchCollectibles,
    refresh,
    nextPage,
    prevPage,
  };
};

/**
 * Hook to fetch a single collectible by ID
 * @param {String} collectibleId - Collectible ID
 * @returns {Object} Collectible data and actions
 */
export const useCollectible = (collectibleId) => {
  const [collectible, setCollectible] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch collectible details
   */
  const fetchCollectible = useCallback(async () => {
    if (!collectibleId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await getCollectibleById(collectibleId);
      setCollectible(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch collectible');
      console.error('Error fetching collectible:', err);
    } finally {
      setLoading(false);
    }
  }, [collectibleId]);

  /**
   * Refresh collectible data
   */
  const refresh = useCallback(() => {
    fetchCollectible();
  }, [fetchCollectible]);

  // Fetch on mount or when ID changes
  useEffect(() => {
    fetchCollectible();
  }, [fetchCollectible]);

  return {
    collectible,
    loading,
    error,
    refresh,
  };
};

/**
 * Hook to manage collector's listings
 * @param {String} collectorId - Collector ID
 * @param {Object} initialFilters - Initial filters
 * @returns {Object} Listings data and actions
 */
export const useCollectorListings = (collectorId, initialFilters = {}) => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  // Sync external filter changes with internal state
  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters.saleType, initialFilters.status, initialFilters.sortBy, initialFilters.page, initialFilters.limit]);

  /**
   * Fetch collector listings
   */
  const fetchListings = useCallback(async (params = {}) => {
    if (!collectorId) {
      console.log('useCollectorListings: No collectorId, skipping fetch');
      return;
    }

    console.log('useCollectorListings: Fetching with params:', { collectorId, filters, params });
    setLoading(true);
    setError(null);

    try {
      const mergedParams = { ...filters, ...params };
      console.log('useCollectorListings: Merged params:', mergedParams);
      const response = await getCollectorListings(collectorId, mergedParams);

      setListings(response.data || []);
      setPagination(response.pagination || {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
      });
      console.log('useCollectorListings: Fetch successful, listings count:', response.data?.length);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch listings');
      console.error('useCollectorListings: Error fetching listings:', err);
    } finally {
      setLoading(false);
    }
  }, [collectorId, filters]);

  /**
   * Update filters and refetch
   */
  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    fetchListings({ ...newFilters, page: 1 });
  }, [fetchListings]);

  /**
   * Refresh listings
   */
  const refresh = useCallback(() => {
    fetchListings({ page: pagination.page });
  }, [fetchListings, pagination.page]);

  // Initial fetch
  useEffect(() => {
    if (collectorId) {
      fetchListings();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectorId, filters]); // Also watch filters for changes

  return {
    listings,
    loading,
    error,
    filters,
    pagination,
    updateFilters,
    refresh,
    fetchListings,
  };
};

/**
 * Hook for creating a new collectible
 * @returns {Object} Create function and state
 */
export const useCreateCollectible = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  /**
   * Create a new collectible
   */
  const create = useCallback(async (collectibleData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await createCollectible(collectibleData);
      setSuccess(true);
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to create collectible';
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
    create,
    loading,
    error,
    success,
    reset,
  };
};

/**
 * Hook for updating a collectible
 * @returns {Object} Update function and state
 */
export const useUpdateCollectible = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  /**
   * Update a collectible
   */
  const update = useCallback(async (collectibleId, updateData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await updateCollectible(collectibleId, updateData);
      setSuccess(true);
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to update collectible';
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
    update,
    loading,
    error,
    success,
    reset,
  };
};

/**
 * Hook for deleting a collectible
 * @returns {Object} Delete function and state
 */
export const useDeleteCollectible = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  /**
   * Delete a collectible
   */
  const remove = useCallback(async (collectibleId) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await deleteCollectible(collectibleId);
      setSuccess(true);
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to delete collectible';
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
    remove,
    loading,
    error,
    success,
    reset,
  };
};

export default {
  useCollectibles,
  useCollectible,
  useCollectorListings,
  useCreateCollectible,
  useUpdateCollectible,
  useDeleteCollectible,
};
