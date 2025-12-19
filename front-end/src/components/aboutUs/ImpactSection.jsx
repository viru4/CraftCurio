import React from 'react';
import { Users, DollarSign, Sparkles, TreePine, GraduationCap, Building2 } from 'lucide-react';

/**
 * Community Impact Section Component
 * Showcases social impact, community contributions, and partnerships
 * Features statistics and impact stories
 */
const ImpactSection = ({ data }) => {
  // Icon mapping for dynamic icon rendering
  const iconMap = {
    Users,
    DollarSign,
    Sparkles,
    TreePine,
    GraduationCap,
    Building2
  };

  // Extract data with fallbacks
  const title = data?.title || "Our Impact";
  const subtitle = data?.subtitle || "Creating positive change for artisans, communities, and our planet";
  const impactStats = data?.statistics || [
    {
      icon: "Users",
      value: "1000+",
      label: "Artisans Empowered",
      description: "Supporting livelihoods across 30 countries"
    },
    {
      icon: "DollarSign",
      value: "₹2M+",
      label: "Artisan Earnings",
      description: "Direct income to skilled craftspeople"
    },
    {
      icon: "Sparkles",
      value: "500+",
      label: "Traditional Crafts",
      description: "Preserving cultural heritage techniques"
    },
    {
      icon: "TreePine",
      value: "100K+",
      label: "Trees Planted",
      description: "Environmental sustainability initiative"
    }
  ];

  const initiatives = data?.initiatives || [
    {
      icon: "GraduationCap",
      title: "Artisan Training Program",
      description: "Free workshops on digital marketing, photography, and e-commerce to help artisans grow their online presence and reach new customers worldwide.",
      image: "/api/placeholder/400/300"
    },
    {
      icon: "Building2",
      title: "Community Partnerships",
      description: "Collaborating with NGOs and cultural organizations to identify talented artisans in remote areas and bring their work to global markets.",
      image: "/api/placeholder/400/300"
    }
  ];

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-br from-stone-50 via-stone-100 to-amber-50">
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

        {/* Impact Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {impactStats.map((stat, index) => {
            const IconComponent = iconMap[stat.icon] || Users;
            return (
            <div 
              key={index}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow text-center group"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-600 to-orange-600 rounded-full mb-4 group-hover:scale-110 transition-transform">
                <IconComponent className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl lg:text-4xl font-bold text-stone-800 mb-2">
                {stat.value}
              </div>
              <div className="text-lg font-semibold text-stone-700 mb-1">
                {stat.label}
              </div>
              <div className="text-sm text-stone-600">
                {stat.description}
              </div>
            </div>
            );
          })}
        </div>

        {/* Initiatives Section */}
        <div className="mb-16">
          <h3 className="text-2xl lg:text-3xl font-bold text-stone-800 text-center mb-10">
            Our Initiatives
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {initiatives.map((initiative, index) => {
              const IconComponent = iconMap[initiative.icon] || GraduationCap;
              return (
              <div 
                key={index}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group"
              >
                <div className="relative h-48 overflow-hidden bg-stone-200">
                  <img 
                    src={initiative.image} 
                    alt={initiative.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-orange-600 rounded-lg flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="text-xl font-bold text-stone-800">
                      {initiative.title}
                    </h4>
                  </div>
                  <p className="text-stone-600 leading-relaxed">
                    {initiative.description}
                  </p>
                </div>
              </div>
              );
            })}
          </div>
        </div>

        {/* Real Stories Section */}
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl p-8 lg:p-12 text-white">
          <h3 className="text-2xl lg:text-3xl font-bold text-center mb-8">
            Real Stories, Real Impact
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <p className="text-lg italic mb-4 leading-relaxed">
                "CraftCurio transformed my small pottery business. I now sell to customers worldwide and can support my family."
              </p>
              <p className="font-semibold">- Maria, Ceramic Artist, Mexico</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <p className="text-lg italic mb-4 leading-relaxed">
                "The training program taught me how to showcase my work online. My income has tripled in just one year."
              </p>
              <p className="font-semibold">- Rajesh, Textile Weaver, India</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <p className="text-lg italic mb-4 leading-relaxed">
                "Thanks to CraftCurio, our traditional basket weaving techniques are being preserved for future generations."
              </p>
              <p className="font-semibold">- Amara, Basket Weaver, Kenya</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactSection;
