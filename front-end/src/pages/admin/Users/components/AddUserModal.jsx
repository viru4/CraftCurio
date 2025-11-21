import { useState } from 'react';
import { X } from 'lucide-react';

const AddUserModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'collector',
    isActive: true
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      setErrors({ submit: 'Failed to create user' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-[#2a1e14] rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#e7d9cf] dark:border-[#4a392b]">
          <h2 className="text-xl font-bold text-[#1b130d] dark:text-[#f3ece7]">
            Add New User
          </h2>
          <button
            onClick={onClose}
            className="text-[#9a6c4c] dark:text-[#a88e79] hover:text-[#1b130d] dark:hover:text-[#f3ece7] transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-[#1b130d] dark:text-[#f3ece7] mb-2">
              Full Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.name ? 'border-red-500' : 'border-[#e7d9cf] dark:border-[#4a392b]'
              } bg-[#f8f7f6] dark:bg-[#221810] text-[#1b130d] dark:text-[#f3ece7] focus:ring-2 focus:ring-[#ec6d13] focus:border-transparent`}
              placeholder="Enter full name"
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-[#1b130d] dark:text-[#f3ece7] mb-2">
              Email Address *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.email ? 'border-red-500' : 'border-[#e7d9cf] dark:border-[#4a392b]'
              } bg-[#f8f7f6] dark:bg-[#221810] text-[#1b130d] dark:text-[#f3ece7] focus:ring-2 focus:ring-[#ec6d13] focus:border-transparent`}
              placeholder="email@example.com"
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-[#1b130d] dark:text-[#f3ece7] mb-2">
              Password *
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.password ? 'border-red-500' : 'border-[#e7d9cf] dark:border-[#4a392b]'
              } bg-[#f8f7f6] dark:bg-[#221810] text-[#1b130d] dark:text-[#f3ece7] focus:ring-2 focus:ring-[#ec6d13] focus:border-transparent`}
              placeholder="Minimum 6 characters"
            />
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-[#1b130d] dark:text-[#f3ece7] mb-2">
              Role *
            </label>
            <select
              value={formData.role}
              onChange={(e) => handleChange('role', e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-[#e7d9cf] dark:border-[#4a392b] bg-[#f8f7f6] dark:bg-[#221810] text-[#1b130d] dark:text-[#f3ece7] focus:ring-2 focus:ring-[#ec6d13] focus:border-transparent"
            >
              <option value="collector">Collector</option>
              <option value="artisan">Artisan</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Status */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => handleChange('isActive', e.target.checked)}
              className="h-5 w-5 rounded border-[#e7d9cf] dark:border-[#4a392b] text-[#ec6d13] focus:ring-[#ec6d13] focus:ring-offset-0"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-[#1b130d] dark:text-[#f3ece7]">
              Set account as active
            </label>
          </div>

          {errors.submit && (
            <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
              {errors.submit}
            </p>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg border border-[#e7d9cf] dark:border-[#4a392b] text-[#1b130d] dark:text-[#f3ece7] hover:bg-[#f8f7f6] dark:hover:bg-[#221810] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 rounded-lg bg-[#ec6d13] text-white font-medium hover:bg-[#d55a0a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;
