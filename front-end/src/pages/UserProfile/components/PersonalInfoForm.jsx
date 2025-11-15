import React from 'react';

const PersonalInfoForm = ({ profileData, onChange, onSubmit, saving }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 mb-8">
      <h2 className="text-xl font-bold px-6 py-4 border-b border-gray-200">Personal Information</h2>
      <form onSubmit={onSubmit} className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row gap-6">
          <label className="flex flex-col flex-1">
            <p className="text-sm font-medium text-gray-900 pb-2">Full Name</p>
            <input
              type="text"
              name="name"
              value={profileData.name}
              onChange={onChange}
              className="flex w-full rounded-lg border border-gray-300 bg-white h-12 p-3 text-base focus:outline-none focus:ring-2 focus:ring-primary/50"
              required
            />
          </label>
          <label className="flex flex-col flex-1">
            <p className="text-sm font-medium text-gray-900 pb-2">Phone Number</p>
            <input
              type="tel"
              name="phone"
              value={profileData.phone || ''}
              onChange={onChange}
              className="flex w-full rounded-lg border border-gray-300 bg-white h-12 p-3 text-base focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="+1 234 567 8900"
            />
          </label>
        </div>

        <div>
          <label className="flex flex-col">
            <p className="text-sm font-medium text-gray-900 pb-2">Email Address</p>
            <input
              type="email"
              value={profileData.email}
              className="flex w-full rounded-lg border border-gray-300 bg-gray-100 h-12 p-3 text-base text-gray-500 cursor-not-allowed"
              disabled
            />
          </label>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center h-10 px-5 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:bg-gray-300 text-sm font-bold ml-auto"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PersonalInfoForm;
