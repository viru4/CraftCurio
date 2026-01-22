import React, { useState, useEffect } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import ImageUpload from '@/components/common/ImageUpload';

const CategoryModal = ({ mode, category, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'artisan',
    icon: '',
    image: '',
    tags: [],
    status: 'approved'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (category && mode !== 'create') {
      setFormData({
        name: category.name || '',
        description: category.description || '',
        type: category.type || 'artisan',
        icon: category.icon || '',
        image: category.image || '',
        tags: category.tags || [],
        status: category.status || 'approved'
      });
    }
  }, [category, mode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageUpload = (urls) => {
    if (urls && urls.length > 0) {
      setFormData(prev => ({ ...prev, image: urls[0] }));
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Category name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.type) newErrors.type = 'Type is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    try {
      setLoading(true);
      await onSave(formData);
    } catch (error) {
      alert(error.message || 'Failed to save category');
    } finally {
      setLoading(false);
    }
  };

  const isViewMode = mode === 'view';

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity z-[9998]"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-[#2a1e14] rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden z-[9999]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e7d9cf] dark:border-[#3f2e1e] bg-white dark:bg-[#2a1e14]">
          <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
            {mode === 'create' && 'Add New Category'}
            {mode === 'edit' && 'Edit Category'}
            {mode === 'view' && 'View Category'}
          </h3>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-1 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4 max-h-[calc(90vh-140px)] overflow-y-auto bg-white dark:bg-[#2a1e14]">
            {/* Category Name */}
            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                Category Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={isViewMode}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec6d13] text-stone-900 dark:text-stone-100 ${
                  errors.name ? 'border-red-500' : 'border-[#e7d9cf] dark:border-[#3f2e1e]'
                } bg-white dark:bg-[#221810] ${isViewMode ? 'opacity-60 cursor-not-allowed' : ''}`}
                placeholder="Enter category name"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                Type *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                disabled={isViewMode || mode === 'edit'}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec6d13] text-stone-900 dark:text-stone-100 ${
                  errors.type ? 'border-red-500' : 'border-[#e7d9cf] dark:border-[#3f2e1e]'
                } bg-white dark:bg-[#221810] ${isViewMode || mode === 'edit' ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                <option value="artisan">Artisan</option>
                <option value="collectible">Collectible</option>
              </select>
              {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
              {mode === 'edit' && <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">Type cannot be changed after creation</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                disabled={isViewMode}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec6d13] text-stone-900 dark:text-stone-100 ${
                  errors.description ? 'border-red-500' : 'border-[#e7d9cf] dark:border-[#3f2e1e]'
                } bg-white dark:bg-[#221810] resize-none ${isViewMode ? 'opacity-60 cursor-not-allowed' : ''}`}
                placeholder="Enter category description"
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
            </div>

            {/* Icon */}
            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                Icon (optional)
              </label>
              <input
                type="text"
                name="icon"
                value={formData.icon}
                onChange={handleChange}
                disabled={isViewMode}
                className={`w-full px-3 py-2 border border-[#e7d9cf] dark:border-[#3f2e1e] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec6d13] bg-white dark:bg-[#221810] text-stone-900 dark:text-stone-100 ${isViewMode ? 'opacity-60 cursor-not-allowed' : ''}`}
                placeholder="e.g., 🎨 or icon name"
              />
            </div>

            {/* Image Upload */}
            {!isViewMode && (
              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                  Category Image
                </label>
                <ImageUpload
                  onImagesUploaded={handleImageUpload}
                  maxImages={1}
                  existingImages={formData.image ? [formData.image] : []}
                />
              </div>
            )}

            {/* Show image in view mode */}
            {isViewMode && formData.image && (
              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                  Category Image
                </label>
                <img 
                  src={formData.image} 
                  alt={formData.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            )}

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                Tags (optional)
              </label>
              {!isViewMode && (
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    className="flex-1 px-3 py-2 border border-[#e7d9cf] dark:border-[#3f2e1e] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec6d13] bg-white dark:bg-[#221810] text-stone-900 dark:text-stone-100"
                    placeholder="Add a tag and press Enter"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 bg-[#ec6d13] text-white rounded-lg hover:bg-[#ec6d13]/90 transition-colors"
                  >
                    Add
                  </button>
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-stone-100 dark:bg-[#3a2a1d] text-stone-700 dark:text-stone-300 rounded-full text-sm"
                  >
                    {tag}
                    {!isViewMode && (
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </span>
                ))}
              </div>
            </div>

            {/* Status (only for admin) */}
            {mode !== 'create' && !isViewMode && (
              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-[#e7d9cf] dark:border-[#3f2e1e] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec6d13] bg-white dark:bg-[#221810]"
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            )}

            {/* Additional info for view mode */}
            {isViewMode && category && (
              <div className="space-y-2 pt-4 border-t border-[#e7d9cf] dark:border-[#3f2e1e]">
                <div className="flex justify-between text-sm">
                  <span className="text-stone-500 dark:text-stone-400">Status:</span>
                  <span className="font-medium capitalize">{category.status}</span>
                </div>
                {category.submittedBy && (
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-500 dark:text-stone-400">Submitted By:</span>
                    <span className="font-medium">
                      {`${category.submittedBy.firstName || ''} ${category.submittedBy.lastName || ''}`.trim() || category.submittedBy.email}
                    </span>
                  </div>
                )}
                {category.reviewedBy && (
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-500 dark:text-stone-400">Reviewed By:</span>
                    <span className="font-medium">
                      {`${category.reviewedBy.firstName || ''} ${category.reviewedBy.lastName || ''}`.trim() || category.reviewedBy.email}
                    </span>
                  </div>
                )}
                {category.rejectionReason && (
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-500 dark:text-stone-400">Rejection Reason:</span>
                    <span className="font-medium text-red-600">{category.rejectionReason}</span>
                  </div>
                )}
              </div>
            )}
          </form>

          {/* Footer */}
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-[#e7d9cf] dark:border-[#3f2e1e] flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 bg-white dark:bg-[#2a1e14]">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto order-2 sm:order-1 px-4 py-2 text-sm sm:text-base border border-[#e7d9cf] dark:border-[#3f2e1e] rounded-lg hover:bg-stone-50 dark:hover:bg-[#3a2a1d] transition-colors text-stone-700 dark:text-stone-300"
            >
              {isViewMode ? 'Close' : 'Cancel'}
            </button>
            {!isViewMode && (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full sm:w-auto order-1 sm:order-2 px-4 py-2 text-sm sm:text-base bg-[#ec6d13] text-white rounded-lg hover:bg-[#ec6d13]/90 transition-colors disabled:opacity-50"
              >
                {loading ? 'Saving...' : mode === 'create' ? 'Create Category' : 'Save Changes'}
              </button>
            )}
          </div>
        </div>
      </div>
  );
};

export default CategoryModal;
