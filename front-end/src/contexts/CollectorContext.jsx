/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { getCollectorDetails } from '../utils/api';

/**
 * Collector Context - Global state management for collector dashboard
 * Manages collector profile, listings, and dashboard state
 */

const CollectorContext = createContext(null);

/**
 * Collector Provider Component
 * Wraps the dashboard to provide global collector state
 */
export const CollectorProvider = ({ children, collectorId }) => {
  // Collector profile state
  const [collector, setCollector] = useState(null);
  const [collectorLoading, setCollectorLoading] = useState(false);
  const [collectorError, setCollectorError] = useState(null);

  // Dashboard state
  const [activeTab, setActiveTab] = useState('direct'); // 'direct', 'auctions', 'add'
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState(''); // '', 'active', 'sold', 'inactive' - empty string means all
  const [sortBy, setSortBy] = useState('createdAt:desc'); // API format: 'field:order'

  // Refresh trigger for listings
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  /**
   * Fetch collector details
   */
  const fetchCollector = useCallback(async () => {
    if (!collectorId) {
      console.log('CollectorContext: No collectorId provided');
      return;
    }

    console.log('CollectorContext: Fetching collector with ID:', collectorId);
    setCollectorLoading(true);
    setCollectorError(null);

    try {
      const response = await getCollectorDetails(collectorId);
      console.log('CollectorContext: Collector fetched successfully:', response.data);
      setCollector(response.data);
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to fetch collector details';
      console.error('CollectorContext: Error fetching collector:', err, errorMsg);
      setCollectorError(errorMsg);
    } finally {
      setCollectorLoading(false);
    }
  }, [collectorId]);

  /**
   * Trigger a refresh of listings
   */
  const triggerRefresh = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  /**
   * Update collector profile
   */
  const updateCollector = useCallback((updates) => {
    setCollector((prev) => {
      if (!prev) return prev;
      return { ...prev, ...updates };
    });
  }, []);

  /**
   * Reset filters
   */
  const resetFilters = useCallback(() => {
    setSearchQuery('');
    setFilterStatus(''); // Empty string for 'all'
    setSortBy('createdAt:desc');
  }, []);

  /**
   * Navigate to tab
   */
  const navigateToTab = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  // Fetch collector on mount
  useEffect(() => {
    if (collectorId) {
      fetchCollector();
    }
  }, [collectorId, fetchCollector]);

  const value = {
    // Collector data
    collector,
    collectorLoading,
    collectorError,
    fetchCollector,
    updateCollector,

    // Dashboard state
    activeTab,
    setActiveTab: navigateToTab,
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    sortBy,
    setSortBy,

    // Actions
    triggerRefresh,
    refreshTrigger,
    resetFilters,
  };

  return (
    <CollectorContext.Provider value={value}>
      {children}
    </CollectorContext.Provider>
  );
};

/**
 * Hook to use collector context
 * @returns {Object} Collector context value
 * @throws {Error} If used outside CollectorProvider
 */
export const useCollectorContext = () => {
  const context = useContext(CollectorContext);
  
  if (!context) {
    throw new Error('useCollectorContext must be used within CollectorProvider');
  }
  
  return context;
};

/**
 * HOC to wrap component with collector provider
 * @param {Component} Component - Component to wrap
 * @param {String} collectorId - Collector ID
 * @returns {Component} Wrapped component
 */
export const withCollectorProvider = (Component, collectorId) => {
  return (props) => (
    <CollectorProvider collectorId={collectorId}>
      <Component {...props} />
    </CollectorProvider>
  );
};

export default CollectorContext;
