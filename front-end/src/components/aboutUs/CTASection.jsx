import React from 'react';
import { ShoppingBag, UserPlus, Mail, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';

/**
 * Call to Action Section Component
 * Encourages users to take action with multiple CTAs
 * Includes social media links and contact information
 */
const CTASection = ({ data }) => {
  // Extract data with fallbacks
  const title = data?.title || "Join Our Community";
  const subtitle = data?.subtitle || "Whether you're an artisan, collector, or enthusiast, there's a place for you";
  const email = data?.email || "contact@craftcurio.com";
  const phone = data?.phone || "+1 (555) 123-4567";
  const address = data?.address || "123 Artisan Street, Creative District, City, Country";
  
  const primaryActions = [
    {
      icon: ShoppingBag,
      title: "Start Shopping",
      description: "Browse our curated collection of handcrafted items and collectibles",
      buttonText: "Explore Marketplace",
      buttonLink: "/collectibles",
      gradient: "from-amber-600 to-orange-600"
    },
    {
      icon: UserPlus,
      title: "Become a Seller",
      description: "Join our community of artisans and reach customers worldwide",
      buttonText: "Join as Artisan",
      buttonLink: "/become-seller",
      gradient: "from-green-600 to-emerald-600"
    },
    {
      icon: Mail,
      title: "Get in Touch",
      description: "Have questions? Our team is here to help you",
      buttonText: "Contact Us",
      buttonLink: "#contact",
      gradient: "from-blue-600 to-cyan-600"
    }
  ];

  const socialLinks = [
    { icon: Facebook, name: "Facebook", url: data?.socialLinks?.facebook || "#", color: "hover:bg-blue-600" },
    { icon: Instagram, name: "Instagram", url: data?.socialLinks?.instagram || "#", color: "hover:bg-pink-600" },
    { icon: Twitter, name: "Twitter", url: data?.socialLinks?.twitter || "#", color: "hover:bg-sky-600" },
    { icon: Linkedin, name: "LinkedIn", url: data?.socialLinks?.linkedin || "#", color: "hover:bg-blue-700" }
  ];

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main CTA Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-800 mb-4">
            {title}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-600 to-orange-600 mx-auto rounded-full mb-6"></div>
          <p className="text-xl text-stone-600 max-w-3xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Action Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {primaryActions.map((action, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-stone-50 to-amber-50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2"
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${action.gradient} rounded-xl flex items-center justify-center mb-6 shadow-lg`}>
                <action.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-stone-800 mb-3">
                {action.title}
              </h3>
              <p className="text-stone-600 mb-6 leading-relaxed">
                {action.description}
              </p>
              <a
                href={action.buttonLink}
                className={`inline-block w-full text-center px-6 py-3 bg-gradient-to-r ${action.gradient} text-white rounded-full font-semibold hover:shadow-xl transition-all transform hover:scale-105`}
              >
                {action.buttonText}
              </a>
            </div>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl p-8 lg:p-12 text-center text-white shadow-2xl mb-12">
          <h3 className="text-2xl lg:text-3xl font-bold mb-4">
            Stay Updated
          </h3>
          <p className="text-lg mb-6 opacity-95 max-w-2xl mx-auto">
            Subscribe to our newsletter for exclusive offers, artisan stories, and new arrivals
          </p>
          <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 rounded-full text-stone-800 focus:outline-none focus:ring-4 focus:ring-white/30"
              required
            />
            <button
              type="submit"
              className="px-8 py-3 bg-white text-amber-600 rounded-full font-semibold hover:bg-stone-100 transition-all whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* Contact Information */}
        <div id="contact" className="bg-stone-50 rounded-2xl p-8 lg:p-12 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <h4 className="text-lg font-bold text-stone-800 mb-2">Email Us</h4>
              <a href={`mailto:${email}`} className="text-amber-600 hover:text-amber-700">
                {email}
              </a>
            </div>
            <div>
              <h4 className="text-lg font-bold text-stone-800 mb-2">Call Us</h4>
              <a href={`tel:${phone.replace(/\s/g, '')}`} className="text-amber-600 hover:text-amber-700">
                {phone}
              </a>
            </div>
            <div>
              <h4 className="text-lg font-bold text-stone-800 mb-2">Visit Us</h4>
              <p className="text-stone-600">
                {address}
              </p>
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-stone-800 mb-6">
            Follow Our Journey
          </h3>
          <div className="flex justify-center gap-4">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.url}
                className={`w-12 h-12 bg-stone-200 rounded-full flex items-center justify-center text-stone-700 ${social.color} hover:text-white transition-all transform hover:scale-110 shadow-lg`}
                aria-label={social.name}
                target="_blank"
                rel="noopener noreferrer"
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
