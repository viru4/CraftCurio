import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  User, 
  Package, 
  BookOpen, 
  MessageSquare, 
  ShoppingCart, 
  Star, 
  BarChart3, 
  Settings,
  HelpCircle
} from 'lucide-react';

const ArtisanSidebar = ({ user, isOpen, onClose }) => {
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/artisan/dashboard', active: true },
    { icon: User, label: 'Profile', path: '/artisan/profile', active: false },
    { icon: Package, label: 'Products', path: '/artisan/products', active: false },
    { icon: BookOpen, label: 'Story & Content', path: '/artisan/story', active: false },
    { icon: MessageSquare, label: 'Messages', path: '/artisan/messages', active: false },
    { icon: ShoppingCart, label: 'Orders', path: '/artisan/orders', active: false },
    { icon: Star, label: 'Reviews', path: '/artisan/reviews', active: false },
    { icon: BarChart3, label: 'Analytics', path: '/artisan/analytics', active: false },
    { icon: Settings, label: 'Settings', path: '/artisan/settings', active: false },
  ];

  const isActiveRoute = (path) => location.pathname === path;

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 left-0 h-screen
        w-64 bg-white border-r border-stone-200
        flex flex-col justify-between p-4
        transition-transform duration-300 ease-in-out z-50
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 p-2 hover:opacity-80 transition-opacity">
            <img src="/cc_favicon.png" alt="CraftCurio logo" className="h-10 w-10 rounded" />
            <h1 className="text-stone-900 text-xl font-bold">CraftCurio</h1>
          </Link>

          {/* Navigation */}
          <nav className="flex flex-col gap-1 mt-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActiveRoute(item.path);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-lg
                    text-sm font-medium transition-colors
                    ${isActive 
                      ? 'bg-[#ec6d13]/20 text-[#ec6d13]' 
                      : 'text-stone-600 hover:bg-[#ec6d13]/10 hover:text-[#ec6d13]'
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom section */}
        <div className="flex flex-col gap-2">
          <button className="flex items-center gap-3 px-3 py-2 text-stone-600 hover:bg-[#ec6d13]/10 hover:text-[#ec6d13] rounded-lg text-sm font-medium transition-colors">
            <HelpCircle className="h-5 w-5" />
            <span>Support & Help</span>
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ec6d13] to-[#d87a5b] flex items-center justify-center text-white font-semibold">
              {user?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="flex flex-col min-w-0">
              <h1 className="text-stone-900 text-sm font-medium truncate">
                {user?.name || 'Artisan'}
              </h1>
              <p className="text-stone-500 text-xs truncate">View Profile</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default ArtisanSidebar;
