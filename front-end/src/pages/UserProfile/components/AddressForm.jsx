import React from 'react';

const AddressForm = ({ profileData, onChange, onSubmit, saving }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <h2 className="text-xl font-bold px-6 py-4 border-b border-gray-200">Address Information</h2>
      <form onSubmit={onSubmit} className="p-6 space-y-6">
        <div>
          <label className="flex flex-col">
            <p className="text-sm font-medium text-gray-900 pb-2">Street Address</p>
            <input
              type="text"
              name="address.street"
              value={profileData.address?.street || ''}
              onChange={onChange}
              className="flex w-full rounded-lg border border-gray-300 bg-white h-12 p-3 text-base focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="123 Artisan Lane"
            />
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <label className="flex flex-col">
            <p className="text-sm font-medium text-gray-900 pb-2">City</p>
            <input
              type="text"
              name="address.city"
              value={profileData.address?.city || ''}
              onChange={onChange}
              className="flex w-full rounded-lg border border-gray-300 bg-white h-12 p-3 text-base focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="City"
            />
          </label>
          <label className="flex flex-col">
            <p className="text-sm font-medium text-gray-900 pb-2">State</p>
            <input
              type="text"
              name="address.state"
              value={profileData.address?.state || ''}
              onChange={onChange}
              className="flex w-full rounded-lg border border-gray-300 bg-white h-12 p-3 text-base focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="State"
            />
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <label className="flex flex-col">
            <p className="text-sm font-medium text-gray-900 pb-2">ZIP Code</p>
            <input
              type="text"
              name="address.zipCode"
              value={profileData.address?.zipCode || ''}
              onChange={onChange}
              className="flex w-full rounded-lg border border-gray-300 bg-white h-12 p-3 text-base focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="12345"
            />
          </label>
          <label className="flex flex-col">
            <p className="text-sm font-medium text-gray-900 pb-2">Country</p>
            <input
              type="text"
              name="address.country"
              value={profileData.address?.country || ''}
              onChange={onChange}
              className="flex w-full rounded-lg border border-gray-300 bg-white h-12 p-3 text-base focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Country"
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

export default AddressForm;
