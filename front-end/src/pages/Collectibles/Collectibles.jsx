import React, { useState, useEffect } from 'react';
import { Navbar, Footer } from '@/components/layout';
import { HeroCarousel } from '@/components/carousel';
import { ProductSection } from '@/components/product';
import { SearchBar, FilteredItemsSection } from '@/components/search';
import { CategoryGrid, CategoryDropdown } from '@/components/category';
import { ScrollManager, SearchManager } from '@/components/managers';
import axios from 'axios';
import API_BASE_URL from '@/config/api';

const Collectibles = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [collectibleCategories, setCollectibleCategories] = useState([]);
  const [collectibleItems, setCollectibleItems] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [itemsLoading, setItemsLoading] = useState(true);
  
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

  // Fetch collectible categories from API
  useEffect(() => {
    const fetchCollectibleCategories = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/categories?type=collectible`);
        
        // Axios automatically parses JSON
        if (response.data && Array.isArray(response.data.data)) {
          setCollectibleCategories(response.data.data);
        } else {
          setCollectibleCategories([]);
        }
      } catch (err) {
        console.error('Failed to fetch collectible categories:', err);
        setCollectibleCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    };
  
    fetchCollectibleCategories();
  }, []);

  // Fetch collectible items from API (when implemented)
  useEffect(() => {
    const fetchCollectibleItems = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/collectibles');
  
        if (response.data && Array.isArray(response.data.data)) {
          setCollectibleItems(response.data.data);
        } else {
          setCollectibleItems([]);
        }
      } catch (err) {
        console.error('Failed to fetch collectible items:', err);
        setCollectibleItems([]);
      } finally {
        setItemsLoading(false);
      }
    };
  
    fetchCollectibleItems();
  }, []);

  // Handle URL parameters on page load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    
    if (categoryParam) {
      setSelectedCategory(categoryParam);
      // Scroll to filtered section after a short delay to allow content to load
      setTimeout(() => {
        delayedScrollToSection('filtered-items-section', 1000, 'start');
      }, 500);
    }
  }, [delayedScrollToSection]);

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



  // Updated filter functions to work with database data
  const getFilteredItems = () => {
    const trimmedQuery = getTrimmedQuery();
    
    // Apply search filter
    if (trimmedQuery) {
      return collectibleItems.filter(item => 
        item.title?.toLowerCase().includes(trimmedQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(trimmedQuery.toLowerCase()) ||
        item.category?.toLowerCase().includes(trimmedQuery.toLowerCase())
      );
    }
    
    // Apply category filter
    if (selectedCategory) {
      return collectibleItems.filter(item => item.category === selectedCategory);
    }
    
    // Return all items when no filters are applied
    return collectibleItems;
  };

  const getFeaturedItems = () => {
    return collectibleItems.filter(item => item.featured === true);
  };

  const getPopularItems = () => {
    return collectibleItems.filter(item => item.popular === true);
  };

  const getRecentItems = () => {
    return collectibleItems.filter(item => item.recent === true);
  };

  const getRandomCarouselItems = (count = 3) => {
    const shuffled = [...collectibleItems].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const handleProductClick = (item) => {
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
          {!itemsLoading && collectibleItems.length > 0 ? (
            <HeroCarousel 
              items={getRandomCarouselItems(3)}
              autoAdvanceInterval={4000}
              onItemClick={handleCarouselItemClick}
            />
          ) : (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto"></div>
                <span className="ml-3 text-stone-600">Loading collectibles...</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Search Bar Section */}
      <section className="py-8 sm:py-12 bg-white border-b border-stone-200">
        <SearchBar
          {...getSearchBarProps({
            onSearch: () => {
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
              Discover collectibles across {collectibleCategories.length} diverse categories, each curated by passionate artisans and collectors
            </p>
          </div>

          {categoriesLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
              <span className="ml-3 text-stone-600">Loading categories...</span>
            </div>
          ) : (
            <>
              {/* Categories Grid - Using API data */}
              <div className="mb-8 sm:mb-12">
                <CategoryGrid
                  categories={collectibleCategories}
                  selectedCategory={selectedCategory}
                  onCategorySelect={(categoryName) => {
                    handleCategorySelectWithScroll(categoryName, setSelectedCategory);
                  }}
                  visibleCount={8}
                />
              </div>

              {/* Category Dropdown - Using API data */}
              <div className="max-w-2xl mx-auto">
                <CategoryDropdown
                  categories={collectibleCategories}
                  onCategorySelect={(categoryName) => {
                    handleCategorySelectWithScroll(categoryName, setSelectedCategory);
                  }}
                  placeholder="Choose a collectible category..."
                />
              </div>
            </>
          )}
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
      <FilteredItemsSection
        items={getFilteredItems()}
        searchQuery={getTrimmedQuery()}
        selectedCategory={selectedCategory}
        onProductClick={handleProductClick}
        isVisible={true}
        totalProductCount={collectibleItems.length}
        initialDisplayCount={12}
        productType="collectible"
      />

      {/* Product sections using database data */}
      <ProductSection
        id="featured"
        title="Featured Collectibles"
        description="Handpicked rare finds from our curated collection of exceptional items"
        items={getFeaturedItems()}
        onProductClick={handleProductClick}
        backgroundColor="bg-white"
        productType="collectible"
      />

      <ProductSection
        id="popular"
        title="Popular Items"
        description="Most loved pieces by our community of collectors and enthusiasts"
        items={getPopularItems()}
        onProductClick={handleProductClick}
        backgroundColor="bg-stone-50"
        productType="collectible"
      />

      <ProductSection
        id="recent"
        title="Recent Items"
        description="Fresh arrivals from talented artisans and collectors worldwide"
        items={getRecentItems()}
        onProductClick={handleProductClick}
        backgroundColor="bg-white"
        productType="collectible"
      />

      <Footer />
    </div>
  );
};

export default Collectibles;
