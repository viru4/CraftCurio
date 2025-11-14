# Unified Product Details Page - Usage Guide

## Overview

The `ProductDetails` page now supports **both Artisan Products and Collectibles** using a single unified component. This provides a consistent user experience while handling the unique attributes of each product type.

## URL Structure

### Artisan Products
```
/product/artisan-product/{productId}
```

### Collectibles
```
/product/collectible/{collectibleId}
```

## How to Navigate to Product Details

### From ProductCard Component

```jsx
import ProductCard from '@/components/product/ProductCard';

// For Artisan Products (default)
<ProductCard 
  item={artisanProduct} 
  productType="artisan-product" 
/>

// For Collectibles
<ProductCard 
  item={collectibleItem} 
  productType="collectible" 
/>
```

### Programmatic Navigation

```jsx
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();

// Navigate to artisan product
navigate(`/product/artisan-product/${productId}`);

// Navigate to collectible
navigate(`/product/collectible/${collectibleId}`);
```

## Data Structure

### Collectible Model (Updated)

The Collectible model now includes history and story fields:

```javascript
{
  title: String,
  description: String,
  price: String,
  category: String,
  image: String,
  images: [String],                    // Additional images
  
  // Historical Information
  history: String,                     // Historical background
  provenance: String,                  // Origin and ownership history
  productStory: {
    storyText: String,                // Detailed story
    storyMediaUrls: [String]          // Story media
  },
  
  // Specifications
  specifications: {
    material: String,
    dimensions: {
      height: Number,
      width: Number,
      depth: Number,
      unit: String                    // 'cm', 'inch', etc.
    },
    weight: Number,
    condition: String,                // 'Excellent', 'Good', 'Fair'
    yearMade: String,                 // '1950', '19th Century'
    origin: String                    // Geographic origin
  },
  
  availability: Boolean,
  authenticityCertificateUrl: String,
  tags: [String],
  
  // Engagement metrics
  views: Number,
  likes: Number,
  featured: Boolean,
  popular: Boolean,
  recent: Boolean
}
```

### Artisan Product Model (Existing)

```javascript
{
  id: String,
  title: String,
  description: String,
  category: String,
  images: [String],
  price: Number,
  currency: String,
  
  rating: {
    average: Number,
    count: Number
  },
  reviews: [ReviewObject],
  
  artisanInfo: {
    id: String,
    name: String,
    profilePhotoUrl: String,
    briefBio: String,
    verified: Boolean
  },
  
  craftMethod: String,
  provenance: String,
  craftingStory: String,
  productStory: {
    storyText: String,
    storyMediaUrls: [String]
  },
  
  authenticityCertificateUrl: String,
  availability: Boolean,
  shippingInfo: {...},
  tags: [String],
  views: Number,
  likes: Number
}
```

## Component Behavior

### Conditional Rendering

The `ProductDetails` page automatically adjusts based on product type:

#### For Artisan Products:
✅ Shows artisan profile card
✅ Shows customer reviews and ratings
✅ Shows crafting story with artisan legacy
✅ Shows Q&A tab

#### For Collectibles:
✅ Shows specifications (material, condition, year made)
✅ Shows history/provenance
✅ Shows product story section
✅ Hides artisan profile (not applicable)
✅ Hides reviews if none exist
✅ Displays vintage/collectible specific details

## API Endpoints

### Get Artisan Product
```
GET /api/artisan-products/:id
```

### Get Collectible
```
GET /api/collectibles/:id
```

### Like Product
```
PUT /api/artisan-products/:id/like
PUT /api/collectibles/:id/like
```

## Examples

### Example 1: Collectible with Full History

```javascript
{
  "_id": "64a5f8e9d3c2b1a4e5f6g7h8",
  "title": "Ming Dynasty Ceramic Vase",
  "description": "Authentic 15th century ceramic vase with traditional blue patterns",
  "price": "₹250000",
  "category": "Antique Ceramics",
  "image": "/images/ming-vase.jpg",
  "images": [
    "/images/ming-vase.jpg",
    "/images/ming-vase-2.jpg",
    "/images/ming-vase-detail.jpg"
  ],
  "history": "This exquisite vase dates back to the Ming Dynasty (1368-1644), representing the golden age of Chinese ceramics. Discovered in a private estate in Rajasthan, it has been authenticated by leading historians.",
  "provenance": "Beijing, China - Originally crafted in Imperial kilns",
  "productStory": {
    "storyText": "During the Ming Dynasty, ceramic arts reached unprecedented heights...",
    "storyMediaUrls": ["/images/history-1.jpg", "/images/history-2.jpg"]
  },
  "specifications": {
    "material": "Porcelain",
    "dimensions": {
      "height": 35,
      "width": 20,
      "unit": "cm"
    },
    "weight": 1.2,
    "condition": "Excellent",
    "yearMade": "15th Century",
    "origin": "Beijing, China"
  },
  "availability": true,
  "authenticityCertificateUrl": "/certificates/ming-vase-cert.pdf",
  "tags": ["antique", "ceramic", "ming-dynasty", "chinese-art"],
  "views": 1250,
  "likes": 89,
  "featured": true
}
```

Usage:
```jsx
// Navigate to this collectible
navigate('/product/collectible/64a5f8e9d3c2b1a4e5f6g7h8');
```

### Example 2: Artisan Product

```javascript
{
  "id": "art-pot-001",
  "title": "Handcrafted Terracotta Pot",
  "description": "Traditional pottery made using ancient techniques",
  "price": 2500,
  "currency": "INR",
  "artisanInfo": {
    "name": "Ramesh Kumar",
    "profilePhotoUrl": "/images/ramesh.jpg",
    "briefBio": "Master potter with 30 years experience",
    "verified": true
  },
  "reviews": [...],
  // ... other fields
}
```

Usage:
```jsx
// Navigate to this artisan product
navigate('/product/artisan-product/art-pot-001');
```

## Best Practices

### 1. Always Specify Product Type
```jsx
// Good ✅
<ProductCard item={item} productType="collectible" />

// Avoid (relies on default)
<ProductCard item={item} />
```

### 2. Handle Missing Data Gracefully
All components check for data existence:
```jsx
{product.artisanInfo && <ArtisanProfileCard artisanInfo={product.artisanInfo} />}
```

### 3. Use Consistent Naming
- Backend: Use MongoDB `_id` field
- Frontend: Can use either `id` or `_id` (ProductCard handles both)

### 4. Price Formatting
- Collectibles: Store as string with currency symbol (e.g., "₹250000")
- Artisan Products: Store as number with separate currency field

## Component Reusability

All extracted components work with both product types:

| Component | Artisan Product | Collectible |
|-----------|----------------|-------------|
| BreadcrumbNavigation | ✅ | ✅ |
| ProductImageGallery | ✅ | ✅ |
| ProductPriceCard | ✅ | ✅ |
| ProductSpecifications | ✅ | ✅ (enhanced) |
| ProductStorySection | ✅ | ✅ (enhanced) |
| ArtisanProfileCard | ✅ | ❌ (hidden) |
| ReviewsList | ✅ | ❌ (hidden if no reviews) |
| TabNavigation | ✅ | ❌ (hidden if no reviews) |
| StarRating | ✅ | ✅ (if ratings exist) |

## Migration Guide

If you have existing links to products:

### Old Format
```jsx
/product/{productId}
```

### New Format
```jsx
/product/artisan-product/{productId}
/product/collectible/{collectibleId}
```

### Update Your Code
```jsx
// Before
<Link to={`/product/${product.id}`}>View Details</Link>

// After
<Link to={`/product/artisan-product/${product.id}`}>View Details</Link>
<Link to={`/product/collectible/${collectible._id}`}>View Details</Link>
```

## Troubleshooting

### Issue: Product not loading
- Check the URL format includes product type
- Verify the ID is correct
- Check browser console for API errors

### Issue: Missing story/history section
- Ensure collectible has `history` or `productStory.storyText` field
- Check backend model includes the new fields

### Issue: Images not displaying
- Ensure `images` array is populated
- Fallback to single `image` field if array is empty

## Future Enhancements

Potential additions:
- [ ] Add reviews support for collectibles
- [ ] Add comparison feature between products
- [ ] Add 3D view for collectibles
- [ ] Add authentication history tracking for collectibles
- [ ] Add auction/bidding system for rare collectibles
