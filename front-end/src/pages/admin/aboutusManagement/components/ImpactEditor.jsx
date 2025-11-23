import React from 'react';
import { Save, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ImpactEditor = ({ data, onChange, onSave, saving }) => {
  const handleChange = (field, value) => onChange({ ...data, [field]: value });

  const handleSave = () => {
    // Validate statistics
    if (data.statistics && data.statistics.length > 0) {
      const invalidStats = data.statistics.some(stat => !stat.value || !stat.label || !stat.description);
      if (invalidStats) {
        alert('⚠️ Please fill in all required fields (value, label, description) for statistics before saving.');
        return;
      }
    }

    // Validate initiatives
    if (data.initiatives && data.initiatives.length > 0) {
      const invalidInitiatives = data.initiatives.some(init => !init.title || !init.description);
      if (invalidInitiatives) {
        alert('⚠️ Please fill in all required fields (title, description) for initiatives before saving.');
        return;
      }
    }

    onSave(data);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-2">Title</label>
          <input type="text" value={data.title || ''} onChange={(e) => handleChange('title', e.target.value)}
            className="w-full px-4 py-3 border rounded-lg" placeholder="Our Impact" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-2">Subtitle</label>
          <input type="text" value={data.subtitle || ''} onChange={(e) => handleChange('subtitle', e.target.value)}
            className="w-full px-4 py-3 border rounded-lg" placeholder="Creating positive change..." />
        </div>
      </div>

      {/* Statistics */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-semibold text-stone-700">Impact Statistics</label>
          <Button onClick={() => {
            const newStats = [...(data.statistics || []), { value: '', label: '', description: '', icon: 'Users', order: 0 }];
            handleChange('statistics', newStats);
          }} variant="outline" size="sm"><Plus className="w-4 h-4" /> Add</Button>
        </div>
        <div className="space-y-3">
          {(data.statistics || []).map((stat, index) => (
            <div key={index} className="p-3 border rounded-lg grid grid-cols-4 gap-2 items-center bg-stone-50">
              <input type="text" value={stat.value || ''} onChange={(e) => {
                const newStats = [...data.statistics];
                newStats[index] = { ...newStats[index], value: e.target.value };
                handleChange('statistics', newStats);
              }} className="px-2 py-1 border rounded text-sm" placeholder="1000+" />
              <input type="text" value={stat.label || ''} onChange={(e) => {
                const newStats = [...data.statistics];
                newStats[index] = { ...newStats[index], label: e.target.value };
                handleChange('statistics', newStats);
              }} className="px-2 py-1 border rounded text-sm" placeholder="Label" />
              <input type="text" value={stat.description || ''} onChange={(e) => {
                const newStats = [...data.statistics];
                newStats[index] = { ...newStats[index], description: e.target.value };
                handleChange('statistics', newStats);
              }} className="px-2 py-1 border rounded text-sm" placeholder="Description" />
              <button onClick={() => {
                const newStats = data.statistics.filter((_, i) => i !== index);
                handleChange('statistics', newStats);
              }} className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      </div>

      {/* Initiatives */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-semibold text-stone-700">Initiatives</label>
          <Button onClick={() => {
            const newInitiatives = [...(data.initiatives || []), { title: '', description: '', image: '', icon: 'GraduationCap', order: 0 }];
            handleChange('initiatives', newInitiatives);
          }} variant="outline" size="sm"><Plus className="w-4 h-4" /> Add</Button>
        </div>
        <div className="space-y-4">
          {(data.initiatives || []).map((initiative, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-3 bg-stone-50">
              <div className="flex justify-between">
                <p className="font-medium">Initiative {index + 1}</p>
                <button onClick={() => {
                  const newInitiatives = data.initiatives.filter((_, i) => i !== index);
                  handleChange('initiatives', newInitiatives);
                }} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
              </div>
              <input type="text" value={initiative.title || ''} onChange={(e) => {
                const newInitiatives = [...data.initiatives];
                newInitiatives[index] = { ...newInitiatives[index], title: e.target.value };
                handleChange('initiatives', newInitiatives);
              }} className="w-full px-3 py-2 border rounded text-sm" placeholder="Title" />
              <textarea value={initiative.description || ''} onChange={(e) => {
                const newInitiatives = [...data.initiatives];
                newInitiatives[index] = { ...newInitiatives[index], description: e.target.value };
                handleChange('initiatives', newInitiatives);
              }} rows={2} className="w-full px-3 py-2 border rounded text-sm" placeholder="Description" />
              <input type="text" value={initiative.image || ''} onChange={(e) => {
                const newInitiatives = [...data.initiatives];
                newInitiatives[index] = { ...newInitiatives[index], image: e.target.value };
                handleChange('initiatives', newInitiatives);
              }} className="w-full px-3 py-2 border rounded text-sm" placeholder="Image URL" />
            </div>
          ))}
        </div>
      </div>

      {/* Stories */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-semibold text-stone-700">Impact Stories</label>
          <Button onClick={() => {
            const newStories = [...(data.stories || []), { quote: '', author: '', location: '' }];
            handleChange('stories', newStories);
          }} variant="outline" size="sm"><Plus className="w-4 h-4" /> Add</Button>
        </div>
        <div className="space-y-3">
          {(data.stories || []).map((story, index) => (
            <div key={index} className="p-3 border rounded-lg space-y-2 bg-stone-50">
              <div className="flex justify-between mb-2">
                <p className="text-sm font-medium">Story {index + 1}</p>
                <button onClick={() => {
                  const newStories = data.stories.filter((_, i) => i !== index);
                  handleChange('stories', newStories);
                }} className="text-red-600 hover:bg-red-50 rounded p-1"><Trash2 className="w-4 h-4" /></button>
              </div>
              <textarea value={story.quote || ''} onChange={(e) => {
                const newStories = [...data.stories];
                newStories[index] = { ...newStories[index], quote: e.target.value };
                handleChange('stories', newStories);
              }} rows={2} className="w-full px-2 py-1 border rounded text-sm" placeholder="Quote" />
              <div className="grid grid-cols-2 gap-2">
                <input type="text" value={story.author || ''} onChange={(e) => {
                  const newStories = [...data.stories];
                  newStories[index] = { ...newStories[index], author: e.target.value };
                  handleChange('stories', newStories);
                }} className="px-2 py-1 border rounded text-sm" placeholder="Author" />
                <input type="text" value={story.location || ''} onChange={(e) => {
                  const newStories = [...data.stories];
                  newStories[index] = { ...newStories[index], location: e.target.value };
                  handleChange('stories', newStories);
                }} className="px-2 py-1 border rounded text-sm" placeholder="Location" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t">
        <Button onClick={handleSave} disabled={saving} className="bg-amber-600 hover:bg-amber-700">
          <Save className="w-4 h-4 mr-2" /> {saving ? 'Saving...' : 'Save Impact Section'}
        </Button>
      </div>
    </div>
  );
};

export default ImpactEditor;
