/**
 * Performance Utilities
 * Helper functions for optimizing React performance
 */

/**
 * Debounce function - delays execution until after wait time has elapsed
 * @param {Function} func - Function to debounce
 * @param {Number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function - limits execution to once per wait period
 * @param {Function} func - Function to throttle
 * @param {Number} wait - Wait time in milliseconds
 * @returns {Function} Throttled function
 */
export const throttle = (func, wait = 300) => {
  let inThrottle;
  
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, wait);
    }
  };
};

/**
 * Lazy load images with Intersection Observer
 * @param {HTMLElement} imageElement - Image element to lazy load
 * @param {String} src - Image source URL
 */
export const lazyLoadImage = (imageElement, src) => {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const image = entry.target;
          image.src = src;
          image.classList.add('loaded');
          imageObserver.unobserve(image);
        }
      });
    });
    
    imageObserver.observe(imageElement);
  } else {
    // Fallback for browsers without Intersection Observer
    imageElement.src = src;
  }
};

/**
 * Check if element is in viewport
 * @param {HTMLElement} element - Element to check
 * @returns {Boolean} Whether element is in viewport
 */
export const isInViewport = (element) => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

/**
 * Preload images for better performance
 * @param {Array<String>} imageUrls - Array of image URLs to preload
 */
export const preloadImages = (imageUrls) => {
  imageUrls.forEach((url) => {
    const img = new Image();
    img.src = url;
  });
};

/**
 * Get optimized image URL with transformations
 * @param {String} url - Original image URL
 * @returns {String} Optimized image URL
 * @description Future enhancement: add CDN transformation options (width, height, quality, format)
 */
export const getOptimizedImageUrl = (url) => {
  // If using a CDN with image optimization, add query parameters
  if (!url) return '';
  
  // For local development or if no optimization service
  // In the future, this could accept options and build a CDN URL with transformations
  // Example: `${url}?w=${width}&h=${height}&q=${quality}&f=${format}`
  return url;
};

/**
 * Check if WebP is supported
 * @returns {Promise<Boolean>} Whether WebP is supported
 */
export const supportsWebP = () => {
  return new Promise((resolve) => {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
};

/**
 * Request idle callback wrapper with fallback
 * @param {Function} callback - Function to execute during idle time
 * @param {Object} options - Options for requestIdleCallback
 */
export const scheduleIdleTask = (callback, options) => {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(callback, options);
  } else {
    setTimeout(callback, 1);
  }
};

/**
 * Cancel scheduled idle task
 * @param {Number} handle - Handle returned by scheduleIdleTask
 */
export const cancelIdleTask = (handle) => {
  if ('cancelIdleCallback' in window) {
    window.cancelIdleCallback(handle);
  } else {
    clearTimeout(handle);
  }
};

/**
 * Measure component render time (development only)
 * @param {String} componentName - Name of component
 * @param {Function} callback - Function to measure
 */
export const measurePerformance = (componentName, callback) => {
  if (import.meta.env.DEV) {
    const startTime = performance.now();
    const result = callback();
    const endTime = performance.now();
    console.log(`[Performance] ${componentName} rendered in ${(endTime - startTime).toFixed(2)}ms`);
    return result;
  }
  return callback();
};

/**
 * Chunk large arrays for better performance
 * @param {Array} array - Array to chunk
 * @param {Number} size - Chunk size
 * @returns {Array<Array>} Chunked arrays
 */
export const chunkArray = (array, size) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

/**
 * Virtual scroll helper - calculate visible items
 * @param {Number} scrollTop - Current scroll position
 * @param {Number} itemHeight - Height of each item
 * @param {Number} containerHeight - Height of container
 * @param {Number} totalItems - Total number of items
 * @param {Number} overscan - Number of items to render outside viewport
 * @returns {Object} Start index, end index, and offset
 */
export const getVisibleRange = (
  scrollTop,
  itemHeight,
  containerHeight,
  totalItems,
  overscan = 3
) => {
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    totalItems - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );
  const offsetY = startIndex * itemHeight;
  
  return { startIndex, endIndex, offsetY };
};

export default {
  debounce,
  throttle,
  lazyLoadImage,
  isInViewport,
  preloadImages,
  getOptimizedImageUrl,
  supportsWebP,
  scheduleIdleTask,
  cancelIdleTask,
  measurePerformance,
  chunkArray,
  getVisibleRange,
};
