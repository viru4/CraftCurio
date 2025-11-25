import { useState, useEffect } from 'react';
import { HelpCircle, ThumbsUp, User, Calendar, MessageCircle, X, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';
import { API_BASE_URL } from '../../utils/api';

const ProductQASection = ({ product }) => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterStatus, setFilterStatus] = useState('all'); // all, answered, pending
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [questionText, setQuestionText] = useState('');
  const [questionError, setQuestionError] = useState('');

  useEffect(() => {
    fetchQuestions();
  }, [product._id, currentPage]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/api/questions/product/${product._id}?page=${currentPage}&limit=10`
      );
      const data = await response.json();

      if (data.success) {
        setQuestions(data.data.questions);
        setStats(data.data.stats);
        setTotalPages(data.data.pagination.totalPages);
      }
    } catch (err) {
      console.error('Error fetching questions:', err);
    } finally {
      setLoading(false);
    }
  };

  const validateQuestion = () => {
    if (!questionText.trim()) {
      setQuestionError('Question is required');
      return false;
    }
    if (questionText.length > 500) {
      setQuestionError('Question must be 500 characters or less');
      return false;
    }
    setQuestionError('');
    return true;
  };

  const handleSubmitQuestion = async (e) => {
    e.preventDefault();
    
    if (!validateQuestion()) return;

    try {
      setSubmitting(true);
      setError('');
      setSuccess('');

      const token = localStorage.getItem('token');
      const response = await fetch(
        `${API_BASE_URL}/api/questions/product/${product._id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ question: questionText })
        }
      );

      const data = await response.json();

      if (data.success) {
        setSuccess('Question submitted successfully! The artisan will answer soon.');
        setQuestionText('');
        setShowForm(false);
        fetchQuestions();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.message || 'Failed to submit question');
      }
    } catch (err) {
      setError('Error submitting question. Please try again.');
      console.error('Submit question error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredQuestions = questions.filter(q => {
    if (filterStatus === 'answered') return q.status === 'answered';
    if (filterStatus === 'pending') return q.status === 'pending';
    return true;
  });

  if (loading && questions.length === 0) {
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

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-[#f8f7f6] border border-[#e8d5c4] rounded-lg p-4">
          <div className="text-2xl font-bold text-[#1b130d]">{stats?.total || 0}</div>
          <div className="text-sm text-[#6b5d54]">Total Questions</div>
        </div>
        <div className="bg-[#f8f7f6] border border-[#e8d5c4] rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600">{stats?.answered || 0}</div>
          <div className="text-sm text-[#6b5d54]">Answered</div>
        </div>
        <div className="col-span-2 md:col-span-1 bg-[#f8f7f6] border border-[#e8d5c4] rounded-lg p-4">
          <div className="text-2xl font-bold text-orange-600">{stats?.pending || 0}</div>
          <div className="text-sm text-[#6b5d54]">Pending</div>
        </div>
      </div>

      {/* Ask Question Button */}
      {user ? (
        <div>
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="w-full md:w-auto px-6 py-3 bg-[#ec6d13] text-white rounded-lg hover:bg-[#d96012] transition-colors font-medium flex items-center justify-center gap-2"
            >
              <HelpCircle size={20} />
              Ask a Question
            </button>
          ) : (
            <div className="bg-white border border-[#e8d5c4] rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-[#1b130d]">Ask Your Question</h3>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setQuestionError('');
                    setError('');
                  }}
                  className="text-[#6b5d54] hover:text-[#1b130d]"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmitQuestion} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#1b130d] mb-2">
                    Your Question *
                  </label>
                  <textarea
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec6d13] min-h-[100px] resize-y ${
                      questionError ? 'border-red-500' : 'border-[#e8d5c4]'
                    }`}
                    placeholder="Ask anything about this product..."
                    maxLength={500}
                  />
                  <div className="flex justify-between mt-1">
                    {questionError && (
                      <span className="text-sm text-red-500">{questionError}</span>
                    )}
                    <span className="text-xs text-[#6b5d54] ml-auto">
                      {questionText.length}/500
                    </span>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    <strong>Tip:</strong> The artisan will be notified and will answer your question soon.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-6 py-2 bg-[#ec6d13] text-white rounded-lg hover:bg-[#d96012] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Submitting...' : 'Submit Question'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setQuestionError('');
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
            Please <a href="/sign-in" className="text-[#ec6d13] hover:underline">sign in</a> to ask a question
          </p>
        </div>
      )}

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'answered', 'pending'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === status
                ? 'bg-[#ec6d13] text-white'
                : 'bg-[#f8f7f6] text-[#6b5d54] border border-[#e8d5c4] hover:bg-[#e8d5c4]'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <div className="text-center py-12 px-4">
            <HelpCircle size={48} className="mx-auto text-[#e8d5c4] mb-4" />
            <p className="text-[#6b5d54]">
              {filterStatus === 'all' 
                ? 'No questions yet. Be the first to ask!'
                : `No ${filterStatus} questions.`}
            </p>
          </div>
        ) : (
          filteredQuestions.map((question) => (
            <div
              key={question._id}
              className="bg-white border border-[#e8d5c4] rounded-lg p-6 space-y-4"
            >
              {/* Question Header */}
              <div className="flex items-start justify-between">
                <div className="flex gap-3 flex-1">
                  <div className="w-10 h-10 rounded-full bg-[#e8d5c4] flex items-center justify-center flex-shrink-0">
                    {question.user?.profileImage ? (
                      <img
                        src={question.user.profileImage}
                        alt={question.user.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <User size={20} className="text-[#6b5d54]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#1b130d]">{question.user?.name || 'Anonymous'}</p>
                    <p className="text-sm text-[#6b5d54]">
                      <Calendar size={14} className="inline mr-1" />
                      {format(new Date(question.createdAt), 'MMM dd, yyyy')}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap ${
                    question.status === 'answered'
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'bg-orange-50 text-orange-700 border border-orange-200'
                  }`}
                >
                  {question.status === 'answered' ? (
                    <>
                      <CheckCircle size={12} className="inline mr-1" />
                      Answered
                    </>
                  ) : (
                    'Pending'
                  )}
                </span>
              </div>

              {/* Question Content */}
              <div className="pl-13">
                <p className="text-[#1b130d] leading-relaxed">{question.question}</p>
              </div>

              {/* Answer */}
              {question.answer?.comment && (
                <div className="ml-8 pl-4 border-l-2 border-[#ec6d13] bg-[#f8f7f6] p-4 rounded-r-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageCircle size={16} className="text-[#ec6d13]" />
                    <p className="text-sm font-medium text-[#1b130d]">
                      Answer from {product.artisanInfo?.name || 'Artisan'}
                    </p>
                  </div>
                  <p className="text-sm text-[#6b5d54] leading-relaxed">{question.answer.comment}</p>
                  <p className="text-xs text-[#6b5d54] mt-2">
                    {format(new Date(question.answer.answeredAt), 'MMM dd, yyyy')}
                  </p>
                </div>
              )}

              {/* Helpful Button */}
              <div className="flex items-center gap-2 pl-13">
                <button className="flex items-center gap-2 px-3 py-1 text-sm text-[#6b5d54] hover:text-[#ec6d13] transition-colors">
                  <ThumbsUp size={16} />
                  <span>Helpful ({question.helpfulCount || 0})</span>
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

export default ProductQASection;
