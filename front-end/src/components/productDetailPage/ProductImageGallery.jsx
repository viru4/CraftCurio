import React from 'react';

/**
 * ProductImageGallery Component
 * Displays main product image with thumbnail navigation
 * @param {Array} images - Array of image URLs
 * @param {string} title - Product title for alt text
 * @param {number} selectedImageIndex - Currently selected image index
 * @param {Function} onImageSelect - Callback when thumbnail is clicked
 */
const ProductImageGallery = ({ 
  images = [], 
  title = 'Product', 
  selectedImageIndex = 0, 
  onImageSelect 
}) => {
  const mainImage = images[selectedImageIndex] || images[0] || '/placeholder-image.jpg';

  return (
    <div className="lg:col-span-2 flex flex-col gap-4">
      {/* Main Image */}
      <div className="w-full aspect-square bg-stone-200 rounded-lg shadow-sm overflow-hidden">
        <img
          src={mainImage}
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = '/placeholder-image.svg';
          }}
        />
      </div>
      
      {/* Thumbnail Images */}
      {images && images.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {images.slice(0, 4).map((image, index) => (
            <button
              key={index}
              onClick={() => onImageSelect(index)}
              className={`w-full aspect-square bg-stone-200 rounded-md overflow-hidden transition-all ${
                selectedImageIndex === index 
                  ? 'border-2 border-orange-500 opacity-100' 
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={image}
                alt={`${title} ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = '/placeholder-image.svg';
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
