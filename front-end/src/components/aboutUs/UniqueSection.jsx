import React from 'react';
import { Shield, Handshake, Star, Zap, Globe2, Heart } from 'lucide-react';

/**
 * Unique Selling Points Section Component
 * Highlights what makes CraftCurio different from competitors
 * Features icon-based cards with key differentiators
 */
const UniqueSection = ({ data }) => {
  // Icon mapping for dynamic icon rendering
  const iconMap = {
    Shield,
    Handshake,
    Star,
    Zap,
    Globe2,
    Heart
  };

  // Extract data with fallbacks
  const title = data?.title || "Why Choose CraftCurio?";
  const subtitle = data?.subtitle || "We're not just another marketplace. Here's what sets us apart from the rest.";
  const uniqueFeatures = data?.features || [
    {
      icon: "Handshake",
      title: "Direct Artisan Connection",
      description: "Connect directly with artisans, learn their stories, and support their craft without intermediaries",
      gradient: "from-blue-500 to-blue-600"
    },
    {
      icon: "Shield",
      title: "Verified Authenticity",
      description: "Every item is carefully authenticated and comes with certification of origin and craftsmanship",
      gradient: "from-green-500 to-green-600"
    },
    {
      icon: "Star",
      title: "Curated Excellence",
      description: "Hand-picked selection of premium items by our expert curators ensuring exceptional quality",
      gradient: "from-purple-500 to-purple-600"
    },
    {
      icon: "Zap",
      title: "Secure Marketplace",
      description: "Advanced security, buyer protection, and seamless transactions for peace of mind",
      gradient: "from-orange-500 to-orange-600"
    },
    {
      icon: "Globe2",
      title: "Global Reach",
      description: "Access to artisans and collectors from over 30 countries, bringing the world to your doorstep",
      gradient: "from-cyan-500 to-cyan-600"
    },
    {
      icon: "Heart",
      title: "Community Driven",
      description: "Join a vibrant community of passionate collectors, artisans, and craft enthusiasts",
      gradient: "from-pink-500 to-pink-600"
    }
  ];

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

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {uniqueFeatures.map((feature, index) => {
            const IconComponent = iconMap[feature.icon] || Star;
            return (
            <div 
              key={index}
              className="group relative bg-gradient-to-br from-stone-50 to-amber-50 rounded-2xl p-6 lg:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
            >
              {/* Background decoration */}
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.gradient} opacity-5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500`}></div>
              
              {/* Content */}
              <div className="relative z-10">
                {/* Icon */}
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                
                {/* Title */}
                <h3 className="text-xl font-bold text-stone-800 mb-3">
                  {feature.title}
                </h3>
                
                {/* Description */}
                <p className="text-stone-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Hover indicator */}
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}></div>
            </div>
            );
          })}
        </div>

        {/* Bottom CTA Banner */}
        <div className="mt-16 bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl p-8 lg:p-12 text-center text-white shadow-2xl">
          <h3 className="text-2xl lg:text-3xl font-bold mb-4">
            Experience the Difference
          </h3>
          <p className="text-lg mb-6 opacity-95 max-w-2xl mx-auto">
            Join thousands of satisfied collectors and artisans who have discovered 
            the CraftCurio advantage. Start your journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/collectibles" 
              className="px-8 py-3 bg-white text-amber-600 rounded-full font-semibold hover:bg-stone-100 transition-all transform hover:scale-105 shadow-lg"
            >
              Browse Collectibles
            </a>
            <a 
              href="/become-seller" 
              className="px-8 py-3 border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-amber-600 transition-all"
            >
              Become a Seller
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UniqueSection;
