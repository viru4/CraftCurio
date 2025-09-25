import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroCarousel from '@/components/HeroCarousel';
import ProductCard from '@/components/ProductCard';
import SearchBar from '@/components/SearchBar';
import CategoryGrid from '@/components/CategoryGrid';
import CategoryDropdown from '@/components/CategoryDropdown';
import { carouselItems, categories, getItemsByCategory, getFeaturedItems, getPopularItems, getRecentItems, searchItems } from '@/data/Products';

const Collectibles = () => {
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [showAllFeatured, setShowAllFeatured] = useState(false);
  const [showAllPopular, setShowAllPopular] = useState(false);
  const [showAllRecent, setShowAllRecent] = useState(false);
  // Handle URL search parameters
  useEffect(() => {
    const searchParam = searchParams.get('search');
    if (searchParam && searchParam !== searchQuery) {
      setSearchQuery(searchParam);
      // Scroll to search results if there's a search query
      setTimeout(() => {
        const element = document.getElementById('filtered-items-section');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 500);
    }
  }, [searchParams, searchQuery]);



  const getFilteredItems = () => {
    if (searchQuery.trim()) {
      return searchItems(searchQuery);
    }
    if (!selectedCategory) return [];
    return getItemsByCategory(selectedCategory);
  };

  const handleProductClick = (item) => {
    // Add product click functionality here
    console.log('Product clicked:', item.title);
    // This could navigate to a product detail page or open a modal
  };

  const handleShowAllToggle = (section, currentState, setter) => {
    setter(!currentState);
    // If expanding, scroll to show the expanded content
    if (!currentState) {
      setTimeout(() => {
        const element = document.getElementById(`${section}-section`);
        if (element) {
          const elementRect = element.getBoundingClientRect();
          const offset = window.pageYOffset + elementRect.bottom - window.innerHeight + 100;
          window.scrollTo({ 
            top: Math.max(0, offset), 
            behavior: 'smooth' 
          });
        }
      }, 200);
    }
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCarouselItemClick = (item) => {
    scrollToSection(item.targetSection);
  };

  const handlePopularSearchClick = (searchTerm) => {
    setSearchQuery(searchTerm);
    // Scroll to search results
    setTimeout(() => {
      const element = document.getElementById('filtered-items-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
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
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSearch={() => {
            // Optional: Add search analytics or additional search logic here
            if (searchQuery.trim()) {
              const element = document.getElementById('filtered-items-section');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }
          }}
          placeholder="Search collectibles..."
          popularTags={['Vintage Coins', 'Comic Books', 'Antique Jewelry', 'Rare Stamps', 'Music Collectibles']}
          onPopularTagClick={handlePopularSearchClick}
          title="Find Your Perfect Collectible"
          subtitle="Search through thousands of unique items from talented artisans"
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
                setSelectedCategory(categoryName);
                // Scroll to filtered items section with a slight delay to allow state update
                if (categoryName) {
                  setTimeout(() => {
                    const element = document.getElementById('filtered-items-section');
                    if (element) {
                      element.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                      });
                    }
                  }, 100);
                }
              }}
              visibleCount={4}
            />
          </div>

          {/* Category Dropdown - Direct usage */}
          <div className="max-w-2xl mx-auto">
            <CategoryDropdown
              onCategorySelect={(categoryName) => {
                setSelectedCategory(categoryName);
                if (categoryName) {
                  setTimeout(() => {
                    const element = document.getElementById('filtered-items-section');
                    if (element) {
                      element.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                      });
                    }
                  }, 100);
                }
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
      {(selectedCategory || searchQuery.trim()) && (
        <section id="filtered-items-section" className="py-16 bg-stone-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h3 className="text-2xl md:text-3xl font-bold text-stone-800 mb-4">
                {searchQuery.trim() 
                  ? `Search Results for "${searchQuery}"` 
                  : `${selectedCategory} Collection`
                }
              </h3>
              <p className="text-stone-600">
                {searchQuery.trim()
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
                  {searchQuery.trim()
                    ? `No items match your search for "${searchQuery}". Try a different search term.`
                    : `We're currently building our ${selectedCategory.toLowerCase()} collection. Check back soon!`
                  }
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Placeholder sections for smooth scrolling targets */}
      <section id="featured-section" className="py-8 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-800 mb-3 sm:mb-4">Featured Collectibles</h2>
            <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto">
              Handpicked rare finds from our curated collection of exceptional items
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-8">
            {(showAllFeatured ? getFeaturedItems() : getFeaturedItems().slice(0, 8)).map((item) => (
              <ProductCard key={item.id} item={item} onClick={handleProductClick} />
            ))}
          </div>
          {getFeaturedItems().length > 8 && (
            <div className="text-center">
              <button 
                onClick={() => handleShowAllToggle('featured', showAllFeatured, setShowAllFeatured)}
                className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-full font-semibold transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                {showAllFeatured 
                  ? `Show Less Featured Items` 
                  : `View All Featured Items (${getFeaturedItems().length})`
                }
              </button>
            </div>
          )}
        </div>
      </section>

      <section id="popular-section" className="py-8 sm:py-16 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-800 mb-3 sm:mb-4">Popular Items</h2>
            <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto">
              Most loved pieces by our community of collectors and enthusiasts
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-8">
            {(showAllPopular ? getPopularItems() : getPopularItems().slice(0, 8)).map((item) => (
              <ProductCard key={item.id} item={item} onClick={handleProductClick} />
            ))}
          </div>
          {getPopularItems().length > 8 && (
            <div className="text-center">
              <button 
                onClick={() => handleShowAllToggle('popular', showAllPopular, setShowAllPopular)}
                className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-full font-semibold transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                {showAllPopular 
                  ? `Show Less Popular Items` 
                  : `View All Popular Items (${getPopularItems().length})`
                }
              </button>
            </div>
          )}
        </div>
      </section>

      <section id="recent-section" className="py-8 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-800 mb-3 sm:mb-4">Recent Items</h2>
            <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto">
              Fresh arrivals from talented artisans and collectors worldwide
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-8">
            {(showAllRecent ? getRecentItems() : getRecentItems().slice(0, 8)).map((item) => (
              <ProductCard key={item.id} item={item} onClick={handleProductClick} />
            ))}
          </div>
          {getRecentItems().length > 8 && (
            <div className="text-center">
              <button 
                onClick={() => handleShowAllToggle('recent', showAllRecent, setShowAllRecent)}
                className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-full font-semibold transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                {showAllRecent 
                  ? `Show Less Recent Items` 
                  : `View All Recent Items (${getRecentItems().length})`
                }
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Collectibles;
