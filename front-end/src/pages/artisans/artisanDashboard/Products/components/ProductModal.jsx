import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import ImageUpload from '@/components/common/ImageUpload';
import ContentGenerator from '@/components/common/ContentGenerator';

const ProductModal = ({ product, categories, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    description: '',
    price: '',
    currency: 'INR',
    stockQuantity: '',
    category: '',
    status: 'pending',
    images: [],
    craftMethod: '',
    provenance: '',
    craftingStory: '',
    productStoryText: '',
    storyMediaUrls: [],
    authenticityCertificateUrl: '',
    availability: true,
    weight: '',
    height: '',
    width: '',
    depth: '',
    estimatedDeliveryDays: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [certificateUrl, setCertificateUrl] = useState('');

  useEffect(() => {
    if (product) {
      // Map product data to form structure
      setFormData({
        id: product.id || '',
        title: product.title || product.name || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        currency: product.currency || 'INR',
        stockQuantity: product.stockQuantity?.toString() || product.stock?.toString() || '',
        category: typeof product.category === 'object' ? product.category.name || product.category._id : product.category || '',
        status: product.status || 'pending',
        images: product.images || [],
        craftMethod: product.craftMethod || '',
        provenance: product.provenance || '',
        craftingStory: product.craftingStory || '',
        productStoryText: product.productStory?.storyText || product.productStoryText || '',
        storyMediaUrls: product.productStory?.storyMediaUrls || product.productStory?.media || [],
        authenticityCertificateUrl: product.authenticityCertificateUrl || '',
        availability: product.availability !== false,
        weight: product.shippingInfo?.weight?.toString() || product.weight?.toString() || '',
        height: product.shippingInfo?.dimensions?.height?.toString() || '',
        width: product.shippingInfo?.dimensions?.width?.toString() || '',
        depth: product.shippingInfo?.dimensions?.depth?.toString() || '',
        estimatedDeliveryDays: product.shippingInfo?.estimatedDeliveryDays?.toString() || ''
      });
      setCertificateUrl(product.authenticityCertificateUrl || '');
    }
  }, [product]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = 'Product title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Valid price is required';
    if (!formData.stockQuantity || parseInt(formData.stockQuantity) < 0) newErrors.stockQuantity = 'Valid stock quantity is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (formData.images.length === 0) newErrors.images = 'At least one product image is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert('Please fill in all required fields correctly.');
      return;
    }

    setLoading(true);
    try {
      // Prepare data in the format expected by the API
      const productData = {
        id: formData.id,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        images: formData.images,
        price: parseFloat(formData.price),
        currency: formData.currency,
        stockQuantity: parseInt(formData.stockQuantity) || 0,
        craftMethod: formData.craftMethod,
        provenance: formData.provenance,
        craftingStory: formData.craftingStory,
        productStory: {
          storyText: formData.productStoryText,
          storyMediaUrls: formData.storyMediaUrls.filter(url => url.trim())
        },
        authenticityCertificateUrl: certificateUrl,
        availability: formData.availability,
        shippingInfo: {
          weight: formData.weight ? parseFloat(formData.weight) : undefined,
          dimensions: {
            height: formData.height ? parseFloat(formData.height) : undefined,
            width: formData.width ? parseFloat(formData.width) : undefined,
            depth: formData.depth ? parseFloat(formData.depth) : undefined
          },
          estimatedDeliveryDays: formData.estimatedDeliveryDays ? parseInt(formData.estimatedDeliveryDays) : undefined
        },
        status: formData.status
      };

      await onSave(productData);
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Handle image uploads
  const handleImagesUpload = (uploadedUrls) => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...uploadedUrls]
    }));
    setUploadError(null);
    if (errors.images) {
      setErrors(prev => ({ ...prev, images: '' }));
    }
  };

  const handleUploadError = (error) => {
    setUploadError(error.message || 'Failed to upload image');
  };

  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // Handle story media upload
  const handleStoryMediaUpload = (uploadedUrls) => {
    setFormData(prev => ({
      ...prev,
      storyMediaUrls: [...prev.storyMediaUrls, ...uploadedUrls]
    }));
  };

  const handleRemoveStoryMedia = (index) => {
    setFormData(prev => ({
      ...prev,
      storyMediaUrls: prev.storyMediaUrls.filter((_, i) => i !== index)
    }));
  };

  // Handle certificate upload
  const handleCertificateUpload = (uploadedUrl) => {
    setCertificateUrl(uploadedUrl);
    setFormData(prev => ({
      ...prev,
      authenticityCertificateUrl: uploadedUrl
    }));
  };

  const handleRemoveCertificate = () => {
    setCertificateUrl('');
    setFormData(prev => ({
      ...prev,
      authenticityCertificateUrl: ''
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-stone-900">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6 text-stone-700" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <section>
            <h3 className="text-lg font-bold text-stone-900 mb-4 pb-2 border-b border-stone-200">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product ID */}
              <div className="md:col-span-2">
                <label className="block text-stone-800 text-sm font-medium mb-2">
                  Product ID *
                </label>
                <input
                  type="text"
                  value={formData.id}
                  onChange={(e) => handleInputChange('id', e.target.value)}
                  className={`w-full px-4 py-3 border ${errors.id ? 'border-red-500' : 'border-stone-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ec6d13]/50 bg-white`}
                  placeholder="e.g., art1001"
                />
                {errors.id && <p className="text-red-500 text-sm mt-1">{errors.id}</p>}
              </div>

              {/* Product Title */}
              <div className="md:col-span-2">
                <label className="block text-stone-800 text-sm font-medium mb-2">
                  Product Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className={`w-full px-4 py-3 border ${errors.title ? 'border-red-500' : 'border-stone-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ec6d13]/50 bg-white`}
                  placeholder="Enter product title"
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-stone-800 text-sm font-medium mb-2">
                  Product Description *
                </label>
                
                {/* AI Content Generator */}
                <div className="mb-4">
                  <ContentGenerator
                    contentType="description"
                    productData={{
                      name: formData.title,
                      category: formData.category,
                      materials: formData.craftMethod,
                      isAuction: false,
                      images: formData.images
                    }}
                    onContentGenerated={(content) => {
                      if (typeof content === 'string') {
                        handleInputChange('description', content);
                      } else if (content.description) {
                        handleInputChange('description', content.description);
                      }
                    }}
                  />
                </div>
                
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className={`w-full px-4 py-3 border ${errors.description ? 'border-red-500' : 'border-stone-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ec6d13]/50 bg-white resize-none`}
                  placeholder="Describe your product in detail..."
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>

              {/* Category */}
              <div>
                <label className="block text-stone-800 text-sm font-medium mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className={`w-full px-4 py-3 border ${errors.category ? 'border-red-500' : 'border-stone-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ec6d13]/50 bg-white`}
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat.name || cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
              </div>

              {/* Price */}
              <div>
                <label className="block text-stone-800 text-sm font-medium mb-2">
                  Price *
                </label>
                <div className="flex gap-2">
                  <select
                    value={formData.currency}
                    onChange={(e) => handleInputChange('currency', e.target.value)}
                    className="px-4 py-3 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ec6d13]/50 bg-white"
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    className={`flex-1 px-4 py-3 border ${errors.price ? 'border-red-500' : 'border-stone-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ec6d13]/50 bg-white`}
                    placeholder="0.00"
                  />
                </div>
                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
              </div>

              {/* Stock Quantity */}
              <div>
                <label className="block text-stone-800 text-sm font-medium mb-2">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={formData.stockQuantity}
                  onChange={(e) => handleInputChange('stockQuantity', e.target.value)}
                  className={`w-full px-4 py-3 border ${errors.stockQuantity ? 'border-red-500' : 'border-stone-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ec6d13]/50 bg-white`}
                  placeholder="Enter available units"
                />
                {errors.stockQuantity && <p className="text-red-500 text-sm mt-1">{errors.stockQuantity}</p>}
              </div>

              {/* Availability */}
              <div className="md:col-span-2 flex items-center gap-3">
                <input
                  type="checkbox"
                  id="availability"
                  checked={formData.availability}
                  onChange={(e) => handleInputChange('availability', e.target.checked)}
                  className="w-5 h-5 text-[#ec6d13] border-stone-300 rounded focus:ring-[#ec6d13]/50"
                />
                <label htmlFor="availability" className="text-stone-800 text-sm font-medium">
                  Product is available for purchase
                </label>
              </div>
            </div>
          </section>

          {/* Product Images */}
          <section>
            <h3 className="text-lg font-bold text-stone-900 mb-4 pb-2 border-b border-stone-200">
              Product Images *
            </h3>
            <ImageUpload
              onUploadComplete={handleImagesUpload}
              onUploadError={handleUploadError}
              multiple={true}
              maxFiles={10}
              currentImages={formData.images}
              onRemoveImage={handleRemoveImage}
              label="Upload Product Images"
              folder="products"
              showPreview={true}
            />
            {errors.images && <p className="text-red-500 text-sm mt-2">{errors.images}</p>}
            {uploadError && <p className="text-red-500 text-sm mt-2">{uploadError}</p>}
          </section>

          {/* Craft Details */}
          <section>
            <h3 className="text-lg font-bold text-stone-900 mb-4 pb-2 border-b border-stone-200">
              Craft & Story Details
            </h3>
            <div className="space-y-6">
              {/* Craft Method */}
              <div>
                <label className="block text-stone-800 text-sm font-medium mb-2">
                  Craft Method
                </label>
                <textarea
                  value={formData.craftMethod}
                  onChange={(e) => handleInputChange('craftMethod', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ec6d13]/50 bg-white resize-none"
                  placeholder="Describe the crafting technique or method used..."
                />
              </div>

              {/* Provenance */}
              <div>
                <label className="block text-stone-800 text-sm font-medium mb-2">
                  Provenance (Origin/History)
                </label>
                <textarea
                  value={formData.provenance}
                  onChange={(e) => handleInputChange('provenance', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ec6d13]/50 bg-white resize-none"
                  placeholder="Describe the product's origin or historical significance..."
                />
              </div>

              {/* Crafting Story */}
              <div>
                <label className="block text-stone-800 text-sm font-medium mb-2">
                  Crafting Story
                </label>
                <textarea
                  value={formData.craftingStory}
                  onChange={(e) => handleInputChange('craftingStory', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ec6d13]/50 bg-white resize-none"
                  placeholder="Share your story as an artisan..."
                />
              </div>

              {/* Product Story */}
              <div>
                <label className="block text-stone-800 text-sm font-medium mb-2">
                  Product Story
                </label>
                <textarea
                  value={formData.productStoryText}
                  onChange={(e) => handleInputChange('productStoryText', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ec6d13]/50 bg-white resize-none"
                  placeholder="Tell the unique story behind this product..."
                />
              </div>

              {/* Story Media */}
              <div>
                <label className="block text-stone-800 text-sm font-medium mb-2">
                  Story Media (Optional)
                </label>
                <ImageUpload
                  onUploadComplete={handleStoryMediaUpload}
                  onUploadError={handleUploadError}
                  multiple={true}
                  maxFiles={5}
                  currentImages={formData.storyMediaUrls}
                  onRemoveImage={handleRemoveStoryMedia}
                  label="Upload Story Images/Videos"
                  folder="products/stories"
                  showPreview={true}
                />
              </div>

              {/* Authenticity Certificate */}
              <div>
                <label className="block text-stone-800 text-sm font-medium mb-2">
                  Authenticity Certificate (Optional)
                </label>
                <ImageUpload
                  onUploadComplete={handleCertificateUpload}
                  onUploadError={handleUploadError}
                  multiple={false}
                  currentImages={certificateUrl ? [certificateUrl] : []}
                  onRemoveImage={handleRemoveCertificate}
                  label="Upload Certificate"
                  folder="products/certificates"
                  showPreview={true}
                />
              </div>
            </div>
          </section>

          {/* Shipping Information */}
          <section>
            <h3 className="text-lg font-bold text-stone-900 mb-4 pb-2 border-b border-stone-200">
              Shipping Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Weight */}
              <div>
                <label className="block text-stone-800 text-sm font-medium mb-2">
                  Weight (grams)
                </label>
                <input
                  type="number"
                  value={formData.weight}
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                  className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ec6d13]/50 bg-white"
                  placeholder="e.g., 500"
                />
              </div>

              {/* Estimated Delivery Days */}
              <div>
                <label className="block text-stone-800 text-sm font-medium mb-2">
                  Estimated Delivery (days)
                </label>
                <input
                  type="number"
                  value={formData.estimatedDeliveryDays}
                  onChange={(e) => handleInputChange('estimatedDeliveryDays', e.target.value)}
                  className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ec6d13]/50 bg-white"
                  placeholder="e.g., 7"
                />
              </div>

              {/* Dimensions */}
              <div className="md:col-span-2">
                <label className="block text-stone-800 text-sm font-medium mb-2">
                  Dimensions (cm)
                </label>
                <div className="grid grid-cols-3 gap-4">
                  <input
                    type="number"
                    value={formData.height}
                    onChange={(e) => handleInputChange('height', e.target.value)}
                    className="px-4 py-3 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ec6d13]/50 bg-white"
                    placeholder="Height"
                  />
                  <input
                    type="number"
                    value={formData.width}
                    onChange={(e) => handleInputChange('width', e.target.value)}
                    className="px-4 py-3 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ec6d13]/50 bg-white"
                    placeholder="Width"
                  />
                  <input
                    type="number"
                    value={formData.depth}
                    onChange={(e) => handleInputChange('depth', e.target.value)}
                    className="px-4 py-3 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ec6d13]/50 bg-white"
                    placeholder="Depth"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Actions */}
          <div className="flex items-center gap-4 pt-4 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl bg-stone-100 text-stone-800 text-sm font-bold hover:bg-stone-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 rounded-xl bg-[#ec6d13] text-white text-sm font-bold hover:bg-[#ec6d13]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : (product ? 'Update Product' : 'Create Product')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
