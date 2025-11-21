import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminSidebar from './components/AdminSidebar';
import MobileSidebar from './components/MobileSidebar';
import AdminHeader from './components/AdminHeader';
import { Upload, X, Plus, ArrowLeft, Save } from 'lucide-react';
import { API_ENDPOINTS } from '@/config/api';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [categories, setCategories] = useState([]);
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState('');
  const [imageUrls, setImageUrls] = useState(['']);
  const [storyMediaUrls, setStoryMediaUrls] = useState(['']);
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [errors, setErrors] = useState({});
  const [productType, setProductType] = useState('artisan'); // artisan or collectible

  const [formData, setFormData] = useState({
    id: '',
    title: '',
    description: '',
    category: '',
    price: '',
    currency: 'INR',
    // Artisan-specific fields
    craftMethod: '',
    provenance: '',
    craftingStory: '',
    // Collectible-specific fields
    history: '',
    manufacturer: '',
    serialNumber: '',
    editionNumber: '',
    material: '',
    condition: '',
    yearMade: '',
    origin: '',
    // Common fields
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
    recent: true,
    status: 'pending'
  });

  // Load product data
  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoadingProduct(true);
        const token = localStorage.getItem('token');
        
        // Try artisan products first
        let response = await fetch(`${API_ENDPOINTS.artisanProducts}/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
          // Try collectibles
          response = await fetch(`${API_ENDPOINTS.collectibles}/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          setProductType('collectible');
        } else {
          setProductType('artisan');
        }

        if (!response.ok) throw new Error('Product not found');

        const data = await response.json();
        const product = data.product || data.data || data;

        // Populate form with product data
        setFormData({
          id: product.id || product._id || '',
          title: product.title || product.name || '',
          description: product.description || '',
          category: typeof product.category === 'object' ? product.category._id : product.category || '',
          price: product.price || '',
          currency: product.currency || 'INR',
          // Artisan-specific
          craftMethod: product.craftMethod || '',
          provenance: product.provenance || '',
          craftingStory: product.craftingStory || '',
          // Collectible-specific
          history: product.history || '',
          manufacturer: product.manufacturer || '',
          serialNumber: product.serialNumber || '',
          editionNumber: product.editionNumber || '',
          material: product.specifications?.material || '',
          condition: product.specifications?.condition || '',
          yearMade: product.specifications?.yearMade || '',
          origin: product.specifications?.origin || '',
          // Common
          productStoryText: product.productStory?.text || product.productStory?.storyText || product.productStoryText || '',
          authenticityCertificateUrl: product.authenticityCertificateUrl || '',
          availability: product.availability !== false,
          weight: product.dimensions?.weight || product.specifications?.weight || product.weight || '',
          height: product.dimensions?.height || product.specifications?.dimensions?.height || product.height || '',
          width: product.dimensions?.width || product.specifications?.dimensions?.width || product.width || '',
          depth: product.dimensions?.depth || product.specifications?.dimensions?.depth || product.depth || '',
          estimatedDeliveryDays: product.shippingInfo?.estimatedDeliveryDays || product.estimatedDeliveryDays || '',
          featured: product.featured || false,
          popular: product.popular || false,
          recent: product.recent !== false,
          status: product.status || 'pending'
        });

        setImageUrls(product.images && product.images.length > 0 ? product.images : [product.image || '']);
        setStoryMediaUrls(product.productStory?.media || product.productStory?.storyMediaUrls || ['']);
        setTags(product.tags || []);

      } catch (error) {
        console.error('Error loading product:', error);
        alert('Failed to load product');
        navigate('/admin/products');
      } finally {
        setLoadingProduct(false);
      }
    };

    loadProduct();
    loadCategories();
  }, [id, navigate]);

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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageUrlChange = (index, value) => {
    const newUrls = [...imageUrls];
    newUrls[index] = value;
    setImageUrls(newUrls);
  };

  const addImageUrl = () => {
    setImageUrls([...imageUrls, '']);
  };

  const removeImageUrl = (index) => {
    if (imageUrls.length > 1) {
      setImageUrls(imageUrls.filter((_, i) => i !== index));
    }
  };

  const handleStoryMediaChange = (index, value) => {
    const newUrls = [...storyMediaUrls];
    newUrls[index] = value;
    setStoryMediaUrls(newUrls);
  };

  const addStoryMedia = () => {
    setStoryMediaUrls([...storyMediaUrls, '']);
  };

  const removeStoryMedia = (index) => {
    setStoryMediaUrls(storyMediaUrls.filter((_, i) => i !== index));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.category && !customCategory.trim()) newErrors.category = 'Category is required';
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Valid price is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      alert('Please fix the errors in the form');
      return;
    }

    try {
      setLoading(true);

      const productData = {
        ...formData,
        category: showCustomCategory ? customCategory : formData.category,
        images: imageUrls.filter(url => url.trim()),
        price: parseFloat(formData.price),
        tags: tags
      };

      // Add type-specific data structures
      if (productType === 'artisan') {
        productData.dimensions = {
          weight: formData.weight,
          height: formData.height,
          width: formData.width,
          depth: formData.depth
        };
        productData.shippingInfo = {
          estimatedDeliveryDays: formData.estimatedDeliveryDays
        };
        productData.productStory = {
          text: formData.productStoryText,
          media: storyMediaUrls.filter(url => url.trim())
        };
      } else {
        // Collectible
        productData.specifications = {
          material: formData.material,
          condition: formData.condition,
          yearMade: formData.yearMade,
          origin: formData.origin,
          weight: formData.weight,
          dimensions: {
            height: formData.height,
            width: formData.width,
            depth: formData.depth,
            unit: 'cm'
          }
        };
        productData.shippingInfo = {
          estimatedDeliveryDays: formData.estimatedDeliveryDays,
          weight: formData.weight,
          dimensions: {
            height: formData.height,
            width: formData.width,
            depth: formData.depth,
            unit: 'cm'
          }
        };
        productData.productStory = {
          storyText: formData.productStoryText,
          storyMediaUrls: storyMediaUrls.filter(url => url.trim())
        };
      }

      const endpoint = productType === 'artisan' 
        ? `${API_ENDPOINTS.artisanProducts}/${id}`
        : `${API_ENDPOINTS.collectibles}/${id}`;

      const token = localStorage.getItem('token');
      const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update product');
      }

      alert('Product updated successfully!');
      navigate('/admin/products');
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loadingProduct) {
    return (
      <div className="relative flex min-h-screen w-full flex-col overflow-hidden">
        <div className="flex flex-row min-h-screen overflow-hidden">
          <AdminSidebar />
          <MobileSidebar />
          <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
            <AdminHeader />
            <div className="flex-1 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ec6d13]"></div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden">
      <div className="flex flex-row min-h-screen overflow-hidden">
        <AdminSidebar />
        <MobileSidebar />

        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <AdminHeader />

          <div className="flex-1 p-2 sm:p-4 md:p-8 overflow-auto">
            <div className="w-full max-w-4xl mx-auto">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => navigate('/admin/products')}
                    className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#f3ece7] dark:bg-[#3a2a1d] hover:bg-[#ec6d13]/20 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-black">Edit Product</h1>
                    <p className="text-sm text-[#9a6c4c] dark:text-[#a18a7a]">
                      Update product details as admin
                    </p>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="bg-[#f8f7f6] dark:bg-[#221810] rounded-lg p-6 border border-[#f3ece7] dark:border-[#3a2a1d]">
                  <h2 className="text-xl font-bold mb-4">Basic Information</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Product ID
                      </label>
                      <input
                        type="text"
                        name="id"
                        value={formData.id}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-md bg-white dark:bg-[#2a1e14] border border-[#e7d9cf] dark:border-[#3f2e1e] focus:outline-none focus:ring-2 focus:ring-[#ec6d13]"
                        placeholder="PROD-001"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 rounded-md bg-white dark:bg-[#2a1e14] border ${
                          errors.title ? 'border-red-500' : 'border-[#e7d9cf] dark:border-[#3f2e1e]'
                        } focus:outline-none focus:ring-2 focus:ring-[#ec6d13]`}
                        placeholder="Enter product title"
                      />
                      {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows="4"
                        className={`w-full px-4 py-2 rounded-md bg-white dark:bg-[#2a1e14] border ${
                          errors.description ? 'border-red-500' : 'border-[#e7d9cf] dark:border-[#3f2e1e]'
                        } focus:outline-none focus:ring-2 focus:ring-[#ec6d13]`}
                        placeholder="Describe the product"
                      />
                      {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Category <span className="text-red-500">*</span>
                      </label>
                      {!showCustomCategory ? (
                        <div className="space-y-2">
                          <select
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-2 rounded-md bg-white dark:bg-[#2a1e14] border ${
                              errors.category ? 'border-red-500' : 'border-[#e7d9cf] dark:border-[#3f2e1e]'
                            } focus:outline-none focus:ring-2 focus:ring-[#ec6d13]`}
                          >
                            <option value="">Select a category</option>
                            {categories.map(cat => (
                              <option key={cat._id} value={cat._id}>{cat.name}</option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => setShowCustomCategory(true)}
                            className="text-sm text-[#ec6d13] hover:underline"
                          >
                            + Add custom category
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={customCategory}
                            onChange={(e) => setCustomCategory(e.target.value)}
                            className="w-full px-4 py-2 rounded-md bg-white dark:bg-[#2a1e14] border border-[#e7d9cf] dark:border-[#3f2e1e] focus:outline-none focus:ring-2 focus:ring-[#ec6d13]"
                            placeholder="Enter custom category"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setShowCustomCategory(false);
                              setCustomCategory('');
                            }}
                            className="text-sm text-[#ec6d13] hover:underline"
                          >
                            ← Back to categories list
                          </button>
                        </div>
                      )}
                      {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Price <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          step="0.01"
                          className={`w-full px-4 py-2 rounded-md bg-white dark:bg-[#2a1e14] border ${
                            errors.price ? 'border-red-500' : 'border-[#e7d9cf] dark:border-[#3f2e1e]'
                          } focus:outline-none focus:ring-2 focus:ring-[#ec6d13]`}
                          placeholder="0.00"
                        />
                        {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Currency</label>
                        <select
                          name="currency"
                          value={formData.currency}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 rounded-md bg-white dark:bg-[#2a1e14] border border-[#e7d9cf] dark:border-[#3f2e1e] focus:outline-none focus:ring-2 focus:ring-[#ec6d13]"
                        >
                          <option value="INR">INR (₹)</option>
                          <option value="USD">USD ($)</option>
                          <option value="EUR">EUR (€)</option>
                          <option value="GBP">GBP (£)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Status</label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-md bg-white dark:bg-[#2a1e14] border border-[#e7d9cf] dark:border-[#3f2e1e] focus:outline-none focus:ring-2 focus:ring-[#ec6d13]"
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Images */}
                <div className="bg-[#f8f7f6] dark:bg-[#221810] rounded-lg p-6 border border-[#f3ece7] dark:border-[#3a2a1d]">
                  <h2 className="text-xl font-bold mb-4">Product Images</h2>
                  
                  <div className="space-y-3">
                    {imageUrls.map((url, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="url"
                          value={url}
                          onChange={(e) => handleImageUrlChange(index, e.target.value)}
                          className="flex-1 px-4 py-2 rounded-md bg-white dark:bg-[#2a1e14] border border-[#e7d9cf] dark:border-[#3f2e1e] focus:outline-none focus:ring-2 focus:ring-[#ec6d13]"
                          placeholder="https://example.com/image.jpg"
                        />
                        {imageUrls.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeImageUrl(index)}
                            className="p-2 rounded-md bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addImageUrl}
                      className="flex items-center gap-2 px-4 py-2 rounded-md bg-[#ec6d13]/10 text-[#ec6d13] hover:bg-[#ec6d13]/20 transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                      Add Another Image URL
                    </button>
                  </div>
                </div>

                {/* Craft Details / Collectible Details */}
                <div className="bg-[#f8f7f6] dark:bg-[#221810] rounded-lg p-6 border border-[#f3ece7] dark:border-[#3a2a1d]">
                  <h2 className="text-xl font-bold mb-4">
                    {productType === 'artisan' ? 'Craft Details' : 'Collectible Details'}
                  </h2>
                  
                  <div className="space-y-4">
                    {productType === 'artisan' ? (
                      <>
                        <div>
                          <label className="block text-sm font-medium mb-2">Craft Method</label>
                          <input
                            type="text"
                            name="craftMethod"
                            value={formData.craftMethod}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 rounded-md bg-white dark:bg-[#2a1e14] border border-[#e7d9cf] dark:border-[#3f2e1e] focus:outline-none focus:ring-2 focus:ring-[#ec6d13]"
                            placeholder="e.g., Hand-woven, Hand-carved"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Provenance</label>
                          <input
                            type="text"
                            name="provenance"
                            value={formData.provenance}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 rounded-md bg-white dark:bg-[#2a1e14] border border-[#e7d9cf] dark:border-[#3f2e1e] focus:outline-none focus:ring-2 focus:ring-[#ec6d13]"
                            placeholder="Origin or source"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Crafting Story</label>
                          <textarea
                            name="craftingStory"
                            value={formData.craftingStory}
                            onChange={handleInputChange}
                            rows="3"
                            className="w-full px-4 py-2 rounded-md bg-white dark:bg-[#2a1e14] border border-[#e7d9cf] dark:border-[#3f2e1e] focus:outline-none focus:ring-2 focus:ring-[#ec6d13]"
                            placeholder="Tell the story of how this was made"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Manufacturer</label>
                            <input
                              type="text"
                              name="manufacturer"
                              value={formData.manufacturer}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 rounded-md bg-white dark:bg-[#2a1e14] border border-[#e7d9cf] dark:border-[#3f2e1e] focus:outline-none focus:ring-2 focus:ring-[#ec6d13]"
                              placeholder="Manufacturer name"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2">Material</label>
                            <input
                              type="text"
                              name="material"
                              value={formData.material}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 rounded-md bg-white dark:bg-[#2a1e14] border border-[#e7d9cf] dark:border-[#3f2e1e] focus:outline-none focus:ring-2 focus:ring-[#ec6d13]"
                              placeholder="e.g., Porcelain, Bronze"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Serial Number</label>
                            <input
                              type="text"
                              name="serialNumber"
                              value={formData.serialNumber}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 rounded-md bg-white dark:bg-[#2a1e14] border border-[#e7d9cf] dark:border-[#3f2e1e] focus:outline-none focus:ring-2 focus:ring-[#ec6d13]"
                              placeholder="Serial number"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2">Edition Number</label>
                            <input
                              type="text"
                              name="editionNumber"
                              value={formData.editionNumber}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 rounded-md bg-white dark:bg-[#2a1e14] border border-[#e7d9cf] dark:border-[#3f2e1e] focus:outline-none focus:ring-2 focus:ring-[#ec6d13]"
                              placeholder="Edition number"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Condition</label>
                            <select
                              name="condition"
                              value={formData.condition}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 rounded-md bg-white dark:bg-[#2a1e14] border border-[#e7d9cf] dark:border-[#3f2e1e] focus:outline-none focus:ring-2 focus:ring-[#ec6d13]"
                            >
                              <option value="">Select condition</option>
                              <option value="Mint">Mint</option>
                              <option value="Excellent">Excellent</option>
                              <option value="Very Good">Very Good</option>
                              <option value="Good">Good</option>
                              <option value="Fair">Fair</option>
                              <option value="Poor">Poor</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2">Year Made</label>
                            <input
                              type="text"
                              name="yearMade"
                              value={formData.yearMade}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 rounded-md bg-white dark:bg-[#2a1e14] border border-[#e7d9cf] dark:border-[#3f2e1e] focus:outline-none focus:ring-2 focus:ring-[#ec6d13]"
                              placeholder="e.g., 1950s, 2020"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Origin</label>
                          <input
                            type="text"
                            name="origin"
                            value={formData.origin}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 rounded-md bg-white dark:bg-[#2a1e14] border border-[#e7d9cf] dark:border-[#3f2e1e] focus:outline-none focus:ring-2 focus:ring-[#ec6d13]"
                            placeholder="Country or region of origin"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">History</label>
                          <textarea
                            name="history"
                            value={formData.history}
                            onChange={handleInputChange}
                            rows="3"
                            className="w-full px-4 py-2 rounded-md bg-white dark:bg-[#2a1e14] border border-[#e7d9cf] dark:border-[#3f2e1e] focus:outline-none focus:ring-2 focus:ring-[#ec6d13]"
                            placeholder="Historical background of this collectible"
                          />
                        </div>
                      </>
                    )}

                    <div>
                      <label className="block text-sm font-medium mb-2">Product Story</label>
                      <textarea
                        name="productStoryText"
                        value={formData.productStoryText}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full px-4 py-2 rounded-md bg-white dark:bg-[#2a1e14] border border-[#e7d9cf] dark:border-[#3f2e1e] focus:outline-none focus:ring-2 focus:ring-[#ec6d13]"
                        placeholder="The unique story behind this product"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Authenticity Certificate URL</label>
                      <input
                        type="url"
                        name="authenticityCertificateUrl"
                        value={formData.authenticityCertificateUrl}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-md bg-white dark:bg-[#2a1e14] border border-[#e7d9cf] dark:border-[#3f2e1e] focus:outline-none focus:ring-2 focus:ring-[#ec6d13]"
                        placeholder="https://example.com/certificate.pdf"
                      />
                    </div>
                  </div>
                </div>

                {/* Dimensions & Shipping */}
                <div className="bg-[#f8f7f6] dark:bg-[#221810] rounded-lg p-6 border border-[#f3ece7] dark:border-[#3a2a1d]">
                  <h2 className="text-xl font-bold mb-4">Dimensions & Shipping</h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Weight (kg)</label>
                      <input
                        type="number"
                        name="weight"
                        value={formData.weight}
                        onChange={handleInputChange}
                        step="0.01"
                        className="w-full px-4 py-2 rounded-md bg-white dark:bg-[#2a1e14] border border-[#e7d9cf] dark:border-[#3f2e1e] focus:outline-none focus:ring-2 focus:ring-[#ec6d13]"
                        placeholder="0.00"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Height (cm)</label>
                      <input
                        type="number"
                        name="height"
                        value={formData.height}
                        onChange={handleInputChange}
                        step="0.01"
                        className="w-full px-4 py-2 rounded-md bg-white dark:bg-[#2a1e14] border border-[#e7d9cf] dark:border-[#3f2e1e] focus:outline-none focus:ring-2 focus:ring-[#ec6d13]"
                        placeholder="0.00"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Width (cm)</label>
                      <input
                        type="number"
                        name="width"
                        value={formData.width}
                        onChange={handleInputChange}
                        step="0.01"
                        className="w-full px-4 py-2 rounded-md bg-white dark:bg-[#2a1e14] border border-[#e7d9cf] dark:border-[#3f2e1e] focus:outline-none focus:ring-2 focus:ring-[#ec6d13]"
                        placeholder="0.00"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Depth (cm)</label>
                      <input
                        type="number"
                        name="depth"
                        value={formData.depth}
                        onChange={handleInputChange}
                        step="0.01"
                        className="w-full px-4 py-2 rounded-md bg-white dark:bg-[#2a1e14] border border-[#e7d9cf] dark:border-[#3f2e1e] focus:outline-none focus:ring-2 focus:ring-[#ec6d13]"
                        placeholder="0.00"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium mb-2">Estimated Delivery (days)</label>
                      <input
                        type="number"
                        name="estimatedDeliveryDays"
                        value={formData.estimatedDeliveryDays}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-md bg-white dark:bg-[#2a1e14] border border-[#e7d9cf] dark:border-[#3f2e1e] focus:outline-none focus:ring-2 focus:ring-[#ec6d13]"
                        placeholder="7"
                      />
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="bg-[#f8f7f6] dark:bg-[#221810] rounded-lg p-6 border border-[#f3ece7] dark:border-[#3a2a1d]">
                  <h2 className="text-xl font-bold mb-4">Tags</h2>
                  
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                        className="flex-1 px-4 py-2 rounded-md bg-white dark:bg-[#2a1e14] border border-[#e7d9cf] dark:border-[#3f2e1e] focus:outline-none focus:ring-2 focus:ring-[#ec6d13]"
                        placeholder="Add a tag"
                      />
                      <button
                        type="button"
                        onClick={handleAddTag}
                        className="px-4 py-2 rounded-md bg-[#ec6d13] text-white hover:bg-[#ec6d13]/90 transition-colors"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>

                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ec6d13]/10 text-[#ec6d13]"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => removeTag(tag)}
                              className="hover:bg-[#ec6d13]/20 rounded-full p-1"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Features */}
                <div className="bg-[#f8f7f6] dark:bg-[#221810] rounded-lg p-6 border border-[#f3ece7] dark:border-[#3a2a1d]">
                  <h2 className="text-xl font-bold mb-4">Features</h2>
                  
                  <div className="space-y-3">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        name="availability"
                        checked={formData.availability}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-[#ec6d13] rounded focus:ring-[#ec6d13]"
                      />
                      <span className="text-sm font-medium">Available for purchase</span>
                    </label>

                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        name="featured"
                        checked={formData.featured}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-[#ec6d13] rounded focus:ring-[#ec6d13]"
                      />
                      <span className="text-sm font-medium">Featured Product</span>
                    </label>

                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        name="popular"
                        checked={formData.popular}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-[#ec6d13] rounded focus:ring-[#ec6d13]"
                      />
                      <span className="text-sm font-medium">Popular Product</span>
                    </label>

                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        name="recent"
                        checked={formData.recent}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-[#ec6d13] rounded focus:ring-[#ec6d13]"
                      />
                      <span className="text-sm font-medium">Recent Product</span>
                    </label>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-4 justify-end">
                  <button
                    type="button"
                    onClick={() => navigate('/admin/products')}
                    className="px-6 py-3 rounded-md bg-[#f3ece7] dark:bg-[#3a2a1d] hover:bg-[#ec6d13]/20 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-3 rounded-md bg-[#ec6d13] text-white hover:bg-[#ec6d13]/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-5 h-5" />
                    {loading ? 'Updating...' : 'Update Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EditProduct;
