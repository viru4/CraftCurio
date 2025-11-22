import React, { useState } from 'react';
import { X } from 'lucide-react';

const ProfileDetailsForm = ({ 
  profileData, 
  onInputChange, 
  onAddSpecialization, 
  onRemoveSpecialization 
}) => {
  const [newSpecialization, setNewSpecialization] = useState('');

  const handleAddSpecialization = (e) => {
    if (e.key === 'Enter' && newSpecialization.trim()) {
      e.preventDefault();
      onAddSpecialization(newSpecialization);
      setNewSpecialization('');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
      {/* Display Name */}
      <div className="md:col-span-1">
        <label className="flex flex-col">
          <span className="text-stone-800 text-base font-medium leading-normal pb-2">
            Display Name
          </span>
          <input
            type="text"
            value={profileData.displayName}
            onChange={(e) => onInputChange('displayName', e.target.value)}
            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-stone-900 focus:outline-0 focus:ring-2 focus:ring-[#ec6d13]/50 border border-stone-300 bg-white h-14 placeholder:text-stone-500 p-[15px] text-base font-normal leading-normal"
            placeholder="Your display name"
          />
        </label>
      </div>

      {/* Location */}
      <div className="md:col-span-1">
        <label className="flex flex-col">
          <span className="text-stone-800 text-base font-medium leading-normal pb-2">
            Location
          </span>
          <input
            type="text"
            value={profileData.location}
            onChange={(e) => onInputChange('location', e.target.value)}
            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-stone-900 focus:outline-0 focus:ring-2 focus:ring-[#ec6d13]/50 border border-stone-300 bg-white h-14 placeholder:text-stone-500 p-[15px] text-base font-normal leading-normal"
            placeholder="e.g., San Francisco, CA"
          />
        </label>
      </div>

      {/* Public Email */}
      <div className="md:col-span-1">
        <label className="flex flex-col">
          <span className="text-stone-800 text-base font-medium leading-normal pb-2">
            Public Email
          </span>
          <input
            type="email"
            value={profileData.publicEmail}
            onChange={(e) => onInputChange('publicEmail', e.target.value)}
            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-stone-900 focus:outline-0 focus:ring-2 focus:ring-[#ec6d13]/50 border border-stone-300 bg-white h-14 placeholder:text-stone-500 p-[15px] text-base font-normal leading-normal"
            placeholder="your.email@example.com"
          />
        </label>
      </div>

      {/* Bio / About Me */}
      <div className="md:col-span-2">
        <label className="flex flex-col">
          <span className="text-stone-800 text-base font-medium leading-normal pb-2">
            Brief Bio (for preview cards)
          </span>
          <textarea
            value={profileData.bio}
            onChange={(e) => onInputChange('bio', e.target.value)}
            className="form-textarea flex w-full min-w-0 flex-1 resize-y overflow-hidden rounded-xl text-stone-900 focus:outline-0 focus:ring-2 focus:ring-[#ec6d13]/50 border border-stone-300 bg-white min-h-24 placeholder:text-stone-500 p-[15px] text-base font-normal leading-normal"
            placeholder="A short summary about your craft (2-3 sentences)..."
            rows={3}
            maxLength={200}
          />
          <p className="text-stone-500 text-sm mt-1">
            {profileData.bio?.length || 0}/200 characters
          </p>
        </label>
      </div>

      {/* Full Bio / Story */}
      <div className="md:col-span-2">
        <label className="flex flex-col">
          <span className="text-stone-800 text-base font-medium leading-normal pb-2">
            Full Story (for your artisan story page)
          </span>
          <textarea
            value={profileData.fullBio}
            onChange={(e) => onInputChange('fullBio', e.target.value)}
            className="form-textarea flex w-full min-w-0 flex-1 resize-y overflow-hidden rounded-xl text-stone-900 focus:outline-0 focus:ring-2 focus:ring-[#ec6d13]/50 border border-stone-300 bg-white min-h-40 placeholder:text-stone-500 p-[15px] text-base font-normal leading-normal"
            placeholder="Tell your complete story - your journey, inspiration, techniques, and what makes your craft special..."
            rows={8}
          />
        </label>
      </div>

      {/* Experience Years */}
      <div className="md:col-span-1">
        <label className="flex flex-col">
          <span className="text-stone-800 text-base font-medium leading-normal pb-2">
            Years of Experience
          </span>
          <input
            type="number"
            min="0"
            max="100"
            value={profileData.experienceYears}
            onChange={(e) => onInputChange('experienceYears', parseInt(e.target.value) || 0)}
            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-stone-900 focus:outline-0 focus:ring-2 focus:ring-[#ec6d13]/50 border border-stone-300 bg-white h-14 placeholder:text-stone-500 p-[15px] text-base font-normal leading-normal"
            placeholder="e.g., 10"
          />
        </label>
      </div>

      {/* Craft Specializations */}
      <div className="md:col-span-2">
        <label className="flex flex-col">
          <span className="text-stone-800 text-base font-medium leading-normal pb-2">
            Craft Specializations
          </span>
          <div className="flex flex-wrap items-center gap-2 rounded-xl border border-stone-300 bg-white p-3 min-h-[56px]">
            {/* Existing specializations */}
            {profileData.specializations.map((spec, index) => (
              <div 
                key={index}
                className="flex items-center gap-2 rounded-lg bg-stone-100 px-3 py-1.5"
              >
                <span className="text-sm font-medium text-stone-800">{spec}</span>
                <button
                  onClick={() => onRemoveSpecialization(index)}
                  className="text-stone-500 hover:text-stone-800 transition-colors"
                  type="button"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            
            {/* Input for new specialization */}
            <input
              type="text"
              value={newSpecialization}
              onChange={(e) => setNewSpecialization(e.target.value)}
              onKeyDown={handleAddSpecialization}
              className="form-input flex-1 bg-transparent text-stone-900 placeholder:text-stone-500 focus:outline-none p-1.5 min-w-[120px] border-0"
              placeholder="Add a new craft..."
            />
          </div>
          <p className="text-stone-500 text-sm mt-1">
            Press Enter to add a specialization
          </p>
        </label>
      </div>
    </div>
  );
};

export default ProfileDetailsForm;
