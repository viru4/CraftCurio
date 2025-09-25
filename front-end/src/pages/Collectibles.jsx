import React, { useState, useEffect } from 'react';
import { Navbar, Footer } from '@/components/layout';
import { HeroCarousel } from '@/components/carousel';
import { ProductCard, ProductSection } from '@/components/product';
import { SearchBar } from '@/components/search';
import { CategoryGrid, CategoryDropdown } from '@/components/category';
import { ScrollManager, SearchManager } from '@/components/managers';
import { carouselItems, categories, getItemsByCategory, getFeaturedItems, getPopularItems, getRecentItems, searchItems } from '@/data/Products';

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
    hasActiveSearch,
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
    if (trimmedQuery) {
      return searchItems(trimmedQuery);
    }
    if (!selectedCategory) return [];
    return getItemsByCategory(selectedCategory);
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
            items={carouselItems}
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

      {/* Filtered Items Display */}
      {(selectedCategory || hasActiveSearch()) && (
        <section id="filtered-items-section" className="py-16 bg-stone-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h3 className="text-2xl md:text-3xl font-bold text-stone-800 mb-4">
                {hasActiveSearch() 
                  ? `Search Results for "${getTrimmedQuery()}"` 
                  : `${selectedCategory} Collection`
                }
              </h3>
              <p className="text-stone-600">
                {hasActiveSearch()
                  ? `Found ${getFilteredItems().length} items matching your search`
                  : `Explore our curated selection of ${selectedCategory.toLowerCase()} items`
                }
              </p>
            </div>

            {/* Filtered Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {getFilteredItems().map((item) => (
                <ProductCard key={item.id} item={item} onClick={handleProductClick} />
              ))}
            </div>

            {getFilteredItems().length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 bg-stone-100 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8l-7 7-7-7" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-stone-800 mb-2">No Items Found</h4>
                <p className="text-stone-600">
                  {hasActiveSearch()
                    ? `No items match your search for "${getTrimmedQuery()}". Try a different search term.`
                    : `We're currently building our ${selectedCategory.toLowerCase()} collection. Check back soon!`
                  }
                </p>
              </div>
            )}
          </div>
        </section>
      )}

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
