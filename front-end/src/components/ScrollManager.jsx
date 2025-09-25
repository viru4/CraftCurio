import { useCallback } from 'react';

const ScrollManager = () => {
  // Smooth scroll to any section by ID
  const scrollToSection = useCallback((sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // Scroll to section with custom block positioning
  const scrollToSectionWithBlock = useCallback((sectionId, block = 'start') => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: block 
      });
    }
  }, []);

  // Delayed scroll - useful after state updates
  const delayedScrollToSection = useCallback((sectionId, delay = 100, block = 'start') => {
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth',
          block: block
        });
      }
    }, delay);
  }, []);

  // Smart scroll for expanding content - calculates optimal position
  const scrollToExpandedContent = useCallback((sectionId, delay = 200) => {
    setTimeout(() => {
      const element = document.getElementById(`${sectionId}-section`);
      if (element) {
        const elementRect = element.getBoundingClientRect();
        const offset = window.pageYOffset + elementRect.bottom - window.innerHeight + 100;
        window.scrollTo({ 
          top: Math.max(0, offset), 
          behavior: 'smooth' 
        });
      }
    }, delay);
  }, []);

  // Scroll to filtered items section - commonly used pattern
  const scrollToFilteredItems = useCallback((delay = 100) => {
    delayedScrollToSection('filtered-items-section', delay, 'start');
  }, [delayedScrollToSection]);

  // Handle carousel item clicks with section targeting
  const handleCarouselItemClick = useCallback((item) => {
    if (item.targetSection) {
      scrollToSection(item.targetSection);
    }
  }, [scrollToSection]);

  // Handle category selection with scroll to filtered items
  const handleCategorySelectWithScroll = useCallback((categoryName, onCategorySelect) => {
    onCategorySelect(categoryName);
    if (categoryName) {
      scrollToFilteredItems();
    }
  }, [scrollToFilteredItems]);

  // Handle search with scroll to results
  const handleSearchWithScroll = useCallback((searchQuery, onSearchUpdate) => {
    if (onSearchUpdate) {
      onSearchUpdate(searchQuery);
    }
    if (searchQuery && searchQuery.trim()) {
      scrollToFilteredItems();
    }
  }, [scrollToFilteredItems]);

  return {
    scrollToSection,
    scrollToSectionWithBlock,
    delayedScrollToSection,
    scrollToExpandedContent,
    scrollToFilteredItems,
    handleCarouselItemClick,
    handleCategorySelectWithScroll,
    handleSearchWithScroll
  };
};

export default ScrollManager;