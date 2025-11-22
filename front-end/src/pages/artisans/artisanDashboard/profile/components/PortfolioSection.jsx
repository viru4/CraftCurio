import React from 'react';
import { Link as LinkIcon } from 'lucide-react';

const PortfolioSection = ({ profileData, onInputChange }) => {
  // Handle Social Links
  const handleSocialLinkChange = (platform, value) => {
    onInputChange('socialLinks', {
      ...profileData.socialLinks,
      [platform]: value
    });
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Social Links Section */}
      <div className="bg-white rounded-lg p-4 sm:p-6 border border-stone-200">
        <div className="flex items-center gap-2 mb-4 sm:mb-6">
          <LinkIcon className="w-5 h-5 text-[#ec6d13]" />
          <h3 className="text-lg sm:text-xl font-bold text-stone-900">Social Links</h3>
        </div>

        <p className="text-sm text-stone-600 mb-6">
          Add your social media profiles and website to connect with customers and showcase your online presence.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-stone-700 mb-2">
              Website
            </label>
            <input
              type="url"
              value={profileData.socialLinks?.website || ''}
              onChange={(e) => handleSocialLinkChange('website', e.target.value)}
              placeholder="https://yourwebsite.com"
              className="w-full px-3 sm:px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#ec6d13] focus:border-transparent text-sm sm:text-base"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-stone-700 mb-2">
              Instagram
            </label>
            <input
              type="text"
              value={profileData.socialLinks?.instagram || ''}
              onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
              placeholder="@username"
              className="w-full px-3 sm:px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#ec6d13] focus:border-transparent text-sm sm:text-base"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-stone-700 mb-2">
              Facebook
            </label>
            <input
              type="text"
              value={profileData.socialLinks?.facebook || ''}
              onChange={(e) => handleSocialLinkChange('facebook', e.target.value)}
              placeholder="facebook.com/yourpage"
              className="w-full px-3 sm:px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#ec6d13] focus:border-transparent text-sm sm:text-base"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-stone-700 mb-2">
              Twitter
            </label>
            <input
              type="text"
              value={profileData.socialLinks?.twitter || ''}
              onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
              placeholder="@username"
              className="w-full px-3 sm:px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#ec6d13] focus:border-transparent text-sm sm:text-base"
            />
          </div>
        </div>
      </div>

      {/* Info Card - Portfolio Content Moved */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-6 border border-amber-200">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <h4 className="text-base font-bold text-amber-900 mb-2">
              Portfolio Content Moved
            </h4>
            <p className="text-sm text-amber-800 mb-3">
              Photos, videos, quotes, and handwritten notes are now managed in the <strong>Content Management</strong> section under "Story & Content" in the dashboard menu.
            </p>
            <p className="text-xs text-amber-700">
              This section is now dedicated to your social media links and online presence.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioSection;
