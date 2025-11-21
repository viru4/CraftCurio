const ContentTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'story', label: 'My Artisan Story' },
    { id: 'products', label: 'Product Stories' }
  ];

  return (
    <div className="border-b border-[#e7d9cf] dark:border-[#4a392b]">
      <div className="flex gap-4 sm:gap-8 overflow-x-auto scrollbar-thin">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center border-b-[3px] pb-3 whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'border-b-[#ec6d13] text-[#ec6d13]'
                : 'border-b-transparent text-[#9a6c4c] hover:text-[#3a3028] dark:hover:text-[#f3ece7]'
            }`}
          >
            <p className="text-xs sm:text-sm font-bold">{tab.label}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ContentTabs;
