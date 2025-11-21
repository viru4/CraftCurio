import React from 'react';

/**
 * ProductPriceCard Component
 * Displays product price, availability, and action buttons
 * @param {number} price - Product price
 * @param {boolean} availability - Stock availability
 * @param {boolean} isInWishlist - Whether the product is in the wishlist
 * @param {Function} onToggleWishlist - Callback for wishlist toggle button
 * @param {Function} onAddToCart - Callback for add to cart button
 * @param {boolean} isMobile - Whether to show mobile layout
 * @param {boolean} isCollectible - Whether this is a collectible (shows quantity selector)
 */
const ProductPriceCard = ({ 
  price = 0, 
  availability = true,
  isInWishlist = false,
  onToggleWishlist,
  onAddToCart,
  isMobile = false,
  isCollectible = false
}) => {
  const [quantity, setQuantity] = React.useState(1);

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(quantity);
    }
  };

  // Desktop layout (sidebar)
  if (!isMobile) {
    return (
      <div className="space-y-6">
        {/* Price and Stock */}
        <div className="flex flex-col gap-2">
          <p className="text-5xl font-bold text-stone-800">₹{price.toLocaleString()}</p>
          <div className="flex items-center gap-2 text-sm font-semibold text-green-600">
            <span className="material-symbols-outlined text-base">check_circle</span>
            <span>{availability ? 'In Stock' : 'Out of Stock'}</span>
          </div>
        </div>

        {/* Action Buttons Container */}
        <div className="flex flex-col gap-3">
          {/* Quantity Selector + Add to Cart Row for Collectibles */}
          {isCollectible ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center rounded-lg border border-stone-300">
                <button 
                  onClick={decrementQuantity}
                  className="px-3 py-2 text-stone-600 hover:text-stone-900 transition-colors disabled:opacity-50"
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="px-3 py-2 text-stone-900 font-medium min-w-[2.5rem] text-center">{quantity}</span>
                <button 
                  onClick={incrementQuantity}
                  className="px-3 py-2 text-stone-600 hover:text-stone-900 transition-colors"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              <button 
                onClick={handleAddToCart}
                className="flex-1 rounded-lg bg-orange-500 px-6 py-3 text-base font-bold text-white shadow-sm hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!availability}
                aria-label="Add to cart"
              >
                <span className="flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined">add_shopping_cart</span>
                  <span>Add to Cart</span>
                </span>
              </button>
            </div>
          ) : (
            <>
              {/* Add to Cart Button for Artisan Products */}
              <button 
                onClick={handleAddToCart}
                className="w-full rounded-lg bg-orange-500 px-6 py-3 text-base font-bold text-white shadow-sm hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!availability}
                aria-label="Add to cart"
              >
                <span className="flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined">add_shopping_cart</span>
                  <span>Add to Cart</span>
                </span>
              </button>
              
              {/* Buy Now Button for Artisan Products */}
              <button 
                className="w-full rounded-lg bg-stone-900 px-6 py-3 text-base font-bold text-white shadow-sm hover:bg-stone-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!availability}
                aria-label="Buy now"
              >
                Buy Now
              </button>
            </>
          )}
          
          {/* Wishlist Button - Always shown */}
          <button 
            onClick={onToggleWishlist}
            className={`w-full rounded-lg border px-6 py-3 text-base font-bold shadow-sm transition-colors ${
              isInWishlist 
                ? 'border-red-500 bg-red-50 text-red-600 hover:bg-red-100'
                : 'border-stone-300 bg-white text-stone-700 hover:bg-stone-50'
            }`}
            aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <span className="flex items-center justify-center gap-2">
              <span className="material-symbols-outlined" style={isInWishlist ? { fontVariationSettings: "'FILL' 1" } : {}}>
                {isInWishlist ? 'favorite' : 'favorite_border'}
              </span>
              <span>{isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}</span>
            </span>
          </button>
        </div>
      </div>
    );
  }

  // Mobile layout
  return (
    <div>
      {/* Price and Stock */}
      <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4 mb-6">
        <span className="text-3xl md:text-4xl font-bold text-stone-900">
          ₹{price.toLocaleString()}
        </span>
        <div className="flex items-center gap-2 text-sm font-semibold text-green-600">
          <span className="material-symbols-outlined text-base">check_circle</span>
          <span>{availability ? 'In Stock' : 'Out of Stock'}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {/* Quantity Selector for Collectibles - Mobile */}
        {isCollectible && (
          <div className="flex items-center gap-4 sm:col-span-2">
            <div className="flex items-center rounded-lg border border-stone-300">
              <button 
                onClick={decrementQuantity}
                className="px-3 py-2 text-stone-600 hover:text-stone-900 transition-colors disabled:opacity-50"
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="px-3 py-2 text-stone-900 font-medium min-w-[2.5rem] text-center">{quantity}</span>
              <button 
                onClick={incrementQuantity}
                className="px-3 py-2 text-stone-600 hover:text-stone-900 transition-colors"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>
        )}
        
        <button 
          onClick={handleAddToCart}
          className={`flex items-center justify-center gap-2 rounded-md h-12 px-6 bg-orange-500 text-white text-base font-bold shadow-sm hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${isCollectible ? 'sm:col-span-2' : ''}`}
          disabled={!availability}
          aria-label="Add to cart"
        >
          <span className="material-symbols-outlined">add_shopping_cart</span>
          <span className="truncate">Add to Cart</span>
        </button>
        
        {!isCollectible && (
          <button 
            className="flex items-center justify-center rounded-md h-12 px-6 bg-stone-900 text-white text-base font-bold shadow-sm hover:bg-stone-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!availability}
            aria-label="Buy now"
          >
            Buy Now
          </button>
        )}
        
        <button 
          onClick={onToggleWishlist}
          className={`sm:col-span-2 flex items-center justify-center gap-2 rounded-md h-12 px-6 border text-base font-bold shadow-sm transition-colors ${
            isInWishlist 
              ? 'border-red-500 bg-red-50 text-red-600 hover:bg-red-100'
              : 'border-stone-300 bg-white text-stone-700 hover:bg-stone-50'
          }`}
          aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <span className="material-symbols-outlined" style={isInWishlist ? { fontVariationSettings: "'FILL' 1" } : {}}>
            {isInWishlist ? 'favorite' : 'favorite_border'}
          </span>
          <span className="truncate">{isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}</span>
        </button>
      </div>
    </div>
  );
};

export default ProductPriceCard;
