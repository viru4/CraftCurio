import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import ArtisanSidebar from '../components/ArtisanSidebar';
import { Menu, Plus, Search, Filter, X } from 'lucide-react';
import { API_ENDPOINTS } from '@/utils/api';
import ProductsHeader from './components/ProductsHeader';
import ProductsFilters from './components/ProductsFilters';
import ProductsGrid from './components/ProductsGrid';
import ProductModal from './components/ProductModal';

const ArtisanProducts = () => {
  const { user, isArtisan, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState(''); // Local state for input field
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Wait for auth to finish loading
    if (authLoading) {
      return;
    }

    if (!user || !isArtisan) {
      navigate('/');
      return;
    }

    loadProducts();
    loadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isArtisan, navigate, authLoading]);

  useEffect(() => {
    filterProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, selectedCategory, selectedStatus, products]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_ENDPOINTS.artisanProducts}?artisan=${user._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to fetch products');

      const data = await response.json();
      setProducts(data.data || []);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await fetch(`${API_ENDPOINTS.categories}?type=artisan`);
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(product =>
        product.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product =>
        product.category?._id === selectedCategory || product.category === selectedCategory
      );
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(product => product.status === selectedStatus);
    }

    setFilteredProducts(filtered);
  };

  const handleSearchSubmit = () => {
    setSearchQuery(searchInput);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearchSubmit();
    }
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearchQuery('');
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_ENDPOINTS.artisanProducts}/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete product');

      setProducts(products.filter(p => p._id !== productId));
      alert('Product deleted successfully!');
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product. Please try again.');
    }
  };

  const handleSaveProduct = async (productData) => {
    try {
      const token = localStorage.getItem('token');
      const url = selectedProduct
        ? `${API_ENDPOINTS.artisanProducts}/${selectedProduct._id}`
        : API_ENDPOINTS.artisanProducts;
      
      const method = selectedProduct ? 'PATCH' : 'POST';

      // Prepare data with artisan info for new products
      const submitData = selectedProduct 
        ? productData // For updates, use data as-is
        : {
            ...productData,
            artisanInfo: {
              id: user._id,
              name: user.name,
              profilePhotoUrl: user.avatar || '',
              briefBio: user.bio || '',
              verified: true
            }
          };

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to save product');
      }

      const data = await response.json();
      const updatedProduct = data.product || data.data || data;
      
      if (selectedProduct) {
        setProducts(products.map(p => p._id === selectedProduct._id ? updatedProduct : p));
      } else {
        setProducts([updatedProduct, ...products]);
      }

      setShowModal(false);
      setSelectedProduct(null);
      alert(`Product ${selectedProduct ? 'updated' : 'created'} successfully!`);
    } catch (error) {
      console.error('Error saving product:', error);
      alert(`Failed to save product: ${error.message || 'Please try again.'}`);
    }
  };

  if (loading && products.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#ec6d13]"></div>
          <p className="mt-4 text-stone-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-stone-50">
      {/* Sidebar */}
      <ArtisanSidebar 
        user={user} 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Mobile Header */}
        <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-stone-200 px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
          >
            <Menu className="h-6 w-6 text-stone-700" />
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
          >
            <Filter className="h-6 w-6 text-stone-700" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 md:p-8 lg:p-12">
          <div className="mx-auto max-w-7xl">
            {/* Page Header */}
            <ProductsHeader 
              totalProducts={products.length}
              filteredProducts={filteredProducts.length}
            />

            {/* Search and Filters */}
            <div className="mb-6 space-y-4">
              {/* Search Bar */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-stone-400 z-10" />
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyPress={handleSearchKeyPress}
                    placeholder="Search products by name or description..."
                    className={`w-full pl-10 ${searchInput ? 'pr-10' : 'pr-4'} py-3 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ec6d13]/50 bg-white`}
                  />
                  {searchInput && (
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 text-stone-400 hover:text-stone-600 transition-colors z-10"
                      aria-label="Clear search"
                    >
                      <X className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleSearchSubmit}
                  className="px-4 sm:px-6 py-3 bg-[#ec6d13] text-white rounded-xl font-semibold hover:bg-[#ec6d13]/90 transition-colors flex items-center gap-2 flex-shrink-0"
                >
                  <Search className="h-5 w-5" />
                  <span className="hidden sm:inline">Search</span>
                </button>
              </div>

              {/* Filters */}
              <ProductsFilters
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                selectedStatus={selectedStatus}
                onStatusChange={setSelectedStatus}
                showFilters={showFilters}
              />
            </div>

            {/* Products Grid */}
            <ProductsGrid
              products={filteredProducts}
              loading={loading}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
            />
          </div>
        </div>
      </main>

      {/* Product Modal */}
      {showModal && (
        <ProductModal
          product={selectedProduct}
          categories={categories}
          onClose={() => setShowModal(false)}
          onSave={handleSaveProduct}
        />
      )}
    </div>
  );
};

export default ArtisanProducts;
