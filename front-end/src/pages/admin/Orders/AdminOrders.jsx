import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import MobileSidebar from '../components/MobileSidebar';
import AdminHeader from '../components/AdminHeader';
import OrdersStats from './components/OrdersStats';
import OrdersFilters from './components/OrdersFilters';
import OrdersTable from './components/OrdersTable';
import OrderDetailsModal from './components/OrderDetailsModal';
import BulkActionsBar from './components/BulkActionsBar';
import { API_BASE_URL } from '../../../utils/api';
import { Package } from 'lucide-react';

const AdminOrders = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState({});
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const [filters, setFilters] = useState({
    status: 'all',
    paymentStatus: 'all',
    search: '',
    dateFrom: '',
    dateTo: '',
    page: 1,
    limit: 20,
    sortBy: 'createdAt',
    order: 'desc'
  });

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== 'all') {
          queryParams.append(key, value);
        }
      });

      const response = await fetch(
        `${API_BASE_URL}/api/orders/all?${queryParams.toString()}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (data.success) {
        setOrders(data.data.orders);
        setStats(data.data.stats);
        setPagination(data.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Wait for auth to finish loading before checking authentication
    if (authLoading) {
      return;
    }

    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/sign-in');
      return;
    }
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user, navigate, filters, authLoading]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: key !== 'page' ? 1 : value // Reset to page 1 when filters change
    }));
  };

  const handleSelectOrder = (orderId) => {
    setSelectedOrders(prev => {
      if (prev.includes(orderId)) {
        return prev.filter(id => id !== orderId);
      }
      return [...prev, orderId];
    });
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedOrders(orders.map(order => order._id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const handleUpdateStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${API_BASE_URL}/api/orders/${orderId}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ orderStatus: status })
        }
      );

      const data = await response.json();

      if (data.success) {
        fetchOrders();
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleBulkUpdate = async (updates) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${API_BASE_URL}/api/orders/bulk-update`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            orderIds: selectedOrders,
            updates
          })
        }
      );

      const data = await response.json();

      if (data.success) {
        setSelectedOrders([]);
        fetchOrders();
      }
    } catch (error) {
      console.error('Error bulk updating orders:', error);
    }
  };

  const handleExport = () => {
    // Create CSV content
    const headers = ['Order Number', 'Customer', 'Date', 'Total', 'Status', 'Payment'];
    const rows = orders.map(order => [
      order.orderNumber,
      order.shippingAddress.fullName,
      new Date(order.createdAt).toLocaleDateString(),
      `₹${order.total.toFixed(2)}`,
      order.orderStatus,
      order.paymentStatus
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
      <div className="flex flex-row min-h-screen">
        {/* Desktop Sidebar */}
        <AdminSidebar />
        
        {/* Mobile Sidebar */}
        <MobileSidebar />

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <AdminHeader />

          {/* Orders Content */}
          <div className="flex-1 p-3 sm:p-4 md:p-6 lg:p-10 overflow-auto">
            <div className="min-w-fit w-full">
              {/* Page Header */}
              <div className="mb-4 sm:mb-6 md:mb-8">
                <div className="flex items-center gap-2 sm:gap-3 mb-2">
                  <Package className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-[#ec6d13] flex-shrink-0" />
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">
                    Order Management
                  </h1>
                </div>
                <p className="text-[#9a6c4c] dark:text-[#a88e79] text-sm sm:text-base font-normal leading-normal">
                  Manage and track all customer orders
                </p>
              </div>

            {/* Stats */}
            {stats && <OrdersStats stats={stats} />}

            {/* Filters */}
            <OrdersFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onExport={handleExport}
            />

            {/* Bulk Actions */}
            {selectedOrders.length > 0 && (
              <BulkActionsBar
                selectedCount={selectedOrders.length}
                onBulkUpdate={handleBulkUpdate}
                onClear={() => setSelectedOrders([])}
              />
            )}

            {/* Orders Table */}
            <OrdersTable
              orders={orders}
              loading={loading}
              selectedOrders={selectedOrders}
              onSelectOrder={handleSelectOrder}
              onSelectAll={handleSelectAll}
              onViewDetails={handleViewDetails}
              onUpdateStatus={handleUpdateStatus}
              pagination={pagination}
              onPageChange={(page) => handleFilterChange('page', page)}
            />
          </div>
          </div>
        </main>
      </div>

      {/* Order Details Modal */}
      {showDetailsModal && selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedOrder(null);
          }}
          onUpdateStatus={handleUpdateStatus}
          onRefresh={fetchOrders}
        />
      )}
    </div>
  );
};

export default AdminOrders;
