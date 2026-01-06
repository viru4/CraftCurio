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

  // Owner information
  owner: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Collector',
    required: false // Optional for backwards compatibility
  },

  // Order reference (for auction wins)
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },

  // Sale type: direct sale or auction
  saleType: { 
    type: String, 
    enum: ['direct', 'auction'], 
    default: 'direct',
    required: true 
  },

  // Auction-specific fields
  auction: {
    startTime: { type: Date },
    endTime: { type: Date },
    reservePrice: { type: Number, min: 0 }, // Minimum price to sell
    currentBid: { type: Number, min: 0, default: 0 },
    minimumBidIncrement: { type: Number, min: 1, default: 10 }, // Minimum amount to increase bid
    buyNowPrice: { type: Number, min: 0 }, // Optional buy-it-now price
    bidHistory: [{
      bidder: { type: mongoose.Schema.Types.ObjectId, ref: 'Collector', required: true },
      amount: { type: Number, required: true, min: 0 },
      timestamp: { type: Date, default: Date.now },
      bidderName: String, // Denormalized for quick display
      bidderEmail: String // For notifications
    }],
    winner: { type: mongoose.Schema.Types.ObjectId, ref: 'Collector' },
    winningBid: { type: Number, min: 0 },
    auctionStatus: { 
      type: String, 
      enum: ['scheduled', 'live', 'ended', 'cancelled', 'sold'], 
      default: 'scheduled' 
    },
    totalBids: { type: Number, default: 0, min: 0 },
    uniqueBidders: { type: Number, default: 0, min: 0 }
  },

  // Promotion/featured status
  promoted: { type: Boolean, default: false },
  promotionEndDate: { type: Date },

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
  stockQuantity: { type: Number, default: 0, min: 0 },    // Available stock units for direct sale items
  authenticityCertificateUrl: { type: String },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected', 'active', 'inactive', 'sold'], 
    default: 'pending' 
  },                                                        // Collectible approval status

  tags: [{ type: String }] // Indexed via schema.index() below
}, { timestamps: true });

// Virtual property to check if auction is active
collectibleSchema.virtual('isAuctionActive').get(function() {
  // Guard against missing auction object or wrong sale type
  if (this.saleType !== 'auction' || !this.auction) return false;
  
  // Additional safety checks for auction properties
  if (!this.auction.startTime || !this.auction.endTime || !this.auction.auctionStatus) {
    return false;
  }
  
  const now = new Date();
  return this.auction.auctionStatus === 'live' && 
         this.auction.startTime <= now && 
         this.auction.endTime > now;
});

// Virtual property to get time remaining in auction
collectibleSchema.virtual('timeRemaining').get(function() {
  // Guard against missing auction object
  if (this.saleType !== 'auction' || !this.auction) return 0;
  
  // Check if auction is active
  if (!this.isAuctionActive) return 0;
  
  // Safety check for endTime
  if (!this.auction.endTime) return 0;
  
  return Math.max(0, this.auction.endTime - new Date());
});

// Ensure virtuals are included in JSON output
collectibleSchema.set('toJSON', { virtuals: true });
collectibleSchema.set('toObject', { virtuals: true });

// Indexes for better query performance
// Note: id field already has unique: true which creates an index, so we don't need to index it again
collectibleSchema.index({ category: 1 });
collectibleSchema.index({ tags: 1 });
collectibleSchema.index({ featured: 1, popular: 1 });
collectibleSchema.index({ status: 1 });
collectibleSchema.index({ createdAt: -1 });
collectibleSchema.index({ title: 'text', description: 'text', tags: 'text' }); // Text search index (fixed: name -> title)
collectibleSchema.index({ saleType: 1 });
collectibleSchema.index({ owner: 1 });
collectibleSchema.index({ 'auction.auctionStatus': 1 });
collectibleSchema.index({ 'auction.endTime': 1 });
collectibleSchema.index({ promoted: 1 });

export default mongoose.model('Collectible', collectibleSchema);
