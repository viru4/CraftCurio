// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// API Endpoints
export const API_ENDPOINTS = {
  categories: `${API_BASE_URL}/api/categories`,
  collectibles: `${API_BASE_URL}/api/collectibles`,
  artisanProducts: `${API_BASE_URL}/api/artisan-products`,
  artisans: `${API_BASE_URL}/api/artisans`,
  collectors: `${API_BASE_URL}/api/collectors`,
  auth: `${API_BASE_URL}/api/auth`,
};

export default API_BASE_URL;
