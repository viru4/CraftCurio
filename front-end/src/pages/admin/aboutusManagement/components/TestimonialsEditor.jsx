import React from 'react';
import { Save, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ImageUpload from '@/components/common/ImageUpload';

const TestimonialsEditor = ({ data, onChange, onSave, saving }) => {
  const handleChange = (field, value) => onChange({ ...data, [field]: value });
  const handleTestimonialChange = (index, field, value) => {
    const newItems = [...(data.items || [])];
    newItems[index] = { ...newItems[index], [field]: value };
    handleChange('items', newItems);
  };
  const addTestimonial = () => {
    const newItems = [...(data.items || []), {
      name: '', role: '', quote: '', image: '/api/placeholder/100/100',
      type: 'collector', rating: 5, order: 0
    }];
    handleChange('items', newItems);
  };
  const removeTestimonial = (index) => {
    const newItems = data.items.filter((_, i) => i !== index);
    handleChange('items', newItems);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-2">Title</label>
          <input type="text" value={data.title || ''} onChange={(e) => handleChange('title', e.target.value)}
            className="w-full px-4 py-3 border rounded-lg" placeholder="What People Say" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-2">Subtitle</label>
          <input type="text" value={data.subtitle || ''} onChange={(e) => handleChange('subtitle', e.target.value)}
            className="w-full px-4 py-3 border rounded-lg" placeholder="Hear from our community..." />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-semibold text-stone-700">Testimonials</label>
          <Button onClick={addTestimonial} variant="outline" size="sm"><Plus className="w-4 h-4" /> Add</Button>
        </div>
        <div className="space-y-4">
          {(data.items || []).map((testimonial, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-3 bg-stone-50">
              <div className="flex justify-between">
                <p className="font-medium">Testimonial {index + 1}</p>
                <button onClick={() => removeTestimonial(index)} className="p-2 text-red-600 hover:bg-red-50 rounded">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input type="text" value={testimonial.name || ''} onChange={(e) => handleTestimonialChange(index, 'name', e.target.value)}
                  className="px-3 py-2 border rounded text-sm" placeholder="Name" />
                <input type="text" value={testimonial.role || ''} onChange={(e) => handleTestimonialChange(index, 'role', e.target.value)}
                  className="px-3 py-2 border rounded text-sm" placeholder="Role" />
              </div>
              <textarea value={testimonial.quote || ''} onChange={(e) => handleTestimonialChange(index, 'quote', e.target.value)}
                rows={3} className="w-full px-3 py-2 border rounded text-sm" placeholder="Testimonial quote" />
              
              {/* Profile Image Upload */}
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">Profile Image</label>
                <ImageUpload
                  onUploadComplete={(url) => {
                    handleTestimonialChange(index, 'image', url);
                  }}
                  onUploadError={(error) => {
                    console.error('Upload error:', error);
                    alert('Failed to upload image. Please try again.');
                  }}
                  multiple={false}
                  currentImages={testimonial.image && testimonial.image !== '/api/placeholder/100/100' ? [testimonial.image] : []}
                  onRemoveImage={() => handleTestimonialChange(index, 'image', '/api/placeholder/100/100')}
                  label="Upload"
                  folder="about-us/testimonials"
                  showPreview={false}
                />
                <input 
                  type="text" 
                  value={testimonial.image || ''} 
                  onChange={(e) => handleTestimonialChange(index, 'image', e.target.value)}
                  className="mt-2 w-full px-3 py-2 border rounded text-sm" 
                  placeholder="Or enter URL manually" 
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <select value={testimonial.type || 'collector'} onChange={(e) => handleTestimonialChange(index, 'type', e.target.value)}
                  className="px-3 py-2 border rounded text-sm">
                  <option value="collector">Collector</option>
                  <option value="artisan">Artisan</option>
                </select>
                <select value={testimonial.rating || 5} onChange={(e) => handleTestimonialChange(index, 'rating', Number(e.target.value))}
                  className="px-3 py-2 border rounded text-sm">
                  <option value={5}>5 Stars</option>
                  <option value={4}>4 Stars</option>
                  <option value={3}>3 Stars</option>
                  <option value={2}>2 Stars</option>
                  <option value={1}>1 Star</option>
                </select>
              </div>
              {testimonial.image && testimonial.image !== '/api/placeholder/100/100' && (
                <img src={testimonial.image} alt={testimonial.name} className="w-16 h-16 object-cover rounded-full border"
                  onError={(e) => { e.target.src = '/api/placeholder/100/100'; }} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t">
        <Button onClick={() => onSave(data)} disabled={saving} className="bg-amber-600 hover:bg-amber-700">
          <Save className="w-4 h-4 mr-2" /> {saving ? 'Saving...' : 'Save Testimonials'}
        </Button>
      </div>
    </div>
  );
};

export default TestimonialsEditor;
