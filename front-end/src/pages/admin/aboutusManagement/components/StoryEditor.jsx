import React, { useState } from 'react';
import { Save, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Story Section Editor Component
 * Manages story paragraphs, image, and highlights
 */
const StoryEditor = ({ data, onChange, onSave, saving }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const handleChange = (field, value) => {
    if (field === 'image') {
      setImageError(false);
      setImageLoading(true);
    }
    onChange({
      ...data,
      [field]: value
    });
  };

  const handleParagraphChange = (index, value) => {
    const newParagraphs = [...(data.paragraphs || [])];
    newParagraphs[index] = value;
    handleChange('paragraphs', newParagraphs);
  };

  const addParagraph = () => {
    const newParagraphs = [...(data.paragraphs || []), ''];
    handleChange('paragraphs', newParagraphs);
  };

  const removeParagraph = (index) => {
    const newParagraphs = data.paragraphs.filter((_, i) => i !== index);
    handleChange('paragraphs', newParagraphs);
  };

  const handleHighlightChange = (index, field, value) => {
    const newHighlights = [...(data.highlights || [])];
    newHighlights[index] = {
      ...newHighlights[index],
      [field]: value
    };
    handleChange('highlights', newHighlights);
  };

  const addHighlight = () => {
    const newHighlights = [...(data.highlights || []), { icon: 'Sparkles', title: '', description: '' }];
    handleChange('highlights', newHighlights);
  };

  const removeHighlight = (index) => {
    const newHighlights = data.highlights.filter((_, i) => i !== index);
    handleChange('highlights', newHighlights);
  };

  const handleSave = () => {
    onSave(data);
  };

  return (
    <div className="space-y-6">
      {/* Section Title */}
      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-2">
          Section Title
        </label>
        <input
          type="text"
          value={data.title || ''}
          onChange={(e) => handleChange('title', e.target.value)}
          className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
          placeholder="Our Story"
        />
      </div>

      {/* Story Paragraphs */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-semibold text-stone-700">
            Story Paragraphs
          </label>
          <Button
            onClick={addParagraph}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Paragraph
          </Button>
        </div>
        
        <div className="space-y-3">
          {(data.paragraphs || []).map((paragraph, index) => (
            <div key={index} className="relative">
              <textarea
                value={paragraph}
                onChange={(e) => handleParagraphChange(index, e.target.value)}
                rows={4}
                className="w-full px-4 py-3 pr-12 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
                placeholder={`Paragraph ${index + 1}...`}
              />
              <button
                onClick={() => removeParagraph(index)}
                className="absolute top-3 right-3 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Story Image */}
      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-2">
          Story Image URL
        </label>
        <input
          type="text"
          value={data.image || ''}
          onChange={(e) => handleChange('image', e.target.value)}
          className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
          placeholder="/images/story.jpg"
        />
        
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
                  alt="Story preview"
                  className="w-full h-48 object-cover rounded-lg border border-stone-300"
                  onLoad={() => { setImageLoading(false); setImageError(false); }}
                  onError={() => { setImageLoading(false); setImageError(true); }}
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Highlights */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-semibold text-stone-700">
            Story Highlights
          </label>
          <Button
            onClick={addHighlight}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Highlight
          </Button>
        </div>
        
        <div className="space-y-4">
          {(data.highlights || []).map((highlight, index) => (
            <div key={index} className="p-4 border border-stone-300 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <p className="font-medium text-stone-700">Highlight {index + 1}</p>
                <button
                  onClick={() => removeHighlight(index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">
                    Icon
                  </label>
                  <input
                    type="text"
                    value={highlight.icon || ''}
                    onChange={(e) => handleHighlightChange(index, 'icon', e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                    placeholder="Sparkles"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={highlight.title || ''}
                    onChange={(e) => handleHighlightChange(index, 'title', e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                    placeholder="Inspiration"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    value={highlight.description || ''}
                    onChange={(e) => handleHighlightChange(index, 'description', e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                    placeholder="Born from passion..."
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4 border-t border-stone-200">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Story Section'}
        </Button>
      </div>
    </div>
  );
};

export default StoryEditor;
