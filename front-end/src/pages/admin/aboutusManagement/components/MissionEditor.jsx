import React from 'react';
import { Save, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MissionEditor = ({ data, onChange, onSave, saving }) => {
  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  const handleValueChange = (index, field, value) => {
    const newValues = [...(data.values || [])];
    newValues[index] = { ...newValues[index], [field]: value };
    handleChange('values', newValues);
  };

  const addValue = () => {
    const newValues = [...(data.values || []), { title: '', description: '', icon: 'Target', color: 'bg-amber-600', order: 0 }];
    handleChange('values', newValues);
  };

  const removeValue = (index) => {
    const newValues = data.values.filter((_, i) => i !== index);
    handleChange('values', newValues);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-2">Section Title</label>
        <input type="text" value={data.title || ''} onChange={(e) => handleChange('title', e.target.value)}
          className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-600" placeholder="Mission & Values" />
      </div>

      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-2">Mission Statement</label>
        <textarea value={data.missionStatement || ''} onChange={(e) => handleChange('missionStatement', e.target.value)}
          rows={4} className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-600"
          placeholder="Our mission is to..." />
      </div>

      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-2">Vision Statement</label>
        <textarea value={data.visionStatement || ''} onChange={(e) => handleChange('visionStatement', e.target.value)}
          rows={4} className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-600"
          placeholder="Our vision is to become..." />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-semibold text-stone-700">Core Values</label>
          <Button onClick={addValue} variant="outline" size="sm" className="flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Value
          </Button>
        </div>
        
        <div className="space-y-4">
          {(data.values || []).map((value, index) => (
            <div key={index} className="p-4 border border-stone-300 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <p className="font-medium text-stone-700">Value {index + 1}</p>
                <button onClick={() => removeValue(index)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input type="text" value={value.title || ''} onChange={(e) => handleValueChange(index, 'title', e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm" placeholder="Title" />
                <input type="text" value={value.icon || ''} onChange={(e) => handleValueChange(index, 'icon', e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm" placeholder="Icon (e.g., Target)" />
              </div>
              
              <textarea value={value.description || ''} onChange={(e) => handleValueChange(index, 'description', e.target.value)}
                rows={2} className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm" placeholder="Description" />
              
              <input type="text" value={value.color || ''} onChange={(e) => handleValueChange(index, 'color', e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm" placeholder="Color class (e.g., bg-blue-600)" />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-stone-200">
        <Button onClick={() => onSave(data)} disabled={saving} className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700">
          <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Mission Section'}
        </Button>
      </div>
    </div>
  );
};

export default MissionEditor;
