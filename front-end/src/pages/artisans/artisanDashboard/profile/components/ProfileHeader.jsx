import React from 'react';

const ProfileHeader = ({ onSave, onCancel, loading }) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
      <h1 className="text-stone-900 text-3xl sm:text-4xl font-black leading-tight tracking-tight">
        Manage Your Artisan Profile
      </h1>
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={onCancel}
          disabled={loading}
          className="px-4 sm:px-6 py-2.5 rounded-xl bg-stone-100 text-stone-800 text-sm font-bold hover:bg-stone-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          disabled={loading}
          className="px-4 sm:px-6 py-2.5 rounded-xl bg-[#ec6d13] text-white text-sm font-bold hover:bg-[#ec6d13]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Saving...</span>
            </>
          ) : (
            <span>Save Changes</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProfileHeader;
