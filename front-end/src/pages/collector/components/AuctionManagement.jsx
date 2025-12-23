import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useCollectorContext } from '../../../contexts/CollectorContext';
import { useCollectorListings } from '../../../hooks/useCollectibles';
import { getUserOrders, getNotifications, relistAuction } from '../../../utils/api';
import { formatDate } from '../../../lib/date';
import AuctionCard from './AuctionCard';
import OrderDetailsModal from './OrderDetailsModal';
import NotificationPanel from './NotificationPanel';
import RelistAuctionModal from './RelistAuctionModal';

/**
 * AuctionManagement - Comprehensive auction management for collectors
 * Includes: Active auctions, Ended auctions, Won auctions, Orders, Notifications
 */
const AuctionManagement = ({ onBack }) => {
  const navigate = useNavigate();
  const { collector, refreshTrigger } = useCollectorContext();
  
  // Tab state
  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'ended' | 'won' | 'orders'
  
  // Data state
  const [orders, setOrders] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [allAuctions, setAllAuctions] = useState([]); // Store all auctions for stats
  const [relistingAuction, setRelistingAuction] = useState(null); // Auction being relisted
  
  // Loading states
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  
  // Error states
  const [ordersError, setOrdersError] = useState(null);
  const [notificationsError, setNotificationsError] = useState(null);

  // Fetch auctions based on tab (skip if orders tab)
  const getAuctionParams = () => {
    switch (activeTab) {
      case 'active':
        // For active auctions, get items with status=active (actively listed)
        return { saleType: 'auction', status: 'active', limit: 50 };
      case 'ended':
        // For ended auctions, get items with status=sold or inactive (completed/cancelled)
        return { saleType: 'auction', limit: 50 }; // Get all, we'll filter by auctionStatus on frontend
      case 'won':
        return { wonByMe: true, limit: 50 };
      case 'orders':
        return null; // Skip fetching for orders tab
      default:
        return { saleType: 'auction', limit: 50 };
    }
  };

  const {
    listings: auctions,
    loading: auctionsLoading,
    error: auctionsError,
    refresh: refetchAuctions
  } = useCollectorListings(
    collector?._id,
    getAuctionParams()
  );

  // Fetch orders
  const fetchOrders = async () => {
    setOrdersLoading(true);
    setOrdersError(null);
    try {
      const response = await getUserOrders();
      setOrders(response.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrdersError(error.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setOrdersLoading(false);
    }
  };

  // Fetch notifications
  const fetchNotifications = async () => {
    setNotificationsLoading(true);
    setNotificationsError(null);
    try {
      const response = await getNotifications({ limit: 50 });
      setNotifications(response.notifications || []);
      setUnreadCount(response.unreadCount || 0);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotificationsError(error.response?.data?.message || 'Failed to fetch notifications');
    } finally {
      setNotificationsLoading(false);
    }
  };

  // Handle relist auction
  const handleRelistAuction = async (auctionId, relistData) => {
    try {
      await relistAuction(auctionId, relistData);
      setRelistingAuction(null);
      refetchAuctions(); // Refresh the list
      alert('Auction relisted successfully!');
    } catch (error) {
      console.error('Error relisting auction:', error);
      throw error; // Let modal handle the error
    }
  };

  // Initial fetch
  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    }
    fetchNotifications();
  }, [activeTab]);

  // Refetch on trigger
  useEffect(() => {
    if (refreshTrigger > 0) {
      if (activeTab === 'orders') {
        fetchOrders();
      } else {
        refetchAuctions();
      }
      fetchNotifications();
    }
  }, [refreshTrigger, activeTab, refetchAuctions]);

  // Filter won auctions (only needed for stats)
  const wonAuctions = allAuctions?.filter(auction => 
    auction.saleType === 'auction' && 
    auction.auction?.winner?.toString() === collector?._id?.toString()
  ) || [];

  // Filter auctions based on active tab since backend doesn't filter by auctionStatus
  const getFilteredAuctions = () => {
    if (!auctions) return [];
    
    switch (activeTab) {
      case 'active':
        // Show only live auctions
        return auctions.filter(a => a.auction?.auctionStatus === 'live' && a.status === 'active');
      case 'ended':
        // Show ended/sold/cancelled auctions
        return auctions.filter(a => ['ended', 'sold', 'cancelled'].includes(a.auction?.auctionStatus));
      case 'won':
        return auctions;
      default:
        return auctions;
    }
  };

  const filteredAuctions = getFilteredAuctions();

  // Update allAuctions whenever we fetch new data
  useEffect(() => {
    if (auctions && auctions.length > 0) {
      // Merge with existing auctions to build complete picture
      setAllAuctions(prev => {
        const auctionMap = new Map(prev.map(a => [a._id, a]));
        auctions.forEach(a => auctionMap.set(a._id, a));
        return Array.from(auctionMap.values());
      });
    }
  }, [auctions]);

  // Stats calculation from all auctions
  const stats = {
    active: allAuctions?.filter(a => a.auction?.auctionStatus === 'live').length || 0,
    ended: allAuctions?.filter(a => ['ended', 'sold', 'cancelled'].includes(a.auction?.auctionStatus)).length || 0,
    won: wonAuctions.length,
    orders: orders.filter(o => o.paymentStatus === 'pending').length
  };

  // Render content based on active tab
  const renderContent = () => {
    if (activeTab === 'orders') {
      return (
        <div className="space-y-4">
          {ordersLoading && (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            </div>
          )}

          {ordersError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {ordersError}
            </div>
          )}

          {!ordersLoading && !ordersError && orders.length === 0 && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="mt-4 text-gray-600">No orders yet</p>
            </div>
          )}

          {!ordersLoading && orders.length > 0 && (
            <div className="grid gap-4">
              {orders.map(order => (
                <div
                  key={order._id}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedOrder(order)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">Order #{order.orderNumber}</h3>
                      <p className="text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        order.paymentStatus === 'paid' 
                          ? 'bg-green-100 text-green-800'
                          : order.paymentStatus === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {order.paymentStatus.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center space-x-4">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-gray-900">₹{item.price.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>

                <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total</span>
                  <span className="font-bold text-xl text-gray-900">₹{order.total.toFixed(2)}</span>
                  </div>

                  {order.paymentStatus === 'pending' && (
                    <div className="mt-4">
                      <button
                        className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition-colors font-semibold"
                        onClick={(e) => {
                          e.stopPropagation();
                          // TODO: Implement payment flow
                          alert('Payment integration coming soon!');
                        }}
                      >
                        Complete Payment
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    // Render auctions for active/ended/won tabs
    return (
      <div className="space-y-4">
        {auctionsLoading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          </div>
        )}

        {auctionsError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {auctionsError}
          </div>
        )}

        {!auctionsLoading && !auctionsError && (filteredAuctions?.length === 0) && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="mt-4 text-gray-600">No auctions in this category</p>
          </div>
        )}

        {!auctionsLoading && filteredAuctions?.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAuctions.map(auction => (
              <AuctionCard
                key={auction._id}
                auction={auction}
                onView={() => navigate(`/auctions/${auction._id}`)}
                onRelist={(auction) => setRelistingAuction(auction)}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <button
                onClick={onBack}
                className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Dashboard
              </button>
              <h1 className="text-3xl font-bold text-gray-900">Auction Management</h1>
              <p className="mt-1 text-sm text-gray-600">Manage your auctions, orders, and notifications</p>
            </div>

            {/* Notification Bell */}
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-600 font-medium">Active Auctions</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{stats.active}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 font-medium">Ended Auctions</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.ended}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-green-600 font-medium">Auctions Won</p>
              <p className="text-2xl font-bold text-green-900 mt-1">{stats.won}</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <p className="text-sm text-orange-600 font-medium">Pending Orders</p>
              <p className="text-2xl font-bold text-orange-900 mt-1">{stats.orders}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mt-6 border-b border-gray-200">
            {[
              { id: 'active', label: 'Active Auctions', count: stats.active },
              { id: 'ended', label: 'Ended Auctions', count: stats.ended },
              { id: 'won', label: 'Won Auctions', count: stats.won },
              { id: 'orders', label: 'Orders', count: stats.orders }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 font-medium text-sm transition-colors relative ${
                  activeTab === tab.id
                    ? 'text-orange-600 border-b-2 border-orange-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${
                    activeTab === tab.id
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </div>

      {/* Modals */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onRefresh={fetchOrders}
        />
      )}

      {showNotifications && (
        <NotificationPanel
          notifications={notifications}
          loading={notificationsLoading}
          error={notificationsError}
          onClose={() => setShowNotifications(false)}
          onRefresh={fetchNotifications}
        />
      )}

      {/* Relist Auction Modal */}
      {relistingAuction && (
        <RelistAuctionModal
          auction={relistingAuction}
          onClose={() => setRelistingAuction(null)}
          onRelist={handleRelistAuction}
        />
      )}
    </div>
  );
};

AuctionManagement.propTypes = {
  onBack: PropTypes.func.isRequired
};

export default AuctionManagement;
