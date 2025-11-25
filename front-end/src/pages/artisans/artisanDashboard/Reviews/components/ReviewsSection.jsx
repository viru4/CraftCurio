import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '@/utils/api';
import { Star, TrendingUp, MessageSquare, ThumbsUp } from 'lucide-react';
import ReviewsFilters from './ReviewsFilters';
import ReviewsList from './ReviewsList';
import ReviewReplyModal from './ReviewReplyModal';

const ReviewsSection = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    rating: '',
    hasReply: '',
    search: '',
    sortBy: 'createdAt',
    order: 'desc',
    page: 1,
    limit: 10
  });
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    replied: 0,
    averageRating: 0,
    byRating: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  });

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams({
        status: filters.status,
        search: filters.search,
        sortBy: filters.sortBy,
        order: filters.order,
        page: filters.page,
        limit: filters.limit
      });

      if (filters.rating) queryParams.append('rating', filters.rating);
      if (filters.hasReply) queryParams.append('hasReply', filters.hasReply);

      const response = await fetch(
        `${API_ENDPOINTS.reviews}/artisan/my-reviews?${queryParams}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }

      const result = await response.json();
      if (result.success) {
        setReviews(result.data.reviews);
        setStats(result.data.stats);
        setPagination(result.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = (review) => {
    setSelectedReview(review);
    setShowReplyModal(true);
  };

  const handleReplySubmit = async (reviewId, replyText) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${API_ENDPOINTS.reviews}/artisan/${reviewId}/reply`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ comment: replyText })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to add reply');
      }

      await fetchReviews();
      setShowReplyModal(false);
      setSelectedReview(null);
    } catch (error) {
      console.error('Error adding reply:', error);
      throw error;
    }
  };

  const handleUpdateReply = async (reviewId, replyText) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${API_ENDPOINTS.reviews}/artisan/${reviewId}/reply`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ comment: replyText })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update reply');
      }

      await fetchReviews();
      setShowReplyModal(false);
      setSelectedReview(null);
    } catch (error) {
      console.error('Error updating reply:', error);
      throw error;
    }
  };

  const handleDeleteReply = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this reply?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${API_ENDPOINTS.reviews}/artisan/${reviewId}/reply`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete reply');
      }

      await fetchReviews();
    } catch (error) {
      console.error('Error deleting reply:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#e8d5c4]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#6b5d54] mb-1">Total Reviews</p>
              <p className="text-2xl font-bold text-[#1b130d]">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-[#ec6d13]/10 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-[#ec6d13]" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#e8d5c4]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#6b5d54] mb-1">Avg Rating</p>
              <p className="text-2xl font-bold text-[#1b130d]">{stats.averageRating}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#e8d5c4]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#6b5d54] mb-1">Pending Reply</p>
              <p className="text-2xl font-bold text-[#1b130d]">{stats.pending}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#e8d5c4]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#6b5d54] mb-1">Replied</p>
              <p className="text-2xl font-bold text-[#1b130d]">{stats.replied}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <ThumbsUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <ReviewsFilters filters={filters} setFilters={setFilters} stats={stats} />

      {/* Reviews List */}
      <ReviewsList
        reviews={reviews}
        loading={loading}
        pagination={pagination}
        onPageChange={(page) => setFilters({ ...filters, page })}
        onReply={handleReply}
        onDeleteReply={handleDeleteReply}
      />

      {/* Reply Modal */}
      {showReplyModal && selectedReview && (
        <ReviewReplyModal
          review={selectedReview}
          onClose={() => {
            setShowReplyModal(false);
            setSelectedReview(null);
          }}
          onSubmit={handleReplySubmit}
          onUpdate={handleUpdateReply}
        />
      )}
    </div>
  );
};

export default ReviewsSection;
