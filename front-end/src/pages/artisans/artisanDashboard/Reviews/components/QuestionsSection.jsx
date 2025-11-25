import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '@/utils/api';
import { MessageCircle, Clock, CheckCircle, Archive } from 'lucide-react';
import QuestionsFilters from './QuestionsFilters';
import QuestionsList from './QuestionsList';
import AnswerModal from './AnswerModal';

const QuestionsSection = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [showAnswerModal, setShowAnswerModal] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    sortBy: 'createdAt',
    order: 'desc',
    page: 1,
    limit: 10
  });
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    answered: 0,
    archived: 0
  });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  });

  useEffect(() => {
    fetchQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const fetchQuestions = async () => {
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

      const response = await fetch(
        `${API_ENDPOINTS.questions}/artisan/my-questions?${queryParams}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch questions');
      }

      const result = await response.json();
      if (result.success) {
        setQuestions(result.data.questions);
        setStats(result.data.stats);
        setPagination(result.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (question) => {
    setSelectedQuestion(question);
    setShowAnswerModal(true);
  };

  const handleAnswerSubmit = async (questionId, answerText) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${API_ENDPOINTS.questions}/artisan/${questionId}/answer`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ answer: answerText })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to add answer');
      }

      await fetchQuestions();
      setShowAnswerModal(false);
      setSelectedQuestion(null);
    } catch (error) {
      console.error('Error adding answer:', error);
      throw error;
    }
  };

  const handleUpdateAnswer = async (questionId, answerText) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${API_ENDPOINTS.questions}/artisan/${questionId}/answer`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ answer: answerText })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update answer');
      }

      await fetchQuestions();
      setShowAnswerModal(false);
      setSelectedQuestion(null);
    } catch (error) {
      console.error('Error updating answer:', error);
      throw error;
    }
  };

  const handleDeleteAnswer = async (questionId) => {
    if (!window.confirm('Are you sure you want to delete this answer?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${API_ENDPOINTS.questions}/artisan/${questionId}/answer`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete answer');
      }

      await fetchQuestions();
    } catch (error) {
      console.error('Error deleting answer:', error);
    }
  };

  const handleArchiveQuestion = async (questionId) => {
    if (!window.confirm('Are you sure you want to archive this question?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${API_ENDPOINTS.questions}/artisan/${questionId}/archive`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to archive question');
      }

      await fetchQuestions();
    } catch (error) {
      console.error('Error archiving question:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#e8d5c4]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#6b5d54] mb-1">Total Questions</p>
              <p className="text-2xl font-bold text-[#1b130d]">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-[#ec6d13]/10 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-[#ec6d13]" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#e8d5c4]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#6b5d54] mb-1">Pending</p>
              <p className="text-2xl font-bold text-[#1b130d]">{stats.pending}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#e8d5c4]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#6b5d54] mb-1">Answered</p>
              <p className="text-2xl font-bold text-[#1b130d]">{stats.answered}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#e8d5c4]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#6b5d54] mb-1">Archived</p>
              <p className="text-2xl font-bold text-[#1b130d]">{stats.archived}</p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <Archive className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <QuestionsFilters filters={filters} setFilters={setFilters} />

      {/* Questions List */}
      <QuestionsList
        questions={questions}
        loading={loading}
        pagination={pagination}
        onPageChange={(page) => setFilters({ ...filters, page })}
        onAnswer={handleAnswer}
        onDeleteAnswer={handleDeleteAnswer}
        onArchive={handleArchiveQuestion}
      />

      {/* Answer Modal */}
      {showAnswerModal && selectedQuestion && (
        <AnswerModal
          question={selectedQuestion}
          onClose={() => {
            setShowAnswerModal(false);
            setSelectedQuestion(null);
          }}
          onSubmit={handleAnswerSubmit}
          onUpdate={handleUpdateAnswer}
        />
      )}
    </div>
  );
};

export default QuestionsSection;
