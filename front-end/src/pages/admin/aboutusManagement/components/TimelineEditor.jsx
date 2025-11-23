import React from 'react';
import { Save, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TimelineEditor = ({ data, onChange, onSave, saving }) => {
  const handleChange = (field, value) => onChange({ ...data, [field]: value });
  const handleMilestoneChange = (index, field, value) => {
    const newMilestones = [...(data.milestones || [])];
    newMilestones[index] = { ...newMilestones[index], [field]: value };
    handleChange('milestones', newMilestones);
  };
  const addMilestone = () => {
    const newMilestones = [...(data.milestones || []), {
      year: '', month: '', title: '', description: '', icon: 'Rocket', stats: '', order: 0
    }];
    handleChange('milestones', newMilestones);
  };
  const removeMilestone = (index) => {
    const newMilestones = data.milestones.filter((_, i) => i !== index);
    handleChange('milestones', newMilestones);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-2">Section Title</label>
          <input type="text" value={data.title || ''} onChange={(e) => handleChange('title', e.target.value)}
            className="w-full px-4 py-3 border border-stone-300 rounded-lg" placeholder="Our Journey" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-2">Subtitle</label>
          <input type="text" value={data.subtitle || ''} onChange={(e) => handleChange('subtitle', e.target.value)}
            className="w-full px-4 py-3 border border-stone-300 rounded-lg" placeholder="From humble beginnings..." />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-2">Statistics</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <input type="text" value={data.stats?.artisans || ''} onChange={(e) => handleChange('stats', { ...data.stats, artisans: e.target.value })}
            className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm" placeholder="1000+ Artisans" />
          <input type="text" value={data.stats?.collectors || ''} onChange={(e) => handleChange('stats', { ...data.stats, collectors: e.target.value })}
            className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm" placeholder="50K+ Collectors" />
          <input type="text" value={data.stats?.countries || ''} onChange={(e) => handleChange('stats', { ...data.stats, countries: e.target.value })}
            className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm" placeholder="30+ Countries" />
          <input type="text" value={data.stats?.itemsSold || ''} onChange={(e) => handleChange('stats', { ...data.stats, itemsSold: e.target.value })}
            className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm" placeholder="100K+ Items" />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-semibold text-stone-700">Milestones</label>
          <Button onClick={addMilestone} variant="outline" size="sm"><Plus className="w-4 h-4" /> Add</Button>
        </div>
        <div className="space-y-4">
          {(data.milestones || []).map((milestone, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-3 bg-stone-50">
              <div className="flex justify-between">
                <p className="font-medium">Milestone {index + 1}</p>
                <button onClick={() => removeMilestone(index)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <input type="text" value={milestone.year || ''} onChange={(e) => handleMilestoneChange(index, 'year', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="2024" />
                <input type="text" value={milestone.month || ''} onChange={(e) => handleMilestoneChange(index, 'month', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="January" />
                <input type="text" value={milestone.icon || ''} onChange={(e) => handleMilestoneChange(index, 'icon', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Rocket" />
              </div>
              <input type="text" value={milestone.title || ''} onChange={(e) => handleMilestoneChange(index, 'title', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Title" />
              <textarea value={milestone.description || ''} onChange={(e) => handleMilestoneChange(index, 'description', e.target.value)}
                rows={2} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Description" />
              <input type="text" value={milestone.stats || ''} onChange={(e) => handleMilestoneChange(index, 'stats', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Stats (e.g., 50 artisans)" />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t">
        <Button onClick={() => onSave(data)} disabled={saving} className="bg-amber-600 hover:bg-amber-700">
          <Save className="w-4 h-4 mr-2" /> {saving ? 'Saving...' : 'Save Timeline'}
        </Button>
      </div>
    </div>
  );
};

export default TimelineEditor;
