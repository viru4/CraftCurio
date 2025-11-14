import React from 'react';

/**
 * StarRating Component
 * Renders star rating with full, half, and empty stars
 * @param {number} rating - Rating value (0-5)
 * @param {string} size - Icon size class (default: 'text-lg')
 */
const StarRating = ({ rating = 0, size = 'text-lg' }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  // Full stars
  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <span key={`full-${i}`} className={`material-symbols-outlined ${size} text-yellow-500`}>
        star
      </span>
    );
  }
  
  // Half star
  if (hasHalfStar) {
    stars.push(
      <span key="half" className={`material-symbols-outlined ${size} text-yellow-500`}>
        star_half
      </span>
    );
  }
  
  // Empty stars
  const emptyStars = 5 - Math.ceil(rating);
  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <span key={`empty-${i}`} className={`material-symbols-outlined ${size} text-stone-300`}>
        star
      </span>
    );
  }
  
  return <div className="flex items-center gap-0.5">{stars}</div>;
};

export default StarRating;
