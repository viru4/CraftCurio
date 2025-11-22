import { MessageCircle, MessageSquare, Edit, Trash2, Archive, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const QuestionsList = ({ questions, loading, pagination, onPageChange, onAnswer, onDeleteAnswer, onArchive }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-[#e8d5c4] p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#ec6d13]"></div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-[#e8d5c4] p-8">
        <div className="text-center">
          <MessageCircle className="w-12 h-12 text-[#9a6c4c] mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-[#1b130d] mb-2">No Questions Found</h3>
          <p className="text-[#6b5d54]">
            There are no questions matching your current filters.
          </p>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const badges = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending' },
      answered: { bg: 'bg-green-100', text: 'text-green-700', label: 'Answered' },
      archived: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Archived' }
    };

    const badge = badges[status] || badges.pending;

    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Questions List */}
      <div className="space-y-4">
        {questions.map((question) => (
          <div
            key={question._id}
            className="bg-white rounded-xl shadow-sm border border-[#e8d5c4] p-4 sm:p-6 hover:shadow-md transition-shadow"
          >
            {/* Question Header */}
            <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-4">
              {/* Product Image */}
              <div className="flex-shrink-0">
                <img
                  src={question.product?.images?.[0] || '/placeholder.png'}
                  alt={question.product?.title}
                  className="w-20 h-20 object-cover rounded-lg border border-[#e8d5c4]"
                />
              </div>

              {/* Question Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="font-semibold text-[#1b130d] flex-1">
                    {question.product?.title}
                  </h4>
                  {getStatusBadge(question.status)}
                </div>
                <div className="flex flex-wrap items-center gap-2 text-sm text-[#6b5d54]">
                  <span>{question.user?.name || 'Anonymous'}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {question.status !== 'archived' && (
                  <button
                    onClick={() => onAnswer(question)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      question.answer?.comment
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-[#ec6d13] text-white hover:bg-[#d45a0a]'
                    }`}
                  >
                    {question.answer?.comment ? 'View Answer' : 'Answer'}
                  </button>
                )}
                <button
                  onClick={() => onArchive(question._id)}
                  className="p-2 hover:bg-[#f8f7f6] rounded-lg transition-colors"
                  title="Archive question"
                >
                  <Archive className="w-4 h-4 text-[#6b5d54]" />
                </button>
              </div>
            </div>

            {/* Question Content */}
            <div className="mb-4">
              <div className="flex items-start gap-2 mb-2">
                <MessageCircle className="w-5 h-5 text-[#ec6d13] flex-shrink-0 mt-0.5" />
                <p className="text-[#1b130d] font-medium">Question:</p>
              </div>
              <p className="text-[#6b5d54] leading-relaxed ml-7">{question.question}</p>
            </div>

            {/* Answer */}
            {question.answer?.comment && (
              <div className="bg-[#f8f7f6] border-l-4 border-[#ec6d13] rounded-lg p-4 mt-4">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-[#ec6d13]" />
                    <span className="font-semibold text-[#1b130d] text-sm">Your Answer</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onAnswer(question)}
                      className="p-1.5 hover:bg-white rounded transition-colors"
                      title="Edit answer"
                    >
                      <Edit className="w-4 h-4 text-[#6b5d54]" />
                    </button>
                    <button
                      onClick={() => onDeleteAnswer(question._id)}
                      className="p-1.5 hover:bg-white rounded transition-colors"
                      title="Delete answer"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
                <p className="text-[#6b5d54] leading-relaxed">{question.answer.comment}</p>
                <div className="flex items-center gap-2 mt-2 text-xs text-[#9a6c4c]">
                  <span>Answered by {question.answer.answeredBy?.name || 'You'}</span>
                  <span>•</span>
                  <span>{formatDistanceToNow(new Date(question.answer.answeredAt), { addSuffix: true })}</span>
                </div>
              </div>
            )}

            {/* Public/Private Indicator */}
            <div className="mt-4 flex items-center gap-2 text-sm">
              <span className={`px-2 py-1 rounded text-xs ${
                question.isPublic 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {question.isPublic ? 'Public' : 'Private'}
              </span>
              {question.helpful > 0 && (
                <span className="text-[#6b5d54]">
                  {question.helpful} people found this helpful
                </span>
              )}
            </div>
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
              {pagination.total} questions
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

export default QuestionsList;
