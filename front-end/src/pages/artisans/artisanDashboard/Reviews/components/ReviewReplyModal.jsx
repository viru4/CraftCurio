import { useState, useEffect } from 'react';
import { X, Star, MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const ReviewReplyModal = ({ review, onClose, onSubmit, onUpdate }) => {
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const isEditing = !!review.artisanReply?.comment;

  useEffect(() => {
    if (isEditing) {
      setReplyText(review.artisanReply.comment);
    }
  }, [review, isEditing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!replyText.trim()) {
      setError('Please enter a reply');
      return;
    }

    if (replyText.length > 500) {
      setError('Reply must not exceed 500 characters');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      if (isEditing) {
        await onUpdate(review._id, replyText);
      } else {
        await onSubmit(review._id, replyText);
      }
    } catch (err) {
      setError(err.message || 'Failed to submit reply');
      setIsSubmitting(false);
    }
  };

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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-[#e8d5c4] px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#1b130d]">
            {isEditing ? 'Edit Reply' : 'Reply to Review'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#f8f7f6] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Review Display */}
          <div className="bg-[#f8f7f6] rounded-xl p-4 sm:p-6 mb-6">
            {/* Product Info */}
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <img
                src={review.product?.images?.[0] || '/placeholder.png'}
                alt={review.product?.title}
                className="w-20 h-20 object-cover rounded-lg border border-[#e8d5c4]"
              />
              <div className="flex-1">
                <h4 className="font-semibold text-[#1b130d] mb-1">
                  {review.product?.title}
                </h4>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1">{renderStars(review.rating)}</div>
                  <span className="text-sm text-[#6b5d54]">{review.rating}.0</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#6b5d54]">
                  <span>{review.user?.name || 'Anonymous'}</span>
                  <span>•</span>
                  <span>{formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}</span>
                </div>
              </div>
            </div>

            {/* Review Content */}
            <div>
              <h5 className="font-semibold text-[#1b130d] mb-2">{review.title}</h5>
              <p className="text-[#6b5d54] leading-relaxed">{review.comment}</p>
            </div>

            {/* Review Images */}
            {review.images && review.images.length > 0 && (
              <div className="flex gap-2 mt-4">
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
          </div>

          {/* Reply Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#1b130d] mb-2">
                Your Reply
              </label>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a professional and helpful response..."
                rows={6}
                maxLength={500}
                className="w-full px-4 py-3 border border-[#e8d5c4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec6d13] focus:border-transparent resize-none"
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-[#6b5d54]">
                  {replyText.length}/500 characters
                </span>
                {error && (
                  <span className="text-sm text-red-500">{error}</span>
                )}
              </div>
            </div>

            {/* Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-2">
                <MessageSquare className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1">Reply Tips</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Thank the customer for their feedback</li>
                    <li>• Address any concerns professionally</li>
                    <li>• Highlight the craftsmanship or unique features</li>
                    <li>• Keep it concise and authentic</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-6 py-2.5 border border-[#e8d5c4] rounded-lg font-medium text-[#1b130d] hover:bg-[#f8f7f6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !replyText.trim()}
                className="px-6 py-2.5 bg-[#ec6d13] text-white rounded-lg font-medium hover:bg-[#d45a0a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <span>{isEditing ? 'Update Reply' : 'Submit Reply'}</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReviewReplyModal;
