import React from 'react';
import ReviewCard from './ReviewCard';

/**
 * ReviewsList Component
 * Container for displaying all product reviews
 * @param {Array} reviews - Array of review objects
 */
const ReviewsList = ({ reviews = [] }) => {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-stone-500">No reviews yet. Be the first to review this product!</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-stone-200 mt-8">
      {reviews.map((review, index) => (
        <ReviewCard key={index} review={review} />
      ))}
    </div>
  );
};

export default ReviewsList;
