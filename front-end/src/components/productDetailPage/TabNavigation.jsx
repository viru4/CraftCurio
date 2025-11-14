import React from 'react';

/**
 * TabNavigation Component
 * Navigation tabs for Reviews and Q&A sections
 * @param {string} activeTab - Currently active tab ('reviews' or 'qa')
 * @param {Function} onTabChange - Callback when tab is clicked
 */
const TabNavigation = ({ activeTab = 'reviews', onTabChange }) => {
  const tabs = [
    { id: 'reviews', label: 'Reviews' },
    { id: 'qa', label: 'Q&A' }
  ];

  return (
    <div className="border-b border-stone-200">
      <nav className="-mb-px flex gap-4 lg:gap-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`whitespace-nowrap border-b-2 py-4 px-1 text-base font-medium transition-colors ${
              activeTab === tab.id
                ? 'border-orange-500 text-orange-500'
                : 'border-transparent text-stone-500 hover:border-stone-300 hover:text-stone-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default TabNavigation;
