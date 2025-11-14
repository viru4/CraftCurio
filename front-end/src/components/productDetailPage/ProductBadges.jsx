import React from 'react';

/**
 * ProductBadges Component
 * Displays status badges for collectibles (authenticity, condition, rarity)
 * @param {Object} product - Product object
 */
const ProductBadges = ({ product }) => {
  if (!product) return null;

  const badges = [];

  // Authenticity badge
  if (product.authenticityCertificateUrl) {
    badges.push({
      icon: 'verified',
      label: 'Authenticity Verified',
      color: 'bg-green-50 text-green-700'
    });
  }

  // Condition badge
  if (product.specifications?.condition) {
    const condition = product.specifications.condition.toLowerCase();
    let conditionLabel = product.specifications.condition;
    let conditionColor = 'bg-blue-50 text-blue-700';
    
    if (condition === 'mint' || condition === 'excellent') {
      conditionLabel = `${product.specifications.condition} Condition`;
      conditionColor = 'bg-amber-50 text-amber-700';
    }
    
    badges.push({
      icon: 'workspace_premium',
      label: conditionLabel,
      color: conditionColor
    });
  }

  // Rarity/Limited Edition badge
  if (product.tags?.includes('limited-edition') || product.tags?.includes('rare')) {
    badges.push({
      icon: 'bookmark',
      label: 'Limited Edition',
      color: 'bg-purple-50 text-purple-700'
    });
  }

  if (badges.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 md:gap-3">
      {badges.map((badge, index) => (
        <div
          key={index}
          className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium ${badge.color}`}
        >
          <span className="material-symbols-outlined text-base">{badge.icon}</span>
          <span>{badge.label}</span>
        </div>
      ))}
    </div>
  );
};

export default ProductBadges;
