import mongoose from 'mongoose';

const collectibleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 }, // Changed to Number for proper numeric sorting/calculations
  category: { type: String, required: true, index: true }, // Indexed for query performance
  image: { type: String, required: true },
  images: [{ type: String }], // Additional images array

  featured: { type: Boolean, default: false, index: true },
  popular: { type: Boolean, default: false, index: true },
  recent: { type: Boolean, default: false },

  targetSection: { type: String, default: 'filtered-items-section' },
  buttonText: { type: String, default: 'Explore Collection' },

  views: { type: Number, default: 0, min: 0 },
  likes: { type: Number, default: 0, min: 0 },

  // Historical and story information
  history: { type: String },
  provenance: { type: String },
  
  productStory: {
    storyText: { type: String },
    storyMediaUrls: [{ type: String }]
  },

  // Additional details
  specifications: {
    material: String,
    dimensions: {
      height: { type: Number, min: 0 },
      width: { type: Number, min: 0 },
      depth: { type: Number, min: 0 },
      unit: { type: String, default: 'cm' }
    },
    weight: { type: Number, min: 0 },
    condition: String,
    yearMade: String,
    origin: String
  },

  // Collectible-specific details
  manufacturer: { type: String },
  serialNumber: { type: String },
  editionNumber: { type: String },

  // Shipping information
  shippingInfo: {
    estimatedDeliveryDays: { type: String, default: '5-7' },
    weight: { type: Number, min: 0 },
    dimensions: {
      height: { type: Number, min: 0 },
      width: { type: Number, min: 0 },
      depth: { type: Number, min: 0 },
      unit: { type: String, default: 'cm' }  // Made explicit unit here for shipping dimensions
    },
    freeShippingThreshold: { type: Number, default: 500, min: 0 }
  },

  // Rating and reviews
  rating: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0, min: 0 }
  },

  reviews: [{
    userName: String,
    userRating: { type: Number, min: 0, max: 5 },
    reviewTitle: String,
    reviewText: String,
    reviewDate: { type: Date, default: Date.now }
  }],

  availability: { type: Boolean, default: true },
  authenticityCertificateUrl: { type: String },

  tags: [{ type: String, index: true }] // Index tags for efficient search
}, { timestamps: true });

// Suggested indexes for better query performance
// collectibleSchema.index({ category: 1 });
// collectibleSchema.index({ tags: 1 });
// collectibleSchema.index({ featured: 1, popular: 1 });

export default mongoose.model('Collectible', collectibleSchema);
