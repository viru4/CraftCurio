import React from 'react';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ContactEditor = ({ data, onChange, onSave, saving }) => {
  const handleChange = (field, value) => onChange({ ...data, [field]: value });
  const handleSocialChange = (platform, value) => {
    handleChange('socialLinks', {
      ...data.socialLinks,
      [platform]: value
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-2">Section Title</label>
          <input type="text" value={data.title || ''} onChange={(e) => handleChange('title', e.target.value)}
            className="w-full px-4 py-3 border rounded-lg" placeholder="Join Our Community" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-2">Subtitle</label>
          <input type="text" value={data.subtitle || ''} onChange={(e) => handleChange('subtitle', e.target.value)}
            className="w-full px-4 py-3 border rounded-lg" placeholder="Whether you're looking to..." />
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-stone-800 mb-4">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">Email</label>
            <input type="email" value={data.email || ''} onChange={(e) => handleChange('email', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="hello@craftcurio.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">Phone</label>
            <input type="tel" value={data.phone || ''} onChange={(e) => handleChange('phone', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="+1 (234) 567-890" />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">Address</label>
            <input type="text" value={data.address || ''} onChange={(e) => handleChange('address', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="123 Artisan Street..." />
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-stone-800 mb-4">Social Media Links</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              <span className="flex items-center gap-2">
                Facebook URL
              </span>
            </label>
            <input type="url" value={data.socialLinks?.facebook || ''}
              onChange={(e) => handleSocialChange('facebook', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="https://facebook.com/craftcurio" />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              <span className="flex items-center gap-2">
                Instagram URL
              </span>
            </label>
            <input type="url" value={data.socialLinks?.instagram || ''}
              onChange={(e) => handleSocialChange('instagram', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="https://instagram.com/craftcurio" />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              <span className="flex items-center gap-2">
                Twitter URL
              </span>
            </label>
            <input type="url" value={data.socialLinks?.twitter || ''}
              onChange={(e) => handleSocialChange('twitter', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="https://twitter.com/craftcurio" />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              <span className="flex items-center gap-2">
                LinkedIn URL
              </span>
            </label>
            <input type="url" value={data.socialLinks?.linkedin || ''}
              onChange={(e) => handleSocialChange('linkedin', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="https://linkedin.com/company/craftcurio" />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t">
        <Button onClick={() => onSave(data)} disabled={saving} className="bg-amber-600 hover:bg-amber-700">
          <Save className="w-4 h-4 mr-2" /> {saving ? 'Saving...' : 'Save Contact Info'}
        </Button>
      </div>
    </div>
  );
};

export default ContactEditor;
