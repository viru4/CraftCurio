import React, { useState } from 'react';
import { ProductCard } from '@/components/product';
import { Button } from '@/components/ui/button';

const FilteredItemsSection = ({
  items,
  searchQuery,
  selectedCategory,
  onProductClick,
  isVisible = false,
  totalProductCount = 0,
  initialDisplayCount = 12
}) => {
  const [displayCount, setDisplayCount] = useState(initialDisplayCount);
  
  // Don't render if not visible
  if (!isVisible) return null;

  const hasSearchQuery = searchQuery && searchQuery.trim().length > 0;
  const hasItems = items && items.length > 0;
  const displayedItems = items.slice(0, displayCount);
  const hasMoreItems = items.length > displayCount;

  return (
    <section id="filtered-items-section" className="py-16 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Dynamic Title */}
        <div className="text-center mb-12">
          <h3 className="text-2xl md:text-3xl font-bold text-stone-800 mb-4">
            {hasSearchQuery 
              ? `Search Results for "${searchQuery}"` 
              : selectedCategory 
                ? `${selectedCategory} Collection`
                : "Explore All Collectibles"
            }
          </h3>
          <p className="text-stone-600">
            {hasSearchQuery
              ? `Found ${items.length} items matching your search`
              : selectedCategory
                ? `Explore our curated selection of ${selectedCategory?.toLowerCase()} items`
                : totalProductCount > 0
                  ? `Discover our collection of ${totalProductCount} unique handcrafted items`
                  : `Browse our featured handcrafted collectibles`
            }
          </p>
        </div>

        {/* Items Grid */}
        {hasItems ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {displayedItems.map((item) => (
                <ProductCard key={item.id} item={item} onClick={onProductClick} />
              ))}
            </div>
            
            {/* Load More Button */}
            {hasMoreItems && (
              <div className="text-center mb-8">
                <Button 
                  onClick={() => setDisplayCount(prev => prev + initialDisplayCount)}
                  variant="outline"
                  size="lg"
                  className="bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-800 px-8 py-3"
                >
                  Explore More Items
                </Button>
                <p className="text-sm text-gray-500 mt-2">
                  Showing {displayedItems.length} of {items.length} items
                </p>
              </div>
            )}
            
          </>
        ) : (
          /* Empty State */
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-stone-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8l-7 7-7-7" />
              </svg>
            </div>
            <h4 className="text-xl font-semibold text-stone-800 mb-2">No Items Found</h4>
            <p className="text-stone-600">
              {hasSearchQuery
                ? `No items match your search for "${searchQuery}". Try a different search term.`
                : `We're currently building our ${selectedCategory?.toLowerCase()} collection. Check back soon!`
              }
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FilteredItemsSection;