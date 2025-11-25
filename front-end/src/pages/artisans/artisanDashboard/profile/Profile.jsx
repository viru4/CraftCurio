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
import { API_BASE_URL } from '@/utils/api';

const Profile = () => {
  const { user, isArtisan } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [loading, setLoading] = useState(false);
  const [artisanId, setArtisanId] = useState(null);
  const [profileData, setProfileData] = useState({
    displayName: '',
    location: '',
    publicEmail: '',
    bio: '',
    fullBio: '',
    specializations: [],
    experienceYears: 0,
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
      const token = localStorage.getItem('token');
      
      // Try to fetch existing artisan profile linked to this user
      const response = await fetch(`${API_BASE_URL}/api/artisans`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (data.success && Array.isArray(data.data)) {
        // Find artisan linked to current user
        const userArtisan = data.data.find(artisan => 
          artisan.userId?._id === user?._id || artisan.userId === user?._id
        );
        
        if (userArtisan) {
          setArtisanId(userArtisan.id);
          // Map backend data to frontend state
          setProfileData({
            displayName: userArtisan.name || '',
            location: userArtisan.location || '',
            publicEmail: user?.email || '',
            bio: userArtisan.briefBio || '',
            fullBio: userArtisan.fullBio || '',
            specializations: userArtisan.craftSpecialization ? [userArtisan.craftSpecialization] : [],
            experienceYears: userArtisan.experienceYears || 0,
            profileImage: userArtisan.profilePhotoUrl || '',
            portfolio: [],
            socialLinks: {
              website: userArtisan.socialLinks?.website || '',
              instagram: userArtisan.socialLinks?.instagram || '',
              facebook: userArtisan.socialLinks?.facebook || '',
              twitter: userArtisan.socialLinks?.twitter || ''
            },
            verified: userArtisan.verified || false,
            awards: userArtisan.awards || [],
            certifications: userArtisan.certifications || []
          });
        } else {
          // No artisan profile exists - initialize with user data
          setProfileData({
            displayName: user?.name || '',
            location: '',
            publicEmail: user?.email || '',
            bio: '',
            fullBio: '',
            specializations: [],
            experienceYears: 0,
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
          });
        }
      }
    } catch (error) {
      console.error('Error loading profile data:', error);
      // Initialize with user data on error
      setProfileData({
        displayName: user?.name || '',
        location: '',
        publicEmail: user?.email || '',
        bio: '',
        fullBio: '',
        specializations: [],
        experienceYears: 0,
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
      });
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
      const token = localStorage.getItem('token');
      
      // Map frontend data to backend schema
      const artisanData = {
        name: profileData.displayName,
        briefBio: profileData.bio,
        fullBio: profileData.fullBio,
        craftSpecialization: profileData.specializations[0] || '', // Take first specialization
        experienceYears: profileData.experienceYears,
        location: profileData.location,
        profilePhotoUrl: profileData.profileImage,
        socialLinks: {
          website: profileData.socialLinks.website,
          instagram: profileData.socialLinks.instagram,
          facebook: profileData.socialLinks.facebook,
          twitter: profileData.socialLinks.twitter
        },
        awards: profileData.awards,
        certifications: profileData.certifications,
        userId: user._id
      };

      let response;
      
      if (artisanId) {
        // Update existing artisan profile
        response = await fetch(`${API_BASE_URL}/api/artisans/${artisanId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(artisanData)
        });
      } else {
        // Create new artisan profile - generate ID
        const timestamp = Date.now();
        const randomNum = Math.floor(Math.random() * 1000);
        const newArtisanId = `artisan-${timestamp}-${randomNum}`;
        
        response = await fetch(`${API_BASE_URL}/api/artisans`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            ...artisanData,
            id: newArtisanId
          })
        });
      }

      const result = await response.json();

      if (result.success) {
        if (!artisanId && result.data?.id) {
          setArtisanId(result.data.id);
        }
        alert('Profile updated successfully! Your changes will appear on your artisan story page.');
      } else {
        throw new Error(result.message || 'Failed to save profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert(error.message || 'Failed to save profile. Please try again.');
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
                  onVerificationUpdate={loadProfileData}
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
