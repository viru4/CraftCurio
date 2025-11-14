import React from 'react';

/**
 * ProductSpecifications Component
 * Displays product details in a formatted list
 * @param {Object} product - Product object containing specifications
 * @param {boolean} isMobile - Whether to show mobile layout
 * @param {boolean} isCollectible - Whether this is a collectible (different layout)
 */
const ProductSpecifications = ({ product, isMobile = false, isCollectible = false }) => {
  if (!product) return null;

  // Collectible-specific specs (more detailed)
  const collectibleSpecs = [
    { label: 'Condition', value: product.specifications?.condition },
    { label: 'Dimensions', value: product.specifications?.dimensions ? `${product.specifications.dimensions.height}" x ${product.specifications.dimensions.width}" x ${product.specifications.dimensions.depth}"` : null },
    { label: 'Weight', value: product.shippingInfo?.weight ? `${product.shippingInfo.weight} lbs` : null },
    { label: 'Year', value: product.specifications?.yearMade },
    { label: 'Provenance', value: product.provenance },
    { label: 'Authenticity', value: product.authenticityCertificateUrl ? 'Verified w/ Certificate' : null },
    { label: 'Rarity', value: product.tags?.includes('limited-edition') ? 'Limited Edition' : null },
    { label: 'Materials', value: product.specifications?.material },
    { label: 'Manufacturer', value: product.manufacturer },
    { label: 'Serial/Edition No', value: product.serialNumber || product.editionNumber }
  ];

  // Standard artisan product specs
  const standardSpecs = [
    { label: 'Origin', value: product.provenance || product.specifications?.origin },
    { label: 'Material', value: product.specifications?.material },
    { label: isMobile ? 'Size' : 'Dimensions', 
      value: product.shippingInfo?.dimensions 
        ? isMobile
          ? `${product.shippingInfo.dimensions.height}"H x ${product.shippingInfo.dimensions.width}"W`
          : `${product.shippingInfo.dimensions.height}"H × ${product.shippingInfo.dimensions.width}"W × ${product.shippingInfo.dimensions.depth}"D`
        : product.specifications?.dimensions
        ? `${product.specifications.dimensions.height}${product.specifications.dimensions.unit || 'cm'} × ${product.specifications.dimensions.width}${product.specifications.dimensions.unit || 'cm'}` + 
          (product.specifications.dimensions.depth ? ` × ${product.specifications.dimensions.depth}${product.specifications.dimensions.unit || 'cm'}` : '')
        : null
    },
    { label: 'Condition', value: product.specifications?.condition },
    { label: 'Year Made', value: product.specifications?.yearMade },
    { label: isMobile ? 'Method' : 'Craft Method', value: product.craftMethod },
    { label: 'Authenticity',
      value: product.authenticityCertificateUrl ? (
        <a 
          href={product.authenticityCertificateUrl}
          className="font-medium text-orange-500 hover:text-orange-600 transition-colors underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          View Certificate
        </a>
      ) : null
    },
    { label: 'Delivery',
      value: product.shippingInfo?.estimatedDeliveryDays ? (
        <span className="text-green-600 font-semibold">
          {product.shippingInfo.estimatedDeliveryDays} days
        </span>
      ) : null
    }
  ];

  const specs = isCollectible ? collectibleSpecs : standardSpecs;
  const visibleSpecs = specs.filter(spec => spec.value);

  if (visibleSpecs.length === 0) return null;

  // Collectible layout - grid with dashed borders
  if (isCollectible && !isMobile) {
    return (
      <div className="flex flex-col gap-3">
        <h2 className="text-xl font-bold text-stone-800">Specifications</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-stone-700 text-sm">
          {visibleSpecs.map((spec, index) => (
            <li 
              key={index}
              className="flex justify-between border-b border-dashed border-stone-200 py-1.5"
            >
              <span>{spec.label}:</span>
              <span className="font-medium text-stone-900">{spec.value}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // Standard layout for artisan products or mobile
  return (
    <div className={isMobile ? 'border-t border-stone-200 pt-6' : 'border-t border-stone-200 pt-6'}>
      <h3 className="text-lg font-bold text-stone-900 mb-4">
        Product Details
      </h3>
      <div className={`space-y-3 text-sm ${isMobile ? '' : ''}`}>
        {visibleSpecs.map((spec, index) => (
          <div 
            key={index} 
            className={isMobile 
              ? 'flex justify-between border-b border-stone-100 pb-2 last:border-0'
              : 'flex flex-col gap-1'
            }
          >
            <span className="font-medium text-stone-600">{spec.label}{isMobile ? ':' : ''}</span>
            <span className="text-stone-900">{spec.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductSpecifications;
