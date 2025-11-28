import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Footer } from '@/components/layout';
import { API_BASE_URL } from '@/utils/api';

const ArtisanStories = () => {
  const [artisans, setArtisans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArtisans = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/artisans`);
        const data = await response.json();

        if (data.success && Array.isArray(data.data)) {
          setArtisans(data.data);
        } else {
          setArtisans([]);
        }
      } catch (err) {
        console.error('Failed to fetch artisans:', err);
        setError('Failed to load artisan stories. Please try again later.');
        setArtisans([]);
      } finally {
        setLoading(false);
      }
    };

    fetchArtisans();
  }, []);

  const handleCardClick = (artisanId) => {
    navigate(`/artisan-stories/${artisanId}`);
  };

  if (loading) {
    return (
      <div className="bg-stone-50 min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
            <p className="text-stone-600 text-lg">Loading artisan stories...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-stone-50 min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md mx-auto px-4">
            <p className="text-red-600 text-lg mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-stone-50 min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-20 pb-12 sm:pt-24 sm:pb-16 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-stone-800 mb-4 sm:mb-6">
              Artisan Stories
            </h1>
            <p className="text-lg sm:text-xl text-stone-600 mb-2">
              Discover the passionate craftspeople behind every handcrafted piece
            </p>
            <p className="text-base sm:text-lg text-stone-600">
              Each story is a journey of tradition, creativity, and dedication
            </p>
          </div>
        </div>
      </section>

      {/* Artisan Cards Grid */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {artisans.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-stone-600 text-lg">No artisan stories available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {artisans.map((artisan) => {
                const artisanId = artisan.id;
                return (
                  <div
                    key={artisanId}
                    onClick={() => handleCardClick(artisanId)}
                    className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-stone-200 hover:border-amber-300 cursor-pointer transform hover:-translate-y-2"
                  >
                    {/* Profile Image */}
                    <div className="relative h-64 sm:h-72 overflow-hidden bg-gradient-to-br from-amber-100 to-orange-100">
                      {artisan.profilePhotoUrl ? (
                        <img
                          src={artisan.profilePhotoUrl}
                          alt={artisan.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-amber-200 flex items-center justify-center">
                            <span className="text-4xl sm:text-5xl font-bold text-amber-700">
                              {artisan.name?.charAt(0) || 'A'}
                            </span>
                          </div>
                        </div>
                      )}
                      {artisan.verified && (
                        <div className="absolute top-4 right-4 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Verified
                        </div>
                      )}
                    </div>

                    {/* Card Content */}
                    <div className="p-6 sm:p-8">
                      <h3 className="text-2xl sm:text-3xl font-bold text-stone-800 mb-2 group-hover:text-amber-600 transition-colors">
                        {artisan.name}
                      </h3>

                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-amber-600 font-semibold text-sm sm:text-base">
                          {artisan.craftSpecialization}
                        </span>
                        {artisan.experienceYears && (
                          <span className="text-stone-500 text-sm">
                            • {artisan.experienceYears} years
                          </span>
                        )}
                      </div>

                      {artisan.location && (
                        <div className="flex items-center gap-2 mb-4 text-stone-600 text-sm sm:text-base">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>{artisan.location}</span>
                        </div>
                      )}

                      {artisan.briefBio && (
                        <p className="text-stone-600 text-sm sm:text-base mb-4 line-clamp-3">
                          {artisan.briefBio}
                        </p>
                      )}

                      {/* Awards & Certifications */}
                      {(artisan.awards?.length > 0 || artisan.certifications?.length > 0) && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {artisan.awards?.slice(0, 1).map((award, idx) => (
                            <span key={idx} className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-medium">
                              {typeof award === 'string' ? award : award.name}
                            </span>
                          ))}
                          {artisan.certifications?.slice(0, 1).map((cert, idx) => (
                            <span key={idx} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                              {typeof cert === 'string' ? cert : cert.name}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* View Story Button */}
                      <button className="w-full bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform group-hover:scale-105 shadow-md group-hover:shadow-lg">
                        Read Their Story
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ArtisanStories;

