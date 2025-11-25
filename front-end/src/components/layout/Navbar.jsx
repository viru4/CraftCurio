import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, User, LogOut, Settings, ShoppingCart, Heart, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";

const Navbar = () => {
  const { user, isAuthenticated, isArtisan, isAdmin, isCollector, logout } = useAuth();
  const { getCartCount } = useCart();
  const { getWishlistCount } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);
  
  const cartCount = getCartCount();
  const wishlistCount = getWishlistCount();

  // Helper function to check if a path is active
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  // Close menu when clicking outside
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
    navigate('/');
    setShowProfileMenu(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-20 w-full bg-white/80 backdrop-blur-md border-b border-b-[#f4f2f0]">
      <div className="flex items-center justify-between whitespace-nowrap px-4 md:px-10 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-10">
          <Link to="/" className="flex items-center gap-3 text-[var(--text-primary)] no-underline">
            <img src="/cc_favicon.png" alt="CraftCurio logo" className="h-8 w-8 rounded" />

            <h2 className="text-2xl font-bold tracking-tight">CraftCurio</h2>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className={`text-base font-medium transition-colors ${isActive('/') ? 'text-[var(--primary-color)] font-semibold' : 'text-[var(--text-primary)] hover:text-[var(--primary-color)]'}`}>Home</Link>
            <Link to="/collectibles" className={`text-base font-medium transition-colors ${isActive('/collectibles') ? 'text-[var(--primary-color)] font-semibold' : 'text-[var(--text-primary)] hover:text-[var(--primary-color)]'}`}>Collectibles</Link>
            <Link to="/auctions" className={`text-base font-medium transition-colors ${isActive('/auctions') ? 'text-[var(--primary-color)] font-semibold' : 'text-[var(--text-primary)] hover:text-[var(--primary-color)]'}`}>Auctions</Link>
            <Link to="/artisans" className={`text-base font-medium transition-colors ${isActive('/artisans') ? 'text-[var(--primary-color)] font-semibold' : 'text-[var(--text-primary)] hover:text-[var(--primary-color)]'}`}>Artisan Products</Link>
            <Link to="/artisan-stories" className={`text-base font-medium transition-colors ${isActive('/artisan-stories') ? 'text-[var(--primary-color)] font-semibold' : 'text-[var(--text-primary)] hover:text-[var(--primary-color)]'}`}>Artisan Stories</Link>
            <Link to="/about-us" className={`text-base font-medium transition-colors ${isActive('/about-us') ? 'text-[var(--primary-color)] font-semibold' : 'text-[var(--text-primary)] hover:text-[var(--primary-color)]'}`}>About Us</Link>
          </nav>
        </div>
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <>
              {/* Cart Icon with Badge */}
              <Link 
                to="/cart" 
                className="relative p-2 rounded-full hover:bg-stone-100 transition-colors"
                aria-label="Shopping cart"
              >
                <ShoppingCart className="h-6 w-6 text-stone-700" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[var(--primary-color)] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>

              {/* Wishlist Icon */}
              <Link 
                to="/wishlist" 
                className="relative p-2 rounded-full hover:bg-stone-100 transition-colors"
                aria-label="Wishlist"
              >
                <Heart className="h-6 w-6 text-stone-700" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {wishlistCount > 9 ? '9+' : wishlistCount}
                  </span>
                )}
              </Link>
              
              {/* Profile Dropdown */}
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 p-2 rounded-full hover:bg-stone-100 transition-colors"
                  aria-label="User menu"
                >
                  <div className="h-10 w-10 rounded-full bg-[var(--primary-color)] flex items-center justify-center text-white font-semibold">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                </button>
                {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-stone-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-stone-200">
                    <p className="text-sm font-semibold text-stone-900">{user?.name}</p>
                    <p className="text-xs text-stone-500">{user?.email}</p>
                    <p className="text-xs text-[var(--primary-color)] mt-1 capitalize">{user?.role}</p>
                  </div>
                  {isCollector && (
                    <button
                      onClick={() => {
                        navigate('/collector/dashboard');
                        setShowProfileMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      <span>Collector Dashboard</span>
                    </button>
                  )}
                  {isArtisan && (
                    <button
                      onClick={() => {
                        navigate('/artisan/dashboard');
                        setShowProfileMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      <span>Artisan Dashboard</span>
                    </button>
                  )}
                  {isAdmin && (
                    <button
                      onClick={() => {
                        navigate('/admin/dashboard');
                        setShowProfileMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      <span>Admin Dashboard</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      navigate('/cart');
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    <span>Cart</span>
                  </button>
                  <button
                    onClick={() => {
                      navigate('/wishlist');
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                  >
                    <Heart className="h-4 w-4" />
                    <span>Wishlist</span>
                  </button>
                  <div className="h-px bg-stone-200 my-2" />
                  <button
                    onClick={() => {
                      navigate('/profile');
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                  >
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </button>
                  <button
                    onClick={() => {
                      navigate('/settings');
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </button>
                  <div className="h-px bg-stone-200 my-2" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
              </div>
            </>
          ) : (
            <>
              <Link to="/sign-in" className="flex min-w-[84px] max-w-[480px] items-center justify-center overflow-hidden rounded-full h-10 px-6 bg-[var(--primary-color)] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-opacity-90 transition-all">Sign In</Link>
              <Link to="/sign-up" className="flex min-w-[84px] max-w-[480px] items-center justify-center overflow-hidden rounded-full h-10 px-6 border-2 border-[var(--primary-color)] text-[var(--primary-color)] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[var(--primary-color)] hover:text-white transition-all">Sign Up</Link>
            </>
          )}
        </div>
        <div className="md:hidden flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Open menu">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="p-0">
              <div className="flex flex-col h-full">
                {/* Logo Section */}
                <div className="px-6 pt-16 pb-4 border-b border-gray-200">
                  <Link to="/" className="flex items-center gap-3 text-[var(--text-primary)] no-underline">
                    <img src="/cc_favicon.png" alt="CraftCurio logo" className="h-8 w-8 rounded" />
                    <h2 className="text-xl font-bold tracking-tight">CraftCurio</h2>
                  </Link>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 px-6 py-4 space-y-1">
                  <Link to="/" className={`block py-3 text-base font-medium rounded-lg px-3 transition-colors ${isActive('/') ? 'text-[var(--primary-color)] bg-amber-50 font-semibold' : 'text-[var(--text-primary)] hover:text-[var(--primary-color)] hover:bg-stone-50'}`}>Home</Link>
                  <Link to="/collectibles" className={`block py-3 text-base font-medium rounded-lg px-3 transition-colors ${isActive('/collectibles') ? 'text-[var(--primary-color)] bg-amber-50 font-semibold' : 'text-[var(--text-primary)] hover:text-[var(--primary-color)] hover:bg-stone-50'}`}>Collectibles</Link>
                  <Link to="/auctions" className={`block py-3 text-base font-medium rounded-lg px-3 transition-colors ${isActive('/auctions') ? 'text-[var(--primary-color)] bg-amber-50 font-semibold' : 'text-[var(--text-primary)] hover:text-[var(--primary-color)] hover:bg-stone-50'}`}>Auctions</Link>
                  <Link to="/artisans" className={`block py-3 text-base font-medium rounded-lg px-3 transition-colors ${isActive('/artisans') ? 'text-[var(--primary-color)] bg-amber-50 font-semibold' : 'text-[var(--text-primary)] hover:text-[var(--primary-color)] hover:bg-stone-50'}`}>Artisan Products</Link>
                  <Link to="/artisan-stories" className={`block py-3 text-base font-medium rounded-lg px-3 transition-colors ${isActive('/artisan-stories') ? 'text-[var(--primary-color)] bg-amber-50 font-semibold' : 'text-[var(--text-primary)] hover:text-[var(--primary-color)] hover:bg-stone-50'}`}>Artisan Stories</Link>
                  <Link to="/about-us" className={`block py-3 text-base font-medium rounded-lg px-3 transition-colors ${isActive('/about-us') ? 'text-[var(--primary-color)] bg-amber-50 font-semibold' : 'text-[var(--text-primary)] hover:text-[var(--primary-color)] hover:bg-stone-50'}`}>About Us</Link>
                </nav>

                {/* User Section */}
                <div className="border-t border-gray-200 px-6 py-4 space-y-2">
                  {isAuthenticated ? (
                    <>
                      {/* User Info */}
                      <div className="px-3 py-3 bg-stone-50 rounded-lg mb-3">
                        <p className="text-sm font-semibold text-stone-900 truncate">{user?.name}</p>
                        <p className="text-xs text-stone-500 truncate">{user?.email}</p>
                        <p className="text-xs text-[var(--primary-color)] mt-1 capitalize font-medium">{user?.role}</p>
                      </div>
                      
                      {/* Cart & Wishlist */}
                      <Link to="/cart" className="flex items-center gap-3 py-3 px-3 text-[var(--text-primary)] text-sm font-medium hover:bg-stone-50 rounded-lg transition-colors">
                        <ShoppingCart className="h-5 w-5" />
                        <span>Cart</span>
                        {cartCount > 0 && (
                          <span className="ml-auto bg-[var(--primary-color)] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                            {cartCount > 9 ? '9+' : cartCount}
                          </span>
                        )}
                      </Link>
                      <Link to="/wishlist" className="flex items-center gap-3 py-3 px-3 text-[var(--text-primary)] text-sm font-medium hover:bg-stone-50 rounded-lg transition-colors">
                        <Heart className="h-5 w-5" />
                        <span>Wishlist</span>
                        {wishlistCount > 0 && (
                          <span className="ml-auto bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                            {wishlistCount > 9 ? '9+' : wishlistCount}
                          </span>
                        )}
                      </Link>
                      
                      <div className="h-px bg-gray-200 my-3" />
                      
                      {/* Dashboard for Collectors */}
                      {isCollector && (
                        <Link to="/collector/dashboard" className="flex items-center gap-3 py-3 px-3 text-[var(--text-primary)] text-sm font-medium hover:bg-stone-50 rounded-lg transition-colors">
                          <LayoutDashboard className="h-5 w-5" />
                          <span>Collector Dashboard</span>
                        </Link>
                      )}
                      
                      {/* Dashboard for Artisans */}
                      {isArtisan && (
                        <Link to="/artisan/dashboard" className="flex items-center gap-3 py-3 px-3 text-[var(--text-primary)] text-sm font-medium hover:bg-stone-50 rounded-lg transition-colors">
                          <LayoutDashboard className="h-5 w-5" />
                          <span>Artisan Dashboard</span>
                        </Link>
                      )}
                      
                      {/* Dashboard for Admin */}
                      {isAdmin && (
                        <Link to="/admin/dashboard" className="flex items-center gap-3 py-3 px-3 text-[var(--text-primary)] text-sm font-medium hover:bg-stone-50 rounded-lg transition-colors">
                          <LayoutDashboard className="h-5 w-5" />
                          <span>Admin Dashboard</span>
                        </Link>
                      )}
                      
                      {/* Profile & Settings */}
                      <Link to="/profile" className="flex items-center gap-3 py-3 px-3 text-[var(--text-primary)] text-sm font-medium hover:bg-stone-50 rounded-lg transition-colors">
                        <User className="h-5 w-5" />
                        <span>Profile</span>
                      </Link>
                      <Link to="/settings" className="flex items-center gap-3 py-3 px-3 text-[var(--text-primary)] text-sm font-medium hover:bg-stone-50 rounded-lg transition-colors">
                        <Settings className="h-5 w-5" />
                        <span>Settings</span>
                      </Link>
                      
                      <div className="pt-3">
                        <Button onClick={handleLogout} variant="destructive" size="sm" className="w-full h-11 text-base font-semibold">
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign Out
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <Link to="/sign-in" className="block">
                        <Button size="lg" className="w-full h-11 text-base font-semibold">Sign In</Button>
                      </Link>
                      <Link to="/sign-up" className="block">
                        <Button size="lg" variant="outline" className="w-full h-11 text-base font-semibold">Sign Up</Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
