import React, { useState, useEffect } from 'react';
import { Navbar, Footer } from '@/components/layout';
import { HeroCarousel } from '@/components/carousel';
import { ProductSection } from '@/components/product';
import { SearchBar, FilteredItemsSection } from '@/components/search';
import { CategoryGrid, CategoryDropdown } from '@/components/category';
import { ScrollManager, SearchManager } from '@/components/managers';
import { categories, collectibleItems, getItemsByCategory, getFeaturedItems, getPopularItems, getRecentItems, searchItems, getRandomCarouselItems } from '@/data/Products';

const Collectibles = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  // Initialize managers
  const {
    delayedScrollToSection,
    scrollToFilteredItems,
    handleCarouselItemClick,
    handleCategorySelectWithScroll
  } = ScrollManager();

  const {
    searchQuery,
    handleSearchSubmit,
    handlePopularTagClick,
    getTrimmedQuery,
    getSearchBarProps,
    createUrlParamHandler
  } = SearchManager();
  // Handle URL search parameter changes with scroll
  useEffect(() => {
    const urlParamHandler = createUrlParamHandler(
      null, // No additional callback needed
      () => delayedScrollToSection('filtered-items-section', 500, 'start')
    );
    
    // The SearchManager handles URL parameter synchronization internally
    // This effect just handles the scroll behavior when URL changes
    if (searchQuery && searchQuery.trim()) {
      urlParamHandler(searchQuery);
    }
  }, [searchQuery, delayedScrollToSection, createUrlParamHandler]);



  const getFilteredItems = () => {
    const trimmedQuery = getTrimmedQuery();
    
    // Apply search filter
    if (trimmedQuery) {
      return searchItems(trimmedQuery);
    }
    
    // Apply category filter
    if (selectedCategory) {
      return getItemsByCategory(selectedCategory);
    }
    
    // Return all items when no filters are applied
    return collectibleItems;
  };

  const handleProductClick = (item) => {
    // Add product click functionality here
    console.log('Product clicked:', item.title);
    // This could navigate to a product detail page or open a modal
  };





  const handlePopularSearchClick = (searchTerm) => {
    handlePopularTagClick(searchTerm, () => {
      scrollToFilteredItems();
    });
  };

  return (
    <div className="bg-stone-50 min-h-screen overflow-x-hidden">
      <Navbar />
      
      {/* Hero Section with Carousel */}
      <section className="relative pt-20 pb-8 sm:pb-12 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8 px-2">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-stone-800 mb-3 sm:mb-4">
              Discover Unique Collectibles
            </h1>
            <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto">
              Explore our curated collection of handcrafted treasures from talented artisans
            </p>
          </div>

          {/* Carousel Container */}
          <HeroCarousel 
            items={getRandomCarouselItems(3)}
            autoAdvanceInterval={4000}
            onItemClick={handleCarouselItemClick}
          />
        </div>
      </section>

      {/* Search Bar Section */}
      <section className="py-8 sm:py-12 bg-white border-b border-stone-200">
        <SearchBar
          {...getSearchBarProps({
            onSearch: () => {
              // Optional: Add search analytics or additional search logic here
              handleSearchSubmit(() => {
                if (searchQuery.trim()) {
                  scrollToFilteredItems();
                }
              });
            },
            placeholder: "Search collectibles...",
            popularTags: ['Vintage Coins', 'Comic Books', 'Antique Jewelry', 'Rare Stamps', 'Music Collectibles'],
            onPopularTagClick: handlePopularSearchClick,
            title: "Find Your Perfect Collectible",
            subtitle: "Search through thousands of unique items from talented artisans"
          })}
        />
      </section>

      {/* Categories Section */}
      <section className="py-8 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 px-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-stone-800 mb-3 sm:mb-4">
              Browse Categories
            </h2>
            <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto">
              Discover collectibles across diverse categories, each curated by passionate artisans and collectors
            </p>
          </div>

          {/* Categories Grid - Direct usage */}
          <div className="mb-8 sm:mb-12">
            <CategoryGrid
              categories={categories}
              selectedCategory={selectedCategory}
              onCategorySelect={(categoryName) => {
                handleCategorySelectWithScroll(categoryName, setSelectedCategory);
              }}
              visibleCount={4}
            />
          </div>

          {/* Category Dropdown - Direct usage */}
          <div className="max-w-2xl mx-auto">
            <CategoryDropdown
              onCategorySelect={(categoryName) => {
                handleCategorySelectWithScroll(categoryName, setSelectedCategory);
              }}
              placeholder="Choose a collectible category..."
            />
          </div>
        </div>
      </section>

      {/* Clear Filter Button */}
      {selectedCategory && (
        <section className="py-8 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <button
                onClick={() => setSelectedCategory(null)}
                className="inline-flex items-center px-6 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg transition-colors font-medium"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear Filter
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Filtered Items Display - Using Advanced FilteredItemsSection Component */}
      <FilteredItemsSection
        items={getFilteredItems()}
        searchQuery={getTrimmedQuery()}
        selectedCategory={selectedCategory}
        onProductClick={handleProductClick}
        isVisible={true}
        totalProductCount={collectibleItems.length}
        initialDisplayCount={12}
      />

      {/* Product sections using ProductSection component */}
      <ProductSection
        id="featured"
        title="Featured Collectibles"
        description="Handpicked rare finds from our curated collection of exceptional items"
        items={getFeaturedItems()}
        onProductClick={handleProductClick}
        backgroundColor="bg-white"
      />

      <ProductSection
        id="popular"
        title="Popular Items"
        description="Most loved pieces by our community of collectors and enthusiasts"
        items={getPopularItems()}
        onProductClick={handleProductClick}
        backgroundColor="bg-stone-50"
      />

      <ProductSection
        id="recent"
        title="Recent Items"
        description="Fresh arrivals from talented artisans and collectors worldwide"
        items={getRecentItems()}
        onProductClick={handleProductClick}
        backgroundColor="bg-white"
      />

      <Footer />
    </div>
  );
};

export default Collectibles;
