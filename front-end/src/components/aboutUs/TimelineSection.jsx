import React from 'react';
import { Calendar, TrendingUp, Users, Award, Globe, Rocket } from 'lucide-react';

/**
 * Timeline Section Component
 * Displays company milestones and achievements in a timeline format
 * Responsive vertical timeline with alternating layout on desktop
 */
const TimelineSection = ({ data }) => {
  // Icon mapping for dynamic icon rendering
  const iconMap = {
    Calendar,
    TrendingUp,
    Users,
    Award,
    Globe,
    Rocket
  };

  // Extract data with fallbacks
  const title = data?.title || "Our Journey";
  const subtitle = data?.subtitle || "From humble beginnings to a thriving global marketplace";
  const milestones = data?.milestones || [
    {
      year: "2020",
      month: "January",
      title: "The Beginning",
      description: "CraftCurio was founded with a vision to connect artisans with global collectors",
      icon: "Rocket",
      stats: "2 founders, 1 dream"
    },
    {
      year: "2020",
      month: "June",
      title: "Platform Launch",
      description: "Officially launched our marketplace with 50 artisans and 500+ unique items",
      icon: "Globe",
      stats: "50 artisans onboarded"
    },
    {
      year: "2021",
      month: "March",
      title: "Community Growth",
      description: "Reached 10,000 registered users and expanded to 15 countries",
      icon: "Users",
      stats: "10K+ community members"
    },
    {
      year: "2022",
      month: "August",
      title: "Recognition",
      description: "Won 'Best Artisan Marketplace' award and featured in major publications",
      icon: "Award",
      stats: "Industry recognition"
    },
    {
      year: "2023",
      month: "May",
      title: "Major Milestone",
      description: "Supported over 500 artisans and facilitated ₹1M+ in sales",
      icon: "TrendingUp",
      stats: "₹1M+ in artisan earnings"
    },
    {
      year: "2024",
      month: "November",
      title: "Continued Growth",
      description: "Expanded to 30 countries with 1000+ artisans and 50K+ collectors",
      icon: "Calendar",
      stats: "1000+ active artisans"
    }
  ];

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-br from-amber-50 via-orange-50 to-stone-50">
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

        {/* Timeline */}
        <div className="relative">
          {/* Center line - hidden on mobile, visible on lg */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-600 via-orange-600 to-amber-600 transform -translate-x-1/2"></div>
          
          {/* Mobile line - visible only on mobile */}
          <div className="lg:hidden absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-600 via-orange-600 to-amber-600"></div>

          <div className="space-y-12 lg:space-y-16">
            {milestones.map((milestone, index) => {
              const IconComponent = iconMap[milestone.icon] || Calendar;
              return (
              <div 
                key={index}
                className={`relative flex flex-col lg:flex-row gap-6 lg:gap-12 items-start ${
                  index % 2 === 0 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                {/* Content Card */}
                <div className={`flex-1 ${index % 2 === 0 ? 'lg:text-right' : 'lg:text-left'} ml-20 lg:ml-0`}>
                  <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-lg hover:shadow-2xl transition-shadow">
                    <div className={`flex items-center gap-3 mb-3 ${index % 2 === 0 ? 'lg:flex-row-reverse lg:justify-end' : 'lg:justify-start'}`}>
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-stone-800">{milestone.title}</h3>
                        <p className="text-sm text-amber-600 font-semibold">{milestone.month} {milestone.year}</p>
                      </div>
                    </div>
                    <p className="text-stone-700 leading-relaxed mb-3">{milestone.description}</p>
                    <div className="inline-block bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-semibold">
                      {milestone.stats}
                    </div>
                  </div>
                </div>

                {/* Timeline Dot */}
                <div className="absolute left-8 lg:left-1/2 top-0 lg:transform lg:-translate-x-1/2 w-6 h-6 bg-white border-4 border-amber-600 rounded-full z-10 shadow-lg"></div>

                {/* Spacer for alternating layout on desktop */}
                <div className="hidden lg:block flex-1"></div>
              </div>
              );
            })}
          </div>
        </div>

        {/* Stats Summary */}
        <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="text-3xl lg:text-4xl font-bold text-amber-600 mb-2">1000+</div>
            <div className="text-stone-600 font-medium">Active Artisans</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="text-3xl lg:text-4xl font-bold text-amber-600 mb-2">50K+</div>
            <div className="text-stone-600 font-medium">Collectors</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="text-3xl lg:text-4xl font-bold text-amber-600 mb-2">30+</div>
            <div className="text-stone-600 font-medium">Countries</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="text-3xl lg:text-4xl font-bold text-amber-600 mb-2">100K+</div>
            <div className="text-stone-600 font-medium">Items Sold</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;
