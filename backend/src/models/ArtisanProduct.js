import mongoose from 'mongoose';

const artisanProductSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },    // Unique product identifier (e.g., art1, art2)
  title: { type: String, required: true },                // Product name/title
  description: { type: String, required: true },          // Detailed product description
  category: { type: String, required: true },             // Product category (e.g., pottery, textiles)
  images: [{ type: String, required: true }],             // Array of image URLs
  price: { type: Number, required: true },                // Product price
  currency: { type: String, default: "INR" },             // Currency code, e.g., "INR", "USD"
  rating: {
    average: { type: Number, default: 0, min: 0, max: 5 },// Average customer rating (1-5)
    count: { type: Number, default: 0 }                   // Number of customer reviews
  },
  reviews: [{                                              // Detailed reviews
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: String,
    date: { type: Date, default: Date.now }
  }],
  artisanInfo: {                                          // Artisan snippet information
    id: { type: String },                               // Simple string ID for artisan
    name: { type: String },                              // Artisan name
    profilePhotoUrl: { type: String },                   // Artisan profile photo URL
    briefBio: { type: String },                          // Brief biography of the artisan
    verified: { type: Boolean, default: false }          // Seller verification status
  },
  craftMethod: { type: String },                           // Description of craft or technique
  provenance: { type: String },                            // Product origin or history info
  craftingStory: { type: String },                         // Artisan's story or background
  productStory: {                                          // Product story object
    storyText: { type: String },                          // Detailed product story text
    storyMediaUrls: [{ type: String }]                    // Array of media URLs (images/videos)
  },
  authenticityCertificateUrl: { type: String },            // URL to authenticity certificate
  availability: { type: Boolean, default: true },          // If product is in stock
  stockQuantity: { type: Number, default: 0, min: 0 },    // Available stock units
  shippingInfo: {
    weight: { type: Number },                             // Product weight in grams or unit
    dimensions: {                                         // Physical dimensions
      height: Number,
      width: Number,
      depth: Number
    },
    estimatedDeliveryDays: Number                         // Estimated delivery time in days
  },
  tags: [{ type: String }],                               // Search tags and keywords
  featured: { type: Boolean, default: false },            // Featured product flag
  popular: { type: Boolean, default: false },             // Popular product flag
  recent: { type: Boolean, default: false },              // Recent product flag
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected', 'active', 'inactive'], 
    default: 'pending' 
  },                                                        // Product approval status
  views: { type: Number, default: 0 },                    // View count
  likes: { type: Number, default: 0 }                     // Like count
}, { timestamps: true });

// Indexes for better query performance
// Note: id field already has unique: true which creates an index, so we don't need to index it again
artisanProductSchema.index({ category: 1 });
artisanProductSchema.index({ 'artisanInfo.id': 1 });
artisanProductSchema.index({ status: 1 });
artisanProductSchema.index({ featured: 1, popular: 1, recent: 1 });
artisanProductSchema.index({ createdAt: -1 });
artisanProductSchema.index({ views: -1, likes: -1 });
artisanProductSchema.index({ title: 'text', description: 'text', tags: 'text' }); // Text search index

export default mongoose.model('ArtisanProduct', artisanProductSchema);
