import React from 'react';
import { Save, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ImageUpload from '@/components/common/ImageUpload';

const TeamEditor = ({ data, onChange, onSave, saving }) => {
  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  const handleMemberChange = (index, field, value) => {
    const newMembers = [...(data?.members || [])];
    newMembers[index] = { ...newMembers[index], [field]: value };
    handleChange('members', newMembers);
  };

  const addMember = () => {
    const newMembers = [...(data?.members || []), {
      name: '', role: '', bio: '', image: '/api/placeholder/300/300',
      linkedin: '#', email: '', order: 0
    }];
    handleChange('members', newMembers);
  };

  const removeMember = (index) => {
    const newMembers = (data?.members || []).filter((_, i) => i !== index);
    handleChange('members', newMembers);
  };

  const handleSave = () => {
    if (!onSave || !data) return;
    
    // Validate team members
    const invalidMembers = (data.members || []).filter(member => 
      !member.name || !member.role || !member.bio || !member.email
    );
    
    if (invalidMembers.length > 0) {
      alert('Please fill in all required fields (Name, Role, Bio, Email) for all team members before saving.');
      return;
    }
    
    onSave(data);
  };

  // Safety check for data
  if (!data) {
    return <div className="text-stone-600">Loading team data...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-2">Section Title</label>
        <input type="text" value={data.title || ''} onChange={(e) => handleChange('title', e.target.value)}
          className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-600" placeholder="Meet the Team" />
      </div>

      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-2">Subtitle</label>
        <input type="text" value={data.subtitle || ''} onChange={(e) => handleChange('subtitle', e.target.value)}
          className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-600"
          placeholder="Passionate individuals dedicated to..." />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-semibold text-stone-700">Team Members</label>
          <Button onClick={addMember} variant="outline" size="sm" className="flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Member
          </Button>
        </div>
        
        <div className="space-y-6">
          {(data.members || []).map((member, index) => (
            <div key={index} className="p-4 border border-stone-300 rounded-lg space-y-3 bg-stone-50">
              <div className="flex items-center justify-between">
                <p className="font-medium text-stone-700">Team Member {index + 1}</p>
                <button onClick={() => removeMember(index)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">Name *</label>
                  <input type="text" value={member.name || ''} onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">Role *</label>
                  <input type="text" value={member.role || ''} onChange={(e) => handleMemberChange(index, 'role', e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm" placeholder="CEO & Founder" />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">Bio *</label>
                <textarea value={member.bio || ''} onChange={(e) => handleMemberChange(index, 'bio', e.target.value)}
                  rows={3} className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                  placeholder="Brief biography..." />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">Email *</label>
                  <input type="email" value={member.email || ''} onChange={(e) => handleMemberChange(index, 'email', e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm" placeholder="john@craftcurio.com" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">LinkedIn URL</label>
                  <input type="text" value={member.linkedin || ''} onChange={(e) => handleMemberChange(index, 'linkedin', e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm" placeholder="https://linkedin.com/in/..." />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">Profile Image</label>
                
                {/* Cloudinary Upload Component */}
                <div className="mb-2">
                  <ImageUpload
                    onUploadComplete={(url) => {
                      handleMemberChange(index, 'image', url);
                    }}
                    onUploadError={(error) => {
                      console.error('Upload error:', error);
                      alert('Failed to upload image. Please try again.');
                    }}
                    multiple={false}
                    currentImages={member.image ? [member.image] : []}
                    onRemoveImage={() => handleMemberChange(index, 'image', '/api/placeholder/300/300')}
                    label="Upload Profile Image"
                    folder="about-us/team"
                    showPreview={true}
                  />
                </div>
                
                {/* Manual URL Input (Fallback) */}
                <div>
                  <label className="block text-xs font-medium text-stone-500 mb-1">
                    Or enter URL manually:
                  </label>
                  <input 
                    type="text" 
                    value={member.image || ''} 
                    onChange={(e) => handleMemberChange(index, 'image', e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm" 
                    placeholder="https://res.cloudinary.com/..." 
                  />
                </div>
                
                {member.image && member.image !== '/api/placeholder/300/300' && (
                  <div className="mt-2 relative w-24 h-24">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-24 h-24 object-cover rounded-lg border"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="hidden w-24 h-24 items-center justify-center bg-stone-100 rounded-lg border">
                      <p className="text-xs text-stone-500">No image</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-stone-200">
        <Button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700">
          <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Team Section'}
        </Button>
      </div>
    </div>
  );
};

export default TeamEditor;
