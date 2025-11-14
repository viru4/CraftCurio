import React from 'react';

/**
 * ArtisanProfileCard Component
 * Displays artisan information with profile photo and bio
 * @param {Object} artisanInfo - Artisan information object
 * @param {boolean} isMobile - Whether to show mobile layout
 * @param {boolean} showInSidebar - Whether this is in the desktop sidebar
 */
const ArtisanProfileCard = ({ artisanInfo, isMobile = false, showInSidebar = false }) => {
  if (!artisanInfo) return null;

  if (isMobile) {
    return (
      <div className="artisan-profile flex items-center gap-4 border-t border-stone-200 pt-6 mt-6">
        <div className="h-12 w-12 bg-stone-200 rounded-full border-2 border-orange-500 flex-shrink-0 overflow-hidden">
          <img
            src={artisanInfo.profilePhotoUrl || '/placeholder-avatar.svg'}
            alt={artisanInfo.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = '/placeholder-avatar.svg';
            }}
          />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-stone-800 text-base truncate">
            {artisanInfo.name}
          </h3>
          {artisanInfo.briefBio && (
            <p className="text-sm text-stone-500 line-clamp-2">
              {artisanInfo.briefBio}
            </p>
          )}
          <button className="text-sm font-medium text-orange-500 hover:text-orange-600 transition-colors">
            View Profile & Items
          </button>
        </div>
      </div>
    );
  }

  if (showInSidebar) {
    return (
      <div className="border-t border-stone-200 pt-6">
        <h3 className="text-lg font-bold text-stone-900 mb-4">Artisan</h3>
        <div className="flex items-start gap-3">
          <div className="h-12 w-12 bg-stone-200 rounded-full border-2 border-orange-500 flex-shrink-0 overflow-hidden">
            <img
              src={artisanInfo.profilePhotoUrl || '/placeholder-avatar.svg'}
              alt={artisanInfo.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = '/placeholder-avatar.svg';
              }}
            />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-semibold text-stone-800 text-base">
              {artisanInfo.name}
            </h4>
            {artisanInfo.verified && (
              <div className="flex items-center gap-1 mt-1 text-green-600">
                <span className="material-symbols-outlined text-sm">verified</span>
                <span className="text-xs font-medium">Verified Artisan</span>
              </div>
            )}
            <button className="text-sm font-medium text-orange-500 hover:text-orange-600 transition-colors mt-2">
              View Profile & Items
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default ArtisanProfileCard;
