import React from 'react';

/**
 * ProductPriceCard Component
 * Displays product price, availability, and action buttons
 * @param {number} price - Product price
 * @param {boolean} availability - Stock availability
 * @param {number} likes - Number of likes
 * @param {Function} onLike - Callback for like button
 * @param {boolean} isMobile - Whether to show mobile layout
 * @param {boolean} isCollectible - Whether this is a collectible (shows quantity selector)
 */
const ProductPriceCard = ({ 
  price = 0, 
  availability = true, 
  likes = 0, 
  onLike,
  isMobile = false,
  isCollectible = false
}) => {
  const [quantity, setQuantity] = React.useState(1);

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));
  return (
    <div>
      {/* Price and Stock */}
      <div className={`${isMobile ? 'flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4 mb-6' : 'border-b border-stone-200 pb-6'}`}>
        <div className={isMobile ? 'flex items-baseline gap-3' : 'flex items-baseline gap-3 mb-3'}>
          <span className={`font-bold text-stone-900 ${isMobile ? 'text-3xl md:text-4xl' : 'text-3xl xl:text-4xl'}`}>
            ₹{price.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm font-semibold text-green-600">
          <span className="material-symbols-outlined text-base">check_circle</span>
          <span>{availability ? 'In Stock' : 'Out of Stock'}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className={`${isMobile ? 'grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6' : 'space-y-3 mt-6'}`}>
        {/* Quantity Selector for Collectibles */}
        {isCollectible && (
          <div className="flex items-center gap-4">
            <div className="flex items-center rounded-lg border border-stone-300">
              <button 
                onClick={decrementQuantity}
                className="px-3 py-2 text-stone-600 hover:text-stone-900 transition-colors"
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="px-3 py-2 text-stone-900 font-medium">{quantity}</span>
              <button 
                onClick={incrementQuantity}
                className="px-3 py-2 text-stone-600 hover:text-stone-900 transition-colors"
              >
                +
              </button>
            </div>
          </div>
        )}
        
        <button 
          className={`flex items-center justify-center gap-2 rounded-${isMobile ? 'md' : 'lg'} h-12 px-6 bg-orange-500 text-white text-base font-bold shadow-sm hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${isMobile ? '' : 'w-full'} ${isCollectible ? 'flex-1' : ''}`}
          disabled={!availability}
        >
          <span className="material-symbols-outlined">add_shopping_cart</span>
          <span className={isMobile ? 'truncate' : ''}>Add to Cart</span>
        </button>
        
        {!isCollectible && (
          <button 
            className={`flex items-center justify-center rounded-${isMobile ? 'md' : 'lg'} h-12 px-6 bg-stone-900 text-white text-base font-bold shadow-sm hover:bg-stone-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${isMobile ? '' : 'w-full'}`}
            disabled={!availability}
          >
            Buy Now
          </button>
        )}
        
        <button 
          onClick={onLike}
          className={`flex items-center justify-center gap-2 rounded-${isMobile ? 'md' : 'lg'} h-12 px-6 border border-stone-300 bg-white text-stone-700 text-base font-bold shadow-sm hover:bg-stone-100 transition-colors ${isMobile ? 'sm:col-span-2' : 'w-full'}`}
        >
          <span className="material-symbols-outlined">favorite_border</span>
          <span className={isMobile ? 'truncate' : ''}>
            {isMobile ? `Add to Wishlist (${likes})` : `Wishlist (${likes})`}
          </span>
        </button>
      </div>
    </div>
  );
};

export default ProductPriceCard;
