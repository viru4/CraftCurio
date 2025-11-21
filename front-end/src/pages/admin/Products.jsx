import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from './components/AdminSidebar';
import MobileSidebar from './components/MobileSidebar';
import AdminHeader from './components/AdminHeader';
import ProductsTable from './components/ProductsTable';
import { Search, RefreshCw, Plus, ChevronDown } from 'lucide-react';
import { API_ENDPOINTS } from '../../config/api';

const Products = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('artisan'); // 'artisan' or 'collectible'
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [categories, setCategories] = useState([]);
  const categoryDropdownRef = useRef(null);
  const statusDropdownRef = useRef(null);

  // Status options
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setShowCategoryDropdown(false);
      }
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target)) {
        setShowStatusDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const endpoint = activeTab === 'artisan' 
        ? API_ENDPOINTS.artisanProducts
        : API_ENDPOINTS.collectibles;
      
      const params = new URLSearchParams({
        page: currentPage,
        limit: itemsPerPage,
        ...(searchQuery && { search: searchQuery }),
        ...(selectedCategory !== 'all' && { category: selectedCategory }),
        ...(selectedStatus !== 'all' && { status: selectedStatus })
      });

      const response = await fetch(`${endpoint}?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();
      
      // Handle different response structures
      if (Array.isArray(data)) {
        setProducts(data);
        setTotalItems(data.length);
        setTotalPages(Math.ceil(data.length / itemsPerPage));
      } else if (data.data) {
        setProducts(data.data);
        setTotalItems(data.total || data.data.length);
        setTotalPages(Math.ceil((data.total || data.data.length) / itemsPerPage));
      } else {
        setProducts([]);
        setTotalItems(0);
        setTotalPages(1);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const type = activeTab === 'artisan' ? 'artisan' : 'collectible';
      const response = await fetch(`${API_ENDPOINTS.categories}?type=${type}`);
      if (response.ok) {
        const data = await response.json();
        const categoryList = Array.isArray(data.data) ? data.data : [];
        setCategories(categoryList);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  // Fetch categories when tab changes
  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  // Fetch products based on active tab
  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, currentPage, searchQuery, selectedCategory, selectedStatus]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedStatus('all');
    setCurrentPage(1);
    setShowCategoryDropdown(false);
    setShowStatusDropdown(false);
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
    setShowCategoryDropdown(false);
  };

  const handleStatusSelect = (status) => {
    setSelectedStatus(status);
    setCurrentPage(1);
    setShowStatusDropdown(false);
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const baseEndpoint = activeTab === 'artisan'
        ? API_ENDPOINTS.artisanProducts
        : API_ENDPOINTS.collectibles;
      
      const endpoint = `${baseEndpoint}/${productId}`;

      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      alert('Product deleted successfully!');
      // Refresh the list
      fetchProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('Failed to delete product: ' + err.message);
    }
  };

  const handleStatusChange = async (productId, newStatus) => {
    try {
      const baseEndpoint = activeTab === 'artisan'
        ? API_ENDPOINTS.artisanProducts
        : API_ENDPOINTS.collectibles;
      
      const endpoint = `${baseEndpoint}/${productId}`;

      const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error('Failed to update product status');
      }

      alert(`Product status updated to ${newStatus}!`);
      // Refresh the list
      fetchProducts();
    } catch (err) {
      console.error('Error updating product status:', err);
      alert('Failed to update product status: ' + err.message);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden">
      <div className="flex flex-row min-h-screen overflow-hidden">
        {/* Desktop Sidebar */}
        <AdminSidebar />
        
        {/* Mobile Sidebar */}
        <MobileSidebar />

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Header */}
          <AdminHeader />

          {/* Products Management Content */}
          <div className="flex-1 p-2 sm:p-4 md:p-8 overflow-hidden">
            <div className="w-full h-full flex flex-col min-w-0">
              {/* Page Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 sm:mb-6 flex-shrink-0">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-black leading-tight tracking-[-0.03em]">
                  Product & Collectible Management
                </h1>
                <div className="flex gap-2 flex-wrap w-full sm:w-auto flex-shrink-0">
                  <button 
                    onClick={() => navigate('/admin/categories')}
                    className="flex items-center justify-center rounded-md h-9 sm:h-10 px-3 sm:px-4 bg-[#f3ece7] dark:bg-[#3a2a1d] hover:bg-[#ec6d13]/20 dark:hover:bg-[#ec6d13]/30 text-xs sm:text-sm font-bold transition-colors flex-1 sm:flex-initial whitespace-nowrap"
                  >
                    <span className="truncate">Categories</span>
                  </button>
                  <button 
                    onClick={() => navigate('/admin/products/new')}
                    className="flex items-center justify-center rounded-md h-9 sm:h-10 px-3 sm:px-4 bg-[#ec6d13] text-white hover:bg-[#ec6d13]/90 text-xs sm:text-sm font-bold transition-colors flex-1 sm:flex-initial whitespace-nowrap"
                  >
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                    <span className="truncate">Add New</span>
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="mb-3 sm:mb-4 overflow-x-auto -mx-2 px-2 sm:-mx-4 sm:px-4 md:mx-0 md:px-0 flex-shrink-0">
                <div className="border-b border-[#f3ece7] dark:border-[#3a2a1d]">
                  <nav className="-mb-px flex space-x-3 sm:space-x-4 md:space-x-6 min-w-max">
                    <button
                      onClick={() => {
                        setActiveTab('artisan');
                        setCurrentPage(1);
                        setSelectedCategory('all');
                      }}
                      className={`shrink-0 px-1 py-3 sm:py-4 border-b-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                        activeTab === 'artisan'
                          ? 'border-[#ec6d13] text-[#ec6d13] font-bold'
                          : 'border-transparent text-[#9a6c4c] dark:text-[#a18a7a] hover:text-[#1b130d] dark:hover:text-[#fcfaf8]'
                      }`}
                    >
                      Artisan Products
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('collectible');
                        setCurrentPage(1);
                        setSelectedCategory('all');
                      }}
                      className={`shrink-0 px-1 py-3 sm:py-4 border-b-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                        activeTab === 'collectible'
                          ? 'border-[#ec6d13] text-[#ec6d13] font-bold'
                          : 'border-transparent text-[#9a6c4c] dark:text-[#a18a7a] hover:text-[#1b130d] dark:hover:text-[#fcfaf8]'
                      }`}
                    >
                      Collectibles
                    </button>
                  </nav>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-col gap-3 sm:gap-4 mb-3 sm:mb-4 flex-shrink-0">
                {/* Search */}
                <div className="w-full">
                  <div className="flex items-stretch rounded-md h-10 sm:h-12 bg-[#f3ece7] dark:bg-[#3a2a1d]">
                    <div className="flex items-center justify-center pl-4">
                      <Search className="w-5 h-5 text-[#9a6c4c] dark:text-[#a18a7a]" />
                    </div>
                    <input
                      type="text"
                      className="flex-1 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-[#ec6d13]/50 rounded-r-md px-3 sm:px-4 text-sm sm:text-base placeholder:text-[#9a6c4c] dark:placeholder:text-[#a18a7a]"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={handleSearch}
                    />
                  </div>
                </div>

                {/* Filter Buttons */}
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Category Dropdown */}
                  <div className="relative flex-1 sm:flex-initial min-w-[140px]" ref={categoryDropdownRef}>
                    <button 
                      onClick={() => {
                        setShowCategoryDropdown(!showCategoryDropdown);
                        setShowStatusDropdown(false);
                      }}
                      className="w-full flex h-10 sm:h-12 items-center justify-center gap-x-1 sm:gap-x-2 rounded-md bg-[#f3ece7] dark:bg-[#3a2a1d] px-2 sm:px-4 hover:bg-[#ec6d13]/10 transition-colors"
                    >
                      <p className="text-xs sm:text-sm font-medium truncate">
                        {selectedCategory === 'all' 
                          ? 'Category' 
                          : categories.find(c => c._id === selectedCategory)?.name || 'Category'}
                      </p>
                      <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-[#9a6c4c] dark:text-[#a18a7a] flex-shrink-0" />
                    </button>
                    
                    {showCategoryDropdown && (
                      <div className="absolute top-full mt-2 left-0 right-0 sm:right-auto sm:w-56 rounded-md shadow-lg bg-white dark:bg-[#2a1e14] border border-[#e7d9cf] dark:border-[#3f2e1e] z-50">
                        <div className="py-1 max-h-64 overflow-y-auto">
                          <button
                            onClick={() => handleCategorySelect('all')}
                            className={`block w-full text-left px-4 py-2 text-sm hover:bg-[#f3ece7] dark:hover:bg-[#3a2a1d] ${
                              selectedCategory === 'all' ? 'bg-[#ec6d13]/10 text-[#ec6d13] font-medium' : ''
                            }`}
                          >
                            All Categories
                          </button>
                          {categories.map((category) => (
                            <button
                              key={category._id}
                              onClick={() => handleCategorySelect(category._id)}
                              className={`block w-full text-left px-4 py-2 text-sm hover:bg-[#f3ece7] dark:hover:bg-[#3a2a1d] ${
                                selectedCategory === category._id ? 'bg-[#ec6d13]/10 text-[#ec6d13] font-medium' : ''
                              }`}
                            >
                              {category.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Status Dropdown */}
                  <div className="relative flex-1 sm:flex-initial min-w-[140px]" ref={statusDropdownRef}>
                    <button 
                      onClick={() => {
                        setShowStatusDropdown(!showStatusDropdown);
                        setShowCategoryDropdown(false);
                      }}
                      className="w-full flex h-10 sm:h-12 items-center justify-center gap-x-1 sm:gap-x-2 rounded-md bg-[#f3ece7] dark:bg-[#3a2a1d] px-2 sm:px-4 hover:bg-[#ec6d13]/10 transition-colors"
                    >
                      <p className="text-xs sm:text-sm font-medium truncate">
                        {statusOptions.find(s => s.value === selectedStatus)?.label || 'Status'}
                      </p>
                      <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-[#9a6c4c] dark:text-[#a18a7a] flex-shrink-0" />
                    </button>
                    
                    {showStatusDropdown && (
                      <div className="absolute top-full mt-2 left-0 right-0 sm:right-auto sm:w-48 rounded-md shadow-lg bg-white dark:bg-[#2a1e14] border border-[#e7d9cf] dark:border-[#3f2e1e] z-50">
                        <div className="py-1">
                          {statusOptions.map((option) => (
                            <button
                              key={option.value}
                              onClick={() => handleStatusSelect(option.value)}
                              className={`block w-full text-left px-4 py-2 text-sm hover:bg-[#f3ece7] dark:hover:bg-[#3a2a1d] ${
                                selectedStatus === option.value ? 'bg-[#ec6d13]/10 text-[#ec6d13] font-medium' : ''
                              }`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Reset Button */}
                  <button 
                    onClick={handleReset}
                    className="flex h-10 sm:h-12 items-center justify-center gap-x-1 sm:gap-x-2 rounded-md px-2 sm:px-4 text-[#9a6c4c] dark:text-[#a18a7a] hover:text-[#ec6d13] transition-colors flex-shrink-0"
                  >
                    <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
                    <p className="text-xs sm:text-sm font-medium whitespace-nowrap">Reset</p>
                  </button>
                </div>
              </div>

              {/* Products Table */}
              {error && (
                <div className="bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-4 flex-shrink-0">
                  {error}
                </div>
              )}

              <div className="flex-1 min-h-0 overflow-auto">
                <ProductsTable
                  products={products}
                  loading={loading}
                  activeTab={activeTab}
                  onDelete={handleDeleteProduct}
                  onStatusChange={handleStatusChange}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalItems}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setCurrentPage}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Products;
