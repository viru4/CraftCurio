import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  Receipt, 
  FileText, 
  BarChart3, 
  Shield, 
  Headset, 
  Settings, 
  LogOut 
} from 'lucide-react';

const AdminSidebar = () => {
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin', exact: true },
    { icon: Users, label: 'Users', path: '/admin/users' },
    { icon: Package, label: 'Products', path: '/admin/products' },
    { icon: Receipt, label: 'Orders', path: '/admin/orders' },
    { icon: FileText, label: 'Content', path: '/admin/content' },
    { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
    { icon: Shield, label: 'Security', path: '/admin/security' },
    { icon: Headset, label: 'Support', path: '/admin/support' },
  ];

  const bottomMenuItems = [
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
    { icon: LogOut, label: 'Log Out', path: '/logout', action: true },
  ];

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="sticky top-0 h-screen w-64 bg-white dark:bg-[#2a1e14] border-r border-[#e7d9cf] dark:border-[#3f2e1e] flex-col hidden lg:flex">
      <div className="flex h-full flex-col justify-between p-4">
        <div className="flex flex-col gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 p-2">
            <img src="/cc_favicon.png" alt="CraftCurio logo" className="h-8 w-8 rounded" />
            <h1 className="text-xl font-bold">CraftCurio</h1>
          </Link>

          {/* Navigation Menu */}
          <nav className="flex flex-col gap-1 mt-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path, item.exact);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    active
                      ? 'bg-[#ec6d13]/20 text-[#ec6d13]'
                      : 'text-[#9a6c4c] dark:text-[#a88e79] hover:bg-[#ec6d13]/10'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${active ? 'fill-current' : ''}`} />
                  <p className="text-sm font-medium">{item.label}</p>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Menu */}
        <div className="flex flex-col gap-1">
          {bottomMenuItems.map((item) => {
            const Icon = item.icon;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center gap-3 px-3 py-2 text-[#9a6c4c] dark:text-[#a88e79] hover:bg-[#ec6d13]/10 rounded-lg transition-colors"
              >
                <Icon className="w-5 h-5" />
                <p className="text-sm font-medium">{item.label}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
