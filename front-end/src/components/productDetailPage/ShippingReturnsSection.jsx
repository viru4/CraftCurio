import React from 'react';

/**
 * ShippingReturnsSection Component
 * Displays shipping and return policy information
 * @param {Object} shippingInfo - Shipping information object
 */
const ShippingReturnsSection = ({ shippingInfo }) => {
  const deliveryTime = shippingInfo?.estimatedDeliveryDays || '5-7';
  const freeShippingThreshold = shippingInfo?.freeShippingThreshold || 500;

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-xl font-bold text-stone-800">Shipping & Returns</h2>
      <div className="text-stone-700 text-sm leading-relaxed space-y-2">
        <p>
          <span className="font-medium text-stone-900">Delivery Time:</span> Ships within 2-3 business days. 
          Estimated delivery is {deliveryTime} days via insured carrier.
        </p>
        <p>
          <span className="font-medium text-stone-900">Shipping Costs:</span> Calculated at checkout based on your location. 
          Free shipping on orders over ₹{freeShippingThreshold.toLocaleString()}.
        </p>
        <p>
          <span className="font-medium text-stone-900">Return Policy:</span> We offer a 14-day return policy for a full refund. 
          The item must be returned in its original, undamaged condition. Please contact customer service to initiate a return.
        </p>
      </div>
    </div>
  );
};

export default ShippingReturnsSection;
