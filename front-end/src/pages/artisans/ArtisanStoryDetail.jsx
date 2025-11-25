import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar, Footer } from '@/components/layout';
import { API_BASE_URL } from '@/utils/api';

const ArtisanStoryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [artisan, setArtisan] = useState(null);
  const [artisanProducts, setArtisanProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  // Update likes count when artisan data loads
  useEffect(() => {
    if (artisan?.likes) {
      setLikesCount(artisan.likes);
    }
  }, [artisan]);

  useEffect(() => {
    const fetchArtisanData = async () => {
      try {
        setLoading(true);
        const [artisanRes, productsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/artisans/${id}`),
          fetch(`${API_BASE_URL}/api/artisan-products`)
        ]);

        const artisanData = await artisanRes.json();
        let productsData = null;
        
        try {
          const productsResData = await productsRes.json();
          productsData = productsResData;
        } catch (err) {
          console.warn('Failed to parse products data:', err);
        }

        if (artisanData.success && artisanData.data) {
          const artisanDataObj = artisanData.data;
          setArtisan(artisanDataObj);
          // Use likes from database, fallback to random if not available
          setLikesCount(artisanDataObj.likes || artisanDataObj.story?.likes || Math.floor(Math.random() * 100) + 20);
          
          // Filter products by artisan ID (use the artisan ID from the fetched data)
          const artisanId = artisanDataObj.id || id;
          const productsArray = productsData?.data || productsData || [];
          
          if (Array.isArray(productsArray)) {
            const filtered = productsArray.filter(
              product => product.artisanInfo?.id === artisanId
            );
            setArtisanProducts(filtered.slice(0, 6)); // Show max 6 products
          }
        } else {
          setError('Artisan not found');
        }
      } catch (err) {
        console.error('Failed to fetch artisan data:', err);
        setError('Failed to load artisan story. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchArtisanData();
    }
  }, [id]);

  const handleLike = () => {
    setLiked(!liked);
    setLikesCount(prev => liked ? prev - 1 : prev + 1);
    // In production, this would make an API call
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${artisan?.name}'s Story`,
          text: `Discover the story of ${artisan?.name}, a master ${artisan?.craftSpecialization}`,
          url: url
        });
      } catch (err) {
        // User cancelled or error occurred
        if (err.name !== 'AbortError') {
          console.log('Error sharing:', err);
        }
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy to clipboard:', err);
        // Final fallback: show URL in prompt
        prompt('Copy this link:', url);
      }
    }
  };

  // Get story data from database
  const getPhotos = () => {
    if (artisan?.story?.photos && artisan.story.photos.length > 0) {
      return artisan.story.photos;
    }
    // Return profile photo as single item if no gallery photos
    if (artisan?.profilePhotoUrl) {
      return [artisan.profilePhotoUrl];
    }
    return [];
  };

  const getVideos = () => {
    if (artisan?.story?.videos && artisan.story.videos.length > 0) {
      return artisan.story.videos;
    }
    return [];
  };

  const getHandwrittenNotes = () => {
    if (artisan?.story?.handwrittenNotes && artisan.story.handwrittenNotes.length > 0) {
      return artisan.story.handwrittenNotes;
    }
    return [];
  };

  const getQuotes = () => {
    if (artisan?.story?.quotes && artisan.story.quotes.length > 0) {
      return artisan.story.quotes;
    }
    // Use first part of fullBio as a quote if no quotes available
    if (artisan?.fullBio && artisan.fullBio.length > 100) {
      return [artisan.fullBio.substring(0, 150) + '...'];
    }
    return [];
  };

  const getCulturalContext = () => {
    return artisan?.story?.culturalContext || artisan?.fullBio || '';
  };

  const getChallenges = () => {
    if (artisan?.story?.challenges && artisan.story.challenges.length > 0) {
      return artisan.story.challenges;
    }
    return [];
  };

  const getTriumphs = () => {
    if (artisan?.story?.triumphs && artisan.story.triumphs.length > 0) {
      return artisan.story.triumphs;
    }
    return [];
  };

  if (loading) {
    return (
      <div className="bg-stone-50 min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
            <p className="text-stone-600 text-lg">Loading artisan story...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !artisan) {
    return (
      <div className="bg-stone-50 min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md mx-auto px-4">
            <p className="text-red-600 text-lg mb-4">{error || 'Artisan not found'}</p>
            <button
              onClick={() => navigate('/artisan-stories')}
              className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Back to Stories
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const photos = getPhotos();
  const videos = getVideos();
  const handwrittenNotes = getHandwrittenNotes();
  const quotes = getQuotes();
  const culturalContext = getCulturalContext();
  const challenges = getChallenges();
  const triumphs = getTriumphs();

  return (
    <div className="bg-stone-50 min-h-screen">
      <Navbar />

      {/* Hero Section with Profile */}
      <section className="relative pt-20 pb-12 sm:pt-24 sm:pb-16 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/artisan-stories')}
            className="mb-6 sm:mb-8 flex items-center gap-2 text-stone-600 hover:text-amber-600 transition-colors text-sm sm:text-base"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Stories
          </button>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
            {/* Profile Image */}
            <div className="w-full lg:w-1/3 flex-shrink-0">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                {artisan.profilePhotoUrl ? (
                  <img
                    src={artisan.profilePhotoUrl}
                    alt={artisan.name}
                    className="w-full h-64 sm:h-80 lg:h-96 object-cover"
                  />
                ) : (
                  <div className="w-full h-64 sm:h-80 lg:h-96 bg-gradient-to-br from-amber-200 to-orange-200 flex items-center justify-center">
                    <span className="text-8xl font-bold text-amber-700">
                      {artisan.name?.charAt(0) || 'A'}
                    </span>
                  </div>
                )}
                {artisan.verified && (
                  <div className="absolute top-4 right-4 bg-amber-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 shadow-lg">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Verified Artisan
                  </div>
                )}
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-stone-800 mb-4">
                {artisan.name}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <span className="text-xl sm:text-2xl text-amber-600 font-semibold">
                  {artisan.craftSpecialization}
                </span>
                {artisan.experienceYears && (
                  <span className="text-stone-600 text-lg">
                    {artisan.experienceYears} years of experience
                  </span>
                )}
              </div>

              {artisan.location && (
                <div className="flex items-center gap-2 mb-6 text-stone-600 text-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{artisan.location}</span>
                </div>
              )}

              {artisan.briefBio && (
                <p className="text-lg sm:text-xl text-stone-700 mb-6 leading-relaxed">
                  {artisan.briefBio}
                </p>
              )}

              {/* Social Links & Actions */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                {artisan.socialLinks?.instagram && (
                  <a
                    href={`https://instagram.com/${artisan.socialLinks.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    <span className="hidden sm:inline">Instagram</span>
                  </a>
                )}
                {artisan.socialLinks?.facebook && (
                  <a
                    href={`https://facebook.com/${artisan.socialLinks.facebook}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    <span className="hidden sm:inline">Facebook</span>
                  </a>
                )}
                {artisan.socialLinks?.website && (
                  <a
                    href={artisan.socialLinks.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-stone-700 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    <span className="hidden sm:inline">Website</span>
                  </a>
                )}
              </div>

              {/* Like & Share */}
              <div className="flex items-center gap-4">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                    liked
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                  }`}
                >
                  <svg className="w-5 h-5" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span>{likesCount}</span>
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold transition-all hover:shadow-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pull-out Quote */}
      {quotes.length > 0 && (
        <section className="py-8 sm:py-12 bg-white border-y border-stone-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <blockquote className="text-2xl sm:text-3xl lg:text-4xl font-serif italic text-stone-700 text-center leading-relaxed">
              "{quotes[0]}"
            </blockquote>
            <p className="text-center mt-4 text-stone-600 text-lg">— {artisan.name}</p>
          </div>
        </section>
      )}

      {/* Background Story */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-stone-800 mb-6 sm:mb-8">Their Story</h2>
          <div className="prose prose-lg max-w-none text-stone-700 leading-relaxed">
            <p className="text-lg sm:text-xl mb-6">
              {artisan.fullBio || culturalContext}
            </p>
          </div>
        </div>
      </section>

      {/* Photo Gallery */}
      {photos.length > 0 && (
        <section className="py-12 sm:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-800 mb-8 sm:mb-12 text-center">Gallery</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {photos.map((photo, idx) => (
                <div
                  key={idx}
                  className="relative aspect-square rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow cursor-pointer group"
                >
                  <img
                    src={photo}
                    alt={`Gallery image ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Video Section */}
      {videos.length > 0 && (
        <section className="py-12 sm:py-16 bg-stone-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-800 mb-8 sm:mb-12 text-center">Videos</h2>
            <div className="space-y-8">
              {videos.map((video, idx) => (
                <div key={idx} className="rounded-xl overflow-hidden shadow-xl">
                  <div className="relative pb-[56.25%] h-0 overflow-hidden">
                    <iframe
                      className="absolute top-0 left-0 w-full h-full"
                      src={video.url}
                      title={video.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                  <div className="bg-white p-4">
                    <h3 className="text-xl font-semibold text-stone-800">{video.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Cultural Context */}
      {culturalContext && (
        <section className="py-12 sm:py-16 lg:py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-800 mb-6 sm:mb-8">Cultural Heritage</h2>
            <div className="bg-amber-50 rounded-2xl p-6 sm:p-8 border-l-4 border-amber-500">
              <p className="text-lg sm:text-xl text-stone-700 leading-relaxed">
                {culturalContext}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Challenges & Triumphs */}
      {(challenges.length > 0 || triumphs.length > 0) && (
        <section className="py-12 sm:py-16 lg:py-20 bg-stone-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
              {/* Challenges */}
              {challenges.length > 0 && (
                <div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-stone-800 mb-6 sm:mb-8 flex items-center gap-3">
                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Challenges
                  </h2>
                  <ul className="space-y-4">
                    {challenges.map((challenge, idx) => (
                      <li key={idx} className="flex items-start gap-3 bg-white rounded-lg p-4 shadow-md">
                        <svg className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-stone-700 text-lg">{challenge}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Triumphs */}
              {triumphs.length > 0 && (
                <div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-stone-800 mb-6 sm:mb-8 flex items-center gap-3">
                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                    Triumphs
                  </h2>
                  <ul className="space-y-4">
                    {triumphs.map((triumph, idx) => (
                      <li key={idx} className="flex items-start gap-3 bg-white rounded-lg p-4 shadow-md">
                        <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-stone-700 text-lg">{triumph}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Handwritten Notes/Sketches */}
      {handwrittenNotes.length > 0 && (
        <section className="py-12 sm:py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-800 mb-8 sm:mb-12 text-center">Designs & Sketches</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              {handwrittenNotes.map((note, idx) => (
                <div key={idx} className="rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow">
                  <img
                    src={note}
                    alt={`Design sketch ${idx + 1}`}
                    className="w-full h-auto object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Awards & Certifications */}
      {(artisan.awards?.length > 0 || artisan.certifications?.length > 0) && (
        <section className="py-12 sm:py-16 bg-stone-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-800 mb-8 sm:mb-12 text-center">Recognition</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {artisan.awards?.length > 0 && (
                <div>
                  <h3 className="text-2xl font-semibold text-stone-700 mb-4">Awards</h3>
                  <ul className="space-y-3">
                    {artisan.awards.map((award, idx) => (
                      <li key={idx} className="bg-white rounded-lg p-4 shadow-md flex items-center gap-3">
                        <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-stone-700">{award}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {artisan.certifications?.length > 0 && (
                <div>
                  <h3 className="text-2xl font-semibold text-stone-700 mb-4">Certifications</h3>
                  <ul className="space-y-3">
                    {artisan.certifications.map((cert, idx) => (
                      <li key={idx} className="bg-white rounded-lg p-4 shadow-md flex items-center gap-3">
                        <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-stone-700">{cert}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Product Showcase */}
      {artisanProducts.length > 0 && (
        <section className="py-12 sm:py-16 lg:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-800 mb-8 sm:mb-12 text-center">
              Their Creations
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {artisanProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => navigate(`/product/artisan-product/${product.id}`)}
                  className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-stone-200 hover:border-amber-300 cursor-pointer"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={product.image || product.images?.[0]}
                      alt={product.title}
                      className="w-full h-48 sm:h-56 object-cover group-hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-bold text-stone-800 mb-2 group-hover:text-amber-600 transition-colors">
                      {product.title}
                    </h3>
                    <p className="text-stone-600 text-sm mb-4 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-amber-600">
                        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: product.currency || 'INR' }).format(product.price)}
                      </span>
                      <button className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm">
                        View Product
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-8 sm:mt-12">
              <button
                onClick={() => navigate(`/artisans?artisan=${id}`)}
                className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-all hover:shadow-lg"
              >
                View All Products
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Location Map */}
      {artisan.location && (
        <section className="py-12 sm:py-16 bg-stone-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-800 mb-8 sm:mb-12 text-center">Location</h2>
            <div className="bg-white rounded-2xl overflow-hidden shadow-xl">
              <div className="h-64 sm:h-96 bg-stone-200 relative">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(artisan.location)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 flex items-center justify-center bg-stone-100 hover:bg-stone-200 transition-colors group"
                >
                  <div className="text-center">
                    <svg className="w-16 h-16 sm:w-20 sm:h-20 text-amber-600 mx-auto mb-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="text-stone-700 font-semibold text-lg sm:text-xl">{artisan.location}</p>
                    <p className="text-stone-600 text-sm sm:text-base mt-2">Click to view on Google Maps</p>
                  </div>
                </a>
              </div>
              <div className="p-6 sm:p-8">
                <h3 className="text-2xl font-semibold text-stone-800 mb-2">{artisan.location}</h3>
                <p className="text-stone-600">Visit the artisan's workshop and experience their craft firsthand</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-amber-500 to-orange-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Support This Artisan
          </h2>
          <p className="text-xl sm:text-2xl text-amber-50 mb-8">
            Help preserve traditional craftsmanship by exploring their work
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate(`/artisans?artisan=${id}`)}
              className="bg-white text-amber-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-amber-50 transition-all hover:shadow-xl"
            >
              Shop Their Products
            </button>
            <button
              onClick={handleShare}
              className="bg-amber-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-amber-700 transition-all hover:shadow-xl border-2 border-white"
            >
              Share Their Story
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ArtisanStoryDetail;

