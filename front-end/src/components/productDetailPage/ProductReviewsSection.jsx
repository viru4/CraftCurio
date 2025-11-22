import { useState, useEffect } from 'react';
import { Star, ThumbsUp, User, Calendar, MessageSquare, X } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';
import API_BASE_URL from '../../config/api';

const ProductReviewsSection = ({ product }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    rating: 5,
    title: '',
    comment: ''
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchReviews();
  }, [product._id, currentPage]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/api/reviews/product/${product._id}?page=${currentPage}&limit=5`
      );
      const data = await response.json();

      if (data.success) {
        setReviews(data.data.reviews);
        setStats(data.data.stats);
        setTotalPages(data.data.pagination.totalPages);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    } else if (formData.title.length > 100) {
      errors.title = 'Title must be 100 characters or less';
    }

    if (!formData.comment.trim()) {
      errors.comment = 'Review is required';
    } else if (formData.comment.length > 1000) {
      errors.comment = 'Review must be 1000 characters or less';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      setError('');
      setSuccess('');

      const token = localStorage.getItem('token');
      const response = await fetch(
        `${API_BASE_URL}/api/reviews/product/${product._id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        }
      );

      const data = await response.json();

      if (data.success) {
        setSuccess('Review submitted successfully!');
        setFormData({ rating: 5, title: '', comment: '' });
        setShowForm(false);
        fetchReviews();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.message || 'Failed to submit review');
      }
    } catch (err) {
      setError('Error submitting review. Please try again.');
      console.error('Submit review error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating, interactive = false, onRatingChange = null) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={interactive ? 24 : 16}
            className={`${
              star <= rating
                ? 'fill-[#ec6d13] text-[#ec6d13]'
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
            onClick={() => interactive && onRatingChange && onRatingChange(star)}
          />
        ))}
      </div>
    );
  };

  const renderRatingDistribution = () => {
    if (!stats) return null;

    return (
      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = stats.distribution[rating] || 0;
          const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;

          return (
            <div key={rating} className="flex items-center gap-3">
              <span className="text-sm text-[#6b5d54] w-12">{rating} star</span>
              <div className="flex-1 h-2 bg-[#e8d5c4] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#ec6d13] rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-sm text-[#6b5d54] w-8 text-right">{count}</span>
            </div>
          );
        })}
      </div>
    );
  };

  if (loading && reviews.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ec6d13]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
          {success}
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Overview Section */}
      <div className="grid md:grid-cols-2 gap-6 p-6 bg-[#f8f7f6] rounded-lg border border-[#e8d5c4]">
        {/* Average Rating */}
        <div className="text-center md:border-r border-[#e8d5c4]">
          <div className="text-5xl font-bold text-[#1b130d] mb-2">
            {stats?.averageRating || 0}
          </div>
          <div className="flex justify-center mb-2">
            {renderStars(Math.round(stats?.averageRating || 0))}
          </div>
          <p className="text-sm text-[#6b5d54]">
            Based on {stats?.total || 0} review{stats?.total !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Rating Distribution */}
        <div className="flex flex-col justify-center">
          {renderRatingDistribution()}
        </div>
      </div>

      {/* Write Review Button */}
      {user ? (
        <div>
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="w-full md:w-auto px-6 py-3 bg-[#ec6d13] text-white rounded-lg hover:bg-[#d96012] transition-colors font-medium"
            >
              Write a Review
            </button>
          ) : (
            <div className="bg-white border border-[#e8d5c4] rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-[#1b130d]">Write Your Review</h3>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setFormErrors({});
                    setError('');
                  }}
                  className="text-[#6b5d54] hover:text-[#1b130d]"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmitReview} className="space-y-4">
                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium text-[#1b130d] mb-2">
                    Rating *
                  </label>
                  {renderStars(formData.rating, true, (rating) =>
                    setFormData({ ...formData, rating })
                  )}
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-[#1b130d] mb-2">
                    Review Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec6d13] ${
                      formErrors.title ? 'border-red-500' : 'border-[#e8d5c4]'
                    }`}
                    placeholder="Sum up your experience in one line"
                    maxLength={100}
                  />
                  <div className="flex justify-between mt-1">
                    {formErrors.title && (
                      <span className="text-sm text-red-500">{formErrors.title}</span>
                    )}
                    <span className="text-xs text-[#6b5d54] ml-auto">
                      {formData.title.length}/100
                    </span>
                  </div>
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-sm font-medium text-[#1b130d] mb-2">
                    Your Review *
                  </label>
                  <textarea
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec6d13] min-h-[120px] resize-y ${
                      formErrors.comment ? 'border-red-500' : 'border-[#e8d5c4]'
                    }`}
                    placeholder="Share your thoughts about this product..."
                    maxLength={1000}
                  />
                  <div className="flex justify-between mt-1">
                    {formErrors.comment && (
                      <span className="text-sm text-red-500">{formErrors.comment}</span>
                    )}
                    <span className="text-xs text-[#6b5d54] ml-auto">
                      {formData.comment.length}/1000
                    </span>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-6 py-2 bg-[#ec6d13] text-white rounded-lg hover:bg-[#d96012] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setFormErrors({});
                      setError('');
                    }}
                    className="px-6 py-2 border border-[#e8d5c4] text-[#1b130d] rounded-lg hover:bg-[#f8f7f6] transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8 px-4 bg-[#f8f7f6] rounded-lg border border-[#e8d5c4]">
          <p className="text-[#6b5d54]">
            Please <a href="/sign-in" className="text-[#ec6d13] hover:underline">sign in</a> to write a review
          </p>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-12 px-4">
            <MessageSquare size={48} className="mx-auto text-[#e8d5c4] mb-4" />
            <p className="text-[#6b5d54]">No reviews yet. Be the first to review this product!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div
              key={review._id}
              className="bg-white border border-[#e8d5c4] rounded-lg p-6 space-y-4"
            >
              {/* Review Header */}
              <div className="flex items-start justify-between">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#e8d5c4] flex items-center justify-center">
                    {review.user?.profileImage ? (
                      <img
                        src={review.user.profileImage}
                        alt={review.user.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <User size={20} className="text-[#6b5d54]" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-[#1b130d]">{review.user?.name || 'Anonymous'}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {renderStars(review.rating)}
                      <span className="text-sm text-[#6b5d54]">
                        <Calendar size={14} className="inline mr-1" />
                        {format(new Date(review.createdAt), 'MMM dd, yyyy')}
                      </span>
                    </div>
                  </div>
                </div>
                {review.verified && (
                  <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full border border-green-200">
                    Verified Purchase
                  </span>
                )}
              </div>

              {/* Review Content */}
              <div>
                <h4 className="font-semibold text-[#1b130d] mb-2">{review.title}</h4>
                <p className="text-[#6b5d54] leading-relaxed">{review.comment}</p>
              </div>

              {/* Artisan Reply */}
              {review.artisanReply?.comment && (
                <div className="ml-8 pl-4 border-l-2 border-[#ec6d13] bg-[#f8f7f6] p-4 rounded-r-lg">
                  <p className="text-sm font-medium text-[#1b130d] mb-2">
                    Response from {product.artisanInfo?.name || 'Artisan'}
                  </p>
                  <p className="text-sm text-[#6b5d54]">{review.artisanReply.comment}</p>
                  <p className="text-xs text-[#6b5d54] mt-2">
                    {format(new Date(review.artisanReply.repliedAt), 'MMM dd, yyyy')}
                  </p>
                </div>
              )}

              {/* Helpful Button */}
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 px-3 py-1 text-sm text-[#6b5d54] hover:text-[#ec6d13] transition-colors">
                  <ThumbsUp size={16} />
                  <span>Helpful ({review.helpfulCount || 0})</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 pt-4">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-[#e8d5c4] rounded-lg hover:bg-[#f8f7f6] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-[#6b5d54]">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-[#e8d5c4] rounded-lg hover:bg-[#f8f7f6] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductReviewsSection;
