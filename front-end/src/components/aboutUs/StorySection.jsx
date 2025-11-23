import React from 'react';
import { Sparkles, Heart, Users } from 'lucide-react';

/**
 * Story Section Component
 * Tells the company's origin story and inspiration
 * Features icon highlights and engaging narrative
 * Now supports dynamic data from backend API
 */
const StorySection = ({ data }) => {
  // Use dynamic data or fallback to defaults
  const title = data?.title || 'Our Story';
  const paragraphs = data?.paragraphs || [
    'CraftCurio was born from a simple yet powerful vision: to create a bridge between the skilled hands of artisans and the discerning eyes of collectors worldwide.',
    'Inspired by traditional crafts and the stories behind each piece, our founders recognized the need for a platform that not only showcases beautiful handcrafted items but also celebrates the artisans who create them.',
    'What started as a passion project has grown into a thriving marketplace where authenticity meets accessibility. We empower artisans while giving collectors and buyers access to rare, meaningful, and culturally significant products.',
    'Every item in our marketplace carries a story—a story of craftsmanship, tradition, and the human touch that makes each piece unique.'
  ];
  const image = data?.image || '/api/placeholder/600/500';
  const highlights = data?.highlights || [
    {
      icon: 'Sparkles',
      title: "Inspiration",
      description: "Born from a passion for traditional crafts"
    },
    {
      icon: 'Heart',
      title: "Purpose",
      description: "Empowering artisans and preserving heritage"
    },
    {
      icon: 'Users',
      title: "Community",
      description: "Connecting creators with collectors"
    }
  ];
  
  const iconMap = { Sparkles, Heart, Users };

  return (
    <section id="our-story" className="py-8 sm:py-12 lg:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-800 mb-4">
            {title}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-600 to-orange-600 mx-auto rounded-full"></div>
        </div>

        {/* Story Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Text Content */}
          <div className="space-y-6">
            {paragraphs.map((paragraph, index) => (
              <p key={index} className="text-lg text-stone-700 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Image */}
          <div className="relative">
            <img 
              src={image} 
              alt="Artisan at work" 
              className="rounded-2xl shadow-xl w-full h-auto object-cover"
            />
            <div className="absolute -bottom-6 -right-6 w-full h-full bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl -z-10"></div>
          </div>
        </div>

        {/* Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {highlights.map((highlight, index) => {
            const IconComponent = iconMap[highlight.icon] || Sparkles;
            return (
            <div 
              key={index}
              className="bg-gradient-to-br from-stone-50 to-amber-50 p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center">
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-stone-800">{highlight.title}</h3>
                <p className="text-stone-600">{highlight.description}</p>
              </div>
            </div>
          );})}
        </div>
      </div>
    </section>
  );
};

export default StorySection;
