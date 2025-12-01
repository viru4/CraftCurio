import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

const ProfileSidebar = ({ activeTab, setActiveTab, isSidebarOpen, setIsSidebarOpen }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/');
    }
  };

  const menuItems = [
    { id: 'profile', label: 'Profile', icon: 'person' },
    { id: 'account', label: 'Account', icon: 'manage_accounts' },
    { id: 'security', label: 'Security', icon: 'lock' },
    { id: 'payment', label: 'Payment & Billing', icon: 'credit_card' },
    { id: 'messages', label: 'Messages', icon: 'chat' }
  ];

  return (
    <aside className={`
      fixed md:relative
      ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      transition-transform duration-300 ease-in-out
      w-64 bg-white border-r border-gray-200 p-4 min-h-screen z-40
    `}>
      <div className="flex flex-col gap-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
        >
          <img src="/cc_favicon.png" alt="CraftCurio logo" className="h-8 w-8 rounded" />
          <h1 className="text-xl font-bold text-gray-900">CraftCurio</h1>
        </button>

        <div className="flex flex-col gap-2 mt-6">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsSidebarOpen(false);
              }}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg ${activeTab === item.id ? 'bg-primary/20 text-primary' : 'hover:bg-gray-100'
                }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <p className="text-sm font-medium">{item.label}</p>
            </button>
          ))}

          <button
            onClick={() => {
              navigate('/orders');
              setIsSidebarOpen(false);
            }}
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100"
          >
            <span className="material-symbols-outlined">shopping_bag</span>
            <p className="text-sm font-medium">My Orders</p>
          </button>
        </div>
      </div>

      <div className="mt-8">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 text-red-600 w-full"
        >
          <span className="material-symbols-outlined">logout</span>
          <p className="text-sm font-medium">Logout</p>
        </button>
      </div>
    </aside>
  );
};

export default ProfileSidebar;
