/**
 * Currency formatting utilities for CraftCurio
 */

/**
 * Format price with appropriate currency symbol
 * @param {number|string} price - The price value
 * @param {string} currency - Currency code (INR, USD, etc.)
 * @returns {string} Formatted price with currency symbol
 */
export const formatPrice = (price, currency = 'INR') => {
  if (typeof price === 'string') {
    // If price is already a formatted string (like "₹9,999"), return as is
    return price;
  }
  
  if (typeof price === 'number') {
    // Format numeric price with currency symbol
    const currencySymbols = {
      'INR': '₹',
      'USD': '$',
      'EUR': '€',
      'GBP': '£'
    };
    
    const symbol = currencySymbols[currency] || currency;
    
    // Format number with Indian number system (lakhs, crores)
    if (currency === 'INR') {
      return formatINRPrice(price);
    }
    
    // For other currencies, use standard formatting
    return `${symbol}${price.toLocaleString()}`;
  }
  
  return price.toString();
};

/**
 * Format price in Indian Rupees with proper lakh/crore notation
 * @param {number} price - The price value
 * @returns {string} Formatted price in INR
 */
export const formatINRPrice = (price) => {
  const symbol = '₹';
  
  if (price >= 10000000) { // 1 crore = 1,00,00,000
    const crores = Math.floor(price / 10000000);
    const lakhs = Math.floor((price % 10000000) / 100000);
    const thousands = Math.floor((price % 100000) / 1000);
    const hundreds = price % 1000;
    
    let result = `${symbol}${crores}`;
    if (lakhs > 0) {
      result += `,${lakhs.toString().padStart(2, '0')}`;
    }
    if (thousands > 0) {
      result += `,${thousands.toString().padStart(2, '0')}`;
    }
    if (hundreds > 0) {
      result += `,${hundreds.toString().padStart(3, '0')}`;
    }
    return result;
  } else if (price >= 100000) { // 1 lakh = 1,00,000
    const lakhs = Math.floor(price / 100000);
    const thousands = Math.floor((price % 100000) / 1000);
    const hundreds = price % 1000;
    
    let result = `${symbol}${lakhs}`;
    if (thousands > 0) {
      result += `,${thousands.toString().padStart(2, '0')}`;
    }
    if (hundreds > 0) {
      result += `,${hundreds.toString().padStart(3, '0')}`;
    }
    return result;
  } else {
    // For amounts less than 1 lakh, use standard formatting
    return `${symbol}${price.toLocaleString('en-IN')}`;
  }
};

/**
 * Get currency symbol for a given currency code
 * @param {string} currency - Currency code
 * @returns {string} Currency symbol
 */
export const getCurrencySymbol = (currency = 'INR') => {
  const currencySymbols = {
    'INR': '₹',
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'JPY': '¥',
    'CAD': 'C$',
    'AUD': 'A$'
  };
  
  return currencySymbols[currency] || currency;
};
