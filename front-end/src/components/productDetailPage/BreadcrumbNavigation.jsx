import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * BreadcrumbNavigation Component
 * Shows navigation path: Home > Category > Product
 * @param {string} category - Product category
 * @param {string} productTitle - Product title
 */
const BreadcrumbNavigation = ({ category, productTitle }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-2 text-sm text-stone-500 mb-6 md:mb-8 overflow-x-auto">
      <button 
        onClick={() => navigate('/')} 
        className="hover:text-orange-500 whitespace-nowrap"
      >
        Home
      </button>
      <span className="material-symbols-outlined text-sm">chevron_right</span>
      <button 
        onClick={() => navigate('/categories')} 
        className="hover:text-orange-500 whitespace-nowrap"
      >
        {category}
      </button>
      <span className="material-symbols-outlined text-sm">chevron_right</span>
      <span className="text-stone-800 truncate">{productTitle}</span>
    </div>
  );
};

export default BreadcrumbNavigation;
