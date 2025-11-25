import React, { useState, useRef, useEffect } from 'react';
import { Search, TrendingUp, Truck, Bell, Menu } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const ArtisanHeader = ({ todaysSales = 0, newOrders = 0, onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const profileMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    if (showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileMenu]);

  const handleLogout = async () => {
    await logout();
    navigate('/sign-in');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <header className="sticky top-0 z-30 bg-stone-50/80 backdrop-blur-md border-b border-stone-200">
      <div className="flex items-center justify-between px-4 lg:px-10 py-3">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-stone-100 text-stone-600"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Search bar */}
        <div className="hidden md:block flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search products or orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#ec6d13] focus:border-transparent"
            />
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-3 lg:gap-6 ml-auto">
          {/* Stats - Hidden on mobile */}
          <div className="hidden lg:flex items-center gap-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <p className="text-sm text-stone-600">
                Today's Sales: <span className="font-semibold text-stone-900">{formatCurrency(todaysSales)}</span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-[#ec6d13]" />
              <p className="text-sm text-stone-600">
                New Orders: <span className="font-semibold text-stone-900">{newOrders}</span>
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden lg:block w-px h-6 bg-stone-200" />

          {/* Notifications */}
          <button className="relative p-2 rounded-full hover:bg-stone-100 text-stone-600 transition-colors">
            <Bell className="h-5 w-5" />
            <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#ec6d13] rounded-full" />
          </button>

          {/* Profile dropdown */}
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ec6d13] to-[#d87a5b] flex items-center justify-center text-white font-semibold hover:shadow-lg transition-shadow"
            >
              {user?.name?.charAt(0).toUpperCase() || 'A'}
            </button>

            {/* Dropdown menu */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-stone-200 rounded-lg shadow-lg overflow-hidden">
                <button
                  onClick={() => {
                    navigate('/profile');
                    setShowProfileMenu(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-stone-900 hover:bg-stone-50 transition-colors"
                >
                  View Public Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile search bar */}
      <div className="md:hidden px-4 pb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#ec6d13] focus:border-transparent"
          />
        </div>
      </div>
    </header>
  );
};

export default ArtisanHeader;
