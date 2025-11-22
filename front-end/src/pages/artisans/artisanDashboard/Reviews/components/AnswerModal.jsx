import { useState, useEffect } from 'react';
import { X, MessageCircle, Lightbulb } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const AnswerModal = ({ question, onClose, onSubmit, onUpdate }) => {
  const [answerText, setAnswerText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const isEditing = !!question.answer?.comment;

  useEffect(() => {
    if (isEditing) {
      setAnswerText(question.answer.comment);
    }
  }, [question, isEditing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!answerText.trim()) {
      setError('Please enter an answer');
      return;
    }

    if (answerText.length > 1000) {
      setError('Answer must not exceed 1000 characters');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      if (isEditing) {
        await onUpdate(question._id, answerText);
      } else {
        await onSubmit(question._id, answerText);
      }
    } catch (err) {
      setError(err.message || 'Failed to submit answer');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-[#e8d5c4] px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#1b130d]">
            {isEditing ? 'Edit Answer' : 'Answer Question'}
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
          {/* Question Display */}
          <div className="bg-[#f8f7f6] rounded-xl p-4 sm:p-6 mb-6">
            {/* Product Info */}
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <img
                src={question.product?.images?.[0] || '/placeholder.png'}
                alt={question.product?.title}
                className="w-20 h-20 object-cover rounded-lg border border-[#e8d5c4]"
              />
              <div className="flex-1">
                <h4 className="font-semibold text-[#1b130d] mb-2">
                  {question.product?.title}
                </h4>
                <div className="flex items-center gap-2 text-sm text-[#6b5d54]">
                  <span>{question.user?.name || 'Anonymous'}</span>
                  <span>•</span>
                  <span>{formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}</span>
                </div>
              </div>
            </div>

            {/* Question Content */}
            <div className="flex items-start gap-2">
              <MessageCircle className="w-5 h-5 text-[#ec6d13] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-[#1b130d] mb-1">Question:</p>
                <p className="text-[#6b5d54] leading-relaxed">{question.question}</p>
              </div>
            </div>
          </div>

          {/* Answer Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#1b130d] mb-2">
                Your Answer
              </label>
              <textarea
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                placeholder="Provide a detailed and helpful answer..."
                rows={8}
                maxLength={1000}
                className="w-full px-4 py-3 border border-[#e8d5c4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec6d13] focus:border-transparent resize-none"
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-[#6b5d54]">
                  {answerText.length}/1000 characters
                </span>
                {error && (
                  <span className="text-sm text-red-500">{error}</span>
                )}
              </div>
            </div>

            {/* Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-2">
                <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1">Answer Tips</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Be specific and thorough in your response</li>
                    <li>• Include relevant product details or specifications</li>
                    <li>• Share your expertise about the craft or materials</li>
                    <li>• Be friendly and professional</li>
                    <li>• Offer to provide additional information if needed</li>
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
                disabled={isSubmitting || !answerText.trim()}
                className="px-6 py-2.5 bg-[#ec6d13] text-white rounded-lg font-medium hover:bg-[#d45a0a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <span>{isEditing ? 'Update Answer' : 'Submit Answer'}</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AnswerModal;
