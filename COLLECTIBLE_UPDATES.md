# Collectible Product Details - Enhanced Layout

## Overview
Updated the ProductDetails page to support a cleaner, more minimal design for collectibles while maintaining the full artisan layout for artisan products. This implementation uses conditional rendering based on product type.

## New Components Created

### 1. ProductBadges.jsx
- Displays status badges for collectibles
- **Badges include:**
  - ✅ Authenticity Verified (green badge)
  - 🏆 Mint/Excellent Condition (amber badge)
  - 🔖 Limited Edition (purple badge)
- Automatically detects and displays relevant badges based on product data

### 2. ShippingReturnsSection.jsx
- Shows shipping and return policy information
- **Includes:**
  - Delivery time estimates
  - Shipping cost information
  - 14-day return policy details

## Enhanced Components

### 1. ProductSpecifications.jsx
**New Features:**
- Added `isCollectible` prop for conditional layout
- **Collectible Layout:** Grid with dashed borders (2 columns)
- **Includes additional fields:**
  - Condition, Dimensions, Weight
  - Year, Provenance, Authenticity
  - Rarity, Materials, Manufacturer
  - Serial/Edition Number

### 2. ProductPriceCard.jsx
**New Features:**
- Added `isCollectible` prop
- **Quantity Selector** for collectibles (increment/decrement buttons)
- Hides "Buy Now" button for collectibles (only shows "Add to Cart")

### 3. ProductDetails.jsx
**Collectible-Specific Updates:**
- Category link displayed above title
- Product badges below title
- Description moved to separate section
- Specifications with grid layout
- Shipping & Returns section added
- Cleaner, more minimal styling

## Backend Model Updates

### Collectible.js Schema
**New Fields Added:**
```javascript
manufacturer: String          // Manufacturer name
serialNumber: String          // Serial number
editionNumber: String         // Edition number (e.g., #SN54-1887)

shippingInfo: {
  estimatedDeliveryDays: String,
  weight: Number,
  dimensions: { height, width, depth },
  freeShippingThreshold: Number
}

rating: {
  average: Number,
  count: Number
}

reviews: [{
  userName, userRating, reviewTitle, reviewText, reviewDate
}]
```

## Layout Differences

### Collectibles Layout
```
- Category Link
- Title
- "By Artisan Name" (optional)
- Status Badges (Verified, Condition, Limited Edition)
- Price + Stock Status
- Quantity Selector + Add to Cart + Wishlist
- Description Section
- Specifications (Grid with dashed borders)
- Shipping & Returns Section
- Customer Reviews
```

### Artisan Products Layout
```
- Category (Breadcrumb)
- Title
- Description (inline with title)
- Price + Stock Status
- Add to Cart + Buy Now + Wishlist
- Product Details (Vertical list)
- Artisan Profile Card
- Crafting Journey Section
- Cultural Impact & Legacy Section
- Product Story Section
- Reviews & Q&A Tabs
```

## Key Features

### Conditional Rendering
All changes use the `isCollectible` boolean (derived from URL type parameter) to determine layout:
```javascript
const isCollectible = type === 'collectible';
```

### No Duplication
- Same components serve both product types
- Props control behavior and appearance
- Maintains code maintainability

### Styling Consistency
- Uses existing Tailwind classes
- Matches design system colors
- Responsive on all screen sizes

## Usage

### For Collectibles
```
URL: /product/collectible/:id
Shows: Minimal clean layout with badges, quantity selector, shipping info
```

### For Artisan Products
```
URL: /product/artisan-product/:id
Shows: Full layout with crafting journey, cultural impact, artisan profile
```

## Testing Checklist

- [ ] Collectible badges display correctly
- [ ] Quantity selector works (increment/decrement)
- [ ] Specifications show in grid layout with dashed borders
- [ ] Shipping & Returns section displays
- [ ] No "Crafting Journey" or "Cultural Impact" sections for collectibles
- [ ] Artisan products still show full layout
- [ ] Mobile responsive on all layouts
- [ ] All links and buttons functional

## Files Modified

**Frontend:**
- `front-end/src/components/productDetailPage/ProductBadges.jsx` (NEW)
- `front-end/src/components/productDetailPage/ShippingReturnsSection.jsx` (NEW)
- `front-end/src/components/productDetailPage/ProductSpecifications.jsx` (UPDATED)
- `front-end/src/components/productDetailPage/ProductPriceCard.jsx` (UPDATED)
- `front-end/src/components/productDetailPage/ProductStorySection.jsx` (UPDATED)
- `front-end/src/components/productDetailPage/index.js` (UPDATED)
- `front-end/src/pages/ProductDetails.jsx` (UPDATED)

**Backend:**
- `backend/src/models/Collectible.js` (UPDATED)
