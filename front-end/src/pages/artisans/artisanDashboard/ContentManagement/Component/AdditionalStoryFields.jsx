import { Plus, X } from 'lucide-react';

const AdditionalStoryFields = ({ 
  quotes, 
  onQuotesChange,
  culturalContext,
  onCulturalContextChange,
  challenges,
  onChallengesChange,
  triumphs,
  onTriumphsChange,
  videos,
  onVideosChange
}) => {
  const addQuote = () => {
    onQuotesChange([...quotes, '']);
  };

  const updateQuote = (index, value) => {
    const newQuotes = [...quotes];
    newQuotes[index] = value;
    onQuotesChange(newQuotes);
  };

  const removeQuote = (index) => {
    onQuotesChange(quotes.filter((_, i) => i !== index));
  };

  const addChallenge = () => {
    onChallengesChange([...challenges, '']);
  };

  const updateChallenge = (index, value) => {
    const newChallenges = [...challenges];
    newChallenges[index] = value;
    onChallengesChange(newChallenges);
  };

  const removeChallenge = (index) => {
    onChallengesChange(challenges.filter((_, i) => i !== index));
  };

  const addTriumph = () => {
    onTriumphsChange([...triumphs, '']);
  };

  const updateTriumph = (index, value) => {
    const newTriumphs = [...triumphs];
    newTriumphs[index] = value;
    onTriumphsChange(newTriumphs);
  };

  const removeTriumph = (index) => {
    onTriumphsChange(triumphs.filter((_, i) => i !== index));
  };

  const addVideo = () => {
    onVideosChange([...videos, { url: '', title: '' }]);
  };

  const updateVideo = (index, field, value) => {
    const newVideos = [...videos];
    newVideos[index][field] = value;
    onVideosChange(newVideos);
  };

  const removeVideo = (index) => {
    onVideosChange(videos.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* Inspirational Quotes */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-[#1b130d] dark:text-[#f3ece7]">
              Inspirational Quotes
            </h3>
            <p className="text-sm text-[#9a6c4c] dark:text-[#9a6c4c] mt-1">
              Share meaningful quotes that represent your philosophy
            </p>
          </div>
          <button
            onClick={addQuote}
            className="flex items-center gap-2 px-4 py-2 bg-[#ec6d13] hover:bg-[#d65d0f] text-white rounded-lg transition-colors text-sm font-medium"
          >
            <Plus className="h-4 w-4" />
            Add Quote
          </button>
        </div>

        <div className="space-y-3">
          {quotes.map((quote, index) => (
            <div key={index} className="relative">
              <textarea
                value={quote}
                onChange={(e) => updateQuote(index, e.target.value)}
                placeholder="Enter an inspirational quote..."
                className="w-full p-3 pr-12 text-sm border border-[#e7d9cf] dark:border-[#4a392b] rounded-lg bg-white dark:bg-[#221810]/50 text-[#3a3028] dark:text-[#f3ece7] focus:outline-none focus:ring-2 focus:ring-[#ec6d13] resize-none"
                rows="3"
              />
              <button
                onClick={() => removeQuote(index)}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          {quotes.length === 0 && (
            <p className="text-sm text-[#9a6c4c] dark:text-[#9a6c4c] text-center py-4">
              No quotes added yet. Click "Add Quote" to get started.
            </p>
          )}
        </div>
      </section>

      {/* Cultural Context */}
      <section className="space-y-4">
        <div>
          <h3 className="text-lg font-bold text-[#1b130d] dark:text-[#f3ece7]">
            Cultural Heritage
          </h3>
          <p className="text-sm text-[#9a6c4c] dark:text-[#9a6c4c] mt-1">
            Describe the cultural context and heritage behind your craft
          </p>
        </div>

        <textarea
          value={culturalContext}
          onChange={(e) => onCulturalContextChange(e.target.value)}
          placeholder="Share the cultural heritage and traditions that influence your work..."
          className="w-full p-4 text-sm border border-[#e7d9cf] dark:border-[#4a392b] rounded-lg bg-white dark:bg-[#221810]/50 text-[#3a3028] dark:text-[#f3ece7] focus:outline-none focus:ring-2 focus:ring-[#ec6d13] resize-none"
          rows="6"
        />
      </section>

      {/* Videos */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-[#1b130d] dark:text-[#f3ece7]">
              Videos
            </h3>
            <p className="text-sm text-[#9a6c4c] dark:text-[#9a6c4c] mt-1">
              Add YouTube or Vimeo video URLs to showcase your craft
            </p>
          </div>
          <button
            onClick={addVideo}
            className="flex items-center gap-2 px-4 py-2 bg-[#ec6d13] hover:bg-[#d65d0f] text-white rounded-lg transition-colors text-sm font-medium"
          >
            <Plus className="h-4 w-4" />
            Add Video
          </button>
        </div>

        <div className="space-y-3">
          {videos.map((video, index) => (
            <div key={index} className="relative p-4 border border-[#e7d9cf] dark:border-[#4a392b] rounded-lg bg-white dark:bg-[#221810]/50">
              <button
                onClick={() => removeVideo(index)}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="space-y-3 pr-8">
                <input
                  type="text"
                  value={video.title}
                  onChange={(e) => updateVideo(index, 'title', e.target.value)}
                  placeholder="Video title"
                  className="w-full p-2 text-sm border border-[#e7d9cf] dark:border-[#4a392b] rounded bg-transparent text-[#3a3028] dark:text-[#f3ece7] focus:outline-none focus:ring-2 focus:ring-[#ec6d13]"
                />
                <input
                  type="url"
                  value={video.url}
                  onChange={(e) => updateVideo(index, 'url', e.target.value)}
                  placeholder="Video URL (YouTube embed link)"
                  className="w-full p-2 text-sm border border-[#e7d9cf] dark:border-[#4a392b] rounded bg-transparent text-[#3a3028] dark:text-[#f3ece7] focus:outline-none focus:ring-2 focus:ring-[#ec6d13]"
                />
              </div>
            </div>
          ))}
          {videos.length === 0 && (
            <p className="text-sm text-[#9a6c4c] dark:text-[#9a6c4c] text-center py-4">
              No videos added yet. Click "Add Video" to get started.
            </p>
          )}
        </div>
      </section>

      {/* Challenges */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-[#1b130d] dark:text-[#f3ece7]">
              Challenges
            </h3>
            <p className="text-sm text-[#9a6c4c] dark:text-[#9a6c4c] mt-1">
              Share the challenges you've faced in your craft journey
            </p>
          </div>
          <button
            onClick={addChallenge}
            className="flex items-center gap-2 px-4 py-2 bg-[#ec6d13] hover:bg-[#d65d0f] text-white rounded-lg transition-colors text-sm font-medium"
          >
            <Plus className="h-4 w-4" />
            Add Challenge
          </button>
        </div>

        <div className="space-y-3">
          {challenges.map((challenge, index) => (
            <div key={index} className="relative">
              <input
                type="text"
                value={challenge}
                onChange={(e) => updateChallenge(index, e.target.value)}
                placeholder="Enter a challenge..."
                className="w-full p-3 pr-12 text-sm border border-[#e7d9cf] dark:border-[#4a392b] rounded-lg bg-white dark:bg-[#221810]/50 text-[#3a3028] dark:text-[#f3ece7] focus:outline-none focus:ring-2 focus:ring-[#ec6d13]"
              />
              <button
                onClick={() => removeChallenge(index)}
                className="absolute top-1/2 -translate-y-1/2 right-2 p-1.5 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          {challenges.length === 0 && (
            <p className="text-sm text-[#9a6c4c] dark:text-[#9a6c4c] text-center py-4">
              No challenges added yet. Click "Add Challenge" to get started.
            </p>
          )}
        </div>
      </section>

      {/* Triumphs */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-[#1b130d] dark:text-[#f3ece7]">
              Triumphs & Achievements
            </h3>
            <p className="text-sm text-[#9a6c4c] dark:text-[#9a6c4c] mt-1">
              Celebrate your accomplishments and milestones
            </p>
          </div>
          <button
            onClick={addTriumph}
            className="flex items-center gap-2 px-4 py-2 bg-[#ec6d13] hover:bg-[#d65d0f] text-white rounded-lg transition-colors text-sm font-medium"
          >
            <Plus className="h-4 w-4" />
            Add Triumph
          </button>
        </div>

        <div className="space-y-3">
          {triumphs.map((triumph, index) => (
            <div key={index} className="relative">
              <input
                type="text"
                value={triumph}
                onChange={(e) => updateTriumph(index, e.target.value)}
                placeholder="Enter an achievement..."
                className="w-full p-3 pr-12 text-sm border border-[#e7d9cf] dark:border-[#4a392b] rounded-lg bg-white dark:bg-[#221810]/50 text-[#3a3028] dark:text-[#f3ece7] focus:outline-none focus:ring-2 focus:ring-[#ec6d13]"
              />
              <button
                onClick={() => removeTriumph(index)}
                className="absolute top-1/2 -translate-y-1/2 right-2 p-1.5 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          {triumphs.length === 0 && (
            <p className="text-sm text-[#9a6c4c] dark:text-[#9a6c4c] text-center py-4">
              No triumphs added yet. Click "Add Triumph" to get started.
            </p>
          )}
        </div>
      </section>
    </div>
  );
};

export default AdditionalStoryFields;
