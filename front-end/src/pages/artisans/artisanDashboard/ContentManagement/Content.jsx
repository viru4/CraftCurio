import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Menu } from 'lucide-react';
import ArtisanSidebar from '../components/ArtisanSidebar';
import ContentHeader from './Component/ContentHeader';
import ContentTabs from './Component/ContentTabs';
import StoryEditor from './Component/StoryEditor';
import MediaGallery from './Component/MediaGallery';

const Content = () => {
  const { user, isArtisan, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('story');
  const [storyContent, setStoryContent] = useState('');
  const [mediaFiles, setMediaFiles] = useState([]);
  const [lastSaved, setLastSaved] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

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

  const handleAutoSave = async () => {
    setIsSaving(true);
    
    try {
      // TODO: Replace with actual API call
      // await fetch('/api/artisan/story', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ content: storyContent, media: mediaFiles })
      // });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
      setLastSaved(timeString);
    } catch (error) {
      console.error('Failed to auto-save:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Auto-save functionality
  useEffect(() => {
    if (storyContent || mediaFiles.length > 0) {
      const timer = setTimeout(() => {
        handleAutoSave();
      }, 2000); // Auto-save after 2 seconds of inactivity

      return () => clearTimeout(timer);
    }
  }, [storyContent, mediaFiles]);

  const handlePreview = () => {
    // TODO: Implement preview modal
    console.log('Preview clicked', { storyContent, mediaFiles });
  };

  const handlePublish = async () => {
    try {
      // TODO: Replace with actual API call
      // await fetch('/api/artisan/story/publish', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ content: storyContent, media: mediaFiles })
      // });
      
      alert('Story published successfully!');
    } catch (error) {
      console.error('Failed to publish:', error);
      alert('Failed to publish story. Please try again.');
    }
  };

  const handleContentChange = (newContent) => {
    setStoryContent(newContent);
  };

  const handleMediaUpload = (files) => {
    // Convert File objects to URLs for display
    const newMediaFiles = files.map(file => ({
      url: URL.createObjectURL(file),
      type: file.type,
      name: file.name,
      file: file
    }));
    
    setMediaFiles(prev => [...prev, ...newMediaFiles]);
  };

  const handleMediaDelete = (index) => {
    setMediaFiles(prev => {
      const newFiles = [...prev];
      // Revoke object URL to free memory
      URL.revokeObjectURL(newFiles[index].url);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

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
                    images={mediaFiles}
                    onUpload={handleMediaUpload}
                    onDelete={handleMediaDelete}
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
