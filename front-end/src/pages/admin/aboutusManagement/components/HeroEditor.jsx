import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Hero Section Editor Component
 * Manages hero headline, tagline, highlight text, and hero image
 */
const HeroEditor = ({ data, onChange, onSave, saving }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

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
          Hero Image URL
        </label>
        <input
          type="text"
          value={data.image || ''}
          onChange={(e) => handleChange('image', e.target.value)}
          className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
          placeholder="/images/hero-banner.jpg"
        />
        <p className="text-sm text-stone-500 mt-1">
          URL or path to the hero image (recommended: 1200x800px)
        </p>
        
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
