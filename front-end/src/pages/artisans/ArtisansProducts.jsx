import React, { useState, useEffect } from 'react';
import { Navbar, Footer } from '@/components/layout';
import { HeroCarousel } from '@/components/carousel';
import { ProductSection } from '@/components/product';
import { SearchBar, FilteredItemsSection } from '@/components/search';
import { CategoryGrid, CategoryDropdown } from '@/components/category';
import { ScrollManager, SearchManager } from '@/components/managers';
import { API_BASE_URL } from '@/utils/api';

const ArtisansProducts = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [artisanCategories, setArtisanCategories] = useState([]);
  const [artisanProducts, setArtisanProducts] = useState([]);
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

  // Fetch artisan categories from API
  useEffect(() => {
    const fetchArtisanCategories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/categories?type=artisan`);
        const data = await response.json();
        
        if (data.data && Array.isArray(data.data)) {
          setArtisanCategories(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch artisan categories:', err);
        setArtisanCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchArtisanCategories();
  }, []);

  // Fetch artisan products from API
  useEffect(() => {
    const fetchArtisanProducts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/artisan-products`);
        const data = await response.json();
        
        if (data.data && Array.isArray(data.data)) {
          setArtisanProducts(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch artisan products:', err);
        setArtisanProducts([]);
      } finally {
        setItemsLoading(false);
      }
    };

    fetchArtisanProducts();
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
      return artisanProducts.filter(item => 
        item.title?.toLowerCase().includes(trimmedQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(trimmedQuery.toLowerCase()) ||
        item.category?.toLowerCase().includes(trimmedQuery.toLowerCase())
      );
    }
    
    // Apply category filter
    if (selectedCategory) {
      return artisanProducts.filter(item => item.category === selectedCategory);
    }
    
    // Return all items when no filters are applied
    return artisanProducts;
  };

  const getFeaturedItems = () => {
    return artisanProducts.filter(item => item.featured === true);
  };

  const getPopularItems = () => {
    return artisanProducts.filter(item => item.popular === true);
  };

  const getRecentItems = () => {
    return artisanProducts.filter(item => item.recent === true);
  };

  const getRandomCarouselItems = (count = 3) => {
    const shuffled = [...artisanProducts].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
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
              Discover Handcrafted Artisan Products
            </h1>
            <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto">
              Explore unique handcrafted treasures created by talented artisans from around the world
            </p>
          </div>

          {/* Carousel Container */}
          {!itemsLoading && artisanProducts.length > 0 ? (
            <HeroCarousel 
              items={getRandomCarouselItems(3)}
              autoAdvanceInterval={4000}
              onItemClick={handleCarouselItemClick}
            />
          ) : (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto"></div>
                <span className="ml-3 text-stone-600">Loading artisan products...</span>
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
            placeholder: "Search artisan products...",
            popularTags: ['Pottery', 'Jewelry', 'Woodworking', 'Textiles', 'Ceramics'],
            onPopularTagClick: handlePopularSearchClick,
            title: "Find Your Perfect Handcrafted Item",
            subtitle: "Search through thousands of unique artisan products from skilled craftspeople"
          })}
        />
      </section>

      {/* Categories Section */}
      <section className="py-8 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 px-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-stone-800 mb-3 sm:mb-4">
              Browse Artisan Categories
            </h2>
            <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto">
              Discover handcrafted products across {artisanCategories.length} diverse categories, each showcasing unique craftsmanship and techniques
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
                  categories={artisanCategories}
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
                  categories={artisanCategories}
                  onCategorySelect={(categoryName) => {
                    handleCategorySelectWithScroll(categoryName, setSelectedCategory);
                  }}
                  placeholder="Choose an artisan category..."
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
        isVisible={true}
        totalProductCount={artisanProducts.length}
        initialDisplayCount={12}
        productType="artisan-product"
      />

      {/* Product sections using database data */}
      <ProductSection
        id="featured"
        title="Featured Artisan Products"
        description="Handpicked exceptional handcrafted items from our most talented artisans"
        items={getFeaturedItems()}
        backgroundColor="bg-white"
        productType="artisan-product"
      />

      <ProductSection
        id="popular"
        title="Popular Artisan Items"
        description="Most loved handcrafted pieces by our community of art enthusiasts"
        items={getPopularItems()}
        backgroundColor="bg-stone-50"
        productType="artisan-product"
      />

      <ProductSection
        id="recent"
        title="Recent Artisan Creations"
        description="Fresh handcrafted arrivals from talented artisans worldwide"
        items={getRecentItems()}
        backgroundColor="bg-white"
        productType="artisan-product"
      />

      <Footer />
    </div>
  );
};

export default ArtisansProducts;