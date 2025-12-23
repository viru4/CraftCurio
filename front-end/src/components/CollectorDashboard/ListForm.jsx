import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ImageUpload from '../common/ImageUpload';

/**
 * ListForm Component - Form for creating or editing collectible listings
 * Supports both direct sale and auction listing types
 * Includes image preview, validation, and dynamic auction fields
 */

// Categories list - defined outside component to prevent re-renders
const CATEGORIES = [
  'Pottery',
  'Textiles',
  'Jewelry',
  'Woodwork',
  'Metalwork',
  'Glass',
  'Painting',
  'Sculpture',
  'Other',
];

const ListForm = ({
  initialData = null,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const isEditMode = !!initialData;

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    image: '',
    saleType: 'direct',
    // Auction-specific fields
    startingBid: '',
    reservePrice: '',
    buyNowPrice: '',
    startTime: '',
    endTime: '',
  });

  const [errors, setErrors] = useState({});
  const [uploadError, setUploadError] = useState(null);
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategoryValue, setCustomCategoryValue] = useState('');

  // Load initial data for edit mode
  useEffect(() => {
    if (initialData) {
      const isAuction = initialData.saleType === 'auction';
      
      // Check if category is custom (not in predefined list)
      const categoryValue = initialData.category || '';
      const isCustom = categoryValue && !CATEGORIES.includes(categoryValue);
      
      if (isCustom) {
        setIsCustomCategory(true);
        setCustomCategoryValue(categoryValue);
      }

      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        price: isAuction ? '' : initialData.price?.toString() || '',
        category: categoryValue,
        image: initialData.image || '',
        saleType: initialData.saleType || 'direct',
        // Auction fields
        startingBid: isAuction ? initialData.auction?.startingBid?.toString() || '' : '',
        reservePrice: isAuction ? initialData.auction?.reservePrice?.toString() || '' : '',
        buyNowPrice: isAuction ? initialData.auction?.buyNowPrice?.toString() || '' : '',
        startTime: isAuction ? formatDateTimeForInput(initialData.auction?.startTime) : '',
        endTime: isAuction ? formatDateTimeForInput(initialData.auction?.endTime) : '',
      });

      // Image will be shown in ImageUpload component
    }
  }, [initialData]);

  // Format date for datetime-local input
  const formatDateTimeForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Image handled by ImageUpload component
  };

  // Handle sale type change
  const handleSaleTypeChange = (e) => {
    const newSaleType = e.target.value;
    setFormData(prev => ({
      ...prev,
      saleType: newSaleType,
      // Reset type-specific fields
      price: '',
      startingBid: '',
      reservePrice: '',
      buyNowPrice: '',
      startTime: '',
      endTime: '',
    }));
    setErrors({});
  };

  // Validate form
  const validate = () => {
    const newErrors = {};

    // Common validations
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.image || !formData.image.trim()) {
      newErrors.image = 'Image is required';
    }

    // Sale-type specific validations
    if (formData.saleType === 'direct') {
      if (!formData.price) {
        newErrors.price = 'Price is required';
      } else if (parseFloat(formData.price) <= 0) {
        newErrors.price = 'Price must be greater than 0';
      }
    } else if (formData.saleType === 'auction') {
      // Starting bid
      if (!formData.startingBid) {
        newErrors.startingBid = 'Starting bid is required';
      } else if (parseFloat(formData.startingBid) <= 0) {
        newErrors.startingBid = 'Starting bid must be greater than 0';
      }

      // Reserve price (optional)
      if (formData.reservePrice) {
        const reserve = parseFloat(formData.reservePrice);
        const starting = parseFloat(formData.startingBid);
        if (reserve <= 0) {
          newErrors.reservePrice = 'Reserve price must be greater than 0';
        } else if (reserve < starting) {
          newErrors.reservePrice = 'Reserve price must be >= starting bid';
        }
      }

      // Buy now price (optional)
      if (formData.buyNowPrice) {
        const buyNow = parseFloat(formData.buyNowPrice);
        const starting = parseFloat(formData.startingBid);
        if (buyNow <= 0) {
          newErrors.buyNowPrice = 'Buy now price must be greater than 0';
        } else if (buyNow <= starting) {
          newErrors.buyNowPrice = 'Buy now price must be > starting bid';
        }
      }

      // Times
      if (!formData.startTime) {
        newErrors.startTime = 'Start time is required';
      } else {
        const startDate = new Date(formData.startTime);
        const now = new Date();
        if (!isEditMode && startDate < now) {
          newErrors.startTime = 'Start time cannot be in the past';
        }
      }

      if (!formData.endTime) {
        newErrors.endTime = 'End time is required';
      } else if (formData.startTime) {
        const startDate = new Date(formData.startTime);
        const endDate = new Date(formData.endTime);
        if (endDate <= startDate) {
          newErrors.endTime = 'End time must be after start time';
        }
        // Check minimum duration (e.g., 1 hour)
        const duration = endDate - startDate;
        if (duration < 3600000) { // 1 hour in milliseconds
          newErrors.endTime = 'Auction must run for at least 1 hour';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle image upload completion
  const handleImageUpload = (uploadedUrl) => {
    setFormData(prev => ({
      ...prev,
      image: uploadedUrl
    }));
    setUploadError(null);
    // Clear image error if exists
    if (errors.image) {
      setErrors(prev => ({ ...prev, image: '' }));
    }
  };

  // Handle image upload error
  const handleImageUploadError = (error) => {
    setUploadError(error.message || 'Failed to upload image');
    setErrors(prev => ({ ...prev, image: 'Image upload failed' }));
  };

  // Handle image removal
  const handleImageRemove = () => {
    setFormData(prev => ({ ...prev, image: '' }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    // Prepare data for submission
    const submitData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category,
      image: formData.image.trim(),
      saleType: formData.saleType,
    };

    if (formData.saleType === 'direct') {
      submitData.price = parseFloat(formData.price);
    } else {
      // For auctions, price field should be the starting bid
      submitData.price = parseFloat(formData.startingBid);
      submitData.auction = {
        startTime: new Date(formData.startTime).toISOString(),
        endTime: new Date(formData.endTime).toISOString(),
      };

      if (formData.reservePrice) {
        submitData.auction.reservePrice = parseFloat(formData.reservePrice);
      }

      if (formData.buyNowPrice) {
        submitData.auction.buyNowPrice = parseFloat(formData.buyNowPrice);
      }
    }

    try {
      await onSubmit(submitData);
    } catch (error) {
      console.error('Form submission error:', error);
      setErrors({ submit: error.message || 'Failed to submit form' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {isEditMode ? 'Edit Collectible' : 'Add New Collectible'}
      </h2>

      {/* Error Alert */}
      {errors.submit && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {errors.submit}
        </div>
      )}

      {/* Basic Information */}
      <div className="space-y-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Basic Information</h3>

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.title ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-orange-500'
              }`}
            placeholder="e.g., Handcrafted Ceramic Vase"
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.description ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-orange-500'
              }`}
            placeholder="Describe your collectible in detail..."
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category <span className="text-red-500">*</span>
          </label>
          {!isCustomCategory ? (
            <div className="flex gap-2">
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={(e) => {
                  if (e.target.value === 'custom') {
                    setIsCustomCategory(true);
                    setFormData(prev => ({ ...prev, category: '' }));
                  } else {
                    handleChange(e);
                  }
                }}
                className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.category ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-orange-500'
                  }`}
              >
                <option value="">Select a category</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
                <option value="custom">+ Add Custom Category</option>
              </select>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                value={customCategoryValue}
                onChange={(e) => {
                  setCustomCategoryValue(e.target.value);
                  setFormData(prev => ({ ...prev, category: e.target.value }));
                }}
                placeholder="Enter custom category"
                className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.category ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-orange-500'
                  }`}
              />
              <button
                type="button"
                onClick={() => {
                  setIsCustomCategory(false);
                  setCustomCategoryValue('');
                  setFormData(prev => ({ ...prev, category: '' }));
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          )}
          {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Image <span className="text-red-500">*</span>
          </label>
          <ImageUpload
            onUploadComplete={handleImageUpload}
            onUploadError={handleImageUploadError}
            multiple={false}
            currentImages={formData.image ? [formData.image] : []}
            onRemoveImage={handleImageRemove}
            label="Upload Collectible Image"
            folder="collectibles"
            showPreview={true}
          />
          {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
          {uploadError && <p className="text-red-500 text-sm mt-1">{uploadError}</p>}
        </div>
      </div>

      {/* Sale Type Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Sale Type</h3>
        <div className="flex gap-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="saleType"
              value="direct"
              checked={formData.saleType === 'direct'}
              onChange={handleSaleTypeChange}
              className="mr-2"
              disabled={isEditMode} // Can't change sale type in edit mode
            />
            <span className="font-medium">Direct Sale</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="saleType"
              value="auction"
              checked={formData.saleType === 'auction'}
              onChange={handleSaleTypeChange}
              className="mr-2"
              disabled={isEditMode} // Can't change sale type in edit mode
            />
            <span className="font-medium">Auction</span>
          </label>
        </div>
        {isEditMode && (
          <p className="text-sm text-gray-500 mt-1">Sale type cannot be changed after creation</p>
        )}
      </div>

      {/* Direct Sale Fields */}
      {formData.saleType === 'direct' && (
        <div className="mb-6 p-4 bg-blue-50 rounded-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Direct Sale Details</h3>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Price (₹) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              min="0"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.price ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-orange-500'
                }`}
              placeholder="0.00"
            />
            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
          </div>
        </div>
      )}

      {/* Auction Fields */}
      {formData.saleType === 'auction' && (
        <div className="mb-6 p-4 bg-orange-50 rounded-md space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Auction Details</h3>

          {/* Starting Bid */}
          <div>
            <label htmlFor="startingBid" className="block text-sm font-medium text-gray-700 mb-1">
              Starting Bid (₹) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="startingBid"
              name="startingBid"
              value={formData.startingBid}
              onChange={handleChange}
              step="0.01"
              min="0"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.startingBid ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-orange-500'
                }`}
              placeholder="0.00"
            />
            {errors.startingBid && <p className="text-red-500 text-sm mt-1">{errors.startingBid}</p>}
          </div>

          {/* Reserve Price */}
          <div>
            <label htmlFor="reservePrice" className="block text-sm font-medium text-gray-700 mb-1">
              Reserve Price (₹) <span className="text-gray-500">(Optional)</span>
            </label>
            <input
              type="number"
              id="reservePrice"
              name="reservePrice"
              value={formData.reservePrice}
              onChange={handleChange}
              step="0.01"
              min="0"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.reservePrice ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-orange-500'
                }`}
              placeholder="0.00"
            />
            {errors.reservePrice && <p className="text-red-500 text-sm mt-1">{errors.reservePrice}</p>}
            <p className="text-xs text-gray-500 mt-1">Minimum price to sell (not visible to bidders)</p>
          </div>

          {/* Buy Now Price */}
          <div>
            <label htmlFor="buyNowPrice" className="block text-sm font-medium text-gray-700 mb-1">
              Buy Now Price (₹) <span className="text-gray-500">(Optional)</span>
            </label>
            <input
              type="number"
              id="buyNowPrice"
              name="buyNowPrice"
              value={formData.buyNowPrice}
              onChange={handleChange}
              step="0.01"
              min="0"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.buyNowPrice ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-orange-500'
                }`}
              placeholder="0.00"
            />
            {errors.buyNowPrice && <p className="text-red-500 text-sm mt-1">{errors.buyNowPrice}</p>}
            <p className="text-xs text-gray-500 mt-1">Allow instant purchase at this price</p>
          </div>

          {/* Auction Times */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                Start Time <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                id="startTime"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.startTime ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-orange-500'
                  }`}
              />
              {errors.startTime && <p className="text-red-500 text-sm mt-1">{errors.startTime}</p>}
            </div>

            <div>
              <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
                End Time <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                id="endTime"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.endTime ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-orange-500'
                  }`}
              />
              {errors.endTime && <p className="text-red-500 text-sm mt-1">{errors.endTime}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Form Actions */}
      <div className="flex gap-4 justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : isEditMode ? 'Update Listing' : 'Create Listing'}
        </button>
      </div>
    </form>
  );
};

ListForm.propTypes = {
  initialData: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export default ListForm;
