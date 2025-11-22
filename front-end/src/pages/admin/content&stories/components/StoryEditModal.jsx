import { useState, useCallback, useEffect } from 'react';
import { X, Save, Image, Plus, Trash2 } from 'lucide-react';
import API_BASE_URL from '@/config/api';

const StoryEditModal = ({ artisan, onClose, onSave }) => {
  const [saving, setSaving] = useState(false);
  const [storyContent, setStoryContent] = useState('');
  const [quotes, setQuotes] = useState([]);
  const [culturalContext, setCulturalContext] = useState('');
  const [challenges, setChallenges] = useState([]);
  const [triumphs, setTriumphs] = useState([]);
  const [videos, setVideos] = useState([]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Initialize form with existing data
  useEffect(() => {
    if (artisan) {
      setStoryContent(artisan.fullBio || '');
      if (artisan.story) {
        setQuotes(artisan.story.quotes || []);
        setCulturalContext(artisan.story.culturalContext || '');
        setChallenges(artisan.story.challenges || []);
        setTriumphs(artisan.story.triumphs || []);
        setVideos(artisan.story.videos || []);
      }
    }
  }, [artisan]);

  const handleSave = useCallback(async () => {
    setSaving(true);
    
    try {
      const token = localStorage.getItem('token');
      
      const storyData = {
        fullBio: storyContent,
        story: {
          quotes: quotes.filter(q => q.trim() !== ''),
          culturalContext,
          challenges: challenges.filter(c => c.trim() !== ''),
          triumphs: triumphs.filter(t => t.trim() !== ''),
          videos: videos.filter(v => v.url && v.title)
        }
      };

      const response = await fetch(`${API_BASE_URL}/api/artisans/${artisan.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(storyData)
      });

      if (response.ok) {
        const result = await response.json();
        alert('Story updated successfully!');
        onSave(result.data);
        onClose();
      } else {
        throw new Error('Failed to update story');
      }
    } catch (error) {
      console.error('Failed to save story:', error);
      alert('Failed to save story. Please try again.');
    } finally {
      setSaving(false);
    }
  }, [artisan, storyContent, quotes, culturalContext, challenges, triumphs, videos, onClose, onSave]);

  // Quote handlers
  const addQuote = () => setQuotes([...quotes, '']);
  const updateQuote = (index, value) => {
    const updated = [...quotes];
    updated[index] = value;
    setQuotes(updated);
  };
  const removeQuote = (index) => setQuotes(quotes.filter((_, i) => i !== index));

  // Challenge handlers
  const addChallenge = () => setChallenges([...challenges, '']);
  const updateChallenge = (index, value) => {
    const updated = [...challenges];
    updated[index] = value;
    setChallenges(updated);
  };
  const removeChallenge = (index) => setChallenges(challenges.filter((_, i) => i !== index));

  // Triumph handlers
  const addTriumph = () => setTriumphs([...triumphs, '']);
  const updateTriumph = (index, value) => {
    const updated = [...triumphs];
    updated[index] = value;
    setTriumphs(updated);
  };
  const removeTriumph = (index) => setTriumphs(triumphs.filter((_, i) => i !== index));

  // Video handlers
  const addVideo = () => setVideos([...videos, { url: '', title: '' }]);
  const updateVideo = (index, field, value) => {
    const updated = [...videos];
    updated[index][field] = value;
    setVideos(updated);
  };
  const removeVideo = (index) => setVideos(videos.filter((_, i) => i !== index));

  if (!artisan) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="flex min-h-full items-center justify-center p-2 sm:p-4">
          <div className="relative bg-white dark:bg-[#2a1e14] rounded-xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden">
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-[#e7d9cf] dark:border-[#3f2e1e] bg-white dark:bg-[#2a1e14]">
              <div className="flex-1 min-w-0 mr-4">
                <h2 className="text-lg sm:text-xl font-bold text-[#1b130d] dark:text-[#fcfaf8] truncate">
                  Edit Story - {artisan.name}
                </h2>
                <p className="text-xs sm:text-sm text-[#9a6c4c] dark:text-[#a88e79] truncate">
                  {artisan.craftSpecialization}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-[#f3ece7] dark:hover:bg-[#3a2a1d] rounded-lg transition-colors flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(95vh-140px)] px-4 sm:px-6 py-4 sm:py-6">
              <div className="space-y-6">
                {/* Story Content */}
                <div>
                  <label className="block text-sm font-bold text-[#1b130d] dark:text-[#fcfaf8] mb-2">
                    Full Story
                  </label>
                  <textarea
                    value={storyContent}
                    onChange={(e) => setStoryContent(e.target.value)}
                    rows={8}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-[#e7d9cf] dark:border-[#3f2e1e] bg-white dark:bg-[#3a2a1d] text-[#1b130d] dark:text-[#fcfaf8] focus:ring-2 focus:ring-[#ec6d13] focus:border-transparent resize-none text-sm sm:text-base"
                    placeholder="Write the artisan's full story..."
                  />
                </div>

                {/* Quotes */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-bold text-[#1b130d] dark:text-[#fcfaf8]">
                      Inspiring Quotes
                    </label>
                    <button
                      onClick={addQuote}
                      className="flex items-center gap-1 px-2 sm:px-3 py-1 text-xs sm:text-sm bg-[#ec6d13] text-white rounded-lg hover:bg-[#ec6d13]/90 transition-colors"
                    >
                      <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                      Add
                    </button>
                  </div>
                  <div className="space-y-2">
                    {quotes.map((quote, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={quote}
                          onChange={(e) => updateQuote(index, e.target.value)}
                          className="flex-1 px-3 py-2 rounded-lg border border-[#e7d9cf] dark:border-[#3f2e1e] bg-white dark:bg-[#3a2a1d] text-[#1b130d] dark:text-[#fcfaf8] focus:ring-2 focus:ring-[#ec6d13] focus:border-transparent text-sm"
                          placeholder="Enter a quote..."
                        />
                        <button
                          onClick={() => removeQuote(index)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cultural Context */}
                <div>
                  <label className="block text-sm font-bold text-[#1b130d] dark:text-[#fcfaf8] mb-2">
                    Cultural Context
                  </label>
                  <textarea
                    value={culturalContext}
                    onChange={(e) => setCulturalContext(e.target.value)}
                    rows={4}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-[#e7d9cf] dark:border-[#3f2e1e] bg-white dark:bg-[#3a2a1d] text-[#1b130d] dark:text-[#fcfaf8] focus:ring-2 focus:ring-[#ec6d13] focus:border-transparent resize-none text-sm sm:text-base"
                    placeholder="Describe the cultural heritage and traditions..."
                  />
                </div>

                {/* Challenges */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-bold text-[#1b130d] dark:text-[#fcfaf8]">
                      Challenges Overcome
                    </label>
                    <button
                      onClick={addChallenge}
                      className="flex items-center gap-1 px-2 sm:px-3 py-1 text-xs sm:text-sm bg-[#ec6d13] text-white rounded-lg hover:bg-[#ec6d13]/90 transition-colors"
                    >
                      <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                      Add
                    </button>
                  </div>
                  <div className="space-y-2">
                    {challenges.map((challenge, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={challenge}
                          onChange={(e) => updateChallenge(index, e.target.value)}
                          className="flex-1 px-3 py-2 rounded-lg border border-[#e7d9cf] dark:border-[#3f2e1e] bg-white dark:bg-[#3a2a1d] text-[#1b130d] dark:text-[#fcfaf8] focus:ring-2 focus:ring-[#ec6d13] focus:border-transparent text-sm"
                          placeholder="Enter a challenge..."
                        />
                        <button
                          onClick={() => removeChallenge(index)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Triumphs */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-bold text-[#1b130d] dark:text-[#fcfaf8]">
                      Triumphs & Achievements
                    </label>
                    <button
                      onClick={addTriumph}
                      className="flex items-center gap-1 px-2 sm:px-3 py-1 text-xs sm:text-sm bg-[#ec6d13] text-white rounded-lg hover:bg-[#ec6d13]/90 transition-colors"
                    >
                      <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                      Add
                    </button>
                  </div>
                  <div className="space-y-2">
                    {triumphs.map((triumph, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={triumph}
                          onChange={(e) => updateTriumph(index, e.target.value)}
                          className="flex-1 px-3 py-2 rounded-lg border border-[#e7d9cf] dark:border-[#3f2e1e] bg-white dark:bg-[#3a2a1d] text-[#1b130d] dark:text-[#fcfaf8] focus:ring-2 focus:ring-[#ec6d13] focus:border-transparent text-sm"
                          placeholder="Enter a triumph..."
                        />
                        <button
                          onClick={() => removeTriumph(index)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Videos */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-bold text-[#1b130d] dark:text-[#fcfaf8]">
                      Videos
                    </label>
                    <button
                      onClick={addVideo}
                      className="flex items-center gap-1 px-2 sm:px-3 py-1 text-xs sm:text-sm bg-[#ec6d13] text-white rounded-lg hover:bg-[#ec6d13]/90 transition-colors"
                    >
                      <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                      Add
                    </button>
                  </div>
                  <div className="space-y-3">
                    {videos.map((video, index) => (
                      <div key={index} className="p-3 bg-[#f3ece7] dark:bg-[#3a2a1d] rounded-lg">
                        <div className="flex gap-2 mb-2">
                          <input
                            type="text"
                            value={video.title}
                            onChange={(e) => updateVideo(index, 'title', e.target.value)}
                            className="flex-1 px-3 py-2 rounded-lg border border-[#e7d9cf] dark:border-[#3f2e1e] bg-white dark:bg-[#2a1e14] text-[#1b130d] dark:text-[#fcfaf8] focus:ring-2 focus:ring-[#ec6d13] focus:border-transparent text-sm"
                            placeholder="Video title..."
                          />
                          <button
                            onClick={() => removeVideo(index)}
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/50 rounded-lg transition-colors flex-shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <input
                          type="url"
                          value={video.url}
                          onChange={(e) => updateVideo(index, 'url', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-[#e7d9cf] dark:border-[#3f2e1e] bg-white dark:bg-[#2a1e14] text-[#1b130d] dark:text-[#fcfaf8] focus:ring-2 focus:ring-[#ec6d13] focus:border-transparent text-sm"
                          placeholder="Video URL (YouTube, Vimeo, etc.)..."
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Note about images */}
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <div className="flex gap-2">
                    <Image className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-1">
                        Image Management
                      </p>
                      <p className="text-xs text-blue-700 dark:text-blue-400">
                        To manage photos and sketches, artisans should use their own dashboard content management section where they can upload images directly.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 flex items-center justify-end gap-3 px-4 sm:px-6 py-3 sm:py-4 border-t border-[#e7d9cf] dark:border-[#3f2e1e] bg-white dark:bg-[#2a1e14]">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-[#9a6c4c] dark:text-[#a88e79] hover:bg-[#f3ece7] dark:hover:bg-[#3a2a1d] rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#ec6d13] text-white rounded-lg hover:bg-[#ec6d13]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryEditModal;
