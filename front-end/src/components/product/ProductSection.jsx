import React, { useState } from 'react';
import { ProductCard } from '@/components/product';
import { ScrollManager } from '@/components/managers';

const ProductSection = ({
  id,
  title,
  description,
  items,
  onProductClick,
  backgroundColor = 'bg-white',
  initialDisplayCount = 8,
  buttonColor = 'bg-amber-500 hover:bg-amber-600',
  productType = 'artisan-product'
}) => {
  const [showAll, setShowAll] = useState(false);
  const { scrollToExpandedContent } = ScrollManager();

  const handleShowAllToggle = () => {
    setShowAll(!showAll);
    // If expanding, scroll to show the expanded content
    if (!showAll) {
      scrollToExpandedContent(id);
    }
  };

  const displayedItems = showAll ? items : items.slice(0, initialDisplayCount);
  const hasMoreItems = items.length > initialDisplayCount;

  return (
    <section id={`${id}-section`} className={`py-8 sm:py-16 ${backgroundColor}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-800 mb-3 sm:mb-4">
            {title}
          </h2>
          <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto">
            {description}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {displayedItems.map((item) => (
            <ProductCard key={item.id} item={item} onClick={onProductClick} productType={productType} />
          ))}
        </div>
        
        {hasMoreItems && (
          <div className="text-center">
            <button 
              onClick={handleShowAllToggle}
              className={`${buttonColor} text-white px-8 py-3 rounded-full font-semibold transition-colors duration-200 shadow-lg hover:shadow-xl`}
            >
              {showAll 
                ? `Show Less ${title}` 
                : `View All ${title} (${items.length})`
              }
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductSection;