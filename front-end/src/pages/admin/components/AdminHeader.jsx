import { useState } from 'react';
import { Search, Bell, HelpCircle } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';

const AdminHeader = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-[#e7d9cf] dark:border-[#3f2e1e] px-2 sm:px-4 md:px-10 py-3 bg-white dark:bg-[#2a1e14]">
      <div className="flex items-center gap-2 md:gap-8 flex-1 min-w-0">
        {/* Search Bar */}
        <label className="flex flex-col w-full max-w-sm min-w-0">
          <div className="flex w-full flex-1 items-stretch rounded-lg h-10">
            <div className="text-[#9a6c4c] dark:text-[#a88e79] flex border border-[#e7d9cf] dark:border-[#3f2e1e] bg-[#f8f7f6] dark:bg-[#221810] items-center justify-center pl-3 rounded-l-lg border-r-0">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#1b130d] dark:text-[#fcfaf8] focus:outline-none focus:ring-2 focus:ring-[#ec6d13] border border-[#e7d9cf] dark:border-[#3f2e1e] bg-[#f8f7f6] dark:bg-[#221810] h-full placeholder:text-[#9a6c4c] dark:placeholder:text-[#a88e79] px-2 sm:px-4 rounded-l-none border-l-0 pl-2 text-sm sm:text-base font-normal leading-normal"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </label>
      </div>

      <div className="flex items-center justify-end gap-1 sm:gap-2 md:gap-4 flex-shrink-0">
        {/* Notifications Button */}
        <button className="flex items-center justify-center overflow-hidden rounded-lg h-8 w-8 sm:h-10 sm:w-10 border border-[#e7d9cf] dark:border-[#3f2e1e] text-[#9a6c4c] dark:text-[#a88e79] hover:bg-[#ec6d13]/10 hover:text-[#ec6d13] transition-colors">
          <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Help Button */}
        <button className="hidden sm:flex items-center justify-center overflow-hidden rounded-lg h-8 w-8 sm:h-10 sm:w-10 border border-[#e7d9cf] dark:border-[#3f2e1e] text-[#9a6c4c] dark:text-[#a88e79] hover:bg-[#ec6d13]/10 hover:text-[#ec6d13] transition-colors">
          <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* User Profile */}
        <div className="hidden lg:flex items-center gap-3">
          <div 
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0"
            style={{
              backgroundImage: user?.avatar 
                ? `url(${user.avatar})` 
                : "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCyYXUF-FX0onPax5yWhNq9dEAWTn5StNOIQon_PB4rZdY7G95FQ4q3G39zLcSvjDETd7cRSEmh3TXNHpDGMujmBqMcC2gAumZC-mfYbUykWnsIeHK3hZzUMUK2sCq-FUhlqh8ZHUR-TTOKOxInP-9dexZIv_Ag0q672-4C4cUXQ6EvQS0EGpsOfgmATv0cq9Wvdbi8vyONp-skr6C81EuPXSoXNqIFPaFHRABjDR1Xn_bal4zxyxeYf77u-8XLlNDZmu98L_A1uTc')"
            }}
          />
          <div className="flex flex-col min-w-0">
            <h1 className="text-sm sm:text-base font-medium leading-normal truncate">
              {user?.firstName && user?.lastName 
                ? `${user.firstName} ${user.lastName}` 
                : user?.email?.split('@')[0] || 'Admin User'}
            </h1>
            <p className="text-[#9a6c4c] dark:text-[#a88e79] text-xs sm:text-sm font-normal leading-normal truncate">
              {user?.email || 'administrator@craftcurio.com'}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
