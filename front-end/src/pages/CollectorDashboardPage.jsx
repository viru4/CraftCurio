import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CollectorProvider, useCollectorContext } from '../contexts/CollectorContext';
import Dashboard from '../components/CollectorDashboard/Dashboard';
import ListForm from '../components/CollectorDashboard/ListForm';
import AuctionPage from '../components/CollectorDashboard/AuctionPage';
import { useCreateCollectible, useUpdateCollectible, useDeleteCollectible } from '../hooks/useCollectibles';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/layout/Navbar';

/**
 * CollectorDashboardContent - Inner component with access to CollectorContext
 */
const CollectorDashboardContent = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { triggerRefresh } = useCollectorContext();

  // View state management
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard' | 'add' | 'edit' | 'auction'
  const [selectedCollectible, setSelectedCollectible] = useState(null);

  // Hooks for CRUD operations
  const { create: createCollectible, loading: isCreating, error: createError } = useCreateCollectible();
  const { update: updateCollectible, loading: isUpdating, error: updateError } = useUpdateCollectible();
  const { delete: deleteCollectible, loading: isDeleting } = useDeleteCollectible();

  // Protect the route
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate('/sign-in');
      } else if (user.role !== 'collector') {
        navigate('/');
      }
    }
  }, [user, authLoading, navigate]);

  // Show loading state while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  // Don't render if not authorized (will redirect via useEffect)
  if (!user || user.role !== 'collector') {
    return null;
  }

  // Navigation handlers
  const handleAddNew = () => {
    setSelectedCollectible(null);
    setCurrentView('add');
  };

  const handleEditItem = (collectible) => {
    setSelectedCollectible(collectible);
    setCurrentView('edit');
  };

  const handleViewAuction = (collectible) => {
    if (collectible.saleType === 'auction') {
      setSelectedCollectible(collectible);
      setCurrentView('auction');
    } else {
      // For direct sales, could open a detail view
      alert('Direct sale details coming soon!');
    }
  };

  const handleBackToDashboard = () => {
    setSelectedCollectible(null);
    setCurrentView('dashboard');
  };

  // Form submission handlers
  const handleCreateSubmit = async (formData) => {
    try {
      await createCollectible(formData);
      alert('Collectible created successfully!');
      triggerRefresh(); // Trigger refresh in context
      handleBackToDashboard();
    } catch (error) {
      console.error('Create error:', error);
      throw error; // Let the form handle the error display
    }
  };

  const handleUpdateSubmit = async (formData) => {
    if (!selectedCollectible?._id) {
      throw new Error('No collectible selected for update');
    }

    try {
      await updateCollectible(selectedCollectible._id, formData);
      alert('Collectible updated successfully!');
      triggerRefresh(); // Trigger refresh in context
      handleBackToDashboard();
    } catch (error) {
      console.error('Update error:', error);
      throw error;
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCollectible(id);
      alert('Collectible deleted successfully!');
      triggerRefresh(); // Trigger refresh in context
      return true;
    } catch (error) {
      console.error('Delete error:', error);
      throw error;
    }
  };

  const handleBuySuccess = (auction) => {
    alert(`Congratulations! You purchased "${auction.title}"`);
    handleBackToDashboard();
  };

  // Render current view
  const renderView = () => {
    switch (currentView) {
      case 'add':
        return (
          <ListForm
            onSubmit={handleCreateSubmit}
            onCancel={handleBackToDashboard}
            isLoading={isCreating}
          />
        );

      case 'edit':
        return (
          <ListForm
            initialData={selectedCollectible}
            onSubmit={handleUpdateSubmit}
            onCancel={handleBackToDashboard}
            isLoading={isUpdating}
          />
        );

      case 'auction':
        return selectedCollectible ? (
          <AuctionPage
            auctionId={selectedCollectible._id}
            onClose={handleBackToDashboard}
            onBuySuccess={handleBuySuccess}
          />
        ) : null;

      case 'dashboard':
      default:
        return (
          <Dashboard
            onAddNew={handleAddNew}
            onEditItem={handleEditItem}
            onViewItem={handleViewAuction}
            onDelete={handleDelete}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />

      {/* Main Content Wrapper with Top Padding */}
      <div className="pt-20">
        {/* Back Navigation (for non-dashboard views) */}
        {currentView !== 'dashboard' && currentView !== 'auction' && (
          <div className="bg-white border-b border-gray-200 px-4 py-3">
            <div className="max-w-7xl mx-auto">
              <button
                onClick={handleBackToDashboard}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Dashboard
              </button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className={currentView === 'dashboard' ? '' : 'py-8'}>
          {renderView()}
        </div>

        {/* Error Notifications */}
        {(createError || updateError) && (
          <div className="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg max-w-md">
            <p className="font-semibold">Error</p>
            <p className="text-sm">{createError || updateError}</p>
          </div>
        )}

        {/* Loading Overlay (for delete operations) */}
        {isDeleting && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mb-4"></div>
              <p className="text-gray-700">Deleting collectible...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};/**
 * CollectorDashboardPage - Main page wrapper with CollectorProvider
 */
const CollectorDashboardPage = () => {
  const { user } = useAuth();

  const collectorId = user?.collectorId || user?._id;
  
  console.log('CollectorDashboardPage: User and CollectorId', {
    user,
    collectorId,
    userCollectorId: user?.collectorId,
    userId: user?._id
  });

  return (
    <CollectorProvider collectorId={collectorId}>
      <CollectorDashboardContent />
    </CollectorProvider>
  );
};

export default CollectorDashboardPage;
