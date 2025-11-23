import React from 'react';
import { Save, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const GalleryEditor = ({ data, onChange, onSave, saving }) => {
  const handleChange = (field, value) => onChange({ ...data, [field]: value });
  const handleImageChange = (index, field, value) => {
    const newImages = [...(data.images || [])];
    newImages[index] = { ...newImages[index], [field]: value };
    handleChange('images', newImages);
  };
  const addImage = () => {
    const newImages = [...(data.images || []), {
      src: '', alt: '', title: '', category: 'Products', order: 0
    }];
    handleChange('images', newImages);
  };
  const removeImage = (index) => {
    const newImages = data.images.filter((_, i) => i !== index);
    handleChange('images', newImages);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-2">Title</label>
          <input type="text" value={data.title || ''} onChange={(e) => handleChange('title', e.target.value)}
            className="w-full px-4 py-3 border rounded-lg" placeholder="Gallery" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-2">Subtitle</label>
          <input type="text" value={data.subtitle || ''} onChange={(e) => handleChange('subtitle', e.target.value)}
            className="w-full px-4 py-3 border rounded-lg" placeholder="A glimpse into our world..." />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-semibold text-stone-700">Gallery Images</label>
          <Button onClick={addImage} variant="outline" size="sm"><Plus className="w-4 h-4" /> Add Image</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(data.images || []).map((image, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-3 bg-stone-50">
              <div className="flex justify-between">
                <p className="font-medium text-sm">Image {index + 1}</p>
                <button onClick={() => removeImage(index)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <input type="text" value={image.src || ''} onChange={(e) => handleImageChange(index, 'src', e.target.value)}
                className="w-full px-3 py-2 border rounded text-sm" placeholder="Image URL" />
              <input type="text" value={image.title || ''} onChange={(e) => handleImageChange(index, 'title', e.target.value)}
                className="w-full px-3 py-2 border rounded text-sm" placeholder="Title" />
              <input type="text" value={image.alt || ''} onChange={(e) => handleImageChange(index, 'alt', e.target.value)}
                className="w-full px-3 py-2 border rounded text-sm" placeholder="Alt text" />
              <select value={image.category || 'Products'} onChange={(e) => handleImageChange(index, 'category', e.target.value)}
                className="w-full px-3 py-2 border rounded text-sm">
                <option value="Products">Products</option>
                <option value="Workshop">Workshop</option>
                <option value="Events">Events</option>
                <option value="Team">Team</option>
              </select>
              {image.src && (
                <div className="relative w-full h-32">
                  <img 
                    src={image.src} 
                    alt={image.alt} 
                    className="w-full h-32 object-cover rounded border"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="hidden w-full h-32 items-center justify-center bg-stone-100 rounded border">
                    <p className="text-xs text-stone-500">Failed to load</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t">
        <Button onClick={() => onSave(data)} disabled={saving} className="bg-amber-600 hover:bg-amber-700">
          <Save className="w-4 h-4 mr-2" /> {saving ? 'Saving...' : 'Save Gallery'}
        </Button>
      </div>
    </div>
  );
};

export default GalleryEditor;
