import { useState } from 'react';
import { X, Edit, Trash2, Ban, CheckCircle, UserCog, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UserActionsModal = ({ user, onClose, onUpdate, onDelete }) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    isSuspended: user.isSuspended,
    isVerified: user.isVerified
  });

  const handleUpdate = async () => {
    await onUpdate(user._id, formData);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete ${user.name}?`)) {
      await onDelete(user._id);
    }
  };

  const handleToggleSuspension = async () => {
    await onUpdate(user._id, { isSuspended: !user.isSuspended });
  };

  const handleToggleVerification = async () => {
    await onUpdate(user._id, { isVerified: !user.isVerified });
  };

  const handleViewVerificationRequest = () => {
    // Navigate to verification management and filter by this user
    navigate(`/admin/verifications?userId=${user._id}`);
    onClose();
  };

  if (isEditing) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-[#2a1e14] rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[#e7d9cf] dark:border-[#4a392b]">
            <h2 className="text-xl font-bold text-[#1b130d] dark:text-[#f3ece7]">
              Edit User
            </h2>
            <button
              onClick={() => setIsEditing(false)}
              className="text-[#9a6c4c] dark:text-[#a88e79] hover:text-[#1b130d] dark:hover:text-[#f3ece7]"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Edit Form */}
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#1b130d] dark:text-[#f3ece7] mb-2">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-[#e7d9cf] dark:border-[#4a392b] bg-[#f8f7f6] dark:bg-[#221810] text-[#1b130d] dark:text-[#f3ece7] focus:ring-2 focus:ring-[#ec6d13]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1b130d] dark:text-[#f3ece7] mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-[#e7d9cf] dark:border-[#4a392b] bg-[#f8f7f6] dark:bg-[#221810] text-[#1b130d] dark:text-[#f3ece7] focus:ring-2 focus:ring-[#ec6d13]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1b130d] dark:text-[#f3ece7] mb-2">
                Role
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-[#e7d9cf] dark:border-[#4a392b] bg-[#f8f7f6] dark:bg-[#221810] text-[#1b130d] dark:text-[#f3ece7] focus:ring-2 focus:ring-[#ec6d13]"
              >
                <option value="collector">Collector</option>
                <option value="artisan">Artisan</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="h-5 w-5 rounded border-[#e7d9cf] dark:border-[#4a392b] text-[#ec6d13] focus:ring-[#ec6d13]"
                />
                <span className="text-sm text-[#1b130d] dark:text-[#f3ece7]">Active</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.isVerified}
                  onChange={(e) => setFormData({ ...formData, isVerified: e.target.checked })}
                  className="h-5 w-5 rounded border-[#e7d9cf] dark:border-[#4a392b] text-[#ec6d13] focus:ring-[#ec6d13]"
                />
                <span className="text-sm text-[#1b130d] dark:text-[#f3ece7]">Verified</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.isSuspended}
                  onChange={(e) => setFormData({ ...formData, isSuspended: e.target.checked })}
                  className="h-5 w-5 rounded border-[#e7d9cf] dark:border-[#4a392b] text-[#ec6d13] focus:ring-[#ec6d13]"
                />
                <span className="text-sm text-[#1b130d] dark:text-[#f3ece7]">Suspended</span>
              </label>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 px-4 py-2 rounded-lg border border-[#e7d9cf] dark:border-[#4a392b] text-[#1b130d] dark:text-[#f3ece7] hover:bg-[#f8f7f6] dark:hover:bg-[#221810]"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="flex-1 px-4 py-2 rounded-lg bg-[#ec6d13] text-white font-medium hover:bg-[#d55a0a]"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-[#2a1e14] rounded-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#e7d9cf] dark:border-[#4a392b]">
          <h2 className="text-xl font-bold text-[#1b130d] dark:text-[#f3ece7]">
            User Actions
          </h2>
          <button
            onClick={onClose}
            className="text-[#9a6c4c] dark:text-[#a88e79] hover:text-[#1b130d] dark:hover:text-[#f3ece7]"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* User Info */}
        <div className="p-6 border-b border-[#e7d9cf] dark:border-[#4a392b]">
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-full bg-cover bg-center"
              style={{
                backgroundImage: user.avatar
                  ? `url(${user.avatar})`
                  : 'url(https://i.pravatar.cc/150?img=placeholder)'
              }}
            />
            <div>
              <h3 className="font-semibold text-[#1b130d] dark:text-[#f3ece7]">
                {user.name}
              </h3>
              <p className="text-sm text-[#9a6c4c] dark:text-[#a88e79]">{user.email}</p>
              <div className="flex gap-2 mt-1">
                <span className="text-xs px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200">
                  {user.role}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 space-y-2">
          <button
            onClick={() => setIsEditing(true)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#f8f7f6] dark:hover:bg-[#221810] text-[#1b130d] dark:text-[#f3ece7] transition-colors"
          >
            <Edit className="h-5 w-5" />
            <span>Edit User Details</span>
          </button>

          {user.role === 'artisan' && (
            <button
              onClick={handleViewVerificationRequest}
              className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-700 dark:text-blue-300 transition-colors"
            >
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5" />
                <span>View Verification Request</span>
              </div>
              <ExternalLink className="h-4 w-4" />
            </button>
          )}

          <button
            onClick={handleToggleVerification}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#f8f7f6] dark:hover:bg-[#221810] text-[#1b130d] dark:text-[#f3ece7] transition-colors"
          >
            <CheckCircle className="h-5 w-5" />
            <span>{user.isVerified ? 'Revoke Verification' : 'Mark as Verified'}</span>
          </button>

          <button
            onClick={handleToggleSuspension}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/20 text-amber-700 dark:text-amber-300 transition-colors"
          >
            <Ban className="h-5 w-5" />
            <span>{user.isSuspended ? 'Unsuspend User' : 'Suspend User'}</span>
          </button>

          <button
            onClick={handleDelete}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-700 dark:text-red-300 transition-colors"
          >
            <Trash2 className="h-5 w-5" />
            <span>Delete User</span>
          </button>
        </div>

        {/* Close Button */}
        <div className="p-6 pt-0">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 rounded-lg border border-[#e7d9cf] dark:border-[#4a392b] text-[#1b130d] dark:text-[#f3ece7] hover:bg-[#f8f7f6] dark:hover:bg-[#221810] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserActionsModal;
