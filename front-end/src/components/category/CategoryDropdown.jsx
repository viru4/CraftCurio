import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { ChevronDown, Tag, Sparkles, X } from "lucide-react";

/**
 * CategoryDropdown Component
 * 
 * A modern Figma-style dropdown for selecting categories with icons and gradients
 * 
 * @param {Object} props
 * @param {function} props.onCategorySelect - Callback when a category is selected
 * @param {string} props.selectedValue - Currently selected category value
 * @param {function} props.onSelectionChange - Callback when selection changes (internal state)
 * @param {Array} props.categories - Array of enhanced category objects (optional, uses default if not provided)
 * @param {string} props.placeholder - Placeholder text (optional)
 * @param {string} props.className - Additional CSS classes (optional)
 */
const CategoryDropdown = ({ 
  onCategorySelect,
  selectedValue = "",
  onSelectionChange,
  categories,
  placeholder = "Choose a collectible category...",
  className = ""
}) => {
  const [internalSelectedValue, setInternalSelectedValue] = useState(selectedValue);

  // Default enhanced categories data with icons and colors
  const defaultEnhancedCategories = [
    { value: "trading-cards", label: "Trading Cards", icon: "🃏", color: "from-blue-500 to-purple-500" },
    { value: "comic-books", label: "Comic Books", icon: "📖", color: "from-red-500 to-orange-500" },
    { value: "action-figures", label: "Action Figures", icon: "🦸", color: "from-green-500 to-teal-500" },
    { value: "vintage-toys", label: "Vintage Toys", icon: "🧸", color: "from-pink-500 to-rose-500" },
    { value: "coins-currency", label: "Coins & Currency", icon: "🪙", color: "from-yellow-500 to-amber-500" },
    { value: "stamps", label: "Stamps", icon: "📮", color: "from-indigo-500 to-blue-500" },
    { value: "antiques", label: "Antiques", icon: "🏺", color: "from-amber-600 to-orange-600" },
    { value: "art-prints", label: "Art & Prints", icon: "🎨", color: "from-purple-500 to-pink-500" },
    { value: "memorabilia", label: "Sports Memorabilia", icon: "🏆", color: "from-orange-500 to-red-500" },
    { value: "model-trains", label: "Model Trains", icon: "🚂", color: "from-gray-600 to-gray-800" },
    { value: "die-cast-cars", label: "Die-Cast Cars", icon: "🚗", color: "from-red-600 to-red-800" },
    { value: "dolls-figurines", label: "Dolls & Figurines", icon: "🪆", color: "from-pink-400 to-purple-400" },
    { value: "vinyl-records", label: "Vinyl Records", icon: "💿", color: "from-slate-600 to-gray-700" },
    { value: "video-game-collectibles", label: "Gaming Collectibles", icon: "🎮", color: "from-cyan-500 to-blue-500" },
    { value: "movie-props", label: "Movie Props & Posters", icon: "🎬", color: "from-violet-500 to-purple-600" },
  ];

  const enhancedCategories = categories || defaultEnhancedCategories;
  const currentSelectedValue = selectedValue || internalSelectedValue;

  const handleCategorySelect = (categoryValue) => {
    const newValue = categoryValue;
    setInternalSelectedValue(newValue);
    
    // Call the external selection change handler if provided
    if (onSelectionChange) {
      onSelectionChange(newValue);
    }

    // Find the category data and call the category select callback
    const categoryData = enhancedCategories.find(cat => cat.value === categoryValue);
    if (categoryData && onCategorySelect) {
      onCategorySelect(categoryData.label);
    }
  };

  const clearSelection = () => {
    setInternalSelectedValue("");
    if (onSelectionChange) {
      onSelectionChange("");
    }
    if (onCategorySelect) {
      onCategorySelect(null);
    }
  };

  const selectedCategoryData = enhancedCategories.find(cat => cat.value === currentSelectedValue);

  return (
    <div className={`w-full ${className}`}>
      <div className="relative">
        <Select value={currentSelectedValue} onValueChange={handleCategorySelect}>
          <SelectTrigger className={`w-full h-14 px-4 text-left bg-gradient-to-r from-white to-amber-50/30 border-2 border-stone-200/50 rounded-xl hover:border-amber-300/50 hover:shadow-lg transition-all duration-300 group ${currentSelectedValue ? 'pr-20' : ''}`}>
            <div className="flex items-center gap-3 flex-1">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500/10">
                <Tag className="h-4 w-4 text-amber-600" />
              </div>
              <SelectValue placeholder={placeholder} />
            </div>
            <ChevronDown className="h-5 w-5 opacity-60 ml-auto flex-shrink-0 group-hover:opacity-100 transition-opacity" />
          </SelectTrigger>
          <SelectContent className="w-full max-h-80 overflow-y-auto border-2 border-stone-200/50 rounded-xl shadow-2xl bg-white/95 backdrop-blur-sm">
            <div className="p-2">
              {enhancedCategories.map((category) => (
                <SelectItem 
                  key={category.value} 
                  value={category.value}
                  className="cursor-pointer hover:bg-amber-50/80 focus:bg-amber-50/80 py-4 px-4 rounded-lg my-1 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center shadow-sm`}>
                      <span className="text-lg">{category.icon}</span>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium group-hover:text-amber-600 transition-colors">
                        {category.label}
                      </div>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </div>
          </SelectContent>
        </Select>
        
        {currentSelectedValue && (
          <button
            onClick={clearSelection}
            className="absolute right-12 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-lg hover:bg-red-50 transition-colors group/clear z-10"
          >
            <X className="h-4 w-4 text-stone-500 group-hover/clear:text-red-500 transition-colors" />
          </button>
        )}
      </div>
      
      {currentSelectedValue && selectedCategoryData && (
        <div className="mt-6 p-6 bg-gradient-to-br from-white via-amber-50/20 to-stone-50/50 border-2 border-stone-200/30 rounded-xl shadow-lg">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${selectedCategoryData.color} flex items-center justify-center shadow-lg`}>
              <span className="text-2xl">{selectedCategoryData.icon}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="h-4 w-4 text-amber-600" />
                <span className="text-sm text-stone-600">Exploring Collectibles</span>
              </div>
              <h3 className="text-xl font-semibold text-stone-800">
                {selectedCategoryData.label}
              </h3>
              <p className="text-sm text-stone-600 mt-1">
                Browse through our curated collection of {selectedCategoryData.label.toLowerCase()} from various eras and conditions.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryDropdown;