import React from 'react';

/**
 * SearchBar - A reusable search component with popular search tags
 * 
 * @param {Object} props
 * @param {string} props.searchQuery - Current search query value
 * @param {Function} props.onSearchChange - Callback when search query changes, receives new value
 * @param {Function} props.onSearch - Optional callback when search button is clicked
 * @param {string} props.placeholder - Placeholder text for search input
 * @param {Array<string>} props.popularTags - Array of popular search terms to display as clickable tags
 * @param {Function} props.onPopularTagClick - Callback when a popular tag is clicked, receives tag value
 * @param {string} props.title - Title text above the search bar
 * @param {string} props.subtitle - Subtitle text above the search bar
 * @param {boolean} props.showPopularTags - Whether to show popular search tags (default: true)
 * @param {string} props.className - Additional CSS classes for the container
 * @param {string} props.size - Size variant: 'small', 'medium', 'large' (default: 'medium')
 * @param {boolean} props.rounded - Whether to use rounded corners (default: true)
 * 
 * @example
 * // Basic usage
 * <SearchBar
 *   searchQuery={searchQuery}
 *   onSearchChange={setSearchQuery}
 *   placeholder="Search products..."
 * />
 * 
 * // Full-featured search bar
 * <SearchBar
 *   searchQuery={searchQuery}
 *   onSearchChange={setSearchQuery}
 *   onSearch={() => performSearch()}
 *   placeholder="Search collectibles..."
 *   popularTags={['Electronics', 'Books', 'Clothing']}
 *   onPopularTagClick={(tag) => setSearchQuery(tag)}
 *   title="Find Your Product"
 *   subtitle="Search through thousands of items"
 *   size="large"
 *   rounded={true}
 * />
 * 
 * // Compact search bar
 * <SearchBar
 *   searchQuery={searchQuery}
 *   onSearchChange={setSearchQuery}
 *   placeholder="Quick search..."
 *   size="small"
 *   showPopularTags={false}
 *   rounded={false}
 * />
 */
const SearchBar = ({
  searchQuery = '',
  onSearchChange,
  onSearch,
  placeholder = 'Search...',
  popularTags = [],
  onPopularTagClick,
  title,
  subtitle,
  showPopularTags = true,
  className = '',
  size = 'medium',
  rounded = true
}) => {
  // Local state for input field to prevent auto-scrolling on every keystroke
  const [inputValue, setInputValue] = React.useState(searchQuery);

  // Sync local state when searchQuery prop changes (e.g., from URL or external updates)
  React.useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);
  
  // Size variants
  const sizeClasses = {
    small: {
      container: 'max-w-lg',
      input: 'py-2 px-2 text-sm',
      button: 'px-4 py-2 text-sm',
      icon: 'w-4 h-4',
      padding: 'pl-3 pr-2'
    },
    medium: {
      container: 'max-w-2xl',
      input: 'py-3 sm:py-4 px-2 text-base sm:text-lg',
      button: 'px-4 sm:px-8 py-2 sm:py-3 text-sm sm:text-base',
      icon: 'w-5 h-5 sm:w-6 sm:h-6',
      padding: 'pl-4 sm:pl-6 pr-2 sm:pr-4'
    },
    large: {
      container: 'max-w-4xl',
      input: 'py-4 sm:py-5 px-3 text-lg sm:text-xl',
      button: 'px-6 sm:px-10 py-3 sm:py-4 text-base sm:text-lg',
      icon: 'w-6 h-6 sm:w-7 sm:h-7',
      padding: 'pl-6 sm:pl-8 pr-3 sm:pr-5'
    }
  };

  const currentSize = sizeClasses[size] || sizeClasses.medium;

  const handleInputChange = (e) => {
    // Only update local state, don't trigger search or scroll
    setInputValue(e.target.value);
  };

  const handleSearchClick = () => {
    const trimmedValue = inputValue.trim();
    // Update parent search query only when search is submitted
    if (onSearchChange) {
      onSearchChange(trimmedValue);
    }
    if (onSearch) {
      onSearch(trimmedValue);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearchClick();
    }
  };

  const handlePopularTagClick = (tag) => {
    setInputValue(tag);
    if (onPopularTagClick) {
      onPopularTagClick(tag);
    }
  };

  const handleClear = () => {
    setInputValue('');
    if (onSearchChange) {
      onSearchChange('');
    }
    if (onSearch) {
      onSearch('');
    }
  };

  return (
    <div className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      {(title || subtitle) && (
        <div className="text-center mb-6 sm:mb-8 px-2">
          {title && (
            <h2 className="text-xl sm:text-2xl font-bold text-stone-800 mb-2">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-sm sm:text-base text-stone-600">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Search Input */}
      <div className={`relative ${currentSize.container} mx-auto`}>
        <div className={`relative flex items-center bg-white border-2 border-stone-300 ${rounded ? 'rounded-full' : 'rounded-lg'} shadow-lg hover:shadow-xl transition-shadow duration-300 focus-within:border-amber-500 focus-within:shadow-xl`}>
          <div className={`flex items-center justify-center ${currentSize.padding}`}>
            <svg className={`${currentSize.icon} text-stone-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              className={`w-full ${currentSize.input} text-stone-800 placeholder-stone-500 bg-transparent outline-none min-w-0 ${inputValue ? 'pr-8 sm:pr-10' : ''}`}
            />
            {/* Clear Button */}
            {inputValue && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 p-1 text-stone-400 hover:text-stone-600 transition-colors z-10"
                aria-label="Clear search"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          <button 
            type="button"
            onClick={handleSearchClick}
            className={`bg-amber-500 hover:bg-amber-600 text-white ${currentSize.button} ${rounded ? 'rounded-full' : 'rounded-lg'} m-1 font-semibold transition-colors duration-200 shadow-md hover:shadow-lg whitespace-nowrap flex-shrink-0`}
          >
            Search
          </button>
        </div>
      </div>

      {/* Popular Search Tags */}
      {showPopularTags && popularTags.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-6 px-2">
          <span className="px-3 sm:px-4 py-2 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 rounded-full text-xs sm:text-sm font-semibold border border-amber-200 shadow-sm">
            ✨ Popular searches:
          </span>
          {popularTags.map((tag, index) => (
            <button
              key={index}
              onClick={() => handlePopularTagClick(tag)}
              className="px-3 sm:px-4 py-2 bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-amber-700 rounded-full text-xs sm:text-sm font-medium transition-colors duration-200 border border-stone-200 hover:border-amber-300"
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;