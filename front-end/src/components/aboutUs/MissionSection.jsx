import React from 'react';
import { Target, Eye, Compass, Award } from 'lucide-react';

/**
 * Mission and Values Section Component
 * Displays company mission, vision, and core values
 * Responsive cards with icons
 * Now supports dynamic data from backend API
 */
const MissionSection = ({ data }) => {
  // Icon mapping for dynamic icon rendering
  const iconMap = {
    Target,
    Eye,
    Compass,
    Award
  };

  // Use dynamic data or fallback to defaults
  const title = data?.title || 'Mission & Values';
  const missionStatement = data?.missionStatement || 'To build a thriving marketplace where every product tells a story, every artisan finds a voice, and every collector discovers meaningful treasures. We bridge the gap between traditional craftsmanship and modern commerce, ensuring that cultural heritage thrives in the digital age while providing fair opportunities for talented artisans worldwide.';
  const visionStatement = data?.visionStatement || 'To become the world\'s most trusted platform for authentic handcrafted items and collectibles, where cultural heritage meets innovation, and where every transaction strengthens the global community of artisans and collectors.';
  
  const values = data?.values || [
    {
      icon: "Target",
      title: "Authenticity",
      description: "Every product is verified and comes with its unique story and origin",
      color: "bg-blue-600"
    },
    {
      icon: "Eye",
      title: "Transparency",
      description: "Clear communication about materials, pricing, and artisan backgrounds",
      color: "bg-green-600"
    },
    {
      icon: "Compass",
      title: "Cultural Heritage",
      description: "Preserving and celebrating traditional craftsmanship techniques",
      color: "bg-purple-600"
    },
    {
      icon: "Award",
      title: "Quality Excellence",
      description: "Curated selection of premium handcrafted items and collectibles",
      color: "bg-orange-600"
    }
  ];

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-br from-stone-50 via-amber-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-800 mb-4">
            {title}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-600 to-orange-600 mx-auto rounded-full mb-6"></div>
          <p className="text-xl text-stone-600 max-w-3xl mx-auto">
            We're committed to creating a marketplace that values authenticity, 
            transparency, and cultural heritage above all else.
          </p>
        </div>

        {/* Mission Statement */}
        <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12 mb-12 lg:mb-16 border-l-4 border-amber-600">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-orange-600 rounded-full flex items-center justify-center">
                <Target className="w-8 h-8 text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-stone-800 mb-3">Our Mission</h3>
              <p className="text-lg text-stone-700 leading-relaxed">
                {missionStatement}
              </p>
            </div>
          </div>
        </div>

        {/* Core Values Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => {
            const IconComponent = iconMap[value.icon] || Target;
            return (
            <div 
              key={index}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 duration-300"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className={`w-14 h-14 ${value.color} rounded-lg flex items-center justify-center shadow-md`}>
                  <IconComponent className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-stone-800">{value.title}</h3>
                <p className="text-stone-600 text-sm leading-relaxed">{value.description}</p>
              </div>
            </div>
            );
          })}
        </div>

        {/* Vision Statement */}
        <div className="mt-12 lg:mt-16 bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl shadow-xl p-8 lg:p-12 text-white">
          <div className="text-center max-w-4xl mx-auto">
            <Eye className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-2xl lg:text-3xl font-bold mb-4">Our Vision</h3>
            <p className="text-lg leading-relaxed opacity-95">
              {visionStatement}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;
