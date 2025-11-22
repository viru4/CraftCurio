import { Package, Clock, Truck, CheckCircle, XCircle, DollarSign } from 'lucide-react';

const OrdersStats = ({ stats }) => {
  const statCards = [
    {
      title: 'Total Orders',
      value: stats.total,
      icon: Package,
      color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
      borderColor: 'border-blue-200 dark:border-blue-800'
    },
    {
      title: 'Pending',
      value: stats.pending,
      icon: Clock,
      color: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400',
      borderColor: 'border-yellow-200 dark:border-yellow-800'
    },
    {
      title: 'Processing',
      value: stats.processing,
      icon: Package,
      color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
      borderColor: 'border-purple-200 dark:border-purple-800'
    },
    {
      title: 'Shipped',
      value: stats.shipped,
      icon: Truck,
      color: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400',
      borderColor: 'border-indigo-200 dark:border-indigo-800'
    },
    {
      title: 'Delivered',
      value: stats.delivered,
      icon: CheckCircle,
      color: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
      borderColor: 'border-green-200 dark:border-green-800'
    },
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-[#ec6d13]/10 text-[#ec6d13]',
      borderColor: 'border-[#ec6d13]/30'
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-6">
      {statCards.map((stat, index) => (
        <div
          key={index}
          className={`bg-white dark:bg-[#2a1e14] rounded-lg p-4 border ${stat.borderColor} transition-all hover:shadow-md`}
        >
          <div className="flex items-start justify-between mb-2">
            <div className={`p-2 rounded-lg ${stat.color}`}>
              <stat.icon className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <p className="text-xs sm:text-sm text-[#9a6c4c] dark:text-[#a88e79] mb-1">
            {stat.title}
          </p>
          <p className="text-lg sm:text-xl lg:text-2xl font-bold text-[#1b130d] dark:text-[#f3ece7]">
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
};

export default OrdersStats;
