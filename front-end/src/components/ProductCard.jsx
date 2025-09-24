import React from 'react';

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
 * 
 * @param {Function} onClick - Optional callback when card is clicked, receives item as parameter
 * 
 * @example
 * <ProductCard 
 *   item={productData} 
 *   onClick={(item) => navigateToProduct(item.id)} 
 * />
 */
const ProductCard = ({ item, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(item);
    }
  };

  const handleViewDetails = (e) => {
    e.stopPropagation();
    // Add view details functionality here
    console.log('View details for:', item.title);
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
        <div className="absolute top-3 right-3">
          <span className="bg-amber-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            {item.category.split(' ')[0]}
          </span>
        </div>
        {/* Featured/Popular/Recent badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
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
        <div className="flex items-center justify-between">
          <span className="text-xl sm:text-2xl font-bold text-amber-600">
            {item.price}
          </span>
          <button 
            onClick={handleViewDetails}
            className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 text-sm hover:shadow-md"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;