import React, { useState } from 'react';
import { Plus, X, Image as ImageIcon, Video, FileText, Quote, Trash2, Link as LinkIcon } from 'lucide-react';

const PortfolioSection = ({ profileData, onInputChange }) => {
  const [newPhoto, setNewPhoto] = useState('');
  const [newVideo, setNewVideo] = useState({ url: '', title: '', thumbnail: '' });
  const [newNote, setNewNote] = useState('');
  const [newQuote, setNewQuote] = useState('');
  const [activeSection, setActiveSection] = useState('photos');

  // Handle Social Links
  const handleSocialLinkChange = (platform, value) => {
    onInputChange('socialLinks', {
      ...profileData.socialLinks,
      [platform]: value
    });
  };

  // Handle Photos
  const handleAddPhoto = () => {
    if (newPhoto.trim()) {
      const currentPhotos = profileData.portfolio || [];
      onInputChange('portfolio', [...currentPhotos, { type: 'photo', url: newPhoto.trim() }]);
      setNewPhoto('');
    }
  };

  const handleRemovePhoto = (index) => {
    const currentPhotos = profileData.portfolio || [];
    onInputChange('portfolio', currentPhotos.filter((_, i) => i !== index));
  };

  // Handle Videos
  const handleAddVideo = () => {
    if (newVideo.url.trim() && newVideo.title.trim()) {
      const currentPortfolio = profileData.portfolio || [];
      onInputChange('portfolio', [...currentPortfolio, { type: 'video', ...newVideo }]);
      setNewVideo({ url: '', title: '', thumbnail: '' });
    }
  };

  const handleRemoveVideo = (index) => {
    const currentPortfolio = profileData.portfolio || [];
    onInputChange('portfolio', currentPortfolio.filter((_, i) => i !== index));
  };

  // Handle Notes
  const handleAddNote = () => {
    if (newNote.trim()) {
      const currentPortfolio = profileData.portfolio || [];
      onInputChange('portfolio', [...currentPortfolio, { type: 'note', content: newNote.trim() }]);
      setNewNote('');
    }
  };

  const handleRemoveNote = (index) => {
    const currentPortfolio = profileData.portfolio || [];
    onInputChange('portfolio', currentPortfolio.filter((_, i) => i !== index));
  };

  // Handle Quotes
  const handleAddQuote = () => {
    if (newQuote.trim()) {
      const currentPortfolio = profileData.portfolio || [];
      onInputChange('portfolio', [...currentPortfolio, { type: 'quote', content: newQuote.trim() }]);
      setNewQuote('');
    }
  };

  const handleRemoveQuote = (index) => {
    const currentPortfolio = profileData.portfolio || [];
    onInputChange('portfolio', currentPortfolio.filter((_, i) => i !== index));
  };

  const photos = (profileData.portfolio || []).filter(item => item.type === 'photo');
  const videos = (profileData.portfolio || []).filter(item => item.type === 'video');
  const notes = (profileData.portfolio || []).filter(item => item.type === 'note');
  const quotes = (profileData.portfolio || []).filter(item => item.type === 'quote');

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Social Links Section */}
      <div className="bg-white rounded-lg p-4 sm:p-6 border border-stone-200">
        <div className="flex items-center gap-2 mb-4 sm:mb-6">
          <LinkIcon className="w-5 h-5 text-[#ec6d13]" />
          <h3 className="text-lg sm:text-xl font-bold text-stone-900">Social Links</h3>
        </div>

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

      {/* Portfolio Content Section */}
      <div className="bg-white rounded-lg p-4 sm:p-6 border border-stone-200">
        <h3 className="text-lg sm:text-xl font-bold text-stone-900 mb-4 sm:mb-6">Portfolio Content</h3>

        {/* Section Tabs */}
        <div className="flex flex-wrap gap-2 mb-4 sm:mb-6 border-b border-stone-200 pb-2">
          <button
            onClick={() => setActiveSection('photos')}
            className={`px-3 sm:px-4 py-2 rounded-t-lg transition-colors text-xs sm:text-sm font-medium ${
              activeSection === 'photos'
                ? 'bg-[#ec6d13] text-white'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <ImageIcon className="w-4 h-4 inline mr-1 sm:mr-2" />
            Photos ({photos.length})
          </button>
          <button
            onClick={() => setActiveSection('videos')}
            className={`px-3 sm:px-4 py-2 rounded-t-lg transition-colors text-xs sm:text-sm font-medium ${
              activeSection === 'videos'
                ? 'bg-[#ec6d13] text-white'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <Video className="w-4 h-4 inline mr-1 sm:mr-2" />
            Videos ({videos.length})
          </button>
          <button
            onClick={() => setActiveSection('notes')}
            className={`px-3 sm:px-4 py-2 rounded-t-lg transition-colors text-xs sm:text-sm font-medium ${
              activeSection === 'notes'
                ? 'bg-[#ec6d13] text-white'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <FileText className="w-4 h-4 inline mr-1 sm:mr-2" />
            Notes ({notes.length})
          </button>
          <button
            onClick={() => setActiveSection('quotes')}
            className={`px-3 sm:px-4 py-2 rounded-t-lg transition-colors text-xs sm:text-sm font-medium ${
              activeSection === 'quotes'
                ? 'bg-[#ec6d13] text-white'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <Quote className="w-4 h-4 inline mr-1 sm:mr-2" />
            Quotes ({quotes.length})
          </button>
        </div>

        {/* Photos Section */}
        {activeSection === 'photos' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="url"
                value={newPhoto}
                onChange={(e) => setNewPhoto(e.target.value)}
                placeholder="Enter photo URL"
                onKeyPress={(e) => e.key === 'Enter' && handleAddPhoto()}
                className="flex-1 px-3 sm:px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#ec6d13] focus:border-transparent text-sm sm:text-base"
              />
              <button
                onClick={handleAddPhoto}
                className="px-4 sm:px-6 py-2 bg-[#ec6d13] text-white rounded-lg hover:bg-[#d65d0f] transition-colors flex items-center justify-center gap-2 text-sm sm:text-base font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Photo
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {photos.map((photo, index) => (
                <div key={index} className="relative group">
                  <img
                    src={photo.url}
                    alt={`Portfolio ${index + 1}`}
                    className="w-full h-32 sm:h-40 object-cover rounded-lg border-2 border-stone-200"
                  />
                  <button
                    onClick={() => handleRemovePhoto(index)}
                    className="absolute top-1 right-1 sm:top-2 sm:right-2 p-1 sm:p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </div>
              ))}
            </div>

            {photos.length === 0 && (
              <div className="text-center py-8 sm:py-12 text-stone-500 text-sm sm:text-base">
                <ImageIcon className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-stone-300" />
                <p>No photos added yet. Add your first photo to showcase your work!</p>
              </div>
            )}
          </div>
        )}

        {/* Videos Section */}
        {activeSection === 'videos' && (
          <div className="space-y-4">
            <div className="space-y-3 sm:space-y-4 p-3 sm:p-4 bg-stone-50 rounded-lg">
              <input
                type="url"
                value={newVideo.url}
                onChange={(e) => setNewVideo({ ...newVideo, url: e.target.value })}
                placeholder="Video URL (YouTube, Vimeo, etc.)"
                className="w-full px-3 sm:px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#ec6d13] focus:border-transparent text-sm sm:text-base"
              />
              <input
                type="text"
                value={newVideo.title}
                onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                placeholder="Video title"
                className="w-full px-3 sm:px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#ec6d13] focus:border-transparent text-sm sm:text-base"
              />
              <input
                type="url"
                value={newVideo.thumbnail}
                onChange={(e) => setNewVideo({ ...newVideo, thumbnail: e.target.value })}
                placeholder="Thumbnail URL (optional)"
                className="w-full px-3 sm:px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#ec6d13] focus:border-transparent text-sm sm:text-base"
              />
              <button
                onClick={handleAddVideo}
                className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-[#ec6d13] text-white rounded-lg hover:bg-[#d65d0f] transition-colors flex items-center justify-center gap-2 text-sm sm:text-base font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Video
              </button>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {videos.map((video, index) => (
                <div key={index} className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-stone-50 rounded-lg border border-stone-200">
                  {video.thumbnail && (
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full sm:w-32 h-20 sm:h-20 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-stone-900 mb-1 text-sm sm:text-base">{video.title}</h4>
                    <a
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs sm:text-sm text-[#ec6d13] hover:underline break-all"
                    >
                      {video.url}
                    </a>
                  </div>
                  <button
                    onClick={() => handleRemoveVideo(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              ))}
            </div>

            {videos.length === 0 && (
              <div className="text-center py-8 sm:py-12 text-stone-500 text-sm sm:text-base">
                <Video className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-stone-300" />
                <p>No videos added yet. Add videos to tell your story!</p>
              </div>
            )}
          </div>
        )}

        {/* Notes Section */}
        {activeSection === 'notes' && (
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add a handwritten note, sketch description, or design inspiration..."
                rows="3"
                className="w-full px-3 sm:px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#ec6d13] focus:border-transparent text-sm sm:text-base"
              />
              <button
                onClick={handleAddNote}
                className="w-full sm:w-auto self-end px-4 sm:px-6 py-2 bg-[#ec6d13] text-white rounded-lg hover:bg-[#d65d0f] transition-colors flex items-center justify-center gap-2 text-sm sm:text-base font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Note
              </button>
            </div>

            <div className="space-y-3">
              {notes.map((note, index) => (
                <div key={index} className="flex items-start gap-3 p-3 sm:p-4 bg-stone-50 rounded-lg border border-stone-200">
                  <FileText className="w-5 h-5 text-[#ec6d13] flex-shrink-0 mt-1" />
                  <p className="flex-1 text-stone-700 text-sm sm:text-base whitespace-pre-wrap">{note.content}</p>
                  <button
                    onClick={() => handleRemoveNote(index)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {notes.length === 0 && (
              <div className="text-center py-8 sm:py-12 text-stone-500 text-sm sm:text-base">
                <FileText className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-stone-300" />
                <p>No notes added yet. Share your creative process and inspirations!</p>
              </div>
            )}
          </div>
        )}

        {/* Quotes Section */}
        {activeSection === 'quotes' && (
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <textarea
                value={newQuote}
                onChange={(e) => setNewQuote(e.target.value)}
                placeholder="Add an inspirational quote or personal philosophy..."
                rows="2"
                className="w-full px-3 sm:px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#ec6d13] focus:border-transparent text-sm sm:text-base"
              />
              <button
                onClick={handleAddQuote}
                className="w-full sm:w-auto self-end px-4 sm:px-6 py-2 bg-[#ec6d13] text-white rounded-lg hover:bg-[#d65d0f] transition-colors flex items-center justify-center gap-2 text-sm sm:text-base font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Quote
              </button>
            </div>

            <div className="space-y-3">
              {quotes.map((quote, index) => (
                <div key={index} className="relative p-4 sm:p-6 bg-stone-50 rounded-lg border-l-4 border-[#ec6d13]">
                  <Quote className="w-6 h-6 sm:w-8 sm:h-8 text-[#ec6d13] opacity-20 absolute top-2 left-2 sm:top-4 sm:left-4" />
                  <p className="text-stone-700 italic pl-6 sm:pl-10 text-sm sm:text-base">{quote.content}</p>
                  <button
                    onClick={() => handleRemoveQuote(index)}
                    className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {quotes.length === 0 && (
              <div className="text-center py-8 sm:py-12 text-stone-500 text-sm sm:text-base">
                <Quote className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-stone-300" />
                <p>No quotes added yet. Share words that inspire your craft!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioSection;
