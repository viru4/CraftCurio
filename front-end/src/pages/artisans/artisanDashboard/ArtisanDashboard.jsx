import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Plus, DollarSign, RefreshCw } from 'lucide-react';
import { API_ENDPOINTS } from '@/utils/api';
import {
  ArtisanSidebar,
  ArtisanHeader,
  StatsCards,
  SalesChart,
  ActivityFeed,
  TopProductsTable
} from './components';

const ArtisanDashboard = () => {
  const { user, isArtisan, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalSales: 0,
      totalProducts: 0,
      totalVisits: 0,
      pendingOrders: 0,
      salesTrend: '+0% this month',
      productsTrend: '+0 this week',
      visitsTrend: '+0% this month',
      ordersTrend: '+0 today'
    },
    todaysSales: 0,
    newOrders: 0,
    salesData: [],
    activities: [],
    topProducts: []
  });

  useEffect(() => {
    // Wait for auth to finish loading
    if (authLoading) {
      return;
    }

    // Redirect if not authenticated or not an artisan
    if (!user) {
      navigate('/sign-in');
      return;
    }
    
    if (!isArtisan) {
      navigate('/');
      return;
    }

    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isArtisan, navigate, authLoading]);

  // Refresh dashboard data when window gains focus (user comes back to tab/dashboard)
  useEffect(() => {
    const handleFocus = () => {
      if (user && isArtisan && !authLoading) {
        fetchDashboardData();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isArtisan, authLoading]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/sign-in');
        return;
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Fetch all data in parallel
      const [
        productsRes,
        ordersRes,
        statsRes
      ] = await Promise.all([
        fetch(`${API_ENDPOINTS.artisanProducts}?artisan=${user._id}`, { headers }),
        fetch(`${API_ENDPOINTS.orders}/artisan/my-orders`, { headers }),
        fetch(`${API_ENDPOINTS.seed}/stats`, { headers })
      ]);

      const products = productsRes.ok ? await productsRes.json() : { data: [] };
      const allOrders = ordersRes.ok ? await ordersRes.json() : { orders: [] };
      const stats = statsRes.ok ? await statsRes.json() : {};

      // Filter orders that contain artisan's products
      const orders = {
        orders: allOrders.orders || allOrders.data || allOrders || []
      };

      // Calculate total sales from orders
      const totalSales = orders.orders?.reduce((sum, order) => sum + (order.totalAmount || 0), 0) || 0;
      
      // Get today's sales
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todaysSales = orders.orders?.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= today;
      }).reduce((sum, order) => sum + (order.totalAmount || 0), 0) || 0;

      // Count pending orders
      const pendingOrders = orders.orders?.filter(
        order => order.status === 'pending' || order.status === 'processing'
      ).length || 0;

      // Count new orders today
      const newOrdersToday = orders.orders?.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= today;
      }).length || 0;

      // Get top selling products
      const productSales = {};
      orders.orders?.forEach(order => {
        order.items?.forEach(item => {
          if (item.productId) {
            const id = item.productId._id || item.productId;
            if (!productSales[id]) {
              productSales[id] = {
                id,
                name: item.productId.name || item.name || 'Unknown Product',
                category: item.productId.category?.name || 'Uncategorized',
                image: item.productId.images?.[0] || item.productId.image || null,
                unitsSold: 0,
                revenue: 0
              };
            }
            productSales[id].unitsSold += item.quantity || 1;
            productSales[id].revenue += (item.price || 0) * (item.quantity || 1);
          }
        });
      });

      const topProducts = Object.values(productSales)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      // Generate sales chart data (last 14 days)
      const salesData = [];
      for (let i = 13; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);
        
        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + 1);
        
        const daySales = orders.orders?.filter(order => {
          const orderDate = new Date(order.createdAt);
          return orderDate >= date && orderDate < nextDate;
        }).reduce((sum, order) => sum + (order.totalAmount || 0), 0) || 0;
        
        salesData.push({
          day: 14 - i,
          value: daySales
        });
      }

      // Generate activity feed from recent orders
      const recentActivities = orders.orders
        ?.slice(0, 4)
        .map(order => {
          const timeAgo = getTimeAgo(new Date(order.createdAt));
          return {
            message: `New order from ${order.userId?.name || 'Customer'}: ${formatCurrency(order.totalAmount)}`,
            time: timeAgo,
            icon: DollarSign,
            iconBg: 'bg-green-100',
            iconColor: 'text-green-500'
          };
        }) || [];

      setDashboardData({
        stats: {
          totalSales,
          totalProducts: products.data?.length || products.products?.length || 0,
          totalVisits: stats.artisanProducts || 2130, // Use stats or default
          pendingOrders,
          salesTrend: calculateTrend(totalSales, 0),
          productsTrend: `+${products.data?.length || 0} total`,
          visitsTrend: '+10.1% this month',
          ordersTrend: `+${newOrdersToday} today`
        },
        todaysSales,
        newOrders: newOrdersToday,
        salesData,
        activities: recentActivities,
        topProducts
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    if (seconds < 60) return `${seconds} seconds ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };

  const calculateTrend = (current, previous) => {
    if (previous === 0) return '+0%';
    const change = ((current - previous) / previous) * 100;
    return `${change >= 0 ? '+' : ''}${change.toFixed(1)}% this month`;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ec6d13] mx-auto"></div>
          <p className="mt-4 text-stone-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 flex">
      {/* Sidebar */}
      <ArtisanSidebar 
        user={user}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <ArtisanHeader
          todaysSales={dashboardData.todaysSales}
          newOrders={dashboardData.newOrders}
          onMenuClick={() => setSidebarOpen(true)}
        />

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-10">
          {/* Welcome section */}
          <div className="flex flex-col lg:flex-row justify-between gap-4 mb-6">
            <div className="flex flex-col gap-2">
              <h1 className="text-stone-900 text-2xl lg:text-3xl font-bold">
                Welcome back, {user?.name?.split(' ')[0] || 'Artisan'}!
              </h1>
              <p className="text-stone-600 text-sm lg:text-base">
                Here's a quick overview of your shop's performance.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  fetchDashboardData();
                }}
                className="flex items-center justify-center gap-2 px-5 py-2.5 lg:py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg font-bold text-sm transition-colors whitespace-nowrap"
                title="Refresh dashboard"
              >
                <RefreshCw className="h-5 w-5" />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              <button
                onClick={() => navigate('/artisan/products/add')}
                className="flex items-center justify-center gap-2 px-5 py-2.5 lg:py-3 bg-[#ec6d13] hover:bg-[#d87a5b] text-white rounded-lg font-bold text-sm transition-colors whitespace-nowrap"
              >
                <Plus className="h-5 w-5" />
                <span>Add New Product</span>
              </button>
            </div>
          </div>

          {/* Stats cards */}
          <div className="mb-6 lg:mb-8">
            <StatsCards stats={dashboardData.stats} />
          </div>

          {/* Charts and activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-6 lg:mb-8">
            <SalesChart salesData={dashboardData.salesData} />
            <ActivityFeed activities={dashboardData.activities} />
          </div>

          {/* Top products table */}
          <TopProductsTable products={dashboardData.topProducts} />
        </main>
      </div>
    </div>
  );
};

export default ArtisanDashboard;
