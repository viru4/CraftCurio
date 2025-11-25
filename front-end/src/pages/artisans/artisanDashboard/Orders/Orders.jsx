import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Package, Menu } from 'lucide-react';
import ArtisanSidebar from '../components/ArtisanSidebar';
import OrdersHeader from './components/OrdersHeader';
import OrdersFilters from './components/OrdersFilters';
import OrdersStats from './components/OrdersStats';
import OrdersTable from './components/OrdersTable';
import OrderDetailsModal from './components/OrderDetailsModal';
import { API_ENDPOINTS } from '@/utils/api';

const Orders = () => {
  const { user, isArtisan, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    dateFrom: '',
    dateTo: '',
    page: 1,
    limit: 10
  });
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    totalRevenue: 0
  });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  });

  // Auth check
  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user || !isArtisan) {
      navigate('/');
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isArtisan, authLoading]);

  // Fetch orders
  useEffect(() => {
    if (user && isArtisan) {
      fetchOrders();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, user, isArtisan]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams({
        status: filters.status,
        search: filters.search,
        page: filters.page,
        limit: filters.limit
      });

      if (filters.dateFrom) queryParams.append('dateFrom', filters.dateFrom);
      if (filters.dateTo) queryParams.append('dateTo', filters.dateTo);

      // Fetch artisan's orders (orders containing their products)
      const response = await fetch(`${API_ENDPOINTS.orders}/artisan/my-orders?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
        setPagination({
          total: data.total || 0,
          page: data.page || 1,
          limit: data.limit || 10,
          totalPages: data.totalPages || 0
        });
        
        // Calculate stats
        calculateStats(data.orders || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (ordersList) => {
    const newStats = {
      total: ordersList.length,
      pending: ordersList.filter(o => o.orderStatus === 'pending').length,
      processing: ordersList.filter(o => o.orderStatus === 'processing').length,
      shipped: ordersList.filter(o => o.orderStatus === 'shipped').length,
      delivered: ordersList.filter(o => o.orderStatus === 'delivered').length,
      cancelled: ordersList.filter(o => o.orderStatus === 'cancelled').length,
      totalRevenue: ordersList
        .filter(o => o.orderStatus !== 'cancelled' && o.paymentStatus === 'paid')
        .reduce((sum, o) => sum + o.total, 0)
    };
    setStats(newStats);
  };

  const handleViewDetails = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_ENDPOINTS.orders}/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedOrder(data.order);
        setShowDetailsModal(true);
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus, trackingNumber = '') => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_ENDPOINTS.orders}/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          orderStatus: newStatus,
          trackingNumber: trackingNumber || undefined
        })
      });

      if (response.ok) {
        await fetchOrders();
        setShowDetailsModal(false);
        alert('Order status updated successfully!');
      } else {
        alert('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: key !== 'page' ? 1 : value // Reset to page 1 when changing filters
    }));
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f7f6] dark:bg-[#1b130d]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ec6d13] mx-auto"></div>
          <p className="mt-4 text-[#9a6c4c] dark:text-[#a88e79]">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f7f6] dark:bg-[#1b130d] flex">
      {/* Sidebar */}
      <ArtisanSidebar 
        user={user}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <div className="lg:hidden bg-white dark:bg-[#2a1e14] border-b border-[#e7d9cf] dark:border-[#4a392b] px-4 py-3 flex items-center justify-between sticky top-0 z-10">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-[#f8f7f6] dark:hover:bg-[#221810] rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6 text-[#1b130d] dark:text-[#f3ece7]" />
          </button>
          <h1 className="text-lg font-bold text-[#1b130d] dark:text-[#f3ece7]">Orders</h1>
          <div className="w-10"></div>
        </div>

        {/* Page content */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <OrdersHeader />

          {/* Stats */}
          <OrdersStats stats={stats} />

          {/* Filters */}
          <OrdersFilters 
            filters={filters}
            onFilterChange={handleFilterChange}
          />

          {/* Orders Table */}
          {loading ? (
            <div className="bg-white dark:bg-[#2a1e14] rounded-lg shadow-sm p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ec6d13] mx-auto"></div>
              <p className="mt-4 text-[#9a6c4c] dark:text-[#a88e79]">Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white dark:bg-[#2a1e14] rounded-lg shadow-sm p-8 text-center">
              <Package className="w-16 h-16 text-[#9a6c4c] dark:text-[#a88e79] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[#1b130d] dark:text-[#f3ece7] mb-2">
                No Orders Found
              </h3>
              <p className="text-[#9a6c4c] dark:text-[#a88e79]">
                {filters.status !== 'all' || filters.search
                  ? 'Try adjusting your filters'
                  : 'Orders will appear here once customers purchase your products'}
              </p>
            </div>
          ) : (
            <OrdersTable
              orders={orders}
              pagination={pagination}
              onViewDetails={handleViewDetails}
              onPageChange={(page) => handleFilterChange('page', page)}
            />
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {showDetailsModal && selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          isOpen={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedOrder(null);
          }}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </div>
  );
};

export default Orders;
