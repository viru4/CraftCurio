import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Share2, ShoppingCart, ChevronDown, ArrowUpDown } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { formatPrice } from '@/lib/currency';

const Wishlist = () => {
  const navigate = useNavigate();
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart, isInCart } = useCart();
  const { isAuthenticated, loading } = useAuth();
  const [sortBy, setSortBy] = useState('recent');
  const [showSortMenu, setShowSortMenu] = useState(false);

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      alert('Please sign in to view your wishlist');
      navigate('/sign-in');
    }
  }, [isAuthenticated, loading, navigate]);

  // Sort wishlist items
  const getSortedItems = () => {
    let sorted = [...wishlistItems];
    
    switch (sortBy) {
      case 'recent':
        return sorted.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
      case 'price-low':
        return sorted.sort((a, b) => {
          const priceA = typeof a.price === 'string' ? parseFloat(a.price.replace(/[^0-9.]/g, '')) : a.price;
          const priceB = typeof b.price === 'string' ? parseFloat(b.price.replace(/[^0-9.]/g, '')) : b.price;
          return priceA - priceB;
        });
      case 'price-high':
        return sorted.sort((a, b) => {
          const priceA = typeof a.price === 'string' ? parseFloat(a.price.replace(/[^0-9.]/g, '')) : a.price;
          const priceB = typeof b.price === 'string' ? parseFloat(b.price.replace(/[^0-9.]/g, '')) : b.price;
          return priceB - priceA;
        });
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return sorted;
    }
  };

  const sortedItems = getSortedItems();

  // Handle add to cart
  const handleAddToCart = (item) => {
    if (!isAuthenticated) {
      alert('Please sign in to add items to your cart');
      navigate('/sign-in');
      return;
    }

    const cartProduct = {
      id: item.id,
      name: item.name,
      price: typeof item.price === 'string' ? parseFloat(item.price.replace(/[^0-9.]/g, '')) : item.price,
      image: item.image,
      artisan: item.artisan || 'Artisan',
      category: item.category,
    };

    addToCart(cartProduct);
  };

  // Handle remove from wishlist
  const handleRemoveFromWishlist = (itemId) => {
    removeFromWishlist(itemId);
  };

  // Handle share wishlist
  const handleShareWishlist = () => {
    const shareUrl = window.location.href;
    
    if (navigator.share) {
      navigator.share({
        title: 'My CraftCurio Wishlist',
        text: 'Check out my wishlist of artisanal items!',
        url: shareUrl,
      }).catch((err) => console.log('Error sharing:', err));
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(shareUrl);
      alert('Wishlist link copied to clipboard!');
    }
  };

  // Handle product click
  const handleProductClick = (item) => {
    navigate(`/product/${item.type || 'artisan-product'}/${item.id}`);
  };

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f7f6] dark:bg-[#221810]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f7f6] dark:bg-[#221810]">
      <Navbar />
      
      <main className="flex-grow px-4 py-8 sm:px-10 lg:px-20 mt-20">
        <div className="mx-auto max-w-7xl">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6">
            <div className="flex flex-col gap-2">
              <h1 className="text-[#1b130d] dark:text-white text-3xl sm:text-4xl font-black leading-tight tracking-[-0.033em]">
                My Wishlist
              </h1>
              <p className="text-[#9a6c4c] dark:text-gray-400 text-base font-normal leading-normal">
                Your collection of saved artisanal items.
              </p>
            </div>
            
            {/* Share Button */}
            {wishlistItems.length > 0 && (
              <button 
                onClick={handleShareWishlist}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg font-semibold transition-all shadow-sm"
              >
                <Share2 className="w-4 h-4" />
                <span>Share Wishlist</span>
              </button>
            )}
          </div>

          {/* Sort and Filter Bar */}
          {wishlistItems.length > 0 && (
            <div className="flex flex-wrap items-center gap-3 pb-6 border-b border-primary/20 dark:border-primary/30">
              {/* Sort Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowSortMenu(!showSortMenu)}
                  className="flex items-center gap-2 h-9 px-3 bg-slate-200 dark:bg-[#221810]/50 hover:bg-slate-300 dark:hover:bg-[#221810]/80 text-[#1b130d] dark:text-white rounded-lg transition-colors"
                >
                  <ArrowUpDown className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    Sort by: {sortBy === 'recent' ? 'Recently Added' : 
                             sortBy === 'price-low' ? 'Price: Low to High' : 
                             sortBy === 'price-high' ? 'Price: High to Low' : 
                             'Name'}
                  </span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {/* Sort Menu */}
                {showSortMenu && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-[#221810] rounded-lg shadow-lg border border-stone-200 dark:border-stone-700 py-2 z-10">
                    <button
                      onClick={() => { setSortBy('recent'); setShowSortMenu(false); }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors ${
                        sortBy === 'recent' ? 'text-primary font-medium' : 'text-[#1b130d] dark:text-white'
                      }`}
                    >
                      Recently Added
                    </button>
                    <button
                      onClick={() => { setSortBy('price-low'); setShowSortMenu(false); }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors ${
                        sortBy === 'price-low' ? 'text-primary font-medium' : 'text-[#1b130d] dark:text-white'
                      }`}
                    >
                      Price: Low to High
                    </button>
                    <button
                      onClick={() => { setSortBy('price-high'); setShowSortMenu(false); }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors ${
                        sortBy === 'price-high' ? 'text-primary font-medium' : 'text-[#1b130d] dark:text-white'
                      }`}
                    >
                      Price: High to Low
                    </button>
                    <button
                      onClick={() => { setSortBy('name'); setShowSortMenu(false); }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors ${
                        sortBy === 'name' ? 'text-primary font-medium' : 'text-[#1b130d] dark:text-white'
                      }`}
                    >
                      Name
                    </button>
                  </div>
                )}
              </div>

              <div className="text-[#9a6c4c] dark:text-gray-400 text-sm">
                {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}
              </div>
            </div>
          )}

          {/* Empty State */}
          {wishlistItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-24 h-24 mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                <Heart className="w-12 h-12 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-[#1b130d] dark:text-white mb-2">
                Your wishlist is empty
              </h2>
              <p className="text-[#9a6c4c] dark:text-gray-400 mb-6 max-w-md">
                Start adding beautiful handcrafted items to your wishlist and save them for later
              </p>
              <Link 
                to="/" 
                className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Explore Products
              </Link>
            </div>
          ) : (
            <>
              {/* Wishlist Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-6">
                {sortedItems.map((item) => (
                  <div 
                    key={item.id} 
                    className="flex flex-col gap-3 group"
                  >
                    {/* Product Image */}
                    <div className="relative w-full aspect-square bg-center bg-no-repeat bg-cover rounded-xl overflow-hidden shadow-sm">
                      <div 
                        className="w-full h-full bg-center bg-no-repeat bg-cover rounded-xl transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                        style={{ backgroundImage: `url(${item.image})` }}
                        onClick={() => handleProductClick(item)}
                        role="button"
                        tabIndex={0}
                        aria-label={`View ${item.name}`}
                      />
                      
                      {/* Remove from Wishlist Button */}
                      <button
                        onClick={() => handleRemoveFromWishlist(item.id)}
                        className="absolute top-3 right-3 flex items-center justify-center w-9 h-9 bg-white/90 dark:bg-[#221810]/90 backdrop-blur-sm rounded-full text-primary hover:bg-white dark:hover:bg-[#221810] transition-all shadow-md"
                        aria-label="Remove from wishlist"
                      >
                        <Heart className="w-5 h-5 fill-primary" />
                      </button>
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col gap-1">
                      <h3 
                        className="text-[#1b130d] dark:text-white text-base font-medium leading-normal hover:text-primary dark:hover:text-primary transition-colors cursor-pointer line-clamp-2"
                        onClick={() => handleProductClick(item)}
                      >
                        {item.name}
                      </h3>
                      <p className="text-[#9a6c4c] dark:text-gray-400 text-sm font-normal leading-normal">
                        By {item.artisan || 'Artisan'} • {formatPrice(item.price)}
                      </p>
                      
                      {/* Add to Cart Button */}
                      {isInCart(item.id) ? (
                        <Link
                          to="/cart"
                          className="text-primary dark:text-primary text-sm font-medium leading-normal mt-1 hover:underline inline-flex items-center gap-1"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          View in Cart
                        </Link>
                      ) : (
                        <button
                          onClick={() => handleAddToCart(item)}
                          className="text-primary dark:text-primary text-sm font-medium leading-normal mt-1 hover:underline inline-flex items-center gap-1 w-fit"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          Add to Cart
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Wishlist;
