import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import ArtisanSidebar from '../components/ArtisanSidebar';
import { Menu, Upload, X, Plus, ArrowLeft, Save } from 'lucide-react';
import { API_ENDPOINTS } from '@/utils/api';
import ImageUpload from '@/components/common/ImageUpload';

const AddProduct = () => {
  const { user, isArtisan, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState('');
  const [productImages, setProductImages] = useState([]); // Changed from imageUrls
  const [storyMediaUrls, setStoryMediaUrls] = useState([]);
  const [certificateUrl, setCertificateUrl] = useState(''); // Changed
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [errors, setErrors] = useState({});
  const [uploadError, setUploadError] = useState(null);

  const [formData, setFormData] = useState({
    id: '',
    title: '',
    description: '',
    category: '',
    price: '',
    currency: 'INR',
    stockQuantity: '',
    craftMethod: '',
    provenance: '',
    craftingStory: '',
    productStoryText: '',
    authenticityCertificateUrl: '',
    availability: true,
    weight: '',
    height: '',
    width: '',
    depth: '',
    estimatedDeliveryDays: '',
    featured: false,
    popular: false,
    recent: true
  });

  useEffect(() => {
    // Wait for auth to finish loading
    if (authLoading) {
      return;
    }

    if (!user || !isArtisan) {
      navigate('/');
      return;
    }
    loadCategories();
    generateProductId();
  }, [user, isArtisan, navigate, authLoading]);

  const generateProductId = () => {
    const randomId = `art${Date.now()}${Math.floor(Math.random() * 1000)}`;
    setFormData(prev => ({ ...prev, id: randomId }));
  };

  const loadCategories = async () => {
    try {
      const response = await fetch(`${API_ENDPOINTS.categories}?type=artisan`);
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data.data || data.categories || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.id.trim()) newErrors.id = 'Product ID is required';
    if (!formData.title.trim()) newErrors.title = 'Product title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.price || formData.price <= 0) newErrors.price = 'Valid price is required';
    if (!formData.stockQuantity || formData.stockQuantity < 0) newErrors.stockQuantity = 'Stock quantity must be 0 or greater';

    if (productImages.length === 0) newErrors.images = 'At least one product image is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Handle product images upload
  const handleProductImagesUpload = (uploadedUrls) => {
    setProductImages(prev => [...prev, ...uploadedUrls]);
    setUploadError(null);
    if (errors.images) {
      setErrors(prev => ({ ...prev, images: '' }));
    }
  };

  const handleRemoveProductImage = (index) => {
    setProductImages(prev => prev.filter((_, i) => i !== index));
  };

  // Handle story media upload
  const handleStoryMediaUpload = (uploadedUrls) => {
    setStoryMediaUrls(prev => [...prev, ...uploadedUrls]);
  };

  const handleRemoveStoryMedia = (index) => {
    setStoryMediaUrls(prev => prev.filter((_, i) => i !== index));
  };

  // Handle certificate upload
  const handleCertificateUpload = (uploadedUrl) => {
    setCertificateUrl(uploadedUrl);
  };

  const handleRemoveCertificate = () => {
    setCertificateUrl('');
  };

  // Handle upload errors
  const handleUploadError = (error) => {
    setUploadError(error.message || 'Upload failed');
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert('Please fill in all required fields correctly.');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');

      const productData = {
        id: formData.id,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        images: productImages, // Use uploaded images
        price: parseFloat(formData.price),
        currency: formData.currency,
        stockQuantity: parseInt(formData.stockQuantity) || 0,
        artisanInfo: {
          id: user._id,
          name: user.name,
          profilePhotoUrl: user.avatar || '',
          briefBio: user.bio || '',
          verified: true
        },
        craftMethod: formData.craftMethod,
        provenance: formData.provenance,
        craftingStory: formData.craftingStory,
        productStory: {
          storyText: formData.productStoryText,
          storyMediaUrls: storyMediaUrls.filter(url => url.trim())
        },
        authenticityCertificateUrl: certificateUrl, // Use uploaded certificate
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
        tags: tags,
        featured: formData.featured,
        popular: formData.popular,
        recent: formData.recent,
        status: 'pending'
      };

      const response = await fetch(API_ENDPOINTS.artisanProducts, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create product');
      }

      alert('Product created successfully!');
      navigate('/artisan/products');
    } catch (error) {
      console.error('Error creating product:', error);
      alert(`Failed to create product: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-stone-50">
      {/* Sidebar */}
      <ArtisanSidebar
        user={user}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Mobile Header */}
        <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-stone-200 px-4 py-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
          >
            <Menu className="h-6 w-6 text-stone-700" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 md:p-8 lg:p-12">
          <div className="mx-auto max-w-5xl">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <button
                onClick={() => navigate('/artisan/products')}
                className="p-2 hover:bg-white rounded-lg border border-stone-200 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-stone-700" />
              </button>
              <div>
                <h1 className="text-stone-900 text-3xl sm:text-4xl font-black leading-tight">
                  Add New Product
                </h1>
                <p className="text-stone-600 mt-1">
                  Fill in the details to create your artisan product
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-8">

              {/* Basic Information */}
              <section>
                <h2 className="text-xl font-bold text-stone-900 mb-4 pb-2 border-b border-stone-200">
                  Basic Information
                </h2>
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
                    <p className="text-stone-500 text-xs mt-1">Unique identifier for this product</p>
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
                      value={showCustomCategory ? 'custom' : formData.category}
                      onChange={(e) => {
                        if (e.target.value === 'custom') {
                          setShowCustomCategory(true);
                          setFormData(prev => ({ ...prev, category: '' }));
                        } else {
                          setShowCustomCategory(false);
                          setCustomCategory('');
                          handleInputChange('category', e.target.value);
                        }
                      }}
                      className={`w-full px-4 py-3 border ${errors.category ? 'border-red-500' : 'border-stone-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ec6d13]/50 bg-white`}
                    >
                      <option value="">Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                      <option value="custom" className="font-semibold text-[#ec6d13]">
                        + Add Custom Category
                      </option>
                    </select>

                    {/* Custom Category Input */}
                    {showCustomCategory && (
                      <div className="mt-3 p-4 bg-stone-50 rounded-xl border border-stone-200">
                        <label className="block text-stone-700 text-sm font-medium mb-2">
                          Enter Your Custom Category
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={customCategory}
                            onChange={(e) => {
                              setCustomCategory(e.target.value);
                              handleInputChange('category', e.target.value);
                            }}
                            className="flex-1 px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec6d13]/50 bg-white"
                            placeholder="e.g., Traditional Pottery"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setShowCustomCategory(false);
                              setCustomCategory('');
                              setFormData(prev => ({ ...prev, category: '' }));
                            }}
                            className="px-4 py-2 border border-stone-300 rounded-lg hover:bg-stone-100 transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="text-xs text-stone-500 mt-2">
                          This category will be submitted for admin approval
                        </p>
                      </div>
                    )}

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
                        <option value="INR">INR</option>
                        <option value="INR">INR (₹)</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
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
                    <p className="text-stone-500 text-xs mt-1">Number of units available in stock</p>
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
                <h2 className="text-xl font-bold text-stone-900 mb-4 pb-2 border-b border-stone-200">
                  Product Images *
                </h2>
                <ImageUpload
                  onUploadComplete={handleProductImagesUpload}
                  onUploadError={handleUploadError}
                  multiple={true}
                  maxFiles={10}
                  currentImages={productImages}
                  onRemoveImage={handleRemoveProductImage}
                  label="Upload Product Images"
                  folder="products"
                  showPreview={true}
                />
                {errors.images && <p className="text-red-500 text-sm mt-2">{errors.images}</p>}
                {uploadError && <p className="text-red-500 text-sm mt-2">{uploadError}</p>}
                <p className="text-stone-500 text-xs mt-2">Upload up to 10 images. First image will be the main product image.</p>
              </section>

              {/* Craft Details */}
              <section>
                <h2 className="text-xl font-bold text-stone-900 mb-4 pb-2 border-b border-stone-200">
                  Craft & Story Details
                </h2>
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
                      currentImages={storyMediaUrls}
                      onRemoveImage={handleRemoveStoryMedia}
                      label="Upload Story Images/Videos"
                      folder="products/stories"
                      showPreview={true}
                    />
                    <p className="text-stone-500 text-xs mt-2">Upload images or videos that tell your product's story</p>
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
                <h2 className="text-xl font-bold text-stone-900 mb-4 pb-2 border-b border-stone-200">
                  Shipping Information
                </h2>
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

              {/* Tags & Features */}
              <section>
                <h2 className="text-xl font-bold text-stone-900 mb-4 pb-2 border-b border-stone-200">
                  Tags & Features
                </h2>
                <div className="space-y-6">
                  {/* Tags */}
                  <div>
                    <label className="block text-stone-800 text-sm font-medium mb-2">
                      Search Tags
                    </label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#ec6d13]/10 text-[#ec6d13] rounded-lg text-sm font-medium"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="hover:text-[#ec6d13]/70"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                        className="flex-1 px-4 py-3 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ec6d13]/50 bg-white"
                        placeholder="Enter a tag and press Enter"
                      />
                      <button
                        type="button"
                        onClick={handleAddTag}
                        className="px-6 py-3 bg-stone-100 text-stone-800 rounded-xl font-semibold hover:bg-stone-200 transition-colors"
                      >
                        Add Tag
                      </button>
                    </div>
                  </div>

                  {/* Feature Flags */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="featured"
                        checked={formData.featured}
                        onChange={(e) => handleInputChange('featured', e.target.checked)}
                        className="w-5 h-5 text-[#ec6d13] border-stone-300 rounded focus:ring-[#ec6d13]/50"
                      />
                      <label htmlFor="featured" className="text-stone-800 text-sm font-medium">
                        Mark as Featured Product
                      </label>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="popular"
                        checked={formData.popular}
                        onChange={(e) => handleInputChange('popular', e.target.checked)}
                        className="w-5 h-5 text-[#ec6d13] border-stone-300 rounded focus:ring-[#ec6d13]/50"
                      />
                      <label htmlFor="popular" className="text-stone-800 text-sm font-medium">
                        Mark as Popular Product
                      </label>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="recent"
                        checked={formData.recent}
                        onChange={(e) => handleInputChange('recent', e.target.checked)}
                        className="w-5 h-5 text-[#ec6d13] border-stone-300 rounded focus:ring-[#ec6d13]/50"
                      />
                      <label htmlFor="recent" className="text-stone-800 text-sm font-medium">
                        Mark as Recent Product
                      </label>
                    </div>
                  </div>
                </div>
              </section>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => navigate('/artisan/products')}
                  disabled={loading}
                  className="flex-1 px-6 py-4 rounded-xl bg-stone-100 text-stone-800 text-base font-bold hover:bg-stone-200 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-[#ec6d13] text-white text-base font-bold hover:bg-[#ec6d13]/90 transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Creating Product...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5" />
                      <span>Create Product</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddProduct;
