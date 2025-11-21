import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import ArtisanSidebar from '../components/ArtisanSidebar';
import { Menu, Camera, X } from 'lucide-react';
import ProfileHeader from './components/ProfileHeader';
import ProfileImageSection from './components/ProfileImageSection';
import ProfileTabs from './components/ProfileTabs';
import ProfileDetailsForm from './components/ProfileDetailsForm';
import PortfolioSection from './components/PortfolioSection';
import VerificationSection from './components/VerificationSection';

const Profile = () => {
  const { user, isArtisan } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    displayName: '',
    location: '',
    publicEmail: '',
    bio: '',
    specializations: [],
    profileImage: '',
    portfolio: [],
    socialLinks: {
      website: '',
      instagram: '',
      facebook: '',
      twitter: ''
    },
    verified: false,
    awards: [],
    certifications: []
  });

  const loadProfileData = async () => {
    try {
      setLoading(true);
      // Initialize with user data
      const initialData = {
        displayName: user?.name || '',
        location: '',
        publicEmail: user?.email || '',
        bio: '',
        specializations: [],
        profileImage: user?.avatar || '',
        portfolio: [],
        socialLinks: {
          website: '',
          instagram: '',
          facebook: '',
          twitter: ''
        },
        verified: false,
        awards: [],
        certifications: []
      };
      setProfileData(initialData);
    } catch (error) {
      console.error('Error loading profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || !isArtisan) {
      navigate('/');
      return;
    }

    // Load artisan profile data
    loadProfileData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isArtisan, navigate]);

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddSpecialization = (specialization) => {
    if (specialization.trim() && !profileData.specializations.includes(specialization.trim())) {
      setProfileData(prev => ({
        ...prev,
        specializations: [...prev.specializations, specialization.trim()]
      }));
    }
  };

  const handleRemoveSpecialization = (index) => {
    setProfileData(prev => ({
      ...prev,
      specializations: prev.specializations.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      // TODO: Implement API call to save profile data
      console.log('Saving profile data:', profileData);
      // Show success message
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    loadProfileData(); // Reset to original data
  };

  if (loading && !profileData.displayName) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#ec6d13]"></div>
          <p className="mt-4 text-stone-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-stone-50">
      {/* Sidebar */}
      <ArtisanSidebar 
        user={user} 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Mobile Header */}
        <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-stone-200 px-4 py-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
          >
            <Menu className="h-6 w-6 text-stone-700" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 md:p-8 lg:p-12">
          <div className="mx-auto max-w-4xl">
            {/* Page Header */}
            <ProfileHeader 
              onSave={handleSave}
              onCancel={handleCancel}
              loading={loading}
            />

            {/* Profile Image Section */}
            <ProfileImageSection 
              profileData={profileData}
              onImageChange={(imageUrl) => handleInputChange('profileImage', imageUrl)}
            />

            {/* Tabs */}
            <ProfileTabs 
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />

            {/* Tab Content */}
            <div className="py-8">
              {activeTab === 'details' && (
                <ProfileDetailsForm 
                  profileData={profileData}
                  onInputChange={handleInputChange}
                  onAddSpecialization={handleAddSpecialization}
                  onRemoveSpecialization={handleRemoveSpecialization}
                />
              )}

              {activeTab === 'portfolio' && (
                <PortfolioSection 
                  profileData={profileData}
                  onInputChange={handleInputChange}
                />
              )}

              {activeTab === 'verification' && (
                <VerificationSection 
                  profileData={profileData}
                  onInputChange={handleInputChange}
                />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
