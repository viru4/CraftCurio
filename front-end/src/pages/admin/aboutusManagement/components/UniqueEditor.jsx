import React from 'react';
import { Save, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const UniqueEditor = ({ data, onChange, onSave, saving }) => {
  const handleChange = (field, value) => onChange({ ...data, [field]: value });
  const handleFeatureChange = (index, field, value) => {
    const newFeatures = [...(data.features || [])];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    handleChange('features', newFeatures);
  };
  const addFeature = () => {
    const newFeatures = [...(data.features || []), {
      title: '', description: '', icon: 'Star', gradient: 'from-amber-500 to-orange-600', order: 0
    }];
    handleChange('features', newFeatures);
  };
  const removeFeature = (index) => {
    const newFeatures = data.features.filter((_, i) => i !== index);
    handleChange('features', newFeatures);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-2">Section Title</label>
        <input type="text" value={data.title || ''} onChange={(e) => handleChange('title', e.target.value)}
          className="w-full px-4 py-3 border rounded-lg" placeholder="Why Choose CraftCurio?" />
      </div>
      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-2">Subtitle</label>
        <input type="text" value={data.subtitle || ''} onChange={(e) => handleChange('subtitle', e.target.value)}
          className="w-full px-4 py-3 border rounded-lg" placeholder="What sets us apart..." />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-semibold text-stone-700">Unique Features</label>
          <Button onClick={addFeature} variant="outline" size="sm"><Plus className="w-4 h-4" /> Add</Button>
        </div>
        <div className="space-y-4">
          {(data.features || []).map((feature, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-3 bg-stone-50">
              <div className="flex justify-between">
                <p className="font-medium">Feature {index + 1}</p>
                <button onClick={() => removeFeature(index)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input type="text" value={feature.title || ''} onChange={(e) => handleFeatureChange(index, 'title', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Feature Title" />
                <input type="text" value={feature.icon || ''} onChange={(e) => handleFeatureChange(index, 'icon', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Icon (e.g., Star)" />
              </div>
              <textarea value={feature.description || ''} onChange={(e) => handleFeatureChange(index, 'description', e.target.value)}
                rows={2} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Description" />
              <input type="text" value={feature.gradient || ''} onChange={(e) => handleFeatureChange(index, 'gradient', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Gradient (e.g., from-blue-500 to-blue-600)" />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t">
        <Button onClick={() => onSave(data)} disabled={saving} className="bg-amber-600 hover:bg-amber-700">
          <Save className="w-4 h-4 mr-2" /> {saving ? 'Saving...' : 'Save Unique Features'}
        </Button>
      </div>
    </div>
  );
};

export default UniqueEditor;
