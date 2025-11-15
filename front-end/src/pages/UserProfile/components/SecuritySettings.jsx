import React from 'react';

const SecuritySettings = ({ passwordData, onChange, onSubmit, saving, error }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <h2 className="text-xl font-bold px-6 py-4 border-b border-gray-200">Security</h2>
      <div className="p-6">
        <h3 className="font-bold text-gray-900 mb-4">Change Password</h3>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="flex flex-col">
              <p className="text-sm font-medium text-gray-900 pb-2">Current Password</p>
              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={onChange}
                className="flex w-full max-w-sm rounded-lg border border-gray-300 bg-white h-12 p-3 text-base focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="••••••••"
                required
              />
            </label>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <label className="flex flex-col flex-1">
              <p className="text-sm font-medium text-gray-900 pb-2">New Password</p>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={onChange}
                className="flex w-full rounded-lg border border-gray-300 bg-white h-12 p-3 text-base focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="New password"
                required
              />
            </label>
            <label className="flex flex-col flex-1">
              <p className="text-sm font-medium text-gray-900 pb-2">Confirm New Password</p>
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={onChange}
                className="flex w-full rounded-lg border border-gray-300 bg-white h-12 p-3 text-base focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Confirm password"
                required
              />
            </label>
          </div>

          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center h-10 px-5 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:bg-gray-300 text-sm font-bold ml-auto"
            >
              {saving ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SecuritySettings;
