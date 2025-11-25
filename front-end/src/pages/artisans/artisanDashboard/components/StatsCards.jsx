import React from 'react';
import { DollarSign, Package, Eye, Clock, TrendingUp, TrendingDown } from 'lucide-react';

const StatsCard = ({ title, value, trend, icon: IconComponent, iconBgColor, iconColor }) => {
  const isPositive = trend && trend.includes('+');
  
  return (
    <div className="flex flex-col gap-3 rounded-xl p-6 border border-stone-200 bg-white hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <p className="text-stone-600 text-sm font-medium">{title}</p>
        <div className={`p-2 rounded-lg ${iconBgColor}`}>
          <IconComponent className={`h-5 w-5 ${iconColor}`} />
        </div>
      </div>
      <p className="text-stone-900 text-3xl font-bold tracking-tight">{value}</p>
      {trend && (
        <div className="flex items-center gap-1">
          {isPositive ? (
            <TrendingUp className="h-4 w-4 text-green-500" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500" />
          )}
          <p className={`text-sm font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {trend}
          </p>
        </div>
      )}
    </div>
  );
};

const StatsCards = ({ stats }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const statsConfig = [
    {
      title: 'Total Sales',
      value: formatCurrency(stats?.totalSales || 0),
      trend: stats?.salesTrend || '+5.2% this month',
      icon: DollarSign,
      iconBgColor: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      title: 'Total Products',
      value: stats?.totalProducts || 0,
      trend: stats?.productsTrend || '+2 this week',
      icon: Package,
      iconBgColor: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Total Visits',
      value: stats?.totalVisits || 0,
      trend: stats?.visitsTrend || '+10.1% this month',
      icon: Eye,
      iconBgColor: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      title: 'Pending Orders',
      value: stats?.pendingOrders || 0,
      trend: stats?.ordersTrend || '+1 today',
      icon: Clock,
      iconBgColor: 'bg-[#ec6d13]/20',
      iconColor: 'text-[#ec6d13]'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      {statsConfig.map((stat, index) => (
        <StatsCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default StatsCards;
