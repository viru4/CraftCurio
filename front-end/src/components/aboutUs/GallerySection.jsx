import React, { useState } from 'react';
import { X } from 'lucide-react';

/**
 * Gallery Section Component
 * Displays a grid of images showcasing products, events, and team
 * Features lightbox modal for full-size image viewing
 * Fully responsive masonry-style layout
 */
const GallerySection = ({ data }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  // Extract data with fallbacks
  const title = data?.title || "Our Gallery";
  const subtitle = data?.subtitle || "A visual journey through our world of craftsmanship";
  const galleryImages = data?.images || [
    {
      src: "/api/placeholder/600/400",
      alt: "Artisan crafting pottery",
      category: "Workshop",
      title: "Traditional Pottery Making"
    },
    {
      src: "/api/placeholder/400/600",
      alt: "Handwoven textiles",
      category: "Products",
      title: "Handwoven Textiles"
    },
    {
      src: "/api/placeholder/600/600",
      alt: "Team meeting",
      category: "Team",
      title: "Our Team in Action"
    },
    {
      src: "/api/placeholder/400/400",
      alt: "Wooden sculptures",
      category: "Products",
      title: "Hand-carved Sculptures"
    },
    {
      src: "/api/placeholder/600/400",
      alt: "Artisan market event",
      category: "Events",
      title: "Annual Artisan Fair"
    },
    {
      src: "/api/placeholder/400/600",
      alt: "Jewelry crafting",
      category: "Workshop",
      title: "Silver Jewelry Workshop"
    },
    {
      src: "/api/placeholder/600/400",
      alt: "Ceramic collectibles",
      category: "Products",
      title: "Ceramic Collectibles"
    },
    {
      src: "/api/placeholder/400/400",
      alt: "Community gathering",
      category: "Events",
      title: "Community Celebration"
    },
    {
      src: "/api/placeholder/600/600",
      alt: "Artisan showcase",
      category: "Workshop",
      title: "Artisan Showcase Day"
    }
  ];

  const categories = ["All", "Products", "Workshop", "Events", "Team"];
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredImages = activeCategory === "All" 
    ? galleryImages 
    : galleryImages.filter(img => img.category === activeCategory);

  const openLightbox = (image) => {
    setSelectedImage(image);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'unset';
  };

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-br from-stone-50 to-amber-50">
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

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                activeCategory === category
                  ? 'bg-amber-600 text-white shadow-lg scale-105'
                  : 'bg-white text-stone-700 hover:bg-stone-100 shadow'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Gallery Grid - Masonry style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {filteredImages.map((image, index) => (
            <div
              key={index}
              className={`group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer ${
                index % 5 === 0 ? 'sm:col-span-2 sm:row-span-2' : ''
              }`}
              onClick={() => openLightbox(image)}
            >
              {/* Image */}
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6">
                  <span className="inline-block px-3 py-1 bg-amber-600 text-white text-xs font-semibold rounded-full mb-2">
                    {image.category}
                  </span>
                  <h3 className="text-white text-lg lg:text-xl font-bold">
                    {image.title}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {selectedImage && (
          <div 
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
              aria-label="Close lightbox"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="w-full h-auto rounded-lg shadow-2xl"
              />
              <div className="mt-4 text-center">
                <span className="inline-block px-4 py-2 bg-amber-600 text-white text-sm font-semibold rounded-full mb-2">
                  {selectedImage.category}
                </span>
                <h3 className="text-white text-2xl font-bold">
                  {selectedImage.title}
                </h3>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default GallerySection;
