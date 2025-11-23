import React from 'react';
import { Linkedin, Mail } from 'lucide-react';

/**
 * Team Section Component
 * Displays team members with photos, names, roles, and bios
 * Responsive grid layout with hover effects
 * Now supports dynamic data from backend API
 */
const TeamSection = ({ data }) => {
  // Use dynamic data or fallback to defaults
  const title = data?.title || 'Meet the Team';
  const subtitle = data?.subtitle || 'Passionate individuals dedicated to connecting artisans with collectors worldwide';
  
  const teamMembers = data?.members || [
    {
      name: "Sarah Chen",
      role: "Founder & CEO",
      bio: "With 15 years in e-commerce and a passion for traditional crafts, Sarah founded CraftCurio to bridge the gap between artisans and global markets.",
      image: "/api/placeholder/300/300",
      linkedin: "#",
      email: "sarah@craftcurio.com"
    },
    {
      name: "Michael Rodriguez",
      role: "Co-Founder & CTO",
      bio: "Tech innovator with expertise in marketplace platforms. Michael ensures our technology serves both artisans and collectors seamlessly.",
      image: "/api/placeholder/300/300",
      linkedin: "#",
      email: "michael@craftcurio.com"
    },
    {
      name: "Priya Sharma",
      role: "Head of Artisan Relations",
      bio: "Cultural anthropologist turned community builder, Priya works directly with artisans to bring their stories and crafts to life.",
      image: "/api/placeholder/300/300",
      linkedin: "#",
      email: "priya@craftcurio.com"
    },
    {
      name: "James Wilson",
      role: "Head of Curation",
      bio: "Former museum curator with a keen eye for authenticity and quality. James ensures every item meets our high standards.",
      image: "/api/placeholder/300/300",
      linkedin: "#",
      email: "james@craftcurio.com"
    },
    {
      name: "Elena Popov",
      role: "Head of Design",
      bio: "Award-winning designer who brings the beauty of craftsmanship to digital life through intuitive and elegant user experiences.",
      image: "/api/placeholder/300/300",
      linkedin: "#",
      email: "elena@craftcurio.com"
    },
    {
      name: "Ahmed Hassan",
      role: "Community Manager",
      bio: "Social media expert passionate about building connections. Ahmed nurtures our growing community of collectors and artisans.",
      image: "/api/placeholder/300/300",
      linkedin: "#",
      email: "ahmed@craftcurio.com"
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

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {teamMembers.map((member, index) => (
            <div 
              key={index}
              className="group bg-gradient-to-br from-stone-50 to-amber-50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              {/* Image Container */}
              <div className="relative overflow-hidden h-64 sm:h-72 bg-stone-200">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4 flex gap-3 justify-center">
                    <a 
                      href={member.linkedin}
                      className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-amber-600 hover:text-white transition-colors"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                    <a 
                      href={`mailto:${member.email}`}
                      className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-amber-600 hover:text-white transition-colors"
                      aria-label="Email"
                    >
                      <Mail className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-stone-800 mb-1">{member.name}</h3>
                <p className="text-amber-600 font-semibold mb-3">{member.role}</p>
                <p className="text-stone-600 text-sm leading-relaxed">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
