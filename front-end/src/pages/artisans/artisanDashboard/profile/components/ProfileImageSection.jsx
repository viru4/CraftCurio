import React, { useState, useRef } from 'react';
import { Camera, CheckCircle } from 'lucide-react';

const ProfileImageSection = ({ profileData, onImageChange }) => {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    try {
      setUploading(true);
      // TODO: Implement actual image upload to server
      // For now, create a local preview URL
      const imageUrl = URL.createObjectURL(file);
      onImageChange(imageUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="mb-8 rounded-2xl border border-stone-200 bg-white p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6">
        {/* Profile Image and Info */}
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="relative flex-shrink-0">
            <div 
              className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-[#ec6d13] to-[#d87a5b] bg-cover bg-center"
              style={{
                backgroundImage: profileData.profileImage 
                  ? `url(${profileData.profileImage})` 
                  : undefined
              }}
            >
              {!profileData.profileImage && (
                <div className="w-full h-full flex items-center justify-center text-white text-3xl font-bold">
                  {profileData.displayName?.charAt(0).toUpperCase() || 'A'}
                </div>
              )}
            </div>
            <button 
              onClick={handleButtonClick}
              disabled={uploading}
              className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-stone-200 text-stone-700 hover:bg-stone-300 transition-colors disabled:opacity-50"
            >
              {uploading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-stone-700"></div>
              ) : (
                <Camera className="h-4 w-4" />
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* Name and Status */}
          <div className="flex flex-col justify-center gap-1 min-w-0">
            <h2 className="text-stone-900 text-xl sm:text-2xl font-bold leading-tight tracking-tight truncate">
              {profileData.displayName || 'Artisan Name'}
            </h2>
            <p className="text-stone-500 text-sm sm:text-base">
              {profileData.specializations[0] || 'Craft Specialization'}
            </p>
            <div className={`mt-1 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs sm:text-sm font-medium w-fit ${
              profileData.verified 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>{profileData.verified ? 'Verified Artisan' : 'Pending Verification'}</span>
            </div>
          </div>
        </div>

        {/* Upload Button */}
        <button 
          onClick={handleButtonClick}
          disabled={uploading}
          className="w-full sm:w-auto px-4 sm:px-6 py-2.5 rounded-xl bg-stone-100 text-stone-800 text-sm font-bold hover:bg-stone-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? 'Uploading...' : 'Upload New Photo'}
        </button>
      </div>
    </div>
  );
};

export default ProfileImageSection;
