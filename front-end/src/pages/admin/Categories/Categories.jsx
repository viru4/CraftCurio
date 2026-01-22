import React, { useState, useEffect, useCallback } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import MobileSidebar from '../components/MobileSidebar';
import AdminHeader from '../components/AdminHeader';
import { Plus, Search } from 'lucide-react';
import api from '@/utils/api';
import CategoryTable from './components/CategoryTable';
import CategoryModal from './components/CategoryModal';
import StatsCards from './components/StatsCards';

const Categories = () => {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({
    collectible: { pending: 0, approved: 0, rejected: 0, total: 0 },
    artisan: { pending: 0, approved: 0, rejected: 0, total: 0 }
  });

  // Filters
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Pagination
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0
  });

  // Reset pagination when filters change
  useEffect(() => {
    setPagination(prev => ({ ...prev, page: 1 }));
  }, [selectedType, selectedStatus, searchQuery]);

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create', 'edit', 'view'
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...(selectedType !== 'all' && { type: selectedType }),
        ...(selectedStatus !== 'all' && { status: selectedStatus }),
        ...(searchQuery && { search: searchQuery })
      };

      const response = await api.get('/categories/admin/all', { params });
      
      if (response.data && response.data.data) {
        setCategories(response.data.data.categories || []);
        setPagination(prev => ({
          ...prev,
          total: response.data.data.pagination?.total || 0
        }));
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error fetching categories:', error);
      }
      alert('Failed to load categories. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, selectedType, selectedStatus, searchQuery]);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      const response = await api.get('/categories/admin/stats');
      
      if (response.data && response.data.data) {
        setStats(response.data.data);
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error fetching stats:', error);
      }
    }
  }, []);

  useEffect(() => {
    fetchCategories();
    fetchStats();
  }, [fetchCategories, fetchStats]);

  // Handle actions
  const handleApprove = async (category) => {
    if (!confirm(`Approve category "${category.name}"?`)) return;

    try {
      if (import.meta.env.DEV) {
        console.log('Approving category:', category._id, 'Type:', category.type);
      }
      
      await api.post(`/categories/admin/${category._id}/approve`, { type: category.type });

      alert('Category approved successfully');
      fetchCategories();
      fetchStats();
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error approving category:', error);
      }
      alert(`Failed to approve category: ${error.response?.data?.error || error.message || 'Unknown error'}`);
    }
  };

  const handleReject = async (category, reason) => {
    try {
      if (import.meta.env.DEV) {
        console.log('Rejecting category:', category._id, 'Type:', category.type, 'Reason:', reason);
      }
      
      await api.post(`/categories/admin/${category._id}/reject`, { 
        type: category.type,
        reason: reason || 'Does not meet category guidelines'
      });

      alert('Category rejected successfully');
      fetchCategories();
      fetchStats();
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error rejecting category:', error);
      }
      alert(`Failed to reject category: ${error.response?.data?.error || error.message || 'Unknown error'}`);
    }
  };

  const handleDelete = async (category) => {
    if (!confirm(`Delete category "${category.name}"? This action cannot be undone.`)) return;

    try {
      if (import.meta.env.DEV) {
        console.log('Deleting category:', category._id, 'Type:', category.type);
      }
      
      await api.delete(`/categories/admin/${category._id}`, {
        params: { type: category.type }
      });

      alert('Category deleted successfully');
      fetchCategories();
      fetchStats();
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error deleting category:', error);
      }
      alert(`Failed to delete category: ${error.response?.data?.error || error.message || 'Unknown error'}`);
    }
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setModalMode('edit');
    setShowModal(true);
  };

  const handleView = (category) => {
    setSelectedCategory(category);
    setModalMode('view');
    setShowModal(true);
  };

  const handleCreate = () => {
    setSelectedCategory(null);
    setModalMode('create');
    setShowModal(true);
  };

  const handleSave = async (categoryData) => {
    try {
      if (import.meta.env.DEV) {
        console.log(`${modalMode === 'edit' ? 'PUT' : 'POST'} category:`, categoryData);
      }
      
      if (modalMode === 'edit') {
        await api.put(`/categories/admin/${selectedCategory._id}`, categoryData);
      } else {
        await api.post('/categories/admin/submit', categoryData);
      }

      alert(`Category ${modalMode === 'edit' ? 'updated' : 'created'} successfully`);
      setShowModal(false);
      fetchCategories();
      fetchStats();
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error saving category:', error);
      }
      const errorMessage = error.response?.data?.error || error.message || 'Failed to save category';
      throw new Error(errorMessage);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
      <div className="flex flex-row min-h-screen">
        {/* Desktop Sidebar */}
        <AdminSidebar />
        
        {/* Mobile Sidebar */}
        <MobileSidebar />

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Header */}
          <AdminHeader />

          {/* Categories Management Content */}
          <div className="flex-1 p-2 sm:p-4 md:p-8 overflow-auto">
            <div className="w-full max-w-7xl mx-auto">
              {/* Page Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 sm:mb-6">
                <div>
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-stone-800 dark:text-stone-100">
                    Category Management
                  </h1>
                  <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1">
                    Review and approve categories submitted by sellers
                  </p>
                </div>
                <button 
                  onClick={handleCreate}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 bg-[#ec6d13] text-white rounded-lg hover:bg-[#ec6d13]/90 transition-colors font-medium text-sm sm:text-base"
                >
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Add Category</span>
                </button>
              </div>

              {/* Stats Cards */}
              <StatsCards stats={stats} />

              {/* Filters */}
              <div className="bg-white dark:bg-[#2a1e14] rounded-lg shadow-sm border border-[#e7d9cf] dark:border-[#3f2e1e] p-3 sm:p-4 mb-4 sm:mb-6">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  {/* Search */}
                  <div className="flex-1 min-w-0">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-stone-400 pointer-events-none" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search categories..."
                        className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 text-sm sm:text-base border border-[#e7d9cf] dark:border-[#3f2e1e] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec6d13] bg-white dark:bg-[#221810]"
                      />
                    </div>
                  </div>

                  {/* Type Filter */}
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full sm:w-auto px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-[#e7d9cf] dark:border-[#3f2e1e] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec6d13] bg-white dark:bg-[#221810]"
                  >
                    <option value="all">All Types</option>
                    <option value="artisan">Artisan</option>
                    <option value="collectible">Collectible</option>
                  </select>

                  {/* Status Filter */}
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full sm:w-auto px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-[#e7d9cf] dark:border-[#3f2e1e] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec6d13] bg-white dark:bg-[#221810]"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>

              {/* Categories Table */}
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ec6d13]"></div>
                </div>
              ) : (
                <CategoryTable
                  categories={categories}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                  onView={handleView}
                />
              )}

              {/* Pagination */}
              {pagination.total > pagination.limit && (
                <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mt-6">
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                    disabled={pagination.page === 1}
                    className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base border border-[#e7d9cf] dark:border-[#3f2e1e] rounded-lg hover:bg-stone-50 dark:hover:bg-[#3a2a1d] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <span className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
                    Page {pagination.page} of {Math.ceil(pagination.total / pagination.limit)}
                  </span>
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
                    className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base border border-[#e7d9cf] dark:border-[#3f2e1e] rounded-lg hover:bg-stone-50 dark:hover:bg-[#3a2a1d] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Category Modal */}
      {showModal && (
        <CategoryModal
          mode={modalMode}
          category={selectedCategory}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default Categories;
