import React, { useState } from 'react';
import { Save, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ImageUpload from '@/components/common/ImageUpload';

/**
 * Hero Section Editor Component
 * Manages hero headline, tagline, highlight text, and hero image
 */
const HeroEditor = ({ data, onChange, onSave, saving }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleChange = (field, value) => {
    // Reset image error when URL changes
    if (field === 'image') {
      setImageError(false);
      setImageLoading(true);
    }
    
    onChange({
      ...data,
      [field]: value
    });
  };

  const handleSave = () => {
    onSave(data);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  return (
    <div className="space-y-6">
      {/* Headline */}
      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-2">
          Headline
        </label>
        <input
          type="text"
          value={data.headline || ''}
          onChange={(e) => handleChange('headline', e.target.value)}
          className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
          placeholder="Welcome to CraftCurio"
        />
        <p className="text-sm text-stone-500 mt-1">
          Main headline text displayed in hero section
        </p>
      </div>

      {/* Highlight Text */}
      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-2">
          Highlighted Word
        </label>
        <input
          type="text"
          value={data.highlightText || ''}
          onChange={(e) => handleChange('highlightText', e.target.value)}
          className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
          placeholder="CraftCurio"
        />
        <p className="text-sm text-stone-500 mt-1">
          Text to highlight with gradient color in the headline
        </p>
      </div>

      {/* Tagline */}
      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-2">
          Tagline
        </label>
        <textarea
          value={data.tagline || ''}
          onChange={(e) => handleChange('tagline', e.target.value)}
          rows={3}
          className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
          placeholder="Discover the journey of curated collectibles..."
        />
        <p className="text-sm text-stone-500 mt-1">
          Subtitle text below the headline
        </p>
      </div>

      {/* Hero Image */}
      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-2">
          Hero Image
        </label>
        
        {/* Cloudinary Upload Component */}
        <div className="mb-3">
          <ImageUpload
            onUploadComplete={(url) => {
              handleChange('image', url);
              setUploadingImage(false);
            }}
            onUploadError={(error) => {
              console.error('Upload error:', error);
              alert('Failed to upload image. Please try again.');
              setUploadingImage(false);
            }}
            multiple={false}
            currentImages={data.image ? [data.image] : []}
            onRemoveImage={() => handleChange('image', '')}
            label="Upload Hero Image"
            folder="about-us/hero"
            showPreview={true}
          />
        </div>
        
        {/* Manual URL Input (Fallback) */}
        <div>
          <label className="block text-xs font-medium text-stone-600 mb-1">
            Or enter image URL manually:
          </label>
          <input
            type="text"
            value={data.image || ''}
            onChange={(e) => handleChange('image', e.target.value)}
            className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent text-sm"
            placeholder="https://res.cloudinary.com/..."
          />
        </div>
        
        {/* Image Preview */}
        {data.image && (
          <div className="mt-4">
            <p className="text-sm font-medium text-stone-700 mb-2">Preview:</p>
            <div className="relative w-full max-w-md">
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-stone-100 rounded-lg">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
                </div>
              )}
              {imageError ? (
                <div className="w-full h-48 flex items-center justify-center bg-stone-100 rounded-lg border border-stone-300">
                  <p className="text-stone-500 text-sm">Failed to load image</p>
                </div>
              ) : (
                <img
                  src={data.image}
                  alt="Hero preview"
                  className="w-full h-48 object-cover rounded-lg border border-stone-300"
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4 border-t border-stone-200">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Hero Section'}
        </Button>
      </div>
    </div>
  );
};

export default HeroEditor;
