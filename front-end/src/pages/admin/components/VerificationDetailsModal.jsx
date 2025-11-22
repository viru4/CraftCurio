import React, { useState } from 'react';
import { X, CheckCircle, XCircle, Download, ExternalLink, User, FileText, Award, Building } from 'lucide-react';

const VerificationDetailsModal = ({ verification, onClose, onApprove, onReject }) => {
  const [action, setAction] = useState(null); // 'approve' or 'reject'
  const [comments, setComments] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (action === 'reject' && !comments.trim()) {
      alert('Please provide rejection comments');
      return;
    }

    setLoading(true);
    try {
      if (action === 'approve') {
        await onApprove(verification._id, comments);
      } else if (action === 'reject') {
        await onReject(verification._id, comments);
      }
    } finally {
      setLoading(false);
    }
  };

  const openDocument = (url) => {
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Verification Request Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Artisan Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <User className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-blue-900">Artisan Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-blue-700 mb-1">Full Name</p>
                <p className="font-medium text-blue-900">{verification.fullName}</p>
              </div>
              <div>
                <p className="text-sm text-blue-700 mb-1">Email</p>
                <p className="font-medium text-blue-900">{verification.userId?.email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-blue-700 mb-1">Artisan ID</p>
                <p className="font-mono text-sm text-blue-900">{verification.artisanId}</p>
              </div>
              <div>
                <p className="text-sm text-blue-700 mb-1">Submitted On</p>
                <p className="font-medium text-blue-900">
                  {new Date(verification.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Identification Details */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Identification Details</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">ID Type</p>
                <p className="font-medium text-gray-900 capitalize">
                  {verification.idType.replace('_', ' ')}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">ID Number</p>
                <p className="font-medium text-gray-900">{verification.idNumber}</p>
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Submitted Documents</h3>
            </div>
            <div className="space-y-3">
              {/* ID Document */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">Government ID</p>
                    <p className="text-sm text-gray-600">Identity verification document</p>
                  </div>
                </div>
                <button
                  onClick={() => openDocument(verification.idDocumentUrl)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  View
                </button>
              </div>

              {/* Craft Proof */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">Craft Proof</p>
                    <p className="text-sm text-gray-600">Certificates or craft credentials</p>
                  </div>
                </div>
                <button
                  onClick={() => openDocument(verification.craftProofUrl)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  View
                </button>
              </div>

              {/* Business Registration */}
              {verification.businessRegistrationUrl && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Building className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">Business Registration</p>
                      <p className="text-sm text-gray-600">Optional business documents</p>
                    </div>
                  </div>
                  <button
                    onClick={() => openDocument(verification.businessRegistrationUrl)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Additional Information */}
          {verification.additionalInfo && (
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Additional Information</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{verification.additionalInfo}</p>
            </div>
          )}

          {/* Current Status */}
          {verification.status !== 'pending' && (
            <div className={`border rounded-lg p-4 ${
              verification.status === 'approved' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
            }`}>
              <h3 className={`text-lg font-semibold mb-2 ${
                verification.status === 'approved' ? 'text-green-900' : 'text-red-900'
              }`}>
                Current Status: {verification.status.charAt(0).toUpperCase() + verification.status.slice(1)}
              </h3>
              {verification.reviewedBy && (
                <p className={`text-sm mb-2 ${
                  verification.status === 'approved' ? 'text-green-700' : 'text-red-700'
                }`}>
                  Reviewed by: {verification.reviewedBy.email} on {new Date(verification.reviewedAt).toLocaleString()}
                </p>
              )}
              {verification.adminComments && (
                <div className="mt-2">
                  <p className={`text-sm font-medium mb-1 ${
                    verification.status === 'approved' ? 'text-green-800' : 'text-red-800'
                  }`}>
                    Admin Comments:
                  </p>
                  <p className={verification.status === 'approved' ? 'text-green-700' : 'text-red-700'}>
                    {verification.adminComments}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Action Section - Only for pending requests */}
          {verification.status === 'pending' && !action && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Action</h3>
              <div className="flex gap-4">
                <button
                  onClick={() => setAction('approve')}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  <CheckCircle className="w-5 h-5" />
                  Approve Verification
                </button>
                <button
                  onClick={() => setAction('reject')}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  <XCircle className="w-5 h-5" />
                  Reject Verification
                </button>
              </div>
            </div>
          )}

          {/* Comments Section */}
          {action && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {action === 'approve' ? 'Approval' : 'Rejection'} Comments
                {action === 'reject' && <span className="text-red-600"> *</span>}
              </h3>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder={action === 'approve' 
                  ? 'Add optional approval comments...' 
                  : 'Explain why this verification is being rejected (required)...'}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleSubmit}
                  disabled={loading || (action === 'reject' && !comments.trim())}
                  className={`flex-1 px-6 py-3 rounded-lg font-medium text-white transition-colors ${
                    action === 'approve'
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-red-600 hover:bg-red-700'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loading ? 'Processing...' : `Confirm ${action === 'approve' ? 'Approval' : 'Rejection'}`}
                </button>
                <button
                  onClick={() => {
                    setAction(null);
                    setComments('');
                  }}
                  disabled={loading}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerificationDetailsModal;
