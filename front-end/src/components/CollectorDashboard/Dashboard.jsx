import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import CollectibleCard from './CollectibleCard';
import { useCollectorListings } from '../../hooks/useCollectibles';
import { useCollectorContext } from '../../contexts/CollectorContext';

const Dashboard = ({
  onAddNew,
  onEditItem,
  onViewItem,
  onDelete,
  onOpenAuctionManagement,
}) => {

  // Step 1: Add collector and refreshTrigger to the destructured values from useCollectorContext()
  const {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    sortBy,
    setSortBy,
    collector, // ADDED HERE
    collectorLoading, // ADDED HERE - to show loading state
    collectorError, // ADDED HERE - to show error state
    refreshTrigger, // ADDED HERE for triggering refetch
  } = useCollectorContext();

  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  // Search debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(localSearchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [localSearchQuery, setSearchQuery]);

  // Step 2: Update useCollectorListings hook call to pass collector?._id as the first parameter
  const {
    listings: collectibles,  // Rename to match the returned property
    loading: isLoading,      // Rename to match the returned property
    error,
    pagination,
    refresh: refetch         // Rename to match the returned property
  } = useCollectorListings(collector?._id, { // collector?._id ADDED HERE
    page: 1,
    limit: 20,
    saleType: activeTab === 'direct' ? 'direct' : activeTab === 'auction' ? 'auction' : undefined,
    status: filterStatus === 'all' ? undefined : filterStatus, // Don't pass 'all', use undefined instead
    sortBy,
  });

  // Debug logging (only in development)
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log('Dashboard Debug:', {
        hasCollector: !!collector,
        collectorId: collector?._id,
        collectorUserId: collector?.userId,
        collectiblesCount: collectibles?.length,
        isLoading,
        isCollectorLoading: collectorLoading,
        error,
        collectorError,
        pagination,
        activeTab,
        filterStatus
      });
    }
  }, [collector, collectibles, isLoading, error, pagination, activeTab, filterStatus, collectorLoading, collectorError]);

  // Listen to refreshTrigger from context
  useEffect(() => {
    if (refreshTrigger > 0) {
      refetch();
    }
  }, [refreshTrigger, refetch]);

  // Filter collectibles by search query (client-side)
  const filteredCollectibles = (collectibles || []).filter(item => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query) ||
      item.category?.toLowerCase().includes(query)
    );
  });

  // Handle delete collectible
  const handleDelete = async (id) => {
    try {
      await onDelete(id);
      await refetch();
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error after delete:', error);
      }
    }
  };

  // Handle promote collectible
  const handlePromote = async () => {
    // TODO: Implement promotion logic
    alert('Promotion feature coming soon!');
  };

  // Tab configuration
  const tabs = [
    { id: 'direct', label: 'Direct Listings', icon: '💰' },
    { id: 'auction', label: 'My Auctions', icon: '🔨' },
    { id: 'add', label: 'Add Collectible', icon: '➕' },
  ];

  // Status filter options
  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'sold', label: 'Sold' },
    { value: 'inactive', label: 'Inactive' },
  ];

  // Auction status filter options
  const auctionStatusOptions = [
    { value: '', label: 'All Status' },
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'live', label: 'Live' },
    { value: 'ended', label: 'Ended' },
    { value: 'sold', label: 'Sold' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  // Sort options
  const sortOptions = [
    { value: 'createdAt:desc', label: 'Newest First' },
    { value: 'createdAt:asc', label: 'Oldest First' },
    { value: 'price:desc', label: 'Price: High to Low' },
    { value: 'price:asc', label: 'Price: Low to High' },
    { value: 'views:desc', label: 'Most Viewed' },
    { value: 'title:asc', label: 'Title: A-Z' },
  ];

  // Get appropriate status options based on active tab
  const currentStatusOptions = activeTab === 'auction' ? auctionStatusOptions : statusOptions;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Collector Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage your collectibles and auctions</p>
            </div>
            {/* Auction Management Button */}
            <button
              onClick={onOpenAuctionManagement}
              className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Auction Management</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8" aria-label="Tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap
                  ${activeTab === tab.id
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                  transition-colors duration-200
                `}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Add New Tab Content */}
        {activeTab === 'add' && (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl">➕</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Add New Collectible</h2>
              <p className="text-gray-600">Create a new direct sale listing or start an auction</p>
            </div>
            <button
              onClick={onAddNew}
              className="px-8 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium text-lg"
            >
              Create Listing
            </button>
          </div>
        )}

        {/* Listings Tabs Content */}
        {(activeTab === 'direct' || activeTab === 'auction') && (
          <>
            {/* Collector Profile Loading State */}
            {collectorLoading && !collector && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
                <p className="mt-4 text-gray-600">Loading your profile...</p>
              </div>
            )}

            {/* Collector Profile Error State */}
            {collectorError && !collector && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                <p className="font-bold">Error loading collector profile</p>
                <p>{collectorError}</p>
                <p className="mt-2 text-sm">Please refresh the page or contact support if the issue persists.</p>
              </div>
            )}

            {/* Only show filters and content when collector is loaded */}
            {collector && (
              <>
            {/* Filters and Search */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search */}
                <div className="md:col-span-2">
                  <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                    Search
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="search"
                      value={localSearchQuery}
                      onChange={(e) => setLocalSearchQuery(e.target.value)}
                      placeholder="Search by title, description, or category..."
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Status Filter */}
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    id="status"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {currentStatusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">
                    Sort By
                  </label>
                  <select
                    id="sortBy"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Results Summary */}
              <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  Showing {filteredCollectibles.length} of {pagination?.total || 0} collectibles
                </p>
                <button
                  onClick={refetch}
                  className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                >
                  🔄 Refresh
                </button>
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
                <p className="mt-4 text-gray-600">Loading collectibles...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                <p className="font-bold">Error loading collectibles</p>
                <p>{error}</p>
                <button
                  onClick={refetch}
                  className="mt-2 text-sm underline hover:no-underline"
                >
                  Try again
                </button>
              </div>
            )}

            {/* Collectibles Grid */}
            {!isLoading && !error && filteredCollectibles.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredCollectibles.map(collectible => (
                  <CollectibleCard
                    key={collectible._id}
                    collectible={collectible}
                    onEdit={onEditItem}
                    onDelete={handleDelete}
                    onPromote={handlePromote}
                    onView={onViewItem}
                    showActions={true}
                  />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!isLoading && !error && filteredCollectibles.length === 0 && (
              <div className="text-center py-12">
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-5xl">📦</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No collectibles found
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery
                    ? 'Try adjusting your search or filters'
                    : `You don't have any ${activeTab === 'direct' ? 'direct sale' : 'auction'} listings yet`
                  }
                </p>
                {!searchQuery && (
                  <button
                    onClick={onAddNew}
                    className="px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
                  >
                    Create First Listing
                  </button>
                )}
              </div>
            )}
          </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

Dashboard.propTypes = {
  onAddNew: PropTypes.func.isRequired,
  onEditItem: PropTypes.func.isRequired,
  onViewItem: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onOpenAuctionManagement: PropTypes.func.isRequired,
};

export default Dashboard;
