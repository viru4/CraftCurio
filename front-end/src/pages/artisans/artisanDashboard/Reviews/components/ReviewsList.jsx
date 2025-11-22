import { Star, MessageSquare, ThumbsUp, ChevronLeft, ChevronRight, Edit, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const ReviewsList = ({ reviews, loading, pagination, onPageChange, onReply, onDeleteReply }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-[#e8d5c4] p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#ec6d13]"></div>
        </div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-[#e8d5c4] p-8">
        <div className="text-center">
          <Star className="w-12 h-12 text-[#9a6c4c] mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-[#1b130d] mb-2">No Reviews Found</h3>
          <p className="text-[#6b5d54]">
            There are no reviews matching your current filters.
          </p>
        </div>
      </div>
    );
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'fill-[#ec6d13] text-[#ec6d13]' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="space-y-4">
      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review._id}
            className="bg-white rounded-xl shadow-sm border border-[#e8d5c4] p-4 sm:p-6 hover:shadow-md transition-shadow"
          >
            {/* Review Header */}
            <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-4">
              {/* Product Image */}
              <div className="flex-shrink-0">
                <img
                  src={review.product?.images?.[0] || '/placeholder.png'}
                  alt={review.product?.title}
                  className="w-20 h-20 object-cover rounded-lg border border-[#e8d5c4]"
                />
              </div>

              {/* Review Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-[#1b130d] mb-1 truncate">
                  {review.product?.title}
                </h4>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1">{renderStars(review.rating)}</div>
                  <span className="text-sm text-[#6b5d54]">
                    {review.rating}.0
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-sm text-[#6b5d54]">
                  <span>{review.user?.name || 'Anonymous'}</span>
                  <span>•</span>
                  <span>{formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}</span>
                  {review.verified && (
                    <>
                      <span>•</span>
                      <span className="text-green-600 font-medium">Verified Purchase</span>
                    </>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="flex-shrink-0">
                <button
                  onClick={() => onReply(review)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    review.artisanReply?.comment
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-[#ec6d13] text-white hover:bg-[#d45a0a]'
                  }`}
                >
                  {review.artisanReply?.comment ? 'View Reply' : 'Reply'}
                </button>
              </div>
            </div>

            {/* Review Title & Content */}
            <div className="mb-4">
              <h5 className="font-semibold text-[#1b130d] mb-2">{review.title}</h5>
              <p className="text-[#6b5d54] leading-relaxed">{review.comment}</p>
            </div>

            {/* Review Images */}
            {review.images && review.images.length > 0 && (
              <div className="flex gap-2 mb-4">
                {review.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Review ${idx + 1}`}
                    className="w-16 h-16 object-cover rounded-lg border border-[#e8d5c4]"
                  />
                ))}
              </div>
            )}

            {/* Helpful Count */}
            {review.helpful > 0 && (
              <div className="flex items-center gap-2 text-sm text-[#6b5d54] mb-4">
                <ThumbsUp className="w-4 h-4" />
                <span>{review.helpful} people found this helpful</span>
              </div>
            )}

            {/* Artisan Reply */}
            {review.artisanReply?.comment && (
              <div className="bg-[#f8f7f6] border-l-4 border-[#ec6d13] rounded-lg p-4 mt-4">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-[#ec6d13]" />
                    <span className="font-semibold text-[#1b130d] text-sm">Your Reply</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onReply(review)}
                      className="p-1.5 hover:bg-white rounded transition-colors"
                      title="Edit reply"
                    >
                      <Edit className="w-4 h-4 text-[#6b5d54]" />
                    </button>
                    <button
                      onClick={() => onDeleteReply(review._id)}
                      className="p-1.5 hover:bg-white rounded transition-colors"
                      title="Delete reply"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
                <p className="text-[#6b5d54] leading-relaxed">{review.artisanReply.comment}</p>
                <span className="text-xs text-[#9a6c4c] mt-2 block">
                  {formatDistanceToNow(new Date(review.artisanReply.repliedAt), { addSuffix: true })}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="bg-white rounded-xl shadow-sm border border-[#e8d5c4] p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-[#6b5d54]">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
              {pagination.total} reviews
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onPageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-4 py-2 border border-[#e8d5c4] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#f8f7f6] transition-colors flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Previous</span>
              </button>
              <span className="text-sm text-[#6b5d54] px-4">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => onPageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="px-4 py-2 border border-[#e8d5c4] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#f8f7f6] transition-colors flex items-center gap-2"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewsList;
