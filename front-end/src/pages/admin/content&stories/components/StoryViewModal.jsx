import { X, MapPin, Award, ExternalLink } from 'lucide-react';
import { useEffect } from 'react';

const StoryViewModal = ({ artisan, onClose }) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!artisan) return null;

  const hasStory = artisan.story && (
    artisan.fullBio || 
    (artisan.story.photos && artisan.story.photos.length > 0) ||
    (artisan.story.quotes && artisan.story.quotes.length > 0) ||
    (artisan.story.challenges && artisan.story.challenges.length > 0) ||
    (artisan.story.triumphs && artisan.story.triumphs.length > 0)
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="relative bg-white dark:bg-[#2a1e14] rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-[#e7d9cf] dark:border-[#3f2e1e] bg-white dark:bg-[#2a1e14]">
              <h2 className="text-xl font-bold text-[#1b130d] dark:text-[#fcfaf8]">
                Artisan Story Preview
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-[#f3ece7] dark:hover:bg-[#3a2a1d] rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-80px)] px-6 py-6">
              {/* Artisan Header */}
              <div className="flex flex-col sm:flex-row gap-6 mb-8">
                <img
                  src={artisan.profilePhotoUrl || 'https://via.placeholder.com/120'}
                  alt={artisan.name}
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover mx-auto sm:mx-0"
                />
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-2xl font-bold text-[#1b130d] dark:text-[#fcfaf8] mb-2">
                    {artisan.name}
                  </h3>
                  <p className="text-[#ec6d13] font-semibold mb-3">
                    {artisan.craftSpecialization}
                  </p>
                  
                  <div className="flex flex-wrap gap-4 justify-center sm:justify-start text-sm text-[#9a6c4c] dark:text-[#a88e79]">
                    {artisan.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {artisan.location}
                      </div>
                    )}
                    {artisan.experienceYears && (
                      <div className="flex items-center gap-1">
                        <Award className="w-4 h-4" />
                        {artisan.experienceYears} years experience
                      </div>
                    )}
                  </div>

                  {artisan.briefBio && (
                    <p className="mt-3 text-[#9a6c4c] dark:text-[#a88e79]">
                      {artisan.briefBio}
                    </p>
                  )}
                </div>
              </div>

              {!hasStory ? (
                <div className="text-center py-12 bg-[#f3ece7] dark:bg-[#3a2a1d]/50 rounded-lg">
                  <p className="text-[#9a6c4c] dark:text-[#a88e79]">
                    No story content available for this artisan
                  </p>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Full Bio */}
                  {artisan.fullBio && (
                    <div>
                      <h4 className="text-lg font-bold text-[#1b130d] dark:text-[#fcfaf8] mb-3">
                        Story
                      </h4>
                      <p className="text-[#9a6c4c] dark:text-[#a88e79] leading-relaxed whitespace-pre-line">
                        {artisan.fullBio}
                      </p>
                    </div>
                  )}

                  {/* Photos Gallery */}
                  {artisan.story?.photos && artisan.story.photos.length > 0 && (
                    <div>
                      <h4 className="text-lg font-bold text-[#1b130d] dark:text-[#fcfaf8] mb-3">
                        Gallery Photos
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {artisan.story.photos.map((photo, index) => (
                          <img
                            key={index}
                            src={photo}
                            alt={`Gallery ${index + 1}`}
                            className="w-full h-32 sm:h-40 object-cover rounded-lg"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Handwritten Notes */}
                  {artisan.story?.handwrittenNotes && artisan.story.handwrittenNotes.length > 0 && (
                    <div>
                      <h4 className="text-lg font-bold text-[#1b130d] dark:text-[#fcfaf8] mb-3">
                        Design Sketches & Notes
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {artisan.story.handwrittenNotes.map((note, index) => (
                          <img
                            key={index}
                            src={note}
                            alt={`Note ${index + 1}`}
                            className="w-full h-32 sm:h-40 object-cover rounded-lg"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quotes */}
                  {artisan.story?.quotes && artisan.story.quotes.length > 0 && (
                    <div>
                      <h4 className="text-lg font-bold text-[#1b130d] dark:text-[#fcfaf8] mb-3">
                        Inspiring Quotes
                      </h4>
                      <div className="space-y-3">
                        {artisan.story.quotes.map((quote, index) => (
                          <blockquote 
                            key={index}
                            className="border-l-4 border-[#ec6d13] pl-4 py-2 italic text-[#9a6c4c] dark:text-[#a88e79]"
                          >
                            "{quote}"
                          </blockquote>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Cultural Context */}
                  {artisan.story?.culturalContext && (
                    <div>
                      <h4 className="text-lg font-bold text-[#1b130d] dark:text-[#fcfaf8] mb-3">
                        Cultural Context
                      </h4>
                      <p className="text-[#9a6c4c] dark:text-[#a88e79] leading-relaxed">
                        {artisan.story.culturalContext}
                      </p>
                    </div>
                  )}

                  {/* Challenges */}
                  {artisan.story?.challenges && artisan.story.challenges.length > 0 && (
                    <div>
                      <h4 className="text-lg font-bold text-[#1b130d] dark:text-[#fcfaf8] mb-3">
                        Challenges Overcome
                      </h4>
                      <ul className="space-y-2">
                        {artisan.story.challenges.map((challenge, index) => (
                          <li 
                            key={index}
                            className="flex items-start gap-2 text-[#9a6c4c] dark:text-[#a88e79]"
                          >
                            <span className="text-[#ec6d13] mt-1">•</span>
                            <span>{challenge}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Triumphs */}
                  {artisan.story?.triumphs && artisan.story.triumphs.length > 0 && (
                    <div>
                      <h4 className="text-lg font-bold text-[#1b130d] dark:text-[#fcfaf8] mb-3">
                        Triumphs & Achievements
                      </h4>
                      <ul className="space-y-2">
                        {artisan.story.triumphs.map((triumph, index) => (
                          <li 
                            key={index}
                            className="flex items-start gap-2 text-[#9a6c4c] dark:text-[#a88e79]"
                          >
                            <span className="text-[#ec6d13] mt-1">•</span>
                            <span>{triumph}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Videos */}
                  {artisan.story?.videos && artisan.story.videos.length > 0 && (
                    <div>
                      <h4 className="text-lg font-bold text-[#1b130d] dark:text-[#fcfaf8] mb-3">
                        Videos
                      </h4>
                      <div className="space-y-3">
                        {artisan.story.videos.map((video, index) => (
                          <a
                            key={index}
                            href={video.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-4 bg-[#f3ece7] dark:bg-[#3a2a1d] rounded-lg hover:bg-[#ec6d13]/10 transition-colors"
                          >
                            <span className="font-medium text-[#1b130d] dark:text-[#fcfaf8]">
                              {video.title}
                            </span>
                            <ExternalLink className="w-4 h-4 text-[#ec6d13]" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* View Live Story Button */}
              <div className="mt-8 pt-6 border-t border-[#e7d9cf] dark:border-[#3f2e1e]">
                <a
                  href={`/artisan-stories/${artisan.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-[#ec6d13] text-white rounded-lg hover:bg-[#ec6d13]/90 transition-colors font-medium"
                >
                  View Live Story Page
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryViewModal;
