import mongoose from 'mongoose';

const collectibleSchema = new mongoose.Schema({
  id: { type: String, unique: true, sparse: true }, // Custom ID like "coll-001", "coll-002" (sparse allows existing docs without id)
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 }, // Changed to Number for proper numeric sorting/calculations
  category: { type: String, required: true }, // Indexed via schema.index() below
  image: { type: String, required: true },
  images: [{ type: String }], // Additional images array

  featured: { type: Boolean, default: false }, // Indexed via schema.index() below
  popular: { type: Boolean, default: false }, // Indexed via schema.index() below
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
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected', 'active', 'inactive'], 
    default: 'pending' 
  },                                                        // Collectible approval status

  tags: [{ type: String }] // Indexed via schema.index() below
}, { timestamps: true });

// Indexes for better query performance
// Note: id field already has unique: true which creates an index, so we don't need to index it again
collectibleSchema.index({ category: 1 });
collectibleSchema.index({ tags: 1 });
collectibleSchema.index({ featured: 1, popular: 1 });
collectibleSchema.index({ status: 1 });
collectibleSchema.index({ createdAt: -1 });
collectibleSchema.index({ title: 'text', description: 'text', tags: 'text' }); // Text search index (fixed: name -> title)

export default mongoose.model('Collectible', collectibleSchema);
