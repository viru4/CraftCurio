import React from 'react';
import StarRating from './StarRating';
import { formatDate } from '../../lib/date';

/**
 * ReviewCard Component
 * Displays individual product review with user info, rating, and actions
 * @param {Object} review - Review object with user, rating, comment, date
 */
const ReviewCard = ({ review }) => {
  return (
    <div className="py-6 lg:py-8">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-stone-200 rounded-full flex-shrink-0 overflow-hidden">
          <img
            src={review.user?.profilePhotoUrl || '/placeholder-avatar.svg'}
            alt={review.user?.name || 'User'}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = '/placeholder-avatar.svg';
            }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2">
            <div>
              <p className="text-base font-medium text-stone-900">
                {review.user?.name || 'Anonymous User'}
              </p>
              <div className="mt-1">
                <StarRating rating={review.rating} size="text-base" />
              </div>
            </div>
            <p className="text-sm text-stone-500">
              {formatDate(review.date)}
            </p>
          </div>
          <p className="text-stone-600 mt-3 text-sm lg:text-base">
            {review.comment || 'No comment provided.'}
          </p>
          <div className="flex gap-4 text-stone-500 mt-3">
            <button className="flex items-center gap-1.5 text-sm hover:text-stone-700 transition-colors">
              <span className="material-symbols-outlined text-lg">thumb_up</span>
              <span>{Math.floor(Math.random() * 20)}</span>
            </button>
            <button className="flex items-center gap-1.5 text-sm hover:text-stone-700 transition-colors">
              <span className="material-symbols-outlined text-lg">thumb_down</span>
              <span>{Math.floor(Math.random() * 5)}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
