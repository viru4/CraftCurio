import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ProfileSidebar,
  ProfileHeader,
  PersonalInfoForm,
  SecuritySettings,
  AccountSettings,
  PaymentBilling,
  UserMessages
} from './components';
import SavedAddresses from '../../components/SavedAddresses';

// Helper to refresh auth context
const refreshAuthContext = async () => {
  const token = localStorage.getItem('token');
  if (!token) return;

  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('user', JSON.stringify(data.user));
      // Dispatch storage event to notify AuthContext
      window.dispatchEvent(new Event('storage'));
    }
  } catch (error) {
    console.error('Error refreshing auth context:', error);
  }
};

const Profile = () => {
  const { user, loading: authLoading, updateUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const location = useLocation();
  
  // Get tab from URL search params
  const searchParams = new URLSearchParams(location.search);
  const tabFromUrl = searchParams.get('tab');
  const initialTab = tabFromUrl || 'profile';
  
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Profile data state
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    profileImage: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    }
  });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [passwordError, setPasswordError] = useState('');

  // Update URL when activeTab changes (without causing re-render loops)
  useEffect(() => {
    const currentParams = new URLSearchParams(location.search);
    const currentTab = currentParams.get('tab');
    
    // Only update URL if the tab actually changed
    if (currentTab !== activeTab) {
      const newParams = new URLSearchParams(location.search);
      newParams.set('tab', activeTab);
      navigate(`/profile?${newParams.toString()}`, { replace: true });
    }
  }, [activeTab, navigate, location.search]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/sign-in');
      return;
    }
    if (user) {
      fetchProfile();
    }
  }, [user, authLoading, navigate]);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setProfileData(data.user);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setProfileData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    setPasswordError('');
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });

      const data = await response.json();

      if (response.ok) {
        alert('Profile updated successfully!');
        // Refresh user data in auth context
        await refreshAuthContext();
        // Also update auth context directly
        if (data.user) {
          updateUser(data.user);
        }
        // Fetch fresh profile data
        fetchProfile();
      } else {
        alert(data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    setSaving(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert('Password updated successfully!');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setPasswordError(data.message || 'Failed to update password');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      setPasswordError('Failed to update password');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setSaving(true);
      // Upload to Cloudinary
      const { uploadSingleImage } = await import('../../utils/uploadApi.js');
      const result = await uploadSingleImage(file, 'profiles');

      // Update profile with uploaded URL
      setProfileData(prev => ({
        ...prev,
        profileImage: result.url
      }));

      // Save immediately to backend to sync with Artisan/Collector
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ profileImage: result.url })
      });

      if (response.ok) {
        const data = await response.json();
        // Refresh auth context
        await refreshAuthContext();
        if (data.user) {
          updateUser(data.user);
        }
        alert('Profile image updated successfully!');
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to save profile image');
      }
    } catch (error) {
      console.error('Error uploading profile image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col md:flex-row h-full">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg hover:bg-gray-50"
          aria-label="Toggle menu"
        >
          <svg className="h-6 w-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>

        {/* Overlay */}
        {isSidebarOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <ProfileSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-10 md:ml-0">
          <div className="max-w-4xl mx-auto">
            {/* Page Heading */}
            <div className="flex flex-wrap justify-between gap-3 pb-6">
              <h1 className="text-3xl font-black text-gray-900">Profile &amp; Settings</h1>
            </div>

            {activeTab === 'profile' && (
              <>
                <ProfileHeader
                  profileData={profileData}
                  onImageUpload={handleImageUpload}
                />
                <PersonalInfoForm
                  profileData={profileData}
                  onChange={handleProfileChange}
                  onSubmit={handleProfileSubmit}
                  saving={saving}
                />
              </>
            )}

            {activeTab === 'account' && (
              <AccountSettings />
            )}

            {activeTab === 'addresses' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Saved Addresses</h2>
                <SavedAddresses 
                  showAddForm={true}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                />
              </div>
            )}

            {activeTab === 'security' && (
              <SecuritySettings
                passwordData={passwordData}
                onChange={handlePasswordChange}
                onSubmit={handlePasswordSubmit}
                saving={saving}
                error={passwordError}
              />
            )}

            {activeTab === 'payment' && (
              <PaymentBilling profileData={profileData} />
            )}

            {activeTab === 'messages' && (
              <UserMessages key={new URLSearchParams(location.search).get('recipientId') || 'messages'} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;
