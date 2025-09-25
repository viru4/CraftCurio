import React from 'react';
import CategoryCard from './CategoryCard';

/**
 * CategoryGrid Component
 * 
 * A grid layout component that displays multiple category cards
 * 
 * @param {Object} props
 * @param {Array} props.categories - Array of category objects
 * @param {string|null} props.selectedCategory - Currently selected category name
 * @param {function} props.onCategorySelect - Callback when a category is selected
 * @param {number} props.visibleCount - Number of categories to show (default: 4)
 * @param {string} props.className - Additional CSS classes (optional)
 */
const CategoryGrid = ({ 
  categories = [], 
  selectedCategory, 
  onCategorySelect, 
  visibleCount = 4, 
  className = "" 
}) => {
  const visibleCategories = categories.slice(0, visibleCount);

  if (!categories.length) {
    return (
      <div className="text-center py-8">
        <p className="text-stone-500">No categories available</p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 ${className}`}>
      {visibleCategories.map((category, index) => (
        <CategoryCard
          key={index}
          category={category}
          isSelected={selectedCategory === category.name}
          onClick={onCategorySelect}
        />
      ))}
    </div>
  );
};

export default CategoryGrid;