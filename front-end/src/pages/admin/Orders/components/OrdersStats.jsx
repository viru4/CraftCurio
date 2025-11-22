import { TrendingUp, Package, DollarSign, Clock } from 'lucide-react';

const OrdersStats = ({ stats }) => {
  const statCards = [
    {
      title: 'Total Orders',
      value: stats.total || 0,
      icon: Package,
      color: 'bg-blue-50 text-blue-600',
      borderColor: 'border-blue-200'
    },
    {
      title: 'Pending Orders',
      value: stats.byStatus?.pending || 0,
      icon: Clock,
      color: 'bg-orange-50 text-orange-600',
      borderColor: 'border-orange-200'
    },
    {
      title: 'Total Revenue',
      value: `$${(stats.totalRevenue || 0).toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-green-50 text-green-600',
      borderColor: 'border-green-200'
    },
    {
      title: 'Last 30 Days',
      value: stats.last30Days || 0,
      icon: TrendingUp,
      color: 'bg-purple-50 text-purple-600',
      borderColor: 'border-purple-200'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6">
      {statCards.map((stat, index) => (
        <div
          key={index}
          className={`bg-white rounded-lg p-6 border ${stat.borderColor} shadow-sm hover:shadow-md transition-shadow`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#6b5d54] mb-1">{stat.title}</p>
              <p className="text-2xl font-bold text-[#1b130d]">{stat.value}</p>
            </div>
            <div className={`p-3 rounded-lg ${stat.color}`}>
              <stat.icon size={24} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrdersStats;
