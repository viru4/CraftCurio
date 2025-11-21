import React from 'react';

const ProfileTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'details', label: 'Profile Details' },
    { id: 'portfolio', label: 'Portfolio & Links' },
    { id: 'verification', label: 'Verification & Awards' }
  ];

  return (
    <div className="pb-3 overflow-x-auto">
      <div className="flex border-b border-stone-200 gap-4 sm:gap-6 md:gap-8 min-w-max">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              flex flex-col items-center justify-center border-b-[3px] pb-3 pt-4 whitespace-nowrap
              ${activeTab === tab.id 
                ? 'border-b-[#ec6d13] text-stone-900' 
                : 'border-b-transparent text-stone-500 hover:text-stone-900'
              }
              transition-colors
            `}
          >
            <p className="text-xs sm:text-sm font-bold leading-normal tracking-wide">
              {tab.label}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProfileTabs;
