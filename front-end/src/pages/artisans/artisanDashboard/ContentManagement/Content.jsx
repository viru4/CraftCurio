import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Menu } from 'lucide-react';
import { API_BASE_URL } from '@/utils/api';
import ArtisanSidebar from '../components/ArtisanSidebar';
import ContentHeader from './Component/ContentHeader';
import ContentTabs from './Component/ContentTabs';
import StoryEditor from './Component/StoryEditor';
import MediaGallery from './Component/MediaGallery';
import AdditionalStoryFields from './Component/AdditionalStoryFields';

const Content = () => {
  const { user, isArtisan, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('story');
  const [loading, setLoading] = useState(true);

  // Story content states
  const [storyContent, setStoryContent] = useState('');
  const [photos, setPhotos] = useState([]);
  const [handwrittenNotes, setHandwrittenNotes] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [culturalContext, setCulturalContext] = useState('');
  const [challenges, setChallenges] = useState([]);
  const [triumphs, setTriumphs] = useState([]);
  const [videos, setVideos] = useState([]);

  const [lastSaved, setLastSaved] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch existing artisan data
  useEffect(() => {
    const fetchArtisanData = async () => {
      try {
        const token = localStorage.getItem('token');

        // First, try to find artisan by userId if artisanId is not available
        let artisanId = user?.artisanId;

        if (!artisanId && user?._id) {
          // Fetch all artisans and find the one with matching userId
          const listResponse = await fetch(`${API_BASE_URL}/api/artisans?limit=1000`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (listResponse.ok) {
            const listData = await listResponse.json();
            const artisan = listData.data?.find(a => a.userId === user._id || a.userId?._id === user._id);
            if (artisan) {
              artisanId = artisan._id;
            }
          }
        }

        if (!artisanId) {
          console.error('No artisan profile found for this user');
          setLoading(false);
          return;
        }

        const response = await fetch(`${API_BASE_URL}/api/artisans/${artisanId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          const artisan = data.data;

          // Populate fields with existing data
          if (artisan.fullBio) setStoryContent(artisan.fullBio);
          if (artisan.story) {
            if (artisan.story.photos) setPhotos(artisan.story.photos.map(url => ({ url, type: 'image' })));
            if (artisan.story.handwrittenNotes) setHandwrittenNotes(artisan.story.handwrittenNotes.map(url => ({ url, type: 'image' })));
            if (artisan.story.quotes) setQuotes(artisan.story.quotes);
            if (artisan.story.culturalContext) setCulturalContext(artisan.story.culturalContext);
            if (artisan.story.challenges) setChallenges(artisan.story.challenges);
            if (artisan.story.triumphs) setTriumphs(artisan.story.triumphs);
            if (artisan.story.videos) setVideos(artisan.story.videos);
          }
        }
      } catch (error) {
        console.error('Failed to fetch artisan data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user && isArtisan) {
      fetchArtisanData();
    }
  }, [user, isArtisan]);

  // Auth check
  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user || !isArtisan) {
      navigate('/');
      return;
    }
  }, [user, isArtisan, navigate, authLoading]);

  const handleAutoSave = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');

      // Get artisan ID
      let artisanId = user?.artisanId;

      if (!artisanId && user?._id) {
        // Fetch all artisans and find the one with matching userId
        const listResponse = await fetch(`${API_BASE_URL}/api/artisans?limit=1000`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (listResponse.ok) {
          const listData = await listResponse.json();
          const artisan = listData.data?.find(a => a.userId === user._id || a.userId?._id === user._id);
          if (artisan) {
            artisanId = artisan._id;
          }
        }
      }

      if (!artisanId) {
        console.error('Cannot save: No artisan profile found');
        return;
      }

      setIsSaving(true);

      // Prepare story data
      const storyData = {
        fullBio: storyContent,
        story: {
          photos: photos.filter(p => p.url && !p.url.startsWith('blob:')).map(p => p.url),
          handwrittenNotes: handwrittenNotes.filter(n => n.url && !n.url.startsWith('blob:')).map(n => n.url),
          quotes: quotes.filter(q => q.trim() !== ''),
          culturalContext,
          challenges: challenges.filter(c => c.trim() !== ''),
          triumphs: triumphs.filter(t => t.trim() !== ''),
          videos: videos.filter(v => v.url && v.title)
        }
      };

      const response = await fetch(`${API_BASE_URL}/api/artisans/${artisanId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(storyData)
      });

      if (response.ok) {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
        setLastSaved(timeString);
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      console.error('Failed to auto-save:', error);
    } finally {
      setIsSaving(false);
    }
  }, [user, storyContent, photos, handwrittenNotes, quotes, culturalContext, challenges, triumphs, videos]);

  // Auto-save functionality
  useEffect(() => {
    const hasContent = storyContent || photos.length > 0 || handwrittenNotes.length > 0 ||
      quotes.length > 0 || culturalContext || challenges.length > 0 ||
      triumphs.length > 0 || videos.length > 0;

    if (hasContent && !loading) {
      const timer = setTimeout(() => {
        handleAutoSave();
      }, 3000); // Auto-save after 3 seconds of inactivity

      return () => clearTimeout(timer);
    }
  }, [storyContent, photos, handwrittenNotes, quotes, culturalContext, challenges, triumphs, videos, loading, handleAutoSave]);

  const handlePreview = async () => {
    try {
      const token = localStorage.getItem('token');

      // Get artisan profile ID (custom ID like "artisan1")
      let artisanProfileId = user?.artisanProfileId;

      if (!artisanProfileId && user?._id) {
        // Fetch all artisans and find the one with matching userId
        const listResponse = await fetch(`${API_BASE_URL}/api/artisans?limit=1000`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (listResponse.ok) {
          const listData = await listResponse.json();
          const artisan = listData.data?.find(a => a.userId === user._id || a.userId?._id === user._id);
          if (artisan) {
            artisanProfileId = artisan.id; // Custom ID like "artisan1"
          }
        }
      }

      // Navigate to artisan story page
      if (artisanProfileId) {
        window.open(`/artisan-stories/${artisanProfileId}`, '_blank');
      } else {
        alert('Could not find artisan profile. Please try again.');
      }
    } catch (error) {
      console.error('Failed to preview:', error);
      alert('Failed to open preview. Please try again.');
    }
  };

  const handlePublish = async () => {
    try {
      // Save before publishing
      await handleAutoSave();

      alert('Story published successfully! Your story is now live on the Artisan Stories page.');
    } catch (error) {
      console.error('Failed to publish:', error);
      alert('Failed to publish story. Please try again.');
    }
  };

  const handleContentChange = (newContent) => {
    setStoryContent(newContent);
  };

  const handleMediaUpload = async (files, type = 'photos') => {
    try {
      // Upload files to Cloudinary
      const { uploadMultipleImages } = await import('@/utils/uploadApi.js');
      const folder = type === 'photos' ? 'content/photos' : 'content/notes';

      const uploadedUrls = await uploadMultipleImages(files, folder);

      const newMediaFiles = uploadedUrls.map((url, index) => ({
        url,
        type: files[index].type,
        name: files[index].name
      }));

      if (type === 'photos') {
        setPhotos(prev => [...prev, ...newMediaFiles]);
      } else {
        setHandwrittenNotes(prev => [...prev, ...newMediaFiles]);
      }
    } catch (error) {
      console.error('Error uploading media:', error);
      alert('Failed to upload files. Please try again.');
    }
  };

  const handleMediaDelete = (index, type = 'photos') => {
    if (type === 'photos') {
      setPhotos(prev => {
        const newFiles = [...prev];
        newFiles.splice(index, 1);
        return newFiles;
      });
    } else {
      setHandwrittenNotes(prev => {
        const newFiles = [...prev];
        newFiles.splice(index, 1);
        return newFiles;
      });
    }
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen bg-stone-50 items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-stone-600 text-lg">Loading your content...</p>
        </div>
      </div>
    );
  }

  if (!user || !isArtisan) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-stone-50">
      {/* Sidebar */}
      <ArtisanSidebar user={user} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-between p-4 border-b border-stone-200 bg-white sticky top-0 z-30">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
            >
              <Menu className="h-6 w-6 text-stone-600" />
            </button>
            <h1 className="text-lg font-bold text-stone-900">Story & Content</h1>
            <div className="w-10" /> {/* Spacer for centering */}
          </div>

          {/* Content Area */}
          <div className="p-4 sm:p-6 lg:p-8">
            {/* Header */}
            <ContentHeader
              onPreview={handlePreview}
              onPublish={handlePublish}
              lastSaved={lastSaved}
            />

            {/* Tabs */}
            <ContentTabs
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />

            {/* Content Area */}
            <div className="mt-6 space-y-6 sm:space-y-8">
              {activeTab === 'story' && (
                <>
                  <StoryEditor
                    content={storyContent}
                    onChange={handleContentChange}
                    lastSaved={lastSaved}
                  />

                  <MediaGallery
                    title="Gallery Photos"
                    description="Upload images that showcase your workspace, process, and artistry"
                    images={photos}
                    onUpload={(files) => handleMediaUpload(files, 'photos')}
                    onDelete={(index) => handleMediaDelete(index, 'photos')}
                  />

                  <MediaGallery
                    title="Design Sketches & Handwritten Notes"
                    description="Share your design process, sketches, and personal notes"
                    images={handwrittenNotes}
                    onUpload={(files) => handleMediaUpload(files, 'notes')}
                    onDelete={(index) => handleMediaDelete(index, 'notes')}
                  />

                  <AdditionalStoryFields
                    quotes={quotes}
                    onQuotesChange={setQuotes}
                    culturalContext={culturalContext}
                    onCulturalContextChange={setCulturalContext}
                    challenges={challenges}
                    onChallengesChange={setChallenges}
                    triumphs={triumphs}
                    onTriumphsChange={setTriumphs}
                    videos={videos}
                    onVideosChange={setVideos}
                  />
                </>
              )}

              {activeTab === 'products' && (
                <div className="rounded-lg sm:rounded-xl border border-[#e7d9cf] dark:border-[#4a392b] bg-white dark:bg-[#221810]/50 p-6 sm:p-8">
                  <div className="text-center py-12">
                    <h3 className="text-lg font-bold text-[#1b130d] dark:text-[#f3ece7] mb-2">
                      Product Stories
                    </h3>
                    <p className="text-sm text-[#9a6c4c] dark:text-[#9a6c4c]">
                      Link individual stories to your products. Coming soon!
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Saving Indicator */}
            {isSaving && (
              <div className="fixed bottom-4 right-4 bg-white dark:bg-[#3a3028] shadow-lg rounded-lg px-4 py-2 border border-[#e7d9cf] dark:border-[#4a392b]">
                <p className="text-sm text-[#9a6c4c] dark:text-[#9a6c4c]">
                  Saving...
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Content;
