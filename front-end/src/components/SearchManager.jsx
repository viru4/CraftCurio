import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

const SearchManager = (initialSearchQuery = '') => {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get('search') || initialSearchQuery
  );

  // Handle URL search parameters synchronization
  useEffect(() => {
    const searchParam = searchParams.get('search');
    if (searchParam && searchParam !== searchQuery) {
      setSearchQuery(searchParam);
      return searchParam; // Return the updated search query for callback
    }
    return null;
  }, [searchParams, searchQuery]);

  // Update search query programmatically
  const updateSearchQuery = useCallback((newQuery) => {
    setSearchQuery(newQuery);
  }, []);

  // Clear search query
  const clearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  // Check if search is active
  const hasActiveSearch = useCallback(() => {
    return searchQuery && searchQuery.trim().length > 0;
  }, [searchQuery]);

  // Get trimmed search query for processing
  const getTrimmedQuery = useCallback(() => {
    return searchQuery ? searchQuery.trim() : '';
  }, [searchQuery]);

  // Handle search input changes
  const handleSearchChange = useCallback((newQuery) => {
    setSearchQuery(newQuery || '');
  }, []);

  // Handle search submission
  const handleSearchSubmit = useCallback((onSearchCallback) => {
    const trimmedQuery = getTrimmedQuery();
    if (onSearchCallback) {
      onSearchCallback(trimmedQuery);
    }
    return trimmedQuery;
  }, [getTrimmedQuery]);

  // Handle popular search tags
  const handlePopularTagClick = useCallback((tag, onTagClickCallback) => {
    setSearchQuery(tag);
    if (onTagClickCallback) {
      onTagClickCallback(tag);
    }
    return tag;
  }, []);

  // Create search-related props for SearchBar component
  const getSearchBarProps = useCallback((additionalProps = {}) => {
    return {
      searchQuery,
      onSearchChange: handleSearchChange,
      ...additionalProps
    };
  }, [searchQuery, handleSearchChange]);

  // URL parameter change handler with callback
  const createUrlParamHandler = useCallback((callback, scrollCallback) => {
    return (updatedQuery) => {
      if (updatedQuery) {
        if (callback) callback(updatedQuery);
        if (scrollCallback) scrollCallback();
      }
    };
  }, []);

  return {
    // State
    searchQuery,
    
    // Actions
    updateSearchQuery,
    clearSearch,
    handleSearchChange,
    handleSearchSubmit,
    handlePopularTagClick,
    
    // Utilities
    hasActiveSearch,
    getTrimmedQuery,
    getSearchBarProps,
    createUrlParamHandler
  };
};

export default SearchManager;