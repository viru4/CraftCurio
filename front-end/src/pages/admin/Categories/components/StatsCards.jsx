import React from 'react';

const StatsCards = ({ stats }) => {
  const getTotalPending = () => stats.collectible.pending + stats.artisan.pending;
  const getTotalApproved = () => stats.collectible.approved + stats.artisan.approved;
  const getTotalRejected = () => stats.collectible.rejected + stats.artisan.rejected;
  const getTotal = () => stats.collectible.total + stats.artisan.total;

  const cards = [
    {
      title: 'Total Categories',
      value: getTotal(),
      subtitle: `${stats.artisan.total} Artisan, ${stats.collectible.total} Collectible`,
      color: 'blue'
    },
    {
      title: 'Pending Approval',
      value: getTotalPending(),
      subtitle: 'Awaiting review',
      color: 'yellow'
    },
    {
      title: 'Approved',
      value: getTotalApproved(),
      subtitle: 'Live categories',
      color: 'green'
    },
    {
      title: 'Rejected',
      value: getTotalRejected(),
      subtitle: 'Not approved',
      color: 'red'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
      yellow: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400',
      green: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
      red: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white dark:bg-[#2a1e14] rounded-lg shadow-sm border border-[#e7d9cf] dark:border-[#3f2e1e] p-3 sm:p-4 lg:p-6"
        >
          <div className="flex items-center justify-between mb-1 sm:mb-2">
            <h3 className="text-xs sm:text-sm font-medium text-stone-600 dark:text-stone-400 truncate">
              {card.title}
            </h3>
            <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-bold ${getColorClasses(card.color)}`}>
              {card.value}
            </span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-stone-800 dark:text-stone-100 mb-0.5 sm:mb-1">
            {card.value}
          </p>
          <p className="text-[10px] sm:text-xs text-stone-500 dark:text-stone-400 truncate">
            {card.subtitle}
          </p>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
