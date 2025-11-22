import { useState, useEffect, useRef } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import MobileSidebar from '../components/MobileSidebar';
import AdminHeader from '../components/AdminHeader';
import StoriesTable from './components/StoriesTable';
import StoryViewModal from './components/StoryViewModal';
import StoryEditModal from './components/StoryEditModal';
import { Search, RefreshCw, FileText } from 'lucide-react';
import API_BASE_URL from '@/config/api';

const AdminContent = () => {
  const [artisans, setArtisans] = useState([]);
  const [filteredArtisans, setFilteredArtisans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;
  
  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedArtisan, setSelectedArtisan] = useState(null);

  const searchTimeoutRef = useRef(null);

  // Fetch artisans
  const fetchArtisans = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/artisans`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch artisans');
      }

      const data = await response.json();
      const artisansList = data.data || [];
      
      setArtisans(artisansList);
      setTotalItems(artisansList.length);
      setTotalPages(Math.ceil(artisansList.length / itemsPerPage));
      
      // Apply initial filtering
      filterArtisans(artisansList, searchQuery);
    } catch (err) {
      console.error('Error fetching artisans:', err);
      setError(err.message);
      setArtisans([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter artisans based on search query
  const filterArtisans = (artisansList, query) => {
    if (!query.trim()) {
      setFilteredArtisans(artisansList);
      setTotalItems(artisansList.length);
      setTotalPages(Math.ceil(artisansList.length / itemsPerPage));
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = artisansList.filter(artisan => 
      artisan.name?.toLowerCase().includes(lowerQuery) ||
      artisan.id?.toLowerCase().includes(lowerQuery) ||
      artisan.craftSpecialization?.toLowerCase().includes(lowerQuery) ||
      artisan.location?.toLowerCase().includes(lowerQuery)
    );

    setFilteredArtisans(filtered);
    setTotalItems(filtered.length);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Fetch artisans on mount
  useEffect(() => {
    fetchArtisans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle search with debounce
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      filterArtisans(artisans, searchQuery);
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, artisans]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleReset = () => {
    setSearchQuery('');
    setCurrentPage(1);
    filterArtisans(artisans, '');
  };

  const handleView = (artisan) => {
    setSelectedArtisan(artisan);
    setViewModalOpen(true);
  };

  const handleEdit = (artisan) => {
    setSelectedArtisan(artisan);
    setEditModalOpen(true);
  };

  const handleDelete = async (artisanId) => {
    if (!confirm('Are you sure you want to delete this artisan story? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/artisans/${artisanId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete artisan');
      }

      alert('Artisan story deleted successfully!');
      fetchArtisans(); // Refresh the list
    } catch (err) {
      console.error('Error deleting artisan:', err);
      alert('Failed to delete artisan: ' + err.message);
    }
  };

  const handleSaveStory = () => {
    // Refresh artisans list after save
    fetchArtisans();
  };

  // Paginate filtered artisans
  const paginatedArtisans = filteredArtisans.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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

          {/* Content Management Section */}
          <div className="flex-1 p-2 sm:p-4 md:p-8 overflow-hidden">
            <div className="w-full h-full flex flex-col min-w-0">
              {/* Page Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 sm:mb-6 flex-shrink-0">
                <div>
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-black leading-tight tracking-[-0.03em] text-[#1b130d] dark:text-[#fcfaf8]">
                    Artisan Stories Management
                  </h1>
                  <p className="text-sm text-[#9a6c4c] dark:text-[#a88e79] mt-1">
                    Review, edit, and manage artisan story content
                  </p>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-[#f3ece7] dark:bg-[#3a2a1d] rounded-lg">
                  <FileText className="w-5 h-5 text-[#ec6d13]" />
                  <div className="text-sm">
                    <span className="font-bold text-[#1b130d] dark:text-[#fcfaf8]">{totalItems}</span>
                    <span className="text-[#9a6c4c] dark:text-[#a88e79] ml-1">Total Artisans</span>
                  </div>
                </div>
              </div>

              {/* Search and Filters */}
              <div className="flex flex-col gap-3 sm:gap-4 mb-3 sm:mb-4 flex-shrink-0">
                {/* Search Bar */}
                <div className="w-full">
                  <div className="flex items-stretch rounded-md h-10 sm:h-12 bg-[#f3ece7] dark:bg-[#3a2a1d]">
                    <div className="flex items-center justify-center pl-4">
                      <Search className="w-5 h-5 text-[#9a6c4c] dark:text-[#a18a7a]" />
                    </div>
                    <input
                      type="text"
                      className="flex-1 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-[#ec6d13]/50 rounded-r-md px-3 sm:px-4 text-sm sm:text-base placeholder:text-[#9a6c4c] dark:placeholder:text-[#a18a7a]"
                      placeholder="Search by artisan name, ID, specialization, or location..."
                      value={searchQuery}
                      onChange={handleSearch}
                    />
                  </div>
                </div>

                {/* Reset Button */}
                <div className="flex items-center justify-between">
                  <p className="text-xs sm:text-sm text-[#9a6c4c] dark:text-[#a88e79]">
                    {searchQuery ? `Found ${totalItems} result${totalItems !== 1 ? 's' : ''}` : ''}
                  </p>
                  {searchQuery && (
                    <button 
                      onClick={handleReset}
                      className="flex h-9 sm:h-10 items-center justify-center gap-x-1 sm:gap-x-2 rounded-md px-3 sm:px-4 text-[#9a6c4c] dark:text-[#a18a7a] hover:text-[#ec6d13] hover:bg-[#f3ece7] dark:hover:bg-[#3a2a1d] transition-colors"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <p className="text-xs sm:text-sm font-medium">Reset</p>
                    </button>
                  )}
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-4 flex-shrink-0">
                  <p className="text-sm font-medium">Error: {error}</p>
                </div>
              )}

              {/* Stories Table */}
              <div className="flex-1 min-h-0 overflow-auto">
                <StoriesTable
                  artisans={paginatedArtisans}
                  loading={loading}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
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

      {/* Modals */}
      {viewModalOpen && (
        <StoryViewModal
          artisan={selectedArtisan}
          onClose={() => {
            setViewModalOpen(false);
            setSelectedArtisan(null);
          }}
        />
      )}

      {editModalOpen && (
        <StoryEditModal
          artisan={selectedArtisan}
          onClose={() => {
            setEditModalOpen(false);
            setSelectedArtisan(null);
          }}
          onSave={handleSaveStory}
        />
      )}
    </div>
  );
};

export default AdminContent;
