import React from 'react';

const ProfileHeader = ({ profileData, onImageUpload }) => {
  return (
    <div className="flex p-6 bg-white rounded-lg border border-gray-200 mb-8">
      <div className="flex w-full flex-col gap-6 sm:flex-row sm:justify-between sm:items-center">
        <div className="flex gap-4 items-center">
          <div 
            className="bg-gray-300 bg-center bg-no-repeat bg-cover rounded-full h-24 w-24 flex items-center justify-center text-3xl font-bold text-white"
            style={profileData.profileImage ? { backgroundImage: `url(${profileData.profileImage})` } : {}}
          >
            {!profileData.profileImage && profileData.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-xl font-bold text-gray-900">{profileData.name}</p>
            <p className="text-gray-500 text-base">{profileData.email}</p>
          </div>
        </div>
        <label className="cursor-pointer">
          <input
            type="file"
            accept="image/*"
            onChange={onImageUpload}
            className="hidden"
          />
          <div className="flex items-center justify-center h-10 px-4 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 text-sm font-bold">
            Upload new picture
          </div>
        </label>
      </div>
    </div>
  );
};

export default ProfileHeader;
