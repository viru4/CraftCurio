import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

/**
 * Testimonials Section Component
 * Displays customer and artisan testimonials in a carousel format
 * Fully responsive with manual and automatic slide controls
 */
const TestimonialsSection = ({ data }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Extract data with fallbacks
  const title = data?.title || "What People Say";
  const subtitle = data?.subtitle || "Hear from our community of artisans and collectors";
  const testimonials = data?.items || [
    {
      type: "collector",
      name: "Emily Thompson",
      role: "Art Collector, New York",
      image: "/api/placeholder/100/100",
      quote: "CraftCurio has become my go-to platform for discovering unique collectibles. Every purchase comes with a story that makes each piece even more special. The authenticity verification gives me complete confidence.",
      rating: 5
    },
    {
      type: "artisan",
      name: "Carlos Mendoza",
      role: "Woodcarver, Guatemala",
      image: "/api/placeholder/100/100",
      quote: "This platform changed my life. I can now reach customers across the world and share the traditional techniques passed down through generations. The support team genuinely cares about artisans.",
      rating: 5
    },
    {
      type: "collector",
      name: "Sophia Lee",
      role: "Interior Designer, Singapore",
      image: "/api/placeholder/100/100",
      quote: "The quality and uniqueness of items on CraftCurio are unmatched. I've furnished entire spaces with pieces from here, and my clients always ask where I found such extraordinary items.",
      rating: 5
    },
    {
      type: "artisan",
      name: "Fatima Al-Rashid",
      role: "Textile Artist, Morocco",
      image: "/api/placeholder/100/100",
      quote: "Finally, a marketplace that values traditional craftsmanship! The direct connection with buyers means I can explain my process and build lasting relationships. My sales have increased 400%.",
      rating: 5
    },
    {
      type: "collector",
      name: "David Martinez",
      role: "Museum Curator, Spain",
      image: "/api/placeholder/100/100",
      quote: "As a curator, I appreciate the meticulous authentication process. CraftCurio has helped me discover incredible pieces for our collection that we couldn't find anywhere else.",
      rating: 5
    },
    {
      type: "artisan",
      name: "Mei Zhang",
      role: "Ceramic Artist, China",
      image: "/api/placeholder/100/100",
      quote: "The platform makes it easy to manage my shop, and the photography tips helped showcase my work beautifully. I've connected with collectors who truly appreciate the art of pottery.",
      rating: 5
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Safety check for empty testimonials
  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  const currentTestimonial = testimonials[currentSlide];

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-800 mb-4">
            {title}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-600 to-orange-600 mx-auto rounded-full mb-6"></div>
          <p className="text-xl text-stone-600 max-w-3xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative max-w-4xl mx-auto">
          {/* Main Testimonial Card */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-2xl p-8 lg:p-12 min-h-[400px] flex flex-col justify-between">
            {/* Quote Icon */}
            <div className="mb-6">
              <Quote className="w-12 h-12 text-amber-600 opacity-50" />
            </div>

            {/* Testimonial Content */}
            <div className="flex-1">
              <p className="text-lg lg:text-xl text-stone-700 leading-relaxed italic mb-8">
                "{currentTestimonial.quote}"
              </p>

              {/* Star Rating */}
              <div className="flex gap-1 mb-6 justify-center lg:justify-start">
                {[...Array(currentTestimonial.rating || 5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-6 h-6 fill-amber-500"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>

              {/* Author Info */}
              <div className="flex items-center gap-4">
                <img
                  src={currentTestimonial.image}
                  alt={currentTestimonial.name}
                  className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <div>
                  <h4 className="text-xl font-bold text-stone-800">
                    {currentTestimonial.name}
                  </h4>
                  <p className="text-amber-600 font-medium">
                    {currentTestimonial.role}
                  </p>
                  <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold ${
                    currentTestimonial.type === 'artisan' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {currentTestimonial.type === 'artisan' ? 'Artisan' : 'Collector'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-16 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-amber-600 hover:text-white transition-all group"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-16 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-amber-600 hover:text-white transition-all group"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Dots Navigation */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentSlide 
                    ? 'bg-amber-600 w-8' 
                    : 'bg-stone-300 hover:bg-stone-400'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Thumbnail Grid - Hidden on mobile, visible on lg */}
        <div className="hidden lg:grid grid-cols-6 gap-4 mt-12 max-w-4xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`relative rounded-lg overflow-hidden transition-all ${
                index === currentSlide 
                  ? 'ring-4 ring-amber-600 scale-110' 
                  : 'opacity-60 hover:opacity-100'
              }`}
            >
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-full h-auto aspect-square object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
