import React from 'react';

/**
 * Hero Section Component
 * Displays the main headline, tagline, and hero image for the About Us page
 * Fully responsive with mobile-first design
 * Now supports dynamic data from backend API
 */
const HeroSection = ({ data }) => {
  // Use dynamic data or fallback to defaults
  const headline = data?.headline || 'Welcome to';
  const highlightText = data?.highlightText || 'CraftCurio';
  const tagline = data?.tagline || 'Discover the journey of curated collectibles and handcrafted items, built to connect discerning buyers, passionate collectors, and gifted artisans.';
  const image = data?.image || '/api/placeholder/600/400';

  return (
    <section className="relative w-full bg-gradient-to-br from-stone-100 via-stone-50 to-amber-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left space-y-6 z-10">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-stone-800 leading-tight">
              {headline}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
                {highlightText}
              </span>
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-stone-600 leading-relaxed">
              {tagline}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <a 
                href="#our-story" 
                className="px-8 py-3 bg-amber-600 text-white rounded-full font-semibold hover:bg-amber-700 transition-all transform hover:scale-105 shadow-lg"
              >
                Our Story
              </a>
              <a 
                href="#contact" 
                className="px-8 py-3 border-2 border-amber-600 text-amber-600 rounded-full font-semibold hover:bg-amber-50 transition-all"
              >
                Get in Touch
              </a>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500">
              <img 
                src={image} 
                alt="Artisan crafts and collectibles" 
                className="w-full h-auto object-cover"
                onError={(e) => {
                  e.target.src = '/api/placeholder/600/400';
                }}
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-amber-200 rounded-full opacity-50 blur-3xl"></div>
            <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-orange-200 rounded-full opacity-50 blur-3xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
