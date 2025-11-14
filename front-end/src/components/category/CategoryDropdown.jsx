import React, { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown, Tag, Sparkles, X, Loader2 } from "lucide-react";
import API_BASE_URL from "@/config/api";

// Category icons mapping - moved outside component to avoid dependency issues
const categoryIcons = {
  "Coins": "🪙",
  "Stamps": "📮", 
  "Vintage Banknotes": "💵",
  "Sports Memorabilia": "🏆",
  "Comic Books": "📖",
  "Movie Posters": "🎬",
  "Antique Cameras": "📷",
  "Autographs": "✍️",
  "Porcelain and Glassware": "🏺",
  "Vintage Toys": "🧸",
  "Militaria": "🎖️",
  "Old Maps and Atlases": "🗺️",
  "Vintage Fashion": "👗",
  "Music Records and Memorabilia": "💿",
  "Scientific Instruments": "🔬",
  "Art Deco Objects": "🎨",
  "Ephemera": "📄",
  "Film Props and Collectibles": "🎭",
  "Classic Car Spare Parts": "🚗",
  "Trading Cards": "🃏",
  "Photos and Photographs": "📸",
  "Book First Editions": "📚",
  "Ethnic Artifacts": "🏛️",
  "Watches and Timepieces": "⌚",
  "Jewelry": "💎"
};

// Color gradients for categories - moved outside component to avoid dependency issues
const categoryColors = [
  "from-blue-500 to-purple-500",
  "from-red-500 to-orange-500", 
  "from-green-500 to-teal-500",
  "from-pink-500 to-rose-500",
  "from-yellow-500 to-amber-500",
  "from-indigo-500 to-blue-500",
  "from-amber-600 to-orange-600",
  "from-purple-500 to-pink-500",
  "from-orange-500 to-red-500",
  "from-gray-600 to-gray-800",
  "from-cyan-500 to-blue-500",
  "from-violet-500 to-purple-600"
];

/**
 * CategoryDropdown Component
 * 
 * A modern Figma-style dropdown for selecting collectible categories with icons and gradients
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
  const [collectibleCategories, setCollectibleCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch collectible categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      if (categories) {
        // Use provided categories
        const enhancedCategories = categories.map((cat, index) => ({
          value: cat.name.toLowerCase().replace(/\s+/g, '-'),
          label: cat.name,
          description: cat.description,
          icon: categoryIcons[cat.name] || "📦",
          color: categoryColors[index % categoryColors.length]
        }));
        setCollectibleCategories(enhancedCategories);
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching categories from API...'); // Debug log
        const response = await fetch(`${API_BASE_URL}/api/categories?type=collectible`);
        console.log('Response status:', response.status); // Debug log
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('API response:', data); // Debug log
        
        if (data.data && Array.isArray(data.data)) {
          const enhancedCategories = data.data.map((cat, index) => ({
            value: cat.name.toLowerCase().replace(/\s+/g, '-'),
            label: cat.name,
            description: cat.description,
            icon: categoryIcons[cat.name] || "📦",
            color: categoryColors[index % categoryColors.length]
          }));
          console.log('Enhanced categories:', enhancedCategories); // Debug log
          setCollectibleCategories(enhancedCategories);
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err);
        setError(`Failed to load categories: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [categories]);

  const currentSelectedValue = selectedValue || internalSelectedValue;

  const handleCategorySelect = (categoryValue) => {
    setInternalSelectedValue(categoryValue);
    
    if (onSelectionChange) {
      onSelectionChange(categoryValue);
    }

    const categoryData = collectibleCategories.find(cat => cat.value === categoryValue);
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

  const selectedCategoryData = collectibleCategories.find(cat => cat.value === currentSelectedValue);

  if (loading) {
    return (
      <div className={`w-full ${className}`}>
        <div className="flex items-center justify-center h-14 bg-gradient-to-r from-white to-amber-50/30 border-2 border-stone-200/50 rounded-xl">
          <Loader2 className="h-5 w-5 animate-spin text-amber-600" />
          <span className="ml-2 text-stone-600">Loading categories...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`w-full ${className}`}>
        <div className="flex items-center justify-center h-14 bg-red-50 border-2 border-red-200 rounded-xl">
          <span className="text-red-600">{error}</span>
        </div>
      </div>
    );
  }

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
              {collectibleCategories.map((category) => (
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
                      {category.description && (
                        <div className="text-xs text-stone-500 mt-1 truncate">
                          {category.description}
                        </div>
                      )}
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
                {selectedCategoryData.description || `Browse through our curated collection of ${selectedCategoryData.label.toLowerCase()} from various eras and conditions.`}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryDropdown;