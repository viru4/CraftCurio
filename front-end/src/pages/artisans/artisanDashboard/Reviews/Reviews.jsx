import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, Star, MessageCircle } from 'lucide-react';
import ArtisanSidebar from '../components/ArtisanSidebar';
import ReviewsSection from './components/ReviewsSection';
import QuestionsSection from './components/QuestionsSection';

const Reviews = () => {
  const { user, isArtisan, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('reviews'); // 'reviews' or 'questions'

  // Auth check
  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user || !isArtisan) {
      navigate('/');
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isArtisan, authLoading]);

  // Show loading during auth check
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f7f6]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ec6d13]"></div>
      </div>
    );
  }

  // Don't render if not authorized
  if (!user || !isArtisan) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-[#f8f7f6]">
      {/* Sidebar */}
      <ArtisanSidebar 
        user={user}
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-[#e8d5c4] px-4 py-3 flex items-center justify-between sticky top-0 z-10">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-[#f8f7f6] rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6 text-[#1b130d]" />
          </button>
          <h1 className="text-lg font-semibold text-[#1b130d]">
            Reviews & Q&A
          </h1>
          <div className="w-10"></div>
        </div>

        {/* Page Content */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#1b130d] mb-2">
                Reviews & Q&A Management
              </h1>
              <p className="text-[#6b5d54]">
                Manage customer reviews and answer their questions about your products
              </p>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-[#e8d5c4] mb-6">
              <div className="border-b border-[#e8d5c4]">
                <div className="flex">
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className={`flex-1 sm:flex-none px-6 py-4 font-medium text-sm sm:text-base transition-colors flex items-center justify-center gap-2 ${
                      activeTab === 'reviews'
                        ? 'text-[#ec6d13] border-b-2 border-[#ec6d13]'
                        : 'text-[#6b5d54] hover:text-[#1b130d] hover:bg-[#f8f7f6]'
                    }`}
                  >
                    <Star className="w-5 h-5" />
                    <span>Reviews</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('questions')}
                    className={`flex-1 sm:flex-none px-6 py-4 font-medium text-sm sm:text-base transition-colors flex items-center justify-center gap-2 ${
                      activeTab === 'questions'
                        ? 'text-[#ec6d13] border-b-2 border-[#ec6d13]'
                        : 'text-[#6b5d54] hover:text-[#1b130d] hover:bg-[#f8f7f6]'
                    }`}
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>Q&A</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'reviews' ? <ReviewsSection /> : <QuestionsSection />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reviews;
