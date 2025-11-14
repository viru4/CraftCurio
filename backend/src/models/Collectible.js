import mongoose from 'mongoose';

const collectibleSchema = new mongoose.Schema({
  id: { type: String, unique: true, sparse: true },  // Custom ID like "coll1", "coll2" (optional for backward compatibility)
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  images: [{ type: String }],                              // Array of additional images
  featured: { type: Boolean, default: false },
  popular: { type: Boolean, default: false },
  recent: { type: Boolean, default: false },
  targetSection: { type: String, default: 'filtered-items-section' },
  buttonText: { type: String, default: 'Explore Collection' },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  
  // Historical and story information
  history: { type: String },                               // Historical background of the collectible
  provenance: { type: String },                            // Origin and ownership history
  productStory: {                                          // Product story object
    storyText: { type: String },                          // Detailed product story text
    storyMediaUrls: [{ type: String }]                    // Array of media URLs (images/videos)
  },
  
  // Additional details
  specifications: {                                        // Technical specifications
    material: String,
    dimensions: {
      height: Number,
      width: Number,
      depth: Number,
      unit: { type: String, default: 'cm' }
    },
    weight: Number,
    condition: String,
    yearMade: String,
    origin: String
  },
  
  // Collectible-specific details
  manufacturer: { type: String },                          // Manufacturer name
  serialNumber: { type: String },                          // Serial number
  editionNumber: { type: String },                         // Edition number (e.g., #SN54-1887)
  
  // Shipping information
  shippingInfo: {
    estimatedDeliveryDays: { type: String, default: '5-7' },
    weight: Number,
    dimensions: {
      height: Number,
      width: Number,
      depth: Number
    },
    freeShippingThreshold: { type: Number, default: 500 }
  },
  
  // Rating and reviews
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  reviews: [{
    userName: String,
    userRating: Number,
    reviewTitle: String,
    reviewText: String,
    reviewDate: Date
  }],
  
  availability: { type: Boolean, default: true },          // If collectible is available
  authenticityCertificateUrl: { type: String },            // URL to authenticity certificate
  tags: [{ type: String }]                                 // Search tags and keywords
}, { timestamps: true });

export default mongoose.model('Collectible', collectibleSchema);