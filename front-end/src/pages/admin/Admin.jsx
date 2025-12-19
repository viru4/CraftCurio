import { useState, useEffect } from 'react';
import { formatDateTime } from '@/lib/date';
import AdminSidebar from './components/AdminSidebar';
import MobileSidebar from './components/MobileSidebar';
import AdminHeader from './components/AdminHeader';
import StatsCard from './components/StatsCard';
import SalesChart from './components/SalesChart';
import UserSignupsChart from './components/UserSignupsChart';
import RecentActivityTable from './components/RecentActivityTable';
import { API_ENDPOINTS } from '../../utils/api';

const Admin = () => {
  const [stats, setStats] = useState({
    totalSales: { value: '₹0', change: '+0%', isPositive: true },
    newUsers: { value: '0', change: '+0%', isPositive: true },
    pendingApprovals: { value: '0', change: '0%', isPositive: true },
    openTickets: { value: '0', change: '+0%', isPositive: true }
  });

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard data on mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        const token = localStorage.getItem('token');

        // Fetch multiple data sources in parallel
        const [dbStatsRes, ordersRes, productsRes, collectiblesRes, collectorsRes] = await Promise.all([
          fetch(`${API_ENDPOINTS.seed}/stats`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }),
          fetch(`${API_ENDPOINTS.orders}/all`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }),
          fetch(API_ENDPOINTS.artisanProducts),
          fetch(API_ENDPOINTS.collectibles),
          fetch(`${API_ENDPOINTS.collectors}`)
        ]);

        const dbStatsJson = await dbStatsRes.json().catch(() => ({}));
        const ordersJson = await ordersRes.json().catch(() => ({}));
        const productsJson = await productsRes.json().catch(() => ({}));
        const collectiblesJson = await collectiblesRes.json().catch(() => ({}));
        const collectorsJson = await collectorsRes.json().catch(() => ({}));

        // Real data shapes:
        // - /orders/all -> { success, data: { orders, stats, pagination } }
        const ordersData = ordersJson?.data || {};
        const orders = Array.isArray(ordersData.orders) ? ordersData.orders : [];
        const orderStats = ordersData.stats || {};

        // Calculate total sales from orders (prefer backend stats if present)
        const totalSales =
          typeof orderStats.totalRevenue === 'number'
            ? orderStats.totalRevenue
            : orders.reduce((sum, order) => sum + (order.total || 0), 0);
        
        // /artisan-products -> { data: [...], totalCount, ... }
        const artisanProducts = Array.isArray(productsJson.data) ? productsJson.data : (productsJson.products || []);
        const pendingProducts = artisanProducts.filter(p => p.status === 'pending').length;

        // /collectibles -> { data: [...], total, ... }
        const collectibles = Array.isArray(collectiblesJson.data) ? collectiblesJson.data : (collectiblesJson.collectibles || []);
        const pendingCollectibles = collectibles.filter(c => c.status === 'pending').length;
        const totalPending = pendingProducts + pendingCollectibles;
        
        // /collectors -> { success, data: [...], pagination: { totalItems } }
        const collectors = Array.isArray(collectorsJson.data) ? collectorsJson.data : (collectorsJson.collectors || []);
        const collectorsTotal =
          collectorsJson.pagination?.totalItems ?? collectors.length;

        const dbStats = dbStatsJson?.data || {};

        // Update stats with real data
        setStats({
          totalSales: { 
            value: `₹${totalSales.toLocaleString()}`, 
            change: '+5.2%', // placeholder trend; could be driven by orderStats.last30Days
            isPositive: true 
          },
          newUsers: { 
            value: String(collectorsTotal || dbStats.collectors || 0), 
            change: '+12.0%', // placeholder trend
            isPositive: true 
          },
          pendingApprovals: { 
            value: totalPending.toString(), 
            change: totalPending > 0 ? `+${totalPending}` : '0', 
            isPositive: false 
          },
          openTickets: { 
            // Treat "open tickets" as count of non-delivered, non-cancelled orders
            value: String(
              orders.filter(
                o => o.orderStatus && o.orderStatus !== 'delivered' && o.orderStatus !== 'cancelled'
              ).length
            ),
            change: '+1.0%', // placeholder trend
            isPositive: true 
          }
        });

        // Create recent activity from orders
        const recentActivities = orders.slice(0, 5).map((order, index) => ({
          id: order._id || index,
          user: {
            name: order.user?.name || 'Unknown User',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA555-uWq--hdR0JdB4BMF-NGGvj8zu7KcUStxbEMs0UeZwQtQiReENev8bRYGzFb7rnyfipF_KXZvLbEWe6DhHJR7oaqvyVG1io7GdV5rbQhbB43yaFdC2e_fZmre-y3KokYfsDdNSW1uIo6wAJ2sCHxdyyldeBSb6_gys7KP4fsJ2xWRQuOWQnPfVeL4UekLqS3n_-YkbOUREJOCfVR0ZXEz_MWDgPeBnGWMwE4pUoCsH2k9K7Wmtp1_AwbUsqoK1EsIkOB5avPk'
          },
          action: 'Placed order',
          actionType: 'success',
          item: `Order #${order.orderNumber || (order._id || '').toString().slice(-6)} - ₹${(order.total || 0).toLocaleString()}`,
          timestamp: formatDateTime(order.createdAt)
        })) || [];

        setActivities(recentActivities);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Keep default values on error
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
      <div className="flex flex-row min-h-screen">
        {/* Desktop Sidebar */}
        <AdminSidebar />
        
        {/* Mobile Sidebar */}
        <MobileSidebar />

        {/* Main Content */}
        <main className="flex-1 flex flex-col">
          {/* Header */}
          <AdminHeader />

          {/* Dashboard Content */}
          <div className="flex-1 p-4 md:p-10 overflow-auto">
            {/* Page Heading */}
            <div className="flex flex-wrap justify-between gap-3 mb-6">
              <div className="flex min-w-72 flex-col gap-2">
                <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">
                  Dashboard
                </h1>
                <p className="text-[#9a6c4c] dark:text-[#a88e79] text-base font-normal leading-normal">
                  Welcome back! Here's a summary of platform activity.
                </p>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ec6d13]"></div>
              </div>
            ) : (
              <>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
                  <StatsCard
                    title="Total Sales"
                    value={stats.totalSales.value}
                    change={stats.totalSales.change}
                    isPositive={stats.totalSales.isPositive}
                  />
                  <StatsCard
                    title="New Users"
                    value={stats.newUsers.value}
                    change={stats.newUsers.change}
                    isPositive={stats.newUsers.isPositive}
                  />
                  <StatsCard
                    title="Pending Approvals"
                    value={stats.pendingApprovals.value}
                    change={stats.pendingApprovals.change}
                    isPositive={stats.pendingApprovals.isPositive}
                  />
                  <StatsCard
                    title="Open Tickets"
                    value={stats.openTickets.value}
                    change={stats.openTickets.change}
                    isPositive={stats.openTickets.isPositive}
                  />
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
                  <SalesChart
                    totalSales={stats.totalSales.value}
                    period="Last 30 Days"
                    change={stats.totalSales.change}
                  />
                  <UserSignupsChart
                    totalUsers={stats.newUsers.value}
                    period="Last 30 Days"
                    change={stats.newUsers.change}
                    data={[50, 70, 40, 90]}
                  />
                </div>

                {/* Recent Activity Table */}
                <RecentActivityTable activities={activities} />
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Admin;
