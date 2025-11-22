import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '@/lib/currency';
import { ShoppingCart, Check, Heart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useWishlist } from '@/contexts/WishlistContext';

/**
 * ProductCard - A reusable component for displaying product information
 * 
 * @param {Object} item - Product object containing:
 *   - id: unique identifier
 *   - title: product name
 *   - description: product description
 *   - price: product price (formatted string)
 *   - category: product category
 *   - image: product image URL
 *   - featured: boolean - shows featured badge
 *   - popular: boolean - shows popular badge
 *   - recent: boolean - shows new badge
 *   - type: 'artisan-product' or 'collectible' (optional, defaults to 'artisan-product')
 * 
 * @param {Function} onClick - Optional callback when card is clicked, receives item as parameter
 * @param {string} productType - Type of product: 'artisan-product' or 'collectible'
 * 
 * @example
 * <ProductCard 
 *   item={productData} 
 *   productType="collectible"
 *   onClick={(item) => navigateToProduct(item.id)} 
 * />
 */
const ProductCard = ({ item, onClick, productType = 'artisan-product' }) => {
  const navigate = useNavigate();
  const { addToCart, isInCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const [showAddedMessage, setShowAddedMessage] = useState(false);
  const itemInCart = isInCart(item.id);
  const itemInWishlist = isInWishlist(item.id);

  const handleClick = () => {
    if (onClick) {
      onClick(item);
    } else {
      // Default behavior: navigate to product details page
      const type = item.type || productType;
      navigate(`/product/${type}/${item.id || item._id}`);
    }
  };

  const handleViewDetails = (e) => {
    e.stopPropagation();
    // Navigate to product details page
    const type = item.type || productType;
    navigate(`/product/${type}/${item.id || item._id}`);
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    
    // Check if user is logged in
    if (!isAuthenticated) {
      alert('Please sign in to add items to your cart');
      navigate('/sign-in');
      return;
    }
    
    // Prepare product data for cart
    const cartProduct = {
      id: item.id || item._id,
      name: item.title,
      price: typeof item.price === 'string' ? parseFloat(item.price.replace(/[^0-9.]/g, '')) : item.price,
      image: item.image,
      artisan: item.artisan || item.artisanName || 'Artisan',
      category: item.category,
      type: item.type || productType,
    };

    try {
      await addToCart(cartProduct);
      
      // Show added message
      setShowAddedMessage(true);
      setTimeout(() => {
        setShowAddedMessage(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      alert(error.message || 'Failed to add item to cart');
    }
  };

  const handleToggleWishlist = (e) => {
    e.stopPropagation();
    
    // Check if user is logged in
    if (!isAuthenticated) {
      alert('Please sign in to add items to your wishlist');
      navigate('/sign-in');
      return;
    }
    
    // Prepare product data for wishlist
    const wishlistProduct = {
      id: item.id || item._id,
      name: item.title,
      price: typeof item.price === 'string' ? parseFloat(item.price.replace(/[^0-9.]/g, '')) : item.price,
      image: item.image,
      artisan: item.artisan || item.artisanName || 'Artisan',
      category: item.category,
      type: item.type || productType,
    };

    toggleWishlist(wishlistProduct);
  };

  return (
    <div 
      className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-stone-200 hover:border-amber-300 cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative overflow-hidden">
        <img 
          src={item.image} 
          alt={item.title}
          className="w-full h-48 sm:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {/* Category Badge */}
        <div className="absolute top-3 right-3">
          <span className="bg-amber-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            {item.category.split(' ')[0]}
          </span>
        </div>
        {/* Wishlist Heart Button */}
        <button
          onClick={handleToggleWishlist}
          className="absolute top-3 left-3 flex items-center justify-center w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all shadow-md z-10"
          aria-label={itemInWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart 
            className={`w-5 h-5 transition-all ${
              itemInWishlist 
                ? 'fill-red-500 text-red-500' 
                : 'text-stone-600 hover:text-red-500'
            }`} 
          />
        </button>
        {/* Featured/Popular/Recent badges */}
        <div className="absolute top-12 left-3 flex flex-col gap-1">
          {item.featured && (
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
              Featured
            </span>
          )}
          {item.popular && (
            <span className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
              Popular
            </span>
          )}
          {item.recent && (
            <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
              New
            </span>
          )}
        </div>
      </div>
      <div className="p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-bold text-stone-800 mb-2 group-hover:text-amber-600 transition-colors line-clamp-1">
          {item.title}
        </h3>
        <p className="text-stone-600 text-sm mb-4 line-clamp-2">
          {item.description}
        </p>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xl sm:text-2xl font-bold text-amber-600">
              {formatPrice(item.price, item.currency)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleAddToCart}
              disabled={showAddedMessage}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm ${
                itemInCart || showAddedMessage
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-amber-500 hover:bg-amber-600 text-white hover:shadow-md'
              }`}
            >
              {showAddedMessage ? (
                <>
                  <Check className="w-4 h-4" />
                  Added!
                </>
              ) : itemInCart ? (
                <>
                  <Check className="w-4 h-4" />
                  In Cart
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </>
              )}
            </button>
            <button 
              onClick={handleViewDetails}
              className="px-4 py-2 rounded-lg font-medium transition-colors duration-200 text-sm border-2 border-amber-500 text-amber-600 hover:bg-amber-50"
            >
              View
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;