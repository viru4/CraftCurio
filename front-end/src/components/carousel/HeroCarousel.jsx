import React, { useState, useEffect } from 'react';

const HeroCarousel = ({ 
  items, 
  autoAdvanceInterval = 4000, 
  className = "",
  onItemClick = null 
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance carousel
  useEffect(() => {
    if (autoAdvanceInterval > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % items.length);
      }, autoAdvanceInterval);

      return () => clearInterval(interval);
    }
  }, [items.length, autoAdvanceInterval]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % items.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + items.length) % items.length);
  };

  const handleItemClick = (item) => {
    if (onItemClick) {
      onItemClick(item);
    }
  };

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className={`relative w-full ${className}`}>
      <div className="relative overflow-hidden rounded-2xl shadow-2xl">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {items.map((item, index) => (
            <div 
              key={item.id || index}
              className="w-full flex-shrink-0 relative cursor-pointer group"
              onClick={() => handleItemClick(item)}
            >
              <div className="relative h-64 md:h-80 lg:h-96">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
                
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
                  <h3 className="text-2xl md:text-3xl font-bold mb-2 group-hover:text-amber-200 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm md:text-base text-gray-200">
                    {item.description}
                  </p>
                  <div className="mt-4 inline-flex items-center text-amber-200 font-medium">
                    <span>{item.buttonText || 'Explore Collection'}</span>
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm hover:bg-white text-stone-700 rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
        aria-label="Previous slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm hover:bg-white text-stone-700 rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
        aria-label="Next slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots Navigation */}
      <div className="flex justify-center mt-6 space-x-3">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              currentSlide === index
                ? 'bg-amber-600 w-8'
                : 'bg-stone-400 hover:bg-amber-400'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;