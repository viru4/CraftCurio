import React from 'react';

// Import background images
import pottery1 from '@/assets/pottery1.avif';
import stoneWork from '@/assets/StoneWork.avif';
import ceramicDishes from '@/assets/corousel images/ceramicDishes.jpg';
import handcraftedGoods from '@/assets/corousel images/handcraftedGoods.jpg';
import pottery from '@/assets/corousel images/pottery.jpg';
import traditionalBowls from '@/assets/corousel images/traditionalBowls.jpg';
import woodworking from '@/assets/corousel images/woodworking.jpg';

/**
 * CategoryCard Component
 * 
 * A reusable card component for displaying individual categories with background images
 */
const CategoryCard = ({ category, isSelected, onClick, className = "" }) => {
  // Category background image mapping - now handles database categories
  const getCategoryBackgroundImage = (categoryName) => {
    const imageMap = {
      // Collectible categories
      "Coins": ceramicDishes,
      "Stamps": handcraftedGoods,
      "Vintage Banknotes": pottery,
      "Sports Memorabilia": traditionalBowls,
      "Comic Books": woodworking,
      "Movie Posters": pottery1,
      "Antique Cameras": stoneWork,
      "Autographs": ceramicDishes,
      "Porcelain and Glassware": handcraftedGoods,
      "Vintage Toys": pottery,
      "Militaria": traditionalBowls,
      "Old Maps and Atlases": woodworking,
      "Vintage Fashion": pottery1,
      "Music Records and Memorabilia": stoneWork,
      "Scientific Instruments": ceramicDishes,
      "Art Deco Objects": handcraftedGoods,
      "Ephemera": pottery,
      "Film Props and Collectibles": traditionalBowls,
      "Classic Car Spare Parts": woodworking,
      "Trading Cards": pottery1,
      "Photos and Photographs": stoneWork,
      "Book First Editions": ceramicDishes,
      "Ethnic Artifacts": handcraftedGoods,
      "Watches and Timepieces": pottery,
      "Jewelry": traditionalBowls,
      
      // Legacy static categories (fallback)
      "Coins, Currency, and Stamps": ceramicDishes,
      "Books and Periodicals": handcraftedGoods,
      "Action Figures and Toys": pottery,
      "Pop Culture Memorabilia": traditionalBowls,
      "Mid-Century Modern": pottery1,
      "Music Collectibles": pottery,
      "Antiques and Vintage Items": traditionalBowls,
      "Digital Collectibles": woodworking,
    };
    return imageMap[categoryName] || pottery1; // Default fallback image
  };

  const handleClick = () => {
    if (onClick) {
      onClick(category.name);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`group cursor-pointer rounded-xl border-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 relative overflow-hidden ${
        isSelected
          ? 'border-amber-500 shadow-lg'
          : 'border-stone-200 hover:border-amber-300'
      } ${className}`}
      style={{
        backgroundImage: `url(${getCategoryBackgroundImage(category.name)})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Background overlay */}
      <div className={`absolute inset-0 transition-all duration-300 ${
        isSelected
          ? 'bg-amber-900/40'
          : 'bg-black/50 group-hover:bg-black/40'
      }`}></div>
      
      {/* Content */}
      <div className="relative z-10 p-6">
        <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 mb-4 group-hover:scale-110 transition-transform shadow-lg">
          <span className="text-white text-xl font-bold">
            {category.name.charAt(0)}
          </span>
        </div>
        <h3 className={`text-lg font-semibold mb-2 transition-colors ${
          isSelected ? 'text-amber-100' : 'text-white group-hover:text-amber-200'
        }`}>
          {category.name}
        </h3>
        <p className="text-sm text-stone-200 leading-relaxed">
          {category.description}
        </p>
        <div className="mt-4 flex items-center text-amber-300 font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity">
          <span>Explore Collection</span>
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;